import { createAdminClient } from '@/lib/supabase/admin'

export interface ToyyibpayVerificationResult {
  success: boolean
  alreadyProcessed?: boolean
  type?: 'pro_subscription' | 'card_topup'
  plan?: 'monthly' | 'yearly'
  cardsAdded?: number
  storeId?: string
  message: string
  status?: string
}

/**
 * Memproses dan mengesahkan transaksi toyyibPay serta mengemas kini kuota / status langganan kedai.
 * Dilengkapi kawalan Idempotency untuk mengelakkan kredit berganda.
 */
export async function processToyyibpayPayment(params: {
  billCode: string
  orderId?: string
  statusId?: string
}): Promise<ToyyibpayVerificationResult> {
  const { billCode, orderId: orderIdParam, statusId } = params

  if (!billCode) {
    return { success: false, message: 'Kod bil toyyibPay tidak ditemui.' }
  }

  const admin = createAdminClient()
  const eventId = `toyyib_${billCode}`

  // 1. Semak sama ada transaksi ini sudah diproses sebelum ini (Idempotency Check)
  const { data: existingEvent } = await admin
    .from('stripe_webhook_events')
    .select('event_id, store_id')
    .eq('event_id', eventId)
    .maybeSingle()

  if (existingEvent) {
    return {
      success: true,
      alreadyProcessed: true,
      storeId: existingEvent.store_id,
      message: 'Transaksi ini telah diproses sebelum ini.',
    }
  }

  // 2. Semak status transaksi dengan toyyibPay API
  const apiUrl = process.env.TOYYIBPAY_API_URL || 'https://toyyibpay.com'
  let verifiedPayment = false
  let resolvedOrderId = orderIdParam || ''

  try {
    const form = new URLSearchParams()
    form.append('billCode', billCode)

    const checkRes = await fetch(`${apiUrl}/index.php/api/getBillTransactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })

    const rawText = await checkRes.text()
    const cleanText = rawText.trim()

    if (cleanText && cleanText.startsWith('[') && cleanText.endsWith(']')) {
      const transactions = JSON.parse(cleanText)
      if (Array.isArray(transactions) && transactions.length > 0) {
        const tx = transactions[0]
        if (String(tx.billpaymentStatus) === '1') {
          verifiedPayment = true
          if (tx.billExternalReferenceNo) {
            resolvedOrderId = tx.billExternalReferenceNo
          }
        }
      }
    }
  } catch (err) {
    console.warn('[toyyibPay] getBillTransactions check failed, checking fallback:', err)
  }

  // Jika getBillTransactions belum kemaskini (cth: return url sampai dulu), tetapi status_id=1 dihantar
  if (!verifiedPayment && statusId === '1') {
    verifiedPayment = true
  }

  if (!verifiedPayment) {
    return {
      success: false,
      status: statusId === '2' ? 'pending' : 'failed',
      message: statusId === '2' ? 'Pembayaran sedang diproses oleh bank.' : 'Pembayaran toyyibPay belum disahkan atau dibatalkan.',
    }
  }

  if (!resolvedOrderId) {
    return {
      success: false,
      message: 'Rujukan pesanan (order ID) tidak ditemui untuk bil ini.',
    }
  }

  // 3. Tafsirkan order_id
  // Format langganan: LJ_SUB_{storeId}_{plan}_{timestamp}
  // Format kad:       LJ_CRD_{storeId}_{count}_{timestamp}
  if (resolvedOrderId.startsWith('LJ_SUB_')) {
    const parts = resolvedOrderId.split('_')
    // parts = ['LJ', 'SUB', storeId, plan, timestamp]
    const storeId = parts[2]
    const plan = (parts[3] === 'yearly' ? 'yearly' : 'monthly') as 'monthly' | 'yearly'

    if (!storeId) {
      return { success: false, message: 'Store ID tidak sah di dalam rujukan bil.' }
    }

    // Dapatkan tarikh luput sedia ada
    const { data: store } = await admin
      .from('stores')
      .select('subscription_end_date')
      .eq('id', storeId)
      .single()

    const now = new Date()
    const currentEnd = store?.subscription_end_date ? new Date(store.subscription_end_date) : null
    const baseDate = currentEnd && currentEnd > now ? currentEnd : now

    // Tambah tempoh (30 hari untuk bulanan, 365 hari untuk tahunan)
    const daysToAdd = plan === 'yearly' ? 365 : 30
    const newEndDate = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString()

    const { error: updateErr } = await admin
      .from('stores')
      .update({
        plan_type: 'pro',
        subscription_status: 'active',
        subscription_end_date: newEndDate,
        updated_at: new Date().toISOString(),
      })
      .eq('id', storeId)

    if (updateErr) {
      console.error('[toyyibPay] Failed to update store subscription:', updateErr)
      return { success: false, message: 'Gagal mengemas kini status langganan kedai.' }
    }

    // Catat idempotency event
    await admin.from('stripe_webhook_events').insert({
      event_id: eventId,
      event_type: 'toyyibpay_subscription',
      store_id: storeId,
    })

    return {
      success: true,
      type: 'pro_subscription',
      plan,
      storeId,
      message: `🎉 Langganan Pelan Pro ${plan === 'yearly' ? 'Tahunan' : 'Bulanan'} toyyibPay berjaya diaktifkan!`,
    }
  } else if (resolvedOrderId.startsWith('LJ_CRD_')) {
    const parts = resolvedOrderId.split('_')
    // parts = ['LJ', 'CRD', storeId, count, timestamp]
    const storeId = parts[2]
    const cardsCount = parseInt(parts[3] || '35', 10)

    if (!storeId || isNaN(cardsCount) || cardsCount <= 0) {
      return { success: false, message: 'Maklumat kuota kad tidak sah di dalam rujukan bil.' }
    }

    // Dapatkan kuota semasa
    const { data: store } = await admin
      .from('stores')
      .select('purchased_card_quota')
      .eq('id', storeId)
      .single()

    const currentQuota = store?.purchased_card_quota || 0
    const newQuota = currentQuota + cardsCount

    const { error: updateErr } = await admin
      .from('stores')
      .update({
        purchased_card_quota: newQuota,
        updated_at: new Date().toISOString(),
      })
      .eq('id', storeId)

    if (updateErr) {
      console.error('[toyyibPay] Failed to update card quota:', updateErr)
      return { success: false, message: 'Gagal menambah kuota kad.' }
    }

    // Catat idempotency event
    await admin.from('stripe_webhook_events').insert({
      event_id: eventId,
      event_type: 'toyyibpay_card_topup',
      store_id: storeId,
    })

    return {
      success: true,
      type: 'card_topup',
      cardsAdded: cardsCount,
      storeId,
      message: `🎉 Pembelian berjaya! +${cardsCount} kad cop digital telah ditambah ke kedai anda.`,
    }
  }

  return {
    success: false,
    message: 'Format rujukan pesanan toyyibPay tidak dikenali.',
  }
}
