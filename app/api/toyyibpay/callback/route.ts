import { NextRequest, NextResponse } from 'next/server'
import { processToyyibpayPayment } from '@/lib/toyyibpay'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    let billCode = ''
    let status = ''
    let orderId = ''

    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData()
      billCode = String(formData.get('billcode') || formData.get('billCode') || '')
      status = String(formData.get('status') || '')
      orderId = String(formData.get('order_id') || formData.get('billExternalReferenceNo') || '')
    } else {
      const body = await req.json().catch(() => ({}))
      billCode = String(body.billcode || body.billCode || '')
      status = String(body.status || '')
      orderId = String(body.order_id || body.billExternalReferenceNo || '')
    }

    console.log(`[toyyibPay Callback] Received callback for billCode: ${billCode}, status: ${status}, orderId: ${orderId}`)

    if (!billCode) {
      return new NextResponse('Bill code missing', { status: 400 })
    }

    if (status === '1') {
      const result = await processToyyibpayPayment({
        billCode,
        orderId,
        statusId: status,
      })

      console.log('[toyyibPay Callback] Process result:', result)
    }

    // toyyibPay expects OK or 200 response
    return new NextResponse('OK', { status: 200 })
  } catch (err: any) {
    console.error('[toyyibPay Callback] Error handling callback:', err)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
