export type Lang = 'my' | 'en'

export interface CardTranslation {
  topbar: {
    refreshTooltip: string
    logoutTooltip: string
  }
  login: {
    digitalStampCard: string
    checkStampsSubtitle: string
    loginWithGoogle: string
    orDivider: string
    emailPlaceholder: string
    passwordPlaceholder: string
    processing: string
    signupBtn: string
    loginBtn: string
    alreadyHaveAccount: string
    newAccount: string
    loginLink: string
    signupLink: string
    fillFieldsError: string
    authFailed: string
  }
  card: {
    stampsUnit: string
    verifiedStoreTitle: string
    howToRedeemBtn: string
    rewardsBtn: string
    cardTab: (num: number) => string
    fullBadge: string
    cardHeader: (num: number, isReady: boolean) => string
    readyToRedeem: string
    completeRedeem: (reward: string) => string
    needMoreStamps: (count: number, reward: string) => string
    congratsFull: string
    lastUpdated: (time: string) => string
    scanHint: string
  }
  infoModal: {
    title: string
    step1: string
    step2: string
    step3: (email: string) => string
    step4: string
    gotItBtn: string
  }
  rewardsModal: {
    title: string
    stampsRequiredBadge: (count: number) => string
    closeBtn: string
  }
  deleteModal: {
    title: string
    warning1: string
    warning2: string
    typeToConfirm: string
    cancel: string
    deleting: string
    confirmDelete: string
    failedDelete: string
    connError: string
  }
  footer: {
    privacyPolicy: string
    deleteAccount: string
  }
}

export const I18N_CARD: Record<Lang, CardTranslation> = {
  my: {
    topbar: {
      refreshTooltip: 'Muat semula',
      logoutTooltip: 'Log keluar',
    },
    login: {
      digitalStampCard: 'Kad Cop Digital',
      checkStampsSubtitle: 'Semak baki cop & ganjaran anda',
      loginWithGoogle: 'Log masuk dengan Google',
      orDivider: 'ATAU',
      emailPlaceholder: 'Emel / Username',
      passwordPlaceholder: 'Kata laluan',
      processing: 'Memproses...',
      signupBtn: 'Daftar',
      loginBtn: 'Log Masuk',
      alreadyHaveAccount: 'Sudah ada akaun? ',
      newAccount: 'Akaun baru? ',
      loginLink: 'Log masuk',
      signupLink: 'Daftar',
      fillFieldsError: 'Sila isi emel dan kata laluan.',
      authFailed: 'Gagal log masuk.',
    },
    card: {
      stampsUnit: 'Cop',
      verifiedStoreTitle: 'Kedai Disahkan (Profil Lengkap)',
      howToRedeemBtn: 'Cara Tebus (i)',
      rewardsBtn: 'Hadiah',
      cardTab: (num) => `Kad #${num}`,
      fullBadge: 'Penuh ✓',
      cardHeader: (num, isReady) => `Kad #${num}${isReady ? ' • Sedia Ditebus' : ''}`,
      readyToRedeem: '• Sedia Ditebus',
      completeRedeem: (reward) => `🎉 Lengkap! Tebus: ${reward}`,
      needMoreStamps: (count, reward) => `Lagi ${count} cop untuk: ${reward}`,
      congratsFull: 'Tahniah! Kad cop telah genap.',
      lastUpdated: (time) => `Kemaskini: ${time}`,
      scanHint: 'Imbas QR di kaunter untuk menambah cop',
    },
    infoModal: {
      title: '💡 Cara Penebusan',
      step1: 'Kumpul cop sehingga kad cop anda penuh.',
      step2: 'Maklumkan staff kaunter ingin menebus ganjaran.',
      step3: (email) => `Sebut emel akaun (${email || 'emel anda'}).`,
      step4: 'Staff sahkan & serahkan ganjaran serta-merta!',
      gotItBtn: 'Faham',
    },
    rewardsModal: {
      title: '🎁 Hadiah & Ganjaran',
      stampsRequiredBadge: (count) => `⚡ ${count} Cop Diperlukan`,
      closeBtn: 'Tutup',
    },
    deleteModal: {
      title: 'Padam Akaun',
      warning1: 'Tindakan ini kekal dan tidak boleh dibatalkan.',
      warning2: 'Semua data kad cop dan ganjaran anda akan dipadam secara kekal dari sistem.',
      typeToConfirm: 'Sila taip PADAM untuk mengesahkan:',
      cancel: 'Batal',
      deleting: 'Memadam...',
      confirmDelete: 'Sahkan Padam',
      failedDelete: 'Gagal memadam akaun.',
      connError: 'Ralat sambungan. Sila cuba lagi.',
    },
    footer: {
      privacyPolicy: 'Dasar Privasi',
      deleteAccount: 'Padam Akaun',
    },
  },
  en: {
    topbar: {
      refreshTooltip: 'Refresh',
      logoutTooltip: 'Log out',
    },
    login: {
      digitalStampCard: 'Digital Stamp Card',
      checkStampsSubtitle: 'Check your stamp balance & rewards',
      loginWithGoogle: 'Sign in with Google',
      orDivider: 'OR',
      emailPlaceholder: 'Email / Username',
      passwordPlaceholder: 'Password',
      processing: 'Processing...',
      signupBtn: 'Sign Up',
      loginBtn: 'Log In',
      alreadyHaveAccount: 'Already have an account? ',
      newAccount: 'New account? ',
      loginLink: 'Log in',
      signupLink: 'Sign up',
      fillFieldsError: 'Please enter your email and password.',
      authFailed: 'Failed to sign in.',
    },
    card: {
      stampsUnit: 'Stamps',
      verifiedStoreTitle: 'Verified Store (Complete Profile)',
      howToRedeemBtn: 'How to Redeem (i)',
      rewardsBtn: 'Rewards',
      cardTab: (num) => `Card #${num}`,
      fullBadge: 'Full ✓',
      cardHeader: (num, isReady) => `Card #${num}${isReady ? ' • Ready to Redeem' : ''}`,
      readyToRedeem: '• Ready to Redeem',
      completeRedeem: (reward) => `🎉 Complete! Redeem: ${reward}`,
      needMoreStamps: (count, reward) => `${count} more stamp${count > 1 ? 's' : ''} for: ${reward}`,
      congratsFull: 'Congratulations! Your stamp card is complete.',
      lastUpdated: (time) => `Updated: ${time}`,
      scanHint: 'Scan QR at counter to collect stamps',
    },
    infoModal: {
      title: '💡 How to Redeem',
      step1: 'Collect stamps until your card is full.',
      step2: 'Inform the cashier you would like to redeem a reward.',
      step3: (email) => `State your registered email (${email || 'your email'}).`,
      step4: 'Staff verifies & hands over your reward immediately!',
      gotItBtn: 'Got it',
    },
    rewardsModal: {
      title: '🎁 Rewards & Gifts',
      stampsRequiredBadge: (count) => `⚡ ${count} Stamps Required`,
      closeBtn: 'Close',
    },
    deleteModal: {
      title: 'Delete Account',
      warning1: 'This action is permanent and cannot be undone.',
      warning2: 'All your stamp cards and rewards data will be permanently deleted from the system.',
      typeToConfirm: 'Please type PADAM to confirm:',
      cancel: 'Cancel',
      deleting: 'Deleting...',
      confirmDelete: 'Confirm Delete',
      failedDelete: 'Failed to delete account.',
      connError: 'Connection error. Please try again.',
    },
    footer: {
      privacyPolicy: 'Privacy Policy',
      deleteAccount: 'Delete Account',
    },
  },
}
