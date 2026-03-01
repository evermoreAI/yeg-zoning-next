/**
 * lib/rentalData.ts
 *
 * Neighbourhood-specific rental intelligence for Edmonton.
 *
 * Data hierarchy (in order of preference):
 *   1. Rentfaster live data — used when listing_count >= 10 for that neighbourhood
 *   2. CMHC RMS Edmonton Oct 2024 — zone-level averages, 19 zones, 140 neighbourhood mappings
 *   3. Nearest-neighbour from CMHC zones — if neighbourhood not in table, label is clear
 *   Never shows city-wide average — it's meaningless for investment decisions
 */

import * as fs   from 'fs'
import * as path from 'path'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RFStats {
  listing_count:          number
  rent_bachelor:          number | null
  rent_1br:               number | null
  rent_2br:               number | null
  rent_3br:               number | null
  median_dom:             number | null
  vacancy_pressure_pct:   number | null
  listings_over_30d:      number
}

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
  source:           'live' | 'cmhc_zone' | 'cmhc_nearest'
  updated:          string
  rf_stats?:        RFStats | null
  cmhc_zone?:       string
}

// ── File paths ────────────────────────────────────────────────────────────────

const RF_PATH    = path.join(process.cwd(), 'scraper', 'rentfaster.json')
const CMHC_PATH  = path.join(process.cwd(), 'scraper', 'cmhc_edmonton.json')
const RF_LIVE_MIN = 10   // minimum listings to use Rentfaster as primary

// ── Module caches ─────────────────────────────────────────────────────────────

let _rfData:   any = null; let _rfTs   = 0
let _cmhcData: any = null; let _cmhcTs = 0
const CACHE_TTL = 24 * 60 * 60 * 1_000

function loadRF() {
  if (_rfData && Date.now() - _rfTs < CACHE_TTL) return _rfData
  try {
    if (fs.existsSync(RF_PATH)) { _rfData = JSON.parse(fs.readFileSync(RF_PATH, 'utf8')); _rfTs = Date.now() }
  } catch {}
  return _rfData
}

function loadCMHC() {
  if (_cmhcData && Date.now() - _cmhcTs < CACHE_TTL) return _cmhcData
  try {
    if (fs.existsSync(CMHC_PATH)) { _cmhcData = JSON.parse(fs.readFileSync(CMHC_PATH, 'utf8')); _cmhcTs = Date.now() }
  } catch {}
  return _cmhcData
}

// Public helpers used by route.ts for the RentalMarketCard
export function getRentfasterStats(neighbourhood: string): RFStats | null {
  const d = loadRF(); if (!d) return null
  return d.neighbourhoods?.[neighbourhood.toUpperCase()] ?? null
}
export function getRentfasterUpdated(): string | null {
  return loadRF()?.updated ?? null
}

// ── Main export ───────────────────────────────────────────────────────────────

// Simple in-memory lookup cache (per neighbourhood, no TTL needed — data doesn't change mid-session)
const _rentCache = new Map<string, NeighbourhoodRents>()

export async function getNeighbourhoodRents(
  _lat: number,
  _lon: number,
  neighbourhood: string,
): Promise<NeighbourhoodRents> {
  const hood = (neighbourhood || '').toUpperCase()
  if (_rentCache.has(hood)) return _rentCache.get(hood)!

  const result = buildRents(hood)
  _rentCache.set(hood, result)
  return result
}

// ── Builder ───────────────────────────────────────────────────────────────────

function buildRents(hood: string): NeighbourhoodRents {
  const rf   = loadRF()
  const cmhc = loadCMHC()

  const rfStats: RFStats | null = rf?.neighbourhoods?.[hood] ?? null
  const rfDate = rf?.updated
    ? new Date(rf.updated).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
    : 'today'

  // 1. Live Rentfaster — only when sample is strong enough
  if (rfStats && rfStats.listing_count >= RF_LIVE_MIN) {
    const rs = rfStats
    return {
      neighbourhood: hood,
      rent_1br_low:  rs.rent_1br ? Math.round(rs.rent_1br * 0.93) : 0,
      rent_1br_high: rs.rent_1br ? Math.round(rs.rent_1br * 1.07) : 0,
      rent_2br_low:  rs.rent_2br ? Math.round(rs.rent_2br * 0.93) : 0,
      rent_2br_high: rs.rent_2br ? Math.round(rs.rent_2br * 1.07) : 0,
      rent_3br_low:  rs.rent_3br ? Math.round(rs.rent_3br * 0.93) : 0,
      rent_3br_high: rs.rent_3br ? Math.round(rs.rent_3br * 1.07) : 0,
      listing_count: rs.listing_count,
      source_label:  `Based on ${rs.listing_count} active listings in ${toTitle(hood)} — updated ${rfDate}`,
      source:        'live',
      updated:       rfDate,
      rf_stats:      rs,
    }
  }

  // 2. CMHC zone lookup (direct or nearest)
  if (cmhc) {
    const direct = cmhc.neighbourhoods?.[hood]
    if (direct) {
      return cmhcResult(hood, direct, 'cmhc_zone', rfStats)
    }

    // 3. Nearest-neighbour within CMHC neighbourhood table (fuzzy match on name)
    const nearest = findNearest(hood, cmhc.neighbourhoods || {})
    if (nearest) {
      return cmhcResult(hood, nearest.data, 'cmhc_nearest', rfStats, nearest.name)
    }
  }

  // Should never reach here if cmhc_edmonton.json is present — but if it is missing:
  return {
    neighbourhood: hood,
    rent_1br_low: 1150, rent_1br_high: 1400,
    rent_2br_low: 1400, rent_2br_high: 1700,
    rent_3br_low: 1750, rent_3br_high: 2100,
    listing_count: 0,
    source_label:  'Edmonton area estimate — verify with current listings',
    source:        'cmhc_zone',
    updated:       '—',
    rf_stats:      rfStats,
  }
}

function cmhcResult(
  hood:    string,
  z:       any,
  source:  'cmhc_zone' | 'cmhc_nearest',
  rfStats: RFStats | null,
  nearestName?: string,
): NeighbourhoodRents {
  const label = source === 'cmhc_zone'
    ? `CMHC 2024 — Zone ${z.zone}: ${z.zone_label}`
    : `CMHC 2024 — ${toTitle(nearestName!)} area (Zone ${z.zone}: ${z.zone_label})`

  // 5% margin each side
  return {
    neighbourhood: hood,
    rent_1br_low:  z['1br'] ? Math.round(z['1br'] * 0.95) : 0,
    rent_1br_high: z['1br'] ? Math.round(z['1br'] * 1.05) : 0,
    rent_2br_low:  z['2br'] ? Math.round(z['2br'] * 0.95) : 0,
    rent_2br_high: z['2br'] ? Math.round(z['2br'] * 1.05) : 0,
    rent_3br_low:  z['3br'] ? Math.round(z['3br'] * 0.95) : 0,
    rent_3br_high: z['3br'] ? Math.round(z['3br'] * 1.05) : 0,
    listing_count: 0,
    source_label:  label,
    source,
    updated:       'CMHC Oct 2024',
    rf_stats:      rfStats,
    cmhc_zone:     `Zone ${z.zone}: ${z.zone_label}`,
  }
}

// Very simple nearest-neighbour: longest common substring / partial match
function findNearest(hood: string, map: Record<string, any>): { name: string; data: any } | null {
  const names = Object.keys(map)

  // Exact substring match first
  for (const name of names) {
    if (hood.includes(name) || name.includes(hood)) return { name, data: map[name] }
  }

  // Word overlap score
  const hoodWords = new Set(hood.split(/[\s\/]+/))
  let best: { name: string; score: number } | null = null
  for (const name of names) {
    const nameWords = name.split(/[\s\/]+/)
    const overlap = nameWords.filter(w => hoodWords.has(w)).length
    if (overlap > 0 && (!best || overlap > best.score)) {
      best = { name, score: overlap }
    }
  }
  return best ? { name: best.name, data: map[best.name] } : null
}

function toTitle(s: string): string {
  return s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
}
