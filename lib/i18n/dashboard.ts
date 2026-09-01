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
    saveBtn: string
    saving: string
    ownerOnlyNote: string
    savedToast: string
    dangerZone: string
    dangerZoneDesc: string
    deleteAccountBtn: string
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
      title: 'Daftarkan Kedai Anda',
      subtitle: 'Langkah Pantas',
      desc: 'Selamat datang! Masukkan nama kedai atau bisnes anda untuk mula menggunakan sistem kad cop digital.',
      storeNameLabel: 'Nama Kedai / Bisnes',
      storeNamePlaceholder: 'Contoh: Kopi & Kawan / Barber Studio',
      reviewToggleLabel: 'Sambungkan Google Review ⭐',
      reviewToggleDesc: 'Papar popup jemputan review 5-bintang automatik kepada pelanggan.',
      reviewInputLabel: 'Link Google Review / Place ID',
      reviewInputPlaceholder: 'Paste link Google Maps / link "Tulis Ulasan" / Place ID',
      reviewInputHint: 'Sistem akan automatik menjana link yang terus membuka kotak ulasan 5-bintang.',
      reviewGeneratorHint: 'Google Review Link Generator ↗',
      reviewTestButton: '👁️ Uji Buka Link Review',
      reviewInvalidLinkError: 'Link Google Review tidak sah. Sila semak pautan anda.',
      stampIconLabel: 'Pilih Ikon Cop (Kategori Kedai)',
      stampIconBadge: 'Pilihan Ikon',
      stampIconDesc: 'Ikon ini akan dipaparkan pada kad cop digital pelanggan anda.',
      hint: 'Katalog hadiah, bilangan cop, dan pautan media sosial boleh disesuaikan bila-bila masa di menu Tetapan selepas ini.',
      registerBtn: 'Daftar Kedai & Buka Kaunter →',
      registering: 'Mendaftarkan Kedai...',
    },
    planQuota: {
      proActive: '⚡ Pelan Pro – Aktif',
      freeStarter: '✦ Pelan Percuma (Starter)',
      upgrade: 'Naik Taraf →',
      quotaTitle: 'Had Pelanggan Percuma',
      quotaFull: 'Had pelanggan dicapai. Pelanggan baharu tidak dapat menerima cop.',
      upgradeToPro: 'Naik taraf ke Pro',
      quotaWarning: (left) => `Hampir penuh — ${left} slot pelanggan berbaki.`,
    },
    stats: {
      customers: 'Pelanggan',
      stampsClaimed: 'Cop Dituntut',
      rewardsRedeemed: 'Ganjaran Ditebus',
      activeStamps: 'Baki Cop Aktif',
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
      directUrlHint: 'Dapatkan Direct URL di ImgHippo ↗',
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
      saveBtn: 'Simpan Tetapan',
      saving: 'Menyimpan...',
      ownerOnlyNote: 'Hanya Pemilik (Owner) boleh menukar tetapan kedai.',
      savedToast: '✓ Tetapan disimpan',
      dangerZone: 'Zon Bahaya',
      dangerZoneDesc: 'Padam akaun anda secara kekal',
      deleteAccountBtn: 'Padam Akaun Saya',
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
      title: 'Register Your Store',
      subtitle: 'Quick Step',
      desc: 'Welcome! Enter your store or business name to start using the digital stamp card system.',
      storeNameLabel: 'Store / Business Name',
      storeNamePlaceholder: 'E.g. Coffee & Co / Barber Studio',
      reviewToggleLabel: 'Connect Google Review ⭐',
      reviewToggleDesc: 'Automatically show a 5-star review invitation popup to customers.',
      reviewInputLabel: 'Google Review Link / Place ID',
      reviewInputPlaceholder: 'Paste Google Maps link / "Write Review" link / Place ID',
      reviewInputHint: 'The system will automatically generate a direct 5-star review link.',
      reviewGeneratorHint: 'Google Review Link Generator ↗',
      reviewTestButton: '👁️ Test Review Link',
      reviewInvalidLinkError: 'Invalid Google Review link. Please check your link.',
      stampIconLabel: 'Select Stamp Icon (Store Category)',
      stampIconBadge: 'Icon Choices',
      stampIconDesc: 'This icon will appear on your customer digital stamp cards.',
      hint: 'Reward catalog, stamp quota, and social links can be customized anytime in Settings later.',
      registerBtn: 'Register Store & Open Counter →',
      registering: 'Registering Store...',
    },
    planQuota: {
      proActive: '⚡ Pro Plan – Active',
      freeStarter: '✦ Free Plan (Starter)',
      upgrade: 'Upgrade →',
      quotaTitle: 'Free Customer Capacity',
      quotaFull: 'Customer capacity reached. New customers cannot receive stamps.',
      upgradeToPro: 'Upgrade to Pro',
      quotaWarning: (left) => `Almost full — ${left} customer slots remaining.`,
    },
    stats: {
      customers: 'Customers',
      stampsClaimed: 'Stamps Claimed',
      rewardsRedeemed: 'Rewards Redeemed',
      activeStamps: 'Active Stamps',
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
      directUrlHint: 'Get Direct URL at ImgHippo ↗',
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
      saveBtn: 'Save Settings',
      saving: 'Saving...',
      ownerOnlyNote: 'Only Store Owners can modify store settings.',
      savedToast: '✓ Settings saved',
      dangerZone: 'Danger Zone',
      dangerZoneDesc: 'Permanently delete your account',
      deleteAccountBtn: 'Delete My Account',
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
