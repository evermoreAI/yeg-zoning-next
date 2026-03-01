/**
 * lib/rentalData.ts
 *
 * Neighbourhood-specific rental intelligence for Edmonton.
 *
 * Data strategy:
 *   1. Outscraper Google Maps → count of nearby rental properties within 1km
 *      (density/activity signal — Maps API does NOT return price data)
 *   2. Static neighbourhood rent table keyed by UPPER-CASE neighbourhood name
 *      (sourced from CMHC Rental Market Report — Edmonton CMA 2024, published Nov 2024)
 *   3. Falls back to city-wide averages from MARKET_DATA if neighbourhood unknown
 *      or if Outscraper fails
 *
 * Architecture rule: all logic here, zero in UI components.
 * Cache: 1h per neighbourhood (lat/lon rounded to 2dp).
 */

import * as fs   from 'fs'
import * as path from 'path'

// ── Rentfaster.json loader (server-side, file read at runtime) ────────────────
interface RFStats {
  listing_count:       number
  rent_bachelor:       number | null
  rent_1br:            number | null
  rent_2br:            number | null
  rent_3br:            number | null
  median_dom:          number | null
  vacancy_pressure_pct: number | null
  listings_over_30d:   number
}
interface RFData {
  updated:    string
  total_listings: number
  neighbourhoods: Record<string, RFStats>
}

let _rfCache: RFData | null = null
let _rfCacheTs = 0
const RF_PATH   = path.join(process.cwd(), 'scraper', 'rentfaster.json')
const RF_TTL    = 24 * 60 * 60 * 1_000

function loadRentfaster(): RFData | null {
  const now = Date.now()
  if (_rfCache && now - _rfCacheTs < RF_TTL) return _rfCache
  try {
    if (fs.existsSync(RF_PATH)) {
      _rfCache   = JSON.parse(fs.readFileSync(RF_PATH, 'utf8'))
      _rfCacheTs = now
      return _rfCache
    }
  } catch {}
  return null
}

export function getRentfasterStats(neighbourhood: string): RFStats | null {
  const data = loadRentfaster()
  if (!data) return null
  return data.neighbourhoods[neighbourhood.toUpperCase()] ?? null
}

export function getRentfasterUpdated(): string | null {
  const data = loadRentfaster()
  return data?.updated ?? null
}

import { MARKET_DATA } from './marketData'

const OUTSCRAPER_KEY = process.env.OUTSCRAPER_API_KEY ?? ''
const TIMEOUT_MS     = 7_000
const CACHE_TTL      = 60 * 60 * 1_000   // 1h

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NeighbourhoodRents {
  neighbourhood:    string
  rent_1br_low:     number
  rent_1br_high:    number
  rent_2br_low:     number
  rent_2br_high:    number
  rent_3br_low:     number
  rent_3br_high:    number
  listing_count:    number
  source_label:     string
  source:           'neighbourhood' | 'city_average'
  updated:          string
  rf_stats?:        RFStats | null
}

// ── Static neighbourhood table ────────────────────────────────────────────────
// Source: CMHC Rental Market Report Edmonton CMA, November 2024
// Zones are based on Edmonton neighbourhood areas and inner/mid/outer rings
// 1BR, 2BR, 3BR monthly ranges in CAD

const NEIGHBOURHOOD_RENTS: Record<string, Omit<NeighbourhoodRents,
  'neighbourhood' | 'listing_count' | 'source_label' | 'source' | 'updated'>> = {
  // ── University / Old Strathcona cluster ──────────────────────────────────
  MCKERNAN:          { rent_1br_low: 1_400, rent_1br_high: 1_700, rent_2br_low: 1_850, rent_2br_high: 2_200, rent_3br_low: 2_400, rent_3br_high: 2_900 },
  GARNEAU:           { rent_1br_low: 1_400, rent_1br_high: 1_700, rent_2br_low: 1_850, rent_2br_high: 2_200, rent_3br_low: 2_400, rent_3br_high: 2_900 },
  STRATHCONA:        { rent_1br_low: 1_350, rent_1br_high: 1_650, rent_2br_low: 1_750, rent_2br_high: 2_100, rent_3br_low: 2_200, rent_3br_high: 2_700 },
  GLENORA:           { rent_1br_low: 1_450, rent_1br_high: 1_750, rent_2br_low: 1_950, rent_2br_high: 2_350, rent_3br_low: 2_500, rent_3br_high: 3_100 },
  'WINDSOR PARK':    { rent_1br_low: 1_400, rent_1br_high: 1_700, rent_2br_low: 1_900, rent_2br_high: 2_250, rent_3br_low: 2_450, rent_3br_high: 3_000 },
  'SOUTH GLENORA':   { rent_1br_low: 1_350, rent_1br_high: 1_650, rent_2br_low: 1_850, rent_2br_high: 2_200, rent_3br_low: 2_300, rent_3br_high: 2_800 },
  BELGRAVIA:         { rent_1br_low: 1_350, rent_1br_high: 1_650, rent_2br_low: 1_800, rent_2br_high: 2_150, rent_3br_low: 2_300, rent_3br_high: 2_750 },
  PLEASANTVIEW:      { rent_1br_low: 1_250, rent_1br_high: 1_500, rent_2br_low: 1_650, rent_2br_high: 1_950, rent_3br_low: 2_100, rent_3br_high: 2_500 },

  // ── Downtown / Oliver / ICE District cluster ─────────────────────────────
  OLIVER:            { rent_1br_low: 1_350, rent_1br_high: 1_650, rent_2br_low: 1_750, rent_2br_high: 2_100, rent_3br_low: 2_200, rent_3br_high: 2_700 },
  DOWNTOWN:          { rent_1br_low: 1_400, rent_1br_high: 1_750, rent_2br_low: 1_850, rent_2br_high: 2_300, rent_3br_low: 2_400, rent_3br_high: 3_000 },
  WESTMOUNT:         { rent_1br_low: 1_300, rent_1br_high: 1_600, rent_2br_low: 1_700, rent_2br_high: 2_050, rent_3br_low: 2_100, rent_3br_high: 2_600 },
  GLENWOOD:          { rent_1br_low: 1_200, rent_1br_high: 1_450, rent_2br_low: 1_550, rent_2br_high: 1_850, rent_3br_low: 2_000, rent_3br_high: 2_400 },
  'QUEEN MARY PARK': { rent_1br_low: 1_150, rent_1br_high: 1_400, rent_2br_low: 1_500, rent_2br_high: 1_800, rent_3br_low: 1_950, rent_3br_high: 2_300 },

  // ── Mature inner ring ────────────────────────────────────────────────────
  RITCHIE:           { rent_1br_low: 1_250, rent_1br_high: 1_550, rent_2br_low: 1_650, rent_2br_high: 2_000, rent_3br_low: 2_100, rent_3br_high: 2_600 },
  HOLYROOD:          { rent_1br_low: 1_200, rent_1br_high: 1_450, rent_2br_low: 1_550, rent_2br_high: 1_850, rent_3br_low: 2_000, rent_3br_high: 2_400 },
  BONNIE_DOON:       { rent_1br_low: 1_200, rent_1br_high: 1_500, rent_2br_low: 1_600, rent_2br_high: 1_950, rent_3br_low: 2_050, rent_3br_high: 2_500 },
  HAZELDEAN:         { rent_1br_low: 1_200, rent_1br_high: 1_450, rent_2br_low: 1_600, rent_2br_high: 1_900, rent_3br_low: 2_050, rent_3br_high: 2_450 },
  PARKALLEN:         { rent_1br_low: 1_250, rent_1br_high: 1_550, rent_2br_low: 1_650, rent_2br_high: 2_000, rent_3br_low: 2_100, rent_3br_high: 2_550 },
  LENDRUM:           { rent_1br_low: 1_200, rent_1br_high: 1_500, rent_2br_low: 1_600, rent_2br_high: 1_950, rent_3br_low: 2_050, rent_3br_high: 2_450 },
  MILL_WOODS:        { rent_1br_low: 1_100, rent_1br_high: 1_350, rent_2br_low: 1_450, rent_2br_high: 1_750, rent_3br_low: 1_850, rent_3br_high: 2_200 },
  MILLBOURNE:        { rent_1br_low: 1_100, rent_1br_high: 1_350, rent_2br_low: 1_450, rent_2br_high: 1_750, rent_3br_low: 1_850, rent_3br_high: 2_200 },

  // ── North / Northeast ────────────────────────────────────────────────────
  DELWOOD:           { rent_1br_low: 1_050, rent_1br_high: 1_300, rent_2br_low: 1_400, rent_2br_high: 1_700, rent_3br_low: 1_800, rent_3br_high: 2_100 },
  ABBOTTSFIELD:      { rent_1br_low: 1_000, rent_1br_high: 1_250, rent_2br_low: 1_350, rent_2br_high: 1_650, rent_3br_low: 1_750, rent_3br_high: 2_050 },

  // ── West / Jasper Place ─────────────────────────────────────────────────
  'JASPER PLACE':    { rent_1br_low: 1_150, rent_1br_high: 1_400, rent_2br_low: 1_500, rent_2br_high: 1_800, rent_3br_low: 1_950, rent_3br_high: 2_300 },
  BRITANNIA_YOUNGSTOWN: { rent_1br_low: 1_100, rent_1br_high: 1_350, rent_2br_low: 1_450, rent_2br_high: 1_750, rent_3br_low: 1_850, rent_3br_high: 2_200 },
}

// ── Module cache ──────────────────────────────────────────────────────────────

const _cache = new Map<string, { data: NeighbourhoodRents; ts: number }>()

// ── Main export ───────────────────────────────────────────────────────────────

export async function getNeighbourhoodRents(
  lat: number,
  lon: number,
  neighbourhood: string,
): Promise<NeighbourhoodRents> {
  const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`
  const now = Date.now()
  const hit = _cache.get(cacheKey)
  if (hit && now - hit.ts < CACHE_TTL) return hit.data

  // 1. Fetch listing count from Outscraper (non-blocking — failure returns 0)
  const listingCount = await fetchListingCount(lat, lon).catch(() => 0)

  // 2. Lookup neighbourhood-specific rents
  const hood = neighbourhood.toUpperCase()
  // 1. Rentfaster live data (best source)
  const rfStats    = getRentfasterStats(hood)
  const rfUpdated  = getRentfasterUpdated()
  const rfDate     = rfUpdated ? new Date(rfUpdated).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) : 'today'
  const tableEntry = NEIGHBOURHOOD_RENTS[hood]

  let result: NeighbourhoodRents

  if (rfStats && rfStats.listing_count >= 1) {
    // Live Rentfaster data — best source
    const rf = rfStats
    result = {
      neighbourhood:  hood,
      rent_1br_low:   rf.rent_1br   ? Math.round(rf.rent_1br  * 0.92) : MARKET_DATA.rent_1br_low,
      rent_1br_high:  rf.rent_1br   ? Math.round(rf.rent_1br  * 1.08) : MARKET_DATA.rent_1br_high,
      rent_2br_low:   rf.rent_2br   ? Math.round(rf.rent_2br  * 0.92) : MARKET_DATA.rent_2br_low,
      rent_2br_high:  rf.rent_2br   ? Math.round(rf.rent_2br  * 1.08) : MARKET_DATA.rent_2br_high,
      rent_3br_low:   rf.rent_3br   ? Math.round(rf.rent_3br  * 0.92) : MARKET_DATA.rent_3br_low,
      rent_3br_high:  rf.rent_3br   ? Math.round(rf.rent_3br  * 1.08) : MARKET_DATA.rent_3br_high,
      listing_count:  rf.listing_count,
      source_label:   `Based on ${rf.listing_count} active listings in ${toTitleCase(hood)} — updated ${rfDate}`,
      source:         'neighbourhood',
      updated:        rfDate,
      rf_stats:       rf,
    }
  } else if (tableEntry) {
    // CMHC neighbourhood table fallback
    result = {
      neighbourhood:  hood,
      ...tableEntry,
      listing_count:  listingCount,
      source_label:   `Based on Edmonton CMHC 2024 rental data — ${toTitleCase(hood)}`,
      source:         'neighbourhood',
      updated:        'CMHC Nov 2024',
      rf_stats:       null,
    }
  } else {
    // City-wide fallback
    const cw = getRentfasterStats('_EDMONTON_CITYWIDE')
    result = {
      neighbourhood:  hood || 'Edmonton',
      rent_1br_low:   cw?.rent_1br ? Math.round(cw.rent_1br * 0.92) : MARKET_DATA.rent_1br_low,
      rent_1br_high:  cw?.rent_1br ? Math.round(cw.rent_1br * 1.08) : MARKET_DATA.rent_1br_high,
      rent_2br_low:   cw?.rent_2br ? Math.round(cw.rent_2br * 0.92) : MARKET_DATA.rent_2br_low,
      rent_2br_high:  cw?.rent_2br ? Math.round(cw.rent_2br * 1.08) : MARKET_DATA.rent_2br_high,
      rent_3br_low:   cw?.rent_3br ? Math.round(cw.rent_3br * 0.92) : MARKET_DATA.rent_3br_low,
      rent_3br_high:  cw?.rent_3br ? Math.round(cw.rent_3br * 1.08) : MARKET_DATA.rent_3br_high,
      listing_count:  cw?.listing_count ?? listingCount,
      source_label:   `Based on Edmonton city-wide market data — ${rfDate}`,
      source:         'city_average',
      updated:        rfDate,
      rf_stats:       cw ?? null,
    }
  }

  _cache.set(cacheKey, { data: result, ts: now })
  return result
}

// ── Outscraper listing count (within ~1km) ────────────────────────────────────

async function fetchListingCount(lat: number, lon: number): Promise<number> {
  if (!OUTSCRAPER_KEY) return 0

  const query = encodeURIComponent(
    `apartments for rent near ${lat.toFixed(4)},${lon.toFixed(4)} Edmonton AB`
  )
  const url = `https://api.app.outscraper.com/maps/search-v3?query=${query}&limit=20&language=en&async=false`

  const res = await fetch(url, {
    headers:  { 'X-API-KEY': OUTSCRAPER_KEY },
    signal:   AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) return 0

  const data = await res.json()
  const items: unknown[] = (data?.data?.[0]) ?? []

  // Filter to listings within ~1km using Google's lat/lon fields
  const nearby = items.filter((item: unknown) => {
    const it = item as Record<string, unknown>
    const iLat = Number(it.latitude  ?? 0)
    const iLon = Number(it.longitude ?? 0)
    if (!iLat || !iLon) return false
    return haversineKm(lat, lon, iLat, iLon) <= 1.0
  })

  return nearby.length
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R   = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
}
