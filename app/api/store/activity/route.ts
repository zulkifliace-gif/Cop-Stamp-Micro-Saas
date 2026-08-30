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
        { error: 'Sila log masuk untuk melihat aktiviti kedai.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '10', 10)))
    const reqStoreId = searchParams.get('storeId')

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
          activities: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasMore: false },
          stats: { totalCustomers: 0, totalStampsGiven: 0, totalTokensClaimed: 0, totalRedemptions: 0, totalTokensIssued: 0 },
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
        return NextResponse.json({ error: 'Akses dinafikan untuk kedai ini.' }, { status: 403 })
      }
    }

    // 2. Compute Store Overview Stats
    // A. Total distinct customers — kira dari stamp_tokens (claimed_by) supaya
    //    merangkumi semua pelanggan termasuk yang claim tanpa log masuk.
    //    customer_loyalty hanya ada row untuk pelanggan yang log masuk.
    const { data: claimedByRows } = await admin
      .from('stamp_tokens')
      .select('claimed_by')
      .eq('store_id', storeId)
      .eq('status', 'claimed')
      .not('claimed_by', 'is', null)

    const uniqueCustomers = new Set((claimedByRows || []).map((r) => r.claimed_by))
    const customerCount = uniqueCustomers.size

    // B. Total stamps in circulation (from customer_loyalty)
    const { data: loyaltyRows } = await admin
      .from('customer_loyalty')
      .select('total_stamps')
      .eq('store_id', storeId)

    const totalStampsInCirculation = (loyaltyRows || []).reduce(
      (acc, r) => acc + (r.total_stamps || 0),
      0
    )

    // C. Total tokens generated
    const { count: totalTokensIssued } = await admin
      .from('stamp_tokens')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', storeId)

    // D. Total tokens claimed
    const { count: totalTokensClaimed } = await admin
      .from('stamp_tokens')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('status', 'claimed')

    // E. Total rewards redeemed (with fallback if stamp_redemptions table doesn't exist)
    let totalRedemptions = 0
    try {
      const { count: redemptionCount, error: redemptionError } = await admin
        .from('stamp_redemptions')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId)
      if (!redemptionError) {
        totalRedemptions = redemptionCount || 0
      }
    } catch (_e) {
      // stamp_redemptions table may not exist yet — treat as 0
    }

    // 3. Fetch Paginated Activity Logs (Tokens + Redemptions)
    const offset = (page - 1) * limit

    // Get total token logs count for pagination
    const { count: totalLogsCount } = await admin
      .from('stamp_tokens')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', storeId)

    const total = totalLogsCount || 0
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    // Fetch this page's tokens
    let tokens: any[] | null = null
    let { data: rawTokens, error: tokenError } = await admin
      .from('stamp_tokens')
      .select('id, token, stamp_count, status, delivery_method, recipient_email, created_at, expires_at, claimed_at')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    tokens = rawTokens

    if (tokenError && (tokenError.message.includes('delivery_method') || tokenError.message.includes('recipient_email'))) {
      const fallback = await admin
        .from('stamp_tokens')
        .select('id, token, stamp_count, status, created_at, expires_at, claimed_at')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
      tokens = fallback.data
      tokenError = fallback.error
    }

    if (tokenError) {
      console.error('Error fetching activity:', tokenError)
      return NextResponse.json({ error: 'Gagal memuatkan aktiviti.' }, { status: 500 })
    }

    const activities = (tokens || []).map((t) => {
      const cleanToken = t.token || ''
      const lastFour = cleanToken.replace(/-/g, '').slice(-4)
      const dateObj = new Date(t.created_at)

      // Formatted date & time (e.g. 28/08/2026, 02:15:30 PM)
      const formattedDate = dateObj.toLocaleDateString('ms-MY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      const formattedTime = dateObj.toLocaleTimeString('ms-MY', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })

      return {
        id: t.id,
        type: 'token_generated' as const,
        maskedToken: `•••${lastFour}`,
        stampCount: t.stamp_count,
        status: t.status,
        deliveryMethod: t.delivery_method,
        recipientEmail: t.recipient_email || null,
        createdAt: t.created_at,
        expiresAt: t.expires_at,
        claimedAt: t.claimed_at,
        formattedDate,
        formattedTime,
        fullTimestamp: `${formattedDate}, ${formattedTime}`,
      }
    })

    return NextResponse.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
      stats: {
        totalCustomers: customerCount || 0,
        totalStampsGiven: totalStampsInCirculation,
        totalTokensClaimed: totalTokensClaimed || 0,
        totalRedemptions: totalRedemptions || 0,
        totalTokensIssued: totalTokensIssued || 0,
      },
    })
  } catch (err: unknown) {
    console.error('Error in store activity API:', err)
    const message = err instanceof Error ? err.message : 'Ralat dalaman server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
