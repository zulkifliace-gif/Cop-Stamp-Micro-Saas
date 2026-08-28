import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Sila log masuk sebagai staf.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const emailQuery = searchParams.get('email')?.trim().toLowerCase()
    const reqStoreId = searchParams.get('storeId')

    if (!emailQuery) {
      return NextResponse.json({ error: 'Sila masukkan emel pelanggan.' }, { status: 400 })
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

    // 2. Get store settings (stamps_required & reward_description)
    const { data: store } = await admin
      .from('stores')
      .select('id, name, stamps_required, reward_description')
      .eq('id', storeId)
      .single()

    const stampsRequired = store?.stamps_required || 10
    const rewardDescription = store?.reward_description || '1 minuman percuma'

    // 3. Find customer by email in customer_profiles
    let { data: profile } = await admin
      .from('customer_profiles')
      .select('id, email, full_name')
      .ilike('email', `%${emailQuery}%`)
      .limit(1)
      .maybeSingle()

    // Fallback: If not in customer_profiles, search via auth.admin.listUsers
    let customerUserId = profile?.id
    let customerEmail = profile?.email || emailQuery
    let customerName = profile?.full_name || ''

    if (!customerUserId) {
      const { data: userList } = await admin.auth.admin.listUsers({ perPage: 50 })
      const matchedUser = userList?.users?.find(
        (u) => u.email?.toLowerCase().includes(emailQuery)
      )
      if (matchedUser) {
        customerUserId = matchedUser.id
        customerEmail = matchedUser.email || emailQuery
        customerName =
          matchedUser.user_metadata?.full_name ||
          matchedUser.user_metadata?.name ||
          customerEmail.split('@')[0]
      }
    }

    if (!customerUserId) {
      return NextResponse.json({
        found: false,
        message: 'Pelanggan dengan emel ini tidak dijumpai dalam sistem.',
      })
    }

    // 4. Fetch customer loyalty balance in this store
    const { data: loyalty } = await admin
      .from('customer_loyalty')
      .select('total_stamps, updated_at')
      .eq('customer_id', customerUserId)
      .eq('store_id', storeId)
      .maybeSingle()

    const totalStamps = loyalty?.total_stamps || 0
    const fullCardsCount = Math.floor(totalStamps / stampsRequired)
    const currentCardStamps = totalStamps % stampsRequired
    const isEligibleForReward = totalStamps >= stampsRequired

    // 5. Fetch recent redemptions
    const { data: redemptions } = await admin
      .from('stamp_redemptions')
      .select('id, stamps_used, reward_details, created_at')
      .eq('customer_id', customerUserId)
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      found: true,
      customer: {
        id: customerUserId,
        email: customerEmail,
        name: customerName,
        totalStamps,
        stampsRequired,
        rewardDescription,
        fullCardsCount,
        currentCardStamps,
        isEligibleForReward,
        recentRedemptions: redemptions || [],
      },
    })
  } catch (err: unknown) {
    console.error('Error searching customer:', err)
    const message = err instanceof Error ? err.message : 'Ralat dalaman server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
