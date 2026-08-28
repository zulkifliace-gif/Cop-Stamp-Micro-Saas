import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe/setup'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const { data: staff } = await admin
      .from('store_staff')
      .select('store_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!staff?.store_id) {
      return NextResponse.json({ error: 'Tiada kedai berdaftar.' }, { status: 404 })
    }

    const { data: store } = await admin
      .from('stores')
      .select('stripe_customer_id')
      .eq('id', staff.store_id)
      .single()

    if (!store?.stripe_customer_id) {
      return NextResponse.json({ error: 'Tiada maklumat pelanggan Stripe untuk kedai ini.' }, { status: 404 })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: store.stripe_customer_id,
      return_url: `${appUrl}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err: any) {
    console.error('[Stripe Portal Error]:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
