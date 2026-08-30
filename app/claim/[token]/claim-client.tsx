'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RewardItem {
  id?: string
  name: string
  stampsRequired?: number
  imageUrl?: string
  description?: string
}

interface ClaimClientProps {
  token: string
  stampCount: number
  storeName: string
  stampsRequired: number
  rewardDescription: string
}

const MESSAGES = [
  'Kejap, saya kesan ada kotak misteri…',
  'Jap saya periksa…',
  'Ini dia… cop stamp baru!',
]

const MSG_HOLD = 2200
const MSG_FADE = 350

export default function ClaimClient({
  token,
  stampCount: initialStampCount,
  storeName: initialStoreName,
  stampsRequired: initialStampsRequired,
  rewardDescription: initialRewardDesc,
}: ClaimClientProps) {
  const supabase = createClient()

  const [scene, setScene] = useState<'login' | 'loading' | 'reveal' | 'error'>(
    'login'
  )
  const [user, setUser] = useState<any>(null)
  const [authChecking, setAuthChecking] = useState(true)

  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Loading mascot state
  const [speechText, setSpeechText] = useState(MESSAGES[0])
  const [speechFading, setSpeechFading] = useState(false)

  // Claim result data
  const [claimData, setClaimData] = useState<{
    previousStamps: number
    newTotal: number
    stampsAdded: number
    stampsRequired: number
    rewardDescription: string
    storeName: string
    logoUrl?: string
    rewardImageUrl?: string
    rewards?: RewardItem[]
  }>({
    previousStamps: 0,
    newTotal: initialStampCount,
    stampsAdded: initialStampCount,
    stampsRequired: initialStampsRequired || 10,
    rewardDescription: initialRewardDesc || '1 minuman percuma',
    storeName: initialStoreName || 'Kopi & Kawan',
    logoUrl: '',
    rewardImageUrl: '',
    rewards: [],
  })
  const [claimError, setClaimError] = useState<string | null>(null)
  const [cardImpact, setCardImpact] = useState(false)

  // Modals & Card state
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [selectedCardIdx, setSelectedCardIdx] = useState(0)

  const hasClaimedRef = useRef(false)
  const claimedStoreIdRef = useRef<string | null>(null)

  // 1. Check user session on mount
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setAuthChecking(false)

      if (session?.user && !hasClaimedRef.current) {
        startLoadingSequence(session.user)
      }
    }
    checkAuth()
  }, [])

  // 2. Multi-step mascot dialogue & claim execution
  function startLoadingSequence(currentUser: any) {
    if (hasClaimedRef.current) return
    hasClaimedRef.current = true

    setScene('loading')
    setSpeechText(MESSAGES[0])
    setSpeechFading(false)

    // Trigger atomic claim API in background
    executeClaim(currentUser)

    // Play dialog sequence
    playDialog(0)
  }

  function playDialog(index: number) {
    if (index >= MESSAGES.length) {
      setTimeout(() => {
        const storeId = claimedStoreIdRef.current
        window.location.href = storeId ? `/card?storeId=${storeId}` : '/card'
      }, 400)
      return
    }

    setSpeechText(MESSAGES[index])
    setSpeechFading(false)

    setTimeout(() => {
      setSpeechFading(true)
      setTimeout(() => playDialog(index + 1), MSG_FADE)
    }, MSG_HOLD)
  }

  // 3. POST /api/tokens/claim
  async function executeClaim(_currentUser: any) {
    try {
      const res = await fetch('/api/tokens/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await res.json()

      if (!res.ok) {
        setClaimError(data.error || 'Gagal menebus cop.')
        setScene('error')
        return
      }

      claimedStoreIdRef.current = data.storeId || null

      const total = data.newTotal ?? initialStampCount
      const req = data.stampsRequired ?? initialStampsRequired ?? 10
      const fullCards = Math.floor(total / req)
      const rem = total % req
      const totalCards = Math.max(1, fullCards + (rem > 0 ? 1 : 0))
      setSelectedCardIdx(totalCards - 1)

      setClaimData({
        previousStamps: data.previousStamps ?? 0,
        newTotal: total,
        stampsAdded: data.stampsAdded ?? initialStampCount,
        stampsRequired: req,
        rewardDescription:
          data.rewardDescription ?? initialRewardDesc ?? '1 minuman percuma',
        storeName: data.storeName ?? initialStoreName ?? 'Kopi & Kawan',
        logoUrl: data.logoUrl || '',
        rewardImageUrl: data.rewardImageUrl || '',
        rewards: Array.isArray(data.rewards) ? data.rewards : [],
      })
    } catch (err: any) {
      console.error('Error claiming token:', err)
      setClaimError('Ralat sambungan. Sila cuba lagi.')
      setScene('error')
    }
  }

  // 4. Google OAuth
  async function handleGoogleLogin() {
    setIsAuthenticating(true)
    setAuthError('')
    const origin = window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/claim/${token}`,
      },
    })
    if (error) {
      setAuthError(error.message)
      setIsAuthenticating(false)
    }
  }

  // 5. Email/Password Authentication
  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setAuthError('Sila isi emel/username dan kata laluan.')
      return
    }

    setIsAuthenticating(true)
    setAuthError('')

    const effectiveEmail = email.includes('@') ? email : `${email}@customer.local`

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: effectiveEmail,
          password,
        })
        if (error) throw error
        if (data.user) {
          setUser(data.user)
          startLoadingSequence(data.user)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: effectiveEmail,
          password,
        })
        if (error) throw error
        if (data.user) {
          setUser(data.user)
          startLoadingSequence(data.user)
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Gagal log masuk.')
    } finally {
      setIsAuthenticating(false)
    }
  }

  if (authChecking) {
    return (
      <div className="font-space text-xs text-[#5B6B64] text-center">
        Memeriksa sesi pengguna...
      </div>
    )
  }

  // -------------------------------------------------------------
  // ERROR SCENE
  // -------------------------------------------------------------
  if (scene === 'error') {
    return (
      <div className="w-full max-w-[360px] bg-[#F7EEDA] rounded-[22px] p-7 text-[#1C2624] text-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] anim-result">
        <div className="w-14 h-14 rounded-full bg-red-100 text-[#B23A2E] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          !
        </div>
        <div className="font-fraunces font-bold text-xl text-[#0F2B2A] mb-2">
          Penebusan Tidak Berjaya
        </div>
        <div className="text-[13.5px] text-[#5B6B64] mb-6 leading-relaxed">
          {claimError || 'Token ini tidak sah atau telah tamat tempoh.'}
        </div>
        <a
          href="/card"
          className="inline-block w-full py-3 px-4 bg-[#1F5C52] text-[#F7EEDA] rounded-[12px] font-jakarta font-bold text-sm hover:bg-[#2E7568] transition text-center cursor-pointer"
        >
          Lihat Kad Cop Saya
        </a>
        <div className="mt-4 pt-3.5 border-t border-[#E2CE9E]/60 text-xs text-[#5B6B64] text-center">
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
    )
  }

  // -------------------------------------------------------------
  // 1. LOGIN SCENE
  // -------------------------------------------------------------
  if (scene === 'login' && !user) {
    return (
      <div className="w-full max-w-[360px] flex flex-col items-center anim-result">
        <div className="text-center mb-6">
          <svg className="w-16 h-16 mx-auto mb-3.5 filter drop-shadow-md" viewBox="0 0 104 104" fill="none">
            <circle cx="52" cy="52" r="40" fill="#1F5C52" />
            <circle cx="52" cy="52" r="40" fill="url(#botLoginGrad)" fillOpacity="0.5" />
            <circle cx="38" cy="48" r="5" fill="#F7EEDA" />
            <circle cx="66" cy="48" r="5" fill="#F7EEDA" />
            <path d="M38 64c5 6 23 6 28 0" stroke="#F7EEDA" strokeWidth="4" strokeLinecap="round" />
            <defs>
              <radialGradient id="botLoginGrad" cx="0.3" cy="0.25" r="0.9">
                <stop offset="0" stopColor="#3E8C7C" />
                <stop offset="1" stopColor="#1F5C52" />
              </radialGradient>
            </defs>
          </svg>
          <div className="font-fraunces font-semibold text-[22px] text-[#F7EEDA] mb-1.5">
            Hai, saya Rafail 👋
          </div>
          <div className="text-[13.5px] text-[#5B6B64] leading-relaxed max-w-[280px] mx-auto">
            Log masuk dulu untuk saya masukkan cop ini ke dalam kad digital anda.
          </div>
        </div>

        <div className="w-full bg-[#FAF2E2] rounded-[24px] p-6 sm:p-7 shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(229,164,59,0.15)] text-[#1C2624]">
          <button
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center gap-2.5 bg-white border border-[#E4D9BE] rounded-[12px] py-3 px-3.5 font-jakarta font-semibold text-[14px] text-[#3C3C3C] cursor-pointer active:scale-[0.98] transition hover:bg-gray-50 disabled:opacity-60 shadow-sm"
          >
            <svg viewBox="0 0 18 18" width="18" height="18">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
            </svg>
            Log masuk dengan Google
          </button>

          <div className="flex items-center gap-2.5 my-4 text-[#5B6B64] font-space text-[10px] tracking-[0.1em] before:content-[''] before:flex-1 before:h-[1px] before:bg-[#E2CE9E] after:content-[''] after:flex-1 after:h-[1px] after:bg-[#E2CE9E]">
            ATAU
          </div>

          {authError && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-100 text-[#B23A2E] text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleEmailAuth}>
            <div className="flex items-center gap-2.5 bg-white border border-[#E4D9BE] rounded-[12px] p-3 mb-2.5">
              <svg className="w-4 h-4 shrink-0 text-[#5B6B64] opacity-55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username atau Emel"
                className="border-none outline-none flex-1 font-jakarta text-sm text-[#1C2624] bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2.5 bg-white border border-[#E4D9BE] rounded-[12px] p-3 mb-3">
              <svg className="w-4 h-4 shrink-0 text-[#5B6B64] opacity-55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata laluan"
                className="border-none outline-none flex-1 font-jakarta text-sm text-[#1C2624] bg-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full border-none rounded-[12px] py-3.5 px-4 bg-gradient-to-b from-[#E7A33E] to-[#C97F1F] text-[#1C2624] font-jakarta font-bold text-[14.5px] cursor-pointer active:scale-[0.98] transition disabled:opacity-60 shadow"
            >
              {isAuthenticating
                ? 'Memproses...'
                : isSignup
                ? 'Daftar Akaun'
                : 'Log Masuk'}
            </button>
          </form>

          <div className="text-center mt-4 text-[12.5px] text-[#5B6B64]">
            {isSignup ? 'Sudah ada akaun? ' : 'Belum ada akaun? '}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-[#1F5C52] font-semibold underline cursor-pointer hover:text-[#2E7568]"
            >
              {isSignup ? 'Log masuk' : 'Daftar sini'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // 2. LOADING SCENE
  // -------------------------------------------------------------
  if (scene === 'loading') {
    return (
      <div className="w-full max-w-[360px] flex flex-col items-center anim-result py-8">
        <div className="relative w-[110px] h-[110px] mb-6">
          <div className="anim-halo absolute -inset-[16px] rounded-full bg-[radial-gradient(circle,rgba(231,163,62,0.35),transparent_70%)]" />
          <svg className="anim-bot w-[110px] h-[110px]" viewBox="0 0 104 104" fill="none">
            <circle cx="52" cy="52" r="40" fill="#1F5C52" />
            <circle cx="52" cy="52" r="40" fill="url(#botGrad)" fillOpacity="0.5" />
            <circle cx="38" cy="48" r="5" fill="#F7EEDA" />
            <circle cx="66" cy="48" r="5" fill="#F7EEDA" />
            <path d="M38 64c5 6 23 6 28 0" stroke="#F7EEDA" strokeWidth="4" strokeLinecap="round" />
            <defs>
              <radialGradient id="botGrad" cx="0.3" cy="0.25" r="0.9">
                <stop offset="0" stopColor="#3E8C7C" />
                <stop offset="1" stopColor="#1F5C52" />
              </radialGradient>
            </defs>
          </svg>
          <svg className="anim-magnify absolute -right-1.5 bottom-0 w-9 h-9" viewBox="0 0 34 34" fill="none">
            <circle cx="14" cy="14" r="10" stroke="#E7A33E" strokeWidth="3.5" />
            <line x1="21" y1="21" x2="30" y2="30" stroke="#E7A33E" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        <div className="font-space text-[11px] tracking-[0.14em] uppercase text-[#E7A33E] opacity-85 mb-3.5">
          Rafail
        </div>

        <div className="relative bg-[#F7EEDA] text-[#1C2624] rounded-[18px] py-4 px-6 font-fraunces font-medium italic text-[17px] leading-snug min-h-[62px] w-full flex items-center justify-center text-center shadow-[0_12px_28px_rgba(0,0,0,0.3)] before:content-[''] before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-solid before:border-b-[#F7EEDA] before:border-b-[9px] before:border-x-transparent before:border-x-[8px]">
          <span
            className={`inline-block transition-all duration-350 ${
              speechFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            {speechText}
          </span>
        </div>

        <div className="flex gap-2 mt-6">
          <span className="w-2 h-2 rounded-full bg-[#E7A33E] opacity-35 [animation:dotBeat_1.3s_ease-in-out_infinite]" />
          <span className="w-2 h-2 rounded-full bg-[#E7A33E] opacity-35 [animation:dotBeat_1.3s_ease-in-out_infinite_0.18s]" />
          <span className="w-2 h-2 rounded-full bg-[#E7A33E] opacity-35 [animation:dotBeat_1.3s_ease-in-out_infinite_0.36s]" />
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // 3. REVEAL SCENE
  // -------------------------------------------------------------
  const TOTAL = claimData.stampsRequired || 10
  const fullCardsCount = Math.floor(claimData.newTotal / TOTAL)
  const remainderStamps = claimData.newTotal % TOTAL
  const totalCardsCount = Math.max(1, fullCardsCount + (remainderStamps > 0 ? 1 : 0))

  const activeCardIdx = Math.min(selectedCardIdx, totalCardsCount - 1)
  const isViewingFullCard = activeCardIdx < fullCardsCount
  const cardStamps = isViewingFullCard
    ? TOTAL
    : remainderStamps === 0 && fullCardsCount > 0 && activeCardIdx === fullCardsCount - 1
    ? TOTAL
    : remainderStamps

  const cardRemain = Math.max(0, TOTAL - cardStamps)
  const percentFill = Math.min(100, Math.round((cardStamps / TOTAL) * 100))

  const effectiveRewards = claimData.rewards && claimData.rewards.length > 0
    ? claimData.rewards
    : [
        {
          name: claimData.rewardDescription || '1 Minuman Percuma',
          stampsRequired: TOTAL,
          imageUrl: claimData.rewardImageUrl || '',
          description: 'Ganjaran utama bagi kesetiaan pelanggan kami.',
        },
      ]

  return (
    <div className="w-full max-w-[380px] flex flex-col items-center anim-result">
      {/* STORE NAME & LOGO CENTERED AT TOP */}
      <div className="flex flex-col items-center text-center mb-3.5 w-full">
        <div className="w-14 h-14 rounded-full bg-[#E7A33E] text-[#1C2624] font-fraunces font-bold flex items-center justify-center text-2xl shrink-0 shadow-lg mb-2 overflow-hidden border-2 border-[#FAF2E2]/20">
          {claimData.logoUrl ? (
            <img src={claimData.logoUrl} alt={claimData.storeName} className="w-full h-full object-cover" />
          ) : (
            claimData.storeName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="font-fraunces text-2xl font-bold text-[#F7EEDA] leading-tight">
          {claimData.storeName}
        </div>
        <div className="font-space text-[10px] text-[#5B6B64] tracking-[0.08em] uppercase mt-0.5">
          KAD COP DIGITAL • TOTAL {claimData.newTotal} COP
        </div>

        {/* ACTION PILLS: INFO 'i' AND REWARD GIFT */}
        <div className="flex items-center justify-center gap-2 mt-2.5">
          <button
            onClick={() => setShowInfoModal(true)}
            title="Cara Tebus Ganjaran"
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-[#F7EEDA]/20 bg-[#F7EEDA]/10 text-xs font-semibold text-[#F7EEDA] hover:bg-[#F7EEDA]/20 hover:border-[#E7A33E] transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-[#E7A33E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Cara Tebus (i)</span>
          </button>

          <button
            onClick={() => setShowRewardsModal(true)}
            title="Katalog Hadiah & Ganjaran"
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-[#F7EEDA]/20 bg-[#F7EEDA]/10 text-xs font-semibold text-[#F7EEDA] hover:bg-[#F7EEDA]/20 hover:border-[#E7A33E] transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-[#E7A33E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
            <span>Hadiah</span>
          </button>
        </div>
      </div>

      {/* FULL CARDS REWARD BANNER */}
      {fullCardsCount > 0 && (
        <div className="w-full mb-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900/60 to-emerald-950/80 border border-emerald-500/40 text-emerald-200 shadow-lg flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl shrink-0">
            🎁
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-emerald-300">
              {fullCardsCount} Ganjaran Sedia Ditebus!
            </div>
            <div className="text-[11px] text-emerald-200/80">
              Sebut emel anda di kaunter untuk menebus: <b className="text-white">{claimData.rewardDescription}</b>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-CARD TABS */}
      {totalCardsCount > 1 && (
        <div className="w-full flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
          {Array.from({ length: totalCardsCount }).map((_, idx) => {
            const isFull = idx < fullCardsCount
            const isActive = idx === activeCardIdx
            return (
              <button
                key={idx}
                onClick={() => setSelectedCardIdx(idx)}
                className={`py-1.5 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#E5A43B] text-[#1A2422] font-bold shadow-md'
                    : 'bg-[#FAF2E2]/10 text-[#FAF2E2]/70 hover:bg-[#FAF2E2]/20'
                }`}
              >
                <span>Kad #{idx + 1}</span>
                {isFull ? (
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                    Penuh ✓
                  </span>
                ) : (
                  <span className="text-[10px] opacity-75">
                    {remainderStamps}/{TOTAL}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* STAMP CARD */}
      <div
        className={`relative w-full bg-[#FAF2E2] rounded-[24px] px-5 sm:px-6 pt-7 pb-6 shadow-[0_24px_50px_rgba(0,0,0,0.5),0_2px_0_rgba(255,255,255,0.4)_inset,0_0_0_1px_rgba(229,164,59,0.15)] text-[#1C2624] ${
          cardImpact ? 'anim-card-impact' : ''
        }`}
      >
        <div className="text-center mb-5">
          <div className="font-space text-[10.5px] tracking-[0.14em] uppercase text-[#1E5E53] mb-1 font-semibold flex items-center justify-center gap-1.5">
            <span>Kad #{selectedCardIdx + 1}</span>
            {isViewingFullCard && (
              <span className="text-[#B53629] font-bold">• Penuh (Sedia Ditebus)</span>
            )}
          </div>
          <div className="font-fraunces font-bold text-[32px] text-[#B53629] leading-none">
            <span>{cardStamps}</span>
            <small className="font-space text-[15px] text-[#5E6F68] font-normal">
              {' '}/ {TOTAL}
            </small>
          </div>
        </div>

        {/* STAMP GRID */}
        <div className="grid grid-cols-5 gap-2.5 my-2 mb-5">
          {Array.from({ length: TOTAL }).map((_, i) => {
            const slotNum = i + 1
            const isFilled = slotNum <= cardStamps

            return (
              <div
                key={slotNum}
                className={`aspect-square rounded-full flex items-center justify-center relative ${
                  isFilled
                    ? 'bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.18),transparent_55%),#B53629] shadow-[0_4px_8px_rgba(181,54,41,0.38)]'
                    : 'border-2 border-dashed border-[#E2CE9E]'
                }`}
                style={{
                  transform:
                    isFilled
                      ? slotNum % 3 === 0
                        ? 'rotate(-6deg)'
                        : slotNum % 3 === 1
                        ? 'rotate(4deg)'
                        : 'rotate(-2deg)'
                      : undefined,
                }}
              >
                {isFilled && (
                  <svg className="w-[54%] h-[54%]" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C7 2 3 6.5 3 12s4 10 9 10 9-4.5 9-10S17 2 12 2Z"
                      fill="#FAF2E2"
                    />
                    <path
                      d="M12 3.3C13.6 6.2 12 9 10.3 11.5S8.2 17 12 20.6"
                      stroke="#B53629"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            )
          })}
        </div>

        {/* PROGRESS BAR */}
        <div className="h-2.5 rounded-md bg-[#E2CE9E] overflow-hidden mb-4">
          <div
            className="h-full rounded-md bg-gradient-to-r from-[#C77B1B] to-[#E5A43B] transition-all duration-1000 ease-out"
            style={{ width: `${percentFill}%` }}
          />
        </div>

        {/* REWARD / REMAINING MESSAGE */}
        <div className="text-center text-[13.5px] text-[#1E5E53] font-semibold leading-relaxed">
          {isViewingFullCard ? (
            <div className="text-emerald-800 font-bold flex items-center justify-center gap-1.5">
              <span>🎉 Kad ini telah lengkap! Sedia ditebus: {claimData.rewardDescription}.</span>
            </div>
          ) : cardRemain > 0 ? (
            <>
              Cuma <b className="text-[#B53629]">{cardRemain}</b> cop lagi untuk kad ini bagi mendapat{' '}
              {claimData.rewardDescription}!
            </>
          ) : (
            <>
              <b className="text-[#B53629]">Tahniah!</b> Cop kad ini genap — tebus ganjaran di kaunter: {claimData.rewardDescription}.
            </>
          )}
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="flex items-center justify-between w-full mt-4 px-1">
        <a
          href="/card"
          className="font-space text-[11px] text-[#E7A33E] hover:underline"
        >
          Lihat Semua Kad Cop ↗
        </a>
        <button
          onClick={() => {
            setCardImpact(false)
            setTimeout(() => setCardImpact(true), 100)
          }}
          className="bg-transparent border-none font-space text-[11px] tracking-[0.08em] text-[#5B6B64] opacity-70 cursor-pointer underline underline-offset-[3px] hover:opacity-100"
        >
          ▶ animasi getaran
        </button>
      </div>

      {/* PROMO LINK */}
      <div className="mt-3 text-center text-xs text-[#5B6B64]/70">
        <a
          href="https://lajus.lajuq.my/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E7A33E]/70 hover:text-[#E7A33E] font-semibold underline underline-offset-2 inline-flex items-center gap-1 transition"
        >
          <span>Guna sistem cop di kedai anda</span>
          <span className="text-[10px]">↗</span>
        </a>
      </div>

      {/* 1. POPUP MODAL: CARA CLAIM GANJARAN (INFO 'i') */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-[#0A1716]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-6 shadow-2xl border border-[#E5A43B]/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="font-fraunces font-bold text-lg text-[#0A1716]">
                💡 Cara Penebusan Ganjaran
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-gray-700 mb-5">
              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <b>Kumpul Cop:</b> Dapatkan cop setiap kali berbelanja sehingga kad cop anda penuh.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <b>Pergi ke Kaunter:</b> Maklumkan kepada kasir bahawa anda ingin menebus ganjaran anda.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <b>Sebut Emel Anda:</b> Berikan emel berdaftar anda kepada kasir untuk semakan baki cop di sistem.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <b>Sahkan Penebusan:</b> Kasir akan menolak cop dan menyerahkan ganjaran anda serta-merta!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 bg-[#1E5E53] hover:bg-[#2D786B] text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Faham
            </button>
          </div>
        </div>
      )}

      {/* 2. POPUP MODAL: KATALOG HADIAH & GANJARAN */}
      {showRewardsModal && (
        <div className="fixed inset-0 z-50 bg-[#0A1716]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-6 shadow-2xl border border-[#E5A43B]/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="font-fraunces font-bold text-lg text-[#0A1716]">
                🎁 Hadiah &amp; Ganjaran
              </div>
              <button
                onClick={() => setShowRewardsModal(false)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="max-h-[340px] overflow-y-auto space-y-2.5 mb-5 pr-1">
              {effectiveRewards.map((item, i) => (
                <div
                  key={item.id || i}
                  className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E4D9BE] shadow-sm"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#E2CE9E] shrink-0 bg-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#FAF2E2] flex items-center justify-center text-2xl shrink-0 border border-[#E2CE9E]">
                      🎁
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-[#0A1716] truncate">
                      {item.name}
                    </div>
                    {item.description && (
                      <div className="text-[11px] text-[#5E6F68] truncate mt-0.5">
                        {item.description}
                      </div>
                    )}
                    <div className="inline-block mt-1 font-space text-[10px] font-bold text-[#B53629] bg-red-100 px-2 py-0.5 rounded-md">
                      ⚡ {item.stampsRequired || TOTAL} Cop Diperlukan
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRewardsModal(false)}
              className="w-full py-2.5 bg-[#1E5E53] hover:bg-[#2D786B] text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
