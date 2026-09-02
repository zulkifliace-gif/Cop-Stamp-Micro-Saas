import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeId = searchParams.get('storeId')?.trim()

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID diperlukan.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: store, error } = await admin
      .from('stores')
      .select('name, logo_url, reward_image_url, stamps_required, reward_description, stamp_icon, rewards, social_links, google_review_mode, google_review_url, google_place_id')
      .eq('id', storeId)
      .maybeSingle()

    if (error || !store) {
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
