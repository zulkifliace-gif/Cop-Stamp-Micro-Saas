export type Lang = 'my' | 'en'

export interface DashboardTranslation {
  topbar: {
    staffCounter: string
    onboarding: string
    owner: string
    staff: string
    login: string
    printerConnectedTitle: (name: string) => string
    printerDisconnectedTitle: string
    settingsOpenTitle: string
    settingsTitle: string
    logoutTitle: string
  }
  loading: {
    loadingCounter: string
  }
  loginCard: {
    title: string
    subtitle: string
    desc: string
    googleBtn: string
    connecting: string
    secureNote: string
  }
  onboarding: {
    title: string
    subtitle: string
    desc: string
    storeNameLabel: string
    storeNamePlaceholder: string
    reviewToggleLabel: string
    reviewToggleDesc: string
    reviewInputLabel: string
    reviewInputPlaceholder: string
    reviewInputHint: string
    reviewGeneratorHint: string
    reviewTestButton: string
    reviewInvalidLinkError: string
    stampIconLabel: string
    stampIconBadge: string
    stampIconDesc: string
    hint: string
    registerBtn: string
    registering: string
  }
  planQuota: {
    proActive: string
    freeStarter: string
    upgrade: string
    quotaTitle: string
    quotaFull: string
    upgradeToPro: string
    quotaWarning: (left: number) => string
  }
  stats: {
    customers: string
    stampsClaimed: string
    rewardsRedeemed: string
    activeStamps: string
  }
  customersModal: {
    title: string
    subTitle: (count: number) => string
    searchPlaceholder: string
    accumulatedStamps: (count: number) => string
    fullCards: (count: number) => string
    readyToRedeem: string
    selectToRedeem: string
    noCustomersFound: string
    noCustomersYet: string
    closeBtn: string
    loading: string
    prevPage: string
    nextPage: string
    pageInfo: (curr: number, total: number) => string
  }
  searchSection: {
    title: string
    subTitle: string
    placeholder: string
    searchBtn: string
    searching: string
    stampsUnit: string
    fullCardsNotice: (count: number) => string
    notEnoughStamps: (curr: number, req: number) => string
    rewardLabel: string
    chooseReward: string
    howManyRewards: string
    maxSuffix: string
    confirmRedeemSingle: (rewardName: string) => string
    confirmRedeemMultiple: (count: number, rewardName: string) => string
    processingRedeem: string
    needMinStamps: (req: number) => string
    receiptTitle: string
    doneClaimBadge: string
    receiptStore: string
    receiptCustomer: string
    receiptReward: string
    receiptStampsUsed: string
    receiptRemaining: string
    receiptTime: string
    printClaimReceiptBtn: string
    printingClaim: string
    scanQrBtn: string
    scanModalTitle: string
    scanModalDesc: string
    scanCameraError: string
    scanCloseBtn: string
    scanSuccessMsg: string
  }
  generator: {
    title: string
    question: string
    desc: string
    stampsUnit: string
    receiptQr: string
    email: string
    emailPlaceholder: string
    generateBtn: string
    generating: string
    scanPrompt: string
    openClaimLink: string
    printBtnConnected: string
    printBtnConnectAndPrint: string
    printing: string
    autoPrintHint: string
    newTokenBtn: string
    emailSentTitle: string
    expiredMsg: string
    expiresIn: (m: string, s: string) => string
    tapToEnlarge: string
    largeQrModalTitle: string
    largeQrScanPrompt: string
    claimedAnimationTitle: string
    claimedSuccessMsg: string
  }
  settings: {
    title: string
    close: string
    storeNameLabel: string
    reviewToggleLabel: string
    reviewToggleDesc: string
    reviewInputLabel: string
    reviewInputPlaceholder: string
    reviewInputHint: string
    reviewGeneratorHint: string
    reviewTestButton: string
    reviewConnectedBadge: string
    reviewInvalidLinkError: string
    logoUrlLabel: string
    directUrlHint: string
    logoPreview: string
    stampIconLabel: string
    stampIconBadge: string
    stampIconDesc: string
    rewardsTitle: string
    rewardsDesc: string
    rewardItemNumber: (idx: number) => string
    deleteBtn: string
    rewardNamePlaceholder: string
    stampsPlaceholder: string
    rewardImgPlaceholder: string
    rewardDescPlaceholder: string
    addRewardBtn: string
    socialTitle: string
    addLinkBtn: string
    socialDesc: string
    noSocialLinks: string
    locationsTitle: string
    locationsDesc: string
    addLocationBtn: string
    noLocations: string
    locationNamePlaceholder: string
    locationUrlPlaceholder: string
    locationAddressPlaceholder: string
    saveBtn: string
    saving: string
    ownerOnlyNote: string
    savedToast: string
    dangerZone: string
    dangerZoneDesc: string
    deleteAccountBtn: string
    shareCloneTitle: string
    showSettingsQrBtn: string
    scanSettingsQrBtn: string
    settingsQrModalTitle: string
    settingsQrModalDesc: string
    settingsScanModalTitle: string
    settingsScanModalDesc: string
    settingsScanSuccessMsg: string
    settingsScanInvalidMsg: string
    copyConfigBtn: string
    configCopiedMsg: string
    customTemplatesTitle: string
    customTemplatesDesc: string
    customTemplatesQuota: (used: number) => string
    createTemplateBtn: string
    openCardStudioBtn: string
    noCustomTemplates: string
    activeLiveBadge: string
    draftBadge: string
    activateLiveBtn: string
    editInStudioBtn: string
    deleteTemplateBtn: string
    newTemplateModalTitle: string
    newTemplateModalDesc: string
    newTemplateNameLabel: string
    newTemplateNamePlaceholder: string
    maxTemplatesReachedMsg: string
    startDesigningBtn: string
  }
  activity: {
    title: string
    hint: (open: boolean) => string
    downloadBtn: string
    downloadTooltip: string
    refreshTooltip: string
    empty: string
    stampsUnit: string
    claimedBadge: string
    expiredBadge: string
    pendingBadge: string
    prevPage: string
    nextPage: string
    pageInfo: (curr: number, total: number) => string
  }
  exportModal: {
    title: string
    desc: string
    periodLabel: string
    thisMonth: string
    lastMonth: string
    last3Months: string
    allRecords: string
    customRange: string
    from: string
    to: string
    cancel: string
    downloadBtn: string
    generating: string
  }
  socialModal: {
    title: string
    selectPlatform: string
    urlLabel: string
    cancel: string
    save: string
  }
  deleteModal: {
    title: string
    warning1: string
    warning2: string
    typeToConfirm: string
    cancel: string
    confirmDelete: string
    deleting: string
  }
  footer: {
    privacyPolicy: string
  }
}

export const I18N_DASHBOARD: Record<Lang, DashboardTranslation> = {
  my: {
    topbar: {
      staffCounter: 'KAUNTER STAFF',
      onboarding: '• PENDAFTARAN KEDAI',
      owner: '• PEMILIK',
      staff: '• STAF',
      login: '• LOG MASUK',
      printerConnectedTitle: (name) => `Printer Disambung: ${name} (Klik untuk putuskan)`,
      printerDisconnectedTitle: 'Sambung Thermal Printer Bluetooth (Auto-Print Resit)',
      settingsOpenTitle: 'Tutup Tetapan',
      settingsTitle: 'Tetapan Kedai',
      logoutTitle: 'Log keluar',
    },
    loading: {
      loadingCounter: 'Memuatkan Kaunter Staff...',
    },
    loginCard: {
      title: 'LajuS',
      subtitle: 'Kaunter Staff',
      desc: 'Sila log masuk dengan akaun Google yang didaftarkan sebagai staf atau pemilik kedai untuk mengakses kaunter cop.',
      googleBtn: 'Log masuk dengan Google',
      connecting: 'Menghubungkan ke Google...',
      secureNote: 'Akses selamat melalui Supabase Auth',
    },
    onboarding: {
      title: 'Daftar Kedai',
      subtitle: 'Langkah Mudah',
      desc: 'Masukkan maklumat kedai untuk buka kaunter cop digital anda.',
      storeNameLabel: 'Nama Kedai',
      storeNamePlaceholder: 'cth: Kopi & Kawan / Barber Studio',
      reviewToggleLabel: 'Sambung Google Review ⭐',
      reviewToggleDesc: 'Popup review 5-bintang automatik untuk pelanggan.',
      reviewInputLabel: 'Link Google Review / Place ID',
      reviewInputPlaceholder: 'Tampal link Google Maps / Place ID',
      reviewInputHint: 'Automatik buka kotak ulasan 5-bintang.',
      reviewGeneratorHint: 'Cari Link ↗',
      reviewTestButton: '👁️ Uji Link',
      reviewInvalidLinkError: 'Link Google Review tidak sah.',
      stampIconLabel: 'Ikon Cop',
      stampIconBadge: 'Pilihan',
      stampIconDesc: 'Pilih ikon cop mengikut jenis perniagaan anda.',
      hint: 'Hadiah & kuota cop boleh diubah bila-bila masa di Tetapan.',
      registerBtn: 'Buka Kaunter Kedai →',
      registering: 'Membuka Kaunter...',
    },
    planQuota: {
      proActive: '⚡ Pelan Pro – Aktif',
      freeStarter: '✦ 20 Kad Percuma',
      upgrade: 'Top-Up Kad →',
      quotaTitle: 'Status Kuota Kad',
      quotaFull: 'Semua kuota kad telah digunakan. Sila top-up kad untuk pelanggan baharu.',
      upgradeToPro: 'Top-Up Kad Sekarang',
      quotaWarning: (left) => `Hampir penuh — baki ${left} kad lagi.`,
    },
    stats: {
      customers: 'Kad Diguna',
      stampsClaimed: 'Cop Dituntut',
      rewardsRedeemed: 'Ganjaran Ditebus',
      activeStamps: 'Baki Cop Aktif',
    },
    customersModal: {
      title: 'Senarai Pelanggan',
      subTitle: (count) => `Jumlah ${count} pelanggan memiliki kad aktif di kedai ini`,
      searchPlaceholder: 'Cari emel atau nama pelanggan...',
      accumulatedStamps: (count) => `terkumpul ${count}`,
      fullCards: (count) => `${count} Kad Penuh`,
      readyToRedeem: 'Layak Tebus',
      selectToRedeem: 'Pilih untuk Tebus',
      noCustomersFound: 'Tiada pelanggan sepadan dengan carian.',
      noCustomersYet: 'Belum ada pelanggan yang menuntut cop di kedai ini.',
      closeBtn: 'Tutup',
      loading: 'Memuatkan senarai pelanggan...',
      prevPage: 'Sebelumnya',
      nextPage: 'Seterusnya',
      pageInfo: (curr, total) => `Halaman ${curr} daripada ${total}`,
    },
    searchSection: {
      title: 'Tebus Ganjaran di Kaunter',
      subTitle: 'Cari Emel Pelanggan',
      placeholder: 'Masukkan emel pelanggan (cth: ali@gmail.com)',
      searchBtn: 'Cari',
      searching: 'Mencari...',
      stampsUnit: 'Cop',
      fullCardsNotice: (count) => `${count} Kad Penuh (${count} Ganjaran Sedia Ditebus)!`,
      notEnoughStamps: (curr, req) => `Belum cukup cop (${curr}/${req} cop pada kad aktif).`,
      rewardLabel: 'Ganjaran:',
      chooseReward: 'Pilih hadiah untuk ditebus:',
      howManyRewards: 'Tebus berapa ganjaran?',
      maxSuffix: 'maks',
      confirmRedeemSingle: (name) => `Sahkan Penebusan: ${name}`,
      confirmRedeemMultiple: (count, name) => `Sahkan Penebusan ${count}x ${name}`,
      processingRedeem: 'Memproses Penebusan...',
      needMinStamps: (req) => `Pelanggan memerlukan sekurang-kurangnya ${req} cop untuk menebus.`,
      receiptTitle: 'Resit Penebusan Selesai',
      doneClaimBadge: 'Done Claim ✓',
      receiptStore: 'Nama Kedai:',
      receiptCustomer: 'Emel Pelanggan:',
      receiptReward: 'Nama Hadiah:',
      receiptStampsUsed: 'Cop Diguna:',
      receiptRemaining: 'Baki Cop:',
      receiptTime: 'Masa & Tarikh:',
      printClaimReceiptBtn: 'Cetak Resit Penebusan (Bluetooth)',
      printingClaim: 'Mencetak Resit...',
      scanQrBtn: 'Imbas QR Kod Pelanggan',
      scanModalTitle: 'Imbas QR Kod Pelanggan',
      scanModalDesc: 'Halakan kamera ke skrin telefon pelanggan yang memaparkan QR kod profil mereka.',
      scanCameraError: 'Tidak dapat mengakses kamera. Sila benarkan kebenaran kamera pada pelayar anda.',
      scanCloseBtn: 'Tutup Kamera',
      scanSuccessMsg: 'QR kod berjaya diimbas! Emel dimasukkan.',
    },
    generator: {
      title: 'Bagi Cop Stamp',
      question: 'Berapa cop nak diberi?',
      desc: 'Pilih bilangan cop, pelanggan terima terus lepas scan atau klik pautan.',
      stampsUnit: 'bilangan cop',
      receiptQr: 'Resit (QR)',
      email: 'Emel',
      emailPlaceholder: 'emel.pelanggan@contoh.com',
      generateBtn: 'Jana Cop Sekarang',
      generating: 'Menjana Token...',
      scanPrompt: 'Papar skrin ini pada pelanggan untuk diimbas, atau salin pautan di bawah.',
      openClaimLink: 'Buka pautan tebusan ↗',
      printBtnConnected: 'Cetak Semula Resit',
      printBtnConnectAndPrint: 'Sambung BT & Cetak Resit',
      printing: 'Mencetak Resit...',
      autoPrintHint: 'Auto-print resit setiap kali jana cop',
      newTokenBtn: '+ Token baharu',
      emailSentTitle: 'Emel Dihantar',
      expiredMsg: 'Token tamat tempoh',
      expiresIn: (m, s) => `Tamat dalam ${m}:${s}`,
      tapToEnlarge: '🔍 Tekan QR untuk besarkan skrin',
      largeQrModalTitle: 'Imbas QR di Kaunter',
      largeQrScanPrompt: 'Pelanggan imbas untuk terima cop stamp',
      claimedAnimationTitle: 'Cop Berjaya Diterima!',
      claimedSuccessMsg: 'Pelanggan telah berjaya menebus cop.',
    },
    settings: {
      title: 'Tetapan Kedai',
      close: 'Tutup',
      storeNameLabel: 'Nama Kedai',
      reviewToggleLabel: 'Sambungkan Google Review ⭐',
      reviewToggleDesc: 'Papar popup jemputan review 5-bintang automatik kepada pelanggan semasa menerima cop.',
      reviewInputLabel: 'Link Google Review / Place ID',
      reviewInputPlaceholder: 'Paste link Google Maps / link "Tulis Ulasan" / Place ID',
      reviewInputHint: 'Sistem akan automatik menjana link yang terus membuka kotak ulasan 5-bintang untuk pelanggan.',
      reviewGeneratorHint: 'Google Review Link Generator ↗',
      reviewTestButton: '👁️ Uji Buka Link Review',
      reviewConnectedBadge: '✓ Google Review Aktif',
      reviewInvalidLinkError: 'Link Google Review tidak sah. Sila semak pautan anda.',
      logoUrlLabel: 'URL Logo Kedai (Imej)',
      directUrlHint: 'Dapatkan Direct URL di Catbox ↗',
      logoPreview: 'Pratonton Logo',
      stampIconLabel: 'Ikon Cop Stamp (Kategori Kedai)',
      stampIconBadge: 'Pilihan Tersedia',
      stampIconDesc: 'Pilih ikon cop yang akan dipaparkan di bulatan cop kad pelanggan anda.',
      rewardsTitle: 'Katalog Hadiah & Ganjaran',
      rewardsDesc: 'Tambah pilihan hadiah lain mengikut bilangan cop yang berbeza.',
      rewardItemNumber: (idx) => `Hadiah #${idx}`,
      deleteBtn: 'Padam',
      rewardNamePlaceholder: 'Nama Hadiah (cth: Kek Red Velvet)',
      stampsPlaceholder: 'Cop',
      rewardImgPlaceholder: 'URL Gambar Hadiah (https://...)',
      rewardDescPlaceholder: 'Penerangan hadiah (cth: Tebus di kaunter, terhad 1 unit sehari)',
      addRewardBtn: '+ Tambah Hadiah Baharu',
      socialTitle: 'Pautan Media Sosial & Laman Web',
      addLinkBtn: '+ Tambah Pautan',
      socialDesc: 'Pautan ini akan dipaparkan sebagai ikon di bawah nama kedai di kad pelanggan.',
      noSocialLinks: 'Belum ada pautan media sosial. Tekan "+ Tambah Pautan" untuk masukkan Instagram, TikTok, WhatsApp, dll.',
      locationsTitle: 'Lokasi Kedai & Cawangan',
      locationsDesc: 'Tetapkan lokasi Google Maps kedai anda. Tambah lebih daripada 1 cawangan jika kedai mempunyai beberapa outlet.',
      addLocationBtn: '+ Tambah Cawangan',
      noLocations: 'Belum ada cawangan ditetapkan. Tekan "+ Tambah Cawangan" untuk masukkan lokasi Google Maps anda.',
      locationNamePlaceholder: 'Nama Cawangan (cth: Cawangan Bangi)',
      locationUrlPlaceholder: 'URL Google Maps (https://maps.google.com/...)',
      locationAddressPlaceholder: 'Alamat Ringkas (Pilihan)',
      saveBtn: 'Simpan Tetapan',
      saving: 'Menyimpan...',
      ownerOnlyNote: 'Hanya Pemilik (Owner) boleh menukar tetapan kedai.',
      savedToast: '✓ Tetapan disimpan',
      dangerZone: 'Zon Bahaya',
      dangerZoneDesc: 'Padam akaun anda secara kekal',
      deleteAccountBtn: 'Padam Akaun Saya',
      shareCloneTitle: 'Salin / Pindah Tetapan Kedai',
      showSettingsQrBtn: 'Papar QR Tetapan',
      scanSettingsQrBtn: 'Imbas QR Tetapan',
      settingsQrModalTitle: 'QR Pautan Tetapan Kedai',
      settingsQrModalDesc: 'Imbas QR pautan ini dari kedai lain untuk menyalin semua maklumat secara automatik.',
      settingsScanModalTitle: 'Imbas QR Tetapan Kedai Lain',
      settingsScanModalDesc: 'Halakan kamera ke QR Tetapan dari kedai pertama untuk auto-isi semua tetapan.',
      settingsScanSuccessMsg: 'Semua maklumat berjaya dimuatkan dari pautan kedai! Sila semak dan tekan Simpan.',
      settingsScanInvalidMsg: 'Pautan QR ini bukan pautan tetapan kedai LajuS yang sah.',
      copyConfigBtn: 'Salin Pautan Pindah Tetapan',
      configCopiedMsg: 'Pautan tetapan telah disalin!',
      customTemplatesTitle: 'Templat Kad Pelanggan (Card Studio)',
      customTemplatesDesc: 'Ubah suai tema visual, fon tulisan, tekstur kad, dan animasi progress bar kad pelanggan anda.',
      customTemplatesQuota: (used) => `${used}/3 Slot Digunakan`,
      createTemplateBtn: '+ Cipta Templat Baharu',
      openCardStudioBtn: '🎨 Buka Card Studio',
      noCustomTemplates: 'Belum ada templat tersimpan. Anda boleh menyimpan sehingga 3 reka bentuk templat kad untuk kedai anda.',
      activeLiveBadge: '✨ LIVE (Kad Pelanggan)',
      draftBadge: 'Draf',
      activateLiveBtn: '✨ Aktifkan (Live)',
      editInStudioBtn: '✏️ Ubah di Card Studio',
      deleteTemplateBtn: 'Padam',
      newTemplateModalTitle: '🎨 Cipta Templat Kad Baharu',
      newTemplateModalDesc: 'Beri nama untuk templat anda (cth: "Tema Raya", "Bakeri Pastel"). Had 3 templat setiap akaun kedai.',
      newTemplateNameLabel: 'Nama Templat',
      newTemplateNamePlaceholder: 'cth: Tema Raya Pastel / Edisi Khas',
      maxTemplatesReachedMsg: 'Had maksimum 3 templat telah dicapai. Sila padam templat sedia ada untuk mencipta templat baharu.',
      startDesigningBtn: 'Mula Mereka Bentuk 🎨',
    },
    activity: {
      title: 'Log Aktiviti',
      hint: (open) => (open ? 'Tekan untuk tutup senarai log' : 'Tekan untuk buka & semak rekod'),
      downloadBtn: 'Muat Turun',
      downloadTooltip: 'Muat Turun Log Aktiviti (.CSV)',
      refreshTooltip: 'Muat Semula Log',
      empty: 'Belum ada rekod log aktiviti.',
      stampsUnit: 'Cop',
      claimedBadge: 'DITEBUS',
      expiredBadge: 'LUPUT',
      pendingBadge: 'PENDING',
      prevPage: '◀ Sebelum',
      nextPage: 'Seterusnya ▶',
      pageInfo: (curr, total) => `Halaman ${curr} / ${total}`,
    },
    exportModal: {
      title: '📥 Muat Turun Log Aktiviti',
      desc: 'Pilih tempoh masa untuk menjana dan memuat turun fail laporan log aktiviti kedai anda (.CSV).',
      periodLabel: 'Pilihan Tempoh / Bulan:',
      thisMonth: '📅 Bulan Ini',
      lastMonth: '📅 Bulan Lepas',
      last3Months: '📅 3 Bulan Terakhir',
      allRecords: '📊 Semua Rekod',
      customRange: '🗓️ Pilih Julat Tarikh Khusus...',
      from: 'Dari Tarikh:',
      to: 'Hingga Tarikh:',
      cancel: 'Batal',
      downloadBtn: 'Muat Turun .CSV',
      generating: 'Menjana...',
    },
    socialModal: {
      title: '🔗 Tambah Media Sosial / Web',
      selectPlatform: 'Pilih Platform',
      urlLabel: 'Pautan URL / Nombor Akaun',
      cancel: 'Batal',
      save: 'Simpan Pautan',
    },
    deleteModal: {
      title: 'Padam Akaun',
      warning1: 'Tindakan ini kekal dan tidak boleh dibatalkan.',
      warning2: 'Semua data cop, sejarah tebusan, dan akaun anda akan dipadam dari sistem.',
      typeToConfirm: 'Sila taip PADAM untuk mengesahkan:',
      cancel: 'Batal',
      confirmDelete: 'Sahkan Padam',
      deleting: 'Memadam...',
    },
    footer: {
      privacyPolicy: 'Dasar Privasi (PDPA)',
    },
  },
  en: {
    topbar: {
      staffCounter: 'STAFF COUNTER',
      onboarding: '• STORE REGISTRATION',
      owner: '• OWNER',
      staff: '• STAFF',
      login: '• LOGIN',
      printerConnectedTitle: (name) => `Printer Connected: ${name} (Click to disconnect)`,
      printerDisconnectedTitle: 'Connect Bluetooth Thermal Printer (Auto-Print Receipts)',
      settingsOpenTitle: 'Close Settings',
      settingsTitle: 'Store Settings',
      logoutTitle: 'Log out',
    },
    loading: {
      loadingCounter: 'Loading Staff Counter...',
    },
    loginCard: {
      title: 'LajuS',
      subtitle: 'Staff Counter',
      desc: 'Please sign in with the Google account registered as staff or store owner to access the stamp counter.',
      googleBtn: 'Sign in with Google',
      connecting: 'Connecting to Google...',
      secureNote: 'Secure access via Supabase Auth',
    },
    onboarding: {
      title: 'Register Store',
      subtitle: 'Quick Setup',
      desc: 'Enter basic store info to launch your digital stamp counter.',
      storeNameLabel: 'Store Name',
      storeNamePlaceholder: 'e.g. Coffee & Co / Barber Studio',
      reviewToggleLabel: 'Connect Google Review ⭐',
      reviewToggleDesc: 'Automatic 5-star review invitation popup for customers.',
      reviewInputLabel: 'Google Review Link / Place ID',
      reviewInputPlaceholder: 'Paste Google Maps link / Place ID',
      reviewInputHint: 'Directly opens 5-star review box.',
      reviewGeneratorHint: 'Find Link ↗',
      reviewTestButton: '👁️ Test Link',
      reviewInvalidLinkError: 'Invalid Google Review link.',
      stampIconLabel: 'Stamp Icon',
      stampIconBadge: 'Choice',
      stampIconDesc: 'Select an icon matching your business.',
      hint: 'Rewards & stamp quotas can be edited anytime in Settings.',
      registerBtn: 'Open Store Counter →',
      registering: 'Opening Counter...',
    },
    planQuota: {
      proActive: '⚡ Pro Plan – Active',
      freeStarter: '✦ 20 Free Cards',
      upgrade: 'Top-Up Cards →',
      quotaTitle: 'Card Quota Status',
      quotaFull: 'All card quota used. Please top-up cards for new customers.',
      upgradeToPro: 'Top-Up Cards Now',
      quotaWarning: (left) => `Almost full — ${left} cards remaining.`,
    },
    stats: {
      customers: 'Cards in Use',
      stampsClaimed: 'Stamps Claimed',
      rewardsRedeemed: 'Rewards Redeemed',
      activeStamps: 'Active Stamps',
    },
    customersModal: {
      title: 'Customer List',
      subTitle: (count) => `Total of ${count} customers have active cards at this store`,
      searchPlaceholder: 'Search customer email or name...',
      accumulatedStamps: (count) => `accumulated ${count}`,
      fullCards: (count) => `${count} Full Cards`,
      readyToRedeem: 'Eligible',
      selectToRedeem: 'Select to Redeem',
      noCustomersFound: 'No customers match your search.',
      noCustomersYet: 'No customers have claimed stamps at this store yet.',
      closeBtn: 'Close',
      loading: 'Loading customer list...',
      prevPage: 'Previous',
      nextPage: 'Next',
      pageInfo: (curr, total) => `Page ${curr} of ${total}`,
    },
    searchSection: {
      title: 'Redeem Counter Reward',
      subTitle: 'Search Customer Email',
      placeholder: 'Enter customer email (e.g. customer@gmail.com)',
      searchBtn: 'Search',
      searching: 'Searching...',
      stampsUnit: 'Stamps',
      fullCardsNotice: (count) => `${count} Full Cards (${count} Rewards Ready to Redeem)!`,
      notEnoughStamps: (curr, req) => `Not enough stamps yet (${curr}/${req} stamps on active card).`,
      rewardLabel: 'Reward:',
      chooseReward: 'Select reward to redeem:',
      howManyRewards: 'How many rewards to redeem?',
      maxSuffix: 'max',
      confirmRedeemSingle: (name) => `Confirm Redemption: ${name}`,
      confirmRedeemMultiple: (count, name) => `Confirm Redemption ${count}x ${name}`,
      processingRedeem: 'Processing Redemption...',
      needMinStamps: (req) => `Customer requires at least ${req} stamps to redeem.`,
      receiptTitle: 'Redemption Receipt Completed',
      doneClaimBadge: 'Done Claim ✓',
      receiptStore: 'Store Name:',
      receiptCustomer: 'Customer Email:',
      receiptReward: 'Reward Name:',
      receiptStampsUsed: 'Stamps Used:',
      receiptRemaining: 'Remaining Stamps:',
      receiptTime: 'Time & Date:',
      printClaimReceiptBtn: 'Print Redemption Receipt (Bluetooth)',
      printingClaim: 'Printing Receipt...',
      scanQrBtn: 'Scan Customer QR Code',
      scanModalTitle: 'Scan Customer QR Code',
      scanModalDesc: 'Point the camera at the customer’s phone screen displaying their profile QR code.',
      scanCameraError: 'Cannot access camera. Please allow camera permissions in your browser.',
      scanCloseBtn: 'Close Camera',
      scanSuccessMsg: 'QR code scanned successfully! Email populated.',
    },
    generator: {
      title: 'Issue Stamp Tokens',
      question: 'How many stamps to issue?',
      desc: 'Select stamp count, customer receives stamps upon scanning or tapping link.',
      stampsUnit: 'stamp count',
      receiptQr: 'Receipt (QR)',
      email: 'Email',
      emailPlaceholder: 'customer.email@example.com',
      generateBtn: 'Generate Stamps Now',
      generating: 'Generating Token...',
      scanPrompt: 'Display this screen for customer to scan, or copy the link below.',
      openClaimLink: 'Open claim link ↗',
      printBtnConnected: 'Re-Print Receipt',
      printBtnConnectAndPrint: 'Connect BT & Print Receipt',
      printing: 'Printing Receipt...',
      autoPrintHint: 'Auto-print receipt every time stamps are generated',
      newTokenBtn: '+ New Token',
      emailSentTitle: 'Email Sent',
      expiredMsg: 'Token expired',
      expiresIn: (m, s) => `Expires in ${m}:${s}`,
      tapToEnlarge: '🔍 Tap QR to enlarge fullscreen',
      largeQrModalTitle: 'Scan QR at Counter',
      largeQrScanPrompt: 'Customer scans to collect digital stamps',
      claimedAnimationTitle: 'Stamps Claimed Successfully!',
      claimedSuccessMsg: 'Customer has claimed their stamps.',
    },
    settings: {
      title: 'Store Settings',
      close: 'Close',
      storeNameLabel: 'Store Name',
      reviewToggleLabel: 'Connect Google Review ⭐',
      reviewToggleDesc: 'Automatically show a 5-star review invitation popup to customers when they receive stamps.',
      reviewInputLabel: 'Google Review Link / Place ID',
      reviewInputPlaceholder: 'Paste Google Maps link / "Write Review" link / Place ID',
      reviewInputHint: 'The system will automatically generate a direct 5-star review link for customers.',
      reviewGeneratorHint: 'Google Review Link Generator ↗',
      reviewTestButton: '👁️ Test Review Link',
      reviewConnectedBadge: '✓ Google Review Active',
      reviewInvalidLinkError: 'Invalid Google Review link. Please check your link.',
      logoUrlLabel: 'Store Logo URL (Image)',
      directUrlHint: 'Get Direct URL at Catbox ↗',
      logoPreview: 'Logo Preview',
      stampIconLabel: 'Stamp Icon (Store Category)',
      stampIconBadge: 'Available Choices',
      stampIconDesc: 'Select the stamp icon displayed on your customer loyalty cards.',
      rewardsTitle: 'Rewards & Gifts Catalog',
      rewardsDesc: 'Add multiple reward options for different stamp milestones.',
      rewardItemNumber: (idx) => `Reward #${idx}`,
      deleteBtn: 'Delete',
      rewardNamePlaceholder: 'Reward Name (e.g. Free Red Velvet Cake)',
      stampsPlaceholder: 'Stamps',
      rewardImgPlaceholder: 'Reward Image URL (https://...)',
      rewardDescPlaceholder: 'Reward description (e.g. Redeem at counter, limit 1 per day)',
      addRewardBtn: '+ Add New Reward',
      socialTitle: 'Social Media & Website Links',
      addLinkBtn: '+ Add Link',
      socialDesc: 'These links will appear as icons below your store name on customer cards.',
      noSocialLinks: 'No social links added yet. Tap "+ Add Link" to add Instagram, TikTok, WhatsApp, etc.',
      locationsTitle: 'Store Locations & Outlets',
      locationsDesc: 'Configure Google Maps locations for your store. Add multiple branches if your store has more than one outlet.',
      addLocationBtn: '+ Add Outlet',
      noLocations: 'No outlets configured yet. Tap "+ Add Outlet" to add your Google Maps location.',
      locationNamePlaceholder: 'Outlet Name (e.g. Bangi Branch)',
      locationUrlPlaceholder: 'Google Maps URL (https://maps.google.com/...)',
      locationAddressPlaceholder: 'Short Address (Optional)',
      saveBtn: 'Save Settings',
      saving: 'Saving...',
      ownerOnlyNote: 'Only Store Owners can modify store settings.',
      savedToast: '✓ Settings saved',
      dangerZone: 'Danger Zone',
      dangerZoneDesc: 'Permanently delete your account',
      deleteAccountBtn: 'Delete My Account',
      shareCloneTitle: 'Clone / Transfer Store Settings',
      showSettingsQrBtn: 'Show Settings QR',
      scanSettingsQrBtn: 'Scan Settings QR',
      settingsQrModalTitle: 'Store Settings Link QR',
      settingsQrModalDesc: 'Scan this link QR from another store to copy all configuration automatically.',
      settingsScanModalTitle: 'Scan Other Store Settings QR',
      settingsScanModalDesc: 'Point camera at the Settings QR from another store to auto-fill all configuration.',
      settingsScanSuccessMsg: 'All store configuration loaded from link successfully! Please review and click Save.',
      settingsScanInvalidMsg: 'This QR code is not a valid LajuS store configuration link.',
      copyConfigBtn: 'Copy Settings Transfer Link',
      configCopiedMsg: 'Settings link copied!',
      customTemplatesTitle: 'Customer Card Templates (Card Studio)',
      customTemplatesDesc: 'Customize theme colors, fonts, card textures, and progress bar animations for your customer card.',
      customTemplatesQuota: (used) => `${used}/3 Slots Used`,
      createTemplateBtn: '+ Create New Template',
      openCardStudioBtn: '🎨 Open Card Studio',
      noCustomTemplates: 'No saved templates yet. You can create and save up to 3 custom card designs for your store.',
      activeLiveBadge: '✨ LIVE (Customer Card)',
      draftBadge: 'Draft',
      activateLiveBtn: '✨ Activate (Live)',
      editInStudioBtn: '✏️ Edit in Card Studio',
      deleteTemplateBtn: 'Delete',
      newTemplateModalTitle: '🎨 Create New Card Template',
      newTemplateModalDesc: 'Name your template (e.g. "Raya Theme", "Pastel Bakery"). Maximum 3 templates per store account.',
      newTemplateNameLabel: 'Template Name',
      newTemplateNamePlaceholder: 'e.g. Pastel Cafe Theme / Holiday Special',
      maxTemplatesReachedMsg: 'Maximum limit of 3 templates reached. Please delete an existing template to create a new one.',
      startDesigningBtn: 'Start Designing 🎨',
    },
    activity: {
      title: 'Activity Logs',
      hint: (open) => (open ? 'Tap to collapse logs' : 'Tap to open & inspect logs'),
      downloadBtn: 'Download',
      downloadTooltip: 'Download Activity Logs (.CSV)',
      refreshTooltip: 'Refresh Logs',
      empty: 'No activity log records yet.',
      stampsUnit: 'Stamps',
      claimedBadge: 'CLAIMED',
      expiredBadge: 'EXPIRED',
      pendingBadge: 'PENDING',
      prevPage: '◀ Previous',
      nextPage: 'Next ▶',
      pageInfo: (curr, total) => `Page ${curr} / ${total}`,
    },
    exportModal: {
      title: '📥 Download Activity Logs',
      desc: 'Select a timeframe to generate and export your store activity CSV report.',
      periodLabel: 'Select Timeframe / Month:',
      thisMonth: '📅 This Month',
      lastMonth: '📅 Last Month',
      last3Months: '📅 Last 3 Months',
      allRecords: '📊 All Records',
      customRange: '🗓️ Select Custom Date Range...',
      from: 'From Date:',
      to: 'To Date:',
      cancel: 'Cancel',
      downloadBtn: 'Download .CSV',
      generating: 'Generating...',
    },
    socialModal: {
      title: '🔗 Add Social Media / Website',
      selectPlatform: 'Select Platform',
      urlLabel: 'URL Link / Account Handle',
      cancel: 'Cancel',
      save: 'Save Link',
    },
    deleteModal: {
      title: 'Delete Account',
      warning1: 'This action is permanent and cannot be undone.',
      warning2: 'All stamp data, redemption history, and your account will be deleted from the system.',
      typeToConfirm: 'Please type PADAM to confirm:',
      cancel: 'Cancel',
      confirmDelete: 'Confirm Delete',
      deleting: 'Deleting...',
    },
    footer: {
      privacyPolicy: 'Privacy Policy (PDPA)',
    },
  },
}
