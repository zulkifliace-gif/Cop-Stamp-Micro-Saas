import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
          : 400
      return NextResponse.json(
        { error: errorMsg, code: rpcResult?.error },
        { status }
      )
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
    })
  } catch (err: unknown) {
    console.error('Error claiming token:', err)
    const message = err instanceof Error ? err.message : 'Ralat pelayan dalaman.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
