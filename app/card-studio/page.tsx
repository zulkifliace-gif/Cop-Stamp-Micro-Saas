'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export type EditableBlockId =
  | 'hero_header'
  | 'store_profile'
  | 'stamp_card_box'
  | 'progress_bar'

export interface PatternOption {
  id: string
  label: string
  icon: string
  desc: string
}

export const HERO_PATTERN_OPTIONS: PatternOption[] = [
  { id: 'bubbles', label: 'Bulat-bulat', icon: '🫧', desc: 'Geometrik bulat asal' },
  { id: 'kereta', label: 'Kereta', icon: '🚗', desc: 'Automotif & bengkel' },
  { id: 'salon', label: 'Salon', icon: '✂️', desc: 'Gunting rambut & kecantikan' },
  { id: 'kek', label: 'Kek', icon: '🎂', desc: 'Kek hari lahir & patisserie' },
  { id: 'roti_manisan', label: 'Roti Manisan', icon: '🥐', desc: 'Pastri, donut & croissant' },
  { id: 'pisang', label: 'Pisang', icon: '🍌', desc: 'Buah-buahan segar' },
  { id: 'air_bungkus', label: 'Air Bungkus', icon: '🧃', desc: 'Ikat tepi tradisional' },
  { id: 'air_cup', label: 'Air Cup', icon: '🥤', desc: 'Cawan kopi & boba' },
  { id: 'haiwan', label: 'Haiwan', icon: '🐾', desc: 'Tapak kaki & pet shop' },
  { id: 'bunga', label: 'Bunga', icon: '🌸', desc: 'Flora & bunga mekar' },
  { id: 'none', label: 'Kosong', icon: '🚫', desc: 'Tiada corak (plain gradient)' },
]

export interface FontOption {
  id: string
  name: string
  fontFamily: string
  category: string
  sampleText: string
}

export const STORE_FONT_OPTIONS: FontOption[] = [
  {
    id: 'fraunces',
    name: 'Fraunces (Klasik Mewah)',
    fontFamily: '"Fraunces", serif',
    category: 'Mewah & Klasik',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    fontFamily: '"Playfair Display", serif',
    category: 'Elegan & Anggun',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'cinzel',
    name: 'Cinzel Royal',
    fontFamily: '"Cinzel", serif',
    category: 'Eksklusif & Diraja',
    sampleText: 'DIANA BAKERY & CAFE',
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    category: 'Moden & Bersih',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    fontFamily: '"Poppins", sans-serif',
    category: 'Bulat & Ceria',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    fontFamily: '"Montserrat", sans-serif',
    category: 'Tegas & Premium',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'dancing',
    name: 'Dancing Script',
    fontFamily: '"Dancing Script", cursive',
    category: 'Tulisan Tangan',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'pacifico',
    name: 'Pacifico Retro',
    fontFamily: '"Pacifico", cursive',
    category: 'Retro & Kafe',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'bebas',
    name: 'Bebas Neue',
    fontFamily: '"Bebas Neue", sans-serif',
    category: 'Tegap & Impak',
    sampleText: 'DIANA BAKERY & CAFE',
  },
  {
    id: 'quicksand',
    name: 'Quicksand',
    fontFamily: '"Quicksand", sans-serif',
    category: 'Comel & Manis',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'comfortaa',
    name: 'Comfortaa',
    fontFamily: '"Comfortaa", cursive',
    category: 'Geometrik Moden',
    sampleText: 'Diana Bakery & Cafe',
  },
]

export interface CardStyleOption {
  id: 'kertas' | 'kaca' | 'batu' | 'besi' | 'kayu' | 'air'
  name: string
  icon: string
  desc: string
  badge: string
  defaultBg: string
  defaultBorder: string
  defaultRadius: number
}

export const CARD_STYLE_OPTIONS: CardStyleOption[] = [
  {
    id: 'kertas',
    name: 'Kertas',
    icon: '📜',
    desc: 'Kertas kraf & kadstock klasik',
    badge: 'Klasik',
    defaultBg: '#FFFDF8',
    defaultBorder: '#F0DEC0',
    defaultRadius: 26,
  },
  {
    id: 'kaca',
    name: 'Kaca',
    icon: '🪟',
    desc: 'Frosted glass lutsinar tembus belakang',
    badge: 'Tembus Belakang',
    defaultBg: 'rgba(255, 255, 255, 0.20)',
    defaultBorder: 'rgba(255, 255, 255, 0.55)',
    defaultRadius: 26,
  },
  {
    id: 'batu',
    name: 'Batu',
    icon: '🪨',
    desc: 'Papak batu marmar & urat slate padu',
    badge: 'Mewah',
    defaultBg: '#ECEFF1',
    defaultBorder: '#90A4AE',
    defaultRadius: 18,
  },
  {
    id: 'besi',
    name: 'Besi',
    icon: '⚙️',
    desc: 'Plat keluli berus & skru industri 4 penjuru',
    badge: 'Industri',
    defaultBg: '#E2E8F0',
    defaultBorder: '#64748B',
    defaultRadius: 14,
  },
  {
    id: 'kayu',
    name: 'Kayu',
    icon: '🪵',
    desc: 'Papan kayu selari & jalur urat oak asli',
    badge: 'Plank Selari',
    defaultBg: '#D49B5B',
    defaultBorder: '#6D3916',
    defaultRadius: 18,
  },
  {
    id: 'air',
    name: 'Air',
    icon: '💧',
    desc: 'Kolam cecair biru akuatik & buih terapung',
    badge: 'Cecair Segar',
    defaultBg: 'rgba(224, 247, 250, 0.45)',
    defaultBorder: '#4DD0E1',
    defaultRadius: 28,
  },
]

export function CardBoxMaterialTexture({ cardStyle = 'kertas' }: { cardStyle?: string }) {
  switch (cardStyle) {
    case 'kaca':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] select-none">
          {/* Glass diagonal glossy glare beam */}
          <div className="absolute -top-24 -left-24 w-96 h-64 bg-gradient-to-br from-white/35 via-white/10 to-transparent rotate-25 blur-sm" />
          {/* Glass specular top edge glow */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95" />
          {/* Prismatic rainbow reflection streak */}
          <div className="absolute top-1/3 -left-12 w-80 h-1 bg-gradient-to-r from-transparent via-cyan-200/40 via-pink-200/40 to-transparent rotate-12 blur-[1px]" />
          {/* Glass bottom edge reflection */}
          <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      )

    case 'kayu':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] select-none">
          {/* Natural wood plank gradient base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#E2A767]/30 via-transparent to-[#8C4F21]/35" />

          {/* 3 Horizontal Plank Seams (Garis Selari yang Kemas) */}
          <div className="absolute inset-x-0 top-[26%] h-[2px] bg-[#54290C]/50 shadow-[0_1px_0_rgba(255,255,255,0.35)]" />
          <div className="absolute inset-x-0 top-[52%] h-[2px] bg-[#54290C]/50 shadow-[0_1px_0_rgba(255,255,255,0.35)]" />
          <div className="absolute inset-x-0 top-[77%] h-[2px] bg-[#54290C]/50 shadow-[0_1px_0_rgba(255,255,255,0.35)]" />

          {/* Parallel Wood Grain Fibers & Knots SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 400" preserveAspectRatio="none">
            {/* Straight parallel grain fibers */}
            <path d="M0 18 H400 M0 36 H400 M0 58 H400 M0 80 H400" stroke="#54290C" strokeWidth="1" strokeDasharray="40 10 90 15 150 20" />
            <path d="M0 120 H400 M0 142 H400 M0 165 H400 M0 188 H400" stroke="#54290C" strokeWidth="1" strokeDasharray="30 8 70 12 110 18" />
            <path d="M0 225 H400 M0 248 H400 M0 270 H400 M0 292 H400" stroke="#54290C" strokeWidth="1" strokeDasharray="50 12 100 15 80 10" />
            <path d="M0 325 H400 M0 348 H400 M0 370 H400 M0 390 H400" stroke="#54290C" strokeWidth="1" strokeDasharray="60 15 120 20 70 10" />

            {/* Organic Wood Knot 1 (Plank 2) */}
            <g opacity="0.6">
              <ellipse cx="75" cy="152" rx="14" ry="5.5" fill="none" stroke="#54290C" strokeWidth="1.4" />
              <ellipse cx="75" cy="152" rx="6" ry="2.5" fill="#54290C" opacity="0.5" />
              <path d="M40 152 Q75 138 115 152 M40 152 Q75 166 115 152" fill="none" stroke="#54290C" strokeWidth="1.1" />
            </g>

            {/* Organic Wood Knot 2 (Plank 3) */}
            <g opacity="0.6">
              <ellipse cx="325" cy="258" rx="16" ry="6" fill="none" stroke="#54290C" strokeWidth="1.4" />
              <ellipse cx="325" cy="258" rx="7" ry="2.8" fill="#54290C" opacity="0.5" />
              <path d="M285 258 Q325 244 365 258 M285 258 Q325 272 365 258" fill="none" stroke="#54290C" strokeWidth="1.1" />
            </g>
          </svg>

          {/* 4 Corner Wooden Pegs / Dowel Plugs */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-[#8C4F21] border border-[#54290C] shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#54290C]/50" />
          </div>
          <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-[#8C4F21] border border-[#54290C] shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#54290C]/50" />
          </div>
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-[#8C4F21] border border-[#54290C] shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#54290C]/50" />
          </div>
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-[#8C4F21] border border-[#54290C] shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#54290C]/50" />
          </div>
        </div>
      )

    case 'besi':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] select-none">
          {/* Brushed metallic gradient sheen */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-transparent to-black/15" />
          {/* Subtle horizontal brushed metal striations */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(0deg,#000_0px,#000_1px,transparent_1px,transparent_3px)]" />
          {/* Metallic Top highlight */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-slate-400 via-white to-slate-400 opacity-90" />

          {/* 4 Heavy-Duty Metallic Phillips Screws / Rivets */}
          <div className="absolute top-3 left-3 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-slate-200 to-slate-500 border border-slate-600 shadow-md flex items-center justify-center">
            <div className="w-2 h-[1px] bg-slate-800" />
            <div className="absolute h-2 w-[1px] bg-slate-800" />
          </div>
          <div className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-slate-200 to-slate-500 border border-slate-600 shadow-md flex items-center justify-center">
            <div className="w-2 h-[1px] bg-slate-800 rotate-45" />
            <div className="absolute h-2 w-[1px] bg-slate-800 rotate-45" />
          </div>
          <div className="absolute bottom-3 left-3 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-slate-200 to-slate-500 border border-slate-600 shadow-md flex items-center justify-center">
            <div className="w-2 h-[1px] bg-slate-800 -rotate-30" />
            <div className="absolute h-2 w-[1px] bg-slate-800 -rotate-30" />
          </div>
          <div className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-slate-200 to-slate-500 border border-slate-600 shadow-md flex items-center justify-center">
            <div className="w-2 h-[1px] bg-slate-800 rotate-15" />
            <div className="absolute h-2 w-[1px] bg-slate-800 rotate-15" />
          </div>
        </div>
      )

    case 'batu':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] select-none">
          {/* Fine mineral grain texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:8px_8px]" />
          {/* Realistic Marble & Slate Veins */}
          <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 400" preserveAspectRatio="none">
            <path d="M-20 60 Q110 30 180 85 T340 50 T420 80" fill="none" stroke="#334155" strokeWidth="2.2" strokeDasharray="12 4" opacity="0.75" />
            <path d="M120 70 Q160 130 200 180" fill="none" stroke="#475569" strokeWidth="1.4" strokeDasharray="8 3" opacity="0.6" />
            <path d="M-10 220 Q130 180 230 250 T430 190" fill="none" stroke="#1E293B" strokeWidth="2" strokeDasharray="14 5" opacity="0.7" />
            <path d="M220 245 Q270 310 330 370" fill="none" stroke="#475569" strokeWidth="1.3" opacity="0.5" />
            <path d="M50 -20 Q170 150 320 420" fill="none" stroke="#64748B" strokeWidth="1.2" strokeDasharray="6 3" opacity="0.5" />
          </svg>
          {/* Stone chiseled inner border highlight */}
          <div className="absolute inset-0 border border-white/40 rounded-[inherit]" />
        </div>
      )

    case 'air':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] select-none">
          {/* Aqua liquid caustic gradient shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-cyan-400/10 to-blue-500/15" />
          {/* Water wave ripples SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-45" viewBox="0 0 400 400" preserveAspectRatio="none">
            <path d="M0 100 Q100 130 200 100 T400 100" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" />
            <path d="M0 220 Q110 190 220 220 T400 220" fill="none" stroke="#FFFFFF" strokeWidth="2.2" opacity="0.75" />
            <path d="M0 330 Q120 360 240 330 T400 330" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.65" />
            {/* 3D Water Bubbles */}
            <circle cx="65" cy="80" r="8" fill="rgba(255,255,255,0.85)" stroke="#00ACC1" strokeWidth="1.2" />
            <circle cx="63" cy="78" r="2.5" fill="#FFFFFF" />
            <circle cx="335" cy="65" r="10" fill="rgba(255,255,255,0.8)" stroke="#00ACC1" strokeWidth="1.5" />
            <circle cx="332" cy="62" r="3" fill="#FFFFFF" />
            <circle cx="285" cy="285" r="7" fill="rgba(255,255,255,0.85)" stroke="#00ACC1" strokeWidth="1.2" />
            <circle cx="283" cy="283" r="2" fill="#FFFFFF" />
            <circle cx="75" cy="320" r="9" fill="rgba(255,255,255,0.75)" stroke="#00ACC1" strokeWidth="1.3" />
            <circle cx="72" cy="317" r="2.5" fill="#FFFFFF" />
          </svg>
          {/* Liquid pool inner glow ring */}
          <div className="absolute inset-0 border-2 border-white/50 rounded-[inherit]" />
        </div>
      )

    case 'kertas':
    default:
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] select-none opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-5" />
        </div>
      )
  }
}

export function HeroHeaderPattern({
  pattern = 'bubbles',
  opacity = 0.2,
}: {
  pattern?: string
  opacity?: number
}) {
  const p = (pattern || 'bubbles').toLowerCase().trim()
  const opacityVal = Math.min(1, Math.max(0.02, opacity ?? 0.2))

  if (p === 'none') {
    return null
  }

  if (p === 'bubbles') {
    return (
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden select-none transition-opacity duration-300"
        style={{ opacity: opacityVal }}
      >
        <div className="absolute w-[180px] h-[180px] rounded-full bg-white -top-20 -right-12 blur-[0.5px]" />
        <div className="absolute w-[120px] h-[120px] rounded-full bg-white -bottom-16 -left-10 blur-[0.5px]" />
        <div className="absolute w-[50px] h-[50px] rounded-full bg-white top-12 left-6" />
        <div className="absolute w-[30px] h-[30px] rounded-full bg-white bottom-6 right-16" />
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none transition-opacity duration-300"
      style={{ opacity: opacityVal }}
    >
      {p === 'kereta' && (
        <svg viewBox="0 0 400 240" fill="currentColor" className="w-full h-full text-white">
          <g transform="translate(230, -10) scale(0.42)">
            <path d="M40 90 L85 35 L215 35 L260 90 L300 100 C312 103 320 112 320 124 L320 152 C320 158 315 162 308 162 L285 162 C285 184 266 200 244 200 C222 200 203 184 203 162 L117 162 C117 184 98 200 76 200 C54 200 35 184 35 162 L12 162 C6 162 0 158 0 152 L0 124 C0 112 8 103 20 100 Z" />
            <circle cx="76" cy="162" r="18" fill="transparent" stroke="currentColor" strokeWidth="7" />
            <circle cx="244" cy="162" r="18" fill="transparent" stroke="currentColor" strokeWidth="7" />
            <path d="M90 48 L142 48 L142 85 L56 85 Z" fill="transparent" stroke="currentColor" strokeWidth="5" />
            <path d="M158 48 L210 48 L244 85 L158 85 Z" fill="transparent" stroke="currentColor" strokeWidth="5" />
          </g>
          <g transform="translate(-15, 110) scale(0.32)">
            <path d="M40 90 L90 35 L210 35 L260 90 L300 100 C312 103 320 112 320 124 L320 152 L285 162 C285 184 266 200 244 200 C222 200 203 184 203 162 L117 162 C117 184 98 200 76 200 C54 200 35 184 35 162 L12 162 L0 124 Z" />
            <circle cx="76" cy="162" r="18" fill="transparent" stroke="currentColor" strokeWidth="6" />
            <circle cx="244" cy="162" r="18" fill="transparent" stroke="currentColor" strokeWidth="6" />
          </g>
          <g transform="translate(20, 15) scale(0.75)">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4.5" />
            <circle cx="24" cy="24" r="6" />
            <line x1="4" y1="24" x2="18" y2="24" stroke="currentColor" strokeWidth="4" />
            <line x1="30" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="4" />
            <line x1="24" y1="30" x2="24" y2="44" stroke="currentColor" strokeWidth="4" />
          </g>
          <line x1="125" y1="32" x2="180" y2="32" stroke="currentColor" strokeWidth="3" strokeDasharray="8 5" />
          <line x1="140" y1="44" x2="205" y2="44" stroke="currentColor" strokeWidth="2.5" strokeDasharray="10 5" />
          <line x1="160" y1="180" x2="225" y2="180" stroke="currentColor" strokeWidth="3" strokeDasharray="8 5" />
          <path d="M220 70 Q220 80 210 80 Q220 80 220 90 Q220 80 230 80 Q220 80 220 70 Z" />
        </svg>
      )}

      {p === 'salon' && (
        <svg viewBox="0 0 400 240" fill="currentColor" className="w-full h-full text-white">
          <g transform="translate(275, 5) rotate(25) scale(0.85)">
            <circle cx="15" cy="50" r="11" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="45" cy="50" r="11" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <path d="M22 42 L48 6 M38 42 L12 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <circle cx="30" cy="28" r="3" />
          </g>
          <g transform="translate(10, 110) scale(0.7)">
            <path d="M12 20 Q12 8 28 8 L60 14 L60 38 L28 44 Q12 44 12 20 Z" />
            <rect x="28" y="42" width="14" height="26" rx="5" />
            <path d="M60 18 L76 20 L76 32 L60 34 Z" />
            <line x1="78" y1="26" x2="92" y2="26" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
          </g>
          <g transform="translate(25, 18) rotate(-18) scale(0.75)">
            <rect x="0" y="0" width="55" height="15" rx="3.5" />
            <line x1="6" y1="15" x2="6" y2="30" stroke="currentColor" strokeWidth="2.2" />
            <line x1="12" y1="15" x2="12" y2="30" stroke="currentColor" strokeWidth="2.2" />
            <line x1="18" y1="15" x2="18" y2="30" stroke="currentColor" strokeWidth="2.2" />
            <line x1="24" y1="15" x2="24" y2="30" stroke="currentColor" strokeWidth="2.2" />
            <line x1="30" y1="15" x2="30" y2="30" stroke="currentColor" strokeWidth="2.2" />
            <line x1="36" y1="15" x2="36" y2="30" stroke="currentColor" strokeWidth="2.2" />
            <line x1="42" y1="15" x2="42" y2="30" stroke="currentColor" strokeWidth="2.2" />
            <line x1="48" y1="15" x2="48" y2="30" stroke="currentColor" strokeWidth="2.2" />
          </g>
          <path d="M180 20 Q180 35 165 35 Q180 35 180 50 Q180 35 195 35 Q180 35 180 20 Z" />
          <path d="M230 160 Q230 172 218 172 Q230 172 230 184 Q230 172 242 172 Q230 172 230 160 Z" />
          <circle cx="160" cy="80" r="3" />
        </svg>
      )}

      {p === 'kek' && (
        <svg viewBox="0 0 400 240" fill="currentColor" className="w-full h-full text-white">
          <g transform="translate(265, 8) scale(0.8)">
            <rect x="10" y="52" width="76" height="32" rx="7" />
            <rect x="22" y="26" width="52" height="27" rx="6" />
            <line x1="35" y1="12" x2="35" y2="26" stroke="currentColor" strokeWidth="3" />
            <circle cx="35" cy="8" r="3" />
            <line x1="48" y1="10" x2="48" y2="26" stroke="currentColor" strokeWidth="3" />
            <circle cx="48" cy="6" r="3" />
            <line x1="61" y1="12" x2="61" y2="26" stroke="currentColor" strokeWidth="3" />
            <circle cx="61" cy="8" r="3" />
            <path d="M10 57 Q20 66 29 57 Q38 66 48 57 Q57 66 67 57 Q76 66 86 57" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </g>
          <g transform="translate(15, 115) scale(0.75)">
            <path d="M15 36 L22 68 L52 68 L59 36 Z" />
            <path d="M10 36 Q37 8 64 36 Z" />
            <circle cx="37" cy="12" r="5.5" />
          </g>
          <g transform="translate(25, 20) scale(0.7)">
            <path d="M10 48 L60 20 L82 56 L10 68 Z" />
            <circle cx="66" cy="15" r="4.5" />
          </g>
          <path d="M180 50 Q180 62 168 62 Q180 62 180 74 Q180 62 192 62 Q180 62 180 50 Z" />
          <circle cx="215" cy="170" r="3.5" />
          <circle cx="160" cy="25" r="3" />
        </svg>
      )}

      {p === 'roti_manisan' && (
        <svg viewBox="0 0 400 240" fill="currentColor" className="w-full h-full text-white">
          <g transform="translate(265, 8) scale(0.8)">
            <path d="M20 65 Q48 10 80 32 Q110 54 90 85 Q62 105 35 90 Q8 75 20 65 Z" />
            <path d="M38 38 Q60 32 75 48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M32 60 Q55 54 70 74" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g transform="translate(15, 115) scale(0.72)">
            <circle cx="42" cy="42" r="34" />
            <circle cx="42" cy="42" r="13" fill="transparent" stroke="currentColor" strokeWidth="7" />
            <line x1="26" y1="26" x2="32" y2="20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="53" y1="25" x2="59" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="26" y1="56" x2="32" y2="62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="54" y1="56" x2="60" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g transform="translate(20, 18) scale(0.7)">
            <rect x="10" y="20" width="65" height="36" rx="15" />
            <line x1="26" y1="20" x2="20" y2="42" stroke="currentColor" strokeWidth="2.5" />
            <line x1="42" y1="20" x2="36" y2="42" stroke="currentColor" strokeWidth="2.5" />
            <line x1="58" y1="20" x2="52" y2="42" stroke="currentColor" strokeWidth="2.5" />
          </g>
          <g transform="translate(170, 150) scale(0.55)">
            <path d="M20 40 Q20 10 45 10 Q70 10 70 40 Q70 70 45 70 Q20 70 20 40 Z" fill="none" stroke="currentColor" strokeWidth="6.5" />
          </g>
        </svg>
      )}

      {p === 'pisang' && (
        <svg viewBox="0 0 400 240" fill="currentColor" className="w-full h-full text-white">
          <g transform="translate(255, 5) scale(0.85)">
            <path d="M22 24 Q55 40 82 82 Q50 72 16 30 Z" />
            <path d="M28 18 Q72 34 98 72 Q66 62 22 24 Z" />
            <rect x="14" y="12" width="18" height="14" rx="3.5" />
          </g>
          <g transform="translate(15, 105) scale(0.8) rotate(-15)">
            <path d="M12 22 Q50 28 78 72 Q50 56 12 22 Z" />
            <rect x="6" y="16" width="9" height="8" rx="2.5" />
          </g>
          <g transform="translate(20, 15) scale(0.7)">
            <path d="M10 55 Q45 10 78 16 Q72 50 28 82 Z" />
            <line x1="10" y1="55" x2="78" y2="16" stroke="currentColor" strokeWidth="2.5" />
          </g>
          <g transform="translate(180, 160) scale(0.65)">
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="20" cy="20" r="4.5" />
          </g>
          <g transform="translate(185, 25) scale(0.5)">
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="20" cy="20" r="4.5" />
          </g>
        </svg>
      )}

      {p === 'air_bungkus' && (
        <svg viewBox="0 0 400 240" fill="currentColor" className="w-full h-full text-white">
          <g transform="translate(265, 5) scale(0.88)">
            <path d="M46 6 Q56 -6 66 6 Q72 20 60 26 Q46 16 46 6 Z" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <line x1="60" y1="26" x2="84" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="28" y1="-8" x2="52" y2="64" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M40 26 L72 26 L88 74 Q88 90 72 96 L40 96 Q24 90 24 74 Z" />
            <path d="M28 48 Q56 56 84 48 L85 74 Q85 87 72 92 L40 92 Q27 87 27 74 Z" opacity="0.65" fill="#ffffff" />
            <ellipse cx="56" cy="26" rx="16" ry="4.5" />
          </g>
          <g transform="translate(15, 105) scale(0.7)">
            <path d="M46 6 Q56 -6 66 6 Q72 20 60 26 Q46 16 46 6 Z" fill="none" stroke="currentColor" strokeWidth="3" />
            <line x1="28" y1="-8" x2="52" y2="64" stroke="currentColor" strokeWidth="4" />
            <path d="M40 26 L72 26 L88 74 Q88 90 72 96 L40 96 Q24 90 24 74 Z" />
          </g>
          <g transform="translate(30, 20) scale(0.65)">
            <rect x="10" y="10" width="24" height="24" rx="4.5" fill="none" stroke="currentColor" strokeWidth="3.5" />
          </g>
          <g transform="translate(180, 25) scale(0.55) rotate(18)">
            <rect x="10" y="10" width="22" height="22" rx="4" fill="none" stroke="currentColor" strokeWidth="3.5" />
          </g>
          <g transform="translate(180, 160) scale(0.6) rotate(-22)">
            <rect x="10" y="10" width="24" height="24" rx="4.5" fill="none" stroke="currentColor" strokeWidth="3.5" />
          </g>
          <circle cx="235" cy="45" r="3.5" />
          <circle cx="245" cy="70" r="2.5" />
        </svg>
      )}

      {p === 'air_cup' && (
        <svg viewBox="0 0 400 240" fill="currentColor" className="w-full h-full text-white">
          <g transform="translate(275, 5) scale(0.82)">
            <line x1="45" y1="-6" x2="45" y2="22" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path d="M18 22 Q45 6 72 22 Z" />
            <path d="M20 22 L29 90 Q29 98 45 98 Q61 98 61 90 L70 22 Z" />
            <circle cx="36" cy="80" r="4.5" fill="#ffffff" opacity="0.8" />
            <circle cx="52" cy="80" r="4.5" fill="#ffffff" opacity="0.8" />
            <circle cx="44" cy="68" r="4.5" fill="#ffffff" opacity="0.8" />
          </g>
          <g transform="translate(15, 110) scale(0.7)">
            <rect x="18" y="14" width="54" height="9" rx="3.5" />
            <path d="M23 23 L31 80 L59 80 L67 23 Z" />
            <path d="M27 38 L30 62 L60 62 L63 38 Z" opacity="0.75" fill="#ffffff" />
            <path d="M36 4 Q39 -2 36 -8 Q33 -14 36 -20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M52 4 Q55 -2 52 -8 Q49 -14 52 -20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g transform="translate(25, 20) scale(0.65)">
            <ellipse cx="20" cy="20" rx="15" ry="11" />
            <path d="M9 20 Q20 14 20 26 Q20 38 31 20" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </g>
          <circle cx="170" cy="30" r="3.5" />
          <circle cx="215" cy="170" r="4" />
        </svg>
      )}

      {p === 'haiwan' && (
        <svg viewBox="0 0 400 240" fill="currentColor" className="w-full h-full text-white">
          <g transform="translate(275, 10) scale(0.88) rotate(15)">
            <path d="M25 36 C15 36 15 56 25 62 C35 67 45 67 55 62 C65 56 65 36 55 36 C45 36 40 44 25 36 Z" />
            <ellipse cx="17" cy="22" rx="6.5" ry="10" transform="rotate(-20 17 22)" />
            <ellipse cx="32" cy="14" rx="7" ry="10.5" transform="rotate(-6 32 14)" />
            <ellipse cx="48" cy="14" rx="7" ry="10.5" transform="rotate(6 48 14)" />
            <ellipse cx="63" cy="22" rx="6.5" ry="10" transform="rotate(20 63 22)" />
          </g>
          <g transform="translate(20, 115) scale(0.7) rotate(-22)">
            <path d="M25 36 C15 36 15 56 25 62 C35 67 45 67 55 62 C65 56 65 36 55 36 C45 36 40 44 25 36 Z" />
            <ellipse cx="17" cy="22" rx="6.5" ry="10" transform="rotate(-20 17 22)" />
            <ellipse cx="32" cy="14" rx="7" ry="10.5" transform="rotate(-6 32 14)" />
            <ellipse cx="48" cy="14" rx="7" ry="10.5" transform="rotate(6 48 14)" />
            <ellipse cx="63" cy="22" rx="6.5" ry="10" transform="rotate(20 63 22)" />
          </g>
          <g transform="translate(25, 20) scale(0.7) rotate(25)">
            <rect x="20" y="16" width="32" height="9" rx="2.5" />
            <circle cx="18" cy="15" r="6.5" />
            <circle cx="18" cy="26" r="6.5" />
            <circle cx="54" cy="15" r="6.5" />
            <circle cx="54" cy="26" r="6.5" />
          </g>
          <g transform="translate(180, 25) scale(0.42) rotate(12)">
            <circle cx="40" cy="45" r="15" />
            <circle cx="22" cy="24" r="6.5" />
            <circle cx="36" cy="15" r="6.5" />
            <circle cx="50" cy="15" r="6.5" />
            <circle cx="64" cy="24" r="6.5" />
          </g>
          <g transform="translate(190, 160) scale(0.48) rotate(-16)">
            <circle cx="40" cy="45" r="15" />
            <circle cx="22" cy="24" r="6.5" />
            <circle cx="36" cy="15" r="6.5" />
            <circle cx="50" cy="15" r="6.5" />
            <circle cx="64" cy="24" r="6.5" />
          </g>
        </svg>
      )}

      {p === 'bunga' && (
        <svg viewBox="0 0 400 240" fill="currentColor" className="w-full h-full text-white">
          <g transform="translate(265, 8) scale(0.88)">
            <circle cx="40" cy="20" r="15" />
            <circle cx="60" cy="32" r="15" />
            <circle cx="52" cy="56" r="15" />
            <circle cx="28" cy="56" r="15" />
            <circle cx="20" cy="32" r="15" />
            <circle cx="40" cy="39" r="8.5" fill="#ffffff" opacity="0.65" />
          </g>
          <g transform="translate(15, 110) scale(0.7)">
            <circle cx="40" cy="20" r="15" />
            <circle cx="60" cy="32" r="15" />
            <circle cx="52" cy="56" r="15" />
            <circle cx="28" cy="56" r="15" />
            <circle cx="20" cy="32" r="15" />
            <circle cx="40" cy="39" r="8.5" fill="#ffffff" opacity="0.65" />
          </g>
          <g transform="translate(25, 20) scale(0.75) rotate(-20)">
            <path d="M10 42 Q32 10 65 22 Q52 54 10 42 Z" />
            <path d="M10 42 Q42 42 62 74 Q32 74 10 42 Z" />
          </g>
          <ellipse cx="170" cy="40" rx="9" ry="4.5" transform="rotate(25 170 40)" />
          <ellipse cx="225" cy="170" rx="8" ry="4" transform="rotate(-35 225 170)" />
          <circle cx="190" cy="120" r="3" />
        </svg>
      )}
    </div>
  )
}

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
  // Media, Content & Customization
  imageUrl: string
  showLogo?: boolean
  fontId?: string
  cardStyle?: 'kertas' | 'kaca' | 'batu' | 'besi' | 'kayu' | 'air'
  title: string
  subtitle: string
  extraText?: string
  pattern?: string
  patternOpacity?: number
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
    subtitle: 'Warna gradient, corak motif & lengkungan sudut bawah banner',
    pattern: 'bubbles',
    patternOpacity: 0.2,
  },
  {
    id: 'store_profile',
    name: '2. Profile Kedai (Logo, Nama & Pilihan Fon)',
    icon: '🏪',
    visible: true,
    bgColor: '#FFFFFF',
    textColor: '#FFFFFF',
    borderColor: 'rgba(255,255,255,0.55)',
    borderRadius: 999,
    shadowStyle: 'soft',
    imageUrl: '/mascot.png',
    showLogo: true,
    fontId: 'fraunces',
    title: 'Diana Bakery & Cafe',
    subtitle: 'Kopi & Pastri Premium Segar',
    extraText: '#FFFFFF',
  },
  {
    id: 'stamp_card_box',
    name: '3. Kotak Kad Cop (Latar Belakang & Gaya Material Kad)',
    icon: '🃏',
    visible: true,
    bgColor: '#FFFDF8',
    textColor: '#2B1B12',
    borderColor: '#F0DEC0',
    borderRadius: 28,
    shadowStyle: 'soft',
    imageUrl: '',
    cardStyle: 'kertas',
    title: 'Kad Cop Digital',
    subtitle: '6 gaya material: Kertas, Kaca, Batu, Besi, Kayu & Air',
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
    pattern: 'bubbles',
    fontId: 'fraunces',
    cardStyle: 'kertas' as const,
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
    pattern: 'air_cup',
    fontId: 'playfair',
    cardStyle: 'kaca' as const,
    pageBg: '#F0F9F5',
    pageDot: 'rgba(15,92,76,0.06)',
    hero1: '#0F5C4C',
    hero2: '#1FA96B',
    stampBg: 'rgba(255, 255, 255, 0.82)',
    stampBorder: 'rgba(255, 255, 255, 0.85)',
    progressTrack: '#E0F2F1',
    progressFill1: '#1C7A67',
    progressFill2: '#2EB88A',
  },
  {
    name: 'Golden Luxury (Bakeri & Kek)',
    pattern: 'kek',
    fontId: 'cinzel',
    cardStyle: 'kayu' as const,
    pageBg: '#FFF9ED',
    pageDot: 'rgba(140,83,17,0.06)',
    hero1: '#A86208',
    hero2: '#FFC24D',
    stampBg: '#F3DEB8',
    stampBorder: '#B8864E',
    progressTrack: '#FCE7C8',
    progressFill1: '#E8901B',
    progressFill2: '#FFD54F',
  },
  {
    name: 'Sweet Berry (Pastri & Dessert)',
    pattern: 'roti_manisan',
    fontId: 'quicksand',
    cardStyle: 'kertas' as const,
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
    pattern: 'kereta',
    fontId: 'bebas',
    cardStyle: 'air' as const,
    pageBg: '#F0F8FF',
    pageDot: 'rgba(21,101,192,0.06)',
    hero1: '#1565C0',
    hero2: '#42A5F5',
    stampBg: '#E0F7FA',
    stampBorder: '#4DD0E1',
    progressTrack: '#E3F2FD',
    progressFill1: '#1E88E5',
    progressFill2: '#64B5F6',
  },
  {
    name: 'Dark Velvet (Barber & Salon)',
    pattern: 'salon',
    fontId: 'montserrat',
    cardStyle: 'besi' as const,
    pageBg: '#18181B',
    pageDot: 'rgba(255,255,255,0.05)',
    hero1: '#27272A',
    hero2: '#52525B',
    stampBg: '#E2E8F0',
    stampBorder: '#94A3B8',
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

  const baseBlocks = Array.isArray(data.blocks) ? data.blocks : []

  const mergedBlocks: EditableBlockConfig[] = DEFAULT_4_BLOCKS.map((def) => {
    const found = baseBlocks.find((b: any) => b && b.id === def.id)
    if (!found) return def
    return {
      id: def.id,
      name: typeof found.name === 'string' ? found.name : def.name,
      icon: typeof found.icon === 'string' ? found.icon : def.icon,
      visible: typeof found.visible === 'boolean' ? found.visible : def.visible,
      bgColor: safeColor(found.bgColor, def.bgColor),
      bgColor2: found.bgColor2 ? safeColor(found.bgColor2, def.bgColor2 || '#FFC24D') : def.bgColor2,
      textColor: safeColor(found.textColor, def.textColor),
      borderColor: typeof found.borderColor === 'string' ? found.borderColor : def.borderColor,
      borderRadius: typeof found.borderRadius === 'number' ? found.borderRadius : def.borderRadius,
      shadowStyle: ['none', 'soft', 'glow', 'glass'].includes(found.shadowStyle)
        ? found.shadowStyle
        : def.shadowStyle,
      imageUrl: typeof found.imageUrl === 'string' ? found.imageUrl : def.imageUrl,
      showLogo: typeof found.showLogo === 'boolean' ? found.showLogo : def.showLogo ?? true,
      fontId: typeof found.fontId === 'string' ? found.fontId : def.fontId || 'fraunces',
      cardStyle: ['kertas', 'kaca', 'batu', 'besi', 'kayu', 'air'].includes(found.cardStyle)
        ? found.cardStyle
        : def.cardStyle || 'kertas',
      title: typeof found.title === 'string' ? found.title : def.title,
      subtitle: typeof found.subtitle === 'string' ? found.subtitle : def.subtitle,
      extraText: typeof found.extraText === 'string' ? found.extraText : def.extraText,
      pattern: typeof found.pattern === 'string' ? found.pattern : def.pattern || 'bubbles',
      patternOpacity: typeof found.patternOpacity === 'number' ? found.patternOpacity : def.patternOpacity ?? 0.2,
    }
  })

  return {
    templateName: typeof data.templateName === 'string' ? data.templateName : DEFAULT_LIVE_STUDIO_CONFIG.templateName,
    pageBgColor: safeColor(data.pageBgColor, DEFAULT_LIVE_STUDIO_CONFIG.pageBgColor),
    pageDotColor: typeof data.pageDotColor === 'string' ? data.pageDotColor : DEFAULT_LIVE_STUDIO_CONFIG.pageDotColor,
    primaryAccent: safeColor(data.primaryAccent, DEFAULT_LIVE_STUDIO_CONFIG.primaryAccent),
    secondaryAccent: safeColor(data.secondaryAccent, DEFAULT_LIVE_STUDIO_CONFIG.secondaryAccent),
    storeName: typeof data.storeName === 'string' ? data.storeName : DEFAULT_LIVE_STUDIO_CONFIG.storeName,
    rewardDesc: typeof data.rewardDesc === 'string' ? data.rewardDesc : DEFAULT_LIVE_STUDIO_CONFIG.rewardDesc,
    stampsRequired: typeof data.stampsRequired === 'number' ? data.stampsRequired : DEFAULT_LIVE_STUDIO_CONFIG.stampsRequired,
    simulatedStamps: typeof data.simulatedStamps === 'number' ? data.simulatedStamps : DEFAULT_LIVE_STUDIO_CONFIG.simulatedStamps,
    stampIcon: typeof data.stampIcon === 'string' ? data.stampIcon : DEFAULT_LIVE_STUDIO_CONFIG.stampIcon,
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

export default function CardStudioPage() {
  const [config, setConfig] = useState<LiveStudioConfig>(DEFAULT_LIVE_STUDIO_CONFIG)
  const [activeTab, setActiveTab] = useState<'blocks' | 'settings' | 'simulate'>('blocks')
  const [expandedBlockId, setExpandedBlockId] = useState<EditableBlockId | null>('stamp_card_box')
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false)

  // Simulation & Modal States
  const [activeLang, setActiveLang] = useState<'my' | 'en'>('my')
  const [activeModal, setActiveModal] = useState<'none' | 'how_to_redeem' | 'rewards' | 'google_review' | 'locations' | 'qr' | 'stamp_detail'>('none')
  const [selectedStampSlot, setSelectedStampSlot] = useState<number>(1)
  const [reviewRating, setReviewRating] = useState<number>(0)

  // Load configuration from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cop_card_studio_config')
      if (saved) {
        const parsed = JSON.parse(saved)
        setConfig(sanitizeLiveConfig(parsed))
      }
    } catch (e) {
      console.error('Error loading config from localStorage:', e)
    }
  }, [])

  const handleSave = () => {
    try {
      localStorage.setItem('cop_card_studio_config', JSON.stringify(config))
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2500)
    } catch (e) {
      console.error('Error saving config:', e)
      alert('Gagal menyimpan draf. Sila semak ruang simpanan pelayar anda.')
    }
  }

  const handleReset = () => {
    if (confirm('Adakah anda pasti untuk menetapkan semula tetapan kepada reka bentuk asal?')) {
      setConfig(DEFAULT_LIVE_STUDIO_CONFIG)
      localStorage.removeItem('cop_card_studio_config')
    }
  }

  const applyPreset = (p: (typeof LIVE_PRESETS)[0]) => {
    setConfig((prev) => {
      const updatedBlocks = prev.blocks.map((b) => {
        if (b.id === 'hero_header') {
          return {
            ...b,
            bgColor: p.hero1,
            bgColor2: p.hero2,
            pattern: p.pattern || 'bubbles',
          }
        }
        if (b.id === 'store_profile') {
          return {
            ...b,
            fontId: p.fontId || 'fraunces',
          }
        }
        if (b.id === 'stamp_card_box') {
          return {
            ...b,
            cardStyle: p.cardStyle || 'kertas',
            bgColor: p.stampBg,
            borderColor: p.stampBorder,
          }
        }
        if (b.id === 'progress_bar') {
          return {
            ...b,
            bgColor: p.progressTrack,
            bgColor2: p.progressFill2,
            textColor: p.progressFill1,
          }
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
        <aside className="w-full lg:w-[480px] xl:w-[520px] bg-[#111827] border-r border-gray-800 flex flex-col shrink-0 h-full overflow-hidden">
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
                  💡 <b className="text-amber-400">4 Bahagian Utama:</b> Ubah warna gradient, corak motif watermark, logo on/off, fon nama kedai, gaya material kad (kertas/kaca/batu/besi/kayu/air) dan bar kemajuan.
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
                        <div className="text-[11px] font-normal text-gray-400">Warna gradient, corak motif & lengkungan banner atas</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{expandedBlockId === 'hero_header' ? '▲' : '▼'}</span>
                  </button>

                  {expandedBlockId === 'hero_header' && (
                    <div className="p-4 border-t border-gray-800/80 bg-black/20 space-y-4 text-xs">
                      {/* CORAK MOTIF WATERMARK */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-gray-300 font-bold">
                            Pilihan Corak / Motif Banner
                          </label>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
                            {HERO_PATTERN_OPTIONS.find((p) => p.id === (heroBlock.pattern || 'bubbles'))?.label || 'Bulat-bulat'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {HERO_PATTERN_OPTIONS.map((p) => {
                            const isSelected = (heroBlock.pattern || 'bubbles') === p.id
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => updateBlock('hero_header', { pattern: p.id })}
                                className={`p-2 rounded-xl text-left transition border flex items-center gap-2 cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                                    : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
                                }`}
                              >
                                <span className="text-lg shrink-0">{p.icon}</span>
                                <div className="min-w-0">
                                  <div className="text-xs truncate">{p.label}</div>
                                  <div className="text-[9px] text-gray-400 truncate">{p.desc}</div>
                                </div>
                              </button>
                            )
                          })}
                        </div>

                        {/* KETELUSAN CORAK (OPACITY SLIDER) */}
                        {(heroBlock.pattern || 'bubbles') !== 'none' && (
                          <div className="mt-3 bg-gray-900/60 p-2.5 rounded-xl border border-gray-800">
                            <div className="flex justify-between text-gray-400 font-semibold mb-1.5 text-[11px]">
                              <span>Ketelusan Corak (Opacity)</span>
                              <span className="text-amber-400 font-mono font-bold">
                                {Math.round((heroBlock.patternOpacity ?? 0.2) * 100)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0.05"
                              max="0.5"
                              step="0.05"
                              value={heroBlock.patternOpacity ?? 0.2}
                              onChange={(e) => updateBlock('hero_header', { patternOpacity: Number(e.target.value) })}
                              className="w-full accent-amber-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-mono">
                              <span>Samar (5%)</span>
                              <span>Sederhana (20%)</span>
                              <span>Jelas (50%)</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* WARNA GRADIENT BANNER */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800">
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

                      {/* LENGKUNGAN & BAYANG */}
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
                            className="w-full accent-amber-500 cursor-pointer"
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
                        <div className="text-[11px] font-normal text-gray-400">On/off gambar profil & pilihan pelbagai fon nama kedai</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{expandedBlockId === 'store_profile' ? '▲' : '▼'}</span>
                  </button>

                  {expandedBlockId === 'store_profile' && (
                    <div className="p-4 border-t border-gray-800/80 bg-black/20 space-y-4 text-xs">
                      {/* TOGGLE ON/OFF GAMBAR PROFIL */}
                      <div className="flex items-center justify-between bg-gray-900/90 p-3 rounded-xl border border-gray-800">
                        <div>
                          <div className="font-bold text-gray-200">Gambar Profil / Logo Kedai</div>
                          <div className="text-[10px] text-gray-400">
                            {profileBlock.showLogo !== false ? 'Logo dipaparkan di bahagian atas' : 'Logo disembunyikan (teks sahaja)'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateBlock('store_profile', { showLogo: profileBlock.showLogo === false ? true : false })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                            profileBlock.showLogo !== false ? 'bg-emerald-500' : 'bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                              profileBlock.showLogo !== false ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* INPUT URL GAMBAR (HANYA APABILA ON) */}
                      {profileBlock.showLogo !== false && (
                        <div className="space-y-2 bg-gray-900/50 p-3 rounded-xl border border-gray-800/80">
                          <label className="block text-gray-400 font-semibold">URL Logo / Gambar Profil</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={profileBlock.imageUrl}
                              onChange={(e) => updateBlock('store_profile', { imageUrl: e.target.value })}
                              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                              placeholder="/mascot.png"
                            />
                            {profileBlock.imageUrl && (
                              <div className="w-9 h-9 rounded-xl bg-white p-1 border border-gray-700 flex items-center justify-center shrink-0">
                                <img src={profileBlock.imageUrl} alt="preview" className="w-full h-full object-contain" />
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 text-[10px] text-gray-400">
                            <button
                              type="button"
                              onClick={() => updateBlock('store_profile', { imageUrl: '/mascot.png' })}
                              className="hover:text-amber-400 underline cursor-pointer"
                            >
                              Guna Maskot LajuS
                            </button>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() => updateBlock('store_profile', { imageUrl: '/logo.svg' })}
                              className="hover:text-amber-400 underline cursor-pointer"
                            >
                              Guna Logo LajuS
                            </button>
                          </div>
                        </div>
                      )}

                      {/* INPUT NAMA KEDAI */}
                      <div>
                        <label className="block text-gray-400 font-semibold mb-1">Nama Kedai</label>
                        <input
                          type="text"
                          value={config.storeName}
                          onChange={(e) => {
                            setConfig({ ...config, storeName: e.target.value })
                            updateBlock('store_profile', { title: e.target.value })
                          }}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-bold"
                          placeholder="Nama Kedai Anda..."
                        />
                      </div>

                      {/* PILIHAN FON NAMA KEDAI */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-gray-300 font-bold">
                            Pilihan Fon Nama Kedai
                          </label>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
                            {STORE_FONT_OPTIONS.find((f) => f.id === (profileBlock.fontId || 'fraunces'))?.name || 'Fraunces'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                          {STORE_FONT_OPTIONS.map((f) => {
                            const isSelected = (profileBlock.fontId || 'fraunces') === f.id
                            return (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => updateBlock('store_profile', { fontId: f.id })}
                                className={`p-2.5 rounded-xl text-left transition border flex flex-col justify-between cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                                    : 'bg-gray-900/80 border-gray-800 text-gray-300 hover:text-white hover:border-gray-700'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full mb-1">
                                  <span className="text-[11px] font-bold text-gray-200">{f.name}</span>
                                  <span className="text-[9px] text-gray-400 bg-black/40 px-1.5 py-0.5 rounded">
                                    {f.category}
                                  </span>
                                </div>
                                <div
                                  className="text-base text-amber-300 truncate w-full"
                                  style={{ fontFamily: f.fontFamily }}
                                >
                                  {config.storeName || f.sampleText}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* WARNA TEKS NAMA KEDAI */}
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
                        <div className="text-[11px] font-normal text-gray-400">6 gaya material: Kertas, Kaca, Batu, Besi, Kayu & Air</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{expandedBlockId === 'stamp_card_box' ? '▲' : '▼'}</span>
                  </button>

                  {expandedBlockId === 'stamp_card_box' && (
                    <div className="p-4 border-t border-gray-800/80 bg-black/20 space-y-4 text-xs">
                      {/* 6 PILIHAN GAYA MATERIAL */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-gray-300 font-bold">
                            Pilihan Gaya Material Kad
                          </label>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
                            {CARD_STYLE_OPTIONS.find((s) => s.id === (cardBoxBlock.cardStyle || 'kertas'))?.name || 'Kertas'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {CARD_STYLE_OPTIONS.map((style) => {
                            const isSelected = (cardBoxBlock.cardStyle || 'kertas') === style.id
                            return (
                              <button
                                key={style.id}
                                type="button"
                                onClick={() =>
                                  updateBlock('stamp_card_box', {
                                    cardStyle: style.id,
                                    bgColor: style.defaultBg,
                                    borderColor: style.defaultBorder,
                                    borderRadius: style.defaultRadius,
                                  })
                                }
                                className={`p-2.5 rounded-xl text-left transition border flex flex-col justify-between cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                                    : 'bg-gray-900/80 border-gray-800 text-gray-300 hover:text-white hover:border-gray-700'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full mb-1">
                                  <span className="text-lg">{style.icon}</span>
                                  <span className="text-[9px] bg-black/40 text-gray-400 px-1.5 py-0.5 rounded">
                                    {style.badge}
                                  </span>
                                </div>
                                <div className="font-bold text-xs truncate">{style.name}</div>
                                <div className="text-[9px] text-gray-400 mt-0.5 line-clamp-1">{style.desc}</div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* WARNA LATAR & BINGKAI */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800">
                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Latar Belakang Kad</label>
                          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={cardBoxBlock.bgColor.startsWith('#') ? cardBoxBlock.bgColor : '#FFFDF8'}
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
                          <label className="block text-gray-400 font-semibold mb-1">Garisan Bingkai (Border)</label>
                          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={cardBoxBlock.borderColor.startsWith('#') ? cardBoxBlock.borderColor : '#F0DEC0'}
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

                      {/* LENGKUNGAN SUDUT & BAYANG */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between text-gray-400 font-semibold mb-1">
                            <span>Lengkungan Sudut</span>
                            <span className="text-amber-400 font-mono">{cardBoxBlock.borderRadius}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="40"
                            value={cardBoxBlock.borderRadius}
                            onChange={(e) => updateBlock('stamp_card_box', { borderRadius: Number(e.target.value) })}
                            className="w-full accent-amber-500 cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Gaya Bayang Kad</label>
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
                        <div className="text-[11px] font-normal text-gray-400">Warna trek dan gradient bar pengisian</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{expandedBlockId === 'progress_bar' ? '▲' : '▼'}</span>
                  </button>

                  {expandedBlockId === 'progress_bar' && (
                    <div className="p-4 border-t border-gray-800/80 bg-black/20 space-y-3 text-xs">
                      <div>
                        <label className="block text-gray-400 font-semibold mb-1">Warna Trek Asas (Track)</label>
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

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Gradient Pengisian 1</label>
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

                        <div>
                          <label className="block text-gray-400 font-semibold mb-1">Gradient Pengisian 2</label>
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
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: PRESET THEMES */}
            {activeTab === 'settings' && (
              <div className="space-y-3">
                <div className="bg-[#1F2937] p-3 rounded-xl border border-gray-800 text-xs text-gray-300">
                  🎨 <b>Pilihan Tema Siap Sedia:</b> Klik mana-mana tema untuk menukar padanan warna, fon, corak dan material kad secara automatik.
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {LIVE_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="p-3 bg-[#1F2937] hover:bg-gray-800 border border-gray-800 hover:border-amber-500/50 rounded-2xl text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold border border-white/20 shadow-inner"
                          style={{
                            background: `linear-gradient(135deg, ${p.hero1} 0%, ${p.hero2} 100%)`,
                          }}
                        >
                          {HERO_PATTERN_OPTIONS.find((opt) => opt.id === p.pattern)?.icon || '🎨'}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-gray-200">{p.name}</div>
                          <div className="text-[10px] text-gray-400">
                            Kad: {CARD_STYLE_OPTIONS.find((s) => s.id === p.cardStyle)?.name || 'Kertas'} • Fon: {STORE_FONT_OPTIONS.find((f) => f.id === p.fontId)?.name || 'Fraunces'}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full border border-gray-700" style={{ backgroundColor: p.hero1 }} />
                        <div className="w-4 h-4 rounded-full border border-gray-700" style={{ backgroundColor: p.hero2 }} />
                        <div className="w-4 h-4 rounded-full border border-gray-700" style={{ backgroundColor: p.stampBg.startsWith('#') ? p.stampBg : '#FFF' }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SIMULATE STAMPS */}
            {activeTab === 'simulate' && (
              <div className="space-y-4">
                <div className="bg-[#1F2937] p-3 rounded-xl border border-gray-800 text-xs text-gray-300">
                  🧪 <b>Simulator Cop:</b> Uji rupa paras kad pelanggan apabila menerima cop bertambah atau penuh.
                </div>

                <div>
                  <div className="flex justify-between text-gray-400 text-xs font-semibold mb-1.5">
                    <span>Bilangan Cop Semasa (Simulasi):</span>
                    <span className="text-amber-400 font-bold font-mono">{config.simulatedStamps} / {config.stampsRequired}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={config.stampsRequired}
                    value={config.simulatedStamps}
                    onChange={(e) => setConfig({ ...config, simulatedStamps: Number(e.target.value) })}
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
            <div className="w-full flex-1 flex flex-col font-sans pb-6">
              {/* 1. HERO HEADER */}
              <div
                className="relative overflow-hidden pt-7 px-4 pb-6 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${heroBlock.bgColor} 0%, ${heroBlock.bgColor2 || config.secondaryAccent} 100%)`,
                  borderRadius: `0 0 ${heroBlock.borderRadius}px ${heroBlock.borderRadius}px`,
                  boxShadow: heroBlock.shadowStyle === 'glow' ? `0 20px 36px -14px ${heroBlock.bgColor}77` : 'none',
                }}
              >
                {/* CORAK MOTIF WATERMARK */}
                <HeroHeaderPattern
                  pattern={heroBlock.pattern || 'bubbles'}
                  opacity={heroBlock.patternOpacity ?? 0.2}
                />

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

                {/* 2. STORE PROFILE */}
                {profileBlock.visible && (
                  <div className="relative z-10 flex flex-col items-center text-center">
                    {profileBlock.showLogo !== false && (
                      <div
                        className="w-20 h-20 rounded-full shadow-xl mb-2.5 overflow-hidden flex items-center justify-center shrink-0 transition-all duration-300"
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
                    )}

                    <div className="flex items-center justify-center gap-1.5 flex-wrap px-2">
                      <span
                        className="font-bold text-xl leading-tight transition-all"
                        style={{
                          color: profileBlock.textColor || '#FFFFFF',
                          fontFamily:
                            STORE_FONT_OPTIONS.find((f) => f.id === (profileBlock.fontId || 'fraunces'))?.fontFamily ||
                            '"Fraunces", serif',
                        }}
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
                )}

                {/* SOCIAL LINKS (FIXED LIVE) */}
                <div className="relative z-10 flex items-center justify-center gap-2 mt-3">
                  {['whatsapp', 'instagram', 'tiktok', 'facebook'].map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => alert(`Simulator: Pautan ${plat}`)}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition cursor-pointer"
                    >
                      {renderLiveSocialIcon(plat)}
                    </button>
                  ))}
                </div>

                {/* ACTION PILLS (FIXED LIVE) */}
                <div className="relative z-10 flex items-center justify-center gap-2 mt-4 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveModal('google_review')}
                    className="bg-white hover:bg-amber-50 text-[#1B0F09] font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm border border-[#F0DEC0] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <img src="/Google-Review.svg" alt="Review" className="w-3.5 h-3.5 object-contain" />
                    <span>Review</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('how_to_redeem')}
                    className="bg-white hover:bg-amber-50 text-[#1B0F09] font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm border border-[#F0DEC0] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
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
                    className="bg-white hover:bg-amber-50 text-[#1B0F09] font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm border border-[#F0DEC0] flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
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

              {/* 3. STAMP CARD BOX */}
              <div className="px-4 -mt-3 relative z-20">
                <div
                  className="p-5 relative transition-all duration-300 overflow-hidden"
                  style={{
                    backgroundColor: cardBoxBlock.bgColor || '#FFFDF8',
                    borderColor: cardBoxBlock.borderColor || '#F0DEC0',
                    borderWidth:
                      (cardBoxBlock.cardStyle || 'kertas') === 'kayu'
                        ? '3px'
                        : (cardBoxBlock.cardStyle || 'kertas') === 'besi'
                        ? '2.5px'
                        : (cardBoxBlock.cardStyle || 'kertas') === 'batu' || (cardBoxBlock.cardStyle || 'kertas') === 'air'
                        ? '2px'
                        : (cardBoxBlock.cardStyle || 'kertas') === 'kaca'
                        ? '1.5px'
                        : '1px',
                    borderStyle: 'solid',
                    borderRadius: `${cardBoxBlock.borderRadius || 26}px`,
                    backdropFilter:
                      (cardBoxBlock.cardStyle || 'kertas') === 'kaca'
                        ? 'blur(22px) saturate(190%) contrast(105%)'
                        : (cardBoxBlock.cardStyle || 'kertas') === 'air'
                        ? 'blur(16px) saturate(140%)'
                        : 'none',
                    WebkitBackdropFilter:
                      (cardBoxBlock.cardStyle || 'kertas') === 'kaca'
                        ? 'blur(22px) saturate(190%) contrast(105%)'
                        : (cardBoxBlock.cardStyle || 'kertas') === 'air'
                        ? 'blur(16px) saturate(140%)'
                        : 'none',
                    boxShadow:
                      cardBoxBlock.shadowStyle === 'glow'
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
                        : cardBoxBlock.shadowStyle === 'soft'
                        ? '0 12px 32px -8px rgba(43,27,18,0.08)'
                        : 'none',
                  }}
                >
                  {/* MATERIAL TEXTURE OVERLAY */}
                  <CardBoxMaterialTexture cardStyle={cardBoxBlock.cardStyle || 'kertas'} />

                  {/* VOUCHER HEADER */}
                  <div className="text-center mb-3 relative z-10">
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 px-3 py-1 rounded-full mb-1.5">
                      <span className="text-xs">🎁</span>
                      <span className="text-[10px] font-extrabold text-amber-900 tracking-wide uppercase">
                        Ganjaran Lengkap
                      </span>
                    </div>
                    <h3 className="font-serif font-black text-base text-[#1B0F09] leading-snug">
                      {config.rewardDesc || '1 Minuman Panas Percuma (Saiz Regular)'}
                    </h3>
                  </div>

                  {/* PERFORATION DIVIDER LINE (FIXED LIVE) */}
                  <div className="relative my-3 flex items-center justify-center z-10">
                    <div
                      className="absolute -left-8 w-6 h-6 rounded-full border-r"
                      style={{
                        backgroundColor: config.pageBgColor || '#FFF7EA',
                        borderColor: cardBoxBlock.borderColor || '#F0DEC0',
                      }}
                    />
                    <div
                      className="w-full border-b-2 border-dashed"
                      style={{ borderColor: cardBoxBlock.borderColor || '#F0DEC0' }}
                    />
                    <div
                      className="absolute -right-8 w-6 h-6 rounded-full border-l"
                      style={{
                        backgroundColor: config.pageBgColor || '#FFF7EA',
                        borderColor: cardBoxBlock.borderColor || '#F0DEC0',
                      }}
                    />
                  </div>

                  {/* 5-COLUMN STAMP GRID */}
                  <div className="grid grid-cols-5 gap-2 my-3 relative z-10">
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
                              : (cardBoxBlock.cardStyle || 'kertas') === 'kaca'
                              ? 'bg-white/30 backdrop-blur-md border-2 border-dashed border-white/60 hover:border-white shadow-xs'
                              : (cardBoxBlock.cardStyle || 'kertas') === 'kayu'
                              ? 'bg-[#E5B582]/40 border-2 border-dashed border-[#6D3916]/40 hover:border-[#6D3916]'
                              : (cardBoxBlock.cardStyle || 'kertas') === 'besi'
                              ? 'bg-slate-200/70 border-2 border-dashed border-slate-400 hover:border-slate-600'
                              : (cardBoxBlock.cardStyle || 'kertas') === 'batu'
                              ? 'bg-slate-200/60 border-2 border-dashed border-slate-400 hover:border-slate-500'
                              : (cardBoxBlock.cardStyle || 'kertas') === 'air'
                              ? 'bg-white/40 backdrop-blur-sm border-2 border-dashed border-[#4DD0E1] hover:border-[#00ACC1]'
                              : 'bg-white/80 border-2 border-dashed border-[#F0DEC0] hover:border-amber-300'
                          }`}
                        >
                          {isStamped ? (
                            <div className="flex flex-col items-center">
                              <img
                                src={config.stampIcon || '/icons/stamps/makanan.svg'}
                                alt="Cop"
                                className="w-5 h-5 object-contain"
                              />
                              <span className="text-[8.5px] font-black text-[#FF5A45] mt-0.5">#{num}</span>
                            </div>
                          ) : isLast ? (
                            <div className="flex flex-col items-center text-amber-700">
                              <span className="text-sm">🎁</span>
                              <span className="text-[8px] font-black mt-0.5">HADIAH</span>
                            </div>
                          ) : (
                            <span className="text-xs font-black text-[#8C7A6B]/50">{num}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* 4. PROGRESS BAR */}
                  <div className="mt-3 pt-1 relative z-10">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="text-[#8C7A6B]">Kemajuan Cop</span>
                      <span className="text-[#1B0F09]">
                        <b style={{ color: progressBlock.textColor || '#FF5A45' }}>{totalStamps}</b> / {reqStamps} Cop ({percentFill}%)
                      </span>
                    </div>

                    <div
                      className="w-full h-3 overflow-hidden p-0.5"
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

                  {/* STATUS TEXT & ACTIONS (FIXED LIVE) */}
                  <div className="mt-3 pt-2.5 border-t border-[#F0DEC0]/70 flex items-center justify-between gap-2 relative z-10">
                    <div>
                      <p className="text-[11px] font-bold text-[#1B0F09]">
                        {isFull ? '🎉 Kad telah penuh!' : `Kumpul ${remainStamps} cop lagi.`}
                      </p>
                      <p className="text-[9px] text-[#8C7A6B]">Tunjukkan kad ini semasa bayaran</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveModal('qr')}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#1B0F09] text-white hover:bg-black transition active:scale-95 cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      <span>QR Ahli</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* PAGINATION DOTS (FIXED LIVE) */}
              <div className="flex items-center justify-center gap-1.5 my-3">
                <div className="w-5 h-1.5 rounded-full bg-[#FF5A45]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#F0DEC0]" />
              </div>

              {/* FOOTER (FIXED LIVE) */}
              <footer className="px-4 text-center mt-2">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <img src="/logo.svg" alt="LajuS" className="w-3.5 h-3.5 object-contain opacity-70" />
                  <span className="text-[11px] font-bold text-[#8C7A6B]">Dikuasakan oleh LajuS Cop Stamp</span>
                </div>
                <p className="text-[9px] text-[#8C7A6B]/70">Kad Kesetiaan Digital Pintar untuk Peniaga</p>
              </footer>
            </div>
          </div>
        </main>
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
                <p>Kumpul sehingga {reqStamps} cop dan tebus ganjaran minuman percuma serta-merta!</p>
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

      {/* 2. MODAL: GANJARAN */}
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
                  alert('Simulator: Membuka Google Review')
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
                    onClick={() => alert('Simulator: Buka Google Maps')}
                    className="flex-1 py-1.5 bg-[#FFF7EA] text-[#FF5A45] border border-[#FF5A45]/30 rounded-lg text-[10px] font-bold transition hover:bg-[#FFE8D6] cursor-pointer"
                  >
                    Google Maps
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Simulator: Buka Waze')}
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
              <h4 className="font-serif font-black text-lg text-[#1B0F09]">Kod QR Ahli</h4>
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
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CARD-STUDIO-PREVIEW-01"
                alt="QR Code"
                className="w-40 h-40 object-contain mx-auto"
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
                  className="w-8 h-8 object-contain"
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
