import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

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

    // 2. Proactively update past pending tokens to 'expired' in database
    const nowIso = new Date().toISOString()
    try {
      await admin
        .from('stamp_tokens')
        .update({ status: 'expired' })
        .eq('store_id', storeId)
        .eq('status', 'pending')
        .lt('expires_at', nowIso)
    } catch (_e) {
      // ignore update error if any
    }

    // 3. Compute Store Overview Stats
    // A. Total distinct customers from customer_loyalty
    const { count: customerLoyaltyCount } = await admin
      .from('customer_loyalty')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', storeId)

    const customerCount = customerLoyaltyCount || 0

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

    // E. Total rewards redeemed from stamp_redemptions
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
      totalRedemptions = 0
    }

    // 4. Handle Full Export if Requested
    const isExport = searchParams.get('export') === 'true'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (isExport) {
      let exportQuery = admin
        .from('stamp_tokens')
        .select('id, token, stamp_count, status, delivery_method, recipient_email, created_at, expires_at, claimed_at')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(3000)

      let exportRedemptionQuery = admin
        .from('stamp_redemptions')
        .select('id, customer_email, stamps_used, reward_details, created_at')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(2000)

      if (startDate) {
        exportQuery = exportQuery.gte('created_at', startDate)
        exportRedemptionQuery = exportRedemptionQuery.gte('created_at', startDate)
      }
      if (endDate) {
        exportQuery = exportQuery.lte('created_at', endDate)
        exportRedemptionQuery = exportRedemptionQuery.lte('created_at', endDate)
      }

      const [{ data: rawExportTokens, error: exportError }, { data: rawExportRedemptions }] =
        await Promise.all([exportQuery, exportRedemptionQuery])

      if (exportError) {
        return NextResponse.json({ error: 'Gagal memuat turun log aktiviti.' }, { status: 500 })
      }

      const exportTokens = (rawExportTokens || []).map((t) => {
        const cleanToken = t.token || ''
        const dateObj = new Date(t.created_at)
        const isPastExpiry =
          t.status === 'pending' &&
          t.expires_at &&
          new Date(t.expires_at).getTime() < Date.now()
        const resolvedStatus = isPastExpiry ? 'expired' : t.status

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
          type: 'token_generated',
          activityType: 'Cop Stamp',
          token: cleanToken,
          stampCount: t.stamp_count,
          status: resolvedStatus,
          deliveryMethod: t.delivery_method || 'qr',
          recipientEmail: t.recipient_email || '-',
          rewardName: '-',
          createdAt: t.created_at,
          expiresAt: t.expires_at,
          claimedAt: t.claimed_at || '-',
          formattedDate,
          formattedTime,
          fullTimestamp: `${formattedDate}, ${formattedTime}`,
        }
      })

      const exportRedemptions = (rawExportRedemptions || []).map((r) => {
        const dateObj = new Date(r.created_at)
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
          id: r.id,
          type: 'reward_redeemed',
          activityType: 'Penebusan Ganjaran',
          token: 'TEBUS',
          stampCount: r.stamps_used,
          status: 'claimed',
          deliveryMethod: 'kaunter',
          recipientEmail: r.customer_email || '-',
          rewardName: r.reward_details || 'Ganjaran Percuma',
          createdAt: r.created_at,
          expiresAt: r.created_at,
          claimedAt: r.created_at,
          formattedDate,
          formattedTime,
          fullTimestamp: `${formattedDate}, ${formattedTime}`,
        }
      })

      const allExportActivities = [...exportTokens, ...exportRedemptions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      return NextResponse.json({
        exportActivities: allExportActivities,
        total: allExportActivities.length,
      })
    }

    // 5. Fetch Paginated Activity Logs (Tokens + Redemptions Combined)
    const { count: totalTokensCount } = await admin
      .from('stamp_tokens')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', storeId)

    const totalLogsCount = (totalTokensCount || 0) + (totalRedemptions || 0)
    const total = totalLogsCount
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const hasMore = page < totalPages

    // Fetch latest items from both tables up to required page depth
    const fetchLimit = Math.min(200, page * limit + limit)

    let rawTokens: any[] | null = null
    let tokenError: any = null

    const tokenRes = await admin
      .from('stamp_tokens')
      .select('id, token, stamp_count, status, delivery_method, recipient_email, created_at, expires_at, claimed_at')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(fetchLimit)

    rawTokens = tokenRes.data
    tokenError = tokenRes.error

    if (tokenError && (tokenError.message?.includes('delivery_method') || tokenError.message?.includes('recipient_email'))) {
      const fallback = await admin
        .from('stamp_tokens')
        .select('id, token, stamp_count, status, created_at, expires_at, claimed_at')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(fetchLimit)
      rawTokens = fallback.data
      tokenError = fallback.error
    }

    if (tokenError) {
      console.error('Error fetching activity tokens:', tokenError)
    }

    // Fetch redemptions from stamp_redemptions
    let rawRedemptions: any[] = []
    try {
      const { data: redemptionsData, error: redemptionsError } = await admin
        .from('stamp_redemptions')
        .select('id, customer_email, stamps_used, reward_details, created_at')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(fetchLimit)

      if (!redemptionsError && redemptionsData) {
        rawRedemptions = redemptionsData
      }
    } catch (_e) {
      rawRedemptions = []
    }

    // Map tokens to ActivityItem format
    const tokenActivities = (rawTokens || []).map((t) => {
      const cleanToken = t.token || ''
      const lastFour = cleanToken.replace(/-/g, '').slice(-4)
      const dateObj = new Date(t.created_at)
      const isPastExpiry =
        t.status === 'pending' &&
        t.expires_at &&
        new Date(t.expires_at).getTime() < Date.now()
      const resolvedStatus = isPastExpiry ? 'expired' : t.status

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
        status: resolvedStatus,
        deliveryMethod: t.delivery_method || 'qr',
        recipientEmail: t.recipient_email || null,
        rewardName: null,
        createdAt: t.created_at,
        expiresAt: t.expires_at,
        claimedAt: t.claimed_at,
        formattedDate,
        formattedTime,
        fullTimestamp: `${formattedDate}, ${formattedTime}`,
      }
    })

    // Map redemptions to ActivityItem format
    const redemptionActivities = (rawRedemptions || []).map((r) => {
      const dateObj = new Date(r.created_at)
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
        id: r.id,
        type: 'reward_redeemed' as const,
        maskedToken: 'TEBUS',
        stampCount: r.stamps_used,
        status: 'claimed' as const,
        deliveryMethod: 'qr' as const,
        recipientEmail: r.customer_email || null,
        rewardName: r.reward_details || 'Ganjaran Percuma',
        createdAt: r.created_at,
        expiresAt: r.created_at,
        claimedAt: r.created_at,
        formattedDate,
        formattedTime,
        fullTimestamp: `${formattedDate}, ${formattedTime}`,
      }
    })

    // Merge and sort combined list by createdAt descending
    const combinedActivities = [...tokenActivities, ...redemptionActivities].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Slice for current page
    const offset = (page - 1) * limit
    const pageActivities = combinedActivities.slice(offset, offset + limit)

    return NextResponse.json({
      activities: pageActivities,
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
