'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

// Types for Card Custom Template Sandbox
export interface BlockConfig {
  id: 'header' | 'banner' | 'card' | 'rewards' | 'instructions' | 'google_review' | 'locations' | 'socials'
  title: string
  visible: boolean
}

export interface CardThemeConfig {
  templateName: string
  // Color palette
  pageBgColor: string
  pagePattern: 'dots' | 'grid' | 'clean' | 'mesh'
  cardBgColor: string
  cardBorderColor: string
  primaryColor: string
  textColor: string
  mutedTextColor: string
  borderRadius: number // e.g. 24
  
  // Store info
  storeName: string
  storeTagline: string
  logoUrl: string
  
  // Promo banner block
  bannerUrl: string
  bannerTitle: string
  bannerSubtitle: string
  
  // Stamp card configuration
  stampsRequired: number
  stampIcon: string
  simulatedStamps: number
  rewardDescription: string
  
  // Google review
  googleReviewEnabled: boolean
  googleReviewUrl: string
  
  // Blocks ordering
  blocks: BlockConfig[]
  
  // Sample rewards
  rewards: Array<{ id: string; name: string; stampsRequired: number; desc: string }>
  
  // Sample locations
  locations: Array<{ name: string; address: string; mapUrl: string }>
  
  // Sample socials
  socials: Array<{ platform: string; url: string }>
}

const DEFAULT_THEME_CONFIG: CardThemeConfig = {
  templateName: 'Tema Hangat (Warm Cream)',
  pageBgColor: '#FFF7EA',
  pagePattern: 'dots',
  cardBgColor: '#FFFDF8',
  cardBorderColor: '#F0DEC0',
  primaryColor: '#FF7A45',
  textColor: '#2B1B12',
  mutedTextColor: '#96806B',
  borderRadius: 24,
  
  storeName: 'Diana Bakery & Cafe',
  storeTagline: 'Pastri Segar & Kopi Premium Setiap Hari',
  logoUrl: '/mascot.png',
  
  bannerUrl: '',
  bannerTitle: 'Promosi Hujung Minggu!',
  bannerSubtitle: 'Dapatkan 2x cop untuk setiap pembelian kopi & croissant.',
  
  stampsRequired: 10,
  stampIcon: '/icons/stamps/pastri.svg',
  simulatedStamps: 4,
  rewardDescription: '1 Minuman Panas Percuma + 1 Pastri Pilihan',
  
  googleReviewEnabled: true,
  googleReviewUrl: 'https://maps.google.com',
  
  blocks: [
    { id: 'header', title: 'Header & Logo Kedai', visible: true },
    { id: 'banner', title: 'Banner Promosi', visible: false },
    { id: 'card', title: 'Kad Cop Utama', visible: true },
    { id: 'rewards', title: 'Katalog Ganjaran & Hadiah', visible: true },
    { id: 'google_review', title: 'Butang Google Review (5-Bintang)', visible: true },
    { id: 'instructions', title: 'Panduan & Cara Tebus', visible: true },
    { id: 'locations', title: 'Lokasi Cawangan Kedai', visible: true },
    { id: 'socials', title: 'Pautan Media Sosial', visible: true },
  ],
  
  rewards: [
    { id: '1', name: '1 Kopi Panas Percuma', stampsRequired: 5, desc: 'Pilihan Americano atau Latte saiz regular' },
    { id: '2', name: '1 Set Pastri & Kopi', stampsRequired: 10, desc: '1 Croissant mentega + 1 Kopi sejuk pilihan' },
  ],
  
  locations: [
    { name: 'Cawangan Utama Bangi', address: 'No 12, Jalan Medan Pusat Bandar 1, Bangi', mapUrl: 'https://maps.google.com' },
    { name: 'Cawangan Putrajaya IOI', address: 'LG-22, IOI City Mall, Putrajaya', mapUrl: 'https://maps.google.com' },
  ],
  
  socials: [
    { platform: 'Instagram', url: 'https://instagram.com' },
    { platform: 'TikTok', url: 'https://tiktok.com' },
    { platform: 'WhatsApp', url: 'https://whatsapp.com' },
  ]
}

const PRESET_THEMES: Array<{ name: string; config: Partial<CardThemeConfig> }> = [
  {
    name: '🥐 Warm Cream (Klasik)',
    config: {
      templateName: 'Warm Cream (Klasik)',
      pageBgColor: '#FFF7EA',
      pagePattern: 'dots',
      cardBgColor: '#FFFDF8',
      cardBorderColor: '#F0DEC0',
      primaryColor: '#FF7A45',
      textColor: '#2B1B12',
      mutedTextColor: '#96806B',
      borderRadius: 24,
      stampIcon: '/icons/stamps/pastri.svg',
    },
  },
  {
    name: '☕ Dark Espresso & Gold',
    config: {
      templateName: 'Dark Espresso & Gold',
      pageBgColor: '#120D0A',
      pagePattern: 'grid',
      cardBgColor: '#1C1512',
      cardBorderColor: '#3A2C24',
      primaryColor: '#E5A43B',
      textColor: '#FDFBF7',
      mutedTextColor: '#A8998C',
      borderRadius: 20,
      stampIcon: '/icons/stamps/coffee.svg',
    },
  },
  {
    name: '🌸 Sakura & Dessert Pink',
    config: {
      templateName: 'Sakura & Dessert Pink',
      pageBgColor: '#FFF0F5',
      pagePattern: 'dots',
      cardBgColor: '#FFFFFF',
      cardBorderColor: '#FBCFE8',
      primaryColor: '#E11D48',
      textColor: '#4C0519',
      mutedTextColor: '#9D174D',
      borderRadius: 28,
      stampIcon: '/icons/stamps/kek.svg',
    },
  },
  {
    name: '🍵 Matcha Eco Green',
    config: {
      templateName: 'Matcha Eco Green',
      pageBgColor: '#F2F8F5',
      pagePattern: 'clean',
      cardBgColor: '#FFFFFF',
      cardBorderColor: '#C6E7D9',
      primaryColor: '#166534',
      textColor: '#052E16',
      mutedTextColor: '#15803D',
      borderRadius: 22,
      stampIcon: '/icons/stamps/makanan.svg',
    },
  },
  {
    name: '💈 Vintage Barber Classic',
    config: {
      templateName: 'Vintage Barber Classic',
      pageBgColor: '#0F172A',
      pagePattern: 'grid',
      cardBgColor: '#1E293B',
      cardBorderColor: '#334155',
      primaryColor: '#38BDF8',
      textColor: '#F8FAFC',
      mutedTextColor: '#94A3B8',
      borderRadius: 16,
      stampIcon: '/icons/stamps/barber.svg',
    },
  },
]

const STAMP_ICONS = [
  { label: 'Pastri / Bakeri', path: '/icons/stamps/pastri.svg' },
  { label: 'Makanan / Kafe', path: '/icons/stamps/makanan.svg' },
  { label: 'Kopi / Minuman', path: '/icons/stamps/coffee.svg' },
  { label: 'Kek / Dessert', path: '/icons/stamps/kek.svg' },
  { label: 'Pizza / Fast Food', path: '/icons/stamps/pizza.svg' },
  { label: 'Barber / Salun', path: '/icons/stamps/barber.svg' },
  { label: 'Car Wash / Dobi', path: '/icons/stamps/car-wash.svg' },
  { label: 'Spa / Urutan', path: '/icons/stamps/spa.svg' },
  { label: 'Retail / Butik', path: '/icons/stamps/retail.svg' },
  { label: 'Pet Shop', path: '/icons/stamps/pet-shop.svg' },
  { label: 'Servis / Cleaning', path: '/icons/stamps/servis.svg' },
]

export default function CardStudioPage() {
  const [config, setConfig] = useState<CardThemeConfig>(DEFAULT_THEME_CONFIG)
  const [activeTab, setActiveTab] = useState<'theme' | 'card' | 'blocks' | 'export'>('theme')
  const [copiedJson, setCopiedJson] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [mobileViewTab, setMobileViewTab] = useState<'controls' | 'preview'>('controls')

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cop_card_studio_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          setConfig((prev) => ({ ...prev, ...parsed }))
        }
      }
    } catch {}
  }, [])

  // Auto-save to LocalStorage
  const handleSaveToLocalStorage = () => {
    try {
      localStorage.setItem('cop_card_studio_config', JSON.stringify(config))
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
    }
  }

  const handleApplyPreset = (preset: Partial<CardThemeConfig>) => {
    setConfig((prev) => ({ ...prev, ...preset }))
  }

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= config.blocks.length) return
    const newBlocks = [...config.blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[targetIdx]
    newBlocks[targetIdx] = temp
    setConfig((prev) => ({ ...prev, blocks: newBlocks }))
  }

  const handleToggleBlockVisibility = (index: number) => {
    const newBlocks = [...config.blocks]
    newBlocks[index].visible = !newBlocks[index].visible
    setConfig((prev) => ({ ...prev, blocks: newBlocks }))
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2500)
  }

  const handleReset = () => {
    if (confirm('Adakah anda pasti untuk reset semua tetapan editor ke lalai?')) {
      setConfig(DEFAULT_THEME_CONFIG)
      localStorage.removeItem('cop_card_studio_config')
    }
  }

  // Get background pattern CSS
  const getPatternStyle = () => {
    if (config.pagePattern === 'dots') {
      return {
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(43,27,18,0.065) 1px, transparent 1px)`,
        backgroundSize: '18px 18px',
      }
    }
    if (config.pagePattern === 'grid') {
      return {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }
    }
    if (config.pagePattern === 'mesh') {
      return {
        backgroundImage: `radial-gradient(at 0% 0%, ${config.primaryColor}18 0px, transparent 50%), radial-gradient(at 100% 100%, ${config.primaryColor}15 0px, transparent 50%)`,
      }
    }
    return {}
  }

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-[#1F2937] border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF7A45] flex items-center justify-center font-bold text-lg text-white shadow-md">
            🎨
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base leading-none text-white">
              Card Studio Sandbox (DIY Editor)
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Ubah warna, susun blok & uji paparan /card secara langsung
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile view switch button */}
          <div className="flex sm:hidden bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setMobileViewTab('controls')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                mobileViewTab === 'controls' ? 'bg-[#FF7A45] text-white' : 'text-gray-400'
              }`}
            >
              ⚙️ Kawalan
            </button>
            <button
              onClick={() => setMobileViewTab('preview')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                mobileViewTab === 'preview' ? 'bg-[#FF7A45] text-white' : 'text-gray-400'
              }`}
            >
              📱 Preview
            </button>
          </div>

          <button
            onClick={handleSaveToLocalStorage}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
          >
            {savedSuccess ? '✅ Tersimpan!' : '💾 Simpan Draf'}
          </button>

          <Link
            href="/card-preview"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF7A45] hover:bg-[#ff682e] text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
          >
            🚀 Fullscreen View ↗
          </Link>
        </div>
      </header>

      {/* Main Studio Body: 2 Columns on Desktop */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: CONTROL PANEL */}
        <div
          className={`w-full sm:w-[480px] lg:w-[540px] bg-[#1F2937] border-r border-gray-800 flex flex-col shrink-0 ${
            mobileViewTab === 'preview' ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-800 bg-[#1A2230] p-1.5 gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition text-center ${
                activeTab === 'theme' ? 'bg-[#374151] text-[#FF7A45] shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
            >
              🎨 Tema & Warna
            </button>
            <button
              onClick={() => setActiveTab('card')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition text-center ${
                activeTab === 'card' ? 'bg-[#374151] text-[#FF7A45] shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
            >
              🃏 Kad Cop
            </button>
            <button
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition text-center ${
                activeTab === 'blocks' ? 'bg-[#374151] text-[#FF7A45] shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
            >
              🧱 Susun Blok ({config.blocks.filter((b) => b.visible).length})
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition text-center ${
                activeTab === 'export' ? 'bg-[#374151] text-[#FF7A45] shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
            >
              📋 JSON Data
            </button>
          </div>

          {/* Tab Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {/* ── TAB 1: TEMA & WARNA ── */}
            {activeTab === 'theme' && (
              <div className="space-y-5">
                {/* Preset Themes */}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-2">
                    ⚡ Pilihan Tema Segera (Presets)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_THEMES.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleApplyPreset(preset.config)}
                        className="p-2.5 bg-[#111827] hover:bg-[#374151] border border-gray-700 rounded-xl text-left text-xs font-semibold text-gray-200 transition flex items-center justify-between"
                      >
                        <span>{preset.name}</span>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: preset.config.primaryColor }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-800" />

                {/* Color Pickers */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Palet Warna Kustom
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#111827] p-3 rounded-xl border border-gray-700/80">
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Latar Page (Background)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.pageBgColor}
                          onChange={(e) => setConfig({ ...config, pageBgColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={config.pageBgColor}
                          onChange={(e) => setConfig({ ...config, pageBgColor: e.target.value })}
                          className="w-full bg-[#1F2937] text-xs font-mono px-2 py-1 rounded border border-gray-600 uppercase"
                        />
                      </div>
                    </div>

                    <div className="bg-[#111827] p-3 rounded-xl border border-gray-700/80">
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Warna Utama / Aksen
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="w-full bg-[#1F2937] text-xs font-mono px-2 py-1 rounded border border-gray-600 uppercase"
                        />
                      </div>
                    </div>

                    <div className="bg-[#111827] p-3 rounded-xl border border-gray-700/80">
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Permukaan Kad (Card BG)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.cardBgColor}
                          onChange={(e) => setConfig({ ...config, cardBgColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={config.cardBgColor}
                          onChange={(e) => setConfig({ ...config, cardBgColor: e.target.value })}
                          className="w-full bg-[#1F2937] text-xs font-mono px-2 py-1 rounded border border-gray-600 uppercase"
                        />
                      </div>
                    </div>

                    <div className="bg-[#111827] p-3 rounded-xl border border-gray-700/80">
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Garisan Sempadan (Border)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.cardBorderColor}
                          onChange={(e) => setConfig({ ...config, cardBorderColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={config.cardBorderColor}
                          onChange={(e) => setConfig({ ...config, cardBorderColor: e.target.value })}
                          className="w-full bg-[#1F2937] text-xs font-mono px-2 py-1 rounded border border-gray-600 uppercase"
                        />
                      </div>
                    </div>

                    <div className="bg-[#111827] p-3 rounded-xl border border-gray-700/80">
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Warna Tulisan (Text)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.textColor}
                          onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={config.textColor}
                          onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                          className="w-full bg-[#1F2937] text-xs font-mono px-2 py-1 rounded border border-gray-600 uppercase"
                        />
                      </div>
                    </div>

                    <div className="bg-[#111827] p-3 rounded-xl border border-gray-700/80">
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Teks Pudar (Muted)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.mutedTextColor}
                          onChange={(e) => setConfig({ ...config, mutedTextColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={config.mutedTextColor}
                          onChange={(e) => setConfig({ ...config, mutedTextColor: e.target.value })}
                          className="w-full bg-[#1F2937] text-xs font-mono px-2 py-1 rounded border border-gray-600 uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background Pattern */}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-2">
                    Corak Latar Belakang (Texture Pattern)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'dots', label: '• Dots' },
                      { id: 'grid', label: '▦ Grid' },
                      { id: 'mesh', label: '🌈 Mesh' },
                      { id: 'clean', label: '⬜ Clean' },
                    ].map((pat) => (
                      <button
                        key={pat.id}
                        onClick={() => setConfig({ ...config, pagePattern: pat.id as any })}
                        className={`py-2 text-xs font-bold rounded-xl border transition ${
                          config.pagePattern === pat.id
                            ? 'bg-[#FF7A45] text-white border-[#FF7A45]'
                            : 'bg-[#111827] text-gray-300 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {pat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-300">
                      Kelengkungan Sudut Kad (Border Radius)
                    </label>
                    <span className="text-xs font-mono text-[#FF7A45]">{config.borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="36"
                    step="2"
                    value={config.borderRadius}
                    onChange={(e) => setConfig({ ...config, borderRadius: parseInt(e.target.value) })}
                    className="w-full accent-[#FF7A45] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 2: KAD COP ── */}
            {activeTab === 'card' && (
              <div className="space-y-4">
                {/* Store Branding */}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Nama Kedai</label>
                  <input
                    type="text"
                    value={config.storeName}
                    onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                    className="w-full bg-[#111827] border border-gray-700 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-[#FF7A45]"
                    placeholder="Contoh: Diana Bakery & Cafe"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Tagline / Penerangan Kedai</label>
                  <input
                    type="text"
                    value={config.storeTagline}
                    onChange={(e) => setConfig({ ...config, storeTagline: e.target.value })}
                    className="w-full bg-[#111827] border border-gray-700 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-[#FF7A45]"
                    placeholder="Contoh: Pastri Segar Setiap Hari"
                  />
                </div>

                {/* Stamp Icon */}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Ikon Cop Stamp</label>
                  <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-[#111827] rounded-xl border border-gray-700">
                    {STAMP_ICONS.map((icon) => (
                      <button
                        key={icon.path}
                        onClick={() => setConfig({ ...config, stampIcon: icon.path })}
                        className={`p-2 rounded-lg text-xs font-medium flex items-center gap-2 border text-left transition ${
                          config.stampIcon === icon.path
                            ? 'bg-[#FF7A45]/20 border-[#FF7A45] text-white'
                            : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                      >
                        <img src={icon.path} alt={icon.label} className="w-4 h-4 object-contain" />
                        <span className="truncate">{icon.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stamps required */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-300">
                      Jumlah Slot Cop Sekeping Kad
                    </label>
                    <span className="text-xs font-mono font-bold text-[#FF7A45]">
                      {config.stampsRequired} Cop
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="12"
                    step="1"
                    value={config.stampsRequired}
                    onChange={(e) => {
                      const req = parseInt(e.target.value)
                      setConfig({
                        ...config,
                        stampsRequired: req,
                        simulatedStamps: Math.min(config.simulatedStamps, req),
                      })
                    }}
                    className="w-full accent-[#FF7A45] cursor-pointer"
                  />
                </div>

                {/* Simulated Progress for Live Testing */}
                <div className="p-3.5 bg-[#111827] rounded-xl border border-amber-500/30">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-amber-400">
                      🧪 Uji Simulasi Cop Pelanggan (0 hingga {config.stampsRequired})
                    </label>
                    <span className="text-xs font-mono font-bold text-white bg-amber-600 px-2 py-0.5 rounded">
                      {config.simulatedStamps} / {config.stampsRequired}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={config.stampsRequired}
                    step="1"
                    value={config.simulatedStamps}
                    onChange={(e) => setConfig({ ...config, simulatedStamps: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Tolak slider ini untuk melihat bagaimana rupa kad bila cop bertambah atau penuh.
                  </p>
                </div>

                {/* Reward Description */}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Penerangan Ganjaran Utama
                  </label>
                  <input
                    type="text"
                    value={config.rewardDescription}
                    onChange={(e) => setConfig({ ...config, rewardDescription: e.target.value })}
                    className="w-full bg-[#111827] border border-gray-700 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-[#FF7A45]"
                    placeholder="Contoh: 1 Minuman Panas Percuma"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 3: SUSUN BLOK DINAMIK ── */}
            {activeTab === 'blocks' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-400">
                  Susun keutamaan bahagian blok di page kad. Anda boleh naik/turunkan blok atau padam mana-mana bahagian yang tidak diperlukan.
                </p>

                <div className="space-y-2">
                  {config.blocks.map((block, idx) => (
                    <div
                      key={block.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition ${
                        block.visible
                          ? 'bg-[#111827] border-gray-700'
                          : 'bg-[#111827]/40 border-gray-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleBlockVisibility(idx)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition ${
                            block.visible ? 'bg-[#FF7A45] text-white' : 'bg-gray-800 text-gray-500 border border-gray-700'
                          }`}
                        >
                          {block.visible ? '✓' : ''}
                        </button>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>#{idx + 1}</span>
                            <span>{block.title}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono">{block.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveBlock(idx, 'up')}
                          className="w-7 h-7 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-lg text-xs font-bold text-gray-300 flex items-center justify-center transition cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          disabled={idx === config.blocks.length - 1}
                          onClick={() => handleMoveBlock(idx, 'down')}
                          className="w-7 h-7 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-lg text-xs font-bold text-gray-300 flex items-center justify-center transition cursor-pointer"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 4: JSON DATA & EXPORT ── */}
            {activeTab === 'export' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">
                    Konfigurasi JSON (Data-Driven Engine)
                  </span>
                  <button
                    onClick={handleCopyJson}
                    className="px-3 py-1.5 bg-[#FF7A45] hover:bg-[#ff682e] text-white text-xs font-bold rounded-lg transition"
                  >
                    {copiedJson ? '✅ Disalin!' : '📋 Salin JSON'}
                  </button>
                </div>

                <pre className="p-3 bg-[#111827] border border-gray-800 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72">
                  {JSON.stringify(config, null, 2)}
                </pre>

                <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                  <button
                    onClick={handleReset}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
                  >
                    🔄 Reset Tetapan ke Lalai
                  </button>
                  <button
                    onClick={handleSaveToLocalStorage}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow"
                  >
                    {savedSuccess ? '✅ Tersimpan!' : '💾 Simpan Draf'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE INTERACTIVE PHONE MOCKUP */}
        <div
          className={`flex-1 bg-[#0B0F19] p-4 sm:p-8 flex items-center justify-center overflow-y-auto ${
            mobileViewTab === 'controls' ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Phone Mockup Wrapper */}
          <div className="w-full max-w-[380px] min-h-[720px] bg-black rounded-[44px] p-3 shadow-2xl border-4 border-gray-800 relative flex flex-col">
            {/* Phone Speaker & Dynamic Island Notch */}
            <div className="w-28 h-4 bg-gray-900 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-800 mr-2" />
              <div className="w-8 h-1 bg-gray-700 rounded-full" />
            </div>

            {/* Screen Viewport */}
            <div
              className="flex-1 rounded-[34px] overflow-y-auto p-4 flex flex-col gap-3 relative transition-colors duration-300"
              style={{
                backgroundColor: config.pageBgColor,
                color: config.textColor,
                ...getPatternStyle(),
              }}
            >
              {/* Dynamic Blocks Rendering based on config.blocks order */}
              {config.blocks
                .filter((b) => b.visible)
                .map((block) => {
                  switch (block.id) {
                    case 'header':
                      return (
                        <div
                          key={block.id}
                          className="flex items-center justify-between py-1 border-b pb-2.5"
                          style={{ borderColor: `${config.cardBorderColor}` }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-10 h-10 rounded-2xl p-1 flex items-center justify-center shrink-0 shadow-xs border"
                              style={{
                                backgroundColor: config.cardBgColor,
                                borderColor: config.cardBorderColor,
                              }}
                            >
                              <img
                                src={config.logoUrl}
                                alt="Logo"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <h2 className="font-bold text-sm leading-tight">{config.storeName}</h2>
                              <p className="text-[10px]" style={{ color: config.mutedTextColor }}>
                                {config.storeTagline}
                              </p>
                            </div>
                          </div>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${config.primaryColor}20`,
                              color: config.primaryColor,
                            }}
                          >
                            ⭐ VIP
                          </span>
                        </div>
                      )

                    case 'banner':
                      return (
                        <div
                          key={block.id}
                          className="p-3.5 rounded-2xl border shadow-xs text-left"
                          style={{
                            backgroundColor: config.cardBgColor,
                            borderColor: config.cardBorderColor,
                            borderRadius: config.borderRadius,
                          }}
                        >
                          <div className="font-bold text-xs text-[#FF7A45] mb-0.5">
                            {config.bannerTitle}
                          </div>
                          <div className="text-[11px]" style={{ color: config.mutedTextColor }}>
                            {config.bannerSubtitle}
                          </div>
                        </div>
                      )

                    case 'card':
                      return (
                        <div
                          key={block.id}
                          className="p-4.5 border shadow-md flex flex-col gap-3 relative overflow-hidden transition-all"
                          style={{
                            backgroundColor: config.cardBgColor,
                            borderColor: config.cardBorderColor,
                            borderRadius: config.borderRadius,
                          }}
                        >
                          {/* Card Header */}
                          <div className="flex items-center justify-between">
                            <div>
                              <span
                                className="text-[10px] font-extrabold uppercase tracking-wider block"
                                style={{ color: config.primaryColor }}
                              >
                                Kad Ganjaran
                              </span>
                              <span className="font-bold text-xs">{config.storeName}</span>
                            </div>
                            <span
                              className="font-mono font-bold text-xs px-2.5 py-1 rounded-xl"
                              style={{
                                backgroundColor: `${config.primaryColor}15`,
                                color: config.primaryColor,
                              }}
                            >
                              {config.simulatedStamps} / {config.stampsRequired} Cop
                            </span>
                          </div>

                          {/* Stamp Slots Grid */}
                          <div
                            className="grid gap-2 py-2"
                            style={{
                              gridTemplateColumns: `repeat(${config.stampsRequired <= 6 ? 3 : 5}, minmax(0, 1fr))`,
                            }}
                          >
                            {Array.from({ length: config.stampsRequired }).map((_, slotIdx) => {
                              const isFilled = slotIdx < config.simulatedStamps
                              return (
                                <div
                                  key={slotIdx}
                                  className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all ${
                                    isFilled ? 'scale-100' : 'opacity-40'
                                  }`}
                                  style={{
                                    borderColor: isFilled
                                      ? config.primaryColor
                                      : `${config.mutedTextColor}40`,
                                    backgroundColor: isFilled
                                      ? `${config.primaryColor}18`
                                      : 'transparent',
                                  }}
                                >
                                  {isFilled ? (
                                    <img
                                      src={config.stampIcon}
                                      alt="Stamp"
                                      className="w-5 h-5 object-contain"
                                    />
                                  ) : (
                                    <span
                                      className="text-xs font-mono font-bold"
                                      style={{ color: config.mutedTextColor }}
                                    >
                                      {slotIdx + 1}
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          {/* Reward footer inside card */}
                          <div
                            className="p-2.5 rounded-xl text-[11px] font-semibold flex items-center gap-2 border"
                            style={{
                              backgroundColor: `${config.primaryColor}0C`,
                              borderColor: `${config.primaryColor}30`,
                              color: config.textColor,
                            }}
                          >
                            <span>🎁</span>
                            <span className="truncate">{config.rewardDescription}</span>
                          </div>
                        </div>
                      )

                    case 'rewards':
                      return (
                        <div key={block.id} className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold px-1">
                            <span>🎁 Ganjaran Tersedia</span>
                            <span className="text-[10px]" style={{ color: config.primaryColor }}>
                              {config.rewards.length} Hadiah
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {config.rewards.map((rew) => (
                              <div
                                key={rew.id}
                                className="p-3 border rounded-xl flex items-center justify-between gap-2"
                                style={{
                                  backgroundColor: config.cardBgColor,
                                  borderColor: config.cardBorderColor,
                                  borderRadius: Math.max(12, config.borderRadius - 8),
                                }}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-xs truncate">{rew.name}</div>
                                  <div
                                    className="text-[10px] truncate"
                                    style={{ color: config.mutedTextColor }}
                                  >
                                    {rew.desc}
                                  </div>
                                </div>
                                <span
                                  className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0"
                                  style={{
                                    backgroundColor: `${config.primaryColor}15`,
                                    color: config.primaryColor,
                                  }}
                                >
                                  {rew.stampsRequired} Cop
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )

                    case 'google_review':
                      return (
                        <div
                          key={block.id}
                          className="p-3 border rounded-2xl flex items-center justify-between shadow-xs"
                          style={{
                            backgroundColor: config.cardBgColor,
                            borderColor: config.cardBorderColor,
                            borderRadius: config.borderRadius,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">⭐</span>
                            <div>
                              <div className="font-bold text-xs">Nilai {config.storeName}</div>
                              <div
                                className="text-[10px]"
                                style={{ color: config.mutedTextColor }}
                              >
                                Ulasan 5-bintang di Google
                              </div>
                            </div>
                          </div>
                          <span
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg text-white"
                            style={{ backgroundColor: config.primaryColor }}
                          >
                            Review ↗
                          </span>
                        </div>
                      )

                    case 'instructions':
                      return (
                        <div
                          key={block.id}
                          className="p-3.5 border rounded-2xl text-[11px] space-y-1.5"
                          style={{
                            backgroundColor: config.cardBgColor,
                            borderColor: config.cardBorderColor,
                            borderRadius: config.borderRadius,
                          }}
                        >
                          <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
                            <span>ℹ️</span>
                            <span>Cara Tebus Ganjaran</span>
                          </div>
                          <div className="flex items-start gap-2" style={{ color: config.mutedTextColor }}>
                            <span>1.</span>
                            <span>Kumpul cop setiap kali pembelian di kaunter.</span>
                          </div>
                          <div className="flex items-start gap-2" style={{ color: config.mutedTextColor }}>
                            <span>2.</span>
                            <span>Tunjukkan emel / kod QR kepada staf untuk tebus hadiah percuma.</span>
                          </div>
                        </div>
                      )

                    case 'locations':
                      return (
                        <div key={block.id} className="space-y-1.5">
                          <div className="font-bold text-xs px-1">📍 Lokasi Cawangan</div>
                          {config.locations.map((loc, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 border rounded-xl flex items-center justify-between gap-2"
                              style={{
                                backgroundColor: config.cardBgColor,
                                borderColor: config.cardBorderColor,
                                borderRadius: Math.max(12, config.borderRadius - 8),
                              }}
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-xs truncate">{loc.name}</div>
                                <div
                                  className="text-[10px] truncate"
                                  style={{ color: config.mutedTextColor }}
                                >
                                  {loc.address}
                                </div>
                              </div>
                              <span
                                className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 border"
                                style={{
                                  borderColor: config.cardBorderColor,
                                  color: config.primaryColor,
                                }}
                              >
                                Maps ↗
                              </span>
                            </div>
                          ))}
                        </div>
                      )

                    case 'socials':
                      return (
                        <div key={block.id} className="pt-1 pb-3 flex items-center justify-center gap-2">
                          {config.socials.map((soc, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-xl text-[10px] font-bold border flex items-center gap-1"
                              style={{
                                backgroundColor: config.cardBgColor,
                                borderColor: config.cardBorderColor,
                                color: config.textColor,
                              }}
                            >
                              <span>🔗</span>
                              <span>{soc.platform}</span>
                            </span>
                          ))}
                        </div>
                      )

                    default:
                      return null
                  }
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
