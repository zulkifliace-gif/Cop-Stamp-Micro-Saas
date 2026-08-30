import React from 'react'
import { createAdminClient } from '@/lib/supabase/admin'
import ClaimClient from './claim-client'

interface PageProps {
  params: Promise<{
    token: string
  }>
}

export default async function ClaimPage({ params }: PageProps) {
  const { token } = await params
  const cleanToken = token.trim().toUpperCase()

  const admin = createAdminClient()

  // 1. Fetch token status and validity on server
  const { data: tokenRecord, error } = await admin
    .from('stamp_tokens')
    .select('token, stamp_count, status, expires_at, stores(name, stamps_required, reward_description)')
    .eq('token', cleanToken)
    .single()

  let initialError: string | null = null
  let errorCode: string | null = null

  if (error || !tokenRecord) {
    initialError = 'Pautan cop ini tidak sah atau tidak wujud.'
    errorCode = 'not_found'
  } else if (tokenRecord.status === 'claimed') {
    initialError = 'Cop ini sudah diambil sebelum ini.'
    errorCode = 'already_claimed'
  } else if (
    tokenRecord.status === 'expired' ||
    new Date(tokenRecord.expires_at).getTime() < Date.now()
  ) {
    initialError = 'Pautan ini telah luput tempoh (sah selama 30 minit sahaja).'
    errorCode = 'expired'
  }

  const storeInfo = Array.isArray(tokenRecord?.stores)
    ? tokenRecord?.stores[0]
    : tokenRecord?.stores

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 font-jakarta text-[#F7EEDA]">
      <div className="w-full max-w-[420px] mx-auto flex flex-col items-center justify-center z-10 relative">
        <ClaimClient
          token={cleanToken}
          stampCount={tokenRecord?.stamp_count || 1}
          storeName={storeInfo?.name || 'Kopi & Kawan'}
          stampsRequired={storeInfo?.stamps_required || 10}
          rewardDescription={storeInfo?.reward_description || '1 minuman percuma'}
          initialError={initialError}
          errorCode={errorCode}
        />

        {/* FOOTPAGE LAJUS BRANDING & DASAR PRIVASI */}
        <footer className="w-full text-center mt-6 mb-2 flex items-center justify-center gap-2 opacity-50 hover:opacity-90 transition text-[11px] font-space text-[#FAF2E2]">
          <img src="/logo.svg" alt="LajuS" className="w-3.5 h-3.5 object-contain" />
          <span>LajuS</span>
          <span className="text-[#FAF2E2]/40">•</span>
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FAF2E2]/70 hover:text-[#E5A43B] underline">
            Dasar Privasi
          </a>
        </footer>
      </div>
    </main>
  )
}
