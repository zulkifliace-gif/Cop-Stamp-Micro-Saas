import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processToyyibpayPayment } from '@/lib/toyyibpay'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { billCode, statusId, orderId } = body

    if (!billCode) {
      return NextResponse.json({ error: 'Bill code is required' }, { status: 400 })
    }

    const result = await processToyyibpayPayment({
      billCode: String(billCode).trim(),
      statusId: statusId ? String(statusId) : undefined,
      orderId: orderId ? String(orderId) : undefined,
    })

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[toyyibPay Verify Bill] Error:', err)
    return NextResponse.json(
      { error: err.message || 'Ralat mengesahkan pembayaran bil toyyibPay.' },
      { status: 500 }
    )
  }
}
