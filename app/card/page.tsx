'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface RewardItem {
  id?: string
  name: string
  stampsRequired?: number
  imageUrl?: string
  description?: string
}

export default function CustomerCardPage() {
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Auth form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Loyalty Data (Live)
  const [storeName, setStoreName] = useState('Kopi & Kawan')
  const [logoUrl, setLogoUrl] = useState('')
  const [rewardImageUrl, setRewardImageUrl] = useState('')
  const [rewardsList, setRewardsList] = useState<RewardItem[]>([])
  const [totalStamps, setTotalStamps] = useState(0)
  const [stampsRequired, setStampsRequired] = useState(10)
  const [rewardDesc, setRewardDesc] = useState('1 minuman percuma')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [cardImpact, setCardImpact] = useState(false)

  // Multi-card state
  const [selectedCardIdx, setSelectedCardIdx] = useState(0)

  // Modals state
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewardSlideIdx, setRewardSlideIdx] = useState(0)

  useEffect(() => {
    async function checkAuth() {
      setLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)

      if (session?.user) {
        fetchLoyalty()
      }
    }
    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        fetchLoyalty()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchLoyalty() {
    setRefreshing(true)
    try {
      const res = await fetch('/api/customer/loyalty')
      if (res.ok) {
        const data = await res.json()
        const stamps = data.totalStamps || 0
        const req = data.stampsRequired || 10
        setTotalStamps(stamps)
        setStampsRequired(req)
        setRewardDesc(data.rewardDescription || '1 minuman percuma')
        setStoreName(data.storeName || 'Kopi & Kawan')
        setLogoUrl(data.logoUrl || '')
        setRewardImageUrl(data.rewardImageUrl || '')
        setRewardsList(Array.isArray(data.rewards) ? data.rewards : [])
        setUpdatedAt(data.updatedAt || null)

        // Automatically focus on the latest active card
        const fullCards = Math.floor(stamps / req)
        const rem = stamps % req
        const totalCards = Math.max(1, fullCards + (rem > 0 ? 1 : 0))
        setSelectedCardIdx(totalCards - 1)

        setTimeout(() => setCardImpact(true), 150)
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
      setAuthError(err.message || 'Gagal log masuk.')
    } finally {
      setIsAuthenticating(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-jakarta text-[#F7EEDA]">
        <div className="text-center font-space text-xs text-[#5B6B64]">
          <img src="/logo.svg" alt="LajuS" className="w-12 h-12 mx-auto mb-3" />
          Memuatkan kad cop live...
        </div>
      </div>
    )
  }

  // Multi-card calculations
  const TOTAL = stampsRequired || 10
  const fullCardsCount = Math.floor(totalStamps / TOTAL)
  const remainderStamps = totalStamps % TOTAL
  const totalCardsCount = Math.max(1, fullCardsCount + (remainderStamps > 0 ? 1 : 0))

  // Determine current viewing card stamps
  const isViewingFullCard = selectedCardIdx < fullCardsCount
  const cardStamps = isViewingFullCard
    ? TOTAL
    : remainderStamps === 0 && fullCardsCount > 0 && selectedCardIdx === fullCardsCount - 1
    ? TOTAL
    : remainderStamps

  const cardRemain = Math.max(0, TOTAL - cardStamps)
  const percentFill = Math.min(100, Math.round((cardStamps / TOTAL) * 100))

  // Display rewards list or fallback to primary reward
  const effectiveRewards = rewardsList.length > 0
    ? rewardsList
    : [
        {
          name: rewardDesc || '1 Minuman Percuma',
          stampsRequired: TOTAL,
          imageUrl: rewardImageUrl || '',
          description: 'Ganjaran utama bagi kesetiaan pelanggan kami.',
        },
      ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-jakarta text-[#F7EEDA]">
      <div className="w-full max-w-[400px] mx-auto flex flex-col items-center justify-center z-10 relative">
        {/* TOP BAR */}
        <div className="w-full flex items-center justify-between mb-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-fraunces text-base text-[#F7EEDA] hover:opacity-80 transition"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#E5A43B] flex items-center justify-center shadow-sm">
              <img src="/logo.svg" alt="LajuS" className="w-full h-full object-cover" />
            </div>
            <span>Laju<span className="text-[#E5A43B]">S</span></span>
          </Link>

          {user && (
            <div className="flex items-center gap-2">
              <button
                onClick={fetchLoyalty}
                disabled={refreshing}
                title="Muat semula baki"
                className="text-xs px-2.5 py-1 rounded-lg border border-[#F7EEDA]/15 bg-[#F7EEDA]/[0.05] text-[#F7EEDA] hover:bg-[#F7EEDA]/10 transition cursor-pointer"
              >
                {refreshing ? '...' : '↻ Muat Semula'}
              </button>
              <button
                onClick={handleLogout}
                className="text-xs px-2.5 py-1 rounded-lg border border-[#F7EEDA]/15 bg-[#F7EEDA]/[0.05] text-[#5B6B64] hover:text-[#F7EEDA] transition cursor-pointer"
              >
                Keluar
              </button>
            </div>
          )}
        </div>

        {/* IF NOT LOGGED IN: SHOW LOGIN */}
        {!user ? (
          <div className="w-full bg-[#FAF2E2] rounded-[24px] p-6 sm:p-7 shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(229,164,59,0.15)] text-[#1C2624] anim-result">
            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#E5A43B] mx-auto mb-3 shadow-md flex items-center justify-center">
                <img src="/logo.svg" alt="LajuS" className="w-full h-full object-cover" />
              </div>
              <div className="font-fraunces font-bold text-xl text-[#0A1716] mb-1">
                Semak Kad Cop Anda
              </div>
              <div className="text-xs text-[#5E6F68]">
                Log masuk untuk melihat bilangan cop terkumpul dan ganjaran aktif anda.
              </div>
            </div>

            {/* GOOGLE LOGIN */}
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
        ) : (
          /* LOGGED IN: LIVE STAMP CARD */
          <div className="w-full flex flex-col items-center anim-result">
            {/* STORE NAME & LOGO CENTERED AT TOP */}
            <div className="flex flex-col items-center text-center mb-3.5 w-full">
              <div className="w-14 h-14 rounded-full bg-[#E7A33E] text-[#1C2624] font-fraunces font-bold flex items-center justify-center text-2xl shrink-0 shadow-lg mb-2 overflow-hidden border-2 border-[#FAF2E2]/20">
                {logoUrl ? (
                  <img src={logoUrl} alt={storeName} className="w-full h-full object-cover" />
                ) : (
                  storeName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="font-fraunces text-2xl font-bold text-[#F7EEDA] leading-tight">
                {storeName}
              </div>
              <div className="font-space text-[10px] text-[#5B6B64] tracking-[0.08em] uppercase mt-0.5">
                KAD COP DIGITAL • TOTAL {totalStamps} COP
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
                    Sebut emel anda ({user.email}) di kaunter kasir untuk menebus: <b className="text-white">{rewardDesc}</b>
                  </div>
                </div>
              </div>
            )}

            {/* MULTI-CARD TABS / SELECTOR */}
            {totalCardsCount > 1 && (
              <div className="w-full flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
                {Array.from({ length: totalCardsCount }).map((_, idx) => {
                  const isFull = idx < fullCardsCount
                  const isActive = idx === selectedCardIdx
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

            {/* STAMP CARD CONTAINER */}
            <div
              className={`relative w-full bg-[#FAF2E2] rounded-[24px] px-5 sm:px-6 pt-7 pb-6 shadow-[0_24px_50px_rgba(0,0,0,0.5),0_2px_0_rgba(255,255,255,0.4)_inset,0_0_0_1px_rgba(229,164,59,0.15)] text-[#1C2624] ${
                cardImpact ? 'anim-card-impact' : ''
              }`}
            >
              {/* PERFORATION TOP */}
              <div className="absolute left-3 right-3 top-0 h-0 border-t-2 border-dashed border-[#E2CE9E] before:content-[''] before:absolute before:-top-[9px] before:-left-[21px] before:w-[18px] before:h-[18px] before:rounded-full before:bg-[#0A1716] after:content-[''] after:absolute after:-top-[9px] after:-right-[21px] after:w-[18px] after:h-[18px] after:rounded-full after:bg-[#0A1716]" />

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
                    <span>🎉 Kad ini telah lengkap! Sedia ditebus: {rewardDesc}.</span>
                  </div>
                ) : cardRemain > 0 ? (
                  <>
                    Cuma <b className="text-[#B53629]">{cardRemain}</b> cop lagi untuk kad ini bagi mendapat{' '}
                    {rewardDesc}!
                  </>
                ) : (
                  <>
                    <b className="text-[#B53629]">Tahniah!</b> Cop kad ini genap — tebus ganjaran di kaunter: {rewardDesc}.
                  </>
                )}
              </div>

              {/* PERFORATION BOTTOM */}
              <div className="absolute left-3 right-3 bottom-0 h-0 border-t-2 border-dashed border-[#E2CE9E] before:content-[''] before:absolute before:-top-[9px] before:-left-[21px] before:w-[18px] before:h-[18px] before:rounded-full before:bg-[#0A1716] after:content-[''] after:absolute after:-top-[9px] after:-right-[21px] after:w-[18px] after:h-[18px] after:rounded-full after:bg-[#0A1716]" />
            </div>

            <div className="w-full text-center mt-4 text-xs text-[#5B6B64] font-space">
              {updatedAt
                ? `Dikemaskini: ${new Date(updatedAt).toLocaleTimeString('ms-MY', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : 'Imbas QR di kaunter untuk menambah cop baharu'}
            </div>
          </div>
        )}
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
                  <b>Kumpul Cop:</b> Imbas kod QR di kaunter sehingga kad cop anda genap 10 cop.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <b>Pergi ke Kaunter:</b> Maklumkan kepada kasir bahawa anda ingin menebus ganjaran.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <b>Sebut Emel Anda:</b> Beritahu alamat emel akaun anda ({user?.email || 'emel anda'}) kepada kasir.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#E4D9BE]">
                <div className="w-5 h-5 rounded-full bg-[#1E5E53] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <b>Sahkan Penebusan:</b> Kasir akan mengesahkan di sistem dan menyerahkan ganjaran anda serta-merta!
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


      {/* 2. POPUP MODAL: KATALOG HADIAH & GANJARAN — fullscreen carousel */}
      {showRewardsModal && (() => {
        const slide = effectiveRewards[rewardSlideIdx] ?? effectiveRewards[0]
        const total = effectiveRewards.length
        return (
          <div
            className="fixed inset-0 z-50 flex flex-col bg-[#0A1716]"
            onContextMenu={(e) => e.preventDefault()}
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            {/* TOP BAR */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3 shrink-0">
              <div
                className="font-fraunces font-bold text-base text-[#F7EEDA]"
                style={{ userSelect: 'none' }}
              >
                🎁 Hadiah &amp; Ganjaran
              </div>
              <button
                onClick={() => setShowRewardsModal(false)}
                className="w-9 h-9 rounded-full bg-[#FAF2E2]/10 flex items-center justify-center text-[#F7EEDA] hover:bg-[#FAF2E2]/20 transition cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* IMAGE — fills remaining space */}
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
                <div className="w-full h-full flex items-center justify-center text-8xl bg-[#1A2B29]">
                  🎁
                </div>
              )}

              {/* Dark gradient at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0A1716] to-transparent pointer-events-none" />

              {/* Slide Arrows — only if multiple */}
              {total > 1 && (
                <>
                  <button
                    onClick={() => setRewardSlideIdx((rewardSlideIdx - 1 + total) % total)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center text-xl hover:bg-black/60 transition cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setRewardSlideIdx((rewardSlideIdx + 1) % total)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center text-xl hover:bg-black/60 transition cursor-pointer"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Info overlay at bottom of image area */}
              <div className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-12">
                <div
                  className="font-fraunces font-bold text-[22px] text-[#FAF2E2] leading-tight mb-1"
                  style={{ userSelect: 'none' }}
                >
                  {slide?.name}
                </div>
                {slide?.description && (
                  <div
                    className="text-[13px] text-[#C4B897] mb-2"
                    style={{ userSelect: 'none' }}
                  >
                    {slide.description}
                  </div>
                )}
                <div
                  className="inline-flex items-center gap-1.5 font-space text-[11px] font-bold text-[#E5A43B] bg-[#E5A43B]/15 border border-[#E5A43B]/30 px-3 py-1 rounded-full"
                  style={{ userSelect: 'none' }}
                >
                  ⚡ {slide?.stampsRequired || TOTAL} Cop Diperlukan
                </div>
              </div>
            </div>

            {/* DOTS + CLOSE BUTTON */}
            <div className="shrink-0 px-5 pb-6 pt-3 flex flex-col items-center gap-3">
              {/* Slide dots */}
              {total > 1 && (
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: total }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setRewardSlideIdx(i)}
                      className={`rounded-full transition-all cursor-pointer ${
                        i === rewardSlideIdx
                          ? 'w-5 h-2 bg-[#E5A43B]'
                          : 'w-2 h-2 bg-[#FAF2E2]/30 hover:bg-[#FAF2E2]/60'
                      }`}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowRewardsModal(false)}
                className="w-full py-3 bg-[#1E5E53] hover:bg-[#2D786B] text-white font-bold text-sm rounded-2xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )
      })()}
    </main>
  )
}
