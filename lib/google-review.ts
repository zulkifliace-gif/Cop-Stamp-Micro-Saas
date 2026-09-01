/**
 * lib/google-review.ts
 * ---------------------------------------------------------
 * normalizeGoogleReviewUrl — bersihkan input pemilik kedai
 * (Place ID mentah, link "Tulis Ulasan" rasmi dari Google
 * Business Profile, g.page shortlink, atau link Maps biasa)
 * jadi SATU format standard: direct review URL + place_id.
 *
 * Peringkat carian (murah → mahal, elak panggilan luar bila boleh):
 *   1. Regex terus — cukup untuk kebanyakan kes sebab pemilik
 *      biasanya copy link "Ask for reviews" terus dari GBP mereka
 *      (format ni sudah direct, tak perlu proses tambahan).
 *   2. Fallback Google Places API Text Search (jika env
 *      GOOGLE_PLACES_API_KEY diset) — untuk kes link Maps biasa /
 *      short link yang tiada Place ID terus dalam URL.
 *
 * Kalau GOOGLE_PLACES_API_KEY tak diset, fungsi ni still jalan
 * penuh untuk Kes A/B/C di bawah — cuma Kes D (Maps link biasa/
 * short link) akan pulangkan null dan minta pemilik guna link
 * "Ask for reviews" rasmi sebaliknya.
 * ---------------------------------------------------------
 */

export interface NormalizedReviewLink {
  reviewUrl: string
  placeId: string | null
}

const PLACE_ID_PATTERN = /^Ch[A-Za-z0-9_-]{10,}$/

/** Cuba parse terus dari URL/teks tanpa panggilan luar. */
function tryParseDirectly(input: string): NormalizedReviewLink | null {
  // Kes A — Place ID mentah ditaip terus (cth: ChIJN1t_tDeuEmsRUsoyG83frY4)
  if (PLACE_ID_PATTERN.test(input)) {
    return {
      reviewUrl: `https://search.google.com/local/writereview?placeid=${input}`,
      placeId: input,
    }
  }

  let url: URL
  try {
    url = new URL(input)
  } catch {
    return null // bukan Place ID, bukan URL sah
  }

  // Kes B — link "Tulis Ulasan" rasmi (dari GBP > Ask for reviews)
  const placeIdParam = url.searchParams.get('placeid')
  if (
    url.hostname === 'search.google.com' &&
    url.pathname.includes('/local/writereview') &&
    placeIdParam
  ) {
    return {
      reviewUrl: `https://search.google.com/local/writereview?placeid=${placeIdParam}`,
      placeId: placeIdParam,
    }
  }

  // Kes C — Google Business shortlink (g.page/r/xxxx atau .../review)
  if (url.hostname === 'g.page') {
    const cleanPath = url.pathname.endsWith('/review') ? url.pathname : `${url.pathname}/review`
    return { reviewUrl: `https://g.page${cleanPath}`, placeId: null }
  }

  return null
}

/** Follow redirect untuk short link Maps (goo.gl/maps, maps.app.goo.gl). */
async function resolveShortLink(input: string): Promise<string> {
  const isShortLink = /goo\.gl\/maps|maps\.app\.goo\.gl/.test(input)
  if (!isShortLink) return input
  try {
    const res = await fetch(input, { redirect: 'follow' })
    return res.url
  } catch {
    return input
  }
}

/** Extract nama & koordinat dari full Google Maps URL untuk bantu carian Places API. */
function extractHintsFromUrl(url: string) {
  const nameMatch = url.match(/\/maps\/place\/([^/@]+)/)
  const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  return {
    name: nameMatch ? decodeURIComponent(nameMatch[1].replace(/\+/g, ' ')) : null,
    lat: coordMatch ? parseFloat(coordMatch[1]) : null,
    lng: coordMatch ? parseFloat(coordMatch[2]) : null,
  }
}

/** Kes D — fallback Places API Text Search bila format lain tak match. */
async function resolveViaPlacesApi(rawUrl: string): Promise<NormalizedReviewLink | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return null

  const hint = extractHintsFromUrl(rawUrl)
  if (!hint.name) return null

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id',
      },
      body: JSON.stringify({
        textQuery: hint.name,
        ...(hint.lat && hint.lng
          ? {
              locationBias: {
                circle: { center: { latitude: hint.lat, longitude: hint.lng }, radius: 200.0 },
              },
            }
          : {}),
      }),
    })
    const data = await res.json()
    const placeId = data.places?.[0]?.id
    if (!placeId) return null
    return {
      reviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
      placeId,
    }
  } catch (err) {
    console.error('Places API resolution failed:', err)
    return null
  }
}

/**
 * Fungsi utama — panggil ni dari route API.
 * Pulangkan null kalau input tak dapat dikenalpasti langsung
 * (route yang panggil patut respons dengan mesej ralat sesuai).
 */
export async function normalizeGoogleReviewUrl(
  rawInput: string
): Promise<NormalizedReviewLink | null> {
  const input = rawInput.trim()
  if (!input) return null

  const direct = tryParseDirectly(input)
  if (direct) return direct

  const resolvedUrl = await resolveShortLink(input)
  const directAfterResolve = tryParseDirectly(resolvedUrl)
  if (directAfterResolve) return directAfterResolve

  return resolveViaPlacesApi(resolvedUrl)
}
