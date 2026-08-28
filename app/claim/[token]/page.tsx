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
    initialError = 'Pautan ini telah luput tempoh (sah selama 15 minit sahaja).'
    errorCode = 'expired'
  }

  const storeInfo = Array.isArray(tokenRecord?.stores)
    ? tokenRecord?.stores[0]
    : tokenRecord?.stores

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 font-jakarta text-[#F7EEDA]">
      <div className="w-full max-w-[420px] mx-auto flex flex-col items-center justify-center z-10 relative">
        {initialError ? (
          <div className="w-full bg-[#F7EEDA] text-[#1C2624] rounded-[22px] p-6 sm:p-8 text-center shadow-[0_16px_36px_rgba(0,0,0,0.35)] anim-result">
            <div className="w-14 h-14 rounded-full bg-red-100 text-[#B23A2E] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="font-fraunces font-bold text-xl mb-2 text-[#0F2B2A]">
              {errorCode === 'already_claimed'
                ? 'Cop Sudah Ditebus'
                : errorCode === 'expired'
                ? 'Pautan Telah Luput'
                : 'Pautan Tidak Sah'}
            </h2>
            <p className="text-[13px] text-[#5B6B64] leading-relaxed mb-6">
              {initialError}
            </p>
            <a
              href="/card"
              className="inline-block w-full py-3 px-5 rounded-[12px] bg-[#1F5C52] text-[#F7EEDA] font-bold text-sm hover:bg-[#2E7568] transition cursor-pointer"
            >
              Lihat Kad Cop Saya
            </a>
            <div className="mt-4 pt-3.5 border-t border-[#E2CE9E]/60 text-xs text-[#5B6B64]">
              <a
                href="https://lajus.lajuq.my/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1F5C52] hover:text-[#2E7568] font-semibold underline underline-offset-2 inline-flex items-center gap-1 transition"
              >
                <span>Guna sistem cop di kedai anda</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>
          </div>
        ) : (
          <ClaimClient
            token={cleanToken}
            stampCount={tokenRecord?.stamp_count || 1}
            storeName={storeInfo?.name || 'Kopi & Kawan'}
            stampsRequired={storeInfo?.stamps_required || 10}
            rewardDescription={storeInfo?.reward_description || '1 minuman percuma'}
          />
        )}
      </div>
    </main>
  )
}
