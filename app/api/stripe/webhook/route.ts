import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/setup'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: any
  const rawBody = await req.text()

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
    } else {
      event = JSON.parse(rawBody)
    }
  } catch (err: any) {
    console.error('[Stripe Webhook] Verification failed:', err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const admin = createAdminClient()

  // #2 Webhook Idempotency Enforcement (fixed): RESERVE the event_id atomically
  // BEFORE any processing, instead of checking-then-inserting-after. This closes
  // the race window where two concurrent deliveries of the same event.id could
  // both pass a "not exists" check before either had written its row.
  //
  // event_id is the primary key on stripe_webhook_events, so this insert is the
  // atomic compare-and-set: only one concurrent request can succeed. Whichever
  // fails with a unique-violation is the duplicate and exits immediately without
  // touching store data.
  const { error: reserveError } = await admin
    .from('stripe_webhook_events')
    .insert({
      event_id: event.id,
      event_type: event.type,
      store_id: null, // filled in later via update, once we know the store
    })

  if (reserveError) {
    // Postgres unique_violation = 23505. Any other error we log and still bail,
    // since without a reserved row we can't safely guarantee idempotency and
    // Stripe will retry the delivery anyway.
    if (reserveError.code === '23505') {
      console.log(`[Stripe Webhook] Duplicate event skipped (Idempotency): ${event.id}`)
      return NextResponse.json({ received: true, duplicate: true })
    }
    console.error('[Stripe Webhook] Failed to reserve event ID:', reserveError.message)
    return NextResponse.json({ error: 'Failed to reserve webhook event' }, { status: 500 })
  }

  let processedStoreId: string | null = null

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const storeId = session.metadata?.store_id
        const checkoutType = session.metadata?.type
        processedStoreId = storeId || null

        // A. Handle One-off Card Top-up
        if (checkoutType === 'card_topup') {
          const cardsCount = parseInt(session.metadata?.cards_count || '0', 10)
          console.log(`[Stripe Webhook] Card top-up completed for store: ${storeId}, cards: ${cardsCount}`)

          if (storeId && cardsCount > 0) {
            const { error: rpcErr } = await admin.rpc('add_purchased_card_quota', {
              p_store_id: storeId,
              p_count: cardsCount,
            })

            if (rpcErr) {
              console.warn('[Stripe Webhook] RPC add_purchased_card_quota error, fallback to direct update:', rpcErr.message)
              const { data: storeRow } = await admin
                .from('stores')
                .select('purchased_card_quota')
                .eq('id', storeId)
                .single()
              const currentQuota = storeRow?.purchased_card_quota || 0
              await admin
                .from('stores')
                .update({ purchased_card_quota: currentQuota + cardsCount })
                .eq('id', storeId)
            }
          }
          break
        }

        // B. Handle Pro Subscription Checkout
        const planType = session.metadata?.plan_type || 'monthly'
        console.log(`[Stripe Webhook] Subscription checkout completed for store: ${storeId}, plan: ${planType}`)

        if (storeId) {
          await admin
            .from('stores')
            .update({
              subscription_status: 'active',
              stripe_customer_id: session.customer || null,
              stripe_subscription_id: session.subscription || null,
              plan_type: 'pro',
            })
            .eq('id', storeId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object
        const storeId = sub.metadata?.store_id
        const status = sub.status
        processedStoreId = storeId || null

        let mappedStatus = 'active'
        if (status === 'past_due' || status === 'unpaid') mappedStatus = 'past_due'
        if (status === 'canceled') mappedStatus = 'cancelled'

        console.log(`[Stripe Webhook] Subscription updated for store: ${storeId}, status: ${status}`)

        if (storeId) {
          await admin
            .from('stores')
            .update({ subscription_status: mappedStatus, plan_type: mappedStatus === 'active' ? 'pro' : 'free' })
            .eq('id', storeId)
        } else if (sub.id) {
          await admin
            .from('stores')
            .update({ subscription_status: mappedStatus, plan_type: mappedStatus === 'active' ? 'pro' : 'free' })
            .eq('stripe_subscription_id', sub.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const storeId = sub.metadata?.store_id
        processedStoreId = storeId || null

        console.log(`[Stripe Webhook] Subscription cancelled for store: ${storeId}`)

        const query = storeId
          ? admin.from('stores').update({ subscription_status: 'cancelled', plan_type: 'free', stripe_subscription_id: null }).eq('id', storeId)
          : admin.from('stores').update({ subscription_status: 'cancelled', plan_type: 'free', stripe_subscription_id: null }).eq('stripe_subscription_id', sub.id)

        await query
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const subId = invoice.subscription
        if (subId) {
          await admin
            .from('stores')
            .update({ subscription_status: 'past_due' })
            .eq('stripe_subscription_id', subId)
        }
        break
      }

      default:
        console.log(`[Stripe Webhook] Ignored event: ${event.type}`)
    }

    // Backfill store_id on the reservation row now that we know it (best-effort;
    // the row already exists so this is just enrichment, not the idempotency gate).
    if (processedStoreId) {
      await admin
        .from('stripe_webhook_events')
        .update({ store_id: processedStoreId })
        .eq('event_id', event.id)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[Stripe Webhook Processing Error]:', err.message)
    // NOTE: the reservation row is already committed at this point, so a
    // retry of this same event.id from Stripe will be treated as a duplicate
    // and skipped rather than reprocessed. If you need Stripe to retry this
    // event's business logic on failure, delete the reservation row here
    // before returning the error — but that reopens the original race window,
    // so only do it if you also make the business logic itself idempotent.
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
