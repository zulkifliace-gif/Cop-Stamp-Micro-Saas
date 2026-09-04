import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resolveGoogleMapsLocation } from '@/lib/maps'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sila log masuk untuk menyemak kad cop anda.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const storeIdParam = searchParams.get('storeId')

    const admin = createAdminClient()

    // Ensure customer profile is in sync in customer_profiles table
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Pelanggan'
    const avatarUrl = user.user_metadata?.avatar_url || null

    await admin.from('customer_profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })

    // Query all loyalty records for this customer across all stores
    const { data: allLoyalties, error: loyaltyError } = await admin
      .from('customer_loyalty')
      .select(
        'store_id, total_stamps, updated_at, stores(id, name, stamps_required, reward_description, logo_url, reward_image_url, rewards, google_review_url, google_review_mode)'
      )
      .eq('customer_id', user.id)

    if (loyaltyError) {
      console.error('Error fetching customer loyalty:', loyaltyError)
      return NextResponse.json(
        { error: 'Gagal mendapatkan data baki cop.' },
        { status: 500 }
      )
    }

    const allStores = await Promise.all(
      (allLoyalties || []).map(async (item) => {
        const storeObj = Array.isArray(item.stores) ? item.stores[0] : item.stores
        const rawRewards = storeObj?.rewards
        const parsedRewards = Array.isArray(rawRewards)
          ? rawRewards
          : Array.isArray(rawRewards?.list)
          ? rawRewards.list
          : []
        const parsedStampIcon =
          (typeof rawRewards === 'object' && !Array.isArray(rawRewards) && rawRewards?.stampIcon) ||
          '/icons/stamps/makanan.svg'
        const parsedSocialLinks =
          (typeof rawRewards === 'object' && !Array.isArray(rawRewards) && Array.isArray(rawRewards?.socialLinks) && rawRewards.socialLinks) ||
          []
        const rawLocations =
          (typeof rawRewards === 'object' && !Array.isArray(rawRewards) && Array.isArray(rawRewards?.locations) && rawRewards.locations) ||
          (Array.isArray((storeObj as any)?.locations) && (storeObj as any).locations) ||
          []

        const parsedLocations = await Promise.all(
          rawLocations.map(async (loc: any) => {
            if (!loc.url) return loc
            try {
              const res = await resolveGoogleMapsLocation(loc.url, loc.address || loc.name)
              return {
                ...loc,
                coordinates: res.coordinates || loc.coordinates,
                embedUrl: res.embedUrl || loc.embedUrl,
                embedQuery: res.placeName || loc.embedQuery,
                address: loc.address || res.placeName || '',
              }
            } catch {
              return loc
            }
          })
        )

        // google_review_url akan NULL secara automatik kalau kedai guna MOD 2 (manual)
        // — jadi frontend cuma perlu semak "if (googleReviewUrl)" untuk decide popup.
        return {
          storeId: item.store_id,
          storeName: storeObj?.name || 'Kedai Tanpa Nama',
          totalStamps: item.total_stamps || 0,
          stampsRequired: storeObj?.stamps_required || 10,
          rewardDescription: storeObj?.reward_description || '1 minuman percuma',
          logoUrl: storeObj?.logo_url || '',
          rewardImageUrl: storeObj?.reward_image_url || '',
          rewards: parsedRewards,
          stampIcon: parsedStampIcon,
          socialLinks: parsedSocialLinks,
          locations: parsedLocations,
          updatedAt: item.updated_at,
          googleReviewUrl: storeObj?.google_review_url || null,
          googleReviewMode: storeObj?.google_review_mode || 'manual',
        }
      })
    )

    if (allStores.length === 0) {
      // Customer has no loyalty cards yet — check if viewing a specific store
      let defaultStoreId = storeIdParam || ''
      let defaultStoreName = 'Kopi & Kawan'
      let defaultStampsRequired = 10
      let defaultRewardDescription = '1 minuman panas percuma (saiz regular)'
      let defaultLogoUrl = ''
      let defaultRewardImageUrl = ''
      let defaultRewards: any[] = []
      let defaultStampIcon = '/icons/stamps/makanan.svg'
      let defaultSocialLinks: any[] = []
      let defaultLocations: any[] = []
      let defaultGoogleReviewUrl: string | null = null
      let defaultGoogleReviewMode = 'manual'

      if (storeIdParam) {
        const { data: st } = await admin
          .from('stores')
          .select(
            'id, name, stamps_required, reward_description, logo_url, reward_image_url, rewards, google_review_url, google_review_mode'
          )
          .eq('id', storeIdParam)
          .single()
        if (st) {
          defaultStoreId = st.id
          defaultStoreName = st.name
          defaultStampsRequired = st.stamps_required
          defaultRewardDescription = st.reward_description
          defaultLogoUrl = st.logo_url || ''
          defaultRewardImageUrl = st.reward_image_url || ''
          const rawStRewards = st.rewards
          defaultRewards = Array.isArray(rawStRewards)
            ? rawStRewards
            : Array.isArray(rawStRewards?.list)
            ? rawStRewards.list
            : []
          defaultStampIcon =
            (typeof rawStRewards === 'object' && !Array.isArray(rawStRewards) && rawStRewards?.stampIcon) ||
            '/icons/stamps/makanan.svg'
          defaultSocialLinks =
            (typeof rawStRewards === 'object' && !Array.isArray(rawStRewards) && Array.isArray(rawStRewards?.socialLinks) && rawStRewards.socialLinks) ||
            []
          const rawDefLocs =
            (typeof rawStRewards === 'object' && !Array.isArray(rawStRewards) && Array.isArray(rawStRewards?.locations) && rawStRewards.locations) ||
            (Array.isArray((st as any)?.locations) && (st as any).locations) ||
            []
          defaultLocations = await Promise.all(
            rawDefLocs.map(async (loc: any) => {
              if (!loc.url) return loc
              try {
                const res = await resolveGoogleMapsLocation(loc.url, loc.address || loc.name)
                return {
                  ...loc,
                  coordinates: res.coordinates || loc.coordinates,
                  embedUrl: res.embedUrl || loc.embedUrl,
                  embedQuery: res.placeName || loc.embedQuery,
                  address: loc.address || res.placeName || '',
                }
              } catch {
                return loc
              }
            })
          )
          defaultGoogleReviewUrl = st.google_review_url || null
          defaultGoogleReviewMode = st.google_review_mode || 'manual'
        }
      }

      return NextResponse.json({
        allStores: [],
        activeStoreId: defaultStoreId,
        totalStamps: 0,
        stampsRequired: defaultStampsRequired,
        rewardDescription: defaultRewardDescription,
        storeName: defaultStoreName,
        logoUrl: defaultLogoUrl,
        rewardImageUrl: defaultRewardImageUrl,
        rewards: defaultRewards,
        stampIcon: defaultStampIcon,
        socialLinks: defaultSocialLinks,
        locations: defaultLocations,
        updatedAt: null,
        stampDates: [],
        googleReviewUrl: defaultGoogleReviewUrl,
        googleReviewMode: defaultGoogleReviewMode,
      })
    }

    // Determine active store (either matching storeIdParam or the first/most recent one)
    const activeStore = (storeIdParam ? allStores.find((s) => s.storeId === storeIdParam) : null) || allStores[0]

    // Fetch individual stamp claim history for active store to show timestamps on each stamp circle
    const { data: stampHistory } = await admin
      .from('stamp_tokens')
      .select('stamp_count, claimed_at, created_at')
      .eq('claimed_by', user.id)
      .eq('store_id', activeStore.storeId)
      .eq('status', 'claimed')
      .order('claimed_at', { ascending: true })

    const stampDates: string[] = []
    for (const token of stampHistory || []) {
      const dateStr = token.claimed_at || token.created_at
      const count = token.stamp_count || 1
      for (let i = 0; i < count; i++) {
        stampDates.push(dateStr)
      }
    }

    return NextResponse.json({
      allStores,
      activeStoreId: activeStore.storeId,
      totalStamps: activeStore.totalStamps,
      stampsRequired: activeStore.stampsRequired,
      rewardDescription: activeStore.rewardDescription,
      storeName: activeStore.storeName,
      logoUrl: activeStore.logoUrl,
      rewardImageUrl: activeStore.rewardImageUrl,
      rewards: activeStore.rewards,
      stampIcon: activeStore.stampIcon,
      socialLinks: activeStore.socialLinks,
      locations: activeStore.locations || [],
      updatedAt: activeStore.updatedAt,
      stampDates,
      googleReviewUrl: activeStore.googleReviewUrl,
      googleReviewMode: activeStore.googleReviewMode,
    })
  } catch (err: unknown) {
    console.error('Error fetching loyalty:', err)
    const message = err instanceof Error ? err.message : 'Ralat dalaman server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
