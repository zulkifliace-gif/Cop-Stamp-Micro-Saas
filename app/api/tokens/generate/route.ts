import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendStampEmail } from '@/lib/email'
import { checkRateLimit } from '@/lib/rate-limit'
import crypto from 'crypto'

function generateSecureToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let part1 = ''
  let part2 = ''
  const bytes = crypto.randomBytes(8)
  for (let i = 0; i < 4; i++) {
    part1 += chars[bytes[i] % chars.length]
    part2 += chars[bytes[i + 4] % chars.length]
  }
  return `${part1}-${part2}`
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Sila log masuk sebagai kasir/staf.' },
        { status: 401 }
      )
    }

    // Rate limiting: 60 tokens per hour per staff (persistent DB limiter via RPC check_rate_limit)
    const rateCheck = await checkRateLimit(`gen:${user.id}`, 60, 3600)
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Had masa tercapai. Sila cuba lagi dalam sedikit masa.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const {
      storeId: reqStoreId,
      stampCount = 1,
      deliveryMethod = 'qr',
      customerEmail,
    } = body

    const count = Math.max(1, Math.min(20, Number(stampCount) || 1))

    const admin = createAdminClient()
    let storeId = reqStoreId

    // Pengesahan staf & kedai
    if (!storeId) {
      const { data: staffData } = await admin
        .from('store_staff')
        .select('store_id, role')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle()

      if (staffData?.store_id) {
        storeId = staffData.store_id
      } else {
        // Fallback: Semak jika user adalah owner_id dalam stores
        const { data: ownedStore } = await admin
          .from('stores')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1)
          .maybeSingle()

        if (ownedStore) {
          storeId = ownedStore.id
          await admin.from('store_staff').upsert({
            store_id: ownedStore.id,
            user_id: user.id,
            role: 'owner',
          })
        }
      }

      if (!storeId) {
        return NextResponse.json(
          {
            error:
              'Akaun anda belum didaftarkan sebagai staf/pemilik mana-mana kedai. Sila lengkapkan pendaftaran kedai dahulu.',
          },
          { status: 403 }
        )
      }
    } else {
      const { data: isStaff } = await admin
        .from('store_staff')
        .select('id')
        .eq('store_id', storeId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (!isStaff) {
        // Fallback: Semak jika user adalah owner_id kedai ini
        const { data: ownedStore } = await admin
          .from('stores')
          .select('id')
          .eq('id', storeId)
          .eq('owner_id', user.id)
          .maybeSingle()

        if (ownedStore) {
          await admin.from('store_staff').upsert({
            store_id: storeId,
            user_id: user.id,
            role: 'owner',
          })
        } else {
          return NextResponse.json(
            { error: 'Akses dinafikan untuk kedai ini.' },
            { status: 403 }
          )
        }
      }
    }

    // Dapatkan maklumat kedai
    const { data: store } = await admin
      .from('stores')
      .select('name')
      .eq('id', storeId)
      .maybeSingle()

    const storeName = store?.name || 'Kedai'

    // Jana token unik 8-aksara dan tamat tempoh 30 minit
    const tokenCode = generateSecureToken()
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString()

    const insertPayload: any = {
      token: tokenCode,
      store_id: storeId,
      stamp_count: count,
      status: 'pending',
      created_by: user.id,
      expires_at: expiresAt,
    }

    let { data: tokenRecord, error: insertError } = await admin
      .from('stamp_tokens')
      .insert({
        ...insertPayload,
        delivery_method: deliveryMethod,
        recipient_email: customerEmail || null,
      })
      .select()
      .maybeSingle()

    // Fallback: jika lajur delivery_method tiada dalam DB, retry tanpa lajur tersebut
    if (insertError && (insertError.message.includes('delivery_method') || insertError.message.includes('recipient_email'))) {
      const retry = await admin
        .from('stamp_tokens')
        .insert(insertPayload)
        .select()
        .maybeSingle()
      tokenRecord = retry.data
      insertError = retry.error
    }

    if (insertError || !tokenRecord) {
      console.error('Failed to create stamp token:', insertError)
      return NextResponse.json(
        { error: insertError?.message || 'Gagal menjana token cop.' },
        { status: 500 }
      )
    }

    // Bina pautan penebusan (claimUrl)
    const origin =
      req.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000'
    const claimUrl = `${origin}/claim/${tokenCode}`

    // Hantar emel jika mod emel dipilih
    if (deliveryMethod === 'email' && customerEmail) {
      await sendStampEmail(customerEmail, claimUrl, storeName, count)
    }

    return NextResponse.json({
      success: true,
      token: tokenCode,
      claimUrl,
      stampCount: count,
      expiresAt,
      storeName,
    })
  } catch (err: unknown) {
    console.error('Error generating token:', err)
    const message = err instanceof Error ? err.message : 'Ralat dalaman server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
