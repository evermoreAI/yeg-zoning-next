/** A geocoded address result from Mapbox */
export interface SearchResult {
  address: string
  lat: number
  lng: number
}

/** Instruction for MapView to fly to a location */
export interface FlyToTarget {
  lat: number
  lng: number
  zoom?: number
}

/** Raw response from Edmonton GIS FeatureServer */
export interface RawGisZone {
  found: boolean
  zone_code: string       // e.g. "RS", "MU h16 f3.5 cf" raw string
  zone_string: string     // full ZONING_STRING with modifiers
  zone_desc: string       // DESCRIPTION plain text from GIS
  bylaw_url: string
  error?: string
  fetched_at: string      // ISO timestamp
}

/** Fully interpreted zone data — shaped for ZonePanel display */
export interface ZoneDisplay {
  found: boolean
  // Core identity
  zone_code: string         // clean base code e.g. "RS"
  zone_string: string       // full string with modifiers e.g. "RS h9.5"
  zone_name: string         // plain language e.g. "Small Scale Residential"
  zone_desc: string         // GIS description field

  // Layer 1 metrics
  max_units: string         // display string e.g. "8" or "—"
  max_units_note: string    // e.g. "Mid-block, lot ≥ 600m²"
  height: string            // display string e.g. "3 storeys" or "—"
  height_note: string       // e.g. "Under review Apr 7 2026"
  coverage: string          // display string e.g. "45%"
  coverage_note: string
  lot_threshold: string     // display string e.g. "600 m²"
  lot_threshold_note: string

  // Flags
  amendment_warning: boolean
  amendment_text: string
  dc_warning: boolean

  // Meta
  bylaw_url: string | null
  fetched_at: string        // ISO timestamp shown as freshness indicator
  error?: string
}
