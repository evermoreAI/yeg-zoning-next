/**
 * lib/zoneInterpreter.ts
 *
 * Converts raw Edmonton GIS zone data into a fully shaped ZoneDisplay object.
 * All business logic lives here — ZonePanel.tsx is pure display only.
 * Port of logic/zone_interpreter.py from the Streamlit project.
 */

import type { RawGisZone, ZoneDisplay } from './types'
import { getZoneConfig }                from '@/config/zones'

/**
 * Interpret raw GIS zone data into display-ready ZoneDisplay.
 *
 * @param raw  RawGisZone from edmontonGis.ts
 * @returns    ZoneDisplay shaped for ZonePanel
 */
export function interpretZone(raw: RawGisZone): ZoneDisplay {
  // Pass-through error state
  if (!raw.found || !raw.zone_code) {
    return {
      found:              false,
      zone_code:          '',
      zone_string:        '',
      zone_name:          'Unknown Zone',
      zone_desc:          raw.zone_desc || '',
      max_units:          '—',
      max_units_note:     '',
      height:             '—',
      height_note:        '',
      coverage:           '—',
      coverage_note:      '',
      lot_threshold:      '—',
      lot_threshold_note: '',
      amendment_warning:  false,
      amendment_text:     '',
      dc_warning:         false,
      bylaw_url:          null,
      fetched_at:         raw.fetched_at,
      error:              raw.error,
    }
  }

  const cfg = getZoneConfig(raw.zone_code)
  const isDC = raw.zone_code.toUpperCase().startsWith('DC') || (cfg?.dc_override ?? false)

  // ── DC zones: never show standard rules ─────────────────────────────────
  if (isDC) {
    return {
      found:              true,
      zone_code:          raw.zone_code,
      zone_string:        raw.zone_string,
      zone_name:          cfg?.plain_name ?? 'Direct Control',
      zone_desc:          raw.zone_desc,
      max_units:          '—',
      max_units_note:     'Site-specific — see bylaw',
      height:             '—',
      height_note:        'Site-specific — see bylaw',
      coverage:           '—',
      coverage_note:      'Site-specific — see bylaw',
      lot_threshold:      '—',
      lot_threshold_note: 'Site-specific — see bylaw',
      amendment_warning:  false,
      amendment_text:     '',
      dc_warning:         true,
      bylaw_url:          raw.bylaw_url || null,
      fetched_at:         raw.fetched_at,
    }
  }

  // ── Unknown zone — config missing ────────────────────────────────────────
  if (!cfg) {
    return {
      found:              true,
      zone_code:          raw.zone_code,
      zone_string:        raw.zone_string,
      zone_name:          raw.zone_desc || raw.zone_code,
      zone_desc:          raw.zone_desc,
      max_units:          '—',
      max_units_note:     'Verify with City of Edmonton',
      height:             '—',
      height_note:        '',
      coverage:           '—',
      coverage_note:      '',
      lot_threshold:      '—',
      lot_threshold_note: '',
      amendment_warning:  false,
      amendment_text:     '',
      dc_warning:         false,
      bylaw_url:          raw.bylaw_url || null,
      fetched_at:         raw.fetched_at,
    }
  }

  // ── Normal zone ──────────────────────────────────────────────────────────

  // Max units
  const maxUnits     = cfg.max_units_midblock
  const minLot       = cfg.max_units_midblock_min_lot_sqm
  const maxUnitsStr  = maxUnits != null ? String(maxUnits) : '—'
  const maxUnitsNote = maxUnits != null && minLot != null
    ? `Mid-block, lot ≥ ${minLot} m²`
    : maxUnits != null
    ? 'Check bylaw for lot requirements'
    : 'Verify with City of Edmonton'

  // Height — RS height is under review, show storeys only
  const heightStoreys = cfg.max_height_storeys
  const heightM       = cfg.max_height_m
  let heightStr  = '—'
  let heightNote = ''
  if (heightStoreys != null && heightM != null) {
    heightStr  = `${heightStoreys} storeys`
    heightNote = `${heightM} m`
  } else if (heightStoreys != null) {
    heightStr  = `${heightStoreys} storeys`
    heightNote = cfg.pending_amendment ? 'Height under review' : ''
  } else if (heightM != null) {
    heightStr  = `${heightM} m`
  }

  // Coverage
  const coveragePct  = cfg.max_site_coverage_pct
  const coverageStr  = coveragePct != null ? `${coveragePct}%` : '—'
  const coverageNote = coveragePct != null ? 'Maximum site coverage' : 'Verify with City'

  // Lot threshold
  const lotThresholdStr  = minLot != null ? `${minLot} m²` : '—'
  const lotThresholdNote = minLot != null
    ? `Min. lot for ${maxUnits ?? '—'} units`
    : 'No minimum specified'

  return {
    found:              true,
    zone_code:          raw.zone_code,
    zone_string:        raw.zone_string,
    zone_name:          cfg.plain_name,
    zone_desc:          raw.zone_desc,
    max_units:          maxUnitsStr,
    max_units_note:     maxUnitsNote,
    height:             heightStr,
    height_note:        heightNote,
    coverage:           coverageStr,
    coverage_note:      coverageNote,
    lot_threshold:      lotThresholdStr,
    lot_threshold_note: lotThresholdNote,
    amendment_warning:  cfg.pending_amendment != null,
    amendment_text:     cfg.pending_amendment ?? '',
    dc_warning:         false,
    bylaw_url:          cfg.bylaw_url ?? raw.bylaw_url ?? null,
    fetched_at:         raw.fetched_at,
  }
}
