import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe, ensureStripeProducts } from '@/lib/stripe/setup'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { plan } = body // 'free' | 'monthly' | 'yearly'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const admin = createAdminClient()

    // Get the store linked to this user
    const { data: staff } = await admin
      .from('store_staff')
      .select('store_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!staff?.store_id) {
      return NextResponse.json({ error: 'Tiada kedai berdaftar untuk akaun ini.' }, { status: 404 })
    }

    const storeId = staff.store_id

    // ── FREE PLAN ──────────────────────────────────────────────────────────────
    if (plan === 'free') {
      await admin
        .from('stores')
        .update({ subscription_status: 'active', plan_type: 'free' })
        .eq('id', storeId)

      return NextResponse.json({ url: `${appUrl}/dashboard?subscription=free` })
    }

    // ── PAID PLANS ─────────────────────────────────────────────────────────────
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY not configured.' }, { status: 500 })
    }

    // Check for existing active subscription
    const { data: store } = await admin
      .from('stores')
      .select('stripe_customer_id, stripe_subscription_id, subscription_status')
      .eq('id', storeId)
      .single()

    if (store?.stripe_subscription_id && store?.subscription_status === 'active') {
      return NextResponse.json({
        error: 'Anda sudah mempunyai langganan aktif. Guna portal bil untuk menukar pelan.',
      }, { status: 400 })
    }

    const { monthlyPriceId, yearlyPriceId } = await ensureStripeProducts()
    const selectedPriceId = plan === 'yearly' ? yearlyPriceId : monthlyPriceId

    const sessionParams: any = {
      payment_method_types: ['card'],
      mode: 'subscription',
      allow_promotion_codes: true,
      line_items: [{ price: selectedPriceId, quantity: 1 }],
      metadata: { store_id: storeId, plan_type: plan },
      subscription_data: { metadata: { store_id: storeId } },
      success_url: `${appUrl}/dashboard?subscription=success&store_id=${storeId}`,
      cancel_url: `${appUrl}/dashboard?subscription=cancelled`,
    }

    if (user.email) {
      sessionParams.customer_email = user.email
    }
    if (store?.stripe_customer_id) {
      sessionParams.customer = store.stripe_customer_id
      delete sessionParams.customer_email
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[Stripe Checkout Error]:', err.message)
    return NextResponse.json({ error: err.message || 'Gagal mencipta sesi bayaran.' }, { status: 500 })
  }
}
