import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Sila log masuk sebagai kasir.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { customerId, storeId: reqStoreId, rewardCount = 1 } = body

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID diperlukan.' }, { status: 400 })
    }

    const admin = createAdminClient()

    // 1. Verify staff membership & get storeId
    let storeId = reqStoreId
    if (!storeId) {
      const { data: staff, error: staffError } = await admin
        .from('store_staff')
        .select('store_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle()

      if (staffError || !staff) {
        return NextResponse.json({ error: 'Tiada kedai berdaftar untuk staf ini.' }, { status: 403 })
      }
      storeId = staff.store_id
    } else {
      const { data: isStaff } = await admin
        .from('store_staff')
        .select('id')
        .eq('store_id', storeId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (!isStaff) {
        return NextResponse.json({ error: 'Akses dinafikan untuk kedai ini.' }, { status: 403 })
      }
    }

    // 2. Get store settings
    const { data: store, error: storeError } = await admin
      .from('stores')
      .select('name, stamps_required, reward_description')
      .eq('id', storeId)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: 'Kedai tidak dijumpai.' }, { status: 404 })
    }

    const stampsRequired = store.stamps_required || 10
    const stampsNeeded = stampsRequired * Math.max(1, Number(rewardCount) || 1)

    // 3. Get customer loyalty balance
    const { data: loyalty, error: loyaltyError } = await admin
      .from('customer_loyalty')
      .select('total_stamps')
      .eq('customer_id', customerId)
      .eq('store_id', storeId)
      .single()

    if (loyaltyError || !loyalty) {
      return NextResponse.json(
        { error: 'Pelanggan belum mempunyai rekod cop di kedai ini.' },
        { status: 400 }
      )
    }

    if (loyalty.total_stamps < stampsNeeded) {
      return NextResponse.json(
        {
          error: `Cop tidak mencukupi untuk penebusan. Pelanggan mempunyai ${loyalty.total_stamps} cop (${stampsNeeded} diperlukan).`,
        },
        { status: 400 }
      )
    }

    // 4. Deduct stamps from customer loyalty
    const newTotalStamps = loyalty.total_stamps - stampsNeeded
    const { error: updateError } = await admin
      .from('customer_loyalty')
      .update({
        total_stamps: newTotalStamps,
      })
      .eq('customer_id', customerId)
      .eq('store_id', storeId)

    if (updateError) {
      console.error('Failed to update loyalty stamps:', updateError)
      return NextResponse.json({ error: 'Gagal mengemas kini baki cop.' }, { status: 500 })
    }

    // 5. Fetch customer email for logging
    const { data: profile } = await admin
      .from('customer_profiles')
      .select('email, full_name')
      .eq('id', customerId)
      .maybeSingle()

    // 6. Record redemption in stamp_redemptions
    // Actual schema: id, customer_id, store_id, stamps_used, redeemed_at, redeemed_by_staff
    const { error: redemptionError } = await admin
      .from('stamp_redemptions')
      .insert({
        customer_id: customerId,
        store_id: storeId,
        stamps_used: stampsNeeded,
        redeemed_by_staff: user.id,
      })

    if (redemptionError) {
      console.warn('Warning: Redemption record failed:', redemptionError)
    }

    return NextResponse.json({
      success: true,
      message: `Penebusan ganjaran berjaya! (${stampsNeeded} cop digunakan)`,
      previousStamps: loyalty.total_stamps,
      stampsUsed: stampsNeeded,
      remainingStamps: newTotalStamps,
      rewardDescription: store.reward_description,
      customerEmail: profile?.email || null,
      storeName: store.name,
      redeemedAt: new Date().toISOString(),
    })
  } catch (err: unknown) {
    console.error('Error in store redeem API:', err)
    const message = err instanceof Error ? err.message : 'Ralat dalaman server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
