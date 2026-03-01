'use client'

import type { NeighbourhoodRents } from '@/lib/rentalData'

interface Props {
  rents: NeighbourhoodRents
}

export default function RentalMarketCard({ rents }: Props) {
  const rf = rents.rf_stats
  if (!rf) return null   // Only show when live Rentfaster data is available

  const { listing_count, rent_bachelor, rent_1br, rent_2br, rent_3br,
          median_dom, vacancy_pressure_pct, listings_over_30d } = rf

  // Days-on-market signal
  const domSignal = median_dom === null ? null
    : median_dom <= 7  ? { label: 'FAST',     color: '#6ab86a', bg: 'rgba(106,184,106,0.12)', border: 'rgba(106,184,106,0.3)' }
    : median_dom <= 21 ? { label: 'MODERATE', color: '#c8a951', bg: 'rgba(200,169,81,0.12)',  border: 'rgba(200,169,81,0.3)'  }
    :                    { label: 'SLOW',      color: '#cf6679', bg: 'rgba(207,102,121,0.12)', border: 'rgba(207,102,121,0.3)' }

  // Vacancy pressure
  const vacSignal = vacancy_pressure_pct === null ? null
    : vacancy_pressure_pct >= 60 ? { label: 'HIGH VACANCY',    color: '#cf6679' }
    : vacancy_pressure_pct >= 35 ? { label: 'MOD. VACANCY',    color: '#c8a951' }
    :                               { label: 'TIGHT SUPPLY',    color: '#6ab86a' }

  const fmt = (v: number | null | undefined) => v ? `$${v.toLocaleString()}` : '—'

  return (
    <div className="mt-3 rounded-lg overflow-hidden"
         style={{ border: '1px solid #2a2e38' }}>

      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between"
           style={{ background: '#0d1117', borderBottom: '1px solid #1e2530' }}>
        <span className="text-[9px] font-bold tracking-[2px] uppercase text-[#8a8070]"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
          Rental Market — {rents.neighbourhood}
        </span>
        <span className="text-[9px] text-[#3a4050]">Rentfaster.ca · {rents.updated}</span>
      </div>

      <div className="p-3 space-y-3" style={{ background: '#0d1117' }}>

        {/* Rents by bedroom grid */}
        <div className="grid grid-cols-4 gap-1.5">
          {([
            ['Bach', rent_bachelor],
            ['1BR',  rent_1br],
            ['2BR',  rent_2br],
            ['3BR',  rent_3br],
          ] as [string, number | null][]).map(([label, val]) => (
            <div key={label} className="text-center p-2 rounded"
                 style={{ background: '#141820', border: '1px solid #2a2e38' }}>
              <div className="text-[8px] text-[#4a5568] uppercase tracking-wider mb-0.5">{label}</div>
              <div className="text-[11px] font-semibold text-[#c8a951]"
                   style={{ fontFamily: 'var(--font-mono)' }}>
                {fmt(val)}
              </div>
            </div>
          ))}
        </div>

        {/* DOM + vacancy row */}
        <div className="grid grid-cols-2 gap-2">

          {/* Days on market */}
          <div className="p-2 rounded-lg"
               style={{ background: domSignal?.bg ?? '#141820', border: `1px solid ${domSignal?.border ?? '#2a2e38'}` }}>
            <div className="text-[8px] text-[#4a5568] uppercase tracking-wider mb-1">
              Median Days Listed
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold"
                    style={{ color: domSignal?.color ?? '#e8e0d0', fontFamily: 'var(--font-mono)' }}>
                {median_dom ?? '—'}
              </span>
              {domSignal && (
                <span className="text-[9px] font-bold uppercase"
                      style={{ color: domSignal.color }}>
                  {domSignal.label}
                </span>
              )}
            </div>
          </div>

          {/* Active listings + vacancy */}
          <div className="p-2 rounded-lg"
               style={{ background: '#141820', border: '1px solid #2a2e38' }}>
            <div className="text-[8px] text-[#4a5568] uppercase tracking-wider mb-1">
              Active Listings
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold text-[#e8e0d0]"
                    style={{ fontFamily: 'var(--font-mono)' }}>
                {listing_count}
              </span>
              {vacSignal && (
                <span className="text-[9px] font-bold uppercase"
                      style={{ color: vacSignal.color }}>
                  {vacSignal.label}
                </span>
              )}
            </div>
            {vacancy_pressure_pct !== null && (
              <div className="text-[8px] text-[#3a4050] mt-0.5">
                {listings_over_30d} over 30d ({vacancy_pressure_pct}%)
              </div>
            )}
          </div>
        </div>

        {/* Source */}
        <div className="text-[8px] text-[#2a3040]">
          {rents.source_label}
        </div>
      </div>
    </div>
  )
}
