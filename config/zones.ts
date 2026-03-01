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
// ACTIVE AMENDMENTS
// April 7 2026: RS height limit public hearing — may change to 9.5m
// Feb 17 2026:  RS 8-unit mid-block cap CONFIRMED STABLE (Council 8-4)
// ---------------------------------------------------------------------------

export interface ZoneLinks {
  bylaw:                   string | null
  assessment:              string | null
  development_applications: string | null
}

export interface ZoneSetbacks {
  front: number   // metres
  rear:  number   // metres
  side:  number   // metres — interior side
}

export interface ZoneLayer2 {
  permitted_uses:     string[]
  discretionary_uses: string[]
  setbacks_m:         ZoneSetbacks
  setback_note:       string
  corner_lot_note:    string
  links:              ZoneLinks
}

export interface ZoneConfig {
  // Layer 1
  plain_name:                   string
  short_desc:                   string
  max_units_midblock:           number | null
  max_units_midblock_min_lot_sqm: number | null
  max_site_coverage_pct:        number | null
  max_height_storeys:           number | null
  max_height_m:                 number | null
  bylaw_12800_equiv:            string | null
  applies_to:                   string
  pending_amendment:            string | null
  dc_override:                  boolean
  color:                        string
  bylaw_url:                    string | null
  // Layer 2 — null for zones without detail data yet
  layer2:                       ZoneLayer2 | null
}

export const ZONES: Record<string, ZoneConfig> = {

  // ── Residential ──────────────────────────────────────────────────────────

  RS: {
    // Bylaw 20001 Section 2.10 — Small Scale Residential
    plain_name: 'Small Scale Residential',
    short_desc: 'Allows up to 8 units on lots 600m² or larger. Some commercial uses permitted.',
    max_units_midblock: 8,                   // confirmed stable Feb 17 2026 (Council 8-4)
    max_units_midblock_min_lot_sqm: 600,     // Bylaw 20001 RS — lot threshold for 8-unit eligibility
    max_site_coverage_pct: 45,              // Bylaw 20001 RS s.2.10
    max_height_storeys: 3,                  // Bylaw 20001 RS — PENDING April 7 2026 hearing
    max_height_m: null,                     // under review — do not display a fixed number
    bylaw_12800_equiv: 'RF1 / RF3',
    applies_to: 'Mature neighbourhoods inside Anthony Henday Drive',
    pending_amendment: 'Height limit subject to change — public hearing April 7 2026. Verify with City of Edmonton before making development decisions.',
    dc_override: false,
    color: '#4a7c59',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rs',
    layer2: {
      // Permitted uses: Bylaw 20001 RS zone — as-of-right, no DO approval needed
      permitted_uses: [
        'Single detached house',
        'Secondary suite',
        'Garden suite',
        'Semi-detached house',
        'Row housing',
        'Home-based business',
        'Child care facility (small)',
        'Urban agriculture',
      ],
      // Discretionary uses: require Development Officer approval — not guaranteed
      discretionary_uses: [
        'Neighbourhood café or bistro',
        'Neighbourhood retail (small scale)',
        'Medical or dental office',
        'Personal service shop (e.g. hair salon)',
        'Secondary suite in semi-detached',
        'Bed and breakfast',
      ],
      // Setbacks: Bylaw 20001 RS — contextual rules in effect since July 2025
      // Typical minimums — actual values vary by neighbourhood
      setbacks_m: {
        front: 3.0,   // Bylaw 20001 contextual front setback
        rear:  4.0,   // Bylaw 20001 rear setback
        side:  1.2,   // Bylaw 20001 interior side setback
      },
      setback_note: 'Contextual setbacks apply — actual values vary by neighbourhood. Verify with City of Edmonton.',
      corner_lot_note: 'Corner lots may support more than 8 units. Verify current rules with City of Edmonton via 311.',
      links: {
        bylaw:                    'https://zoningbylaw.edmonton.ca/bylaw/rs',
        assessment:               'https://www.edmonton.ca/business_economy/property-assessment',
        development_applications: 'https://www.edmonton.ca/business_economy/development-applications',
      },
    },
  },

  RSF: {
    // Bylaw 20001 Section 2.11 — Small Scale Flex Residential
    // TODO: verify exact section number against zoningbylaw.edmonton.ca
    plain_name: 'Small Scale Flex Residential',
    short_desc: 'Flexible small-scale residential. Up to 8 units on lots 600m²+. Applies to suburban and transitional areas.',
    max_units_midblock: 8,                   // mirrors RS rules — verify with zoningbylaw.edmonton.ca
    max_units_midblock_min_lot_sqm: 600,     // same 600m² threshold as RS
    max_site_coverage_pct: 45,              // Bylaw 20001 RSF
    max_height_storeys: 3,                  // PENDING April 7 2026 hearing — same hearing covers RSF
    max_height_m: null,
    bylaw_12800_equiv: 'RF1',
    applies_to: 'Suburban and transitional areas across Edmonton',
    pending_amendment: 'Height limit subject to change — public hearing April 7 2026 may affect RSF zone. Verify with City of Edmonton before making development decisions.',
    dc_override: false,
    color: '#5a8c69',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rsf',
    layer2: {
      permitted_uses: [
        'Single detached house',
        'Secondary suite',
        'Garden suite',
        'Semi-detached house',
        'Row housing',
        'Home-based business',
        'Child care facility (small)',
        'Urban agriculture',
      ],
      discretionary_uses: [
        'Neighbourhood café or bistro',
        'Neighbourhood retail (small scale)',
        'Medical or dental office',
        'Personal service shop (e.g. hair salon)',
        'Bed and breakfast',
      ],
      setbacks_m: {
        front: 4.5,   // Bylaw 20001 RSF — typical suburban front setback
        rear:  4.0,
        side:  1.2,
      },
      setback_note: 'Setbacks are typical minimums. Contextual rules may apply — verify with City of Edmonton.',
      corner_lot_note: 'Corner lots may support more than 8 units. Verify current rules with City of Edmonton via 311.',
      links: {
        bylaw:                    'https://zoningbylaw.edmonton.ca/bylaw/rsf',
        assessment:               'https://www.edmonton.ca/business_economy/property-assessment',
        development_applications: 'https://www.edmonton.ca/business_economy/development-applications',
      },
    },
  },

  RSL: {
    plain_name: 'Small Scale Residential Low',
    short_desc: 'Lower density residential. Fewer units than RS.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'RF1', applies_to: 'Lower density residential areas',
    pending_amendment: null, dc_override: false, color: '#3a6c49',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rsl', layer2: null,
  },

  RSM: {
    plain_name: 'Small to Medium Scale Residential',
    short_desc: '3–4 storeys. Rezoning harder outside transit nodes and arterial roads.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: 45, max_height_storeys: 4, max_height_m: 10.0,
    bylaw_12800_equiv: 'RF3 / RF4', applies_to: 'Near transit stations and arterial roads',
    pending_amendment: null, dc_override: false, color: '#6b8f71',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rsm', layer2: null,
  },

  RM: {
    // Bylaw 20001 Section 2.30 — Row Housing (RM)
    // TODO: verify exact section number and unit cap against zoningbylaw.edmonton.ca
    plain_name: 'Row Housing',
    short_desc: 'Attached row housing. Up to 8 units, maximum 3 storeys, 45% site coverage.',
    max_units_midblock: 8,
    max_units_midblock_min_lot_sqm: null,    // no minimum lot threshold specified — check bylaw
    max_site_coverage_pct: 45,
    max_height_storeys: 3,
    max_height_m: null,
    bylaw_12800_equiv: 'RF4 / RF5',
    applies_to: 'Medium density residential areas across Edmonton',
    pending_amendment: null,
    dc_override: false,
    color: '#5b7fa6',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rm',
    layer2: {
      permitted_uses: [
        'Row housing',
        'Semi-detached house',
        'Secondary suite',
        'Garden suite',
        'Home-based business',
        'Child care facility (small)',
        'Urban agriculture',
      ],
      discretionary_uses: [
        'Single detached house',
        'Stacked row housing',
        'Live-work unit',
        'Bed and breakfast',
      ],
      setbacks_m: {
        front: 3.0,
        rear:  4.0,
        side:  1.5,
      },
      setback_note: 'Setbacks are typical minimums for RM zone — verify with City of Edmonton.',
      corner_lot_note: 'Corner lots may support additional units or layouts. Verify with City of Edmonton via 311.',
      links: {
        bylaw:                    'https://zoningbylaw.edmonton.ca/bylaw/rm',
        assessment:               'https://www.edmonton.ca/business_economy/property-assessment',
        development_applications: 'https://www.edmonton.ca/business_economy/development-applications',
      },
    },
  },

  RH: {
    // Bylaw 20001 — Row Housing Medium (RH)
    // TODO: confirm exact section; verify unit cap and height against zoningbylaw.edmonton.ca
    plain_name: 'Row Housing Medium',
    short_desc: 'Medium-density row housing. Up to 12 units, maximum 4 storeys, 50% site coverage.',
    max_units_midblock: 12,
    max_units_midblock_min_lot_sqm: 600,
    max_site_coverage_pct: 50,
    max_height_storeys: 4,
    max_height_m: null,
    bylaw_12800_equiv: 'RF5 / RA7',
    applies_to: 'Medium density residential areas',
    pending_amendment: null,
    dc_override: false,
    color: '#3a5f8a',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rh',
    layer2: {
      permitted_uses: [
        'Row housing',
        'Stacked row housing',
        'Semi-detached house',
        'Secondary suite',
        'Home-based business',
        'Child care facility (small)',
        'Urban agriculture',
      ],
      discretionary_uses: [
        'Single detached house',
        'Garden suite',
        'Live-work unit',
        'Bed and breakfast',
        'Neighbourhood retail (ground floor)',
      ],
      setbacks_m: {
        front: 3.0,
        rear:  4.0,
        side:  1.5,
      },
      setback_note: 'Typical minimums — verify exact setbacks with City of Edmonton.',
      corner_lot_note: 'Corner lots may support additional units. Verify with City of Edmonton via 311.',
      links: {
        bylaw:                    'https://zoningbylaw.edmonton.ca/bylaw/rh',
        assessment:               'https://www.edmonton.ca/business_economy/property-assessment',
        development_applications: 'https://www.edmonton.ca/business_economy/development-applications',
      },
    },
  },

  RR: {
    plain_name: 'Rural Residential',
    short_desc: 'Rural and agricultural edge areas.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'AG', applies_to: 'Rural and agricultural edge areas',
    pending_amendment: null, dc_override: false, color: '#3a5c3a',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/rr', layer2: null,
  },

  MU: {
    // Bylaw 20001 — Medium Scale Mixed Use (MU)
    // TODO: verify exact unit cap and height limits against zoningbylaw.edmonton.ca
    plain_name: 'Medium Scale Mixed Use',
    short_desc: 'Residential and commercial combined. Up to 12 units, 6 storeys, ground floor retail.',
    max_units_midblock: 12,
    max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: 60,
    max_height_storeys: 6,
    max_height_m: null,
    bylaw_12800_equiv: 'CMX',
    applies_to: 'Transit nodes, arterial road corridors, and ARP areas',
    pending_amendment: null,
    dc_override: false,
    color: '#8b6914',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/mu',
    layer2: {
      permitted_uses: [
        'Multi-unit residential (upper floors)',
        'Ground floor retail',
        'Restaurant or café',
        'Office (upper floors)',
        'Personal service shop',
        'Child care facility',
        'Urban agriculture',
        'Live-work unit',
      ],
      discretionary_uses: [
        'Drive-through facility',
        'Gas station (neighbourhood scale)',
        'Hotel or motel',
        'Entertainment venue',
        'Brewery or distillery (small)',
      ],
      setbacks_m: {
        front: 0.0,   // MU zones typically build to property line
        rear:  3.0,
        side:  0.0,
      },
      setback_note: 'MU zones often have zero or minimal front setbacks — verify with City of Edmonton.',
      corner_lot_note: 'Corner MU lots may support additional height or density. Verify with City of Edmonton via 311.',
      links: {
        bylaw:                    'https://zoningbylaw.edmonton.ca/bylaw/mu',
        assessment:               'https://www.edmonton.ca/business_economy/property-assessment',
        development_applications: 'https://www.edmonton.ca/business_economy/development-applications',
      },
    },
  },

  MUN: {
    plain_name: 'Mixed Use Neighbourhood',
    short_desc: 'Neighbourhood-scale mixed use.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: null, applies_to: 'Neighbourhood centres',
    pending_amendment: null, dc_override: false, color: '#9b7924',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/mun', layer2: null,
  },

  CN: {
    plain_name: 'Neighbourhood Commercial', short_desc: 'Small-scale neighbourhood-serving commercial uses.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'CSC', applies_to: 'Neighbourhood commercial nodes',
    pending_amendment: null, dc_override: false, color: '#a0522d',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/cn', layer2: null,
  },
  CG: {
    plain_name: 'General Commercial', short_desc: 'General commercial strip development.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'CB2', applies_to: 'Commercial arterial roads',
    pending_amendment: null, dc_override: false, color: '#b0622d',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/cg', layer2: null,
  },
  CB: {
    plain_name: 'Commercial Business', short_desc: 'Office and service commercial.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'CB1', applies_to: 'Business commercial areas',
    pending_amendment: null, dc_override: false, color: '#c0722d',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/cb', layer2: null,
  },
  BE: {
    plain_name: 'Business Employment', short_desc: 'Employment and light industrial uses.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'IB', applies_to: 'Business parks and employment areas',
    pending_amendment: null, dc_override: false, color: '#696969',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/be', layer2: null,
  },
  IM: {
    plain_name: 'Medium Industrial', short_desc: 'Medium impact industrial uses.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'IM', applies_to: 'Industrial areas',
    pending_amendment: null, dc_override: false, color: '#595959',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/im', layer2: null,
  },
  IH: {
    plain_name: 'Heavy Industrial', short_desc: 'Heavy impact industrial uses.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'IH', applies_to: 'Heavy industrial areas',
    pending_amendment: null, dc_override: false, color: '#494949',
    bylaw_url: 'https://zoningbylaw.edmonton.ca/bylaw/ih', layer2: null,
  },

  DC1: {
    plain_name: 'Direct Control', short_desc: 'Site-specific rules override all standard zone regulations.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'DC1', applies_to: 'Site-specific direct control parcels',
    pending_amendment: null, dc_override: true, color: '#8b1a1a',
    bylaw_url: null, layer2: null,
  },
  DC2: {
    plain_name: 'Direct Control', short_desc: 'Site-specific rules override all standard zone regulations.',
    max_units_midblock: null, max_units_midblock_min_lot_sqm: null,
    max_site_coverage_pct: null, max_height_storeys: null, max_height_m: null,
    bylaw_12800_equiv: 'DC2', applies_to: 'Site-specific direct control parcels',
    pending_amendment: null, dc_override: true, color: '#8b1a1a',
    bylaw_url: null, layer2: null,
  },
}

export function getZoneConfig(zoneCode: string): ZoneConfig | null {
  const base = zoneCode.trim().toUpperCase()
  if (ZONES[base]) return ZONES[base]
  if (base.startsWith('DC')) return ZONES['DC1']
  return null
}
