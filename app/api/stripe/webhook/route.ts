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

  // #2 Webhook Idempotency Enforcement: Check if this event was already processed
  try {
    const { data: existingEvent } = await admin
      .from('stripe_webhook_events')
      .select('event_id')
      .eq('event_id', event.id)
      .maybeSingle()

    if (existingEvent) {
      console.log(`[Stripe Webhook] Duplicate event skipped (Idempotency): ${event.id}`)
      return NextResponse.json({ received: true, duplicate: true })
    }
  } catch (idempErr: any) {
    console.warn('[Stripe Webhook] Idempotency check warning:', idempErr.message)
  }

  let processedStoreId: string | null = null

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const storeId = session.metadata?.store_id
        const planType = session.metadata?.plan_type || 'monthly'
        processedStoreId = storeId || null

        console.log(`[Stripe Webhook] Checkout completed for store: ${storeId}, plan: ${planType}`)

        if (storeId) {
          await admin
            .from('stores')
            .update({
              subscription_status: 'active',
              stripe_customer_id: session.customer || null,
              stripe_subscription_id: session.subscription || null,
              plan_type: planType === 'yearly' ? 'pro' : 'pro',
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
            .update({ subscription_status: mappedStatus })
            .eq('id', storeId)
        } else if (sub.id) {
          await admin
            .from('stores')
            .update({ subscription_status: mappedStatus })
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

    // Record processed event into idempotency table
    try {
      await admin.from('stripe_webhook_events').insert({
        event_id: event.id,
        event_type: event.type,
        store_id: processedStoreId,
      })
    } catch (insertErr: any) {
      console.warn('[Stripe Webhook] Failed to record event ID in idempotency log:', insertErr.message)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[Stripe Webhook Processing Error]:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
