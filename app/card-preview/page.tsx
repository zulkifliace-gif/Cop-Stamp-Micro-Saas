'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { CardThemeConfig } from '../card-studio/page'

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

export default function CardPreviewStandalonePage() {
  const [config, setConfig] = useState<CardThemeConfig>(DEFAULT_THEME_CONFIG)
  const [simulatedCount, setSimulatedCount] = useState<number>(4)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cop_card_studio_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          setConfig((prev) => ({ ...prev, ...parsed }))
          setSimulatedCount(parsed.simulatedStamps ?? 4)
        }
      }
    } catch {}
  }, [])

  // Pattern style
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
    <div
      className="min-h-screen flex flex-col items-center justify-start p-3 sm:p-6 transition-colors duration-300 font-sans"
      style={{
        backgroundColor: config.pageBgColor,
        color: config.textColor,
        ...getPatternStyle(),
      }}
    >
      {/* Floating Sandbox Bar */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2 bg-black/85 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl border border-white/20">
        <span>🧪 Preview Mode</span>
        <Link
          href="/card-studio"
          className="px-2.5 py-1 bg-[#FF7A45] hover:bg-[#ff682e] text-white rounded-full text-[11px] transition"
        >
          🎨 Buka Editor Studio
        </Link>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[420px] flex flex-col gap-3 py-4">
        {/* Dynamic Blocks Rendering */}
        {config.blocks
          .filter((b) => b.visible)
          .map((block) => {
            switch (block.id) {
              case 'header':
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between py-2 border-b pb-3"
                    style={{ borderColor: config.cardBorderColor }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl p-1.5 flex items-center justify-center shrink-0 shadow-xs border"
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
                        <h1 className="font-bold text-base leading-tight">{config.storeName}</h1>
                        <p className="text-xs" style={{ color: config.mutedTextColor }}>
                          {config.storeTagline}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full border shadow-xs"
                      style={{
                        backgroundColor: `${config.primaryColor}15`,
                        borderColor: `${config.primaryColor}40`,
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
                    className="p-4 rounded-2xl border shadow-xs text-left"
                    style={{
                      backgroundColor: config.cardBgColor,
                      borderColor: config.cardBorderColor,
                      borderRadius: config.borderRadius,
                    }}
                  >
                    <div className="font-bold text-sm text-[#FF7A45] mb-1">
                      {config.bannerTitle}
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: config.mutedTextColor }}>
                      {config.bannerSubtitle}
                    </div>
                  </div>
                )

              case 'card':
                return (
                  <div
                    key={block.id}
                    className="p-5 border shadow-md flex flex-col gap-3 relative overflow-hidden transition-all"
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
                          className="text-xs font-extrabold uppercase tracking-wider block"
                          style={{ color: config.primaryColor }}
                        >
                          Kad Ganjaran Digital
                        </span>
                        <span className="font-bold text-sm">{config.storeName}</span>
                      </div>
                      <span
                        className="font-mono font-bold text-xs px-3 py-1 rounded-xl"
                        style={{
                          backgroundColor: `${config.primaryColor}15`,
                          color: config.primaryColor,
                        }}
                      >
                        {simulatedCount} / {config.stampsRequired} Cop
                      </span>
                    </div>

                    {/* Stamp Slots Grid */}
                    <div
                      className="grid gap-2.5 py-3"
                      style={{
                        gridTemplateColumns: `repeat(${config.stampsRequired <= 6 ? 3 : 5}, minmax(0, 1fr))`,
                      }}
                    >
                      {Array.from({ length: config.stampsRequired }).map((_, slotIdx) => {
                        const isFilled = slotIdx < simulatedCount
                        return (
                          <div
                            key={slotIdx}
                            onClick={() =>
                              setSimulatedCount(slotIdx < simulatedCount ? slotIdx : slotIdx + 1)
                            }
                            className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                              isFilled ? 'scale-100 shadow-xs' : 'opacity-40'
                            }`}
                            style={{
                              borderColor: isFilled
                                ? config.primaryColor
                                : `${config.mutedTextColor}40`,
                              backgroundColor: isFilled
                                ? `${config.primaryColor}18`
                                : 'transparent',
                            }}
                            title="Klik slot untuk tambah/buang cop simulasi"
                          >
                            {isFilled ? (
                              <img
                                src={config.stampIcon}
                                alt="Stamp"
                                className="w-6 h-6 object-contain"
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

                    {/* Reward details in card */}
                    <div
                      className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border"
                      style={{
                        backgroundColor: `${config.primaryColor}0C`,
                        borderColor: `${config.primaryColor}30`,
                        color: config.textColor,
                      }}
                    >
                      <span className="text-base">🎁</span>
                      <span className="truncate">{config.rewardDescription}</span>
                    </div>

                    <p className="text-[10px] text-center italic" style={{ color: config.mutedTextColor }}>
                      *Tekan mana-mana slot cop di atas untuk cuba simulasi klik cop!
                    </p>
                  </div>
                )

              case 'rewards':
                return (
                  <div key={block.id} className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold px-1">
                      <span>🎁 Hadiah & Ganjaran Tersedia</span>
                      <span className="text-xs" style={{ color: config.primaryColor }}>
                        {config.rewards.length} Pilihan
                      </span>
                    </div>
                    <div className="space-y-2">
                      {config.rewards.map((rew) => (
                        <div
                          key={rew.id}
                          className="p-3.5 border rounded-2xl flex items-center justify-between gap-3 shadow-xs"
                          style={{
                            backgroundColor: config.cardBgColor,
                            borderColor: config.cardBorderColor,
                            borderRadius: Math.max(14, config.borderRadius - 6),
                          }}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs truncate">{rew.name}</div>
                            <div
                              className="text-[11px] truncate mt-0.5"
                              style={{ color: config.mutedTextColor }}
                            >
                              {rew.desc}
                            </div>
                          </div>
                          <span
                            className="text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 border"
                            style={{
                              backgroundColor: `${config.primaryColor}15`,
                              borderColor: `${config.primaryColor}30`,
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
                    className="p-4 border rounded-2xl flex items-center justify-between shadow-xs"
                    style={{
                      backgroundColor: config.cardBgColor,
                      borderColor: config.cardBorderColor,
                      borderRadius: config.borderRadius,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <div className="font-bold text-xs">Nilai {config.storeName} di Google</div>
                        <div className="text-[11px]" style={{ color: config.mutedTextColor }}>
                          Bantu kami dengan ulasan 5-bintang
                        </div>
                      </div>
                    </div>
                    <span
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-white shadow-xs cursor-pointer active:scale-95 transition"
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
                    className="p-4 border rounded-2xl text-xs space-y-2 shadow-xs"
                    style={{
                      backgroundColor: config.cardBgColor,
                      borderColor: config.cardBorderColor,
                      borderRadius: config.borderRadius,
                    }}
                  >
                    <div className="font-bold text-xs flex items-center gap-2 mb-1">
                      <span>ℹ️</span>
                      <span>Cara Mengumpul & Tebus Cop</span>
                    </div>
                    <div className="flex items-start gap-2.5" style={{ color: config.mutedTextColor }}>
                      <span className="font-bold text-[#FF7A45]">1.</span>
                      <span>Kumpul 1 cop bagi setiap perbelanjaan yang layak di kaunter kami.</span>
                    </div>
                    <div className="flex items-start gap-2.5" style={{ color: config.mutedTextColor }}>
                      <span className="font-bold text-[#FF7A45]">2.</span>
                      <span>Apabila kad penuh, tunjukkan emel / kod QR kepada staf untuk tebus hadiah percuma.</span>
                    </div>
                  </div>
                )

              case 'locations':
                return (
                  <div key={block.id} className="space-y-2 pt-1">
                    <div className="font-bold text-xs px-1">📍 Lokasi Cawangan Kedai</div>
                    {config.locations.map((loc, idx) => (
                      <div
                        key={idx}
                        className="p-3 border rounded-2xl flex items-center justify-between gap-3 shadow-xs"
                        style={{
                          backgroundColor: config.cardBgColor,
                          borderColor: config.cardBorderColor,
                          borderRadius: Math.max(14, config.borderRadius - 6),
                        }}
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{loc.name}</div>
                          <div
                            className="text-[11px] truncate mt-0.5"
                            style={{ color: config.mutedTextColor }}
                          >
                            {loc.address}
                          </div>
                        </div>
                        <a
                          href={loc.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 border hover:border-[#FF7A45] transition cursor-pointer"
                          style={{
                            backgroundColor: config.cardBgColor,
                            borderColor: config.cardBorderColor,
                            color: config.primaryColor,
                          }}
                        >
                          Maps ↗
                        </a>
                      </div>
                    ))}
                  </div>
                )

              case 'socials':
                return (
                  <div key={block.id} className="pt-2 pb-6 flex items-center justify-center gap-2 flex-wrap">
                    {config.socials.map((soc, idx) => (
                      <a
                        key={idx}
                        href={soc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 shadow-xs hover:scale-105 transition cursor-pointer"
                        style={{
                          backgroundColor: config.cardBgColor,
                          borderColor: config.cardBorderColor,
                          color: config.textColor,
                        }}
                      >
                        <span>🔗</span>
                        <span>{soc.platform}</span>
                      </a>
                    ))}
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
