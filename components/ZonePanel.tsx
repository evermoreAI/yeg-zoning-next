'use client'

import { useState }            from 'react'
import type { ZoneDisplay }    from '@/lib/types'
import type { ZoneLayer2 }     from '@/config/zones'
import FeasibilityPanel        from './FeasibilityPanel'
import { calculateFeasibility } from '@/lib/feasibility'
import GateBlur from './GateBlur'
import BookmarkButton from './BookmarkButton'
import PermitsPanel from './PermitsPanel'
import EmailCapture from './EmailCapture'
import { tierAtLeast, type Tier } from '@/lib/tierContext'

// ── Sub-components ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-[#141820] border border-[#2a2e38] rounded-lg p-3 min-h-[76px] flex flex-col gap-2 animate-pulse">
      <div className="h-2 w-16 bg-[#2a2e38] rounded" />
      <div className="h-6 w-10 bg-[#2a2e38] rounded" />
      <div className="h-2 w-20 bg-[#1e2530] rounded" />
    </div>
  )
}

function MetricCard({ label, value, note, gold }: { label: string; value: string; note: string; gold?: boolean }) {
  return (
    <div className="bg-[#0a0c10] border border-[#2a2e38] rounded-lg p-3 min-h-[76px] flex flex-col">
      <div className="text-[9px] text-[#8a8070] tracking-[1.5px] uppercase mb-1.5">{label}</div>
      <div className={`text-[22px] font-semibold leading-none mb-1 ${gold ? 'text-[#c8a951]' : 'text-[#e8e0d0]'}`}
           style={{ fontFamily: 'var(--font-mono)' }}>
        {value}
      </div>
      {note && <div className="text-[10px] text-[#8a8070] mt-auto leading-tight">{note}</div>}
    </div>
  )
}

function L2Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[9px] text-[#8a8070] tracking-[2px] uppercase mb-2.5 pt-3 border-t border-[#1e2530]">
        {heading}
      </div>
      {children}
    </div>
  )
}

function Layer2Content({ l2, bylaw12800 }: { l2: ZoneLayer2; bylaw12800: string | null }) {
  return (
    <div>
      {/* Permitted uses */}
      <L2Section heading="PERMITTED USES">
        <div className="flex flex-wrap gap-1.5">
          {l2.permitted_uses.map((use, i) => (
            <span key={i} className="text-[11px] px-2.5 py-1 rounded-full leading-tight bg-[rgba(45,106,45,0.22)] border border-[#2d6a2d] text-[#6ab86a]">
              {use}
            </span>
          ))}
        </div>
      </L2Section>

      {/* Discretionary uses */}
      <L2Section heading={
        <span>
          DISCRETIONARY USES
          <span className="ml-1 text-[8px] text-[#4a5568] normal-case tracking-normal font-normal italic">
            requires Development Officer approval
          </span>
        </span> as any
      }>
        <div className="flex flex-wrap gap-1.5">
          {l2.discretionary_uses.map((use, i) => (
            <span key={i} title="Discretionary — not guaranteed, requires Development Officer approval"
              className="text-[11px] px-2.5 py-1 rounded-full leading-tight bg-[rgba(184,134,11,0.16)] border border-[#b8860b] text-[#c8a951] cursor-help">
              {use}
            </span>
          ))}
        </div>
      </L2Section>

      {/* Setbacks */}
      <L2Section heading="SETBACKS">
        <table className="w-full border-collapse mb-1">
          <tbody>
            {([
              ['Front setback',   `${l2.setbacks_m.front} m`],
              ['Rear setback',    `${l2.setbacks_m.rear} m`],
              ['Interior side',   `${l2.setbacks_m.side} m`],
            ] as [string, string][]).map(([label, val]) => (
              <tr key={label} className="border-b border-[#1e2530]">
                <td className="py-1.5 text-[11px] text-[#8a8070] w-[55%]">{label}</td>
                <td className="py-1.5 text-sm font-semibold text-[#e8e0d0]" style={{ fontFamily: 'var(--font-mono)' }}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[10px] text-[#4a5568] italic leading-relaxed mt-1">{l2.setback_note}</p>
      </L2Section>

      {/* Corner lot note */}
      {l2.corner_lot_note && (
        <div className="mb-5 px-3 py-2.5 rounded-md bg-[#0d1117] border border-[#2a2e38] text-[11px] text-[#8a8070] leading-relaxed">
          🔲 {l2.corner_lot_note}
        </div>
      )}

      {/* Old zone equivalent */}
      {bylaw12800 && (
        <div className="mb-5">
          <div className="text-[9px] text-[#4a5568] tracking-[2px] uppercase mb-1 pt-3 border-t border-[#1e2530]">
            PREVIOUSLY ZONED UNDER BYLAW 12800
          </div>
          <p className="text-[11px] text-[#4a5568] italic">{bylaw12800}</p>
        </div>
      )}

      {/* Official links */}
      <L2Section heading="OFFICIAL SOURCES">
        <div className="flex flex-col gap-1">
          {l2.links.bylaw && (
            <a href={l2.links.bylaw} target="_blank" rel="noopener noreferrer"
               className="text-[11px] text-[#4a7c9e] hover:text-[#6aafd4] transition-colors duration-150 leading-relaxed">
              ↗ Edmonton Zoning Bylaw — RS Zone
            </a>
          )}
          {l2.links.assessment && (
            <a href={l2.links.assessment} target="_blank" rel="noopener noreferrer"
               className="text-[11px] text-[#4a7c9e] hover:text-[#6aafd4] transition-colors duration-150 leading-relaxed">
              ↗ Property Assessment (City of Edmonton)
            </a>
          )}
          {l2.links.development_applications && (
            <a href={l2.links.development_applications} target="_blank" rel="noopener noreferrer"
               className="text-[11px] text-[#4a7c9e] hover:text-[#6aafd4] transition-colors duration-150 leading-relaxed">
              ↗ Development Applications
            </a>
          )}
        </div>
      </L2Section>
    </div>
  )
}

function Disclaimer() {
  return (
    <div className="flex-shrink-0 px-4 py-2 border-t border-[#1a2535]">
      <p className="text-[#2a3545] text-[9px] leading-relaxed">
        Zoning data for reference only. City of Edmonton states online bylaw is not legally binding.
        Always verify with City of Edmonton via 311 or edmonton.ca before making development decisions.
      </p>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

interface ZonePanelProps {
  zone:    ZoneDisplay | null
  loading: boolean
  address: string
  tier:    Tier
  onBookmarkChanged?: () => void
}

export default function ZonePanel({ zone, loading, address, tier, onBookmarkChanged }: ZonePanelProps) {
  const [expanded, setExpanded] = useState(false)

  // ── Empty ────────────────────────────────────────────────────────────────
  if (!loading && !zone) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-[48px] opacity-20 mb-4">⊕</div>
          <div className="text-[#2a3545] text-base font-bold tracking-[0.2em] uppercase mb-2"
               style={{ fontFamily: 'var(--font-rajdhani)' }}>
            SEARCH TERRITORY
          </div>
          <div className="text-[#1e2a35] text-xs">Type an Edmonton address to see zone intelligence</div>
        </div>
        <Disclaimer />
      </div>
    )
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
          <div className="mb-4 animate-pulse">
            <div className="h-4 w-32 bg-[#2a2e38] rounded mb-2" />
            <div className="h-3 w-24 bg-[#1e2530] rounded" />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
          <div className="h-2 w-40 bg-[#1e2530] rounded animate-pulse" />
        </div>
        <div className="flex-shrink-0 px-4 py-3 border-t border-[#1a2535] flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-[#2a2e38] border-t-[#c8a951] rounded-full animate-spin flex-shrink-0" />
          <span className="text-[#4a5568] text-[10px] tracking-widest uppercase">Analyzing territory</span>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (zone && !zone.found) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-3">
          <div className="text-[#8b1a1a] text-3xl">⚠</div>
          <div className="text-[#e8e0d0] text-sm">{zone.error ?? 'Could not load zone data.'}</div>
          <div className="text-[#4a5568] text-xs">Verify with City of Edmonton via 311</div>
        </div>
        <Disclaimer />
      </div>
    )
  }

  if (!zone) return null

  const hasLayer2 = zone.layer2 !== null

  // ── Loaded — Layer 1 + expandable Layer 2 ───────────────────────────────
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">

        {/* DC warning */}
        {zone.dc_warning && (
          <div className="mb-3 px-3 py-2.5 rounded-md bg-[rgba(139,26,26,0.2)] border border-[#8b1a1a] border-l-4 border-l-[#cf6679]">
            <div className="text-[#cf6679] text-xs font-medium leading-snug">
              ⚠ This is a Direct Control zone with custom development rules. Contact the City of Edmonton for specific provisions.
            </div>
          </div>
        )}

        {/* Amendment banner */}
        {zone.amendment_warning && (
          <div className="mb-3 px-3 py-2.5 rounded-md text-[#c8a951] text-xs leading-snug"
               style={{ background: 'rgba(184,134,11,0.12)', border: '1px solid #b8860b', borderLeft: '4px solid #c8a951', animation: 'amberPulse 2.5s ease infinite' }}>
            ⚠ {zone.amendment_text}
          </div>
        )}

        {/* Zone name header */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-[#c8a951] text-xl font-bold leading-tight" style={{ fontFamily: 'var(--font-rajdhani)' }}>
              {zone.zone_name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[#8a8070] text-xs tracking-widest uppercase">{zone.zone_code} Zone</span>
              {zone.zone_string !== zone.zone_code && (
                <span className="text-[#4a5568] text-[10px]">· {zone.zone_string}</span>
              )}
            </div>
            {address && <div className="text-[#4a5568] text-[10px] mt-1 truncate">{address}</div>}
          </div>
          {zone.found && zone.lat != null && zone.lng != null && (
            <BookmarkButton
              lat={zone.lat!}
              lng={zone.lng!}
              address={address}
              zone_code={zone.zone_code}
              zone_name={zone.zone_name}
              onChanged={onBookmarkChanged}
            />
          )}
        </div>

        {/* 2×2 metric grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <MetricCard label="MAX UNITS"     value={zone.max_units}     note={zone.max_units_note}     gold />
          <MetricCard label="HEIGHT"        value={zone.height}        note={zone.height_note}            />
          <MetricCard label="SITE COVERAGE" value={zone.coverage}      note={zone.coverage_note}          />
          <MetricCard label="LOT THRESHOLD" value={zone.lot_threshold} note={zone.lot_threshold_note}     />
        </div>

        {/* Freshness + momentum */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a2d] flex-shrink-0" />
            <span className="text-[#4a5568] text-[10px]">
              Live from City of Edmonton GIS · {formatFreshness(zone.fetched_at)}
            </span>
          </div>
          {zone.momentum && zone.momentum.recent > 0 && (
            <span className="text-[9px] font-semibold tracking-wider uppercase flex-shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: zone.momentum.trend === 'ACCELERATING' ? '#c8a951'
                         : zone.momentum.trend === 'COOLING'      ? '#8a8070'
                         : '#6ab86a',
                  }}>
              {zone.momentum.trend === 'ACCELERATING' ? '↑' : zone.momentum.trend === 'COOLING' ? '↓' : '→'}{' '}
              {zone.momentum.trend}
            </span>
          )}
        </div>

        {/* MORE / LESS DETAIL toggle */}
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-center gap-1.5 py-2 mb-4 text-[#4a5568] hover:text-[#8a8070] text-[11px] tracking-widest uppercase transition-colors duration-200 rounded border border-[#1a2535] hover:border-[#2a2e38]"
          style={{ fontFamily: 'var(--font-rajdhani)' }}
          disabled={!hasLayer2}
        >
          {expanded ? 'LESS DETAIL' : 'MORE DETAIL'}
          <svg
            viewBox="0 0 16 16" width="12" height="12" fill="currentColor"
            style={{ transition: 'transform 300ms ease', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M8 10.94L2.47 5.41l.94-.94L8 9.06l4.59-4.59.94.94z"/>
          </svg>
        </button>

        {/* Layer 2 — smooth expand/collapse via max-height */}
        <GateBlur locked={!tierAtLeast(tier, 'pro')} tier="pro">
        <div
          style={{
            maxHeight:  expanded ? '1200px' : '0px',
            overflow:   'hidden',
            opacity:    expanded ? 1 : 0,
            transition: 'max-height 350ms ease, opacity 250ms ease',
          }}
        >
          {hasLayer2 && (
            <Layer2Content l2={zone.layer2!} bylaw12800={zone.bylaw_12800_equiv} />
          )}
        </div>

        </GateBlur>

        {/* Layer 3 — Feasibility — Investor tier */}
        {zone.dc_warning ? (
          <div className="mt-3 p-3 rounded-md"
               style={{ background: 'rgba(139,26,26,0.12)', border: '1px solid #8b1a1a' }}>
            <p className="text-[#cf6679] text-[11px] leading-relaxed">
              ⚡ Feasibility analysis not available for DC zones — rules vary by parcel.
              Contact the City of Edmonton for site-specific development potential.
            </p>
          </div>
        ) : (
          <GateBlur locked={!tierAtLeast(tier, 'investor')} tier="investor">
            {(() => {
              const feasibility = calculateFeasibility(zone)
              if (!feasibility) return null
              return (
                <div className="mt-2">
                  <FeasibilityPanel result={feasibility} />
                </div>
              )
            })()}
          </GateBlur>
        )}

      </div>
      <Disclaimer />

      {/* Nearby development permits — Pro+ tier */}
      <GateBlur locked={!tierAtLeast(tier, 'pro')} tier="pro">
        <PermitsPanel
          permits={zone.permits ?? []}
          loading={false}
        />
      </GateBlur>

      {/* Email capture — always last, gold top separator */}
      <div className="mt-4 pt-3" style={{ borderTop: '1px solid #c8a951' }}>
        <EmailCapture />
      </div>

    </div>
  )
}

function formatFreshness(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch { return 'just now' }
}
