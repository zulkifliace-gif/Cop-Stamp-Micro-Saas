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
  icon: string
}

export const HERO_PATTERN_OPTIONS: PatternOption[] = [
  { id: 'bubbles', icon: '🫧' },
  { id: 'kereta', icon: '🚗' },
  { id: 'salon', icon: '✂️' },
  { id: 'kek', icon: '🎂' },
  { id: 'roti_manisan', icon: '🥐' },
  { id: 'pisang', icon: '🍌' },
  { id: 'air_bungkus', icon: '🧃' },
  { id: 'air_cup', icon: '🥤' },
  { id: 'haiwan', icon: '🐾' },
  { id: 'bunga', icon: '🌸' },
  { id: 'none', icon: '🚫' },
]

export interface FontOption {
  id: string
  name: string
  fontFamily: string
  categoryKey: string
  sampleText: string
}

export const STORE_FONT_OPTIONS: FontOption[] = [
  {
    id: 'fraunces',
    name: 'Fraunces',
    fontFamily: '"Fraunces", serif',
    categoryKey: 'classic',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    fontFamily: '"Playfair Display", serif',
    categoryKey: 'elegant',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'cinzel',
    name: 'Cinzel Royal',
    fontFamily: '"Cinzel", serif',
    categoryKey: 'royal',
    sampleText: 'DIANA BAKERY & CAFE',
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    categoryKey: 'modern',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    fontFamily: '"Poppins", sans-serif',
    categoryKey: 'cheerful',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    fontFamily: '"Montserrat", sans-serif',
    categoryKey: 'premium',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'dancing',
    name: 'Dancing Script',
    fontFamily: '"Dancing Script", cursive',
    categoryKey: 'handwriting',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'pacifico',
    name: 'Pacifico Retro',
    fontFamily: '"Pacifico", cursive',
    categoryKey: 'retro',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'bebas',
    name: 'Bebas Neue',
    fontFamily: '"Bebas Neue", sans-serif',
    categoryKey: 'impact',
    sampleText: 'DIANA BAKERY & CAFE',
  },
  {
    id: 'quicksand',
    name: 'Quicksand',
    fontFamily: '"Quicksand", sans-serif',
    categoryKey: 'cute',
    sampleText: 'Diana Bakery & Cafe',
  },
  {
    id: 'comfortaa',
    name: 'Comfortaa',
    fontFamily: '"Comfortaa", cursive',
    categoryKey: 'geometric',
    sampleText: 'Diana Bakery & Cafe',
  },
]

export interface CardStyleOption {
  id: 'kertas' | 'kaca' | 'batu' | 'besi' | 'kayu' | 'air'
  icon: string
  defaultBg: string
  defaultBorder: string
  defaultRadius: number
}

export const CARD_STYLE_OPTIONS: CardStyleOption[] = [
  {
    id: 'kertas',
    icon: '📜',
    defaultBg: '#FFFDF8',
    defaultBorder: '#F0DEC0',
    defaultRadius: 28,
  },
  {
    id: 'kaca',
    icon: '🪟',
    defaultBg: 'rgba(255, 255, 255, 0.22)',
    defaultBorder: 'rgba(255, 255, 255, 0.55)',
    defaultRadius: 28,
  },
  {
    id: 'batu',
    icon: '🪨',
    defaultBg: '#ECEFF1',
    defaultBorder: '#90A4AE',
    defaultRadius: 20,
  },
  {
    id: 'besi',
    icon: '⚙️',
    defaultBg: '#E2E8F0',
    defaultBorder: '#64748B',
    defaultRadius: 16,
  },
  {
    id: 'kayu',
    icon: '🪵',
    defaultBg: '#D49B5B',
    defaultBorder: '#6D3916',
    defaultRadius: 20,
  },
  {
    id: 'air',
    icon: '💧',
    defaultBg: 'rgba(224, 247, 250, 0.50)',
    defaultBorder: '#4DD0E1',
    defaultRadius: 28,
  },
]

export interface ProgressStyleOption {
  id: 'gradient' | 'water_wave' | 'striped'
  icon: string
}

export const PROGRESS_STYLE_OPTIONS: ProgressStyleOption[] = [
  {
    id: 'gradient',
    icon: '✨',
  },
  {
    id: 'water_wave',
    icon: '🌊',
  },
  {
    id: 'striped',
    icon: '💈',
  },
]

export interface ThemePreset {
  id: string
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
}

export const LIVE_PRESETS: ThemePreset[] = [
  {
    id: 'warmSunset',
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
  },
  {
    id: 'royalEmerald',
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
  },
  {
    id: 'goldenLuxury',
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
  },
  {
    id: 'sweetBerry',
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
  },
  {
    id: 'oceanBlue',
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
  },
  {
    id: 'darkSteel',
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
  },
  {
    id: 'matchaZen',
    pattern: 'bunga',
    fontId: 'dancing',
    cardStyle: 'batu',
    progressStyle: 'gradient',
    pageBg: '#F7F9F4',
    pageDot: 'rgba(46,74,38,0.06)',
    hero1: '#3B5E2B',
    hero2: '#739E50',
    cardBg: '#ECEFF1',
    cardBorder: '#90A4AE',
    progressFill1: '#4A7C36',
    progressFill2: '#86B564',
  },
  {
    id: 'midnightGold',
    pattern: 'bubbles',
    fontId: 'cinzel',
    cardStyle: 'kaca',
    progressStyle: 'gradient',
    pageBg: '#121214',
    pageDot: 'rgba(255,215,0,0.06)',
    hero1: '#1A1A1E',
    hero2: '#2C2D35',
    cardBg: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(218, 165, 32, 0.40)',
    progressFill1: '#D4AF37',
    progressFill2: '#F3E5AB',
  },
]

export interface EditableBlockConfig {
  id: EditableBlockId
  title?: string
  name?: string
  visible?: boolean
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
  storeLogo: string
  tagline: string
  memberStatus: string
  stampsRequired: number
  simulatedStamps: number
  stampIcon: string
  rewardDesc: string
  googleReviewUrl: string
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
    name: 'Hero Header',
    pattern: 'bubbles',
    patternOpacity: 0.25,
    bgColor: '#FF7A45',
    bgColor2: '#FFC24D',
    borderRadius: 34,
  },
  {
    id: 'store_profile',
    name: 'Profile Kedai & Fon',
    fontId: 'fraunces',
    showLogo: true,
  },
  {
    id: 'stamp_card_box',
    name: 'Kotak Kad Cop',
    cardStyle: 'kertas',
    bgColor: '#FFFDF8',
    borderColor: '#F0DEC0',
    borderRadius: 28,
  },
  {
    id: 'progress_bar',
    name: 'Bar Kemajuan',
    visible: true,
    progressStyle: 'gradient',
    bgColor: '#FF5A45',
    bgColor2: '#FFB238',
  },
]

export const DEFAULT_LIVE_STUDIO_CONFIG: LiveStudioConfig = {
  storeName: 'Diana Bakery & Cafe',
  storeLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
  tagline: 'Kumpul Cop & Tebus Ganjaran!',
  memberStatus: 'Ahli Tetap',
  stampsRequired: 10,
  simulatedStamps: 4,
  stampIcon: '/icons/stamps/coffee.svg',
  rewardDesc: '1x Kopi Percuma + 1x Croissant',
  googleReviewUrl: 'https://g.page/r/example/review',
  pageBgColor: '#FFF7EA',
  pageDotColor: 'rgba(43,27,18,0.055)',
  primaryColor: '#FF7A45',
  secondaryAccent: '#FFC24D',
  blocks: DEFAULT_4_BLOCKS,
}

// BILINGUAL TRANSLATION DICTIONARY
export const I18N_STUDIO = {
  my: {
    nav: {
      backToDashboard: '← Dashboard Kedai',
      liveBadge: 'Card Studio Live',
      defaultDraftName: 'Draf Templat',
      resetBtn: 'Asal (Reset)',
      saveBtn: 'Simpan Templat',
      setLiveBtn: 'Set Live Sekarang',
      saving: 'Menyimpan...',
      statusLive: 'Live Aktif',
      statusDraft: 'Draf',
      draftUpdated: 'Draf dikemas kini',
      resetSuccess: 'Berjaya reset ke asal!',
      resetConfirm: 'Tetapkan semula semua tetapan kepada reka bentuk asal seperti live card?',
    },
    mobile: {
      editTab: 'Ubah Reka Bentuk',
      previewTab: 'Pratonton Live',
    },
    tabs: {
      blocks: '4 Blok Reka Bentuk',
      presets: 'Tema & Warna',
      simulate: 'Simulator Cop',
    },
    blocksGuide: '4 Blok Reka Bentuk Boleh Ubah: Hero Header, Profile Kedai, Kotak Kad Cop & Bar Kemajuan. Fon yang dipilih akan diaplikasikan ke seluruh kad.',
    heroHeader: {
      title: 'Hero Header',
      desc: 'Corak motif, warna gradien & kelengkungan',
      closeBtn: 'Tutup ▲',
      editBtn: 'Ubah ▼',
      patternLabel: 'Corak Motif Latar Belakang (11 Pilihan):',
      opacityLabel: 'Kepekatan Corak (Opacity):',
      gradientStart: 'Warna Gradien Mula:',
      gradientEnd: 'Warna Gradien Akhir:',
      borderRadius: 'Kelengkungan Bawah Header:',
      patterns: {
        bubbles: { label: 'Bulat-bulat (Asal Live)', desc: 'Geometrik bulat asal' },
        kereta: { label: 'Kereta', desc: 'Automotif & bengkel' },
        salon: { label: 'Salon', desc: 'Gunting rambut & kecantikan' },
        kek: { label: 'Kek', desc: 'Kek hari lahir & patisserie' },
        roti_manisan: { label: 'Roti Manisan', desc: 'Pastri, donut & croissant' },
        pisang: { label: 'Pisang', desc: 'Buah-buahan segar' },
        air_bungkus: { label: 'Air Bungkus', desc: 'Ikat tepi tradisional' },
        air_cup: { label: 'Air Cup', desc: 'Cawan kopi & boba' },
        haiwan: { label: 'Haiwan', desc: 'Tapak kaki & pet shop' },
        bunga: { label: 'Bunga', desc: 'Flora & bunga mekar' },
        none: { label: 'Kosong', desc: 'Tiada corak (plain gradient)' },
      } as Record<string, { label: string; desc: string }>,
    },
    storeProfile: {
      title: 'Profile Kedai & Fon Seluruh Kad',
      desc: 'Gambar profil ON/OFF & pilihan fon seluruh halaman',
      showLogoTitle: 'Paparkan Gambar Profil / Logo',
      showLogoDesc: 'Pilih sama ada mahu tunjuk logo bulat atau sembunyikan',
      on: 'ON (Dipaparkan)',
      off: 'OFF (Sembunyi)',
      fontLabel: 'Pilihan Fon Seluruh Kad (11 Pilihan):',
      fontBadge: 'Apply Semua Teks',
      fontHint: 'Fon yang dipilih akan digunakan untuk Nama Kedai, tajuk, butang, status & keseluruhan kad.',
      selected: '✓ Dipilih',
      storeNameLabel: 'Nama Kedai (Teks):',
      categories: {
        classic: 'Mewah & Klasik',
        elegant: 'Elegan & Anggun',
        royal: 'Eksklusif & Diraja',
        modern: 'Moden & Bersih',
        cheerful: 'Bulat & Ceria',
        premium: 'Tegas & Premium',
        handwriting: 'Tulisan Tangan',
        retro: 'Retro & Kafe',
        impact: 'Tegap & Impak',
        cute: 'Comel & Manis',
        geometric: 'Geometrik Moden',
      } as Record<string, string>,
    },
    stampCardBox: {
      title: 'Kotak Kad Cop',
      desc: '6 gaya material (Kertas, Kaca, Batu, Besi, Kayu, Air)',
      styleLabel: 'Gaya Material Kad Cop (6 Pilihan):',
      borderRadius: 'Kelengkungan Kotak Kad (Border Radius):',
      styles: {
        kertas: { name: 'Kertas (Asal Live)', desc: 'Kertas kraf & kadstock krim klasik asal' },
        kaca: { name: 'Kaca', desc: 'Frosted glass lutsinar tembus belakang' },
        batu: { name: 'Batu', desc: 'Papak batu marmar & urat slate padu' },
        besi: { name: 'Besi', desc: 'Plat keluli berus & skru industri 4 penjuru' },
        kayu: { name: 'Kayu', desc: 'Papan kayu selari & jalur urat oak asli' },
        air: { name: 'Air', desc: 'Kolam cecair biru akuatik & buih terapung' },
      } as Record<string, { name: string; desc: string }>,
    },
    progressBar: {
      title: 'Bar Kemajuan',
      desc: 'ON/OFF & 3 gaya animasi (termasuk animasi air)',
      statusTitle: 'Status Bar Kemajuan',
      statusDesc: 'Pilih sama ada mahu tunjuk atau sembunyikan bar',
      styleLabel: 'Pilihan Gaya Bar Kemajuan (3 Pilihan):',
      color1: 'Warna Bar 1:',
      color2: 'Warna Bar 2:',
      styles: {
        gradient: { name: 'Gradien Klasik (Asal Live)', desc: 'Garis gradien licin warna peralihan' },
        water_wave: { name: 'Animasi Ombak Air', desc: 'Cecair beralun dinamik makin penuh dalam kad' },
        striped: { name: 'Jalur Berputar (Striped)', desc: 'Jalur dinamik aktif bergerak ceria' },
      } as Record<string, { name: string; desc: string }>,
    },
    presetsTab: {
      guide: 'Pilihan Tema Disyorkan: Klik mana-mana tema sedia ada di bawah untuk menukar padanan warna banner, fon seluruh kad, corak motif, dan gaya material kotak secara serentak.',
      applyThemeBtn: 'Guna Tema →',
      pageColorTitle: 'Penyesuaian Tema Warna Halaman',
      pageColorDesc: 'Sesuaikan warna latar belakang dan bintik halaman',
      pageBg: 'Warna Latar Belakang:',
      pageDot: 'Warna Bintik Latar:',
      quickPalettes: 'Palet Warna Pantas:',
      presets: {
        warmSunset: { name: 'Warm Sunset (Asal LajuS)', category: 'Universal / Asal', desc: 'Warna hangat oren & krim klasik asal LajuS' },
        royalEmerald: { name: 'Royal Emerald (Cafe & Kopi)', category: 'Kafe & Kopi', desc: 'Hijau emerald eksklusif dengan kad kaca & ombak air' },
        goldenLuxury: { name: 'Golden Luxury (Bakeri & Kek)', category: 'Bakeri & Pastri', desc: 'Sentuhan kayu asli & keemasan premium bakeri' },
        sweetBerry: { name: 'Sweet Berry (Dessert & Manisan)', category: 'Pastri & Manisan', desc: 'Merah jambu ceria dengan corak pastri & jalur striped' },
        oceanBlue: { name: 'Ocean Blue (Carwash & Servis)', category: 'Automotif & Carwash', desc: 'Biru segar akuatik dengan material air & corak kereta' },
        darkSteel: { name: 'Dark Steel (Barber & Salon)', category: 'Barbershop & Grooming', desc: 'Plat besi keluli tegap maskulin & corak gunting salon' },
        matchaZen: { name: 'Matcha Zen (Spa & Kesihatan)', category: 'Spa & Kesihatan', desc: 'Hijau zaitun tenang dengan papak batu & corak bunga' },
        midnightGold: { name: 'Midnight Gold (Dining & Restoran)', category: 'Restoran & Dining', desc: 'Hitam obsidian elegan & garisan emas mewah' },
      } as Record<string, { name: string; category: string; desc: string }>,
    },
    simulatorTab: {
      guide: 'Simulator Cop: Uji rupa paras kad pelanggan apabila menerima cop bertambah atau penuh.',
      currentStamps: 'Bilangan Cop Semasa (Simulasi):',
      targetStamps: 'Sasaran Cop Diperlukan:',
      stampsUnit: 'Cop',
      statusFull: 'Kad Penuh',
      statusInProgress: 'Sedang Diisi',
      statusLabel: 'Status:',
      remainText: (count: number) => `Baki: ${count} cop lagi untuk ganjaran.`,
    },
    saveModal: {
      title: 'Simpan Templat Kad',
      subtitle: 'Tetapkan nama rujukan templat ini dalam akaun kedai anda.',
      nameLabel: 'Nama Templat:',
      setLiveLabel: 'Aktifkan sebagai Kad Live Sekarang (Pelanggan akan lihat reka bentuk ini serta-merta)',
      setLiveHelp: 'Kad pelanggan (/card) akan terus menggunakan reka bentuk ini sebaik sahaja disimpan.',
      quotaUsed: (used: number) => `Slot Templat: Digunakan ${used}/3 slot`,
      cancelBtn: 'Batal',
      saveBtn: 'Simpan Sekarang',
      savingBtn: 'Menyimpan...',
      errEmptyName: 'Sila masukkan nama templat.',
      errQuotaFull: 'Had kuota 3 templat telah penuh! Sila kemas kini templat sedia ada atau padam templat lain dalam Dashboard.',
      errTimeout: 'Permintaan tamat masa (Timeout). Sila semak sambungan internet anda dan cuba lagi.',
      errGeneral: 'Ralat semasa menyimpan templat.',
      successLive: 'Templat berjaya disimpan & diaktifkan secara Live untuk pelanggan!',
      successDraft: 'Templat berjaya disimpan ke dalam akaun kedai!',
    },
    preview: {
      customerQr: 'Kod QR Pelanggan',
      memberBadge: 'Ahli Tetap',
      stampsCollected: (count: number) => `${count} Cop Terkumpul`,
      cardFullBadge: 'KAD 1 • PENUH',
      cardProgressBadge: 'KAD 1 • SEDANG DIISI',
      cardCompletedReward: (desc: string) => `🎉 Kad lengkap! Tebus ganjaran anda: ${desc}`,
      stepsTitle: '3 Langkah Tebus Ganjaran:',
      step1: '1. Tekan butang "Tebus Percuma" di bawah.',
      step2: '2. Tunjukkan skrin kepada juruwang/staf kedai.',
      step3: '3. Staf akan masukkan PIN atau imbas kod untuk pengesahan.',
      claimFreeBtn: 'Tebus Percuma',
      rewardTitle: 'Ganjaran Percuma',
      rateStore: (name: string) => `⭐ Nilai ${name} di Google`,
      rateAppreciation: (name: string) => `5 bintang untuk ${name} amat kami hargai!`,
      lastUpdated: 'Kemas kini terakhir: 10:30 PM, 4 Sep 2026',
      privacyPolicy: 'Dasar Privasi',
      deleteAccount: 'Padam Akaun',
    },
  },
  en: {
    nav: {
      backToDashboard: '← Store Dashboard',
      liveBadge: 'Card Studio Live',
      defaultDraftName: 'Template Draft',
      resetBtn: 'Reset (Default)',
      saveBtn: 'Save Template',
      setLiveBtn: 'Set as Live Now',
      saving: 'Saving...',
      statusLive: 'Live Active',
      statusDraft: 'Draft',
      draftUpdated: 'Draft updated',
      resetSuccess: 'Successfully reset to default!',
      resetConfirm: 'Reset all settings back to the original live card design?',
    },
    mobile: {
      editTab: 'Edit Design',
      previewTab: 'Live Preview',
    },
    tabs: {
      blocks: '4 Design Blocks',
      presets: 'Themes & Colors',
      simulate: 'Stamp Simulator',
    },
    blocksGuide: '4 Editable Design Blocks: Hero Header, Store Profile, Stamp Card Box & Progress Bar. Chosen font applies globally to the entire card.',
    heroHeader: {
      title: 'Hero Header',
      desc: 'Motif patterns, gradient colors & border radius',
      closeBtn: 'Close ▲',
      editBtn: 'Edit ▼',
      patternLabel: 'Background Motif Pattern (11 Options):',
      opacityLabel: 'Pattern Opacity:',
      gradientStart: 'Gradient Start Color:',
      gradientEnd: 'Gradient End Color:',
      borderRadius: 'Bottom Header Radius:',
      patterns: {
        bubbles: { label: 'Circles (Live Original)', desc: 'Original geometric circles' },
        kereta: { label: 'Cars', desc: 'Automotive & workshop' },
        salon: { label: 'Salon', desc: 'Haircut & styling' },
        kek: { label: 'Cake', desc: 'Birthday cakes & patisserie' },
        roti_manisan: { label: 'Bakery & Pastry', desc: 'Pastries, donuts & croissants' },
        pisang: { label: 'Banana & Fruits', desc: 'Fresh organic fruits' },
        air_bungkus: { label: 'Iced Drinks', desc: 'Traditional iced beverages' },
        air_cup: { label: 'Cup Drinks', desc: 'Coffee & boba cups' },
        haiwan: { label: 'Pets', desc: 'Paw prints & pet shop' },
        bunga: { label: 'Floral', desc: 'Flora & blooming flowers' },
        none: { label: 'None', desc: 'Plain gradient (no motif)' },
      } as Record<string, { label: string; desc: string }>,
    },
    storeProfile: {
      title: 'Store Profile & Global Font',
      desc: 'Profile picture ON/OFF & card-wide typography',
      showLogoTitle: 'Display Profile Picture / Logo',
      showLogoDesc: 'Choose whether to show or hide the round logo avatar',
      on: 'ON (Displayed)',
      off: 'OFF (Hidden)',
      fontLabel: 'Card-wide Font Selection (11 Options):',
      fontBadge: 'Applied to All Text',
      fontHint: 'The chosen font applies to Store Name, headings, buttons, status badges & the entire card.',
      selected: '✓ Selected',
      storeNameLabel: 'Store Name (Text):',
      categories: {
        classic: 'Luxury & Classic',
        elegant: 'Elegant & Graceful',
        royal: 'Exclusive & Royal',
        modern: 'Modern & Clean',
        cheerful: 'Rounded & Cheerful',
        premium: 'Bold & Premium',
        handwriting: 'Handwritten',
        retro: 'Retro & Cafe',
        impact: 'Bold & Impactful',
        cute: 'Cute & Sweet',
        geometric: 'Modern Geometric',
      } as Record<string, string>,
    },
    stampCardBox: {
      title: 'Stamp Card Box',
      desc: '6 material styles (Paper, Glass, Stone, Steel, Wood, Water)',
      styleLabel: 'Stamp Card Material Style (6 Options):',
      borderRadius: 'Card Box Corner Radius:',
      styles: {
        kertas: { name: 'Paper (Live Original)', desc: 'Classic kraft paper & cream cardstock' },
        kaca: { name: 'Glass', desc: 'Frosted semi-transparent glass' },
        batu: { name: 'Stone', desc: 'Solid marble slab & slate veins' },
        besi: { name: 'Steel', desc: 'Brushed steel plate & corner bolts' },
        kayu: { name: 'Wood', desc: 'Parallel wooden planks & natural oak grain' },
        air: { name: 'Water', desc: 'Aquatic blue liquid pool & floating bubbles' },
      } as Record<string, { name: string; desc: string }>,
    },
    progressBar: {
      title: 'Progress Bar',
      desc: 'ON/OFF & 3 animation styles (including water waves)',
      statusTitle: 'Progress Bar Status',
      statusDesc: 'Choose whether to display or hide the progress bar',
      styleLabel: 'Progress Bar Style Selection (3 Options):',
      color1: 'Bar Color 1:',
      color2: 'Bar Color 2:',
      styles: {
        gradient: { name: 'Classic Gradient (Live Original)', desc: 'Smooth transitioning gradient line' },
        water_wave: { name: 'Water Wave Animation', desc: 'Dynamic undulating liquid waves' },
        striped: { name: 'Animated Stripes (Barber/Candy)', desc: 'Lively animated barber stripes' },
      } as Record<string, { name: string; desc: string }>,
    },
    presetsTab: {
      guide: 'Recommended Preset Themes: Click any theme below to instantly apply matching banner colors, card-wide typography, motif pattern, and card material style all at once.',
      applyThemeBtn: 'Apply Theme →',
      pageColorTitle: 'Page Color Theme Customization',
      pageColorDesc: 'Customize background page color and dot matrix pattern',
      pageBg: 'Page Background Color:',
      pageDot: 'Background Dot Color:',
      quickPalettes: 'Quick Color Palettes:',
      presets: {
        warmSunset: { name: 'Warm Sunset (Original LajuS)', category: 'Universal / Original', desc: 'Warm orange & cream colors of original LajuS' },
        royalEmerald: { name: 'Royal Emerald (Cafe & Coffee)', category: 'Cafe & Coffee', desc: 'Exclusive emerald green with glass card & water waves' },
        goldenLuxury: { name: 'Golden Luxury (Bakery & Pastry)', category: 'Bakery & Pastry', desc: 'Natural wood touch & premium bakery gold' },
        sweetBerry: { name: 'Sweet Berry (Dessert & Sweets)', category: 'Dessert & Sweets', desc: 'Cheerful pink with pastry pattern & moving stripes' },
        oceanBlue: { name: 'Ocean Blue (Carwash & Services)', category: 'Automotive & Carwash', desc: 'Fresh aquatic blue with water material & car pattern' },
        darkSteel: { name: 'Dark Steel (Barber & Salon)', category: 'Barbershop & Grooming', desc: 'Masculine steel plate & salon scissors pattern' },
        matchaZen: { name: 'Matcha Zen (Spa & Wellness)', category: 'Spa & Wellness', desc: 'Calm olive green with slate stone & floral pattern' },
        midnightGold: { name: 'Midnight Gold (Dining & Restaurant)', category: 'Restaurant & Dining', desc: 'Elegant obsidian black & luxury gold accents' },
      } as Record<string, { name: string; category: string; desc: string }>,
    },
    simulatorTab: {
      guide: 'Stamp Simulator: Test customer stamp card appearance when earning stamps or reaching full card completion.',
      currentStamps: 'Current Stamp Count (Simulation):',
      targetStamps: 'Required Stamp Target:',
      stampsUnit: 'Stamps',
      statusFull: 'Card Completed',
      statusInProgress: 'In Progress',
      statusLabel: 'Status:',
      remainText: (count: number) => `Remaining: ${count} more stamps to claim reward.`,
    },
    saveModal: {
      title: 'Save Card Template',
      subtitle: 'Set a reference name for this template in your store account.',
      nameLabel: 'Template Name:',
      setLiveLabel: 'Activate as Live Card Now (Customers will see this design immediately)',
      setLiveHelp: 'Customer card (/card) will use this design immediately once saved.',
      quotaUsed: (used: number) => `Template Slots: ${used}/3 slots used`,
      cancelBtn: 'Cancel',
      saveBtn: 'Save Now',
      savingBtn: 'Saving...',
      errEmptyName: 'Please enter a template name.',
      errQuotaFull: '3-template quota limit reached! Please update an existing template or delete one from your Dashboard.',
      errTimeout: 'Request timed out. Please check your internet connection and try again.',
      errGeneral: 'Error saving card template.',
      successLive: 'Template successfully saved & activated Live for customers!',
      successDraft: 'Template successfully saved to your store account!',
    },
    preview: {
      customerQr: 'Customer QR Code',
      memberBadge: 'VIP Member',
      stampsCollected: (count: number) => `${count} Stamps Collected`,
      cardFullBadge: 'CARD 1 • COMPLETED',
      cardProgressBadge: 'CARD 1 • IN PROGRESS',
      cardCompletedReward: (desc: string) => `🎉 Card completed! Claim your reward: ${desc}`,
      stepsTitle: '3 Steps to Redeem Reward:',
      step1: '1. Click "Claim Free Reward" button below.',
      step2: '2. Show screen to store staff / cashier.',
      step3: '3. Staff will enter PIN or scan code to verify.',
      claimFreeBtn: 'Claim Free Reward',
      rewardTitle: 'Free Reward',
      rateStore: (name: string) => `⭐ Rate ${name} on Google`,
      rateAppreciation: (name: string) => `5 stars for ${name} are greatly appreciated!`,
      lastUpdated: 'Last updated: 10:30 PM, Sep 4, 2026',
      privacyPolicy: 'Privacy Policy',
      deleteAccount: 'Delete Account',
    },
  },
}

export function sanitizeLiveConfig(raw: any): LiveStudioConfig {
  if (!raw || typeof raw !== 'object') return DEFAULT_LIVE_STUDIO_CONFIG

  const safeBlocks: EditableBlockConfig[] = DEFAULT_4_BLOCKS.map((defaultB) => {
    const found = Array.isArray(raw.blocks) ? raw.blocks.find((b: any) => b?.id === defaultB.id) : null
    if (!found) return defaultB
    return {
      ...defaultB,
      ...found,
    }
  })

  return {
    storeName: typeof raw.storeName === 'string' && raw.storeName.trim() ? raw.storeName : DEFAULT_LIVE_STUDIO_CONFIG.storeName,
    storeLogo: typeof raw.storeLogo === 'string' && raw.storeLogo.trim() ? raw.storeLogo : DEFAULT_LIVE_STUDIO_CONFIG.storeLogo,
    tagline: typeof raw.tagline === 'string' ? raw.tagline : DEFAULT_LIVE_STUDIO_CONFIG.tagline,
    memberStatus: typeof raw.memberStatus === 'string' ? raw.memberStatus : DEFAULT_LIVE_STUDIO_CONFIG.memberStatus,
    stampsRequired: typeof raw.stampsRequired === 'number' && raw.stampsRequired > 0 ? raw.stampsRequired : 10,
    simulatedStamps: typeof raw.simulatedStamps === 'number' ? raw.simulatedStamps : 4,
    stampIcon: typeof raw.stampIcon === 'string' ? raw.stampIcon : DEFAULT_LIVE_STUDIO_CONFIG.stampIcon,
    rewardDesc: typeof raw.rewardDesc === 'string' ? raw.rewardDesc : DEFAULT_LIVE_STUDIO_CONFIG.rewardDesc,
    googleReviewUrl: typeof raw.googleReviewUrl === 'string' ? raw.googleReviewUrl : DEFAULT_LIVE_STUDIO_CONFIG.googleReviewUrl,
    pageBgColor: typeof raw.pageBgColor === 'string' ? raw.pageBgColor : DEFAULT_LIVE_STUDIO_CONFIG.pageBgColor,
    pageDotColor: typeof raw.pageDotColor === 'string' ? raw.pageDotColor : DEFAULT_LIVE_STUDIO_CONFIG.pageDotColor,
    primaryColor: typeof raw.primaryColor === 'string' ? raw.primaryColor : DEFAULT_LIVE_STUDIO_CONFIG.primaryColor,
    secondaryAccent: typeof raw.secondaryAccent === 'string' ? raw.secondaryAccent : DEFAULT_LIVE_STUDIO_CONFIG.secondaryAccent,
    blocks: safeBlocks,
  }
}

export function normalizeStampIcon(iconStr: string | null | undefined): string {
  if (!iconStr) return '/icons/stamps/coffee.svg'
  if (iconStr.startsWith('/') || iconStr.startsWith('http')) return iconStr
  const lower = iconStr.toLowerCase()
  if (lower.includes('coffee') || lower.includes('kopi')) return '/icons/stamps/coffee.svg'
  if (lower.includes('cup') || lower.includes('cawan')) return '/icons/stamps/coffee-cup.svg'
  if (lower.includes('boba') || lower.includes('tea') || lower.includes('teh')) return '/icons/stamps/boba.svg'
  if (lower.includes('bakery') || lower.includes('cake') || lower.includes('kek') || lower.includes('roti')) return '/icons/stamps/bakery.svg'
  if (lower.includes('burger')) return '/icons/stamps/burger.svg'
  if (lower.includes('pizza')) return '/icons/stamps/pizza.svg'
  if (lower.includes('car') || lower.includes('kereta') || lower.includes('wash') || lower.includes('basuh')) return '/icons/stamps/car-wash.svg'
  if (lower.includes('barber') || lower.includes('hair') || lower.includes('rambut') || lower.includes('gunting')) return '/icons/stamps/barber.svg'
  if (lower.includes('salon') || lower.includes('beauty') || lower.includes('spa')) return '/icons/stamps/spa.svg'
  if (lower.includes('pet') || lower.includes('shop') || lower.includes('bone') || lower.includes('tulang')) return '/icons/stamps/pet-shop.svg'
  if (lower.includes('laundry') || lower.includes('dobi')) return '/icons/stamps/laundry.svg'
  if (lower.includes('star') || lower.includes('bintang')) return '/icons/stamps/star.svg'
  if (lower.includes('heart') || lower.includes('love') || lower.includes('hati')) return '/icons/stamps/heart.svg'
  if (lower.includes('check') || lower.includes('tick')) return '/icons/stamps/check.svg'
  return '/icons/stamps/coffee.svg'
}

export function HeroHeaderPattern({ patternId, pattern, opacity = 0.25 }: { patternId?: string; pattern?: string; opacity?: number }) {
  const p = patternId || pattern || 'bubbles';
  if (p === 'none' || opacity <= 0) return null

  const scale = 0.95
  const op1 = Math.min(1, opacity)
  const op2 = Math.min(1, opacity * 0.75)
  const op3 = Math.min(1, opacity * 0.5)

  if (p === 'bubbles') {
    return (
      <svg className="hero-pattern" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <circle cx="360" cy="20" r="95" fill="white" fillOpacity={op2} />
        <circle cx="390" cy="90" r="55" fill="white" fillOpacity={op3} />
        <circle cx="20" cy="180" r="70" fill="white" fillOpacity={op3} />
        <circle cx="70" cy="230" r="40" fill="white" fillOpacity={op1} />
        <circle cx="200" cy="-20" r="80" fill="white" fillOpacity={op3} />
        <circle cx="30" cy="20" r="30" fill="white" fillOpacity={op2} />
      </svg>
    )
  }

  const svgIcons: Record<string, string> = {
    kereta: `
      <g transform="scale(${scale})">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="7" cy="17" r="2" stroke="white" stroke-width="2" fill="white" fill-opacity="0.3"/>
        <circle cx="17" cy="17" r="2" stroke="white" stroke-width="2" fill="white" fill-opacity="0.3"/>
      </g>
    `,
    salon: `
      <g transform="scale(${scale})">
        <circle cx="6" cy="6" r="3" stroke="white" stroke-width="2"/>
        <circle cx="6" cy="18" r="3" stroke="white" stroke-width="2"/>
        <line x1="20" y1="4" x2="8.12" y2="15.88" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="14.47" y1="14.48" x2="20" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="8.12" y1="8.12" x2="12" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </g>
    `,
    kek: `
      <g transform="scale(${scale})">
        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" stroke="white" stroke-width="2"/>
        <path d="M4 16s2-1 4-1 4 1 4 1 2-1 4-1 4 1 4 1" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M2 21h20" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="7" x2="12" y2="11" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="4" r="1.5" fill="white"/>
      </g>
    `,
    roti_manisan: `
      <g transform="scale(${scale})">
        <path d="M6 14c-1.5-1-2.5-3-2.5-5 0-3.5 3.5-6 8.5-6s8.5 2.5 8.5 6c0 2-1 4-2.5 5" stroke="white" stroke-width="2"/>
        <path d="M4 14c0 3 3.5 6 8 6s8-3 8-6" stroke="white" stroke-width="2"/>
        <path d="M8 8c1 2 2 4 4 4s3-2 4-4" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      </g>
    `,
    pisang: `
      <g transform="scale(${scale})">
        <path d="M4 13c3.5 6 9.5 8 16 5 .5-.2.8-.7.6-1.2l-.5-1.5c-.2-.5-.7-.8-1.2-.6-4.5 2-9 0-11.5-4-1.5-2.5-2-5.5-1-8.5.2-.5 0-1.1-.5-1.3l-1.5-.6c-.5-.2-1.1 0-1.3.5-1.5 4-.5 8.5 1 11.7z" stroke="white" stroke-width="1.8" fill="white" fill-opacity="0.2"/>
      </g>
    `,
    air_bungkus: `
      <g transform="scale(${scale})">
        <path d="M8 7l4-4 4 4v11a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3V7z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
        <path d="M12 3v12" stroke="white" stroke-width="1.5" stroke-dasharray="2 2"/>
        <path d="M7 11h10" stroke="white" stroke-width="1.5"/>
        <circle cx="12" cy="16" r="2" fill="white" fill-opacity="0.4"/>
      </g>
    `,
    air_cup: `
      <g transform="scale(${scale})">
        <path d="M6 8h12l-1.5 11.5a2 2 0 0 1-2 1.5h-5a2 2 0 0 1-2-1.5L6 8z" stroke="white" stroke-width="2"/>
        <path d="M4 8h16" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M14 4l-2 4" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <circle cx="10" cy="14" r="1.5" fill="white"/>
        <circle cx="14" cy="15" r="1.5" fill="white"/>
        <circle cx="11" cy="17" r="1.5" fill="white"/>
      </g>
    `,
    haiwan: `
      <g transform="scale(${scale})">
        <ellipse cx="12" cy="15" rx="4" ry="3.5" stroke="white" stroke-width="1.8" fill="white" fill-opacity="0.3"/>
        <circle cx="7" cy="9" r="2" stroke="white" stroke-width="1.5" fill="white" fill-opacity="0.4"/>
        <circle cx="17" cy="9" r="2" stroke="white" stroke-width="1.5" fill="white" fill-opacity="0.4"/>
        <circle cx="12" cy="7" r="2" stroke="white" stroke-width="1.5" fill="white" fill-opacity="0.4"/>
      </g>
    `,
    bunga: `
      <g transform="scale(${scale})">
        <circle cx="12" cy="12" r="3" stroke="white" stroke-width="2" fill="white" fill-opacity="0.4"/>
        <circle cx="12" cy="6" r="2.5" stroke="white" stroke-width="1.5"/>
        <circle cx="12" cy="18" r="2.5" stroke="white" stroke-width="1.5"/>
        <circle cx="6" cy="12" r="2.5" stroke="white" stroke-width="1.5"/>
        <circle cx="18" cy="12" r="2.5" stroke="white" stroke-width="1.5"/>
      </g>
    `,
  }

  const selectedSvg = (svgIcons as Record<string, string>)[p] || svgIcons.bubbles
  if (!selectedSvg) return null

  return (
    <div
      className="hero-pattern absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity: op1 }}
    >
      <div className="absolute top-2 left-4 w-9 h-9 opacity-80" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full">${selectedSvg}</svg>` }} />
      <div className="absolute top-3 right-5 w-12 h-12 opacity-70" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full">${selectedSvg}</svg>` }} />
      <div className="absolute bottom-6 left-8 w-11 h-11 opacity-60" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full">${selectedSvg}</svg>` }} />
      <div className="absolute bottom-4 right-14 w-10 h-10 opacity-75" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full">${selectedSvg}</svg>` }} />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-8 h-8 opacity-40" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full">${selectedSvg}</svg>` }} />
    </div>
  )
}

export function CardBoxMaterialTexture({ style = 'kertas', cardStyle }: { style?: string; cardStyle?: string }) {
  const s = cardStyle || style || 'kertas';

  if (s === 'kertas') {
    return (
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden opacity-35 mix-blend-multiply">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="paper-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#paper-noise)" />
        </svg>
      </div>
    )
  }

  if (s === 'kaca') {
    return (
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-white/10 to-white/40" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
    )
  }

  if (s === 'batu') {
    return (
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden opacity-25 mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="stone-texture">
            <feTurbulence type="turbulence" baseFrequency="0.08" numOctaves="4" result="turbulence" />
            <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <rect width="100%" height="100%" fill="#78909C" filter="url(#stone-texture)" />
        </svg>
      </div>
    )
  }

  if (s === 'besi') {
    return (
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)] opacity-60" />
        <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full border border-slate-500 bg-slate-400/80 shadow-inner flex items-center justify-center">
          <div className="w-1 h-[1px] bg-slate-700" />
        </div>
        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full border border-slate-500 bg-slate-400/80 shadow-inner flex items-center justify-center">
          <div className="w-1 h-[1px] bg-slate-700" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full border border-slate-500 bg-slate-400/80 shadow-inner flex items-center justify-center">
          <div className="w-1 h-[1px] bg-slate-700" />
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full border border-slate-500 bg-slate-400/80 shadow-inner flex items-center justify-center">
          <div className="w-1 h-[1px] bg-slate-700" />
        </div>
      </div>
    )
  }

  if (s === 'kayu') {
    return (
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden opacity-30 mix-blend-multiply">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,#8D5B28_0px,#8D5B28_18px,#633F19_19px,#633F19_20px)] opacity-50" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_30px,rgba(255,255,255,0.05)_30px,rgba(255,255,255,0.05)_60px)]" />
      </div>
    )
  }

  if (s === 'air') {
    return (
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-sky-300/20 to-blue-500/20" />
        <div className="absolute top-2 left-6 w-3 h-3 rounded-full bg-white/40 animate-ping opacity-60" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-3 right-8 w-4 h-4 rounded-full bg-white/30 animate-pulse opacity-50" />
        <div className="absolute top-1/2 right-4 w-2 h-2 rounded-full bg-cyan-200/50" />
      </div>
    )
  }

  return null
}

export function ProgressBarRenderer({
  percent = 40,
  style = 'gradient',
  c1 = '#FF5A45',
  c2 = '#FFB238',
  h = 8,
  r = 999,
  progressBlock,
  totalStamps,
  reqStamps,
  percentFill,
}: {
  percent?: number
  style?: 'gradient' | 'water_wave' | 'striped'
  c1?: string
  c2?: string
  h?: number
  r?: number
  progressBlock?: EditableBlockConfig
  totalStamps?: number
  reqStamps?: number
  percentFill?: number
}) {
  if (progressBlock && !progressBlock.visible) return null

  const effectiveStyle = progressBlock?.progressStyle || style || 'gradient'
  const effectiveH = progressBlock?.barHeight || h || 8
  const effectiveR = progressBlock?.borderRadius ?? r ?? 999
  const effectiveC1 = progressBlock?.bgColor || c1 || '#FF5A45'
  const effectiveC2 = progressBlock?.bgColor2 || c2 || '#FFB238'
  const effectivePercent = percentFill ?? percent ?? 40

  if (effectiveStyle === 'water_wave') {
    return (
      <div
        className="w-full bg-stone-200/60 overflow-hidden relative"
        style={{ height: `${effectiveH + 2}px`, borderRadius: `${effectiveR}px` }}
      >
        <div
          className="h-full relative overflow-hidden transition-all duration-500"
          style={{
            width: `${Math.max(4, Math.min(100, effectivePercent))}%`,
            background: `linear-gradient(90deg, ${effectiveC1}, ${effectiveC2})`,
            borderRadius: `${effectiveR}px`,
          }}
        >
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
          <div className="absolute -top-1 left-0 right-0 h-2 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(255,255,255,0.4)_8px,rgba(255,255,255,0.4)_16px)] animate-[wave_2s_linear_infinite]" />
        </div>
      </div>
    )
  }

  if (effectiveStyle === 'striped') {
    return (
      <div
        className="w-full bg-stone-200/60 overflow-hidden relative"
        style={{ height: `${effectiveH}px`, borderRadius: `${effectiveR}px` }}
      >
        <div
          className="h-full transition-all duration-500 relative"
          style={{
            width: `${Math.max(4, Math.min(100, effectivePercent))}%`,
            background: `repeating-linear-gradient(45deg, ${effectiveC1}, ${effectiveC1} 10px, ${effectiveC2} 10px, ${effectiveC2} 20px)`,
            borderRadius: `${effectiveR}px`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>
    )
  }

  return (
    <div
      className="w-full bg-stone-200/60 overflow-hidden relative"
      style={{ height: `${effectiveH}px`, borderRadius: `${effectiveR}px` }}
    >
      <div
        className="h-full transition-all duration-500"
        style={{
          width: `${Math.max(4, Math.min(100, effectivePercent))}%`,
          background: `linear-gradient(90deg, ${effectiveC1}, ${effectiveC2})`,
          borderRadius: `${effectiveR}px`,
        }}
      />
    </div>
  )
}

function renderLiveSocialIcon(platform: string) {
  const p = platform.toLowerCase()
  switch (p) {
    case 'whatsapp':
    case 'wasap':
      return (
        <svg className="w-4 h-4 text-emerald-600 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.54 1.761.802 2.796.803h.005c3.181 0 5.768-2.587 5.769-5.766.001-3.181-2.585-5.77-5.774-5.79zm3.38 8.188c-.14.39-.714.73-1.009.77-.282.04-.63.06-1.857-.45-1.57-.65-2.57-2.26-2.65-2.37-.08-.11-.64-.85-.64-1.63 0-.78.41-1.16.55-1.32.14-.16.31-.2.41-.2.1 0 .21 0 .3.01.1.01.23-.04.36.27.14.33.47 1.15.51 1.23.04.08.07.18.01.29-.05.12-.08.19-.16.28-.08.09-.17.2-.24.27-.08.08-.17.17-.07.34.1.17.44.73.95 1.18.65.58 1.21.76 1.38.85.17.08.27.07.37-.04.11-.12.44-.52.56-.7.12-.18.24-.15.4-.09.16.06 1.03.49 1.21.57.17.09.29.13.33.2.04.08.04.47-.1.86z" />
        </svg>
      )
    case 'instagram':
    case 'ig':
      return (
        <svg className="w-4 h-4 text-pink-600 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg className="w-4 h-4 text-stone-900 fill-current" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
        </svg>
      )
    case 'facebook':
    case 'fb':
      return (
        <svg className="w-4 h-4 text-blue-600 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    default:
      return (
        <svg className="w-4 h-4 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
  }
}

// ==========================================
// MEMOIZED & THROTTLED INPUT COMPONENTS
// ==========================================

interface ThrottledColorInputProps {
  value: string
  onChange: (val: string) => void
  className?: string
  pickerClassName?: string
  textClassName?: string
  showText?: boolean
  disabled?: boolean
  placeholder?: string
}

export const ThrottledColorInput = React.memo(function ThrottledColorInput({
  value,
  onChange,
  className = '',
  pickerClassName = 'w-7 h-7 rounded border-0 cursor-pointer bg-transparent',
  textClassName = 'w-full bg-transparent text-stone-900 font-mono text-[11px] outline-none',
  showText = true,
  disabled = false,
  placeholder,
}: ThrottledColorInputProps) {
  const [localVal, setLocalVal] = useState(value || '')
  const rafRef = useRef<number | null>(null)
  const latestValRef = useRef(value || '')

  useEffect(() => {
    setLocalVal(value || '')
    latestValRef.current = value || ''
  }, [value])

  const scheduleUpdate = useCallback((nextVal: string) => {
    setLocalVal(nextVal)
    latestValRef.current = nextVal

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      onChange(latestValRef.current)
      rafRef.current = null
    })
  }, [onChange])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <div className={`flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E2DAD0] ${className}`}>
      <input
        type="color"
        value={localVal.startsWith('#') && (localVal.length === 7 || localVal.length === 4) ? localVal : '#FF7A45'}
        disabled={disabled}
        onChange={(e) => scheduleUpdate(e.target.value)}
        className={pickerClassName}
      />
      {showText && (
        <input
          type="text"
          value={localVal}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => scheduleUpdate(e.target.value)}
          onBlur={() => {
            if (rafRef.current !== null) {
              cancelAnimationFrame(rafRef.current)
              rafRef.current = null
            }
            onChange(localVal)
          }}
          className={textClassName}
        />
      )}
    </div>
  )
})

interface ThrottledRangeInputProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (val: number) => void
  className?: string
  disabled?: boolean
}

export const ThrottledRangeInput = React.memo(function ThrottledRangeInput({
  value,
  min,
  max,
  step = 1,
  onChange,
  className = 'w-full accent-amber-500 cursor-pointer',
  disabled = false,
}: ThrottledRangeInputProps) {
  const [localVal, setLocalVal] = useState<number>(value ?? min)
  const rafRef = useRef<number | null>(null)
  const latestValRef = useRef<number>(value ?? min)

  useEffect(() => {
    setLocalVal(value ?? min)
    latestValRef.current = value ?? min
  }, [value, min])

  const scheduleUpdate = useCallback((nextVal: number) => {
    setLocalVal(nextVal)
    latestValRef.current = nextVal

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      onChange(latestValRef.current)
      rafRef.current = null
    })
  }, [onChange])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={localVal}
      disabled={disabled}
      onChange={(e) => scheduleUpdate(Number(e.target.value))}
      className={className}
    />
  )
})

// ==========================================
// MEMOIZED EDITOR PANELS (BILINGUAL)
// ==========================================

interface HeroHeaderPanelProps {
  heroBlock: EditableBlockConfig
  isOpen: boolean
  lang: 'my' | 'en'
  t: typeof I18N_STUDIO['my']
  onToggle: () => void
  onUpdate: (partial: Partial<EditableBlockConfig>) => void
}

const HeroHeaderPanel = React.memo(function HeroHeaderPanel({
  heroBlock,
  isOpen,
  lang,
  t,
  onToggle,
  onUpdate,
}: HeroHeaderPanelProps) {
  return (
    <div
      className={`border rounded-2xl p-4 transition-all ${
        isOpen
          ? 'bg-[#FCFAF7] border-amber-400 ring-2 ring-amber-400/15 shadow-sm'
          : 'bg-white hover:bg-stone-50/50 border-[#EAE3D8] shadow-2xs'
      }`}
    >
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200/60">
            1
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900">{t.heroHeader.title}</h4>
            <p className="text-[11px] text-stone-500">{t.heroHeader.desc}</p>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
            isOpen
              ? 'bg-amber-100 text-amber-900 border-amber-200'
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}
        >
          {isOpen ? t.heroHeader.closeBtn : t.heroHeader.editBtn}
        </span>
      </div>

      {isOpen && (
        <div className="mt-4 pt-3.5 border-t border-[#EAE3D8] space-y-4">
          {/* Corak Pilihan */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              {t.heroHeader.patternLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {HERO_PATTERN_OPTIONS.map((opt) => {
                const isSelected = (heroBlock.pattern || 'bubbles') === opt.id
                const pInfo = t.heroHeader.patterns[opt.id] || { label: opt.id, desc: '' }
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdate({ pattern: opt.id })}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400 font-bold shadow-2xs'
                        : 'bg-white border-[#E8E1D5] text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate">{pInfo.label}</div>
                      <div className="text-[10px] text-stone-500 truncate">{pInfo.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Kepekatan Corak (Opacity) */}
          <div>
            <div className="flex justify-between text-xs text-stone-700 font-semibold mb-1">
              <span>{t.heroHeader.opacityLabel}</span>
              <span className="font-mono text-amber-700 font-bold">{Math.round((heroBlock.patternOpacity ?? 0.25) * 100)}%</span>
            </div>
            <ThrottledRangeInput
              min={0}
              max={1}
              step={0.05}
              value={heroBlock.patternOpacity ?? 0.25}
              onChange={(val) => onUpdate({ patternOpacity: val })}
            />
          </div>

          {/* Warna Gradien Hero */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">{t.heroHeader.gradientStart}</label>
              <ThrottledColorInput
                value={heroBlock.bgColor || '#FF7A45'}
                onChange={(val) => onUpdate({ bgColor: val })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">{t.heroHeader.gradientEnd}</label>
              <ThrottledColorInput
                value={heroBlock.bgColor2 || '#FFC24D'}
                onChange={(val) => onUpdate({ bgColor2: val })}
              />
            </div>
          </div>

          {/* Kelengkungan Bawah (Border Radius) */}
          <div>
            <div className="flex justify-between text-xs text-stone-700 font-semibold mb-1">
              <span>{t.heroHeader.borderRadius}</span>
              <span className="font-mono text-amber-700 font-bold">{heroBlock.borderRadius ?? 34}px</span>
            </div>
            <ThrottledRangeInput
              min={0}
              max={50}
              step={1}
              value={heroBlock.borderRadius ?? 34}
              onChange={(val) => onUpdate({ borderRadius: val })}
            />
          </div>
        </div>
      )}
    </div>
  )
})

interface StoreProfilePanelProps {
  profileBlock: EditableBlockConfig
  storeName: string
  isOpen: boolean
  lang: 'my' | 'en'
  t: typeof I18N_STUDIO['my']
  onToggle: () => void
  onUpdate: (partial: Partial<EditableBlockConfig>) => void
  onUpdateStoreName: (name: string) => void
}

const StoreProfilePanel = React.memo(function StoreProfilePanel({
  profileBlock,
  storeName,
  isOpen,
  lang,
  t,
  onToggle,
  onUpdate,
  onUpdateStoreName,
}: StoreProfilePanelProps) {
  return (
    <div
      className={`border rounded-2xl p-4 transition-all ${
        isOpen
          ? 'bg-[#FCFAF7] border-amber-400 ring-2 ring-amber-400/15 shadow-sm'
          : 'bg-white hover:bg-stone-50/50 border-[#EAE3D8] shadow-2xs'
      }`}
    >
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200/60">
            2
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900">{t.storeProfile.title}</h4>
            <p className="text-[11px] text-stone-500">{t.storeProfile.desc}</p>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
            isOpen
              ? 'bg-amber-100 text-amber-900 border-amber-200'
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}
        >
          {isOpen ? t.heroHeader.closeBtn : t.heroHeader.editBtn}
        </span>
      </div>

      {isOpen && (
        <div className="mt-4 pt-3.5 border-t border-[#EAE3D8] space-y-4">
          {/* TOGGLE GAMBAR PROFIL */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E2DAD0]">
            <div>
              <div className="text-xs font-bold text-stone-800">{t.storeProfile.showLogoTitle}</div>
              <div className="text-[10px] text-stone-500">{t.storeProfile.showLogoDesc}</div>
            </div>
            <button
              type="button"
              onClick={() => onUpdate({ showLogo: profileBlock.showLogo === false ? true : false })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                profileBlock.showLogo !== false
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {profileBlock.showLogo !== false ? t.storeProfile.on : t.storeProfile.off}
            </button>
          </div>

          {/* PILIHAN FON SELURUH KAD */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700">
                {t.storeProfile.fontLabel}
              </label>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold border border-amber-200">
                {t.storeProfile.fontBadge}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 mb-2">
              {t.storeProfile.fontHint}
            </p>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
              {STORE_FONT_OPTIONS.map((f) => {
                const isSelected = (profileBlock.fontId || 'fraunces') === f.id
                const categoryLabel = t.storeProfile.categories[f.categoryKey] || f.categoryKey
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onUpdate({ fontId: f.id })}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400 font-bold shadow-2xs'
                        : 'bg-white border-[#E8E1D5] text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs text-stone-500 font-medium">{f.name} ({categoryLabel})</div>
                      <div className="text-base font-bold text-stone-900 mt-0.5" style={{ fontFamily: f.fontFamily }}>
                        {storeName || f.sampleText}
                      </div>
                    </div>
                    {isSelected && <span className="text-amber-700 font-bold text-sm">{t.storeProfile.selected}</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* NAMA KEDAI TEKS */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">{t.storeProfile.storeNameLabel}</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => onUpdateStoreName(e.target.value)}
              className="w-full bg-white border border-[#E2DAD0] rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>
      )}
    </div>
  )
})

interface StampCardBoxPanelProps {
  cardBoxBlock: EditableBlockConfig
  isOpen: boolean
  lang: 'my' | 'en'
  t: typeof I18N_STUDIO['my']
  onToggle: () => void
  onUpdate: (partial: Partial<EditableBlockConfig>) => void
}

const StampCardBoxPanel = React.memo(function StampCardBoxPanel({
  cardBoxBlock,
  isOpen,
  lang,
  t,
  onToggle,
  onUpdate,
}: StampCardBoxPanelProps) {
  return (
    <div
      className={`border rounded-2xl p-4 transition-all ${
        isOpen
          ? 'bg-[#FCFAF7] border-amber-400 ring-2 ring-amber-400/15 shadow-sm'
          : 'bg-white hover:bg-stone-50/50 border-[#EAE3D8] shadow-2xs'
      }`}
    >
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200/60">
            3
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900">{t.stampCardBox.title}</h4>
            <p className="text-[11px] text-stone-500">{t.stampCardBox.desc}</p>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
            isOpen
              ? 'bg-amber-100 text-amber-900 border-amber-200'
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}
        >
          {isOpen ? t.heroHeader.closeBtn : t.heroHeader.editBtn}
        </span>
      </div>

      {isOpen && (
        <div className="mt-4 pt-3.5 border-t border-[#EAE3D8] space-y-4">
          {/* 6 PILIHAN GAYA MATERIAL */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              {t.stampCardBox.styleLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CARD_STYLE_OPTIONS.map((styleOpt) => {
                const isSelected = (cardBoxBlock.cardStyle || 'kertas') === styleOpt.id
                const sInfo = t.stampCardBox.styles[styleOpt.id] || { name: styleOpt.id, desc: '' }
                return (
                  <button
                    key={styleOpt.id}
                    type="button"
                    onClick={() =>
                      onUpdate({
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
                      <div className="text-xs font-bold">{sInfo.name}</div>
                      <div className="text-[10px] text-stone-500 line-clamp-2">{sInfo.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* KELENGKUNGAN KOTAK KAD */}
          <div>
            <div className="flex justify-between text-xs text-stone-700 font-semibold mb-1">
              <span>{t.stampCardBox.borderRadius}</span>
              <span className="font-mono text-amber-700 font-bold">{cardBoxBlock.borderRadius ?? 28}px</span>
            </div>
            <ThrottledRangeInput
              min={8}
              max={40}
              step={1}
              value={cardBoxBlock.borderRadius ?? 28}
              onChange={(val) => onUpdate({ borderRadius: val })}
            />
          </div>
        </div>
      )}
    </div>
  )
})

interface ProgressBarPanelProps {
  progressBlock: EditableBlockConfig
  isOpen: boolean
  lang: 'my' | 'en'
  t: typeof I18N_STUDIO['my']
  onToggle: () => void
  onUpdate: (partial: Partial<EditableBlockConfig>) => void
}

const ProgressBarPanel = React.memo(function ProgressBarPanel({
  progressBlock,
  isOpen,
  lang,
  t,
  onToggle,
  onUpdate,
}: ProgressBarPanelProps) {
  return (
    <div
      className={`border rounded-2xl p-4 transition-all ${
        isOpen
          ? 'bg-[#FCFAF7] border-amber-400 ring-2 ring-amber-400/15 shadow-sm'
          : 'bg-white hover:bg-stone-50/50 border-[#EAE3D8] shadow-2xs'
      }`}
    >
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200/60">
            4
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-900">{t.progressBar.title}</h4>
            <p className="text-[11px] text-stone-500">{t.progressBar.desc}</p>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
            isOpen
              ? 'bg-amber-100 text-amber-900 border-amber-200'
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}
        >
          {isOpen ? t.heroHeader.closeBtn : t.heroHeader.editBtn}
        </span>
      </div>

      {isOpen && (
        <div className="mt-4 pt-3.5 border-t border-[#EAE3D8] space-y-4">
          {/* TOGGLE BAR KEMAJUAN ON/OFF */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E2DAD0]">
            <div>
              <div className="text-xs font-bold text-stone-800">{t.progressBar.statusTitle}</div>
              <div className="text-[10px] text-stone-500">{t.progressBar.statusDesc}</div>
            </div>
            <button
              type="button"
              onClick={() => onUpdate({ visible: !progressBlock.visible })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                progressBlock.visible
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {progressBlock.visible ? t.storeProfile.on : t.storeProfile.off}
            </button>
          </div>

          {progressBlock.visible && (
            <>
              {/* 3 GAYA BAR KEMAJUAN */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  {t.progressBar.styleLabel}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {PROGRESS_STYLE_OPTIONS.map((pOpt) => {
                    const isSelected = (progressBlock.progressStyle || 'gradient') === pOpt.id
                    const sInfo = t.progressBar.styles[pOpt.id] || { name: pOpt.id, desc: '' }
                    return (
                      <button
                        key={pOpt.id}
                        type="button"
                        onClick={() => onUpdate({ progressStyle: pOpt.id })}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400 font-bold shadow-2xs'
                            : 'bg-white border-[#E8E1D5] text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{pOpt.icon}</span>
                          <div>
                            <div className="text-xs font-bold">{sInfo.name}</div>
                            <div className="text-[10px] text-stone-500">{sInfo.desc}</div>
                          </div>
                        </div>
                        {isSelected && <span className="text-amber-700 font-bold text-sm">{t.storeProfile.selected}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* WARNA BAR */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">{t.progressBar.color1}</label>
                  <ThrottledColorInput
                    value={progressBlock.bgColor || '#FF5A45'}
                    onChange={(val) => onUpdate({ bgColor: val })}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">{t.progressBar.color2}</label>
                  <ThrottledColorInput
                    value={progressBlock.bgColor2 || '#FFB238'}
                    onChange={(val) => onUpdate({ bgColor2: val })}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
})

interface PresetsTabPanelProps {
  pageBgColor: string
  pageDotColor: string
  lang: 'my' | 'en'
  t: typeof I18N_STUDIO['my']
  onApplyPreset: (preset: ThemePreset) => void
  onUpdatePageColors: (pageBgColor: string, pageDotColor: string) => void
}

const PresetsTabPanel = React.memo(function PresetsTabPanel({
  pageBgColor,
  pageDotColor,
  lang,
  t,
  onApplyPreset,
  onUpdatePageColors,
}: PresetsTabPanelProps) {
  return (
    <div className="space-y-4">
      {/* 1. TEMA DISYORKAN (1-KLIK) */}
      <div className="space-y-3">
        <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE5DA] text-xs text-stone-600 leading-relaxed">
          <b>{t.tabs.presets}:</b> {t.presetsTab.guide}
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {LIVE_PRESETS.map((p) => {
            const presetInfo = t.presetsTab.presets[p.id] || { name: p.id, category: '', desc: '' }
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onApplyPreset(p)}
                className="p-3 bg-white hover:bg-stone-50 border border-[#EAE3D8] hover:border-amber-400 rounded-2xl text-left transition flex items-center justify-between cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-stone-200 shrink-0 flex items-center justify-center font-bold text-white text-xs shadow-xs"
                    style={{ background: `linear-gradient(135deg, ${p.hero1}, ${p.hero2})` }}
                  >
                    {presetInfo.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 group-hover:text-amber-700 transition">
                        {presetInfo.name}
                      </span>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium border border-stone-200">
                        {presetInfo.category}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-stone-500 mt-0.5 line-clamp-1">{presetInfo.desc}</p>
                  </div>
                </div>

                {/* SWATCHES */}
                <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                  <div className="flex gap-1">
                    <div className="w-3.5 h-3.5 rounded-full border border-stone-200 shadow-2xs" style={{ backgroundColor: p.hero1 }} />
                    <div className="w-3.5 h-3.5 rounded-full border border-stone-200 shadow-2xs" style={{ backgroundColor: p.hero2 }} />
                    <div className="w-3.5 h-3.5 rounded-full border border-stone-200 shadow-2xs" style={{ backgroundColor: p.progressFill1 }} />
                  </div>
                  <span className="text-[9px] bg-stone-100 text-stone-700 group-hover:bg-amber-500 group-hover:text-white font-bold px-2 py-0.5 rounded-full transition border border-stone-200">
                    {t.presetsTab.applyThemeBtn}
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
          <h4 className="font-bold text-sm text-stone-900">{t.presetsTab.pageColorTitle}</h4>
          <p className="text-[11px] text-stone-500">{t.presetsTab.pageColorDesc}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">{t.presetsTab.pageBg}</label>
            <ThrottledColorInput
              value={pageBgColor || '#FFF7EA'}
              onChange={(val) => onUpdatePageColors(val, pageDotColor || 'rgba(43,27,18,0.055)')}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">{t.presetsTab.pageDot}</label>
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E2DAD0]">
              <input
                type="text"
                value={pageDotColor || 'rgba(43,27,18,0.055)'}
                onChange={(e) => onUpdatePageColors(pageBgColor || '#FFF7EA', e.target.value)}
                className="w-full bg-transparent text-stone-900 font-mono text-[11px] outline-none px-1"
                placeholder="rgba(...)"
              />
            </div>
          </div>
        </div>

        {/* PALET WARNA PANTAS */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-2">{t.presetsTab.quickPalettes}</label>
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
                onClick={() => onUpdatePageColors(pal.bg, pal.dot)}
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
  )
})

interface SimulatorTabPanelProps {
  simulatedStamps: number
  stampsRequired: number
  lang: 'my' | 'en'
  t: typeof I18N_STUDIO['my']
  onUpdateStamps: (simulated: number, required: number) => void
}

const SimulatorTabPanel = React.memo(function SimulatorTabPanel({
  simulatedStamps,
  stampsRequired,
  lang,
  t,
  onUpdateStamps,
}: SimulatorTabPanelProps) {
  const totalStamps = simulatedStamps || 4
  const reqStamps = stampsRequired || 10
  const isFull = totalStamps >= reqStamps
  const remainStamps = Math.max(0, reqStamps - totalStamps)

  return (
    <div className="space-y-4">
      <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE5DA] text-xs text-stone-600 leading-relaxed">
        <b>{t.tabs.simulate}:</b> {t.simulatorTab.guide}
      </div>

      <div className="bg-white border border-[#EAE3D8] p-4 rounded-2xl space-y-4 shadow-2xs">
        <div>
          <div className="flex justify-between text-stone-700 text-xs font-semibold mb-1.5">
            <span>{t.simulatorTab.currentStamps}</span>
            <span className="text-amber-700 font-bold font-mono text-sm">{totalStamps} / {reqStamps}</span>
          </div>
          <ThrottledRangeInput
            min={0}
            max={reqStamps}
            step={1}
            value={totalStamps}
            onChange={(val) => onUpdateStamps(val, reqStamps)}
          />
        </div>

        <div>
          <label className="block text-stone-700 text-xs font-semibold mb-1.5">
            {t.simulatorTab.targetStamps}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 8, 10, 12].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onUpdateStamps(Math.min(totalStamps, num), num)}
                className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  reqStamps === num
                    ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {num} {t.simulatorTab.stampsUnit}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5DA] text-xs space-y-1 text-stone-700">
          <div>{t.simulatorTab.statusLabel} <b className="text-stone-900">{isFull ? t.simulatorTab.statusFull : t.simulatorTab.statusInProgress}</b></div>
          <div>{t.simulatorTab.remainText(remainStamps)}</div>
        </div>
      </div>
    </div>
  )
})

interface CardStudioPhonePreviewProps {
  config: LiveStudioConfig
  lang: 'my' | 'en'
  t: typeof I18N_STUDIO['my']
  mobileView: 'editor' | 'preview'
  onSetMobileView: (view: 'editor' | 'preview') => void
}

const CardStudioPhonePreview = React.memo(function CardStudioPhonePreview({
  config,
  lang,
  t,
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
    <main className={`flex-1 p-3 sm:p-6 lg:p-10 flex flex-col items-center justify-start overflow-y-auto ${
      mobileView === 'editor' ? 'hidden md:flex' : 'flex'
    }`}>
      {/* DESK ENVIRONMENT & PHONE FRAME CONTAINER */}
      <div className="relative w-full max-w-[390px] mx-auto transition-all">
        {/* PHONE MOCKUP (PHYSICAL DEVICE FRAME) */}
        <div
          className="relative bg-white rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22),0_0_0_10px_#1E2024,0_0_0_12px_#33383F] overflow-hidden border-2 border-stone-800 transition-all"
          style={{ fontFamily: currentFontFamily }}
        >
          {/* PHONE STATUS BAR & DYNAMIC ISLAND */}
          <div className="h-9 bg-black flex items-center justify-between px-6 text-white text-[11px] font-semibold select-none z-30 relative shrink-0">
            <span>9:41</span>
            <div className="w-20 h-4 bg-stone-900 rounded-full flex items-center justify-center gap-1 border border-stone-800">
              <div className="w-2 h-2 rounded-full bg-stone-950" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.57 10.56 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
              </svg>
              <div className="w-4 h-2 border border-white rounded-xs p-[0.5px]">
                <div className="h-full bg-white w-3/4 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* PHONE INNER CONTENT */}
          <div
            className="w-full text-stone-800 relative transition-colors duration-300 min-h-[640px] flex flex-col justify-between"
            style={{ backgroundColor: config.pageBgColor || '#FFF7EA' }}
          >
            {/* DOT MATRIX PATTERN */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(${config.pageDotColor || 'rgba(43,27,18,0.055)'} 1.5px, transparent 1.5px)`,
                backgroundSize: '16px 16px',
              }}
            />

            <div>
              {/* 1. HERO BANNER HEADER */}
              <div
                className="hero relative overflow-hidden text-center text-white px-4 pt-4 pb-6 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${heroBlock.bgColor || '#FF7A45'} 0%, ${heroBlock.bgColor2 || '#FFC24D'} 100%)`,
                  borderBottomLeftRadius: `${heroBlock.borderRadius ?? 34}px`,
                  borderBottomRightRadius: `${heroBlock.borderRadius ?? 34}px`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                }}
              >
                {/* MOTIF PATTERN OVERLAY */}
                <HeroHeaderPattern patternId={heroBlock.pattern || 'bubbles'} opacity={heroBlock.patternOpacity ?? 0.25} />

                {/* TOP HEADER CONTROLS (STORE TITLE & QR CODE) */}
                <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
                  <div className="text-[10px] uppercase tracking-widest font-extrabold text-white/90 bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-xs border border-white/20">
                    {t.preview.memberBadge}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* CUSTOMER QR CODE BUTTON */}
                    <button
                      type="button"
                      title={t.preview.customerQr}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs border border-white/25 flex items-center justify-center text-white transition shadow-xs cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" strokeWidth="3" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* 2. STORE LOGO & STORE NAME (PROFILE BLOCK) */}
                <div className="relative z-10 flex flex-col items-center">
                  {profileBlock.showLogo !== false && (
                    <div className="w-16 h-16 rounded-full border-2 border-white/80 shadow-md overflow-hidden bg-white mb-2 shrink-0">
                      <img
                        src={config.storeLogo}
                        alt="Logo Kedai"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80'
                        }}
                      />
                    </div>
                  )}

                  <h1 className="hero-store-title text-xl font-bold tracking-tight text-white drop-shadow-xs px-2 leading-tight">
                    {config.storeName}
                  </h1>

                  <p className="hero-tagline text-[11px] font-medium text-white/90 mt-0.5 max-w-[260px] line-clamp-2">
                    {config.tagline}
                  </p>

                  <div className="inline-flex items-center gap-1.5 mt-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/20 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {t.preview.stampsCollected(totalStamps)}
                  </div>
                </div>
              </div>

              {/* CARD BODY CONTENT */}
              <div className="px-3.5 py-4 space-y-4 relative z-10">
                {/* 3. STAMP CARD BOX (MATERIAL TEXTURE APPLIED) */}
                <div
                  className="stamp-card relative transition-all duration-300 p-4 border"
                  style={{
                    backgroundColor: cardBoxBlock.bgColor || '#FFFDF8',
                    borderColor: cardBoxBlock.borderColor || '#F0DEC0',
                    borderRadius: `${cardBoxBlock.borderRadius ?? 28}px`,
                    backdropFilter: cardBoxBlock.cardStyle === 'kaca' ? 'blur(16px)' : undefined,
                    boxShadow: cardBoxBlock.cardStyle === 'kaca'
                      ? '0 12px 30px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.8)'
                      : '0 4px 16px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* MATERIAL TEXTURE OVERLAY */}
                  <CardBoxMaterialTexture style={cardBoxBlock.cardStyle || 'kertas'} />

                  {/* STAMP HEADER STATUS */}
                  <div className="relative z-10 flex items-center justify-between mb-3 border-b border-stone-200/50 pb-2.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900/80">
                      {isFull ? t.preview.cardFullBadge : t.preview.cardProgressBadge}
                    </span>
                    <span className="text-[11px] font-bold text-stone-600">
                      {totalStamps} / {reqStamps}
                    </span>
                  </div>

                  {/* STAMP SLOTS GRID (DYNAMIC) */}
                  <div className="relative z-10 grid grid-cols-5 gap-2 my-2">
                    {Array.from({ length: reqStamps }).map((_, i) => {
                      const isStamped = i < totalStamps
                      const isFreeGiftSlot = i === reqStamps - 1
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative border ${
                            isStamped
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-800 shadow-2xs'
                              : isFreeGiftSlot
                              ? 'bg-amber-400/15 border-amber-400 border-dashed text-amber-700 animate-pulse'
                              : 'bg-white/70 border-stone-200/80 text-stone-400'
                          }`}
                        >
                          {isStamped ? (
                            <img
                              src={normalizeStampIcon(config.stampIcon)}
                              alt="Cop"
                              className="w-6 h-6 object-contain filter drop-shadow-xs"
                              onError={(e) => {
                                e.currentTarget.src = '/icons/stamps/coffee.svg'
                              }}
                            />
                          ) : isFreeGiftSlot ? (
                            <span className="text-base">🎁</span>
                          ) : (
                            <span className="text-xs font-bold font-mono opacity-50">{i + 1}</span>
                          )}

                          {isStamped && (
                            <span className="text-[8px] font-mono font-bold text-amber-900/70 mt-0.5">
                              #{i + 1}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* 4. PROGRESS BAR BLOCK */}
                  {progressBlock.visible !== false && (
                    <div className="relative z-10 mt-3.5 pt-2 border-t border-stone-200/40">
                      <div className="flex justify-between items-center text-[10px] font-bold text-stone-600 mb-1">
                        <span>{percentFill}%</span>
                        <span>{remainStamps > 0 ? t.simulatorTab.remainText(remainStamps) : t.simulatorTab.statusFull}</span>
                      </div>
                      <ProgressBarRenderer
                        percent={percentFill}
                        style={progressBlock.progressStyle || 'gradient'}
                        c1={progressBlock.bgColor || '#FF5A45'}
                        c2={progressBlock.bgColor2 || '#FFB238'}
                      />
                    </div>
                  )}
                </div>

                {/* REWARD SECTION (IF FULL OR TEASER) */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#EAE3D8] space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <span>{t.preview.cardCompletedReward(config.rewardDesc)}</span>
                  </div>

                  <div className="text-[10.5px] text-stone-600 leading-relaxed bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE5DA]">
                    <b>{t.preview.stepsTitle}</b>
                    <ol className="list-none space-y-0.5 mt-1 text-stone-500">
                      <li>{t.preview.step1}</li>
                      <li>{t.preview.step2}</li>
                      <li>{t.preview.step3}</li>
                    </ol>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs shadow-sm hover:from-amber-600 hover:to-amber-700 transition cursor-pointer"
                  >
                    {t.preview.claimFreeBtn}
                  </button>
                </div>

                {/* GOOGLE REVIEW SECTION */}
                <div className="p-3 rounded-2xl bg-white border border-[#EAE3D8] text-center space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-stone-800">
                    {t.preview.rateStore(config.storeName)}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {t.preview.rateAppreciation(config.storeName)}
                  </div>
                  <div className="flex justify-center gap-1 text-amber-400 text-sm pt-1">
                    {'★★★★★'}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD FOOTER */}
            <div className="p-4 text-center text-[10px] text-stone-500 border-t border-stone-200/40 relative z-10">
              <div>{t.preview.lastUpdated}</div>
              <div className="flex justify-center gap-3 mt-1 font-medium text-stone-400">
                <span>{t.preview.privacyPolicy}</span>
                <span className="dot-sep">•</span>
                <span>{t.preview.deleteAccount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
})

// ==========================================
// MAIN CARD STUDIO PAGE COMPONENT
// ==========================================

export default function CardStudioPage() {
  const [config, setConfig] = useState<LiveStudioConfig>(DEFAULT_LIVE_STUDIO_CONFIG)
  const [activeTab, setActiveTab] = useState<'blocks' | 'presets' | 'simulate'>('blocks')
  const [lang, setLang] = useState<'my' | 'en'>('my')
  const [selectedBlockId, setSelectedBlockId] = useState<EditableBlockId | null>('hero_header')
  const [saveStatus, setSaveStatus] = useState<string>('')
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor')

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

  // Sync language with Dashboard (stored in localStorage under 'lajus_lang')
  useEffect(() => {
    const savedLang = localStorage.getItem('lajus_lang') as 'my' | 'en' | null
    if (savedLang === 'my' || savedLang === 'en') {
      setLang(savedLang)
    }
  }, [])

  const t = I18N_STUDIO[lang]

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
        const targetTemplateId = searchParams?.get('templateId') || null
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
                return
              }
            }

            if (isNewMode) {
              setConfig(DEFAULT_LIVE_STUDIO_CONFIG)
              setActiveTemplateId(null)
              setTemplateName(initialNameParam || (lang === 'en' ? `Template #${serverTemplates.length + 1}` : `Templat #${serverTemplates.length + 1}`))
              setIsLiveNow(false)
              return
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
                setTemplateName(lang === 'en' ? 'Current Live Template' : 'Templat Live Semasa')
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
  }, [lang])

  const saveConfig = useCallback((updater: LiveStudioConfig | ((prev: LiveStudioConfig) => LiveStudioConfig)) => {
    setConfig((prevConfig) => {
      const nextConfig = typeof updater === 'function' ? updater(prevConfig) : updater

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem('cop_card_studio_config', JSON.stringify(nextConfig))
          setSaveStatus(lang === 'en' ? 'Draft updated' : 'Draf dikemas kini')
          if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current)
          statusTimeoutRef.current = setTimeout(() => setSaveStatus(''), 2000)
        } catch (e) {
          console.error('Failed to save config draft:', e)
        }
      }, 350)

      return nextConfig
    })
  }, [lang])

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
          setSaveStatus(lang === 'en' ? 'Draft updated' : 'Draf dikemas kini')
          if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current)
          statusTimeoutRef.current = setTimeout(() => setSaveStatus(''), 2000)
        } catch (e) {
          console.error('Failed to save config draft:', e)
        }
      }, 350)

      return nextConfig
    })
  }, [lang])

  const toggleHeroHeader = useCallback(() => toggleBlock('hero_header'), [toggleBlock])
  const toggleStoreProfile = useCallback(() => toggleBlock('store_profile'), [toggleBlock])
  const toggleStampCardBox = useCallback(() => toggleBlock('stamp_card_box'), [toggleBlock])
  const toggleProgressBar = useCallback(() => toggleBlock('progress_bar'), [toggleBlock])

  const updateHeroHeader = useCallback((partial: Partial<EditableBlockConfig>) => updateBlock('hero_header', partial), [updateBlock])
  const updateStoreProfile = useCallback((partial: Partial<EditableBlockConfig>) => updateBlock('store_profile', partial), [updateBlock])
  const updateStampCardBox = useCallback((partial: Partial<EditableBlockConfig>) => updateBlock('stamp_card_box', partial), [updateBlock])
  const updateProgressBar = useCallback((partial: Partial<EditableBlockConfig>) => updateBlock('progress_bar', partial), [updateBlock])

  const updateStoreName = useCallback((name: string) => {
    saveConfig((prev) => ({ ...prev, storeName: name }))
  }, [saveConfig])

  const updatePageColors = useCallback((pageBgColor: string, pageDotColor: string) => {
    saveConfig((prev) => ({ ...prev, pageBgColor, pageDotColor }))
  }, [saveConfig])

  const updateStamps = useCallback((simulatedStamps: number, stampsRequired: number) => {
    saveConfig((prev) => ({ ...prev, simulatedStamps, stampsRequired }))
  }, [saveConfig])

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
          setSaveStatus(lang === 'en' ? 'Draft updated' : 'Draf dikemas kini')
          if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current)
          statusTimeoutRef.current = setTimeout(() => setSaveStatus(''), 2000)
        } catch (e) {
          console.error('Failed to save config draft:', e)
        }
      }, 350)

      return nextConfig
    })
  }, [lang])

  const resetToDefault = useCallback(() => {
    if (confirm(t.nav.resetConfirm)) {
      setConfig(DEFAULT_LIVE_STUDIO_CONFIG)
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      try {
        localStorage.setItem('cop_card_studio_config', JSON.stringify(DEFAULT_LIVE_STUDIO_CONFIG))
        setSaveStatus(t.nav.resetSuccess)
        if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current)
        statusTimeoutRef.current = setTimeout(() => setSaveStatus(''), 2000)
      } catch {}
    }
  }, [t])

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

  // Open Save Modal
  const handleOpenSaveModal = useCallback((forceLive = false) => {
    setModalName(templateName || (lang === 'en' ? 'My Card Template' : 'Templat Kad Saya'))
    setModalSetAsLive(forceLive ? true : isLiveNow)
    setModalError('')
    setShowSaveModal(true)
  }, [templateName, isLiveNow, lang])

  // Save Template to Cloud (Supabase via /api/store/settings)
  const handleCloudSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const cleanName = modalName.trim()
    if (!cleanName) {
      setModalError(t.saveModal.errEmptyName)
      return
    }

    // Check 3 templates quota
    const isNew = !activeTemplateId || !customTemplates.some((t) => t.id === activeTemplateId)
    if (isNew && customTemplates.length >= 3) {
      setModalError(t.saveModal.errQuotaFull)
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
        throw new Error(data.error || t.saveModal.errGeneral)
      }

      setCustomTemplates(Array.isArray(data.customTemplates) ? data.customTemplates : updatedTemplates)
      setActiveTemplateId(templateId)
      setTemplateName(cleanName)
      setIsLiveNow(modalSetAsLive)
      setShowSaveModal(false)

      showToast(
        modalSetAsLive
          ? t.saveModal.successLive
          : t.saveModal.successDraft,
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
        setModalError(t.saveModal.errTimeout)
      } else {
        setModalError(err.message || t.saveModal.errGeneral)
      }
    } finally {
      clearTimeout(timeoutId)
      setIsSavingToCloud(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-stone-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* SCOPED COMPONENT STYLES */}
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
        }

        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      ` }} />

      {/* TOP HEADER / ACTION BAR */}
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#EBE5DB] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 px-2.5 sm:px-3.5 py-1.5 rounded-xl transition shrink-0"
          >
            <span>{t.nav.backToDashboard}</span>
          </Link>

          <div className="h-4 w-[1px] bg-stone-300 hidden sm:block shrink-0" />

          {/* TEMPLATE NAME BADGE */}
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-extrabold text-stone-900 truncate">
              {templateName || t.nav.defaultDraftName}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                isLiveNow
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              {isLiveNow ? `● ${t.nav.statusLive}` : `○ ${t.nav.statusDraft}`}
            </span>
          </div>
        </div>

        {/* TOP ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {saveStatus && (
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg animate-fade-in hidden md:inline">
              ✓ {saveStatus}
            </span>
          )}

          <button
            type="button"
            onClick={resetToDefault}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 font-bold text-xs transition cursor-pointer"
          >
            {t.nav.resetBtn}
          </button>

          {/* SIMPAN TEMPLAT (MODAL TRIGGER) */}
          <button
            type="button"
            onClick={() => handleOpenSaveModal(false)}
            disabled={isSavingToCloud}
            className="px-3 sm:px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <svg className="w-3.5 h-3.5 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>{t.nav.saveBtn}</span>
          </button>

          {/* SET LIVE SEKARANG */}
          <button
            type="button"
            onClick={() => handleOpenSaveModal(true)}
            disabled={isSavingToCloud}
            className="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="hidden xs:inline">{t.nav.setLiveBtn}</span>
            <span className="xs:hidden">Live</span>
          </button>
        </div>
      </header>

      {/* MOBILE SWITCHER: UBAH REKA BENTUK VS PRATONTON */}
      <div className="flex md:hidden border-b border-[#EBE5DB] bg-white p-1.5 gap-1.5 sticky top-16 z-30 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mobileView === 'editor'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>{t.mobile.editTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mobileView === 'preview'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
          </svg>
          <span>{t.mobile.previewTab}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        {/* LEFT PANEL: 3 TABS (4 BLOK, TEMA & WARNA, SIMULATOR) */}
        <aside className={`w-full md:w-[370px] lg:w-[440px] xl:w-[480px] bg-white border-r border-[#EBE5DB] flex flex-col shrink-0 overflow-y-auto shadow-sm ${
          mobileView === 'preview' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* TABS */}
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
              {t.tabs.blocks}
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
              {t.tabs.presets}
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
              {t.tabs.simulate}
            </button>
          </div>

          <div className="p-3.5 sm:p-5 space-y-4 sm:space-y-5">
            {/* TAB 1: 4 BLOCKS ACCORDION */}
            {activeTab === 'blocks' && (
              <div className="space-y-3.5">
                <div className="text-xs text-stone-600 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE5DA] leading-relaxed">
                  <b>{t.tabs.blocks}:</b> {t.blocksGuide}
                </div>

                <HeroHeaderPanel
                  heroBlock={heroBlock}
                  isOpen={selectedBlockId === 'hero_header'}
                  lang={lang}
                  t={t}
                  onToggle={toggleHeroHeader}
                  onUpdate={updateHeroHeader}
                />

                <StoreProfilePanel
                  profileBlock={profileBlock}
                  storeName={config.storeName}
                  isOpen={selectedBlockId === 'store_profile'}
                  lang={lang}
                  t={t}
                  onToggle={toggleStoreProfile}
                  onUpdate={updateStoreProfile}
                  onUpdateStoreName={updateStoreName}
                />

                <StampCardBoxPanel
                  cardBoxBlock={cardBoxBlock}
                  isOpen={selectedBlockId === 'stamp_card_box'}
                  lang={lang}
                  t={t}
                  onToggle={toggleStampCardBox}
                  onUpdate={updateStampCardBox}
                />

                <ProgressBarPanel
                  progressBlock={progressBlock}
                  isOpen={selectedBlockId === 'progress_bar'}
                  lang={lang}
                  t={t}
                  onToggle={toggleProgressBar}
                  onUpdate={updateProgressBar}
                />
              </div>
            )}

            {/* TAB 2: TEMA DISYORKAN & TEMA WARNA */}
            {activeTab === 'presets' && (
              <PresetsTabPanel
                pageBgColor={config.pageBgColor}
                pageDotColor={config.pageDotColor}
                lang={lang}
                t={t}
                onApplyPreset={applyPreset}
                onUpdatePageColors={updatePageColors}
              />
            )}

            {/* TAB 3: SIMULATE STAMPS */}
            {activeTab === 'simulate' && (
              <SimulatorTabPanel
                simulatedStamps={config.simulatedStamps}
                stampsRequired={config.stampsRequired}
                lang={lang}
                t={t}
                onUpdateStamps={updateStamps}
              />
            )}
          </div>
        </aside>

        {/* RIGHT PANEL: LIVE PHONE PREVIEW */}
        <CardStudioPhonePreview
          config={config}
          lang={lang}
          t={t}
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
          <span>{cloudToast.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{cloudToast.msg}</span>
        </div>
      )}

      {/* MODAL SIMPAN TEMPLAT */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">{t.saveModal.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{t.saveModal.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold leading-relaxed">
                ⚠️ {modalError}
              </div>
            )}

            <form onSubmit={handleCloudSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t.saveModal.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder={lang === 'en' ? 'e.g. Vintage Cafe Theme' : 'cth: Tema Vintage Kafe'}
                  className="w-full bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 font-medium"
                />
              </div>

              {/* TOGGLE SET AS LIVE */}
              <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EDE5DA] space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalSetAsLive}
                    onChange={(e) => setModalSetAsLive(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-600 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900">
                      {t.saveModal.setLiveLabel}
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                      {t.saveModal.setLiveHelp}
                    </p>
                  </div>
                </label>
              </div>

              <div className="text-[11px] text-stone-500 flex items-center justify-between">
                <span>{t.saveModal.quotaUsed(customTemplates.length)}</span>
                {activeTemplateId && (
                  <span className="text-amber-700 font-bold">
                    {lang === 'en' ? 'Updating existing template' : 'Mengemas kini templat sedia ada'}
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  disabled={isSavingToCloud}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition cursor-pointer"
                >
                  {t.saveModal.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isSavingToCloud}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSavingToCloud ? t.saveModal.savingBtn : t.saveModal.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
