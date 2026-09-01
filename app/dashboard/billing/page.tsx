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
        throw new Error(data.error || 'Gagal memulakan proses pembayaran.')
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setErrorMsg(err.message || 'Ralat berlaku semasa menyambung ke pembayaran.')
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
        throw new Error(data.error || 'Gagal membuka portal bil.')
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      console.error('Portal error:', err)
      setErrorMsg(err.message || 'Ralat membuka portal Stripe.')
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
                onClick={() => setLang('my')}
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
                onClick={() => setLang('en')}
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

        {/* HERO TITLE */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 font-space text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#E5A43B] bg-[#E5A43B]/10 border border-[#E5A43B]/25 px-3 py-1 rounded-full mb-3">
            <span>⚡ {lang === 'en' ? 'Upgrade Store Membership' : 'Naik Taraf Pelan Kedai'}</span>
          </div>
          <h1 className="font-fraunces text-3xl sm:text-4xl md:text-5xl font-bold text-[#FAF2E2] leading-tight mb-2">
            {lang === 'en' ? 'Choose the Best Plan for Your Business' : 'Pilih Pelan Terbaik Untuk Kedai Anda'}
          </h1>
          <p className="text-xs sm:text-sm text-[#C4B897] leading-relaxed">
            {lang === 'en'
              ? 'Scale your repeat customers, unlock unlimited loyalty cards, Bluetooth receipt printing, and automated Google Reviews.'
              : 'Gandakan pelanggan setia, nikmati had pelanggan tanpa had, cetakan resit Bluetooth, dan ulasan 5-bintang Google automatik.'}
          </p>

          {/* STORE CURRENT STATUS PILL */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#FAF2E2]/[0.05] border border-[#FAF2E2]/10">
            <span className="text-[#8E9B95]">{storeName || 'Kedai Anda'}:</span>
            <span className={isPro ? 'text-[#E5A43B] font-bold' : 'text-emerald-400 font-bold'}>
              {isPro ? '⭐ Pro Active' : `Free Starter (${totalCustomers}/20 Pelanggan)`}
            </span>
          </div>
        </div>

        {/* BILLING CYCLE TOGGLE (MONTHLY VS YEARLY) */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-[#FAF2E2]/[0.08] border border-[#FAF2E2]/15 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#E5A43B] text-[#1A2422] shadow-md'
                  : 'text-[#FAF2E2]/70 hover:text-[#FAF2E2]'
              }`}
            >
              {lang === 'en' ? 'Monthly Billing' : 'Langganan Bulanan'}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-[#E5A43B] text-[#1A2422] shadow-md'
                  : 'text-[#FAF2E2]/70 hover:text-[#FAF2E2]'
              }`}
            >
              <span>{lang === 'en' ? 'Yearly Billing' : 'Langganan Tahunan'}</span>
              <span className="px-1.5 py-0.5 text-[9.5px] font-extrabold bg-emerald-500 text-white rounded-md tracking-wider">
                {lang === 'en' ? 'SAVE 17%' : 'JIMAT 2 BULAN'}
              </span>
            </button>
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
          {/* 1. FREE TIER */}
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
                {lang === 'en' ? 'Free Starter' : 'Pelan Percuma'}
              </div>
              <p className="text-xs text-[#C4B897] mb-5">
                {lang === 'en'
                  ? 'Great for testing out digital stamp cards for small stores.'
                  : 'Sesuai untuk memulakan sistem kad cop digital di kedai anda.'}
              </p>

              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-[#FAF2E2]/10">
                <span className="font-fraunces text-4xl font-bold text-[#FAF2E2]">RM0</span>
                <span className="text-xs text-[#8E9B95]">/{lang === 'en' ? 'forever' : 'seumur hidup'}</span>
              </div>

              {/* FEATURES LIST */}
              <ul className="space-y-3 text-xs mb-6">
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span><strong>20 {lang === 'en' ? 'Active Customers' : 'Pelanggan Aktif'}</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'Unlimited Stamp Issues' : 'Jana Cop Stamp Tanpa Had'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? '1 Primary Reward Catalog' : '1 Hadiah Ganjaran Asas'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#8E9B95]/60 line-through">
                  <span className="w-4 h-4 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-[10px] font-bold shrink-0">✕</span>
                  <span>{lang === 'en' ? 'Custom Logo & Branding' : 'Logo & Jenama Kustom'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#8E9B95]/60 line-through">
                  <span className="w-4 h-4 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-[10px] font-bold shrink-0">✕</span>
                  <span>{lang === 'en' ? 'Bluetooth Thermal Printer' : 'Cetak Resit Bluetooth Printer'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#8E9B95]/60 line-through">
                  <span className="w-4 h-4 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-[10px] font-bold shrink-0">✕</span>
                  <span>{lang === 'en' ? 'Automated Google Reviews' : 'Google Review 5-Bintang Automatik'}</span>
                </li>
              </ul>
            </div>

            <div>
              {!isPro ? (
                <div className="w-full py-3 text-center text-xs font-bold text-[#8E9B95] bg-[#FAF2E2]/[0.06] rounded-xl border border-[#FAF2E2]/10">
                  {lang === 'en' ? 'Active on this Store' : 'Aktif pada Kedai Ini'}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenCustomerPortal}
                  disabled={isProcessing}
                  className="w-full py-3 text-center text-xs font-bold text-[#FAF2E2]/80 hover:text-white bg-[#FAF2E2]/[0.08] hover:bg-[#FAF2E2]/15 rounded-xl border border-[#FAF2E2]/15 transition cursor-pointer"
                >
                  {lang === 'en' ? 'Downgrade via Stripe Portal' : 'Tukar Pelan di Portal Stripe'}
                </button>
              )}
            </div>
          </div>

          {/* 2. PRO TIER (RECOMMENDED) */}
          <div
            className={`rounded-[28px] p-6 sm:p-7 flex flex-col justify-between relative transition-all ${
              isPro
                ? 'bg-gradient-to-b from-[#1C322C] to-[#122320] border-2 border-emerald-400/50 shadow-2xl ring-2 ring-emerald-400/20'
                : 'bg-gradient-to-b from-[#1F2C29] to-[#141F1D] border-2 border-[#E5A43B] shadow-[0_20px_50px_rgba(229,164,59,0.15)] ring-2 ring-[#E5A43B]/30'
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
                  {lang === 'en' ? 'Unlimited Pro' : 'Pro Tanpa Had'}
                </span>
              </div>

              <div className="font-fraunces text-2xl font-bold text-[#FAF2E2] mb-1">
                {lang === 'en' ? 'Pro Business' : 'Pelan Pro'}
              </div>
              <p className="text-xs text-[#C4B897] mb-5">
                {lang === 'en'
                  ? 'Complete loyalty operating system for cafes, restaurants & retail.'
                  : 'Sistem lengkap tanpa had untuk kafe, restoran, butik & servis.'}
              </p>

              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-[#FAF2E2]/15">
                <span className="font-fraunces text-4xl sm:text-5xl font-bold text-[#FAF2E2]">
                  {billingCycle === 'yearly' ? 'RM290' : 'RM29'}
                </span>
                <span className="text-xs text-[#C4B897]">
                  /{billingCycle === 'yearly' ? (lang === 'en' ? 'year' : 'tahun') : (lang === 'en' ? 'month' : 'bulan')}
                </span>
                {billingCycle === 'yearly' && (
                  <span className="ml-2 text-[10.5px] text-emerald-400 font-bold font-space">
                    (~RM24/{lang === 'en' ? 'mo' : 'bln'})
                  </span>
                )}
              </div>

              {/* FEATURES LIST */}
              <ul className="space-y-3 text-xs mb-6">
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-4 h-4 rounded-full bg-[#E5A43B] text-[#1A2422] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span><strong>{lang === 'en' ? 'Unlimited Customers (No 20 limit)' : 'Pelanggan Tanpa Had (Tiada had 20)'}</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-4 h-4 rounded-full bg-[#E5A43B] text-[#1A2422] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'Custom Store Logo & Stamp Icon' : 'Logo Kedai & Ikon Cop Berjenama Sendiri'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-4 h-4 rounded-full bg-[#E5A43B] text-[#1A2422] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'Multi-Reward Tiers Catalog' : 'Katalog Pelbagai Pilihan Hadiah'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-4 h-4 rounded-full bg-[#E5A43B] text-[#1A2422] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'Camera QR Scanner for Customer Emails' : 'Kamera Imbas QR Kod Emel Pelanggan'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-4 h-4 rounded-full bg-[#E5A43B] text-[#1A2422] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'Bluetooth Thermal Printer Receipts & Tickets' : 'Cetak Resit & Tiket QR Bluetooth Thermal'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-4 h-4 rounded-full bg-[#E5A43B] text-[#1A2422] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'Automated 5-Star Google Review Slide-up' : 'Slide-up Sheet Google Review 5-Bintang'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-4 h-4 rounded-full bg-[#E5A43B] text-[#1A2422] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'CSV Activity Report & Analytics Export' : 'Muat Turun Laporan Aktiviti & Data CSV'}</span>
                </li>
              </ul>
            </div>

            <div>
              {isPro ? (
                <button
                  type="button"
                  onClick={handleOpenCustomerPortal}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-[0.98] text-white font-jakarta font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <span>{isProcessing ? 'Memproses...' : (lang === 'en' ? 'Manage Billing & Invoices (Stripe Portal) ↗' : 'Urus Langganan & Invois (Stripe Portal) ↗')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCheckout(billingCycle)}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5A43B] to-[#C77B1B] hover:brightness-110 active:scale-[0.98] text-[#1A2422] font-jakarta font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(229,164,59,0.35)] disabled:opacity-50"
                >
                  <span>{isProcessing ? (lang === 'en' ? 'Redirecting to Stripe...' : 'Menghubungkan ke Stripe...') : (lang === 'en' ? 'Upgrade to Pro Now ⚡' : 'Langgan Pelan Pro Sekarang ⚡')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PAYMENT SECURITY & GUARANTEE */}
        <div className="bg-[#FAF2E2]/[0.04] border border-[#FAF2E2]/10 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E5E53]/30 text-emerald-400 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-[#FAF2E2]">
                {lang === 'en' ? 'Secure 256-bit Encrypted Checkout' : 'Pembayaran Selamat 256-bit SSL'}
              </div>
              <div className="text-[11px] text-[#8E9B95]">
                {lang === 'en'
                  ? 'Accepts Online Banking (FPX), Visa, Mastercard, Apple Pay via Stripe.'
                  : 'Menyokong Perbankan FPX, Visa, Mastercard, & Kad Debit/Kredit melalui Stripe.'}
              </div>
            </div>
          </div>

          <div className="text-xs text-[#E5A43B] font-semibold">
            ✓ {lang === 'en' ? 'Cancel anytime with 1 click' : 'Batalkan bila-bila masa tanpa sebarang caj tersembunyi'}
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="max-w-2xl mx-auto w-full mb-10">
          <h2 className="font-fraunces text-xl font-bold text-center mb-6 text-[#FAF2E2]">
            {lang === 'en' ? 'Frequently Asked Questions' : 'Soalan Lazim (FAQ)'}
          </h2>

          <div className="space-y-3 text-xs">
            <div className="bg-[#FAF2E2]/[0.05] border border-[#FAF2E2]/10 rounded-xl p-4">
              <div className="font-bold text-[#FAF2E2] mb-1">
                {lang === 'en' ? 'What happens to my existing customer data when I upgrade?' : 'Apa berlaku kepada data cop sedia ada apabila saya upgrade ke Pro?'}
              </div>
              <p className="text-[#C4B897] leading-relaxed">
                {lang === 'en'
                  ? 'All your existing customer records, stamp counts, and transaction history remain 100% intact and immediately unlock unlimited customer capacity.'
                  : 'Semua rekod pelanggan, bilangan cop, dan sejarah transaksi kekal selamat 100% dan had pelanggan kedai anda serta-merta dinaikkan ke tanpa had.'}
              </p>
            </div>

            <div className="bg-[#FAF2E2]/[0.05] border border-[#FAF2E2]/10 rounded-xl p-4">
              <div className="font-bold text-[#FAF2E2] mb-1">
                {lang === 'en' ? 'Can I cancel or change my plan later?' : 'Bolehkah saya batalkan atau tukar pelan pada bila-bila masa?'}
              </div>
              <p className="text-[#C4B897] leading-relaxed">
                {lang === 'en'
                  ? 'Yes! You can manage your subscription, download tax invoices, or cancel anytime through the integrated Stripe Billing Portal.'
                  : 'Ya, anda boleh mengurus langganan, memuat turun invois rasmi, atau membatalkan langganan bila-bila masa melalui Portal Stripe.'}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="text-center text-[11px] text-[#FAF2E2]/40 font-space pb-6">
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
