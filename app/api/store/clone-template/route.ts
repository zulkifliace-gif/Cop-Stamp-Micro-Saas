import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// Memory cache fallback so it works immediately 100% of the time
const memoryTokenCache = new Map<string, { storeId: string; storeData: any; expiresAt: number }>()

function generateShortCode(): string {
  // Generate a clean 6-digit numeric PIN like 849201
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Sila log masuk terlebih dahulu.' }, { status: 401 })
    }

    const body = await req.json()
    const { action, storeId, code, currentSettings } = body
    const admin = createAdminClient()

    // ── ACTION 1: GENERATE SHORT 6-DIGIT CLONE CODE (Kedai A) ─────────────────
    if (action === 'generate') {
      let targetStoreId = storeId

      // If storeId is not provided, find from user's store
      if (!targetStoreId) {
        const { data: staff } = await admin
          .from('store_staff')
          .select('store_id')
          .eq('user_id', user.id)
          .maybeSingle()
        targetStoreId = staff?.store_id
      }

      if (!targetStoreId) {
        return NextResponse.json(
          { error: 'Sila simpan tetapan kedai anda terlebih dahulu.' },
          { status: 400 }
        )
      }

      // Fetch latest store data or use currentSettings if passed
      let storeDataToSave = currentSettings
      if (!storeDataToSave) {
        const { data: storeDb } = await admin
          .from('stores')
          .select('*')
          .eq('id', targetStoreId)
          .maybeSingle()
        storeDataToSave = storeDb
      }

      const shortCode = generateShortCode()
      const expiresAt = Date.now() + 2 * 60 * 60 * 1000 // 2 hours

      // Store in memory cache
      memoryTokenCache.set(shortCode, {
        storeId: targetStoreId,
        storeData: storeDataToSave,
        expiresAt,
      })

      // Also try to insert into DB table (silently continue if table doesn't exist yet)
      try {
        await admin.from('store_clone_tokens').insert({
          code: shortCode,
          store_id: targetStoreId,
          store_data: storeDataToSave || {},
          expires_at: new Date(expiresAt).toISOString(),
        })
      } catch (_e) {
        // memory cache is active
      }

      return NextResponse.json({
        success: true,
        code: shortCode,
        expiresAt: new Date(expiresAt).toISOString(),
      })
    }

    // ── ACTION 2: APPLY & SAVE SETTINGS DIRECTLY INTO STORE B (Kedai B) ───────
    if (action === 'apply') {
      const cloneCode = String(code || '').trim()

      if (!cloneCode) {
        return NextResponse.json({ error: 'Kod kebenaran atau pautan diperlukan.' }, { status: 400 })
      }

      // Extract 6-digit code or clean string
      const match6 = cloneCode.match(/\b\d{6}\b/)
      const cleanCode = match6 ? match6[0] : cloneCode

      // 1. Check memory cache first
      let sourceData: any = null
      let sourceStoreId: string | null = null

      const cached = memoryTokenCache.get(cleanCode)
      if (cached && cached.expiresAt > Date.now()) {
        sourceData = cached.storeData
        sourceStoreId = cached.storeId
      }

      // 2. Check DB table if not in memory
      if (!sourceData) {
        try {
          const { data: tokenRow } = await admin
            .from('store_clone_tokens')
            .select('*')
            .eq('code', cleanCode)
            .gte('expires_at', new Date().toISOString())
            .maybeSingle()

          if (tokenRow) {
            sourceData = tokenRow.store_data
            sourceStoreId = tokenRow.store_id
          }
        } catch (_e) {}
      }

      // 3. Fallback: If cleanCode is a UUID or store name, look up stores table directly
      if (!sourceData) {
        const uuidMatch = cleanCode.match(
          /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
        )
        const lookupId = uuidMatch ? uuidMatch[0] : cleanCode
        const { data: directStore } = await admin
          .from('stores')
          .select('*')
          .or(`id.eq."${lookupId}",name.eq."${lookupId}"`)
          .limit(1)
          .maybeSingle()
        if (directStore) {
          sourceData = directStore
          sourceStoreId = directStore.id
        }
      }

      if (!sourceData && !sourceStoreId) {
        return NextResponse.json(
          { error: 'Kod atau pautan tetapan tidak sah atau telah tamat tempoh.' },
          { status: 404 }
        )
      }

      // If sourceData is just storeId, fetch full record
      if (!sourceData || Object.keys(sourceData).length === 0) {
        const { data: fullStoreA } = await admin
          .from('stores')
          .select('*')
          .eq('id', sourceStoreId)
          .maybeSingle()
        sourceData = fullStoreA
      }

      // Find current user's store (Kedai B)
      const { data: staffB } = await admin
        .from('store_staff')
        .select('store_id, role')
        .eq('user_id', user.id)
        .maybeSingle()

      let storeBId = staffB?.store_id

      if (!storeBId) {
        const { data: ownedB } = await admin
          .from('stores')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle()
        storeBId = ownedB?.id
      }

      if (!storeBId) {
        return NextResponse.json(
          {
            error: 'Sila lengkapkan pendaftaran kedai anda sebelum menyalin tetapan.',
            needsRegistration: true,
          },
          { status: 400 }
        )
      }

      // Extract all nested fields correctly
      const storeNameA = (sourceData.name || sourceData.storeName || '').trim()

      let extractedRewards: any[] = []
      if (Array.isArray(sourceData.rewards)) {
        extractedRewards = sourceData.rewards
      } else if (Array.isArray(sourceData.rewards?.list)) {
        extractedRewards = sourceData.rewards.list
      } else if (Array.isArray(sourceData.rewardsList)) {
        extractedRewards = sourceData.rewardsList
      }

      let extractedStampIcon = '/icons/stamps/makanan.svg'
      if (typeof sourceData.stamp_icon === 'string' && sourceData.stamp_icon) {
        extractedStampIcon = sourceData.stamp_icon
      } else if (typeof sourceData.stampIcon === 'string' && sourceData.stampIcon) {
        extractedStampIcon = sourceData.stampIcon
      } else if (sourceData.rewards?.stampIcon) {
        extractedStampIcon = sourceData.rewards.stampIcon
      }

      let extractedSocialLinks: any[] = []
      if (Array.isArray(sourceData.social_links)) {
        extractedSocialLinks = sourceData.social_links
      } else if (Array.isArray(sourceData.socialLinks)) {
        extractedSocialLinks = sourceData.socialLinks
      } else if (Array.isArray(sourceData.rewards?.socialLinks)) {
        extractedSocialLinks = sourceData.rewards.socialLinks
      }

      let extractedLocations: any[] = []
      if (Array.isArray(sourceData.locations)) {
        extractedLocations = sourceData.locations
      } else if (Array.isArray(sourceData.rewards?.locations)) {
        extractedLocations = sourceData.rewards.locations
      }

      // DIRECTLY UPDATE KEDAI B in Supabase stores table with full schema compatibility!
      const updatePayload: Record<string, any> = {
        logo_url: sourceData.logo_url || sourceData.logoUrl || null,
        reward_image_url: sourceData.reward_image_url || sourceData.rewardImageUrl || null,
        stamps_required: Number(sourceData.stamps_required || sourceData.stampsRequired || 10),
        reward_description: (
          sourceData.reward_description ||
          sourceData.rewardDesc ||
          'Ganjaran Percuma'
        ).trim(),
        rewards: {
          list: extractedRewards,
          stampIcon: extractedStampIcon,
          socialLinks: extractedSocialLinks,
          locations: extractedLocations,
        },
        google_review_mode: sourceData.google_review_mode || sourceData.googleReviewMode || 'manual',
        google_review_url: sourceData.google_review_url || sourceData.googleReviewUrl || null,
        google_place_id: sourceData.google_place_id || sourceData.googlePlaceId || null,
        updated_at: new Date().toISOString(),
      }

      if (storeNameA) {
        updatePayload.name = storeNameA
      }

      const { error: updateErr } = await admin
        .from('stores')
        .update(updatePayload)
        .eq('id', storeBId)

      if (updateErr) {
        console.error('Failed to update store B:', updateErr)
        return NextResponse.json(
          { error: 'Gagal mengemas kini pangkalan data Kedai B.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Semua tetapan berjaya disalin dan disimpan terus ke Kedai B!',
        storeNameA: sourceData.name || sourceData.storeName || 'Kedai Rujukan',
        copiedSettings: updatePayload,
      })
    }

    return NextResponse.json({ error: 'Tindakan tidak sah.' }, { status: 400 })
  } catch (err: any) {
    console.error('Clone Template error:', err)
    return NextResponse.json({ error: err.message || 'Ralat pelayan.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code') || searchParams.get('storeId') || ''

    if (!code) {
      return NextResponse.json({ error: 'Kod diperlukan.' }, { status: 400 })
    }

    const cleanCode = code.trim()
    const cached = memoryTokenCache.get(cleanCode)
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({ success: true, storeData: cached.storeData })
    }

    const admin = createAdminClient()
    const { data: tokenRow } = await admin
      .from('store_clone_tokens')
      .select('*')
      .eq('code', cleanCode)
      .maybeSingle()

    if (tokenRow) {
      return NextResponse.json({ success: true, storeData: tokenRow.store_data })
    }

    return NextResponse.json({ error: 'Kod tidak dijumpai.' }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Ralat pelayan.' }, { status: 500 })
  }
}
