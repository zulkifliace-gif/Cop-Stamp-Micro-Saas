import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sila log masuk untuk menebus cop.' },
        { status: 401 }
      )
    }

    // Ensure customer profile is in sync in customer_profiles table
    try {
      const admin = createAdminClient()
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'Pelanggan'
      const avatarUrl = user.user_metadata?.avatar_url || null

      await admin.from('customer_profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
    } catch (profileSyncErr) {
      console.warn('Silent fallback for customer profile sync:', profileSyncErr)
    }

    // Rate limiting: 30 percubaan claim setiap jam per user (persistent DB limiter)
    const rateCheck = await checkRateLimit(`claim:${user.id}`, 30, 3600)
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Terlalu banyak percubaan menebus. Sila tunggu sebentar.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { token } = body

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Token tidak lengkap atau tidak sah.' },
        { status: 400 }
      )
    }

    // Panggil fungsi RPC atomik di PostgreSQL
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'claim_stamp_token',
      {
        p_token: token.trim().toUpperCase(),
      }
    )

    if (rpcError) {
      console.error('RPC Error executing claim_stamp_token:', rpcError)
      return NextResponse.json(
        { error: rpcError.message || 'Gagal memproses penebusan cop.' },
        { status: 500 }
      )
    }

    if (!rpcResult || !rpcResult.success) {
      const errorMsg =
        rpcResult?.message || 'Token tidak sah atau telah digunakan.'
      const status =
        rpcResult?.error === 'not_found'
          ? 404
          : rpcResult?.error === 'expired'
          ? 410
          : rpcResult?.error === 'customer_limit_reached'
          ? 403
          : 400
      return NextResponse.json(
        { error: errorMsg, code: rpcResult?.error },
        { status }
      )
    }

    // Ambil status Google Review kedai untuk kembangkan pada response —
    // frontend guna ni untuk decide sama ada nak jadualkan popup review
    // (MOD 1) selepas animasi cop stamp selesai, atau langsung skip (MOD 2).
    let googleReviewUrl: string | null = null
    let googleReviewMode = 'manual'
    try {
      const admin = createAdminClient()
      const { data: reviewSettings } = await admin
        .from('stores')
        .select('google_review_url, google_review_mode')
        .eq('id', rpcResult.storeId)
        .maybeSingle()

      googleReviewUrl = reviewSettings?.google_review_url || null
      googleReviewMode = reviewSettings?.google_review_mode || 'manual'
    } catch (reviewLookupErr) {
      // Jangan gagalkan seluruh claim hanya sebab lookup review settings gagal
      console.warn('Failed to load google review settings for store:', reviewLookupErr)
    }

    return NextResponse.json({
      success: true,
      storeId: rpcResult.storeId,
      stampsAdded: rpcResult.stampsAdded,
      previousStamps: rpcResult.previousStamps,
      newTotal: rpcResult.newTotal,
      storeName: rpcResult.storeName,
      stampsRequired: rpcResult.stampsRequired,
      rewardDescription: rpcResult.rewardDescription,
      googleReviewUrl,
      googleReviewMode,
    })
  } catch (err: unknown) {
    console.error('Error claiming token:', err)
    const message = err instanceof Error ? err.message : 'Ralat pelayan dalaman.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
