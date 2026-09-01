'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

type BillingCycle = 'monthly' | 'yearly'

function BillingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [lang, setLang] = useState<'my' | 'en'>('my')
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<any>(null)
  const [storeId, setStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')
  const [planType, setPlanType] = useState<string>('free')
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('active')
  const [totalCustomers, setTotalCustomers] = useState<number>(0)

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('lajus_lang') as 'my' | 'en' | null
    if (saved === 'my' || saved === 'en') {
      setLang(saved)
    }

    async function loadData() {
      setLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          router.push('/dashboard')
          return
        }
        setUser(session.user)

        // Load store settings & stats
        const res = await fetch('/api/store/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.registered && data.store) {
            setStoreId(data.store.id || '')
            setStoreName(data.store.name || '')
            setPlanType(data.store.plan_type || 'free')
            setSubscriptionStatus(data.store.subscription_status || 'active')
            setTotalCustomers(data.store.total_customers || 0)
          }
        }
      } catch (err: any) {
        console.error('Error loading billing info:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Check query params feedback
    const subParam = searchParams.get('subscription')
    if (subParam === 'success') {
      setToastMsg({
        text: lang === 'en' ? '🎉 Subscription successful! Welcome to Pro.' : '🎉 Pembayaran berjaya! Selamat datang ke Pelan Pro.',
        type: 'success',
      })
    } else if (subParam === 'cancelled') {
      setToastMsg({
        text: lang === 'en' ? 'Payment was cancelled.' : 'Pembayaran dibatalkan.',
        type: 'info',
      })
    }
  }, [])

  function switchLang(newLang: 'my' | 'en') {
    setLang(newLang)
    localStorage.setItem('lajus_lang', newLang)
  }

  const isPro = planType === 'pro' && subscriptionStatus === 'active'

  async function handleCheckout(planChoice: 'monthly' | 'yearly') {
    setIsProcessing(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planChoice }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || (lang === 'en' ? 'Failed to start checkout.' : 'Gagal memulakan proses pembayaran.'))
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setErrorMsg(err.message || (lang === 'en' ? 'Error connecting to payment processor.' : 'Ralat berlaku semasa menyambung ke pembayaran.'))
      setIsProcessing(false)
    }
  }

  async function handleOpenCustomerPortal() {
    setIsProcessing(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || (lang === 'en' ? 'Failed to open billing portal.' : 'Gagal membuka portal bil.'))
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      console.error('Portal error:', err)
      setErrorMsg(err.message || (lang === 'en' ? 'Error opening Stripe portal.' : 'Ralat membuka portal Stripe.'))
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1716] text-[#FAF2E2] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#E5A43B] border-t-transparent rounded-full animate-spin" />
          <p className="font-space text-xs tracking-wider text-[#C4B897] uppercase">
            {lang === 'en' ? 'Loading billing details...' : 'Memuatkan maklumat langganan...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A1716] text-[#FAF2E2] font-jakarta antialiased p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col">
        {/* TOAST NOTIFICATION */}
        {toastMsg && (
          <div
            className={`mb-4 p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg anim-scale ${
              toastMsg.type === 'success'
                ? 'bg-emerald-500 text-white'
                : toastMsg.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-[#E5A43B] text-[#1A2422]'
            }`}
          >
            <span>{toastMsg.text}</span>
            <button
              onClick={() => setToastMsg(null)}
              className="ml-2 font-bold px-1.5 py-0.5 rounded hover:bg-black/10 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* TOPBAR NAVIGATION */}
        <header className="w-full flex items-center justify-between pb-6 border-b border-[#FAF2E2]/10 mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A43B] hover:text-[#FAF2E2] transition py-1.5 px-3 rounded-full bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/12"
          >
            <span>←</span>
            <span>{lang === 'en' ? 'Back to Dashboard' : 'Kembali ke Dashboard'}</span>
          </Link>

          <div className="flex items-center gap-3">
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
        </header>

        {/* HERO TITLE (Matching Landing Page) */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="font-fraunces text-3xl sm:text-4xl md:text-5xl font-bold text-[#FAF2E2] leading-tight mb-2">
            {lang === 'en' ? 'Choose The Best Plan For Your Business' : 'Pilih Pelan Terbaik Untuk Kedai Anda'}
          </h1>
          <p className="text-xs sm:text-sm text-[#C4B897] leading-relaxed">
            {lang === 'en'
              ? 'Start free. Upgrade as your business grows and scales.'
              : 'Bermula percuma. Naik taraf bila perniagaan anda semakin berkembang pesat.'}
          </p>

          {/* STORE CURRENT STATUS PILL */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#FAF2E2]/[0.05] border border-[#FAF2E2]/10">
            <span className="text-[#8E9B95]">{storeName || (lang === 'en' ? 'Your Store' : 'Kedai Anda')}:</span>
            <span className={isPro ? 'text-[#E5A43B] font-bold' : 'text-emerald-400 font-bold'}>
              {isPro ? '⭐ Pro Active' : (lang === 'en' ? `Free Plan (${totalCustomers}/20 Customers)` : `Pelan Percuma (${totalCustomers}/20 Pelanggan)`)}
            </span>
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* PRICING CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-10">
          {/* 1. FREE PLAN (Exact Landing Page Wording) */}
          <div
            className={`rounded-[28px] p-6 sm:p-7 flex flex-col justify-between transition-all ${
              !isPro
                ? 'bg-[#FAF2E2]/[0.08] border-2 border-[#E5A43B]/40 shadow-xl ring-1 ring-[#E5A43B]/20'
                : 'bg-[#FAF2E2]/[0.04] border border-[#FAF2E2]/10 opacity-90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-space text-xs uppercase tracking-wider font-bold text-[#8E9B95]">
                  {lang === 'en' ? 'Starter' : 'Permulaan'}
                </span>
                {!isPro && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {lang === 'en' ? 'Current Plan' : 'Pelan Semasa'}
                  </span>
                )}
              </div>

              <div className="font-fraunces text-2xl font-bold text-[#FAF2E2] mb-1">
                {lang === 'en' ? 'Free Plan' : 'Pelan Percuma'}
              </div>
              <p className="text-xs text-[#C4B897] mb-5">
                {lang === 'en'
                  ? 'Perfect for starting your digital stamp card system.'
                  : 'Sesuai untuk memulakan sistem kad cop digital.'}
              </p>

              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-[#FAF2E2]/10">
                <span className="font-fraunces text-4xl font-bold text-[#FAF2E2]">RM0</span>
                <span className="text-xs text-[#8E9B95]">/{lang === 'en' ? 'month' : 'bulan'}</span>
              </div>

              {/* FEATURES LIST (Matching Landing Page) */}
              <ul className="space-y-3.5 text-xs mb-6">
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-5 h-5 rounded-full bg-[#1E5E53]/40 text-[#4EB89D] flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'Up to 20 new customer capacity' : 'Terhad sehingga 20 pelanggan baharu'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-5 h-5 rounded-full bg-[#1E5E53]/40 text-[#4EB89D] flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'Full access to all essential features' : 'Akses penuh ke semua ciri asas'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#8E9B95]/50">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[11px] font-bold shrink-0">–</span>
                  <span className="line-through opacity-75">{lang === 'en' ? 'Email token dispatch (Pro exclusive)' : 'Hantar kad cop melalui emel (eksklusif Pro)'}</span>
                </li>
              </ul>
            </div>

            <div>
              {!isPro ? (
                <div className="w-full py-3.5 text-center text-xs font-bold text-[#8E9B95] bg-[#FAF2E2]/[0.06] rounded-xl border border-[#FAF2E2]/10">
                  {lang === 'en' ? 'Active on this Store' : 'Aktif pada Kedai Ini'}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenCustomerPortal}
                  disabled={isProcessing}
                  className="w-full py-3.5 text-center text-xs font-bold text-[#FAF2E2]/80 hover:text-white bg-[#FAF2E2]/[0.08] hover:bg-[#FAF2E2]/15 rounded-xl border border-[#FAF2E2]/15 transition cursor-pointer"
                >
                  {lang === 'en' ? 'Downgrade via Stripe Portal' : 'Tukar Pelan di Portal Stripe'}
                </button>
              )}
            </div>
          </div>

          {/* 2. PRO PLAN (With Toggle Inside Card & Exact Landing Page Wording) */}
          <div
            className={`rounded-[28px] p-6 sm:p-7 flex flex-col justify-between relative transition-all ${
              isPro
                ? 'bg-gradient-to-b from-[#2A1A02] to-[#141F1D] border-2 border-emerald-400/50 shadow-2xl ring-2 ring-emerald-400/20'
                : 'bg-gradient-to-b from-[#2A1A02] to-[#1A1008] border-2 border-[#E5A43B]/80 shadow-[0_20px_50px_rgba(229,164,59,0.18)] ring-2 ring-[#E5A43B]/30'
            }`}
          >
            {/* BADGE */}
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#E5A43B] to-[#C77B1B] text-[#1A2422] text-[10.5px] font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-md font-space">
              {isPro
                ? (lang === 'en' ? '⭐ Your Current Plan' : '⭐ Pelan Anda Sekarang')
                : (lang === 'en' ? '🔥 Most Popular' : '🔥 Paling Popular')}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-space text-xs uppercase tracking-wider font-bold text-[#E5A43B]">
                  {lang === 'en' ? 'Pro Plan' : 'Pelan Pro'}
                </span>
              </div>

              <div className="font-fraunces text-2xl font-bold text-[#FAF2E2] mb-1">
                {lang === 'en' ? 'Pro Plan' : 'Pelan Pro'}
              </div>
              <p className="text-xs text-[#C4B897] mb-4">
                {lang === 'en'
                  ? 'For growing businesses requiring unlimited power and features.'
                  : 'Untuk perniagaan yang berkembang tanpa sebarang had.'}
              </p>

              {/* TOGGLE INSIDE PRO CARD */}
              <div className="mb-4 bg-[#0A1716]/60 border border-[#FAF2E2]/15 p-1 rounded-xl flex items-center gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-[#E5A43B] text-[#1A2422] shadow-sm'
                      : 'text-[#FAF2E2]/70 hover:text-[#FAF2E2]'
                  }`}
                >
                  {lang === 'en' ? 'Monthly' : 'Bulanan'}
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    billingCycle === 'yearly'
                      ? 'bg-[#E5A43B] text-[#1A2422] shadow-sm'
                      : 'text-[#FAF2E2]/70 hover:text-[#FAF2E2]'
                  }`}
                >
                  <span>{lang === 'en' ? 'Yearly' : 'Tahunan'}</span>
                  <span className={`text-[9.5px] font-black px-1.5 py-0.2 rounded-full ${
                    billingCycle === 'yearly' ? 'bg-[#1A2422]/20 text-[#1A2422]' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {lang === 'en' ? 'SAVE RM20' : 'JIMAT RM20'}
                  </span>
                </button>
              </div>

              {/* PRICE DISPLAY */}
              <div className="flex flex-col mb-6 pb-6 border-b border-[#FAF2E2]/15">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-fraunces text-4xl sm:text-5xl font-black text-[#E5A43B]">
                    {billingCycle === 'yearly' ? 'RM616' : 'RM53'}
                  </span>
                  <span className="text-xs text-[#C4B897]">
                    /{billingCycle === 'yearly' ? (lang === 'en' ? 'year' : 'tahun') : (lang === 'en' ? 'month' : 'bulan')}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-emerald-400 text-xs font-bold mt-1 font-space">
                    {lang === 'en'
                      ? '≈ RM51.33/mo • Save RM20 compared to monthly billing'
                      : '≈ RM51.33/bln • Jimat RM20 berbanding bayaran bulanan'}
                  </p>
                )}
              </div>

              {/* PRO FEATURES LIST (Matching Landing Page) */}
              <ul className="space-y-3.5 text-xs mb-6">
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-5 h-5 rounded-full bg-[#E5A43B]/20 text-[#E5A43B] flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  <span><strong>{lang === 'en' ? 'Unlimited customer capacity' : 'Pelanggan tanpa had'}</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-5 h-5 rounded-full bg-[#E5A43B]/20 text-[#E5A43B] flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'Unlimited email stamp dispatch' : 'Hantar kad cop melalui emel tanpa had'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-5 h-5 rounded-full bg-[#E5A43B]/20 text-[#E5A43B] flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'Full access to all premium features' : 'Akses penuh ke semua ciri premium'}</span>
                </li>
              </ul>
            </div>

            <div>
              {isPro ? (
                <button
                  type="button"
                  onClick={handleOpenCustomerPortal}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-[0.98] text-white font-jakarta font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <span>{isProcessing ? (lang === 'en' ? 'Processing...' : 'Memproses...') : (lang === 'en' ? 'Manage Billing & Invoices (Stripe Portal) ↗' : 'Urus Langganan & Invois (Stripe Portal) ↗')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCheckout(billingCycle)}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E5A43B] to-[#C77B1B] hover:brightness-110 active:scale-[0.98] text-[#1A2422] font-jakarta font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(229,164,59,0.4)] hover:shadow-[0_4px_28px_rgba(229,164,59,0.55)] disabled:opacity-50"
                >
                  <span>{isProcessing ? (lang === 'en' ? 'Redirecting to Stripe...' : 'Menghubungkan ke Stripe...') : (lang === 'en' ? 'Subscribe to Pro Now ⚡' : 'Langgan Pelan Pro Sekarang ⚡')}</span>
                </button>
              )}

              <p className="text-center text-[11px] text-[#8E9B95] mt-3">
                {lang === 'en' ? 'Secure payments via Stripe • Cancel anytime' : 'Bayaran selamat melalui Stripe • Batal bila-bila masa'}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM NOTE */}
        <div className="text-center text-xs text-[#8E9B95] mb-8">
          {lang === 'en'
            ? 'All plans include counter staff portal, QR token system, and customer digital cards.'
            : 'Semua pelan merangkumi portal staff kaunter, sistem token QR, dan kad cop digital pelanggan.'}
        </div>

        {/* FOOTER */}
        <footer className="text-center text-[11px] text-[#FAF2E2]/40 font-space pb-6 border-t border-[#FAF2E2]/10 pt-6">
          © {new Date().getFullYear()} LajuS • {lang === 'en' ? 'All rights reserved.' : 'Hak cipta terpelihara.'}
        </footer>
      </div>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A1716] text-[#FAF2E2] flex items-center justify-center p-4">
          <div className="w-10 h-10 border-3 border-[#E5A43B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  )
}
