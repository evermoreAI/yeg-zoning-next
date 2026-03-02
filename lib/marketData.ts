/**
 * lib/marketData.ts
 *
 * Edmonton real estate market constants used for feasibility estimates.
 * ALL numbers live here and nowhere else — never hardcode in components or logic.
 *
 * UPDATE QUARTERLY — review after each Edmonton CMHC rental market report.
 * Source: Edmonton market surveys, contractor quotes, CMHC data.
 * Last updated: February 2026
 */

export const MARKET_DATA = {
  /** Wood frame multi-family construction, all-in per unit (CAD) — Feb 2026 */
  construction_cost_low_per_unit:  180_000,
  construction_cost_high_per_unit: 250_000,
  construction_label: 'Edmonton wood frame estimate — updated Feb 2026',
  construction_cta: 'Contributing a real build? Email connor@yegzoning.ca for 6 months Investor free',

  /** Monthly rental rates, Edmonton — Feb 2026 (CAD) */
  rent_1br_low:  1_200,
  rent_1br_high: 1_500,
  rent_2br_low:  1_600,
  rent_2br_high: 1_900,
  rent_3br_low:  2_000,
  rent_3br_high: 2_500,
  rent_label: 'Based on current Edmonton 2BR rental rates — Feb 2026',

  /** Permit and construction timelines (months) */
  permit_timeline_low_months:  3,
  permit_timeline_high_months: 6,
  construction_timeline_low_months:  12,
  construction_timeline_high_months: 18,

  /** Gross yield caveat — always show this with any yield estimate */
  yield_caveat: 'Before land, financing, and operating costs',

  /** Feasibility disclaimer — required on every estimate */
  feasibility_disclaimer:
    'Construction costs are industry estimates only (Feb 2026: $180K–$250K per unit wood frame). ' +
    'Verify with Edmonton contractors before making investment decisions. ' +
    'Revenue based on Edmonton 2BR market rents ($1,600–$1,900/month). Neighbourhood rental premium applied where applicable. ' +
    'These are estimates only — not a quote or guarantee. Always obtain professional quotes and verify with a ' +
    'qualified real estate professional before making investment decisions.',

  /** Last updated date shown to users */
  updated: 'Feb 2026',
} as const
