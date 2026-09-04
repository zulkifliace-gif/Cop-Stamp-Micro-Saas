'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LiveStudioConfig,
  DEFAULT_LIVE_STUDIO_CONFIG,
  sanitizeLiveConfig,
  EditableBlockId,
  EditableBlockConfig,
  DEFAULT_4_BLOCKS,
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

  const getBlock = (id: EditableBlockId): EditableBlockConfig => {
    return config.blocks?.find((b) => b.id === id) || DEFAULT_4_BLOCKS.find((b) => b.id === id)!
  }

  const heroBlock = getBlock('hero_header')
  const profileBlock = getBlock('store_profile')
  const cardBoxBlock = getBlock('stamp_card_box')
  const progressBlock = getBlock('progress_bar')

  const totalStamps = config.simulatedStamps || 4
  const reqStamps = config.stampsRequired || 10
  const isFull = totalStamps >= reqStamps
  const remainStamps = Math.max(0, reqStamps - totalStamps)
  const percentFill = Math.min(100, Math.round((totalStamps / reqStamps) * 100))

  return (
    <div
      className="min-h-screen text-[#2B1B12] font-sans antialiased"
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
            Pratonton Halaman /card Penuh (4 Blok Tersuai)
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
        {heroBlock.visible && (
          <div
            className="relative overflow-hidden pt-6 px-4 pb-6 transition-all"
            style={{
              background: `linear-gradient(135deg, ${heroBlock.bgColor} 0%, ${heroBlock.bgColor2 || config.secondaryAccent} 100%)`,
              borderRadius: `0 0 ${heroBlock.borderRadius}px ${heroBlock.borderRadius}px`,
              boxShadow: heroBlock.shadowStyle === 'glow' ? `0 20px 36px -14px ${heroBlock.bgColor}77` : 'none',
            }}
          >
            <div className="absolute w-[190px] h-[190px] rounded-full bg-white/15 -top-20 -right-12 pointer-events-none" />
            <div className="absolute w-[130px] h-[130px] rounded-full bg-white/10 -bottom-16 -left-10 pointer-events-none" />

            {/* 2. TOPBAR (Fixed Component) */}
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

            {/* 3. STORE PROFILE (Editable Block) */}
            {profileBlock.visible && (
              <div className="relative z-10 flex flex-col items-center text-center">
                <div
                  className="w-20 h-20 rounded-full shadow-xl mb-2.5 overflow-hidden flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: profileBlock.bgColor || '#FFFFFF',
                    border: `3px solid ${profileBlock.borderColor || 'rgba(255,255,255,0.6)'}`,
                  }}
                >
                  {profileBlock.imageUrl ? (
                    <img
                      src={profileBlock.imageUrl}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src="/logo.svg" alt="LajuS" className="w-10 h-10 object-contain" />
                  )}
                </div>

                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className="font-serif font-bold text-xl leading-tight"
                    style={{ color: profileBlock.extraText || profileBlock.textColor || '#FFFFFF' }}
                  >
                    {profileBlock.title || config.storeName}
                  </span>
                  <img
                    src="/green-checkmark-line-icon.svg"
                    alt="Verified"
                    className="w-4 h-4 object-contain shrink-0"
                  />
                </div>
              </div>
            )}

            {/* 4. SOCIAL LINKS (Fixed Component) */}
            <div className="relative z-10 flex items-center justify-center gap-2 mt-3">
              {['whatsapp', 'instagram', 'tiktok', 'facebook'].map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => alert(`Pautan media sosial ${plat}`)}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition cursor-pointer"
                >
                  {renderLiveSocialIcon(plat)}
                </button>
              ))}
            </div>

            {/* 5. ACTION PILLS (Fixed Component) */}
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
                <span>Cara Penebusan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('rewards')}
                className="bg-white hover:bg-amber-50 text-[#1B0F09] font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm border border-[#F0DEC0] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-amber-500">
                  <path d="M20 12v10H4V12" />
                  <path d="M2 7h20v5H2z" />
                  <path d="M12 22V7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
                <span>Ganjaran</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. STAMP CARD BOX (Editable Block) */}
        {cardBoxBlock.visible && (
          <div className="px-4 -mt-3 relative z-20">
            <div
              className="p-5 relative transition-all"
              style={{
                backgroundColor: cardBoxBlock.bgColor || '#FFFDF8',
                borderColor: cardBoxBlock.borderColor || '#F0DEC0',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: `${cardBoxBlock.borderRadius || 28}px`,
                boxShadow:
                  cardBoxBlock.shadowStyle === 'glow'
                    ? '0 16px 36px -10px rgba(255,122,69,0.22)'
                    : cardBoxBlock.shadowStyle === 'soft'
                    ? '0 12px 32px -8px rgba(43,27,18,0.08)'
                    : 'none',
              }}
            >
              {/* VOUCHER HEADER */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 px-3 py-1 rounded-full mb-2">
                  <span className="text-xs">🎁</span>
                  <span className="text-[11px] font-extrabold text-amber-900 tracking-wide uppercase">
                    Ganjaran Lengkap
                  </span>
                </div>
                <h3 className="font-serif font-black text-lg text-[#1B0F09] leading-snug">
                  {config.rewardDesc || '1 Minuman Panas Percuma (Saiz Regular)'}
                </h3>
              </div>

              {/* PERFORATION DIVIDER LINE (Fixed Component) */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute -left-8 w-6 h-6 rounded-full bg-[#FFF7EA] border-r border-[#F0DEC0]" />
                <div className="w-full border-b-2 border-dashed border-[#F0DEC0]" />
                <div className="absolute -right-8 w-6 h-6 rounded-full bg-[#FFF7EA] border-l border-[#F0DEC0]" />
              </div>

              {/* 5-COLUMN STAMP GRID (Fixed Component with simulation) */}
              <div className="grid grid-cols-5 gap-2.5 my-4">
                {Array.from({ length: reqStamps }).map((_, idx) => {
                  const num = idx + 1
                  const isStamped = num <= totalStamps
                  const isLast = num === reqStamps

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setSelectedStampSlot(num)
                        setActiveModal('stamp_detail')
                      }}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all active:scale-95 cursor-pointer ${
                        isStamped
                          ? 'bg-gradient-to-br from-[#FFF7EA] to-[#FFE8D6] border-2 border-[#FF5A45] shadow-sm'
                          : isLast
                          ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/15 border-2 border-dashed border-amber-400/80'
                          : 'bg-white/80 border-2 border-dashed border-[#F0DEC0] hover:border-amber-300'
                      }`}
                    >
                      {isStamped ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={config.stampIcon || '/icons/stamps/makanan.svg'}
                            alt="Cop"
                            className="w-6 h-6 object-contain drop-shadow-xs"
                          />
                          <span className="text-[9px] font-black text-[#FF5A45] mt-0.5">#{num}</span>
                        </div>
                      ) : isLast ? (
                        <div className="flex flex-col items-center text-amber-700">
                          <span className="text-base">🎁</span>
                          <span className="text-[9px] font-black mt-0.5">HADIAH</span>
                        </div>
                      ) : (
                        <span className="text-xs font-black text-[#8C7A6B]/50">{num}</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* 7. PROGRESS BAR (Editable Block) */}
              {progressBlock.visible && (
                <div className="mt-4 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#8C7A6B]">Kemajuan Cop</span>
                    <span className="text-[#1B0F09]">
                      <b style={{ color: progressBlock.textColor || '#FF5A45' }}>{totalStamps}</b> / {reqStamps} Cop ({percentFill}%)
                    </span>
                  </div>

                  <div
                    className="w-full h-3.5 overflow-hidden p-0.5"
                    style={{
                      backgroundColor: progressBlock.bgColor || '#F0DEC0',
                      borderRadius: `${progressBlock.borderRadius || 6}px`,
                    }}
                  >
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${percentFill}%`,
                        background: `linear-gradient(90deg, ${progressBlock.textColor || '#FF5A45'} 0%, ${progressBlock.bgColor2 || '#FFB238'} 100%)`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 8. STATUS TEXT & ACTIONS (Fixed Component) */}
              <div className="mt-4 pt-3 border-t border-[#F0DEC0]/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-[#1B0F09]">
                    {isFull ? '🎉 Tahniah! Kad anda telah penuh!' : `Kumpul ${remainStamps} cop lagi untuk tebus ganjaran.`}
                  </p>
                  <p className="text-[10px] text-[#8C7A6B]">Tunjukkan kad ini semasa membuat pesanan</p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal('qr')}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-[#1B0F09] text-white hover:bg-black transition active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <rect x="3" y="3" width="7" height="7" rx="1.2" />
                    <rect x="14" y="3" width="7" height="7" rx="1.2" />
                    <rect x="3" y="14" width="7" height="7" rx="1.2" />
                  </svg>
                  <span>Dapatkan Cop</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 9. CARD PAGINATION DOTS (Fixed Component) */}
        <div className="flex items-center justify-center gap-1.5 my-4">
          <div className="w-6 h-2 rounded-full bg-[#FF5A45]" />
          <div className="w-2 h-2 rounded-full bg-[#F0DEC0]" />
        </div>

        {/* 10. TIMESTAMP & CADENCE INFO (Fixed Component) */}
        <div className="text-center px-4 mb-4">
          <div className="inline-flex items-center gap-1.5 bg-white/70 border border-[#F0DEC0] px-3 py-1 rounded-full text-[11px] font-semibold text-[#8C7A6B]">
            <span>⏱️ Kemaskini Terakhir: Hari ini, 2:30 PM</span>
          </div>
        </div>

        {/* 11. FOOTER (Fixed Component) */}
        <footer className="px-4 text-center mt-6">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <img src="/logo.svg" alt="LajuS" className="w-4 h-4 object-contain opacity-70" />
            <span className="text-xs font-bold text-[#8C7A6B]">Dikuasakan oleh LajuS Cop Stamp</span>
          </div>
          <p className="text-[10px] text-[#8C7A6B]/70">Kad Kesetiaan Digital Pintar untuk Peniaga</p>
        </footer>
      </div>

      {/* ============================================================ */}
      {/* AUTHENTIC INTERACTIVE MODALS                                 */}
      {/* ============================================================ */}

      {/* 1. MODAL: CARA PENEBUSAN */}
      {activeModal === 'how_to_redeem' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#F0DEC0] w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">ℹ️</span>
                <h4 className="font-serif font-black text-lg text-[#1B0F09]">Cara Penebusan</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-8 h-8 rounded-full bg-[#F0DEC0]/50 hover:bg-[#F0DEC0] text-[#1B0F09] font-bold flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#2B1B12] leading-relaxed">
              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-[#FF5A45] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <p>Buat pembelian apa-apa minuman atau set bakeri di kaunter.</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-[#FF5A45] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <p>Tunjukkan Kod QR pelanggan anda kepada staf untuk diimbas.</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-[#FF5A45] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <p>Kumpul sehingga 10 cop dan tebus ganjaran minuman percuma serta-merta!</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="mt-6 w-full py-2.5 bg-[#FF5A45] hover:bg-[#e04835] text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-md"
            >
              Faham & Tutup
            </button>
          </div>
        </div>
      )}

      {/* 2. MODAL: GANJARAN (REWARDS LIST) */}
      {activeModal === 'rewards' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#F0DEC0] w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎁</span>
                <h4 className="font-serif font-black text-lg text-[#1B0F09]">Senarai Ganjaran</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-8 h-8 rounded-full bg-[#F0DEC0]/50 hover:bg-[#F0DEC0] text-[#1B0F09] font-bold flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl shrink-0">
                  ☕
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#1B0F09]">{config.rewardDesc}</h5>
                  <p className="text-[10px] text-amber-800">Perlu {reqStamps} Cop Keseluruhan</p>
                </div>
              </div>
              <div className="p-3.5 bg-white border border-[#F0DEC0] rounded-2xl flex items-center gap-3 opacity-70">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">
                  🥐
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#1B0F09]">Diskaun 20% Pastri Hari Lahir</h5>
                  <p className="text-[10px] text-[#8C7A6B]">Ganjaran Ahli VIP Sahaja</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="mt-6 w-full py-2.5 bg-[#1B0F09] text-white rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* 3. MODAL: GOOGLE REVIEW */}
      {activeModal === 'google_review' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#F0DEC0] w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 mx-auto flex items-center justify-center mb-3">
              <img src="/Google-Review.svg" alt="Google" className="w-7 h-7 object-contain" />
            </div>
            <h4 className="font-serif font-black text-lg text-[#1B0F09] mb-1">Beri Ulasan Kami</h4>
            <p className="text-xs text-[#8C7A6B] mb-4">
              Sokong <b>{config.storeName}</b> dengan meninggalkan ulasan 5-bintang di Google Maps!
            </p>
            <div className="flex items-center justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`text-2xl transition hover:scale-125 cursor-pointer ${
                    star <= reviewRating ? 'text-amber-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1B0F09] rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Nanti Dulu
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Membuka halaman Google Review...')
                  setActiveModal('none')
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-md"
              >
                Beri Ulasan ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: LOKASI CAWANGAN */}
      {activeModal === 'locations' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#F0DEC0] w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <h4 className="font-serif font-black text-lg text-[#1B0F09]">Cawangan Kami</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-8 h-8 rounded-full bg-[#F0DEC0]/50 hover:bg-[#F0DEC0] text-[#1B0F09] font-bold flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 bg-white border border-[#F0DEC0] rounded-2xl">
                <h5 className="font-bold text-xs text-[#1B0F09] mb-1">Cawangan Utama (Bangsar)</h5>
                <p className="text-[11px] text-[#8C7A6B] leading-relaxed mb-2.5">
                  No 12, Jalan Telawi 3, Bangsar Baru, 59100 Kuala Lumpur.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => alert('Membuka Google Maps')}
                    className="flex-1 py-1.5 bg-[#FFF7EA] text-[#FF5A45] border border-[#FF5A45]/30 rounded-lg text-[10px] font-bold transition hover:bg-[#FFE8D6] cursor-pointer"
                  >
                    Google Maps
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Membuka Waze')}
                    className="flex-1 py-1.5 bg-[#FFF7EA] text-[#FF5A45] border border-[#FF5A45]/30 rounded-lg text-[10px] font-bold transition hover:bg-[#FFE8D6] cursor-pointer"
                  >
                    Waze
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="mt-5 w-full py-2.5 bg-[#1B0F09] text-white rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* 5. MODAL: QR PELANGGAN */}
      {activeModal === 'qr' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#F0DEC0] w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif font-black text-lg text-[#1B0F09]">Kod QR Anda</h4>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-8 h-8 rounded-full bg-[#F0DEC0]/50 hover:bg-[#F0DEC0] text-[#1B0F09] font-bold flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-white border-2 border-dashed border-[#F0DEC0] rounded-2xl inline-block mb-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CARD-PREVIEW-CUSTOMER-01`}
                alt="QR Code"
                className="w-44 h-44 object-contain mx-auto"
              />
            </div>
            <p className="text-xs font-bold text-[#1B0F09]">ID Ahli: #CS-88392</p>
            <p className="text-[11px] text-[#8C7A6B] mt-1">Tunjukkan kod ini kepada juruwang semasa membuat bayaran.</p>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="mt-5 w-full py-2.5 bg-[#FF5A45] hover:bg-[#e04835] text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-md"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* 6. MODAL: DETAIL SLOT COP */}
      {activeModal === 'stamp_detail' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#F0DEC0] w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 mx-auto flex items-center justify-center mb-3">
              {selectedStampSlot <= totalStamps ? (
                <img
                  src={config.stampIcon || '/icons/stamps/makanan.svg'}
                  alt="Cop"
                  className="w-9 h-9 object-contain"
                />
              ) : selectedStampSlot === reqStamps ? (
                <span className="text-3xl">🎁</span>
              ) : (
                <span className="text-2xl font-black text-amber-800">#{selectedStampSlot}</span>
              )}
            </div>
            <h4 className="font-serif font-black text-lg text-[#1B0F09] mb-1">
              {selectedStampSlot <= totalStamps
                ? `Cop #${selectedStampSlot} Diterima`
                : selectedStampSlot === reqStamps
                ? `Ganjaran #${selectedStampSlot}: ${config.rewardDesc}`
                : `Slot Cop #${selectedStampSlot}`}
            </h4>
            <p className="text-xs text-[#8C7A6B] mb-5">
              {selectedStampSlot <= totalStamps
                ? 'Cop ini telah berjaya disahkan oleh juruwang.'
                : selectedStampSlot === reqStamps
                ? 'Lengkapkan cop untuk membuka penebusan ganjaran istimewa ini.'
                : 'Buat pembelian untuk mendapatkan cop seterusnya.'}
            </p>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="w-full py-2.5 bg-[#1B0F09] text-white rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
