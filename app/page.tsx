'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lang, I18N_LANDING } from '@/lib/i18n/landing'

// ── Scroll Reveal ─────────────────────────────────────────────────────────────
function ScrollReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.unobserve(node)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, willChange: 'opacity, transform' }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// ── Auth Modal ─────────────────────────────────────────────────────────────────
function AuthModal({
  isOpen,
  onClose,
  lang,
}: {
  isOpen: boolean
  onClose: () => void
  lang: Lang
}) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const t = I18N_LANDING[lang].authModal

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  async function handleGoogle() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4">
      {/* Gradient Border Frame */}
      <div className="relative w-full max-w-md bg-gradient-to-tr from-[#E5A43B] via-[#C77B1B] to-[#1E5E53] p-[4px] rounded-[28px] shadow-2xl">
        {/* Inner White Card */}
        <div className="relative w-full bg-white rounded-[24px] overflow-hidden p-7 sm:p-9 text-slate-900">
          {/* Speed lines decorative */}
          <div className="absolute top-2.5 left-3 pointer-events-none opacity-80">
            <svg width="170" height="38" viewBox="0 0 170 38" fill="none">
              <path
                d="M0 4H110C113.314 4 116 6.686 116 10C116 13.314 113.314 16 110 16H0V4Z"
                fill="url(#s1)"
              />
              <path
                d="M0 20H80C83.314 20 86 22.686 86 26C86 29.314 83.314 32 80 32H0V20Z"
                fill="url(#s2)"
              />
              <path
                d="M92 22H130C132.209 22 134 23.791 134 26C134 28.209 132.209 30 130 30H92V22Z"
                fill="url(#s3)"
              />
              <path
                d="M122 6H152C153.657 6 155 7.343 155 9C155 10.657 153.657 12 152 12H122V6Z"
                fill="url(#s4)"
              />
              <defs>
                <linearGradient id="s1" x1="0" y1="10" x2="116" y2="10" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E5A43B" />
                  <stop offset="1" stopColor="#C77B1B" />
                </linearGradient>
                <linearGradient id="s2" x1="0" y1="26" x2="86" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C77B1B" />
                  <stop offset="1" stopColor="#E5A43B" />
                </linearGradient>
                <linearGradient id="s3" x1="92" y1="26" x2="134" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1E5E53" />
                  <stop offset="1" stopColor="#2D786B" />
                </linearGradient>
                <linearGradient id="s4" x1="122" y1="9" x2="155" y2="9" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E5A43B" />
                  <stop offset="1" stopColor="#C77B1B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition z-10 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6 pt-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#E5A43B] flex items-center justify-center shadow-md flex-shrink-0 p-1">
              <img src="/logo.svg" alt="LajuS" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base leading-tight">
                Laju<span className="text-[#E5A43B]">S</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">{t.portalTitle}</div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-2xl py-4 font-bold text-[15px] text-slate-800 transition active:scale-[0.98] disabled:opacity-60 shadow-sm cursor-pointer"
          >
            <svg viewBox="0 0 18 18" width="20" height="20">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
            </svg>
            {loading ? t.connecting : t.googleLogin}
          </button>

          <p className="text-center text-[11px] text-slate-400 mt-5 font-medium">
            {t.secureNote}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main Landing Page ──────────────────────────────────────────────────────────
export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('my')
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in')
  const [authOpen, setAuthOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [planLoading, setPlanLoading] = useState<string | null>(null)
  const supabase = createClient()

  // Load language preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lajus_lang') as Lang | null
    if (saved === 'my' || saved === 'en') {
      setLang(saved)
    }
  }, [])

  function switchLang(newLang: Lang) {
    setLang(newLang)
    localStorage.setItem('lajus_lang', newLang)
  }

  const t = I18N_LANDING[lang]
  const currentRotatingWords = t.rotatingWords

  async function handleSelectPlan(plan: 'free' | 'monthly' | 'yearly') {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setAuthOpen(true)
      return
    }
    setPlanLoading(plan)
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || (lang === 'en' ? 'An error occurred. Please try again.' : 'Ralat berlaku. Sila cuba lagi.'))
        return
      }
      if (data.url) window.location.href = data.url
    } catch {
      alert(lang === 'en' ? 'Connection error. Please try again.' : 'Ralat sambungan. Sila cuba lagi.')
    } finally {
      setPlanLoading(null)
    }
  }

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setFadeState('out')
      setTimeout(() => {
        setWordIndex(i => (i + 1) % currentRotatingWords.length)
        setFadeState('in')
      }, 150)
    }, 2600)
    return () => clearInterval(id)
  }, [currentRotatingWords])

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────── */}
      <header className={`fixed z-50 transition-all duration-500 ${isScrolled ? 'top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4' : 'top-0 left-0 right-0'}`}>
        <nav className={`mx-auto transition-all duration-500 ${
          isScrolled || mobileOpen
            ? 'bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl max-w-[1240px]'
            : 'bg-white/90 backdrop-blur-md border-b border-slate-100 max-w-[1400px]'
        }`}>
          <div className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-500 ${isScrolled ? 'h-14' : 'h-16 sm:h-20'}`}>

            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#E5A43B] flex items-center justify-center shadow-md shadow-[#E5A43B]/30 group-hover:scale-105 transition overflow-hidden p-1 shrink-0">
                <img src="/logo.svg" alt="LajuS" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold tracking-tight text-lg sm:text-xl text-slate-900">
                Laju<span className="text-[#E5A43B]">S</span>
              </span>
            </a>

            {/* Desktop & Tablet Navigation links */}
            <div className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-700">
              <a href="#demo" className="hover:text-[#E5A43B] transition">{t.nav.demo}</a>
              <a href="#cara-kerja" className="hover:text-[#E5A43B] transition">{t.nav.howItWorks}</a>
              <a href="#ciri" className="hover:text-[#E5A43B] transition">{t.nav.features}</a>
              <a href="#harga" className="hover:text-[#E5A43B] transition">{t.nav.pricing}</a>
              <a href="#faq" className="hover:text-[#E5A43B] transition">{t.nav.faq}</a>
              <a href="/card" className="hover:text-[#E5A43B] font-extrabold text-[#1E5E53] flex items-center gap-1 transition">
                <span>{t.nav.customerCard}</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>

            {/* Right Action Buttons + Language Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher (MY / EN) */}
              <div className="flex items-center bg-slate-100 border border-slate-200 p-0.5 rounded-full text-[11px] font-extrabold">
                <button
                  type="button"
                  onClick={() => switchLang('my')}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    lang === 'my'
                      ? 'bg-[#E5A43B] text-slate-900 shadow-xs'
                      : 'hover:text-slate-900 text-slate-500'
                  }`}
                  aria-label="Tukar ke Bahasa Melayu"
                >
                  MY
                </button>
                <button
                  type="button"
                  onClick={() => switchLang('en')}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    lang === 'en'
                      ? 'bg-[#E5A43B] text-slate-900 shadow-xs'
                      : 'hover:text-slate-900 text-slate-500'
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
              </div>

              {/* Staff Portal CTA */}
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden sm:inline-flex px-4 sm:px-5 py-2.5 bg-gradient-to-r from-[#E5A43B] to-[#C77B1B] hover:brightness-110 text-white font-extrabold text-xs rounded-full shadow-md shadow-[#E5A43B]/25 transition items-center gap-1.5 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                </svg>
                <span>{t.nav.staffPortal}</span>
              </button>

              {/* Mobile & Tablet Hamburger Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition active:scale-95 cursor-pointer"
                aria-label="Menu Navigasi"
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile & Tablet Slide-Down Drawer Menu */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-md flex flex-col justify-end sm:justify-center p-3 sm:p-6 animate-in fade-in duration-200">
            <div className="w-full max-w-lg mx-auto bg-white rounded-[28px] p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#E5A43B] overflow-hidden shadow-md flex items-center justify-center p-1">
                    <img src="/logo.svg" alt="LajuS" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="font-extrabold text-lg leading-tight">Laju<span className="text-[#E5A43B]">S</span></div>
                    <div className="text-[11px] text-slate-500">{t.drawer.tagline}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Language switch inside drawer */}
                  <div className="flex items-center bg-slate-100 border border-slate-200 p-0.5 rounded-full text-[11px] font-extrabold">
                    <button
                      type="button"
                      onClick={() => switchLang('my')}
                      className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        lang === 'my' ? 'bg-[#E5A43B] text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      MY
                    </button>
                    <button
                      type="button"
                      onClick={() => switchLang('en')}
                      className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        lang === 'en' ? 'bg-[#E5A43B] text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      EN
                    </button>
                  </div>

                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 transition cursor-pointer text-slate-600"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navigation Links Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-2">
                {t.drawer.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between group transition active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{link.icon}</span>
                      <div>
                        <div className="font-extrabold text-slate-900 group-hover:text-[#E5A43B] transition text-sm">{link.label}</div>
                        <p className="text-[11px] text-slate-500 font-medium">{link.desc}</p>
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-[#E5A43B] font-bold text-sm transition">➔</span>
                  </a>
                ))}
              </div>

              {/* Primary Action Button */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
                <button
                  onClick={() => { setMobileOpen(false); setAuthOpen(true) }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#E5A43B] to-[#C77B1B] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[#E5A43B]/25 transition flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                  </svg>
                  <span>{t.drawer.openCounter}</span>
                </button>
                <a
                  href="/downloads/LajuS.apk"
                  download="LajuS.apk"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 bg-[#0A1716] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 text-[#E5A43B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>{t.hero.downloadApkCta} (APK v1.0)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────── */}
      <section className="relative min-h-screen bg-white flex items-center pt-28 pb-16 lg:pt-36 lg:pb-24 px-6 lg:px-12 border-b border-slate-100 overflow-hidden">

        {/* Background ambient blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#E5A43B]/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#1E5E53]/6 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

          {/* Left: Text */}
          <ScrollReveal delay={100} className="space-y-6">
            <div className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-widest">
              <span className="w-16 h-[2px] bg-gradient-to-r from-[#E5A43B] to-[#C77B1B] inline-block" />
              <span className="bg-gradient-to-r from-[#E5A43B] to-[#1E5E53] bg-clip-text text-transparent">
                {t.hero.badge}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900">
              {t.hero.titlePrefix}
              <span className="inline-block min-w-[200px] sm:min-w-[280px]">
                <span
                  className={`inline-block text-[#E5A43B] transition-all duration-300 ${fadeState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                  style={{ willChange: 'transform, opacity' }}
                >
                  {currentRotatingWords[wordIndex % currentRotatingWords.length]}
                </span>
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3.5 pt-2">
              <button
                onClick={() => setAuthOpen(true)}
                className="px-7 h-13 bg-gradient-to-r from-[#E5A43B] to-[#C77B1B] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-lg shadow-[#E5A43B]/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 group cursor-pointer"
              >
                <span>{t.hero.openStaffCta}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <a
                href="/downloads/LajuS.apk"
                download="LajuS.apk"
                className="px-6 h-13 bg-[#0A1716] hover:bg-[#152724] text-white font-bold text-xs sm:text-sm rounded-full shadow-md flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 group"
              >
                <svg className="w-4 h-4 text-[#E5A43B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>{t.hero.downloadApkCta}</span>
              </a>
              <a
                href="#demo"
                className="px-6 h-13 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 transition"
              >
                <svg className="w-4 h-4 fill-[#E5A43B] text-[#E5A43B]" viewBox="0 0 24 24"><polygon points="6,3 20,12 6,21"/></svg>
                {t.hero.howItWorksCta}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-700">
              {t.hero.badges.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#1E5E53] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Right: Mascot Character */}
          <ScrollReveal delay={250} className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-sm flex items-center justify-center lg:justify-end">
              {/* Ambient glow behind mascot */}
              <div className="absolute w-[320px] h-[320px] rounded-full bg-[#E5A43B]/20 blur-[80px] pointer-events-none" />
              <img
                src="/mascot.png"
                alt="Maskot LajuS"
                className="relative z-10 w-[280px] sm:w-[340px] lg:w-[400px] drop-shadow-2xl select-none pointer-events-none"
                style={{ filter: 'drop-shadow(0 32px 48px rgba(229,164,59,0.25))' }}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── METRICS BANNER ──────────────────────── */}
      <section className="py-12 bg-slate-900 border-y border-slate-800 overflow-hidden">
        <ScrollReveal delay={100} className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {t.metrics.map(m => (
            <div key={m.label} className="space-y-1">
              <div className={`text-3xl lg:text-5xl font-black ${m.color}`}>{m.val}</div>
              <div className="text-xs text-slate-300 font-semibold">{m.label}</div>
            </div>
          ))}
        </ScrollReveal>
      </section>

      {/* ── VIDEO DEMO SECTION ──────────────────── */}
      <section id="demo" className="py-20 lg:py-24 px-6 bg-slate-950 relative overflow-hidden border-b border-slate-800">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-[#E5A43B]/15 via-[#1E5E53]/15 to-[#B53629]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1000px] mx-auto relative z-10">
          <ScrollReveal className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E5A43B]/15 border border-[#E5A43B]/25 rounded-full text-[#E5A43B] text-xs font-extrabold uppercase tracking-wider">
              {t.videoDemo.badge}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {t.videoDemo.title}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              {t.videoDemo.subtitle}
            </p>
          </ScrollReveal>

          {/* Video Player Card Frame */}
          <ScrollReveal delay={150}>
            <div className="relative mx-auto bg-gradient-to-tr from-[#E5A43B] via-[#C77B1B] to-[#1E5E53] p-[2px] sm:p-[3px] rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(229,164,59,0.15)]">
              <div className="relative w-full aspect-video bg-slate-900 rounded-[14px] sm:rounded-[21px] overflow-hidden">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/Mh4ZoUJnums?rel=0&modestbranding=1"
                  title="LajuS Video Demo"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CARA KERJA ──────────────────────────── */}
      <section id="cara-kerja" className="py-24 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E5A43B]/10 border border-[#E5A43B]/20 rounded-full text-[#C77B1B] text-xs font-extrabold uppercase tracking-wider">
              {t.howItWorks.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">{t.howItWorks.title}</h2>
            <p className="text-slate-500 max-w-xl mx-auto">{t.howItWorks.subtitle}</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.howItWorks.steps.map((s, i) => (
              <ScrollReveal key={i} delay={i * 120}>
                <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-7 hover:shadow-lg transition group h-full flex flex-col">
                  <div className="absolute top-5 right-5 text-slate-200 font-black text-5xl select-none leading-none">{s.step}</div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg mb-5`}>
                    {i === 0 && (
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM19 14v3M14 19h3"/></svg>
                    )}
                    {i === 1 && (
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                    )}
                    {i === 2 && (
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg>
                    )}
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mb-2 group-hover:text-[#E5A43B] transition">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CIRI ────────────────────────────────── */}
      <section id="ciri" className="py-24 px-6 bg-slate-900">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E5A43B]/15 border border-[#E5A43B]/25 rounded-full text-[#E5A43B] text-xs font-extrabold uppercase tracking-wider">
              {t.features.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">{t.features.title}</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.features.items.map((f, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-[#E5A43B]/30 transition group h-full flex flex-col">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-extrabold text-white text-base mb-2 group-hover:text-[#E5A43B] transition">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA MID ─────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#E5A43B] to-[#C77B1B] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <ScrollReveal className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight whitespace-pre-line">
            {t.ctaMid.title}
          </h2>
          <p className="text-white/80 text-base">{t.ctaMid.subtitle}</p>
          <button
            onClick={() => setAuthOpen(true)}
            className="px-10 h-14 bg-white hover:bg-slate-50 text-[#C77B1B] font-extrabold text-sm rounded-full shadow-xl transition transform hover:-translate-y-0.5 group inline-flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{t.ctaMid.button}</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </ScrollReveal>
      </section>

      {/* ── PRICING ──────────────────────────────── */}
      <section id="harga" className="py-24 px-6 bg-slate-950 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E5A43B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1E5E53]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E5A43B]/10 border border-[#E5A43B]/25 rounded-full text-[#E5A43B] text-xs font-extrabold uppercase tracking-wider">
              {t.pricing.badge}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              {t.pricing.titlePrefix}<span className="text-[#E5A43B]">{t.pricing.titleHighlight}</span>
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              {t.pricing.subtitle}
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-2xl p-1 mt-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#E5A43B] text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.pricing.monthly}
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-[#E5A43B] text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.pricing.yearly}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  billingCycle === 'yearly' ? 'bg-slate-900/30 text-slate-900' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {t.pricing.saveBadge}
                </span>
              </button>
            </div>
          </ScrollReveal>

          {/* Plan Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* FREE PLAN */}
            <ScrollReveal delay={0}>
              <div className="h-full flex flex-col bg-slate-900 border border-slate-700 rounded-3xl p-7 shadow-xl hover:border-slate-500 transition-all duration-300">
                <div className="mb-6">
                  <div className="font-black text-white text-2xl mb-1">{t.pricing.freeTitle}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black text-white">RM0</span>
                    <span className="text-slate-400 text-sm">{t.pricing.freePeriod}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">{t.pricing.freeDesc}</p>
                </div>

                <ul className="space-y-3.5 flex-1 mb-7">
                  {t.pricing.freeFeatures.map(([icon, label, active]) => (
                    <li key={String(label)} className={`flex items-center gap-2.5 text-sm ${active ? 'text-slate-200' : 'text-slate-500'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${active ? 'bg-[#1E5E53]/30 text-[#4EB89D]' : 'bg-slate-800 text-slate-500'}`}>
                        {String(icon)}
                      </span>
                      <span className={active ? '' : 'line-through opacity-75'}>{String(label)}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan('free')}
                  disabled={planLoading === 'free'}
                  className="w-full py-3.5 rounded-2xl border-2 border-[#1E5E53] text-[#4EB89D] font-bold text-sm hover:bg-[#1E5E53]/20 transition cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                >
                  {planLoading === 'free' ? (lang === 'en' ? 'Processing...' : 'Memproses...') : t.pricing.freeCta}
                </button>
              </div>
            </ScrollReveal>

            {/* PRO PLAN */}
            <ScrollReveal delay={80}>
              <div className="h-full flex flex-col bg-gradient-to-b from-[#2A1A02] to-[#1A1008] border-2 border-[#E5A43B]/60 rounded-3xl p-7 shadow-[0_0_40px_rgba(229,164,59,0.15)] relative overflow-hidden hover:shadow-[0_0_60px_rgba(229,164,59,0.25)] transition-all duration-300">
                <div className="mb-6">
                  <div className="font-black text-white text-2xl mb-1">{t.pricing.proTitle}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black text-[#E5A43B]">
                      {billingCycle === 'yearly' ? 'RM616' : 'RM53'}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {billingCycle === 'yearly' ? t.pricing.proPeriodYearly : t.pricing.proPeriodMonthly}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-emerald-400 text-xs font-bold mt-1">
                      {t.pricing.proYearlyNote}
                    </p>
                  )}
                  <p className="text-slate-400 text-sm mt-2">{t.pricing.proDesc}</p>
                </div>

                <ul className="space-y-3.5 flex-1 mb-7">
                  {t.pricing.proFeatures.map((label) => (
                    <li key={label} className="flex items-center gap-2.5 text-sm text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-[#E5A43B]/20 text-[#E5A43B] flex items-center justify-center text-[11px] font-bold shrink-0">
                        ✓
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(billingCycle)}
                  disabled={planLoading === billingCycle}
                  className="w-full py-4 rounded-2xl bg-gradient-to-b from-[#E7A33E] to-[#C77B1B] text-slate-900 font-black text-sm shadow-[0_4px_20px_rgba(229,164,59,0.4)] hover:shadow-[0_4px_28px_rgba(229,164,59,0.55)] hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {planLoading === billingCycle ? (
                    lang === 'en' ? 'Processing...' : 'Memproses...'
                  ) : (
                    <>
                      {t.pricing.proCta}
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-3">
                  {t.pricing.proSecurity}
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Bottom note */}
          <ScrollReveal delay={120}>
            <p className="text-center text-slate-500 text-xs mt-10">
              {t.pricing.bottomNote}<br/>
              {t.pricing.contactText}{' '}
              <a href="mailto:akubotaman@gmail.com" className="text-[#E5A43B] hover:underline">akubotaman@gmail.com</a>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal className="text-center mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E5A43B]/10 border border-[#E5A43B]/20 rounded-full text-[#C77B1B] text-xs font-extrabold uppercase tracking-wider">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              {lang === 'en' ? 'Frequently Asked Questions' : 'Soalan Lazim'}
            </h2>
          </ScrollReveal>

          <div className="space-y-3">
            {t.faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left flex items-center justify-between p-5 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span className="font-bold text-sm text-slate-900 pr-4">{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-[#E5A43B] flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    ><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer className="py-14 px-6 bg-[#0D1117] border-t border-white/10 text-xs text-white/60">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1 & 2: Brand & Company Info (BOTZ GLOBAL SOLUTIONS) */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#E5A43B] overflow-hidden shadow-md flex items-center justify-center p-1 shrink-0">
                <img src="/logo.svg" alt="LajuS" className="w-full h-full object-contain" />
              </div>
              <div className="bg-white p-1.5 rounded-xl shadow-md inline-flex items-center justify-center shrink-0">
                <img src="/botz-logo.svg" alt="BOTZ Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-extrabold text-white text-base">
                Laju<span className="text-[#E5A43B]">S</span>
              </span>
            </div>

            <div className="space-y-1 text-slate-400 text-xs pt-1">
              <p className="font-bold text-white text-sm tracking-wide">BOTZ GLOBAL SOLUTIONS</p>
              <p className="font-mono text-[11px] text-slate-300">No. SSM: 202603077221 (TR0339427-P)</p>
              <p className="pt-1 flex items-center gap-2 text-slate-300">
                <span>📧 {lang === 'en' ? 'Email:' : 'E-mel:'}</span>
                <a
                  href="mailto:akubotaman@gmail.com"
                  className="hover:text-[#E5A43B] transition underline font-mono text-white"
                >
                  akubotaman@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2.5">
            <p className="font-bold text-[#E5A43B] text-xs uppercase tracking-wider">{t.footer.quickLinksTitle}</p>
            <ul className="space-y-2 text-xs">
              <li><a href="#cara-kerja" className="hover:text-white transition">{t.nav.howItWorks}</a></li>
              <li><a href="#ciri" className="hover:text-white transition">{t.nav.features}</a></li>
              <li><a href="#harga" className="hover:text-white transition">{t.nav.pricing}</a></li>
              <li><a href="#faq" className="hover:text-white transition">{t.nav.faq}</a></li>
              <li><a href="/card" className="hover:text-[#E5A43B] font-semibold transition">{t.nav.customerCard} ↗</a></li>
              <li><a href="/privacy" className="hover:text-white transition text-slate-400">{t.footer.privacyPolicyPdpa}</a></li>
            </ul>
          </div>

          {/* Col 4: Staff Portal Access & Platform Rights */}
          <div className="space-y-3">
            <p className="font-bold text-white text-xs uppercase tracking-wider">{t.footer.staffPortalAccess}</p>
            <button
              onClick={() => setAuthOpen(true)}
              className="w-full py-2.5 px-4 bg-[#E5A43B]/20 hover:bg-[#E5A43B]/30 border border-[#E5A43B]/40 text-[#E5A43B] rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <span>{t.footer.staffLoginBtn}</span>
              <span>→</span>
            </button>
            <div className="text-[11px] text-white/60 leading-relaxed pt-1 space-y-1">
              <p>
                © {new Date().getFullYear()} LajuS. {t.footer.copyrightText}{' '}
                <strong className="text-white">BOTZ GLOBAL SOLUTIONS</strong>.
              </p>
              <p>
                <a href="/privacy" className="text-slate-400 hover:text-[#E5A43B] underline transition">
                  {t.footer.privacyPolicy}
                </a>
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* ── AUTH MODAL ──────────────────────────── */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} lang={lang} />
    </div>
  )
}
