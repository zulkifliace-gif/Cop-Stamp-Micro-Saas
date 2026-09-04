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
  { id: 'bubbles', label: 'Bulat-bulat (Asal Live)', icon: '🫧', desc: 'Geometrik bulat asal' },
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
    name: 'Fraunces (Asal Live)',
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
    name: 'Kertas (Asal Live)',
    icon: '📜',
    desc: 'Kertas kraf & kadstock krim klasik asal',
    badge: 'Asal Live',
    defaultBg: '#FFFDF8',
    defaultBorder: '#F0DEC0',
    defaultRadius: 28,
  },
  {
    id: 'kaca',
    name: 'Kaca',
    icon: '🪟',
    desc: 'Frosted glass lutsinar tembus belakang',
    badge: 'Tembus Belakang',
    defaultBg: 'rgba(255, 255, 255, 0.22)',
    defaultBorder: 'rgba(255, 255, 255, 0.55)',
    defaultRadius: 28,
  },
  {
    id: 'batu',
    name: 'Batu',
    icon: '🪨',
    desc: 'Papak batu marmar & urat slate padu',
    badge: 'Mewah',
    defaultBg: '#ECEFF1',
    defaultBorder: '#90A4AE',
    defaultRadius: 20,
  },
  {
    id: 'besi',
    name: 'Besi',
    icon: '⚙️',
    desc: 'Plat keluli berus & skru industri 4 penjuru',
    badge: 'Industri',
    defaultBg: '#E2E8F0',
    defaultBorder: '#64748B',
    defaultRadius: 16,
  },
  {
    id: 'kayu',
    name: 'Kayu',
    icon: '🪵',
    desc: 'Papan kayu selari & jalur urat oak asli',
    badge: 'Plank Selari',
    defaultBg: '#D49B5B',
    defaultBorder: '#6D3916',
    defaultRadius: 20,
  },
  {
    id: 'air',
    name: 'Air',
    icon: '💧',
    desc: 'Kolam cecair biru akuatik & buih terapung',
    badge: 'Cecair Segar',
    defaultBg: 'rgba(224, 247, 250, 0.50)',
    defaultBorder: '#4DD0E1',
    defaultRadius: 28,
  },
]

export interface ProgressStyleOption {
  id: 'gradient' | 'water_wave' | 'striped'
  name: string
  icon: string
  desc: string
}

export const PROGRESS_STYLE_OPTIONS: ProgressStyleOption[] = [
  {
    id: 'gradient',
    name: 'Gradien Klasik (Asal Live)',
    icon: '✨',
    desc: 'Garis gradien licin warna peralihan',
  },
  {
    id: 'water_wave',
    name: 'Animasi Ombak Air',
    icon: '🌊',
    desc: 'Cecair beralun dinamik makin penuh dalam kad',
  },
  {
    id: 'striped',
    name: 'Jalur Berputar (Striped)',
    icon: '💈',
    desc: 'Jalur dinamik aktif bergerak ceria',
  },
]

export interface EditableBlockConfig {
  id: EditableBlockId
  title: string
  visible: boolean
  bgColor?: string
  bgColor2?: string
  textColor?: string
  borderColor?: string
  borderRadius?: number
  shadowStyle?: 'none' | 'soft' | 'glow' | 'crisp'
  // Hero pattern
  pattern?: string
  patternOpacity?: number
  // Profile settings
  showLogo?: boolean
  fontId?: string
  imageUrl?: string
  // Card box style
  cardStyle?: 'kertas' | 'kaca' | 'batu' | 'besi' | 'kayu' | 'air'
  // Progress bar style
  progressStyle?: 'gradient' | 'water_wave' | 'striped'
  barHeight?: number
}

export interface LiveStudioConfig {
  storeName: string
  rewardDesc: string
  stampsRequired: number
  simulatedStamps: number
  stampIcon: string
  pageBgColor: string
  pageDotColor: string
  primaryColor: string
  secondaryAccent: string
  blocks: EditableBlockConfig[]
}

export const DEFAULT_4_BLOCKS: EditableBlockConfig[] = [
  {
    id: 'hero_header',
    title: 'Hero Header',
    visible: true,
    bgColor: '#FF7A45',
    bgColor2: '#FFC24D',
    textColor: '#FFFFFF',
    borderRadius: 34,
    shadowStyle: 'glow',
    pattern: 'bubbles',
    patternOpacity: 0.2,
  },
  {
    id: 'store_profile',
    title: 'Profile Kedai',
    visible: true,
    bgColor: '#FFFFFF',
    textColor: '#FFFFFF',
    borderColor: 'rgba(255,255,255,0.55)',
    showLogo: true,
    fontId: 'fraunces',
    imageUrl: '',
  },
  {
    id: 'stamp_card_box',
    title: 'Kotak Kad Cop',
    visible: true,
    cardStyle: 'kertas',
    bgColor: '#FFFDF8',
    borderColor: '#F0DEC0',
    borderRadius: 28,
    shadowStyle: 'soft',
  },
  {
    id: 'progress_bar',
    title: 'Bar Kemajuan',
    visible: true,
    progressStyle: 'gradient',
    bgColor: '#FF5A45',
    bgColor2: '#FFB238',
    barHeight: 9,
    borderRadius: 6,
  },
]

export const DEFAULT_LIVE_STUDIO_CONFIG: LiveStudioConfig = {
  storeName: 'Diana Bakery & Cafe',
  rewardDesc: '1 Minuman Panas Percuma (Saiz Regular)',
  stampsRequired: 10,
  simulatedStamps: 4,
  stampIcon: '/icons/stamps/makanan.svg',
  pageBgColor: '#FFF7EA',
  pageDotColor: 'rgba(43,27,18,0.055)',
  primaryColor: '#FF7A45',
  secondaryAccent: '#FFC24D',
  blocks: DEFAULT_4_BLOCKS,
}

export function sanitizeLiveConfig(raw: any): LiveStudioConfig {
  if (!raw || typeof raw !== 'object') return DEFAULT_LIVE_STUDIO_CONFIG
  return {
    ...DEFAULT_LIVE_STUDIO_CONFIG,
    ...raw,
    blocks: DEFAULT_4_BLOCKS.map((def) => {
      const found = (raw.blocks || []).find((b: any) => b?.id === def.id)
      return found ? { ...def, ...found } : def
    }),
  }
}

export function normalizeStampIcon(path?: string) {
  if (!path) return '/icons/stamps/makanan.svg'
  const lower = path.toLowerCase()
  if (lower.includes('barber') || lower.includes('gunting') || lower.includes('rambut')) return '/icons/stamps/barber.svg'
  if (lower.includes('pastri') || lower.includes('croissant') || lower.includes('bakeri')) return '/icons/stamps/pastri.svg'
  if (lower.includes('pizza')) return '/icons/stamps/pizza.svg'
  if (lower.includes('kek') || lower.includes('cake') || lower.includes('dessert')) return '/icons/stamps/kek.svg'
  if (lower.includes('car') || lower.includes('wash') || lower.includes('bubble') || lower.includes('buih') || lower.includes('dobi')) return '/icons/stamps/car-wash.svg'
  if (lower.includes('servis') || lower.includes('mop') || lower.includes('sparkle') || lower.includes('clean') || lower.includes('bersih')) return '/icons/stamps/servis.svg'
  if (lower.includes('spa') || lower.includes('massage') || lower.includes('urut')) return '/icons/stamps/spa.svg'
  if (lower.includes('retail') || lower.includes('paper') || lower.includes('bag') || lower.includes('beg') || lower.includes('butik')) return '/icons/stamps/retail.svg'
  if (lower.includes('pet') || lower.includes('shop') || lower.includes('bone') || lower.includes('tulang')) return '/icons/stamps/pet-shop.svg'
  if (lower.includes('coffee') || lower.includes('kopi') || lower.includes('vet') || lower.includes('haiwan')) return '/icons/stamps/coffee.svg'
  if (lower.includes('klinik') || lower.includes('vaccine') || lower.includes('vaksin') || lower.includes('farmasi')) return '/icons/stamps/klinik.svg'
  if (lower.includes('makan') || lower.includes('food') || lower.includes('utensil')) return '/icons/stamps/makanan.svg'
  return path.startsWith('/') ? path : `/${path}`
}

export function HeroHeaderPattern({ pattern = 'bubbles', opacity = 0.2 }: { pattern?: string; opacity?: number }) {
  if (pattern === 'none') return null

  if (pattern === 'bubbles') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" style={{ opacity }}>
        <div className="absolute -top-16 -right-12 w-48 h-48 rounded-full bg-white/20 blur-xs" />
        <div className="absolute -bottom-14 -left-10 w-36 h-36 rounded-full bg-white/15" />
        <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-white/10" />
        <div className="absolute top-1/3 right-1/4 w-8 h-8 rounded-full bg-white/10" />
      </div>
    )
  }

  const svgPatterns: Record<string, React.ReactNode> = {
    kereta: (
      <pattern id="pat-car" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
        <path d="M10 35 L14 26 L36 26 L42 35 L48 35 C50 35 52 37 52 40 L52 44 L48 44 C48 47 45 50 42 50 C39 50 36 47 36 44 L24 44 C24 47 21 50 18 50 C15 50 12 47 12 44 L8 44 C6 44 4 42 4 40 L4 35 Z M18 28 L14 34 L26 34 L26 28 Z M30 28 L30 34 L38 34 L34 28 Z" fill="currentColor" />
      </pattern>
    ),
    salon: (
      <pattern id="pat-salon" width="55" height="55" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
        <path d="M15 12 C12 12 10 14 10 17 C10 19.5 11.5 21.5 13.8 21.9 L24 30 L13.8 38.1 C11.5 38.5 10 40.5 10 43 C10 46 12 48 15 48 C17.5 48 19.5 46.5 19.9 44.2 L28 34 L36.1 44.2 C36.5 46.5 38.5 48 41 48 C44 48 46 46 46 43 C46 40.5 44.5 38.5 42.2 38.1 L32 30 L42.2 21.9 C44.5 21.5 46 19.5 46 17 C46 14 44 12 41 12 C38.5 12 36.5 13.5 36.1 15.8 L28 26 L19.9 15.8 C19.5 13.5 17.5 12 15 12 Z M15 15 C16 15 17 16 17 17 C17 18 16 19 15 19 C14 19 13 18 13 17 C13 16 14 15 15 15 Z M41 15 C42 15 43 16 43 17 C43 18 42 19 41 19 C40 19 39 18 39 17 C39 16 40 15 41 15 Z M15 41 C16 41 17 42 17 43 C17 44 16 45 15 45 C14 45 13 44 13 43 C13 42 14 41 15 41 Z M41 41 C42 41 43 42 43 43 C43 44 42 45 41 45 C40 45 39 44 39 43 C39 42 40 41 41 41 Z" fill="currentColor" />
      </pattern>
    ),
    kek: (
      <pattern id="pat-kek" width="50" height="50" patternUnits="userSpaceOnUse" patternTransform="rotate(10)">
        <path d="M25 8 C25 6 26 5 26 5 C26 5 27 6 27 8 C27 9 26 10 25 10 C24 10 23 9 25 8 Z M24 11 H26 V16 H24 Z M14 18 H36 C37 18 38 19 38 20 V25 C38 26 37 27 36 27 H14 C13 27 12 26 12 25 V20 C12 19 13 18 14 18 Z M10 29 H40 C41 29 42 30 42 31 V40 C42 41 41 42 40 42 H10 C9 42 8 41 8 40 V31 C8 30 9 29 10 29 Z" fill="currentColor" />
      </pattern>
    ),
    roti_manisan: (
      <pattern id="pat-roti" width="55" height="55" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)">
        <path d="M28 14 C18 14 10 22 10 32 C10 37 14 41 18 41 C22 41 24 38 24 35 C24 31 22 28 22 24 C22 20 25 18 28 18 C31 18 34 20 34 24 C34 28 32 31 32 35 C32 38 34 41 38 41 C42 41 46 37 46 32 C46 22 38 14 28 14 Z M28 22 C26 22 25 24 25 26 H31 C31 24 30 22 28 22 Z" fill="currentColor" />
      </pattern>
    ),
    pisang: (
      <pattern id="pat-pisang" width="50" height="50" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
        <path d="M12 12 C16 12 36 15 42 34 C44 40 40 44 36 44 C34 44 32 42 32 40 C32 26 20 18 12 16 C10 15 10 12 12 12 Z M10 11 L13 8 L16 11 Z" fill="currentColor" />
      </pattern>
    ),
    air_bungkus: (
      <pattern id="pat-airbungkus" width="55" height="55" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
        <path d="M24 6 L32 24 L28 24 L22 10 Z M18 20 C14 20 12 24 14 28 L18 44 C19 47 22 49 26 49 C30 49 33 47 34 44 L38 28 C40 24 38 20 34 20 C32 20 30 22 28 24 C26 22 24 20 22 20 Z" fill="currentColor" />
      </pattern>
    ),
    air_cup: (
      <pattern id="pat-aircup" width="50" height="50" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
        <path d="M30 6 L34 16 H16 L20 6 Z M14 18 H36 L32 44 C32 46 30 48 27 48 H23 C20 48 18 46 18 44 Z M16 28 H34" fill="currentColor" />
      </pattern>
    ),
    haiwan: (
      <pattern id="pat-haiwan" width="50" height="50" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
        <path d="M25 24 C21 24 17 28 17 33 C17 38 21 42 25 42 C29 42 33 38 33 33 C33 28 29 24 25 24 Z M14 22 C11.5 22 9.5 19.5 9.5 16.5 C9.5 13.5 11.5 11 14 11 C16.5 11 18.5 13.5 18.5 16.5 C18.5 19.5 16.5 22 14 22 Z M36 22 C33.5 22 31.5 19.5 31.5 16.5 C31.5 13.5 33.5 11 36 11 C38.5 11 40.5 13.5 40.5 16.5 C40.5 19.5 38.5 22 36 22 Z M20 14 C18.5 14 17 12 17 9.5 C17 7 18.5 5 20 5 C21.5 5 23 7 23 9.5 C23 12 21.5 14 20 14 Z M30 14 C28.5 14 27 12 27 9.5 C27 7 28.5 5 30 5 C31.5 5 33 7 33 9.5 C33 12 31.5 14 30 14 Z" fill="currentColor" />
      </pattern>
    ),
    bunga: (
      <pattern id="pat-bunga" width="50" height="50" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
        <path d="M25 18 C25 13 22 10 19 13 C16 16 19 19 23 21 C19 19 16 22 19 25 C22 28 25 25 25 20 C25 25 28 28 31 25 C34 22 31 19 27 21 C31 19 34 16 31 13 C28 10 25 13 25 18 Z M25 20 C24 20 23 21 23 22 C23 23 24 24 25 24 C26 24 27 23 27 22 C27 21 26 20 25 20 Z" fill="currentColor" />
      </pattern>
    ),
  }

  const selectedSvg = svgPatterns[pattern]
  if (!selectedSvg) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" style={{ opacity }}>
      <svg className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg">
        <defs>{selectedSvg}</defs>
        <rect width="100%" height="100%" fill={`url(#${pattern === 'kereta' ? 'pat-car' : pattern === 'salon' ? 'pat-salon' : pattern === 'kek' ? 'pat-kek' : pattern === 'roti_manisan' ? 'pat-roti' : pattern === 'pisang' ? 'pat-pisang' : pattern === 'air_bungkus' ? 'pat-airbungkus' : pattern === 'air_cup' ? 'pat-aircup' : pattern === 'haiwan' ? 'pat-haiwan' : 'pat-bunga'})`} />
      </svg>
    </div>
  )
}

export function CardBoxMaterialTexture({ cardStyle = 'kertas' }: { cardStyle?: string }) {
  switch (cardStyle) {
    case 'kaca':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] select-none">
          <div className="absolute -top-24 -left-24 w-96 h-64 bg-gradient-to-br from-white/35 via-white/10 to-transparent rotate-25 blur-sm" />
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95" />
          <div className="absolute top-1/3 -left-12 w-80 h-1 bg-gradient-to-r from-transparent via-cyan-200/40 via-pink-200/40 to-transparent rotate-12 blur-[1px]" />
          <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      )

    case 'kayu':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] select-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E2A767]/30 via-transparent to-[#8C4F21]/35" />
          <div className="absolute inset-x-0 top-[26%] h-[2px] bg-[#54290C]/50 shadow-[0_1px_0_rgba(255,255,255,0.35)]" />
          <div className="absolute inset-x-0 top-[52%] h-[2px] bg-[#54290C]/50 shadow-[0_1px_0_rgba(255,255,255,0.35)]" />
          <div className="absolute inset-x-0 top-[77%] h-[2px] bg-[#54290C]/50 shadow-[0_1px_0_rgba(255,255,255,0.35)]" />
          <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 400" preserveAspectRatio="none">
            <path d="M0 18 H400 M0 36 H400 M0 58 H400 M0 80 H400" stroke="#54290C" strokeWidth="1" strokeDasharray="40 10 90 15 150 20" />
            <path d="M0 120 H400 M0 142 H400 M0 165 H400 M0 188 H400" stroke="#54290C" strokeWidth="1" strokeDasharray="30 8 70 12 110 18" />
            <path d="M0 225 H400 M0 248 H400 M0 270 H400 M0 292 H400" stroke="#54290C" strokeWidth="1" strokeDasharray="50 12 100 15 80 10" />
            <path d="M0 325 H400 M0 348 H400 M0 370 H400 M0 390 H400" stroke="#54290C" strokeWidth="1" strokeDasharray="60 15 120 20 70 10" />
            <g opacity="0.6">
              <ellipse cx="75" cy="152" rx="14" ry="5.5" fill="none" stroke="#54290C" strokeWidth="1.4" />
              <ellipse cx="75" cy="152" rx="6" ry="2.5" fill="#54290C" opacity="0.5" />
              <path d="M40 152 Q75 138 115 152 M40 152 Q75 166 115 152" fill="none" stroke="#54290C" strokeWidth="1.1" />
            </g>
            <g opacity="0.6">
              <ellipse cx="325" cy="258" rx="16" ry="6" fill="none" stroke="#54290C" strokeWidth="1.4" />
              <ellipse cx="325" cy="258" rx="7" ry="2.8" fill="#54290C" opacity="0.5" />
              <path d="M285 258 Q325 244 365 258 M285 258 Q325 272 365 258" fill="none" stroke="#54290C" strokeWidth="1.1" />
            </g>
          </svg>
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
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #000 0px, #fff 1px, #000 2px, transparent 3px, transparent 6px)',
            }}
          />
          <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-300 border border-slate-500 shadow flex items-center justify-center">
            <div className="w-2 h-0.5 bg-slate-600 rotate-45" />
          </div>
          <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-300 border border-slate-500 shadow flex items-center justify-center">
            <div className="w-2 h-0.5 bg-slate-600 -rotate-30" />
          </div>
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-300 border border-slate-500 shadow flex items-center justify-center">
            <div className="w-2 h-0.5 bg-slate-600 rotate-12" />
          </div>
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-300 border border-slate-500 shadow flex items-center justify-center">
            <div className="w-2 h-0.5 bg-slate-600 rotate-90" />
          </div>
        </div>
      )

    case 'batu':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] select-none">
          <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 300 300">
            <path d="M10 20 Q 90 120 180 80 T 290 220" stroke="#475569" strokeWidth="2" fill="none" />
            <path d="M40 280 Q 120 180 220 200 T 290 90" stroke="#64748B" strokeWidth="1.5" fill="none" />
            <path d="M100 10 Q 150 90 260 50" stroke="#94A3B8" strokeWidth="1" fill="none" />
          </svg>
        </div>
      )

    case 'air':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] select-none">
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-cyan-300/30 blur-xl" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-teal-300/30 blur-xl" />
          <div className="absolute top-4 right-6 w-2.5 h-2.5 rounded-full bg-white/70 shadow-xs animate-bounce" style={{ animationDuration: '2.5s' }} />
          <div className="absolute bottom-6 left-8 w-3 h-3 rounded-full bg-white/60 shadow-xs animate-bounce" style={{ animationDuration: '3.2s' }} />
          <div className="absolute top-1/2 left-4 w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
        </div>
      )

    case 'kertas':
    default:
      return null
  }
}

export function ProgressBarRenderer({
  progressBlock,
  totalStamps,
  reqStamps,
  percentFill,
}: {
  progressBlock: EditableBlockConfig
  totalStamps: number
  reqStamps: number
  percentFill: number
}) {
  if (!progressBlock.visible) return null

  const style = progressBlock.progressStyle || 'gradient'
  const h = progressBlock.barHeight || 9
  const r = progressBlock.borderRadius ?? 6
  const c1 = progressBlock.bgColor || '#FF5A45'
  const c2 = progressBlock.bgColor2 || '#FFB238'

  if (style === 'water_wave') {
    return (
      <div
        className="w-full relative overflow-hidden my-3 border border-cyan-400/40 shadow-inner bg-cyan-950/20"
        style={{
          height: `${Math.max(12, h + 3)}px`,
          borderRadius: `${r}px`,
        }}
      >
        <div
          className="h-full relative overflow-hidden transition-all duration-700 ease-out"
          style={{
            width: `${percentFill}%`,
            background: `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`,
            borderRadius: `${r}px`,
            boxShadow: '0 0 12px rgba(6,182,212,0.4)',
          }}
        >
          <div
            className="absolute inset-0 opacity-40 animate-wave-flow pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 10px 4px, rgba(255,255,255,0.8) 2px, transparent 3px)',
              backgroundSize: '16px 12px',
            }}
          />
          <svg
            className="absolute -top-1 left-0 w-[200%] h-3 opacity-65 animate-wave-flow"
            viewBox="0 0 400 20"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 10 Q 50 0 100 10 T 200 10 T 300 10 T 400 10 V 20 H 0 Z"
              fill="rgba(255,255,255,0.6)"
            />
          </svg>
          <svg
            className="absolute -top-1.5 left-0 w-[200%] h-3 opacity-40 animate-wave-flow-reverse"
            viewBox="0 0 400 20"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 10 Q 50 20 100 10 T 200 10 T 300 10 T 400 10 V 20 H 0 Z"
              fill="rgba(255,255,255,0.8)"
            />
          </svg>
        </div>
      </div>
    )
  }

  if (style === 'striped') {
    return (
      <div
        className="w-full relative overflow-hidden my-3 bg-[#F0DEC0]"
        style={{
          height: `${h}px`,
          borderRadius: `${r}px`,
        }}
      >
        <div
          className="h-full relative transition-all duration-700 ease-out overflow-hidden"
          style={{
            width: `${percentFill}%`,
            backgroundColor: c1,
            backgroundImage: `repeating-linear-gradient(45deg, ${c1}, ${c1} 10px, ${c2} 10px, ${c2} 20px)`,
            borderRadius: `${r}px`,
          }}
        />
      </div>
    )
  }

  return (
    <div
      className="progress-bar my-3"
      style={{
        height: `${h}px`,
        borderRadius: `${r}px`,
      }}
    >
      <div
        className="progress-bar-fill"
        style={{
          width: `${percentFill}%`,
          background: `linear-gradient(90deg, ${c1}, ${c2})`,
          borderRadius: `${r}px`,
        }}
      />
    </div>
  )
}

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

export default function CardStudioPage() {
  const [config, setConfig] = useState<LiveStudioConfig>(DEFAULT_LIVE_STUDIO_CONFIG)
  const [activeTab, setActiveTab] = useState<'blocks' | 'settings' | 'simulate'>('blocks')
  const [activeLang, setActiveLang] = useState<'my' | 'en'>('my')
  const [selectedBlockId, setSelectedBlockId] = useState<EditableBlockId>('hero_header')
  const [saveStatus, setSaveStatus] = useState<string>('')

  // Interactive preview modals
  const [activeModal, setActiveModal] = useState<
    'none' | 'how_to_redeem' | 'rewards' | 'google_review' | 'locations' | 'qr' | 'stamp_detail'
  >('none')
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
      console.error('Failed to load studio config:', e)
    }
  }, [])

  const saveConfig = (newConfig: LiveStudioConfig) => {
    setConfig(newConfig)
    try {
      localStorage.setItem('cop_card_studio_config', JSON.stringify(newConfig))
      setSaveStatus('Tersimpan automatik!')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (e) {
      console.error('Failed to save config:', e)
    }
  }

  const updateBlock = (blockId: EditableBlockId, partial: Partial<EditableBlockConfig>) => {
    const updatedBlocks = config.blocks.map((b) => (b.id === blockId ? { ...b, ...partial } : b))
    saveConfig({ ...config, blocks: updatedBlocks })
  }

  const resetToDefault = () => {
    if (confirm('Tetapkan semula semua tetapan kepada reka bentuk asal seperti live card?')) {
      setConfig(DEFAULT_LIVE_STUDIO_CONFIG)
      localStorage.setItem('cop_card_studio_config', JSON.stringify(DEFAULT_LIVE_STUDIO_CONFIG))
      setSaveStatus('Berjaya reset ke asal!')
      setTimeout(() => setSaveStatus(''), 2000)
    }
  }

  const getBlock = (id: EditableBlockId): EditableBlockConfig => {
    return config.blocks.find((b) => b.id === id) || DEFAULT_4_BLOCKS.find((b) => b.id === id)!
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
    <div className="min-h-screen bg-[#0E131F] text-gray-100 flex flex-col font-sans">
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
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          padding-bottom: 24px;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: 16px 16px 26px;
        }
        .hero::before {
          content: '';
          position: absolute;
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: rgba(255,255,255,0.16);
          top: -90px;
          right: -60px;
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: rgba(255,255,255,0.13);
          bottom: -70px;
          left: -40px;
          pointer-events: none;
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
          font-family: 'Fraunces', serif;
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
          font-family: 'Fraunces', serif;
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
          font-family: 'Fraunces', serif;
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
      ` }} />

      {/* TOP HEADER / NAVBAR */}
      <header className="h-16 border-b border-gray-800 bg-[#121826] px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold transition"
          >
            <span>← Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-gray-700" />
          <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
            <span>✨ Card Studio</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
              Live Card Mirror
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="text-xs text-emerald-400 font-semibold animate-pulse hidden sm:inline">
              ✓ {saveStatus}
            </span>
          )}
          <button
            type="button"
            onClick={resetToDefault}
            className="text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-xl border border-gray-700 transition cursor-pointer"
          >
            🔄 Reset Asal
          </button>
          <Link
            href="/card-preview"
            className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black px-3.5 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <span>🔍 Pratonton Penuh</span>
          </Link>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANEL: 4-BLOCK CUSTOMIZER EDITOR */}
        <aside className="w-full lg:w-[460px] bg-[#121826] border-r border-gray-800 flex flex-col shrink-0 overflow-y-auto">
          {/* TABS */}
          <div className="flex border-b border-gray-800 p-2 gap-1 bg-[#0E131F]/50 sticky top-0 z-20">
            <button
              type="button"
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'blocks' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              🎨 4 Blok Reka Bentuk
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('simulate')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'simulate' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              🧪 Simulator Cop
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-6">
            {/* 4 BLOCKS ACCORDION */}
            {activeTab === 'blocks' && (
              <div className="space-y-4">
                <div className="text-xs text-gray-400 bg-[#1A2234] p-3 rounded-2xl border border-gray-800">
                  🛠️ <b>4 Blok Reka Bentuk Boleh Ubah:</b> Hero Header, Profile Kedai, Kotak Kad Cop & Bar Kemajuan. Komponen lain kekal tepat seperti kad live.
                </div>

                {/* 1. HERO HEADER */}
                <div className="bg-[#182032] border border-gray-800 rounded-2xl p-4 transition-all">
                  <div
                    onClick={() => setSelectedBlockId('hero_header')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🌄</span>
                      <div>
                        <h4 className="font-bold text-sm text-gray-100">Hero Header</h4>
                        <p className="text-[11px] text-gray-400">Corak motif, warna gradien & kelengkungan</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">
                      {selectedBlockId === 'hero_header' ? 'Tutup ▲' : 'Ubah ▼'}
                    </span>
                  </div>

                  {selectedBlockId === 'hero_header' && (
                    <div className="mt-4 pt-3 border-t border-gray-800 space-y-4">
                      {/* Corak Pilihan (11 Corak) */}
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-2">
                          Corak Motif Latar Belakang ({HERO_PATTERN_OPTIONS.length} Pilihan):
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {HERO_PATTERN_OPTIONS.map((opt) => {
                            const isSelected = (heroBlock.pattern || 'bubbles') === opt.id
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => updateBlock('hero_header', { pattern: opt.id })}
                                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                    : 'bg-[#121826] border-gray-800 text-gray-300 hover:border-gray-700'
                                }`}
                              >
                                <span className="text-lg">{opt.icon}</span>
                                <div className="overflow-hidden">
                                  <div className="text-xs font-bold truncate">{opt.label}</div>
                                  <div className="text-[10px] text-gray-400 truncate">{opt.desc}</div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Kepekatan Corak (Opacity) */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-300 font-semibold mb-1">
                          <span>Kepekatan Corak (Opacity):</span>
                          <span className="font-mono text-amber-400">{Math.round((heroBlock.patternOpacity ?? 0.2) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={heroBlock.patternOpacity ?? 0.2}
                          onChange={(e) => updateBlock('hero_header', { patternOpacity: parseFloat(e.target.value) })}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>

                      {/* Warna Gradien Hero */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 mb-1">Warna Gradien Mula:</label>
                          <div className="flex items-center gap-2 bg-[#121826] p-1.5 rounded-xl border border-gray-800">
                            <input
                              type="color"
                              value={heroBlock.bgColor || '#FF7A45'}
                              onChange={(e) => updateBlock('hero_header', { bgColor: e.target.value })}
                              className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={heroBlock.bgColor || '#FF7A45'}
                              onChange={(e) => updateBlock('hero_header', { bgColor: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-[11px] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 mb-1">Warna Gradien Akhir:</label>
                          <div className="flex items-center gap-2 bg-[#121826] p-1.5 rounded-xl border border-gray-800">
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

                      {/* Kelengkungan Bawah (Border Radius) */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-300 font-semibold mb-1">
                          <span>Kelengkungan Bawah Header:</span>
                          <span className="font-mono text-amber-400">{heroBlock.borderRadius ?? 34}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={heroBlock.borderRadius ?? 34}
                          onChange={(e) => updateBlock('hero_header', { borderRadius: parseInt(e.target.value) })}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. PROFILE KEDAI */}
                <div className="bg-[#182032] border border-gray-800 rounded-2xl p-4 transition-all">
                  <div
                    onClick={() => setSelectedBlockId('store_profile')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🏪</span>
                      <div>
                        <h4 className="font-bold text-sm text-gray-100">Profile Kedai</h4>
                        <p className="text-[11px] text-gray-400">Gambar profil ON/OFF & pilihan fon nama kedai</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">
                      {selectedBlockId === 'store_profile' ? 'Tutup ▲' : 'Ubah ▼'}
                    </span>
                  </div>

                  {selectedBlockId === 'store_profile' && (
                    <div className="mt-4 pt-3 border-t border-gray-800 space-y-4">
                      {/* TOGGLE GAMBAR PROFIL */}
                      <div className="flex items-center justify-between p-3 bg-[#121826] rounded-xl border border-gray-800">
                        <div>
                          <div className="text-xs font-bold text-gray-200">Paparkan Gambar Profil / Logo</div>
                          <div className="text-[10px] text-gray-400">Pilih sama ada mahu tunjuk logo bulat atau sembunyikan</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateBlock('store_profile', { showLogo: profileBlock.showLogo === false ? true : false })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                            profileBlock.showLogo !== false
                              ? 'bg-emerald-500 text-black shadow-md'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {profileBlock.showLogo !== false ? 'ON (Dipaparkan)' : 'OFF (Sembunyi)'}
                        </button>
                      </div>

                      {/* PILIHAN FON NAMA KEDAI */}
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-2">
                          Pilihan Fon Nama Kedai ({STORE_FONT_OPTIONS.length} Pilihan):
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                          {STORE_FONT_OPTIONS.map((f) => {
                            const isSelected = (profileBlock.fontId || 'fraunces') === f.id
                            return (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => updateBlock('store_profile', { fontId: f.id })}
                                className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                    : 'bg-[#121826] border-gray-800 text-gray-300 hover:border-gray-700'
                                }`}
                              >
                                <div>
                                  <div className="text-xs text-gray-400 font-medium">{f.name} ({f.category})</div>
                                  <div className="text-base font-bold text-white mt-0.5" style={{ fontFamily: f.fontFamily }}>
                                    {config.storeName || f.sampleText}
                                  </div>
                                </div>
                                {isSelected && <span className="text-amber-400 font-bold text-sm">✓</span>}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* NAMA KEDAI TEKS & WARNA */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 mb-1">Nama Kedai (Teks):</label>
                        <input
                          type="text"
                          value={config.storeName}
                          onChange={(e) => saveConfig({ ...config, storeName: e.target.value })}
                          className="w-full bg-[#121826] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. KOTAK KAD COP */}
                <div className="bg-[#182032] border border-gray-800 rounded-2xl p-4 transition-all">
                  <div
                    onClick={() => setSelectedBlockId('stamp_card_box')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🗂️</span>
                      <div>
                        <h4 className="font-bold text-sm text-gray-100">Kotak Kad Cop</h4>
                        <p className="text-[11px] text-gray-400">6 gaya material (Kertas, Kaca, Batu, Besi, Kayu, Air)</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">
                      {selectedBlockId === 'stamp_card_box' ? 'Tutup ▲' : 'Ubah ▼'}
                    </span>
                  </div>

                  {selectedBlockId === 'stamp_card_box' && (
                    <div className="mt-4 pt-3 border-t border-gray-800 space-y-4">
                      {/* 6 PILIHAN GAYA MATERIAL */}
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-2">
                          Gaya Material Kad Cop (6 Pilihan):
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {CARD_STYLE_OPTIONS.map((styleOpt) => {
                            const isSelected = (cardBoxBlock.cardStyle || 'kertas') === styleOpt.id
                            return (
                              <button
                                key={styleOpt.id}
                                type="button"
                                onClick={() =>
                                  updateBlock('stamp_card_box', {
                                    cardStyle: styleOpt.id,
                                    bgColor: styleOpt.defaultBg,
                                    borderColor: styleOpt.defaultBorder,
                                    borderRadius: styleOpt.defaultRadius,
                                  })
                                }
                                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                                    : 'bg-[#121826] border-gray-800 text-gray-300 hover:border-gray-700'
                                }`}
                              >
                                <span className="text-xl">{styleOpt.icon}</span>
                                <div>
                                  <div className="text-xs font-bold">{styleOpt.name}</div>
                                  <div className="text-[10px] text-gray-400 line-clamp-2">{styleOpt.desc}</div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* KELENGKUNGAN KOTAK KAD */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-300 font-semibold mb-1">
                          <span>Kelengkungan Kotak Kad (Border Radius):</span>
                          <span className="font-mono text-amber-400">{cardBoxBlock.borderRadius ?? 28}px</span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="40"
                          value={cardBoxBlock.borderRadius ?? 28}
                          onChange={(e) => updateBlock('stamp_card_box', { borderRadius: parseInt(e.target.value) })}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. BAR KEMAJUAN */}
                <div className="bg-[#182032] border border-gray-800 rounded-2xl p-4 transition-all">
                  <div
                    onClick={() => setSelectedBlockId('progress_bar')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">📊</span>
                      <div>
                        <h4 className="font-bold text-sm text-gray-100">Bar Kemajuan</h4>
                        <p className="text-[11px] text-gray-400">ON/OFF & 3 gaya animasi (termasuk animasi air)</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">
                      {selectedBlockId === 'progress_bar' ? 'Tutup ▲' : 'Ubah ▼'}
                    </span>
                  </div>

                  {selectedBlockId === 'progress_bar' && (
                    <div className="mt-4 pt-3 border-t border-gray-800 space-y-4">
                      {/* TOGGLE BAR KEMAJUAN ON/OFF */}
                      <div className="flex items-center justify-between p-3 bg-[#121826] rounded-xl border border-gray-800">
                        <div>
                          <div className="text-xs font-bold text-gray-200">Status Bar Kemajuan</div>
                          <div className="text-[10px] text-gray-400">Pilih sama ada mahu tunjuk atau sembunyikan bar</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateBlock('progress_bar', { visible: !progressBlock.visible })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                            progressBlock.visible
                              ? 'bg-emerald-500 text-black shadow-md'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {progressBlock.visible ? 'ON (Dipaparkan)' : 'OFF (Sembunyi)'}
                        </button>
                      </div>

                      {progressBlock.visible && (
                        <>
                          {/* 3 GAYA BAR KEMAJUAN */}
                          <div>
                            <label className="block text-xs font-bold text-gray-300 mb-2">
                              Pilihan Gaya Bar Kemajuan (3 Pilihan):
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                              {PROGRESS_STYLE_OPTIONS.map((pOpt) => {
                                const isSelected = (progressBlock.progressStyle || 'gradient') === pOpt.id
                                return (
                                  <button
                                    key={pOpt.id}
                                    type="button"
                                    onClick={() => updateBlock('progress_bar', { progressStyle: pOpt.id })}
                                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                                      isSelected
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                        : 'bg-[#121826] border-gray-800 text-gray-300 hover:border-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-lg">{pOpt.icon}</span>
                                      <div>
                                        <div className="text-xs font-bold">{pOpt.name}</div>
                                        <div className="text-[10px] text-gray-400">{pOpt.desc}</div>
                                      </div>
                                    </div>
                                    {isSelected && <span className="text-amber-400 font-bold text-sm">✓</span>}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* WARNA BAR */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-gray-400 mb-1">Warna Bar 1:</label>
                              <div className="flex items-center gap-2 bg-[#121826] p-1.5 rounded-xl border border-gray-800">
                                <input
                                  type="color"
                                  value={progressBlock.bgColor || '#FF5A45'}
                                  onChange={(e) => updateBlock('progress_bar', { bgColor: e.target.value })}
                                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={progressBlock.bgColor || '#FF5A45'}
                                  onChange={(e) => updateBlock('progress_bar', { bgColor: e.target.value })}
                                  className="w-full bg-transparent text-white font-mono text-[11px] outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-gray-400 mb-1">Warna Bar 2:</label>
                              <div className="flex items-center gap-2 bg-[#121826] p-1.5 rounded-xl border border-gray-800">
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
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: SIMULATE STAMPS */}
            {activeTab === 'simulate' && (
              <div className="space-y-4">
                <div className="bg-[#1A2234] p-3.5 rounded-2xl border border-gray-800 text-xs text-gray-300">
                  🧪 <b>Simulator Cop:</b> Uji rupa paras kad pelanggan apabila menerima cop bertambah atau penuh.
                </div>

                <div>
                  <div className="flex justify-between text-gray-300 text-xs font-semibold mb-1.5">
                    <span>Bilangan Cop Semasa (Simulasi):</span>
                    <span className="text-amber-400 font-bold font-mono text-sm">{config.simulatedStamps} / {config.stampsRequired}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={config.stampsRequired}
                    value={config.simulatedStamps}
                    onChange={(e) => saveConfig({ ...config, simulatedStamps: Number(e.target.value) })}
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
                          saveConfig({
                            ...config,
                            stampsRequired: num,
                            simulatedStamps: Math.min(config.simulatedStamps, num),
                          })
                        }
                        className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
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

        {/* RIGHT PANEL: LIVE EXACT PHONE MOCKUP IDENTICAL TO /card */}
        <main className="flex-1 bg-[#090D16] p-4 sm:p-6 lg:p-8 flex items-center justify-center overflow-y-auto">
          <div
            className="w-full max-w-[420px] rounded-[44px] shadow-2xl overflow-hidden border-[10px] border-[#252A36] relative flex flex-col"
            style={{
              backgroundColor: config.pageBgColor || '#FFF7EA',
              backgroundImage: `radial-gradient(circle at 1px 1px, ${config.pageDotColor || 'rgba(43,27,18,0.055)'} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              minHeight: '740px',
            }}
          >
            {/* ISLAND / NOTCH */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#252A36] rounded-full z-40" />

            {/* LIVE CARD DOM CONTAINER */}
            <div className="card-app pt-5">
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
                  {/* PATTERN WATERMARK */}
                  <HeroHeaderPattern
                    pattern={heroBlock.pattern || 'bubbles'}
                    opacity={heroBlock.patternOpacity ?? 0.2}
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
                          onClick={() => alert('Simulator: Halaman diperbaharui')}
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
                              fontFamily:
                                STORE_FONT_OPTIONS.find((f) => f.id === (profileBlock.fontId || 'fraunces'))?.fontFamily ||
                                '"Fraunces", serif',
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
                              onClick={() => alert(`Simulator: Pautan ${plat}`)}
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
          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE MODALS IN STUDIO SIMULATOR                    */}
      {/* ========================================================= */}
      {activeModal !== 'none' && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setActiveModal('none')}
        >
          <div
            className="bg-[#FFFDF8] text-[#2B1B12] rounded-[26px] p-6 max-w-sm w-full shadow-2xl relative border border-[#F0DEC0] animate-scale-up"
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
                <h3 className="font-serif font-bold text-lg text-[#1B0F09] mb-1">
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
                <h3 className="font-serif font-bold text-lg text-[#1B0F09] mb-1">
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
                <h3 className="font-serif font-bold text-lg text-[#1B0F09] mb-1">
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
                <h3 className="font-serif font-bold text-lg text-[#1B0F09] mb-1">
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
                <h3 className="font-serif font-bold text-lg text-[#1B0F09] mb-1">
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

                <h3 className="font-serif font-bold text-lg text-[#1B0F09] mb-1">
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
