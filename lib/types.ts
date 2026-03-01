import type { ZoneLayer2 } from '@/config/zones'

export interface SearchResult {
  address: string
  lat: number
  lng: number
}

export interface FlyToTarget {
  lat: number
  lng: number
  zoom?: number
}

export interface RawGisZone {
  found: boolean
  zone_code: string
  zone_string: string
  zone_desc: string
  bylaw_url: string
  error?: string
  fetched_at: string
}

export interface ZoneDisplay {
  found: boolean
  // Core identity
  zone_code: string
  zone_string: string
  zone_name: string
  zone_desc: string
  // Layer 1 metrics
  max_units: string
  max_units_note: string
  height: string
  height_note: string
  coverage: string
  coverage_note: string
  lot_threshold: string
  lot_threshold_note: string
  // Flags
  amendment_warning: boolean
  amendment_text: string
  dc_warning: boolean
  // Layer 2 — null when zone has no detail data
  layer2: ZoneLayer2 | null
  bylaw_12800_equiv: string | null
  // Meta
  bylaw_url: string | null
  fetched_at: string
  error?: string
}
