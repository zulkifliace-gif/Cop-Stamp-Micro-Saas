'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lang, I18N_CARD } from '@/lib/i18n/card'

interface RewardItem {
  id?: string
  name: string
  stampsRequired?: number
  imageUrl?: string
  description?: string
}

interface SocialLinkItem {
  platform: string
  url: string
}

interface CustomerStoreCard {
  storeId: string
  storeName: string
  totalStamps: number
  stampsRequired: number
  rewardDescription: string
  logoUrl: string
  rewardImageUrl: string
  rewards: RewardItem[]
  stampIcon?: string
  socialLinks?: SocialLinkItem[]
  updatedAt?: string | null
}

function normalizeStampIcon(path?: string) {
  if (!path) return '/icons/stamps/makanan.svg'
  const lower = path.toLowerCase()
  if (lower.includes('barber') || lower.includes('gunting') || lower.includes('rambut')) return '/icons/stamps/barber.svg'
  if (lower.includes('pastri') || lower.includes('croissant') || lower.includes('bakeri')) return '/icons/stamps/pastri.svg'
  if (lower.includes('pizza')) return '/icons/stamps/pizza.svg'
  if (lower.includes('kek') || lower.includes('cake') || lower.includes('dessert')) return '/icons/stamps/kek.svg'
  if (lower.includes('car') || lower.includes('wash') || lower.includes('bubble') || lower.includes('buih') || lower.includes('dobi')) return '/icons/stamps/car-wash.svg'
  if (lower.includes('servis') || lower.includes('mop') || lower.includes('sparkle') || lower.includes('clean') || lower.includes('bersih')) return '/icons/stamps/servis.svg'
  if (lower.includes('spa') || lower.includes('massage') || lower.includes('urut')) return '/icons/stamps/spa.svg'
  if (lower.includes('retail') || lower.includes('paper') || lower.includes('bag') || lower.includes('beg') || lower.includes('butik')) return '/icons/stamps/retail.svg'
  if (lower.includes('pet') || lower.includes('shop') || lower.includes('bone') || lower.includes('tulang')) return '/icons/stamps/pet-shop.svg'
  if (lower.includes('coffee') || lower.includes('kopi') || lower.includes('vet') || lower.includes('haiwan')) return '/icons/stamps/coffee.svg'
  if (lower.includes('klinik') || lower.includes('vaccine') || lower.includes('vaksin') || lower.includes('farmasi')) return '/icons/stamps/klinik.svg'
  if (lower.includes('makan') || lower.includes('food') || lower.includes('utensil')) return '/icons/stamps/makanan.svg'
  return path.startsWith('/') ? path : `/${path}`
}

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

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return '/icons/social/instagram.svg'
    case 'tiktok':
      return '/icons/social/tiktok.svg'
    case 'facebook':
      return '/icons/social/facebook.svg'
    case 'telegram':
      return '/icons/social/telegram.svg'
    case 'threads':
      return '/icons/social/threads.svg'
    case 'youtube':
      return '/icons/social/youtube.svg'
    case 'website':
    default:
      return '/icons/social/website.svg'
  }
}

export default function CustomerCardPage() {
  const supabase = createClient()

  // Language state (defaults to 'my', persists to localStorage)
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

  const t = I18N_CARD[lang]

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Auth form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Delete Account Modal State
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState<boolean>(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('')
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false)
  const [deleteAccountError, setDeleteAccountError] = useState<string>('')

  // Multi-Store Loyalty Data (Live - No mock defaults)
  const [allStores, setAllStores] = useState<CustomerStoreCard[]>([])
  const [activeStoreId, setActiveStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [rewardImageUrl, setRewardImageUrl] = useState('')
  const [rewardsList, setRewardsList] = useState<RewardItem[]>([])
  const [stampIcon, setStampIcon] = useState('/icons/stamps/makan.svg')
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([])
  const [totalStamps, setTotalStamps] = useState(0)
  const [stampsRequired, setStampsRequired] = useState(10)
  const [rewardDesc, setRewardDesc] = useState('')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [stampDates, setStampDates] = useState<string[]>([])
  const [cardImpact, setCardImpact] = useState(false)
  const [stampedSlots, setStampedSlots] = useState<Set<number>>(new Set())

  // Multi-card state
  const [selectedCardIdx, setSelectedCardIdx] = useState(0)

  // Modals state
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewardSlideIdx, setRewardSlideIdx] = useState(0)

  // Stamp circle touch/click detail popup modal state
  const [selectedStampDetail, setSelectedStampDetail] = useState<{
    slotNum: number
    cardNum: number
    globalStampNum: number
    isFilled: boolean
    date: string | null
  } | null>(null)

  useEffect(() => {
    async function checkAuth() {
      setLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)

      if (session?.user) {
        const params = new URLSearchParams(window.location.search)
        const initialStoreId = params.get('storeId') || undefined
        fetchLoyalty(initialStoreId)
      }
    }
    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        const params = new URLSearchParams(window.location.search)
        const initialStoreId = params.get('storeId') || undefined
        fetchLoyalty(initialStoreId)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchLoyalty(targetStoreId?: string) {
    setRefreshing(true)
    try {
      const url = targetStoreId
        ? `/api/customer/loyalty?storeId=${targetStoreId}`
        : `/api/customer/loyalty`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        const stores = Array.isArray(data.allStores) ? data.allStores : []
        setAllStores(stores)
        setActiveStoreId(data.activeStoreId || (stores[0]?.storeId || ''))

        const stamps = data.totalStamps || 0
        const req = data.stampsRequired || 10
        setTotalStamps(stamps)
        setStampsRequired(req)
        setRewardDesc(data.rewardDescription || 'Ganjaran percuma')
        setStoreName(data.storeName || 'Kad Cop')
        setLogoUrl(data.logoUrl || '')
        setRewardImageUrl(data.rewardImageUrl || '')
        setRewardsList(Array.isArray(data.rewards) ? data.rewards : [])
        setStampIcon(normalizeStampIcon(data.stampIcon))
        setSocialLinks(Array.isArray(data.socialLinks) ? data.socialLinks : [])
        setUpdatedAt(data.updatedAt || null)
        setStampDates(Array.isArray(data.stampDates) ? data.stampDates : [])

        // Automatically focus on the latest active card
        const fullCards = Math.floor(stamps / req)
        const rem = stamps % req
        const totalCards = Math.max(1, fullCards + (rem > 0 ? 1 : 0))
        const activeCard = totalCards - 1
        setSelectedCardIdx(activeCard)

        // Determine how many stamps are visible on the active card
        const cardStampCount = (() => {
          const isFullCard = activeCard < fullCards
          if (isFullCard) return req
          if (rem === 0 && fullCards > 0 && activeCard === fullCards - 1) return req
          return rem
        })()

        // Reset animated slots then stagger-animate each filled stamp slot
        setStampedSlots(new Set())
        setTimeout(() => setCardImpact(true), 150)
        for (let i = 1; i <= cardStampCount; i++) {
          const delay = 250 + (i - 1) * 60 // start at 250ms, 60ms apart per stamp
          setTimeout(() => {
            setStampedSlots((prev) => {
              const next = new Set(prev)
              next.add(i)
              return next
            })
          }, delay)
        }
      }
    } catch (e) {
      console.error('Failed to fetch live loyalty:', e)
    } finally {
      setRefreshing(false)
    }
  }

  async function handleGoogleLogin() {
    setIsAuthenticating(true)
    setAuthError('')
    const origin = window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/card`,
      },
    })
    if (error) {
      setAuthError(error.message)
      setIsAuthenticating(false)
    }
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setAuthError(t.login.fillFieldsError)
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
          fetchLoyalty()
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: effectiveEmail,
          password,
        })
        if (error) throw error
        if (data.user) {
          setUser(data.user)
          fetchLoyalty()
        }
      }
    } catch (err: any) {
      setAuthError(err.message || t.login.authFailed)
    } finally {
      setIsAuthenticating(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setStoreName('')
    setTotalStamps(0)
    setAllStores([])
  }

  // Handle Account Deletion
  async function handleDeleteAccount() {
    if (deleteConfirmText.trim() !== 'PADAM') return
    setIsDeletingAccount(true)
    setDeleteAccountError('')
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setDeleteAccountError(data.error || t.deleteModal.failedDelete)
        return
      }
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (err: any) {
      setDeleteAccountError(t.deleteModal.connError)
    } finally {
      setIsDeletingAccount(false)
    }
  }

  // 1. SLEEK ANIMATED LOADING SKELETON
  if (loading || (user && !storeName && refreshing)) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-jakarta text-[#F7EEDA] bg-dot-pattern">
        <div className="w-full max-w-[380px] mx-auto flex flex-col items-center justify-center">
          <div className="w-full bg-[#FAF2E2]/[0.07] border border-[#FAF2E2]/15 rounded-[26px] p-6 sm:p-7 shadow-2xl animate-pulse flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#E5A43B]/20 mb-3" />
            <div className="w-28 h-5 bg-[#FAF2E2]/20 rounded-full mb-2" />
            <div className="w-20 h-2.5 bg-[#FAF2E2]/10 rounded-full mb-6" />

            <div className="grid grid-cols-5 gap-2.5 w-full mb-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-full border border-dashed border-[#FAF2E2]/20 bg-[#FAF2E2]/5"
                />
              ))}
            </div>
            <div className="w-full h-2 rounded-full bg-[#FAF2E2]/10 mb-4" />
            <div className="w-36 h-3 bg-[#FAF2E2]/15 rounded-full" />
          </div>

          <footer className="w-full text-center mt-6 flex items-center justify-center gap-1.5 opacity-35 text-[11px] font-space text-[#FAF2E2]">
            <img src="/logo.svg" alt="LajuS" className="w-3.5 h-3.5 object-contain" />
            <span>LajuS</span>
          </footer>
        </div>
      </main>
    )
  }

  // Multi-card calculations
  const TOTAL = stampsRequired || 10
  const fullCardsCount = Math.floor(totalStamps / TOTAL)
  const remainderStamps = totalStamps % TOTAL
  const totalCardsCount = Math.max(1, fullCardsCount + (remainderStamps > 0 ? 1 : 0))

  // Store verification check:
  // Verified checkmark ONLY displays if:
  // 1. Logo URL is provided
  // 2. Main Reward Image URL is provided
  // 3. At least 1 Social Media / Website link is provided
  const isStoreVerified = Boolean(
    logoUrl &&
    logoUrl.trim().length > 0 &&
    rewardImageUrl &&
    rewardImageUrl.trim().length > 0 &&
    Array.isArray(socialLinks) &&
    socialLinks.some((s) => s.url && s.url.trim().length > 0)
  )

  // Determine current viewing card stamps
  const isViewingFullCard = selectedCardIdx < fullCardsCount
  const cardStamps = isViewingFullCard
    ? TOTAL
    : remainderStamps === 0 && fullCardsCount > 0 && selectedCardIdx === fullCardsCount - 1
    ? TOTAL
    : remainderStamps

  const cardRemain = Math.max(0, TOTAL - cardStamps)
  const percentFill = Math.min(100, Math.round((cardStamps / TOTAL) * 100))

  const effectiveRewards =
    rewardsList.length > 0
      ? rewardsList
      : [
          {
            name: rewardDesc || (lang === 'en' ? 'Free Reward' : 'Ganjaran Percuma'),
            stampsRequired: TOTAL,
            imageUrl: rewardImageUrl || '',
            description: lang === 'en' ? 'Reward for customer loyalty.' : 'Ganjaran bagi kesetiaan pelanggan.',
          },
        ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-jakarta text-[#F7EEDA] bg-dot-pattern">
      <div className="w-full max-w-[390px] mx-auto flex flex-col items-center justify-center z-10 relative">
        {/* TOP ACTIONS BAR (REFRESH, LOGOUT & MY/EN TOGGLE) */}
        <div className="w-full flex items-center justify-between mb-3">
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

          {user && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchLoyalty(activeStoreId)}
                disabled={refreshing}
                title={t.topbar.refreshTooltip}
                className="w-8 h-8 rounded-full border border-[#FAF2E2]/15 bg-[#FAF2E2]/[0.06] text-[#FAF2E2] hover:bg-[#FAF2E2]/15 transition flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
              >
                <svg
                  className={`w-3.5 h-3.5 text-[#E5A43B] ${refreshing ? 'animate-spin' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </button>

              <button
                onClick={handleLogout}
                title={t.topbar.logoutTooltip}
                className="w-8 h-8 rounded-full border border-[#FAF2E2]/15 bg-[#FAF2E2]/[0.06] text-[#5B6B64] hover:text-[#FAF2E2] hover:bg-[#FAF2E2]/15 transition flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* IF NOT LOGGED IN: CLEAN LOGIN */}
        {!user ? (
          <div className="w-full bg-[#FAF2E2] rounded-[26px] p-6 sm:p-7 shadow-[0_24px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(229,164,59,0.2)] text-[#1C2624] anim-result">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-[#E5A43B] mx-auto mb-3 shadow-md flex items-center justify-center">
                <img src="/logo.svg" alt="LajuS" className="w-8 h-8 object-contain" />
              </div>
              <div className="font-fraunces font-bold text-xl text-[#0A1716] mb-0.5">
                {t.login.digitalStampCard}
              </div>
              <div className="text-xs text-[#5E6F68]">
                {t.login.checkStampsSubtitle}
              </div>
            </div>

            {/* GOOGLE LOGIN */}
            <button
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
              className="w-full flex items-center justify-center gap-2.5 bg-white border border-[#E4D9BE] rounded-[12px] py-3 px-3.5 font-jakarta font-semibold text-[13.5px] text-[#3C3C3C] cursor-pointer active:scale-[0.98] transition hover:bg-gray-50 disabled:opacity-60 shadow-sm"
            >
              <svg viewBox="0 0 18 18" width="18" height="18">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
                <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z" />
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
              </svg>
              {t.login.loginWithGoogle}
            </button>

            <div className="flex items-center gap-2.5 my-3.5 text-[#5B6B64] font-space text-[9.5px] tracking-[0.1em] before:content-[''] before:flex-1 before:h-[1px] before:bg-[#E2CE9E] after:content-[''] after:flex-1 after:h-[1px] after:bg-[#E2CE9E]">
              {t.login.orDivider}
            </div>

            {authError && (
              <div className="mb-3 p-2.5 rounded-lg bg-red-100 text-[#B23A2E] text-xs font-semibold">
                {authError}
              </div>
            )}

            <form onSubmit={handleEmailAuth}>
              <div className="flex items-center gap-2.5 bg-white border border-[#E4D9BE] rounded-[12px] p-2.5 mb-2">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.login.emailPlaceholder}
                  className="border-none outline-none flex-1 font-jakarta text-sm text-[#1C2624] bg-transparent"
                />
              </div>

              <div className="flex items-center gap-2.5 bg-white border border-[#E4D9BE] rounded-[12px] p-2.5 mb-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.login.passwordPlaceholder}
                  className="border-none outline-none flex-1 font-jakarta text-sm text-[#1C2624] bg-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full border-none rounded-[12px] py-3 px-4 bg-gradient-to-b from-[#E7A33E] to-[#C97F1F] text-[#1C2624] font-jakarta font-bold text-sm cursor-pointer active:scale-[0.98] transition disabled:opacity-60 shadow"
              >
                {isAuthenticating ? t.login.processing : isSignup ? t.login.signupBtn : t.login.loginBtn}
              </button>
            </form>

            <div className="text-center mt-3.5 text-xs text-[#5B6B64]">
              {isSignup ? t.login.alreadyHaveAccount : t.login.newAccount}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-[#1F5C52] font-semibold underline cursor-pointer hover:text-[#2E7568]"
              >
                {isSignup ? t.login.loginLink : t.login.signupLink}
              </button>
            </div>
          </div>
        ) : (
          /* LOGGED IN: LIVE STAMP CARD */
          <div className="w-full flex flex-col items-center anim-result">
            {/* MULTI-STORE SELECTOR (MINIMAL PILLS - NO EXTRA TEXT) */}
            {allStores.length > 1 && (
              <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 mb-3 scrollbar-none">
                {allStores.map((st) => {
                  const isActive = st.storeId === activeStoreId
                  return (
                    <button
                      key={st.storeId}
                      onClick={() => fetchLoyalty(st.storeId)}
                      className={`py-1.5 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isActive
                          ? 'bg-[#E5A43B] text-[#1A2422] font-bold shadow-md'
                          : 'bg-[#FAF2E2]/10 text-[#FAF2E2]/80 hover:bg-[#FAF2E2]/20'
                      }`}
                    >
                      <span className="truncate max-w-[120px]">{st.storeName}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-[#1A2422] text-[#E5A43B]'
                            : 'bg-[#E5A43B]/20 text-[#E5A43B]'
                        }`}
                      >
                        {st.totalStamps} {t.card.stampsUnit}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* STORE NAME WITH VERIFIED CHECKMARK & SOCIAL LINKS */}
            <div className="flex flex-col items-center text-center mb-3 w-full">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E7A33E] text-[#1C2624] font-fraunces font-bold flex items-center justify-center text-3xl shrink-0 shadow-lg mb-2 overflow-hidden border-2 border-[#FAF2E2]/30 ring-2 ring-[#E5A43B]/20">
                {logoUrl ? (
                  <img src={logoUrl} alt={storeName} className="w-full h-full object-cover" />
                ) : (
                  (storeName || 'K').charAt(0).toUpperCase()
                )}
              </div>

              {/* STORE NAME WITH GREEN VERIFIED CHECKMARK SVG (ONLY WHEN FULLY CONFIGURED) */}
              <div className="flex items-center justify-center gap-1.5 font-fraunces text-xl font-bold text-[#F7EEDA] leading-tight">
                <span>{storeName}</span>
                {isStoreVerified && (
                  <img
                    src="/green-checkmark-line-icon.svg"
                    alt={t.card.verifiedStoreTitle}
                    title={t.card.verifiedStoreTitle}
                    className="w-4 h-4 object-contain inline-block shrink-0"
                  />
                )}
              </div>

              {/* SOCIAL MEDIA / WEBSITE ICONS (BELOW STORE NAME) */}
              {socialLinks.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
                  {socialLinks.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url.startsWith('http') ? s.url : `https://${s.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6.5 h-6.5 rounded-full bg-[#FAF2E2]/10 hover:bg-[#FAF2E2]/25 border border-[#FAF2E2]/15 flex items-center justify-center p-1.5 transition active:scale-95 shadow-xs"
                      title={s.platform}
                    >
                      <img
                        src={getSocialIcon(s.platform)}
                        alt={s.platform}
                        className="w-full h-full object-contain"
                      />
                    </a>
                  ))}
                </div>
              )}

              {/* ACTION PILLS: INFO 'i' AND REWARDS */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => setShowInfoModal(true)}
                  title={t.card.howToRedeemBtn}
                  className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full border border-[#F7EEDA]/15 bg-[#F7EEDA]/[0.07] text-[11px] font-semibold text-[#F7EEDA] hover:bg-[#F7EEDA]/15 transition cursor-pointer"
                >
                  <svg className="w-3 h-3 text-[#E7A33E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>{t.card.howToRedeemBtn}</span>
                </button>

                <button
                  onClick={() => setShowRewardsModal(true)}
                  title={t.card.rewardsBtn}
                  className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full border border-[#F7EEDA]/15 bg-[#F7EEDA]/[0.07] text-[11px] font-semibold text-[#F7EEDA] hover:bg-[#F7EEDA]/15 transition cursor-pointer"
                >
                  <svg className="w-3 h-3 text-[#E7A33E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                  <span>{t.card.rewardsBtn}</span>
                </button>
              </div>
            </div>


            {/* MULTI-CARD TABS */}
            {totalCardsCount > 1 && (
              <div className="w-full flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1 scrollbar-none">
                {Array.from({ length: totalCardsCount }).map((_, idx) => {
                  const isFull = idx < fullCardsCount
                  const isActive = idx === selectedCardIdx
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedCardIdx(idx)}
                      className={`py-1 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#E5A43B] text-[#1A2422] font-bold shadow'
                          : 'bg-[#FAF2E2]/10 text-[#FAF2E2]/70 hover:bg-[#FAF2E2]/20'
                      }`}
                    >
                      <span>{t.card.cardTab(idx + 1)}</span>
                      {isFull ? (
                        <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                          {t.card.fullBadge}
                        </span>
                      ) : (
                        <span className="text-[9px] opacity-75">
                          {remainderStamps}/{TOTAL}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* STAMP CARD CONTAINER (RICH PARCHMENT TEXTURE - NO PERFORATIONS/BIG BLACK HOLES) */}
            <div
              className={`relative w-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E3] to-[#F2E5C9] rounded-[26px] px-5 sm:px-6 pt-6 pb-5 shadow-[0_20px_45px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.9)_inset,0_0_0_1px_rgba(229,164,59,0.3)] text-[#1C2624] ${
                cardImpact ? 'anim-card-impact' : ''
              }`}
            >
              <div className="text-center mb-4">
                <div className="font-space text-[10px] tracking-[0.14em] uppercase text-[#1E5E53] mb-0.5 font-semibold">
                  {t.card.cardHeader(selectedCardIdx + 1, isViewingFullCard)}
                </div>
                <div className="font-fraunces font-bold text-[30px] text-[#B53629] leading-none">
                  <span>{cardStamps}</span>
                  <small className="font-space text-[14px] text-[#5E6F68] font-normal">
                    {' '}/ {TOTAL}
                  </small>
                </div>
              </div>

              {/* STAMP GRID (RENDER SELECTED STAMP ICON - CLICKABLE TO VIEW DATE & TIME) */}
              <div className="grid grid-cols-5 gap-2.5 my-2 mb-4">
                {Array.from({ length: TOTAL }).map((_, i) => {
                  const slotNum = i + 1
                  const isFilled = slotNum <= cardStamps
                  const isAnimated = stampedSlots.has(slotNum)
                  const globalIdx = selectedCardIdx * TOTAL + slotNum - 1
                  const stampDate = isFilled ? (stampDates[globalIdx] || updatedAt) : null

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
                          date: stampDate,
                        })
                      }}
                      title={
                        isFilled
                          ? `${t.stampDetailModal.title(slotNum, selectedCardIdx + 1)} • ${t.stampDetailModal.earnedBadge}`
                          : `${t.stampDetailModal.title(slotNum, selectedCardIdx + 1)} • ${t.stampDetailModal.notEarnedBadge}`
                      }
                      className={`aspect-square rounded-full flex items-center justify-center relative overflow-hidden transition-transform duration-150 active:scale-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E5A43B]/60 ${
                        isFilled
                          ? 'bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.22),transparent_55%),#B53629] shadow-[0_4px_10px_rgba(181,54,41,0.45)] hover:scale-105'
                          : 'border-2 border-dashed border-[#E2CE9E] bg-[#FAF2E2]/50 hover:bg-[#FAF2E2]/80'
                      }`}
                      style={{
                        transform: isFilled
                          ? slotNum % 3 === 0
                            ? 'rotate(-6deg)'
                            : slotNum % 3 === 1
                            ? 'rotate(4deg)'
                            : 'rotate(-2deg)'
                          : undefined,
                      }}
                    >
                      {/* Ink burst ring — appears only during stamp animation */}
                      {isFilled && isAnimated && (
                        <span
                          className="absolute inset-0 rounded-full border-2 border-[#B53629]/60 anim-ink-burst pointer-events-none"
                        />
                      )}
                      {isFilled ? (
                        <img
                          src={normalizeStampIcon(stampIcon)}
                          alt="Stamp"
                          className={`w-[58%] h-[58%] object-contain pointer-events-none ${isAnimated ? 'anim-stamp-impact' : ''}`}
                        />
                      ) : (
                        <span className="font-space text-[10.5px] font-bold text-[#C2B18A] pointer-events-none">
                          {slotNum}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* PROGRESS BAR */}
              <div className="h-2 rounded-md bg-[#E2CE9E] overflow-hidden mb-3">
                <div
                  className="h-full rounded-md bg-gradient-to-r from-[#C77B1B] to-[#E5A43B] transition-all duration-1000 ease-out"
                  style={{ width: `${percentFill}%` }}
                />
              </div>

              {/* STATUS TEXT */}
              <div className="text-center text-[12.5px] text-[#1E5E53] font-semibold">
                {isViewingFullCard ? (
                  <span className="text-emerald-800 font-bold">
                    {t.card.completeRedeem(rewardDesc)}
                  </span>
                ) : cardRemain > 0 ? (
                  <>
                    {lang === 'en' ? (
                      <>
                        <b className="text-[#B53629]">{cardRemain}</b> more stamp{cardRemain > 1 ? 's' : ''} for: {rewardDesc}
                      </>
                    ) : (
                      <>
                        Lagi <b className="text-[#B53629]">{cardRemain}</b> cop untuk: {rewardDesc}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <b className="text-[#B53629]">{lang === 'en' ? 'Congratulations!' : 'Tahniah!'}</b> {t.card.congratsFull}
                  </>
                )}
              </div>
            </div>

            <div className="w-full text-center mt-3 text-[11px] text-[#5B6B64] font-space">
              {updatedAt
                ? t.card.lastUpdated(
                    new Date(updatedAt).toLocaleTimeString(lang === 'en' ? 'en-US' : 'ms-MY', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  )
                : t.card.scanHint}
            </div>
          </div>
        )}

        {/* FOOTPAGE LAJUS BRANDING (CENTERED & COMPACT) */}
        <footer className="w-full text-center mt-6 mb-2 flex flex-col items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition text-[11px] font-space text-[#FAF2E2]">
          <div className="flex items-center gap-1.5">
            <img src="/logo.svg" alt="LajuS" className="w-3.5 h-3.5 object-contain" />
            <span>LajuS</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FAF2E2]/70 hover:text-[#E5A43B] underline">
              {t.footer.privacyPolicy}
            </a>
            {user && (
              <>
                <span className="text-[#FAF2E2]/30">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmText('')
                    setDeleteAccountError('')
                    setShowDeleteAccountModal(true)
                  }}
                  className="text-red-400/80 hover:text-red-300 underline cursor-pointer"
                >
                  {t.footer.deleteAccount}
                </button>
              </>
            )}
          </div>
        </footer>
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
                  <img
                    src={normalizeStampIcon(stampIcon)}
                    alt="Stamp"
                    className="w-9 h-9 object-contain"
                  />
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
                {storeName}
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

      {/* 1. POPUP MODAL: CARA PENEBUSAN (LIGHTWEIGHT POPUP ANIMATION) */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-5 shadow-2xl border border-[#E5A43B]/30 anim-popup">
            <div className="flex items-center justify-between mb-3.5">
              <div className="font-fraunces font-bold text-base text-[#0A1716]">
                {t.infoModal.title}
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-gray-800 text-lg font-bold transition cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-700 mb-4">
              <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  1
                </div>
                <div>{t.infoModal.step1}</div>
              </div>

              <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  2
                </div>
                <div>{t.infoModal.step2}</div>
              </div>

              <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  3
                </div>
                <div>{t.infoModal.step3(user?.email || (lang === 'en' ? 'your email' : 'emel anda'))}</div>
              </div>

              <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  4
                </div>
                <div>{t.infoModal.step4}</div>
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

      {/* 2. POPUP MODAL: KATALOG HADIAH (FULLSCREEN CAROUSEL + LIGHTWEIGHT ANIMATION) */}
      {showRewardsModal && (() => {
        const slide = effectiveRewards[rewardSlideIdx] ?? effectiveRewards[0]
        const total = effectiveRewards.length
        return (
          <div
            className="fixed inset-0 z-50 flex flex-col bg-[#0A1716] anim-popup"
            onContextMenu={(e) => e.preventDefault()}
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            {/* TOP BAR */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
              <div
                className="font-fraunces font-bold text-base text-[#F7EEDA]"
                style={{ userSelect: 'none' }}
              >
                {t.rewardsModal.title}
              </div>
              <button
                onClick={() => setShowRewardsModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF2E2]/10 flex items-center justify-center text-[#F7EEDA] hover:bg-[#FAF2E2]/20 transition cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* IMAGE */}
            <div className="flex-1 relative overflow-hidden mx-0">
              {slide?.imageUrl ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.name}
                  draggable={false}
                  className="w-full h-full object-cover"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl bg-[#1A2B29]">
                  🎁
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0A1716] to-transparent pointer-events-none" />

              {/* SLIDE ARROWS */}
              {total > 1 && (
                <>
                  <button
                    onClick={() => setRewardSlideIdx((rewardSlideIdx - 1 + total) % total)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center text-xl hover:bg-black/60 transition cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setRewardSlideIdx((rewardSlideIdx + 1) % total)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center text-xl hover:bg-black/60 transition cursor-pointer"
                  >
                    ›
                  </button>
                </>
              )}

              {/* INFO OVERLAY */}
              <div className="absolute inset-x-0 bottom-0 px-5 pb-3 pt-10">
                <div
                  className="font-fraunces font-bold text-xl text-[#FAF2E2] leading-tight mb-1"
                  style={{ userSelect: 'none' }}
                >
                  {slide?.name}
                </div>
                {slide?.description && (
                  <div
                    className="text-xs text-[#C4B897] mb-2 line-clamp-2"
                    style={{ userSelect: 'none' }}
                  >
                    {slide.description}
                  </div>
                )}
                <div
                  className="inline-flex items-center gap-1 font-space text-[10.5px] font-bold text-[#E5A43B] bg-[#E5A43B]/15 border border-[#E5A43B]/30 px-2.5 py-0.5 rounded-full"
                  style={{ userSelect: 'none' }}
                >
                  {t.rewardsModal.stampsRequiredBadge(slide?.stampsRequired || TOTAL)}
                </div>
              </div>
            </div>

            {/* DOTS + CLOSE BUTTON */}
            <div className="shrink-0 px-5 pb-5 pt-2.5 flex flex-col items-center gap-2.5">
              {total > 1 && (
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: total }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setRewardSlideIdx(i)}
                      className={`rounded-full transition-all cursor-pointer ${
                        i === rewardSlideIdx
                          ? 'w-4 h-1.5 bg-[#E5A43B]'
                          : 'w-1.5 h-1.5 bg-[#FAF2E2]/30 hover:bg-[#FAF2E2]/60'
                      }`}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowRewardsModal(false)}
                className="w-full py-2.5 bg-[#1E5E53] hover:bg-[#2D786B] text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {t.rewardsModal.closeBtn}
              </button>
            </div>
          </div>
        )
      })()}
      {/* POPUP MODAL: PENGESAHAN PADAM AKAUN */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-6 shadow-2xl border border-red-300 anim-popup">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-red-600 font-fraunces font-bold text-lg">
                <span>⚠️</span>
                <span>{t.deleteModal.title}</span>
              </div>
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => setShowDeleteAccountModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-gray-800 text-lg font-bold transition cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed mb-4 space-y-2">
              <p className="font-semibold text-red-700">
                {t.deleteModal.warning1}
              </p>
              <p className="text-[#5E6F68]">
                {t.deleteModal.warning2}
              </p>
            </div>

            {deleteAccountError && (
              <div className="mb-3.5 p-3 rounded-xl bg-red-100 border border-red-300 text-red-700 text-xs font-semibold leading-relaxed">
                {deleteAccountError}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {t.deleteModal.typeToConfirm.split('PADAM')[0]}<span className="font-mono text-red-600 bg-red-100 px-1.5 py-0.5 rounded">PADAM</span>{t.deleteModal.typeToConfirm.split('PADAM')[1]}
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="PADAM"
                disabled={isDeletingAccount}
                className="w-full border border-[#E4D9BE] rounded-xl p-2.5 font-mono text-sm text-center tracking-widest uppercase text-slate-900 bg-white outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => setShowDeleteAccountModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E4D9BE] bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                {t.deleteModal.cancel}
              </button>
              <button
                type="button"
                disabled={deleteConfirmText.trim() !== 'PADAM' || isDeletingAccount}
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95"
              >
                {isDeletingAccount ? t.deleteModal.deleting : t.deleteModal.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
