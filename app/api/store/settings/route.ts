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
    const { data: staff, error: staffError } = await admin
      .from('store_staff')
      .select('store_id, role')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    // Jika pengguna belum mempunyai kedai berdaftar, pulangkan status needsRegistration
    if (staffError || !staff) {
      return NextResponse.json({
        needsRegistration: true,
        userId: user.id,
        userEmail: user.email,
        message: 'Akaun anda belum didaftarkan dengan mana-mana kedai.',
      })
    }

    const storeId = staff.store_id

    const { data: store, error: storeError } = await admin
      .from('stores')
      .select('id, name, stamps_required, reward_description, logo_url, reward_image_url, rewards')
      .eq('id', storeId)
      .single()

    if (storeError || !store) {
      return NextResponse.json(
        { error: 'Maklumat kedai tidak dijumpai.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      needsRegistration: false,
      storeId: store.id,
      name: store.name,
      stampsRequired: store.stamps_required,
      rewardDescription: store.reward_description,
      logoUrl: store.logo_url || '',
      rewardImageUrl: store.reward_image_url || '',
      rewards: Array.isArray(store.rewards) ? store.rewards : [],
      role: staff.role || 'cashier',
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

    // 1. Cipta row baharu dalam stores (menjana Store UUID)
    const { data: newStore, error: storeCreateError } = await admin
      .from('stores')
      .insert({
        name: cleanName,
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
        { error: 'Gagal mendaftarkan kedai baharu.' },
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
        { error: 'Gagal memautkan akaun staf dengan kedai.' },
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
    } = body

    // Check staff role
    let staffQuery = admin
      .from('store_staff')
      .select('store_id, role')
      .eq('user_id', user.id)

    if (reqStoreId) {
      staffQuery = staffQuery.eq('store_id', reqStoreId)
    }

    const { data: staff } = await staffQuery.limit(1).single()

    if (!staff) {
      return NextResponse.json(
        { error: 'Anda bukan staf bagi kedai ini.' },
        { status: 403 }
      )
    }

    if (staff.role !== 'owner') {
      return NextResponse.json(
        { error: 'Hanya pemilik kedai (owner) dibenarkan menukar tetapan.' },
        { status: 403 }
      )
    }

    const storeId = staff.store_id

    const updates: {
      name?: string
      stamps_required?: number
      reward_description?: string
      logo_url?: string | null
      reward_image_url?: string | null
      rewards?: any
      updated_at: string
    } = {
      updated_at: new Date().toISOString(),
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
    if (Array.isArray(rewards)) {
      updates.rewards = rewards
    }

    const { data: updatedStore, error: updateError } = await admin
      .from('stores')
      .update(updates)
      .eq('id', storeId)
      .select()
      .single()

    if (updateError || !updatedStore) {
      console.error('Error updating store settings:', updateError)
      return NextResponse.json(
        { error: 'Gagal mengemaskini tetapan kedai.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      storeId: updatedStore.id,
      name: updatedStore.name,
      stampsRequired: updatedStore.stamps_required,
      rewardDescription: updatedStore.reward_description,
      logoUrl: updatedStore.logo_url || '',
      rewardImageUrl: updatedStore.reward_image_url || '',
      rewards: updatedStore.rewards || [],
    })
  } catch (err: unknown) {
    console.error('Error updating settings:', err)
    const message = err instanceof Error ? err.message : 'Ralat dalaman server.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
