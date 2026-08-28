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

    // 3. PDPA: Search is scoped ONLY to customers who have a loyalty record at THIS store.
    //    We first check customer_loyalty for this store, then resolve email → user ID.
    //    This prevents cross-store customer email discovery.

    // 3a. Find matching users in auth who have a loyalty record at THIS store only.
    const { data: loyaltyRows } = await admin
      .from('customer_loyalty')
      .select('customer_id, total_stamps, updated_at')
      .eq('store_id', storeId)

    if (!loyaltyRows || loyaltyRows.length === 0) {
      return NextResponse.json({
        found: false,
        message: 'Tiada pelanggan berdaftar untuk kedai ini lagi.',
      })
    }

    // 3b. Resolve the customer_ids to emails, then filter by email query
    const customerIds = loyaltyRows.map((r) => r.customer_id)

    // Try customer_profiles first (fast path)
    const { data: profiles } = await admin
      .from('customer_profiles')
      .select('id, email, full_name')
      .in('id', customerIds)
      .ilike('email', `%${emailQuery}%`)
      .limit(5)

    let matchedProfile = profiles?.[0] || null
    let customerUserId = matchedProfile?.id
    let customerEmail = matchedProfile?.email || ''
    let customerName = matchedProfile?.full_name || ''

    // Fallback: resolve via auth.admin but ONLY for IDs in this store
    if (!customerUserId) {
      for (const cid of customerIds) {
        const { data: authUser } = await admin.auth.admin.getUserById(cid)
        if (authUser?.user?.email?.toLowerCase().includes(emailQuery)) {
          customerUserId = authUser.user.id
          customerEmail = authUser.user.email ?? ''
          customerName =
            authUser.user.user_metadata?.full_name ||
            authUser.user.user_metadata?.name ||
            customerEmail.split('@')[0]
          break
        }
      }
    }

    if (!customerUserId) {
      // Customer not found IN THIS STORE — do not reveal whether they exist elsewhere
      return NextResponse.json({
        found: false,
        message: 'Pelanggan dengan emel ini tidak dijumpai untuk kedai ini.',
      })
    }

    // 4. Get loyalty balance for the matched customer at this store
    const loyaltyRecord = loyaltyRows.find((r) => r.customer_id === customerUserId)
    const totalStamps = loyaltyRecord?.total_stamps || 0
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
