import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/card',
    name: 'LajuS — Kad Cop Digital',
    short_name: 'Kad Cop',
    description: 'Kad Cop Stamp Digital & Loyalty Pelanggan Kedai',
    start_url: '/card',
    scope: '/',
    display: 'standalone',
    background_color: '#1B0F09',
    theme_color: '#FF5A45',
    orientation: 'portrait-primary',
    categories: ['lifestyle', 'shopping', 'utilities'],
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
  }
}
