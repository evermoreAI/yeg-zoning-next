/**
 * lib/propertyAssessment.ts
 *
 * Fetches the nearest property assessment record from Edmonton Open Data.
 * Dataset: q7d6-ambg (Property Assessment Current Year)
 *
 * The lat/lon columns in this dataset are TEXT — numeric range queries
 * fail due to string sort order. Strategy:
 *   1. Determine neighbourhood from the permits dataset (1km radius)
 *   2. Query assessment by neighbourhood name (text-indexed, fast)
 *   3. Find nearest record via Haversine distance in JS
 */

const ASSESSMENT_URL = 'https://data.edmonton.ca/resource/q7d6-ambg.json'
const PERMITS_URL    = 'https://data.edmonton.ca/resource/q4gd-6q9r.json'
const MAX_RETRIES    = 2
const TIMEOUT_MS     = 7_000
const MAX_RADIUS_M   = 500

export interface PropertyAssessment {
  account_number: string
  address:        string
  neighbourhood:  string
  assessed_value: number
  tax_class:      string
  distance_m:     number
}

/**
 * Fetch nearest assessment within 200m.
 * Accepts optional neighbourhood to skip the permit lookup.
 */
export async function getNearestAssessment(
  lat: number,
  lon: number,
  neighbourhood?: string,
): Promise<PropertyAssessment | null> {
  // Step 1: resolve neighbourhood if not supplied
  const hood = neighbourhood || await resolveNeighbourhood(lat, lon)
  if (!hood) return null

  // Step 2: fetch all assessment rows in that neighbourhood (≤200)
  const escaped = hood.toUpperCase().replace(/'/g, "''")
  const url = `${ASSESSMENT_URL}?$where=${encodeURIComponent(
    `neighbourhood='${escaped}'`
  )}&$select=account_number,house_number,street_name,neighbourhood,assessed_value,tax_class,latitude,longitude&$limit=200`

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) await sleep(1000 * attempt)
    try {
      const res  = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const rows: Record<string, string>[] = await res.json()
      if (!rows.length) return null

      // Step 3: find nearest by Haversine
      let nearest: PropertyAssessment | null = null
      let nearestDist = Infinity

      for (const row of rows) {
        const rLat = parseFloat(row.latitude  ?? '')
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
      console.error(`[assessment] attempt ${attempt + 1} failed:`, e)
    }
  }
  return null
}

/**
 * Look up neighbourhood using the permits dataset (1km radius).
 * Permits have reliable neighbourhood names and text-comparable lat/lon.
 */
async function resolveNeighbourhood(lat: number, lon: number): Promise<string> {
  // Fetch 10 recent permits within ~1km, pick the one geographically closest to our point.
  // This gives the correct neighbourhood even when the nearest permit is not the most recent.
  const url = `${PERMITS_URL}?$where=${encodeURIComponent(
    `latitude>'${(lat - 0.009).toFixed(5)}' AND latitude<'${(lat + 0.009).toFixed(5)}' AND longitude>'${(lon - 0.013).toFixed(5)}' AND longitude<'${(lon + 0.013).toFixed(5)}'`
  )}&$select=neighbourhood,latitude,longitude&$limit=20&$order=permit_date DESC`

  try {
    const res  = await fetch(url, { signal: AbortSignal.timeout(5_000) })
    if (!res.ok) return ''
    const rows = await res.json() as { neighbourhood?: string; latitude?: string; longitude?: string }[]
    if (!rows.length) return ''

    // Pick the permit record closest to our exact coordinates
    let best = rows[0].neighbourhood ?? ''
    let bestDist = Infinity
    for (const row of rows) {
      const rLat = parseFloat(row.latitude  ?? '')
      const rLon = parseFloat(row.longitude ?? '')
      if (isNaN(rLat) || isNaN(rLon) || !row.neighbourhood) continue
      const d = haversineM(lat, lon, rLat, rLon)
      if (d < bestDist) { bestDist = d; best = row.neighbourhood }
    }
    return best
  } catch {
    return ''
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function haversineM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R  = 6_371_000
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const a  = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

export function formatAssessedValue(value: number): string {
  return value > 0 ? `$${value.toLocaleString('en-CA')}` : 'Not available'
}
