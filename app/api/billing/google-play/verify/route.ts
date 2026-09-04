import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { orderId, purchaseToken, productId } = body

    if (!purchaseToken) {
      return NextResponse.json({ error: 'Maklumat pembelian Google Play tidak lengkap.' }, { status: 400 })
    }

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

    // ── CARD TOP-UP PRODUCTS (e.g. lajus_card_topup_35) ─────────────────────
    if (productId && productId.startsWith('lajus_card_topup')) {
      const match = productId.match(/\d+$/)
      const count = match ? parseInt(match[0], 10) : 35

      // Fetch current store quota
      const { data: storeData } = await admin
        .from('stores')
        .select('purchased_card_quota')
        .eq('id', storeId)
        .single()

      const currentQuota = storeData?.purchased_card_quota || 0
      const newQuota = currentQuota + count

      const { error: topupError } = await admin
        .from('stores')
        .update({
          purchased_card_quota: newQuota,
          updated_at: new Date().toISOString(),
        })
        .eq('id', storeId)

      if (topupError) {
        console.error('Error updating card quota:', topupError)
        return NextResponse.json({ error: 'Gagal menambah kuota kad.' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        type: 'card_topup',
        cardsAdded: count,
        newQuota,
        message: `Pembelian Google Play berjaya! +${count} kad telah ditambah ke kedai anda.`,
        orderId,
        productId,
      })
    }

    // ── PRO SUBSCRIPTION PLANS (Monthly / Yearly) ──────────────────────────
    const { error: updateError } = await admin
      .from('stores')
      .update({
        plan_type: 'pro',
        subscription_status: 'active',
      })
      .eq('id', storeId)

    if (updateError) {
      console.error('Error updating store plan:', updateError)
      return NextResponse.json({ error: 'Gagal mengaktifkan pelan Pro.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      type: 'subscription',
      message: 'Langganan Google Play berjaya disahkan. Pelan Pro kini aktif!',
      planType: 'pro',
      orderId,
      productId,
    })
  } catch (err: any) {
    console.error('Google Play verify error:', err)
    return NextResponse.json({ error: err.message || 'Ralat pengesahan Google Play.' }, { status: 500 })
  }
}
