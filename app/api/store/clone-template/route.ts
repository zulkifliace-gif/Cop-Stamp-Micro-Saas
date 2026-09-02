import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const rawInput = searchParams.get('storeId')?.trim() || ''

    if (!rawInput) {
      return NextResponse.json({ error: 'Store ID diperlukan.' }, { status: 400 })
    }

    // Extract UUID if full URL or encoded string was passed
    const uuidMatch = rawInput.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)
    const cleanId = uuidMatch ? uuidMatch[0] : rawInput

    const admin = createAdminClient()
    let store: any = null

    // 1. If valid UUID, search by ID
    if (uuidMatch) {
      const { data: byId } = await admin
        .from('stores')
        .select('name, logo_url, reward_image_url, stamps_required, reward_description, stamp_icon, rewards, social_links, google_review_mode, google_review_url, google_place_id')
        .eq('id', cleanId)
        .maybeSingle()
      store = byId
    }

    // 2. Fallback: Search by slug or name if not found
    if (!store) {
      const { data: bySlugOrName } = await admin
        .from('stores')
        .select('name, logo_url, reward_image_url, stamps_required, reward_description, stamp_icon, rewards, social_links, google_review_mode, google_review_url, google_place_id')
        .or(`slug.eq."${cleanId}",name.eq."${cleanId}"`)
        .limit(1)
        .maybeSingle()
      store = bySlugOrName
    }

    if (!store) {
      return NextResponse.json({ error: 'Kedai rujukan tidak dijumpai.' }, { status: 404 })
    }

    return NextResponse.json({
      storeName: store.name || '',
      logoUrl: store.logo_url || '',
      stampIcon: store.stamp_icon || '/icons/stamps/makanan.svg',
      rewardImageUrl: store.reward_image_url || '',
      stampsRequired: store.stamps_required || 10,
      rewardDesc: store.reward_description || 'Ganjaran Percuma',
      rewards: Array.isArray(store.rewards) ? store.rewards : [],
      googleReviewMode: store.google_review_mode || 'manual',
      googleReviewUrl: store.google_review_url || null,
      googlePlaceId: store.google_place_id || null,
      socialLinks: Array.isArray(store.social_links) ? store.social_links : [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Ralat pelayan.' }, { status: 500 })
  }
}
