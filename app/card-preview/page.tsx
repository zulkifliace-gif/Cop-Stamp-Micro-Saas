'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LiveStudioConfig,
  DEFAULT_LIVE_STUDIO_CONFIG,
  sanitizeLiveConfig,
  LiveBlockId,
  LiveBlockConfig,
} from '../card-studio/page'

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

export default function LiveCardPreviewPage() {
  const [config, setConfig] = useState<LiveStudioConfig>(DEFAULT_LIVE_STUDIO_CONFIG)
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
      console.error('Error loading config in preview:', e)
    }
  }, [])

  const getBlock = (id: LiveBlockId): LiveBlockConfig => {
    return config.blocks.find((b) => b.id === id) || DEFAULT_LIVE_STUDIO_CONFIG.blocks.find((b) => b.id === id)!
  }

  const totalStamps = config.simulatedStamps
  const reqStamps = config.stampsRequired
  const isFull = totalStamps >= reqStamps
  const remainStamps = Math.max(0, reqStamps - totalStamps)
  const percentFill = Math.min(100, Math.round((totalStamps / reqStamps) * 100))

  return (
    <div
      className="min-h-screen text-[#2B1B12] font-jakarta"
      style={{
        backgroundColor: config.pageBgColor,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${config.pageDotColor} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
    >
      {/* FLOATING TOP BAR FOR PREVIEW NAVIGATION */}
      <div className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur border-b border-gray-800 px-4 py-2.5 flex items-center justify-between text-white">
        <Link
          href="/card-studio"
          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
        >
          <span>← Kembali ke Card Studio</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-300 font-semibold hidden sm:inline">
            Pratonton Halaman /card Penuh
          </span>
          <Link
            href="/card"
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition"
          >
            Buka /card Sebenar
          </Link>
        </div>
      </div>

      {/* CARD MAIN APP WRAPPER (430PX MAX WIDTH LIKE PRODUCTION) */}
      <div className="w-full max-w-[430px] mx-auto pb-12">
        {/* 1. HERO HEADER */}
        {getBlock('hero_header').visible && (
          <div
            className="relative overflow-hidden pt-6 px-4 pb-6 transition-all"
            style={{
              background: `linear-gradient(135deg, ${getBlock('hero_header').bgColor} 0%, ${getBlock('hero_header').bgColor2 || config.secondaryAccent} 100%)`,
              borderRadius: `0 0 ${getBlock('hero_header').borderRadius}px ${getBlock('hero_header').borderRadius}px`,
              boxShadow: getBlock('hero_header').shadowStyle === 'glow' ? `0 20px 36px -14px ${getBlock('hero_header').bgColor}77` : 'none',
            }}
          >
            <div className="absolute w-[190px] h-[190px] rounded-full bg-white/15 -top-20 -right-12 pointer-events-none" />
            <div className="absolute w-[130px] h-[130px] rounded-full bg-white/10 -bottom-16 -left-10 pointer-events-none" />

            {/* 2. TOPBAR */}
            {getBlock('topbar').visible && (
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="flex items-center gap-0.5 bg-white/20 border border-white/30 rounded-full p-0.5 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => setActiveLang('my')}
                    className={`text-[11.5px] font-bold px-3 py-1 rounded-full transition cursor-pointer ${
                      activeLang === 'my' ? 'bg-white text-[#FF5A45]' : 'text-white/80'
                    }`}
                  >
                    MY
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLang('en')}
                    className={`text-[11.5px] font-bold px-3 py-1 rounded-full transition cursor-pointer ${
                      activeLang === 'en' ? 'bg-white text-[#FF5A45]' : 'text-white/80'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <div className="flex items-center gap-2">
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
                    onClick={() => window.location.reload()}
                    className="w-8 h-8 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
                    title="Segarkan data"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* 3. STORE PROFILE */}
            {getBlock('store_profile').visible && (
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-white shadow-xl border-[3px] border-white/60 mb-2.5 overflow-hidden flex items-center justify-center shrink-0">
                  {getBlock('store_profile').imageUrl ? (
                    <img
                      src={getBlock('store_profile').imageUrl}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src="/logo.svg" alt="LajuS" className="w-10 h-10 object-contain" />
                  )}
                </div>

                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-serif font-bold text-xl text-white leading-tight">
                    {getBlock('store_profile').title || config.storeName}
                  </span>
                  <img
                    src="/green-checkmark-line-icon.svg"
                    alt="Verified"
                    className="w-4 h-4 object-contain shrink-0"
                  />
                </div>
              </div>
            )}

            {/* 4. SOCIAL LINKS */}
            {getBlock('social_links').visible && (
              <div className="relative z-10 flex items-center justify-center gap-2 mt-3">
                {['whatsapp', 'instagram', 'tiktok', 'facebook'].map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => alert(`Buka pautan ${plat}`)}
                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition cursor-pointer"
                  >
                    {renderLiveSocialIcon(plat)}
                  </button>
                ))}
              </div>
            )}

            {/* 5. ACTION PILLS */}
            {getBlock('action_pills').visible && (
              <div className="relative z-10 flex items-center justify-center gap-2 mt-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveModal('google_review')}
                  className="bg-white hover:bg-amber-50 text-[#1B0F09] font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm border border-[#F0DEC0] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <img src="/Google-Review.svg" alt="Review" className="w-4 h-4 object-contain" />
                  <span>Review</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('how_to_redeem')}
                  className="bg-white hover:bg-amber-50 text-[#1B0F09] font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm border border-[#F0DEC0] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-[#FF5A45]">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>Cara Tebus</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal('rewards')}
                  className="bg-white hover:bg-amber-50 text-[#1B0F09] font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm border border-[#F0DEC0] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3.5 h-3.5 text-[#FF5A45]">
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                  </svg>
                  <span>Ganjaran</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 6. CONTENT BELOW HERO */}
        <div className="px-4 pt-4 space-y-3.5">
          {/* 6.1 MULTI-STORE TABS */}
          {getBlock('store_tabs').visible && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                className="bg-[#FF5A45] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs shrink-0 flex items-center gap-1.5"
              >
                <span>{config.storeName}</span>
                <span className="bg-white/30 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {totalStamps} cop
                </span>
              </button>
              <button
                type="button"
                className="bg-[#FFFDF8] text-[#96806B] border border-[#F0DEC0] text-xs font-bold px-3.5 py-1.5 rounded-full shrink-0 flex items-center gap-1.5"
              >
                <span>Cawangan Bangi</span>
                <span className="bg-[#FF5A45]/15 text-[#FF5A45] text-[10px] px-2 py-0.5 rounded-full">
                  2 cop
                </span>
              </button>
            </div>
          )}

          {/* 6.2 MAIN STAMP CARD CONTAINER */}
          {getBlock('stamp_card_box').visible && (
            <div
              className="p-6 text-[#2B1B12] transition-all"
              style={{
                backgroundColor: getBlock('stamp_card_box').bgColor,
                borderColor: getBlock('stamp_card_box').borderColor,
                borderRadius: `${getBlock('stamp_card_box').borderRadius}px`,
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: '0 10px 30px rgba(43,27,18,0.06)',
              }}
            >
              {/* 7. HEAD */}
              {getBlock('stamp_card_head').visible && (
                <div className="text-center mb-1">
                  <div
                    className="text-xs font-extrabold uppercase tracking-wider mb-0.5"
                    style={{ color: getBlock('stamp_card_head').textColor }}
                  >
                    {isFull
                      ? activeLang === 'en'
                        ? 'CARD 1 • FULL'
                        : 'KAD 1 • PENUH'
                      : activeLang === 'en'
                      ? 'CARD 1 • IN PROGRESS'
                      : 'KAD 1 • SEDANG DIISI'}
                  </div>
                  <div
                    className="font-serif font-bold text-4xl leading-none"
                    style={{ color: getBlock('stamp_card_head').extraText || '#FF5A45' }}
                  >
                    {totalStamps} <small className="text-base font-normal text-[#96806B]">/ {reqStamps}</small>
                  </div>
                </div>
              )}

              {/* 8. PERFORATION */}
              {getBlock('perforation_divider').visible && (
                <div className="flex items-center justify-center gap-1.5 my-3.5 opacity-60">
                  {Array.from({ length: 15 }).map((_, pIdx) => (
                    <span
                      key={pIdx}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: getBlock('perforation_divider').bgColor }}
                    />
                  ))}
                </div>
              )}

              {/* 9. STAMP GRID (5-COLUMNS) */}
              {getBlock('stamp_grid').visible && (
                <div className="grid grid-cols-5 gap-2.5 my-3.5">
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
                          isStampFilled ? 'shadow-md' : 'border-2 border-dashed'
                        }`}
                        style={{
                          background: isStampFilled
                            ? `linear-gradient(145deg, ${getBlock('stamp_grid').bgColor}, ${getBlock('stamp_grid').bgColor2 || '#E23F2E'})`
                            : 'rgba(255,178,56,0.08)',
                          borderColor: isStampFilled
                            ? 'transparent'
                            : getBlock('stamp_grid').borderColor,
                          color: getBlock('stamp_grid').textColor,
                        }}
                        title={`Cop #${slotNum}`}
                      >
                        {isStampFilled ? (
                          <img
                            src={getBlock('stamp_grid').imageUrl || '/icons/stamps/makanan.svg'}
                            alt="Cop"
                            className="w-[52%] h-[52%] object-contain"
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                        ) : (
                          <span className="font-bold text-sm">{slotNum}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* 10. PROGRESS BAR */}
              {getBlock('progress_bar').visible && (
                <div
                  className="h-2.5 rounded-full overflow-hidden my-3.5"
                  style={{ backgroundColor: getBlock('progress_bar').bgColor }}
                >
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${percentFill}%`,
                      background: 'linear-gradient(90deg, #FF5A45, #FFB238)',
                    }}
                  />
                </div>
              )}

              {/* 11. STATUS TEXT */}
              {getBlock('status_text').visible && (
                <div
                  className="text-center font-bold text-xs sm:text-sm leading-snug my-2.5"
                  style={{ color: getBlock('status_text').textColor }}
                >
                  {isFull ? (
                    <span>🎉 Lengkap! Tebus ganjaran sekarang: <b>{config.rewardDesc}</b></span>
                  ) : (
                    <span>
                      Lagi <b style={{ color: getBlock('status_text').extraText || '#E23F2E' }}>{remainStamps}</b> cop untuk: {config.rewardDesc}
                    </span>
                  )}
                </div>
              )}

              {/* 12. CARD DOTS */}
              {getBlock('card_dots').visible && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="w-6 h-2 rounded-full bg-[#FF5A45]" />
                  <span className="w-2 h-2 rounded-full bg-[#F0DEC0]" />
                </div>
              )}
            </div>
          )}

          {/* 13. UPDATED TIMESTAMP */}
          {getBlock('updated_timestamp').visible && (
            <div
              className="text-center font-semibold text-[11px]"
              style={{ color: getBlock('updated_timestamp').textColor }}
            >
              Kemas kini: 8:45 PM, Hari Ini
            </div>
          )}

          {/* 14. FOOTER BRAND */}
          {getBlock('footer_brand').visible && (
            <div className="text-center pt-3 space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 font-extrabold text-sm text-[#2B1B12]">
                <img src="/logo.svg" alt="LajuS" className="w-4 h-4 object-contain" />
                <span>LajuS</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-[#96806B]">
                <a href="#privacy" className="underline">Dasar Privasi</a>
                <span>•</span>
                <a href="#delete" className="underline text-red-500">Padam Akaun</a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INTERACTIVE MODAL OVERLAYS */}
      {activeModal !== 'none' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal('none')}
        >
          {/* HOW TO REDEEM */}
          {activeModal === 'how_to_redeem' && (
            <div
              className="w-full max-w-sm bg-[#FFFDF8] text-[#2B1B12] rounded-3xl p-6 border border-[#F0DEC0] shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/5 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                &times;
              </button>
              <div className="flex items-center gap-2 mb-2 font-serif font-bold text-xl text-[#1B0F09]">
                <span>💡</span>
                <span>Cara Mengumpul & Tebus</span>
              </div>
              <p className="text-xs text-[#96806B] mb-4">Ikuti 3 langkah mudah ini:</p>
              <div className="space-y-3 text-xs text-[#3C2E24]">
                <div className="flex gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#FFB238] text-black font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <span>Kumpul cop setiap kali pembelian di kaunter kedai.</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#FFB238] text-black font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <span>Bila kad penuh ({reqStamps}/{reqStamps}), tunjukkan skrin ini kepada kakitangan.</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#FFB238] text-black font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <span>Kakitangan sahkan dan serahkan ganjaran percuma anda serta-merta!</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-full mt-5 py-3 rounded-xl bg-[#1C7A67] text-white font-bold text-xs cursor-pointer"
              >
                Faham & Tutup
              </button>
            </div>
          )}

          {/* REWARDS */}
          {activeModal === 'rewards' && (
            <div
              className="w-full max-w-sm bg-[#FFFDF8] text-[#2B1B12] rounded-3xl overflow-hidden border border-[#F0DEC0] shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur text-gray-700 flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm"
              >
                &times;
              </button>
              <div className="h-52 bg-[#FFF7EA] flex items-center justify-center relative border-b border-[#F0DEC0]">
                <span className="text-6xl">🎁</span>
                <div className="absolute top-3.5 left-3.5 bg-[#FF5A45] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Perlu {reqStamps} Cop
                </div>
              </div>
              <div className="p-5 text-center">
                <h4 className="font-serif font-bold text-lg text-[#1B0F09] mb-1.5">
                  {config.rewardDesc}
                </h4>
                <p className="text-xs text-[#96806B] mb-4">
                  Tebus ganjaran istimewa ini sebaik sahaja kad anda mencukupi {reqStamps} cop penuh!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="w-full py-3 rounded-xl bg-[#1C7A67] text-white font-bold text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          {/* GOOGLE REVIEW */}
          {activeModal === 'google_review' && (
            <div
              className="w-full max-w-sm bg-[#FFFDF8] text-[#2B1B12] rounded-3xl p-6 border border-[#F0DEC0] shadow-2xl text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/5 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                &times;
              </button>
              <div className="font-serif font-bold text-lg text-[#1B0F09] mb-1">
                ⭐ Nilai {config.storeName} di Google
              </div>
              <p className="text-xs text-[#96806B] mb-4">
                Sentuh bintang untuk bantu beri ulasan bagi kedai ini.
              </p>
              <div className="flex items-center justify-center gap-2 text-3xl my-3">
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
              <div className="text-xs text-[#96806B] mt-2 mb-4">
                {reviewRating > 0 ? `Rating ${reviewRating} bintang dipilih!` : '5 bintang amat kami hargai!'}
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-full py-2.5 rounded-xl bg-white border border-[#F0DEC0] text-[#5A4B3D] font-bold text-xs cursor-pointer"
              >
                Mungkin Nanti
              </button>
            </div>
          )}

          {/* LOCATIONS */}
          {activeModal === 'locations' && (
            <div
              className="w-full max-w-sm bg-[#FFFDF8] text-[#2B1B12] rounded-3xl p-6 border border-[#F0DEC0] shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/5 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                &times;
              </button>
              <div className="flex items-center gap-2 mb-1 font-serif font-bold text-lg text-[#1B0F09]">
                <span>📍</span>
                <span>Lokasi Cawangan</span>
              </div>
              <p className="text-xs text-[#96806B] mb-4">{config.storeName}</p>
              <div className="bg-white p-4 rounded-2xl border border-[#F0DEC0] text-xs space-y-1.5 mb-4">
                <div className="font-bold text-[#1B0F09]">Cawangan Utama</div>
                <div className="text-gray-600">No. 12, Jalan Niaga 3, 43650 Bandar Baru Bangi, Selangor</div>
              </div>
              <button
                type="button"
                onClick={() => alert('Membuka Peta Google Maps')}
                className="w-full py-3 rounded-xl bg-[#1C7A67] text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Buka di Google Maps</span>
                <span>↗</span>
              </button>
            </div>
          )}

          {/* QR */}
          {activeModal === 'qr' && (
            <div
              className="w-full max-w-sm bg-[#FFFDF8] text-[#2B1B12] rounded-3xl p-6 border border-[#F0DEC0] shadow-2xl text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/5 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                &times;
              </button>
              <div className="font-serif font-bold text-lg text-[#1B0F09] mb-1">
                📱 Kod QR Pelanggan
              </div>
              <p className="text-xs text-[#96806B] mb-4">
                Tunjukkan kod QR ini kepada staf kedai untuk mengimbas cop.
              </p>
              <div className="w-40 h-40 mx-auto bg-white p-3 rounded-2xl border border-[#F0DEC0] flex items-center justify-center shadow-inner mb-4">
                <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center text-white text-xs font-mono">
                  [QR DEMO]
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold py-2 px-3.5 rounded-xl mb-4">
                pelanggan@gmail.com
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-full py-2.5 rounded-xl bg-[#1C7A67] text-white font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          )}

          {/* STAMP DETAIL */}
          {activeModal === 'stamp_detail' && (
            <div
              className="w-full max-w-sm bg-[#FFFDF8] text-[#2B1B12] rounded-3xl p-6 border border-[#F0DEC0] shadow-2xl text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/5 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                &times;
              </button>
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center shadow-md"
                style={{
                  background: selectedStampSlot <= totalStamps
                    ? 'linear-gradient(145deg, #FF5A45, #E23F2E)'
                    : '#F0DEC0',
                }}
              >
                <img
                  src="/icons/stamps/makanan.svg"
                  alt="Stamp"
                  className="w-8 h-8 object-contain"
                  style={{ filter: selectedStampSlot <= totalStamps ? 'brightness(0) invert(1)' : 'none' }}
                />
              </div>
              <div className="font-serif font-bold text-lg text-[#1B0F09] mb-0.5">
                Cop #{selectedStampSlot} — Kad 1
              </div>
              <p className="text-xs text-[#96806B] mb-4">{config.storeName}</p>
              <div className="bg-white p-3.5 rounded-xl border border-[#F0DEC0] text-xs text-left space-y-1.5 mb-4">
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
                className="w-full py-2.5 rounded-xl bg-[#1C7A67] text-white font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
