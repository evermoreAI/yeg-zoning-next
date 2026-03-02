/**
 * lib/feasibility.ts
 *
 * Feasibility calculations for Edmonton zoning parcels.
 * All business logic lives here — FeasibilityPanel.tsx is pure display only.
 * Port of logic/feasibility.py from the Streamlit project.
 *
 * Returns null when a zone cannot be meaningfully analyzed
 * (DC zones, unknown zones, zones with no unit data).
 */

import type { ZoneDisplay }    from './types'
import type { FeasibilityResult, FeasibilityFlag } from './types'
import type { NeighbourhoodRents } from './rentalData'
import { MARKET_DATA }         from './marketData'
import { getZoneConfig }       from '@/config/zones'

/**
 * Calculate feasibility summary for a given zone display.
 *
 * @param zone  Interpreted zone data from zoneInterpreter.ts
 * @returns     FeasibilityResult, or null if zone cannot be analyzed
 *
 * Example: RS zone with 8 units → cost $1.44M–$2.0M, revenue $14,400/mo
 */
export function calculateFeasibility(
  zone: ZoneDisplay,
  rents?: NeighbourhoodRents | null,
): FeasibilityResult | null {
  // Cannot analyze: not found, DC override, or no unit data
  if (!zone.found || zone.dc_warning) return null

  const cfg   = getZoneConfig(zone.zone_code)
  const units = cfg?.max_units_midblock ?? null

  if (!units || units < 1) return null

  const md = MARKET_DATA

  // ── Construction cost ──────────────────────────────────────────────────
  const costLow  = units * md.construction_cost_low_per_unit
  const costHigh = units * md.construction_cost_high_per_unit

  // ── Revenue (use neighbourhood rents if available, else city average) ──
  const rent2brLow  = rents?.rent_2br_low  ?? md.rent_2br_low
  const rent2brHigh = rents?.rent_2br_high ?? md.rent_2br_high
  const rentLabel   = rents?.source_label  ?? md.rent_label
  const monthlyLow  = units * rent2brLow
  const monthlyHigh = units * rent2brHigh
  const annualLow   = monthlyLow  * 12
  const annualHigh  = monthlyHigh * 12

  // ── Gross yield ────────────────────────────────────────────────────────
  // Yield = annual revenue / construction cost
  // Low yield = low revenue / high cost; High yield = high revenue / low cost
  const yieldLow  = parseFloat(((annualLow  / costHigh) * 100).toFixed(1))
  const yieldHigh = parseFloat(((annualHigh / costLow)  * 100).toFixed(1))

  // ── Plain language summary ─────────────────────────────────────────────
  const minLot  = cfg?.max_units_midblock_min_lot_sqm
  const lotText = minLot ? ` on a lot of ${minLot} m² or larger` : ''
  const summary =
    `This ${zone.zone_code} zone lot could support up to ${units} units${lotText} under Bylaw 20001.`

  // ── Strategic flags ────────────────────────────────────────────────────
  const flags: FeasibilityFlag[] = []

  // RS-specific flags
  if (zone.zone_code === 'RS' || zone.zone_code === 'RSF') {
    // Height amendment warning — always flag for RS
    flags.push({
      type: 'amber',
      text: 'Height limit under review — Apr 7 2026 hearing may affect project design.',
    })

    // Commercial opportunity — RS permits neighbourhood commercial discretionary
    flags.push({
      type: 'green',
      text: 'RS zone permits neighbourhood commercial (discretionary) — café or retail on ground floor possible.',
    })

    // Lot size warning
    if (minLot) {
      flags.push({
        type: 'amber',
        text: `Lot must be ${minLot} m² or larger for full ${units}-unit potential. Verify exact lot size with City of Edmonton.`,
      })
    }
  }

  // Generic flag for any pending amendment
  if (zone.amendment_warning && zone.zone_code !== 'RS') {
    flags.push({
      type: 'amber',
      text: zone.amendment_text,
    })
  }

  return {
    calculable:    true,
    summary,
    units,
    cost_low:      costLow,
    cost_high:     costHigh,
    cost_label:    md.construction_label,
    cost_label_cta: md.construction_cta,
    monthly_low:   monthlyLow,
    monthly_high:  monthlyHigh,
    annual_low:    annualLow,
    annual_high:   annualHigh,
    revenue_label: rentLabel,
    yield_low:     yieldLow,
    yield_high:    yieldHigh,
    yield_caveat:  md.yield_caveat,
    flags,
    disclaimer:    md.feasibility_disclaimer,
    rent_source_label: rentLabel,
  }
}

// ── Formatting helpers (used by FeasibilityPanel) ─────────────────────────

/** Format a CAD dollar amount compactly: $1.44M or $172,800 */
export function formatCAD(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`
  }
  return `$${amount.toLocaleString('en-CA')}`
}

/** Format a monthly amount: $14,400/mo */
export function formatCADMonthly(amount: number): string {
  return `$${amount.toLocaleString('en-CA')}/mo`
}
