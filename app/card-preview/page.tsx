'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { CardThemeConfig } from '../card-studio/page'

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

export default function CardPreviewStandalonePage() {
  const [config, setConfig] = useState<CardThemeConfig>(DEFAULT_THEME_CONFIG)
  const [simulatedCount, setSimulatedCount] = useState<number>(4)
  const [lang, setLang] = useState<'my' | 'en'>('my')

  // Modals state
  const [showHowToRedeemModal, setShowHowToRedeemModal] = useState(false)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)

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

  const percentFill = Math.min(
    100,
    Math.round((simulatedCount / config.stampsRequired) * 100)
  )
  const isFull = simulatedCount >= config.stampsRequired
  const cardRemain = Math.max(0, config.stampsRequired - simulatedCount)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start font-sans pb-12 transition-colors duration-300 relative"
      style={{
        backgroundColor: config.pageBgColor,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${config.pageDotColor} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        color: config.textColor,
      }}
    >
      {/* Floating Studio Return Button */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2 bg-black/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xl border border-white/20">
        <span>🧪 Preview Mode</span>
        <Link
          href="/card-studio"
          className="px-2.5 py-1 bg-[#FF7A45] hover:bg-[#ff682e] text-white rounded-full text-[11px] transition shadow"
        >
          🎨 Buka Editor Studio
        </Link>
      </div>

      <div className="w-full max-w-[430px] flex flex-col">
        {/* 1. HERO HEADER (EXACT LIVE /CARD DESIGN) */}
        <div
          className="relative overflow-hidden rounded-b-[34px] px-4 pt-4 pb-6 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${config.heroGradient1} 0%, ${config.heroGradient2} 55%, ${config.heroGradient3} 100%)`,
            boxShadow: `0 20px 36px -14px ${config.heroGradient1}60`,
          }}
        >
          {/* Decorative Circles */}
          <div className="absolute w-48 h-48 rounded-full bg-white/15 -top-24 -right-16 pointer-events-none" />
          <div className="absolute w-36 h-36 rounded-full bg-white/10 -bottom-18 -left-10 pointer-events-none" />

          <div className="relative z-10">
            {/* Topbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 bg-white/20 border border-white/40 rounded-full p-0.5 text-[11.5px] font-bold">
                <button
                  type="button"
                  onClick={() => setLang('my')}
                  className={`px-3 py-1 rounded-full transition ${
                    lang === 'my' ? 'bg-white text-[#FF5A45]' : 'text-white/80'
                  }`}
                >
                  MY
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 rounded-full transition ${
                    lang === 'en' ? 'bg-white text-[#FF5A45]' : 'text-white/80'
                  }`}
                >
                  EN
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="w-8.5 h-8.5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[#FFEBC2] cursor-pointer"
                  title="Kod QR Pelanggan"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="3" width="7" height="7" rx="1.2" />
                    <rect x="14" y="3" width="7" height="7" rx="1.2" />
                    <rect x="3" y="14" width="7" height="7" rx="1.2" />
                    <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
                  </svg>
                </div>
                <div
                  onClick={() => setShowLocationModal(true)}
                  className="w-8.5 h-8.5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white cursor-pointer"
                  title="Lokasi Kedai"
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
              <div className="w-19 h-19 rounded-full bg-white text-[#FF5A45] flex items-center justify-center p-2 shadow-xl border-3 border-white/60 mb-2.5 overflow-hidden">
                <img src={config.logoUrl} alt={config.storeName} className="w-full h-full object-contain" />
              </div>

              <div className="flex items-center gap-1.5 justify-center font-bold text-xl text-white font-serif">
                <span>{config.storeName}</span>
                {config.isVerified && (
                  <img src="/green-checkmark-line-icon.svg" alt="Verified" className="w-4.5 h-4.5" />
                )}
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-2 justify-center mt-2.5">
                {config.socialLinks.map((soc, idx) => (
                  <div
                    key={idx}
                    className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white text-xs hover:scale-110 transition cursor-pointer"
                  >
                    🔗
                  </div>
                ))}
              </div>

              {/* Action Pill Row */}
              <div className="flex gap-2.5 justify-center mt-4.5 flex-wrap">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="inline-flex items-center gap-1.5 bg-white text-[#1B0F09] border border-[#F0DEC0] rounded-xl px-3.5 py-2 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition"
                >
                  <img src="/Google-Review.svg" alt="Review" className="w-3.5 h-3.5 object-contain" />
                  <span>Review</span>
                </button>

                <button
                  onClick={() => setShowHowToRedeemModal(true)}
                  className="inline-flex items-center gap-1.5 bg-white text-[#1B0F09] border border-[#F0DEC0] rounded-xl px-3.5 py-2 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition"
                >
                  <span className="text-xs">ℹ️</span>
                  <span>Cara Tebus</span>
                </button>

                <button
                  onClick={() => setShowRewardsModal(true)}
                  className="inline-flex items-center gap-1.5 bg-white text-[#1B0F09] border border-[#F0DEC0] rounded-xl px-3.5 py-2 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition"
                >
                  <span className="text-xs">🎁</span>
                  <span>Ganjaran</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN CARD CONTENT */}
        <div className="p-4 pt-5">
          {/* Stamp Card */}
          <div
            className="rounded-[28px] p-6 shadow-sm border"
            style={{
              backgroundColor: config.cardBgColor,
              borderColor: config.cardBorderColor,
            }}
          >
            {/* Card Head */}
            <div className="text-center mb-1">
              <div
                className="text-[11.5px] font-extrabold uppercase tracking-wider"
                style={{ color: config.tealColor }}
              >
                {isFull ? 'KAD 1 • PENUH' : 'KAD 1 • SEDANG DIISI'}
              </div>
              <div
                className="text-4xl font-bold font-serif leading-tight mt-0.5"
                style={{ color: config.primaryColor }}
              >
                {simulatedCount}
                <small className="text-base font-sans text-[#96806B]"> / {config.stampsRequired}</small>
              </div>
            </div>

            {/* Perforation Line */}
            <div className="flex gap-1.5 justify-center my-3.5 opacity-50">
              {Array.from({ length: 15 }).map((_, pIdx) => (
                <span
                  key={pIdx}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: config.cardBorderColor }}
                />
              ))}
            </div>

            {/* Stamp Grid (5 columns) */}
            <div className="grid grid-cols-5 gap-3 mb-5">
              {Array.from({ length: config.stampsRequired }).map((_, slotIdx) => {
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
                        ? `linear-gradient(145deg, ${config.primaryColor}, #E23F2E)`
                        : 'rgba(255,178,56,0.08)',
                      border: filled ? 'none' : `2px dashed ${config.cardBorderColor}`,
                      color: filled ? '#ffffff' : '#D8B98C',
                    }}
                    title="Klik slot untuk tambah/buang cop"
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
              className="h-2.5 rounded-full overflow-hidden mb-3.5"
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

            {/* Pagination Dot */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <span
                className="w-6 h-2 rounded-full transition-all"
                style={{ backgroundColor: config.primaryColor }}
              />
            </div>
          </div>

          {/* Updated Timestamp */}
          <div className="text-center text-[11px] text-[#96806B] font-semibold mt-3.5">
            Kemaskini Terakhir: Baru-baru ini
          </div>

          {/* Footer Brand */}
          <div className="text-center mt-7">
            <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#2B1B12] mb-1">
              <img src="/logo.svg" alt="LajuS" className="w-3.5 h-3.5 object-contain" />
              <span>LajuS</span>
            </div>
            <div className="text-[10.5px] text-[#96806B] underline flex items-center justify-center gap-2">
              <span>Dasar Privasi</span>
              <span>•</span>
              <span>Padam Akaun</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {/* 1. Cara Tebus Modal */}
      {showHowToRedeemModal && (
        <div
          onClick={() => setShowHowToRedeemModal(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 anim-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-[#FFFDF8] rounded-[24px] p-6 border border-[#F0DEC0] shadow-2xl text-left"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold font-serif text-base text-[#1B0F09]">
                ℹ️ Cara Tebus Ganjaran
              </h3>
              <button
                onClick={() => setShowHowToRedeemModal(false)}
                className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-[#5A4B3D]">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FFB238] text-black font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>Kumpul cop setiap kali pembelian di kaunter.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FFB238] text-black font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>Bila kad penuh, beritahu staf kaunter untuk tebus hadiah percuma!</span>
              </div>
            </div>
            <button
              onClick={() => setShowHowToRedeemModal(false)}
              className="w-full mt-4 py-2.5 bg-[#1C7A67] text-white text-xs font-bold rounded-xl shadow-xs"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 anim-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-[#FFFDF8] rounded-[24px] p-6 border border-[#F0DEC0] shadow-2xl text-left"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold font-serif text-base text-[#1B0F09]">
                🎁 Katalog Hadiah
              </h3>
              <button
                onClick={() => setShowRewardsModal(false)}
                className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {config.rewards.map((rew) => (
                <div
                  key={rew.id}
                  className="p-3 bg-white border border-[#F0DEC0] rounded-xl flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs truncate">{rew.name}</div>
                    <div className="text-[10.5px] text-[#96806B] truncate">{rew.desc}</div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#FF7A45]/15 text-[#FF7A45] shrink-0">
                    {rew.stampsRequired} Cop
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowRewardsModal(false)}
              className="w-full mt-4 py-2.5 bg-[#1C7A67] text-white text-xs font-bold rounded-xl shadow-xs"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 anim-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-[#FFFDF8] rounded-[24px] p-6 border border-[#F0DEC0] shadow-2xl text-center relative"
          >
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
            <h3 className="font-bold font-serif text-base text-[#1B0F09] mb-1">
              ⭐ Nilai {config.storeName} di Google
            </h3>
            <p className="text-xs text-[#96806B] mb-3 leading-relaxed">
              Sentuh bintang untuk beri ulasan penilaian anda bagi {config.storeName}.
            </p>
            <div className="flex justify-center gap-1.5 text-3xl text-[#FFB238] mb-4">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            <button
              onClick={() => setShowReviewModal(false)}
              className="w-full py-2.5 bg-[#FF7A45] text-white text-xs font-bold rounded-xl shadow-xs"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 anim-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-[#FFFDF8] rounded-[24px] p-6 border border-[#F0DEC0] shadow-2xl text-left"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold font-serif text-base text-[#1B0F09]">
                📍 Lokasi Kedai
              </h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5">
              {config.locations.map((loc, idx) => (
                <div key={idx} className="p-3 bg-white border border-[#F0DEC0] rounded-xl">
                  <div className="font-bold text-xs">{loc.name}</div>
                  <div className="text-[10.5px] text-[#96806B] mb-2">{loc.address}</div>
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-3 py-1 text-[11px] font-bold bg-[#FF7A45]/10 text-[#FF7A45] rounded-lg border border-[#FF7A45]/20"
                  >
                    Buka di Google Maps ↗
                  </a>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full mt-4 py-2.5 bg-[#1C7A67] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
