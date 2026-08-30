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

    // 3. Delete user account from Supabase Auth
    // Cascade triggers delete on customer_profiles, customer_loyalty, store_staff (cashier),
    // and sets null on stamp_tokens.created_by / stamp_tokens.claimed_by / stamp_redemptions.redeemed_by
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
