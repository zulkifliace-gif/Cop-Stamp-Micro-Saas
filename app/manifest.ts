import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/dashboard',
    name: 'LajuS Dashboard',
    short_name: 'LajuS',
    description: 'Sistem Cop Stamp Digital & Kaunter Juruwang Kedai',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    background_color: '#0A1716',
    theme_color: '#E5A43B',
    orientation: 'portrait-primary',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/dashboard-mobile.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'LajuS Cashier Dashboard Mobile View',
      },
      {
        src: '/screenshots/dashboard-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'LajuS Cashier Dashboard Desktop & Tablet View',
      },
    ],
  }
}
