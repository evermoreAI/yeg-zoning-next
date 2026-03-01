/**
 * lib/edmontonGis.ts
 *
 * Server-side fetch to Edmonton GIS ArcGIS REST API.
 * Called only from Next.js API routes — never from browser components.
 * Edmonton GIS is CORS-blocked for browser requests.
 *
 * Implements: 3 retries, exponential backoff (1s → 2s → 4s), 10s timeout.
 * Returns a typed RawGisZone — never throws to caller.
 */

import type { RawGisZone } from './types'

const GIS_ENDPOINT =
  'https://gis.edmonton.ca/dev_arcgisintegration_cfcdn/rest/services/Zoning_Web_App/Zoning_Map/FeatureServer/5/query'

const TIMEOUT_MS  = 10_000
const MAX_RETRIES = 3

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Query Edmonton GIS for the zone at a given lat/lon.
 * Retries up to 3 times with exponential backoff on failure.
 *
 * @param lat  WGS84 latitude
 * @param lon  WGS84 longitude
 * @returns    RawGisZone — found:false with error message on failure
 */
export async function getZoneForLocation(lat: number, lon: number): Promise<RawGisZone> {
  const params = new URLSearchParams({
    geometry:        `${lon},${lat}`,
    geometryType:    'esriGeometryPoint',
    inSR:            '4326',
    spatialRel:      'esriSpatialRelIntersects',
    outFields:       'ZONING,ZONING_STRING,DESCRIPTION,DOCUMENT_URL',
    returnGeometry:  'false',
    f:               'json',
  })
  const url = `${GIS_ENDPOINT}?${params}`

  let lastError = ''
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const backoff = 1000 * Math.pow(2, attempt - 1) // 1s, 2s, 4s
      console.log(`[YEG GIS] Retry ${attempt} after ${backoff}ms — lat:${lat} lon:${lon}`)
      await sleep(backoff)
    }

    try {
      const res  = await fetchWithTimeout(url, TIMEOUT_MS)
      if (!res.ok) {
        lastError = `HTTP ${res.status}`
        continue
      }
      const data = await res.json()

      if (!data.features || data.features.length === 0) {
        // Valid response but no feature — location outside Edmonton or water/park
        return {
          found:       false,
          zone_code:   '',
          zone_string: '',
          zone_desc:   '',
          bylaw_url:   '',
          error:       'No zoning data found for this location.',
          fetched_at:  new Date().toISOString(),
        }
      }

      const attrs      = data.features[0].attributes
      const zoneString = (attrs.ZONING_STRING || attrs.ZONING || '').toString().trim()
      // Extract base zone code — first whitespace-delimited token
      const zoneCode   = zoneString.split(/\s+/)[0].toUpperCase()

      return {
        found:       true,
        zone_code:   zoneCode,
        zone_string: zoneString,
        zone_desc:   (attrs.DESCRIPTION   || '').toString().trim(),
        bylaw_url:   (attrs.DOCUMENT_URL  || '').toString().trim(),
        fetched_at:  new Date().toISOString(),
      }
    } catch (err: any) {
      lastError = err?.message ?? 'Unknown error'
      console.error(`[YEG GIS] Attempt ${attempt + 1} failed: ${lastError}`)
    }
  }

  // All retries exhausted
  return {
    found:       false,
    zone_code:   '',
    zone_string: '',
    zone_desc:   '',
    bylaw_url:   '',
    error:       'Unable to load live zoning data. Please try again or verify with City of Edmonton via 311.',
    fetched_at:  new Date().toISOString(),
  }
}
