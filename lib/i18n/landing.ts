export type Lang = 'my' | 'en'

export interface StepItem {
  step: string
  title: string
  desc: string
  color: string
}

export interface FeatureItem {
  icon: string
  title: string
  desc: string
}

export interface MetricItem {
  val: string
  label: string
  color: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface LandingTranslation {
  nav: {
    demo: string
    howItWorks: string
    features: string
    pricing: string
    faq: string
    customerCard: string
    staffPortal: string
  }
  drawer: {
    tagline: string
    openCounter: string
    links: { href: string; label: string; desc: string; icon: string }[]
  }
  authModal: {
    portalTitle: string
    connecting: string
    googleLogin: string
    secureNote: string
  }
  rotatingWords: string[]
  hero: {
    badge: string
    titlePrefix: string
    description: string
    openStaffCta: string
    howItWorksCta: string
    badges: string[]
  }
  metrics: MetricItem[]
  videoDemo: {
    badge: string
    title: string
    subtitle: string
  }
  howItWorks: {
    badge: string
    title: string
    subtitle: string
    steps: StepItem[]
  }
  features: {
    badge: string
    title: string
    items: FeatureItem[]
  }
  ctaMid: {
    title: string
    subtitle: string
    button: string
  }
  pricing: {
    badge: string
    titlePrefix: string
    titleHighlight: string
    subtitle: string
    monthly: string
    yearly: string
    saveBadge: string
    freeTitle: string
    freePeriod: string
    freeDesc: string
    freeFeatures: [string, string, boolean][]
    freeCta: string
    proTitle: string
    proPeriodMonthly: string
    proPeriodYearly: string
    proYearlyNote: string
    proDesc: string
    proFeatures: string[]
    proCta: string
    proSecurity: string
    bottomNote: string
    contactText: string
  }
  faqs: FaqItem[]
  footer: {
    quickLinksTitle: string
    staffPortalAccess: string
    staffLoginBtn: string
    privacyPolicy: string
    privacyPolicyPdpa: string
    copyrightText: string
  }
}

export const I18N_LANDING: Record<Lang, LandingTranslation> = {
  my: {
    nav: {
      demo: 'Demo',
      howItWorks: 'Cara Kerja',
      features: 'Ciri-Ciri',
      pricing: 'Harga',
      faq: 'FAQ',
      customerCard: 'Kad Pelanggan',
      staffPortal: 'Portal Staff',
    },
    drawer: {
      tagline: 'Sistem Cop Stamp Digital',
      openCounter: 'Buka Kaunter Staff',
      links: [
        { href: '#demo', label: 'Video Demo', desc: 'Tonton demo sistem berfungsi', icon: '🎬' },
        { href: '#cara-kerja', label: 'Cara Kerja', desc: 'Proses mudah 3 langkah', icon: '⚡' },
        { href: '#ciri', label: 'Ciri-Ciri Utama', desc: 'Cop QR, Emel & Kad Digital', icon: '⭐' },
        { href: '#harga', label: 'Pelan Harga', desc: 'Percuma & Pelan Pro', icon: '💳' },
        { href: '#faq', label: 'Soalan Lazim (FAQ)', desc: 'Jawapan untuk soalan lazim', icon: '❓' },
        { href: '/card', label: 'Kad Cop Pelanggan', desc: 'Semak baki cop anda', icon: '🎴' },
      ],
    },
    authModal: {
      portalTitle: 'Akses Portal Staff / Pemilik',
      connecting: 'Menghubungkan...',
      googleLogin: 'Log masuk dengan Google',
      secureNote: 'Akses selamat melalui Supabase Auth • Google OAuth 2.0',
    },
    rotatingWords: ['Kedai Kopi', 'Restoran', 'Bakeri', 'Salon', 'Kedai Runcit'],
    hero: {
      badge: 'LAJUS — SISTEM COP STAMP & LOYALTY REPEAT CUSTOMER',
      titlePrefix: 'Cop Stamp Digital untuk ',
      description:
        'Tingkatkan system repeat order pelanggan dengan LajuS — sistem kad cop stamp & loyalty reward digital paling pantas. Staff jana QR dalam 5 saat, pelanggan kumpul cop stamp terus dari telefon. Tanpa aplikasi, tanpa kad kertas lapuk.',
      openStaffCta: 'Buka Kaunter Staff',
      howItWorksCta: 'Cara Kerja',
      badges: [
        'Tanpa App Dimuat Turun',
        'Token QR 30 Minit',
        'Log Masuk Google',
        'Data Selamat (RLS)',
      ],
    },
    metrics: [
      { val: '5 Saat', label: 'Jana Token QR', color: 'text-[#E5A43B]' },
      { val: '0%', label: 'Keperluan App', color: 'text-[#34D399]' },
      { val: '30 Min', label: '30m Stamp Akan Luput', color: 'text-[#FBBF24]' },
      { val: '100%', label: 'Data Pelanggan Selamat', color: 'text-white' },
    ],
    videoDemo: {
      badge: 'VIDEO DEMO • LIHAT SISTEM BERFUNGSI',
      title: 'Lihat Betapa Pantas & Mudahnya LajuS',
      subtitle:
        'Tonton demonstrasi bagaimana staff menjana kod QR dalam 5 saat dan pelanggan mengumpul cop terus dari telefon pintar.',
    },
    howItWorks: {
      badge: 'Cara Berfungsi',
      title: 'Mudah, Pantas, Tanpa Kertas',
      subtitle: '3 langkah sahaja dari staff jana cop hingga pelanggan terima ganjaran',
      steps: [
        {
          step: '01',
          title: 'Staff Jana Token',
          desc: 'Staff pilih bilangan cop, klik Jana — token QR 8-aksara terus terhasil. Sah 30 minit sahaja.',
          color: 'from-[#E5A43B] to-[#C77B1B]',
        },
        {
          step: '02',
          title: 'Pelanggan Scan QR',
          desc: 'Pelanggan imbas QR atau klik pautan. Log masuk sekali dengan Google — cop masuk automatik.',
          color: 'from-[#1E5E53] to-[#2D786B]',
        },
        {
          step: '03',
          title: 'Cop & Ganjaran',
          desc: 'Kad cop digital dikemas kini serta-merta. Bila genap, pelanggan tebus ganjaran di kaunter.',
          color: 'from-[#B53629] to-[#E5A43B]',
        },
      ],
    },
    features: {
      badge: 'Ciri-Ciri Utama',
      title: 'Semua yang Kedai Anda Perlukan',
      items: [
        { icon: '🔐', title: 'Log Masuk Google', desc: 'Staff dan pelanggan log masuk selamat melalui Google OAuth — tiada kata laluan untuk diingat.' },
        { icon: '⚡', title: 'Token QR Serta-merta', desc: 'Jana kod QR dalam masa 5 saat. Token 1-kali-guna mencegah penipuan sepenuhnya.' },
        { icon: '📱', title: 'Tanpa App', desc: 'Semua berfungsi dalam pelayar web biasa. Pelanggan tidak perlu muat turun apa-apa.' },
        { icon: '🛡️', title: 'Keselamatan RLS', desc: 'Row Level Security Supabase memastikan setiap pelanggan hanya boleh akses data mereka sendiri.' },
        { icon: '📧', title: 'Hantar via Emel', desc: 'Staff boleh hantar token terus ke emel pelanggan sebagai alternatif kepada QR.' },
        { icon: '🎯', title: 'Tetapan Ganjaran', desc: 'Pemilik kedai tetapkan sasaran cop dan penerangan ganjaran mengikut keperluan.' },
      ],
    },
    ctaMid: {
      title: 'Sedia untuk Digitalisasikan\nProgram Loyalty Kedai Anda?',
      subtitle: 'Log masuk sekarang dan mula jana cop stamp pertama anda dalam masa 5 minit.',
      button: 'Buka Kaunter Staff',
    },
    pricing: {
      badge: '💳 Pricing & Plans',
      titlePrefix: 'Pilih Pelan ',
      titleHighlight: 'Terbaik Untuk Kedai Anda',
      subtitle: 'Bermula percuma. Naik taraf bila perniagaan anda semakin berkembang pesat.',
      monthly: 'Bulanan',
      yearly: 'Tahunan',
      saveBadge: 'JIMAT RM20',
      freeTitle: 'Pelan Percuma',
      freePeriod: '/bulan',
      freeDesc: 'Sesuai untuk memulakan sistem kad cop digital.',
      freeFeatures: [
        ['✓', 'Terhad sehingga 20 pelanggan baharu', true],
        ['✓', 'Akses penuh ke semua ciri asas', true],
        ['–', 'Hantar kad cop melalui emel (eksklusif Pro)', false],
      ],
      freeCta: 'Mula Percuma Sekarang →',
      proTitle: 'Pelan Pro',
      proPeriodMonthly: '/bulan',
      proPeriodYearly: '/tahun',
      proYearlyNote: '≈ RM51.33/bln • Jimat RM20 berbanding bayaran bulanan',
      proDesc: 'Untuk perniagaan yang berkembang tanpa sebarang had.',
      proFeatures: [
        'Pelanggan tanpa had',
        'Hantar kad cop melalui emel tanpa had',
        'Akses penuh ke semua ciri premium',
      ],
      proCta: 'Langgan Pelan Pro Sekarang',
      proSecurity: 'Bayaran selamat melalui Stripe • Batal bila-bila masa',
      bottomNote: 'Semua pelan merangkumi portal staff kaunter, sistem token QR, dan kad cop digital pelanggan.',
      contactText: 'Sebarang pertanyaan? Hubungi kami di',
    },
    faqs: [
      {
        q: 'Adakah pelanggan perlu muat turun aplikasi?',
        a: 'Tidak perlu langsung! Pelanggan hanya perlu imbas QR kod atau klik pautan yang diberikan staff. Kad cop digital akan terbuka terus dalam pelayar web.',
      },
      {
        q: 'Berapa kos untuk menggunakan LajuS?',
        a: 'LajuS menawarkan Pelan Percuma (sehingga 20 pelanggan) untuk bermula tanpa sebarang kos. Pelan Pro pula berharga RM53/bulan atau RM616/tahun (jimat RM20) untuk pelanggan tanpa had, cetak resit Bluetooth, analitik lanjut, dan sokongan keutamaan.',
      },
      {
        q: 'Bolehkah lebih dari satu staff gunakan sistem ini?',
        a: 'Ya! Anda boleh tambah seberapa ramai staff mengikut keperluan kedai. Setiap staff log masuk dengan akaun Google mereka sendiri.',
      },
      {
        q: 'Apakah jenis ganjaran yang boleh ditawarkan?',
        a: 'Apa sahaja! Minuman percuma, diskaun, item percuma, atau apa-apa ganjaran yang anda tetapkan sendiri dalam panel tetapan kedai.',
      },
      {
        q: 'Adakah data pelanggan selamat?',
        a: 'Ya. Semua data disimpan dalam Supabase (PostgreSQL) dengan perlindungan Row Level Security (RLS). Setiap pelanggan hanya boleh melihat data mereka sendiri.',
      },
    ],
    footer: {
      quickLinksTitle: 'Pautan Pantas',
      staffPortalAccess: 'Akses Kaunter',
      staffLoginBtn: 'Log Masuk Staff',
      privacyPolicy: 'Dasar Privasi',
      privacyPolicyPdpa: 'Dasar Privasi (PDPA)',
      copyrightText: 'Hak cipta terpelihara. Dicetuskan & dibangunkan oleh',
    },
  },
  en: {
    nav: {
      demo: 'Demo',
      howItWorks: 'How It Works',
      features: 'Features',
      pricing: 'Pricing',
      faq: 'FAQ',
      customerCard: 'Customer Card',
      staffPortal: 'Staff Portal',
    },
    drawer: {
      tagline: 'Digital Stamp Card System',
      openCounter: 'Open Staff Counter',
      links: [
        { href: '#demo', label: 'Video Demo', desc: 'Watch system demo in action', icon: '🎬' },
        { href: '#cara-kerja', label: 'How It Works', desc: 'Simple 3-step process', icon: '⚡' },
        { href: '#ciri', label: 'Key Features', desc: 'QR Stamps, Email & Digital Cards', icon: '⭐' },
        { href: '#harga', label: 'Pricing Plans', desc: 'Free & Pro Plans', icon: '💳' },
        { href: '#faq', label: 'FAQ', desc: 'Answers to common questions', icon: '❓' },
        { href: '/card', label: 'Customer Stamp Card', desc: 'Check your stamp balance', icon: '🎴' },
      ],
    },
    authModal: {
      portalTitle: 'Staff / Owner Portal Access',
      connecting: 'Connecting...',
      googleLogin: 'Sign in with Google',
      secureNote: 'Secure access via Supabase Auth • Google OAuth 2.0',
    },
    rotatingWords: ['Coffee Shops', 'Restaurants', 'Bakeries', 'Salons', 'Retail Stores'],
    hero: {
      badge: 'LAJUS — DIGITAL STAMP CARD & CUSTOMER LOYALTY SYSTEM',
      titlePrefix: 'Digital Stamp Card for ',
      description:
        'Boost customer repeat orders with LajuS — the fastest digital loyalty stamp & reward platform. Staff generate QR in 5 seconds, customers collect stamps directly on their phone. No app downloads, no lost paper cards.',
      openStaffCta: 'Open Staff Counter',
      howItWorksCta: 'How It Works',
      badges: [
        'Zero App Downloads',
        '30-Min Safe QR Token',
        'Google Single Sign-On',
        'Secure Data (RLS)',
      ],
    },
    metrics: [
      { val: '5 Secs', label: 'Generate QR Token', color: 'text-[#E5A43B]' },
      { val: '0%', label: 'App Needed', color: 'text-[#34D399]' },
      { val: '30 Min', label: '30m Stamp Expiry Window', color: 'text-[#FBBF24]' },
      { val: '100%', label: 'Secure Customer Data', color: 'text-white' },
    ],
    videoDemo: {
      badge: 'VIDEO DEMO • SEE IT IN ACTION',
      title: 'See How Fast & Simple LajuS Works',
      subtitle:
        'Watch a quick walkthrough of how staff issue QR stamps in 5 seconds and customers collect rewards straight on their mobile phones.',
    },
    howItWorks: {
      badge: 'How It Works',
      title: 'Simple, Fast, Paperless',
      subtitle: 'Just 3 steps from staff issuing stamps to customer claiming rewards',
      steps: [
        {
          step: '01',
          title: 'Staff Generates Token',
          desc: 'Staff selects stamp count, clicks Generate — an 8-character QR token is created instantly. Valid for 30 minutes.',
          color: 'from-[#E5A43B] to-[#C77B1B]',
        },
        {
          step: '02',
          title: 'Customer Scans QR',
          desc: 'Customer scans QR or taps link. Quick one-tap Google login — stamps are credited automatically.',
          color: 'from-[#1E5E53] to-[#2D786B]',
        },
        {
          step: '03',
          title: 'Collect & Redeem',
          desc: 'Digital stamp card updates in real-time. Once complete, customer redeems reward at counter.',
          color: 'from-[#B53629] to-[#E5A43B]',
        },
      ],
    },
    features: {
      badge: 'Key Features',
      title: 'Everything Your Business Needs',
      items: [
        { icon: '🔐', title: 'Google Single Sign-On', desc: 'Staff and customers log in securely via Google OAuth — zero passwords to remember.' },
        { icon: '⚡', title: 'Instant QR Tokens', desc: 'Generate QR codes in 5 seconds. Single-use tokens prevent duplicate fraud completely.' },
        { icon: '📱', title: 'Zero App Downloads', desc: 'Runs entirely in any mobile browser. No app store download required.' },
        { icon: '🛡️', title: 'RLS Security', desc: 'Supabase Row Level Security ensures each customer only accesses their own loyalty data.' },
        { icon: '📧', title: 'Send via Email', desc: 'Staff can dispatch stamp tokens directly to customer email as a QR alternative.' },
        { icon: '🎯', title: 'Custom Reward Settings', desc: 'Store owners easily configure stamp targets and reward descriptions.' },
      ],
    },
    ctaMid: {
      title: 'Ready to Digitalize\nYour Store Loyalty Program?',
      subtitle: 'Log in now and start issuing your first stamp tokens in under 5 minutes.',
      button: 'Open Staff Counter',
    },
    pricing: {
      badge: '💳 Pricing & Plans',
      titlePrefix: 'Choose The Best Plan ',
      titleHighlight: 'For Your Business',
      subtitle: 'Start free. Upgrade as your business grows and scales.',
      monthly: 'Monthly',
      yearly: 'Yearly',
      saveBadge: 'SAVE RM20',
      freeTitle: 'Free Plan',
      freePeriod: '/month',
      freeDesc: 'Perfect for starting your digital stamp card system.',
      freeFeatures: [
        ['✓', 'Up to 20 new customer capacity', true],
        ['✓', 'Full access to all essential features', true],
        ['–', 'Email token dispatch (Pro exclusive)', false],
      ],
      freeCta: 'Start Free Now →',
      proTitle: 'Pro Plan',
      proPeriodMonthly: '/month',
      proPeriodYearly: '/year',
      proYearlyNote: '≈ RM51.33/mo • Save RM20 compared to monthly billing',
      proDesc: 'For growing businesses requiring unlimited power and features.',
      proFeatures: [
        'Unlimited customer capacity',
        'Unlimited email stamp dispatch',
        'Full access to all premium features',
      ],
      proCta: 'Subscribe to Pro Now',
      proSecurity: 'Secure payments via Stripe • Cancel anytime',
      bottomNote: 'All plans include counter staff portal, QR token system, and customer digital cards.',
      contactText: 'Have questions? Contact us at',
    },
    faqs: [
      {
        q: 'Do customers need to download an app?',
        a: 'Not at all! Customers simply scan the QR code or tap the link provided by staff. The digital stamp card opens directly in any web browser.',
      },
      {
        q: 'How much does LajuS cost?',
        a: 'LajuS offers a Free Plan (up to 20 customers) to get started with zero cost. The Pro Plan is RM53/month or RM616/year (save RM20) for unlimited customers, Bluetooth receipt printing, advanced analytics, and priority support.',
      },
      {
        q: 'Can multiple staff members use the system?',
        a: 'Yes! You can add as many staff members as your store needs. Each staff logs in securely with their own Google account.',
      },
      {
        q: 'What kind of rewards can I offer?',
        a: 'Anything you want! Free drinks, discounts, complimentary items, or custom rewards configured in your store settings.',
      },
      {
        q: 'Is customer data safe?',
        a: 'Yes. All data is securely stored in Supabase (PostgreSQL) with Row Level Security (RLS). Each customer can only view their own loyalty records.',
      },
    ],
    footer: {
      quickLinksTitle: 'Quick Links',
      staffPortalAccess: 'Counter Access',
      staffLoginBtn: 'Staff Login',
      privacyPolicy: 'Privacy Policy',
      privacyPolicyPdpa: 'Privacy Policy (PDPA)',
      copyrightText: 'All rights reserved. Designed & built by',
    },
  },
}
