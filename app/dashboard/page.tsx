'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import { createClient } from '@/lib/supabase/client'
import {
  connectBluetoothPrinter,
  printStampReceipt,
  printClaimReceipt,
  type BluetoothPrinterConnection,
  type ClaimReceiptData,
} from '@/lib/bluetoothPrinter'
import { Lang, I18N_DASHBOARD } from '@/lib/i18n/dashboard'

interface ActivityItem {
  id: string
  type?: 'token_generated' | 'reward_redeemed'
  maskedToken: string
  stampCount: number
  status: 'pending' | 'claimed' | 'expired'
  deliveryMethod: 'qr' | 'email'
  recipientEmail?: string | null
  createdAt: string
  expiresAt: string
  formattedDate?: string
  formattedTime?: string
  fullTimestamp?: string
}

interface CustomerSearchResult {
  id: string
  email: string
  name: string
  totalStamps: number
  stampsRequired: number
  rewardDescription: string
  rewardsCatalog?: RewardCatalogItem[]
  fullCardsCount: number
  currentCardStamps: number
  isEligibleForReward: boolean
  recentRedemptions: Array<{
    id: string
    stamps_used: number
    reward_details: string
    created_at: string
  }>
}

interface RewardCatalogItem {
  id: string
  name: string
  stampsRequired: number
  imageUrl?: string
  description?: string
}

interface RewardItem {
  id: string
  name: string
  stampsRequired: number
  imageUrl: string
  description?: string
}

interface SocialLinkItem {
  platform: string
  url: string
}

const STAMP_ICON_OPTIONS = [
  { label: 'Makanan / Kafe', icon: '/icons/stamps/makanan.svg' },
  { label: 'Pastri / Bakeri', icon: '/icons/stamps/pastri.svg' },
  { label: 'Pizza / Makanan Segera', icon: '/icons/stamps/pizza.svg' },
  { label: 'Kek / Dessert', icon: '/icons/stamps/kek.svg' },
  { label: 'Barber / Salun', icon: '/icons/stamps/barber.svg' },
  { label: 'Car Wash / Dobi', icon: '/icons/stamps/car-wash.svg' },
  { label: 'Servis / Cleaning', icon: '/icons/stamps/servis.svg' },
  { label: 'Spa / Urutan', icon: '/icons/stamps/spa.svg' },
  { label: 'Retail / Butik', icon: '/icons/stamps/retail.svg' },
  { label: 'Pet Shop', icon: '/icons/stamps/pet-shop.svg' },
  { label: 'Kopi / Kafe', icon: '/icons/stamps/coffee.svg' },
  { label: 'Klinik / Farmasi', icon: '/icons/stamps/klinik.svg' },
]

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '/icons/social/instagram.svg', placeholder: 'https://instagram.com/namakedai' },
  { id: 'tiktok', label: 'TikTok', icon: '/icons/social/tiktok.svg', placeholder: 'https://tiktok.com/@namakedai' },
  { id: 'facebook', label: 'Facebook', icon: '/icons/social/facebook.svg', placeholder: 'https://facebook.com/namakedai' },
  { id: 'telegram', label: 'Telegram / WhatsApp', icon: '/icons/social/telegram.svg', placeholder: 'https://t.me/namakedai atau https://wa.me/60123456789' },
  { id: 'threads', label: 'Threads', icon: '/icons/social/threads.svg', placeholder: 'https://threads.net/@namakedai' },
  { id: 'youtube', label: 'YouTube', icon: '/icons/social/youtube.svg', placeholder: 'https://youtube.com/@namakedai' },
  { id: 'website', label: 'Laman Web / Menu', icon: '/icons/social/website.svg', placeholder: 'https://kedaisaya.com' },
]

export default function CashierDashboard() {
  const router = useRouter()
  const supabase = createClient()

  // i18n Language State
  const [lang, setLang] = useState<Lang>('my')

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

  const t = I18N_DASHBOARD[lang]

  // Auth State
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Onboarding Registration State
  const [needsRegistration, setNeedsRegistration] = useState<boolean>(false)
  const [regStoreName, setRegStoreName] = useState<string>('')
  const [regStampIcon, setRegStampIcon] = useState<string>('/icons/stamps/coffee.svg')
  const [regGoogleReviewMode, setRegGoogleReviewMode] = useState<'google' | 'manual'>('manual')
  const [regGoogleReviewInput, setRegGoogleReviewInput] = useState<string>('')
  const [isRegisteringStore, setIsRegisteringStore] = useState<boolean>(false)
  const [regError, setRegError] = useState<string>('')

  // Counter & Generator State
  const [stampCount, setStampCount] = useState<number>(1)
  const [mode, setMode] = useState<'qr' | 'email'>('qr')
  const [customerEmail, setCustomerEmail] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [genError, setGenError] = useState<string>('')

  // Result State
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [claimUrl, setClaimUrl] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [expiresAtDate, setExpiresAtDate] = useState<Date | null>(null)
  const [timeLeftStr, setTimeLeftStr] = useState<string>('30:00')
  const [emailSentNote, setEmailSentNote] = useState<string>('')
  const [showLargeQr, setShowLargeQr] = useState<boolean>(false)
  const [isTokenClaimed, setIsTokenClaimed] = useState<boolean>(false)
  const [claimedStampCount, setClaimedStampCount] = useState<number>(1)

  // Bluetooth Printer State
  const [btPrinter, setBtPrinter] = useState<BluetoothPrinterConnection | null>(null)
  const [isConnectingBt, setIsConnectingBt] = useState<boolean>(false)
  const [isPrinting, setIsPrinting] = useState<boolean>(false)
  const [btToast, setBtToast] = useState<{ msg: string; type: 'info' | 'success' | 'error' } | null>(null)
  const [autoPrint, setAutoPrint] = useState<boolean>(true)

  // Settings State
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [storeId, setStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [rewardImageUrl, setRewardImageUrl] = useState<string>('')
  const [rewardsList, setRewardsList] = useState<RewardItem[]>([])
  const [stampIcon, setStampIcon] = useState<string>('/icons/stamps/makanan.svg')
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([])
  const [showSocialModal, setShowSocialModal] = useState<boolean>(false)
  const [newSocialPlatform, setNewSocialPlatform] = useState<string>('instagram')
  const [newSocialUrl, setNewSocialUrl] = useState<string>('')
  const [googleReviewMode, setGoogleReviewMode] = useState<'google' | 'manual'>('manual')
  const [googleReviewInput, setGoogleReviewInput] = useState<string>('')
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string | null>(null)
  const [googlePlaceId, setGooglePlaceId] = useState<string | null>(null)
  const [stampsRequired, setStampsRequired] = useState<number>(10)
  const [rewardDesc, setRewardDesc] = useState<string>('')
  const [staffRole, setStaffRole] = useState<string>('cashier')
  const [planType, setPlanType] = useState<string>('free')
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('active')
  const [purchasedCardQuota, setPurchasedCardQuota] = useState<number>(0)
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false)
  const [saveToast, setSaveToast] = useState<boolean>(false)
  const [settingsError, setSettingsError] = useState<string>('')
  const [openSettingSection, setOpenSettingSection] = useState<string | null>(null)
  const initialSettingsLoadedRef = useRef<boolean>(false)
  const [baselineSettings, setBaselineSettings] = useState<{
    storeName: string
    stampsRequired: number
    rewardDesc: string
    googleReviewMode: 'google' | 'manual'
    googleReviewInput: string
    logoUrl: string
    stampIcon: string
    rewardsList: RewardItem[]
    socialLinks: SocialLinkItem[]
  }>({
    storeName: '',
    stampsRequired: 10,
    rewardDesc: '',
    googleReviewMode: 'manual',
    googleReviewInput: '',
    logoUrl: '',
    stampIcon: '/icons/stamps/makanan.svg',
    rewardsList: [],
    socialLinks: [],
  })

  // Settings Share & Scan State
  const [showSettingsQrModal, setShowSettingsQrModal] = useState<boolean>(false)
  const [settingsQrDataUrl, setSettingsQrDataUrl] = useState<string | null>(null)
  const [settingsShareUrl, setSettingsShareUrl] = useState<string>('')
  const [settingsCloneCode, setSettingsCloneCode] = useState<string>('')
  const [manualClonePin, setManualClonePin] = useState<string>('')
  const [isGeneratingSettingsQr, setIsGeneratingSettingsQr] = useState<boolean>(false)
  const [configCopied, setConfigCopied] = useState<boolean>(false)
  const [showSettingsScanner, setShowSettingsScanner] = useState<boolean>(false)
  const [settingsScanError, setSettingsScanError] = useState<string>('')
  const [settingsScanSuccess, setSettingsScanSuccess] = useState<string>('')
  const settingsScannerRef = useRef<any>(null)
  const isProcessingSettingsScanRef = useRef<boolean>(false)
  const handledClaimTokensRef = useRef<Set<string>>(new Set())

  // Single Notification Audio Sound Player with strict anti-spam throttle
  const lastAudioPlayedAtRef = useRef<number>(0)
  const playNotificationSound = useCallback((volume = 0.8) => {
    const now = Date.now()
    if (now - lastAudioPlayedAtRef.current < 2500) {
      return // Prevent spamming sound if triggered multiple times
    }
    lastAudioPlayedAtRef.current = now
    try {
      const audio = new Audio('/new notification.mp3')
      audio.volume = volume
      audio.play().catch(() => {})
    } catch (_e) {}
  }, [])

  // Store Overview Stats
  const [storeStats, setStoreStats] = useState({
    totalCustomers: 0,
    totalStampsGiven: 0,
    totalTokensClaimed: 0,
    totalRedemptions: 0,
    totalTokensIssued: 0,
  })

  // Customer Reward Claim Search State
  const [searchEmail, setSearchEmail] = useState<string>('')
  const [isSearchingCustomer, setIsSearchingCustomer] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<CustomerSearchResult | null>(null)
  const [searchError, setSearchError] = useState<string>('')
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false)
  const [lastClaimReceipt, setLastClaimReceipt] = useState<ClaimReceiptData | null>(null)
  const [isPrintingClaim, setIsPrintingClaim] = useState<boolean>(false)
  const [redeemCount, setRedeemCount] = useState<number>(1)
  const [selectedRewardId, setSelectedRewardId] = useState<string>('')

  // Customer QR Camera Scanner State
  const [showQrScanner, setShowQrScanner] = useState<boolean>(false)
  const [scannerError, setScannerError] = useState<string>('')
  const scannerRef = useRef<any>(null)

  // Stats Loading State (for instant lightweight shimmer placeholder)
  const [statsLoading, setStatsLoading] = useState<boolean>(true)

  // Activity Feed (Paginated 10 per request & Collapsible)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loadingActivity, setLoadingActivity] = useState<boolean>(false)
  const [activityPage, setActivityPage] = useState<number>(1)
  const [totalActivityPages, setTotalActivityPages] = useState<number>(1)
  const [totalActivityCount, setTotalActivityCount] = useState<number>(0)
  const [hasMoreActivity, setHasMoreActivity] = useState<boolean>(false)
  const [showActivityLog, setShowActivityLog] = useState<boolean>(false)

  // Export Activity Modal State
  const [showExportModal, setShowExportModal] = useState<boolean>(false)
  const [exportPeriod, setExportPeriod] = useState<
    'this_month' | 'last_month' | 'last_3_months' | 'all' | 'custom'
  >('this_month')
  const [exportStartDate, setExportStartDate] = useState<string>('')
  const [exportEndDate, setExportEndDate] = useState<string>('')
  const [isExporting, setIsExporting] = useState<boolean>(false)

  // Delete Account Modal State
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState<boolean>(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('')
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false)
  const [deleteAccountError, setDeleteAccountError] = useState<string>('')

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const showSettingsRef = useRef<boolean>(false)

  useEffect(() => {
    showSettingsRef.current = showSettings
  }, [showSettings])

  // 1. Check current cashier session
  useEffect(() => {
    async function checkSession() {
      setAuthLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setAuthLoading(false)

      if (session?.user && !initialSettingsLoadedRef.current) {
        loadSettings(true)
        loadActivity(1)
      }
    }
    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)
      if (event === 'SIGNED_IN' && currentUser) {
        // Prevent wiping user form fields when switching apps/tabs
        if (!initialSettingsLoadedRef.current) {
          loadSettings(true)
          loadActivity(1)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. Fetch Store Settings & Check Registration Status
  async function loadSettings(force = false) {
    setSettingsLoading(true)
    try {
      const res = await fetch('/api/store/settings')
      if (res.ok) {
        const data = await res.json()
        setNeedsRegistration(data.needsRegistration)
        if (!data.needsRegistration) {
          setStoreId(data.storeId)
          setStaffRole(data.role || 'cashier')
          setPlanType(data.planType || 'free')
          setSubscriptionStatus(data.subscriptionStatus || 'active')
          setPurchasedCardQuota(data.purchasedCardQuota || 0)
          initialSettingsLoadedRef.current = true

          const isGoogleMode = data.googleReviewMode === 'google' || Boolean(data.googleReviewUrl)
          const resolvedReviewInput = data.googleReviewUrl || ''

          // Only overwrite user-editable form fields if forced (e.g. initial load, save, QR clone)
          // or if the settings panel is NOT currently opened/being edited by the user
          if (force || !showSettingsRef.current) {
            setStoreName(data.name || '')
            setLogoUrl(data.logoUrl || '')
            setRewardImageUrl(data.rewardImageUrl || '')
            setRewardsList(Array.isArray(data.rewards) ? data.rewards : [])
            setStampIcon(data.stampIcon || '/icons/stamps/makanan.svg')
            setSocialLinks(Array.isArray(data.socialLinks) ? data.socialLinks : [])
            setStampsRequired(data.stampsRequired || 10)
            setRewardDesc(data.rewardDescription || '')
            setGoogleReviewMode(isGoogleMode ? 'google' : 'manual')
            setGoogleReviewUrl(data.googleReviewUrl || null)
            setGooglePlaceId(data.googlePlaceId || null)
            setGoogleReviewInput(resolvedReviewInput)

            setBaselineSettings({
              storeName: data.name || '',
              stampsRequired: data.stampsRequired || 10,
              rewardDesc: data.rewardDescription || '',
              googleReviewMode: isGoogleMode ? 'google' : 'manual',
              googleReviewInput: resolvedReviewInput,
              logoUrl: data.logoUrl || '',
              stampIcon: data.stampIcon || '/icons/stamps/makanan.svg',
              rewardsList: Array.isArray(data.rewards) ? data.rewards : [],
              socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
            })
          }
        }
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    } finally {
      setSettingsLoading(false)
    }
  }

  // 3. Fetch Paginated Activity List & Store Stats (10 items per page)
  async function loadActivity(page = 1, currentStoreId = storeId) {
    setLoadingActivity(true)
    if (page === 1) setStatsLoading(true)
    try {
      const targetStoreId = currentStoreId || storeId
      const url = targetStoreId
        ? `/api/store/activity?storeId=${targetStoreId}&page=${page}&limit=10`
        : `/api/store/activity?page=${page}&limit=10`

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setActivities(data.activities || [])
        if (data.pagination) {
          setActivityPage(data.pagination.page || 1)
          setTotalActivityPages(data.pagination.totalPages || 1)
          setTotalActivityCount(data.pagination.total || 0)
          setHasMoreActivity(Boolean(data.pagination.hasMore))
        }
        if (data.stats) {
          setStoreStats(data.stats)
        }
      }
    } catch (e) {
      console.error('Failed to load activity:', e)
    } finally {
      setLoadingActivity(false)
      setStatsLoading(false)
    }
  }

  // 3.1 Export Activity Logs to CSV
  async function handleExportActivity() {
    setIsExporting(true)
    try {
      let start: string | undefined
      let end: string | undefined
      const now = new Date()

      if (exportPeriod === 'this_month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString()
      } else if (exportPeriod === 'last_month') {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).toISOString()
      } else if (exportPeriod === 'last_3_months') {
        start = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString()
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString()
      } else if (exportPeriod === 'custom') {
        if (exportStartDate) start = new Date(exportStartDate).toISOString()
        if (exportEndDate) {
          const endD = new Date(exportEndDate)
          endD.setHours(23, 59, 59, 999)
          end = endD.toISOString()
        }
      }

      const targetStoreId = storeId
      let url = `/api/store/activity?storeId=${targetStoreId}&export=true`
      if (start) url += `&startDate=${encodeURIComponent(start)}`
      if (end) url += `&endDate=${encodeURIComponent(end)}`

      const res = await fetch(url)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal memuat turun data.')

      const items: any[] = data.exportActivities || []
      if (items.length === 0) {
        showBtToast('Tiada rekod aktiviti untuk tempoh dipilih.', 'info')
        setShowExportModal(false)
        return
      }

      // Build CSV with UTF-8 BOM
      const headers = [
        'ID Token',
        'Tarikh & Masa',
        'Bilangan Cop',
        'Status',
        'Kaedah Hantar',
        'Emel Penerima',
        'Tarikh Luput',
        'Tarikh Dituntut',
      ]
      const rows = items.map((it) => [
        `"${it.token}"`,
        `"${it.fullTimestamp || it.createdAt}"`,
        it.stampCount,
        `"${it.status === 'claimed' ? 'Ditebus' : it.status === 'expired' ? 'Luput' : 'Menunggu'}"`,
        `"${it.deliveryMethod === 'email' ? 'Emel' : 'QR Kod'}"`,
        `"${it.recipientEmail || '-'}"`,
        `"${it.expiresAt ? new Date(it.expiresAt).toLocaleString('ms-MY') : '-'}"`,
        `"${it.claimedAt && it.claimedAt !== '-' ? new Date(it.claimedAt).toLocaleString('ms-MY') : '-'}"`,
      ])

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      const periodLabel =
        exportPeriod === 'this_month'
          ? 'Bulan_Ini'
          : exportPeriod === 'last_month'
          ? 'Bulan_Lepas'
          : exportPeriod === 'last_3_months'
          ? '3_Bulan_Lepas'
          : exportPeriod === 'custom'
          ? 'Tarikh_Pilihan'
          : 'Semua_Rekod'
      link.setAttribute(
        'download',
        `Log_Aktiviti_${(storeName || 'Kedai').replace(/\s+/g, '_')}_${periodLabel}_${now.toISOString().slice(0, 10)}.csv`
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)

      showBtToast(`Berjaya muat turun ${items.length} rekod aktiviti (.CSV)!`, 'success')
      setShowExportModal(false)
    } catch (err: any) {
      showBtToast(err.message || 'Ralat muat turun aktiviti.', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  // 4. Timer Countdown for Generated Token
  useEffect(() => {
    if (!expiresAtDate) return

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    const tick = () => {
      const diff = Math.max(0, Math.floor((expiresAtDate.getTime() - Date.now()) / 1000))
      if (diff <= 0) {
        setTimeLeftStr(t.generator.expiredMsg)
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
        return
      }
      const m = String(Math.floor(diff / 60)).padStart(2, '0')
      const s = String(diff % 60).padStart(2, '0')
      setTimeLeftStr(t.generator.expiresIn(m, s))
    }

    tick()
    countdownIntervalRef.current = setInterval(tick, 1000)

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [expiresAtDate, lang])

  // 4.1 Real-time Detection: Auto detect when customer claims active QR code
  useEffect(() => {
    if (!generatedToken || mode !== 'qr' || isTokenClaimed) return

    const currentToken = generatedToken
    let isMounted = true
    let pollTimer: NodeJS.Timeout | null = null
    let autoCloseTimer: NodeJS.Timeout | null = null

    function triggerClaimSuccess(count: number) {
      if (!isMounted || isTokenClaimed || handledClaimTokensRef.current.has(currentToken)) return
      handledClaimTokensRef.current.add(currentToken)
      setIsTokenClaimed(true)
      setClaimedStampCount(count)

      // 🔔 Play notification chime strictly ONCE
      playNotificationSound(0.8)

      // Refresh dashboard stats & activity in background
      loadActivity(1)

      // Auto close large modal & cleanup after 2.3 seconds
      autoCloseTimer = setTimeout(() => {
        if (isMounted) {
          setShowLargeQr(false)
        }
      }, 2300)
    }

    async function checkStatus() {
      if (!currentToken || !isMounted || isTokenClaimed || handledClaimTokensRef.current.has(currentToken)) return
      try {
        const res = await fetch(
          `/api/tokens/status?token=${encodeURIComponent(currentToken)}${
            storeId ? `&storeId=${encodeURIComponent(storeId)}` : ''
          }`
        )
        if (res.ok) {
          const data = await res.json()
          if (data.claimed && isMounted) {
            triggerClaimSuccess(data.stampCount || stampCount)
          }
        }
      } catch (_e) {
        // silent catch
      }
    }

    // 1. Supabase Realtime channel
    const channel = supabase
      .channel(`claim-token-${currentToken}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'stamp_tokens',
          filter: `token=eq.${currentToken}`,
        },
        (payload: any) => {
          if (payload.new && payload.new.status === 'claimed' && isMounted) {
            triggerClaimSuccess(payload.new.stamp_count || stampCount)
          }
        }
      )
      .subscribe()

    // 2. High-speed Polling fallback (every 1.5s)
    pollTimer = setInterval(checkStatus, 1500)

    return () => {
      isMounted = false
      if (pollTimer) clearInterval(pollTimer)
      if (autoCloseTimer) clearTimeout(autoCloseTimer)
      supabase.removeChannel(channel)
    }
  }, [generatedToken, mode, isTokenClaimed, storeId, stampCount, playNotificationSound])

  // 5. Handle Google-Only Cashier Login
  async function handleGoogleLogin() {
    setIsLoggingIn(true)
    setLoginError('')
    const origin = window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/dashboard`,
      },
    })
    if (error) {
      setLoginError(error.message)
      setIsLoggingIn(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setNeedsRegistration(false)
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
        setDeleteAccountError(data.error || 'Gagal memadam akaun.')
        return
      }
      // Sign out and redirect to /
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (err: any) {
      setDeleteAccountError('Ralat sambungan. Sila cuba lagi.')
    } finally {
      setIsDeletingAccount(false)
    }
  }

  // 6. Handle Store Registration (Onboarding -> Get Store UUID)
  async function handleRegisterStore(e: React.FormEvent) {
    e.preventDefault()
    if (!regStoreName.trim()) {
      setRegError('Sila masukkan nama kedai.')
      return
    }

    setIsRegisteringStore(true)
    setRegError('')

    try {
      const seedReward = {
        id: 'rw_' + Date.now(),
        name: '1 Ganjaran Percuma',
        stampsRequired: 10,
        imageUrl: '',
        description: 'Tebus di kaunter',
      }

      const regPayload: any = {
        name: regStoreName.trim(),
        stampsRequired: 10,
        rewardDescription: '1 Ganjaran Percuma',
        rewards: [seedReward],
        stampIcon: regStampIcon || '/icons/stamps/coffee.svg',
        googleReviewMode: regGoogleReviewMode,
      }
      if (regGoogleReviewMode === 'google') {
        regPayload.googleReviewInput = regGoogleReviewInput.trim()
      }

      const res = await fetch('/api/store/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regPayload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mendaftarkan kedai.')
      }

      setStoreId(data.storeId)
      setStoreName(data.name)
      setStampsRequired(data.stampsRequired || 10)
      setRewardDesc(data.rewardDescription || '1 Ganjaran Percuma')
      setStampIcon(data.stampIcon || regStampIcon || '/icons/stamps/coffee.svg')
      setRewardsList(Array.isArray(data.rewards) && data.rewards.length > 0 ? data.rewards : [seedReward])
      setGoogleReviewMode(data.googleReviewMode || 'manual')
      setGoogleReviewUrl(data.googleReviewUrl || null)
      setGooglePlaceId(data.googlePlaceId || null)
      setGoogleReviewInput(data.googleReviewUrl || '')
      setStaffRole('owner')
      setNeedsRegistration(false)

      loadActivity(1, data.storeId)
    } catch (err: any) {
      setRegError(err.message || 'Ralat semasa mendaftarkan kedai.')
    } finally {
      setIsRegisteringStore(false)
    }
  }

  function showBtToast(msg: string, type: 'info' | 'success' | 'error' = 'info') {
    setBtToast({ msg, type })
    setTimeout(() => setBtToast(null), 3500)
  }

  // 7. Bluetooth Thermal Printer Connect / Disconnect
  async function handleToggleBluetooth() {
    if (btPrinter) {
      try {
        if (btPrinter.device.gatt?.connected) {
          btPrinter.device.gatt.disconnect()
        }
      } catch (e) {
        console.warn('Error disconnecting BT:', e)
      }
      setBtPrinter(null)
      showBtToast('Printer Bluetooth diputuskan.', 'info')
      return
    }

    setIsConnectingBt(true)
    try {
      const conn = await connectBluetoothPrinter()
      setBtPrinter(conn)
      showBtToast(`Printer disambung: ${conn.name}`, 'success')

      // 🔔 Play notification sound on successful BT connection
      playNotificationSound(0.7)

      conn.device.addEventListener('gattserverdisconnected', () => {
        setBtPrinter(null)
        showBtToast('Printer Bluetooth terputus.', 'error')
      })
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        showBtToast(err.message || 'Gagal menyambung ke printer Bluetooth.', 'error')
      }
    } finally {
      setIsConnectingBt(false)
    }
  }

  // 8. Print Stamp Receipt (Manual or Triggered)
  async function handlePrintReceipt(
    token = generatedToken,
    url = claimUrl,
    count = stampCount
  ) {
    if (!token || !url) {
      showBtToast('Tiada token aktif untuk dicetak.', 'error')
      return
    }

    let activeConn = btPrinter

    if (!activeConn) {
      setIsConnectingBt(true)
      try {
        activeConn = await connectBluetoothPrinter()
        setBtPrinter(activeConn)
        activeConn.device.addEventListener('gattserverdisconnected', () => {
          setBtPrinter(null)
          showBtToast('Printer Bluetooth terputus.', 'error')
        })
        showBtToast(`Printer disambung: ${activeConn.name}`, 'success')
      } catch (err: any) {
        if (err.name !== 'NotFoundError') {
          showBtToast(err.message || 'Gagal menyambung printer.', 'error')
        }
        setIsConnectingBt(false)
        return
      } finally {
        setIsConnectingBt(false)
      }
    }

    setIsPrinting(true)
    try {
      await printStampReceipt(activeConn, {
        storeName,
        stampCount: count,
        tokenCode: token,
        claimUrl: url,
        expiresInMinutes: 30,
      })
      showBtToast('Resit berjaya dicetak!', 'success')
    } catch (err: any) {
      showBtToast(err.message || 'Ralat semasa mencetak resit.', 'error')
    } finally {
      setIsPrinting(false)
    }
  }

  // 9. Generate Stamp Token
  async function handleGenerateToken() {
    setIsGenerating(true)
    setGenError('')
    setIsTokenClaimed(false)
    setShowLargeQr(false)

    try {
      const res = await fetch('/api/tokens/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          stampCount,
          deliveryMethod: mode,
          customerEmail: mode === 'email' ? customerEmail.trim() : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menjana token cop.')
      }

      setGeneratedToken(data.token)
      setClaimUrl(data.claimUrl)
      const expiry = new Date(data.expiresAt)
      setExpiresAtDate(expiry)

      if (mode === 'qr') {
        const qrUrl = await QRCode.toDataURL(data.claimUrl, {
          width: 320,
          margin: 1,
          color: {
            dark: '#1C2624',
            light: '#FFFFFF',
          },
        })
        setQrDataUrl(qrUrl)

        // AUTO-PRINT RECEIPT IF PRINTER IS CONNECTED AND AUTO-PRINT ENABLED
        if (btPrinter && autoPrint) {
          printStampReceipt(btPrinter, {
            storeName: data.storeName || storeName,
            stampCount: data.stampCount || stampCount,
            tokenCode: data.token,
            claimUrl: data.claimUrl,
            expiresInMinutes: 30,
          })
            .then(() => {
              showBtToast('Resit dicetak secara automatik!', 'success')
            })
            .catch((printErr) => {
              console.warn('Auto-print error:', printErr)
              showBtToast('Gagal auto-print resit. Tekan butang Cetak Resit.', 'error')
            })
        }
      } else {
        setEmailSentNote(
          `Pautan cop dihantar ke ${customerEmail || 'emel pelanggan'} — sah selama 30 minit.`
        )
      }

      loadActivity(1)
    } catch (err: any) {
      setGenError(err.message || 'Ralat berlaku.')
    } finally {
      setIsGenerating(false)
    }
  }

  function handleResetToken() {
    setGeneratedToken(null)
    setClaimUrl(null)
    setQrDataUrl(null)
    setExpiresAtDate(null)
    setIsTokenClaimed(false)
    setShowLargeQr(false)
  }

  // 10. Search Customer by Email for Reward Claim
  async function handleSearchCustomer(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!searchEmail.trim()) {
      setSearchError('Sila masukkan emel pelanggan.')
      return
    }

    setIsSearchingCustomer(true)
    setSearchError('')
    setSearchResult(null)

    try {
      const res = await fetch(
        `/api/store/customer-search?email=${encodeURIComponent(
          searchEmail.trim()
        )}&storeId=${storeId}`
      )
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Ralat semasa mencari pelanggan.')
      }

      if (!data.found) {
        setSearchError(data.message || 'Pelanggan tidak dijumpai.')
      } else {
        setSearchResult(data.customer)
        setRedeemCount(1) // reset redeem count for each new customer
        // Auto-pilih hadiah pertama dalam katalog (jika ada)
        const catalog = data.customer.rewardsCatalog
        setSelectedRewardId(
          Array.isArray(catalog) && catalog.length > 0 ? catalog[0].id : ''
        )
      }
    } catch (err: any) {
      setSearchError(err.message || 'Ralat carian pelanggan.')
    } finally {
      setIsSearchingCustomer(false)
    }
  }

  // 11. Cashier "Done Claim" Reward Action & Auto-Print Receipt
  async function handleRedeemReward() {
    if (!searchResult) return

    setIsRedeeming(true)
    try {
      const res = await fetch('/api/store/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: searchResult.id,
          storeId,
          rewardCount: redeemCount,
          rewardId: selectedRewardId || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menebus ganjaran.')
      }

      // Build claim receipt details
      const claimReceiptInfo: ClaimReceiptData = {
        storeName: data.storeName || storeName || 'Kedai Cop',
        customerEmail: data.customerEmail || searchResult.email,
        stampsUsed: data.stampsUsed,
        remainingStamps: data.remainingStamps,
        rewardName: data.rewardDescription || searchResult.rewardDescription || 'Ganjaran Percuma',
        rewardQuantity: data.rewardQuantity || redeemCount || 1,
        redeemedAt: data.redeemedAt || new Date().toISOString(),
      }

      setLastClaimReceipt(claimReceiptInfo)

      // AUTO-PRINT RECEIPT IF PRINTER IS CONNECTED
      if (btPrinter && autoPrint) {
        try {
          await printClaimReceipt(btPrinter, claimReceiptInfo)
          showBtToast('Penebusan berjaya! Resit telah dicetak automatik.', 'success')
        } catch (printErr: any) {
          console.warn('Auto print claim receipt failed:', printErr)
          showBtToast(`Penebusan berjaya (${data.stampsUsed} cop). Ralat cetak: ${printErr.message}`, 'error')
        }
      } else {
        showBtToast(`Penebusan berjaya! ${data.stampsUsed} cop digunakan.`, 'success')
      }

      // Refresh customer search result
      handleSearchCustomer()

      // Refresh activity log & stats
      loadActivity(1)
    } catch (err: any) {
      showBtToast(err.message || 'Ralat penebusan ganjaran.', 'error')
    } finally {
      setIsRedeeming(false)
    }
  }

  // 11.1 Manual Print Claim Receipt (if cashier wants to re-print or connect printer later)
  async function handlePrintClaimReceipt(receiptInfo = lastClaimReceipt) {
    if (!receiptInfo) {
      showBtToast('Tiada maklumat resit penebusan untuk dicetak.', 'error')
      return
    }

    let activeConn = btPrinter

    if (!activeConn) {
      setIsConnectingBt(true)
      try {
        activeConn = await connectBluetoothPrinter()
        setBtPrinter(activeConn)
        activeConn.device.addEventListener('gattserverdisconnected', () => {
          setBtPrinter(null)
          showBtToast('Printer Bluetooth terputus.', 'error')
        })
        showBtToast(`Printer disambung: ${activeConn.name}`, 'success')
      } catch (err: any) {
        if (err.name !== 'NotFoundError') {
          showBtToast(err.message || 'Gagal menyambung printer.', 'error')
        }
        setIsConnectingBt(false)
        return
      } finally {
        setIsConnectingBt(false)
      }
    }

    setIsPrintingClaim(true)
    try {
      await printClaimReceipt(activeConn, receiptInfo)
      showBtToast('Resit penebusan berjaya dicetak!', 'success')
    } catch (err: any) {
      showBtToast(err.message || 'Ralat semasa mencetak resit penebusan.', 'error')
    } finally {
      setIsPrintingClaim(false)
    }
  }

  // 12. QR Code Camera Scanner Lifecycle
  useEffect(() => {
    let html5QrCodeInstance: any = null
    let isMounted = true

    async function startCamera() {
      if (!showQrScanner) return
      setScannerError('')

      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        if (!isMounted) return

        const readerElem = document.getElementById('dashboard-qr-reader')
        if (!readerElem) return

        html5QrCodeInstance = new Html5Qrcode('dashboard-qr-reader')
        scannerRef.current = html5QrCodeInstance

        await html5QrCodeInstance.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              const edge = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.75)
              return { width: edge, height: edge }
            },
            aspectRatio: 1.0,
          },
          (decodedText: string) => {
            const cleanedEmail = decodedText.trim()
            setSearchEmail(cleanedEmail)
            handleCloseQrScanner(html5QrCodeInstance)
          },
          () => {
            // Ignore continuous frame parse errors
          }
        )
      } catch (err: any) {
        console.error('QR Scanner init error:', err)
        if (isMounted) {
          setScannerError(
            t.searchSection.scanCameraError ||
              'Tidak dapat mengakses kamera. Sila benarkan kebenaran kamera.'
          )
        }
      }
    }

    if (showQrScanner) {
      const timer = setTimeout(() => {
        startCamera()
      }, 150)
      return () => {
        clearTimeout(timer)
        isMounted = false
        handleCloseQrScanner(html5QrCodeInstance || scannerRef.current)
      }
    }
  }, [showQrScanner])

  function handleCloseQrScanner(instance?: any) {
    const scanner = instance || scannerRef.current
    if (scanner) {
      try {
        if (scanner.isScanning) {
          scanner
            .stop()
            .then(() => {
              try {
                scanner.clear()
              } catch {}
            })
            .catch(() => {})
        }
      } catch {}
    }
    scannerRef.current = null
    setShowQrScanner(false)
  }

  // 12.1 Apply Store Template from Short PIN / Link / Code
  async function applyStoreTemplate(input: string) {
    if (!input) return false
    try {
      let rawText = input.trim()

      // Extract code from URL if scanned or visited as full URL
      let codeToUse = rawText
      if (rawText.includes('clone=')) {
        try {
          const urlObj = new URL(
            rawText.startsWith('http')
              ? rawText
              : `https://dummy.com/${rawText.startsWith('?') ? '' : '?'}${rawText}`
          )
          codeToUse = urlObj.searchParams.get('clone') || codeToUse
        } catch {
          const match = rawText.match(/[?&]clone=([^&#]+)/)
          if (match) codeToUse = decodeURIComponent(match[1])
        }
      } else if (rawText.includes('importStore=')) {
        try {
          const urlObj = new URL(
            rawText.startsWith('http')
              ? rawText
              : `https://dummy.com/${rawText.startsWith('?') ? '' : '?'}${rawText}`
          )
          codeToUse = urlObj.searchParams.get('importStore') || codeToUse
        } catch {
          const match = rawText.match(/[?&]importStore=([^&#]+)/)
          if (match) codeToUse = decodeURIComponent(match[1])
        }
      }

      // Call backend POST /api/store/clone-template with action: 'apply'
      const res = await fetch('/api/store/clone-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply',
          code: codeToUse,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyalin tetapan kedai.')
      }

      // Automatically reload settings from database to display fresh saved data!
      await loadSettings(true)

      // Ensure settings modal is opened for review
      setShowSettings(true)

      // 🔔 Play notification chime strictly ONCE
      playNotificationSound(0.8)

      setSettingsScanSuccess(
        data.message || 'Semua tetapan berjaya disalin dan disimpan terus ke Kedai B!'
      )
      setTimeout(() => setSettingsScanSuccess(''), 8000)
      return true
    } catch (e: any) {
      setSettingsScanError(e.message || 'Gagal membaca data dari kod pautan kedai.')
      return false
    }
  }

  // 12.2 Auto-detect ?clone=XYZ or ?importStore=XYZ URL parameter on load
  useEffect(() => {
    if (typeof window === 'undefined') return
    const urlParams = new URLSearchParams(window.location.search)
    const cloneCode = urlParams.get('clone') || urlParams.get('importStore')
    if (cloneCode) {
      applyStoreTemplate(cloneCode)
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
    }
  }, [])

  // 12.3 Settings Camera QR Scanner Lifecycle
  useEffect(() => {
    let html5QrCodeInstance: any = null
    let isMounted = true

    async function startSettingsCamera() {
      if (!showSettingsScanner) return
      setSettingsScanError('')
      isProcessingSettingsScanRef.current = false

      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        if (!isMounted) return

        const readerElem = document.getElementById('settings-qr-reader')
        if (!readerElem) return

        html5QrCodeInstance = new Html5Qrcode('settings-qr-reader')
        settingsScannerRef.current = html5QrCodeInstance

        await html5QrCodeInstance.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              const edge = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.75)
              return { width: edge, height: edge }
            },
            aspectRatio: 1.0,
          },
          async (decodedText: string) => {
            // Anti-spam lock: Ignore subsequent video frames while processing
            if (isProcessingSettingsScanRef.current) return
            isProcessingSettingsScanRef.current = true

            try {
              const ok = await applyStoreTemplate(decodedText)
              if (ok) {
                handleCloseSettingsScanner(html5QrCodeInstance)
              }
            } finally {
              setTimeout(() => {
                isProcessingSettingsScanRef.current = false
              }, 2000)
            }
          },
          () => {
            // ignore continuous scanning frame
          }
        )
      } catch (err: any) {
        console.error('Settings QR Scanner error:', err)
        if (isMounted) {
          setSettingsScanError(
            t.searchSection.scanCameraError ||
              'Tidak dapat mengakses kamera. Sila benarkan kebenaran kamera.'
          )
        }
      }
    }

    if (showSettingsScanner) {
      const timer = setTimeout(() => {
        startSettingsCamera()
      }, 150)
      return () => {
        clearTimeout(timer)
        isMounted = false
        handleCloseSettingsScanner(html5QrCodeInstance || settingsScannerRef.current)
      }
    }
  }, [showSettingsScanner])

  function handleCloseSettingsScanner(instance?: any) {
    const scanner = instance || settingsScannerRef.current
    if (scanner) {
      try {
        if (scanner.isScanning) {
          scanner
            .stop()
            .then(() => {
              try {
                scanner.clear()
              } catch {}
            })
            .catch(() => {})
        }
      } catch {}
    }
    settingsScannerRef.current = null
    setShowSettingsScanner(false)
  }

  async function handleOpenSettingsQr() {
    setIsGeneratingSettingsQr(true)
    setConfigCopied(false)
    try {
      // 1. Call backend to generate a clean 6-digit permission code for Store A
      const res = await fetch('/api/store/clone-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          storeId,
          currentSettings: {
            name: storeName,
            logo_url: logoUrl,
            stamp_icon: stampIcon,
            reward_image_url: rewardImageUrl,
            stamps_required: stampsRequired,
            reward_description: rewardDesc,
            rewards: rewardsList,
            google_review_mode: googleReviewMode,
            google_review_url: googleReviewUrl,
            google_place_id: googlePlaceId,
            social_links: socialLinks,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menjana kod kebenaran tetapan.')
      }

      const shortCode = data.code // 6-digit code like "849201"
      setSettingsCloneCode(shortCode)

      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const shortUrl = `${origin}/dashboard?clone=${shortCode}`
      setSettingsShareUrl(shortUrl)

      // 2. Generate ULTRA LOW-DENSITY QR: only ~35 characters -> huge bold blocks!
      const qrUrl = await QRCode.toDataURL(shortUrl, {
        width: 300,
        margin: 3,
        errorCorrectionLevel: 'L',
        color: {
          dark: '#1C2624',
          light: '#FFFFFF',
        },
      })
      setSettingsQrDataUrl(qrUrl)
      setShowSettingsQrModal(true)
    } catch (err: any) {
      console.error('Error generating settings QR:', err)
      showBtToast(err.message || 'Ralat menjana QR tetapan.', 'error')
    } finally {
      setIsGeneratingSettingsQr(false)
    }
  }

  function handleCopySettingsConfig() {
    if (!settingsShareUrl) return
    try {
      navigator.clipboard.writeText(settingsShareUrl)
      setConfigCopied(true)
      setTimeout(() => setConfigCopied(false), 2500)
    } catch (_e) {}
  }

  // 13. Rewards List Helpers in Settings
  function handleAddRewardItem() {
    setRewardsList((prev) => [
      ...prev,
      {
        id: 'rw_' + Date.now(),
        name: '',
        stampsRequired: 10,
        imageUrl: '',
        description: 'Tebus di kaunter',
      },
    ])
  }

  function handleUpdateRewardItem(idx: number, field: keyof RewardItem, val: any) {
    setRewardsList((prev) => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], [field]: val }
      return copy
    })
  }

  function handleDeleteRewardItem(idx: number) {
    setRewardsList((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleAddSocialLink() {
    if (!newSocialUrl.trim()) return
    const formattedUrl = newSocialUrl.trim()
    setSocialLinks((prev) => [...prev, { platform: newSocialPlatform, url: formattedUrl }])
    setNewSocialUrl('')
    setShowSocialModal(false)
  }

  function handleDeleteSocialLink(idx: number) {
    setSocialLinks((prev) => prev.filter((_, i) => i !== idx))
  }

  // Check if a specific settings section has unsaved changes
  function isSectionDirty(sectionId: string): boolean {
    switch (sectionId) {
      case 'storeInfo':
        return (
          storeName.trim() !== baselineSettings.storeName.trim() ||
          Number(stampsRequired) !== Number(baselineSettings.stampsRequired) ||
          rewardDesc.trim() !== baselineSettings.rewardDesc.trim()
        )
      case 'googleReview':
        return (
          googleReviewMode !== baselineSettings.googleReviewMode ||
          googleReviewInput.trim() !== baselineSettings.googleReviewInput.trim()
        )
      case 'logo':
        return logoUrl.trim() !== baselineSettings.logoUrl.trim()
      case 'stampIcon':
        return stampIcon !== baselineSettings.stampIcon
      case 'rewards':
        return JSON.stringify(rewardsList) !== JSON.stringify(baselineSettings.rewardsList)
      case 'social':
        return JSON.stringify(socialLinks) !== JSON.stringify(baselineSettings.socialLinks)
      default:
        return false
    }
  }

  // 13. Save Store Settings (Section-specific or whole)
  async function handleSaveSection(sectionId?: string) {
    setIsSavingSettings(true)
    setSettingsError('')

    try {
      const primaryReward = rewardsList[0]
      const effectiveStamps = Number(primaryReward?.stampsRequired || stampsRequired || 10)
      const effectiveRewardDesc = (primaryReward?.name || rewardDesc || 'Ganjaran Percuma').trim()
      const effectiveRewardImg = (primaryReward?.imageUrl || rewardImageUrl || '').trim()

      const bodyPayload: any = {
        storeId,
        name: storeName.trim(),
        logoUrl: logoUrl.trim(),
        stampsRequired: effectiveStamps,
        rewardDescription: effectiveRewardDesc,
        rewardImageUrl: effectiveRewardImg,
        rewards: rewardsList,
        stampIcon,
        socialLinks,
        googleReviewMode,
      }
      if (googleReviewMode === 'google') {
        if (!googleReviewInput.trim()) {
          setSettingsError(
            lang === 'en'
              ? 'Please enter your Google Review link or Place ID before saving.'
              : 'Sila masukkan link atau Place ID Google Review anda sebelum menyimpan.'
          )
          setIsSavingSettings(false)
          return
        }
        bodyPayload.googleReviewInput = googleReviewInput.trim()
      }

      const res = await fetch('/api/store/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan tetapan.')
      }

      setGoogleReviewMode(data.googleReviewMode || 'manual')
      setGoogleReviewUrl(data.googleReviewUrl || null)
      setGooglePlaceId(data.googlePlaceId || null)
      const resolvedReviewInput = data.googleReviewUrl || (data.googleReviewMode === 'manual' ? '' : googleReviewInput)
      setGoogleReviewInput(resolvedReviewInput)

      // Update baseline settings so buttons become inactive (not dirty)
      setBaselineSettings({
        storeName: storeName.trim(),
        stampsRequired: effectiveStamps,
        rewardDesc: effectiveRewardDesc,
        googleReviewMode: data.googleReviewMode || 'manual',
        googleReviewInput: resolvedReviewInput,
        logoUrl: logoUrl.trim(),
        stampIcon,
        rewardsList: [...rewardsList],
        socialLinks: [...socialLinks],
      })

      setSaveToast(true)
      setTimeout(() => {
        setSaveToast(false)
      }, 2500)

      // Auto-close this dropdown section on successful save!
      if (sectionId && openSettingSection === sectionId) {
        setOpenSettingSection(null)
      }
    } catch (err: any) {
      setSettingsError(err.message || 'Ralat menyimpan tetapan.')
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleSaveSettings = () => handleSaveSection(openSettingSection || undefined)

  if (authLoading || (user && settingsLoading && !storeName && !needsRegistration)) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-jakarta text-[#FAF2E2] bg-dot-pattern">
        <div className="w-full max-w-[440px] mx-auto flex flex-col items-center">
          <div className="w-full bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/15 rounded-[26px] p-6 sm:p-7 shadow-2xl animate-pulse flex flex-col items-center">
            {/* Logo Glow */}
            <div className="w-13 h-13 rounded-full bg-[#E5A43B]/20 mb-3 flex items-center justify-center border border-[#E5A43B]/30">
              <img src="/logo.svg" alt="LajuS" className="w-7 h-7 object-contain opacity-85" />
            </div>

            {/* Store Name Skeleton */}
            <div className="w-36 h-5 bg-[#FAF2E2]/20 rounded-full mb-1.5" />
            <div className="w-24 h-2.5 bg-[#FAF2E2]/10 rounded-full mb-6" />

            {/* Dashboard Card Skeleton */}
            <div className="w-full space-y-3">
              <div className="w-full h-14 rounded-2xl bg-[#FAF2E2]/10 border border-[#FAF2E2]/5" />
              <div className="w-full h-32 rounded-2xl bg-[#FAF2E2]/10 border border-[#FAF2E2]/5" />
              <div className="w-full h-12 rounded-xl bg-[#E5A43B]/20 border border-[#E5A43B]/30" />
            </div>

            {/* Micro Caption */}
            <div className="w-full text-center mt-5 flex items-center justify-center gap-1.5 opacity-40 text-[11px] font-space text-[#FAF2E2]">
              <img src="/logo.svg" alt="LajuS" className="w-3 h-3 object-contain" />
              <span>{t.loading.loadingCounter}</span>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="relative z-10 w-full max-w-[560px] md:max-w-[680px] lg:max-w-[760px] mx-auto px-4 sm:px-6 pt-5 sm:pt-6 pb-16 font-jakarta text-[#FAF2E2]">
      {/* TOPBAR */}
      <div className="flex items-center justify-between gap-2 mb-5 sm:mb-[22px]">
        <div className="flex items-center gap-2.5 sm:gap-[11px] min-w-0">
          <div className="w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-full overflow-hidden bg-[#E5A43B] flex items-center justify-center shadow-sm border border-[#FAF2E2]/20 shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName || 'Kedai'} className="w-full h-full object-cover" />
            ) : (
              <img src="/logo.svg" alt="LajuS" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-fraunces font-semibold text-[16px] sm:text-[18px] leading-tight truncate">
              {storeName || (lang === 'en' ? 'Your Store' : 'Kedai Anda')}
            </div>
            <div className="font-space text-[9px] sm:text-[9.5px] tracking-[0.1em] text-[#5E6F68] truncate">
              {t.topbar.staffCounter}{' '}
              {user
                ? needsRegistration
                  ? t.topbar.onboarding
                  : staffRole === 'owner'
                  ? t.topbar.owner
                  : t.topbar.staff
                : t.topbar.login}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* LANGUAGE TOGGLE (MY / EN) */}
          <div className="flex items-center bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/15 p-0.5 rounded-[12px] text-[10.5px] sm:text-[11px] font-extrabold shrink-0">
            <button
              type="button"
              onClick={() => switchLang('my')}
              className={`px-1.5 sm:px-2 py-1 rounded-[8px] transition-all cursor-pointer ${
                lang === 'my'
                  ? 'bg-[#E5A43B] text-[#1A2422] font-bold shadow-xs'
                  : 'text-[#FAF2E2]/70 hover:text-[#FAF2E2]'
              }`}
              aria-label="Tukar ke Bahasa Melayu"
            >
              MY
            </button>
            <button
              type="button"
              onClick={() => switchLang('en')}
              className={`px-1.5 sm:px-2 py-1 rounded-[8px] transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#E5A43B] text-[#1A2422] font-bold shadow-xs'
                  : 'text-[#FAF2E2]/70 hover:text-[#FAF2E2]'
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>

          {/* ICON ACTION GROUP — grouped in one consistent surface so icons line up neatly at any width */}
          {user && (
            <div className="flex items-center gap-1 sm:gap-1.5 bg-[#FAF2E2]/[0.04] border border-[#FAF2E2]/10 rounded-[14px] p-1 shrink-0">
              {/* BLUETOOTH THERMAL PRINTER BUTTON (ICON ONLY WITH GLOW/STATUS) */}
              {!needsRegistration && (
                <button
                  onClick={handleToggleBluetooth}
                  disabled={isConnectingBt}
                  title={
                    btPrinter
                      ? t.topbar.printerConnectedTitle(btPrinter.name)
                      : t.topbar.printerDisconnectedTitle
                  }
                  className={`w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-[10px] border transition-all flex items-center justify-center cursor-pointer active:scale-95 relative shrink-0 ${
                    btPrinter
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-red-500/15 border-red-500/40 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:border-red-400'
                  }`}
                  aria-label="Bluetooth Printer"
                >
                  <svg
                    className={`w-[15px] h-[15px] sm:w-4 sm:h-4 ${isConnectingBt ? 'animate-spin' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9V2h12v7" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <path d="M6 14h12v8H6z" />
                  </svg>
                  <span
                    className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
                      btPrinter
                        ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse'
                        : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]'
                    }`}
                  />
                </button>
              )}

              {!needsRegistration && (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  title={showSettings ? t.topbar.settingsOpenTitle : t.topbar.settingsTitle}
                  className={`w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-[10px] border transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0 ${
                    showSettings
                      ? 'bg-[#E5A43B] border-[#E5A43B] text-[#1A2422] shadow-[0_0_12px_rgba(229,164,59,0.35)]'
                      : 'bg-transparent border-[#FAF2E2]/15 text-[#FAF2E2] hover:bg-[#FAF2E2]/12 hover:border-[#E5A43B]/40'
                  }`}
                  aria-label="Tetapan"
                >
                  <svg
                    className="w-[16px] h-[16px] sm:w-[17px] sm:h-[17px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.03.03a2 2 0 1 1-2.83 2.83l-.03-.03a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.08 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.03.03a2 2 0 1 1-2.83-2.83l.03-.03a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1.08H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.03-.03a2 2 0 1 1 2.83-2.83l.03.03a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1.08-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51 1.65 1.65 0 0 0 1.82-.33l.03-.03a2 2 0 1 1 2.83 2.83l-.03.03a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1.08H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08Z" />
                  </svg>
                </button>
              )}

              <button
                onClick={handleLogout}
                title={t.topbar.logoutTitle}
                className="w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-[10px] border border-[#FAF2E2]/15 bg-transparent text-[#5E6F68] hover:text-[#FAF2E2] hover:bg-[#FAF2E2]/12 transition flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
                aria-label="Log keluar"
              >
                <svg
                  className="w-[15px] h-[15px] sm:w-4 sm:h-4"
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
      </div>

      {/* 1. GOOGLE-ONLY LOGIN CARD IF NOT AUTHENTICATED */}
      {!user ? (
        <div className="bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-7 shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(229,164,59,0.15)] mb-6 anim-result text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-[#E5A43B] mx-auto mb-4 shadow-[0_6px_20px_rgba(229,164,59,0.35)] flex items-center justify-center">
            <img src="/logo.svg" alt="LajuS" className="w-full h-full object-cover" />
          </div>
          <div className="font-fraunces font-semibold text-[22px] mb-1 text-[#0A1716]">
            {t.loginCard.title}
          </div>
          <div className="font-space text-[10px] tracking-[0.14em] uppercase text-[#1E5E53] mb-4 font-semibold">
            {t.loginCard.subtitle}
          </div>
          <div className="text-[13.5px] text-[#5E6F68] mb-6 leading-relaxed max-w-[340px] mx-auto">
            {t.loginCard.desc}
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 border border-red-300 text-[#B53629] text-xs font-semibold">
              {loginError}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#E4D9BE] rounded-[14px] py-3.5 px-4 font-jakarta font-semibold text-[15px] text-[#3C3C3C] cursor-pointer active:scale-[0.98] transition hover:bg-gray-50 disabled:opacity-60 shadow-sm"
          >
            <svg viewBox="0 0 18 18" width="20" height="20">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
            </svg>
            {isLoggingIn ? t.loginCard.connecting : t.loginCard.googleBtn}
          </button>

          <div className="mt-5 text-xs text-[#5E6F68] font-space">
            {t.loginCard.secureNote}
          </div>
        </div>
      ) : needsRegistration ? (
        /* 2. ONBOARDING / DAFTAR KEDAI BAHARU */
        <div className="bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-6 sm:p-7 shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(229,164,59,0.15)] mb-6 anim-result">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#E5A43B]/20 border border-[#E5A43B]/40 flex items-center justify-center text-xl">
              🏪
            </div>
            <div>
              <div className="font-fraunces font-semibold text-[22px] text-[#0A1716] leading-tight">
                {t.onboarding.title}
              </div>
              <div className="text-[11px] text-[#1E5E53] font-bold uppercase tracking-wider">
                {t.onboarding.subtitle}
              </div>
            </div>
          </div>
          <div className="text-[13px] text-[#5E6F68] mb-5 leading-relaxed">
            {t.onboarding.desc}
          </div>

          {regError && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 border border-red-300 text-[#B53629] text-xs font-semibold">
              {regError}
            </div>
          )}

          <form onSubmit={handleRegisterStore}>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#5E6F68] mb-1.5">
                {t.onboarding.storeNameLabel} <span className="text-[#B53629]">*</span>
              </label>
              <input
                type="text"
                value={regStoreName}
                onChange={(e) => setRegStoreName(e.target.value)}
                placeholder={t.onboarding.storeNamePlaceholder}
                required
                autoFocus
                className="w-full border border-[#E4D9BE] rounded-[12px] p-3 font-jakarta text-sm text-[#1A2422] bg-white outline-none focus:ring-2 focus:ring-[#E5A43B] focus:border-transparent transition"
              />
            </div>

            {/* GOOGLE REVIEW CONNECTION (ON/OFF TOGGLE) */}
            <div className="mb-4 p-3.5 rounded-2xl bg-white border border-[#E4D9BE]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#0A1716] flex items-center gap-1.5">
                    <span>{t.onboarding.reviewToggleLabel}</span>
                  </div>
                  <div className="text-[11px] text-[#5E6F68] mt-0.5 leading-snug">
                    {t.onboarding.reviewToggleDesc}
                  </div>
                </div>
                {/* ON / OFF Switch Button */}
                <button
                  type="button"
                  onClick={() => setRegGoogleReviewMode(regGoogleReviewMode === 'google' ? 'manual' : 'google')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    regGoogleReviewMode === 'google' ? 'bg-[#E5A43B]' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={regGoogleReviewMode === 'google'}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      regGoogleReviewMode === 'google' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {regGoogleReviewMode === 'google' && (
                <div className="mt-3 pt-3 border-t border-[#E4D9BE]/60 space-y-2 anim-result">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#0A1716]">
                      {t.onboarding.reviewInputLabel}
                    </label>
                    <a
                      href="https://productmate.com/google-review-link-generator"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10.5px] font-bold text-[#1E5E53] hover:text-[#E5A43B] underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{t.onboarding.reviewGeneratorHint}</span>
                    </a>
                  </div>
                  <input
                    type="text"
                    value={regGoogleReviewInput}
                    onChange={(e) => setRegGoogleReviewInput(e.target.value)}
                    placeholder={t.onboarding.reviewInputPlaceholder}
                    className="w-full border border-[#E4D9BE] rounded-xl p-2.5 text-xs text-[#1A2422] bg-white outline-none focus:ring-1 focus:ring-[#E5A43B]"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10.5px] text-[#5E6F68]">
                      {t.onboarding.reviewInputHint}
                    </span>
                    {regGoogleReviewInput.trim() && (
                      <button
                        type="button"
                        onClick={() => window.open(regGoogleReviewInput.trim(), '_blank')}
                        className="text-[11px] font-bold text-[#1E5E53] hover:text-[#2D786B] underline cursor-pointer shrink-0"
                      >
                        {t.onboarding.reviewTestButton}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* STAMP ICON SELECTOR (MULTI-CATEGORY) */}
            <div className="mb-5 border-t border-[#E4D9BE]/60 pt-3.5">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#0A1716]">
                  {t.onboarding.stampIconLabel}
                </label>
                <span className="text-[10px] text-[#1E5E53] font-semibold bg-[#1E5E53]/10 px-2 py-0.5 rounded-full">
                  {t.onboarding.stampIconBadge}
                </span>
              </div>
              <div className="text-xs text-[#5E6F68] mb-2.5">
                {t.onboarding.stampIconDesc}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {STAMP_ICON_OPTIONS.map((opt) => {
                  const isSelected = regStampIcon === opt.icon
                  return (
                    <button
                      key={opt.icon}
                      type="button"
                      onClick={() => setRegStampIcon(opt.icon)}
                      title={opt.label}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition cursor-pointer text-center ${
                        isSelected
                          ? 'border-[#E5A43B] bg-[#E5A43B]/20 shadow-sm ring-2 ring-[#E5A43B]'
                          : 'border-[#E4D9BE] bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#B53629] flex items-center justify-center mb-1 shadow-sm">
                        <img
                          src={opt.icon}
                          alt={opt.label}
                          className="w-4 h-4 object-contain filter invert brightness-200"
                        />
                      </div>
                      <span className="text-[9.5px] font-bold text-[#1A2422] truncate w-full">
                        {opt.label.split('/')[0]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mb-5 p-3 rounded-xl bg-[#1E5E53]/10 border border-[#1E5E53]/20 flex items-start gap-2 text-xs text-[#1E5E53]">
              <span className="text-sm shrink-0">💡</span>
              <span>{t.onboarding.hint}</span>
            </div>

            <button
              type="submit"
              disabled={isRegisteringStore}
              className="w-full border-none rounded-[12px] p-3.5 bg-gradient-to-b from-[#E5A43B] to-[#C77B1B] text-[#1A2422] font-jakarta font-bold text-[14.5px] cursor-pointer active:scale-[0.98] transition disabled:opacity-60 shadow-[0_4px_12px_rgba(229,164,59,0.3)] flex items-center justify-center gap-2"
            >
              {isRegisteringStore ? (
                t.onboarding.registering
              ) : (
                <>
                  {t.onboarding.registerBtn}
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* 3. CASHIER COUNTER / STATS / REWARD SEARCH / SETTINGS / ACTIVITY */
        <>
          {/* PLAN STATUS BADGE + DYNAMIC CUSTOMER QUOTA BAR */}
          {(() => {
            const isPro = planType === 'pro' && subscriptionStatus === 'active'
            const totalCustomers = storeStats.totalCustomers
            const planLimit = isPro ? Infinity : 20 + (purchasedCardQuota || 0)
            const quotaPct = isPro ? 0 : Math.min(100, Math.round((totalCustomers / planLimit) * 100))
            const quotaWarning = !isPro && totalCustomers >= planLimit - Math.max(2, Math.round(planLimit * 0.1))
            const quotaFull = !isPro && totalCustomers >= planLimit

            const badgeText = isPro
              ? t.planQuota.proActive
              : purchasedCardQuota > 0
              ? (lang === 'en' ? `✦ Card Quota (${planLimit} Cards)` : `✦ Kuota Kad (${planLimit} Kad)`)
              : t.planQuota.freeStarter

            return (
              <div className="mb-4 flex flex-col gap-2">
                {/* Plan Badge */}
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center gap-1.5 text-[11px] font-bold font-space px-3 py-1 rounded-full ${isPro ? 'bg-[#E5A43B]/20 text-[#E5A43B]' : purchasedCardQuota > 0 ? 'bg-amber-400/20 text-amber-300' : 'bg-[#FAF2E2]/10 text-[#5E6F68]'}`}>
                    {badgeText}
                  </div>
                  {!isPro && (
                    <Link href="/dashboard/billing" className="text-[10.5px] font-semibold text-[#E5A43B] hover:underline">
                      {t.planQuota.upgrade}
                    </Link>
                  )}
                </div>

                {/* Card Capacity Quota Bar (Non-Pro only) */}
                {!isPro && (
                  <div className="bg-[#FAF2E2]/[0.05] border border-[#FAF2E2]/10 rounded-xl px-3.5 py-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-space uppercase text-[#5E6F68] font-bold tracking-wider">
                        {t.planQuota.quotaTitle}
                      </span>
                      {statsLoading ? (
                        <div className="h-4 w-12 bg-white/20 rounded animate-pulse" />
                      ) : (
                        <span className={`text-[11px] font-bold font-space ${quotaFull ? 'text-red-400' : quotaWarning ? 'text-amber-400' : 'text-[#FAF2E2]'}`}>
                          {totalCustomers} / {planLimit} {lang === 'en' ? 'Cards' : 'Kad'}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-[#FAF2E2]/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${quotaFull ? 'bg-red-500' : quotaWarning ? 'bg-amber-400' : 'bg-[#1E5E53]'}`}
                        style={{ width: `${quotaPct}%` }}
                      />
                    </div>
                    {quotaFull && (
                      <div className="mt-1.5 text-[10px] text-red-400 font-space font-semibold">
                        {t.planQuota.quotaFull}{' '}
                        <Link href="/dashboard/billing" className="underline text-[#E5A43B]">
                          {t.planQuota.upgradeToPro} →
                        </Link>
                      </div>
                    )}
                    {quotaWarning && !quotaFull && (
                      <div className="mt-1.5 text-[10px] text-amber-400 font-space font-semibold">
                        {t.planQuota.quotaWarning(planLimit - totalCustomers)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })()}

          {/* STORE OVERVIEW METRICS BAR — always 1 row on phone & tablet */}
          <div className="grid grid-cols-4 gap-1.5 xs:gap-2 sm:gap-2.5 mb-5">
            <div className="bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/12 rounded-xl sm:rounded-2xl px-1.5 py-2.5 sm:p-3 text-center min-w-0">
              <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-space uppercase text-[#5E6F68] font-bold leading-tight truncate">{t.stats.customers}</div>
              <div className="text-sm xs:text-base sm:text-xl font-fraunces font-bold text-[#E5A43B] mt-0.5 min-h-[22px] sm:min-h-[28px] flex items-center justify-center">
                {statsLoading ? (
                  <div className="h-5 sm:h-6 w-8 sm:w-10 bg-[#E5A43B]/20 rounded-md animate-pulse" />
                ) : (
                  storeStats.totalCustomers
                )}
              </div>
            </div>
            <div className="bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/12 rounded-xl sm:rounded-2xl px-1.5 py-2.5 sm:p-3 text-center min-w-0">
              <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-space uppercase text-[#5E6F68] font-bold leading-tight truncate">{t.stats.stampsClaimed}</div>
              <div className="text-sm xs:text-base sm:text-xl font-fraunces font-bold text-emerald-400 mt-0.5 min-h-[22px] sm:min-h-[28px] flex items-center justify-center">
                {statsLoading ? (
                  <div className="h-5 sm:h-6 w-8 sm:w-10 bg-emerald-400/20 rounded-md animate-pulse" />
                ) : (
                  storeStats.totalTokensClaimed
                )}
              </div>
            </div>
            <div className="bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/12 rounded-xl sm:rounded-2xl px-1.5 py-2.5 sm:p-3 text-center min-w-0">
              <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-space uppercase text-[#5E6F68] font-bold leading-tight truncate">{t.stats.rewardsRedeemed}</div>
              <div className="text-sm xs:text-base sm:text-xl font-fraunces font-bold text-amber-300 mt-0.5 min-h-[22px] sm:min-h-[28px] flex items-center justify-center">
                {statsLoading ? (
                  <div className="h-5 sm:h-6 w-8 sm:w-10 bg-amber-300/20 rounded-md animate-pulse" />
                ) : (
                  storeStats.totalRedemptions
                )}
              </div>
            </div>
            <div className="bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/12 rounded-xl sm:rounded-2xl px-1.5 py-2.5 sm:p-3 text-center min-w-0">
              <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-space uppercase text-[#5E6F68] font-bold leading-tight truncate">{t.stats.activeStamps}</div>
              <div className="text-sm xs:text-base sm:text-xl font-fraunces font-bold text-[#FAF2E2] mt-0.5 min-h-[22px] sm:min-h-[28px] flex items-center justify-center">
                {statsLoading ? (
                  <div className="h-5 sm:h-6 w-8 sm:w-10 bg-[#FAF2E2]/20 rounded-md animate-pulse" />
                ) : (
                  storeStats.totalStampsGiven
                )}
              </div>
            </div>
          </div>

          {/* CUSTOMER REWARD CLAIM SEARCH BAR */}
          <div className="mb-6">
            <div className="font-space text-[10.5px] tracking-[0.14em] uppercase text-[#E5A43B] mb-2.5 opacity-90 font-semibold flex items-center justify-between">
              <span>{t.searchSection.title}</span>
              <span className="text-[10px] text-[#5E6F68]">{t.searchSection.subTitle}</span>
            </div>

            <div className="bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(229,164,59,0.15)]">
              <form onSubmit={handleSearchCustomer} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    maxLength={100}
                    placeholder={t.searchSection.placeholder}
                    className="w-full border border-[#E4D9BE] rounded-[12px] py-2.5 px-3 text-sm text-[#1A2422] bg-white outline-none placeholder:text-gray-400 font-jakarta"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowQrScanner(true)}
                  title={t.searchSection.scanQrBtn}
                  className="px-3.5 py-2.5 bg-[#E5A43B] hover:bg-[#d89731] active:scale-95 text-[#1A2422] font-bold text-xs rounded-[12px] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span className="hidden sm:inline text-xs font-semibold">Scan QR</span>
                </button>
                <button
                  type="submit"
                  disabled={isSearchingCustomer}
                  className="px-4 py-2.5 bg-[#1E5E53] hover:bg-[#2D786B] active:scale-95 text-white font-bold text-xs rounded-[12px] transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  {isSearchingCustomer ? (
                    t.searchSection.searching
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                      <span>{t.searchSection.searchBtn}</span>
                    </>
                  )}
                </button>
              </form>

              {searchError && (
                <div className="mt-3 p-2.5 rounded-xl bg-red-100 text-[#B53629] text-xs font-semibold">
                  {searchError}
                </div>
              )}

              {/* SEARCH RESULT DETAILS */}
              {searchResult && (
                <div className="mt-4 pt-4 border-t border-[#E2CE9E] anim-result">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="font-bold text-[15px] text-[#0A1716] leading-tight">
                        {searchResult.name || (lang === 'en' ? 'Customer' : 'Pelanggan')}
                      </div>
                      <div className="text-xs text-[#5E6F68]">{searchResult.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-fraunces font-bold text-2xl text-[#B53629]">
                        {searchResult.totalStamps}{' '}
                        <small className="font-space text-xs text-[#5E6F68] font-normal">{t.searchSection.stampsUnit}</small>
                      </div>
                    </div>
                  </div>

                  {/* STATUS KAD & KELAYAKAN GANJARAN */}
                  <div className="p-3 rounded-xl bg-[#EFE3C4] mb-3.5 text-xs text-[#1A2422]">
                    {searchResult.fullCardsCount > 0 ? (
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <span className="text-base">🎁</span>
                        <span>
                          {t.searchSection.fullCardsNotice(searchResult.fullCardsCount)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[#5E6F68]">
                        {t.searchSection.notEnoughStamps(searchResult.currentCardStamps, searchResult.stampsRequired)}
                      </div>
                    )}
                    <div className="text-[11px] text-[#5E6F68] mt-1">
                      {t.searchSection.rewardLabel} <b>{searchResult.rewardDescription}</b>
                    </div>
                  </div>

                  {/* PEMILIH HADIAH — jika kedai ada lebih dari 1 hadiah dalam katalog */}
                  {searchResult.isEligibleForReward &&
                    Array.isArray(searchResult.rewardsCatalog) &&
                    searchResult.rewardsCatalog.length > 0 && (
                      <div className="mb-3.5">
                        <div className="text-xs font-semibold text-[#1A2422] mb-1.5">
                          {t.searchSection.chooseReward}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {searchResult.rewardsCatalog.map((rw) => {
                            const affordable =
                              searchResult.totalStamps >= rw.stampsRequired
                            const isSelected = selectedRewardId === rw.id
                            return (
                              <button
                                key={rw.id}
                                type="button"
                                disabled={!affordable}
                                onClick={() => setSelectedRewardId(rw.id)}
                                className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                                  isSelected
                                    ? 'border-[#1E5E53] bg-[#1E5E53]/10 ring-1 ring-[#1E5E53]'
                                    : 'border-[#E4D9BE] bg-white hover:bg-gray-50'
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                              >
                                <span className="text-xs font-semibold text-[#1A2422]">
                                  {rw.name || (lang === 'en' ? 'Reward' : 'Hadiah')}
                                </span>
                                <span className="text-[10.5px] font-bold text-[#B53629] whitespace-nowrap">
                                  {rw.stampsRequired} {t.searchSection.stampsUnit.toLowerCase()}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                  {/* DONE CLAIM BUTTON — with reward count selector */}
                  {searchResult.isEligibleForReward ? (
                    <div className="space-y-2.5">
                      {/* Reward count selector (only show if >1 full cards available) */}
                      {searchResult.fullCardsCount > 1 && (
                        <div className="flex items-center gap-2.5 bg-[#EFE3C4] rounded-xl p-2.5">
                          <span className="text-xs font-semibold text-[#1A2422] flex-1">
                            {t.searchSection.howManyRewards}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setRedeemCount((c) => Math.max(1, c - 1))}
                              disabled={redeemCount <= 1}
                              className="w-7 h-7 rounded-full bg-white border border-[#E4D9BE] font-bold text-sm flex items-center justify-center cursor-pointer disabled:opacity-40 hover:bg-gray-100 transition"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-bold text-sm text-[#B53629]">
                              {redeemCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => setRedeemCount((c) => Math.min(searchResult.fullCardsCount, c + 1))}
                              disabled={redeemCount >= searchResult.fullCardsCount}
                              className="w-7 h-7 rounded-full bg-white border border-[#E4D9BE] font-bold text-sm flex items-center justify-center cursor-pointer disabled:opacity-40 hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-[10.5px] text-[#5E6F68] font-semibold">
                            / {searchResult.fullCardsCount} {t.searchSection.maxSuffix}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={handleRedeemReward}
                        disabled={isRedeeming}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-[12px] shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <span>
                          {isRedeeming
                            ? t.searchSection.processingRedeem
                            : redeemCount > 1
                            ? t.searchSection.confirmRedeemMultiple(
                                redeemCount,
                                searchResult.rewardsCatalog?.find((r) => r.id === selectedRewardId)?.name || (lang === 'en' ? 'Reward' : 'Ganjaran')
                              )
                            : t.searchSection.confirmRedeemSingle(
                                searchResult.rewardsCatalog?.find((r) => r.id === selectedRewardId)?.name || (lang === 'en' ? 'Reward (Done Claim)' : 'Ganjaran (Done Claim)')
                              )}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2 px-3 bg-gray-200/70 text-gray-500 rounded-xl text-xs font-semibold">
                      {t.searchSection.needMinStamps(searchResult.stampsRequired)}
                    </div>
                  )}

                  {/* LAST CLAIM RECEIPT & RE-PRINT BUTTON */}
                  {lastClaimReceipt && (
                    <div className="mt-3.5 p-3.5 rounded-2xl bg-white border border-emerald-300/80 shadow-sm text-xs space-y-2 anim-result">
                      <div className="flex items-center justify-between font-bold text-emerald-800 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">🧾</span>
                          <span>{t.searchSection.receiptTitle}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-space">
                          {t.searchSection.doneClaimBadge}
                        </span>
                      </div>

                      <div className="space-y-1 text-gray-600 text-[11.5px] font-jakarta">
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t.searchSection.receiptStore}</span>
                          <b className="text-gray-800">{lastClaimReceipt.storeName}</b>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t.searchSection.receiptCustomer}</span>
                          <b className="text-gray-800">{lastClaimReceipt.customerEmail}</b>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t.searchSection.receiptReward}</span>
                          <b className="text-emerald-700">
                            {lastClaimReceipt.rewardName}
                            {lastClaimReceipt.rewardQuantity && lastClaimReceipt.rewardQuantity > 1
                              ? ` x${lastClaimReceipt.rewardQuantity}`
                              : ''}
                          </b>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t.searchSection.receiptStampsUsed}</span>
                          <b className="text-[#B53629]">{lastClaimReceipt.stampsUsed} {t.searchSection.stampsUnit}</b>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t.searchSection.receiptRemaining}</span>
                          <b className="text-gray-800">{lastClaimReceipt.remainingStamps} {t.searchSection.stampsUnit}</b>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t.searchSection.receiptTime}</span>
                          <span className="font-space text-[10.5px] text-gray-700">
                            {new Date(lastClaimReceipt.redeemedAt || Date.now()).toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY')}{' '}
                            {new Date(lastClaimReceipt.redeemedAt || Date.now()).toLocaleTimeString(lang === 'en' ? 'en-US' : 'ms-MY', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false,
                            })}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePrintClaimReceipt(lastClaimReceipt)}
                        disabled={isPrintingClaim}
                        className="w-full mt-2 py-2.5 px-3 bg-[#1E5E53] hover:bg-[#2D786B] active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9V2h12v7" />
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                          <path d="M6 14h12v8H6z" />
                        </svg>
                        <span>{isPrintingClaim ? t.searchSection.printingClaim : t.searchSection.printClaimReceiptBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MAIN COUNTER OR SETTINGS */}
          {!showSettings ? (
            <div id="counterSection" className="mb-6">
              <div className="font-space text-[10.5px] tracking-[0.14em] uppercase text-[#E5A43B] mb-2.5 opacity-90 font-semibold">
                {t.generator.title}
              </div>

              <div className="bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-[24px] shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(229,164,59,0.15)]">
                <div className="font-fraunces font-semibold text-[20px] mb-5 text-[#0A1716]">
                  {t.generator.question}
                </div>

                {/* STEPPER */}
                <div className="flex items-center justify-center gap-5 mb-5">
                  <button
                    onClick={() => setStampCount(Math.max(1, stampCount - 1))}
                    className="w-[46px] h-[46px] rounded-full border-none cursor-pointer bg-[#1E5E53] text-[#FAF2E2] text-[22px] font-bold flex items-center justify-center active:scale-95 transition hover:bg-[#2D786B]"
                  >
                    –
                  </button>
                  <div className="font-fraunces font-bold text-[42px] text-[#B53629] min-w-[56px] text-center select-none">
                    {stampCount}
                  </div>
                  <button
                    onClick={() => setStampCount(Math.min(20, stampCount + 1))}
                    className="w-[46px] h-[46px] rounded-full border-none cursor-pointer bg-[#1E5E53] text-[#FAF2E2] text-[22px] font-bold flex items-center justify-center active:scale-95 transition hover:bg-[#2D786B]"
                  >
                    +
                  </button>
                </div>
                <div className="text-center font-space text-[10.5px] tracking-[0.08em] text-[#5E6F68] uppercase -mt-3 mb-5 font-semibold">
                  {t.generator.stampsUnit}
                </div>

                {/* MODE TOGGLE */}
                <div className="flex gap-2 bg-[#EFE3C4] p-1 rounded-[14px] mb-3.5">
                  <div
                    onClick={() => {
                      setMode('qr')
                      handleResetToken()
                    }}
                    className={`flex-1 text-center py-[10px] px-2.5 rounded-[10px] text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition ${
                      mode === 'qr'
                        ? 'bg-[#FAF2E2] text-[#1A2422] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                        : 'text-[#5E6F68]'
                    }`}
                  >
                    <svg
                      className="w-[15px] h-[15px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z" />
                    </svg>
                    {t.generator.receiptQr}
                  </div>

                  <div
                    onClick={() => {
                      const isProPlan = planType === 'pro' && subscriptionStatus === 'active'
                      if (!isProPlan) {
                        // Redirect to upgrade page instead of switching to email mode
                        router.push('/dashboard/billing')
                        return
                      }
                      setMode('email')
                      handleResetToken()
                    }}
                    className={`flex-1 text-center py-[10px] px-2.5 rounded-[10px] text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition relative ${
                      mode === 'email'
                        ? 'bg-[#FAF2E2] text-[#1A2422] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                        : planType !== 'pro' || subscriptionStatus !== 'active'
                        ? 'text-[#5E6F68] opacity-60'
                        : 'text-[#5E6F68]'
                    }`}
                  >
                    <svg
                      className="w-[15px] h-[15px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                    {t.generator.email}
                    {(planType !== 'pro' || subscriptionStatus !== 'active') && (
                      <span className="ml-1 text-[9px] font-bold bg-[#E5A43B]/90 text-[#1A2422] px-1.5 py-0.5 rounded-full leading-none">PRO</span>
                    )}
                  </div>
                </div>

                {/* EMAIL FIELD */}
                {mode === 'email' && (
                  <div className="flex items-center gap-2.5 bg-white border border-[#E4D9BE] rounded-[12px] p-3 mb-3.5 anim-result">
                    <svg
                      className="w-4 h-4 text-[#5E6F68] opacity-50 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder={t.generator.emailPlaceholder}
                      className="border-none outline-none flex-1 font-jakarta text-sm bg-transparent text-[#1A2422]"
                    />
                  </div>
                )}

                {genError && (
                  <div className="mb-3 p-2.5 rounded-lg bg-red-100 text-[#B53629] text-xs font-semibold">
                    {genError}
                  </div>
                )}

                {/* GENERATE BUTTON */}
                <button
                  onClick={handleGenerateToken}
                  disabled={isGenerating}
                  className="w-full border-none rounded-[12px] p-3.5 mt-0.5 bg-gradient-to-b from-[#E5A43B] to-[#C77B1B] text-[#1A2422] font-jakarta font-bold text-[14.5px] cursor-pointer active:scale-[0.98] transition disabled:opacity-60 shadow-[0_4px_12px_rgba(229,164,59,0.3)]"
                >
                  {isGenerating ? t.generator.generating : t.generator.generateBtn}
                </button>

                {/* RESULT: QR PANEL */}
                {generatedToken && mode === 'qr' && (
                  <div className="mt-5 flex flex-col items-center text-center border-t-2 border-dashed border-[#E2CE9E] pt-5 anim-result">
                    {/* Clickable QR Code with Enlarge Feature & Claimed Animation Overlay */}
                    <div
                      onClick={() => setShowLargeQr(true)}
                      className="relative group cursor-pointer flex flex-col items-center"
                      title={t.generator.tapToEnlarge}
                    >
                      <div className="w-[180px] h-[180px] rounded-[20px] bg-white p-2.5 mb-2 shadow-[0_8px_24px_rgba(0,0,0,0.16)] flex items-center justify-center transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_12px_28px_rgba(229,164,59,0.3)] relative overflow-hidden border border-[#E2CE9E]">
                        {qrDataUrl && (
                          <img
                            src={qrDataUrl}
                            alt="QR Code Cop"
                            className="w-full h-full object-contain"
                          />
                        )}

                        {/* Centered Checkmark Animation if Claimed */}
                        {isTokenClaimed && (
                          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center anim-scale z-20">
                            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.85)] mb-1.5 animate-bounce">
                              <svg className="w-8 h-8 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <div className="text-white font-extrabold text-[11.5px] px-2 text-center">
                              {t.generator.claimedAnimationTitle}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tap to Enlarge Hint Badge */}
                      {!isTokenClaimed && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E5E53] group-hover:text-[#2D786B] transition mb-2 bg-[#1E5E53]/10 px-2.5 py-0.5 rounded-full">
                          <span>{t.generator.tapToEnlarge}</span>
                        </div>
                      )}
                    </div>
                    <div className="font-space text-[14px] tracking-[0.05em] text-[#1A2422] bg-[#EFE3C4] py-1.5 px-3 rounded-[8px] mb-2 font-bold select-all">
                      {generatedToken}
                    </div>
                    <div className="text-[12px] text-[#B53629] font-semibold mb-1">
                      {timeLeftStr}
                    </div>
                    <div className="text-[12.5px] text-[#5E6F68] max-w-[260px] mb-3">
                      {t.generator.scanPrompt}
                    </div>
                    {claimUrl && (
                      <a
                        href={claimUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#1E5E53] underline font-semibold mb-3 hover:text-[#2D786B]"
                      >
                        {t.generator.openClaimLink}
                      </a>
                    )}
                    {/* PRINT RECEIPT ACTION BUTTON */}
                    <div className="w-full flex flex-col gap-2 mb-3">
                      <button
                        onClick={() => handlePrintReceipt()}
                        disabled={isPrinting}
                        className={`w-full py-2.5 px-4 rounded-[12px] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98] cursor-pointer ${
                          btPrinter
                            ? 'bg-[#1E5E53] hover:bg-[#2D786B] text-white'
                            : 'bg-[#E5A43B] hover:bg-[#C77B1B] text-[#1A2422]'
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 9V2h12v7" />
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                          <path d="M6 14h12v8H6z" />
                        </svg>
                        <span>
                          {isPrinting
                            ? t.generator.printing
                            : btPrinter
                            ? t.generator.printBtnConnected
                            : t.generator.printBtnConnectAndPrint}
                        </span>
                      </button>

                      {/* Auto-print toggle hint */}
                      <label className="flex items-center justify-center gap-1.5 cursor-pointer select-none text-[11.5px] text-[#5E6F68] hover:text-[#1A2422] transition">
                        <input
                          type="checkbox"
                          checked={autoPrint}
                          onChange={(e) => setAutoPrint(e.target.checked)}
                          className="accent-[#E5A43B] w-3.5 h-3.5 rounded cursor-pointer"
                        />
                        <span>{t.generator.autoPrintHint}</span>
                      </label>
                    </div>

                    <button
                      onClick={handleResetToken}
                      className="bg-transparent border border-[#E2CE9E] rounded-[10px] py-2 px-4 font-jakarta text-[12.5px] font-semibold text-[#1E5E53] cursor-pointer hover:bg-white/40 transition"
                    >
                      {t.generator.newTokenBtn}
                    </button>
                  </div>
                )}

                {/* RESULT: EMAIL PANEL */}
                {generatedToken && mode === 'email' && (
                  <div className="mt-5 flex flex-col items-center text-center border-t-2 border-dashed border-[#E2CE9E] pt-5 anim-result">
                    <div className="flex items-center gap-2 text-[#388E5F] font-bold text-[14px] mb-1.5">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {t.generator.emailSentTitle}
                    </div>
                    <div className="text-[12.5px] text-[#5E6F68] max-w-[280px] mb-2">
                      {emailSentNote}
                    </div>
                    <div className="font-space text-xs text-[#1A2422] bg-[#EFE3C4] px-2.5 py-1 rounded mb-3">
                      Token: {generatedToken}
                    </div>
                    <button
                      onClick={handleResetToken}
                      className="bg-transparent border border-[#E2CE9E] rounded-[10px] py-2 px-4 font-jakarta text-[12.5px] font-semibold text-[#1E5E53] cursor-pointer hover:bg-white/40 transition"
                    >
                      {t.generator.newTokenBtn}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* SETTINGS PANEL (WITH LOGO URL & REWARDS REPEATER) */
            <div id="settingsPanel" className="mb-6 anim-result">
              <div className="flex items-center justify-between mb-2.5">
                <div className="font-space text-[10.5px] tracking-[0.14em] uppercase text-[#E5A43B] opacity-90 font-semibold">
                  {t.settings.title}
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  title={t.settings.close}
                  className="text-xs text-[#FAF2E2]/70 hover:text-[#FAF2E2] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <span>{t.settings.close}</span>
                  <span className="text-sm leading-none font-bold">✕</span>
                </button>
              </div>
              {/* SETTINGS NOTIFICATIONS & TOASTS */}
              {saveToast && (
                <div className="mb-3 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 anim-scale shadow-lg">
                  <span>✅</span>
                  <span>{t.settings.savedToast}</span>
                </div>
              )}

              {settingsScanSuccess && (
                <div className="mb-3 p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold leading-relaxed flex items-center gap-2 anim-scale shadow-xs">
                  <span className="text-base">✅</span>
                  <span>{settingsScanSuccess}</span>
                </div>
              )}

              {settingsError && (
                <div className="mb-3 p-3 rounded-2xl bg-red-100 border border-red-300 text-[#B53629] text-xs font-semibold shadow-xs">
                  {settingsError}
                </div>
              )}

              {/* SETTINGS ACCORDION CARDS (NO CREAM BACKGROUND, PURE WHITE CARDS) */}
              <div className="space-y-3">

                {/* 1. CONNECT GOOGLE REVIEW ACCORDION */}
                <div className="bg-white text-[#1A2422] rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenSettingSection((prev) => (prev === 'googleReview' ? null : 'googleReview'))}
                    className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">⭐</span>
                      <span className="font-bold text-xs sm:text-sm text-[#0A1716] truncate">
                        {lang === 'en' ? 'Connect Google Review' : 'Sambung Google Review'}
                      </span>
                      {googleReviewMode === 'google' && googleReviewUrl && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full shrink-0">
                          {t.settings.reviewConnectedBadge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSectionDirty('googleReview') && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Perubahan belum disimpan" />
                      )}
                      <svg
                        className={`w-4 h-4 text-[#5E6F68] transition-transform duration-200 ${
                          openSettingSection === 'googleReview' ? 'rotate-90 text-[#E5A43B]' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>

                  {openSettingSection === 'googleReview' && (
                    <div className="p-4 pt-1 border-t border-gray-100 anim-result">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 mb-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-[#0A1716] flex items-center gap-2">
                              <span>{t.settings.reviewToggleLabel}</span>
                            </div>
                            <div className="text-[11px] text-[#5E6F68] mt-0.5 leading-snug">
                              {t.settings.reviewToggleDesc}
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={staffRole !== 'owner'}
                            onClick={() => setGoogleReviewMode(googleReviewMode === 'google' ? 'manual' : 'google')}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                              googleReviewMode === 'google' ? 'bg-[#E5A43B]' : 'bg-gray-300'
                            }`}
                            role="switch"
                            aria-checked={googleReviewMode === 'google'}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                googleReviewMode === 'google' ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {googleReviewMode === 'google' && (
                          <div className="mt-3 pt-3 border-t border-gray-200/80 space-y-2 anim-result">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-[#0A1716]">
                                {t.settings.reviewInputLabel}
                              </label>
                              <a
                                href="https://productmate.com/google-review-link-generator"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10.5px] font-bold text-[#1E5E53] hover:text-[#E5A43B] underline flex items-center gap-0.5 cursor-pointer"
                              >
                                <span>{t.settings.reviewGeneratorHint}</span>
                              </a>
                            </div>
                            <input
                              type="text"
                              value={googleReviewInput}
                              onChange={(e) => setGoogleReviewInput(e.target.value)}
                              placeholder={t.settings.reviewInputPlaceholder}
                              disabled={staffRole !== 'owner'}
                              className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-[#1A2422] bg-white outline-none disabled:bg-gray-100"
                            />
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10.5px] text-[#5E6F68]">
                                {t.settings.reviewInputHint}
                              </span>
                              {(googleReviewUrl || googleReviewInput.trim()) && (
                                <button
                                  type="button"
                                  onClick={() => window.open(googleReviewUrl || googleReviewInput.trim(), '_blank')}
                                  className="text-[11px] font-bold text-[#1E5E53] hover:text-[#2D786B] underline cursor-pointer shrink-0"
                                >
                                  {t.settings.reviewTestButton}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Section Save Button */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#5E6F68]">
                          {isSectionDirty('googleReview')
                            ? (lang === 'en' ? '● Unsaved changes' : '● Perubahan belum disimpan')
                            : (lang === 'en' ? '✓ No changes' : '✓ Tiada perubahan')}
                        </span>
                        <button
                          type="button"
                          disabled={!isSectionDirty('googleReview') || isSavingSettings || staffRole !== 'owner'}
                          onClick={() => handleSaveSection('googleReview')}
                          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isSectionDirty('googleReview') && staffRole === 'owner'
                              ? 'bg-[#1E5E53] hover:bg-[#2D786B] text-white shadow-sm cursor-pointer active:scale-95'
                              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-75'
                          }`}
                        >
                          {isSavingSettings ? (
                            <span>{t.settings.saving}</span>
                          ) : (
                            <>
                              <span>💾</span>
                              <span>{isSectionDirty('googleReview') ? (lang === 'en' ? 'Save Changes' : 'Simpan Perubahan') : (lang === 'en' ? 'No Changes' : 'Tiada Perubahan')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. STORE LOGO ACCORDION */}
                <div className="bg-white text-[#1A2422] rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenSettingSection((prev) => (prev === 'logo' ? null : 'logo'))}
                    className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">🖼️</span>
                      <span className="font-bold text-xs sm:text-sm text-[#0A1716] truncate">
                        {lang === 'en' ? 'Store Logo' : 'Logo Kedai'}
                      </span>
                      {logoUrl && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full shrink-0">
                          {lang === 'en' ? 'Configured' : 'Ada Logo'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSectionDirty('logo') && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Perubahan belum disimpan" />
                      )}
                      <svg
                        className={`w-4 h-4 text-[#5E6F68] transition-transform duration-200 ${
                          openSettingSection === 'logo' ? 'rotate-90 text-[#E5A43B]' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>

                  {openSettingSection === 'logo' && (
                    <div className="p-4 pt-1 border-t border-gray-100 anim-result">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-[#5E6F68]">
                          {t.settings.logoUrlLabel}
                        </label>
                        <a
                          href="https://catbox.moe/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-[#1E5E53] hover:text-[#E5A43B] underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{t.settings.directUrlHint}</span>
                        </a>
                      </div>
                      <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        maxLength={500}
                        placeholder="https://contoh.com/logo.png"
                        disabled={staffRole !== 'owner'}
                        className="w-full border border-gray-300 rounded-xl p-2.5 font-jakarta text-xs text-[#1A2422] bg-white outline-none disabled:bg-gray-100"
                      />
                      {logoUrl && (
                        <div className="mt-2.5 flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                          <img src={logoUrl} alt="Logo Preview" className="w-10 h-10 rounded-full object-cover border" />
                          <span className="text-[11px] text-[#5E6F68]">{t.settings.logoPreview}</span>
                        </div>
                      )}

                      {/* Section Save Button */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#5E6F68]">
                          {isSectionDirty('logo')
                            ? (lang === 'en' ? '● Unsaved changes' : '● Perubahan belum disimpan')
                            : (lang === 'en' ? '✓ No changes' : '✓ Tiada perubahan')}
                        </span>
                        <button
                          type="button"
                          disabled={!isSectionDirty('logo') || isSavingSettings || staffRole !== 'owner'}
                          onClick={() => handleSaveSection('logo')}
                          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isSectionDirty('logo') && staffRole === 'owner'
                              ? 'bg-[#1E5E53] hover:bg-[#2D786B] text-white shadow-sm cursor-pointer active:scale-95'
                              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-75'
                          }`}
                        >
                          {isSavingSettings ? (
                            <span>{t.settings.saving}</span>
                          ) : (
                            <>
                              <span>💾</span>
                              <span>{isSectionDirty('logo') ? (lang === 'en' ? 'Save Changes' : 'Simpan Perubahan') : (lang === 'en' ? 'No Changes' : 'Tiada Perubahan')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. STAMP ICON ACCORDION */}
                <div className="bg-white text-[#1A2422] rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenSettingSection((prev) => (prev === 'stampIcon' ? null : 'stampIcon'))}
                    className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">🏷️</span>
                      <span className="font-bold text-xs sm:text-sm text-[#0A1716] truncate">
                        {lang === 'en' ? 'Stamp Icon' : 'Ikon Cop (Kategori Kedai)'}
                      </span>
                      <span className="text-[10px] bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded-full shrink-0">
                        {STAMP_ICON_OPTIONS.find((o) => o.icon === stampIcon)?.label.split('/')[0] || 'Ikon'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSectionDirty('stampIcon') && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Perubahan belum disimpan" />
                      )}
                      <svg
                        className={`w-4 h-4 text-[#5E6F68] transition-transform duration-200 ${
                          openSettingSection === 'stampIcon' ? 'rotate-90 text-[#E5A43B]' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>

                  {openSettingSection === 'stampIcon' && (
                    <div className="p-4 pt-1 border-t border-gray-100 anim-result">
                      <div className="text-xs text-[#5E6F68] mb-3">
                        {t.settings.stampIconDesc}
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {STAMP_ICON_OPTIONS.map((opt) => {
                          const isSelected = stampIcon === opt.icon
                          return (
                            <button
                              key={opt.icon}
                              type="button"
                              onClick={() => staffRole === 'owner' && setStampIcon(opt.icon)}
                              disabled={staffRole !== 'owner'}
                              title={opt.label}
                              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition cursor-pointer text-center ${
                                isSelected
                                  ? 'border-[#E5A43B] bg-[#E5A43B]/20 shadow-sm ring-2 ring-[#E5A43B]'
                                  : 'border-gray-200 bg-white hover:bg-gray-50'
                              }`}
                            >
                              <div className="w-9 h-9 rounded-full bg-[#B53629] flex items-center justify-center mb-1 shadow-sm">
                                <img
                                  src={opt.icon}
                                  alt={opt.label}
                                  className="w-5 h-5 object-contain filter invert brightness-200"
                                />
                              </div>
                              <span className="text-[10px] font-bold text-[#1A2422] truncate w-full">
                                {opt.label.split('/')[0]}
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      {/* Section Save Button */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#5E6F68]">
                          {isSectionDirty('stampIcon')
                            ? (lang === 'en' ? '● Unsaved changes' : '● Perubahan belum disimpan')
                            : (lang === 'en' ? '✓ No changes' : '✓ Tiada perubahan')}
                        </span>
                        <button
                          type="button"
                          disabled={!isSectionDirty('stampIcon') || isSavingSettings || staffRole !== 'owner'}
                          onClick={() => handleSaveSection('stampIcon')}
                          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isSectionDirty('stampIcon') && staffRole === 'owner'
                              ? 'bg-[#1E5E53] hover:bg-[#2D786B] text-white shadow-sm cursor-pointer active:scale-95'
                              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-75'
                          }`}
                        >
                          {isSavingSettings ? (
                            <span>{t.settings.saving}</span>
                          ) : (
                            <>
                              <span>💾</span>
                              <span>{isSectionDirty('stampIcon') ? (lang === 'en' ? 'Save Changes' : 'Simpan Perubahan') : (lang === 'en' ? 'No Changes' : 'Tiada Perubahan')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. REWARDS & GIFTS CATALOG ACCORDION */}
                <div className="bg-white text-[#1A2422] rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenSettingSection((prev) => (prev === 'rewards' ? null : 'rewards'))}
                    className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">🎁</span>
                      <span className="font-bold text-xs sm:text-sm text-[#0A1716] truncate">
                        {lang === 'en' ? 'Rewards & Gifts Catalog' : 'Katalog Ganjaran & Hadiah'}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full shrink-0">
                        {rewardsList.length} {lang === 'en' ? 'Items' : 'Ganjaran'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSectionDirty('rewards') && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Perubahan belum disimpan" />
                      )}
                      <svg
                        className={`w-4 h-4 text-[#5E6F68] transition-transform duration-200 ${
                          openSettingSection === 'rewards' ? 'rotate-90 text-[#E5A43B]' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>

                  {openSettingSection === 'rewards' && (
                    <div className="p-4 pt-1 border-t border-gray-100 anim-result">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-[#5E6F68]">
                          {t.settings.rewardsDesc}
                        </div>
                        <a
                          href="https://catbox.moe/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-[#1E5E53] hover:text-[#E5A43B] underline flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>{t.settings.directUrlHint}</span>
                        </a>
                      </div>

                      <div className="space-y-3 mt-3">
                        {rewardsList.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#1A2422]">
                                {t.settings.rewardItemNumber(idx + 1)}
                              </span>
                              {staffRole === 'owner' && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRewardItem(idx)}
                                  className="text-[11px] text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                                >
                                  {t.settings.deleteBtn}
                                </button>
                              )}
                            </div>

                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleUpdateRewardItem(idx, 'name', e.target.value)}
                              maxLength={80}
                              placeholder={t.settings.rewardNamePlaceholder}
                              disabled={staffRole !== 'owner'}
                              className="w-full border border-gray-300 rounded-lg p-2 text-xs text-[#1A2422] bg-white outline-none"
                            />

                            <div className="flex gap-2">
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={item.stampsRequired}
                                onChange={(e) =>
                                  handleUpdateRewardItem(idx, 'stampsRequired', Number(e.target.value))
                                }
                                placeholder={t.settings.stampsPlaceholder}
                                disabled={staffRole !== 'owner'}
                                className="w-24 border border-gray-300 rounded-lg p-2 text-xs text-[#1A2422] bg-white outline-none"
                              />
                              <input
                                type="url"
                                value={item.imageUrl}
                                onChange={(e) => handleUpdateRewardItem(idx, 'imageUrl', e.target.value)}
                                maxLength={500}
                                placeholder={t.settings.rewardImgPlaceholder}
                                disabled={staffRole !== 'owner'}
                                className="flex-1 border border-gray-300 rounded-lg p-2 text-xs text-[#1A2422] bg-white outline-none"
                              />
                            </div>

                            <textarea
                              value={item.description || ''}
                              onChange={(e) => handleUpdateRewardItem(idx, 'description', e.target.value)}
                              maxLength={250}
                              placeholder={t.settings.rewardDescPlaceholder}
                              disabled={staffRole !== 'owner'}
                              rows={2}
                              className="w-full border border-gray-300 rounded-lg p-2 text-xs text-[#1A2422] bg-white outline-none resize-y min-h-[44px] disabled:bg-gray-100"
                            />
                          </div>
                        ))}
                      </div>

                      {staffRole === 'owner' && (
                        <button
                          type="button"
                          onClick={handleAddRewardItem}
                          className="w-full mt-3 py-2 px-3 border border-dashed border-[#1E5E53] rounded-xl text-xs font-bold text-[#1E5E53] bg-[#1E5E53]/[0.05] hover:bg-[#1E5E53]/10 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>{t.settings.addRewardBtn}</span>
                        </button>
                      )}

                      {/* Section Save Button */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#5E6F68]">
                          {isSectionDirty('rewards')
                            ? (lang === 'en' ? '● Unsaved changes' : '● Perubahan belum disimpan')
                            : (lang === 'en' ? '✓ No changes' : '✓ Tiada perubahan')}
                        </span>
                        <button
                          type="button"
                          disabled={!isSectionDirty('rewards') || isSavingSettings || staffRole !== 'owner'}
                          onClick={() => handleSaveSection('rewards')}
                          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isSectionDirty('rewards') && staffRole === 'owner'
                              ? 'bg-[#1E5E53] hover:bg-[#2D786B] text-white shadow-sm cursor-pointer active:scale-95'
                              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-75'
                          }`}
                        >
                          {isSavingSettings ? (
                            <span>{t.settings.saving}</span>
                          ) : (
                            <>
                              <span>💾</span>
                              <span>{isSectionDirty('rewards') ? (lang === 'en' ? 'Save Changes' : 'Simpan Perubahan') : (lang === 'en' ? 'No Changes' : 'Tiada Perubahan')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. STORE INFO & TARGET STAMPS ACCORDION */}
                <div className="bg-white text-[#1A2422] rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenSettingSection((prev) => (prev === 'storeInfo' ? null : 'storeInfo'))}
                    className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">🏪</span>
                      <span className="font-bold text-xs sm:text-sm text-[#0A1716] truncate">
                        {lang === 'en' ? 'Store Info & Stamp Target' : 'Nama Kedai & Sasaran Cop'}
                      </span>
                      <span className="text-[10px] bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded-full shrink-0">
                        {stampsRequired} Cop
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSectionDirty('storeInfo') && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Perubahan belum disimpan" />
                      )}
                      <svg
                        className={`w-4 h-4 text-[#5E6F68] transition-transform duration-200 ${
                          openSettingSection === 'storeInfo' ? 'rotate-90 text-[#E5A43B]' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>

                  {openSettingSection === 'storeInfo' && (
                    <div className="p-4 pt-1 border-t border-gray-100 anim-result space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#5E6F68] mb-1">
                          {t.settings.storeNameLabel}
                        </label>
                        <input
                          type="text"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          maxLength={80}
                          disabled={staffRole !== 'owner'}
                          className="w-full border border-gray-300 rounded-xl p-2.5 font-jakarta text-xs text-[#1A2422] bg-white outline-none disabled:bg-gray-100"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#5E6F68] mb-1">
                            {lang === 'en' ? 'Target Stamps per Card' : 'Sasaran Bilangan Cop'}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={stampsRequired}
                            onChange={(e) => setStampsRequired(Number(e.target.value) || 10)}
                            disabled={staffRole !== 'owner'}
                            className="w-full border border-gray-300 rounded-xl p-2.5 font-jakarta text-xs text-[#1A2422] bg-white outline-none disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#5E6F68] mb-1">
                            {lang === 'en' ? 'Base Reward Description' : 'Penerangan Ganjaran Asas'}
                          </label>
                          <input
                            type="text"
                            value={rewardDesc}
                            onChange={(e) => setRewardDesc(e.target.value)}
                            maxLength={100}
                            placeholder="cth: 1 Kopi Percuma"
                            disabled={staffRole !== 'owner'}
                            className="w-full border border-gray-300 rounded-xl p-2.5 font-jakarta text-xs text-[#1A2422] bg-white outline-none disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      {/* Section Save Button */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#5E6F68]">
                          {isSectionDirty('storeInfo')
                            ? (lang === 'en' ? '● Unsaved changes' : '● Perubahan belum disimpan')
                            : (lang === 'en' ? '✓ No changes' : '✓ Tiada perubahan')}
                        </span>
                        <button
                          type="button"
                          disabled={!isSectionDirty('storeInfo') || isSavingSettings || staffRole !== 'owner'}
                          onClick={() => handleSaveSection('storeInfo')}
                          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isSectionDirty('storeInfo') && staffRole === 'owner'
                              ? 'bg-[#1E5E53] hover:bg-[#2D786B] text-white shadow-sm cursor-pointer active:scale-95'
                              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-75'
                          }`}
                        >
                          {isSavingSettings ? (
                            <span>{t.settings.saving}</span>
                          ) : (
                            <>
                              <span>💾</span>
                              <span>{isSectionDirty('storeInfo') ? (lang === 'en' ? 'Save Changes' : 'Simpan Perubahan') : (lang === 'en' ? 'No Changes' : 'Tiada Perubahan')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. SOCIAL MEDIA & WEB LINKS ACCORDION */}
                <div className="bg-white text-[#1A2422] rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenSettingSection((prev) => (prev === 'social' ? null : 'social'))}
                    className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">🌐</span>
                      <span className="font-bold text-xs sm:text-sm text-[#0A1716] truncate">
                        {lang === 'en' ? 'Social Media & Web Links' : 'Media Sosial & Pautan Web'}
                      </span>
                      <span className="text-[10px] bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded-full shrink-0">
                        {socialLinks.length} {lang === 'en' ? 'Links' : 'Pautan'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSectionDirty('social') && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Perubahan belum disimpan" />
                      )}
                      <svg
                        className={`w-4 h-4 text-[#5E6F68] transition-transform duration-200 ${
                          openSettingSection === 'social' ? 'rotate-90 text-[#E5A43B]' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>

                  {openSettingSection === 'social' && (
                    <div className="p-4 pt-1 border-t border-gray-100 anim-result">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-[#5E6F68]">
                          {t.settings.socialDesc}
                        </div>
                        {staffRole === 'owner' && (
                          <button
                            type="button"
                            onClick={() => setShowSocialModal(true)}
                            className="text-xs font-bold text-[#1E5E53] hover:text-[#E5A43B] underline cursor-pointer shrink-0"
                          >
                            {t.settings.addLinkBtn}
                          </button>
                        )}
                      </div>

                      {socialLinks.length === 0 ? (
                        <div className="bg-gray-50 p-3 rounded-xl border border-dashed border-gray-300 text-center text-xs text-[#5E6F68]">
                          {t.settings.noSocialLinks}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {socialLinks.map((link, sIdx) => {
                            const platformInfo = SOCIAL_PLATFORMS.find((p) => p.id === link.platform) || {
                              label: link.platform,
                              icon: '/sosial media/registration-web-icon.svg',
                            }
                            return (
                              <div
                                key={sIdx}
                                className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-200 gap-2"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div className="w-7 h-7 rounded-full bg-[#1A2422] flex items-center justify-center p-1.5 shrink-0 shadow-xs">
                                    <img src={platformInfo.icon} alt={platformInfo.label} className="w-full h-full object-contain" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-bold text-[#1A2422]">{platformInfo.label}</div>
                                    <div className="text-[11px] text-[#5E6F68] truncate">{link.url}</div>
                                  </div>
                                </div>
                                {staffRole === 'owner' && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSocialLink(sIdx)}
                                    className="text-xs text-red-600 hover:text-red-800 font-semibold p-1 cursor-pointer shrink-0"
                                  >
                                    {t.settings.deleteBtn}
                                  </button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Section Save Button */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#5E6F68]">
                          {isSectionDirty('social')
                            ? (lang === 'en' ? '● Unsaved changes' : '● Perubahan belum disimpan')
                            : (lang === 'en' ? '✓ No changes' : '✓ Tiada perubahan')}
                        </span>
                        <button
                          type="button"
                          disabled={!isSectionDirty('social') || isSavingSettings || staffRole !== 'owner'}
                          onClick={() => handleSaveSection('social')}
                          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isSectionDirty('social') && staffRole === 'owner'
                              ? 'bg-[#1E5E53] hover:bg-[#2D786B] text-white shadow-sm cursor-pointer active:scale-95'
                              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-75'
                          }`}
                        >
                          {isSavingSettings ? (
                            <span>{t.settings.saving}</span>
                          ) : (
                            <>
                              <span>💾</span>
                              <span>{isSectionDirty('social') ? (lang === 'en' ? 'Save Changes' : 'Simpan Perubahan') : (lang === 'en' ? 'No Changes' : 'Tiada Perubahan')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. SYNC & CLONE SETTINGS (QR) ACCORDION */}
                <div className="bg-white text-[#1A2422] rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenSettingSection((prev) => (prev === 'clone' ? null : 'clone'))}
                    className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">📱</span>
                      <span className="font-bold text-xs sm:text-sm text-[#0A1716] truncate">
                        {t.settings.shareCloneTitle}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-[#5E6F68] transition-transform duration-200 shrink-0 ${
                        openSettingSection === 'clone' ? 'rotate-90 text-[#E5A43B]' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>

                  {openSettingSection === 'clone' && (
                    <div className="p-4 pt-2 border-t border-gray-100 anim-result">
                      <p className="text-xs text-[#5E6F68] mb-3 leading-relaxed">
                        {lang === 'en'
                          ? 'Quickly share your store setup with another branch or copy existing settings using QR scan or PIN.'
                          : 'Salin atau pindahkan tetapan kedai ke cawangan lain dengan mudah menggunakan kod QR atau PIN 6-digit.'}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={handleOpenSettingsQr}
                          disabled={isGeneratingSettingsQr}
                          className="py-2.5 px-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#0A1716] font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-[#1E5E53] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                            <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                            <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                            <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                          </svg>
                          <span className="truncate">{t.settings.showSettingsQrBtn}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSettingsScanError('')
                            setShowSettingsScanner(true)
                          }}
                          className="py-2.5 px-2.5 rounded-xl bg-[#1E5E53] hover:bg-[#2D786B] text-[#FAF2E2] font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-[#E5A43B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                          </svg>
                          <span className="truncate">{t.settings.scanSettingsQrBtn}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 8. DANGER ZONE ACCORDION */}
                <div className="bg-white text-[#1A2422] rounded-2xl border border-red-200 shadow-xs overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenSettingSection((prev) => (prev === 'danger' ? null : 'danger'))}
                    className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-red-50/50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">⚠️</span>
                      <span className="font-bold text-xs sm:text-sm text-red-600 truncate">
                        {t.settings.dangerZone}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-red-400 transition-transform duration-200 shrink-0 ${
                        openSettingSection === 'danger' ? 'rotate-90 text-red-600' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>

                  {openSettingSection === 'danger' && (
                    <div className="p-4 pt-2 border-t border-red-100 anim-result">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-red-600">{t.settings.dangerZone}</div>
                          <div className="text-[11px] text-[#5E6F68]">{t.settings.dangerZoneDesc}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirmText('')
                            setDeleteAccountError('')
                            setShowDeleteAccountModal(true)
                          }}
                          className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold transition cursor-pointer shadow-xs shrink-0"
                        >
                          {t.settings.deleteAccountBtn}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ACTIVITY LOG (COLLAPSIBLE DROPDOWN WITH EXPORT DOWNLOAD) */}
          <div className="border border-[#FAF2E2]/12 bg-[#FAF2E2]/[0.03] rounded-[20px] p-4 transition-all">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setShowActivityLog(!showActivityLog)}
                className="flex items-center gap-2.5 text-left cursor-pointer group flex-1 py-1"
              >
                <div className="w-6 h-6 rounded-lg bg-[#E5A43B]/10 border border-[#E5A43B]/20 flex items-center justify-center text-[#E5A43B] transition-transform duration-300 group-hover:bg-[#E5A43B]/20 shrink-0">
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      showActivityLog ? 'rotate-180 text-[#E5A43B]' : 'rotate-0 text-[#FAF2E2]/70'
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                <div>
                  <div className="font-space text-[11px] tracking-[0.12em] uppercase text-[#E5A43B] font-bold flex items-center gap-1.5">
                    <span>{t.activity.title}</span>
                    <span className="text-[10px] text-[#FAF2E2]/60 font-normal">
                      ({totalActivityCount})
                    </span>
                  </div>
                  <div className="text-[10px] text-[#5E6F68]">
                    {t.activity.hint(showActivityLog)}
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-1.5">
                {/* EXPORT DOWNLOAD BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowExportModal(true)}
                  title={t.activity.downloadTooltip}
                  className="py-1.5 px-2.5 rounded-xl border border-[#E5A43B]/30 bg-[#E5A43B]/10 hover:bg-[#E5A43B]/20 text-[#E5A43B] transition flex items-center gap-1.5 text-xs font-bold cursor-pointer active:scale-95 shadow-xs"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className="hidden sm:inline text-[11px]">{t.activity.downloadBtn}</span>
                </button>

                {/* REFRESH BUTTON */}
                <button
                  type="button"
                  onClick={() => loadActivity(activityPage)}
                  disabled={loadingActivity}
                  title={t.activity.refreshTooltip}
                  className="w-8 h-8 rounded-xl border border-[#FAF2E2]/15 bg-[#FAF2E2]/[0.05] hover:bg-[#FAF2E2]/10 text-[#5E6F68] hover:text-[#FAF2E2] transition flex items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  <svg
                    className={`w-3.5 h-3.5 ${loadingActivity ? 'animate-spin text-[#E5A43B]' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                </button>
              </div>
            </div>

            {/* COLLAPSED / EXPANDED CONTENT */}
            {showActivityLog && (
              <div className="mt-3.5 pt-3 border-t border-[#FAF2E2]/10 anim-result">
                <div className="flex flex-col gap-2">
                  {activities.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[#5E6F68] bg-[#FAF2E2]/[0.02] border border-[#FAF2E2]/10 rounded-xl">
                      {t.activity.empty}
                    </div>
                  ) : (
                    activities.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between gap-2.5 bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/10 rounded-[12px] p-3 hover:bg-[#FAF2E2]/[0.09] transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-[32px] h-[32px] rounded-full bg-[#B53629] flex items-center justify-center shrink-0 shadow-sm">
                            <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none">
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
                          </div>
                          <div>
                            <div className="font-space text-[12px] text-[#FAF2E2] font-semibold">
                              +{act.stampCount} {t.activity.stampsUnit} • {act.deliveryMethod === 'email' ? (lang === 'en' ? 'Email' : 'Emel') : 'QR'} ({act.maskedToken})
                            </div>
                            <div className="text-[10.5px] text-[#5E6F68] font-space">
                              {act.fullTimestamp || act.createdAt}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <span
                            className={`text-[10px] font-bold py-1 px-2 rounded-[7px] tracking-[0.03em] whitespace-nowrap ${
                              act.status === 'claimed'
                                ? 'bg-[#388E5F]/[0.2] text-[#388E5F]'
                                : act.status === 'expired'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-[#E5A43B]/[0.2] text-[#E5A43B]'
                            }`}
                          >
                            {act.status === 'claimed'
                              ? t.activity.claimedBadge
                              : act.status === 'expired'
                              ? t.activity.expiredBadge
                              : t.activity.pendingBadge}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* PAGINATION BAR (10 ITEMS PER REQUEST) */}
                {totalActivityPages > 1 && (
                  <div className="mt-4 flex items-center justify-between px-2 pt-3 border-t border-[#FAF2E2]/10 font-space text-xs text-[#5E6F68]">
                    <button
                      onClick={() => loadActivity(Math.max(1, activityPage - 1))}
                      disabled={activityPage <= 1 || loadingActivity}
                      className="px-3 py-1.5 rounded-lg border border-[#FAF2E2]/15 bg-[#FAF2E2]/[0.05] text-[#FAF2E2] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#FAF2E2]/10 transition cursor-pointer"
                    >
                      {t.activity.prevPage}
                    </button>

                    <div className="font-bold text-[#FAF2E2]">
                      {t.activity.pageInfo(activityPage, totalActivityPages)}
                    </div>

                    <button
                      onClick={() => loadActivity(activityPage + 1)}
                      disabled={!hasMoreActivity || loadingActivity}
                      className="px-3 py-1.5 rounded-lg border border-[#FAF2E2]/15 bg-[#FAF2E2]/[0.05] text-[#FAF2E2] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#FAF2E2]/10 transition cursor-pointer"
                    >
                      {t.activity.nextPage}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {btToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`flex items-center gap-2.5 py-2.5 px-4 rounded-full shadow-2xl text-xs font-bold font-jakarta border ${
              btToast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
                : btToast.type === 'error'
                ? 'bg-red-950/90 text-red-300 border-red-500/30'
                : 'bg-slate-900/90 text-slate-200 border-slate-700'
            } backdrop-blur-md`}
          >
            {btToast.type === 'success' ? (
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : btToast.type === 'error' ? (
              <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            )}
            <span>{btToast.msg}</span>
          </div>
        </div>
      )}

      {/* POPUP MODAL: MUAT TURUN / EKSPORT LOG AKTIVITI */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-5 shadow-2xl border border-[#E5A43B]/30 anim-popup">
            <div className="flex items-center justify-between mb-3.5">
              <div className="font-fraunces font-bold text-base text-[#0A1716] flex items-center gap-2">
                <span>{t.exportModal.title}</span>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-gray-800 text-lg font-bold transition cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="text-xs text-[#5E6F68] mb-4">
              {t.exportModal.desc}
            </div>

            <div className="space-y-2 mb-4">
              <label className="block text-xs font-bold text-[#1A2422] mb-1">
                {t.exportModal.periodLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'this_month', label: t.exportModal.thisMonth },
                  { id: 'last_month', label: t.exportModal.lastMonth },
                  { id: 'last_3_months', label: t.exportModal.last3Months },
                  { id: 'all', label: t.exportModal.allRecords },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExportPeriod(opt.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                      exportPeriod === opt.id
                        ? 'border-[#E5A43B] bg-[#E5A43B]/20 text-[#0A1716] ring-1 ring-[#E5A43B] font-bold shadow-xs'
                        : 'border-[#E4D9BE] bg-white text-[#5E6F68] hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Range Toggle */}
              <button
                type="button"
                onClick={() => setExportPeriod('custom')}
                className={`w-full mt-1 py-2 px-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  exportPeriod === 'custom'
                    ? 'border-[#E5A43B] bg-[#E5A43B]/20 text-[#0A1716] ring-1 ring-[#E5A43B] font-bold shadow-xs'
                    : 'border-[#E4D9BE] bg-white text-[#5E6F68] hover:bg-gray-50'
                }`}
              >
                {t.exportModal.customRange}
              </button>

              {exportPeriod === 'custom' && (
                <div className="grid grid-cols-2 gap-2 pt-2 anim-result">
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#5E6F68] mb-1">
                      {t.exportModal.from}
                    </label>
                    <input
                      type="date"
                      value={exportStartDate}
                      onChange={(e) => setExportStartDate(e.target.value)}
                      className="w-full border border-[#E4D9BE] rounded-lg p-2 text-xs bg-white text-[#1A2422] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#5E6F68] mb-1">
                      {t.exportModal.to}
                    </label>
                    <input
                      type="date"
                      value={exportEndDate}
                      onChange={(e) => setExportEndDate(e.target.value)}
                      className="w-full border border-[#E4D9BE] rounded-lg p-2 text-xs bg-white text-[#1A2422] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E4D9BE] bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                {t.exportModal.cancel}
              </button>
              <button
                type="button"
                onClick={handleExportActivity}
                disabled={isExporting || (exportPeriod === 'custom' && (!exportStartDate || !exportEndDate))}
                className="flex-1 py-2.5 rounded-xl bg-[#1E5E53] hover:bg-[#2D786B] text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                {isExporting ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                    <span>{t.exportModal.generating}</span>
                  </>
                ) : (
                  <>
                    <span>{t.exportModal.downloadBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: TAMBAH MEDIA SOSIAL / WEB */}
      {showSocialModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-5 shadow-2xl border border-[#E5A43B]/30 anim-popup">
            <div className="flex items-center justify-between mb-3.5">
              <div className="font-fraunces font-bold text-base text-[#0A1716]">
                {t.socialModal.title}
              </div>
              <button
                onClick={() => setShowSocialModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-gray-800 text-lg font-bold transition cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-[#1A2422] mb-1.5">
                  {t.socialModal.selectPlatform}
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {SOCIAL_PLATFORMS.map((plat) => {
                    const isSel = newSocialPlatform === plat.id
                    return (
                      <button
                        key={plat.id}
                        type="button"
                        onClick={() => setNewSocialPlatform(plat.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition cursor-pointer text-left ${
                          isSel
                            ? 'border-[#E5A43B] bg-[#E5A43B]/20 text-[#0A1716] shadow-xs ring-1 ring-[#E5A43B]'
                            : 'border-[#E4D9BE] bg-white text-[#5E6F68] hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-[#1A2422] flex items-center justify-center p-1 shrink-0">
                          <img src={plat.icon} alt={plat.label} className="w-full h-full object-contain" />
                        </div>
                        <span className="truncate">{plat.label.split('/')[0]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2422] mb-1">
                  {t.socialModal.urlLabel}
                </label>
                <input
                  type="text"
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  placeholder={
                    SOCIAL_PLATFORMS.find((p) => p.id === newSocialPlatform)?.placeholder ||
                    'https://...'
                  }
                  className="w-full border border-[#E4D9BE] rounded-[10px] p-2.5 font-jakarta text-xs text-[#1A2422] bg-white outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowSocialModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E4D9BE] bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                {t.socialModal.cancel}
              </button>
              <button
                type="button"
                onClick={handleAddSocialLink}
                disabled={!newSocialUrl.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#1E5E53] hover:bg-[#2D786B] text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {t.socialModal.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DASHBOARD QR CAMERA SCANNER MODAL ─────────────────────────────── */}
      {showQrScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 anim-fade">
          <div className="w-full max-w-[360px] bg-[#FAF2E2] rounded-[28px] p-5 sm:p-6 shadow-2xl border border-[#E5A43B]/30 text-[#1C2624] relative text-center anim-scale">
            <button
              onClick={() => handleCloseQrScanner()}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#1C2624]/10 hover:bg-[#1C2624]/20 flex items-center justify-center text-sm font-bold text-[#1C2624] transition cursor-pointer z-10"
            >
              ✕
            </button>

            <div className="w-10 h-10 rounded-2xl bg-[#E5A43B]/20 text-[#C77B1B] flex items-center justify-center mx-auto mb-2.5">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>

            <div className="font-fraunces font-bold text-lg text-[#0A1716] mb-1 leading-tight">
              {t.searchSection.scanModalTitle}
            </div>
            <p className="text-xs text-[#5E6F68] mb-3 leading-relaxed">
              {t.searchSection.scanModalDesc}
            </p>

            {/* Video Viewport Container */}
            <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden mb-3 border-2 border-[#1E5E53]/30 shadow-inner flex items-center justify-center">
              <div id="dashboard-qr-reader" className="w-full h-full" />

              {scannerError && (
                <div className="absolute inset-0 bg-black/90 p-4 flex flex-col items-center justify-center text-center text-red-300 text-xs font-semibold">
                  <span className="text-2xl mb-1">⚠️</span>
                  <span>{scannerError}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleCloseQrScanner()}
              className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 active:scale-98 text-[#1C2624] font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {t.searchSection.scanCloseBtn}
            </button>
          </div>
        </div>
      )}

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

      {/* ── LARGE FULLSCREEN QR MODAL ── */}
      {showLargeQr && generatedToken && qrDataUrl && (
        <div
          onClick={() => setShowLargeQr(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[380px] sm:max-w-[440px] bg-[#0A1716] border-2 border-[#E5A43B]/60 rounded-[32px] p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(229,164,59,0.25)] flex flex-col items-center anim-scale"
          >
            {/* Close button */}
            <button
              onClick={() => setShowLargeQr(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF2E2]/10 hover:bg-[#FAF2E2]/20 text-[#FAF2E2] flex items-center justify-center font-bold text-sm cursor-pointer transition active:scale-95"
            >
              ✕
            </button>

            {/* Stamp Count Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#E5A43B] text-[#1A2422] font-black text-xs sm:text-sm font-space px-4 py-1.5 rounded-full mb-3 shadow-md">
              <span>⚡ +{stampCount} {t.generator.stampsUnit || 'COP STAMP'}</span>
            </div>

            <h3 className="font-fraunces font-bold text-xl sm:text-2xl text-[#FAF2E2] mb-1">
              {storeName || t.generator.largeQrModalTitle}
            </h3>
            <p className="text-xs text-[#C4B897] mb-5">
              {t.generator.largeQrScanPrompt}
            </p>

            {/* Large QR Code Container */}
            <div className="relative w-[260px] sm:w-[310px] h-[260px] sm:h-[310px] rounded-3xl bg-white p-3 shadow-2xl flex items-center justify-center overflow-hidden border-2 border-[#E5A43B]/30">
              <img src={qrDataUrl} alt="Large QR Cop" className="w-full h-full object-contain" />

              {/* Claimed Animation Overlay */}
              {isTokenClaimed && (
                <div className="absolute inset-0 bg-[#0A1716]/90 backdrop-blur-xs flex flex-col items-center justify-center anim-scale z-20">
                  <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.9)] mb-3 animate-bounce">
                    <svg className="w-12 h-12 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="text-white font-black text-base sm:text-lg">
                    {t.generator.claimedAnimationTitle}
                  </div>
                  <p className="text-emerald-300 text-xs mt-1">
                    {t.generator.claimedSuccessMsg}
                  </p>
                </div>
              )}
            </div>

            {/* Token Code & Expiry */}
            <div className="mt-5 flex items-center justify-between w-full max-w-[280px] bg-[#FAF2E2]/[0.08] border border-[#FAF2E2]/15 px-4 py-2 rounded-xl text-xs font-space">
              <span className="text-[#E5A43B] font-bold">{generatedToken}</span>
              <span className="text-[#B53629] font-bold">{timeLeftStr}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS QR EXPORT MODAL ────────────────────────────────────────── */}
      {showSettingsQrModal && settingsQrDataUrl && (
        <div
          onClick={() => setShowSettingsQrModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[380px] sm:max-w-[420px] bg-[#0A1716] border-2 border-[#E5A43B]/60 rounded-[32px] p-6 sm:p-7 text-center shadow-[0_0_60px_rgba(229,164,59,0.25)] flex flex-col items-center anim-scale"
          >
            {/* Close button */}
            <button
              onClick={() => setShowSettingsQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF2E2]/10 hover:bg-[#FAF2E2]/20 text-[#FAF2E2] flex items-center justify-center font-bold text-sm cursor-pointer transition active:scale-95"
            >
              ✕
            </button>

            {/* Title & Store Name */}
            <div className="inline-flex items-center gap-1.5 bg-[#E5A43B] text-[#1A2422] font-black text-xs font-space px-3.5 py-1 rounded-full mb-3 shadow-sm">
              <span>📱 {t.settings.settingsQrModalTitle}</span>
            </div>

            <h3 className="font-fraunces font-bold text-xl text-[#FAF2E2] mb-1">
              {storeName || 'Kedai Anda'}
            </h3>
            <p className="text-xs text-[#C4B897] mb-3 leading-relaxed px-2">
              {t.settings.settingsQrModalDesc}
            </p>

            {/* 6-Digit PIN Code Box */}
            {settingsCloneCode && (
              <div className="w-full max-w-[280px] bg-[#FAF2E2]/[0.08] border border-[#E5A43B]/40 px-4 py-2 rounded-2xl mb-3 flex items-center justify-between shadow-inner">
                <div className="text-left">
                  <div className="text-[9px] uppercase font-bold text-[#E5A43B] tracking-wider">KOD PIN 6-DIGIT</div>
                  <div className="text-2xl font-mono font-black text-[#FAF2E2] tracking-widest">{settingsCloneCode}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(settingsCloneCode)
                    setConfigCopied(true)
                    setTimeout(() => setConfigCopied(false), 2000)
                  }}
                  className="px-3 py-1 bg-[#E5A43B] text-[#0A1716] text-[11px] font-black rounded-lg cursor-pointer active:scale-95 shadow-sm"
                >
                  {configCopied ? '✓ Disalin' : 'Salin PIN'}
                </button>
              </div>
            )}

            {/* QR Code Container */}
            <div className="w-[220px] sm:w-[250px] h-[220px] sm:h-[250px] rounded-2xl bg-white p-2.5 shadow-2xl flex items-center justify-center border-2 border-[#E5A43B]/40 mb-3">
              <img src={settingsQrDataUrl} alt="Settings QR Code" className="w-full h-full object-contain" />
            </div>

            {/* Direct Link Preview */}
            {settingsShareUrl && (
              <div className="w-full mb-3 bg-[#FAF2E2]/[0.08] border border-[#FAF2E2]/15 px-3 py-1.5 rounded-xl text-[11px] font-mono text-[#E5A43B] truncate select-all">
                {settingsShareUrl}
              </div>
            )}

            {/* Actions: Copy Config Link */}
            <div className="w-full flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopySettingsConfig}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E5A43B] to-[#C77B1B] text-[#1A2422] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md"
              >
                <span>🔗</span>
                <span>{configCopied ? `✓ ${t.settings.configCopiedMsg}` : t.settings.copyConfigBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS QR CAMERA SCANNER MODAL ─────────────────────────────────── */}
      {showSettingsScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 anim-fade">
          <div className="w-full max-w-[360px] bg-[#FAF2E2] rounded-[28px] p-5 sm:p-6 shadow-2xl border border-[#E5A43B]/30 text-[#1C2624] relative text-center anim-scale">
            <button
              onClick={() => handleCloseSettingsScanner()}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#1C2624]/10 hover:bg-[#1C2624]/20 flex items-center justify-center text-sm font-bold text-[#1C2624] transition cursor-pointer z-10"
            >
              ✕
            </button>

            <div className="w-10 h-10 rounded-2xl bg-[#1E5E53]/20 text-[#1E5E53] flex items-center justify-center mx-auto mb-2.5">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>

            <div className="font-fraunces font-bold text-lg text-[#0A1716] mb-1 leading-tight">
              {t.settings.settingsScanModalTitle}
            </div>
            <p className="text-xs text-[#5E6F68] mb-3 leading-relaxed">
              {t.settings.settingsScanModalDesc}
            </p>

            {/* Video Viewport Container */}
            <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden mb-3 border-2 border-[#1E5E53]/30 shadow-inner flex items-center justify-center">
              <div id="settings-qr-reader" className="w-full h-full" />

              {settingsScanError && (
                <div className="absolute inset-0 bg-black/90 p-4 flex flex-col items-center justify-center text-center text-red-300 text-xs font-semibold z-20">
                  <span className="text-2xl mb-1">⚠️</span>
                  <span>{settingsScanError}</span>
                </div>
              )}
            </div>

            {/* Manual PIN Input Option */}
            <div className="mb-3 p-3 bg-white/70 border border-[#1E5E53]/20 rounded-2xl">
              <div className="text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                Atau Masukkan Kod PIN 6-Digit
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="cth. 849201"
                  value={manualClonePin}
                  onChange={(e) => setManualClonePin(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-3 py-2 text-center text-base font-mono font-black tracking-widest bg-white border border-[#1E5E53]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E5E53] text-[#0A1716]"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (manualClonePin.length >= 6) {
                      const ok = await applyStoreTemplate(manualClonePin)
                      if (ok) handleCloseSettingsScanner()
                    }
                  }}
                  disabled={manualClonePin.length < 6}
                  className="px-4 py-2 bg-[#1E5E53] hover:bg-[#16483f] disabled:opacity-40 text-white font-bold text-xs rounded-xl cursor-pointer transition active:scale-95 shadow-sm"
                >
                  Salin
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCloseSettingsScanner()}
              className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 active:scale-98 text-[#1C2624] font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {t.settings.close}
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Footer Subtext */}
      <div className="mt-8 text-center text-[11px] text-[#FAF2E2]/50 font-space flex items-center justify-center gap-2">
        <span>© {new Date().getFullYear()} LajuS</span>
        <span>•</span>
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FAF2E2]/70 hover:text-[#E5A43B] underline transition">
          {t.footer.privacyPolicy}
        </a>
      </div>
    </div>
  )
}
