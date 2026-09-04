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
  HeroHeaderPattern,
  STORE_FONT_OPTIONS,
  CardBoxMaterialTexture,
  ProgressBarRenderer,
  normalizeStampIcon,
} from '../card-studio/page'

function renderLiveSocialIcon(platform: string) {
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
    default:
      return (
        <svg viewBox="0 0 24 24" fill="#ffffff" style={{ width: 13, height: 13, color: '#ffffff' }}>
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.14 0-.36.05-.54.26-.19.2-.72.7-.72 1.72s.74 1.99.85 2.13c.11.15 1.45 2.22 3.52 3.11.49.21.88.34 1.18.44.5.16.95.14 1.31.08.4-.06 1.22-.5 1.39-.98.17-.49.17-.91.12-.99-.05-.08-.19-.14-.4-.25s-1.22-.6-1.41-.67c-.19-.07-.33-.1-.47.11s-.54.67-.67.81-.24.16-.45.05c-.21-.11-.89-.33-1.69-1.05-.62-.56-1.05-1.25-1.17-1.46s-.01-.32.09-.43c.1-.1.21-.24.32-.36.1-.12.14-.2.21-.34.07-.14.04-.26-.02-.37s-.47-1.14-.65-1.56c-.17-.41-.35-.35-.48-.36z" />
        </svg>
      )
  }
}

export default function LiveCardPreviewPage() {
  const [config, setConfig] = useState<LiveStudioConfig>(DEFAULT_LIVE_STUDIO_CONFIG)
  const [activeLang, setActiveLang] = useState<'my' | 'en'>('my')

  // Interactive modals
  const [activeModal, setActiveModal] = useState<
    'none' | 'how_to_redeem' | 'rewards' | 'google_review' | 'locations' | 'qr' | 'stamp_detail'
  >('none')
  const [selectedStampSlot, setSelectedStampSlot] = useState<number>(1)
  const [reviewRating, setReviewRating] = useState<number>(0)

  const [targetTemplateId, setTargetTemplateId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      const tid = searchParams?.get('templateId') || (typeof window !== 'undefined' ? localStorage.getItem('cop_card_studio_template_id') : null) || null
      setTargetTemplateId(tid)

      const savedLang = localStorage.getItem('lajus_lang')
      if (savedLang === 'en' || savedLang === 'my') {
        setActiveLang(savedLang)
      }

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

  // Selected global font
  const activeFont = STORE_FONT_OPTIONS.find((f) => f.id === (profileBlock.fontId || 'fraunces')) || STORE_FONT_OPTIONS[0]
  const currentFontFamily = activeFont.fontFamily

  const totalStamps = config.simulatedStamps || 4
  const reqStamps = config.stampsRequired || 10
  const isFull = totalStamps >= reqStamps
  const remainStamps = Math.max(0, reqStamps - totalStamps)
  const percentFill = Math.min(100, Math.round((totalStamps / reqStamps) * 100))

  return (
    <div
      className="min-h-screen text-[#2B1B12] font-sans antialiased"
      style={{
        backgroundColor: config.pageBgColor || '#FFF7EA',
        backgroundImage: `radial-gradient(circle at 1px 1px, ${config.pageDotColor || 'rgba(43,27,18,0.055)'} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
    >
      {/* SCOPED COMPONENT STYLES FAITHFULLY TRANSLATED FROM LIVE /card */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700;800&family=Comfortaa:wght@700&family=Dancing+Script:wght@700&family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Montserrat:wght@600;700;800&family=Pacifico&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Poppins:wght@500;600;700;800&family=Quicksand:wght@600;700&display=swap');

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

        .card-app {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          padding-bottom: 44px;
        }

        .card-app .store-name {
          font-family: var(--store-font, 'Fraunces', serif) !important;
          font-weight: 700 !important;
        }

        .card-app .avatar {
          font-family: var(--store-font, 'Fraunces', serif) !important;
          font-weight: 700 !important;
        }

        .card-app .stamp-card-head .count {
          font-family: var(--store-font, 'Fraunces', serif) !important;
          font-weight: 700 !important;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: 16px 16px 26px;
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
          cursor: pointer;
        }
        .social-btn:hover {
          transform: scale(1.08);
          background: rgba(255,255,255,0.32);
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

        .card-content {
          padding: 18px 16px 0;
        }

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

        .updated-text {
          text-align: center;
          margin-top: 12px;
          font-size: 10.5px;
          color: var(--muted);
          font-weight: 600;
        }

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

        .modal-body, .modal-body * {
          font-family: var(--card-font, 'Plus Jakarta Sans'), sans-serif !important;
        }
      ` }} />

      {/* FLOATING TOP BAR FOR PREVIEW NAVIGATION */}
      <div className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur border-b border-gray-800 px-4 py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          {/* BUTANG BACK GUNA ICON SAHAJA */}
          <Link
            href={targetTemplateId ? `/card-studio?templateId=${encodeURIComponent(targetTemplateId)}` : '/card-studio'}
            className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center transition border border-gray-700 cursor-pointer active:scale-95"
            title="Kembali ke Card Studio"
            aria-label="Back to Card Studio"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-xs font-semibold text-gray-300">
            {config.storeName || 'Pratonton Kad'}
          </span>
        </div>
      </div>

      {/* CARD MAIN APP CONTAINER (IDENTICAL TO /card WITH FULL-PAGE TYPOGRAPHY) */}
      <div
        className="card-app"
        style={{
          '--store-font': currentFontFamily,
          '--card-font': currentFontFamily,
        } as React.CSSProperties}
      >
        {/* 1. HERO HEADER */}
        {heroBlock.visible && (
          <div
            className="hero"
            style={{
              background: `linear-gradient(135deg, ${heroBlock.bgColor || '#FF7A45'} 0%, ${heroBlock.bgColor2 || '#FFC24D'} 100%)`,
              borderRadius: `0 0 ${heroBlock.borderRadius ?? 34}px ${heroBlock.borderRadius ?? 34}px`,
              boxShadow: heroBlock.shadowStyle === 'glow' ? `0 20px 36px -14px ${heroBlock.bgColor || '#FF7A45'}77` : '0 20px 36px -14px rgba(226,63,46,0.45)',
            }}
          >
            {/* CORAK MOTIF WATERMARK */}
            <HeroHeaderPattern
              pattern={heroBlock.pattern || 'bubbles'}
              opacity={heroBlock.patternOpacity ?? 0.25}
            />

            <div className="hero-inner">
              {/* TOPBAR */}
              <div className="topbar">
                <div className="lang-toggle">
                  <button
                    type="button"
                    className={activeLang === 'my' ? 'active' : ''}
                    onClick={() => setActiveLang('my')}
                  >
                    MY
                  </button>
                  <button
                    type="button"
                    className={activeLang === 'en' ? 'active' : ''}
                    onClick={() => setActiveLang('en')}
                  >
                    EN
                  </button>
                </div>

                <div className="top-actions">
                  <button
                    type="button"
                    className="icon-btn gold"
                    title="Kod QR Pelanggan"
                    onClick={() => setActiveModal('qr')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1.2" />
                      <rect x="14" y="3" width="7" height="7" rx="1.2" />
                      <rect x="3" y="14" width="7" height="7" rx="1.2" />
                      <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="icon-btn"
                    title="Lokasi Cawangan"
                    onClick={() => setActiveModal('locations')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="icon-btn"
                    title="Segarkan data"
                    onClick={() => window.location.reload()}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="icon-btn"
                    title="Log keluar"
                    onClick={() => alert('Simulator: Log keluar')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 2. STORE PROFILE */}
              {profileBlock.visible && (
                <div className="profile">
                  {profileBlock.showLogo !== false && (
                    <div
                      className="avatar"
                      style={{
                        backgroundColor: profileBlock.bgColor || '#FFFFFF',
                        borderColor: profileBlock.borderColor || 'rgba(255,255,255,0.55)',
                      }}
                    >
                      {profileBlock.imageUrl ? (
                        <img src={profileBlock.imageUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full p-2.5 bg-white flex items-center justify-center">
                          <img src="/logo.svg" alt="LajuS" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="store-name">
                    <span
                      style={{
                        color: profileBlock.textColor || '#FFFFFF',
                      }}
                    >
                      {config.storeName}
                    </span>
                    <span className="verified-badge">
                      <img src="/green-checkmark-line-icon.svg" alt="Verified" className="w-4 h-4 object-contain" />
                    </span>
                  </div>

                  {/* SOCIALS */}
                  <div className="socials">
                    {['whatsapp', 'instagram', 'tiktok', 'facebook'].map((plat) => (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => alert(`Pautan media sosial ${plat}`)}
                        className="social-btn"
                        title={plat}
                      >
                        {renderLiveSocialIcon(plat)}
                      </button>
                    ))}
                  </div>

                  {/* PILL ROW */}
                  <div className="pill-row">
                    <button
                      type="button"
                      className="pill-btn"
                      onClick={() => setActiveModal('google_review')}
                    >
                      <img src="/Google-Review.svg" alt="Review" className="w-3.5 h-3.5 object-contain" />
                      <span>Review</span>
                    </button>
                    <button
                      type="button"
                      className="pill-btn"
                      onClick={() => setActiveModal('how_to_redeem')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span>Cara Tebus</span>
                    </button>
                    <button
                      type="button"
                      className="pill-btn"
                      onClick={() => setActiveModal('rewards')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="20 12 20 22 4 22 4 12" />
                        <rect x="2" y="7" width="20" height="5" />
                        <line x1="12" y1="22" x2="12" y2="7" />
                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                      </svg>
                      <span>Ganjaran</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. CONTENT & STAMP CARD BOX */}
        <div className="card-content">
          {cardBoxBlock.visible && (
            <div
              className="stamp-card relative overflow-hidden"
              style={{
                backgroundColor: cardBoxBlock.bgColor || '#FFFDF8',
                borderColor: cardBoxBlock.borderColor || '#F0DEC0',
                borderRadius: `${cardBoxBlock.borderRadius || 28}px`,
                backdropFilter: (cardBoxBlock.cardStyle || 'kertas') === 'kaca' ? 'blur(22px) saturate(190%) contrast(105%)' : (cardBoxBlock.cardStyle || 'kertas') === 'air' ? 'blur(16px) saturate(140%)' : 'none',
                WebkitBackdropFilter: (cardBoxBlock.cardStyle || 'kertas') === 'kaca' ? 'blur(22px) saturate(190%) contrast(105%)' : (cardBoxBlock.cardStyle || 'kertas') === 'air' ? 'blur(16px) saturate(140%)' : 'none',
                boxShadow: cardBoxBlock.shadowStyle === 'glow'
                  ? '0 16px 36px -10px rgba(255,122,69,0.22)'
                  : (cardBoxBlock.cardStyle || 'kertas') === 'kaca'
                  ? '0 24px 50px -12px rgba(0,0,0,0.22), inset 0 1.5px 2px rgba(255,255,255,0.85), inset 0 -1.5px 2px rgba(255,255,255,0.25)'
                  : (cardBoxBlock.cardStyle || 'kertas') === 'kayu'
                  ? '0 14px 32px -6px rgba(45,20,5,0.4), inset 0 2px 4px rgba(255,255,255,0.35), inset 0 -3px 6px rgba(40,15,0,0.4)'
                  : (cardBoxBlock.cardStyle || 'kertas') === 'besi'
                  ? '0 16px 36px -8px rgba(15,23,42,0.45), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 5px rgba(0,0,0,0.35)'
                  : (cardBoxBlock.cardStyle || 'kertas') === 'batu'
                  ? '0 16px 36px -8px rgba(30,41,59,0.35), inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.2)'
                  : (cardBoxBlock.cardStyle || 'kertas') === 'air'
                  ? '0 18px 40px -8px rgba(0,188,212,0.35), inset 0 2px 6px rgba(255,255,255,0.9), inset 0 -2px 6px rgba(0,188,212,0.25)'
                  : '0 14px 32px -8px rgba(43,27,18,0.08)',
              }}
            >
              {/* MATERIAL TEXTURE OVERLAY */}
              <CardBoxMaterialTexture cardStyle={cardBoxBlock.cardStyle || 'kertas'} />

              {/* HEAD */}
              <div className="stamp-card-head relative z-10">
                <div className="label">
                  {isFull
                    ? `${activeLang === 'en' ? 'CARD' : 'KAD'} 1 • ${activeLang === 'en' ? 'FULL' : 'PENUH'}`
                    : `${activeLang === 'en' ? 'CARD' : 'KAD'} 1 • ${activeLang === 'en' ? 'IN PROGRESS' : 'SEDANG DIISI'}`}
                </div>
                <div className="count">
                  {totalStamps}
                  <small> / {reqStamps}</small>
                </div>
              </div>

              {/* PERFORATION DOTS */}
              <div className="perforation relative z-10">
                {Array.from({ length: 15 }).map((_, pIdx) => (
                  <span key={pIdx} />
                ))}
              </div>

              {/* 5-COLUMN STAMP GRID (IDENTICAL CIRCULAR 50% STAMPS) */}
              <div className="stamp-grid relative z-10">
                {Array.from({ length: reqStamps }).map((_, slotIdx) => {
                  const slotNum = slotIdx + 1
                  const filled = slotNum <= totalStamps
                  return (
                    <button
                      type="button"
                      key={slotNum}
                      onClick={() => {
                        setSelectedStampSlot(slotNum)
                        setActiveModal('stamp_detail')
                      }}
                      className={`stamp ${filled ? 'filled' : 'empty'}`}
                      title={filled ? `Cop #${slotNum} — Diperoleh` : `Cop #${slotNum} — Belum diperoleh`}
                    >
                      {filled ? (
                        <img
                          src={normalizeStampIcon(config.stampIcon)}
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

              {/* 4. PROGRESS BAR */}
              <div className="relative z-10">
                <ProgressBarRenderer
                  progressBlock={progressBlock}
                  totalStamps={totalStamps}
                  reqStamps={reqStamps}
                  percentFill={percentFill}
                />
              </div>

              {/* STATUS TEXT */}
              <div className="status-text relative z-10">
                {isFull ? (
                  <span>🎉 {activeLang === 'en' ? `Card completed! Claim your reward: ${config.rewardDesc}` : `Kad lengkap! Tebus ganjaran anda: ${config.rewardDesc}`}</span>
                ) : remainStamps > 0 ? (
                  <span>
                    {activeLang === 'en' ? (
                      <>
                        <b>{remainStamps}</b> more stamp{remainStamps > 1 ? 's' : ''} for: {config.rewardDesc}
                      </>
                    ) : (
                      <>
                        Lagi <b>{remainStamps}</b> cop untuk: {config.rewardDesc}
                      </>
                    )}
                  </span>
                ) : (
                  <span>
                    <b>Tahniah!</b> Kad cop anda telah penuh!
                  </span>
                )}
              </div>

              {/* CARD DOTS PAGINATION */}
              <div className="card-dots relative z-10">
                <button type="button" className={`dot ${isFull ? 'full' : ''} active`} aria-label="Kad 1" />
                <button type="button" className="dot" aria-label="Kad 2" />
              </div>
            </div>
          )}

          {/* UPDATED TIMESTAMP */}
          <div className="updated-text">
            {activeLang === 'en' ? 'Last updated: 10:30 PM, 4 Sep 2026' : 'Kemas kini terakhir: 10:30 PM, 4 Sep 2026'}
          </div>

          {/* FOOTER BRAND WITH OFFICIAL LAJUS LOGO */}
          <div className="card-footer">
            <div className="footer-brand">
              <img src="/logo.svg" alt="LajuS" className="w-3.5 h-3.5 object-contain" />
              <span>LajuS</span>
            </div>
            <div className="footer-links">
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                {activeLang === 'en' ? 'Privacy Policy' : 'Dasar Privasi'}
              </a>
              <span className="dot-sep">•</span>
              <button type="button" onClick={() => alert('Simulator: Padam Akaun')}>
                {activeLang === 'en' ? 'Delete Account' : 'Padam Akaun'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE MODALS                                        */}
      {/* ========================================================= */}
      {activeModal !== 'none' && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setActiveModal('none')}
        >
          <div
            className="modal-body bg-[#FFFDF8] text-[#2B1B12] rounded-[26px] p-6 max-w-sm w-full shadow-2xl relative border border-[#F0DEC0] animate-scale-up"
            style={{
              '--card-font': currentFontFamily,
            } as React.CSSProperties}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#2B1B12]/5 text-[#7A6A5A] hover:bg-[#2B1B12]/10 font-bold flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>

            {/* MODAL 1: HOW TO REDEEM */}
            {activeModal === 'how_to_redeem' && (
              <div>
                <h3 className="font-bold text-lg text-[#1B0F09] mb-1">
                  💡 Cara Penebusan Cop
                </h3>
                <p className="text-xs text-[#96806B] mb-4">
                  Ikuti langkah mudah di bawah untuk kumpul cop & tebus hadiah anda:
                </p>

                <div className="space-y-3 mb-5">
                  <div className="flex gap-3 text-xs text-[#4A3B2E] items-start">
                    <span className="w-5 h-5 rounded-full bg-[#FFB238] text-[#1B0F09] font-black flex items-center justify-center text-[10px] shrink-0">
                      1
                    </span>
                    <p>Kunjungi mana-mana cawangan {config.storeName || 'kedai kami'} & buat pesanan anda.</p>
                  </div>
                  <div className="flex gap-3 text-xs text-[#4A3B2E] items-start">
                    <span className="w-5 h-5 rounded-full bg-[#FFB238] text-[#1B0F09] font-black flex items-center justify-center text-[10px] shrink-0">
                      2
                    </span>
                    <p>Tunjukkan Kod QR atau nombor telefon anda di kaunter untuk dapatkan cop.</p>
                  </div>
                  <div className="flex gap-3 text-xs text-[#4A3B2E] items-start">
                    <span className="w-5 h-5 rounded-full bg-[#FFB238] text-[#1B0F09] font-black flex items-center justify-center text-[10px] shrink-0">
                      3
                    </span>
                    <p>Cukupkan {config.stampsRequired || 10} cop & nikmati ganjaran percuma!</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="w-full py-2.5 rounded-xl bg-[#1C7A67] text-white font-bold text-xs hover:bg-[#0F5C4C] transition cursor-pointer"
                >
                  Faham & Tutup
                </button>
              </div>
            )}

            {/* MODAL 2: REWARDS CATALOG */}
            {activeModal === 'rewards' && (
              <div>
                <h3 className="font-bold text-lg text-[#1B0F09] mb-1">
                  🎁 Senarai Ganjaran
                </h3>
                <p className="text-xs text-[#96806B] mb-4">
                  Ganjaran istimewa yang boleh anda tebus:
                </p>

                <div className="space-y-2 mb-5">
                  <div className="p-3 rounded-2xl bg-white border border-[#F0DEC0] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF5A45]/10 flex items-center justify-center text-lg shrink-0">
                      ☕
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-[#1B0F09]">
                        {config.rewardDesc || '1 Minuman Panas Percuma (Saiz Regular)'}
                      </div>
                      <div className="text-[10px] text-[#96806B]">Perlukan {config.stampsRequired || 10} cop penuh</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="w-full py-2.5 rounded-xl bg-[#1C7A67] text-white font-bold text-xs hover:bg-[#0F5C4C] transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            )}

            {/* MODAL 3: GOOGLE REVIEW */}
            {activeModal === 'google_review' && (
              <div className="text-center">
                <img src="/Google-Review.svg" alt="Google" className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold text-lg text-[#1B0F09] mb-1">
                  Beri Penilaian Anda
                </h3>
                <p className="text-xs text-[#96806B] mb-4">
                  Suka servis dan produk kami? Kongsikan pengalaman manis anda di Google Review!
                </p>

                <div className="flex justify-center gap-1.5 mb-4 text-3xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`cursor-pointer transition-transform hover:scale-110 ${
                        reviewRating >= star ? 'text-[#FFB238]' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    alert('Simulator: Membuka Google Review...')
                    setActiveModal('none')
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#1C7A67] text-white font-bold text-xs hover:bg-[#0F5C4C] transition cursor-pointer mb-2"
                >
                  Tulis Ulasan di Google
                </button>
              </div>
            )}

            {/* MODAL 4: QR CODE */}
            {activeModal === 'qr' && (
              <div className="text-center">
                <h3 className="font-bold text-lg text-[#1B0F09] mb-1">
                  📱 Kod QR Pelanggan
                </h3>
                <p className="text-xs text-[#96806B] mb-3">
                  Tunjukkan kod ini kepada juruwang untuk imbasan cop segera.
                </p>

                <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border border-[#F0DEC0] shadow-inner flex items-center justify-center mb-3">
                  <div className="w-full h-full bg-neutral-900 rounded-xl flex flex-col items-center justify-center text-white p-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-20 h-20 text-white mb-1">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
                    </svg>
                    <span className="text-[9px] font-mono tracking-widest text-amber-300">COP-STAMP-VIP</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-[#96806B] mb-4">
                  ID: <b className="text-[#1B0F09]">012-345 6789</b>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="w-full py-2.5 rounded-xl bg-[#1C7A67] text-white font-bold text-xs hover:bg-[#0F5C4C] transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            )}

            {/* MODAL 5: LOCATIONS */}
            {activeModal === 'locations' && (
              <div>
                <h3 className="font-bold text-lg text-[#1B0F09] mb-1">
                  📍 Lokasi Cawangan
                </h3>
                <p className="text-xs text-[#96806B] mb-4">
                  Cawangan berdaftar {config.storeName || 'kedai kami'}:
                </p>

                <div className="space-y-2.5 mb-5">
                  <div className="p-3 rounded-2xl bg-white border border-[#F0DEC0]">
                    <div className="text-xs font-bold text-[#1B0F09]">Cawangan Utama (HQ)</div>
                    <div className="text-[11px] text-[#96806B] mt-0.5">No 12, Jalan Telawi 5, Bangsar, Kuala Lumpur</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="w-full py-2.5 rounded-xl bg-[#1C7A67] text-white font-bold text-xs hover:bg-[#0F5C4C] transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            )}

            {/* MODAL 6: STAMP DETAIL */}
            {activeModal === 'stamp_detail' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-radial from-white/40 to-transparent bg-gradient-to-br from-[#FF5A45] to-[#E23F2E] shadow-lg">
                  {selectedStampSlot <= totalStamps ? (
                    <img
                      src={normalizeStampIcon(config.stampIcon)}
                      alt="Cop"
                      className="w-8 h-8 object-contain"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  ) : (
                    <span className="text-white font-bold text-xl">{selectedStampSlot}</span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-[#1B0F09] mb-1">
                  Cop #{selectedStampSlot}
                </h3>
                <p className="text-xs text-[#96806B] mb-4">
                  {selectedStampSlot <= totalStamps
                    ? 'Cop ini telah berjaya diperoleh & direkodkan.'
                    : 'Cop ini belum diperoleh lagi. Buat pesanan untuk kumpul cop ini.'}
                </p>

                <div className="bg-white border border-[#F0DEC0] rounded-2xl p-3 text-xs text-left mb-4 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#96806B]">Status:</span>
                    <b className={selectedStampSlot <= totalStamps ? 'text-emerald-700' : 'text-[#96806B]'}>
                      {selectedStampSlot <= totalStamps ? '✓ Diperoleh' : 'Belum Diperoleh'}
                    </b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#96806B]">Tarikh:</span>
                    <b className="text-[#1B0F09]">
                      {selectedStampSlot <= totalStamps ? '4 Sep 2026, 10:30 PM' : '-'}
                    </b>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="w-full py-2.5 rounded-xl bg-[#1C7A67] text-white font-bold text-xs hover:bg-[#0F5C4C] transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
