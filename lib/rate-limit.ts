// Rate limiter for API routes — persistent via Supabase (table
// `api_rate_limits` + RPC `check_rate_limit`, lihat supabase/schema.sql).
//
// SECURITY FIX: Versi asal guna in-memory Map yang reset setiap kali
// serverless function jalan pada instance/container baru — jadi rate
// limit tak konsisten/reliable dalam production. Versi ni simpan
// counter dalam Postgres (guna row lock `for update`, atomic) supaya
// sah merentasi semua instance.
//
// Nota: fungsi ni kini ASYNC — semua caller kena `await checkRateLimit(...)`.

import { createAdminClient } from './supabase/admin'

export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 60,
  windowSeconds: number = 3600
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const admin = createAdminClient()

  const { data, error } = await admin.rpc('check_rate_limit', {
    p_identifier: identifier,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds,
  })

  if (error || !data) {
    // Fail-open + log: elak block pengguna sah kalau ada isu infra
    // sekejap, tapi log supaya nampak dalam server logs untuk siasat.
    console.error('Rate limit check failed, failing open:', error)
    return {
      success: true,
      remaining: maxRequests,
      reset: Date.now() + windowSeconds * 1000,
    }
  }

  return {
    success: data.success,
    remaining: data.remaining,
    reset: data.reset,
  }
}
