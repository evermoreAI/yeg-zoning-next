/** A geocoded address result from Mapbox */
export interface SearchResult {
  address: string   // display string — street + city, truncated
  lat: number
  lng: number
}

/** Instruction for MapView to fly to a location */
export interface FlyToTarget {
  lat: number
  lng: number
  zoom?: number
}

/** Raw zone data returned from /api/zone */
export interface RawZone {
  found: boolean
  zone_code: string
  zone_string: string
  zone_desc: string
  bylaw_url: string
  error?: string
  fetched_at: string   // ISO timestamp
}
