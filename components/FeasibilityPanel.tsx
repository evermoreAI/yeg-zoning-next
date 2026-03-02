'use client'

import type { FeasibilityResult } from '@/lib/types'
import type { NeighbourhoodRents } from '@/lib/rentalData'
import { formatCAD, formatCADMonthly } from '@/lib/feasibility'

interface FeasibilityPanelProps {
  result: FeasibilityResult
  rents?: NeighbourhoodRents | null
}

// ── Sub-components ─────────────────────────────────────────────────────

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[9px] text-[#8a8070] tracking-[2px] uppercase mb-2.5 pt-3 border-t border-[#1e2530]">
        {heading}
      </div>
      {children}
    </div>
  )
}

function FinancialRow({
  label, low, high, sub, cta,
}: { label: string; low: string; high: string; sub?: string; cta?: string }) {
  return (
    <div>
      <div className="flex items-start justify-between py-2 border-b border-[#1e2530]">
        <div>
          <div className="text-[11px] text-[#8a8070]">{label}</div>
          {sub && <div className="text-[9px] text-[#4a5568] mt-0.5 italic">{sub}</div>}
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <span className="text-sm font-semibold text-[#c8a951]" style={{ fontFamily: 'var(--font-mono)' }}>
            {low}
          </span>
          <span className="text-[#4a5568] text-xs mx-1">–</span>
          <span className="text-sm font-semibold text-[#c8a951]" style={{ fontFamily: 'var(--font-mono)' }}>
            {high}
          </span>
        </div>
      </div>
      {cta && (
        <div className="text-[7px] text-[#3a4050] italic mt-1 pb-2">
          {cta}
        </div>
      )}
    </div>
  )
}

function Flag({ type, text }: { type: 'amber' | 'green'; text: string }) {
  const isAmber = type === 'amber'
  return (
    <div className={`flex gap-2.5 p-2.5 rounded-md mb-2 last:mb-0 ${
      isAmber
        ? 'bg-[rgba(184,134,11,0.10)] border border-[#b8860b]'
        : 'bg-[rgba(45,106,45,0.15)] border border-[#2d6a2d]'
    }`}>
      <span className="flex-shrink-0 mt-px text-sm">{isAmber ? '⚠' : '✓'}</span>
      <p className={`text-[11px] leading-relaxed ${isAmber ? 'text-[#c8a951]' : 'text-[#6ab86a]'}`}>
        {text}
      </p>
    </div>
  )
}

// ── Rental Market Section ──────────────────────────────────────────────────

function RentalMarketSection({ rents }: { rents: NeighbourhoodRents }) {
  const rf = rents.rf_stats

  return (
    <Section heading="RENTAL MARKET">
      {/* Rents grid — 1BR/2BR/3BR in gold mono */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: '1BR', low: rents.rent_1br_low, high: rents.rent_1br_high },
          { label: '2BR', low: rents.rent_2br_low, high: rents.rent_2br_high },
          { label: '3BR', low: rents.rent_3br_low, high: rents.rent_3br_high },
        ].map((br) => (
          <div key={br.label} className="p-2 rounded" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
            <div className="text-[8px] text-[#4a5568] uppercase tracking-wider mb-0.5">{br.label}</div>
            <div className="text-[10px] font-semibold text-[#c8a951]" style={{ fontFamily: 'var(--font-mono)' }}>
              ${br.low.toLocaleString()}–${br.high.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Active listing count — only if Rentfaster */}
      {rf && (
        <div className="p-2 rounded-lg mb-3" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
          <div className="text-[8px] text-[#4a5568] uppercase tracking-wider mb-0.5">
            Active Listings
          </div>
          <div className="text-sm font-semibold text-[#e8e0d0]" style={{ fontFamily: 'var(--font-mono)' }}>
            {rf.listing_count}
          </div>
        </div>
      )}

      {/* Source label + disclaimer in small text */}
      <div className="text-[8px] text-[#2a3040] space-y-0.5">
        <div>{rents.source_label}</div>
        {rf && <div className="text-[7px] italic text-[#1a2030]">Based on featured listings — may not reflect full market</div>}
      </div>
    </Section>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function FeasibilityPanel({ result, rents }: FeasibilityPanelProps) {
  if (!result.calculable) return null

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between pt-3 pb-2 border-t-2 border-[#c8a951] mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#c8a951] text-base">⚡</span>
          <span
            className="text-[#e8e0d0] text-sm font-bold tracking-[0.15em] uppercase"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            FEASIBILITY INTELLIGENCE
          </span>
        </div>
        <span className="text-[9px] tracking-[1.5px] uppercase px-2 py-0.5 rounded border border-[#c8a951] text-[#c8a951]"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
          INVESTOR
        </span>
      </div>

      {/* What you could build */}
      <Section heading="WHAT YOU COULD BUILD">
        <p className="text-[#e8e0d0] text-[13px] leading-relaxed">{result.summary}</p>
      </Section>

      {/* Construction cost */}
      <Section heading="ESTIMATED CONSTRUCTION COST">
        <FinancialRow
          label={`${result.units} units × cost per unit`}
          low={formatCAD(result.cost_low)}
          high={formatCAD(result.cost_high)}
          sub={result.cost_label}
          cta={result.cost_label_cta}
        />
      </Section>

      {/* Rental Market — all tiers, all data sources */}
      {rents && <RentalMarketSection rents={rents} />}

      {/* Revenue */}
      <Section heading="ESTIMATED GROSS REVENUE">
        <FinancialRow
          label="Monthly (all units)"
          low={formatCADMonthly(result.monthly_low)}
          high={formatCADMonthly(result.monthly_high)}
        />
        <FinancialRow
          label="Annual"
          low={formatCAD(result.annual_low)}
          high={formatCAD(result.annual_high)}
          sub={result.rent_source_label}
        />
      </Section>

      {/* Gross yield */}
      <Section heading="GROSS YIELD">
        <div className="flex items-baseline gap-1.5 mb-1">
          <span
            className="text-2xl font-semibold text-[#c8a951]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {result.yield_low}%
          </span>
          <span className="text-[#4a5568] text-sm">–</span>
          <span
            className="text-2xl font-semibold text-[#c8a951]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {result.yield_high}%
          </span>
        </div>
        <p className="text-[10px] text-[#4a5568] italic">{result.yield_caveat}</p>
      </Section>

      {/* Strategic flags */}
      {result.flags.length > 0 && (
        <Section heading="STRATEGIC FLAGS">
          {result.flags.map((flag, i) => (
            <Flag key={i} type={flag.type} text={flag.text} />
          ))}
        </Section>
      )}

      {/* Feasibility disclaimer — required on every estimate */}
      <div className="mt-4 p-3 rounded-md bg-[#0d1117] border border-[#1e2530]">
        <p className="text-[9px] text-[#3d5470] leading-relaxed">{result.disclaimer}</p>
      </div>
    </div>
  )
}
