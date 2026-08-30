import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/claim/'],
      },
    ],
    sitemap: 'https://lajus.lajuq.my/sitemap.xml',
  }
}
