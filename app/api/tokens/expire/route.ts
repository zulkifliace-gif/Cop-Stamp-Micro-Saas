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
        { error: 'Sila log masuk terlebih dahulu.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { token, tokenId, storeId } = body

    if (!token && !tokenId) {
      return NextResponse.json(
        { error: 'Token atau Token ID diperlukan.' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    let query = admin
      .from('stamp_tokens')
      .update({ status: 'expired' })
      .eq('status', 'pending')

    if (token) {
      query = query.eq('token', token.trim().toUpperCase())
    } else if (tokenId) {
      query = query.eq('id', tokenId)
    }

    if (storeId) {
      query = query.eq('store_id', storeId)
    }

    const { data, error } = await query.select().maybeSingle()

    if (error) {
      console.error('Error expiring token:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Token telah ditandakan sebagai tamat tempoh.',
      token: data,
    })
  } catch (err: any) {
    console.error('Error in expire token endpoint:', err)
    return NextResponse.json(
      { error: err.message || 'Ralat dalaman server.' },
      { status: 500 }
    )
  }
}
