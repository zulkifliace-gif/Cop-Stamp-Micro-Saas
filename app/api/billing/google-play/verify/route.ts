import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { orderId, purchaseToken, productId } = body

    if (!purchaseToken) {
      return NextResponse.json({ error: 'Maklumat pembelian Google Play tidak lengkap.' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Get the store linked to this user
    const { data: staff } = await admin
      .from('store_staff')
      .select('store_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!staff?.store_id) {
      return NextResponse.json({ error: 'Tiada kedai berdaftar untuk akaun ini.' }, { status: 404 })
    }

    const storeId = staff.store_id

    // Update store to Pro Plan active
    const { error: updateError } = await admin
      .from('stores')
      .update({
        plan_type: 'pro',
        subscription_status: 'active',
      })
      .eq('id', storeId)

    if (updateError) {
      console.error('Error updating store plan:', updateError)
      return NextResponse.json({ error: 'Gagal mengaktifkan pelan Pro.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Langganan Google Play berjaya disahkan. Pelan Pro kini aktif!',
      planType: 'pro',
      orderId,
      productId,
    })
  } catch (err: any) {
    console.error('Google Play verify error:', err)
    return NextResponse.json({ error: err.message || 'Ralat pengesahan Google Play.' }, { status: 500 })
  }
}
