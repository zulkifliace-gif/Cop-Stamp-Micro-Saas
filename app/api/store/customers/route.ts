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

    // 3. Fetch loyalty rows for this store
    const { data: loyaltyRows, error: loyaltyError } = await admin
      .from('customer_loyalty')
      .select('customer_id, total_stamps, updated_at')
      .eq('store_id', storeId)
      .order('total_stamps', { ascending: false })

    if (loyaltyError) {
      return NextResponse.json(
        { error: 'Gagal mendapatkan data pelanggan.' },
        { status: 500 }
      )
    }

    if (!loyaltyRows || loyaltyRows.length === 0) {
      return NextResponse.json({
        customers: [],
        totalCustomers: 0,
        stampsRequired,
        rewardDescription,
      })
    }

    const customerIds = loyaltyRows.map((r) => r.customer_id)

    // 4. Fetch profiles for these customers
    const { data: profiles } = await admin
      .from('customer_profiles')
      .select('id, email, full_name, avatar_url')
      .in('id', customerIds)

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

    // Fallback for any customer not yet cached in customer_profiles
    const missingIds = customerIds.filter((id) => !profileMap.has(id) || !profileMap.get(id)?.email)
    if (missingIds.length > 0) {
      for (const cid of missingIds) {
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

            // Proactively cache to customer_profiles
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
          // ignore error per customer
        }
      }
    }

    // 5. Build structured customer list
    let customers = loyaltyRows.map((r) => {
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

    // Filter by search query if provided
    if (query) {
      customers = customers.filter(
        (c) =>
          c.email.toLowerCase().includes(query) ||
          c.maskedEmail.toLowerCase().includes(query) ||
          c.name.toLowerCase().includes(query)
      )
    }

    return NextResponse.json({
      customers,
      totalCustomers: loyaltyRows.length,
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
