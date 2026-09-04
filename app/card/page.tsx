'use client'

import React, { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
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

interface StoreLocationItem {
  id?: string
  name: string
  url: string
  address?: string
  coordinates?: string
  embedUrl?: string
  embedQuery?: string
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
  locations?: StoreLocationItem[]
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

function getGoogleMapsEmbedUrl(loc?: StoreLocationItem, storeNameFallback?: string) {
  if (!loc) return ''
  if (loc.embedUrl) {
    return loc.embedUrl
  }
  if (loc.coordinates) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(loc.coordinates)}&hl=ms&z=16&output=embed`
  }
  if (loc.embedQuery) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(loc.embedQuery)}&hl=ms&z=16&output=embed`
  }

  const trimmed = (loc.url || '').trim()
  if (trimmed.includes('output=embed') || trimmed.includes('/maps/embed')) {
    return trimmed
  }

  // If iframe src was pasted
  const iframeSrcMatch = trimmed.match(/src=["'](https:\/\/[^"']+)["']/)
  if (iframeSrcMatch && (iframeSrcMatch[1].includes('maps.google') || iframeSrcMatch[1].includes('google.com/maps'))) {
    return iframeSrcMatch[1]
  }

  // 1. CID match
  const cidMatch = trimmed.match(/[?&]cid=(\d+)/) || trimmed.match(/cid:(\d+)/)
  if (cidMatch) {
    return `https://maps.google.com/maps?cid=${cidMatch[1]}&hl=ms&output=embed`
  }

  // 2. Exact pin coordinates: !3d<lat>!4d<lng> or !8m2!3d<lat>!4d<lng>
  const pinMatch =
    trimmed.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ||
    trimmed.match(/!8m2!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ||
    trimmed.match(/!1d(-?\d+\.\d+)!2d(-?\d+\.\d+)/)
  if (pinMatch) {
    return `https://maps.google.com/maps?q=${pinMatch[1]},${pinMatch[2]}&hl=ms&z=16&output=embed`
  }

  // 3. Query coordinates ?q=lat,lng or ?query=lat,lng or ?ll=lat,lng
  const qCoordMatch =
    trimmed.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    trimmed.match(/[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    trimmed.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    trimmed.match(/[?&]sll=(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (qCoordMatch) {
    return `https://maps.google.com/maps?q=${qCoordMatch[1]},${qCoordMatch[2]}&hl=ms&z=16&output=embed`
  }

  // 4. Place name in /place/Place+Name/
  const placeMatch = trimmed.match(/\/place\/([^/@?#]+)/)
  if (placeMatch && placeMatch[1]) {
    try {
      const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
      return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&hl=ms&z=16&output=embed`
    } catch {
      return `https://maps.google.com/maps?q=${encodeURIComponent(placeMatch[1].replace(/\+/g, ' '))}&hl=ms&z=16&output=embed`
    }
  }

  // 5. Search query string ?q=... or ?query=...
  const qMatch = trimmed.match(/[?&]q=([^&]+)/) || trimmed.match(/[?&]query=([^&]+)/)
  if (qMatch && qMatch[1]) {
    try {
      const decoded = decodeURIComponent(qMatch[1].replace(/\+/g, ' '))
      return `https://maps.google.com/maps?q=${encodeURIComponent(decoded)}&hl=ms&z=16&output=embed`
    } catch {
      return `https://maps.google.com/maps?q=${qMatch[1]}&hl=ms&z=16&output=embed`
    }
  }

  // 6. Camera coordinates @lat,lng as last-resort fallback
  const coordMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (coordMatch) {
    return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&hl=ms&z=16&output=embed`
  }

  // 7. Raw lat, lng input e.g. "3.1415, 101.6869"
  const rawCoordMatch = trimmed.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/)
  if (rawCoordMatch) {
    return `https://maps.google.com/maps?q=${rawCoordMatch[1]},${rawCoordMatch[2]}&hl=ms&z=16&output=embed`
  }

  const queryToUse = loc.address
    ? `${loc.name ? loc.name + ', ' : ''}${loc.address}`
    : (loc.name || storeNameFallback || '')
  if (!queryToUse) return ''
  return `https://maps.google.com/maps?q=${encodeURIComponent(queryToUse)}&hl=ms&z=16&output=embed`
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

function renderSocialIcon(platform: string) {
  const p = (platform || '').toLowerCase().trim()
  switch (p) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, color: '#ffffff' }}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="#ffffff" style={{ width: 13, height: 13, color: '#ffffff' }}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43 5.92 5.92 0 0 0 1.51-4.09V7.93a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.55-.64v1.28z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="#ffffff" style={{ width: 13, height: 13, color: '#ffffff' }}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" fill="#ffffff" style={{ width: 13, height: 13, color: '#ffffff' }}>
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.14 0-.36.05-.54.26-.19.2-.72.7-.72 1.72s.74 1.99.85 2.13c.11.15 1.45 2.22 3.52 3.11.49.21.88.34 1.18.44.5.16.95.14 1.31.08.4-.06 1.22-.5 1.39-.98.17-.49.17-.91.12-.99-.05-.08-.19-.14-.4-.25s-1.22-.6-1.41-.67c-.19-.07-.33-.1-.47.11s-.54.67-.67.81-.24.16-.45.05c-.21-.11-.89-.33-1.69-1.05-.62-.56-1.05-1.25-1.17-1.46s-.01-.32.09-.43c.1-.1.21-.24.32-.36.1-.12.14-.2.21-.34.07-.14.04-.26-.02-.37s-.47-1.14-.65-1.56c-.17-.41-.35-.35-.48-.36z" />
        </svg>
      )
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" fill="#ffffff" style={{ width: 13, height: 13, color: '#ffffff' }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
      )
    case 'threads':
      return (
        <svg viewBox="0 0 24 24" fill="#ffffff" style={{ width: 13, height: 13, color: '#ffffff' }}>
          <path d="M12.001 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm4.225 13.064c-.454 1.637-1.848 2.605-3.824 2.605-2.235 0-4.103-1.636-4.103-4.57 0-3.037 1.967-4.664 4.298-4.664 2.181 0 3.708 1.455 3.708 3.545 0 .273-.027.545-.082.818h-5.89c.082 1.636 1.063 2.509 2.236 2.509.873 0 1.555-.409 1.882-1.064l1.775.821zm-2.02-3.082c0-.982-.627-1.636-1.636-1.636-1.036 0-1.745.682-1.882 1.636h3.518z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="#ffffff" style={{ width: 13, height: 13, color: '#ffffff' }}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case 'website':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, color: '#ffffff' }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
  }
}

export default function CustomerCardPage() {
  const supabase = createClient()

  // Language state (defaults to 'my', persists in localStorage)
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

  // Multi-Store Loyalty Data
  const [allStores, setAllStores] = useState<CustomerStoreCard[]>([])
  const [activeStoreId, setActiveStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [logoLoading, setLogoLoading] = useState(true)
  const [logoError, setLogoError] = useState(false)
  const [rewardImageUrl, setRewardImageUrl] = useState('')

  useEffect(() => {
    if (!logoUrl) {
      setLogoLoading(false)
      setLogoError(false)
      return
    }

    setLogoLoading(true)
    setLogoError(false)

    let isMounted = true
    const img = new Image()
    img.src = logoUrl

    // If already in browser cache
    if (img.complete && img.naturalWidth > 0) {
      setLogoLoading(false)
      return
    }

    // Safety timeout: max 2.5s to prevent infinite loading spinner
    const timer = setTimeout(() => {
      if (isMounted) {
        if (!img.complete || img.naturalWidth === 0) {
          setLogoError(true)
        }
        setLogoLoading(false)
      }
    }, 2500)

    img.onload = () => {
      if (isMounted) {
        clearTimeout(timer)
        setLogoLoading(false)
        setLogoError(false)
      }
    }

    img.onerror = () => {
      if (isMounted) {
        clearTimeout(timer)
        setLogoError(true)
        setLogoLoading(false)
      }
    }

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [logoUrl])
  const [rewardsList, setRewardsList] = useState<RewardItem[]>([])
  const [stampIcon, setStampIcon] = useState('/icons/stamps/makanan.svg')
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([])
  const [totalStamps, setTotalStamps] = useState(0)
  const [stampsRequired, setStampsRequired] = useState(10)
  const [rewardDesc, setRewardDesc] = useState('')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [stampDates, setStampDates] = useState<string[]>([])
  const [locations, setLocations] = useState<StoreLocationItem[]>([])
  const [showLocationsModal, setShowLocationsModal] = useState(false)
  const [activeLocationIdx, setActiveLocationIdx] = useState(0)
  const [isMapLoading, setIsMapLoading] = useState(true)

  // Preloader watchdog for Google Maps iframe
  useEffect(() => {
    if (showLocationsModal) {
      setIsMapLoading(true)
      const timer = setTimeout(() => {
        setIsMapLoading(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showLocationsModal, activeLocationIdx])

  // Multi-card state & card slider
  const [selectedCardIdx, setSelectedCardIdx] = useState(0)
  const cardSliderRef = useRef<HTMLDivElement>(null)
  const cardTrackRef = useRef<HTMLDivElement>(null)

  // Touch / Drag slider state refs
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragDeltaXRef = useRef(0)
  const sliderWidthRef = useRef(0)

  // Modals state
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewardSlideIdx, setRewardSlideIdx] = useState(0)
  const rewardTouchStartXRef = useRef(0)
  const [showCustomerQrModal, setShowCustomerQrModal] = useState(false)
  const [customerQrDataUrl, setCustomerQrDataUrl] = useState('')
  const [showReviewPopup, setShowReviewPopup] = useState<boolean>(false)
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string | null>(null)
  const [reviewRating, setReviewRating] = useState<number>(0)
  const [rateHintText, setRateHintText] = useState<string>('')

  // Stamp circle touch/click detail popup modal state
  const [selectedStampDetail, setSelectedStampDetail] = useState<{
    slotNum: number
    cardNum: number
    globalStampNum: number
    isFilled: boolean
    date: string | null
  } | null>(null)

  // Newly claimed stamps state (for punch landing animation)
  const [newlyClaimedInfo, setNewlyClaimedInfo] = useState<{
    start: number
    end: number
    storeId?: string | null
  } | null>(null)

  const TOTAL = stampsRequired || 10
  const fullCardsCount = Math.floor(totalStamps / TOTAL)
  const remainderStamps = totalStamps % TOTAL
  const totalCardsCount = Math.max(1, fullCardsCount + (remainderStamps > 0 ? 1 : 0))

  useEffect(() => {
    // Read newly claimed stamps from sessionStorage
    try {
      const rawClaim = sessionStorage.getItem('lajus_claimed_stamps')
      if (rawClaim) {
        const parsed = JSON.parse(rawClaim)
        if (parsed && typeof parsed.newTotal === 'number' && parsed.newTotal > (parsed.previousStamps ?? 0)) {
          setNewlyClaimedInfo({
            start: (parsed.previousStamps ?? 0) + 1,
            end: parsed.newTotal,
            storeId: parsed.storeId,
          })
        }
      }
    } catch {}

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
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)
      if (event === 'SIGNED_IN' && currentUser) {
        const params = new URLSearchParams(window.location.search)
        const initialStoreId = params.get('storeId') || undefined
        fetchLoyalty(initialStoreId)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
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
        setLocations(Array.isArray(data.locations) ? data.locations : [])
        setActiveLocationIdx(0)
        setUpdatedAt(data.updatedAt || null)
        setStampDates(Array.isArray(data.stampDates) ? data.stampDates : [])

        const gReviewUrl = data.googleReviewUrl || null
        setGoogleReviewUrl(gReviewUrl)

        // Determine active card where the stamps belong
        let targetCard = 0
        const rawClaim = typeof window !== 'undefined' ? sessionStorage.getItem('lajus_claimed_stamps') : null
        let claimInfo: any = null
        try {
          if (rawClaim) claimInfo = JSON.parse(rawClaim)
        } catch {}

        const stampsForCard = claimInfo?.newTotal ?? stamps
        const reqForCard = claimInfo?.stampsRequired ?? req
        const fullCards = Math.floor(stamps / req)
        const rem = stamps % req
        const numCards = Math.max(1, fullCards + (rem > 0 ? 1 : 0))

        if (stampsForCard > 0) {
          // Point directly to the card where the newest stamp landed
          targetCard = Math.max(0, Math.min(numCards - 1, Math.floor((stampsForCard - 1) / reqForCard)))
        }

        setSelectedCardIdx(targetCard)
        setTimeout(() => {
          goToCard(targetCard, false, numCards)
        }, 100)

        // Clear sessionStorage after 7 seconds
        if (rawClaim) {
          setTimeout(() => {
            try {
              sessionStorage.removeItem('lajus_claimed_stamps')
            } catch {}
          }, 7000)
        }

        // Auto popup Google Review if redirected with claimed=true
        try {
          const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
          const isClaimedParam = searchParams?.get('claimed') === 'true'
          const isSessionClaimed = typeof window !== 'undefined' && sessionStorage.getItem('lajus_just_claimed') === 'true'

          if (gReviewUrl && (isClaimedParam || isSessionClaimed)) {
            sessionStorage.removeItem('lajus_just_claimed')
            if (searchParams?.has('claimed')) {
              const cleanUrl = new URL(window.location.href)
              cleanUrl.searchParams.delete('claimed')
              window.history.replaceState({}, '', cleanUrl.toString())
            }

            setTimeout(() => {
              setShowReviewPopup(true)
            }, 2000)
          }
        } catch (e) {
          console.warn('Review popup trigger error:', e)
        }
      }
    } catch (e) {
      console.error('Failed to fetch live loyalty:', e)
    } finally {
      setRefreshing(false)
    }
  }

  // Card slider track transformation
  function setTrackTransform(cardIdx: number, deltaPx: number, rotateDeg: number, withTransition: boolean, customTotal?: number) {
    if (!cardTrackRef.current) return
    const total = customTotal || totalCardsCount
    cardTrackRef.current.style.transition = withTransition
      ? 'transform .5s cubic-bezier(.22,.9,.32,1)'
      : 'none'
    const percentShift = total > 0 ? (cardIdx * 100) / total : 0
    cardTrackRef.current.style.transform = `translateX(calc(-${percentShift}% + ${deltaPx}px)) rotateZ(${rotateDeg}deg)`
  }

  function goToCard(idx: number, animate: boolean = true, customTotal?: number) {
    const total = customTotal || totalCardsCount
    const clamped = Math.max(0, Math.min(total - 1, idx))
    setSelectedCardIdx(clamped)
    setTrackTransform(clamped, 0, 0, animate, total)
  }

  // Touch and mouse drag handlers for paper slide
  function handleDragStart(clientX: number) {
    isDraggingRef.current = true
    dragStartXRef.current = clientX
    dragDeltaXRef.current = 0
    if (cardSliderRef.current) {
      sliderWidthRef.current = cardSliderRef.current.getBoundingClientRect().width
    }
  }

  function handleDragMove(clientX: number) {
    if (!isDraggingRef.current) return
    dragDeltaXRef.current = clientX - dragStartXRef.current
    const width = sliderWidthRef.current || 360
    const rot = Math.max(-6, Math.min(6, (dragDeltaXRef.current / width) * 10))
    setTrackTransform(selectedCardIdx, dragDeltaXRef.current, rot, false)
  }

  function handleDragEnd() {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    const width = sliderWidthRef.current || 360
    const threshold = width * 0.16
    const delta = dragDeltaXRef.current

    if (delta <= -threshold) {
      goToCard(selectedCardIdx + 1, true)
    } else if (delta >= threshold) {
      goToCard(selectedCardIdx - 1, true)
    } else {
      goToCard(selectedCardIdx, true)
    }
    dragDeltaXRef.current = 0
  }

  // Google OAuth
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

  // Email / Password Auth
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

  function handleSelectStarAndReview(star: number) {
    setReviewRating(star)
    setRateHintText(lang === 'en' ? '⭐ Opening Google Review...' : '⭐ Membuka Google Review...')
    if (googleReviewUrl) {
      setTimeout(() => {
        window.open(googleReviewUrl, '_blank')
        setShowReviewPopup(false)
        setReviewRating(0)
        setRateHintText('')
      }, 500)
    }
  }

  async function handleOpenCustomerQrModal() {
    if (!user?.email) return
    try {
      const url = await QRCode.toDataURL(user.email, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0F2B2A',
          light: '#FFFFFF',
        },
      })
      setCustomerQrDataUrl(url)
      setShowCustomerQrModal(true)
    } catch (err) {
      console.error('Failed to generate customer QR code:', err)
    }
  }

  // Delete Account
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

  // Store verification check
  const isStoreVerified = Boolean(
    storeName &&
    logoUrl &&
    rewardDesc &&
    stampsRequired &&
    socialLinks.length > 0
  )

  const formattedUpdate = formatStampDateTime(updatedAt, lang)

  // 1. LOADING SKELETON
  if (loading || (user && !storeName && refreshing)) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-jakarta text-[#2B1B12] bg-[#FFF7EA]">
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            background-color: #FFF7EA;
            background-image: radial-gradient(circle at 1px 1px, rgba(43,27,18,0.055) 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}} />
        <div className="w-full max-w-[420px] mx-auto flex flex-col items-center justify-center">
          <div className="w-full bg-[#FFFDF8] border border-[#F0DEC0] rounded-[28px] p-6 shadow-xl animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#FF7A45]/20 mb-3" />
            <div className="w-32 h-5 bg-[#2B1B12]/15 rounded-full mb-2" />
            <div className="w-20 h-3 bg-[#2B1B12]/10 rounded-full mb-6" />

            <div className="grid grid-cols-5 gap-2.5 w-full mb-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-full border-2 border-dashed border-[#F0DEC0] bg-[#FFB238]/10"
                />
              ))}
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#F0DEC0] mb-4" />
            <div className="w-40 h-3.5 bg-[#2B1B12]/15 rounded-full" />
          </div>

          <footer className="w-full text-center mt-6 flex items-center justify-center gap-1.5 opacity-40 text-[11px] font-space text-[#2B1B12]">
            <img src="/logo.svg" alt="LajuS" className="w-3.5 h-3.5 object-contain" />
            <span>LajuS</span>
          </footer>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen text-[#2B1B12] font-jakarta">
      {/* SCOPED COMPONENT STYLES FAITHFULLY TRANSLATED FROM loyalty_card.html */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg: #FFF7EA;
          --bg-dot: rgba(43,27,18,0.055);
          --hero-1: #FF7A45;
          --hero-2: #FF9F45;
          --hero-3: #FFC24D;
          --cream: #FFFDF8;
          --ink: #2B1B12;
          --ink-strong: #1B0F09;
          --muted: #96806B;
          --muted-on-hero: rgba(255,253,248,0.82);
          --border-warm: #F0DEC0;
          --gold: #FFB238;
          --gold-deep: #E8901B;
          --teal: #1C7A67;
          --teal-deep: #0F5C4C;
          --coral: #FF5A45;
          --coral-deep: #E23F2E;
          --coral-soft: rgba(255,90,69,0.12);
          --green: #1FA96B;
          --panel-hero: rgba(255,255,255,0.20);
          --panel-hero-border: rgba(255,255,255,0.38);
          --r-lg: 28px;
          --r-md: 18px;
          --r-sm: 13px;
          --r-full: 999px;
        }

        body {
          background-color: var(--bg);
          background-image: radial-gradient(circle at 1px 1px, var(--bg-dot) 1px, transparent 1px);
          background-size: 20px 20px;
          color: var(--ink);
        }

        .card-app {
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          padding-bottom: 44px;
        }

        .hscroll {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }
        .hscroll::-webkit-scrollbar {
          display: none;
        }

        /* HERO */
        .hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, var(--hero-1) 0%, var(--hero-2) 55%, var(--hero-3) 100%);
          border-radius: 0 0 34px 34px;
          padding: 16px 16px 26px;
          box-shadow: 0 20px 36px -14px rgba(226,63,46,0.45);
        }
        .hero::before {
          content: '';
          position: absolute;
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: rgba(255,255,255,0.16);
          top: -90px;
          right: -60px;
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: rgba(255,255,255,0.13);
          bottom: -70px;
          left: -40px;
          pointer-events: none;
        }
        .hero-inner {
          position: relative;
          z-index: 1;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .lang-toggle {
          display: flex;
          align-items: center;
          gap: 2px;
          background: var(--panel-hero);
          border: 1px solid var(--panel-hero-border);
          border-radius: var(--r-full);
          padding: 3px;
        }
        .lang-toggle button {
          border: none;
          background: transparent;
          color: var(--muted-on-hero);
          font-weight: 700;
          font-size: 11.5px;
          padding: 6px 12px;
          border-radius: var(--r-full);
          transition: .15s;
          cursor: pointer;
        }
        .lang-toggle button.active {
          background: #fff;
          color: var(--coral-deep);
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .icon-btn {
          width: 33px;
          height: 33px;
          border-radius: 50%;
          border: 1px solid var(--panel-hero-border);
          background: var(--panel-hero);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: .15s;
          cursor: pointer;
        }
        .icon-btn:hover {
          background: rgba(255,255,255,0.32);
        }
        .icon-btn:active {
          transform: scale(0.92);
        }
        .icon-btn.gold {
          color: #FFEBC2;
        }
        .icon-btn svg {
          width: 15px;
          height: 15px;
        }

        /* Profile */
        .profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .avatar {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: #fff;
          color: var(--coral-deep);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 29px;
          font-weight: 700;
          font-family: 'Fraunces', serif;
          box-shadow: 0 10px 22px rgba(0,0,0,0.18);
          border: 3px solid rgba(255,255,255,0.55);
          margin-bottom: 10px;
          overflow: hidden;
        }

        .store-name {
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 20px;
          color: #fff;
          line-height: 1.2;
        }
        .verified-badge {
          width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .socials {
          display: flex;
          gap: 7px;
          justify-content: center;
          margin-top: 9px;
          flex-wrap: wrap;
        }
        .social-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--panel-hero);
          border: 1px solid var(--panel-hero-border);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #ffffff;
          transition: transform .15s, background .15s;
        }
        .social-btn:hover {
          transform: scale(1.08);
          background: rgba(255,255,255,0.32);
        }
        .social-btn svg {
          width: 13px;
          height: 13px;
          color: #ffffff;
        }

        .pill-row {
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        .pill-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1px solid var(--border-warm);
          background: #ffffff;
          color: var(--ink-strong);
          border-radius: 12px;
          padding: 8px 13px;
          font-size: 11.5px;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
          cursor: pointer;
          transition: transform .15s, box-shadow .15s;
          white-space: nowrap;
        }
        .pill-btn svg {
          width: 13px;
          height: 13px;
          color: var(--coral);
        }
        .pill-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(0,0,0,0.1);
        }
        .pill-btn:active {
          transform: translateY(0);
        }

        /* Content */
        .card-content {
          padding: 18px 16px 0;
        }

        /* Store tabs */
        .store-tabs-wrap {
          margin-bottom: 14px;
        }
        .store-tab {
          border: 1.5px solid var(--border-warm);
          border-radius: var(--r-full);
          padding: 7px 13px;
          font-size: 11.5px;
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
          background: var(--cream);
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: .15s;
        }
        .store-tab.active {
          background: var(--coral);
          border-color: var(--coral);
          color: #fff;
        }
        .store-tab .badge {
          font-size: 9.5px;
          padding: 1px 6px;
          border-radius: var(--r-full);
          font-weight: 700;
          background: var(--coral-soft);
          color: var(--coral-deep);
        }
        .store-tab.active .badge {
          background: rgba(255,255,255,0.28);
          color: #fff;
        }

        /* Card slider */
        .card-slider {
          position: relative;
          overflow: hidden;
          padding: 4px 0 10px;
          margin: 0 -2px;
          touch-action: pan-y;
        }
        .card-slider-track {
          display: flex;
          transform-origin: center bottom;
          transition: transform .5s cubic-bezier(.22,.9,.32,1);
          will-change: transform;
          cursor: grab;
        }
        .card-slider-track:active {
          cursor: grabbing;
        }

        /* Stamp card */
        .stamp-card {
          background: var(--cream);
          border-radius: var(--r-lg);
          padding: 24px 18px 20px;
          color: var(--ink);
          border: 1px solid var(--border-warm);
          box-sizing: border-box;
        }

        .stamp-card-head {
          text-align: center;
          margin-bottom: 6px;
        }
        .stamp-card-head .label {
          font-size: 11px;
          letter-spacing: 0.04em;
          color: var(--teal);
          font-weight: 800;
          margin-bottom: 2px;
          text-transform: uppercase;
        }
        .stamp-card-head .count {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 36px;
          color: var(--coral);
          line-height: 1;
        }
        .stamp-card-head .count small {
          font-size: 15px;
          color: var(--muted);
          font-weight: 600;
        }

        .perforation {
          display: flex;
          gap: 5px;
          justify-content: center;
          margin: 12px 0 16px;
          opacity: 0.5;
        }
        .perforation span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--border-warm);
        }

        .stamp-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }

        .stamp {
          aspect-ratio: 1/1;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: transform .15s, filter .15s;
        }
        .stamp.empty {
          border: 2px dashed var(--border-warm);
          background: rgba(255,178,56,0.07);
          color: #D8B98C;
          font-weight: 700;
          font-size: 11px;
        }
        .stamp.filled {
          background: radial-gradient(circle at 32% 28%, rgba(255,255,255,0.4), transparent 55%), linear-gradient(145deg, var(--coral), var(--coral-deep));
          box-shadow: 0 5px 12px rgba(255,90,69,0.4);
        }
        .stamp.anim-new-stamp {
          animation: stampImpact 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          box-shadow: 0 0 0 3.5px rgba(255,122,69,0.45), 0 8px 18px rgba(255,90,69,0.3);
          z-index: 5;
        }
        @keyframes stampImpact {
          0% {
            transform: scale(2.6) rotate(-18deg);
            opacity: 0;
            box-shadow: 0 16px 28px rgba(255,90,69,0.5);
          }
          55% {
            transform: scale(0.9) rotate(3deg);
            opacity: 1;
          }
          75% {
            transform: scale(1.1) rotate(-1deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        .stamp:hover {
          filter: brightness(1.05);
        }
        .stamp:active {
          transform: scale(0.92);
        }

        .progress-bar {
          height: 9px;
          border-radius: 6px;
          background: var(--border-warm);
          overflow: hidden;
          margin-bottom: 13px;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 6px;
          background: linear-gradient(90deg, var(--coral), var(--gold));
          transition: width .8s ease;
        }

        .status-text {
          text-align: center;
          font-size: 13px;
          color: var(--teal-deep);
          font-weight: 700;
          line-height: 1.4;
        }
        .status-text b {
          color: var(--coral-deep);
        }

        /* Dots pagination */
        .card-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 16px;
        }
        .dot {
          width: 8px;
          height: 8px;
          padding: 0;
          border: none;
          border-radius: var(--r-full);
          background: var(--border-warm);
          transition: .25s ease;
          flex-shrink: 0;
          cursor: pointer;
        }
        .dot.full {
          background: var(--green);
          opacity: 0.55;
        }
        .dot.active {
          width: 24px;
          background: var(--coral);
          opacity: 1;
        }
        .dot.active.full {
          background: var(--green);
          opacity: 1;
        }

        .updated-text {
          text-align: center;
          margin-top: 12px;
          font-size: 10.5px;
          color: var(--muted);
          font-weight: 600;
        }

        /* Footer */
        .card-footer {
          text-align: center;
          margin-top: 26px;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          margin-bottom: 7px;
          font-weight: 800;
          color: var(--ink);
        }
        .footer-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 10.5px;
        }
        .footer-links a {
          color: var(--muted);
          text-decoration: underline;
        }
        .footer-links button {
          border: none;
          background: none;
          color: #D9483A;
          text-decoration: underline;
          font-size: 10.5px;
          padding: 0;
          font-weight: 600;
          cursor: pointer;
        }
        .footer-links .dot-sep {
          color: var(--border-warm);
        }

        /* Modals */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(27,15,9,0.68);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          z-index: 50;
        }
        .modal {
          width: 100%;
          max-width: 340px;
          background: var(--cream);
          color: var(--ink);
          border-radius: 26px;
          padding: 22px 20px;
          position: relative;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }
        .modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(43,27,18,0.06);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          color: #7A6A5A;
          font-weight: 700;
          cursor: pointer;
        }

        .modal-title {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 19px;
          color: var(--ink-strong);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .modal-sub {
          font-size: 11.5px;
          color: var(--muted);
          margin-bottom: 14px;
        }

        .modal-btn {
          width: 100%;
          padding: 12px;
          border-radius: 14px;
          border: none;
          background: var(--teal);
          color: #fff;
          font-weight: 700;
          font-size: 12.5px;
          margin-top: 6px;
          cursor: pointer;
          transition: .15s;
        }
        .modal-btn:hover {
          background: var(--teal-deep);
        }
        .modal-btn.danger {
          background: var(--coral-deep);
        }
        .modal-btn.danger:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .modal-btn.ghost {
          background: #fff;
          color: #5A4B3D;
          border: 1px solid var(--border-warm);
        }

        .step-item {
          display: flex;
          gap: 10px;
          margin-bottom: 11px;
          font-size: 12px;
          color: #4A3B2E;
          line-height: 1.4;
        }
        .step-num {
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background: var(--gold);
          color: var(--ink-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10.5px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .reward-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px;
          border: 1px solid var(--border-warm);
          border-radius: 16px;
          margin-bottom: 8px;
          background: #fff;
        }
        .reward-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--coral-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .reward-name {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--ink-strong);
        }
        .reward-req {
          font-size: 10.5px;
          color: var(--muted);
        }

        .qr-box {
          width: 170px;
          height: 170px;
          margin: 0 auto 14px;
          background: #fff;
          border: 1px solid var(--border-warm);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .email-pill {
          background: rgba(28,122,103,0.08);
          border: 1px solid rgba(28,122,103,0.2);
          border-radius: 14px;
          padding: 9px 10px;
          text-align: center;
          margin-bottom: 14px;
        }
        .email-pill .lbl {
          font-size: 9px;
          letter-spacing: 0.04em;
          color: var(--muted);
          font-weight: 700;
        }
        .email-pill .val {
          font-size: 11px;
          font-weight: 700;
          color: var(--ink-strong);
        }

        .del-warn {
          font-size: 12px;
          color: #C0392B;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .del-warn2 {
          font-size: 11.5px;
          color: var(--muted);
          margin-bottom: 14px;
          line-height: 1.4;
        }
        .confirm-input {
          width: 100%;
          border: 1px solid var(--border-warm);
          border-radius: 12px;
          padding: 10px;
          text-align: center;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 12px;
          outline: none;
        }

        .stars {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-bottom: 8px;
        }
        .stars button {
          font-size: 31px;
          background: none;
          border: none;
          color: #E5DACB;
          cursor: pointer;
          transition: transform .1s;
        }
        .stars button:hover {
          transform: scale(1.15);
        }
        .stars button.active {
          color: var(--gold);
        }

        .stamp-detail-icon {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          margin: 0 auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 32% 28%, rgba(255,255,255,0.4), transparent 55%), linear-gradient(145deg, var(--coral), var(--coral-deep));
          box-shadow: 0 6px 14px rgba(255,90,69,0.35);
        }

        .info-card {
          background: #fff;
          border: 1px solid var(--border-warm);
          border-radius: 14px;
          padding: 11px 12px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 8px;
        }
        .info-card b {
          color: var(--ink-strong);
        }
      `}} />

      <div className="card-app">
        {/* ========================================================= */}
        {/* LOGGED IN: HERO HEADER + STORE IDENTITY                  */}
        {/* ========================================================= */}
        {user ? (
          <>
            <div className="hero">
              <div className="hero-inner">
                {/* TOPBAR */}
                <div className="topbar">
                  <div className="lang-toggle">
                    <button
                      type="button"
                      className={lang === 'my' ? 'active' : ''}
                      onClick={() => switchLang('my')}
                    >
                      MY
                    </button>
                    <button
                      type="button"
                      className={lang === 'en' ? 'active' : ''}
                      onClick={() => switchLang('en')}
                    >
                      EN
                    </button>
                  </div>

                  <div className="top-actions">
                    {/* CUSTOMER QR BUTTON */}
                    <button
                      type="button"
                      className="icon-btn gold"
                      title={t.topbar.qrTooltip}
                      onClick={handleOpenCustomerQrModal}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7" rx="1.2" />
                        <rect x="14" y="3" width="7" height="7" rx="1.2" />
                        <rect x="3" y="14" width="7" height="7" rx="1.2" />
                        <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
                      </svg>
                    </button>

                    {/* LOCATION PIN BUTTON */}
                    <button
                      type="button"
                      className="icon-btn"
                      title={t.topbar.locationTooltip}
                      onClick={() => setShowLocationsModal(true)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </button>

                    {/* REFRESH BUTTON */}
                    <button
                      type="button"
                      className="icon-btn"
                      title={t.topbar.refreshTooltip}
                      onClick={() => fetchLoyalty(activeStoreId)}
                      disabled={refreshing}
                    >
                      <svg
                        className={refreshing ? 'animate-spin' : ''}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                    </button>

                    {/* LOGOUT BUTTON */}
                    <button
                      type="button"
                      className="icon-btn"
                      title={t.topbar.logoutTooltip}
                      onClick={handleLogout}
                    >
                      <svg
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
                </div>

                {/* STORE PROFILE */}
                <div className="profile">
                  <div className="avatar relative overflow-hidden">
                    {logoUrl && !logoError ? (
                      <>
                        {/* ANIMASI LOADING PROFILE: Berterusan sehingga gambar selesai dimuatkan */}
                        {logoLoading && (
                          <div className="absolute inset-0 bg-[#FFF7EA] flex items-center justify-center z-10">
                            <div className="w-7 h-7 border-[2.5px] border-[#FF5A45] border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        <img
                          src={logoUrl}
                          alt={storeName}
                          ref={(el) => {
                            if (el && el.complete && el.naturalWidth > 0) {
                              setLogoLoading(false)
                            }
                          }}
                          onLoad={() => setLogoLoading(false)}
                          onError={() => {
                            setLogoError(true)
                            setLogoLoading(false)
                          }}
                          className={`w-full h-full object-cover transition-opacity duration-300 ${
                            logoLoading ? 'opacity-0' : 'opacity-100'
                          }`}
                        />
                      </>
                    ) : (
                      /* JIKA GAGAL / ROSAK ATAU KOSONG: GANTIKAN LOGO LAJUS */
                      <div className="w-full h-full p-2.5 bg-white flex items-center justify-center">
                        <img
                          src="/logo.svg"
                          alt="LajuS"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="store-name">
                    <span>{storeName || 'Kad Cop'}</span>
                    {/* 2. OFFICIAL VERIFIED BADGE (REPLACES GENERIC TICK) */}
                    {isStoreVerified && (
                      <span className="verified-badge" title={t.card.verifiedStoreTitle}>
                        <img
                          src="/green-checkmark-line-icon.svg"
                          alt={t.card.verifiedStoreTitle}
                          className="w-4 h-4 object-contain"
                        />
                      </span>
                    )}
                  </div>

                  {/* 4. OFFICIAL SOCIAL MEDIA ICONS (ALL PURE WHITE) */}
                  {socialLinks.length > 0 && (
                    <div className="socials">
                      {socialLinks.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url.startsWith('http') ? s.url : `https://${s.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-btn"
                          title={s.platform}
                        >
                          {renderSocialIcon(s.platform)}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* ACTION ROW: GOOGLE REVIEW, CARA TEBUS & GANJARAN (PETAK DENGAN BACKGROUND PUTIH) */}
                  <div className="pill-row">
                    {googleReviewUrl && (
                      <button
                        type="button"
                        className="pill-btn"
                        title="Review"
                        onClick={() => setShowReviewPopup(true)}
                      >
                        <img
                          src="/Google-Review.svg"
                          alt="Review"
                          className="w-3.5 h-3.5 object-contain"
                        />
                        <span>Review</span>
                      </button>
                    )}
                    <button
                      type="button"
                      className="pill-btn"
                      onClick={() => setShowInfoModal(true)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span>{t.card.howToRedeemBtn}</span>
                    </button>
                    <button
                      type="button"
                      className="pill-btn"
                      onClick={() => {
                        setRewardSlideIdx(0)
                        setShowRewardsModal(true)
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
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
              </div>
            </div>

            {/* ========================================================= */}
            {/* CONTENT BELOW HERO: TABS + SLIDER + FOOTER                 */}
            {/* ========================================================= */}
            <div className="card-content">
              {/* STORE TABS (MULTI-STORE) */}
              {allStores.length > 1 && (
                <div className="store-tabs-wrap">
                  <div className="hscroll">
                    {allStores.map((st) => {
                      const isActive = st.storeId === activeStoreId
                      return (
                        <button
                          type="button"
                          key={st.storeId}
                          onClick={() => {
                            setActiveStoreId(st.storeId)
                            fetchLoyalty(st.storeId)
                          }}
                          className={`store-tab ${isActive ? 'active' : ''}`}
                        >
                          <span>{st.storeName}</span>
                          <span className="badge">
                            {st.totalStamps} {t.card.stampsUnit}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* CARD SLIDER (SWIPEABLE "KERTAS" SLIDE TRACK) */}
              <div
                className="card-slider"
                ref={cardSliderRef}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                onTouchEnd={handleDragEnd}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleDragStart(e.clientX)
                }}
                onMouseMove={(e) => handleDragMove(e.clientX)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                <div
                  className="card-slider-track"
                  ref={cardTrackRef}
                  style={{
                    width: `${totalCardsCount * 100}%`,
                  }}
                >
                  {Array.from({ length: totalCardsCount }).map((_, cardIdx) => {
                    const isFull = cardIdx < fullCardsCount
                    const cardStamps = isFull ? TOTAL : remainderStamps
                    const cardRemain = Math.max(0, TOTAL - cardStamps)
                    const percentFill = Math.min(100, Math.round((cardStamps / TOTAL) * 100))

                    return (
                      <div
                        key={cardIdx}
                        className="stamp-card"
                        style={{
                          flex: `0 0 ${100 / totalCardsCount}%`,
                          width: `${100 / totalCardsCount}%`,
                        }}
                      >
                        {/* HEAD */}
                        <div className="stamp-card-head">
                          <div className="label">
                            {isFull
                              ? `${lang === 'en' ? 'CARD' : 'KAD'} ${cardIdx + 1} • ${lang === 'en' ? 'FULL' : 'PENUH'}`
                              : `${lang === 'en' ? 'CARD' : 'KAD'} ${cardIdx + 1} • ${lang === 'en' ? 'IN PROGRESS' : 'SEDANG DIISI'}`}
                          </div>
                          <div className="count">
                            {cardStamps}
                            <small> / {TOTAL}</small>
                          </div>
                        </div>

                        {/* PERFORATION LINE */}
                        <div className="perforation">
                          {Array.from({ length: 15 }).map((_, pIdx) => (
                            <span key={pIdx} />
                          ))}
                        </div>

                        {/* 5. STAMP GRID WITH OFFICIAL STAMP ICON (REPLACES FORK SVG) */}
                        <div className="stamp-grid">
                          {Array.from({ length: TOTAL }).map((_, slotIdx) => {
                            const slotNum = slotIdx + 1
                            const filled = slotNum <= cardStamps
                            const globalStampNum = cardIdx * TOTAL + slotNum
                            const stampDate = filled ? (stampDates[globalStampNum - 1] || updatedAt) : null
                            const isNewlyClaimed = Boolean(
                              filled &&
                              newlyClaimedInfo &&
                              globalStampNum >= newlyClaimedInfo.start &&
                              globalStampNum <= newlyClaimedInfo.end
                            )
                            const newStampDelay = isNewlyClaimed
                              ? (globalStampNum - newlyClaimedInfo!.start) * 0.25 + 0.15
                              : 0

                            return (
                              <button
                                type="button"
                                key={slotNum}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedStampDetail({
                                    slotNum,
                                    cardNum: cardIdx + 1,
                                    globalStampNum,
                                    isFilled: filled,
                                    date: stampDate,
                                  })
                                }}
                                className={`stamp ${filled ? 'filled' : 'empty'} ${isNewlyClaimed ? 'anim-new-stamp' : ''}`}
                                style={isNewlyClaimed ? { animationDelay: `${newStampDelay}s` } : undefined}
                                title={
                                  filled
                                    ? `Cop #${slotNum} — ${lang === 'en' ? 'Earned' : 'Diperoleh'}`
                                    : `Cop #${slotNum} — ${lang === 'en' ? 'Not earned yet' : 'Belum diperoleh'}`
                                }
                              >
                                {filled ? (
                                  <img
                                    src={normalizeStampIcon(stampIcon)}
                                    alt="Cop Stamp"
                                    className="w-[52%] h-[52%] object-contain pointer-events-none"
                                    style={{ filter: 'brightness(0) invert(1)' }}
                                  />
                                ) : (
                                  <span className="pointer-events-none">{slotNum}</span>
                                )}
                              </button>
                            )
                          })}
                        </div>

                        {/* PROGRESS BAR */}
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${percentFill}%` }}
                          />
                        </div>

                        {/* STATUS TEXT */}
                        <div className="status-text">
                          {isFull ? (
                            <span>🎉 {t.card.completeRedeem(rewardDesc)}</span>
                          ) : cardRemain > 0 ? (
                            <span>
                              {lang === 'en' ? (
                                <>
                                  <b>{cardRemain}</b> more stamp{cardRemain > 1 ? 's' : ''} for: {rewardDesc}
                                </>
                              ) : (
                                <>
                                  Lagi <b>{cardRemain}</b> cop untuk: {rewardDesc}
                                </>
                              )}
                            </span>
                          ) : (
                            <span>
                              <b>{lang === 'en' ? 'Congratulations!' : 'Tahniah!'}</b> {t.card.congratsFull}
                            </span>
                          )}
                        </div>

                        {/* CARD DOTS PAGINATION */}
                        <div className="card-dots">
                          {Array.from({ length: totalCardsCount }).map((_, dotIdx) => {
                            const isDotFull = dotIdx < fullCardsCount
                            const isDotActive = dotIdx === selectedCardIdx
                            return (
                              <button
                                type="button"
                                key={dotIdx}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  goToCard(dotIdx, true)
                                }}
                                className={`dot ${isDotFull ? 'full' : ''} ${isDotActive ? 'active' : ''} ${
                                  isDotActive && isDotFull ? 'full' : ''
                                }`}
                                aria-label={`Kad ${dotIdx + 1}`}
                                title={`Kad ${dotIdx + 1}`}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* UPDATED TIMESTAMP */}
              <div className="updated-text">
                {t.card.lastUpdated(formattedUpdate.time ? `${formattedUpdate.time}, ${formattedUpdate.date}` : formattedUpdate.date)}
              </div>

              {/* 1. FOOTER BRAND WITH OFFICIAL LAJUS LOGO (REPLACES DOT PLACEHOLDER) */}
              <div className="card-footer">
                <div className="footer-brand">
                  <img
                    src="/logo.svg"
                    alt="LajuS"
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>LajuS</span>
                </div>
                <div className="footer-links">
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">
                    {t.footer.privacyPolicy}
                  </a>
                  <span className="dot-sep">•</span>
                  <button
                    type="button"
                    onClick={() => setShowDeleteAccountModal(true)}
                  >
                    {t.footer.deleteAccount}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================= */
          /* LOGGED OUT: CLEAN WARM LOGIN CARD                        */
          /* ========================================================= */
          <div className="p-4 pt-10 flex flex-col items-center">
            {/* TOP ACTIONS BAR */}
            <div className="w-full flex items-center justify-end mb-4">
              <div className="lang-toggle">
                <button
                  type="button"
                  className={lang === 'my' ? 'active' : ''}
                  onClick={() => switchLang('my')}
                >
                  MY
                </button>
                <button
                  type="button"
                  className={lang === 'en' ? 'active' : ''}
                  onClick={() => switchLang('en')}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="w-full bg-[#FFFDF8] border border-[#F0DEC0] rounded-[28px] p-6 sm:p-7 shadow-xl text-[#2B1B12]">
              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-full bg-[#FF7A45] mx-auto mb-3 shadow-md flex items-center justify-center p-2.5">
                  <img src="/logo.svg" alt="LajuS" className="w-full h-full object-contain" />
                </div>
                <div className="font-fraunces font-bold text-2xl text-[#1B0F09] mb-1">
                  {t.login.digitalStampCard}
                </div>
                <div className="text-xs text-[#96806B]">
                  {t.login.checkStampsSubtitle}
                </div>
              </div>

              {/* GOOGLE LOGIN */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-2.5 bg-white border border-[#F0DEC0] rounded-2xl py-3 px-3.5 font-semibold text-[13.5px] text-[#2B1B12] cursor-pointer active:scale-[0.98] transition hover:bg-[#FFF7EA] disabled:opacity-60 shadow-sm"
              >
                <svg viewBox="0 0 18 18" width="18" height="18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
                  <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z" />
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
                </svg>
                {t.login.loginWithGoogle}
              </button>

              <div className="flex items-center gap-2.5 my-4 text-[#96806B] font-space text-[10px] tracking-[0.1em] before:content-[''] before:flex-1 before:h-[1px] before:bg-[#F0DEC0] after:content-[''] after:flex-1 after:h-[1px] after:bg-[#F0DEC0]">
                {t.login.orDivider}
              </div>

              {authError && (
                <div className="mb-3 p-2.5 rounded-xl bg-red-100 text-[#B23A2E] text-xs font-semibold text-center">
                  {authError}
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-2.5">
                <div className="flex items-center gap-2.5 bg-white border border-[#F0DEC0] rounded-xl p-2.5">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.login.emailPlaceholder}
                    className="border-none outline-none flex-1 text-sm text-[#2B1B12] bg-transparent"
                  />
                </div>

                <div className="flex items-center gap-2.5 bg-white border border-[#F0DEC0] rounded-xl p-2.5">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.login.passwordPlaceholder}
                    className="border-none outline-none flex-1 text-sm text-[#2B1B12] bg-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full border-none rounded-xl py-3 px-4 bg-gradient-to-r from-[#FF7A45] to-[#E8901B] text-white font-bold text-sm cursor-pointer active:scale-[0.98] transition disabled:opacity-60 shadow-md"
                >
                  {isAuthenticating ? t.login.processing : isSignup ? t.login.signupBtn : t.login.loginBtn}
                </button>
              </form>

              <div className="text-center mt-4 text-xs text-[#96806B]">
                {isSignup ? t.login.alreadyHaveAccount : t.login.newAccount}
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-[#FF7A45] font-bold underline cursor-pointer hover:text-[#E23F2E]"
                >
                  {isSignup ? t.login.loginLink : t.login.signupLink}
                </button>
              </div>
            </div>

            <footer className="w-full text-center mt-6 flex items-center justify-center gap-1.5 opacity-40 text-[11px] font-space text-[#2B1B12]">
              <img src="/logo.svg" alt="LajuS" className="w-3.5 h-3.5 object-contain" />
              <span>LajuS</span>
            </footer>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODALS                                                    */}
      {/* ========================================================= */}

      {/* 1. STAMP DETAIL MODAL */}
      {selectedStampDetail && (
        <div
          className="overlay"
          onClick={() => setSelectedStampDetail(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedStampDetail(null)}
            >
              &times;
            </button>
            <div
              className="stamp-detail-icon"
              style={{ opacity: selectedStampDetail.isFilled ? 1 : 0.4 }}
            >
              <img
                src={normalizeStampIcon(stampIcon)}
                alt="Stamp"
                className="w-7 h-7 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="modal-title" style={{ justifyContent: 'center' }}>
                Cop #{selectedStampDetail.slotNum} — Kad {selectedStampDetail.cardNum}
              </div>
              <div className="modal-sub" style={{ marginBottom: 12 }}>
                {storeName}
              </div>
              {selectedStampDetail.isFilled && selectedStampDetail.date ? (
                <>
                  <div className="info-card">
                    <span>📅 {lang === 'en' ? 'Date' : 'Tarikh'}</span>
                    <b>{formatStampDateTime(selectedStampDetail.date, lang).date}</b>
                  </div>
                  <div className="info-card">
                    <span>⏰ {lang === 'en' ? 'Time' : 'Masa'}</span>
                    <b>{formatStampDateTime(selectedStampDetail.date, lang).time || '-'}</b>
                  </div>
                </>
              ) : (
                <div className="info-card" style={{ justifyContent: 'center', color: '#96806B' }}>
                  {t.stampDetailModal.notEarnedHint}
                </div>
              )}
            </div>
            <button
              type="button"
              className="modal-btn"
              onClick={() => setSelectedStampDetail(null)}
            >
              {t.stampDetailModal.closeBtn}
            </button>
          </div>
        </div>
      )}

      {/* 2. HOW TO REDEEM MODAL (CARA TEBUS) */}
      {showInfoModal && (
        <div className="overlay" onClick={() => setShowInfoModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowInfoModal(false)}
            >
              &times;
            </button>
            <div className="modal-title" style={{ gap: 6 }}>
              <span>💡</span>
              <span>{t.infoModal.title}</span>
            </div>
            <div className="modal-sub">
              {lang === 'en'
                ? 'Follow 3 simple steps to redeem your reward.'
                : 'Ikuti 3 langkah mudah untuk tebus ganjaran anda.'}
            </div>
            <div className="step-item">
              <span className="step-num">1</span>
              <span>
                {lang === 'en'
                  ? 'Collect stamps every time you make a purchase at this store.'
                  : 'Kumpul cop setiap kali beli-belah di kedai ini.'}
              </span>
            </div>
            <div className="step-item">
              <span className="step-num">2</span>
              <span>
                {lang === 'en'
                  ? `When the card is full (${TOTAL}/${TOTAL}), show this digital card to the store staff.`
                  : `Bila kad penuh (${TOTAL}/${TOTAL}), tunjukkan kad ini kepada kakitangan kedai.`}
              </span>
            </div>
            <div className="step-item">
              <span className="step-num">3</span>
              <span>
                {lang === 'en'
                  ? 'Staff will verify your card & grant your free reward immediately.'
                  : 'Kakitangan akan sahkan & berikan ganjaran percuma anda serta-merta.'}
              </span>
            </div>
            <button
              type="button"
              className="modal-btn"
              onClick={() => setShowInfoModal(false)}
            >
              {t.infoModal.gotItBtn}
            </button>
          </div>
        </div>
      )}

      {/* 3. REWARDS MODAL (FULL IMAGE SLIDER) */}
      {showRewardsModal && (() => {
        const effectiveRewards = rewardsList.length > 0 ? rewardsList : [
          {
            id: 'default',
            name: rewardDesc || (lang === 'en' ? 'Free Reward' : 'Ganjaran Percuma'),
            stampsRequired: TOTAL,
            imageUrl: rewardImageUrl,
            description: rewardDesc || '',
          },
        ]
        const totalRewards = effectiveRewards.length
        const currentReward = effectiveRewards[rewardSlideIdx] || effectiveRewards[0]

        return (
          <div className="overlay" onClick={() => setShowRewardsModal(false)}>
            <div
              className="modal"
              style={{ maxWidth: 360, padding: 0, overflow: 'hidden', borderRadius: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                type="button"
                className="modal-close"
                style={{ zIndex: 20, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}
                onClick={() => setShowRewardsModal(false)}
              >
                &times;
              </button>

              {/* FULL IMAGE CONTAINER WITH TOUCH SWIPE & ARROWS */}
              <div
                className="relative w-full h-[240px] sm:h-[260px] bg-[#FFF7EA] flex items-center justify-center overflow-hidden border-b border-[#F0DEC0]"
                onTouchStart={(e) => {
                  rewardTouchStartXRef.current = e.touches[0].clientX
                }}
                onTouchEnd={(e) => {
                  const diff = e.changedTouches[0].clientX - rewardTouchStartXRef.current
                  if (diff < -40 && totalRewards > 1) {
                    setRewardSlideIdx((prev) => (prev + 1) % totalRewards)
                  } else if (diff > 40 && totalRewards > 1) {
                    setRewardSlideIdx((prev) => (prev - 1 + totalRewards) % totalRewards)
                  }
                }}
              >
                {currentReward?.imageUrl ? (
                  <img
                    src={currentReward.imageUrl}
                    alt={currentReward.name}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF7EA] to-[#FCE7D2] text-center p-4">
                    <span className="text-6xl mb-2">🎁</span>
                    <span className="text-xs font-semibold text-[#96806B]">
                      {lang === 'en' ? 'No image available' : 'Tiada gambar disediakan'}
                    </span>
                  </div>
                )}

                {/* BADGE: PERLU X COP (TOP-LEFT ON IMAGE) */}
                <div className="absolute top-3.5 left-3.5 z-10 bg-[#FF5A45] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  {t.rewardsModal.stampsRequiredBadge(currentReward?.stampsRequired || TOTAL)}
                </div>

                {/* SLIDE NAVIGATION ARROWS (IF > 1 REWARD) */}
                {totalRewards > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setRewardSlideIdx((prev) => (prev - 1 + totalRewards) % totalRewards)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center text-lg font-bold transition shadow-md cursor-pointer select-none z-10"
                      title="Sebelumnya"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setRewardSlideIdx((prev) => (prev + 1) % totalRewards)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center text-lg font-bold transition shadow-md cursor-pointer select-none z-10"
                      title="Seterusnya"
                    >
                      ›
                    </button>

                    {/* SLIDE COUNTER BADGE */}
                    <div className="absolute bottom-2.5 right-3 z-10 bg-black/55 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {rewardSlideIdx + 1} / {totalRewards}
                    </div>
                  </>
                )}
              </div>

              {/* DETAILS & SLIDE DOTS */}
              <div className="p-5 text-center">
                <div className="font-fraunces font-bold text-xl text-[#1B0F09] mb-1.5 leading-tight">
                  {currentReward?.name}
                </div>

                {currentReward?.description && (
                  <div className="text-xs text-[#96806B] mb-3 leading-relaxed max-w-[90%] mx-auto">
                    {currentReward.description}
                  </div>
                )}

                {/* SLIDE DOTS (IF > 1 REWARD) */}
                {totalRewards > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mb-4">
                    {effectiveRewards.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setRewardSlideIdx(dotIdx)}
                        className={`transition-all rounded-full border-none p-0 cursor-pointer ${
                          dotIdx === rewardSlideIdx
                            ? 'w-5 h-2 bg-[#FF5A45]'
                            : 'w-2 h-2 bg-[#F0DEC0] hover:bg-[#FF7A45]/50'
                        }`}
                        aria-label={`Ganjaran ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="modal-btn"
                  style={{ marginTop: 2 }}
                  onClick={() => setShowRewardsModal(false)}
                >
                  {t.rewardsModal.closeBtn}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* 4. CUSTOMER QR CODE MODAL */}
      {showCustomerQrModal && (
        <div className="overlay" onClick={() => setShowCustomerQrModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowCustomerQrModal(false)}
            >
              &times;
            </button>
            <div className="modal-title" style={{ justifyContent: 'center' }}>
              {t.qrModal.title}
            </div>
            <div className="modal-sub" style={{ textAlign: 'center' }}>
              {t.qrModal.desc}
            </div>
            <div className="qr-box">
              {customerQrDataUrl ? (
                <img
                  src={customerQrDataUrl}
                  alt="Customer QR Code"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-xs text-gray-400">Loading QR...</div>
              )}
            </div>
            <div className="email-pill">
              <div className="lbl">{t.qrModal.emailLabel}</div>
              <div className="val truncate">{user?.email}</div>
            </div>
            <button
              type="button"
              className="modal-btn"
              onClick={() => setShowCustomerQrModal(false)}
            >
              {t.qrModal.closeBtn}
            </button>
          </div>
        </div>
      )}

      {/* 5. GOOGLE REVIEW MODAL */}
      {showReviewPopup && (
        <div className="overlay" onClick={() => setShowReviewPopup(false)}>
          <div className="modal" style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowReviewPopup(false)}
            >
              &times;
            </button>
            <div className="modal-title" style={{ justifyContent: 'center' }}>
              ⭐ {lang === 'en' ? 'Rate Us on Google' : 'Nilai Kami di Google'}
            </div>
            <div className="modal-sub">
              {lang === 'en'
                ? 'Tap stars to give your review.'
                : 'Sentuh bintang untuk beri penilaian anda.'}
            </div>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={reviewRating >= s ? 'active' : ''}
                  onClick={() => handleSelectStarAndReview(s)}
                >
                  ★
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12, minHeight: 16 }}>
              {rateHintText || (lang === 'en' ? '5 stars are greatly appreciated!' : '5 bintang amat kami hargai!')}
            </div>
            <button
              type="button"
              className="modal-btn ghost"
              onClick={() => setShowReviewPopup(false)}
            >
              {lang === 'en' ? 'Maybe Later' : 'Mungkin Nanti'}
            </button>
          </div>
        </div>
      )}

      {/* 6. DELETE ACCOUNT MODAL */}
      {showDeleteAccountModal && (
        <div className="overlay" onClick={() => setShowDeleteAccountModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowDeleteAccountModal(false)}
            >
              &times;
            </button>
            <div className="modal-title">⚠️ {t.deleteModal.title}</div>
            <div className="del-warn">{t.deleteModal.warning1}</div>
            <div className="del-warn2">{t.deleteModal.warning2}</div>

            {deleteAccountError && (
              <div className="p-2 mb-2 bg-red-100 text-red-700 text-xs rounded-lg font-semibold">
                {deleteAccountError}
              </div>
            )}

            <label style={{ fontSize: 11.5, fontWeight: 700, display: 'block', marginBottom: 6 }}>
              {t.deleteModal.typeToConfirm}
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
              className="confirm-input"
              placeholder="PADAM"
            />

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="modal-btn ghost"
                style={{ marginTop: 0 }}
                onClick={() => setShowDeleteAccountModal(false)}
              >
                {t.deleteModal.cancel}
              </button>
              <button
                type="button"
                className="modal-btn danger"
                style={{ marginTop: 0 }}
                disabled={deleteConfirmText.trim() !== 'PADAM' || isDeletingAccount}
                onClick={handleDeleteAccount}
              >
                {isDeletingAccount ? t.deleteModal.deleting : t.deleteModal.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. STORE LOCATIONS MODAL (MINI GOOGLE MAPS) */}
      {showLocationsModal && (
        <div className="overlay" onClick={() => setShowLocationsModal(false)}>
          <div
            className="modal"
            style={{ maxWidth: 380, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowLocationsModal(false)}
            >
              &times;
            </button>

            <div className="modal-title" style={{ gap: 6 }}>
              <span>📍</span>
              <span>{t.locationsModal.title}</span>
            </div>
            <div className="modal-sub" style={{ marginBottom: 12 }}>
              {storeName || 'Kad Cop'}
            </div>

            {/* MULTI-OUTLET SELECTOR TABS (IF > 1 LOCATION) */}
            {locations.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
                {locations.map((loc, idx) => {
                  const isActive = idx === activeLocationIdx
                  return (
                    <button
                      key={loc.id || idx}
                      type="button"
                      onClick={() => setActiveLocationIdx(idx)}
                      className={`text-[11.5px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer flex items-center gap-1 shrink-0 ${
                        isActive
                          ? 'bg-[#FF5A45] text-white shadow-xs'
                          : 'bg-[#FFF7EA] text-[#5A4B3D] border border-[#F0DEC0] hover:bg-[#FCE7D2]'
                      }`}
                    >
                      <span>📍</span>
                      <span>{loc.name || `Cawangan ${idx + 1}`}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {locations.length > 0 ? (
              (() => {
                const currentLoc = locations[activeLocationIdx] || locations[0]
                const embedUrl = getGoogleMapsEmbedUrl(currentLoc, storeName)

                return (
                  <div className="space-y-3">
                    {/* MINI GOOGLE MAP IFRAME (AUTHENTIC PINPOINT FROM GOOGLE MAPS) */}
                    <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-[#F0DEC0] relative bg-[#FFF7EA] shadow-inner select-none">
                      {embedUrl ? (
                        <>
                          <iframe
                            key={`${activeLocationIdx}_${embedUrl}`}
                            title={currentLoc.name || 'Google Map'}
                            src={embedUrl}
                            onLoad={() => setIsMapLoading(false)}
                            className={`w-full h-full border-0 pointer-events-none transition-opacity duration-300 ${
                              isMapLoading ? 'opacity-0' : 'opacity-100'
                            }`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />

                          {/* MAP LOADING ANIMATION SKELETON */}
                          {isMapLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFF7EA] z-10 transition-opacity duration-200">
                              <div className="relative flex items-center justify-center mb-2">
                                <div className="absolute w-12 h-12 rounded-full bg-[#FF7A45]/20 animate-ping" />
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF7A45] to-[#E8901B] flex items-center justify-center shadow-md relative z-10 text-white">
                                  <svg className="w-5 h-5 animate-bounce" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                  </svg>
                                </div>
                              </div>
                              <span className="text-[11.5px] font-bold text-[#5A4B3D] tracking-tight animate-pulse">
                                {lang === 'en' ? 'Loading map location...' : 'Memuatkan peta lokasi...'}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                          <span className="text-3xl mb-1">🗺️</span>
                          <span className="text-xs text-[#96806B]">
                            {lang === 'en' ? 'Map could not be loaded' : 'Peta tidak dapat dimuatkan'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* LOCATION DETAILS CARD */}
                    <div className="bg-[#FFFDF8] border border-[#F0DEC0] rounded-xl p-3 text-left">
                      <div className="font-fraunces font-bold text-sm text-[#1B0F09] flex items-center justify-between">
                        <span>{currentLoc.name || 'Cawangan'}</span>
                        {locations.length > 1 && (
                          <span className="text-[10px] font-jakarta font-bold text-[#FF5A45] bg-[#FF5A45]/10 px-2 py-0.5 rounded-full">
                            {t.locationsModal.outletLabel(activeLocationIdx + 1, locations.length)}
                          </span>
                        )}
                      </div>
                      {currentLoc.address && (
                        <p className="text-xs text-[#5A4B3D] mt-1 leading-relaxed">
                          {currentLoc.address}
                        </p>
                      )}
                    </div>

                    {/* ACTION BUTTON: OPEN IN GOOGLE MAPS */}
                    {currentLoc.url && (
                      <a
                        href={currentLoc.url.startsWith('http') ? currentLoc.url : `https://${currentLoc.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-btn"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none' }}
                      >
                        <span>{t.locationsModal.openInMaps}</span>
                      </a>
                    )}
                  </div>
                )
              })()
            ) : (
              /* EMPTY LOCATIONS STATE */
              <div className="text-center py-6">
                <span className="text-4xl">📍</span>
                <p className="text-xs text-[#96806B] mt-2 leading-relaxed px-4">
                  {t.locationsModal.noLocations}
                </p>
              </div>
            )}

            <button
              type="button"
              className="modal-btn ghost"
              style={{ marginTop: 8 }}
              onClick={() => setShowLocationsModal(false)}
            >
              {t.locationsModal.closeBtn}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
