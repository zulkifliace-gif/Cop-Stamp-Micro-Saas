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

  const [purchasedCardQuota, setPurchasedCardQuota] = useState<number>(0)
  const [cardCount, setCardCount] = useState<number>(35)

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isAndroidApp, setIsAndroidApp] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null)

  // Payment Modal state (FPX, Touch 'n Go, Stripe)
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false)
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState<'fpx' | 'tng_qr' | 'stripe'>('fpx')
  const [paymentTarget, setPaymentTarget] = useState<{
    type: 'subscription' | 'card_topup'
    planChoice?: 'monthly' | 'yearly'
    cardCount?: number
    title: string
    priceRm: number
  } | null>(null)

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
          if (!data.needsRegistration && data.storeId) {
            setStoreId(data.storeId)
            setStoreName(data.name || '')
            setPlanType(data.planType || 'free')
            setSubscriptionStatus(data.subscriptionStatus || 'active')
            setPurchasedCardQuota(data.purchasedCardQuota || 0)
          }
        }

        const actRes = await fetch('/api/store/activity?limit=1')
        if (actRes.ok) {
          const actData = await actRes.json()
          if (actData.stats?.totalCustomers !== undefined) {
            setTotalCustomers(actData.stats.totalCustomers)
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
    const topupParam = searchParams.get('topup')
    const cardsParam = searchParams.get('cards')

    if (subParam === 'success') {
      setToastMsg({
        text: lang === 'en' ? '🎉 Subscription successful! Welcome to Pro.' : '🎉 Pembayaran berjaya! Selamat datang ke Pelan Pro.',
        type: 'success',
      })
    } else if (subParam === 'cancelled') {
      setToastMsg({
        text: lang === 'en' ? 'Subscription was cancelled.' : 'Langganan dibatalkan.',
        type: 'info',
      })
    } else if (topupParam === 'success') {
      setToastMsg({
        text: lang === 'en'
          ? `🎉 Card top-up successful! +${cardsParam || 35} digital cards added to your store.`
          : `🎉 Pembelian berjaya! +${cardsParam || 35} kad digital telah ditambah ke kedai anda.`,
        type: 'success',
      })
    } else if (topupParam === 'cancelled') {
      setToastMsg({
        text: lang === 'en' ? 'Card top-up payment was cancelled.' : 'Pembayaran pembelian kad dibatalkan.',
        type: 'info',
      })
    }

    // Check toyyibPay return query params
    const paymentParam = searchParams.get('payment')
    const statusIdParam = searchParams.get('status_id')
    const billCodeParam = searchParams.get('billcode')
    const orderIdParam = searchParams.get('order_id')

    if (paymentParam === 'toyyibpay' && billCodeParam) {
      if (statusIdParam === '1') {
        verifyToyyibpayBill(billCodeParam, statusIdParam, orderIdParam || undefined)
      } else if (statusIdParam === '2') {
        setToastMsg({
          text: lang === 'en' ? 'Payment is still being processed by bank.' : 'Pembayaran toyyibPay sedang diproses oleh pihak bank.',
          type: 'info',
        })
      } else if (statusIdParam === '3') {
        setToastMsg({
          text: lang === 'en' ? 'toyyibPay payment was cancelled or failed.' : 'Pembayaran toyyibPay dibatalkan atau tidak berjaya.',
          type: 'info',
        })
      }
    }

    async function verifyToyyibpayBill(billCode: string, statusId: string, orderId?: string) {
      try {
        setIsProcessing(true)
        const res = await fetch('/api/toyyibpay/verify-bill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ billCode, statusId, orderId }),
        })
        const data = await res.json()
        if (data.success) {
          if (data.type === 'pro_subscription') {
            setPlanType('pro')
            setSubscriptionStatus('active')
          } else if (data.type === 'card_topup') {
            setPurchasedCardQuota(prev => prev + (data.cardsAdded || 0))
          }
          setToastMsg({
            text: data.message || (lang === 'en' ? '🎉 toyyibPay payment successful!' : '🎉 Pembayaran toyyibPay berjaya!'),
            type: 'success',
          })
          router.replace('/dashboard/billing')
        } else {
          setErrorMsg(data.message || (lang === 'en' ? 'Failed to verify toyyibPay payment.' : 'Gagal mengesahkan pembayaran toyyibPay.'))
        }
      } catch (e: any) {
        console.error('Error verifying toyyibPay payment:', e)
      } finally {
        setIsProcessing(false)
      }
    }

    // Check if running in Android Native App with Google Play Billing
    if (typeof window !== 'undefined' && (window as any).AndroidBilling?.isAvailable()) {
      setIsAndroidApp(true)
    }

    if (typeof window !== 'undefined') {
      ;(window as any).onGooglePlayPurchaseResult = async (status: string, data: any) => {
        if (status === 'success') {
          try {
            setIsProcessing(true)
            const parsed = typeof data === 'string' ? JSON.parse(data) : data
            const res = await fetch('/api/billing/google-play/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parsed),
            })
            const resData = await res.json()
            if (res.ok) {
              if (resData.type === 'card_topup') {
                if (resData.newQuota !== undefined) {
                  setPurchasedCardQuota(resData.newQuota)
                } else {
                  setPurchasedCardQuota(prev => prev + (resData.cardsAdded || 35))
                }
                setToastMsg({
                  text: resData.message || (lang === 'en' ? '🎉 Card top-up successful!' : '🎉 Pembelian kad Google Play berjaya!'),
                  type: 'success',
                })
              } else {
                setPlanType('pro')
                setSubscriptionStatus('active')
                setToastMsg({
                  text:
                    lang === 'en'
                      ? '🎉 Google Play Subscription successful! Welcome to Pro.'
                      : '🎉 Langganan Google Play berjaya! Selamat datang ke Pelan Pro.',
                  type: 'success',
                })
              }
            } else {
              setErrorMsg(resData.error || (lang === 'en' ? 'Google Play verification failed.' : 'Pengesahan Google Play gagal.'))
            }
          } catch (e: any) {
            setErrorMsg(e.message || (lang === 'en' ? 'Error processing subscription.' : 'Ralat memproses langganan.'))
          } finally {
            setIsProcessing(false)
          }
        } else if (status === 'cancelled') {
          setIsProcessing(false)
          setToastMsg({
            text: lang === 'en' ? 'Google Play payment was cancelled.' : 'Pembayaran Google Play dibatalkan.',
            type: 'info',
          })
        } else {
          setIsProcessing(false)
          setErrorMsg(typeof data === 'string' ? data : (lang === 'en' ? 'Google Play payment error.' : 'Ralat pembayaran Google Play.'))
        }
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).onGooglePlayPurchaseResult
      }
    }
  }, [lang])

  function switchLang(newLang: 'my' | 'en') {
    setLang(newLang)
    localStorage.setItem('lajus_lang', newLang)
  }

  const isPro = planType === 'pro' && subscriptionStatus === 'active'
  const currentTotalCapacity = 20 + (purchasedCardQuota || 0)
  const remainingSlots = Math.max(0, currentTotalCapacity - totalCustomers)

  // Pricing:
  // - Web (Stripe): RM0.50/card, RM53/month, RM616/year
  // - APK (Google Play In-App Billing): +30% store markup (RM0.65/card, RM69/month, RM800/year)
  const cardRate = isAndroidApp ? 0.65 : 0.50
  const proMonthly = isAndroidApp ? 69 : 53
  const proYearly = isAndroidApp ? 800 : 616
  const proYearlySaving = isAndroidApp ? 28 : 20
  const proYearlyRate = isAndroidApp ? '66.67' : '51.33'

  function handleCardPreset(count: number) {
    setCardCount(Math.max(35, count))
  }

  function handleCardChange(val: number) {
    if (isNaN(val)) setCardCount(35)
    else setCardCount(Math.max(35, Math.floor(val)))
  }

  async function handleBuyCards() {
    if (cardCount < 35) return
    setErrorMsg('')

    // If running in Android Native App, trigger Google Play In-App Billing
    if (isAndroidApp) {
      let productId = 'lajus_card_topup_35'
      if (cardCount >= 200) productId = 'lajus_card_topup_200'
      else if (cardCount >= 100) productId = 'lajus_card_topup_100'
      else if (cardCount >= 50) productId = 'lajus_card_topup_50'

      const ab = (window as any).AndroidBilling
      if (ab && typeof ab.launchPurchase === 'function') {
        ab.launchPurchase(productId)
      } else {
        setErrorMsg(
          lang === 'en'
            ? 'Google Play Billing is not ready on this device.'
            : 'Google Play Billing belum bersedia pada peranti anda.'
        )
      }
      return
    }

    // On Web, open Payment Method Selector Modal
    setPaymentTarget({
      type: 'card_topup',
      cardCount,
      priceRm: cardCount * cardRate,
      title: lang === 'en' ? `Top-Up ${cardCount} Digital Cards` : `Tambah ${cardCount} Kad Cop Digital`,
    })
    setShowPaymentModal(true)
  }

  async function handleCheckout(planChoice: 'monthly' | 'yearly') {
    setErrorMsg('')

    // If running inside Android native app, trigger Google Play Billing
    if (isAndroidApp) {
      const productId = planChoice === 'yearly' ? 'lajus_pro_yearly' : 'lajus_pro_monthly'
      const ab = (window as any).AndroidBilling
      if (ab && typeof ab.launchPurchase === 'function') {
        ab.launchPurchase(productId)
      } else {
        setErrorMsg(
          lang === 'en'
            ? 'Google Play Billing is not ready on this device.'
            : 'Google Play Billing belum bersedia pada peranti anda.'
        )
      }
      return
    }

    // On Web, open Payment Method Selector Modal
    setPaymentTarget({
      type: 'subscription',
      planChoice,
      priceRm: planChoice === 'yearly' ? proYearly : proMonthly,
      title:
        lang === 'en'
          ? `Subscribe to Pro (${planChoice === 'yearly' ? 'Yearly' : 'Monthly'})`
          : `Langgan Pelan Pro (${planChoice === 'yearly' ? 'Tahunan' : 'Bulanan'})`,
    })
    setShowPaymentModal(true)
  }

  async function handleExecutePayment() {
    if (!paymentTarget) return
    setIsProcessing(true)
    setErrorMsg('')

    try {
      if (selectedPaymentChannel === 'stripe') {
        const payload: any = {}
        if (paymentTarget.type === 'card_topup') {
          payload.plan = 'one_off_cards'
          payload.cardCount = paymentTarget.cardCount
        } else {
          payload.plan = paymentTarget.planChoice
        }

        const res = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || (lang === 'en' ? 'Failed to start Stripe checkout.' : 'Gagal memulakan pembayaran Stripe.'))
        }
        if (data.url) {
          window.location.href = data.url
        }
      } else {
        // toyyibPay (fpx or tng_qr)
        const payload: any = {
          channel: selectedPaymentChannel,
        }
        if (paymentTarget.type === 'card_topup') {
          payload.plan = 'one_off_cards'
          payload.cardCount = paymentTarget.cardCount
        } else {
          payload.plan = paymentTarget.planChoice
        }

        const res = await fetch('/api/toyyibpay/create-bill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || (lang === 'en' ? 'Failed to create toyyibPay bill.' : 'Gagal menjana bil toyyibPay.'))
        }
        if (data.url) {
          window.location.href = data.url
        }
      }
    } catch (err: any) {
      console.error('Payment start error:', err)
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
      <div className="w-full max-w-5xl mx-auto flex flex-col">
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

        {/* HERO TITLE */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="font-fraunces text-3xl sm:text-4xl md:text-5xl font-bold text-[#FAF2E2] leading-tight mb-2">
            {lang === 'en' ? 'Upgrade or Top-Up Cards' : 'Tambah Kuota Kad & Langganan'}
          </h1>
          <p className="text-xs sm:text-sm text-[#C4B897] leading-relaxed">
            {lang === 'en'
              ? 'Buy digital cards on-demand without monthly commitments, or subscribe to Pro for unlimited access.'
              : 'Beli kad cop digital mengikut keperluan tanpa komitmen bulanan, atau langgan Pro untuk akses tanpa had.'}
          </p>

          {/* STORE CURRENT STATUS PILL */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-[#FAF2E2]/[0.05] border border-[#FAF2E2]/10 shadow-inner">
            <span className="text-[#8E9B95]">{storeName || (lang === 'en' ? 'Your Store' : 'Kedai Anda')}:</span>
            <span className={isPro ? 'text-[#E5A43B] font-bold' : 'text-emerald-400 font-bold'}>
              {isPro
                ? (lang === 'en' ? '⭐ Pro Plan Active (Unlimited)' : '⭐ Pelan Pro Aktif (Tanpa Had)')
                : (lang === 'en'
                    ? `${totalCustomers} / ${currentTotalCapacity} Cards in Use (${remainingSlots} remaining)`
                    : `${totalCustomers} / ${currentTotalCapacity} Kad Diguna (${remainingSlots} baki kad)`)}
            </span>
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* PRICING CARDS GRID (2 CARDS: ONE-OFF CARDS TOP-UP & PRO PLAN) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-10">

          {/* 1. ONE-OFF CARD TOP-UP CARD */}
          <div className="rounded-[28px] p-6 sm:p-7 flex flex-col justify-between transition-all bg-gradient-to-b from-[#102320] to-[#0A1716] border-2 border-emerald-500/50 shadow-xl relative ring-1 ring-emerald-500/20">
            {/* BADGE */}
            <div className="absolute -top-3.5 left-6 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-md font-space">
              {lang === 'en' ? '⚡ One-Off Payment' : '⚡ Sekali Bayar • Sah Selamanya'}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 pt-1">
                <span className="font-space text-xs uppercase tracking-wider font-bold text-emerald-400">
                  {lang === 'en' ? 'Pay-As-You-Go' : 'Beli Kad Ikut Keperluan'}
                </span>
                <span className="text-[11px] font-bold text-[#8E9B95]">
                  RM{cardRate.toFixed(2)} / {lang === 'en' ? 'card' : 'kad'}
                </span>
              </div>

              <div className="font-fraunces text-2xl font-bold text-[#FAF2E2] mb-1">
                {lang === 'en' ? 'Digital Stamp Cards' : 'Pek Kad Cop Digital'}
              </div>
              <p className="text-xs text-[#C4B897] mb-5 leading-relaxed">
                {lang === 'en'
                  ? 'Top up customer cards like physical cards. No monthly fees, lifetime validity.'
                  : 'Sama seperti beli kad cop kertas. Tambah kuota bila perlu tanpa sebarang caj bulanan.'}
              </p>

              {/* INTERACTIVE CARD SELECTOR */}
              <div className="bg-[#0A1716]/80 border border-[#FAF2E2]/15 rounded-2xl p-4 mb-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FAF2E2]">
                    {lang === 'en' ? 'Select Card Quantity:' : 'Pilih Bilangan Kad:'}
                  </span>
                  <span className="text-[10px] text-amber-300 font-space font-semibold">
                    {lang === 'en' ? 'Min. 35 Cards' : 'Minima 35 Kad'}
                  </span>
                </div>

                {/* PRESET CHIPS */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[35, 50, 100, 200].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleCardPreset(preset)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer font-space border ${
                        cardCount === preset
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                          : 'bg-[#FAF2E2]/[0.06] hover:bg-[#FAF2E2]/12 text-[#FAF2E2] border-[#FAF2E2]/10'
                      }`}
                    >
                      {preset} {lang === 'en' ? 'Cards' : 'Kad'}
                    </button>
                  ))}
                </div>

                {/* STEPPER COUNTER */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      type="button"
                      disabled={cardCount <= 35 || isProcessing}
                      onClick={() => handleCardChange(Math.max(35, cardCount - 5))}
                      className="w-9 h-9 rounded-xl bg-[#FAF2E2]/10 hover:bg-[#FAF2E2]/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-lg text-white transition cursor-pointer"
                    >
                      –
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="35"
                        step="1"
                        value={cardCount}
                        onChange={(e) => handleCardChange(parseInt(e.target.value) || 35)}
                        className="w-full py-1.5 px-3 bg-slate-900 border border-[#FAF2E2]/20 rounded-xl text-center text-base font-bold font-space text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleCardChange(cardCount + 5)}
                      className="w-9 h-9 rounded-xl bg-[#FAF2E2]/10 hover:bg-[#FAF2E2]/20 active:scale-95 disabled:opacity-40 flex items-center justify-center font-bold text-lg text-white transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* COMPUTED PRICE */}
                  <div className="text-right">
                    <div className="text-[10px] text-[#8E9B95] uppercase font-space font-bold">
                      {lang === 'en' ? 'Total One-Off' : 'Jumlah Bayaran'}
                    </div>
                    <div className="font-fraunces text-2xl sm:text-3xl font-black text-emerald-400">
                      RM {(cardCount * cardRate).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* FEATURES LIST */}
              <ul className="space-y-3 text-xs mb-6">
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  <span><strong>+{cardCount} {lang === 'en' ? 'Digital Cards Quota' : 'Kapasiti Kad Baharu'}</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  <span><strong>{lang === 'en' ? 'Lifetime validity (No monthly fees)' : 'Sah selamanya (Tiada caj bulanan)'}</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'Full features: QR token, Bluetooth print, Google Review' : 'Semua ciri kaunter: QR token, Cetak resit Bluetooth, Google Review'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#8E9B95]/60">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-[10px] font-bold shrink-0">✕</span>
                  <span className="line-through">{lang === 'en' ? 'Email token dispatch (Pro exclusive)' : 'Hantar cop melalui emel (Eksklusif Pro sahaja)'}</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                type="button"
                onClick={handleBuyCards}
                disabled={isProcessing || cardCount < 35}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-[0.98] text-slate-950 font-jakarta font-black text-sm transition flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.35)] disabled:opacity-50"
              >
                {isAndroidApp ? (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path d="M3.609 1.814L13.793 12 3.61 22.186a2.38 2.38 0 0 1-.22-.968V2.782c0-.36.08-.697.22-.968z" fill="#00D3FE"/>
                      <path d="M17.15 8.643l-3.357 3.357 3.357 3.357 3.79-2.155a1.868 1.868 0 0 0 0-3.238l-3.79-2.155z" fill="#FFCE00"/>
                      <path d="M3.61 22.186L13.793 12l3.357 3.357-11.45 6.51c-.69.39-1.48.33-2.09-.04z" fill="#FF3A44"/>
                      <path d="M13.793 12L3.609 1.814C4.22 1.444 5.01 1.384 5.7 1.774l11.45 6.51L13.793 12z" fill="#00E676"/>
                    </svg>
                    <span>
                      {isProcessing
                        ? (lang === 'en' ? 'Connecting to Google Play...' : 'Menghubungkan ke Google Play...')
                        : (lang === 'en'
                            ? `Buy ${cardCount} Cards with Google Play ⚡`
                            : `Beli ${cardCount} Kad via Google Play ⚡`)}
                    </span>
                  </>
                ) : (
                  <span>
                    {isProcessing
                      ? (lang === 'en' ? 'Processing...' : 'Memproses...')
                      : (lang === 'en'
                          ? `Buy ${cardCount} Cards (RM ${(cardCount * cardRate).toFixed(2)}) ⚡`
                          : `Beli ${cardCount} Kad (RM ${(cardCount * cardRate).toFixed(2)}) ⚡`)}
                  </span>
                )}
              </button>
              <p className="text-center text-[10.5px] text-[#8E9B95] mt-2.5">
                {isAndroidApp
                  ? (lang === 'en' ? '1-Tap secure payment via Google Play • Lifetime card quota' : 'Bayaran 1-klik selamat melalui Google Play • Kuota sah selamanya')
                  : (lang === 'en' ? 'FPX, Touch \'n Go (toyyibPay) & Kad (Stripe) • Kuota sah selamanya' : 'FPX, Touch \'n Go (toyyibPay) & Kad (Stripe) • Kuota sah selamanya')}
              </p>
            </div>
          </div>

          {/* 2. PRO PLAN (UNLIMITED & EMAIL DISPATCH) */}
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
                : (lang === 'en' ? '🔥 Unlimited Customers' : '🔥 Pelanggan Tanpa Had')}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 pt-1">
                <span className="font-space text-xs uppercase tracking-wider font-bold text-[#E5A43B]">
                  {lang === 'en' ? 'Pro Subscription' : 'Langganan Pro'}
                </span>
                <span className="text-[11px] font-bold text-amber-300">
                  {lang === 'en' ? 'Unlimited' : 'Tanpa Had'}
                </span>
              </div>

              <div className="font-fraunces text-2xl font-bold text-[#FAF2E2] mb-1">
                {lang === 'en' ? 'Pro Plan' : 'Pelan Pro'}
              </div>
              <p className="text-xs text-[#C4B897] mb-4 leading-relaxed">
                {lang === 'en'
                  ? 'For high-volume stores needing unlimited customer capacity and email stamp delivery.'
                  : 'Untuk perniagaan aktif yang perlukan kapasiti tanpa had & ciri hantar cop melalui emel.'}
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
                    {lang === 'en' ? `SAVE RM${proYearlySaving}` : `JIMAT RM${proYearlySaving}`}
                  </span>
                </button>
              </div>

              {/* PRICE DISPLAY */}
              <div className="flex flex-col mb-5 pb-5 border-b border-[#FAF2E2]/15">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-fraunces text-4xl sm:text-5xl font-black text-[#E5A43B]">
                    {billingCycle === 'yearly' ? `RM${proYearly}` : `RM${proMonthly}`}
                  </span>
                  <span className="text-xs text-[#C4B897]">
                    /{billingCycle === 'yearly' ? (lang === 'en' ? 'year' : 'tahun') : (lang === 'en' ? 'month' : 'bulan')}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-emerald-400 text-xs font-bold mt-1 font-space">
                    {lang === 'en'
                      ? `≈ RM${proYearlyRate}/mo • Save RM${proYearlySaving} compared to monthly billing`
                      : `≈ RM${proYearlyRate}/bln • Jimat RM${proYearlySaving} berbanding bayaran bulanan`}
                  </p>
                )}
              </div>

              {/* PRO FEATURES LIST */}
              <ul className="space-y-3 text-xs mb-6">
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-5 h-5 rounded-full bg-[#E5A43B]/20 text-[#E5A43B] flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  <span><strong>{lang === 'en' ? 'Unlimited customer capacity' : 'Pelanggan tanpa had (Unlimited)'}</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-5 h-5 rounded-full bg-[#E5A43B]/20 text-[#E5A43B] flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  <span><strong>{lang === 'en' ? 'Unlimited email stamp dispatch' : 'Boleh hantar cop melalui emel tanpa had'}</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-[#FAF2E2]">
                  <span className="w-5 h-5 rounded-full bg-[#E5A43B]/20 text-[#E5A43B] flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                  <span>{lang === 'en' ? 'All features & priority customer support' : 'Semua ciri kaunter, cetak resit & sokongan keutamaan'}</span>
                </li>
              </ul>
            </div>

            <div>
              {isPro ? (
                <button
                  type="button"
                  onClick={handleOpenCustomerPortal}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-[0.98] text-white font-jakarta font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <span>{isProcessing ? (lang === 'en' ? 'Processing...' : 'Memproses...') : (lang === 'en' ? 'Manage Billing & Invoices (Stripe Portal) ↗' : 'Urus Langganan & Invois (Stripe Portal) ↗')}</span>
                </button>
              ) : isAndroidApp ? (
                <button
                  type="button"
                  onClick={() => handleCheckout(billingCycle)}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E5A43B] to-[#C77B1B] hover:brightness-110 active:scale-[0.98] text-[#1A2422] font-jakarta font-black text-sm transition flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_4px_20px_rgba(229,164,59,0.4)] hover:shadow-[0_4px_28px_rgba(229,164,59,0.55)] disabled:opacity-50"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186a2.38 2.38 0 0 1-.22-.968V2.782c0-.36.08-.697.22-.968z" fill="#00D3FE"/>
                    <path d="M17.15 8.643l-3.357 3.357 3.357 3.357 3.79-2.155a1.868 1.868 0 0 0 0-3.238l-3.79-2.155z" fill="#FFCE00"/>
                    <path d="M3.61 22.186L13.793 12l3.357 3.357-11.45 6.51c-.69.39-1.48.33-2.09-.04z" fill="#FF3A44"/>
                    <path d="M13.793 12L3.609 1.814C4.22 1.444 5.01 1.384 5.7 1.774l11.45 6.51L13.793 12z" fill="#00E676"/>
                  </svg>
                  <span>
                    {isProcessing
                      ? (lang === 'en' ? 'Connecting to Google Play...' : 'Menghubungkan ke Google Play...')
                      : (lang === 'en' ? 'Subscribe with Google Play ⚡' : 'Langgan melalui Google Play ⚡')}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCheckout(billingCycle)}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E5A43B] to-[#C77B1B] hover:brightness-110 active:scale-[0.98] text-[#1A2422] font-jakarta font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(229,164,59,0.4)] hover:shadow-[0_4px_28px_rgba(229,164,59,0.55)] disabled:opacity-50"
                >
                  <span>{isProcessing ? (lang === 'en' ? 'Processing...' : 'Memproses...') : (lang === 'en' ? 'Subscribe to Pro Now ⚡' : 'Langgan Pelan Pro Sekarang ⚡')}</span>
                </button>
              )}

              <p className="text-center text-[10.5px] text-[#8E9B95] mt-2.5">
                {isAndroidApp
                  ? (lang === 'en' ? '1-Tap secure checkout via Google Play (Google Pay, Touch \'n Go, Telco, Card)' : 'Bayaran 1-klik selamat melalui Google Play (Google Pay, Touch \'n Go, Bil Telco, Kad)')
                  : (lang === 'en' ? 'FPX, Touch \'n Go (toyyibPay) & Kad (Stripe) • Batal bila-bila masa' : 'FPX, Touch \'n Go (toyyibPay) & Kad (Stripe) • Batal bila-bila masa')}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM NOTE */}
        <div className="text-center text-xs text-[#8E9B95] mb-8">
          {lang === 'en'
            ? 'All digital cards and plans include counter staff portal, dynamic QR codes, receipt printing, and customer web cards.'
            : 'Setiap pek kad dan pelan merangkumi portal staff kaunter, token QR 30 minit, cetak resit Bluetooth, dan kad cop digital pelanggan.'}
        </div>

        {/* FOOTER */}
        <footer className="text-center text-[11px] text-[#FAF2E2]/40 font-space pb-6 border-t border-[#FAF2E2]/10 pt-6">
          © {new Date().getFullYear()} LajuS • {lang === 'en' ? 'All rights reserved.' : 'Hak cipta terpelihara.'}
        </footer>

        {/* ── PAYMENT METHOD SELECTOR MODAL (FPX, TOUCH 'N GO, STRIPE) ── */}
        {showPaymentModal && paymentTarget && (
          <div
            onClick={() => !isProcessing && setShowPaymentModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[460px] bg-[#142321] border border-[#FAF2E2]/15 rounded-[28px] p-6 sm:p-7 shadow-2xl text-[#FAF2E2]"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10.5px] font-space uppercase font-bold tracking-wider text-[#E5A43B]">
                    {lang === 'en' ? 'Choose Payment Channel' : 'Pilih Kaedah Pembayaran'}
                  </span>
                  <h3 className="font-fraunces text-xl font-bold text-[#FAF2E2] mt-0.5">
                    {paymentTarget.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => !isProcessing && setShowPaymentModal(false)}
                  disabled={isProcessing}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#FAF2E2]/60 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              {/* Amount Display */}
              <div className="bg-[#0A1716] border border-[#FAF2E2]/10 rounded-2xl p-4 mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] text-[#8E9B95] uppercase font-space font-bold">
                    {lang === 'en' ? 'Total Amount' : 'Jumlah Perlu Dibayar'}
                  </div>
                  <div className="text-xs text-[#FAF2E2]/70 mt-0.5">
                    {paymentTarget.type === 'subscription'
                      ? (paymentTarget.planChoice === 'yearly' ? 'Langganan 1 Tahun Pro' : 'Langganan 1 Bulan Pro')
                      : `Tambah ${paymentTarget.cardCount} Kuota Kad Cop`}
                  </div>
                </div>
                <div className="font-fraunces text-2xl sm:text-3xl font-black text-emerald-400">
                  RM {paymentTarget.priceRm.toFixed(2)}
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3 mb-6">
                {/* OPTION 1: FPX Online Banking (toyyibPay) */}
                <label
                  onClick={() => setSelectedPaymentChannel('fpx')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPaymentChannel === 'fpx'
                      ? 'bg-[#1C7A67]/25 border-[#1FA96B] shadow-[0_0_15px_rgba(28,122,103,0.35)]'
                      : 'bg-[#0A1716]/60 border-[#FAF2E2]/10 hover:border-[#FAF2E2]/25'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentChannel"
                    checked={selectedPaymentChannel === 'fpx'}
                    onChange={() => setSelectedPaymentChannel('fpx')}
                    className="accent-[#1FA96B] w-4 h-4 mt-1 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        🏦 FPX Online Banking
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        toyyibPay
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E9B95] leading-relaxed">
                      {lang === 'en'
                        ? 'Instant transfer from Maybank2u, CIMB Clicks, Bank Islam, RHB, Hong Leong, Public Bank, etc.'
                        : 'Pindahan terus Maybank2u, CIMB Clicks, Bank Islam, RHB, Hong Leong, Public Bank, dll.'}
                    </p>
                  </div>
                </label>

                {/* OPTION 2: Touch 'n Go / DuitNow QR (toyyibPay) */}
                <label
                  onClick={() => setSelectedPaymentChannel('tng_qr')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPaymentChannel === 'tng_qr'
                      ? 'bg-[#00D3FE]/15 border-[#00D3FE] shadow-[0_0_15px_rgba(0,211,254,0.25)]'
                      : 'bg-[#0A1716]/60 border-[#FAF2E2]/10 hover:border-[#FAF2E2]/25'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentChannel"
                    checked={selectedPaymentChannel === 'tng_qr'}
                    onChange={() => setSelectedPaymentChannel('tng_qr')}
                    className="accent-[#00D3FE] w-4 h-4 mt-1 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        📱 Touch 'n Go / DuitNow QR
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        toyyibPay
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E9B95] leading-relaxed">
                      {lang === 'en'
                        ? 'Scan QR with Touch \'n Go eWallet, MAE, GrabPay, Boost, or mobile banking.'
                        : 'Imbas kod QR menggunakan Touch \'n Go eWallet, MAE, GrabPay, Boost, atau aplikasi bank.'}
                    </p>
                  </div>
                </label>

                {/* OPTION 3: Credit / Debit Card (Stripe) */}
                <label
                  onClick={() => setSelectedPaymentChannel('stripe')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPaymentChannel === 'stripe'
                      ? 'bg-[#6366F1]/20 border-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                      : 'bg-[#0A1716]/60 border-[#FAF2E2]/10 hover:border-[#FAF2E2]/25'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentChannel"
                    checked={selectedPaymentChannel === 'stripe'}
                    onChange={() => setSelectedPaymentChannel('stripe')}
                    className="accent-[#6366F1] w-4 h-4 mt-1 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        💳 Kad Kredit / Debit Antarabangsa
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        Stripe
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E9B95] leading-relaxed">
                      {lang === 'en'
                        ? 'Visa, Mastercard, AMEX with auto-renewal support.'
                        : 'Kad Visa, Mastercard dengan sokongan pembaharuan automatik.'}
                    </p>
                  </div>
                </label>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E5A43B] to-[#C77B1B] hover:brightness-110 active:scale-[0.98] text-[#1A2422] font-jakarta font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <span>
                  {isProcessing
                    ? (lang === 'en' ? 'Connecting to payment gateway...' : 'Menyambung ke gerbang pembayaran...')
                    : (lang === 'en'
                        ? `Proceed to Payment (RM ${paymentTarget.priceRm.toFixed(2)}) →`
                        : `Teruskan ke Pembayaran (RM ${paymentTarget.priceRm.toFixed(2)}) →`)}
                </span>
              </button>

              <p className="text-center text-[10px] text-[#8E9B95] mt-3">
                🔒 {lang === 'en' ? 'Official encrypted payment gateway.' : 'Gerbang pembayaran rasmi dengan enkripsi selamat.'}
              </p>
            </div>
          </div>
        )}
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
