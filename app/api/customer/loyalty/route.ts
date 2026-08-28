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

    let query = admin
      .from('customer_loyalty')
      .select('total_stamps, store_id, updated_at, stores(name, stamps_required, reward_description, logo_url, reward_image_url, rewards)')
      .eq('customer_id', user.id)

    if (storeIdParam) {
      query = query.eq('store_id', storeIdParam)
    }

    const { data: loyaltyList, error: loyaltyError } = await query
      .order('updated_at', { ascending: false })
      .limit(1)

    if (loyaltyError) {
      console.error('Error fetching customer loyalty:', loyaltyError)
      return NextResponse.json(
        { error: 'Gagal mendapatkan data baki cop.' },
        { status: 500 }
      )
    }

    if (!loyaltyList || loyaltyList.length === 0) {
      // Return zero balance with default store info if customer has no stamps yet
      let defaultStoreName = 'Kopi & Kawan'
      let defaultStampsRequired = 10
      let defaultRewardDescription = '1 minuman panas percuma (saiz regular)'
      let defaultLogoUrl = ''
      let defaultRewardImageUrl = ''
      let defaultRewards: any[] = []

      if (storeIdParam) {
        const { data: st } = await admin
          .from('stores')
          .select('name, stamps_required, reward_description, logo_url, reward_image_url, rewards')
          .eq('id', storeIdParam)
          .single()
        if (st) {
          defaultStoreName = st.name
          defaultStampsRequired = st.stamps_required
          defaultRewardDescription = st.reward_description
          defaultLogoUrl = st.logo_url || ''
          defaultRewardImageUrl = st.reward_image_url || ''
          defaultRewards = Array.isArray(st.rewards) ? st.rewards : []
        }
      }

      return NextResponse.json({
        totalStamps: 0,
        stampsRequired: defaultStampsRequired,
        rewardDescription: defaultRewardDescription,
        storeName: defaultStoreName,
        logoUrl: defaultLogoUrl,
        rewardImageUrl: defaultRewardImageUrl,
        rewards: defaultRewards,
      })
    }

    const item = loyaltyList[0]
    // Supabase returns foreign key relations as single object or array depending on mapping
    const storeObj = Array.isArray(item.stores) ? item.stores[0] : item.stores

    return NextResponse.json({
      totalStamps: item.total_stamps || 0,
      stampsRequired: storeObj?.stamps_required || 10,
      rewardDescription:
        storeObj?.reward_description || '1 minuman percuma',
      storeName: storeObj?.name || 'Kopi & Kawan',
      logoUrl: storeObj?.logo_url || '',
      rewardImageUrl: storeObj?.reward_image_url || '',
      rewards: Array.isArray(storeObj?.rewards) ? storeObj.rewards : [],
      updatedAt: item.updated_at,
    })
  } catch (err: unknown) {
    console.error('Error fetching loyalty:', err)
    const message = err instanceof Error ? err.message : 'Ralat dalaman server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
