'use client'

import React, { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { createClient } from '@/lib/supabase/client'
import {
  connectBluetoothPrinter,
  printStampReceipt,
  printClaimReceipt,
  type BluetoothPrinterConnection,
  type ClaimReceiptData,
} from '@/lib/bluetoothPrinter'

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
  const supabase = createClient()

  // Auth State
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Store Registration State (Onboarding for new owners)
  const [needsRegistration, setNeedsRegistration] = useState<boolean>(false)
  const [regStoreName, setRegStoreName] = useState<string>('')
  const [regStampIcon, setRegStampIcon] = useState<string>('/icons/stamps/coffee.svg')
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
  const [stampsRequired, setStampsRequired] = useState<number>(10)
  const [rewardDesc, setRewardDesc] = useState<string>('')
  const [staffRole, setStaffRole] = useState<string>('cashier')
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false)
  const [saveToast, setSaveToast] = useState<boolean>(false)
  const [settingsError, setSettingsError] = useState<string>('')

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

  // Activity Feed (Paginated 10 per request)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loadingActivity, setLoadingActivity] = useState<boolean>(false)
  const [activityPage, setActivityPage] = useState<number>(1)
  const [totalActivityPages, setTotalActivityPages] = useState<number>(1)
  const [totalActivityCount, setTotalActivityCount] = useState<number>(0)
  const [hasMoreActivity, setHasMoreActivity] = useState<boolean>(false)

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 1. Check current cashier session
  useEffect(() => {
    async function checkSession() {
      setAuthLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setAuthLoading(false)

      if (session?.user) {
        loadSettings()
        loadActivity(1)
      }
    }
    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        loadSettings()
        loadActivity(1)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. Fetch Store Settings & Check Registration Status
  async function loadSettings() {
    setSettingsLoading(true)
    try {
      const res = await fetch('/api/store/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.needsRegistration) {
          setNeedsRegistration(true)
        } else {
          setNeedsRegistration(false)
          if (data.storeId) {
            setStoreId(data.storeId)
            loadActivity(1, data.storeId)
          }
          if (data.name) setStoreName(data.name)
          if (data.stampsRequired) setStampsRequired(data.stampsRequired)
          if (data.rewardDescription) setRewardDesc(data.rewardDescription)
          if (data.logoUrl) setLogoUrl(data.logoUrl)
          if (data.rewardImageUrl) setRewardImageUrl(data.rewardImageUrl)
          if (Array.isArray(data.rewards)) setRewardsList(data.rewards)
          if (data.stampIcon) setStampIcon(data.stampIcon)
          if (Array.isArray(data.socialLinks)) setSocialLinks(data.socialLinks)
          if (data.role) setStaffRole(data.role)
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
        setTimeLeftStr('Token tamat tempoh')
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
        return
      }
      const m = String(Math.floor(diff / 60)).padStart(2, '0')
      const s = String(diff % 60).padStart(2, '0')
      setTimeLeftStr(`Tamat dalam ${m}:${s}`)
    }

    tick()
    countdownIntervalRef.current = setInterval(tick, 1000)

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [expiresAtDate])

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

      const res = await fetch('/api/store/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regStoreName.trim(),
          stampsRequired: 10,
          rewardDescription: '1 Ganjaran Percuma',
          rewards: [seedReward],
          stampIcon: regStampIcon || '/icons/stamps/coffee.svg',
        }),
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
      try {
        const audio = new Audio('/new notification.mp3')
        audio.volume = 0.7
        audio.play().catch(() => {/* autoplay policy — ignore silently */})
      } catch (_e) { /* ignore */ }

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
          width: 260,
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

  // 12. Rewards List Helpers in Settings
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

  // 13. Save Store Settings
  async function handleSaveSettings() {
    setIsSavingSettings(true)
    setSettingsError('')

    try {
      const primaryReward = rewardsList[0]
      const effectiveStamps = Number(primaryReward?.stampsRequired || stampsRequired || 10)
      const effectiveRewardDesc = (primaryReward?.name || rewardDesc || 'Ganjaran Percuma').trim()
      const effectiveRewardImg = (primaryReward?.imageUrl || rewardImageUrl || '').trim()

      const res = await fetch('/api/store/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          name: storeName.trim(),
          logoUrl: logoUrl.trim(),
          stampsRequired: effectiveStamps,
          rewardDescription: effectiveRewardDesc,
          rewardImageUrl: effectiveRewardImg,
          rewards: rewardsList,
          stampIcon,
          socialLinks,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan tetapan.')
      }

      setSaveToast(true)
      setTimeout(() => {
        setSaveToast(false)
        setShowSettings(false)
      }, 800)
    } catch (err: any) {
      setSettingsError(err.message || 'Ralat menyimpan tetapan.')
    } finally {
      setIsSavingSettings(false)
    }
  }

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
              <span>Memuatkan Kaunter Kasir...</span>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="relative z-10 max-w-[560px] mx-auto px-[18px] pt-6 pb-16 font-jakarta text-[#FAF2E2]">
      {/* TOPBAR */}
      <div className="flex items-center justify-between mb-[22px]">
        <div className="flex items-center gap-[11px]">
          <div className="w-[38px] h-[38px] rounded-full overflow-hidden bg-[#E5A43B] flex items-center justify-center shadow-sm border border-[#FAF2E2]/20">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName || 'Kedai'} className="w-full h-full object-cover" />
            ) : (
              <img src="/logo.svg" alt="LajuS" className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <div className="font-fraunces font-semibold text-[18px] leading-tight">
              {storeName || 'Kedai Anda'}
            </div>
            <div className="font-space text-[9.5px] tracking-[0.1em] text-[#5E6F68]">
              KAUNTER KASIR{' '}
              {user
                ? needsRegistration
                  ? '• PENDAFTARAN KEDAI'
                  : staffRole === 'owner'
                  ? '• PEMILIK'
                  : '• STAF'
                : '• LOG MASUK'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* BLUETOOTH THERMAL PRINTER BUTTON */}
          {user && !needsRegistration && (
            <button
              onClick={handleToggleBluetooth}
              disabled={isConnectingBt}
              title={
                btPrinter
                  ? `Printer Disambung: ${btPrinter.name} (Klik untuk putuskan)`
                  : 'Sambung Thermal Printer Bluetooth (Auto-Print Resit)'
              }
              className={`h-[38px] px-3 rounded-[12px] border transition-all flex items-center gap-2 cursor-pointer text-xs font-semibold ${
                btPrinter
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.25)]'
                  : 'bg-[#FAF2E2]/[0.06] border-[#FAF2E2]/15 text-[#FAF2E2] hover:border-[#E5A43B]/40'
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
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  btPrinter ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="hidden sm:inline">
                {isConnectingBt ? 'Menyambung...' : btPrinter ? 'Printer OK' : 'Printer BT'}
              </span>
            </button>
          )}

          {user && !needsRegistration && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              title={showSettings ? 'Tutup Tetapan' : 'Tetapan Kedai'}
              className={`w-[38px] h-[38px] rounded-[12px] border transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95 ${
                showSettings
                  ? 'bg-[#E5A43B] border-[#E5A43B] text-[#1A2422] shadow-[0_0_12px_rgba(229,164,59,0.35)]'
                  : 'bg-[#FAF2E2]/[0.06] border-[#FAF2E2]/15 text-[#FAF2E2] hover:bg-[#FAF2E2]/15 hover:border-[#E5A43B]/40'
              }`}
              aria-label="Tetapan"
            >
              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
              </svg>
            </button>
          )}

          {user && (
            <button
              onClick={handleLogout}
              title="Log keluar"
              className="w-[38px] h-[38px] rounded-[12px] border border-[#FAF2E2]/15 bg-[#FAF2E2]/[0.06] text-[#5E6F68] hover:text-[#FAF2E2] hover:bg-[#FAF2E2]/15 transition flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
              aria-label="Log keluar"
            >
              <svg
                className="w-4 h-4"
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
            LajuS
          </div>
          <div className="font-space text-[10px] tracking-[0.14em] uppercase text-[#1E5E53] mb-4 font-semibold">
            Kaunter Kasir
          </div>
          <div className="text-[13.5px] text-[#5E6F68] mb-6 leading-relaxed max-w-[340px] mx-auto">
            Sila log masuk dengan akaun Google yang didaftarkan sebagai staf atau pemilik kedai untuk mengakses kaunter cop.
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
            {isLoggingIn ? 'Menghubungkan ke Google...' : 'Log masuk dengan Google'}
          </button>

          <div className="mt-5 text-xs text-[#5E6F68] font-space">
            Akses selamat melalui Supabase Auth
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
                Daftarkan Kedai Anda
              </div>
              <div className="text-[11px] text-[#1E5E53] font-bold uppercase tracking-wider">
                Langkah Pantas
              </div>
            </div>
          </div>
          <div className="text-[13px] text-[#5E6F68] mb-5 leading-relaxed">
            Selamat datang! Masukkan nama kedai atau bisnes anda untuk mula menggunakan sistem kad cop digital.
          </div>

          {regError && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 border border-red-300 text-[#B53629] text-xs font-semibold">
              {regError}
            </div>
          )}

          <form onSubmit={handleRegisterStore}>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#5E6F68] mb-1.5">
                Nama Kedai / Bisnes <span className="text-[#B53629]">*</span>
              </label>
              <input
                type="text"
                value={regStoreName}
                onChange={(e) => setRegStoreName(e.target.value)}
                placeholder="Contoh: Kopi & Kawan / Barber Studio"
                required
                autoFocus
                className="w-full border border-[#E4D9BE] rounded-[12px] p-3 font-jakarta text-sm text-[#1A2422] bg-white outline-none focus:ring-2 focus:ring-[#E5A43B] focus:border-transparent transition"
              />
            </div>

            {/* STAMP ICON SELECTOR (MULTI-CATEGORY) */}
            <div className="mb-5 border-t border-[#E4D9BE]/60 pt-3.5">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#0A1716]">
                  Pilih Ikon Cop (Kategori Kedai)
                </label>
                <span className="text-[10px] text-[#1E5E53] font-semibold bg-[#1E5E53]/10 px-2 py-0.5 rounded-full">
                  Pilihan Ikon
                </span>
              </div>
              <div className="text-xs text-[#5E6F68] mb-2.5">
                Ikon ini akan dipaparkan pada kad cop digital pelanggan anda.
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
              <span>Katalog hadiah, bilangan cop, dan pautan media sosial boleh disesuaikan bila-bila masa di menu <b>Tetapan</b> selepas ini.</span>
            </div>

            <button
              type="submit"
              disabled={isRegisteringStore}
              className="w-full border-none rounded-[12px] p-3.5 bg-gradient-to-b from-[#E5A43B] to-[#C77B1B] text-[#1A2422] font-jakarta font-bold text-[14.5px] cursor-pointer active:scale-[0.98] transition disabled:opacity-60 shadow-[0_4px_12px_rgba(229,164,59,0.3)] flex items-center justify-center gap-2"
            >
              {isRegisteringStore ? (
                'Mendaftarkan Kedai...'
              ) : (
                <>
                  Daftar Kedai &amp; Buka Kaunter →
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* 3. CASHIER COUNTER / STATS / REWARD SEARCH / SETTINGS / ACTIVITY */
        <>
          {/* STORE OVERVIEW METRICS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
            <div className="bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/12 rounded-2xl p-3 text-center">
              <div className="text-[10px] font-space uppercase text-[#5E6F68] font-bold">Pelanggan</div>
              <div className="text-xl font-fraunces font-bold text-[#E5A43B] mt-0.5">
                {storeStats.totalCustomers}
              </div>
            </div>
            <div className="bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/12 rounded-2xl p-3 text-center">
              <div className="text-[10px] font-space uppercase text-[#5E6F68] font-bold">Cop Dituntut</div>
              <div className="text-xl font-fraunces font-bold text-emerald-400 mt-0.5">
                {storeStats.totalTokensClaimed}
              </div>
            </div>
            <div className="bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/12 rounded-2xl p-3 text-center">
              <div className="text-[10px] font-space uppercase text-[#5E6F68] font-bold">Ganjaran Ditebus</div>
              <div className="text-xl font-fraunces font-bold text-amber-300 mt-0.5">
                {storeStats.totalRedemptions}
              </div>
            </div>
            <div className="bg-[#FAF2E2]/[0.06] border border-[#FAF2E2]/12 rounded-2xl p-3 text-center">
              <div className="text-[10px] font-space uppercase text-[#5E6F68] font-bold">Baki Cop Aktif</div>
              <div className="text-xl font-fraunces font-bold text-[#FAF2E2] mt-0.5">
                {storeStats.totalStampsGiven}
              </div>
            </div>
          </div>

          {/* CUSTOMER REWARD CLAIM SEARCH BAR */}
          <div className="mb-6">
            <div className="font-space text-[10.5px] tracking-[0.14em] uppercase text-[#E5A43B] mb-2.5 opacity-90 font-semibold flex items-center justify-between">
              <span>Tebus Ganjaran di Kaunter</span>
              <span className="text-[10px] text-[#5E6F68]">Cari Emel Pelanggan</span>
            </div>

            <div className="bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(229,164,59,0.15)]">
              <form onSubmit={handleSearchCustomer} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Masukkan emel pelanggan (cth: ali@gmail.com)"
                    className="w-full border border-[#E4D9BE] rounded-[12px] py-2.5 px-3 text-sm text-[#1A2422] bg-white outline-none placeholder:text-gray-400 font-jakarta"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingCustomer}
                  className="px-4 py-2.5 bg-[#1E5E53] hover:bg-[#2D786B] active:scale-95 text-white font-bold text-xs rounded-[12px] transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5 shadow-sm"
                >
                  {isSearchingCustomer ? (
                    'Mencari...'
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                      <span>Cari</span>
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
                        {searchResult.name || 'Pelanggan'}
                      </div>
                      <div className="text-xs text-[#5E6F68]">{searchResult.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-fraunces font-bold text-2xl text-[#B53629]">
                        {searchResult.totalStamps}{' '}
                        <small className="font-space text-xs text-[#5E6F68] font-normal">Cop</small>
                      </div>
                    </div>
                  </div>

                  {/* STATUS KAD & KELAYAKAN GANJARAN */}
                  <div className="p-3 rounded-xl bg-[#EFE3C4] mb-3.5 text-xs text-[#1A2422]">
                    {searchResult.fullCardsCount > 0 ? (
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <span className="text-base">🎁</span>
                        <span>
                          {searchResult.fullCardsCount} Kad Penuh ({searchResult.fullCardsCount} Ganjaran Sedia Ditebus)!
                        </span>
                      </div>
                    ) : (
                      <div className="text-[#5E6F68]">
                        Belum cukup cop ({searchResult.currentCardStamps}/{searchResult.stampsRequired} cop pada kad aktif).
                      </div>
                    )}
                    <div className="text-[11px] text-[#5E6F68] mt-1">
                      Ganjaran: <b>{searchResult.rewardDescription}</b>
                    </div>
                  </div>

                  {/* PEMILIH HADIAH — jika kedai ada lebih dari 1 hadiah dalam katalog */}
                  {searchResult.isEligibleForReward &&
                    Array.isArray(searchResult.rewardsCatalog) &&
                    searchResult.rewardsCatalog.length > 0 && (
                      <div className="mb-3.5">
                        <div className="text-xs font-semibold text-[#1A2422] mb-1.5">
                          Pilih hadiah untuk ditebus:
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
                                  {rw.name || 'Hadiah'}
                                </span>
                                <span className="text-[10.5px] font-bold text-[#B53629] whitespace-nowrap">
                                  {rw.stampsRequired} cop
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
                            Tebus berapa ganjaran?
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
                            / {searchResult.fullCardsCount} maks
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
                            ? 'Memproses Penebusan...'
                            : redeemCount > 1
                            ? `Sahkan Penebusan ${redeemCount}x ${
                                searchResult.rewardsCatalog?.find((r) => r.id === selectedRewardId)?.name || 'Ganjaran'
                              }`
                            : `Sahkan Penebusan: ${
                                searchResult.rewardsCatalog?.find((r) => r.id === selectedRewardId)?.name || 'Ganjaran (Done Claim)'
                              }`}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2 px-3 bg-gray-200/70 text-gray-500 rounded-xl text-xs font-semibold">
                      Pelanggan memerlukan sekurang-kurangnya {searchResult.stampsRequired} cop untuk menebus.
                    </div>
                  )}

                  {/* LAST CLAIM RECEIPT & RE-PRINT BUTTON */}
                  {lastClaimReceipt && (
                    <div className="mt-3.5 p-3.5 rounded-2xl bg-white border border-emerald-300/80 shadow-sm text-xs space-y-2 anim-result">
                      <div className="flex items-center justify-between font-bold text-emerald-800 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">🧾</span>
                          <span>Resit Penebusan Selesai</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-space">
                          Done Claim ✓
                        </span>
                      </div>

                      <div className="space-y-1 text-gray-600 text-[11.5px] font-jakarta">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Nama Kedai:</span>
                          <b className="text-gray-800">{lastClaimReceipt.storeName}</b>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Emel Pelanggan:</span>
                          <b className="text-gray-800">{lastClaimReceipt.customerEmail}</b>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Nama Hadiah:</span>
                          <b className="text-emerald-700">{lastClaimReceipt.rewardName}</b>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cop Diguna:</span>
                          <b className="text-[#B53629]">{lastClaimReceipt.stampsUsed} Cop</b>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Baki Cop:</span>
                          <b className="text-gray-800">{lastClaimReceipt.remainingStamps} Cop</b>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Masa &amp; Tarikh:</span>
                          <span className="font-space text-[10.5px] text-gray-700">
                            {new Date(lastClaimReceipt.redeemedAt || Date.now()).toLocaleDateString('ms-MY')}{' '}
                            {new Date(lastClaimReceipt.redeemedAt || Date.now()).toLocaleTimeString('ms-MY', {
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
                        <span>{isPrintingClaim ? 'Mencetak Resit...' : 'Cetak Resit Penebusan (Bluetooth)'}</span>
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
                Bagi Cop Stamp
              </div>

              <div className="bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-[24px] shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(229,164,59,0.15)]">
                <div className="font-fraunces font-semibold text-[20px] mb-1 text-[#0A1716]">
                  Berapa cop nak diberi?
                </div>
                <div className="text-[13px] text-[#5E6F68] mb-[18px]">
                  Pilih bilangan cop, pelanggan terima terus lepas scan atau klik pautan.
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
                  bilangan cop
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
                    Resit (QR)
                  </div>

                  <div
                    onClick={() => {
                      setMode('email')
                      handleResetToken()
                    }}
                    className={`flex-1 text-center py-[10px] px-2.5 rounded-[10px] text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition ${
                      mode === 'email'
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
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                    Emel
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
                      placeholder="emel.pelanggan@contoh.com"
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
                  {isGenerating ? 'Menjana Token...' : 'Jana Cop Sekarang'}
                </button>

                {/* RESULT: QR PANEL */}
                {generatedToken && mode === 'qr' && (
                  <div className="mt-5 flex flex-col items-center text-center border-t-2 border-dashed border-[#E2CE9E] pt-5 anim-result">
                    <div className="w-[170px] h-[170px] rounded-[16px] bg-white p-2.5 mb-3 shadow-[0_6px_18px_rgba(0,0,0,0.15)] flex items-center justify-center">
                      {qrDataUrl && (
                        <img
                          src={qrDataUrl}
                          alt="QR Code Cop"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="font-space text-[14px] tracking-[0.05em] text-[#1A2422] bg-[#EFE3C4] py-1.5 px-3 rounded-[8px] mb-2 font-bold select-all">
                      {generatedToken}
                    </div>
                    <div className="text-[12px] text-[#B53629] font-semibold mb-1">
                      {timeLeftStr}
                    </div>
                    <div className="text-[12.5px] text-[#5E6F68] max-w-[260px] mb-3">
                      Papar skrin ini pada pelanggan untuk diimbas, atau salin pautan di bawah.
                    </div>
                    {claimUrl && (
                      <a
                        href={claimUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#1E5E53] underline font-semibold mb-3 hover:text-[#2D786B]"
                      >
                        Buka pautan tebusan ↗
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
                            ? 'Mencetak Resit...'
                            : btPrinter
                            ? 'Cetak Semula Resit'
                            : 'Sambung BT & Cetak Resit'}
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
                        <span>Auto-print resit setiap kali jana cop</span>
                      </label>
                    </div>

                    <button
                      onClick={handleResetToken}
                      className="bg-transparent border border-[#E2CE9E] rounded-[10px] py-2 px-4 font-jakarta text-[12.5px] font-semibold text-[#1E5E53] cursor-pointer hover:bg-white/40 transition"
                    >
                      + Token baharu
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
                      Emel Dihantar
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
                      + Token baharu
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
                  Tetapan Kedai
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  title="Tutup Tetapan"
                  className="text-xs text-[#FAF2E2]/70 hover:text-[#FAF2E2] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <span>Tutup</span>
                  <span className="text-sm leading-none font-bold">✕</span>
                </button>
              </div>
              <div className="bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-[24px] shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(229,164,59,0.15)]">
                {settingsError && (
                  <div className="mb-3 p-2.5 rounded-lg bg-red-100 text-[#B53629] text-xs font-semibold">
                    {settingsError}
                  </div>
                )}

                <div className="mb-3.5">
                  <label className="block text-xs font-semibold text-[#5E6F68] mb-1.5">
                    Nama Kedai
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    disabled={staffRole !== 'owner'}
                    className="w-full border border-[#E4D9BE] rounded-[10px] p-2.5 font-jakarta text-sm text-[#1A2422] bg-white outline-none disabled:bg-gray-100"
                  />
                </div>

                <div className="mb-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#5E6F68]">
                      URL Logo Kedai (Imej)
                    </label>
                    <a
                      href="https://www.imghippo.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-[#1E5E53] hover:text-[#E5A43B] underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Dapatkan Direct URL di ImgHippo ↗</span>
                    </a>
                  </div>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://contoh.com/logo.png"
                    disabled={staffRole !== 'owner'}
                    className="w-full border border-[#E4D9BE] rounded-[10px] p-2.5 font-jakarta text-sm text-[#1A2422] bg-white outline-none disabled:bg-gray-100"
                  />
                  {logoUrl && (
                    <div className="mt-2 flex items-center gap-2 bg-white p-2 rounded-lg border border-[#E4D9BE]">
                      <img src={logoUrl} alt="Logo Preview" className="w-8 h-8 rounded-full object-cover border" />
                      <span className="text-[11px] text-[#5E6F68]">Pratonton Logo</span>
                    </div>
                  )}
                </div>

                {/* STAMP ICON SELECTOR (MULTI-CATEGORY) */}
                <div className="mb-4 border-t border-[#E4D9BE] pt-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#0A1716]">
                      Ikon Cop Stamp (Kategori Kedai)
                    </label>
                    <span className="text-[10.5px] text-[#1E5E53] font-semibold bg-[#1E5E53]/10 px-2 py-0.5 rounded-full">
                      Pilihan Tersedia
                    </span>
                  </div>
                  <div className="text-xs text-[#5E6F68] mb-2.5">
                    Pilih ikon cop yang akan dipaparkan di bulatan cop kad pelanggan anda.
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
                              : 'border-[#E4D9BE] bg-white hover:bg-gray-50'
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
                </div>



                {/* DYNAMIC REWARDS LIST (BOLEH TAMBAH HADIAH) */}
                <div className="border-t border-[#E4D9BE] pt-4 mt-4 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm text-[#0A1716]">
                      Katalog Hadiah &amp; Ganjaran
                    </div>
                    <a
                      href="https://www.imghippo.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-[#1E5E53] hover:text-[#E5A43B] underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Dapatkan Direct URL di ImgHippo ↗</span>
                    </a>
                  </div>
                  <div className="text-xs text-[#5E6F68] mb-3">
                    Tambah pilihan hadiah lain mengikut bilangan cop yang berbeza.
                  </div>

                  <div className="space-y-3">
                    {rewardsList.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="bg-white p-3 rounded-xl border border-[#E4D9BE] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1A2422]">
                            Hadiah #{idx + 1}
                          </span>
                          {staffRole === 'owner' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteRewardItem(idx)}
                              className="text-[11px] text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                            >
                              Padam
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateRewardItem(idx, 'name', e.target.value)}
                          placeholder="Nama Hadiah (cth: Kek Red Velvet)"
                          disabled={staffRole !== 'owner'}
                          className="w-full border border-[#E4D9BE] rounded-lg p-2 text-xs text-[#1A2422] outline-none"
                        />

                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="1"
                            value={item.stampsRequired}
                            onChange={(e) =>
                              handleUpdateRewardItem(idx, 'stampsRequired', Number(e.target.value))
                            }
                            placeholder="Cop"
                            disabled={staffRole !== 'owner'}
                            className="w-24 border border-[#E4D9BE] rounded-lg p-2 text-xs text-[#1A2422] outline-none"
                          />
                          <input
                            type="url"
                            value={item.imageUrl}
                            onChange={(e) => handleUpdateRewardItem(idx, 'imageUrl', e.target.value)}
                            placeholder="URL Gambar Hadiah (https://...)"
                            disabled={staffRole !== 'owner'}
                            className="flex-1 border border-[#E4D9BE] rounded-lg p-2 text-xs text-[#1A2422] outline-none"
                          />
                        </div>

                        <textarea
                          value={item.description || ''}
                          onChange={(e) => handleUpdateRewardItem(idx, 'description', e.target.value)}
                          placeholder="Penerangan hadiah (cth: Tebus di kaunter, terhad 1 unit sehari)"
                          disabled={staffRole !== 'owner'}
                          rows={2}
                          className="w-full border border-[#E4D9BE] rounded-lg p-2 text-xs text-[#1A2422] outline-none resize-y min-h-[44px] disabled:bg-gray-100"
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
                      <span>+ Tambah Hadiah Baharu</span>
                    </button>
                  )}
                </div>

                {/* SOCIAL MEDIA & WEBSITE LINKS */}
                <div className="border-t border-[#E4D9BE] pt-4 mt-4 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm text-[#0A1716]">
                      Pautan Media Sosial &amp; Laman Web
                    </div>
                    {staffRole === 'owner' && (
                      <button
                        type="button"
                        onClick={() => setShowSocialModal(true)}
                        className="text-xs font-bold text-[#1E5E53] hover:text-[#E5A43B] underline cursor-pointer"
                      >
                        + Tambah Pautan
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-[#5E6F68] mb-3">
                    Pautan ini akan dipaparkan sebagai ikon di bawah nama kedai di kad pelanggan.
                  </div>

                  {socialLinks.length === 0 ? (
                    <div className="bg-white/60 p-3 rounded-xl border border-dashed border-[#E4D9BE] text-center text-xs text-[#5E6F68]">
                      Belum ada pautan media sosial. Tekan &quot;+ Tambah Pautan&quot; untuk masukkan Instagram, TikTok, WhatsApp, dll.
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
                            className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#E4D9BE] gap-2"
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
                                Padam
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {staffRole === 'owner' ? (
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="w-full border-none rounded-[12px] p-3 mt-1 bg-[#1E5E53] text-[#FAF2E2] font-bold text-sm cursor-pointer active:scale-[0.98] transition disabled:opacity-60 hover:bg-[#2D786B]"
                  >
                    {isSavingSettings ? 'Menyimpan...' : 'Simpan Tetapan'}
                  </button>
                ) : (
                  <div className="text-xs text-[#5E6F68] bg-[#EFE3C4] p-2.5 rounded-lg text-center font-medium">
                    Hanya Pemilik (Owner) boleh menukar tetapan kedai.
                  </div>
                )}

                <div
                  className={`text-center text-xs text-[#388E5F] font-semibold mt-2.5 transition-opacity duration-300 ${
                    saveToast ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  ✓ Tetapan disimpan
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY LOG (PAGINATED - 10 ITEMS PER REQUEST) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="font-space text-[10.5px] tracking-[0.14em] uppercase text-[#E5A43B] opacity-90 font-semibold">
                Log Aktiviti ({totalActivityCount})
              </div>
              <button
                onClick={() => loadActivity(activityPage)}
                disabled={loadingActivity}
                className="text-[10.5px] font-space text-[#5E6F68] hover:text-[#FAF2E2] transition cursor-pointer"
              >
                {loadingActivity ? 'Memuatkan...' : '↻ Muat Semula'}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {activities.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#5E6F68] bg-[#FAF2E2]/[0.03] border border-[#FAF2E2]/10 rounded-xl">
                  Belum ada rekod log.
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
                          +{act.stampCount} Cop • {act.deliveryMethod === 'email' ? 'Emel' : 'QR'} ({act.maskedToken})
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
                          ? 'DITEBUS'
                          : act.status === 'expired'
                          ? 'LUPUT'
                          : 'PENDING'}
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
                  ◀ Sebelum
                </button>

                <div className="font-bold text-[#FAF2E2]">
                  Halaman {activityPage} / {totalActivityPages}
                </div>

                <button
                  onClick={() => loadActivity(activityPage + 1)}
                  disabled={!hasMoreActivity || loadingActivity}
                  className="px-3 py-1.5 rounded-lg border border-[#FAF2E2]/15 bg-[#FAF2E2]/[0.05] text-[#FAF2E2] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#FAF2E2]/10 transition cursor-pointer"
                >
                  Seterusnya ▶
                </button>
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

      {/* POPUP MODAL: TAMBAH MEDIA SOSIAL / WEB */}
      {showSocialModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FAF2E2] text-[#1A2422] rounded-[24px] p-5 shadow-2xl border border-[#E5A43B]/30 anim-popup">
            <div className="flex items-center justify-between mb-3.5">
              <div className="font-fraunces font-bold text-base text-[#0A1716]">
                🔗 Tambah Media Sosial / Web
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
                  Pilih Platform
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
                  Pautan URL / Nombor Akaun
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
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddSocialLink}
                disabled={!newSocialUrl.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#1E5E53] hover:bg-[#2D786B] text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-sm"
              >
                Simpan Pautan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
