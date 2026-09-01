import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LajuS Dashboard',
    short_name: 'LajuS',
    description: 'Sistem Cop Stamp Digital & Kaunter Juruwang Kedai',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0A1716',
    theme_color: '#E5A43B',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/mascot.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/mascot.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
