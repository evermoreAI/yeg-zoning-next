/**
 * lib/zoneInterpreter.ts
 *
 * Converts raw Edmonton GIS zone data into a fully shaped ZoneDisplay object.
 * All business logic lives here — ZonePanel.tsx is pure display only.
 */

import type { RawGisZone, ZoneDisplay } from './types'
import { getZoneConfig }                from '@/config/zones'

export function interpretZone(raw: RawGisZone): ZoneDisplay {
  const base: Omit<ZoneDisplay, 'layer2' | 'bylaw_12800_equiv'> = {
    found: false, zone_code: '', zone_string: '', zone_name: 'Unknown Zone',
    zone_desc: raw.zone_desc || '', max_units: '—', max_units_note: '',
    height: '—', height_note: '', coverage: '—', coverage_note: '',
    lot_threshold: '—', lot_threshold_note: '', amendment_warning: false,
    amendment_text: '', dc_warning: false, bylaw_url: null,
    fetched_at: raw.fetched_at, error: raw.error,
  }

  if (!raw.found || !raw.zone_code) return { ...base, layer2: null, bylaw_12800_equiv: null }

  const cfg  = getZoneConfig(raw.zone_code)
  const isDC = raw.zone_code.toUpperCase().startsWith('DC') || (cfg?.dc_override ?? false)

  if (isDC) {
    return {
      found: true, zone_code: raw.zone_code, zone_string: raw.zone_string,
      zone_name: cfg?.plain_name ?? 'Direct Control', zone_desc: raw.zone_desc,
      max_units: '—', max_units_note: 'Site-specific — see bylaw',
      height: '—', height_note: 'Site-specific — see bylaw',
      coverage: '—', coverage_note: 'Site-specific — see bylaw',
      lot_threshold: '—', lot_threshold_note: 'Site-specific — see bylaw',
      amendment_warning: false, amendment_text: '', dc_warning: true,
      layer2: null, bylaw_12800_equiv: cfg?.bylaw_12800_equiv ?? null,
      bylaw_url: raw.bylaw_url || null, fetched_at: raw.fetched_at,
    }
  }

  if (!cfg) {
    return {
      found: true, zone_code: raw.zone_code, zone_string: raw.zone_string,
      zone_name: raw.zone_desc || raw.zone_code, zone_desc: raw.zone_desc,
      max_units: '—', max_units_note: 'Verify with City of Edmonton',
      height: '—', height_note: '', coverage: '—', coverage_note: '',
      lot_threshold: '—', lot_threshold_note: '',
      amendment_warning: false, amendment_text: '', dc_warning: false,
      layer2: null, bylaw_12800_equiv: null,
      bylaw_url: raw.bylaw_url || null, fetched_at: raw.fetched_at,
    }
  }

  // Max units
  const maxUnits    = cfg.max_units_midblock
  const minLot      = cfg.max_units_midblock_min_lot_sqm
  const maxUnitsStr = maxUnits != null ? String(maxUnits) : '—'
  const maxUnitsNote = maxUnits != null && minLot != null
    ? `Mid-block, lot ≥ ${minLot} m²`
    : maxUnits != null ? 'Check bylaw for lot requirements' : 'Verify with City of Edmonton'

  // Height
  const hs = cfg.max_height_storeys, hm = cfg.max_height_m
  let heightStr = '—', heightNote = ''
  if (hs != null && hm != null) { heightStr = `${hs} storeys`; heightNote = `${hm} m` }
  else if (hs != null) { heightStr = `${hs} storeys`; heightNote = cfg.pending_amendment ? 'Height under review' : '' }
  else if (hm != null) { heightStr = `${hm} m` }

  const coveragePct   = cfg.max_site_coverage_pct
  const coverageStr   = coveragePct != null ? `${coveragePct}%` : '—'
  const coverageNote  = coveragePct != null ? 'Maximum site coverage' : 'Verify with City'
  const lotThreshStr  = minLot != null ? `${minLot} m²` : '—'
  const lotThreshNote = minLot != null ? `Min. lot for ${maxUnits ?? '—'} units` : 'No minimum specified'

  return {
    found: true, zone_code: raw.zone_code, zone_string: raw.zone_string,
    zone_name: cfg.plain_name, zone_desc: raw.zone_desc,
    max_units: maxUnitsStr, max_units_note: maxUnitsNote,
    height: heightStr, height_note: heightNote,
    coverage: coverageStr, coverage_note: coverageNote,
    lot_threshold: lotThreshStr, lot_threshold_note: lotThreshNote,
    amendment_warning: cfg.pending_amendment != null,
    amendment_text: cfg.pending_amendment ?? '',
    dc_warning: false,
    layer2: cfg.layer2 ?? null,
    bylaw_12800_equiv: cfg.bylaw_12800_equiv ?? null,
    bylaw_url: cfg.bylaw_url ?? raw.bylaw_url ?? null,
    fetched_at: raw.fetched_at,
  }
}
