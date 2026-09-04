'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export interface CardThemeConfig {
  templateName: string
  // Color palette
  pageBgColor: string
  pageDotColor: string
  heroGradient1: string
  heroGradient2: string
  heroGradient3: string
  cardBgColor: string
  cardBorderColor: string
  primaryColor: string
  textColor: string
  mutedTextColor: string
  tealColor: string
  goldColor: string
  
  // Store Branding
  storeName: string
  isVerified: boolean
  logoUrl: string
  
  // Stamp Card configuration
  stampsRequired: number
  stampIcon: string
  simulatedStamps: number
  rewardDescription: string
  
  // Google review & links
  googleReviewEnabled: boolean
  googleReviewUrl: string
  
  // Social Links
  socialLinks: Array<{ platform: string; url: string }>
  
  // Rewards list
  rewards: Array<{ id: string; name: string; stampsRequired: number; desc: string }>
  
  // Locations list
  locations: Array<{ name: string; address: string; mapUrl: string }>
}

const DEFAULT_THEME_CONFIG: CardThemeConfig = {
  templateName: 'Warm Coral & Cream (Original Live)',
  pageBgColor: '#FFF7EA',
  pageDotColor: 'rgba(43,27,18,0.055)',
  heroGradient1: '#FF7A45',
  heroGradient2: '#FF9F45',
  heroGradient3: '#FFC24D',
  cardBgColor: '#FFFDF8',
  cardBorderColor: '#F0DEC0',
  primaryColor: '#FF7A45',
  textColor: '#2B1B12',
  mutedTextColor: '#96806B',
  tealColor: '#1C7A67',
  goldColor: '#FFB238',
  
  storeName: 'Diana Bakery & Cafe',
  isVerified: true,
  logoUrl: '/mascot.png',
  
  stampsRequired: 10,
  stampIcon: '/icons/stamps/pastri.svg',
  simulatedStamps: 4,
  rewardDescription: '1 Minuman Panas Percuma + 1 Pastri Pilihan',
  
  googleReviewEnabled: true,
  googleReviewUrl: 'https://maps.google.com',
  
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com' },
    { platform: 'tiktok', url: 'https://tiktok.com' },
    { platform: 'whatsapp', url: 'https://whatsapp.com' },
  ],
  
  rewards: [
    { id: '1', name: '1 Kopi Panas Percuma', stampsRequired: 5, desc: 'Pilihan Americano atau Latte saiz regular' },
    { id: '2', name: '1 Set Pastri & Kopi', stampsRequired: 10, desc: '1 Croissant mentega + 1 Kopi sejuk pilihan' },
  ],
  
  locations: [
    { name: 'Cawangan Utama Bangi', address: 'No 12, Jalan Medan Pusat Bandar 1, Bangi', mapUrl: 'https://maps.google.com' },
    { name: 'Cawangan IOI City Mall', address: 'LG-22, IOI City Mall, Putrajaya', mapUrl: 'https://maps.google.com' },
  ]
}

const PRESET_THEMES: Array<{ name: string; config: Partial<CardThemeConfig> }> = [
  {
    name: '🥐 Warm Coral (Original /card)',
    config: {
      templateName: 'Warm Coral (Original)',
      pageBgColor: '#FFF7EA',
      pageDotColor: 'rgba(43,27,18,0.055)',
      heroGradient1: '#FF7A45',
      heroGradient2: '#FF9F45',
      heroGradient3: '#FFC24D',
      cardBgColor: '#FFFDF8',
      cardBorderColor: '#F0DEC0',
      primaryColor: '#FF7A45',
      textColor: '#2B1B12',
      mutedTextColor: '#96806B',
      tealColor: '#1C7A67',
      stampIcon: '/icons/stamps/pastri.svg',
    },
  },
  {
    name: '☕ Espresso Dark & Luxury Gold',
    config: {
      templateName: 'Espresso Dark & Luxury Gold',
      pageBgColor: '#100B08',
      pageDotColor: 'rgba(255,255,255,0.06)',
      heroGradient1: '#261811',
      heroGradient2: '#3D251A',
      heroGradient3: '#543424',
      cardBgColor: '#1C1410',
      cardBorderColor: '#3D2D24',
      primaryColor: '#E5A43B',
      textColor: '#FDFBF7',
      mutedTextColor: '#A8998C',
      tealColor: '#D4AF37',
      stampIcon: '/icons/stamps/coffee.svg',
    },
  },
  {
    name: '🌸 Sakura & Sweet Dessert',
    config: {
      templateName: 'Sakura & Sweet Dessert',
      pageBgColor: '#FFF2F5',
      pageDotColor: 'rgba(225,29,72,0.045)',
      heroGradient1: '#F43F5E',
      heroGradient2: '#FB7185',
      heroGradient3: '#FDA4AF',
      cardBgColor: '#FFFFFF',
      cardBorderColor: '#FCE7F3',
      primaryColor: '#E11D48',
      textColor: '#4C0519',
      mutedTextColor: '#9D174D',
      tealColor: '#BE185D',
      stampIcon: '/icons/stamps/kek.svg',
    },
  },
  {
    name: '🍵 Matcha Eco Cafe Green',
    config: {
      templateName: 'Matcha Eco Cafe Green',
      pageBgColor: '#F2F8F5',
      pageDotColor: 'rgba(22,101,52,0.05)',
      heroGradient1: '#166534',
      heroGradient2: '#22C55E',
      heroGradient3: '#86EFAC',
      cardBgColor: '#FFFFFF',
      cardBorderColor: '#DCFCE7',
      primaryColor: '#15803D',
      textColor: '#052E16',
      mutedTextColor: '#166534',
      tealColor: '#0F766E',
      stampIcon: '/icons/stamps/makanan.svg',
    },
  },
  {
    name: '💈 Royal Barber Blue',
    config: {
      templateName: 'Royal Barber Blue',
      pageBgColor: '#0B132B',
      pageDotColor: 'rgba(255,255,255,0.06)',
      heroGradient1: '#1C2541',
      heroGradient2: '#3A506B',
      heroGradient3: '#5BC0BE',
      cardBgColor: '#121C38',
      cardBorderColor: '#28385E',
      primaryColor: '#5BC0BE',
      textColor: '#F8FAFC',
      mutedTextColor: '#8D99AE',
      tealColor: '#6FFFE9',
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
  const [activeTab, setActiveTab] = useState<'theme' | 'card' | 'rewards' | 'export'>('theme')
  const [copiedJson, setCopiedJson] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [mobileViewTab, setMobileViewTab] = useState<'controls' | 'preview'>('controls')

  // Modals simulation state inside mockup
  const [showHowToRedeemModal, setShowHowToRedeemModal] = useState(false)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)

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

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2500)
  }

  const handleReset = () => {
    if (confirm('Adakah anda pasti untuk reset semua tetapan editor ke lalai original?')) {
      setConfig(DEFAULT_THEME_CONFIG)
      localStorage.removeItem('cop_card_studio_config')
    }
  }

  const percentFill = Math.min(
    100,
    Math.round((config.simulatedStamps / config.stampsRequired) * 100)
  )
  const isFull = config.simulatedStamps >= config.stampsRequired
  const cardRemain = Math.max(0, config.stampsRequired - config.simulatedStamps)

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 bg-[#1F2937] border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF7A45] flex items-center justify-center font-bold text-lg text-white shadow-md">
            🎨
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base leading-none text-white">
              Card Studio (Exact Live Replica)
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Ubahsuai warna & susunan kad mengikut reka bentuk live page /card
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

      {/* Main Studio Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: CONTROL PANEL */}
        <div
          className={`w-full sm:w-[460px] lg:w-[500px] bg-[#1F2937] border-r border-gray-800 flex flex-col shrink-0 ${
            mobileViewTab === 'preview' ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Tab Bar */}
          <div className="flex border-b border-gray-800 bg-[#1A2230] p-1.5 gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition text-center ${
                activeTab === 'theme'
                  ? 'bg-[#374151] text-[#FF7A45] shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎨 Tema & Hero
            </button>
            <button
              onClick={() => setActiveTab('card')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition text-center ${
                activeTab === 'card'
                  ? 'bg-[#374151] text-[#FF7A45] shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🃏 Kad Cop & Ikon
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition text-center ${
                activeTab === 'rewards'
                  ? 'bg-[#374151] text-[#FF7A45] shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎁 Ganjaran & Hadiah
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition text-center ${
                activeTab === 'export'
                  ? 'bg-[#374151] text-[#FF7A45] shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📋 JSON
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {/* ── TAB 1: TEMA & HERO GRADIENT ── */}
            {activeTab === 'theme' && (
              <div className="space-y-5">
                {/* Preset Themes */}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-2">
                    ⚡ Preset Warna Tema
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRESET_THEMES.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleApplyPreset(preset.config)}
                        className="p-2.5 bg-[#111827] hover:bg-[#374151] border border-gray-700 rounded-xl text-left text-xs font-semibold text-gray-200 transition flex items-center justify-between"
                      >
                        <span className="truncate">{preset.name}</span>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: preset.config.heroGradient1 }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-800" />

                {/* Hero Gradient Controls */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Warna Header Atas (Hero Banner)
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#111827] p-2.5 rounded-xl border border-gray-700">
                      <label className="text-[10px] text-gray-400 block mb-1">Gradien 1</label>
                      <input
                        type="color"
                        value={config.heroGradient1}
                        onChange={(e) => setConfig({ ...config, heroGradient1: e.target.value })}
                        className="w-full h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <div className="bg-[#111827] p-2.5 rounded-xl border border-gray-700">
                      <label className="text-[10px] text-gray-400 block mb-1">Gradien 2</label>
                      <input
                        type="color"
                        value={config.heroGradient2}
                        onChange={(e) => setConfig({ ...config, heroGradient2: e.target.value })}
                        className="w-full h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <div className="bg-[#111827] p-2.5 rounded-xl border border-gray-700">
                      <label className="text-[10px] text-gray-400 block mb-1">Gradien 3</label>
                      <input
                        type="color"
                        value={config.heroGradient3}
                        onChange={(e) => setConfig({ ...config, heroGradient3: e.target.value })}
                        className="w-full h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Page Background & Card Color */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Warna Latar & Kad
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#111827] p-3 rounded-xl border border-gray-700">
                      <label className="text-[11px] text-gray-400 block mb-1">
                        Latar Page (Background)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.pageBgColor}
                          onChange={(e) => setConfig({ ...config, pageBgColor: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={config.pageBgColor}
                          onChange={(e) => setConfig({ ...config, pageBgColor: e.target.value })}
                          className="w-full bg-[#1F2937] text-xs font-mono px-2 py-1 rounded border border-gray-600 uppercase"
                        />
                      </div>
                    </div>

                    <div className="bg-[#111827] p-3 rounded-xl border border-gray-700">
                      <label className="text-[11px] text-gray-400 block mb-1">
                        Permukaan Kad (Card BG)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.cardBgColor}
                          onChange={(e) => setConfig({ ...config, cardBgColor: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={config.cardBgColor}
                          onChange={(e) => setConfig({ ...config, cardBgColor: e.target.value })}
                          className="w-full bg-[#1F2937] text-xs font-mono px-2 py-1 rounded border border-gray-600 uppercase"
                        />
                      </div>
                    </div>

                    <div className="bg-[#111827] p-3 rounded-xl border border-gray-700">
                      <label className="text-[11px] text-gray-400 block mb-1">
                        Border Sempadan Kad
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.cardBorderColor}
                          onChange={(e) => setConfig({ ...config, cardBorderColor: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={config.cardBorderColor}
                          onChange={(e) => setConfig({ ...config, cardBorderColor: e.target.value })}
                          className="w-full bg-[#1F2937] text-xs font-mono px-2 py-1 rounded border border-gray-600 uppercase"
                        />
                      </div>
                    </div>

                    <div className="bg-[#111827] p-3 rounded-xl border border-gray-700">
                      <label className="text-[11px] text-gray-400 block mb-1">
                        Warna Utama (Primary)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="w-full bg-[#1F2937] text-xs font-mono px-2 py-1 rounded border border-gray-600 uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: KAD COP & STORE BRANDING ── */}
            {activeTab === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Nama Kedai</label>
                  <input
                    type="text"
                    value={config.storeName}
                    onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                    className="w-full bg-[#111827] border border-gray-700 text-xs px-3 py-2.5 rounded-xl text-white outline-none focus:border-[#FF7A45]"
                    placeholder="Nama Kedai"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-[#111827] rounded-xl border border-gray-700">
                  <div className="text-xs font-bold text-gray-300 flex items-center gap-2">
                    <img src="/green-checkmark-line-icon.svg" alt="Verified" className="w-4 h-4" />
                    <span>Lencana Pengesahan Rasmi (Verified Store)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.isVerified}
                    onChange={(e) => setConfig({ ...config, isVerified: e.target.checked })}
                    className="w-4 h-4 accent-[#FF7A45] cursor-pointer"
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

                {/* Stamp requirement */}
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
                    min="5"
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

                {/* Simulated Stamps Slider */}
                <div className="p-3.5 bg-[#111827] rounded-xl border border-amber-500/30">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-amber-400">
                      🧪 Simulasi Jumlah Cop Terkumpul
                    </label>
                    <span className="text-xs font-mono font-bold text-white bg-amber-600 px-2 py-0.5 rounded">
                      {config.simulatedStamps} / {config.stampsRequired} Cop
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={config.stampsRequired}
                    step="1"
                    value={config.simulatedStamps}
                    onChange={(e) =>
                      setConfig({ ...config, simulatedStamps: parseInt(e.target.value) })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Gerakkan slider ini untuk melihat animasi cop terisi dan teks status pada kad.
                  </p>
                </div>

                {/* Reward Description */}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Penerangan Ganjaran Penuh
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

            {/* ── TAB 3: HADIAH & GANJARAN ── */}
            {activeTab === 'rewards' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Senarai Katalog Hadiah</span>
                  <button
                    onClick={() => {
                      const newId = String(config.rewards.length + 1)
                      setConfig({
                        ...config,
                        rewards: [
                          ...config.rewards,
                          {
                            id: newId,
                            name: `Ganjaran Hadiah #${newId}`,
                            stampsRequired: 10,
                            desc: 'Keterangan hadiah percuma',
                          },
                        ],
                      })
                    }}
                    className="px-2.5 py-1 bg-[#FF7A45] hover:bg-[#ff682e] text-white rounded-lg text-xs font-bold transition"
                  >
                    + Tambah Hadiah
                  </button>
                </div>

                <div className="space-y-3">
                  {config.rewards.map((rew, idx) => (
                    <div key={rew.id} className="p-3 bg-[#111827] border border-gray-700 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#FF7A45]">Hadiah #{idx + 1}</span>
                        {config.rewards.length > 1 && (
                          <button
                            onClick={() =>
                              setConfig({
                                ...config,
                                rewards: config.rewards.filter((r) => r.id !== rew.id),
                              })
                            }
                            className="text-rose-400 hover:text-rose-300 text-xs font-bold"
                          >
                            Padam
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={rew.name}
                        onChange={(e) => {
                          const updated = [...config.rewards]
                          updated[idx].name = e.target.value
                          setConfig({ ...config, rewards: updated })
                        }}
                        placeholder="Nama Hadiah"
                        className="w-full bg-[#1F2937] border border-gray-600 text-xs px-2.5 py-1.5 rounded-lg text-white"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400 shrink-0">Cop Diperlukan:</span>
                        <input
                          type="number"
                          value={rew.stampsRequired}
                          onChange={(e) => {
                            const updated = [...config.rewards]
                            updated[idx].stampsRequired = parseInt(e.target.value) || 1
                            setConfig({ ...config, rewards: updated })
                          }}
                          className="w-20 bg-[#1F2937] border border-gray-600 text-xs px-2 py-1 rounded-lg text-white font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 4: JSON EXPORT ── */}
            {activeTab === 'export' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">
                    Konfigurasi JSON (Data-Driven Theme)
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
                    🔄 Reset ke Lalai
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

        {/* RIGHT COLUMN: REALISTIC LIVE /CARD REPLICA MOCKUP */}
        <div
          className={`flex-1 bg-[#0B0F19] p-2 sm:p-6 flex items-center justify-center overflow-y-auto ${
            mobileViewTab === 'controls' ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Phone Mockup Frame */}
          <div className="w-full max-w-[420px] min-h-[760px] max-h-[92vh] bg-black rounded-[46px] p-3 shadow-2xl border-4 border-gray-800 relative flex flex-col">
            {/* Dynamic Island / Speaker */}
            <div className="w-28 h-4 bg-gray-900 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-800 mr-2" />
              <div className="w-8 h-1 bg-gray-700 rounded-full" />
            </div>

            {/* Screen Content Window */}
            <div
              className="flex-1 rounded-[36px] overflow-y-auto relative text-[#2B1B12] font-sans pb-8"
              style={{
                backgroundColor: config.pageBgColor,
                backgroundImage: `radial-gradient(circle at 1px 1px, ${config.pageDotColor} 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            >
              {/* 1. HERO HEADER (Exact live style) */}
              <div
                className="relative overflow-hidden rounded-b-[34px] px-4 pt-4 pb-6 text-center text-white"
                style={{
                  background: `linear-gradient(135deg, ${config.heroGradient1} 0%, ${config.heroGradient2} 55%, ${config.heroGradient3} 100%)`,
                  boxShadow: `0 20px 36px -14px ${config.heroGradient1}60`,
                }}
              >
                {/* Background decorative circles */}
                <div className="absolute w-44 h-44 rounded-full bg-white/15 -top-20 -right-12 pointer-events-none" />
                <div className="absolute w-32 h-32 rounded-full bg-white/10 -bottom-16 -left-8 pointer-events-none" />

                <div className="relative z-10">
                  {/* Topbar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 bg-white/20 border border-white/40 rounded-full p-0.5 text-[11px] font-bold">
                      <span className="bg-white text-[#FF5A45] px-2.5 py-1 rounded-full">MY</span>
                      <span className="text-white/80 px-2 py-1">EN</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[#FFEBC2]">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect x="3" y="3" width="7" height="7" rx="1.2" />
                          <rect x="14" y="3" width="7" height="7" rx="1.2" />
                          <rect x="3" y="14" width="7" height="7" rx="1.2" />
                          <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
                        </svg>
                      </div>
                      <div
                        onClick={() => setShowLocationModal(true)}
                        className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Profile Avatar & Store Name */}
                  <div className="flex flex-col items-center">
                    <div className="w-18 h-18 rounded-full bg-white text-[#FF5A45] flex items-center justify-center p-2 shadow-lg border-3 border-white/60 mb-2 overflow-hidden">
                      <img src={config.logoUrl} alt={config.storeName} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex items-center gap-1.5 justify-center font-bold text-lg text-white font-serif">
                      <span>{config.storeName}</span>
                      {config.isVerified && (
                        <img src="/green-checkmark-line-icon.svg" alt="Verified" className="w-4 h-4" />
                      )}
                    </div>

                    {/* Social Media Icons Row */}
                    <div className="flex gap-2 justify-center mt-2">
                      {config.socialLinks.map((soc, idx) => (
                        <div
                          key={idx}
                          className="w-6.5 h-6.5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white text-xs"
                        >
                          🔗
                        </div>
                      ))}
                    </div>

                    {/* Action Pill Row */}
                    <div className="flex gap-2 justify-center mt-4 flex-wrap">
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="inline-flex items-center gap-1.5 bg-white text-[#1B0F09] border border-[#F0DEC0] rounded-xl px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition"
                      >
                        <img src="/Google-Review.svg" alt="Review" className="w-3.5 h-3.5 object-contain" />
                        <span>Review</span>
                      </button>

                      <button
                        onClick={() => setShowHowToRedeemModal(true)}
                        className="inline-flex items-center gap-1.5 bg-white text-[#1B0F09] border border-[#F0DEC0] rounded-xl px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition"
                      >
                        <span className="text-xs">ℹ️</span>
                        <span>Cara Tebus</span>
                      </button>

                      <button
                        onClick={() => setShowRewardsModal(true)}
                        className="inline-flex items-center gap-1.5 bg-white text-[#1B0F09] border border-[#F0DEC0] rounded-xl px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition"
                      >
                        <span className="text-xs">🎁</span>
                        <span>Ganjaran</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. CARD CONTENT (Exact Live Style) */}
              <div className="p-4 pt-5">
                {/* Stamp Card */}
                <div
                  className="rounded-[28px] p-5 shadow-sm border"
                  style={{
                    backgroundColor: config.cardBgColor,
                    borderColor: config.cardBorderColor,
                  }}
                >
                  {/* Card Head */}
                  <div className="text-center mb-1">
                    <div
                      className="text-[11px] font-extrabold uppercase tracking-wider"
                      style={{ color: config.tealColor }}
                    >
                      {isFull ? 'KAD 1 • PENUH' : 'KAD 1 • SEDANG DIISI'}
                    </div>
                    <div
                      className="text-3xl font-bold font-serif leading-tight"
                      style={{ color: config.primaryColor }}
                    >
                      {config.simulatedStamps}
                      <small className="text-sm font-sans text-[#96806B]"> / {config.stampsRequired}</small>
                    </div>
                  </div>

                  {/* Perforation line */}
                  <div className="flex gap-1 justify-center my-3 opacity-50">
                    {Array.from({ length: 15 }).map((_, pIdx) => (
                      <span
                        key={pIdx}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: config.cardBorderColor }}
                      />
                    ))}
                  </div>

                  {/* Stamp Grid (5 columns) */}
                  <div className="grid grid-cols-5 gap-2.5 mb-4">
                    {Array.from({ length: config.stampsRequired }).map((_, slotIdx) => {
                      const slotNum = slotIdx + 1
                      const filled = slotNum <= config.simulatedStamps
                      return (
                        <div
                          key={slotNum}
                          onClick={() =>
                            setConfig({
                              ...config,
                              simulatedStamps: filled ? slotIdx : slotNum,
                            })
                          }
                          className={`aspect-square rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            filled ? 'scale-100 shadow-md' : 'opacity-40'
                          }`}
                          style={{
                            background: filled
                              ? `linear-gradient(145deg, ${config.primaryColor}, #E23F2E)`
                              : 'rgba(255,178,56,0.08)',
                            border: filled ? 'none' : `2px dashed ${config.cardBorderColor}`,
                            color: filled ? '#ffffff' : '#D8B98C',
                          }}
                        >
                          {filled ? (
                            <img
                              src={config.stampIcon}
                              alt="Stamp"
                              className="w-[52%] h-[52%] object-contain brightness-0 invert"
                            />
                          ) : (
                            <span className="text-xs font-bold">{slotNum}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Progress Bar */}
                  <div
                    className="h-2 rounded-full overflow-hidden mb-3"
                    style={{ backgroundColor: config.cardBorderColor }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentFill}%`,
                        background: `linear-gradient(90deg, ${config.primaryColor}, ${config.goldColor})`,
                      }}
                    />
                  </div>

                  {/* Status Text */}
                  <div
                    className="text-center text-xs font-bold leading-relaxed"
                    style={{ color: config.tealColor }}
                  >
                    {isFull ? (
                      <span>🎉 Tahniah! Kad penuh & sedia ditebus: {config.rewardDescription}</span>
                    ) : (
                      <span>
                        Lagi <b style={{ color: config.primaryColor }}>{cardRemain}</b> cop untuk:{' '}
                        {config.rewardDescription}
                      </span>
                    )}
                  </div>

                  {/* Pagination dot */}
                  <div className="flex items-center justify-center gap-1.5 mt-3.5">
                    <span
                      className="w-5 h-2 rounded-full transition-all"
                      style={{ backgroundColor: config.primaryColor }}
                    />
                  </div>
                </div>

                {/* Updated Timestamp */}
                <div className="text-center text-[10.5px] text-[#96806B] font-semibold mt-3">
                  Kemaskini Terakhir: Baru-baru ini
                </div>

                {/* Footer Brand */}
                <div className="text-center mt-6">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#2B1B12] mb-1">
                    <img src="/logo.svg" alt="LajuS" className="w-3.5 h-3.5 object-contain" />
                    <span>LajuS</span>
                  </div>
                  <div className="text-[10px] text-[#96806B] underline flex items-center justify-center gap-2">
                    <span>Dasar Privasi</span>
                    <span>•</span>
                    <span>Padam Akaun</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MODALS PREVIEW IN MOCKUP ── */}
            {/* 1. Cara Tebus Modal */}
            {showHowToRedeemModal && (
              <div
                onClick={() => setShowHowToRedeemModal(false)}
                className="absolute inset-3 bg-black/60 backdrop-blur-xs rounded-[36px] z-50 flex items-center justify-center p-4 anim-fade"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-[#FFFDF8] rounded-2xl p-5 border border-[#F0DEC0] shadow-xl text-left"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold font-serif text-base text-[#1B0F09]">
                      ℹ️ Cara Tebus Ganjaran
                    </h3>
                    <button
                      onClick={() => setShowHowToRedeemModal(false)}
                      className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 text-xs text-[#5A4B3D]">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FFB238] text-black font-bold flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span>Kumpul cop setiap kali pembelian di kaunter.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FFB238] text-black font-bold flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span>Bila kad penuh, beritahu staf kaunter untuk tebus hadiah percuma!</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHowToRedeemModal(false)}
                    className="w-full mt-4 py-2 bg-[#1C7A67] text-white text-xs font-bold rounded-xl"
                  >
                    Faham
                  </button>
                </div>
              </div>
            )}

            {/* 2. Ganjaran Modal */}
            {showRewardsModal && (
              <div
                onClick={() => setShowRewardsModal(false)}
                className="absolute inset-3 bg-black/60 backdrop-blur-xs rounded-[36px] z-50 flex items-center justify-center p-4 anim-fade"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-[#FFFDF8] rounded-2xl p-5 border border-[#F0DEC0] shadow-xl text-left"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold font-serif text-base text-[#1B0F09]">
                      🎁 Katalog Hadiah
                    </h3>
                    <button
                      onClick={() => setShowRewardsModal(false)}
                      className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {config.rewards.map((rew) => (
                      <div
                        key={rew.id}
                        className="p-2.5 bg-white border border-[#F0DEC0] rounded-xl flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{rew.name}</div>
                          <div className="text-[10px] text-[#96806B] truncate">{rew.desc}</div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#FF7A45]/15 text-[#FF7A45] shrink-0">
                          {rew.stampsRequired} Cop
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowRewardsModal(false)}
                    className="w-full mt-4 py-2 bg-[#1C7A67] text-white text-xs font-bold rounded-xl"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}

            {/* 3. Google Review Modal */}
            {showReviewModal && (
              <div
                onClick={() => setShowReviewModal(false)}
                className="absolute inset-3 bg-black/60 backdrop-blur-xs rounded-[36px] z-50 flex items-center justify-center p-4 anim-fade"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-[#FFFDF8] rounded-2xl p-5 border border-[#F0DEC0] shadow-xl text-center"
                >
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold"
                  >
                    ✕
                  </button>
                  <h3 className="font-bold font-serif text-base text-[#1B0F09] mb-1">
                    ⭐ Nilai {config.storeName} di Google
                  </h3>
                  <p className="text-xs text-[#96806B] mb-3">
                    Sentuh bintang untuk beri ulasan penilaian anda bagi {config.storeName}.
                  </p>
                  <div className="flex justify-center gap-1.5 text-2xl text-[#FFB238] mb-3">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="w-full py-2 bg-[#FF7A45] text-white text-xs font-bold rounded-xl"
                  >
                    Buka Google Review ↗
                  </button>
                </div>
              </div>
            )}

            {/* 4. Lokasi Modal */}
            {showLocationModal && (
              <div
                onClick={() => setShowLocationModal(false)}
                className="absolute inset-3 bg-black/60 backdrop-blur-xs rounded-[36px] z-50 flex items-center justify-center p-4 anim-fade"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-[#FFFDF8] rounded-2xl p-5 border border-[#F0DEC0] shadow-xl text-left"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold font-serif text-base text-[#1B0F09]">
                      📍 Lokasi Kedai
                    </h3>
                    <button
                      onClick={() => setShowLocationModal(false)}
                      className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2">
                    {config.locations.map((loc, idx) => (
                      <div key={idx} className="p-2.5 bg-white border border-[#F0DEC0] rounded-xl">
                        <div className="font-bold text-xs">{loc.name}</div>
                        <div className="text-[10px] text-[#96806B] mb-2">{loc.address}</div>
                        <a
                          href={loc.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block px-2.5 py-1 text-[10px] font-bold bg-[#FF7A45]/10 text-[#FF7A45] rounded-lg"
                        >
                          Buka di Google Maps ↗
                        </a>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="w-full mt-4 py-2 bg-[#1C7A67] text-white text-xs font-bold rounded-xl"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
