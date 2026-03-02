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
  // Parcel coordinates — needed for bookmarking
  lat?: number
  lng?: number
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
  // Nearby permits & momentum (populated by /api/zone)
  permits?: import('@/lib/developmentPermits').DevelopmentPermit[]
  momentum?: NeighbourhoodMomentum
  assessment?: import('@/lib/propertyAssessment').PropertyAssessment | null
  neighbourhoodScore?: import('@/lib/neighbourhoodScore').NeighbourhoodScore | null
  rezoning_alert?: import('@/lib/rezonings').RezoningApplication | null
  permit_stats?: import('@/lib/permitStats').PermitStats | null
  rental_data?: import('@/lib/rentalData').NeighbourhoodRents | null
  dc_rules?: import('@/lib/dcZoneExtractor').DCZoneRules | null
}

export interface NeighbourhoodMomentum {
  recent: number
  prior:  number
  trend:  'ACCELERATING' | 'ACTIVE' | 'COOLING'
}

/** A single strategic flag shown in feasibility panel */
export interface FeasibilityFlag {
  type: 'amber' | 'green'
  text: string
}

/** Fully computed feasibility result — shaped for FeasibilityPanel display */
export interface FeasibilityResult {
  /** Can we generate a meaningful estimate for this zone? */
  calculable: boolean

  /** Plain language summary sentence */
  summary: string

  /** Max units used in calculation */
  units: number

  /** Construction cost range (CAD) */
  cost_low:  number
  cost_high: number
  cost_label: string
  cost_label_cta: string

  /** Monthly gross revenue range (CAD) */
  monthly_low:  number
  monthly_high: number

  /** Annual gross revenue range (CAD) */
  annual_low:  number
  annual_high: number
  revenue_label: string

  /** Gross yield range as percentage */
  yield_low:  number   // e.g. 8.6
  yield_high: number   // e.g. 12.0
  yield_caveat: string

  /** Strategic flags — amber warnings and green opportunities */
  flags: FeasibilityFlag[]

  /** Disclaimer text — required on every display */
  disclaimer: string

  /** Rent source label — neighbourhood-specific or city-wide fallback */
  rent_source_label: string
}
