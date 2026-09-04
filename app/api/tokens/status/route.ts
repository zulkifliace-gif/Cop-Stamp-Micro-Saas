import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')?.trim().toUpperCase()
    const storeId = searchParams.get('storeId')?.trim()

    if (!token) {
      return NextResponse.json({ error: 'Token diperlukan.' }, { status: 400 })
    }

    const admin = createAdminClient()
    let query = admin
      .from('stamp_tokens')
      .select('id, token, status, stamp_count, expires_at, claimed_at, claimed_by')
      .eq('token', token)

    if (storeId) {
      query = query.eq('store_id', storeId)
    }

    const { data: row, error } = await query.maybeSingle()

    if (error || !row) {
      return NextResponse.json({ error: 'Token tidak dijumpai.' }, { status: 404 })
    }

    // Auto mark expired if overdue and still pending
    const now = new Date()
    const isExpired = row.status === 'pending' && new Date(row.expires_at) < now

    if (isExpired) {
      await admin.from('stamp_tokens').update({ status: 'expired' }).eq('id', row.id)
    }

    return NextResponse.json({
      token: row.token,
      status: isExpired ? 'expired' : row.status,
      stampCount: row.stamp_count,
      expiresAt: row.expires_at,
      claimedAt: row.claimed_at,
      claimed: row.status === 'claimed',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Ralat pelayan.' }, { status: 500 })
  }
}
