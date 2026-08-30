import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST() {
  try {
    // 1. Authenticate user from session (server client)
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

    // 2. Check if user is an active registered owner of any store
    const { data: ownerStaff, error: staffError } = await admin
      .from('store_staff')
      .select('store_id')
      .eq('user_id', user.id)
      .eq('role', 'owner')

    if (staffError) {
      console.error('Error checking store ownership:', staffError)
      return NextResponse.json(
        { error: 'Ralat semasa menyemak status pemilikan akaun.' },
        { status: 500 }
      )
    }

    if (ownerStaff && ownerStaff.length > 0) {
      return NextResponse.json(
        {
          error:
            'Anda masih pemilik berdaftar untuk kedai. Sila pindah pemilikan kedai atau hubungi sokongan sebelum memadam akaun.',
        },
        { status: 403 }
      )
    }

    // 3. Explicitly cleanup / unlink all dependent user records first
    // This prevents foreign key constraint violations if production DB constraints
    // were created without ON DELETE CASCADE (e.g. customer_loyalty_customer_id_fkey)

    // A. Unlink cashier / customer references on audit history
    await admin.from('stamp_tokens').update({ created_by: null }).eq('created_by', user.id)
    await admin.from('stamp_tokens').update({ claimed_by: null }).eq('claimed_by', user.id)
    await admin.from('stamp_redemptions').update({ redeemed_by: null }).eq('redeemed_by', user.id)

    // B. Delete user loyalty stamp balances and redemptions
    await admin.from('customer_loyalty').delete().eq('customer_id', user.id)
    await admin.from('stamp_redemptions').delete().eq('customer_id', user.id)

    // C. Delete cashier staff membership (if any cashier role)
    await admin.from('store_staff').delete().eq('user_id', user.id)

    // D. Delete customer profile
    await admin.from('customer_profiles').delete().eq('id', user.id)

    // 4. Delete user account from Supabase Auth Admin
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error('Error deleting user from auth admin:', deleteError)
      return NextResponse.json(
        { error: deleteError.message || 'Gagal memadam akaun anda.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Unexpected error in account deletion:', err)
    return NextResponse.json(
      { error: err.message || 'Ralat pelayan dalaman.' },
      { status: 500 }
    )
  }
}
