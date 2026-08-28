import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET: Dapatkan tetapan kedai bagi staf/pemilik semasa
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sila log masuk untuk melihat tetapan kedai.' },
        { status: 401 }
      )
    }

    const admin = createAdminClient()

    // Cari rekod staf dalam table store_staff
    const { data: staff } = await admin
      .from('store_staff')
      .select('store_id, role')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    let activeStoreId = staff?.store_id
    let activeRole = staff?.role || 'cashier'

    // Jika tiada rekod dalam store_staff, semak jika user adalah owner_id dalam stores
    if (!activeStoreId) {
      const { data: ownedStore } = await admin
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1)
        .maybeSingle()

      if (ownedStore) {
        activeStoreId = ownedStore.id
        activeRole = 'owner'
        await admin.from('store_staff').upsert({
          store_id: ownedStore.id,
          user_id: user.id,
          role: 'owner',
        })
      }
    }

    // Jika pengguna belum mempunyai kedai berdaftar, pulangkan status needsRegistration
    if (!activeStoreId) {
      return NextResponse.json({
        needsRegistration: true,
        userId: user.id,
        userEmail: user.email,
        message: 'Akaun anda belum didaftarkan dengan mana-mana kedai.',
      })
    }

    const { data: store, error: storeError } = await admin
      .from('stores')
      .select('id, name, stamps_required, reward_description, logo_url, reward_image_url, rewards')
      .eq('id', activeStoreId)
      .single()

    if (storeError || !store) {
      return NextResponse.json(
        { error: 'Maklumat kedai tidak dijumpai.' },
        { status: 404 }
      )
    }

    const rawRewards = store.rewards
    const parsedRewards = Array.isArray(rawRewards)
      ? rawRewards
      : Array.isArray(rawRewards?.list)
      ? rawRewards.list
      : []
    const parsedStampIcon =
      (typeof rawRewards === 'object' && !Array.isArray(rawRewards) && rawRewards?.stampIcon) ||
      '/Icon multi card/Makan.svg'
    const parsedSocialLinks =
      (typeof rawRewards === 'object' && !Array.isArray(rawRewards) && Array.isArray(rawRewards?.socialLinks) && rawRewards.socialLinks) ||
      []

    return NextResponse.json({
      needsRegistration: false,
      storeId: store.id,
      name: store.name,
      stampsRequired: store.stamps_required,
      rewardDescription: store.reward_description,
      logoUrl: store.logo_url || '',
      rewardImageUrl: store.reward_image_url || '',
      rewards: parsedRewards,
      stampIcon: parsedStampIcon,
      socialLinks: parsedSocialLinks,
      role: activeRole,
    })
  } catch (err: unknown) {
    console.error('Error fetching settings:', err)
    const message = err instanceof Error ? err.message : 'Ralat dalaman server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST: Daftar kedai baharu untuk pemilik (Onboarding Flow -> jana Store UUID)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Sila log masuk terlebih dahulu.' },
        { status: 401 }
      )
    }

    const admin = createAdminClient()

    // Semak sama ada user sudah mempunyai kedai
    const { data: existingStaff } = await admin
      .from('store_staff')
      .select('store_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (existingStaff) {
      return NextResponse.json(
        { error: 'Akaun anda sudah mempunyai kedai yang berdaftar.' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const {
      name = 'Kedai Saya',
      stampsRequired = 10,
      rewardDescription = '1 minuman percuma',
      logoUrl = '',
      rewardImageUrl = '',
      rewards = [],
    } = body

    const cleanName = String(name).trim() || 'Kedai Saya'
    const cleanStampsReq = Math.max(1, Math.min(50, Number(stampsRequired) || 10))
    const cleanRewardDesc =
      String(rewardDescription).trim() || '1 minuman percuma'
    const cleanLogoUrl = typeof logoUrl === 'string' ? logoUrl.trim() : ''
    const cleanRewardImageUrl = typeof rewardImageUrl === 'string' ? rewardImageUrl.trim() : ''
    const cleanRewards = Array.isArray(rewards) ? rewards : []

    // Jana slug yang unik dan selamat (cth: "kopi-kawan-a1b2c")
    const baseSlug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'kedai'
    const randomSuffix = Math.random().toString(36).substring(2, 7)
    const generatedSlug = `${baseSlug}-${randomSuffix}`

    // 1. Cipta row baharu dalam stores (menjana Store UUID)
    const { data: newStore, error: storeCreateError } = await admin
      .from('stores')
      .insert({
        name: cleanName,
        slug: generatedSlug,
        owner_id: user.id,
        stamps_required: cleanStampsReq,
        reward_description: cleanRewardDesc,
        logo_url: cleanLogoUrl || null,
        reward_image_url: cleanRewardImageUrl || null,
        rewards: cleanRewards,
      })
      .select()
      .single()

    if (storeCreateError || !newStore) {
      console.error('Failed to create store:', storeCreateError)
      return NextResponse.json(
        { error: storeCreateError?.message || 'Gagal mendaftarkan kedai baharu.' },
        { status: 500 }
      )
    }

    // 2. Pautkan User UUID dengan Store UUID sebagai 'owner' dalam store_staff
    const { error: staffLinkError } = await admin.from('store_staff').insert({
      store_id: newStore.id,
      user_id: user.id,
      role: 'owner',
    })

    if (staffLinkError) {
      console.error('Failed to link store staff:', staffLinkError)
      return NextResponse.json(
        { error: staffLinkError?.message || 'Gagal memautkan akaun staf dengan kedai.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      storeId: newStore.id,
      name: newStore.name,
      stampsRequired: newStore.stamps_required,
      rewardDescription: newStore.reward_description,
      logoUrl: newStore.logo_url || '',
      rewardImageUrl: newStore.reward_image_url || '',
      rewards: newStore.rewards || [],
      role: 'owner',
    })
  } catch (err: unknown) {
    console.error('Error registering store:', err)
    const message = err instanceof Error ? err.message : 'Ralat dalaman server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PUT: Kemaskini tetapan kedai (Owner sahaja)
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sila log masuk sebagai kasir/pemilik.' },
        { status: 401 }
      )
    }

    const admin = createAdminClient()
    const body = await req.json()
    const {
      storeId: reqStoreId,
      name,
      stampsRequired,
      rewardDescription,
      logoUrl,
      rewardImageUrl,
      rewards,
      stampIcon,
      socialLinks,
    } = body

    // Check staff role
    let staffQuery = admin
      .from('store_staff')
      .select('store_id, role')
      .eq('user_id', user.id)

    if (reqStoreId) {
      staffQuery = staffQuery.eq('store_id', reqStoreId)
    }

    const { data: staff } = await staffQuery.maybeSingle()

    let storeId = staff?.store_id
    let isOwner = staff?.role === 'owner'

    // Fallback: jika store_staff tiada, semak owner_id dalam stores
    if (!storeId) {
      let storeLookup = admin.from('stores').select('id, owner_id')
      if (reqStoreId) {
        storeLookup = storeLookup.eq('id', reqStoreId)
      } else {
        storeLookup = storeLookup.eq('owner_id', user.id)
      }
      const { data: directStore } = await storeLookup.maybeSingle()

      if (directStore) {
        storeId = directStore.id
        isOwner = directStore.owner_id === user.id || !directStore.owner_id
        await admin.from('store_staff').upsert({
          store_id: directStore.id,
          user_id: user.id,
          role: 'owner',
        })
      }
    }

    if (!storeId) {
      return NextResponse.json(
        { error: 'Maklumat kedai tidak dijumpai.' },
        { status: 404 }
      )
    }

    if (!isOwner) {
      return NextResponse.json(
        { error: 'Hanya pemilik kedai (owner) dibenarkan menukar tetapan.' },
        { status: 403 }
      )
    }

    const cleanRewards = Array.isArray(rewards) ? rewards : []
    const cleanStampIcon = typeof stampIcon === 'string' && stampIcon.trim() ? stampIcon.trim() : '/Icon multi card/Makan.svg'
    const cleanSocialLinks = Array.isArray(socialLinks) ? socialLinks : []

    const updates: {
      name?: string
      stamps_required?: number
      reward_description?: string
      logo_url?: string | null
      reward_image_url?: string | null
      rewards?: any
    } = {
      rewards: {
        list: cleanRewards,
        stampIcon: cleanStampIcon,
        socialLinks: cleanSocialLinks,
      },
    }

    if (typeof name === 'string' && name.trim()) {
      updates.name = name.trim()
    }
    if (typeof stampsRequired === 'number' && stampsRequired > 0) {
      updates.stamps_required = stampsRequired
    }
    if (typeof rewardDescription === 'string') {
      updates.reward_description = rewardDescription.trim()
    }
    if (typeof logoUrl === 'string') {
      updates.logo_url = logoUrl.trim() || null
    }
    if (typeof rewardImageUrl === 'string') {
      updates.reward_image_url = rewardImageUrl.trim() || null
    }

    const { data: updatedStore, error: updateError } = await admin
      .from('stores')
      .update(updates)
      .eq('id', storeId)
      .select()
      .maybeSingle()

    if (updateError || !updatedStore) {
      console.error('Error updating store settings:', updateError)
      return NextResponse.json(
        { error: updateError?.message || 'Gagal mengemaskini tetapan kedai.' },
        { status: 500 }
      )
    }

    const rawUpdatedRewards = updatedStore.rewards
    const finalRewards = Array.isArray(rawUpdatedRewards)
      ? rawUpdatedRewards
      : Array.isArray(rawUpdatedRewards?.list)
      ? rawUpdatedRewards.list
      : cleanRewards
    const finalStampIcon =
      (typeof rawUpdatedRewards === 'object' && !Array.isArray(rawUpdatedRewards) && rawUpdatedRewards?.stampIcon) ||
      cleanStampIcon
    const finalSocialLinks =
      (typeof rawUpdatedRewards === 'object' && !Array.isArray(rawUpdatedRewards) && Array.isArray(rawUpdatedRewards?.socialLinks) && rawUpdatedRewards.socialLinks) ||
      cleanSocialLinks

    return NextResponse.json({
      success: true,
      storeId: updatedStore.id,
      name: updatedStore.name,
      stampsRequired: updatedStore.stamps_required,
      rewardDescription: updatedStore.reward_description,
      logoUrl: updatedStore.logo_url || '',
      rewardImageUrl: updatedStore.reward_image_url || '',
      rewards: finalRewards,
      stampIcon: finalStampIcon,
      socialLinks: finalSocialLinks,
    })
  } catch (err: unknown) {
    console.error('Error updating settings:', err)
    const message = err instanceof Error ? err.message : 'Ralat dalaman server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
