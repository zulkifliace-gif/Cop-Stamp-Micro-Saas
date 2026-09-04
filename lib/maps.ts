/**
 * lib/maps.ts
 * --------------------------------------------------------------------------
 * Google Maps Location Resolver
 *
 * Resolves any Google Maps input (shortlinks like maps.app.goo.gl,
 * place links, CID, coordinates, search queries, or iframe embed code)
 * into exact latitude, longitude, place name, and a clean Google Maps iframe embed URL.
 * --------------------------------------------------------------------------
 */

export interface ResolvedLocation {
  lat?: string
  lng?: string
  coordinates?: string
  placeName?: string
  cid?: string
  embedUrl: string
  originalUrl: string
}

export function extractMapsDataFromText(text: string): {
  lat?: string
  lng?: string
  placeName?: string
  cid?: string
  query?: string
} {
  if (!text) return {}

  let lat: string | undefined
  let lng: string | undefined
  let placeName: string | undefined
  let cid: string | undefined
  let query: string | undefined

  // 1. Google Place CID (Customer Identification)
  const cidMatch = text.match(/[?&]cid=(\d+)/) || text.match(/cid:(\d+)/)
  if (cidMatch) {
    cid = cidMatch[1]
  }

  // 2. Exact pin coordinates: !3d<lat>!4d<lng> or !8m2!3d<lat>!4d<lng> (most accurate in Google Maps)
  const pinMatch =
    text.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ||
    text.match(/!8m2!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ||
    text.match(/!1d(-?\d+\.\d+)!2d(-?\d+\.\d+)/)
  if (pinMatch) {
    lat = pinMatch[1]
    lng = pinMatch[2]
  }

  // 3. Query coordinates: ?q=lat,lng or ?query=lat,lng or ?ll=lat,lng
  if (!lat || !lng) {
    const qCoordMatch =
      text.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
      text.match(/[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
      text.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
      text.match(/[?&]sll=(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (qCoordMatch) {
      lat = qCoordMatch[1]
      lng = qCoordMatch[2]
    }
  }

  // 4. Place name in /place/Place+Name/
  const placeMatch = text.match(/\/place\/([^/@?#]+)/)
  if (placeMatch && placeMatch[1]) {
    try {
      placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
    } catch {
      placeName = placeMatch[1].replace(/\+/g, ' ')
    }
  }

  // 5. Open Graph / meta title
  const ogTitleMatch =
    text.match(/<meta property="og:title" content="([^"]+)"/) ||
    text.match(/<meta content="([^"]+)" property="og:title"/)
  if (ogTitleMatch && ogTitleMatch[1] && !placeName) {
    const title = ogTitleMatch[1].split('·')[0].split('-')[0].trim()
    if (title && !title.toLowerCase().includes('google maps')) {
      placeName = title
    }
  }

  // 6. Search query string ?q=Name or ?query=Name (if not coordinates)
  const qTextMatch = text.match(/[?&]q=([^&]+)/) || text.match(/[?&]query=([^&]+)/)
  if (qTextMatch && qTextMatch[1]) {
    try {
      const decoded = decodeURIComponent(qTextMatch[1].replace(/\+/g, ' '))
      if (!decoded.match(/^-?\d+\.\d+,-?\d+\.\d+$/)) {
        query = decoded
      }
    } catch {}
  }

  // 7. HTML internal state or static map image center
  if (!lat || !lng) {
    const htmlCoord =
      text.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/) ||
      text.match(/center=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
      text.match(/\[null,null,(-?\d{1,2}\.\d{4,8}),(-?\d{1,3}\.\d{4,8})\]/) ||
      text.match(/window\.APP_INITIALIZATION_STATE=\[\[\[(-?\d+\.\d+),(-?\d+\.\d+)\]/)
    if (htmlCoord) {
      lat = htmlCoord[1]
      lng = htmlCoord[2]
    }
  }

  // 8. Camera coordinates @lat,lng as last-resort fallback
  if (!lat || !lng) {
    const cameraMatch = text.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (cameraMatch) {
      lat = cameraMatch[1]
      lng = cameraMatch[2]
    }
  }

  // 9. Raw coordinates input e.g. "3.1415, 101.6869"
  if (!lat || !lng) {
    const rawCoordMatch = text.trim().match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/)
    if (rawCoordMatch) {
      lat = rawCoordMatch[1]
      lng = rawCoordMatch[2]
    }
  }

  return { lat, lng, placeName, cid, query }
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
    const extracted = extractMapsDataFromText(trimmed)
    return {
      lat: extracted.lat,
      lng: extracted.lng,
      coordinates: extracted.lat && extracted.lng ? `${extracted.lat},${extracted.lng}` : undefined,
      placeName: extracted.placeName,
      cid: extracted.cid,
      embedUrl: trimmed,
      originalUrl: trimmed,
    }
  }

  // If iframe tag was pasted e.g. <iframe src="..."
  const iframeSrcMatch = trimmed.match(/src=["'](https:\/\/[^"']+)["']/)
  if (iframeSrcMatch && (iframeSrcMatch[1].includes('maps.google') || iframeSrcMatch[1].includes('google.com/maps'))) {
    const extracted = extractMapsDataFromText(iframeSrcMatch[1])
    return {
      lat: extracted.lat,
      lng: extracted.lng,
      coordinates: extracted.lat && extracted.lng ? `${extracted.lat},${extracted.lng}` : undefined,
      placeName: extracted.placeName,
      cid: extracted.cid,
      embedUrl: iframeSrcMatch[1],
      originalUrl: trimmed,
    }
  }

  let fullText = trimmed
  let extracted = extractMapsDataFromText(trimmed)

  // If shortlink (maps.app.goo.gl, goo.gl/maps, g.co/maps) or missing coordinates:
  if (
    (!extracted.lat || !extracted.lng) &&
    (trimmed.includes('maps.app.goo.gl') ||
      trimmed.includes('goo.gl/maps') ||
      trimmed.includes('g.co/maps') ||
      trimmed.startsWith('http'))
  ) {
    try {
      const res = await fetch(trimmed, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(5000),
      })
      const finalUrl = res.url || ''
      const html = await res.text()
      fullText = `${trimmed} ${finalUrl} ${html}`
      const newExtracted = extractMapsDataFromText(fullText)
      extracted = {
        lat: newExtracted.lat || extracted.lat,
        lng: newExtracted.lng || extracted.lng,
        placeName: newExtracted.placeName || extracted.placeName,
        cid: newExtracted.cid || extracted.cid,
        query: newExtracted.query || extracted.query,
      }
    } catch {
      // Graceful fallback if network fetch fails
    }
  }

  let embedUrl = ''
  let coordinates: string | undefined

  if (extracted.lat && extracted.lng) {
    coordinates = `${extracted.lat},${extracted.lng}`
    embedUrl = `https://maps.google.com/maps?q=${extracted.lat},${extracted.lng}&hl=ms&z=16&output=embed`
  } else if (extracted.cid) {
    embedUrl = `https://maps.google.com/maps?cid=${extracted.cid}&hl=ms&output=embed`
  } else if (extracted.placeName) {
    embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(extracted.placeName)}&hl=ms&z=16&output=embed`
  } else if (extracted.query) {
    embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(extracted.query)}&hl=ms&z=16&output=embed`
  } else {
    const q = encodeURIComponent(fallbackName || trimmed)
    embedUrl = `https://maps.google.com/maps?q=${q}&hl=ms&z=16&output=embed`
  }

  return {
    lat: extracted.lat,
    lng: extracted.lng,
    coordinates,
    placeName: extracted.placeName,
    cid: extracted.cid,
    embedUrl,
    originalUrl: trimmed,
  }
}
