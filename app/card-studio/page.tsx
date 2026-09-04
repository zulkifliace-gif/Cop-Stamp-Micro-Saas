'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export type BlockType =
  | 'hero_header'
  | 'social_links'
  | 'action_pills'
  | 'promo_banner'
  | 'stamp_card'
  | 'rewards_catalog'
  | 'google_review'
  | 'how_to_redeem'
  | 'store_locations'
  | 'opening_hours'
  | 'featured_gallery'
  | 'footer_brand'

export interface CardBlockConfig {
  id: BlockType
  name: string
  icon: string
  visible: boolean
  // Styling
  bgColor: string
  textColor: string
  borderColor: string
  borderRadius: number
  shadowStyle: 'none' | 'soft' | 'glow' | 'glass'
  // Image & Media
  imageUrl: string
  // Content Customization
  title: string
  subtitle: string
  extraText?: string
}

export interface StudioConfig {
  templateName: string
  pageBgColor: string
  pageDotColor: string
  primaryAccent: string
  // 12 Modular Blocks
  blocks: CardBlockConfig[]
  // Simulation params
  simulatedStamps: number
  stampsRequired: number
}

const DEFAULT_12_BLOCKS: CardBlockConfig[] = [
  {
    id: 'hero_header',
    name: '1. Hero Header & Profil Kedai',
    icon: '👑',
    visible: true,
    bgColor: '#FF7A45',
    textColor: '#FFFFFF',
    borderColor: '#FFA07A',
    borderRadius: 34,
    shadowStyle: 'glow',
    imageUrl: '/mascot.png',
    title: 'Diana Bakery & Cafe',
    subtitle: 'Pastri Segar & Kopi Premium Setiap Hari',
    extraText: 'Pengesahan Rasmi • Aktif',
  },
  {
    id: 'social_links',
    name: '2. Barisan Media Sosial',
    icon: '🔗',
    visible: true,
    bgColor: 'rgba(255,255,255,0.20)',
    textColor: '#FFFFFF',
    borderColor: 'rgba(255,255,255,0.38)',
    borderRadius: 999,
    shadowStyle: 'none',
    imageUrl: '',
    title: 'Pautan Rasmi',
    subtitle: 'Ikuti kami di media sosial',
    extraText: 'WhatsApp, Instagram, TikTok',
  },
  {
    id: 'action_pills',
    name: '3. Butang Barisan Aksi (Action Pills)',
    icon: '⚡',
    visible: true,
    bgColor: '#FFFFFF',
    textColor: '#1B0F09',
    borderColor: '#F0DEC0',
    borderRadius: 12,
    shadowStyle: 'soft',
    imageUrl: '',
    title: 'Aksi Pantas',
    subtitle: 'Review, Cara Tebus, Hadiah',
  },
  {
    id: 'promo_banner',
    name: '4. Banner Promosi Khas',
    icon: '📢',
    visible: true,
    bgColor: '#FFF3E0',
    textColor: '#8C3B00',
    borderColor: '#FFE0B2',
    borderRadius: 20,
    shadowStyle: 'soft',
    imageUrl: '',
    title: '🔥 Promosi Hebat Hujung Minggu!',
    subtitle: 'Beli 2 Kopi percuma 1 Croissant. Kumpul 2x cop hari ini!',
  },
  {
    id: 'stamp_card',
    name: '5. Kad Cop Utama (Main Stamp Card)',
    icon: '🃏',
    visible: true,
    bgColor: '#FFFDF8',
    textColor: '#2B1B12',
    borderColor: '#F0DEC0',
    borderRadius: 28,
    shadowStyle: 'soft',
    imageUrl: '',
    title: 'KAD 1 • SEDANG DIISI',
    subtitle: '1 Minuman Panas Percuma (Saiz Regular)',
    extraText: 'Cop setiap pembelian di kaunter',
  },
  {
    id: 'rewards_catalog',
    name: '6. Katalog Hadiah & Ganjaran',
    icon: '🎁',
    visible: true,
    bgColor: '#FFFDF8',
    textColor: '#2B1B12',
    borderColor: '#F0DEC0',
    borderRadius: 20,
    shadowStyle: 'soft',
    imageUrl: '',
    title: '🎁 Pilihan Hadiah & Ganjaran',
    subtitle: '5 Cop: 1 Kopi Panas • 10 Cop: 1 Set Pastri & Minuman',
  },
  {
    id: 'google_review',
    name: '7. Butang Ulasan Google (5-Bintang)',
    icon: '⭐',
    visible: true,
    bgColor: '#FFFDF8',
    textColor: '#2B1B12',
    borderColor: '#F0DEC0',
    borderRadius: 20,
    shadowStyle: 'soft',
    imageUrl: '/Google-Review.svg',
    title: 'Nilai Kami di Google (5 Bintang)',
    subtitle: 'Sentuh untuk bantu beri ulasan bagi kedai ini.',
  },
  {
    id: 'how_to_redeem',
    name: '8. Panduan & Cara Tebus Cop',
    icon: 'ℹ️',
    visible: true,
    bgColor: '#FFFDF8',
    textColor: '#2B1B12',
    borderColor: '#F0DEC0',
    borderRadius: 20,
    shadowStyle: 'soft',
    imageUrl: '',
    title: 'ℹ️ Cara Mengumpul & Tebus Cop',
    subtitle: '1. Kumpul cop setiap pembelian. 2. Tunjuk kod QR bila kad penuh.',
  },
  {
    id: 'store_locations',
    name: '9. Lokasi Cawangan & Alamat',
    icon: '📍',
    visible: true,
    bgColor: '#FFFDF8',
    textColor: '#2B1B12',
    borderColor: '#F0DEC0',
    borderRadius: 20,
    shadowStyle: 'soft',
    imageUrl: '',
    title: '📍 Lokasi Cawangan Kedai',
    subtitle: 'Cawangan Bangi & Cawangan IOI City Mall Putrajaya',
    extraText: 'Buka di Google Maps',
  },
  {
    id: 'opening_hours',
    name: '10. Waktu Operasi & Hari Buka',
    icon: '🕒',
    visible: true,
    bgColor: '#F4FAF8',
    textColor: '#0F5C4C',
    borderColor: '#C8E6C9',
    borderRadius: 18,
    shadowStyle: 'soft',
    imageUrl: '',
    title: '🕒 Waktu Operasi Perniagaan',
    subtitle: 'Isnin – Ahad: 8.00 AM – 10.00 PM (Buka Setiap Hari)',
  },
  {
    id: 'featured_gallery',
    name: '11. Galeri Menu & Gambar Kedai',
    icon: '🖼️',
    visible: false,
    bgColor: '#FFFDF8',
    textColor: '#2B1B12',
    borderColor: '#F0DEC0',
    borderRadius: 20,
    shadowStyle: 'soft',
    imageUrl: '',
    title: '📸 Menu Pilihan & Suasana Kedai',
    subtitle: 'Pastri artisan dibakar segar setiap pagi',
  },
  {
    id: 'footer_brand',
    name: '12. Footer & Hak Cipta',
    icon: '🛡️',
    visible: true,
    bgColor: 'transparent',
    textColor: '#96806B',
    borderColor: 'transparent',
    borderRadius: 0,
    shadowStyle: 'none',
    imageUrl: '/logo.svg',
    title: 'Dikuasakan oleh LajuS',
    subtitle: 'Dasar Privasi • Padam Akaun',
  },
]

const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  templateName: 'Tema Custom 12 Blok',
  pageBgColor: '#FFF7EA',
  pageDotColor: 'rgba(43,27,18,0.055)',
  primaryAccent: '#FF7A45',
  blocks: DEFAULT_12_BLOCKS,
  simulatedStamps: 4,
  stampsRequired: 10,
}

export default function CardStudioPage() {
  const [config, setConfig] = useState<StudioConfig>(DEFAULT_STUDIO_CONFIG)
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>('hero_header')
  const [copiedJson, setCopiedJson] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [mobileViewTab, setMobileViewTab] = useState<'controls' | 'preview'>('controls')

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cop_card_studio_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && Array.isArray(parsed.blocks)) {
          setConfig(parsed)
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

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= config.blocks.length) return
    const updated = [...config.blocks]
    const temp = updated[index]
    updated[index] = updated[targetIdx]
    updated[targetIdx] = temp
    setConfig({ ...config, blocks: updated })
  }

  const handleToggleBlock = (index: number) => {
    const updated = [...config.blocks]
    updated[index].visible = !updated[index].visible
    setConfig({ ...config, blocks: updated })
  }

  const handleUpdateBlockField = (index: number, field: keyof CardBlockConfig, value: any) => {
    const updated = [...config.blocks]
    updated[index] = { ...updated[index], [field]: value }
    setConfig({ ...config, blocks: updated })
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2500)
  }

  const handleReset = () => {
    if (confirm('Adakah anda pasti untuk reset susunan dan gaya 12 blok ke lalai asal?')) {
      setConfig(DEFAULT_STUDIO_CONFIG)
      localStorage.removeItem('cop_card_studio_config')
    }
  }

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col font-sans">
      {/* Top App Bar */}
      <header className="h-16 bg-[#1F2937] border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF7A45] flex items-center justify-center font-bold text-lg text-white shadow-md">
            🧱
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base leading-none text-white">
              Card Studio — Modular 12 Blok Builder
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Susun urutan 12 blok, ubah warna, bentuk & gambar per blok secara langsung
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
              ⚙️ Susun Blok
            </button>
            <button
              onClick={() => setMobileViewTab('preview')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                mobileViewTab === 'preview' ? 'bg-[#FF7A45] text-white' : 'text-gray-400'
              }`}
            >
              📱 Live Mockup
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

      {/* Main Studio Body: 2 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: 1 UNIFIED SECTION — SUSUN & EDIT 12 BLOK */}
        <div
          className={`w-full sm:w-[500px] lg:w-[560px] bg-[#1F2937] border-r border-gray-800 flex flex-col shrink-0 ${
            mobileViewTab === 'preview' ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Header Bar */}
          <div className="p-3.5 bg-[#1A2230] border-b border-gray-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-200">
                🧱 Senarai 12 Blok Halaman (/card)
              </span>
              <span className="text-[11px] font-mono bg-[#FF7A45]/20 text-[#FF7A45] px-2 py-0.5 rounded-full font-bold">
                {config.blocks.filter((b) => b.visible).length} / 12 Aktif
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className="text-[11px] text-gray-300 hover:text-white bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-700"
              >
                {copiedJson ? '✅ Disalin!' : '📋 Salin JSON'}
              </button>
              <button
                onClick={handleReset}
                className="text-[11px] text-rose-400 hover:text-rose-300 bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-800/40"
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Quick Page Background Tweak Bar */}
          <div className="px-4 py-2.5 bg-[#161F2E] border-b border-gray-800/80 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-400">Latar Page:</span>
              <input
                type="color"
                value={config.pageBgColor}
                onChange={(e) => setConfig({ ...config, pageBgColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-[10px] font-mono text-gray-400">{config.pageBgColor}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-400">Warna Aksen:</span>
              <input
                type="color"
                value={config.primaryAccent}
                onChange={(e) => setConfig({ ...config, primaryAccent: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-[10px] font-mono text-gray-400">{config.primaryAccent}</span>
            </div>
          </div>

          {/* 12 Blocks Accordion List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {config.blocks.map((block, idx) => {
              const isExpanded = expandedBlockId === block.id
              return (
                <div
                  key={block.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    block.visible
                      ? isExpanded
                        ? 'bg-[#111827] border-[#FF7A45]/80 shadow-md'
                        : 'bg-[#111827] border-gray-700/80 hover:border-gray-600'
                      : 'bg-[#111827]/40 border-gray-800 opacity-60'
                  }`}
                >
                  {/* Block Header Row */}
                  <div
                    className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                    onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Toggle On/Off checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleBlock(idx)
                        }}
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition shrink-0 ${
                          block.visible
                            ? 'bg-[#FF7A45] text-white'
                            : 'bg-gray-800 text-gray-500 border border-gray-700'
                        }`}
                        title="Togol Tunjuk / Sembunyi"
                      >
                        {block.visible ? '✓' : ''}
                      </button>

                      <span className="text-base shrink-0">{block.icon}</span>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                          <span>{block.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 truncate block">
                          {block.title || block.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Move Up/Down Controls & Expand arrow */}
                    <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveBlock(idx, 'up')}
                        className="w-6.5 h-6.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-20 rounded-md text-[11px] font-bold text-gray-300 flex items-center justify-center transition cursor-pointer"
                        title="Naikkan Blok Ke Atas"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.blocks.length - 1}
                        onClick={() => handleMoveBlock(idx, 'down')}
                        className="w-6.5 h-6.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-20 rounded-md text-[11px] font-bold text-gray-300 flex items-center justify-center transition cursor-pointer"
                        title="Turunkan Blok Ke Bawah"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                        className="w-6.5 h-6.5 bg-gray-800 hover:bg-gray-700 rounded-md text-xs text-gray-300 flex items-center justify-center transition cursor-pointer ml-1"
                      >
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>

                  {/* Block Expandable Customizer Details */}
                  {isExpanded && (
                    <div className="p-4 pt-2 border-t border-gray-800/80 bg-[#161F2E]/60 space-y-4 text-xs">
                      {/* 1. Warna & Gaya Bentuk */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                          🎨 Warna & Gaya Bentuk Blok
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-[#111827] p-2 rounded-xl border border-gray-700">
                            <label className="text-[10px] text-gray-400 block mb-1">Latar Blok</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={block.bgColor.startsWith('#') ? block.bgColor : '#FFFDF8'}
                                onChange={(e) => handleUpdateBlockField(idx, 'bgColor', e.target.value)}
                                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                              />
                              <input
                                type="text"
                                value={block.bgColor}
                                onChange={(e) => handleUpdateBlockField(idx, 'bgColor', e.target.value)}
                                className="w-full bg-transparent text-[10px] font-mono text-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="bg-[#111827] p-2 rounded-xl border border-gray-700">
                            <label className="text-[10px] text-gray-400 block mb-1">Warna Teks</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={block.textColor.startsWith('#') ? block.textColor : '#2B1B12'}
                                onChange={(e) => handleUpdateBlockField(idx, 'textColor', e.target.value)}
                                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                              />
                              <input
                                type="text"
                                value={block.textColor}
                                onChange={(e) => handleUpdateBlockField(idx, 'textColor', e.target.value)}
                                className="w-full bg-transparent text-[10px] font-mono text-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="bg-[#111827] p-2 rounded-xl border border-gray-700">
                            <label className="text-[10px] text-gray-400 block mb-1">Warna Border</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={block.borderColor.startsWith('#') ? block.borderColor : '#F0DEC0'}
                                onChange={(e) => handleUpdateBlockField(idx, 'borderColor', e.target.value)}
                                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                              />
                              <input
                                type="text"
                                value={block.borderColor}
                                onChange={(e) => handleUpdateBlockField(idx, 'borderColor', e.target.value)}
                                className="w-full bg-transparent text-[10px] font-mono text-white outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. Kelengkungan Sudut (Border Radius) & Shadow */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#111827] p-2.5 rounded-xl border border-gray-700">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] text-gray-400">Bentuk Sudut (Radius)</label>
                            <span className="text-[10px] font-mono text-[#FF7A45]">{block.borderRadius}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="40"
                            step="2"
                            value={block.borderRadius}
                            onChange={(e) => handleUpdateBlockField(idx, 'borderRadius', parseInt(e.target.value))}
                            className="w-full accent-[#FF7A45] cursor-pointer"
                          />
                        </div>

                        <div className="bg-[#111827] p-2.5 rounded-xl border border-gray-700">
                          <label className="text-[10px] text-gray-400 block mb-1">Gaya Bayang (Shadow)</label>
                          <select
                            value={block.shadowStyle}
                            onChange={(e) => handleUpdateBlockField(idx, 'shadowStyle', e.target.value)}
                            className="w-full bg-[#1F2937] text-white text-[11px] p-1 rounded border border-gray-600 outline-none"
                          >
                            <option value="none">Tiada Bayang</option>
                            <option value="soft">Bayang Lembut (Soft)</option>
                            <option value="glow">Bercahaya (Glow)</option>
                            <option value="glass">Kaca (Glassmorphism)</option>
                          </select>
                        </div>
                      </div>

                      {/* 3. Gambar / Banner URL */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          🖼️ Pautan Gambar / Logo / Banner
                        </label>
                        <input
                          type="text"
                          value={block.imageUrl}
                          onChange={(e) => handleUpdateBlockField(idx, 'imageUrl', e.target.value)}
                          placeholder="https://contoh.com/gambar-poster.jpg atau /mascot.png"
                          className="w-full bg-[#111827] border border-gray-700 text-xs px-3 py-2 rounded-xl text-white outline-none focus:border-[#FF7A45]"
                        />
                      </div>

                      {/* 4. Tajuk & Teks Kandungan */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                          ✍️ Teks & Kandungan Blok
                        </label>
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) => handleUpdateBlockField(idx, 'title', e.target.value)}
                          placeholder="Tajuk Blok"
                          className="w-full bg-[#111827] border border-gray-700 text-xs px-3 py-2 rounded-xl text-white outline-none focus:border-[#FF7A45]"
                        />
                        <textarea
                          rows={2}
                          value={block.subtitle}
                          onChange={(e) => handleUpdateBlockField(idx, 'subtitle', e.target.value)}
                          placeholder="Penerangan atau Sub-teks blok..."
                          className="w-full bg-[#111827] border border-gray-700 text-xs px-3 py-2 rounded-xl text-white outline-none focus:border-[#FF7A45]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: REALISTIC LIVE MOCKUP */}
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
              className="flex-1 rounded-[36px] overflow-y-auto relative text-[#2B1B12] font-sans pb-8 space-y-3"
              style={{
                backgroundColor: config.pageBgColor,
                backgroundImage: `radial-gradient(circle at 1px 1px, ${config.pageDotColor} 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            >
              {/* Render 12 Blocks in exact order */}
              {config.blocks
                .filter((b) => b.visible)
                .map((block) => {
                  const shadowClass =
                    block.shadowStyle === 'soft'
                      ? 'shadow-md'
                      : block.shadowStyle === 'glow'
                      ? 'shadow-xl'
                      : block.shadowStyle === 'glass'
                      ? 'backdrop-blur-md shadow-lg'
                      : ''

                  switch (block.id) {
                    // BLOK 1: HERO HEADER
                    case 'hero_header':
                      return (
                        <div
                          key={block.id}
                          className="relative overflow-hidden px-4 pt-4 pb-6 text-center transition-all"
                          style={{
                            backgroundColor: block.bgColor,
                            color: block.textColor,
                            borderRadius: `0 0 ${block.borderRadius}px ${block.borderRadius}px`,
                            boxShadow: `0 18px 34px -14px ${config.primaryAccent}60`,
                          }}
                        >
                          <div className="absolute w-44 h-44 rounded-full bg-white/15 -top-20 -right-12 pointer-events-none" />
                          <div className="relative z-10 flex flex-col items-center">
                            {/* Profile Avatar */}
                            <div className="w-18 h-18 rounded-full bg-white p-2 shadow-lg border-3 border-white/60 mb-2 overflow-hidden flex items-center justify-center">
                              <img
                                src={block.imageUrl || '/mascot.png'}
                                alt="Logo"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex items-center gap-1.5 justify-center font-bold text-lg font-serif">
                              <span>{block.title || 'Nama Kedai'}</span>
                              <img src="/green-checkmark-line-icon.svg" alt="Verified" className="w-4 h-4" />
                            </div>
                            <p className="text-[11px] opacity-90 mt-0.5">{block.subtitle}</p>
                          </div>
                        </div>
                      )

                    // BLOK 2: MEDIA SOSIAL
                    case 'social_links':
                      return (
                        <div key={block.id} className="flex gap-2 justify-center py-1 flex-wrap">
                          {['WhatsApp', 'Instagram', 'TikTok'].map((soc, sIdx) => (
                            <div
                              key={sIdx}
                              className="px-3 py-1 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                              style={{
                                backgroundColor: block.bgColor,
                                color: block.textColor,
                                border: `1px solid ${block.borderColor}`,
                                borderRadius: `${block.borderRadius}px`,
                              }}
                            >
                              <span>🔗</span>
                              <span>{soc}</span>
                            </div>
                          ))}
                        </div>
                      )

                    // BLOK 3: BUTANG BARISAN AKSI
                    case 'action_pills':
                      return (
                        <div key={block.id} className="flex gap-2 justify-center px-4 flex-wrap">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer"
                            style={{
                              backgroundColor: block.bgColor,
                              color: block.textColor,
                              border: `1px solid ${block.borderColor}`,
                              borderRadius: `${block.borderRadius}px`,
                            }}
                          >
                            <img src="/Google-Review.svg" alt="Review" className="w-3.5 h-3.5 object-contain" />
                            <span>Review</span>
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer"
                            style={{
                              backgroundColor: block.bgColor,
                              color: block.textColor,
                              border: `1px solid ${block.borderColor}`,
                              borderRadius: `${block.borderRadius}px`,
                            }}
                          >
                            <span>ℹ️</span>
                            <span>Cara Tebus</span>
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer"
                            style={{
                              backgroundColor: block.bgColor,
                              color: block.textColor,
                              border: `1px solid ${block.borderColor}`,
                              borderRadius: `${block.borderRadius}px`,
                            }}
                          >
                            <span>🎁</span>
                            <span>Ganjaran</span>
                          </button>
                        </div>
                      )

                    // BLOK 4: BANNER PROMOSI
                    case 'promo_banner':
                      return (
                        <div
                          key={block.id}
                          className={`mx-4 p-4 border transition-all ${shadowClass}`}
                          style={{
                            backgroundColor: block.bgColor,
                            color: block.textColor,
                            borderColor: block.borderColor,
                            borderRadius: `${block.borderRadius}px`,
                          }}
                        >
                          {block.imageUrl && (
                            <img
                              src={block.imageUrl}
                              alt="Promo"
                              className="w-full h-28 object-cover rounded-xl mb-2.5"
                            />
                          )}
                          <div className="font-bold text-xs mb-1">{block.title}</div>
                          <div className="text-[11px] leading-relaxed opacity-90">{block.subtitle}</div>
                        </div>
                      )

                    // BLOK 5: KAD COP UTAMA
                    case 'stamp_card':
                      return (
                        <div
                          key={block.id}
                          className={`mx-4 p-5 border transition-all ${shadowClass}`}
                          style={{
                            backgroundColor: block.bgColor,
                            color: block.textColor,
                            borderColor: block.borderColor,
                            borderRadius: `${block.borderRadius}px`,
                          }}
                        >
                          <div className="text-center mb-1">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#1C7A67]">
                              {block.title}
                            </div>
                            <div className="text-3xl font-bold font-serif leading-tight text-[#FF7A45] mt-0.5">
                              {config.simulatedStamps}
                              <small className="text-sm font-sans text-[#96806B]"> / {config.stampsRequired}</small>
                            </div>
                          </div>

                          {/* Perforation */}
                          <div className="flex gap-1 justify-center my-3 opacity-50">
                            {Array.from({ length: 15 }).map((_, pIdx) => (
                              <span key={pIdx} className="w-1 h-1 rounded-full bg-[#F0DEC0]" />
                            ))}
                          </div>

                          {/* Stamp Slots */}
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
                                      ? `linear-gradient(145deg, ${config.primaryAccent}, #E23F2E)`
                                      : 'rgba(255,178,56,0.08)',
                                    border: filled ? 'none' : `2px dashed #F0DEC0`,
                                    color: filled ? '#ffffff' : '#D8B98C',
                                  }}
                                >
                                  {filled ? (
                                    <img
                                      src="/icons/stamps/pastri.svg"
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

                          {/* Status text */}
                          <div className="text-center text-xs font-bold text-[#1C7A67]">
                            🎁 {block.subtitle}
                          </div>
                        </div>
                      )

                    // BLOK 6: KATALOG HADIAH
                    case 'rewards_catalog':
                      return (
                        <div
                          key={block.id}
                          className={`mx-4 p-4 border space-y-2 transition-all ${shadowClass}`}
                          style={{
                            backgroundColor: block.bgColor,
                            color: block.textColor,
                            borderColor: block.borderColor,
                            borderRadius: `${block.borderRadius}px`,
                          }}
                        >
                          <div className="font-bold text-xs mb-1">{block.title}</div>
                          {block.imageUrl && (
                            <img src={block.imageUrl} alt="Reward" className="w-full h-24 object-cover rounded-xl mb-2" />
                          )}
                          <div className="p-2.5 bg-white rounded-xl border border-[#F0DEC0] flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold">1 Kopi Panas Percuma</div>
                              <div className="text-[10px] text-[#96806B]">Pilihan Americano / Latte</div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF7A45]/15 text-[#FF7A45]">
                              5 Cop
                            </span>
                          </div>
                          <div className="p-2.5 bg-white rounded-xl border border-[#F0DEC0] flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold">1 Set Pastri & Kopi</div>
                              <div className="text-[10px] text-[#96806B]">1 Croissant + 1 Kopi Sejuk</div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF7A45]/15 text-[#FF7A45]">
                              10 Cop
                            </span>
                          </div>
                        </div>
                      )

                    // BLOK 7: GOOGLE REVIEW
                    case 'google_review':
                      return (
                        <div
                          key={block.id}
                          className={`mx-4 p-4 border flex items-center justify-between transition-all ${shadowClass}`}
                          style={{
                            backgroundColor: block.bgColor,
                            color: block.textColor,
                            borderColor: block.borderColor,
                            borderRadius: `${block.borderRadius}px`,
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">⭐</span>
                            <div>
                              <div className="font-bold text-xs">{block.title}</div>
                              <div className="text-[10px] opacity-80">{block.subtitle}</div>
                            </div>
                          </div>
                          <span className="px-3 py-1.5 text-[11px] font-bold rounded-xl text-white bg-[#FF7A45] shrink-0">
                            Review ↗
                          </span>
                        </div>
                      )

                    // BLOK 8: CARA TEBUS
                    case 'how_to_redeem':
                      return (
                        <div
                          key={block.id}
                          className={`mx-4 p-4 border text-xs space-y-2 transition-all ${shadowClass}`}
                          style={{
                            backgroundColor: block.bgColor,
                            color: block.textColor,
                            borderColor: block.borderColor,
                            borderRadius: `${block.borderRadius}px`,
                          }}
                        >
                          <div className="font-bold text-xs mb-1">{block.title}</div>
                          <div className="flex items-start gap-2 text-[11px] opacity-90">
                            <span className="font-bold text-[#FF7A45]">1.</span>
                            <span>Kumpul cop setiap pembelian di kaunter kedai.</span>
                          </div>
                          <div className="flex items-start gap-2 text-[11px] opacity-90">
                            <span className="font-bold text-[#FF7A45]">2.</span>
                            <span>Tunjukkan kod QR kepada staf untuk tebus ganjaran percuma.</span>
                          </div>
                        </div>
                      )

                    // BLOK 9: LOKASI CAWANGAN
                    case 'store_locations':
                      return (
                        <div
                          key={block.id}
                          className={`mx-4 p-4 border space-y-2 transition-all ${shadowClass}`}
                          style={{
                            backgroundColor: block.bgColor,
                            color: block.textColor,
                            borderColor: block.borderColor,
                            borderRadius: `${block.borderRadius}px`,
                          }}
                        >
                          <div className="font-bold text-xs mb-1">{block.title}</div>
                          {block.imageUrl && (
                            <img src={block.imageUrl} alt="Location" className="w-full h-24 object-cover rounded-xl mb-2" />
                          )}
                          <div className="p-2.5 bg-white rounded-xl border border-[#F0DEC0] flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold">Cawangan Utama Bangi</div>
                              <div className="text-[10px] text-[#96806B]">No 12, Jalan Medan Pusat Bandar 1</div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#FF7A45]/10 text-[#FF7A45]">
                              Maps ↗
                            </span>
                          </div>
                        </div>
                      )

                    // BLOK 10: WAKTU OPERASI
                    case 'opening_hours':
                      return (
                        <div
                          key={block.id}
                          className={`mx-4 p-4 border flex items-center gap-3 transition-all ${shadowClass}`}
                          style={{
                            backgroundColor: block.bgColor,
                            color: block.textColor,
                            borderColor: block.borderColor,
                            borderRadius: `${block.borderRadius}px`,
                          }}
                        >
                          <span className="text-2xl">🕒</span>
                          <div>
                            <div className="font-bold text-xs">{block.title}</div>
                            <div className="text-[11px] opacity-90">{block.subtitle}</div>
                          </div>
                        </div>
                      )

                    // BLOK 11: GALERI MENU
                    case 'featured_gallery':
                      return (
                        <div
                          key={block.id}
                          className={`mx-4 p-4 border space-y-2 transition-all ${shadowClass}`}
                          style={{
                            backgroundColor: block.bgColor,
                            color: block.textColor,
                            borderColor: block.borderColor,
                            borderRadius: `${block.borderRadius}px`,
                          }}
                        >
                          <div className="font-bold text-xs mb-1">{block.title}</div>
                          <div className="text-[11px] opacity-80">{block.subtitle}</div>
                          {block.imageUrl ? (
                            <img src={block.imageUrl} alt="Gallery" className="w-full h-32 object-cover rounded-xl" />
                          ) : (
                            <div className="w-full h-24 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400">
                              📷 Letak pautan gambar di tetapan blok ini
                            </div>
                          )}
                        </div>
                      )

                    // BLOK 12: FOOTER
                    case 'footer_brand':
                      return (
                        <div key={block.id} className="text-center pt-3 pb-4">
                          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#2B1B12] mb-1">
                            <img src={block.imageUrl || '/logo.svg'} alt="LajuS" className="w-3.5 h-3.5 object-contain" />
                            <span>{block.title}</span>
                          </div>
                          <div className="text-[10px] text-[#96806B] underline flex items-center justify-center gap-2">
                            <span>{block.subtitle}</span>
                          </div>
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
