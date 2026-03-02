/**
 * lib/neighbourhoodProfiles.ts
 *
 * Edmonton neighbourhood demographics from Edmonton Open Data.
 * Cached to scraper/neighbourhoodProfiles.json, refreshed weekly.
 *
 * Source: https://data.edmonton.ca/resource/ndse-fznj.json
 */

import * as fs from 'fs'
import * as path from 'path'

const CACHE_PATH = path.join(process.cwd(), 'scraper', 'neighbourhoodProfiles.json')
const CACHE_TTL = 7 * 24 * 60 * 60 * 1_000 // 7 days

export interface NeighbourhoodProfile {
  neighbourhood: string
  population: number | null
  median_household_income: number | null
  average_household_size: number | null
  owner_percent: number | null
  renter_percent: number | null
  average_dwelling_age: number | null
  total_dwellings: number | null
}

let _cache: Map<string, NeighbourhoodProfile> | null = null
let _cacheTime = 0

async function fetchProfiles(): Promise<Map<string, NeighbourhoodProfile>> {
  try {
    const resp = await fetch('https://data.edmonton.ca/resource/ndse-fznj.json', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15_000),
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

    const rows: any[] = await resp.json()
    const map = new Map<string, NeighbourhoodProfile>()

    for (const row of rows) {
      const name = (row.neighbourhood || '').trim().toUpperCase()
      if (!name) continue

      map.set(name, {
        neighbourhood: name,
        population: _toNum(row.population),
        median_household_income: _toNum(row.median_household_income),
        average_household_size: _toFloat(row.average_household_size),
        owner_percent: _toFloat(row.owner_percent),
        renter_percent: _toFloat(row.renter_percent),
        average_dwelling_age: _toFloat(row.average_dwelling_age),
        total_dwellings: _toNum(row.total_dwellings),
      })
    }

    return map
  } catch (e) {
    console.warn('[neighbourhoodProfiles] fetch failed:', (e as Error).message)
    return new Map()
  }
}

function _toNum(v: any): number | null {
  if (v === null || v === undefined) return null
  const n = parseInt(String(v), 10)
  return isNaN(n) ? null : n
}

function _toFloat(v: any): number | null {
  if (v === null || v === undefined) return null
  const f = parseFloat(String(v))
  return isNaN(f) ? null : f
}

export async function getNeighbourhoodProfile(
  neighbourhood: string,
): Promise<NeighbourhoodProfile | null> {
  const hood = (neighbourhood || '').trim().toUpperCase()
  if (!hood) return null

  // Load from cache (memory or disk)
  if (!_cache || Date.now() - _cacheTime > CACHE_TTL) {
    try {
      if (fs.existsSync(CACHE_PATH)) {
        const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'))
        _cache = new Map(data.neighbourhoods || [])
        _cacheTime = data.cached_at || Date.now()
      } else {
        _cache = await fetchProfiles()
        _cacheTime = Date.now()
      }
    } catch (e) {
      console.warn('[neighbourhoodProfiles] cache load failed:', e)
      _cache = await fetchProfiles()
      _cacheTime = Date.now()
    }
  }

  return _cache?.get(hood) ?? null
}
