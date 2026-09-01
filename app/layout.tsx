import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#E5A43B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://lajus.lajuq.my'),
  title: {
    default: 'LajuS — Sistem Cop Stamp Digital & Loyalty Reward Kedai',
    template: '%s | LajuS — Cop Stamp Digital',
  },
  description:
    'LajuS (lajus.lajuq.my) adalah sistem cop stamp digital & loyalty repeat customer untuk kedai F&B, kafe, salon dan kedai runcit. Gantikan kad cop kertas, naikkan repeat order pelanggan dengan mudah tanpa aplikasi.',
  keywords: [
    'lajus',
    'lajuq',
    'cop stamp',
    'stamp',
    'royalty',
    'loyalty',
    'system repeat',
    'sistem repeat',
    'cop stamp digital',
    'kad cop digital',
    'kad stamp digital',
    'digital stamp card',
    'loyalty stamp malaysia',
    'sistem loyalty kedai',
    'program loyalty pelanggan',
    'kad cop online',
    'reward stamp digital',
    'repeat order system',
  ],
  authors: [{ name: 'LajuS', url: 'https://lajus.lajuq.my' }],
  creator: 'LajuS',
  publisher: 'LajuS',
  applicationName: 'LajuS Cop Stamp',
  category: 'Business & Productivity',
  alternates: {
    canonical: 'https://lajus.lajuq.my',
  },
  openGraph: {
    type: 'website',
    locale: 'ms_MY',
    url: 'https://lajus.lajuq.my',
    siteName: 'LajuS Cop Stamp Digital',
    title: 'LajuS — Sistem Cop Stamp Digital & Loyalty Pelanggan Kedai',
    description:
      'Sistem kad cop stamp digital & loyalty reward untuk bisnes F&B, kafe dan kedai. Tingkatkan repeat customer tanpa kad kertas.',
    images: [
      {
        url: '/mascot.png',
        width: 1200,
        height: 630,
        alt: 'LajuS Cop Stamp Digital Loyalty System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LajuS — Sistem Cop Stamp Digital & Loyalty Pelanggan Kedai',
    description:
      'Gantikan kad cop kertas dengan sistem cop stamp digital moden. Tingkatkan jualan dan pelanggan repeat.',
    images: ['/mascot.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LajuS',
    alternateName: [
      'LajuS Cop Stamp Digital',
      'LajuS Loyalty System',
      'LajuS System Repeat',
    ],
    url: 'https://lajus.lajuq.my',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    description:
      'Sistem kad cop stamp digital dan loyalty reward untuk bisnes F&B, kafe, restoran, dan kedai bagi meningkatkan jualan repeat pelanggan tanpa muat turun aplikasi.',
    keywords:
      'lajus, cop stamp, stamp, loyalty, royalty, system repeat, sistem cop digital, kad stamp digital',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MYR',
      priceValidUntil: '2027-12-31',
    },
    publisher: {
      '@type': 'Organization',
      name: 'LajuS',
      url: 'https://lajus.lajuq.my',
      logo: 'https://lajus.lajuq.my/logo.svg',
    },
  }

  return (
    <html lang="ms">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
