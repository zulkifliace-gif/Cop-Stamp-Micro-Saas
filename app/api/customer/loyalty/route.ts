import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

    // Query all loyalty records for this customer across all stores
    const { data: allLoyalties, error: loyaltyError } = await admin
      .from('customer_loyalty')
      .select('store_id, total_stamps, updated_at, stores(id, name, stamps_required, reward_description, logo_url, reward_image_url, rewards)')
      .eq('customer_id', user.id)

    if (loyaltyError) {
      console.error('Error fetching customer loyalty:', loyaltyError)
      return NextResponse.json(
        { error: 'Gagal mendapatkan data baki cop.' },
        { status: 500 }
      )
    }

    const allStores = (allLoyalties || []).map((item) => {
      const storeObj = Array.isArray(item.stores) ? item.stores[0] : item.stores
      const rawRewards = storeObj?.rewards
      const parsedRewards = Array.isArray(rawRewards)
        ? rawRewards
        : Array.isArray(rawRewards?.list)
        ? rawRewards.list
        : []
      const parsedStampIcon =
        (typeof rawRewards === 'object' && !Array.isArray(rawRewards) && rawRewards?.stampIcon) ||
        '/icons/stamps/makan.svg'
      const parsedSocialLinks =
        (typeof rawRewards === 'object' && !Array.isArray(rawRewards) && Array.isArray(rawRewards?.socialLinks) && rawRewards.socialLinks) ||
        []

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
        updatedAt: item.updated_at,
      }
    })

    if (allStores.length === 0) {
      // Customer has no loyalty cards yet — check if viewing a specific store
      let defaultStoreId = storeIdParam || ''
      let defaultStoreName = 'Kopi & Kawan'
      let defaultStampsRequired = 10
      let defaultRewardDescription = '1 minuman panas percuma (saiz regular)'
      let defaultLogoUrl = ''
      let defaultRewardImageUrl = ''
      let defaultRewards: any[] = []
      let defaultStampIcon = '/icons/stamps/makan.svg'
      let defaultSocialLinks: any[] = []

      if (storeIdParam) {
        const { data: st } = await admin
          .from('stores')
          .select('id, name, stamps_required, reward_description, logo_url, reward_image_url, rewards')
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
            '/icons/stamps/makan.svg'
          defaultSocialLinks =
            (typeof rawStRewards === 'object' && !Array.isArray(rawStRewards) && Array.isArray(rawStRewards?.socialLinks) && rawStRewards.socialLinks) ||
            []
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
        updatedAt: null,
      })
    }

    // Determine active store (either matching storeIdParam or the first/most recent one)
    const activeStore = (storeIdParam ? allStores.find((s) => s.storeId === storeIdParam) : null) || allStores[0]

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
      updatedAt: activeStore.updatedAt,
    })
  } catch (err: unknown) {
    console.error('Error fetching loyalty:', err)
    const message = err instanceof Error ? err.message : 'Ralat dalaman server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

