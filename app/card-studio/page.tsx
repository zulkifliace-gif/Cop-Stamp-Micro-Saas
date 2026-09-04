'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export type EditableBlockId =
  | 'hero_header'
  | 'store_profile'
  | 'stamp_card_box'
  | 'progress_bar'

export interface EditableBlockConfig {
  id: EditableBlockId
  name: string
  icon: string
  visible: boolean
  // Styling
  bgColor: string
  bgColor2?: string
  textColor: string
  borderColor: string
  borderRadius: number
  shadowStyle: 'none' | 'soft' | 'glow' | 'glass'
  // Media & Content
  imageUrl: string
  title: string
  subtitle: string
  extraText?: string
}

export interface LiveStudioConfig {
  templateName: string
  pageBgColor: string
  pageDotColor: string
  primaryAccent: string
  secondaryAccent: string
  // Simulation params
  storeName: string
  rewardDesc: string
  stampsRequired: number
  simulatedStamps: number
  stampIcon: string
  // 4 Editable Core Blocks
  blocks: EditableBlockConfig[]
}

export const DEFAULT_4_BLOCKS: EditableBlockConfig[] = [
  {
    id: 'hero_header',
    name: '1. Hero Header (Latar Belakang & Sudut Banner)',
    icon: '👑',
    visible: true,
    bgColor: '#FF7A45',
    bgColor2: '#FFC24D',
    textColor: '#FFFFFF',
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 34,
    shadowStyle: 'glow',
    imageUrl: '',
    title: 'Hero Banner Atas',
    subtitle: 'Warna gradient dan lengkungan sudut bawah banner',
  },
  {
    id: 'store_profile',
    name: '2. Profile Kedai (Logo, Nama & Warna Teks)',
    icon: '🏪',
    visible: true,
    bgColor: '#FFFFFF',
    textColor: '#FFFFFF',
    borderColor: 'rgba(255,255,255,0.55)',
    borderRadius: 999,
    shadowStyle: 'soft',
    imageUrl: '/mascot.png',
    title: 'Diana Bakery & Cafe',
    subtitle: 'Kopi & Pastri Premium Segar',
    extraText: '#FFFFFF',
  },
  {
    id: 'stamp_card_box',
    name: '3. Kotak Kad Cop (Latar Belakang & Bingkai Kad)',
    icon: '🃏',
    visible: true,
    bgColor: '#FFFDF8',
    textColor: '#2B1B12',
    borderColor: '#F0DEC0',
    borderRadius: 28,
    shadowStyle: 'soft',
    imageUrl: '',
    title: 'Kad Cop Digital',
    subtitle: 'Warna latar, warna garisan bingkai & lengkungan kad',
  },
  {
    id: 'progress_bar',
    name: '4. Bar Kemajuan (Warna & Gradient Meter Cop)',
    icon: '📊',
    visible: true,
    bgColor: '#F0DEC0',
    bgColor2: '#FFB238',
    textColor: '#FF5A45',
    borderColor: 'transparent',
    borderRadius: 6,
    shadowStyle: 'none',
    imageUrl: '',
    title: 'Meter Kemajuan Cop',
    subtitle: 'Warna trek dasar & warna gradient pengisian cop',
  },
]

export const DEFAULT_LIVE_STUDIO_CONFIG: LiveStudioConfig = {
  templateName: 'Tema Asal LajuS (Live)',
  pageBgColor: '#FFF7EA',
  pageDotColor: 'rgba(43,27,18,0.055)',
  primaryAccent: '#FF7A45',
  secondaryAccent: '#FFC24D',
  storeName: 'Diana Bakery & Cafe',
  rewardDesc: '1 Minuman Panas Percuma (Saiz Regular)',
  stampsRequired: 10,
  simulatedStamps: 4,
  stampIcon: '/icons/stamps/makanan.svg',
  blocks: DEFAULT_4_BLOCKS,
}

export const LIVE_PRESETS = [
  {
    name: 'Warm Sunset (Asal LajuS)',
    pageBg: '#FFF7EA',
    pageDot: 'rgba(43,27,18,0.055)',
    hero1: '#FF7A45',
    hero2: '#FFC24D',
    stampBg: '#FFFDF8',
    stampBorder: '#F0DEC0',
    progressTrack: '#F0DEC0',
    progressFill1: '#FF5A45',
    progressFill2: '#FFB238',
  },
  {
    name: 'Royal Emerald (Cafe & Kopi)',
    pageBg: '#F0F9F5',
    pageDot: 'rgba(15,92,76,0.06)',
    hero1: '#0F5C4C',
    hero2: '#1FA96B',
    stampBg: '#FFFFFF',
    stampBorder: '#C8E6C9',
    progressTrack: '#E0F2F1',
    progressFill1: '#1C7A67',
    progressFill2: '#2EB88A',
  },
  {
    name: 'Golden Luxury (Bakeri & Pastri)',
    pageBg: '#FFF9ED',
    pageDot: 'rgba(140,83,17,0.06)',
    hero1: '#A86208',
    hero2: '#FFC24D',
    stampBg: '#FFFDF8',
    stampBorder: '#F5DEB3',
    progressTrack: '#FCE7C8',
    progressFill1: '#E8901B',
    progressFill2: '#FFD54F',
  },
  {
    name: 'Sweet Berry (Dessert & Spa)',
    pageBg: '#FFF0F5',
    pageDot: 'rgba(184,46,90,0.06)',
    hero1: '#C2185B',
    hero2: '#F48FB1',
    stampBg: '#FFFFFF',
    stampBorder: '#F8BBD0',
    progressTrack: '#FCE4EC',
    progressFill1: '#D81B60',
    progressFill2: '#FF80AB',
  },
  {
    name: 'Ocean Blue (Carwash & Servis)',
    pageBg: '#F0F8FF',
    pageDot: 'rgba(21,101,192,0.06)',
    hero1: '#1565C0',
    hero2: '#42A5F5',
    stampBg: '#FFFFFF',
    stampBorder: '#BBDEFB',
    progressTrack: '#E3F2FD',
    progressFill1: '#1E88E5',
    progressFill2: '#64B5F6',
  },
  {
    name: 'Dark Velvet (Barber & Butik)',
    pageBg: '#18181B',
    pageDot: 'rgba(255,255,255,0.05)',
    hero1: '#27272A',
    hero2: '#52525B',
    stampBg: '#202023',
    stampBorder: '#3F3F46',
    progressTrack: '#333338',
    progressFill1: '#F59E0B',
    progressFill2: '#FBBF24',
  },
]

function safeColor(val: any, fallback: string = '#FF7A45'): string {
  if (typeof val === 'string' && (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl') || val === 'transparent')) {
    return val
  }
  return fallback
}

export function sanitizeLiveConfig(data: any): LiveStudioConfig {
  if (!data || typeof data !== 'object') return DEFAULT_LIVE_STUDIO_CONFIG

  const pageBgColor = safeColor(data.pageBgColor, '#FFF7EA')
  const pageDotColor = typeof data.pageDotColor === 'string' ? data.pageDotColor : 'rgba(43,27,18,0.055)'
  const primaryAccent = safeColor(data.primaryAccent, '#FF7A45')
  const secondaryAccent = safeColor(data.secondaryAccent, '#FFC24D')
  const storeName = typeof data.storeName === 'string' ? data.storeName : 'Diana Bakery & Cafe'
  const rewardDesc = typeof data.rewardDesc === 'string' ? data.rewardDesc : '1 Minuman Panas Percuma'
  const stampsRequired = typeof data.stampsRequired === 'number' ? data.stampsRequired : 10
  const simulatedStamps = typeof data.simulatedStamps === 'number' ? data.simulatedStamps : 4
  const stampIcon = typeof data.stampIcon === 'string' ? data.stampIcon : '/icons/stamps/makanan.svg'

  let mergedBlocks = DEFAULT_4_BLOCKS.map((defaultBlock) => {
    const found = Array.isArray(data.blocks)
      ? data.blocks.find((b: any) => b && b.id === defaultBlock.id)
      : null

    if (!found) return { ...defaultBlock }

    return {
      id: defaultBlock.id,
      name: defaultBlock.name,
      icon: defaultBlock.icon,
      visible: typeof found.visible === 'boolean' ? found.visible : defaultBlock.visible,
      bgColor: safeColor(found.bgColor, defaultBlock.bgColor),
      bgColor2: typeof found.bgColor2 === 'string' ? found.bgColor2 : defaultBlock.bgColor2,
      textColor: safeColor(found.textColor, defaultBlock.textColor),
      borderColor: safeColor(found.borderColor, defaultBlock.borderColor),
      borderRadius: typeof found.borderRadius === 'number' ? found.borderRadius : defaultBlock.borderRadius,
      shadowStyle: found.shadowStyle || defaultBlock.shadowStyle,
      imageUrl: typeof found.imageUrl === 'string' ? found.imageUrl : defaultBlock.imageUrl,
      title: typeof found.title === 'string' ? found.title : defaultBlock.title,
      subtitle: typeof found.subtitle === 'string' ? found.subtitle : defaultBlock.subtitle,
      extraText: typeof found.extraText === 'string' ? found.extraText : defaultBlock.extraText,
    }
  })

  return {
    templateName: typeof data.templateName === 'string' ? data.templateName : 'Tema Kustom Live',
    pageBgColor,
    pageDotColor,
    primaryAccent,
    secondaryAccent,
    storeName,
    rewardDesc,
    stampsRequired,
    simulatedStamps,
    stampIcon,
    blocks: mergedBlocks,
  }
}

function renderLiveSocialIcon(platform: string) {
  const p = (platform || '').toLowerCase().trim()
  switch (p) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="#ffffff" className="w-3.5 h-3.5">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43 5.92 5.92 0 0 0 1.51-4.09V7.93a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.55-.64v1.28z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="#ffffff" className="w-3.5 h-3.5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case 'whatsapp':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="#ffffff" className="w-3.5 h-3.5">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.14 0-.36.05-.54.26-.19.2-.72.7-.72 1.72s.74 1.99.85 2.13c.11.15 1.45 2.22 3.52 3.11.49.21.88.34 1.18.44.5.16.95.14 1.31.08.4-.06 1.22-.5 1.39-.98.17-.49.17-.91.12-.99-.05-.08-.19-.14-.4-.25s-1.22-.6-1.41-.67c-.19-.07-.33-.1-.47.11s-.54.67-.67.81-.24.16-.45.05c-.21-.11-.89-.33-1.69-1.05-.62-.56-1.05-1.25-1.17-1.46s-.01-.32.09-.43c.1-.1.21-.24.32-.36.1-.12.14-.2.21-.34.07-.14.04-.26-.02-.37s-.47-1.14-.65-1.56c-.17-.41-.35-.35-.48-.36z" />
        </svg>
      )
  }
}

export default function LiveCardStudioPage() {
  const [config, setConfig] = useState<LiveStudioConfig>(DEFAULT_LIVE_STUDIO_CONFIG)
  const [activeTab, setActiveTab] = useState<'blocks' | 'settings' | 'simulate'>('blocks')
  const [expandedBlockId, setExpandedBlockId] = useState<EditableBlockId | null>('hero_header')
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [activeLang, setActiveLang] = useState<'my' | 'en'>('my')

  const [activeModal, setActiveModal] = useState<'none' | 'how_to_redeem' | 'rewards' | 'google_review' | 'locations' | 'qr' | 'stamp_detail'>('none')
  const [selectedStampSlot, setSelectedStampSlot] = useState<number>(1)
  const [reviewRating, setReviewRating] = useState<number>(0)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cop_card_studio_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        setConfig(sanitizeLiveConfig(parsed))
      }
    } catch (e) {
      console.error('Error loading studio config:', e)
    }
  }, [])

  const handleSave = () => {
    try {
      localStorage.setItem('cop_card_studio_config', JSON.stringify(config))
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2500)
    } catch (e) {
      alert('Gagal menyimpan draf')
    }
  }

  const handleReset = () => {
    if (confirm('Set semula semua rekabentuk kepada template asal live /card?')) {
      setConfig(DEFAULT_LIVE_STUDIO_CONFIG)
      localStorage.removeItem('cop_card_studio_config')
    }
  }

  const applyPreset = (p: typeof LIVE_PRESETS[0]) => {
    setConfig((prev) => {
      const updatedBlocks = prev.blocks.map((b) => {
        if (b.id === 'hero_header') {
          return { ...b, bgColor: p.hero1, bgColor2: p.hero2 }
        }
        if (b.id === 'stamp_card_box') {
          return { ...b, bgColor: p.stampBg, borderColor: p.stampBorder }
        }
        if (b.id === 'progress_bar') {
          return { ...b, bgColor: p.progressTrack, textColor: p.progressFill1, bgColor2: p.progressFill2 }
        }
        return b
      })

      return {
        ...prev,
        templateName: p.name,
        pageBgColor: p.pageBg,
        pageDotColor: p.pageDot,
        primaryAccent: p.hero1,
        secondaryAccent: p.hero2,
        blocks: updatedBlocks,
      }
    })
  }

  const updateBlock = (id: EditableBlockId, patch: Partial<EditableBlockConfig>) => {
    setConfig({
      ...config,
      blocks: config.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    })
  }

  const getBlock = (id: EditableBlockId): EditableBlockConfig => {
    return config.blocks.find((b) => b.id === id) || DEFAULT_4_BLOCKS.find((b) => b.id === id)!
  }

  const heroBlock = getBlock('hero_header')
  const profileBlock = getBlock('store_profile')
  const cardBoxBlock = getBlock('stamp_card_box')
  const progressBlock = getBlock('progress_bar')

  const totalStamps = config.simulatedStamps
  const reqStamps = config.stampsRequired
  const isFull = totalStamps >= reqStamps
  const remainStamps = Math.max(0, reqStamps - totalStamps)
  const percentFill = Math.min(100, Math.round((totalStamps / reqStamps) * 100))

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col font-sans">
      {/* HEADER */}
      <header className="h-16 border-b border-gray-800 bg-[#1F2937]/90 backdrop-blur px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition"
            title="Kembali ke Dashboard"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-amber-400">Card Studio</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                4 BLOK EDITOR
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Hero Header • Profile Kedai • Kotak Kad Cop • Bar Kemajuan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-bold animate-pulse hidden sm:inline">
              ✓ Draf Disimpan!
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition cursor-pointer"
          >
            Reset Asal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition cursor-pointer shadow-md"
          >
            💾 Simpan Draf
          </button>
          <Link
            href="/card-preview"
            target="_blank"
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition flex items-center gap-1.5 shadow-md"
          >
            <span>Live Preview</span>
            <span>↗</span>
          </Link>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANEL: 4 CORE BLOCKS */}
        <aside className="w-full lg:w-[480px] xl:w-[500px] bg-[#111827] border-r border-gray-800 flex flex-col shrink-0 h-full overflow-hidden">
          {/* NAVIGATION TABS */}
          <div className="p-3 border-b border-gray-800 flex items-center gap-1.5 bg-[#1F2937]/50 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'blocks'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>🧱 4 Blok Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>🎨 Pilihan Tema</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('simulate')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'simulate'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>🧪 Uji Cop</span>
            </button>
          </div>

          {/* TAB BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {activeTab === 'blocks' && (
              <div className="space-y-3">
                <div className="bg-[#1F2937] p-3 rounded-xl border border-gray-800 text-xs text-gray-300">
                  💡 <b className="text-amber-400">4 Bahagian Utama:</b> Ubah warna, gaya, logo, nama dan lengkungan bagi 4 blok utama ini. Komponen lain kekal mengikut format live rasmi.
                </div>

                {/* 1. HERO HEADER */}
                <div
                  className={`rounded-2xl border transition-all ${
                    expandedBlockId === 'hero_header'
                      ? 'bg-[#1F2937] border-amber-500/80 shadow-lg ring-1 ring-amber-500/20'
                      : 'bg-[#1F2937]/70 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedBlockId(expandedBlockId === 'hero_header' ? null : 'hero_header')}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer font-bold text-xs sm:text-sm text-gray-200 hover:text-amber-400"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">👑</span>
                      <div>
                        <div className="font-bold">1. Hero Header Banner</div>
                        <div className="text-[11px] font-normal text-gray-400">Warna gradient & lengkungan banner atas</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{expandedBlockId === 'hero_header' ? '▲' : '▼'}</span>
                  </button>

                  {expandedBlockId === 'hero_header' && (
                    <div className="p-4 border-t border-gray-800/80 bg-black/20 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Warna Gradient 1</label>
                          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={heroBlock.bgColor}
                              onChange={(e) => updateBlock('hero_header', { bgColor: e.target.value })}
                              className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={heroBlock.bgColor}
                              onChange={(e) => updateBlock('hero_header', { bgColor: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-[11px] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Warna Gradient 2</label>
                          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={heroBlock.bgColor2 || '#FFC24D'}
                              onChange={(e) => updateBlock('hero_header', { bgColor2: e.target.value })}
                              className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={heroBlock.bgColor2 || '#FFC24D'}
                              onChange={(e) => updateBlock('hero_header', { bgColor2: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-[11px] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-gray-400 font-semibold mb-1">
                            <span>Lengkungan Bawah</span>
                            <span className="text-amber-400 font-mono">{heroBlock.borderRadius}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={heroBlock.borderRadius}
                            onChange={(e) => updateBlock('hero_header', { borderRadius: Number(e.target.value) })}
                            className="w-full accent-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Gaya Bayang (Shadow)</label>
                          <select
                            value={heroBlock.shadowStyle}
                            onChange={(e) => updateBlock('hero_header', { shadowStyle: e.target.value as any })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="glow">Bercahaya (Glow)</option>
                            <option value="soft">Lembut (Soft)</option>
                            <option value="none">Tiada Bayang</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. PROFILE KEDAI */}
                <div
                  className={`rounded-2xl border transition-all ${
                    expandedBlockId === 'store_profile'
                      ? 'bg-[#1F2937] border-amber-500/80 shadow-lg ring-1 ring-amber-500/20'
                      : 'bg-[#1F2937]/70 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedBlockId(expandedBlockId === 'store_profile' ? null : 'store_profile')}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer font-bold text-xs sm:text-sm text-gray-200 hover:text-amber-400"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🏪</span>
                      <div>
                        <div className="font-bold">2. Profile Kedai</div>
                        <div className="text-[11px] font-normal text-gray-400">Logo kedai, nama kedai & warna teks</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{expandedBlockId === 'store_profile' ? '▲' : '▼'}</span>
                  </button>

                  {expandedBlockId === 'store_profile' && (
                    <div className="p-4 border-t border-gray-800/80 bg-black/20 space-y-3 text-xs">
                      <div>
                        <label className="block text-gray-400 font-semibold mb-1">Nama Kedai</label>
                        <input
                          type="text"
                          value={config.storeName}
                          onChange={(e) => {
                            setConfig({ ...config, storeName: e.target.value })
                            updateBlock('store_profile', { title: e.target.value })
                          }}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                          placeholder="Nama Kedai Anda..."
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 font-semibold mb-1">URL Logo / Gambar Profil</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={profileBlock.imageUrl}
                            onChange={(e) => updateBlock('store_profile', { imageUrl: e.target.value })}
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                            placeholder="/mascot.png"
                          />
                          {profileBlock.imageUrl && (
                            <div className="w-9 h-9 rounded-xl bg-white p-1 border border-gray-700 flex items-center justify-center shrink-0">
                              <img src={profileBlock.imageUrl} alt="preview" className="w-full h-full object-contain" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-400 font-semibold mb-1">Warna Teks Nama Kedai</label>
                        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={profileBlock.textColor}
                            onChange={(e) => updateBlock('store_profile', { textColor: e.target.value })}
                            className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={profileBlock.textColor}
                            onChange={(e) => updateBlock('store_profile', { textColor: e.target.value })}
                            className="w-full bg-transparent text-white font-mono text-[11px] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. KOTAK KAD COP */}
                <div
                  className={`rounded-2xl border transition-all ${
                    expandedBlockId === 'stamp_card_box'
                      ? 'bg-[#1F2937] border-amber-500/80 shadow-lg ring-1 ring-amber-500/20'
                      : 'bg-[#1F2937]/70 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedBlockId(expandedBlockId === 'stamp_card_box' ? null : 'stamp_card_box')}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer font-bold text-xs sm:text-sm text-gray-200 hover:text-amber-400"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🃏</span>
                      <div>
                        <div className="font-bold">3. Kotak Kad Cop</div>
                        <div className="text-[11px] font-normal text-gray-400">Warna kad, bingkai border & lengkungan kad</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{expandedBlockId === 'stamp_card_box' ? '▲' : '▼'}</span>
                  </button>

                  {expandedBlockId === 'stamp_card_box' && (
                    <div className="p-4 border-t border-gray-800/80 bg-black/20 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Warna Latar Kad</label>
                          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={cardBoxBlock.bgColor}
                              onChange={(e) => updateBlock('stamp_card_box', { bgColor: e.target.value })}
                              className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={cardBoxBlock.bgColor}
                              onChange={(e) => updateBlock('stamp_card_box', { bgColor: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-[11px] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Warna Border Kad</label>
                          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={cardBoxBlock.borderColor}
                              onChange={(e) => updateBlock('stamp_card_box', { borderColor: e.target.value })}
                              className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={cardBoxBlock.borderColor}
                              onChange={(e) => updateBlock('stamp_card_box', { borderColor: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-[11px] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-gray-400 font-semibold mb-1">
                            <span>Lengkungan Kad</span>
                            <span className="text-amber-400 font-mono">{cardBoxBlock.borderRadius}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="40"
                            value={cardBoxBlock.borderRadius}
                            onChange={(e) => updateBlock('stamp_card_box', { borderRadius: Number(e.target.value) })}
                            className="w-full accent-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Gaya Bayang (Shadow)</label>
                          <select
                            value={cardBoxBlock.shadowStyle}
                            onChange={(e) => updateBlock('stamp_card_box', { shadowStyle: e.target.value as any })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="soft">Lembut (Soft)</option>
                            <option value="glow">Bercahaya (Glow)</option>
                            <option value="none">Tiada Bayang</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. BAR KEMAJUAN */}
                <div
                  className={`rounded-2xl border transition-all ${
                    expandedBlockId === 'progress_bar'
                      ? 'bg-[#1F2937] border-amber-500/80 shadow-lg ring-1 ring-amber-500/20'
                      : 'bg-[#1F2937]/70 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedBlockId(expandedBlockId === 'progress_bar' ? null : 'progress_bar')}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer font-bold text-xs sm:text-sm text-gray-200 hover:text-amber-400"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">📊</span>
                      <div>
                        <div className="font-bold">4. Bar Kemajuan</div>
                        <div className="text-[11px] font-normal text-gray-400">Warna trek & gradient meter pengisian cop</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{expandedBlockId === 'progress_bar' ? '▲' : '▼'}</span>
                  </button>

                  {expandedBlockId === 'progress_bar' && (
                    <div className="p-4 border-t border-gray-800/80 bg-black/20 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Warna Trek Dasar</label>
                          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={progressBlock.bgColor}
                              onChange={(e) => updateBlock('progress_bar', { bgColor: e.target.value })}
                              className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={progressBlock.bgColor}
                              onChange={(e) => updateBlock('progress_bar', { bgColor: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-[11px] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Warna Fill 1 (Mula)</label>
                          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={progressBlock.textColor}
                              onChange={(e) => updateBlock('progress_bar', { textColor: e.target.value })}
                              className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={progressBlock.textColor}
                              onChange={(e) => updateBlock('progress_bar', { textColor: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-[11px] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-400 font-semibold mb-1">Warna Fill 2 (Hujung Gradient)</label>
                        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={progressBlock.bgColor2 || '#FFB238'}
                            onChange={(e) => updateBlock('progress_bar', { bgColor2: e.target.value })}
                            className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={progressBlock.bgColor2 || '#FFB238'}
                            onChange={(e) => updateBlock('progress_bar', { bgColor2: e.target.value })}
                            className="w-full bg-transparent text-white font-mono text-[11px] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: SETTINGS & PRESETS */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="bg-[#1F2937] p-4 rounded-2xl border border-gray-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                    🎨 Pilihan Tema Siap Pakai (Presets)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {LIVE_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="p-3 rounded-xl border border-gray-700 hover:border-amber-500 text-left transition flex flex-col gap-1.5 bg-gray-900/60 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full" style={{ background: p.hero1 }} />
                          <div className="w-4 h-4 rounded-full" style={{ background: p.hero2 }} />
                          <div className="w-4 h-4 rounded-full" style={{ background: p.pageBg }} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-200">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1F2937] p-4 rounded-2xl border border-gray-800 space-y-3.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                    🌍 Latar Belakang Skrin
                  </h3>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-1">
                      Warna Background Body
                    </label>
                    <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5">
                      <input
                        type="color"
                        value={config.pageBgColor}
                        onChange={(e) => setConfig({ ...config, pageBgColor: e.target.value })}
                        className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={config.pageBgColor}
                        onChange={(e) => setConfig({ ...config, pageBgColor: e.target.value })}
                        className="w-full bg-transparent text-white font-mono text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-1">
                      Nama Hadiah Ganjaran
                    </label>
                    <input
                      type="text"
                      value={config.rewardDesc}
                      onChange={(e) => setConfig({ ...config, rewardDesc: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SIMULATE */}
            {activeTab === 'simulate' && (
              <div className="bg-[#1F2937] p-4 rounded-2xl border border-gray-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  🧪 Simulator Interaktif Cop
                </h3>
                <div>
                  <div className="flex justify-between text-xs text-gray-300 font-semibold mb-1.5">
                    <span>Jumlah Cop Semasa:</span>
                    <span className="text-amber-400 font-bold font-mono text-sm">
                      {config.simulatedStamps} / {config.stampsRequired} Cop
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={config.stampsRequired}
                    value={config.simulatedStamps}
                    onChange={(e) =>
                      setConfig({ ...config, simulatedStamps: Number(e.target.value) })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1.5">
                    Sasaran Cop Diperlukan:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 8, 10, 12].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            stampsRequired: num,
                            simulatedStamps: Math.min(config.simulatedStamps, num),
                          })
                        }
                        className={`py-2 text-xs font-bold rounded-xl border transition ${
                          config.stampsRequired === num
                            ? 'bg-amber-500 text-black border-amber-400'
                            : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {num} Cop
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-xs space-y-1 text-gray-300">
                  <div>Status: <b>{isFull ? '🎉 KAD PENUH' : '⚡ SEDANG DIISI'}</b></div>
                  <div>Baki: <b>{remainStamps} cop</b> lagi untuk ganjaran.</div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PANEL: LIVE EXACT PHONE MOCKUP */}
        <main className="flex-1 bg-[#0B0F19] p-4 sm:p-6 lg:p-8 flex items-center justify-center overflow-y-auto">
          <div
            className="w-full max-w-[420px] rounded-[44px] shadow-2xl overflow-hidden border-[10px] border-[#2A2E39] relative flex flex-col"
            style={{
              backgroundColor: config.pageBgColor,
              backgroundImage: `radial-gradient(circle at 1px 1px, ${config.pageDotColor} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              minHeight: '740px',
            }}
          >
            {/* ISLAND / NOTCH */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#2A2E39] rounded-full z-40" />

            {/* LIVE CARD CONTENT */}
            <div className="w-full flex-1 flex flex-col font-jakarta pb-6">
              {/* 1. HERO HEADER */}
              <div
                className="relative overflow-hidden pt-7 px-4 pb-6 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${heroBlock.bgColor} 0%, ${heroBlock.bgColor2 || config.secondaryAccent} 100%)`,
                  borderRadius: `0 0 ${heroBlock.borderRadius}px ${heroBlock.borderRadius}px`,
                  boxShadow: heroBlock.shadowStyle === 'glow' ? `0 20px 36px -14px ${heroBlock.bgColor}77` : 'none',
                }}
              >
                <div className="absolute w-[180px] h-[180px] rounded-full bg-white/15 -top-20 -right-12 pointer-events-none" />
                <div className="absolute w-[120px] h-[120px] rounded-full bg-white/10 -bottom-16 -left-10 pointer-events-none" />

                {/* TOPBAR (FIXED LIVE) */}
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5 bg-white/20 border border-white/30 rounded-full p-0.5 backdrop-blur-xs">
                    <button
                      type="button"
                      onClick={() => setActiveLang('my')}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${
                        activeLang === 'my' ? 'bg-white text-[#FF5A45]' : 'text-white/80'
                      }`}
                    >
                      MY
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLang('en')}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${
                        activeLang === 'en' ? 'bg-white text-[#FF5A45]' : 'text-white/80'
                      }`}
                    >
                      EN
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveModal('qr')}
                      className="w-8 h-8 rounded-full bg-white/20 border border-white/30 text-amber-200 flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
                      title="Kod QR Pelanggan"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                        <rect x="3" y="3" width="7" height="7" rx="1.2" />
                        <rect x="14" y="3" width="7" height="7" rx="1.2" />
                        <rect x="3" y="14" width="7" height="7" rx="1.2" />
                        <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveModal('locations')}
                      className="w-8 h-8 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
                      title="Lokasi Cawangan"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => alert('Simulator: Halaman diperbaharui')}
                      className="w-8 h-8 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
                      title="Segarkan data"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* 2. STORE PROFILE (CUSTOMIZED) */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow-lg border-[3px] border-white/60 mb-2 overflow-hidden flex items-center justify-center shrink-0">
                    {profileBlock.imageUrl ? (
                      <img
                        src={profileBlock.imageUrl}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src="/logo.svg" alt="LajuS" className="w-8 h-8 object-contain" />
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1.5">
                    <span
                      className="font-serif font-bold text-lg leading-tight"
                      style={{ color: profileBlock.textColor }}
                    >
                      {config.storeName}
                    </span>
                    <img
                      src="/green-checkmark-line-icon.svg"
                      alt="Verified"
                      className="w-4 h-4 object-contain shrink-0"
                    />
                  </div>
                </div>

                {/* SOCIAL LINKS (FIXED LIVE) */}
                <div className="relative z-10 flex items-center justify-center gap-1.5 mt-2.5">
                  {['whatsapp', 'instagram', 'tiktok', 'facebook'].map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => alert(`Buka pautan ${plat}`)}
                      className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition cursor-pointer"
                    >
                      {renderLiveSocialIcon(plat)}
                    </button>
                  ))}
                </div>

                {/* ACTION PILLS (FIXED LIVE) */}
                <div className="relative z-10 flex items-center justify-center gap-2 mt-3.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveModal('google_review')}
                    className="bg-white hover:bg-amber-50 text-[#1B0F09] font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-sm border border-[#F0DEC0] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <img src="/Google-Review.svg" alt="Review" className="w-3.5 h-3.5 object-contain" />
                    <span>Review</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('how_to_redeem')}
                    className="bg-white hover:bg-amber-50 text-[#1B0F09] font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-sm border border-[#F0DEC0] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-[#FF5A45]">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span>Cara Tebus</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('rewards')}
                    className="bg-white hover:bg-amber-50 text-[#1B0F09] font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-sm border border-[#F0DEC0] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3 h-3 text-[#FF5A45]">
                      <polyline points="20 12 20 22 4 22 4 12" />
                      <rect x="2" y="7" width="20" height="5" />
                      <line x1="12" y1="22" x2="12" y2="7" />
                    </svg>
                    <span>Ganjaran</span>
                  </button>
                </div>
              </div>

              {/* BODY: 3. KOTAK KAD COP & 4. BAR KEMAJUAN */}
              <div className="px-4 pt-3.5 space-y-3">
                {/* MULTI-STORE TABS (FIXED LIVE) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    className="bg-[#FF5A45] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs shrink-0 flex items-center gap-1"
                  >
                    <span>{config.storeName}</span>
                    <span className="bg-white/30 text-white text-[9px] px-1.5 py-0.2 rounded-full">
                      {totalStamps} cop
                    </span>
                  </button>
                  <button
                    type="button"
                    className="bg-[#FFFDF8] text-[#96806B] border border-[#F0DEC0] text-[11px] font-bold px-3 py-1 rounded-full shrink-0 flex items-center gap-1"
                  >
                    <span>Cawangan Bangi</span>
                    <span className="bg-[#FF5A45]/15 text-[#FF5A45] text-[9px] px-1.5 py-0.2 rounded-full">
                      2 cop
                    </span>
                  </button>
                </div>

                {/* 3. STAMP CARD BOX (CUSTOMIZED) */}
                <div
                  className="p-5 text-[#2B1B12] transition-all"
                  style={{
                    backgroundColor: cardBoxBlock.bgColor,
                    borderColor: cardBoxBlock.borderColor,
                    borderRadius: `${cardBoxBlock.borderRadius}px`,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    boxShadow: cardBoxBlock.shadowStyle === 'glow' ? `0 8px 24px ${cardBoxBlock.borderColor}88` : '0 8px 24px rgba(43,27,18,0.06)',
                  }}
                >
                  {/* HEAD (FIXED LIVE) */}
                  <div className="text-center mb-1">
                    <div className="text-[10.5px] font-extrabold uppercase tracking-wider mb-0.5 text-[#1C7A67]">
                      {isFull
                        ? activeLang === 'en'
                          ? 'CARD 1 • FULL'
                          : 'KAD 1 • PENUH'
                        : activeLang === 'en'
                        ? 'CARD 1 • IN PROGRESS'
                        : 'KAD 1 • SEDANG DIISI'}
                    </div>
                    <div className="font-serif font-bold text-3xl leading-none text-[#FF5A45]">
                      {totalStamps} <small className="text-sm font-normal text-[#96806B]">/ {reqStamps}</small>
                    </div>
                  </div>

                  {/* PERFORATION (FIXED LIVE) */}
                  <div className="flex items-center justify-center gap-1.5 my-3 opacity-60">
                    {Array.from({ length: 15 }).map((_, pIdx) => (
                      <span key={pIdx} className="w-1 h-1 rounded-full bg-[#F0DEC0]" />
                    ))}
                  </div>

                  {/* STAMP GRID 5-COLUMNS (FIXED LIVE) */}
                  <div className="grid grid-cols-5 gap-2 my-3">
                    {Array.from({ length: reqStamps }).map((_, sIdx) => {
                      const slotNum = sIdx + 1
                      const isStampFilled = slotNum <= totalStamps

                      return (
                        <button
                          key={slotNum}
                          type="button"
                          onClick={() => {
                            setSelectedStampSlot(slotNum)
                            setActiveModal('stamp_detail')
                          }}
                          className={`aspect-square rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer ${
                            isStampFilled
                              ? 'bg-gradient-to-br from-[#FF5A45] to-[#E23F2E] shadow-md'
                              : 'border-2 border-dashed border-[#F0DEC0] bg-[#FFB238]/10 text-[#D8B98C]'
                          }`}
                          title={`Cop #${slotNum}`}
                        >
                          {isStampFilled ? (
                            <img
                              src="/icons/stamps/makanan.svg"
                              alt="Cop"
                              className="w-[52%] h-[52%] object-contain"
                              style={{ filter: 'brightness(0) invert(1)' }}
                            />
                          ) : (
                            <span className="font-bold text-xs">{slotNum}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* 4. PROGRESS BAR (CUSTOMIZED) */}
                  <div
                    className="h-2 rounded-full overflow-hidden my-3"
                    style={{ backgroundColor: progressBlock.bgColor }}
                  >
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${percentFill}%`,
                        background: `linear-gradient(90deg, ${progressBlock.textColor}, ${progressBlock.bgColor2 || '#FFB238'})`,
                      }}
                    />
                  </div>

                  {/* STATUS TEXT (FIXED LIVE) */}
                  <div className="text-center font-bold text-xs leading-snug my-2 text-[#0F5C4C]">
                    {isFull ? (
                      <span>🎉 Lengkap! Tebus ganjaran sekarang: <b>{config.rewardDesc}</b></span>
                    ) : (
                      <span>
                        Lagi <b className="text-[#E23F2E]">{remainStamps}</b> cop untuk: {config.rewardDesc}
                      </span>
                    )}
                  </div>

                  {/* CARD DOTS (FIXED LIVE) */}
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <span className="w-5 h-2 rounded-full bg-[#FF5A45]" />
                    <span className="w-2 h-2 rounded-full bg-[#F0DEC0]" />
                  </div>
                </div>

                {/* TIMESTAMP (FIXED LIVE) */}
                <div className="text-center font-semibold text-[10px] text-[#96806B]">
                  Kemas kini: 8:45 PM, Hari Ini
                </div>

                {/* FOOTER (FIXED LIVE) */}
                <div className="text-center pt-2 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 font-extrabold text-xs text-[#2B1B12]">
                    <img src="/logo.svg" alt="LajuS" className="w-3.5 h-3.5 object-contain" />
                    <span>LajuS</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-[#96806B]">
                    <a href="#privacy" className="underline">Dasar Privasi</a>
                    <span>•</span>
                    <a href="#delete" className="underline text-red-500">Padam Akaun</a>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE MODALS (SAME AS PRODUCTION) */}
            {activeModal !== 'none' && (
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
                onClick={() => setActiveModal('none')}
              >
                {activeModal === 'how_to_redeem' && (
                  <div
                    className="w-full bg-[#FFFDF8] text-[#2B1B12] rounded-3xl p-5 border border-[#F0DEC0] shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/5 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      &times;
                    </button>
                    <div className="flex items-center gap-2 mb-2 font-serif font-bold text-lg text-[#1B0F09]">
                      <span>💡</span>
                      <span>Cara Mengumpul & Tebus</span>
                    </div>
                    <p className="text-xs text-[#96806B] mb-3">Ikuti 3 langkah mudah ini:</p>
                    <div className="space-y-2 text-xs text-[#3C2E24]">
                      <div className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#FFB238] text-black font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                        <span>Kumpul cop setiap kali pembelian di kaunter kedai.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#FFB238] text-black font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                        <span>Bila kad penuh ({reqStamps}/{reqStamps}), tunjukkan skrin ini kepada kakitangan.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#FFB238] text-black font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                        <span>Kakitangan sahkan dan serahkan ganjaran percuma anda serta-merta!</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="w-full mt-4 py-2.5 rounded-xl bg-[#1C7A67] text-white font-bold text-xs cursor-pointer"
                    >
                      Faham & Tutup
                    </button>
                  </div>
                )}

                {activeModal === 'rewards' && (
                  <div
                    className="w-full bg-[#FFFDF8] text-[#2B1B12] rounded-3xl overflow-hidden border border-[#F0DEC0] shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur text-gray-700 flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm"
                    >
                      &times;
                    </button>
                    <div className="h-44 bg-[#FFF7EA] flex items-center justify-center relative border-b border-[#F0DEC0]">
                      <span className="text-5xl">🎁</span>
                      <div className="absolute top-3 left-3 bg-[#FF5A45] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        Perlu {reqStamps} Cop
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h4 className="font-serif font-bold text-base text-[#1B0F09] mb-1">
                        {config.rewardDesc}
                      </h4>
                      <p className="text-xs text-[#96806B] mb-3">
                        Tebus ganjaran istimewa ini sebaik sahaja kad anda mencukupi {reqStamps} cop penuh!
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveModal('none')}
                        className="w-full py-2.5 rounded-xl bg-[#1C7A67] text-white font-bold text-xs cursor-pointer"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                )}

                {activeModal === 'google_review' && (
                  <div
                    className="w-full bg-[#FFFDF8] text-[#2B1B12] rounded-3xl p-5 border border-[#F0DEC0] shadow-2xl text-center relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/5 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      &times;
                    </button>
                    <div className="font-serif font-bold text-base text-[#1B0F09] mb-1">
                      ⭐ Nilai {config.storeName} di Google
                    </div>
                    <p className="text-xs text-[#96806B] mb-3">
                      Sentuh bintang untuk bantu beri ulasan bagi kedai ini.
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-2xl my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setReviewRating(star)
                            setTimeout(() => {
                              alert(`Membuka Google Review bagi rating ${star} Bintang!`)
                              setActiveModal('none')
                            }, 400)
                          }}
                          className={`cursor-pointer transition-transform hover:scale-125 ${
                            reviewRating >= star ? 'text-amber-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <div className="text-[11px] text-[#96806B] mt-2 mb-3">
                      {reviewRating > 0 ? `Rating ${reviewRating} bintang dipilih!` : '5 bintang amat kami hargai!'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="w-full py-2 rounded-xl bg-white border border-[#F0DEC0] text-[#5A4B3D] font-bold text-xs cursor-pointer"
                    >
                      Mungkin Nanti
                    </button>
                  </div>
                )}

                {activeModal === 'locations' && (
                  <div
                    className="w-full bg-[#FFFDF8] text-[#2B1B12] rounded-3xl p-5 border border-[#F0DEC0] shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/5 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      &times;
                    </button>
                    <div className="flex items-center gap-2 mb-1 font-serif font-bold text-base text-[#1B0F09]">
                      <span>📍</span>
                      <span>Lokasi Cawangan</span>
                    </div>
                    <p className="text-xs text-[#96806B] mb-3">{config.storeName}</p>
                    <div className="bg-white p-3 rounded-2xl border border-[#F0DEC0] text-xs space-y-1 mb-3">
                      <div className="font-bold text-[#1B0F09]">Cawangan Utama</div>
                      <div className="text-gray-600">No. 12, Jalan Niaga 3, 43650 Bandar Baru Bangi, Selangor</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('Membuka Peta Google Maps')}
                      className="w-full py-2.5 rounded-xl bg-[#1C7A67] text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Buka di Google Maps</span>
                      <span>↗</span>
                    </button>
                  </div>
                )}

                {activeModal === 'qr' && (
                  <div
                    className="w-full bg-[#FFFDF8] text-[#2B1B12] rounded-3xl p-5 border border-[#F0DEC0] shadow-2xl text-center relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/5 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      &times;
                    </button>
                    <div className="font-serif font-bold text-base text-[#1B0F09] mb-1">
                      📱 Kod QR Pelanggan
                    </div>
                    <p className="text-xs text-[#96806B] mb-3">
                      Tunjukkan kod QR ini kepada staf kedai untuk mengimbas cop.
                    </p>
                    <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl border border-[#F0DEC0] flex items-center justify-center shadow-inner mb-3">
                      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-white text-[10px] font-mono">
                        [QR DEMO]
                      </div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold py-1.5 px-3 rounded-xl mb-3">
                      pelanggan@gmail.com
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="w-full py-2 rounded-xl bg-[#1C7A67] text-white font-bold text-xs cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                )}

                {activeModal === 'stamp_detail' && (
                  <div
                    className="w-full bg-[#FFFDF8] text-[#2B1B12] rounded-3xl p-5 border border-[#F0DEC0] shadow-2xl text-center relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/5 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      &times;
                    </button>
                    <div
                      className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center shadow-md"
                      style={{
                        background: selectedStampSlot <= totalStamps
                          ? 'linear-gradient(145deg, #FF5A45, #E23F2E)'
                          : '#F0DEC0',
                      }}
                    >
                      <img
                        src="/icons/stamps/makanan.svg"
                        alt="Stamp"
                        className="w-7 h-7 object-contain"
                        style={{ filter: selectedStampSlot <= totalStamps ? 'brightness(0) invert(1)' : 'none' }}
                      />
                    </div>
                    <div className="font-serif font-bold text-base text-[#1B0F09] mb-0.5">
                      Cop #{selectedStampSlot} — Kad 1
                    </div>
                    <p className="text-xs text-[#96806B] mb-3">{config.storeName}</p>
                    <div className="bg-white p-3 rounded-xl border border-[#F0DEC0] text-xs text-left space-y-1 mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <b className={selectedStampSlot <= totalStamps ? 'text-emerald-600' : 'text-gray-400'}>
                          {selectedStampSlot <= totalStamps ? '✓ Telah Ditebus' : 'Belum Ditebus'}
                        </b>
                      </div>
                      {selectedStampSlot <= totalStamps && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tarikh:</span>
                          <b>Hari Ini, 8:45 PM</b>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="w-full py-2 rounded-xl bg-[#1C7A67] text-white font-bold text-xs cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
