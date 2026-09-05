import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Sila log masuk terlebih dahulu.' }, { status: 401 })
    }

    const secretKey =
      process.env.TOYYIBPAY_SECRET_KEY || 'b3ymclys-1kx8-b0qg-kw9m-l1insgmnqqyu'
    const categoryCode =
      process.env.TOYYIBPAY_CATEGORY_CODE || 'cznw5lqw'
    const apiUrl = process.env.TOYYIBPAY_API_URL || 'https://toyyibpay.com'

    if (!secretKey || !categoryCode) {
      return NextResponse.json(
        { error: 'Konfigurasi toyyibPay belum lengkap pada pelayan.' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { plan, cardCount: rawCardCount, channel = 'fpx' } = body

    const admin = createAdminClient()

    // 1. Dapatkan kedai pengguna
    const { data: staff } = await admin
      .from('store_staff')
      .select('store_id, stores(name, plan_type, subscription_status)')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (!staff?.store_id) {
      return NextResponse.json({ error: 'Tiada kedai berdaftar untuk akaun ini.' }, { status: 404 })
    }

    const storeId = staff.store_id
    const storeName = (staff.stores as any)?.name || 'Kedai LajuS'

    // 2. Tentukan harga (dalam sen) dan butiran bil
    let amountInCents = 0
    let billName = ''
    let billDescription = ''
    let externalRef = ''

    if (plan === 'one_off_cards') {
      const count = parseInt(String(rawCardCount || 35), 10)
      if (isNaN(count) || count < 35) {
        return NextResponse.json(
          { error: 'Pembelian minimum adalah 35 kad cop digital.' },
          { status: 400 }
        )
      }
      amountInCents = count * 50 // RM0.50 per kad = 50 sen
      billName = `Topup ${count} Kad Cop`
      billDescription = `Pembelian ${count} kad cop digital untuk ${storeName}`
      externalRef = `LJ_CRD_${storeId}_${count}_${Date.now()}`
    } else if (plan === 'yearly') {
      amountInCents = 61600 // RM616.00
      billName = 'LajuS Pro Tahunan'
      billDescription = `Langganan Pelan Pro 1 Tahun untuk ${storeName}`
      externalRef = `LJ_SUB_${storeId}_yearly_${Date.now()}`
    } else if (plan === 'monthly') {
      amountInCents = 5300 // RM53.00
      billName = 'LajuS Pro Bulanan'
      billDescription = `Langganan Pelan Pro 1 Bulan untuk ${storeName}`
      externalRef = `LJ_SUB_${storeId}_monthly_${Date.now()}`
    } else {
      return NextResponse.json({ error: 'Pelan yang dipilih tidak sah.' }, { status: 400 })
    }

    // Pastikan had panjang nama & deskripsi mengikut syarat toyyibPay (max 30 chars for billName, 100 for desc)
    const cleanBillName = billName.slice(0, 30)
    const cleanBillDesc = billDescription.slice(0, 100)

    // 3. Tentukan Return URL dan Callback Webhook URL
    const origin =
      req.nextUrl?.origin ||
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://lajus.lajuq.my'
    const returnUrl = `${origin}/dashboard/billing?payment=toyyibpay`
    const callbackUrl = `${origin}/api/toyyibpay/callback`

    // Channel: '1' untuk FPX sahaja, '0' untuk semua saluran termasuk DuitNow QR
    const paymentChannel = channel === 'fpx' ? '1' : '0'

    const customerName = user.user_metadata?.full_name || user.user_metadata?.name || storeName || 'Peniaga LajuS'
    const customerEmail = user.email || 'customer@lajus.my'
    const customerPhone = user.user_metadata?.phone || '0111234567'

    const formParams = new URLSearchParams()
    formParams.append('userSecretKey', secretKey)
    formParams.append('categoryCode', categoryCode)
    formParams.append('billName', cleanBillName)
    formParams.append('billDescription', cleanBillDesc)
    formParams.append('billPriceSetting', '1')
    formParams.append('billPayorInfo', '1')
    formParams.append('billAmount', String(amountInCents))
    formParams.append('billReturnUrl', returnUrl)
    formParams.append('billCallbackUrl', callbackUrl)
    formParams.append('billExternalReferenceNo', externalRef)
    formParams.append('billTo', customerName)
    formParams.append('billEmail', customerEmail)
    formParams.append('billPhone', customerPhone)
    formParams.append('billPaymentChannel', paymentChannel)

    const toyyibRes = await fetch(`${apiUrl}/index.php/api/createBill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formParams.toString(),
    })

    const rawResponse = await toyyibRes.text()
    let parsed: any

    try {
      parsed = JSON.parse(rawResponse.trim())
    } catch (_err) {
      console.error('Failed to parse toyyibPay response:', rawResponse)
      return NextResponse.json(
        { error: 'Ralat menyambung ke toyyibPay. Sila cuba lagi.' },
        { status: 502 }
      )
    }

    if (Array.isArray(parsed) && parsed[0]?.BillCode) {
      const billCode = parsed[0].BillCode
      return NextResponse.json({
        success: true,
        billCode,
        url: `${apiUrl}/${billCode}`,
        referenceNo: externalRef,
      })
    }

    const errorMsg =
      (Array.isArray(parsed) && parsed[0]?.msg) ||
      parsed?.msg ||
      'Gagal menjana bil pembayaran toyyibPay.'

    return NextResponse.json({ error: errorMsg }, { status: 400 })
  } catch (err: any) {
    console.error('Error in toyyibPay createBill route:', err)
    return NextResponse.json(
      { error: err.message || 'Ralat pelayan memproses pembayaran.' },
      { status: 500 }
    )
  }
}
