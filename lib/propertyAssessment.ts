/**
 * lib/propertyAssessment.ts
 *
 * Fetches property assessment data from Edmonton Open Data.
 * Dataset: q7d6-ambg (Property Assessment Current Year)
 *
 * Strategy: query by neighbourhood name (text-indexed), then find the
 * nearest record to the searched lat/lon using Haversine distance.
 * The lat/lon columns in this dataset are text — numeric range queries
 * fail due to string sort ordering, so proximity filtering is done in JS.
 *
 * Architecture rule: all API logic here, zero in UI components.
 */

const BASE_URL    = 'https://data.edmonton.ca/resource/q7d6-ambg.json'
const MAX_RETRIES = 3
const TIMEOUT_MS  = 8_000
const MAX_RADIUS_M = 200  // reject matches more than 200m away

export interface PropertyAssessment {
  account_number:  string
  address:         string
  neighbourhood:   string
  assessed_value:  number   // CAD
  tax_class:       string
  distance_m:      number   // metres from queried lat/lon
}

/**
 * Fetch the nearest property assessment record within 200m.
 *
 * @param lat           Latitude (WGS84)
 * @param lon           Longitude (WGS84)
 * @param neighbourhood Neighbourhood name (UPPER CASE) — from GIS or permits
 * @returns             Nearest assessment or null
 */
export async function getNearestAssessment(
  lat: number,
  lon: number,
  neighbourhood: string,
): Promise<PropertyAssessment | null> {
  if (!neighbourhood) return null

  const hood = neighbourhood.toUpperCase().replace(/'/g, "''")
  const url  = `${BASE_URL}?$where=${encodeURIComponent(
    `neighbourhood='${hood}'`
  )}&$select=account_number,house_number,street_name,neighbourhood,assessed_value,tax_class,latitude,longitude&$limit=200`

  let lastErr: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) await sleep(1000 * Math.pow(2, attempt - 1))
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const rows: Record<string, string>[] = await res.json()
      if (!rows.length) return null

      // Find nearest record by Haversine distance
      let nearest: PropertyAssessment | null = null
      let nearestDist = Infinity

      for (const row of rows) {
        const rLat = parseFloat(row.latitude ?? '')
        const rLon = parseFloat(row.longitude ?? '')
        if (isNaN(rLat) || isNaN(rLon)) continue

        const dist = haversineM(lat, lon, rLat, rLon)
        if (dist < nearestDist) {
          nearestDist = dist
          nearest = {
            account_number: row.account_number ?? '',
            address:        `${row.house_number ?? ''} ${row.street_name ?? ''}`.trim(),
            neighbourhood:  row.neighbourhood ?? '',
            assessed_value: parseInt(row.assessed_value ?? '0', 10),
            tax_class:      row.tax_class ?? '',
            distance_m:     Math.round(dist),
          }
        }
      }

      if (!nearest || nearestDist > MAX_RADIUS_M) return null
      return nearest

    } catch (e) {
      lastErr = e as Error
      console.error(`[assessment] attempt ${attempt + 1} failed:`, e)
    }
  }

  console.error('[assessment] all retries failed:', lastErr)
  return null
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function haversineM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R   = 6_371_000  // Earth radius in metres
  const φ1  = (lat1 * Math.PI) / 180
  const φ2  = (lat2 * Math.PI) / 180
  const Δφ  = ((lat2 - lat1) * Math.PI) / 180
  const Δλ  = ((lon2 - lon1) * Math.PI) / 180
  const a   = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

/** Format assessed value as CAD string: $584,000 */
export function formatAssessedValue(value: number): string {
  return value > 0
    ? `$${value.toLocaleString('en-CA')}`
    : 'Not available'
}
