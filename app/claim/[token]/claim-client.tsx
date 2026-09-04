'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lang, I18N_CLAIM } from '@/lib/i18n/claim'

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
  logoUrl?: string | null
  initialError?: string | null
  errorCode?: string | null
  claimedByMe?: boolean
  storeId?: string | null
}

// Tempoh animasi maskot (satu kitaran penuh CSS animation ialah 6s — lihat
// keyframes sdWhiff/sdRing/sdDust/sdCardDodge/sdInk/sdStampAttack di bawah)
// + sedikit buffer sebelum redirect ke /card.
const LOADING_ANIMATION_DURATION = 6000
const REDIRECT_BUFFER = 400

function formatStampDateTime(dateStr: string | null, lang: Lang) {
  if (!dateStr) {
    return {
      date: lang === 'en' ? 'Recently' : 'Baru-baru ini',
      time: '',
    }
  }
  try {
    const d = new Date(dateStr)
    const locale = lang === 'en' ? 'en-US' : 'ms-MY'
    const dateFormatted = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    const timeFormatted = d.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    return { date: dateFormatted, time: timeFormatted }
  } catch {
    return { date: dateStr, time: '' }
  }
}

export default function ClaimClient({
  token,
  stampCount: initialStampCount,
  storeName: initialStoreName,
  stampsRequired: initialStampsRequired,
  rewardDescription: initialRewardDesc,
  logoUrl: initialLogoUrl = null,
  initialError = null,
  errorCode: initialErrorCode = null,
  claimedByMe = false,
  storeId: initialStoreId = null,
}: ClaimClientProps) {
  const supabase = createClient()

  // Language state (persisted in localStorage)
  const [lang, setLang] = useState<Lang>('my')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lajus_lang') as Lang | null
      if (saved === 'my' || saved === 'en') {
        setLang(saved)
      }
    } catch {}
  }, [])

  const switchLang = (newLang: Lang) => {
    setLang(newLang)
    try {
      localStorage.setItem('lajus_lang', newLang)
    } catch {}
  }

  const t = I18N_CLAIM[lang].client
  const tServer = I18N_CLAIM[lang].server

  const [scene, setScene] = useState<'login' | 'loading' | 'reveal' | 'error'>(
    initialError ? 'error' : 'login'
  )
  const [user, setUser] = useState<any>(null)
  const [authChecking, setAuthChecking] = useState(!initialError && !claimedByMe)
  const [errorCode, setErrorCode] = useState<string | null>(initialErrorCode)

  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [showManualEmail, setShowManualEmail] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Logo loading & error states
  const [loginLogoLoading, setLoginLogoLoading] = useState(Boolean(initialLogoUrl))
  const [loginLogoError, setLoginLogoError] = useState(false)
  const [revealLogoLoading, setRevealLogoLoading] = useState(true)
  const [revealLogoError, setRevealLogoError] = useState(false)

  useEffect(() => {
    if (!initialLogoUrl) {
      setLoginLogoLoading(false)
      setLoginLogoError(false)
      return
    }

    setLoginLogoLoading(true)
    setLoginLogoError(false)

    let isMounted = true
    const img = new Image()
    img.src = initialLogoUrl

    // If already in browser cache
    if (img.complete && img.naturalWidth > 0) {
      setLoginLogoLoading(false)
      return
    }

    // Safety timeout: max 2.5s so spinner never hangs indefinitely
    const timer = setTimeout(() => {
      if (isMounted) {
        if (!img.complete || img.naturalWidth === 0) {
          setLoginLogoError(true)
        }
        setLoginLogoLoading(false)
      }
    }, 2500)

    img.onload = () => {
      if (isMounted) {
        clearTimeout(timer)
        setLoginLogoLoading(false)
        setLoginLogoError(false)
      }
    }

    img.onerror = () => {
      if (isMounted) {
        clearTimeout(timer)
        setLoginLogoError(true)
        setLoginLogoLoading(false)
      }
    }

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [initialLogoUrl])

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
  const [showReviewPopup, setShowReviewPopup] = useState(false)
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string | null>(null)
  const [reviewRating, setReviewRating] = useState<number>(0)
  const [selectedCardIdx, setSelectedCardIdx] = useState(0)

  // Stamp detail popup modal state
  const [selectedStampDetail, setSelectedStampDetail] = useState<{
    slotNum: number
    cardNum: number
    globalStampNum: number
    isFilled: boolean
    date: string | null
  } | null>(null)

  const hasClaimedRef = useRef(false)
  const claimedStoreIdRef = useRef<string | null>(initialStoreId || null)

  // Auto-redirect if already claimed by current user
  useEffect(() => {
    if (claimedByMe) {
      const timer = setTimeout(() => {
        const dest = initialStoreId ? `/card?storeId=${initialStoreId}&claimed=true` : '/card?claimed=true'
        window.location.href = dest
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [claimedByMe, initialStoreId])

  // 1. Check user session on mount
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setAuthChecking(false)

      if (session?.user && !hasClaimedRef.current && !initialError && !claimedByMe) {
        startLoadingSequence(session.user)
      }
    }
    checkAuth()
  }, [initialError, claimedByMe])

  // 2. Loading animation & claim execution
  function startLoadingSequence(currentUser: any) {
    if (hasClaimedRef.current) return
    hasClaimedRef.current = true

    setScene('loading')

    // Trigger atomic claim API in background
    executeClaim(currentUser)

    // Bagi animasi maskot main satu kitaran penuh sebelum redirect
    setTimeout(() => {
      const storeId = claimedStoreIdRef.current
      try {
        sessionStorage.setItem('lajus_just_claimed', 'true')
      } catch {}
      window.location.href = storeId ? `/card?storeId=${storeId}&claimed=true` : '/card?claimed=true'
    }, LOADING_ANIMATION_DURATION + REDIRECT_BUFFER)
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
        // Friendly message for customer quota limit (Free Plan)
        if (data.code === 'customer_limit_reached') {
          setClaimError(t.errorScene.customerLimitReached)
        } else {
          setClaimError(data.error || t.errorScene.defaultError)
        }
        setScene('error')
        return
      }

      claimedStoreIdRef.current = data.storeId || null
      const gUrl = data.googleReviewUrl || null
      setGoogleReviewUrl(gUrl)

      if (gUrl) {
        setTimeout(() => {
          setShowReviewPopup(true)
        }, 2500)
      }

      const total = data.newTotal ?? initialStampCount
      const req = data.stampsRequired ?? initialStampsRequired ?? 10
      const stampsAdded = data.stampsAdded ?? initialStampCount
      const previousStamps = data.previousStamps ?? 0
      const fullCards = Math.floor(total / req)
      const rem = total % req
      const totalCards = Math.max(1, fullCards + (rem > 0 ? 1 : 0))
      setSelectedCardIdx(totalCards - 1)

      // Store in sessionStorage for /card to animate & focus on active card
      try {
        sessionStorage.setItem('lajus_claimed_stamps', JSON.stringify({
          storeId: data.storeId || null,
          stampsAdded,
          previousStamps,
          newTotal: total,
          stampsRequired: req,
        }))
        sessionStorage.setItem('lajus_just_claimed', 'true')
      } catch {}

      setClaimData({
        previousStamps,
        newTotal: total,
        stampsAdded,
        stampsRequired: req,
        rewardDescription:
          data.rewardDescription ?? initialRewardDesc ?? (lang === 'en' ? '1 free drink' : '1 minuman percuma'),
        storeName: data.storeName ?? initialStoreName ?? 'Kopi & Kawan',
        logoUrl: data.logoUrl || '',
        rewardImageUrl: data.rewardImageUrl || '',
        rewards: Array.isArray(data.rewards) ? data.rewards : [],
      })
    } catch (err: any) {
      console.error('Error claiming token:', err)
      setClaimError(t.errorScene.connError)
      setScene('error')
    }
  }

  function handleCloseReviewPopup() {
    setShowReviewPopup(false)
    setReviewRating(0)
  }

  function handleSelectStarAndReview(star: number) {
    setReviewRating(star)
    if (googleReviewUrl) {
      setTimeout(() => {
        window.open(googleReviewUrl, '_blank')
        setShowReviewPopup(false)
        setReviewRating(0)
      }, 250)
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
      setAuthError(t.loginScene.fillEmailPassword)
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
      setAuthError(err.message || t.loginScene.authFailed)
    } finally {
      setIsAuthenticating(false)
    }
  }

  if (authChecking) {
    return (
      <div className="font-space text-xs text-[#5B6B64] text-center">
        {t.authChecking}
      </div>
    )
  }

  // -------------------------------------------------------------
  // ERROR SCENE
  // -------------------------------------------------------------
  if (scene === 'error') {
    let errorTitle = t.errorScene.unsuccessfulTitle
    let errorDesc = claimError || initialError || t.errorScene.defaultError

    if (errorCode === 'already_claimed') {
      errorTitle = tServer.alreadyClaimedTitle
      errorDesc = tServer.alreadyClaimed
    } else if (errorCode === 'expired') {
      errorTitle = tServer.expiredTitle
      errorDesc = tServer.expired
    } else if (errorCode === 'not_found') {
      errorTitle = tServer.notFoundTitle
      errorDesc = tServer.notFound
    }

    return (
      <div className="w-full max-w-[380px] flex flex-col items-center anim-result">
        {/* TOP TOGGLE */}
        <div className="w-full flex items-center justify-end mb-4">
          <div className="flex items-center bg-white border border-[#F0DEC0] rounded-full p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => switchLang('my')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all cursor-pointer font-jakarta ${
                lang === 'my'
                  ? 'bg-[#FF7A45] text-white shadow-xs'
                  : 'text-[#96806B] hover:text-[#2B1B12]'
              }`}
            >
              MY
            </button>
            <button
              type="button"
              onClick={() => switchLang('en')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all cursor-pointer font-jakarta ${
                lang === 'en'
                  ? 'bg-[#FF7A45] text-white shadow-xs'
                  : 'text-[#96806B] hover:text-[#2B1B12]'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="w-full bg-[#FFFDF8] border border-[#F0DEC0] rounded-[24px] p-6 sm:p-7 text-[#2B1B12] text-center shadow-xl">
          <div className="w-14 h-14 rounded-full bg-red-100 text-[#B23A2E] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <div className="font-fraunces font-bold text-xl text-[#1B0F09] mb-2">
            {errorTitle}
          </div>
          <div className="text-[13.5px] text-[#96806B] mb-6 leading-relaxed">
            {errorDesc}
          </div>
          <a
            href="/card"
            className="inline-block w-full py-3 px-4 bg-[#FF7A45] hover:bg-[#E23F2E] text-white rounded-xl font-bold text-sm transition text-center cursor-pointer shadow-md"
          >
            {t.errorScene.viewMyCard}
          </a>
          <div className="mt-4 pt-3.5 border-t border-[#F0DEC0] text-xs text-[#96806B] text-center">
            <a
              href="https://lajus.lajuq.my/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF7A45] hover:text-[#E23F2E] font-semibold underline underline-offset-2 inline-flex items-center gap-1 transition"
            >
              <span>{t.errorScene.useAtYourStore}</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // CLAIMED BY ME SCENE (FRIENDLY CONFIRMATION)
  // -------------------------------------------------------------
  if (claimedByMe) {
    return (
      <div className="w-full max-w-[380px] flex flex-col items-center anim-result">
        {/* TOP TOGGLE */}
        <div className="w-full flex items-center justify-end mb-4">
          <div className="flex items-center bg-white border border-[#F0DEC0] rounded-full p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => switchLang('my')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all cursor-pointer font-jakarta ${
                lang === 'my'
                  ? 'bg-[#FF7A45] text-white shadow-xs'
                  : 'text-[#96806B] hover:text-[#2B1B12]'
              }`}
            >
              MY
            </button>
            <button
              type="button"
              onClick={() => switchLang('en')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all cursor-pointer font-jakarta ${
                lang === 'en'
                  ? 'bg-[#FF7A45] text-white shadow-xs'
                  : 'text-[#96806B] hover:text-[#2B1B12]'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="w-full bg-[#FFFDF8] border border-[#F0DEC0] rounded-[24px] p-6 sm:p-7 text-[#2B1B12] text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md">
            <svg className="w-9 h-9 stroke-emerald-600" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="font-fraunces font-bold text-xl text-[#1B0F09] mb-1">
            {lang === 'en' ? 'Stamp Already Claimed!' : 'Cop Telah Berjaya Dituntut!'}
          </div>
          <div className="text-xs text-[#96806B] mb-5 leading-relaxed">
            {lang === 'en'
              ? `You have already claimed +${initialStampCount} stamp(s) for ${initialStoreName}. Open your card to view your updated balance.`
              : `Anda telah pun menuntut +${initialStampCount} cop untuk ${initialStoreName}. Buka kad anda untuk melihat baki cop terkini.`}
          </div>
          <a
            href={initialStoreId ? `/card?storeId=${initialStoreId}&claimed=true` : '/card?claimed=true'}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[#FF7A45] hover:bg-[#E23F2E] text-white rounded-xl font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
          >
            <span>{lang === 'en' ? 'Open My Stamp Card →' : 'Buka Kad Cop Saya →'}</span>
          </a>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // 1. LOGIN SCENE (SUSUNAN ASAL KHAS UNTUK /CLAIM)
  // -------------------------------------------------------------
  if (scene === 'login' && !user) {
    return (
      <div className="w-full max-w-[380px] flex flex-col items-center anim-result">
        {/* TOP TOGGLE */}
        <div className="w-full flex items-center justify-end mb-4">
          <div className="flex items-center bg-white border border-[#F0DEC0] rounded-full p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => switchLang('my')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all cursor-pointer font-jakarta ${
                lang === 'my'
                  ? 'bg-[#FF7A45] text-white shadow-xs'
                  : 'text-[#96806B] hover:text-[#2B1B12]'
              }`}
            >
              MY
            </button>
            <button
              type="button"
              onClick={() => switchLang('en')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all cursor-pointer font-jakarta ${
                lang === 'en'
                  ? 'bg-[#FF7A45] text-white shadow-xs'
                  : 'text-[#96806B] hover:text-[#2B1B12]'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* STORE LOGO / BRAND ICON & HEADER */}
        <div className="text-center mb-6">
          <div className="relative w-16 h-16 rounded-full bg-white mx-auto mb-3 shadow-md flex items-center justify-center p-1 overflow-hidden border-2 border-[#F0DEC0]">
            {initialLogoUrl && !loginLogoError ? (
              <>
                {/* ANIMASI LOADING PROFILE: Berterusan sehingga gambar selesai dimuatkan */}
                {loginLogoLoading && (
                  <div className="absolute inset-0 bg-[#FFF7EA] flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-[2.5px] border-[#FF7A45] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={initialLogoUrl}
                  alt={initialStoreName || 'Logo Kedai'}
                  ref={(el) => {
                    if (el && el.complete && el.naturalWidth > 0) {
                      setLoginLogoLoading(false)
                    }
                  }}
                  onLoad={() => setLoginLogoLoading(false)}
                  onError={() => {
                    setLoginLogoError(true)
                    setLoginLogoLoading(false)
                  }}
                  className={`w-full h-full rounded-full object-cover transition-opacity duration-300 ${
                    loginLogoLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              </>
            ) : (
              /* JIKA KOSONG / GAGAL / ROSAK: GANTIKAN LOGO LAJUS */
              <div className="w-full h-full p-2.5 flex items-center justify-center">
                <img src="/logo.svg" alt="LajuS" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
          <div className="text-xs text-[#96806B] font-medium">
            {t.loginScene.claimHeaderPrefix} <span className="text-[#FF7A45] font-bold">+{initialStampCount} {lang === 'en' ? 'Stamps' : 'Cop Stamp'}</span> {t.loginScene.claimHeaderSuffix} <span className="font-bold text-[#2B1B12]">{initialStoreName}</span>
          </div>
        </div>

        {authError && (
          <div className="w-full mb-3.5 p-3 rounded-xl bg-red-100 border border-red-200 text-[#B23A2E] text-xs font-semibold text-center">
            {authError}
          </div>
        )}

        {/* GOOGLE LOGIN BUTTON (STANDALONE BOX) */}
        <button
          onClick={handleGoogleLogin}
          disabled={isAuthenticating}
          className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-[#FFF7EA] active:scale-[0.98] border border-[#F0DEC0] rounded-2xl py-3.5 px-4 font-jakarta font-semibold text-[14px] text-[#2B1B12] cursor-pointer transition shadow-sm disabled:opacity-60"
        >
          <svg viewBox="0 0 18 18" width="18" height="18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
          </svg>
          <span>{t.loginScene.loginWithGoogle}</span>
        </button>

        {/* DROPDOWN TOGGLE: ATAU EMAIL MANUAL */}
        <div className="w-full flex items-center justify-center my-3.5">
          <button
            type="button"
            onClick={() => setShowManualEmail(!showManualEmail)}
            className="inline-flex items-center gap-1.5 text-xs text-[#96806B] hover:text-[#2B1B12] font-semibold py-1.5 px-3 rounded-full hover:bg-black/5 transition cursor-pointer"
          >
            <span>{t.loginScene.orManualEmail}</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${showManualEmail ? 'rotate-180 text-[#FF7A45]' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* EXPANDABLE MANUAL EMAIL LOGIN (SLIDE DOWN) */}
        {showManualEmail && (
          <form onSubmit={handleEmailAuth} className="w-full space-y-2.5 anim-result">
            <div className="flex items-center gap-2.5 bg-white border border-[#F0DEC0] rounded-xl p-2.5 shadow-sm">
              <svg className="w-4 h-4 shrink-0 text-[#96806B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
                placeholder={t.loginScene.usernameOrEmail}
                className="border-none outline-none flex-1 font-jakarta text-sm text-[#2B1B12] bg-transparent placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-2.5 bg-white border border-[#F0DEC0] rounded-xl p-2.5 shadow-sm">
              <svg className="w-4 h-4 shrink-0 text-[#96806B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={100}
                placeholder={t.loginScene.password}
                className="border-none outline-none flex-1 font-jakarta text-sm text-[#2B1B12] bg-transparent placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full border-none rounded-xl py-3 px-4 bg-gradient-to-r from-[#FF7A45] to-[#E8901B] text-white font-bold text-sm cursor-pointer active:scale-[0.98] transition disabled:opacity-60 shadow-md"
            >
              {isAuthenticating
                ? t.loginScene.processing
                : isSignup
                ? t.loginScene.signupBtn
                : t.loginScene.loginBtn}
            </button>

            <div className="text-center pt-1 text-xs text-[#96806B]">
              {isSignup ? t.loginScene.alreadyHaveAccount : t.loginScene.newAccount}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-[#FF7A45] font-bold underline cursor-pointer hover:text-[#E23F2E]"
              >
                {isSignup ? t.loginScene.loginLink : t.loginScene.signupLink}
              </button>
            </div>
          </form>
        )}
      </div>
    )
  }

  // -------------------------------------------------------------
  // 2. LOADING SCENE
  // -------------------------------------------------------------
  if (scene === 'loading') {
    return (
      <div className="w-full max-w-[360px] flex flex-col items-center anim-result py-8">
        <div className="relative w-[200px] h-[176px] mb-5">
          <div className="sd-desk" />

          <div className="sd-flash" />
          <div className="sd-dust d1" />
          <div className="sd-dust d2" />
          <div className="sd-dust d3" />
          <div className="sd-dust d4" />
          <div className="sd-ring r1" />
          <div className="sd-ring r2" />

          <div className="sd-whiff" />
          <div className="sd-whiff w2" />

          <div className="sd-card">
            <div className="sd-emote">
              <span className="e1">🙂</span>
              <span className="e2">😝💨</span>
              <span className="e3">😜💨</span>
              <span className="e4">😳</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 328.373" style={{ width: '100%', height: '100%', display: 'block', borderRadius: 6 }}>
              <path fill="#BCD9E4" d="M37.397 0h437.206C495.172 0 512 16.844 512 37.397v253.579c0 20.553-16.844 37.397-37.397 37.397H37.397C16.844 328.373 0 311.545 0 290.976V37.397C0 16.827 16.827 0 37.397 0z"/>
              <path fill="#87B1BE" d="M37.397 0h437.206C495.172 0 512 16.851 512 37.397v35.915H0V37.397C0 16.827 16.827 0 37.397 0z"/>
              <path fill="#85A9B3" d="M262.722 222.148c-3.119 0-5.629-3.373-5.629-7.507 0-4.134 2.51-7.506 5.629-7.506h194.095c3.119 0 5.629 3.372 5.629 7.506s-2.51 7.507-5.629 7.507H262.722zm.003 45.418c-3.118 0-5.632-3.369-5.632-7.507 0-4.134 2.514-7.506 5.632-7.506h194.092c3.119 0 5.633 3.372 5.633 7.506 0 4.138-2.514 7.507-5.633 7.507H262.725zm-.003-136.068c-3.119 0-5.629-3.372-5.629-7.507 0-4.137 2.51-7.506 5.629-7.506h139.05c3.119 0 5.633 3.369 5.633 7.506 0 4.135-2.514 7.507-5.633 7.507h-139.05zm0 45.325c-3.119 0-5.629-3.369-5.629-7.506 0-4.134 2.51-7.507 5.629-7.507h193.895c3.118 0 5.629 3.373 5.629 7.507 0 4.137-2.511 7.506-5.629 7.506H262.722z"/>
              <path fill="#194794" fillRule="nonzero" d="M159.457 203.665c5.761 12.822 19.363 15.086 30.833 17.303 16.777 3.241 37.565 19.084 37.565 37.039v7.317a2.246 2.246 0 01-2.244 2.241H51.798a2.246 2.246 0 01-2.244-2.241v-6.62c0-21.574 21.815-34.317 39.444-36.676 12.826-1.715 23.5-3.455 28.014-18.959 1.168 1.023 2.395 2.056 3.646 3.169 11.684 10.387 24.848 10.838 36.104-.017.925-.895 1.829-1.737 2.695-2.556z"/>
              <path fill="#D2A75F" fillRule="nonzero" d="M159.457 203.668c3.014 6.706 8.173 10.526 14.046 12.957-19.867 14.576-47.295 13.734-67.727 1.277 6.189-3.334 9.288-8.16 11.229-14.836 1.168 1.023 2.399 2.056 3.653 3.172 11.684 10.387 24.848 10.838 36.104-.017.925-.895 1.829-1.737 2.695-2.553z"/>
              <path fill="#DBB26F" fillRule="nonzero" d="M139.81 227.397c-11.881.053-23.831-3.277-34.034-9.495 6.166-3.32 9.344-8.223 11.232-14.836 1.172 1.023 2.396 2.056 3.65 3.172 6.136 5.455 12.687 8.169 19.152 7.946v13.213z"/>
              <path fill="#E9BE79" d="M98.547 168.146c1.542-4.412 5.125-2.993 10.234-1.128l-.046-.225.046.027c3.607-37.862 27.794-16.735 46.181-35.829l.621-.492a38.667 38.667 0 013.132 1.746c7.838 5.267 12.59 14.863 11.17 33.618l.05-.04a94.616 94.616 0 01-.508 3.313c4.647-3.521 11.342-3.191 9.237 4.604l-2.878 8.148c-.69 1.954-1.148 2.66-3.614 2.528-1.088-.06-2.184-.479-3.276-1.201 1.009 12.025-4.828 15.949-12.135 23.001-11.253 10.861-24.421 10.412-36.1.02-6.844-6.085-12.92-9.781-13.223-22.292-1.772.544-3.449.643-4.914-.191-2.921-1.66-3.983-6.495-4.141-9.591-.067-1.243-.014-4.748.164-6.016z"/>
              <path fill="#F2CD8C" d="M98.547 168.146c1.543-4.413 5.126-2.993 10.235-1.13l-.046-.22.046.025c2.663-27.955 16.542-23.751 31.027-27.321v74.683c-6.464.226-13.012-2.486-19.149-7.946-6.842-6.086-12.919-9.78-13.22-22.292-1.774.543-3.452.642-4.916-.191-4.251-2.419-4.594-11.169-3.977-15.608z"/>
              <path fill="#333231" d="M89.715 128.611c22.538-27.85 48.515-42.998 68.022-18.222 23.904 1.255 32.196 40.258 12.147 55.475 1.606-21.185-4.665-30.686-14.362-35.461-18.456 20.125-43.096-1.828-46.74 36.417l-8.845-4.606c-.879-10.97 1.691-30-10.222-33.603z"/>
            </svg>

            <div className="sd-ink"><span>COP!</span></div>
          </div>

          <div className="sd-stamp">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
              <path transform="translate(0,0)" fill="rgb(36,47,57)" d="M 1153.84 211.422 C 1170.61 209.737 1200.25 210.718 1217.1 212.043 C 1296.27 217.926 1373.33 240.303 1443.34 277.736 C 1678.92 405.469 1646.61 652.896 1460.5 805.298 C 1401.44 853.661 1335.76 917.847 1329.61 997.998 C 1326.74 1035.42 1336.28 1071.56 1356.43 1103.04 C 1359.03 1107.1 1365 1117.08 1369.09 1118.62 C 1417.24 1136.84 1429.65 1165.34 1458.12 1206.09 L 1530.28 1308.99 L 1590.53 1393.94 C 1620.15 1435.85 1645.02 1464.66 1637.21 1519.05 C 1633.53 1544.75 1624.2 1564.71 1615.1 1588.6 L 1590.86 1652.92 C 1582.1 1676.56 1567.88 1720.57 1557.32 1741.37 C 1554 1747.9 1549.27 1753.63 1543.48 1758.12 C 1527.39 1770.38 1511.37 1768.87 1493.03 1766.19 C 1485.96 1786.9 1480.27 1810.68 1461.65 1824.22 C 1439.33 1840.47 1414.89 1833.89 1389.86 1829.53 L 1322.57 1817.29 L 1099.13 1777.78 C 1055.95 1771.48 1007.7 1761.76 964.495 1754.03 L 766.997 1719.2 L 675.318 1703.1 C 654.194 1699.43 619.725 1694.47 601.045 1686.83 C 586.911 1681.12 574.231 1672.32 563.928 1661.08 C 553.867 1650.1 539.573 1628.8 530.411 1616.05 L 473.64 1536.95 L 414.044 1453.46 C 405.53 1441.64 396.174 1427.97 387.462 1416.48 C 360.336 1380.7 359.892 1360.58 376.928 1320.23 C 360.855 1297.04 341.909 1268.37 351.565 1239.03 C 367.393 1190.94 385.807 1143.7 402.241 1095.8 C 408.079 1078.78 414.1 1061.53 421.517 1045.16 C 437.795 1008.44 468.211 983.169 507.29 973.727 C 540.295 965.753 570.863 972.174 603.586 978.387 L 660.912 989.197 C 669.131 990.789 698.126 997.465 704.197 996.105 C 763.949 982.719 822.78 949.487 863.251 903.273 C 919.872 838.618 920.098 750.215 902.816 670.743 C 893.312 628.712 882.28 589.566 879.456 546.279 C 867.125 357.296 957.329 224.699 1153.84 211.422 z"/>
              <path transform="translate(0,0)" fill="rgb(251,116,20)" d="M 1154.87 254.425 C 1189.01 250.892 1241.85 256.637 1275.7 262.897 C 1300.99 267.575 1338.17 277.662 1361.63 288.879 C 1366.37 291.628 1370.12 296.502 1373.1 300.84 C 1414.16 360.586 1410.6 428.075 1389.77 494.437 C 1354.94 605.366 1255.18 673.298 1203.73 774.181 C 1160.49 858.98 1154.3 964.806 1200.26 1049.94 C 1208.15 1064.62 1217.08 1077.79 1226.34 1091.59 C 1207.36 1089.11 1188.96 1085.17 1170.18 1081.72 L 1088.78 1067 L 787.539 1012.41 C 833.103 987.824 861.187 970.696 896.123 930.393 C 960.123 856.562 964.856 762.026 946.324 670.541 C 937.092 627.404 925.457 586.938 922.568 542.681 C 911.928 379.691 984.097 266.572 1154.87 254.425 z"/>
              <path transform="translate(0,0)" fill="rgb(255,255,255)" d="M 979.481 520.204 C 985.492 520.466 995.451 523.434 996.953 530.302 C 1001.78 551.19 1002.35 573.553 1006.71 594.781 C 1026.43 690.781 1042.06 790.118 1001.35 883.197 C 990.692 907.552 957.758 966.2 932.234 976.573 C 923.868 976.472 913.723 974.015 911.169 965.018 C 906.841 949.769 922.09 937.566 930.516 926.987 C 942.381 912.091 951.741 898.916 960.093 881.812 C 976.343 848.086 986.095 811.602 988.84 774.266 C 990.861 748.542 989.735 728.986 986.664 703.437 C 984.421 685.201 981.684 667.03 978.457 648.942 C 972.513 614.881 964.109 580.717 962.6 546.127 C 961.966 531.592 964.508 523.724 979.481 520.204 z"/>
              <path transform="translate(0,0)" fill="rgb(255,255,255)" d="M 1144.7 289.267 C 1158.69 287.201 1170.73 297.914 1167.53 312.073 C 1164.16 326.993 1137.02 330.089 1123.71 334.381 C 1111.67 338.291 1100.06 343.449 1089.09 349.771 C 1050.7 372.052 1021.42 408.373 1009.71 451.396 C 1006.64 462.656 1006.09 466.609 995.728 472.562 C 941.493 479.708 991.177 394.787 1002.86 378.176 C 1036.19 330.769 1088.25 299.669 1144.7 289.267 z"/>
              <path transform="translate(0,0)" fill="rgb(251,116,20)" d="M 529.594 1012.27 C 548.457 1009.54 602.002 1021.95 623.764 1025.89 L 775.039 1053.49 L 1115.06 1115.31 L 1271.38 1143.78 C 1298.64 1148.56 1326.8 1152.53 1353.48 1159.22 C 1368.31 1162.94 1375.33 1181.47 1371.68 1195.17 C 1364.23 1223.19 1353.06 1251.34 1343.24 1278.61 L 1293.53 1417.45 C 1278.24 1415.05 1262.98 1412.46 1247.76 1409.67 L 663.418 1303.62 C 573.727 1287.32 481.246 1272 392.214 1254.03 C 404.506 1215.77 419.119 1175.92 433.19 1138.19 C 454.861 1080.08 459.369 1024.56 529.594 1012.27 z"/>
              <path transform="translate(0,0)" fill="rgb(255,255,255)" d="M 540.548 1050.27 C 563.442 1048.14 621.266 1062.8 647.054 1066.37 C 667.095 1069.67 685.208 1073.18 705.234 1077.16 C 727.582 1081.59 729.056 1107.1 710.301 1115.59 C 704.021 1118.43 680.403 1112.9 672.29 1111.35 L 596.06 1096.98 C 578.348 1093.67 550.917 1085.29 534.935 1093.82 L 533.756 1094.46 C 515.436 1108.6 497.742 1187.9 485.058 1210.98 C 478.71 1222.53 467.205 1225.91 456.605 1218.88 C 436.593 1205.62 462.963 1165.08 466.68 1147.26 C 483.286 1103.35 486.756 1059.27 540.548 1050.27 z"/>
              <path transform="translate(0,0)" fill="rgb(255,255,255)" d="M 766.364 1089.11 C 770.785 1088.93 775.733 1089.63 779.808 1091.4 C 784.784 1093.57 788.705 1097.61 790.718 1102.65 C 792.63 1107.5 792.413 1112.94 790.121 1117.63 C 786.86 1124.29 782.394 1126.34 775.914 1128.8 C 748.09 1130.23 739.211 1098.6 766.364 1089.11 z"/>
              <path transform="translate(0,0)" fill="rgb(49,61,72)" d="M 428.109 1398.75 C 480.252 1405.57 540.986 1418.81 593.908 1428.16 L 958.277 1494.09 C 1047.06 1510.41 1138.33 1525.36 1226.79 1544 C 1251.16 1549.14 1267.66 1577.13 1281.53 1596.31 C 1300.32 1622.25 1318.91 1648.34 1337.29 1674.57 L 1394.81 1755 C 1401.9 1765.09 1414.9 1781.76 1420.03 1791.99 L 857.48 1691.7 L 697.685 1663.85 C 674.745 1659.76 651.642 1656.05 628.86 1651.2 C 601.624 1645.4 587.591 1621.71 572.416 1600.85 L 529.659 1540.88 L 464.167 1449.99 C 453.731 1435.47 437.075 1413.61 428.109 1398.75 z"/>
              <path transform="translate(0,0)" fill="rgb(255,255,255)" d="M 659.799 1451.04 C 688.779 1450.56 694.803 1470 718.341 1480.55 C 735.897 1488.43 758.293 1481.84 774.322 1495.6 C 786.601 1506.14 784.14 1522.27 794.79 1533.71 C 806.998 1547.49 825.368 1552.37 836.723 1566.64 C 850.457 1585.49 828.399 1588.14 825.056 1600.95 C 822.854 1610.75 840.098 1626.75 836.661 1636 C 830.065 1653.77 798.748 1634.62 785.904 1639.65 C 773.735 1644.43 774.901 1653.03 764.125 1658.61 C 738.302 1660.43 725.519 1636.87 703.075 1628.29 C 691.636 1623.91 680.533 1625.46 669.017 1623.01 C 633.332 1615.43 644.689 1593.65 627.349 1575.08 C 618.089 1565.17 595.254 1558.37 586.537 1544.35 C 574.668 1525.25 600.217 1524.67 601.025 1511 C 601.556 1502.02 586.468 1486.21 588.828 1474.74 C 598.615 1460.5 624.804 1476.78 638.563 1471.67 C 650.605 1467.21 647.197 1457.48 659.799 1451.04 z"/>
              <path transform="translate(0,0)" fill="rgb(234,135,155)" d="M 666.915 1497.3 C 708.329 1493.46 757.033 1520.17 779.525 1553.29 C 805.851 1592.06 774.46 1613.68 737.318 1601.02 C 718.307 1594.55 694.369 1581.24 684.29 1563.68 C 668.197 1535.64 695.932 1526.23 718.097 1536.41 C 726.266 1539.97 746.277 1551.17 741.652 1561.57 C 728.725 1568.23 716.965 1538.44 700.566 1549.77 C 695.619 1560.15 708.793 1573.03 716.357 1578.95 C 723.744 1583.41 733.244 1587.6 741.932 1588.32 C 788.505 1592.19 765.58 1550.64 744.23 1534.93 C 726.783 1522.09 709.784 1512.57 687.4 1512.39 C 669.515 1512.03 653.352 1518.95 655.433 1539.49 C 657.738 1562.23 675.616 1577.29 692.781 1589.93 C 697.179 1593.17 706.84 1599.92 707.265 1605.52 L 705.858 1607.11 C 679.07 1613.27 586.768 1514.84 666.915 1497.3 z"/>
              <path transform="translate(0,0)" fill="rgb(245,191,151)" d="M 994.799 1539.4 C 1011 1537.24 1039.99 1540.02 1055.98 1543.15 C 1141.92 1559.96 1229.91 1612.32 1280.85 1684.14 C 1288.64 1695.12 1309.85 1731.85 1307.34 1745.09 C 1300.85 1753.87 1282.07 1747.43 1277 1741.43 C 1270.77 1734.06 1267.93 1717.72 1263.09 1708.28 C 1248.1 1679.04 1226.83 1656.3 1202.04 1635.28 C 1190.52 1625.59 1176.36 1616.14 1163.39 1608.28 C 1116.78 1580.02 1048.44 1557.43 993.846 1570.94 C 955.532 1580.42 930.158 1607.57 931.184 1648.61 C 931.448 1658.52 938.027 1673.47 933.384 1682.46 C 929.64 1689.72 913.289 1683.18 908.332 1679.47 C 899.84 1673.12 897.884 1661.01 896.526 1650.99 C 887.093 1581.35 930.147 1547.01 994.799 1539.4 z"/>
              <path transform="translate(0,0)" fill="rgb(245,191,151)" d="M 1034.58 1600.35 C 1036.87 1600.08 1039.17 1599.89 1041.47 1599.79 C 1112.17 1596.9 1195.61 1646.92 1228.49 1709.84 C 1247.91 1747.01 1212.09 1739.63 1206.71 1730.31 C 1191.77 1704.43 1189.77 1693.09 1166.25 1670.89 C 1129.17 1640.2 1063 1607.09 1018.32 1643.35 C 996.563 1661.01 1016.17 1696.44 999.895 1697.94 C 963.725 1701.27 965.111 1647.56 981.257 1627.32 C 995.286 1609.74 1012.48 1603.41 1034.58 1600.35 z"/>
              <path transform="translate(0,0)" fill="rgb(251,116,20)" d="M 1415.56 312.43 C 1417.6 313.002 1419.36 313.948 1421.24 314.905 C 1482.55 346.098 1536.68 397.447 1558.11 464.034 C 1570.35 502.065 1569.27 542.191 1560.34 580.816 C 1521.04 750.916 1379.39 776.097 1311.2 910.977 C 1285.66 961.481 1278.37 1019.7 1296.23 1073.84 C 1299.22 1084.33 1304.85 1096.81 1309.18 1107 C 1301.7 1105.62 1283.95 1103.9 1278.43 1100.37 C 1250.17 1082.28 1224.16 1035.16 1213.63 1005.63 C 1198.66 963.676 1194.75 918.574 1202.25 874.665 C 1207.61 842.31 1218.02 810.997 1233.1 781.872 C 1249.13 751.621 1275.76 718.127 1297.51 691.67 C 1337.46 643.063 1376.79 598.892 1403.44 541.111 C 1430.55 482.346 1442.71 417.817 1428.34 353.655 C 1424.89 338.24 1420.8 327.124 1415.56 312.43 z"/>
              <path transform="translate(0,0)" fill="rgb(251,116,20)" d="M 1411.49 1215.58 C 1415.17 1218.39 1456.27 1279.65 1462.19 1288.04 C 1490.56 1327.67 1518.63 1367.52 1546.41 1407.57 C 1565.18 1434.25 1592.24 1463.35 1594.84 1496.44 C 1596.58 1518.52 1587.83 1537.94 1580.23 1558.03 L 1561.36 1608.49 L 1532.4 1687.27 C 1530.62 1692.21 1525.39 1712.21 1521.97 1714.16 L 1520.07 1712.15 C 1516.24 1707.14 1512.57 1701.91 1508.98 1696.72 C 1481.8 1657.5 1454.65 1618.18 1427.23 1579.13 L 1362.99 1487.97 C 1352.42 1472.89 1340.5 1456.85 1330.78 1441.39 C 1358.11 1366.27 1385.01 1291 1411.49 1215.58 z"/>
              <path transform="translate(0,0)" fill="rgb(49,61,72)" d="M 428.264 1303.92 C 451.342 1309.43 487.831 1314.86 512.429 1319.36 L 697.3 1352.79 L 1265.36 1455.65 C 1260.55 1470.85 1253.58 1488.52 1248.08 1503.7 C 1247.2 1503.9 1136.14 1482.8 1127.31 1481.2 L 411.13 1351.54 C 417.101 1335.76 422.813 1319.89 428.264 1303.92 z"/>
              <path transform="translate(0,0)" fill="rgb(49,61,72)" d="M 1302.91 1478.6 C 1306.56 1482.21 1317.38 1498.03 1320.75 1502.83 L 1358.78 1557.62 C 1395.29 1609.95 1432.54 1659.06 1467.53 1713.05 C 1463.95 1727.15 1455.98 1746.11 1449.82 1759.44 C 1439.97 1743.1 1424.72 1723.12 1413.36 1707.12 L 1337.1 1600.27 C 1320.28 1576.96 1298.92 1548.99 1284.39 1524.98 C 1291.12 1510.38 1296.05 1492.1 1302.91 1478.6 z"/>
            </svg>
          </div>
        </div>

        <div className="font-space text-[12px] font-bold tracking-[0.14em] uppercase text-[#FF7A45] opacity-95 mb-3.5">
          {t.loadingScene.processingStamp}
        </div>

        <style jsx>{`
          .sd-desk{
            position:absolute; left:0; right:0; bottom:22px; height:9px;
            background:linear-gradient(180deg,#F0DEC0,#DFC39D);
            border-radius:6px;
            box-shadow:0 4px 14px rgba(43,27,18,0.1);
          }

          .sd-whiff{
            position:absolute; left:50%; bottom:30px; width:8px; height:8px;
            margin-left:-4px; border-radius:50%; background:#B7C3C0; opacity:0;
            animation:sdWhiff 6s linear infinite;
          }
          .sd-whiff.w2{ animation-name:sdWhiff2; }
          @keyframes sdWhiff{
            0%,10.5%{ opacity:0; transform:translate(0,0) scale(1); }
            11.5%{ opacity:0.9; transform:translate(-5px,-3px) scale(1.4); }
            15%{ opacity:0; transform:translate(-18px,-20px) scale(0.3); }
            100%{ opacity:0; }
          }
          @keyframes sdWhiff2{
            0%,27.5%{ opacity:0; transform:translate(0,0) scale(1); }
            28.5%{ opacity:0.9; transform:translate(5px,-3px) scale(1.4); }
            32%{ opacity:0; transform:translate(18px,-20px) scale(0.3); }
            100%{ opacity:0; }
          }

          .sd-ring{
            position:absolute; left:50%; bottom:32px; width:14px; height:14px;
            margin-left:-7px; border-radius:50%; border:2.5px solid #FF7A45; opacity:0;
            animation:sdRing 6s linear infinite;
          }
          .sd-ring.r2{ animation-delay:0.05s; border-color:#FFB088; }
          @keyframes sdRing{
            0%,43%{ opacity:0; transform:scale(0.2); }
            45%{ opacity:0.85; transform:scale(0.5); }
            54%{ opacity:0; transform:scale(2.6); }
            100%{ opacity:0; }
          }

          .sd-flash{
            position:absolute; left:50%; bottom:26px; width:150px; height:46px;
            margin-left:-75px; border-radius:50%;
            background:radial-gradient(circle, rgba(255,122,69,0.85) 0%, rgba(255,122,69,0) 70%);
            opacity:0; animation:sdFlash 6s linear infinite;
          }
          @keyframes sdFlash{
            0%,43%{opacity:0;} 45%{opacity:1;} 52%{opacity:0;} 100%{opacity:0;}
          }

          .sd-dust{
            position:absolute; bottom:34px; width:7px; height:7px; border-radius:50%;
            background:#FFB088; opacity:0;
          }
          .sd-dust.d1{ left:50%; margin-left:-30px; animation:sdDust1 6s linear infinite; }
          .sd-dust.d2{ left:50%; margin-left:-7px; animation:sdDust2 6s linear infinite; }
          .sd-dust.d3{ left:50%; margin-left:12px; animation:sdDust3 6s linear infinite; }
          .sd-dust.d4{ left:50%; margin-left:30px; animation:sdDust4 6s linear infinite; }
          @keyframes sdDust1{ 0%,43%{opacity:0; transform:translate(0,0) scale(1);} 45%{opacity:1;} 56%{opacity:0; transform:translate(-32px,-24px) scale(0.3);} 100%{opacity:0;} }
          @keyframes sdDust2{ 0%,43%{opacity:0; transform:translate(0,0) scale(1);} 45%{opacity:1;} 56%{opacity:0; transform:translate(-10px,-32px) scale(0.3);} 100%{opacity:0;} }
          @keyframes sdDust3{ 0%,43%{opacity:0; transform:translate(0,0) scale(1);} 45%{opacity:1;} 56%{opacity:0; transform:translate(12px,-30px) scale(0.3);} 100%{opacity:0;} }
          @keyframes sdDust4{ 0%,43%{opacity:0; transform:translate(0,0) scale(1);} 45%{opacity:1;} 56%{opacity:0; transform:translate(32px,-22px) scale(0.3);} 100%{opacity:0;} }

          .sd-card{
            position:absolute; left:50%; bottom:28px; width:80px; height:52px;
            margin-left:-40px; transform-origin:50% 100%;
            animation:sdCardDodge 6s cubic-bezier(.4,0,.2,1) infinite;
            filter:drop-shadow(0 6px 6px rgba(0,0,0,0.35));
          }
          @keyframes sdCardDodge{
            0%     { transform:translateX(0) rotate(0deg); }
            7%     { transform:translateX(0) rotate(0deg); }
            9%     { transform:translateX(-3px) rotate(-2deg); }
            10.5%  { transform:translateX(-44px) rotate(-10deg); }
            14%    { transform:translateX(-44px) rotate(-10deg); }
            16.5%  { transform:translateX(0) rotate(0deg); }
            22%    { transform:translateX(0) rotate(0deg); }
            25%    { transform:translateX(3px) rotate(2deg); }
            26.5%  { transform:translateX(44px) rotate(10deg); }
            30%    { transform:translateX(44px) rotate(10deg); }
            32.5%  { transform:translateX(0) rotate(0deg); }
            38%    { transform:translateX(0) rotate(0deg); }
            41.5%  { transform:translateX(0) rotate(0deg); }
            44%    { transform:translateX(0) rotate(0deg) scale(1,0.94); }
            48%    { transform:translateX(0) rotate(0deg) scale(1,1); }
            70%    { transform:translateX(0) rotate(0deg) scale(1,1); }
            100%   { transform:translateX(0) rotate(0deg) scale(1,1); }
          }

          .sd-ink{
            position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
            opacity:0; transform:scale(0.3) rotate(-10deg);
            animation:sdInk 6s linear infinite;
          }
          .sd-ink span{
            color:#B53629; font-family:'Courier New', monospace; font-weight:900;
            font-size:15px; letter-spacing:1.5px; border:2.5px solid #B53629;
            padding:2px 8px; border-radius:4px; background:rgba(250,242,226,0.35);
          }
          @keyframes sdInk{
            0%,43.5%{ opacity:0; transform:scale(0.3) rotate(-10deg); }
            46%{ opacity:1; transform:scale(1.15) rotate(-10deg); }
            50%{ opacity:1; transform:scale(1) rotate(-10deg); }
            92%{ opacity:1; transform:scale(1) rotate(-10deg); }
            98%{ opacity:0; transform:scale(0.9) rotate(-10deg); }
            100%{ opacity:0; }
          }

          .sd-emote{ position:absolute; left:50%; top:-8px; transform:translateX(-50%); font-size:18px; }
          .sd-emote span{
            position:absolute; left:0; opacity:0; white-space:nowrap;
            animation-duration:6s; animation-iteration-count:infinite; animation-timing-function:linear;
          }
          .sd-emote .e1{ animation-name:sdE1; }
          .sd-emote .e2{ animation-name:sdE2; }
          .sd-emote .e3{ animation-name:sdE3; }
          .sd-emote .e4{ animation-name:sdE4; }
          @keyframes sdE1{ 0%{opacity:1;} 8%{opacity:1;} 9%{opacity:0;} 100%{opacity:0;} }
          @keyframes sdE2{ 0%,8.5%{opacity:0;} 10%{opacity:1;} 16%{opacity:1;} 17%{opacity:0;} 100%{opacity:0;} }
          @keyframes sdE3{ 0%,25%{opacity:0;} 26.5%{opacity:1;} 32%{opacity:1;} 33%{opacity:0;} 100%{opacity:0;} }
          @keyframes sdE4{ 0%,37%{opacity:0;} 39%{opacity:1;} 44%{opacity:1;} 46%{opacity:1;} 60%{opacity:1;} 65%{opacity:0;} 100%{opacity:0;} }

          .sd-stamp{
            position:absolute; left:50%; bottom:36px; width:74px; height:88px;
            margin-left:-37px; transform-origin:50% 100%;
            animation:sdStampAttack 6s cubic-bezier(.36,.07,.19,.97) infinite;
            filter:drop-shadow(0 10px 8px rgba(0,0,0,0.45));
          }
          @keyframes sdStampAttack{
            0%     { transform:translateY(-62px) rotate(-9deg); }
            5%     { transform:translateY(-66px) rotate(-11deg); }
            10%    { transform:translateY(1px) rotate(1deg) scale(1,1); }
            11%    { transform:translateY(4px) rotate(0deg) scale(1.05,0.9); }
            14%    { transform:translateY(-5px) rotate(0deg) scale(0.97,1.03); }
            17%    { transform:translateY(-62px) rotate(-9deg); }

            22%    { transform:translateY(-66px) rotate(-11deg); }
            27%    { transform:translateY(1px) rotate(1deg) scale(1,1); }
            28%    { transform:translateY(4px) rotate(0deg) scale(1.05,0.9); }
            31%    { transform:translateY(-5px) rotate(0deg) scale(0.97,1.03); }
            33%    { transform:translateY(-62px) rotate(-9deg); }

            38%    { transform:translateY(-70px) rotate(-14deg); }
            42%    { transform:translateY(1px) rotate(1deg) scale(1,1); }
            44%    { transform:translateY(5px) rotate(0deg) scale(1.1,0.86); }
            48%    { transform:translateY(1px) rotate(0deg) scale(0.98,1.02); }
            65%    { transform:translateY(1px) rotate(0deg) scale(1,1); }
            72%    { transform:translateY(-62px) rotate(-9deg); }
            100%   { transform:translateY(-62px) rotate(-9deg); }
          }
        `}</style>
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
      {/* TOP TOGGLE & GOOGLE REVIEW BUTTON */}
      <div className="w-full flex items-center justify-between mb-2">
        {googleReviewUrl ? (
          <button
            type="button"
            onClick={() => setShowReviewPopup(true)}
            title="Google Review"
            className="h-8 px-2.5 rounded-full border border-[#FAF2E2]/15 bg-[#FAF2E2]/[0.06] hover:bg-[#FAF2E2]/15 transition flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
          >
            <img
              src="/Google-Review.svg"
              alt="Google Review"
              className="h-4 w-auto object-contain"
            />
          </button>
        ) : <div />}
        <div className="flex items-center gap-1 bg-[#FAF2E2]/[0.08] border border-[#FAF2E2]/15 rounded-full p-0.5 backdrop-blur-xs">
          <button
            type="button"
            onClick={() => switchLang('my')}
            className={`px-2 py-0.5 text-[10.5px] font-bold rounded-full transition-all cursor-pointer font-space ${
              lang === 'my'
                ? 'bg-[#E5A43B] text-[#1A2422] shadow-xs'
                : 'text-[#FAF2E2]/60 hover:text-[#FAF2E2]'
            }`}
          >
            MY
          </button>
          <button
            type="button"
            onClick={() => switchLang('en')}
            className={`px-2 py-0.5 text-[10.5px] font-bold rounded-full transition-all cursor-pointer font-space ${
              lang === 'en'
                ? 'bg-[#E5A43B] text-[#1A2422] shadow-xs'
                : 'text-[#FAF2E2]/60 hover:text-[#FAF2E2]'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* STORE NAME & LOGO CENTERED AT TOP */}
      <div className="flex flex-col items-center text-center mb-3.5 w-full">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-[#1C2624] font-fraunces font-bold flex items-center justify-center text-3xl shrink-0 shadow-lg mb-2 overflow-hidden border-2 border-[#FAF2E2]/30 ring-2 ring-[#E5A43B]/20 p-1">
          {claimData.logoUrl && !revealLogoError ? (
            <>
              {revealLogoLoading && (
                <div className="absolute inset-0 bg-[#FFF7EA] flex items-center justify-center z-10">
                  <div className="w-7 h-7 border-[2.5px] border-[#E5A43B] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <img
                src={claimData.logoUrl}
                alt={claimData.storeName}
                onLoad={() => setRevealLogoLoading(false)}
                onError={() => {
                  setRevealLogoError(true)
                  setRevealLogoLoading(false)
                }}
                className={`w-full h-full rounded-full object-cover transition-opacity duration-300 ${
                  revealLogoLoading ? 'opacity-0' : 'opacity-100'
                }`}
              />
            </>
          ) : (
            <div className="w-full h-full p-3 flex items-center justify-center">
              <img src="/logo.svg" alt="LajuS" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
        <div className="font-fraunces text-2xl font-bold text-[#F7EEDA] leading-tight">
          {claimData.storeName}
        </div>
        <div className="font-space text-[10px] text-[#5B6B64] tracking-[0.08em] uppercase mt-0.5">
          {t.revealScene.digitalStampBadge(claimData.newTotal)}
        </div>

        {/* ACTION PILLS: INFO 'i' AND REWARD GIFT */}
        <div className="flex items-center justify-center gap-2 mt-2.5">
          <button
            onClick={() => setShowInfoModal(true)}
            title={t.revealScene.howToRedeem}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-[#F7EEDA]/20 bg-[#F7EEDA]/10 text-xs font-semibold text-[#F7EEDA] hover:bg-[#F7EEDA]/20 hover:border-[#E7A33E] transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-[#E7A33E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>{t.revealScene.howToRedeem}</span>
          </button>

          <button
            onClick={() => setShowRewardsModal(true)}
            title={t.revealScene.rewardsBtn}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-[#F7EEDA]/20 bg-[#F7EEDA]/10 text-xs font-semibold text-[#F7EEDA] hover:bg-[#F7EEDA]/20 hover:border-[#E7A33E] transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-[#E7A33E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
            <span>{t.revealScene.rewardsBtn}</span>
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
              {t.revealScene.rewardsReadyBannerTitle(fullCardsCount)}
            </div>
            <div className="text-[11px] text-emerald-200/80">
              {t.revealScene.rewardsReadyBannerDesc(claimData.rewardDescription)}
            </div>
          </div>
        </div>
      )}

      {/* MULTI-CARD TABS */}
      {totalCardsCount > 1 && (
        <div className="w-full flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 no-scrollbar">
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
                <span>{t.revealScene.cardTab(idx + 1)}</span>
                {isFull ? (
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                    {t.revealScene.fullBadge}
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
            <span>{t.revealScene.cardHeader(selectedCardIdx + 1, isViewingFullCard)}</span>
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
            const globalIdx = selectedCardIdx * TOTAL + slotNum - 1

            return (
              <button
                type="button"
                key={slotNum}
                onClick={() => {
                  setSelectedStampDetail({
                    slotNum,
                    cardNum: selectedCardIdx + 1,
                    globalStampNum: globalIdx + 1,
                    isFilled,
                    date: isFilled ? new Date().toISOString() : null,
                  })
                }}
                title={
                  isFilled
                    ? `${t.stampDetailModal.title(slotNum, selectedCardIdx + 1)} • ${t.stampDetailModal.earnedBadge}`
                    : `${t.stampDetailModal.title(slotNum, selectedCardIdx + 1)} • ${t.stampDetailModal.notEarnedBadge}`
                }
                className={`aspect-square rounded-full flex items-center justify-center relative transition-transform duration-150 active:scale-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E5A43B]/60 ${
                  isFilled
                    ? 'bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.18),transparent_55%),#B53629] shadow-[0_4px_8px_rgba(181,54,41,0.38)] hover:scale-105'
                    : 'border-2 border-dashed border-[#E2CE9E] hover:bg-[#FAF2E2]/10'
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
                {isFilled ? (
                  <svg className="w-[54%] h-[54%] pointer-events-none" viewBox="0 0 24 24" fill="none">
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
                ) : (
                  <span className="font-space text-[10.5px] font-bold text-[#E2CE9E]/80 pointer-events-none">
                    {slotNum}
                  </span>
                )}
              </button>
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
              <span>{t.revealScene.cardCompleteReward(claimData.rewardDescription)}</span>
            </div>
          ) : cardRemain > 0 ? (
            <>
              {t.revealScene.cardRemainingReward(cardRemain, claimData.rewardDescription)}
            </>
          ) : (
            <>
              {t.revealScene.cardCongrats(claimData.rewardDescription)}
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
          {t.revealScene.viewAllCards}
        </a>
        <button
          onClick={() => {
            setCardImpact(false)
            setTimeout(() => setCardImpact(true), 100)
          }}
          className="bg-transparent border-none font-space text-[11px] tracking-[0.08em] text-[#5B6B64] opacity-70 cursor-pointer underline underline-offset-[3px] hover:opacity-100"
        >
          {t.revealScene.vibrationAnim}
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
          <span>{t.revealScene.useAtYourStore}</span>
          <span className="text-[10px]">↗</span>
        </a>
      </div>

      {/* 0. POPUP MODAL: BUTIRAN TARIKH & MASA COP STAMP */}
      {selectedStampDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedStampDetail(null)}
        >
          <div
            className="w-full max-w-xs bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-5 shadow-2xl border border-[#E5A43B]/30 anim-popup relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setSelectedStampDetail(null)}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-gray-800 text-base font-bold transition cursor-pointer"
            >
              &times;
            </button>

            {/* STAMP ICON / BADGE */}
            <div className="flex flex-col items-center justify-center mb-3">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md mb-2.5 relative overflow-hidden ${
                  selectedStampDetail.isFilled
                    ? 'bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.22),transparent_55%),#B53629] shadow-[0_6px_15px_rgba(181,54,41,0.4)]'
                    : 'border-2 border-dashed border-[#E2CE9E] bg-[#FAF2E2]/80'
                }`}
              >
                {selectedStampDetail.isFilled ? (
                  <svg className="w-8 h-8 pointer-events-none" viewBox="0 0 24 24" fill="none">
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
                ) : (
                  <span className="font-space text-base font-bold text-[#A89872]">
                    {selectedStampDetail.slotNum}
                  </span>
                )}
              </div>

              <div className="font-fraunces font-bold text-lg text-[#0A1716] leading-tight">
                {t.stampDetailModal.title(selectedStampDetail.slotNum, selectedStampDetail.cardNum)}
              </div>
              <div className="text-[11px] font-space text-[#5E6F68] mt-0.5">
                {claimData.storeName}
              </div>
            </div>

            {selectedStampDetail.isFilled ? (
              <div className="space-y-2.5 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11.5px] font-bold">
                  <span>✓</span>
                  <span>{t.stampDetailModal.earnedBadge}</span>
                </div>

                {/* DATE & TIME CARD */}
                <div className="bg-white rounded-xl p-3 border border-[#E4D9BE] text-left space-y-1.5 shadow-xs">
                  {(() => {
                    const { date, time } = formatStampDateTime(selectedStampDetail.date, lang)
                    return (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 font-medium flex items-center gap-1.5">
                            <span>📅</span>
                            <span>{t.stampDetailModal.dateLabel}:</span>
                          </span>
                          <span className="font-bold text-gray-800">{date}</span>
                        </div>
                        {time && (
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                            <span className="text-gray-500 font-medium flex items-center gap-1.5">
                              <span>⏰</span>
                              <span>{t.stampDetailModal.timeLabel}:</span>
                            </span>
                            <span className="font-bold text-gray-800 font-mono text-[11.5px]">{time}</span>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200/80 text-gray-600 text-[11px] font-semibold">
                  <span>⚪</span>
                  <span>{t.stampDetailModal.notEarnedBadge}</span>
                </div>
                <p className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-[#E4D9BE] leading-relaxed">
                  {t.stampDetailModal.notEarnedHint}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedStampDetail(null)}
              className="w-full py-2.5 bg-[#1E5E53] hover:bg-[#2D786B] text-white font-bold text-xs rounded-xl transition cursor-pointer active:scale-98 shadow-sm"
            >
              {t.stampDetailModal.closeBtn}
            </button>
          </div>
        </div>
      )}

      {/* 1. POPUP MODAL: CARA CLAIM GANJARAN (INFO 'i') */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-[#0A1716]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-6 shadow-2xl border border-[#E5A43B]/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="font-fraunces font-bold text-lg text-[#0A1716]">
                {t.infoModal.title}
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
                  <b>{t.infoModal.step1Title}</b> {t.infoModal.step1Desc}
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <b>{t.infoModal.step2Title}</b> {t.infoModal.step2Desc}
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <b>{t.infoModal.step3Title}</b> {t.infoModal.step3Desc}
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <b>{t.infoModal.step4Title}</b> {t.infoModal.step4Desc}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 bg-[#1E5E53] hover:bg-[#2D786B] text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {t.infoModal.gotItBtn}
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
                {t.rewardsModal.title}
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
                      {t.rewardsModal.stampsRequiredBadge(item.stampsRequired || TOTAL)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRewardsModal(false)}
              className="w-full py-2.5 bg-[#1E5E53] hover:bg-[#2D786B] text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {t.rewardsModal.closeBtn}
            </button>
          </div>
        </div>
      )}

      {/* 3. GOOGLE REVIEW INTERACTIVE SLIDE-UP SHEET (PILIHAN A) */}
      {showReviewPopup && googleReviewUrl && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 anim-fade">
          <div className="w-full max-w-[400px] bg-[#FAF2E2] rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-7 shadow-2xl border-t sm:border border-[#E5A43B]/30 text-[#1C2624] relative text-center anim-scale">
            {/* Top pull handle indicator for mobile */}
            <div className="w-12 h-1.5 bg-[#1C2624]/15 rounded-full mx-auto mb-4 sm:hidden" />

            <button
              onClick={handleCloseReviewPopup}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1C2624]/10 hover:bg-[#1C2624]/20 flex items-center justify-center text-sm font-bold text-[#1C2624] transition cursor-pointer"
            >
              ✕
            </button>

            {/* Google Review Badge Header */}
            <div className="flex items-center justify-center mb-3">
              <div className="bg-white px-3.5 py-1.5 rounded-full shadow-sm border border-[#E4D9BE] flex items-center gap-2">
                <img
                  src="/Google-Review.svg"
                  alt="Google Review"
                  className="h-4 w-auto object-contain"
                />
              </div>
            </div>

            <div className="font-fraunces font-bold text-xl text-[#0A1716] mb-1 leading-tight">
              {lang === 'en' ? `Rate ${claimData.storeName} on Google` : `Nilai ${claimData.storeName} di Google`}
            </div>
            <p className="text-xs text-[#5E6F68] mb-4 leading-relaxed">
              {lang === 'en'
                ? `Help ${claimData.storeName} with a 5-star review on Google!`
                : `Bantu ${claimData.storeName} dengan ulasan 5-bintang di Google!`}
            </p>

            {/* INTERACTIVE 5-STAR SELECTOR (PILIHAN A - TAP STAR TO OPEN REVIEW) */}
            <div className="bg-white/95 border border-[#E4D9BE] rounded-2xl p-5 mb-4 shadow-sm">
              <div className="text-[11.5px] font-semibold text-[#5E6F68] mb-3">
                {lang === 'en'
                  ? `Tap a star below to rate ${claimData.storeName} on Google:`
                  : `Sentuh bintang di bawah untuk ulas ${claimData.storeName} di Google:`}
              </div>
              <div className="flex items-center justify-center gap-2 mb-2.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = reviewRating > 0 && star <= reviewRating
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleSelectStarAndReview(star)}
                      className="p-1 text-4xl sm:text-5xl transition-transform hover:scale-125 active:scale-95 cursor-pointer leading-none"
                      title={`${star} Bintang`}
                    >
                      <span className={isFilled ? 'text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]' : 'text-gray-300 hover:text-amber-300'}>
                        ★
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="text-xs font-bold text-[#1E5E53] min-h-[20px] transition">
                {reviewRating > 0 ? (
                  lang === 'en' ? '⭐ Opening Google Review...' : '⭐ Membuka Google Review...'
                ) : (
                  <span className="text-[#5E6F68]/70 text-[11px] font-normal">
                    {lang === 'en' ? '⭐ 5 stars is greatly appreciated!' : '⭐ 5 bintang amat kami hargai!'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <button
                type="button"
                onClick={handleCloseReviewPopup}
                className="w-full py-2.5 px-3 bg-transparent hover:bg-black/5 text-xs text-[#5E6F68] hover:text-[#1C2624] font-semibold rounded-xl transition cursor-pointer"
              >
                {t.reviewModal.secondaryBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
