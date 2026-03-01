/**
 * lib/rezonings.ts
 *
 * Fetches active rezoning applications from Edmonton GIS Layer 40
 * (Land Development Applications), filters JOBTYPE=REZONING & WEB_STATUS=In Progress,
 * and returns any application within 300m of a searched lat/lon.
 *
 * Architecture rule: all logic here — zero API calls in UI components.
 * Cache: in-process module-level Map, 1-hour TTL.
 * If this call fails, zone data still returns — wrapped in try/catch in route.ts.
 */

const GIS_URL =
  'https://gis.edmonton.ca/dev_arcgisintegration_cfcdn/rest/services/Zoning_Web_App/Zoning_Map/FeatureServer/40/query'

const RADIUS_M   = 300
const TIMEOUT_MS = 8_000
const CACHE_TTL  = 60 * 60 * 1_000  // 1 hour

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RezoningApplication {
  file_number:       string
  description:       string   // "Application to rezone from (RS) to (RSM)"
  from_zone:         string   // parsed e.g. "RS"
  to_zone:           string   // parsed e.g. "RSM"
  status:            string
  neighbourhood:     string
  hearing_date:      string | null   // ISO date string or null
  application_date:  string | null
  distance_m:        number
  lat:               number
  lon:               number
}

// ── Module-level cache ────────────────────────────────────────────────────────

interface CacheEntry {
  data:        RezoningApplication[]
  fetchedAt:   number
}

let _cache: CacheEntry | null = null

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Return the nearest active rezoning application within 300m of lat/lon, or null.
 */
export async function checkRezoningNearby(
  lat: number,
  lon: number,
): Promise<RezoningApplication | null> {
  const applications = await getActiveRezonings()
  if (!applications.length) return null

  let nearest: RezoningApplication | null = null
  let nearestDist = Infinity

  for (const app of applications) {
    const dist = haversineM(lat, lon, app.lat, app.lon)
    if (dist < nearestDist) {
      nearestDist = dist
      nearest = { ...app, distance_m: Math.round(dist) }
    }
  }

  if (!nearest || nearestDist > RADIUS_M) return null
  return nearest
}

// ── Internal: fetch + cache ───────────────────────────────────────────────────

async function getActiveRezonings(): Promise<RezoningApplication[]> {
  const now = Date.now()
  if (_cache && now - _cache.fetchedAt < CACHE_TTL) return _cache.data

  const params = new URLSearchParams({
    where:            "JOBTYPE='REZONING' AND WEB_STATUS='In Progress'",
    outFields:        'FILE_NUMBER,JOBDESCRIPTION,WEB_STATUS,PUBLIC_HEARING_DATE,APPLICATION_DATE,NEIGHBOURHOOD',
    returnGeometry:   'true',
    returnCentroid:   'true',
    outSR:            '4326',
    f:                'json',
  })

  const res = await fetch(`${GIS_URL}?${params}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next:   { revalidate: 3600 },  // Next.js fetch cache hint
  })
  if (!res.ok) throw new Error(`GIS layer 40 HTTP ${res.status}`)

  const data = await res.json()
  const features: {
    attributes: Record<string, string | number | null>
    centroid?:  { x: number; y: number }
    geometry?:  { x?: number; y?: number; rings?: number[][][] }
  }[] = data.features ?? []

  const applications: RezoningApplication[] = []

  for (const feat of features) {
    const a   = feat.attributes
    const geo = feat.centroid ?? feat.geometry

    // Extract centroid coordinates
    let cLat: number | null = null
    let cLon: number | null = null

    if (geo && 'x' in geo && typeof geo.x === 'number') {
      cLon = geo.x
      cLat = geo.y as number
    } else if (geo && 'rings' in geo && geo.rings?.length) {
      // Compute simple centroid of first ring
      const ring  = geo.rings[0]
      const sumLon = ring.reduce((s, p) => s + p[0], 0)
      const sumLat = ring.reduce((s, p) => s + p[1], 0)
      cLon = sumLon / ring.length
      cLat = sumLat / ring.length
    }

    if (cLat === null || cLon === null) continue

    // Parse "from X to Y" from JOBDESCRIPTION
    const desc = String(a.JOBDESCRIPTION ?? '')
    const fromZone = parseZoneCode(desc, 'from') ?? ''
    const toZone   = parseZoneCode(desc, 'to')   ?? ''

    // Convert epoch ms timestamps to ISO strings
    const hearingDate = a.PUBLIC_HEARING_DATE
      ? new Date(Number(a.PUBLIC_HEARING_DATE)).toISOString().split('T')[0]
      : null
    const appDate = a.APPLICATION_DATE
      ? new Date(Number(a.APPLICATION_DATE)).toISOString().split('T')[0]
      : null

    applications.push({
      file_number:      String(a.FILE_NUMBER ?? ''),
      description:      desc,
      from_zone:        fromZone,
      to_zone:          toZone,
      status:           String(a.WEB_STATUS ?? ''),
      neighbourhood:    String(a.NEIGHBOURHOOD ?? ''),
      hearing_date:     hearingDate,
      application_date: appDate,
      distance_m:       0,   // filled in checkRezoningNearby
      lat:              cLat,
      lon:              cLon,
    })
  }

  _cache = { data: applications, fetchedAt: now }
  console.log(`[rezonings] cached ${applications.length} active applications`)
  return applications
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parse zone code after "from" or "to" in a description string.
 * Handles: "from (RS) Small Scale Residential to (RSM)..."
 * Also handles: "from RF3 to RF6"
 */
function parseZoneCode(desc: string, direction: 'from' | 'to'): string | null {
  // Pattern 1: "(ZONE)" after keyword
  const parenRe = new RegExp(`${direction}\\s+\\(([^)]+)\\)`, 'i')
  const parenM  = desc.match(parenRe)
  if (parenM) return parenM[1].trim()

  // Pattern 2: bare zone code after keyword (e.g. "from RF3 to RF6")
  const bareRe = new RegExp(`${direction}\\s+([A-Z][A-Z0-9/-]{0,10})(?:\\s|$)`, 'i')
  const bareM  = desc.match(bareRe)
  if (bareM) return bareM[1].trim()

  return null
}

function haversineM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R  = 6_371_000
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const a  = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
