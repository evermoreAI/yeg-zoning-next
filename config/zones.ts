/**
 * config/zones.ts
 *
 * Single source of truth for all Edmonton Bylaw 20001 zone codes.
 * Port of config/zones.py from the Streamlit project.
 *
 * NEVER hardcode zone rules anywhere else in the codebase.
 * Update this file after every public hearing or bylaw amendment.
 *
 * Source: Zoning Bylaw 20001 (Charter Bylaw 20001), effective January 1 2024
 * Last verified: February 28 2026
 */

// ---------------------------------------------------------------------------
// ACTIVE AMENDMENTS — check before every public hearing
// ---------------------------------------------------------------------------
// April 7 2026: RS height limit public hearing — may change to 9.5m
// Feb 17 2026:  RS 8-unit mid-block cap CONFIRMED STABLE (Council vote 8-4)
// ---------------------------------------------------------------------------

export interface ZoneConfig {
  plain_name: string
  short_desc: string
  max_units_midblock: number | null
  max_units_midblock_min_lot_sqm: number | null
  max_site_coverage_pct: number | null
  max_height_storeys: number | null
  max_height_m: number | null
  bylaw_12800_equiv: string | null
  applies_to: string
  pending_amendment: string | null  // null = stable
  dc_override: boolean
  color: string                     // map overlay colour
  bylaw_url: string | null
}

export const ZONES: Record<string, ZoneConfig> = {

  // ── Residential ──────────────────────────────────────────────────────────

  RS: {
    // Bylaw 20001 Section 2.10 — Small Scale Residential
    plain_name: 'Small Scale Residential',
    short_desc: 'Allows up to 8 units on lots 600m² or larger. Some commercial uses permitted.',
    max_units_midblock: 8,                  // confirmed stable Feb 17 2026 (Council 8-4)
    max_units_midblock_min_lot_sqm: 600,    // Bylaw 20001 RS — lot threshold for 8-unit eligibility
    max_site_coverage_pct: 45,             // Bylaw 20001 RS s.2.10
    max_height_storeys: 3,                 // Bylaw 20001 RS — PENDING April 7 2026 hearing
    max_height_m: null,                    // under review — do not display a fixed number
    bylaw_12800_equiv: 'RF1 / RF3',
    applies_to: 'Mature neighbourhoods inside Anthony Henday Drive',
    // Pending amendment: proposed reduction to 9.5m max height — outcome unknown
    pending_amendment: 'Height limit subject to change — public hearing April 7 2026. Verify with City of Edmonton before making development decisions.',
    dc_override: false,
    color: '#4a7c59',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rs',
  },

  RSF: {
    // Bylaw 20001 — Small Scale Residential (suburban)
    plain_name: 'Small Scale Residential Suburban',
    short_desc: 'Suburban equivalent of RS zone. Higher site coverage allowed.',
    max_units_midblock: null,
    max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: 55,
    max_height_storeys: null,
    max_height_m: null,
    bylaw_12800_equiv: 'RF1',
    applies_to: 'Suburban areas outside mature neighbourhoods',
    pending_amendment: null,
    dc_override: false,
    color: '#5a8c69',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rsf',
  },

  RSL: {
    // Bylaw 20001 — Small Scale Residential Low
    plain_name: 'Small Scale Residential Low',
    short_desc: 'Lower density residential. Fewer units than RS.',
    max_units_midblock: null,
    max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null,
    max_height_storeys: null,
    max_height_m: null,
    bylaw_12800_equiv: 'RF1',
    applies_to: 'Lower density residential areas',
    pending_amendment: null,
    dc_override: false,
    color: '#3a6c49',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rsl',
  },

  RSM: {
    // Bylaw 20001 — Small Medium Scale Residential
    plain_name: 'Small to Medium Scale Residential',
    short_desc: '3–4 storeys. Rezoning harder outside transit nodes and arterial roads.',
    max_units_midblock: null,
    max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: 45,
    max_height_storeys: 4,
    max_height_m: 10.0,
    bylaw_12800_equiv: 'RF3 / RF4',
    applies_to: 'Near transit stations and arterial roads',
    pending_amendment: null,
    dc_override: false,
    color: '#6b8f71',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rsm',
  },

  RM: {
    // Bylaw 20001 — Medium Scale Residential
    plain_name: 'Medium Scale Residential',
    short_desc: '4–8 storeys. Medium density apartments and stacked housing.',
    max_units_midblock: null,
    max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null,
    max_height_storeys: 8,
    max_height_m: null,
    bylaw_12800_equiv: 'RA7 / RA8',
    applies_to: 'Medium density residential areas',
    pending_amendment: null,
    dc_override: false,
    color: '#5b7fa6',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rm',
  },

  RH: {
    // Bylaw 20001 — High Rise Residential
    plain_name: 'High Rise Residential',
    short_desc: '9–20 storeys. High density apartments.',
    max_units_midblock: null,
    max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null,
    max_height_storeys: 20,
    max_height_m: null,
    bylaw_12800_equiv: 'RA9',
    applies_to: 'High density residential nodes',
    pending_amendment: null,
    dc_override: false,
    color: '#3a5f8a',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rh',
  },

  RR: {
    // Bylaw 20001 — Rural Residential
    plain_name: 'Rural Residential',
    short_desc: 'Rural and agricultural edge areas.',
    max_units_midblock: null,
    max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null,
    max_height_storeys: null,
    max_height_m: null,
    bylaw_12800_equiv: 'AG',
    applies_to: 'Rural and agricultural edge areas',
    pending_amendment: null,
    dc_override: false,
    color: '#3a5c3a',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rr',
  },

  // ── Mixed Use ─────────────────────────────────────────────────────────────

  MU: {
    // Bylaw 20001 — Mixed Use
    plain_name: 'Mixed Use',
    short_desc: 'Nodes and corridors. Residential and commercial combined.',
    max_units_midblock: null,
    max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null,
    max_height_storeys: null,
    max_height_m: null,
    bylaw_12800_equiv: 'CMX',
    applies_to: 'Transit nodes, arterial road corridors, ARP areas',
    pending_amendment: null,
    dc_override: false,
    color: '#8b6914',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/mu',
  },

  MUN: {
    // Bylaw 20001 — Mixed Use Neighbourhood
    plain_name: 'Mixed Use Neighbourhood',
    short_desc: 'Neighbourhood-scale mixed use.',
    max_units_midblock: null,
    max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null,
    max_height_storeys: null,
    max_height_m: null,
    bylaw_12800_equiv: null,
    applies_to: 'Neighbourhood centres',
    pending_amendment: null,
    dc_override: false,
    color: '#9b7924',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/mun',
  },

  // ── Commercial ───────────────────────────────────────────────────────────

  CN: {
    plain_name: 'Neighbourhood Commercial',
    short_desc: 'Small-scale neighbourhood-serving commercial uses.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'CSC', applies_to: 'Neighbourhood commercial nodes',
    pending_amendment: null, dc_override: false, color: '#a0522d',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/cn',
  },
  CG: {
    plain_name: 'General Commercial',
    short_desc: 'General commercial strip development.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'CB2', applies_to: 'Commercial arterial roads',
    pending_amendment: null, dc_override: false, color: '#b0622d',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/cg',
  },
  CB: {
    plain_name: 'Commercial Business',
    short_desc: 'Office and service commercial.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'CB1', applies_to: 'Business commercial areas',
    pending_amendment: null, dc_override: false, color: '#c0722d',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/cb',
  },

  // ── Business / Industrial ────────────────────────────────────────────────

  BE: {
    plain_name: 'Business Employment',
    short_desc: 'Employment and light industrial uses.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'IB', applies_to: 'Business parks and employment areas',
    pending_amendment: null, dc_override: false, color: '#696969',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/be',
  },
  IM: {
    plain_name: 'Medium Industrial',
    short_desc: 'Medium impact industrial uses.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'IM', applies_to: 'Industrial areas',
    pending_amendment: null, dc_override: false, color: '#595959',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/im',
  },
  IH: {
    plain_name: 'Heavy Industrial',
    short_desc: 'Heavy impact industrial uses.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'IH', applies_to: 'Heavy industrial areas',
    pending_amendment: null, dc_override: false, color: '#494949',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/ih',
  },

  // ── Direct Control — ALWAYS show red warning ─────────────────────────────

  DC1: {
    // Bylaw 20001 — Direct Control Provision
    plain_name: 'Direct Control',
    short_desc: 'Site-specific rules override all standard zone regulations.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'DC1',
    applies_to: 'Site-specific direct control parcels',
    pending_amendment: null,
    dc_override: true,   // CRITICAL — never show standard zone rules for DC
    color: '#8b1a1a',
    bylaw_url: null,
  },
  DC2: {
    plain_name: 'Direct Control',
    short_desc: 'Site-specific rules override all standard zone regulations.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'DC2',
    applies_to: 'Site-specific direct control parcels',
    pending_amendment: null,
    dc_override: true,
    color: '#8b1a1a',
    bylaw_url: null,
  },
}

/**
 * Look up a zone by code. Handles DC zones with any suffix.
 * Returns the config or null if unknown.
 */
export function getZoneConfig(zoneCode: string): ZoneConfig | null {
  const base = zoneCode.trim().toUpperCase()
  if (ZONES[base]) return ZONES[base]
  // DC zones can have any suffix — DC1, DC2, DC(999), etc.
  if (base.startsWith('DC')) return ZONES['DC1']
  return null
}
