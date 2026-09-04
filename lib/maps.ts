/**
 * lib/maps.ts
 * --------------------------------------------------------------------------
 * Google Maps Location Resolver
 *
 * Resolves any Google Maps input (shortlinks like maps.app.goo.gl,
 * place links, or coordinates) into exact latitude, longitude, and
 * a clean Google Maps iframe embed URL.
 * --------------------------------------------------------------------------
 */

export interface ResolvedLocation {
  lat?: string
  lng?: string
  coordinates?: string
  placeName?: string
  embedUrl: string
  originalUrl: string
}

export async function resolveGoogleMapsLocation(
  inputUrl: string,
  fallbackName?: string
): Promise<ResolvedLocation> {
  const trimmed = (inputUrl || '').trim()
  if (!trimmed) {
    const q = encodeURIComponent(fallbackName || 'Malaysia')
    return {
      embedUrl: `https://maps.google.com/maps?q=${q}&hl=ms&z=16&output=embed`,
      originalUrl: '',
    }
  }

  // If already an embed URL
  if (trimmed.includes('output=embed') || trimmed.includes('/maps/embed')) {
    return {
      embedUrl: trimmed,
      originalUrl: trimmed,
    }
  }

  let targetUrl = trimmed
  let lat: string | undefined
  let lng: string | undefined
  let placeName: string | undefined

  // 1. Direct coordinate match in raw input
  const directCoord =
    targetUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    targetUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (directCoord) {
    lat = directCoord[1]
    lng = directCoord[2]
  }

  // 2. Direct place name in raw input
  const directPlace = targetUrl.match(/\/place\/([^/@?]+)/)
  if (directPlace && directPlace[1]) {
    placeName = decodeURIComponent(directPlace[1].replace(/\+/g, ' '))
  }

  // 3. If shortlink (maps.app.goo.gl or goo.gl/maps) or missing coordinates:
  if (
    (!lat || !lng) &&
    (targetUrl.includes('maps.app.goo.gl') ||
      targetUrl.includes('goo.gl/maps') ||
      targetUrl.includes('/place/'))
  ) {
    try {
      const res = await fetch(targetUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(4500),
      })
      const finalUrl = res.url || ''
      const html = await res.text()

      // Check coordinates in final redirect URL
      const finalCoord =
        finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
        finalUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
      if (finalCoord) {
        lat = finalCoord[1]
        lng = finalCoord[2]
      }

      // Check place name in final URL
      const pMatch = finalUrl.match(/\/place\/([^/@?]+)/)
      if (pMatch && pMatch[1]) {
        placeName = decodeURIComponent(pMatch[1].replace(/\+/g, ' '))
      }

      // Extract coordinates from Google Maps internal state in HTML
      if (!lat || !lng) {
        const m =
          html.match(/\[null,null,(-?\d{1,2}\.\d{4,8}),(-?\d{1,3}\.\d{4,8})\]/) ||
          html.match(/window\.APP_INITIALIZATION_STATE=\[\[\[(-?\d+\.\d+),(-?\d+\.\d+)\]/) ||
          html.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/)
        if (m) {
          lat = m[1]
          lng = m[2]
        }
      }
    } catch {
      // Graceful fallback
    }
  }

  let embedUrl = ''
  let coordinates: string | undefined
  if (lat && lng) {
    coordinates = `${lat},${lng}`
    embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=ms&z=16&output=embed`
  } else if (placeName) {
    embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&hl=ms&z=16&output=embed`
  } else {
    const q = encodeURIComponent(fallbackName || trimmed)
    embedUrl = `https://maps.google.com/maps?q=${q}&hl=ms&z=16&output=embed`
  }

  return {
    lat,
    lng,
    coordinates,
    placeName,
    embedUrl,
    originalUrl: trimmed,
  }
}
