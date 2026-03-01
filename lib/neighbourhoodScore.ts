/**
 * lib/neighbourhoodScore.ts
 *
 * Calculates a neighbourhood walkability/amenity score using:
 *   - Outscraper Google Maps API (transit, cafes, grocery, schools, parks)
 *   - Edmonton permit activity (from already-fetched permits data)
 *
 * Architecture rule: all logic here — UI component is pure display.
 * If Outscraper fails, route.ts catches and returns null — never blocks zone data.
 */

const OUTSCRAPER_URL = 'https://api.app.outscraper.com/maps/search-v3'
const RADIUS_M       = 500
const LIMIT          = 20   // max results per category
const TIMEOUT_MS     = 8_000

export type ScoreLabel = 'LOW' | 'MODERATE' | 'HIGH' | 'PREMIUM'

export interface SubScore {
  label:  string
  score:  number   // 0–100
  count:  number   // raw count from API
}

export interface NeighbourhoodScore {
  overall:        ScoreLabel
  overall_score:  number      // 0–100
  transit:        SubScore
  amenities:      SubScore
  commercial:     SubScore
  development:    SubScore
  data_source:    string
}

// ── Scoring thresholds ────────────────────────────────────────────────────────

/** Convert raw count → 0-100 sub-score using tiered thresholds */
function countToScore(count: number, tiers: [number, number][]): number {
  // tiers: [[minCount, score], ...] ascending
  let score = 0
  for (const [min, s] of tiers) {
    if (count >= min) score = s
  }
  return score
}

function overallLabel(score: number): ScoreLabel {
  if (score >= 76) return 'PREMIUM'
  if (score >= 56) return 'HIGH'
  if (score >= 36) return 'MODERATE'
  return 'LOW'
}

// ── Outscraper fetch ───────────────────────────────────────────────────────────

async function fetchCategory(query: string, lat: number, lon: number): Promise<number> {
  const key = process.env.OUTSCRAPER_API_KEY
  if (!key) return 0

  const url = `${OUTSCRAPER_URL}?query=${encodeURIComponent(
    `${query},${lat},${lon}`
  )}&limit=${LIMIT}&async=false&radius=${RADIUS_M}`

  const res = await fetch(url, {
    headers: { 'X-API-KEY': key },
    signal:  AbortSignal.timeout(TIMEOUT_MS),
  })

  if (!res.ok) {
    console.error(`[score] Outscraper ${query} HTTP ${res.status}`)
    return 0
  }

  const data = await res.json()
  return (data?.data?.[0] ?? []).length
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Calculate neighbourhood score for a lat/lon.
 *
 * @param lat          Latitude
 * @param lon          Longitude
 * @param permitCount  Count of nearby permits (from getPermitsNearby)
 * @returns            NeighbourhoodScore or null on failure
 *
 * Example: McKernan RS lot → HIGH 68 (transit 75, amenities 100, commercial 50, development 75)
 */
export async function getNeighbourhoodScore(
  lat: number,
  lon: number,
  permitCount: number,
): Promise<NeighbourhoodScore | null> {
  const key = process.env.OUTSCRAPER_API_KEY
  if (!key) {
    console.warn('[score] OUTSCRAPER_API_KEY not set')
    return null
  }

  // Fire all 4 Outscraper queries in parallel
  const [transitCount, cafeCount, groceryCount, schoolParkCount] = await Promise.all([
    fetchCategory('transit stop bus stop',         lat, lon),
    fetchCategory('cafe restaurant coffee shop',   lat, lon),
    fetchCategory('grocery store supermarket',     lat, lon),
    fetchCategory('school park recreation centre', lat, lon),
  ])

  // Sub-scores
  const transit: SubScore = {
    label: 'Transit',
    count: transitCount,
    score: countToScore(transitCount, [[0, 5], [1, 30], [3, 55], [6, 75], [10, 100]]),
  }

  const amenities: SubScore = {
    label: 'Amenities',
    count: cafeCount,
    score: countToScore(cafeCount, [[0, 5], [2, 30], [5, 55], [10, 75], [15, 100]]),
  }

  const commercial: SubScore = {
    label: 'Commercial',
    count: groceryCount + schoolParkCount,
    score: countToScore(groceryCount + schoolParkCount, [[0, 5], [1, 35], [3, 60], [6, 80], [10, 100]]),
  }

  const development: SubScore = {
    label: 'Development',
    count: permitCount,
    score: countToScore(permitCount, [[0, 10], [1, 35], [3, 55], [6, 75], [10, 100]]),
  }

  const overall_score = Math.round(
    (transit.score * 0.30) +
    (amenities.score * 0.30) +
    (commercial.score * 0.20) +
    (development.score * 0.20)
  )

  return {
    overall:       overallLabel(overall_score),
    overall_score,
    transit,
    amenities,
    commercial,
    development,
    data_source:   'Google Maps via Outscraper + Edmonton Open Data permits',
  }
}
