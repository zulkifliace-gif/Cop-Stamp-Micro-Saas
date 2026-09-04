'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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

export interface ThemePreset {
  name: string
  category: string
  pattern: string
  fontId: string
  cardStyle: 'kertas' | 'kaca' | 'batu' | 'besi' | 'kayu' | 'air'
  progressStyle: 'gradient' | 'water_wave' | 'striped'
  pageBg: string
  pageDot: string
  hero1: string
  hero2: string
  cardBg: string
  cardBorder: string
  progressFill1: string
  progressFill2: string
  desc: string
}

export const LIVE_PRESETS: ThemePreset[] = [
  {
    name: 'Warm Sunset (Asal LajuS)',
    category: 'Universal / Asal',
    pattern: 'bubbles',
    fontId: 'fraunces',
    cardStyle: 'kertas',
    progressStyle: 'gradient',
    pageBg: '#FFF7EA',
    pageDot: 'rgba(43,27,18,0.055)',
    hero1: '#FF7A45',
    hero2: '#FFC24D',
    cardBg: '#FFFDF8',
    cardBorder: '#F0DEC0',
    progressFill1: '#FF5A45',
    progressFill2: '#FFB238',
    desc: 'Warna hangat oren & krim klasik asal LajuS',
  },
  {
    name: 'Royal Emerald (Cafe & Kopi)',
    category: 'Kafe & Kopi',
    pattern: 'air_cup',
    fontId: 'playfair',
    cardStyle: 'kaca',
    progressStyle: 'water_wave',
    pageBg: '#F0F9F5',
    pageDot: 'rgba(15,92,76,0.06)',
    hero1: '#0F5C4C',
    hero2: '#1FA96B',
    cardBg: 'rgba(255, 255, 255, 0.25)',
    cardBorder: 'rgba(255, 255, 255, 0.65)',
    progressFill1: '#1C7A67',
    progressFill2: '#2EB88A',
    desc: 'Hijau emerald eksklusif dengan kad kaca & ombak air',
  },
  {
    name: 'Golden Luxury (Bakeri & Kek)',
    category: 'Bakeri & Pastri',
    pattern: 'kek',
    fontId: 'cinzel',
    cardStyle: 'kayu',
    progressStyle: 'gradient',
    pageBg: '#FFF9ED',
    pageDot: 'rgba(140,83,17,0.06)',
    hero1: '#A86208',
    hero2: '#FFC24D',
    cardBg: '#D49B5B',
    cardBorder: '#6D3916',
    progressFill1: '#E8901B',
    progressFill2: '#FFD54F',
    desc: 'Sentuhan kayu asli & keemasan premium bakeri',
  },
  {
    name: 'Sweet Berry (Dessert & Manisan)',
    category: 'Pastri & Manisan',
    pattern: 'roti_manisan',
    fontId: 'quicksand',
    cardStyle: 'kertas',
    progressStyle: 'striped',
    pageBg: '#FFF0F5',
    pageDot: 'rgba(184,46,90,0.06)',
    hero1: '#C2185B',
    hero2: '#F48FB1',
    cardBg: '#FFFDF8',
    cardBorder: '#F8BBD0',
    progressFill1: '#D81B60',
    progressFill2: '#FF80AB',
    desc: 'Merah jambu ceria dengan corak pastri & jalur striped',
  },
  {
    name: 'Ocean Blue (Carwash & Servis)',
    category: 'Automotif & Carwash',
    pattern: 'kereta',
    fontId: 'bebas',
    cardStyle: 'air',
    progressStyle: 'water_wave',
    pageBg: '#F0F8FF',
    pageDot: 'rgba(21,101,192,0.06)',
    hero1: '#1565C0',
    hero2: '#42A5F5',
    cardBg: 'rgba(224, 247, 250, 0.50)',
    cardBorder: '#4DD0E1',
    progressFill1: '#1E88E5',
    progressFill2: '#64B5F6',
    desc: 'Biru segar akuatik dengan material air & corak kereta',
  },
  {
    name: 'Dark Steel (Barber & Salon)',
    category: 'Barbershop & Grooming',
    pattern: 'salon',
    fontId: 'montserrat',
    cardStyle: 'besi',
    progressStyle: 'striped',
    pageBg: '#1E293B',
    pageDot: 'rgba(255,255,255,0.06)',
    hero1: '#0F172A',
    hero2: '#334155',
    cardBg: '#E2E8F0',
    cardBorder: '#64748B',
    progressFill1: '#F59E0B',
    progressFill2: '#EF4444',
    desc: 'Plat besi keluli tegap maskulin & corak gunting salon',
  },
  {
    name: 'Matcha Zen (Spa & Kesihatan)',
    category: 'Spa & Kesihatan',
    pattern: 'bunga',
    fontId: 'dancing',
    cardStyle: 'batu',
    progressStyle: 'gradient',
    pageBg: '#F7FAF4',
    pageDot: 'rgba(74,107,67,0.06)',
    hero1: '#4A6B43',
    hero2: '#8FA885',
    cardBg: '#ECEFF1',
    cardBorder: '#90A4AE',
    progressFill1: '#557A4E',
    progressFill2: '#9DC08B',
    desc: 'Papak batu marmar damai dengan corak flora mekar',
  },
  {
    name: 'Citrus Fresh (Jus & Buah)',
    category: 'Minuman & Buah',
    pattern: 'pisang',
    fontId: 'poppins',
    cardStyle: 'kertas',
    progressStyle: 'water_wave',
    pageBg: '#FFFBEA',
    pageDot: 'rgba(217,119,6,0.06)',
    hero1: '#D97706',
    hero2: '#FBBF24',
    cardBg: '#FFFDF8',
    cardBorder: '#FDE68A',
    progressFill1: '#EA580C',
    progressFill2: '#FACC15',
    desc: 'Kuning jingga sitrus ceria bertenaga',
  },
  {
    name: 'Street Boba (Air Ikat Tepi)',
    category: 'Minuman Tradisional',
    pattern: 'air_bungkus',
    fontId: 'pacifico',
    cardStyle: 'kaca',
    progressStyle: 'water_wave',
    pageBg: '#FEF3C7',
    pageDot: 'rgba(180,83,9,0.06)',
    hero1: '#92400E',
    hero2: '#D97706',
    cardBg: 'rgba(255, 255, 255, 0.28)',
    cardBorder: 'rgba(255, 255, 255, 0.65)',
    progressFill1: '#B45309',
    progressFill2: '#F59E0B',
    desc: 'Warna teh tarik & kopi kaw ikat tepi klasik',
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

export interface CustomTemplateItem {
  id: string
  name: string
  config: LiveStudioConfig
  createdAt: string
  updatedAt: string
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
    patternOpacity: 0.25,
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


export const I18N_STUDIO = {
  my: {
    backToDashboard: 'Dashboard',
    draft: 'Draf',
    live: 'Live',
    templatesCount: (n: number) => `${n}/3 Templat`,
    saveTemplate: 'Simpan Templat',
    save: 'Simpan',
    setAsLive: 'Jadikan Live',
    resetDefault: 'Reset ke reka bentuk asal',
    previewFull: 'Pratonton',
    editorPanel: 'Panel Editor',
    livePreview: 'Pratonton Live',
    tabBlocks: '4 Blok Reka Bentuk',
    tabPresets: 'Tema & Warna',
    tabSimulator: 'Simulator Cop',
    blocksIntro: '4 Blok Reka Bentuk Boleh Ubah: Hero Header, Profile Kedai, Kotak Kad Cop & Bar Kemajuan. Fon yang dipilih akan diaplikasikan ke seluruh kad.',
    // Block 1: Hero Header
    block1Title: 'Hero Header',
    block1Desc: 'Corak motif, warna gradien & kelengkungan',
    patternLabel: (count: number) => `Corak Motif Latar Belakang (${count} Pilihan):`,
    patternOpacity: 'Kepekatan Corak (Opacity):',
    gradStart: '{t.gradStart}',
    gradEnd: '{t.gradEnd}',
    borderRadiusHeader: 'Kelengkungan Bawah Header:',
    // Block 2: Profile Kedai
    block2Title: 'Profile Kedai & Fon Seluruh Kad',
    block2Desc: 'Gambar profil ON/OFF & pilihan fon seluruh halaman',
    showProfilePic: 'Paparkan Gambar Profil / Logo',
    showProfilePicDesc: 'Pilih sama ada mahu tunjuk logo bulat atau sembunyikan',
    onShown: 'ON (Dipaparkan)',
    offHidden: 'OFF (Sembunyi)',
    fontOptionLabel: (count: number) => `Pilihan Fon Seluruh Kad (${count} Pilihan):`,
    applyAllText: '{t.applyAllText}',
    fontOptionDesc: '{t.fontOptionDesc}',
    selectedBadge: '{t.selectedBadge}',
    storeNameText: '{t.storeNameText}',
    // Block 3: Kotak Kad Cop
    block3Title: 'Kotak Kad Cop',
    block3Desc: '6 gaya material (Kertas, Kaca, Batu, Besi, Kayu, Air)',
    materialOptionLabel: (count: number) => `Gaya Material Kad Cop (${count} Pilihan):`,
    cardBorderRadius: 'Kelengkungan Kotak Kad (Border Radius):',
    // Block 4: Bar Kemajuan
    block4Title: 'Bar Kemajuan',
    block4Desc: '3 gaya animasi (Gradien, Ombak Air Dinamik, Jalur)',
    progressStyleLabel: (count: number) => `Gaya Animasi Bar Kemajuan (${count} Pilihan):`,
    progressColor1: '{t.progressColor1}',
    progressColor2: '{t.progressColor2}',
    barHeight: 'Ketinggian Bar (Height):',
    // Presets Tab
    presetsIntro: '{t.presetsIntro}',
    presetSelected: '✓ Digunakan',
    applyPreset: 'Gunakan Tema',
    // Simulator Tab
    simulatorIntro: '{t.simulatorIntro}',
    simStampsLabel: '{t.simStampsLabel}',
    simTargetLabel: '{t.simTargetLabel}',
    simStatusFull: 'Kad Penuh',
    simStatusProgress: 'Sedang Diisi',
    simRemainStamps: (n: number) => `Baki: ${n} cop lagi untuk ganjaran.`,
    stampsSuffix: 'Cop',
    // Save Modal
    saveModalTitle: 'Simpan Templat Kad',
    saveModalSubtitle: 'Simpan ke akaun anda (Maksimum 3 templat)',
    templateNameLabel: 'Nama Templat',
    templateNamePlaceholder: 'cth: Tema Raya, Bakeri Pastel, Dark Steel',
    templateNameHint: 'Nama ini akan dipaparkan dalam senarai templat anda.',
    quotaUsage: 'Penggunaan Kuota:',
    quotaUpdated: '(Kemaskini)',
    quotaNew: '(Baharu)',
    quotaDesc: '{t.quotaDesc}',
    setAsLiveCheckbox: 'Jadikan Templat Ini Aktif (Live)',
    setAsLiveDesc: '{t.setAsLiveDesc}',
    cancelBtn: 'Batal',
    savingBtn: 'Menyimpan...',
    saveBtn: 'Simpan Templat',
    // Toasts & Alerts
    toastSaved: 'Templat berjaya disimpan!',
    toastLiveSuccess: 'Templat berjaya disimpan & diaktifkan secara Live!',
    toastReset: 'Tetapan dikembalikan ke nilai asal!',
    closeBtn: 'Tutup ▲',
    editBtn: 'Ubah ▼',
    draftUpdated: 'Draf dikemas kini',
  },
  en: {
    backToDashboard: 'Dashboard',
    draft: 'Draft',
    live: 'Live',
    templatesCount: (n: number) => `${n}/3 Templates`,
    saveTemplate: 'Save Template',
    save: 'Save',
    setAsLive: 'Set as Live',
    resetDefault: 'Reset to default design',
    previewFull: 'Preview',
    editorPanel: 'Editor Panel',
    livePreview: 'Live Preview',
    tabBlocks: '4 Design Blocks',
    tabPresets: 'Themes & Colors',
    tabSimulator: 'Stamp Simulator',
    blocksIntro: '4 Editable Design Blocks: Hero Header, Store Profile, Stamp Card Box & Progress Bar. Selected font applies to the entire card.',
    // Block 1: Hero Header
    block1Title: 'Hero Header',
    block1Desc: 'Motif pattern, gradient colors & border radius',
    patternLabel: (count: number) => `Background Motif Pattern (${count} Choices):`,
    patternOpacity: 'Pattern Opacity:',
    gradStart: 'Gradient Start Color:',
    gradEnd: 'Gradient End Color:',
    borderRadiusHeader: 'Bottom Border Radius:',
    // Block 2: Profile Kedai
    block2Title: 'Store Profile & All-Card Font',
    block2Desc: 'Profile image ON/OFF & entire page font selection',
    showProfilePic: 'Display Profile Picture / Logo',
    showProfilePicDesc: 'Choose whether to display circular logo or hide it',
    onShown: 'ON (Displayed)',
    offHidden: 'OFF (Hidden)',
    fontOptionLabel: (count: number) => `All-Card Font Selection (${count} Choices):`,
    applyAllText: 'Apply All Text',
    fontOptionDesc: 'Selected font will apply to Store Name, titles, buttons, status & whole card.',
    selectedBadge: '✓ Selected',
    storeNameText: 'Store Name (Text):',
    // Block 3: Kotak Kad Cop
    block3Title: 'Stamp Card Box',
    block3Desc: '6 material styles (Paper, Glass, Stone, Steel, Wood, Water)',
    materialOptionLabel: (count: number) => `Stamp Card Material Style (${count} Choices):`,
    cardBorderRadius: 'Card Box Border Radius:',
    // Block 4: Bar Kemajuan
    block4Title: 'Progress Bar',
    block4Desc: '3 animation styles (Gradient, Dynamic Water Wave, Striped)',
    progressStyleLabel: (count: number) => `Progress Bar Animation Style (${count} Choices):`,
    progressColor1: 'Primary Bar Color (Start):',
    progressColor2: 'Accent Bar Color (End):',
    barHeight: 'Bar Height:',
    // Presets Tab
    presetsIntro: 'Choose a ready-made theme to apply harmonious color palettes & material styles in 1 click.',
    presetSelected: '✓ In Use',
    applyPreset: 'Apply Theme',
    // Simulator Tab
    simulatorIntro: 'Test customer stamp simulation live to observe card interactions & animations.',
    simStampsLabel: 'Simulate Customer Collected Stamps:',
    simTargetLabel: 'Full Card Stamp Target:',
    simStatusFull: 'Card Full',
    simStatusProgress: 'In Progress',
    simRemainStamps: (n: number) => `Remaining: ${n} more stamps for reward.`,
    stampsSuffix: 'Stamps',
    // Save Modal
    saveModalTitle: 'Save Card Template',
    saveModalSubtitle: 'Save to your account (Maximum 3 templates)',
    templateNameLabel: 'Template Name',
    templateNamePlaceholder: 'e.g. Raya Theme, Pastel Bakery, Dark Steel',
    templateNameHint: 'This name will be displayed in your templates list.',
    quotaUsage: 'Quota Usage:',
    quotaUpdated: '(Update)',
    quotaNew: '(New)',
    quotaDesc: 'Each store account is limited to 3 templates. You can switch active templates anytime.',
    setAsLiveCheckbox: 'Set This Template As Active (Live)',
    setAsLiveDesc: 'Customer card (/card) will immediately use this design upon saving.',
    cancelBtn: 'Cancel',
    savingBtn: 'Saving...',
    saveBtn: 'Save Template',
    // Toasts & Alerts
    toastSaved: 'Template saved successfully!',
    toastLiveSuccess: 'Template saved & set Live successfully!',
    toastReset: 'Settings reset to default values!',
    closeBtn: 'Close ▲',
    editBtn: 'Edit ▼',
    draftUpdated: 'Draft updated',
  },
}

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

export function HeroHeaderPattern({ pattern = 'bubbles', opacity = 0.25 }: { pattern?: string; opacity?: number }) {
  if (!pattern || pattern === 'none') return null

  if (pattern === 'bubbles') {
    // When opacity is 0.25 (default), op1 is 0.16 and op2 is 0.13, exactly matching live /card
    const scale = typeof opacity === 'number' && opacity > 0 ? opacity / 0.25 : 1
    const op1 = Math.min(1, 0.16 * scale)
    const op2 = Math.min(1, 0.13 * scale)
    const op3 = Math.min(1, 0.08 * scale)
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute -top-[90px] -right-[60px] w-[190px] h-[190px] rounded-full pointer-events-none"
          style={{ background: `rgba(255,255,255,${op1})` }}
        />
        <div
          className="absolute -bottom-[70px] -left-[40px] w-[130px] h-[130px] rounded-full pointer-events-none"
          style={{ background: `rgba(255,255,255,${op2})` }}
        />
        <div
          className="absolute top-[45%] left-[20%] w-[48px] h-[48px] rounded-full pointer-events-none"
          style={{ background: `rgba(255,255,255,${op3})` }}
        />
        <div
          className="absolute top-[32%] right-[22%] w-[32px] h-[32px] rounded-full pointer-events-none"
          style={{ background: `rgba(255,255,255,${op3})` }}
        />
      </div>
    )
  }

  const svgPatterns: Record<string, React.ReactNode> = {
    kereta: (
      <pattern id="pat-car" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
        <g transform="translate(6, 12) scale(1.1)">
          <path d="M4 22 L8 14 L24 14 L30 22 L36 22 C38 22 39 23 39 25 L39 28 L36 28 C36 30.5 34 32.5 31.5 32.5 C29 32.5 27 30.5 27 28 L15 28 C15 30.5 13 32.5 10.5 32.5 C8 32.5 6 30.5 6 28 L3 28 C1.5 28 0 26.5 0 25 L0 22 Z" fill="currentColor" />
          <path d="M10 16 L22 16 L27 21 L10 21 Z" fill="#ffffff" opacity="0.6" />
          <circle cx="10.5" cy="28.5" r="3.2" fill="#ffffff" />
          <circle cx="31.5" cy="28.5" r="3.2" fill="#ffffff" />
          <circle cx="10.5" cy="28.5" r="1.5" fill="currentColor" />
          <circle cx="31.5" cy="28.5" r="1.5" fill="currentColor" />
        </g>
      </pattern>
    ),
    salon: (
      <pattern id="pat-salon" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
        <g transform="translate(8, 8) scale(0.9)">
          <path d="M12 10 C9.5 10 7.5 12 7.5 14.5 C7.5 16.5 8.8 18.2 10.7 18.8 L20 26 L10.7 33.2 C8.8 33.8 7.5 35.5 7.5 37.5 C7.5 40 9.5 42 12 42 C14.2 42 16 40.5 16.4 38.4 L24 30 L31.6 38.4 C32 40.5 33.8 42 36 42 C38.5 42 40.5 40 40.5 37.5 C40.5 35.5 39.2 33.8 37.3 33.2 L28 26 L37.3 18.8 C39.2 18.2 40.5 16.5 40.5 14.5 C40.5 12 38.5 10 36 10 C33.8 10 32 11.5 31.6 13.6 L24 22 L16.4 13.6 C16 11.5 14.2 10 12 10 Z" fill="currentColor" />
          <circle cx="12" cy="14.5" r="2.5" fill="#ffffff" opacity="0.6" />
          <circle cx="12" cy="37.5" r="2.5" fill="#ffffff" opacity="0.6" />
          <circle cx="36" cy="14.5" r="2.5" fill="#ffffff" opacity="0.6" />
          <circle cx="36" cy="37.5" r="2.5" fill="#ffffff" opacity="0.6" />
        </g>
      </pattern>
    ),
    kek: (
      <pattern id="pat-kek" width="54" height="54" patternUnits="userSpaceOnUse" patternTransform="rotate(10)">
        <g transform="translate(8, 6) scale(0.95)">
          <path d="M18 4 L20 4 L20 10 L18 10 Z M19 1 C19 1 20 2.5 19 4 C18 2.5 19 1 19 1 Z" fill="currentColor" />
          <path d="M10 12 H28 C29.5 12 30 13 30 14.5 V20 H8 V14.5 C8 13 8.5 12 10 12 Z" fill="currentColor" />
          <path d="M8 20 C10 22 13 22 15 20 C17 22 21 22 23 20 C25 22 28 22 30 20 V22 H8 Z" fill="#ffffff" opacity="0.5" />
          <path d="M5 23 H33 C34.5 23 35 24 35 25.5 V34 H3 V25.5 C3 24 3.5 23 5 23 Z" fill="currentColor" />
          <path d="M3 34 C6 37 10 37 13 34 C16 37 22 37 25 34 C28 37 32 37 35 34 V36 H3 Z" fill="#ffffff" opacity="0.5" />
          <path d="M1 37 H37 V39 H1 Z" fill="currentColor" />
        </g>
      </pattern>
    ),
    roti_manisan: (
      <pattern id="pat-roti" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
        <g transform="translate(6, 8) scale(1)">
          <path d="M22 6 C13 6 5 14 5 23 C5 28 8.5 32 13 32 C17 32 19 29 19 26 C19 22.5 17 20 17 16.5 C17 13 20 11 23 11 C26 11 29 13 29 16.5 C29 20 27 22.5 27 26 C27 29 29 32 33 32 C37.5 32 41 28 41 23 C41 14 33 6 22 6 Z" fill="currentColor" />
          <path d="M22 13 C19 13 18 15 18 17 H26 C26 15 25 13 22 13 Z" fill="#ffffff" opacity="0.5" />
          <path d="M14 20 C12 21 11 23 11 25 H16 C16 23 15 21 14 20 Z" fill="#ffffff" opacity="0.5" />
          <path d="M30 20 C29 21 28 23 28 25 H33 C33 23 32 21 30 20 Z" fill="#ffffff" opacity="0.5" />
        </g>
      </pattern>
    ),
    pisang: (
      <pattern id="pat-pisang" width="52" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(22)">
        <g transform="translate(8, 8) scale(0.95)">
          <path d="M8 8 C14 8 28 12 34 26 C36 31 33 35 29 35 C27 35 25 33 25 31 C25 20 16 14 8 12 C6 11 6 8 8 8 Z" fill="currentColor" />
          <path d="M12 12 C18 13 30 18 35 30 C37 34 34 38 30 38 C28 38 26 36 26 34 C26 24 18 18 11 16 C9 15 9 12 12 12 Z" fill="#ffffff" opacity="0.4" />
          <path d="M6 7 L9 4 L12 7 Z" fill="currentColor" />
        </g>
      </pattern>
    ),
    air_bungkus: (
      <pattern id="pat-airbungkus" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
        <g transform="translate(10, 6) scale(0.95)">
          <path d="M22 2 L30 18 L26 18 L20 5 Z" fill="currentColor" />
          <path d="M14 16 H28 V19 H14 Z" fill="#ffffff" opacity="0.7" />
          <path d="M14 19 C10 19 8 23 9 27 L13 40 C14 43 17 45 21 45 C25 45 28 43 29 40 L33 27 C34 23 32 19 28 19 Z" fill="currentColor" />
          <path d="M10.5 28 Q21 32 31.5 28 L29 40 C28 43 25 45 21 45 C17 45 14 43 13 40 Z" fill="#ffffff" opacity="0.4" />
        </g>
      </pattern>
    ),
    air_cup: (
      <pattern id="pat-aircup" width="52" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(14)">
        <g transform="translate(10, 6) scale(0.95)">
          <path d="M20 2 L24 10 H21 L18 2 Z" fill="currentColor" />
          <path d="M10 12 C10 9 14 7 19 7 C24 7 28 9 28 12 Z" fill="currentColor" />
          <path d="M8 12 H30 V14 H8 Z" fill="currentColor" />
          <path d="M10 15 H28 L25 38 C25 40 23 42 20 42 H18 C15 42 13 40 13 38 Z" fill="currentColor" />
          <circle cx="16" cy="36" r="1.8" fill="#ffffff" opacity="0.6" />
          <circle cx="21" cy="37" r="1.8" fill="#ffffff" opacity="0.6" />
          <circle cx="19" cy="33" r="1.8" fill="#ffffff" opacity="0.6" />
          <circle cx="23" cy="32" r="1.8" fill="#ffffff" opacity="0.6" />
          <circle cx="15" cy="30" r="1.8" fill="#ffffff" opacity="0.6" />
        </g>
      </pattern>
    ),
    haiwan: (
      <pattern id="pat-haiwan" width="52" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
        <g transform="translate(8, 8) scale(0.95)">
          <path d="M18 19 C14.5 19 11 23 11 27 C11 31.5 14.5 35 18 35 C21.5 35 25 31.5 25 27 C25 23 21.5 19 18 19 Z" fill="currentColor" />
          <ellipse cx="8.5" cy="18" rx="3.5" ry="4.5" fill="currentColor" />
          <ellipse cx="14" cy="11.5" rx="3.5" ry="4.5" fill="currentColor" />
          <ellipse cx="22" cy="11.5" rx="3.5" ry="4.5" fill="currentColor" />
          <ellipse cx="27.5" cy="18" rx="3.5" ry="4.5" fill="currentColor" />
        </g>
      </pattern>
    ),
    bunga: (
      <pattern id="pat-bunga" width="52" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
        <g transform="translate(8, 8) scale(0.95)">
          <circle cx="18" cy="9" r="6" fill="currentColor" />
          <circle cx="26.5" cy="15" r="6" fill="currentColor" />
          <circle cx="23.5" cy="25" r="6" fill="currentColor" />
          <circle cx="12.5" cy="25" r="6" fill="currentColor" />
          <circle cx="9.5" cy="15" r="6" fill="currentColor" />
          <circle cx="18" cy="17" r="4.5" fill="#ffffff" opacity="0.7" />
        </g>
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
  progressBlock?: EditableBlockConfig
  totalStamps: number
  reqStamps: number
  percentFill: number
}) {
  if (progressBlock && !progressBlock.visible) return null

  const style = progressBlock?.progressStyle || 'gradient'
  const h = progressBlock?.barHeight || 9
  const r = progressBlock?.borderRadius ?? 6
  const c1 = progressBlock?.bgColor || '#FF5A45'
  const c2 = progressBlock?.bgColor2 || '#FFB238'

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

interface CardStudioPhonePreviewProps {
  config: LiveStudioConfig
  activeLang: 'my' | 'en'
  mobileView: 'editor' | 'preview'
  onSetMobileView: (view: 'editor' | 'preview') => void
}

const CardStudioPhonePreview = React.memo(function CardStudioPhonePreview({
  config,
  activeLang,
  mobileView,
  onSetMobileView,
}: CardStudioPhonePreviewProps) {
  const getBlock = (id: EditableBlockId): EditableBlockConfig => {
    return config.blocks.find((b) => b.id === id) || DEFAULT_4_BLOCKS.find((b) => b.id === id)!
  }

  const heroBlock = getBlock('hero_header')
  const profileBlock = getBlock('store_profile')
  const cardBoxBlock = getBlock('stamp_card_box')
  const progressBlock = getBlock('progress_bar')

  const activeFont = STORE_FONT_OPTIONS.find((f) => f.id === (profileBlock.fontId || 'fraunces')) || STORE_FONT_OPTIONS[0]
  const currentFontFamily = activeFont.fontFamily

  const totalStamps = config.simulatedStamps || 4
  const reqStamps = config.stampsRequired || 10
  const isFull = totalStamps >= reqStamps
  const remainStamps = Math.max(0, reqStamps - totalStamps)
  const percentFill = Math.min(100, Math.round((totalStamps / reqStamps) * 100))

  return (
    <main
      className={`flex-1 bg-gradient-to-b from-[#F7F4EE] via-[#EFEBE2] to-[#E9E4D9] p-3 sm:p-5 md:p-6 lg:p-8 flex flex-col items-center justify-start md:justify-center overflow-y-auto ${
        mobileView === 'editor' ? 'hidden md:flex' : 'flex'
      }`}
    >
      <div className="mb-3 flex items-center justify-between w-full max-w-[380px] px-1">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-[#E2DAD0] text-[10px] sm:text-[11px] text-stone-600 font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Paparan Visual Rupa Paras</span>
        </div>

        <button
          type="button"
          onClick={() => onSetMobileView('editor')}
          className="md:hidden flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs cursor-pointer transition"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>Ubah Reka Bentuk</span>
        </button>
      </div>

      {/* REALISTIC COMPACT PHONE MOCKUP - FIXED NATURAL PROPORTIONS ACROSS ALL SCREENS */}
      <div
        className="w-full max-w-[350px] rounded-[34px] sm:rounded-[38px] shadow-2xl shadow-stone-900/15 overflow-hidden border-[7px] sm:border-[8px] border-[#1E2533] relative flex flex-col pointer-events-none select-none my-auto shrink-0"
        style={{
          backgroundColor: config.pageBgColor || '#FFF7EA',
          backgroundImage: `radial-gradient(circle at 1px 1px, ${config.pageDotColor || 'rgba(43,27,18,0.055)'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      >
        {/* ISLAND / NOTCH */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-[#1E2533] rounded-full z-40 pointer-events-none" />

        {/* LIVE CARD DOM CONTAINER (DYNAMIC FULL-PAGE TYPOGRAPHY - DISPLAY ONLY) */}
        <div
          className="card-app pt-3.5 pointer-events-none select-none"
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
              {/* PATTERN WATERMARK */}
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
                    >
                      MY
                    </button>
                    <button
                      type="button"
                      className={activeLang === 'en' ? 'active' : ''}
                    >
                      EN
                    </button>
                  </div>

                  <div className="top-actions">
                    <button
                      type="button"
                      className="icon-btn gold"
                      title="Kod QR Pelanggan"
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
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="icon-btn"
                      title="Log keluar"
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
                      >
                        <img src="/Google-Review.svg" alt="Review" className="w-3.5 h-3.5 object-contain" />
                        <span>Review</span>
                      </button>
                      <button
                        type="button"
                        className="pill-btn"
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
                      <div
                        key={slotNum}
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
                      </div>
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
                  <div className={`dot ${isFull ? 'full' : ''} active`} />
                  <div className="dot" />
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
                <span>{activeLang === 'en' ? 'Privacy Policy' : 'Dasar Privasi'}</span>
                <span className="dot-sep">•</span>
                <span>{activeLang === 'en' ? 'Delete Account' : 'Padam Akaun'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
})

export default function CardStudioPage() {

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('lajus_lang')
      if (savedLang === 'en' || savedLang === 'my') {
        setActiveLang(savedLang)
      }
    } catch (e) {}
  }, [])

  const [config, setConfig] = useState<LiveStudioConfig>(DEFAULT_LIVE_STUDIO_CONFIG)
  const [activeTab, setActiveTab] = useState<'blocks' | 'presets' | 'simulate'>('blocks')
  const [activeLang, setActiveLang] = useState<'my' | 'en'>('my')
  const [selectedBlockId, setSelectedBlockId] = useState<EditableBlockId | null>('hero_header')
  const [saveStatus, setSaveStatus] = useState<string>('')
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor')
  const t = I18N_STUDIO[activeLang]

  // Debounce refs for performance
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cloud & Template Management State
  const [storeId, setStoreId] = useState<string>('')
  const [customTemplates, setCustomTemplates] = useState<CustomTemplateItem[]>([])
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState<string>('Draf Templat')
  const [isLiveNow, setIsLiveNow] = useState<boolean>(false)
  const [isSavingToCloud, setIsSavingToCloud] = useState<boolean>(false)
  const [cloudToast, setCloudToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Save Modal Dialog State
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false)
  const [modalName, setModalName] = useState<string>('')
  const [modalSetAsLive, setModalSetAsLive] = useState<boolean>(true)
  const [modalError, setModalError] = useState<string>('')

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setCloudToast({ msg, type })
    setTimeout(() => setCloudToast(null), 3500)
  }, [])

  const toggleBlock = useCallback((blockId: EditableBlockId) => {
    setSelectedBlockId((prev) => (prev === blockId ? null : blockId))
  }, [])

  // Clean up debounce timers on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current)
    }
  }, [])

  // Load store settings and custom templates on mount
  useEffect(() => {
    async function loadStudioData() {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 12000)

      try {
        const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
        const targetTemplateId = searchParams?.get('templateId') || (typeof window !== 'undefined' ? localStorage.getItem('cop_card_studio_template_id') : null) || null
        const isNewMode = searchParams?.get('new') === 'true'
        const initialNameParam = searchParams?.get('name') || null

        const res = await fetch('/api/store/settings', { signal: controller.signal })
        clearTimeout(timeoutId)

        if (res.ok) {
          const data = await res.json()
          if (!data.needsRegistration) {
            setStoreId(data.storeId || '')
            const serverTemplates: CustomTemplateItem[] = Array.isArray(data.customTemplates) ? data.customTemplates : []
            setCustomTemplates(serverTemplates)

            if (targetTemplateId) {
              const matched = serverTemplates.find((t) => t.id === targetTemplateId)
              if (matched) {
                setConfig(sanitizeLiveConfig(matched.config))
                setActiveTemplateId(matched.id)
                setTemplateName(matched.name)
                setIsLiveNow(Boolean(data.cardTemplate && JSON.stringify(data.cardTemplate) === JSON.stringify(matched.config)))
                try {
                  localStorage.setItem('cop_card_studio_template_id', matched.id)
                  localStorage.setItem('cop_card_studio_config', JSON.stringify(matched.config))
                } catch (e) {}
                return
              }
            }

            if (isNewMode) {
              setConfig(DEFAULT_LIVE_STUDIO_CONFIG)
              setActiveTemplateId(null)
              setTemplateName(initialNameParam || `Templat #${serverTemplates.length + 1}`)
              setIsLiveNow(false)
              try {
                localStorage.removeItem('cop_card_studio_template_id')
                localStorage.setItem('cop_card_studio_config', JSON.stringify(DEFAULT_LIVE_STUDIO_CONFIG))
              } catch (e) {}
              return
            }

            // Check if draft in localStorage matches a template
            const savedDraft = typeof window !== 'undefined' ? localStorage.getItem('cop_card_studio_config') : null
            const savedTemplateId = typeof window !== 'undefined' ? localStorage.getItem('cop_card_studio_template_id') : null
            if (savedDraft && savedTemplateId) {
              const matched = serverTemplates.find((t) => t.id === savedTemplateId)
              if (matched) {
                const parsed = JSON.parse(savedDraft)
                setConfig(sanitizeLiveConfig(parsed))
                setActiveTemplateId(matched.id)
                setTemplateName(matched.name)
                setIsLiveNow(Boolean(data.cardTemplate && JSON.stringify(data.cardTemplate) === JSON.stringify(matched.config)))
                return
              }
            }

            if (data.cardTemplate) {
              const sanitizedLive = sanitizeLiveConfig(data.cardTemplate)
              setConfig(sanitizedLive)
              const liveMatched = serverTemplates.find((t) => JSON.stringify(t.config) === JSON.stringify(data.cardTemplate))
              if (liveMatched) {
                setActiveTemplateId(liveMatched.id)
                setTemplateName(liveMatched.name)
              } else {
                setActiveTemplateId(null)
                setTemplateName('Templat Live Semasa')
              }
              setIsLiveNow(true)
              return
            }
          }
        }
// Fallback to localStorage draft
        const saved = localStorage.getItem('cop_card_studio_config')
        if (saved) {
          const parsed = JSON.parse(saved)
          setConfig(sanitizeLiveConfig(parsed))
        }
      } catch (e) {
        clearTimeout(timeoutId)
        console.error('Failed to load studio data:', e)
      }
    }

    loadStudioData()
  }, [])

  const saveConfig = useCallback((newConfig: LiveStudioConfig) => {
    // 1. Immediate in-memory React state update for responsive UI
    setConfig(newConfig)

    // 2. Debounce writing to localStorage to prevent blocking the main thread
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('cop_card_studio_config', JSON.stringify(newConfig))
        setSaveStatus('Draf dikemas kini')
        if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current)
        statusTimeoutRef.current = setTimeout(() => setSaveStatus(''), 2000)
      } catch (e) {
        console.error('Failed to save config draft:', e)
      }
    }, 350)
  }, [])

  // Open Save Modal
  const handleOpenSaveModal = useCallback((forceLive = false) => {
    setModalName(templateName || 'Templat Kad Saya')
    setModalSetAsLive(forceLive ? true : isLiveNow)
    setModalError('')
    setShowSaveModal(true)
  }, [templateName, isLiveNow])

  // Save Template to Cloud (Supabase via /api/store/settings)
  const handleCloudSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const cleanName = modalName.trim()
    if (!cleanName) {
      setModalError('Sila masukkan nama templat.')
      return
    }

    // Check 3 templates quota
    const isNew = !activeTemplateId || !customTemplates.some((t) => t.id === activeTemplateId)
    if (isNew && customTemplates.length >= 3) {
      setModalError('Had kuota 3 templat telah penuh! Sila kemas kini templat sedia ada atau padam templat lain dalam Dashboard.')
      return
    }

    setIsSavingToCloud(true)
    setModalError('')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const templateId = activeTemplateId || `tpl_${Date.now()}`
      const newTemplateItem: CustomTemplateItem = {
        id: templateId,
        name: cleanName,
        config: config,
        createdAt: customTemplates.find((t) => t.id === templateId)?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      let updatedTemplates: CustomTemplateItem[] = []
      if (activeTemplateId && customTemplates.some((t) => t.id === activeTemplateId)) {
        updatedTemplates = customTemplates.map((t) => (t.id === activeTemplateId ? newTemplateItem : t))
      } else {
        updatedTemplates = [...customTemplates, newTemplateItem].slice(0, 3)
      }

      const bodyPayload: any = {
        customTemplates: updatedTemplates,
      }
      if (modalSetAsLive) {
        bodyPayload.cardTemplate = config
      }

      const res = await fetch('/api/store/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan templat ke akaun kedai.')
      }

      setCustomTemplates(Array.isArray(data.customTemplates) ? data.customTemplates : updatedTemplates)
      setActiveTemplateId(templateId)
      setTemplateName(cleanName)
      setIsLiveNow(modalSetAsLive)
      setShowSaveModal(false)

      showToast(
        modalSetAsLive
          ? 'Templat berjaya disimpan & diaktifkan secara Live untuk pelanggan!'
          : 'Templat berjaya disimpan ke dalam akaun kedai!',
        'success'
      )

      // Update URL search query
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.set('templateId', templateId)
        url.searchParams.delete('new')
        url.searchParams.delete('name')
        window.history.replaceState({}, '', url.toString())
      }
    } catch (err: any) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        setModalError('Permintaan tamat masa (Timeout). Sila semak sambungan internet anda dan cuba lagi.')
      } else {
        setModalError(err.message || 'Ralat semasa menyimpan templat.')
      }
    } finally {
      clearTimeout(timeoutId)
      setIsSavingToCloud(false)
    }
  }

  const updateBlock = useCallback((blockId: EditableBlockId, partial: Partial<EditableBlockConfig>) => {
    setConfig((prevConfig) => {
      const updatedBlocks = prevConfig.blocks.map((b) => (b.id === blockId ? { ...b, ...partial } : b))
      const nextConfig = { ...prevConfig, blocks: updatedBlocks }

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem('cop_card_studio_config', JSON.stringify(nextConfig))
          setSaveStatus('Draf dikemas kini')
          if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current)
          statusTimeoutRef.current = setTimeout(() => setSaveStatus(''), 2000)
        } catch (e) {
          console.error('Failed to save config draft:', e)
        }
      }, 350)

      return nextConfig
    })
  }, [])

  const applyPreset = useCallback((preset: ThemePreset) => {
    setConfig((prevConfig) => {
      const updatedBlocks: EditableBlockConfig[] = prevConfig.blocks.map((b) => {
        if (b.id === 'hero_header') {
          return {
            ...b,
            bgColor: preset.hero1,
            bgColor2: preset.hero2,
            pattern: preset.pattern,
          }
        }
        if (b.id === 'store_profile') {
          return {
            ...b,
            fontId: preset.fontId,
          }
        }
        if (b.id === 'stamp_card_box') {
          return {
            ...b,
            cardStyle: preset.cardStyle,
            bgColor: preset.cardBg,
            borderColor: preset.cardBorder,
          }
        }
        if (b.id === 'progress_bar') {
          return {
            ...b,
            progressStyle: preset.progressStyle,
            bgColor: preset.progressFill1,
            bgColor2: preset.progressFill2,
          }
        }
        return b
      })

      const nextConfig: LiveStudioConfig = {
        ...prevConfig,
        pageBgColor: preset.pageBg,
        pageDotColor: preset.pageDot,
        primaryColor: preset.hero1,
        secondaryAccent: preset.hero2,
        blocks: updatedBlocks,
      }

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem('cop_card_studio_config', JSON.stringify(nextConfig))
          setSaveStatus('Draf dikemas kini')
          if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current)
          statusTimeoutRef.current = setTimeout(() => setSaveStatus(''), 2000)
        } catch (e) {
          console.error('Failed to save config draft:', e)
        }
      }, 350)

      return nextConfig
    })
  }, [])

  const resetToDefault = useCallback(() => {
    if (confirm('Tetapkan semula semua tetapan kepada reka bentuk asal seperti live card?')) {
      setConfig(DEFAULT_LIVE_STUDIO_CONFIG)
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      try {
        localStorage.setItem('cop_card_studio_config', JSON.stringify(DEFAULT_LIVE_STUDIO_CONFIG))
        setSaveStatus('Berjaya reset ke asal!')
        if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current)
        statusTimeoutRef.current = setTimeout(() => setSaveStatus(''), 2000)
      } catch {}
    }
  }, [])

  const heroBlock = useMemo(
    () => config.blocks.find((b) => b.id === 'hero_header') || DEFAULT_4_BLOCKS[0],
    [config.blocks]
  )
  const profileBlock = useMemo(
    () => config.blocks.find((b) => b.id === 'store_profile') || DEFAULT_4_BLOCKS[1],
    [config.blocks]
  )
  const cardBoxBlock = useMemo(
    () => config.blocks.find((b) => b.id === 'stamp_card_box') || DEFAULT_4_BLOCKS[2],
    [config.blocks]
  )
  const progressBlock = useMemo(
    () => config.blocks.find((b) => b.id === 'progress_bar') || DEFAULT_4_BLOCKS[3],
    [config.blocks]
  )

  // Selected global font (applied across the whole card page)
  const activeFont = useMemo(
    () => STORE_FONT_OPTIONS.find((f) => f.id === (profileBlock.fontId || 'fraunces')) || STORE_FONT_OPTIONS[0],
    [profileBlock.fontId]
  )
  const currentFontFamily = activeFont.fontFamily

  const totalStamps = config.simulatedStamps || 4
  const reqStamps = config.stampsRequired || 10
  const isFull = totalStamps >= reqStamps
  const remainStamps = Math.max(0, reqStamps - totalStamps)
  const percentFill = Math.min(100, Math.round((totalStamps / reqStamps) * 100))

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-stone-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
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
          max-width: 350px;
          margin: 0 auto;
          padding-bottom: 6px;
          pointer-events: none !important;
        }

        .card-app, .card-app * {
          cursor: default !important;
          -webkit-user-select: none !important;
          user-select: none !important;
        }

        .card-app button, .card-app a, .card-app .icon-btn, .card-app .pill-btn, .card-app .social-btn, .card-app .stamp, .card-app .dot {
          pointer-events: none !important;
          cursor: default !important;
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
          padding: 10px 12px 14px;
        }
        .hero-inner {
          position: relative;
          z-index: 1;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .lang-toggle {
          display: flex;
          align-items: center;
          gap: 2px;
          background: var(--panel-hero);
          border: 1px solid var(--panel-hero-border);
          border-radius: var(--r-full);
          padding: 2px;
        }
        .lang-toggle button {
          border: none;
          background: transparent;
          color: var(--muted-on-hero);
          font-weight: 700;
          font-size: 10.5px;
          padding: 4px 9px;
          border-radius: var(--r-full);
          transition: .15s;
        }
        .lang-toggle button.active {
          background: #fff;
          color: var(--coral-deep);
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .icon-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--panel-hero-border);
          background: var(--panel-hero);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: .15s;
        }
        .icon-btn:hover {
          background: rgba(255,255,255,0.32);
        }
        .icon-btn.gold {
          color: #FFEBC2;
        }
        .icon-btn svg {
          width: 13px;
          height: 13px;
        }

        .profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .avatar {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #fff;
          color: var(--coral-deep);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
          border: 2.5px solid rgba(255,255,255,0.55);
          margin-bottom: 6px;
          overflow: hidden;
        }

        .store-name {
          display: flex;
          align-items: center;
          gap: 5px;
          justify-content: center;
          font-weight: 700;
          font-size: 16.5px;
          color: #fff;
          line-height: 1.2;
        }
        .verified-badge {
          width: 15px;
          height: 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .socials {
          display: flex;
          gap: 5px;
          justify-content: center;
          margin-top: 5px;
          flex-wrap: wrap;
        }
        .social-btn {
          width: 23px;
          height: 23px;
          border-radius: 50%;
          background: var(--panel-hero);
          border: 1px solid var(--panel-hero-border);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #ffffff;
          transition: transform .15s, background .15s;
        }

        .pill-row {
          display: flex;
          gap: 5px;
          justify-content: center;
          align-items: center;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .pill-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: 1px solid var(--border-warm);
          background: #ffffff;
          color: var(--ink-strong);
          border-radius: 9px;
          padding: 4.5px 8.5px;
          font-size: 10.5px;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          white-space: nowrap;
        }
        .pill-btn svg {
          width: 11px;
          height: 11px;
          color: var(--coral);
        }

        .card-content {
          padding: 8px 10px 0;
        }

        .stamp-card {
          border-radius: var(--r-lg);
          padding: 13px 11px 11px;
          color: var(--ink);
          border: 1px solid var(--border-warm);
          box-sizing: border-box;
          transition: all .25s ease;
        }

        .stamp-card-head {
          text-align: center;
          margin-bottom: 3px;
        }
        .stamp-card-head .label {
          font-size: 10px;
          letter-spacing: 0.04em;
          color: var(--teal);
          font-weight: 800;
          margin-bottom: 1px;
          text-transform: uppercase;
        }
        .stamp-card-head .count {
          font-weight: 700;
          font-size: 27px;
          color: var(--coral);
          line-height: 1;
        }
        .stamp-card-head .count small {
          font-size: 13px;
          color: var(--muted);
          font-weight: 600;
        }

        .perforation {
          display: flex;
          gap: 4px;
          justify-content: center;
          margin: 6px 0 8px;
          opacity: 0.5;
        }
        .perforation span {
          width: 3.5px;
          height: 3.5px;
          border-radius: 50%;
          background: var(--border-warm);
        }

        .stamp-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
          margin-bottom: 8px;
        }

        .stamp {
          aspect-ratio: 1/1;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform .15s, filter .15s;
        }
        .stamp.empty {
          border: 1.5px dashed var(--border-warm);
          background: rgba(255,178,56,0.07);
          color: #D8B98C;
          font-weight: 700;
          font-size: 10px;
        }
        .stamp.filled {
          background: radial-gradient(circle at 32% 28%, rgba(255,255,255,0.4), transparent 55%), linear-gradient(145deg, var(--coral), var(--coral-deep));
          box-shadow: 0 4px 10px rgba(255,90,69,0.35);
        }

        .progress-bar {
          background: #F5EBE1;
          overflow: hidden;
          position: relative;
        }
        .progress-bar-fill {
          height: 100%;
          transition: width .5s ease;
        }

        .status-text {
          text-align: center;
          font-size: 11px;
          color: var(--ink);
          font-weight: 700;
          margin-top: 6px;
          line-height: 1.3;
        }
        .status-text b {
          color: var(--coral-deep);
        }

        .card-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 7px;
        }
        .dot {
          width: 6.5px;
          height: 6.5px;
          padding: 0;
          border: none;
          border-radius: var(--r-full);
          background: var(--border-warm);
          transition: .25s ease;
          flex-shrink: 0;
        }
        .dot.full {
          background: var(--green);
          opacity: 0.55;
        }
        .dot.active {
          width: 20px;
          background: var(--coral);
          opacity: 1;
        }

        .updated-text {
          text-align: center;
          margin-top: 7px;
          font-size: 9.5px;
          color: var(--muted);
          font-weight: 600;
        }

        .card-footer {
          text-align: center;
          margin-top: 10px;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 11px;
          margin-bottom: 2px;
          font-weight: 800;
          color: var(--ink);
        }
        .footer-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 9.5px;
          color: var(--muted);
        }
        .footer-links .dot-sep {
          color: var(--border-warm);
        }
      ` }} />

      {/* TOP HEADER / NAVBAR (CLEAN, PROFESSIONAL, NO EMOJIS, FULLY RESPONSIVE) */}
      <header className="h-14 sm:h-16 border-b border-[#EBE5DB] bg-white/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0 z-30 sticky top-0 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 sm:gap-1.5 text-stone-600 hover:text-stone-900 text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="hidden xs:inline sm:inline">Dashboard</span>
          </Link>
          <div className="h-3.5 w-px bg-stone-300" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-stone-900 truncate max-w-[130px] sm:max-w-[190px]">
              {templateName || 'Card Studio'}
            </h1>
            
            <span className="hidden md:inline-flex text-[10px] bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-200" title="Kuota Templat">
              {t.templatesCount(customTemplates.length)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {saveStatus && (
            <span className="text-[11px] text-stone-500 font-medium hidden lg:inline">
              {saveStatus}
            </span>
          )}

          {/* SIMPAN TEMPLAT BUTTON */}
          <button
            type="button"
            onClick={() => handleOpenSaveModal(false)}
            className="text-xs font-bold bg-white hover:bg-stone-50 text-stone-800 px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-stone-300 shadow-2xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
            title="Simpan templat ke akaun"
          >
            <svg className="w-3.5 h-3.5 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span className="hidden sm:inline">{t.saveTemplate}</span>
            <span className="sm:hidden">{t.save}</span>
          </button>

          {/* BUTANG LIVE DENGAN EMOJI KILAT */}
          <button
            type="button"
            onClick={() => handleOpenSaveModal(true)}
            className={`text-xs font-bold px-2.5 sm:px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              isLiveNow
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs border border-emerald-500'
                : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 shadow-2xs'
            }`}
            title={isLiveNow ? (activeLang === 'en' ? 'Active Live Template' : 'Templat Sedang Live') : (activeLang === 'en' ? 'Set as Live Template' : 'Jadikan Templat Live')}
          >
            <span className="text-sm select-none">⚡</span>
            <span>Live</span>
          </button>

          {/* RESET ASAL BUTTON */}
          <button
            type="button"
            onClick={resetToDefault}
            className="text-xs font-semibold bg-stone-100 hover:bg-stone-200/80 text-stone-600 px-2 sm:px-2.5 py-1.5 rounded-xl border border-stone-200 transition cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Reset ke reka bentuk asal"
          >
            <svg className="w-3.5 h-3.5 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          </button>

          {/* PRATONTON PENUH BUTTON */}
          <Link
            href={activeTemplateId ? `/card-preview?templateId=${encodeURIComponent(activeTemplateId)}` : '/card-preview'}
            onClick={() => {
              try {
                localStorage.setItem('cop_card_studio_config', JSON.stringify(config))
                if (activeTemplateId) {
                  localStorage.setItem('cop_card_studio_template_id', activeTemplateId)
                } else {
                  localStorage.removeItem('cop_card_studio_template_id')
                }
              } catch (e) {}
            }}
            className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-2.5 sm:px-3.5 py-1.5 rounded-xl shadow-2xs transition flex items-center gap-1.5"
            title="Buka Pratonton Penuh"
          >
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="hidden md:inline">{t.previewFull}</span>
          </Link>
        </div>
      </header>

      {/* MOBILE / SMALL TABLET VIEW TOGGLE (STICKY BELOW HEADER ON PHONES < MD BREAKPOINT) */}
      <div className="md:hidden flex bg-[#FAF7F2] p-1.5 border-b border-[#EBE5DB] gap-1.5 sticky top-14 sm:top-16 z-20 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileView === 'editor'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>{t.editorPanel}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileView === 'preview'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
          </svg>
          <span>{t.livePreview}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>

      {/* WORKSPACE AREA (TABLET & DESKTOP: SPLIT SCREEN; MOBILE: TABBED TOGGLE) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        {/* LEFT PANEL: 3 TABS (4 BLOK, TEMA & WARNA, SIMULATOR) */}
        <aside className={`w-full md:w-[370px] lg:w-[440px] xl:w-[480px] bg-white border-r border-[#EBE5DB] flex flex-col shrink-0 overflow-y-auto shadow-sm ${
          mobileView === 'preview' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* TABS (CLEAN & SLEEK) */}
          <div className="flex border-b border-[#EBE5DB] p-1.5 sm:p-2 gap-1 sm:gap-1.5 bg-[#FAF7F2] sticky top-0 z-20">
            <button
              type="button"
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 py-2 px-1.5 sm:px-2.5 text-[11px] sm:text-xs font-bold rounded-xl transition cursor-pointer text-center ${
                activeTab === 'blocks'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
              }`}
            >
              4 Blok Reka Bentuk
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 px-1.5 sm:px-2.5 text-[11px] sm:text-xs font-bold rounded-xl transition cursor-pointer text-center ${
                activeTab === 'presets'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
              }`}
            >
              Tema & Warna
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('simulate')}
              className={`flex-1 py-2 px-1.5 sm:px-2.5 text-[11px] sm:text-xs font-bold rounded-xl transition cursor-pointer text-center ${
                activeTab === 'simulate'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
              }`}
            >
              Simulator Cop
            </button>
          </div>

          <div className="p-3.5 sm:p-5 space-y-4 sm:space-y-5">
            {/* TAB 1: 4 BLOCKS ACCORDION */}
            {activeTab === 'blocks' && (
              <div className="space-y-3.5">
                <div className="text-xs text-stone-600 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE5DA] leading-relaxed">
                  {t.blocksIntro}
                </div>

                {/* 1. HERO HEADER */}
                <div
                  className={`border rounded-2xl p-4 transition-all ${
                    selectedBlockId === 'hero_header'
                      ? 'bg-[#FCFAF7] border-amber-400 ring-2 ring-amber-400/15 shadow-sm'
                      : 'bg-white hover:bg-stone-50/50 border-[#EAE3D8] shadow-2xs'
                  }`}
                >
                  <div
                    onClick={() => toggleBlock('hero_header')}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200/60">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{t.block1Title}</h4>
                        <p className="text-[11px] text-stone-500">{t.block1Desc}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                        selectedBlockId === 'hero_header'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {selectedBlockId === 'hero_header' ? t.closeBtn : t.editBtn}
                    </span>
                  </div>

                  {selectedBlockId === 'hero_header' && (
                    <div className="mt-4 pt-3.5 border-t border-[#EAE3D8] space-y-4">
                      {/* Corak Pilihan (11 Corak) */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-2">
                          {t.patternLabel(HERO_PATTERN_OPTIONS.length)}
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
                                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400 font-bold shadow-2xs'
                                    : 'bg-white border-[#E8E1D5] text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                                }`}
                              >
                                <span className="text-base">{opt.icon}</span>
                                <div className="overflow-hidden">
                                  <div className="text-xs font-bold truncate">{opt.label}</div>
                                  <div className="text-[10px] text-stone-500 truncate">{opt.desc}</div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Kepekatan Corak (Opacity) */}
                      <div>
                        <div className="flex justify-between text-xs text-stone-700 font-semibold mb-1">
                          <span>{t.patternOpacity}</span>
                          <span className="font-mono text-amber-700 font-bold">{Math.round((heroBlock.patternOpacity ?? 0.25) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={heroBlock.patternOpacity ?? 0.25}
                          onChange={(e) => updateBlock('hero_header', { patternOpacity: parseFloat(e.target.value) })}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>

                      {/* Warna Gradien Hero */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">Warna Gradien Mula:</label>
                          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E2DAD0]">
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
                              className="w-full bg-transparent text-stone-900 font-mono text-[11px] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">Warna Gradien Akhir:</label>
                          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E2DAD0]">
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
                              className="w-full bg-transparent text-stone-900 font-mono text-[11px] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Kelengkungan Bawah (Border Radius) */}
                      <div>
                        <div className="flex justify-between text-xs text-stone-700 font-semibold mb-1">
                          <span>{t.borderRadiusHeader}</span>
                          <span className="font-mono text-amber-700 font-bold">{heroBlock.borderRadius ?? 34}px</span>
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
                <div
                  className={`border rounded-2xl p-4 transition-all ${
                    selectedBlockId === 'store_profile'
                      ? 'bg-[#FCFAF7] border-amber-400 ring-2 ring-amber-400/15 shadow-sm'
                      : 'bg-white hover:bg-stone-50/50 border-[#EAE3D8] shadow-2xs'
                  }`}
                >
                  <div
                    onClick={() => toggleBlock('store_profile')}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200/60">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{t.block2Title}</h4>
                        <p className="text-[11px] text-stone-500">{t.block2Desc}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                        selectedBlockId === 'store_profile'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {selectedBlockId === 'store_profile' ? t.closeBtn : t.editBtn}
                    </span>
                  </div>

                  {selectedBlockId === 'store_profile' && (
                    <div className="mt-4 pt-3.5 border-t border-[#EAE3D8] space-y-4">
                      {/* TOGGLE GAMBAR PROFIL */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E2DAD0]">
                        <div>
                          <div className="text-xs font-bold text-stone-800">{t.showProfilePic}</div>
                          <div className="text-[10px] text-stone-500">{t.showProfilePicDesc}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateBlock('store_profile', { showLogo: profileBlock.showLogo === false ? true : false })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            profileBlock.showLogo !== false
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                          }`}
                        >
                          {profileBlock.showLogo !== false ? t.onShown : t.offHidden}
                        </button>
                      </div>

                      {/* PILIHAN FON SELURUH KAD */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-stone-700">
                            {t.fontOptionLabel(STORE_FONT_OPTIONS.length)}
                          </label>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold border border-amber-200">
                            Apply Semua Teks
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 mb-2">
                          Fon yang dipilih akan digunakan untuk Nama Kedai, tajuk, butang, status & keseluruhan kad.
                        </p>
                        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                          {STORE_FONT_OPTIONS.map((f) => {
                            const isSelected = (profileBlock.fontId || 'fraunces') === f.id
                            return (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => updateBlock('store_profile', { fontId: f.id })}
                                className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400 font-bold shadow-2xs'
                                    : 'bg-white border-[#E8E1D5] text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                                }`}
                              >
                                <div>
                                  <div className="text-xs text-stone-500 font-medium">{f.name} ({f.category})</div>
                                  <div className="text-base font-bold text-stone-900 mt-0.5" style={{ fontFamily: f.fontFamily }}>
                                    {config.storeName || f.sampleText}
                                  </div>
                                </div>
                                {isSelected && <span className="text-amber-700 font-bold text-sm">✓ Dipilih</span>}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* NAMA KEDAI TEKS */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">Nama Kedai (Teks):</label>
                        <input
                          type="text"
                          value={config.storeName}
                          onChange={(e) => saveConfig({ ...config, storeName: e.target.value })}
                          className="w-full bg-white border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. KOTAK KAD COP */}
                <div
                  className={`border rounded-2xl p-4 transition-all ${
                    selectedBlockId === 'stamp_card_box'
                      ? 'bg-[#FCFAF7] border-amber-400 ring-2 ring-amber-400/15 shadow-sm'
                      : 'bg-white hover:bg-stone-50/50 border-[#EAE3D8] shadow-2xs'
                  }`}
                >
                  <div
                    onClick={() => toggleBlock('stamp_card_box')}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200/60">
                        3
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{t.block3Title}</h4>
                        <p className="text-[11px] text-stone-500">{t.block3Desc}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                        selectedBlockId === 'stamp_card_box'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {selectedBlockId === 'stamp_card_box' ? t.closeBtn : t.editBtn}
                    </span>
                  </div>

                  {selectedBlockId === 'stamp_card_box' && (
                    <div className="mt-4 pt-3.5 border-t border-[#EAE3D8] space-y-4">
                      {/* 6 PILIHAN GAYA MATERIAL */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-2">
                          {t.materialOptionLabel(CARD_STYLE_OPTIONS.length)}
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
                                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400 font-bold shadow-2xs'
                                    : 'bg-white border-[#E8E1D5] text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                                }`}
                              >
                                <span className="text-xl">{styleOpt.icon}</span>
                                <div>
                                  <div className="text-xs font-bold">{styleOpt.name}</div>
                                  <div className="text-[10px] text-stone-500 line-clamp-2">{styleOpt.desc}</div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* KELENGKUNGAN KOTAK KAD */}
                      <div>
                        <div className="flex justify-between text-xs text-stone-700 font-semibold mb-1">
                          <span>{t.cardBorderRadius}</span>
                          <span className="font-mono text-amber-700 font-bold">{cardBoxBlock.borderRadius ?? 28}px</span>
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
                <div
                  className={`border rounded-2xl p-4 transition-all ${
                    selectedBlockId === 'progress_bar'
                      ? 'bg-[#FCFAF7] border-amber-400 ring-2 ring-amber-400/15 shadow-sm'
                      : 'bg-white hover:bg-stone-50/50 border-[#EAE3D8] shadow-2xs'
                  }`}
                >
                  <div
                    onClick={() => toggleBlock('progress_bar')}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200/60">
                        4
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{t.block4Title}</h4>
                        <p className="text-[11px] text-stone-500">ON/OFF & 3 gaya animasi (termasuk animasi air)</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                        selectedBlockId === 'progress_bar'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {selectedBlockId === 'progress_bar' ? t.closeBtn : t.editBtn}
                    </span>
                  </div>

                  {selectedBlockId === 'progress_bar' && (
                    <div className="mt-4 pt-3.5 border-t border-[#EAE3D8] space-y-4">
                      {/* TOGGLE BAR KEMAJUAN ON/OFF */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E2DAD0]">
                        <div>
                          <div className="text-xs font-bold text-stone-800">Status Bar Kemajuan</div>
                          <div className="text-[10px] text-stone-500">Pilih sama ada mahu tunjuk atau sembunyikan bar</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateBlock('progress_bar', { visible: !progressBlock.visible })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            progressBlock.visible
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                          }`}
                        >
                          {progressBlock.visible ? 'ON (Dipaparkan)' : 'OFF (Sembunyi)'}
                        </button>
                      </div>

                      {progressBlock.visible && (
                        <>
                          {/* 3 GAYA BAR KEMAJUAN */}
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-2">
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
                                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400 font-bold shadow-2xs'
                                        : 'bg-white border-[#E8E1D5] text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-lg">{pOpt.icon}</span>
                                      <div>
                                        <div className="text-xs font-bold">{pOpt.name}</div>
                                        <div className="text-[10px] text-stone-500">{pOpt.desc}</div>
                                      </div>
                                    </div>
                                    {isSelected && <span className="text-amber-700 font-bold text-sm">✓ Dipilih</span>}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* WARNA BAR */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 mb-1">Warna Bar 1:</label>
                              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E2DAD0]">
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
                                  className="w-full bg-transparent text-stone-900 font-mono text-[11px] outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 mb-1">Warna Bar 2:</label>
                              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E2DAD0]">
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
                                  className="w-full bg-transparent text-stone-900 font-mono text-[11px] outline-none"
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

            {/* TAB 2: TEMA DISYORKAN & TEMA WARNA */}
            {activeTab === 'presets' && (
              <div className="space-y-4">
                {/* 1. TEMA DISYORKAN (1-KLIK) */}
                <div className="space-y-3">
                  <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE5DA] text-xs text-stone-600 leading-relaxed">
                    <b>Pilihan Tema Disyorkan:</b> Klik mana-mana tema sedia ada di bawah untuk menukar padanan warna banner, fon seluruh kad, corak motif, dan gaya material kotak secara serentak.
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {LIVE_PRESETS.map((p) => {
                      const isCurrent = (
                        (heroBlock.bgColor || '').toLowerCase() === p.hero1.toLowerCase() &&
                        (heroBlock.bgColor2 || '').toLowerCase() === p.hero2.toLowerCase() &&
                        heroBlock.pattern === p.pattern &&
                        (profileBlock.fontId || 'fraunces') === p.fontId &&
                        (cardBoxBlock.cardStyle || 'kertas') === p.cardStyle
                      )

                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => applyPreset(p)}
                          className={`p-3 rounded-2xl text-left transition flex items-center justify-between cursor-pointer group shadow-2xs border ${
                            isCurrent
                              ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                              : 'bg-white hover:bg-stone-50 border-[#EAE3D8] hover:border-amber-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold border border-white/40 shadow-xs shrink-0 relative"
                              style={{
                                background: `linear-gradient(135deg, ${p.hero1} 0%, ${p.hero2} 100%)`,
                              }}
                            >
                              {HERO_PATTERN_OPTIONS.find((opt) => opt.id === p.pattern)?.icon || '🎨'}
                              {isCurrent && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border border-white shadow-xs">
                                  ✓
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`font-bold text-xs transition ${isCurrent ? 'text-amber-950 font-extrabold' : 'text-stone-900 group-hover:text-amber-800'}`}>
                                  {p.name}
                                </span>
                                {isCurrent && (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                                    {activeLang === 'en' ? 'Active' : 'Aktif'}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                                {p.desc}
                              </div>
                              <div className="text-[9.5px] text-stone-400 mt-0.5">
                                Kad: <span className="text-stone-700 font-semibold">{CARD_STYLE_OPTIONS.find((s) => s.id === p.cardStyle)?.name || 'Kertas'}</span> • Fon: <span className="text-stone-700 font-semibold">{STORE_FONT_OPTIONS.find((f) => f.id === p.fontId)?.name || 'Fraunces'}</span>
                              </div>
                            </div>
                          </div>

                          {/* SWATCHES & ACTION BADGE */}
                          <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                            <div className="flex gap-1">
                              <div className="w-3.5 h-3.5 rounded-full border border-stone-200 shadow-2xs" style={{ backgroundColor: p.hero1 }} />
                              <div className="w-3.5 h-3.5 rounded-full border border-stone-200 shadow-2xs" style={{ backgroundColor: p.hero2 }} />
                              <div className="w-3.5 h-3.5 rounded-full border border-stone-200 shadow-2xs" style={{ backgroundColor: p.progressFill1 }} />
                            </div>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition border ${
                                isCurrent
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                  : 'bg-stone-100 text-stone-700 group-hover:bg-amber-500 group-hover:text-white border-stone-200'
                              }`}
                            >
                              {isCurrent
                                ? (activeLang === 'en' ? '✓ In Use' : '✓ Digunakan')
                                : (activeLang === 'en' ? 'Apply Theme →' : 'Guna Tema →')}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. PENYESUAIAN TEMA WARNA HALAMAN */}
                <div className="bg-[#FCFAF7] border border-[#EAE3D8] rounded-2xl p-4 space-y-4 shadow-2xs">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">Penyesuaian Tema Warna Halaman</h4>
                    <p className="text-[11px] text-stone-500">Sesuaikan warna latar belakang dan bintik halaman</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Warna Latar Belakang:</label>
                      <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E2DAD0]">
                        <input
                          type="color"
                          value={config.pageBgColor || '#FFF7EA'}
                          onChange={(e) => saveConfig({ ...config, pageBgColor: e.target.value })}
                          className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={config.pageBgColor || '#FFF7EA'}
                          onChange={(e) => saveConfig({ ...config, pageBgColor: e.target.value })}
                          className="w-full bg-transparent text-stone-900 font-mono text-[11px] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Warna Bintik Latar:</label>
                      <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E2DAD0]">
                        <input
                          type="text"
                          value={config.pageDotColor || 'rgba(43,27,18,0.055)'}
                          onChange={(e) => saveConfig({ ...config, pageDotColor: e.target.value })}
                          className="w-full bg-transparent text-stone-900 font-mono text-[11px] outline-none px-1"
                          placeholder="rgba(...)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PALET WARNA PANTAS */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-2">Palet Warna Pantas:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Warm Cream', bg: '#FFF7EA', dot: 'rgba(43,27,18,0.055)' },
                        { label: 'Clean White', bg: '#F8FAFC', dot: 'rgba(15,23,42,0.04)' },
                        { label: 'Dark Onyx', bg: '#0F172A', dot: 'rgba(255,255,255,0.05)' },
                        { label: 'Soft Mint', bg: '#F0FDF4', dot: 'rgba(22,101,52,0.05)' },
                        { label: 'Sweet Blush', bg: '#FFF1F2', dot: 'rgba(159,18,57,0.05)' },
                        { label: 'Sky Blue', bg: '#F0F9FF', dot: 'rgba(3,105,161,0.05)' },
                      ].map((pal) => (
                        <button
                          key={pal.label}
                          type="button"
                          onClick={() => saveConfig({ ...config, pageBgColor: pal.bg, pageDotColor: pal.dot })}
                          className="p-2 rounded-xl border border-[#EAE3D8] hover:border-amber-500 bg-white flex items-center gap-2 transition cursor-pointer text-left shadow-2xs"
                        >
                          <div className="w-4 h-4 rounded-full border border-stone-300 shrink-0" style={{ backgroundColor: pal.bg }} />
                          <span className="text-[10.5px] font-bold text-stone-800 truncate">{pal.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SIMULATE STAMPS */}
            {activeTab === 'simulate' && (
              <div className="space-y-4">
                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE5DA] text-xs text-stone-600 leading-relaxed">
                  <b>Simulator Cop:</b> Uji rupa paras kad pelanggan apabila menerima cop bertambah atau penuh.
                </div>

                <div className="bg-white border border-[#EAE3D8] p-4 rounded-2xl space-y-4 shadow-2xs">
                  <div>
                    <div className="flex justify-between text-stone-700 text-xs font-semibold mb-1.5">
                      <span>Bilangan Cop Semasa (Simulasi):</span>
                      <span className="text-amber-700 font-bold font-mono text-sm">{config.simulatedStamps} / {config.stampsRequired}</span>
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
                    <label className="block text-stone-700 text-xs font-semibold mb-1.5">
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
                              ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {num} {t.stampsSuffix}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA] text-xs space-y-1 text-stone-700">
                    <div>Status: <b className="text-stone-900">{isFull ? t.simStatusFull : t.simStatusProgress}</b></div>
                    <div>Baki: <b className="text-amber-700">{remainStamps} cop</b> lagi untuk ganjaran.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PANEL: LIVE EXACT PHONE MOCKUP (WARM SOOTHING DESK ATMOSPHERE) */}
        <CardStudioPhonePreview
          config={config}
          activeLang={activeLang}
          mobileView={mobileView}
          onSetMobileView={setMobileView}
        />
      </div>

      {/* FLOATING CLOUD TOAST NOTIFICATION */}
      {cloudToast && (
        <div
          className={`fixed bottom-6 right-6 z-50 py-3 px-4 rounded-2xl text-xs font-bold text-white shadow-xl flex items-center gap-2.5 transition-all animate-bounce ${
            cloudToast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          <span>{cloudToast.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{cloudToast.msg}</span>
        </div>
      )}

      {/* SAVE TEMPLATE MODAL DIALOG */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-[420px] shadow-2xl border border-stone-200 anim-scale">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-base">
                  💾
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{t.saveModalTitle}</h3>
                  <p className="text-[11px] text-stone-500">{t.saveModalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center text-xs font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCloudSave} className="space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium leading-relaxed">
                  {modalError}
                </div>
              )}

              {/* NAMA TEMPLAT INPUT */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.templateNameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder={t.templateNamePlaceholder}
                  maxLength={50}
                  required
                  autoFocus
                  className="w-full bg-stone-50 border border-stone-300 focus:border-amber-500 focus:bg-white rounded-xl p-2.5 text-xs text-stone-900 font-medium outline-none transition"
                />
                <div className="flex justify-between items-center text-[10px] text-stone-500 mt-1">
                  <span>{t.templateNameHint}</span>
                  <span>{modalName.length}/50</span>
                </div>
              </div>

              {/* KUOTA TEMPLAT INFO */}
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EDE5DA] text-xs">
                <div className="flex items-center justify-between font-bold text-stone-800 mb-1">
                  <span>{t.quotaUsage}</span>
                  <span className="text-amber-800 font-mono">
                    {activeTemplateId ? `${customTemplates.length}/3 ${t.quotaUpdated}` : `${Math.min(3, customTemplates.length + 1)}/3 ${t.quotaNew}`}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Setiap akaun kedai dihadkan kepada 3 templat. Anda boleh menukar templat yang aktif pada bila-bila masa.
                </p>
              </div>

              {/* JADIKAN LIVE CHECKBOX */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={modalSetAsLive}
                  onChange={(e) => setModalSetAsLive(e.target.checked)}
                  className="mt-0.5 accent-emerald-600 w-4 h-4 rounded cursor-pointer shrink-0"
                />
                <div className="text-xs">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>{t.setAsLiveCheckbox}</span>
                    <span className="text-[9.5px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-md">Live</span>
                  </div>
                  <div className="text-[11px] text-emerald-700/90 mt-0.5">
                    Kad pelanggan (/card) akan terus menggunakan reka bentuk ini sebaik sahaja disimpan.
                  </div>
                </div>
              </label>

              {/* BUTTONS */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  disabled={isSavingToCloud}
                  className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingToCloud}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingToCloud ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t.savingBtn}</span>
                    </>
                  ) : (
                    <span>{t.saveBtn}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
