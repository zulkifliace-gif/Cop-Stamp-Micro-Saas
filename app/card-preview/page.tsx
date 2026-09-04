'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { StudioConfig, CardBlockConfig } from '../card-studio/page'

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
  simulatedStamps: 4,
  stampsRequired: 10,
  blocks: DEFAULT_12_BLOCKS,
}

function sanitizeConfig(data: any): StudioConfig {
  if (!data || typeof data !== 'object') return DEFAULT_STUDIO_CONFIG

  const pageBgColor = typeof data.pageBgColor === 'string' ? data.pageBgColor : '#FFF7EA'
  const pageDotColor =
    typeof data.pageDotColor === 'string' ? data.pageDotColor : 'rgba(43,27,18,0.055)'
  const primaryAccent = typeof data.primaryAccent === 'string' ? data.primaryAccent : '#FF7A45'
  const simulatedStamps = typeof data.simulatedStamps === 'number' ? data.simulatedStamps : 4
  const stampsRequired = typeof data.stampsRequired === 'number' ? data.stampsRequired : 10

  let blocks: CardBlockConfig[] = []

  if (Array.isArray(data.blocks)) {
    const isNewFormat = data.blocks.some(
      (b: any) => b && typeof b === 'object' && b.id === 'hero_header'
    )
    if (isNewFormat) {
      blocks = data.blocks.map((b: any) => {
        const fallback =
          DEFAULT_12_BLOCKS.find((def) => def.id === b?.id) || DEFAULT_12_BLOCKS[0]
        return {
          id: b?.id || fallback.id,
          name: b?.name || fallback.name,
          icon: b?.icon || fallback.icon,
          visible: typeof b?.visible === 'boolean' ? b.visible : fallback.visible,
          bgColor: typeof b?.bgColor === 'string' ? b.bgColor : fallback.bgColor,
          textColor: typeof b?.textColor === 'string' ? b.textColor : fallback.textColor,
          borderColor: typeof b?.borderColor === 'string' ? b.borderColor : fallback.borderColor,
          borderRadius:
            typeof b?.borderRadius === 'number' ? b.borderRadius : fallback.borderRadius,
          shadowStyle: b?.shadowStyle || fallback.shadowStyle,
          imageUrl: typeof b?.imageUrl === 'string' ? b.imageUrl : (fallback.imageUrl || ''),
          title: typeof b?.title === 'string' ? b.title : fallback.title,
          subtitle: typeof b?.subtitle === 'string' ? b.subtitle : fallback.subtitle,
          extraText:
            typeof b?.extraText === 'string' ? b.extraText : (fallback.extraText || ''),
        }
      })
    } else {
      blocks = DEFAULT_12_BLOCKS
    }
  } else {
    blocks = DEFAULT_12_BLOCKS
  }

  const existingIds = new Set(blocks.map((b) => b.id))
  for (const defBlock of DEFAULT_12_BLOCKS) {
    if (!existingIds.has(defBlock.id)) {
      blocks.push(defBlock)
    }
  }

  return {
    templateName: data.templateName || 'Tema Custom 12 Blok',
    pageBgColor,
    pageDotColor,
    primaryAccent,
    simulatedStamps,
    stampsRequired,
    blocks,
  }
}

export default function CardPreviewStandalonePage() {
  const [config, setConfig] = useState<StudioConfig>(DEFAULT_STUDIO_CONFIG)
  const [simulatedCount, setSimulatedCount] = useState<number>(4)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cop_card_studio_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        const sanitized = sanitizeConfig(parsed)
        setConfig(sanitized)
        setSimulatedCount(sanitized.simulatedStamps ?? 4)
      }
    } catch {
      setConfig(DEFAULT_STUDIO_CONFIG)
    }
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start font-sans pb-12 transition-colors duration-300 relative"
      style={{
        backgroundColor: config?.pageBgColor || '#FFF7EA',
        backgroundImage: `radial-gradient(circle at 1px 1px, ${config?.pageDotColor || 'rgba(43,27,18,0.055)'} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
    >
      {/* Floating Studio Return Button */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2 bg-black/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xl border border-white/20">
        <span>🧪 Preview Mode</span>
        <Link
          href="/card-studio"
          className="px-2.5 py-1 bg-[#FF7A45] hover:bg-[#ff682e] text-white rounded-full text-[11px] transition shadow"
        >
          🧱 Buka 12 Blok Studio
        </Link>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[430px] flex flex-col space-y-3 pb-8">
        {(config?.blocks || [])
          .filter((b) => b && b.visible)
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
              // 1. HERO HEADER
              case 'hero_header':
                return (
                  <div
                    key={block.id}
                    className="relative overflow-hidden px-4 pt-4 pb-6 text-center transition-all"
                    style={{
                      backgroundColor: block.bgColor || '#FF7A45',
                      color: block.textColor || '#FFFFFF',
                      borderRadius: `0 0 ${block.borderRadius ?? 34}px ${block.borderRadius ?? 34}px`,
                      boxShadow: `0 18px 34px -14px ${config.primaryAccent || '#FF7A45'}60`,
                    }}
                  >
                    <div className="absolute w-44 h-44 rounded-full bg-white/15 -top-20 -right-12 pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-18 h-18 rounded-full bg-white p-2 shadow-lg border-3 border-white/60 mb-2 overflow-hidden flex items-center justify-center">
                        <img
                          src={block.imageUrl || '/mascot.png'}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 justify-center font-bold text-xl font-serif">
                        <span>{block.title || 'Nama Kedai'}</span>
                        <img src="/green-checkmark-line-icon.svg" alt="Verified" className="w-4.5 h-4.5" />
                      </div>
                      <p className="text-xs opacity-90 mt-0.5">{block.subtitle || ''}</p>
                    </div>
                  </div>
                )

              // 2. MEDIA SOSIAL
              case 'social_links':
                return (
                  <div key={block.id} className="flex gap-2 justify-center py-1 flex-wrap">
                    {['WhatsApp', 'Instagram', 'TikTok'].map((soc, sIdx) => (
                      <div
                        key={sIdx}
                        className="px-3 py-1 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                        style={{
                          backgroundColor: block.bgColor || 'rgba(255,255,255,0.20)',
                          color: block.textColor || '#FFFFFF',
                          border: `1px solid ${block.borderColor || 'rgba(255,255,255,0.38)'}`,
                          borderRadius: `${block.borderRadius ?? 999}px`,
                        }}
                      >
                        <span>🔗</span>
                        <span>{soc}</span>
                      </div>
                    ))}
                  </div>
                )

              // 3. BUTANG BARISAN AKSI
              case 'action_pills':
                return (
                  <div key={block.id} className="flex gap-2 justify-center px-4 flex-wrap">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                      style={{
                        backgroundColor: block.bgColor || '#FFFFFF',
                        color: block.textColor || '#1B0F09',
                        border: `1px solid ${block.borderColor || '#F0DEC0'}`,
                        borderRadius: `${block.borderRadius ?? 12}px`,
                      }}
                    >
                      <img src="/Google-Review.svg" alt="Review" className="w-3.5 h-3.5 object-contain" />
                      <span>Review</span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                      style={{
                        backgroundColor: block.bgColor || '#FFFFFF',
                        color: block.textColor || '#1B0F09',
                        border: `1px solid ${block.borderColor || '#F0DEC0'}`,
                        borderRadius: `${block.borderRadius ?? 12}px`,
                      }}
                    >
                      <span>ℹ️</span>
                      <span>Cara Tebus</span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                      style={{
                        backgroundColor: block.bgColor || '#FFFFFF',
                        color: block.textColor || '#1B0F09',
                        border: `1px solid ${block.borderColor || '#F0DEC0'}`,
                        borderRadius: `${block.borderRadius ?? 12}px`,
                      }}
                    >
                      <span>🎁</span>
                      <span>Ganjaran</span>
                    </button>
                  </div>
                )

              // 4. BANNER PROMOSI
              case 'promo_banner':
                return (
                  <div
                    key={block.id}
                    className={`mx-4 p-4 border transition-all ${shadowClass}`}
                    style={{
                      backgroundColor: block.bgColor || '#FFF3E0',
                      color: block.textColor || '#8C3B00',
                      borderColor: block.borderColor || '#FFE0B2',
                      borderRadius: `${block.borderRadius ?? 20}px`,
                    }}
                  >
                    {block.imageUrl && (
                      <img
                        src={block.imageUrl}
                        alt="Promo"
                        className="w-full h-32 object-cover rounded-xl mb-2.5"
                      />
                    )}
                    <div className="font-bold text-sm mb-1">{block.title || ''}</div>
                    <div className="text-xs leading-relaxed opacity-90">{block.subtitle || ''}</div>
                  </div>
                )

              // 5. KAD COP UTAMA
              case 'stamp_card':
                return (
                  <div
                    key={block.id}
                    className={`mx-4 p-5 border transition-all ${shadowClass}`}
                    style={{
                      backgroundColor: block.bgColor || '#FFFDF8',
                      color: block.textColor || '#2B1B12',
                      borderColor: block.borderColor || '#F0DEC0',
                      borderRadius: `${block.borderRadius ?? 28}px`,
                    }}
                  >
                    <div className="text-center mb-1">
                      <div className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#1C7A67]">
                        {block.title || 'KAD 1 • SEDANG DIISI'}
                      </div>
                      <div className="text-3xl font-bold font-serif leading-tight text-[#FF7A45] mt-0.5">
                        {simulatedCount}
                        <small className="text-sm font-sans text-[#96806B]"> / {config.stampsRequired || 10}</small>
                      </div>
                    </div>

                    {/* Perforation */}
                    <div className="flex gap-1.5 justify-center my-3.5 opacity-50">
                      {Array.from({ length: 15 }).map((_, pIdx) => (
                        <span key={pIdx} className="w-1.5 h-1.5 rounded-full bg-[#F0DEC0]" />
                      ))}
                    </div>

                    {/* Stamp Slots */}
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {Array.from({ length: config.stampsRequired || 10 }).map((_, slotIdx) => {
                        const slotNum = slotIdx + 1
                        const filled = slotNum <= simulatedCount
                        return (
                          <div
                            key={slotNum}
                            onClick={() =>
                              setSimulatedCount(filled ? slotIdx : slotNum)
                            }
                            className={`aspect-square rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              filled ? 'scale-100 shadow-md' : 'opacity-40'
                            }`}
                            style={{
                              background: filled
                                ? `linear-gradient(145deg, ${config.primaryAccent || '#FF7A45'}, #E23F2E)`
                                : 'rgba(255,178,56,0.08)',
                              border: filled ? 'none' : `2px dashed #F0DEC0`,
                              color: filled ? '#ffffff' : '#D8B98C',
                            }}
                            title="Klik slot untuk tambah/buang cop"
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
                      🎁 {block.subtitle || '1 Minuman Panas Percuma'}
                    </div>
                  </div>
                )

              // 6. KATALOG HADIAH
              case 'rewards_catalog':
                return (
                  <div
                    key={block.id}
                    className={`mx-4 p-4 border space-y-2.5 transition-all ${shadowClass}`}
                    style={{
                      backgroundColor: block.bgColor || '#FFFDF8',
                      color: block.textColor || '#2B1B12',
                      borderColor: block.borderColor || '#F0DEC0',
                      borderRadius: `${block.borderRadius ?? 20}px`,
                    }}
                  >
                    <div className="font-bold text-xs mb-1">{block.title || 'Katalog Hadiah'}</div>
                    {block.imageUrl && (
                      <img src={block.imageUrl} alt="Reward" className="w-full h-28 object-cover rounded-xl mb-2" />
                    )}
                    <div className="p-3 bg-white rounded-xl border border-[#F0DEC0] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold">1 Kopi Panas Percuma</div>
                        <div className="text-[10.5px] text-[#96806B]">Pilihan Americano / Latte</div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#FF7A45]/15 text-[#FF7A45]">
                        5 Cop
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#F0DEC0] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold">1 Set Pastri & Kopi</div>
                        <div className="text-[10.5px] text-[#96806B]">1 Croissant + 1 Kopi Sejuk</div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#FF7A45]/15 text-[#FF7A45]">
                        10 Cop
                      </span>
                    </div>
                  </div>
                )

              // 7. GOOGLE REVIEW
              case 'google_review':
                return (
                  <div
                    key={block.id}
                    className={`mx-4 p-4 border flex items-center justify-between transition-all ${shadowClass}`}
                    style={{
                      backgroundColor: block.bgColor || '#FFFDF8',
                      color: block.textColor || '#2B1B12',
                      borderColor: block.borderColor || '#F0DEC0',
                      borderRadius: `${block.borderRadius ?? 20}px`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <div className="font-bold text-xs">{block.title || 'Nilai Kami'}</div>
                        <div className="text-[11px] opacity-80">{block.subtitle || ''}</div>
                      </div>
                    </div>
                    <span className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-white bg-[#FF7A45] shrink-0">
                      Review ↗
                    </span>
                  </div>
                )

              // 8. CARA TEBUS
              case 'how_to_redeem':
                return (
                  <div
                    key={block.id}
                    className={`mx-4 p-4 border text-xs space-y-2 transition-all ${shadowClass}`}
                    style={{
                      backgroundColor: block.bgColor || '#FFFDF8',
                      color: block.textColor || '#2B1B12',
                      borderColor: block.borderColor || '#F0DEC0',
                      borderRadius: `${block.borderRadius ?? 20}px`,
                    }}
                  >
                    <div className="font-bold text-xs mb-1">{block.title || 'Cara Tebus'}</div>
                    <div className="flex items-start gap-2.5 text-xs opacity-90">
                      <span className="font-bold text-[#FF7A45]">1.</span>
                      <span>Kumpul cop setiap pembelian di kaunter kedai.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs opacity-90">
                      <span className="font-bold text-[#FF7A45]">2.</span>
                      <span>Tunjukkan kod QR kepada staf untuk tebus ganjaran percuma.</span>
                    </div>
                  </div>
                )

              // 9. LOKASI CAWANGAN
              case 'store_locations':
                return (
                  <div
                    key={block.id}
                    className={`mx-4 p-4 border space-y-2.5 transition-all ${shadowClass}`}
                    style={{
                      backgroundColor: block.bgColor || '#FFFDF8',
                      color: block.textColor || '#2B1B12',
                      borderColor: block.borderColor || '#F0DEC0',
                      borderRadius: `${block.borderRadius ?? 20}px`,
                    }}
                  >
                    <div className="font-bold text-xs mb-1">{block.title || 'Lokasi Cawangan'}</div>
                    {block.imageUrl && (
                      <img src={block.imageUrl} alt="Location" className="w-full h-28 object-cover rounded-xl mb-2" />
                    )}
                    <div className="p-3 bg-white rounded-xl border border-[#F0DEC0] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold">Cawangan Utama Bangi</div>
                        <div className="text-[10.5px] text-[#96806B]">No 12, Jalan Medan Pusat Bandar 1</div>
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-lg bg-[#FF7A45]/10 text-[#FF7A45] border border-[#FF7A45]/20">
                        Maps ↗
                      </span>
                    </div>
                  </div>
                )

              // 10. WAKTU OPERASI
              case 'opening_hours':
                return (
                  <div
                    key={block.id}
                    className={`mx-4 p-4 border flex items-center gap-3 transition-all ${shadowClass}`}
                    style={{
                      backgroundColor: block.bgColor || '#F4FAF8',
                      color: block.textColor || '#0F5C4C',
                      borderColor: block.borderColor || '#C8E6C9',
                      borderRadius: `${block.borderRadius ?? 18}px`,
                    }}
                  >
                    <span className="text-2xl">🕒</span>
                    <div>
                      <div className="font-bold text-xs">{block.title || 'Waktu Operasi'}</div>
                      <div className="text-[11px] opacity-90">{block.subtitle || ''}</div>
                    </div>
                  </div>
                )

              // 11. GALERI MENU
              case 'featured_gallery':
                return (
                  <div
                    key={block.id}
                    className={`mx-4 p-4 border space-y-2 transition-all ${shadowClass}`}
                    style={{
                      backgroundColor: block.bgColor || '#FFFDF8',
                      color: block.textColor || '#2B1B12',
                      borderColor: block.borderColor || '#F0DEC0',
                      borderRadius: `${block.borderRadius ?? 20}px`,
                    }}
                  >
                    <div className="font-bold text-xs mb-1">{block.title || 'Galeri Menu'}</div>
                    <div className="text-xs opacity-80">{block.subtitle || ''}</div>
                    {block.imageUrl ? (
                      <img src={block.imageUrl} alt="Gallery" className="w-full h-36 object-cover rounded-xl" />
                    ) : (
                      <div className="w-full h-28 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400">
                        📷 Galeri Foto Menu / Kedai
                      </div>
                    )}
                  </div>
                )

              // 12. FOOTER
              case 'footer_brand':
                return (
                  <div key={block.id} className="text-center pt-3 pb-6">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#2B1B12] mb-1">
                      <img src={block.imageUrl || '/logo.svg'} alt="LajuS" className="w-3.5 h-3.5 object-contain" />
                      <span>{block.title || 'Dikuasakan oleh LajuS'}</span>
                    </div>
                    <div className="text-[10.5px] text-[#96806B] underline flex items-center justify-center gap-2">
                      <span>{block.subtitle || 'Dasar Privasi • Padam Akaun'}</span>
                    </div>
                  </div>
                )

              default:
                return null
            }
          })}
      </div>
    </div>
  )
}
