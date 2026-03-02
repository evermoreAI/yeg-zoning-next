'use client'

import type { NeighbourhoodProfile } from '@/lib/neighbourhoodProfiles'

interface Props {
  profile: NeighbourhoodProfile
}

export default function NeighbourhoodProfileCard({ profile }: Props) {
  const ownerPct = profile.owner_percent ?? 0
  const renterPct = profile.renter_percent ?? 0

  const fmt = (n: number | null, decimals = 0) =>
    n !== null ? n.toLocaleString('en-CA', { maximumFractionDigits: decimals }) : '—'

  return (
    <div className="space-y-3">
      {/* Population + Income */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
          <div className="text-[8px] text-[#4a5568] uppercase tracking-wider mb-1">Population</div>
          <div className="text-xl font-semibold text-[#e8e0d0]" style={{ fontFamily: 'var(--font-mono)' }}>
            {fmt(profile.population)}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
          <div className="text-[8px] text-[#4a5568] uppercase tracking-wider mb-1">Median Income</div>
          <div className="text-xl font-semibold text-[#c8a951]" style={{ fontFamily: 'var(--font-mono)' }}>
            {profile.median_household_income ? `$${fmt(profile.median_household_income)}` : '—'}
          </div>
        </div>
      </div>

      {/* Owner vs Renter bar */}
      <div className="p-3 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
        <div className="text-[8px] text-[#4a5568] uppercase tracking-wider mb-2">Housing Tenure</div>
        <div className="flex gap-1 h-6 rounded overflow-hidden mb-1">
          {ownerPct > 0 && (
            <div
              className="bg-[#6ab86a]"
              style={{ width: `${ownerPct}%` }}
              title={`${ownerPct.toFixed(1)}% owners`}
            />
          )}
          {renterPct > 0 && (
            <div
              className="bg-[#c8a951]"
              style={{ width: `${renterPct}%` }}
              title={`${renterPct.toFixed(1)}% renters`}
            />
          )}
        </div>
        <div className="flex justify-between text-[8px] text-[#2a3040]">
          <span>
            <span className="w-2 h-2 rounded-full bg-[#6ab86a] inline-block mr-1"></span>
            {fmt(ownerPct, 1)}% own
          </span>
          <span>
            <span className="w-2 h-2 rounded-full bg-[#c8a951] inline-block mr-1"></span>
            {fmt(renterPct, 1)}% rent
          </span>
        </div>
      </div>

      {/* Age + Dwellings */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
          <div className="text-[8px] text-[#4a5568] uppercase tracking-wider mb-1">Avg Dwelling Age</div>
          <div className="text-xl font-semibold text-[#e8e0d0]" style={{ fontFamily: 'var(--font-mono)' }}>
            {fmt(profile.average_dwelling_age)} yrs
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
          <div className="text-[8px] text-[#4a5568] uppercase tracking-wider mb-1">Total Dwellings</div>
          <div className="text-xl font-semibold text-[#e8e0d0]" style={{ fontFamily: 'var(--font-mono)' }}>
            {fmt(profile.total_dwellings)}
          </div>
        </div>
      </div>

      {/* Source note */}
      <div className="text-[7px] text-[#1a2030] italic">
        Edmonton Open Data — updated quarterly
      </div>
    </div>
  )
}
