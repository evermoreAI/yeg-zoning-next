/**
 * lib/developmentPermits.ts
 *
 * Fetches nearby development permits from Edmonton Open Data (Socrata).
 * Dataset: q4gd-6q9r — Development Permits (2019-present)
 * Architecture rule: all API logic here, zero in UI components.
 */

const BASE_URL   = 'https://data.edmonton.ca/resource/q4gd-6q9r.json'
const MAX_RETRIES = 3
const TIMEOUT_MS  = 10_000

// ~500m bounding box deltas at Edmonton latitude (~53.5°)
const LAT_DELTA = 0.0045   // ~500m north/south
const LON_DELTA = 0.0065   // ~500m east/west at 53.5°N

export interface DevelopmentPermit {
  id:          string
  address:     string
  permit_type: string
  permit_class: string
  status:      string
  issue_date:  string   // ISO date string
  description: string
  neighbourhood: string
  zoning:      string
  lat:         number
  lng:         number
}

/**
 * Fetch development permits within ~500m of a coordinate.
 * Uses bounding-box SoQL query (within_circle not supported on this dataset).
 *
 * @param lat  Latitude (WGS84)
 * @param lon  Longitude (WGS84)
 * @returns    Array of permits, most recent first, max 10
 */
export async function getPermitsNearby(lat: number, lon: number): Promise<DevelopmentPermit[]> {
  const minLat = (lat - LAT_DELTA).toFixed(6)
  const maxLat = (lat + LAT_DELTA).toFixed(6)
  const minLon = (lon - LON_DELTA).toFixed(6)
  const maxLon = (lon + LON_DELTA).toFixed(6)

  const where  = `latitude>'${minLat}' AND latitude<'${maxLat}' AND longitude>'${minLon}' AND longitude<'${maxLon}'`
  const url    = `${BASE_URL}?$where=${encodeURIComponent(where)}&$order=permit_date DESC&$limit=25`

  let lastErr: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) await sleep(1000 * Math.pow(2, attempt - 1))
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw: Record<string, string>[] = await res.json()
      return raw.map(r => ({
        id:           r.city_file_number ?? '',
        address:      formatAddress(r.address ?? ''),
        permit_type:  r.permit_type ?? '',
        permit_class: r.permit_class ?? '',
        status:       r.status ?? '',
        issue_date:   (r.permit_date ?? '').slice(0, 10),
        description:  truncate(r.description_of_development ?? '', 120),
        neighbourhood: r.neighbourhood ?? '',
        zoning:       r.zoning ?? '',
        lat:          parseFloat(r.latitude ?? '0'),
        lng:          parseFloat(r.longitude ?? '0'),
      }))
    } catch (e) {
      lastErr = e as Error
      console.error(`[permits] attempt ${attempt + 1} failed:`, e)
    }
  }

  console.error('[permits] all retries failed:', lastErr)
  return []
}

/**
 * Get permit count for neighbourhood in two consecutive 90-day windows.
 * Used for NEIGHBOURHOOD MOMENTUM indicator.
 */
export async function getNeighbourhoodMomentum(
  neighbourhood: string
): Promise<{ recent: number; prior: number; trend: 'ACCELERATING' | 'ACTIVE' | 'COOLING' }> {
  if (!neighbourhood) return { recent: 0, prior: 0, trend: 'ACTIVE' }

  const now      = new Date()
  const d90      = new Date(now); d90.setDate(d90.getDate() - 90)
  const d180     = new Date(now); d180.setDate(d180.getDate() - 180)
  const fmt      = (d: Date) => d.toISOString().slice(0, 10) + 'T00:00:00.000'
  const hood     = neighbourhood.toUpperCase().replace(/'/g, "''")

  const [recentRes, priorRes] = await Promise.allSettled([
    fetch(`${BASE_URL}?$select=count(*)&$where=${encodeURIComponent(
      `neighbourhood='${hood}' AND permit_date>='${fmt(d90)}'`
    )}&$limit=1`, { signal: AbortSignal.timeout(TIMEOUT_MS) }),
    fetch(`${BASE_URL}?$select=count(*)&$where=${encodeURIComponent(
      `neighbourhood='${hood}' AND permit_date>='${fmt(d180)}' AND permit_date<'${fmt(d90)}'`
    )}&$limit=1`, { signal: AbortSignal.timeout(TIMEOUT_MS) }),
  ])

  const recent = await extractCount(recentRes)
  const prior  = await extractCount(priorRes)

  let trend: 'ACCELERATING' | 'ACTIVE' | 'COOLING' = 'ACTIVE'
  if (prior > 0) {
    const change = (recent - prior) / prior
    if (change >=  0.20) trend = 'ACCELERATING'
    else if (change <= -0.20) trend = 'COOLING'
  } else if (recent > 0) {
    trend = 'ACCELERATING'
  }

  return { recent, prior, trend }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function extractCount(result: PromiseSettledResult<Response>): Promise<number> {
  if (result.status === 'rejected') return 0
  try {
    const json = await result.value.json()
    return parseInt(json[0]?.count ?? '0', 10)
  } catch { return 0 }
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

function formatAddress(raw: string): string {
  // Edmonton open data uses "11111 - 82 AVENUE NW" → "11111 82 Avenue NW"
  return raw.replace(/\s*-\s*/g, ' ').replace(/\b([A-Z])/g, m => m).trim()
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n).trimEnd() + '…'
}
