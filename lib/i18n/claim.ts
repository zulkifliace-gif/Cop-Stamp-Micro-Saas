export type Lang = 'my' | 'en'

export interface ClaimTranslation {
  server: {
    notFound: string
    notFoundTitle: string
    alreadyClaimed: string
    alreadyClaimedTitle: string
    expired: string
    expiredTitle: string
    viewMyCard: string
    useAtYourStore: string
    privacyPolicy: string
  }
  client: {
    authChecking: string
    errorScene: {
      unsuccessfulTitle: string
      defaultError: string
      customerLimitReached: string
      connError: string
      viewMyCard: string
      useAtYourStore: string
    }
    loginScene: {
      claimHeaderPrefix: string
      claimHeaderSuffix: string
      loginWithGoogle: string
      orManualEmail: string
      usernameOrEmail: string
      password: string
      processing: string
      signupBtn: string
      loginBtn: string
      alreadyHaveAccount: string
      newAccount: string
      loginLink: string
      signupLink: string
      fillEmailPassword: string
      authFailed: string
    }
    loadingScene: {
      processingStamp: string
    }
    revealScene: {
      digitalStampBadge: (total: number) => string
      howToRedeem: string
      rewardsBtn: string
      rewardsReadyBannerTitle: (count: number) => string
      rewardsReadyBannerDesc: (reward: string) => string
      cardTab: (num: number) => string
      fullBadge: string
      cardHeader: (num: number, isFull: boolean) => string
      cardCompleteReward: (reward: string) => string
      cardRemainingReward: (remain: number, reward: string) => string
      cardCongrats: (reward: string) => string
      viewAllCards: string
      vibrationAnim: string
      useAtYourStore: string
    }
    infoModal: {
      title: string
      step1Title: string
      step1Desc: string
      step2Title: string
      step2Desc: string
      step3Title: string
      step3Desc: string
      step4Title: string
      step4Desc: string
      gotItBtn: string
    }
    rewardsModal: {
      title: string
      stampsRequiredBadge: (count: number) => string
      closeBtn: string
    }
    reviewNavbarBtn: string
    reviewModal: {
      title: string
      message: string
      primaryBtn: string
      secondaryBtn: string
    }
    stampDetailModal: {
      title: (slot: number, card: number) => string
      earnedBadge: string
      notEarnedBadge: string
      dateLabel: string
      timeLabel: string
      notEarnedHint: string
      closeBtn: string
    }
  }
}

export const I18N_CLAIM: Record<Lang, ClaimTranslation> = {
  my: {
    server: {
      notFound: 'Pautan cop ini tidak sah atau tidak wujud.',
      notFoundTitle: 'Pautan Tidak Sah',
      alreadyClaimed: 'Cop ini sudah diambil sebelum ini.',
      alreadyClaimedTitle: 'Cop Sudah Ditebus',
      expired: 'Pautan ini telah luput tempoh (sah selama 30 minit sahaja).',
      expiredTitle: 'Pautan Telah Luput',
      viewMyCard: 'Lihat Kad Cop Saya',
      useAtYourStore: 'Guna sistem cop di kedai anda',
      privacyPolicy: 'Dasar Privasi',
    },
    client: {
      authChecking: 'Memeriksa sesi pengguna...',
      errorScene: {
        unsuccessfulTitle: 'Penebusan Tidak Berjaya',
        defaultError: 'Token ini tidak sah atau telah tamat tempoh.',
        customerLimitReached:
          'Kedai ini telah mencapai had maksimum pelanggan bagi Pelan Percuma. Sila maklumkan kepada pihak kedai untuk menaik taraf pelan mereka.',
        connError: 'Ralat sambungan. Sila cuba lagi.',
        viewMyCard: 'Lihat Kad Cop Saya',
        useAtYourStore: 'Guna sistem cop di kedai anda',
      },
      loginScene: {
        claimHeaderPrefix: 'Tuntut',
        claimHeaderSuffix: 'dari',
        loginWithGoogle: 'Log masuk dengan Google',
        orManualEmail: 'atau emel manual',
        usernameOrEmail: 'Username atau Emel',
        password: 'Kata laluan',
        processing: 'Memproses...',
        signupBtn: 'Daftar Akaun',
        loginBtn: 'Log Masuk',
        alreadyHaveAccount: 'Sudah ada akaun? ',
        newAccount: 'Akaun baru? ',
        loginLink: 'Log masuk',
        signupLink: 'Daftar sini',
        fillEmailPassword: 'Sila isi emel/username dan kata laluan.',
        authFailed: 'Gagal log masuk.',
      },
      loadingScene: {
        processingStamp: 'Memproses Cop',
      },
      revealScene: {
        digitalStampBadge: (total) => `KAD COP DIGITAL • TOTAL ${total} COP`,
        howToRedeem: 'Cara Tebus (i)',
        rewardsBtn: 'Hadiah',
        rewardsReadyBannerTitle: (count) => `${count} Ganjaran Sedia Ditebus!`,
        rewardsReadyBannerDesc: (reward) => `Sebut emel anda di kaunter untuk menebus: ${reward}`,
        cardTab: (num) => `Kad #${num}`,
        fullBadge: 'Penuh ✓',
        cardHeader: (num, isFull) => `Kad #${num}${isFull ? ' • Penuh (Sedia Ditebus)' : ''}`,
        cardCompleteReward: (reward) => `🎉 Kad ini telah lengkap! Sedia ditebus: ${reward}.`,
        cardRemainingReward: (remain, reward) =>
          `Cuma ${remain} cop lagi untuk kad ini bagi mendapat ${reward}!`,
        cardCongrats: (reward) =>
          `Tahniah! Cop kad ini genap — tebus ganjaran di kaunter: ${reward}.`,
        viewAllCards: 'Lihat Semua Kad Cop ↗',
        vibrationAnim: '▶ animasi getaran',
        useAtYourStore: 'Guna sistem cop di kedai anda',
      },
      infoModal: {
        title: '💡 Cara Penebusan Ganjaran',
        step1Title: 'Kumpul Cop:',
        step1Desc: 'Dapatkan cop setiap kali berbelanja sehingga kad cop anda penuh.',
        step2Title: 'Pergi ke Kaunter:',
        step2Desc: 'Maklumkan kepada staff bahawa anda ingin menebus ganjaran anda.',
        step3Title: 'Sebut Emel Anda:',
        step3Desc: 'Berikan emel berdaftar anda kepada staff untuk semakan baki cop di sistem.',
        step4Title: 'Sahkan Penebusan:',
        step4Desc: 'Staff akan menolak cop dan menyerahkan ganjaran anda serta-merta!',
        gotItBtn: 'Faham',
      },
      rewardsModal: {
        title: '🎁 Hadiah & Ganjaran',
        stampsRequiredBadge: (count) => `⚡ ${count} Cop Diperlukan`,
        closeBtn: 'Tutup',
      },
      reviewNavbarBtn: '⭐ Review Kami',
      reviewModal: {
        title: 'Suka servis kami?',
        message: 'Bantu kami dengan ulasan 5-bintang di Google!',
        primaryBtn: '⭐ Tulis Ulasan Google',
        secondaryBtn: 'Nanti Dulu',
      },
      stampDetailModal: {
        title: (slot, card) => `Cop #${slot} (Kad #${card})`,
        earnedBadge: 'Cop Berjaya Diperoleh',
        notEarnedBadge: 'Belum Diperoleh',
        dateLabel: 'Tarikh',
        timeLabel: 'Masa',
        notEarnedHint: 'Imbas QR di kaunter untuk menambah cop ini.',
        closeBtn: 'Faham',
      },
    },
  },
  en: {
    server: {
      notFound: 'This stamp link is invalid or does not exist.',
      notFoundTitle: 'Invalid Link',
      alreadyClaimed: 'This stamp has already been claimed previously.',
      alreadyClaimedTitle: 'Stamp Already Claimed',
      expired: 'This link has expired (valid for 30 minutes only).',
      expiredTitle: 'Link Expired',
      viewMyCard: 'View My Stamp Card',
      useAtYourStore: 'Use digital stamp system for your store',
      privacyPolicy: 'Privacy Policy',
    },
    client: {
      authChecking: 'Checking user session...',
      errorScene: {
        unsuccessfulTitle: 'Claim Unsuccessful',
        defaultError: 'This token is invalid or has expired.',
        customerLimitReached:
          'This store has reached the maximum customer limit for the Free Plan. Please inform the store owner to upgrade their plan.',
        connError: 'Connection error. Please try again.',
        viewMyCard: 'View My Stamp Card',
        useAtYourStore: 'Use digital stamp system for your store',
      },
      loginScene: {
        claimHeaderPrefix: 'Claim',
        claimHeaderSuffix: 'from',
        loginWithGoogle: 'Sign in with Google',
        orManualEmail: 'or manual email',
        usernameOrEmail: 'Username or Email',
        password: 'Password',
        processing: 'Processing...',
        signupBtn: 'Sign Up',
        loginBtn: 'Log In',
        alreadyHaveAccount: 'Already have an account? ',
        newAccount: 'New account? ',
        loginLink: 'Log in',
        signupLink: 'Sign up here',
        fillEmailPassword: 'Please enter your email/username and password.',
        authFailed: 'Failed to sign in.',
      },
      loadingScene: {
        processingStamp: 'Processing Stamp',
      },
      revealScene: {
        digitalStampBadge: (total) => `DIGITAL STAMP CARD • TOTAL ${total} STAMPS`,
        howToRedeem: 'How to Redeem (i)',
        rewardsBtn: 'Rewards',
        rewardsReadyBannerTitle: (count) => `${count} Reward${count > 1 ? 's' : ''} Ready to Redeem!`,
        rewardsReadyBannerDesc: (reward) => `State your email at the counter to redeem: ${reward}`,
        cardTab: (num) => `Card #${num}`,
        fullBadge: 'Full ✓',
        cardHeader: (num, isFull) => `Card #${num}${isFull ? ' • Full (Ready to Redeem)' : ''}`,
        cardCompleteReward: (reward) => `🎉 This card is complete! Ready to redeem: ${reward}.`,
        cardRemainingReward: (remain, reward) =>
          `Only ${remain} more stamp${remain > 1 ? 's' : ''} on this card to get ${reward}!`,
        cardCongrats: (reward) =>
          `Congratulations! This card is full — redeem your reward at the counter: ${reward}.`,
        viewAllCards: 'View All Stamp Cards ↗',
        vibrationAnim: '▶ vibration anim',
        useAtYourStore: 'Use digital stamp system for your store',
      },
      infoModal: {
        title: '💡 How to Redeem Rewards',
        step1Title: 'Collect Stamps:',
        step1Desc: 'Get stamps each time you spend until your stamp card is full.',
        step2Title: 'Visit Counter:',
        step2Desc: 'Inform the staff that you would like to redeem your reward.',
        step3Title: 'State Your Email:',
        step3Desc: 'Provide your registered email to the staff to check stamp balance.',
        step4Title: 'Confirm Redemption:',
        step4Desc: 'Staff will deduct stamps and hand over your reward immediately!',
        gotItBtn: 'Got it',
      },
      rewardsModal: {
        title: '🎁 Rewards & Gifts',
        stampsRequiredBadge: (count) => `⚡ ${count} Stamps Required`,
        closeBtn: 'Close',
      },
      reviewNavbarBtn: '⭐ Review Us',
      reviewModal: {
        title: 'Enjoyed our service?',
        message: 'Help us with a 5-star review on Google!',
        primaryBtn: '⭐ Write Google Review',
        secondaryBtn: 'Maybe Later',
      },
      stampDetailModal: {
        title: (slot, card) => `Stamp #${slot} (Card #${card})`,
        earnedBadge: 'Stamp Earned',
        notEarnedBadge: 'Not Yet Earned',
        dateLabel: 'Date',
        timeLabel: 'Time',
        notEarnedHint: 'Scan the QR code at the checkout counter to collect this stamp.',
        closeBtn: 'Got it',
      },
    },
  },
}
