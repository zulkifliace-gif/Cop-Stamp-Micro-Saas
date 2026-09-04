import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email || 'pelanggan@...'
  const [local, domain] = email.split('@')
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`
  }
  const visible = Math.min(3, Math.floor(local.length / 2))
  return `${local.slice(0, visible)}***@${domain}`
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sila log masuk untuk melihat senarai pelanggan.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const reqStoreId = searchParams.get('storeId')
    const query = searchParams.get('q')?.trim().toLowerCase() || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)))
    const offset = (page - 1) * limit

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
        return NextResponse.json({
          customers: [],
          pagination: { page: 1, limit, total: 0, totalPages: 0, hasMore: false },
          totalCustomers: 0,
          stampsRequired: 10,
          rewardDescription: '',
        })
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
        return NextResponse.json(
          { error: 'Akses dinafikan untuk kedai ini.' },
          { status: 403 }
        )
      }
    }

    // 2. Get store settings
    const { data: store } = await admin
      .from('stores')
      .select('id, name, stamps_required, reward_description')
      .eq('id', storeId)
      .single()

    const stampsRequired = store?.stamps_required || 10
    const rewardDescription = store?.reward_description || 'Ganjaran'

    let loyaltyRows: Array<{ customer_id: string; total_stamps: number; updated_at: string }> = []
    let totalCustomers = 0

    // 3. Query with or without search filter
    if (query) {
      // Find matching profiles first
      const { data: matchedProfiles } = await admin
        .from('customer_profiles')
        .select('id')
        .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(200)

      const matchedIds = (matchedProfiles || []).map((p) => p.id)

      if (matchedIds.length > 0) {
        // Count total matching in this store
        const { count: matchingCount } = await admin
          .from('customer_loyalty')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', storeId)
          .in('customer_id', matchedIds)

        totalCustomers = matchingCount || 0

        // Fetch paginated rows sorted highest stamps to lowest
        const { data: rows, error: loyaltyError } = await admin
          .from('customer_loyalty')
          .select('customer_id, total_stamps, updated_at')
          .eq('store_id', storeId)
          .in('customer_id', matchedIds)
          .order('total_stamps', { ascending: false })
          .order('updated_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (loyaltyError) {
          return NextResponse.json(
            { error: 'Gagal mendapatkan data pelanggan.' },
            { status: 500 }
          )
        }
        loyaltyRows = rows || []
      } else {
        totalCustomers = 0
        loyaltyRows = []
      }
    } else {
      // Direct count of store customers
      const { count: storeCount } = await admin
        .from('customer_loyalty')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId)

      totalCustomers = storeCount || 0

      // Fetch paginated rows sorted highest stamps to lowest
      const { data: rows, error: loyaltyError } = await admin
        .from('customer_loyalty')
        .select('customer_id, total_stamps, updated_at')
        .eq('store_id', storeId)
        .order('total_stamps', { ascending: false })
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (loyaltyError) {
        return NextResponse.json(
          { error: 'Gagal mendapatkan data pelanggan.' },
          { status: 500 }
        )
      }
      loyaltyRows = rows || []
    }

    const totalPages = Math.ceil(totalCustomers / limit) || 1
    const hasMore = page < totalPages

    if (loyaltyRows.length === 0) {
      return NextResponse.json({
        customers: [],
        pagination: {
          page,
          limit,
          total: totalCustomers,
          totalPages,
          hasMore,
        },
        totalCustomers,
        stampsRequired,
        rewardDescription,
      })
    }

    const pageCustomerIds = loyaltyRows.map((r) => r.customer_id)

    // 4. Fetch profiles ONLY for the customer IDs on this specific page (max limit items)
    const { data: profiles } = await admin
      .from('customer_profiles')
      .select('id, email, full_name, avatar_url')
      .in('id', pageCustomerIds)

    const profileMap = new Map<string, { email: string; name: string; avatarUrl: string }>()
    if (profiles) {
      for (const p of profiles) {
        profileMap.set(p.id, {
          email: p.email || '',
          name: p.full_name || '',
          avatarUrl: p.avatar_url || '',
        })
      }
    }

    // Fast parallel fallback for any missing customer on current page (max ~20 items)
    const missingIds = pageCustomerIds.filter((id) => !profileMap.has(id) || !profileMap.get(id)?.email)
    if (missingIds.length > 0) {
      await Promise.allSettled(
        missingIds.map(async (cid) => {
          try {
            const { data: authUser } = await admin.auth.admin.getUserById(cid)
            if (authUser?.user) {
              const email = authUser.user.email || ''
              const name =
                authUser.user.user_metadata?.full_name ||
                authUser.user.user_metadata?.name ||
                email.split('@')[0]
              const avatarUrl = authUser.user.user_metadata?.avatar_url || ''

              profileMap.set(cid, { email, name, avatarUrl })

              if (email) {
                await admin.from('customer_profiles').upsert(
                  {
                    id: cid,
                    email,
                    full_name: name,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString(),
                  },
                  { onConflict: 'id' }
                )
              }
            }
          } catch {
            // ignore individual error
          }
        })
      )
    }

    // 5. Build structured customer list (already sorted highest stamps to lowest)
    const customers = loyaltyRows.map((r) => {
      const prof = profileMap.get(r.customer_id)
      const rawEmail = prof?.email || ''
      const name = prof?.name || rawEmail.split('@')[0] || 'Pelanggan'
      const totalStamps = r.total_stamps || 0
      const fullCards = Math.floor(totalStamps / stampsRequired)

      return {
        id: r.customer_id,
        email: rawEmail,
        maskedEmail: maskEmail(rawEmail),
        name,
        avatarUrl: prof?.avatarUrl || '',
        totalStamps,
        fullCards,
        updatedAt: r.updated_at,
      }
    })

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total: totalCustomers,
        totalPages,
        hasMore,
      },
      totalCustomers,
      stampsRequired,
      rewardDescription,
    })
  } catch (err: any) {
    console.error('Error in /api/store/customers:', err)
    return NextResponse.json(
      { error: err?.message || 'Ralat pelayan memuatkan senarai pelanggan.' },
      { status: 500 }
    )
  }
}
