'use client'

import type { ZoneDisplay } from '@/lib/types'

interface ZonePanelProps {
  zone:      ZoneDisplay | null
  loading:   boolean
  address:   string
}

// ── Skeleton card ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-[#141820] border border-[#2a2e38] rounded-lg p-3 min-h-[76px] flex flex-col gap-2 animate-pulse">
      <div className="h-2 w-16 bg-[#2a2e38] rounded" />
      <div className="h-6 w-10 bg-[#2a2e38] rounded" />
      <div className="h-2 w-20 bg-[#1e2530] rounded" />
    </div>
  )
}

// ── Metric card ────────────────────────────────────────────────────────────
interface MetricCardProps {
  label: string
  value: string
  note:  string
  gold?: boolean
}
function MetricCard({ label, value, note, gold }: MetricCardProps) {
  return (
    <div className="bg-[#0a0c10] border border-[#2a2e38] rounded-lg p-3 min-h-[76px] flex flex-col">
      <div className="text-[9px] text-[#8a8070] tracking-[1.5px] uppercase mb-1.5">{label}</div>
      <div
        className={`text-[22px] font-semibold leading-none mb-1 ${gold ? 'text-[#c8a951]' : 'text-[#e8e0d0]'}`}
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {value}
      </div>
      {note && <div className="text-[10px] text-[#8a8070] mt-auto leading-tight">{note}</div>}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ZonePanel({ zone, loading, address }: ZonePanelProps) {

  // ── Empty state ──────────────────────────────────────────────────────────
  if (!loading && !zone) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-[48px] opacity-20 mb-4">⊕</div>
          <div
            className="text-[#2a3545] text-base font-bold tracking-[0.2em] uppercase mb-2"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            SEARCH TERRITORY
          </div>
          <div className="text-[#1e2a35] text-xs">
            Type an Edmonton address to see zone intelligence
          </div>
        </div>
        <Disclaimer />
      </div>
    )
  }

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
          {/* Zone name skeleton */}
          <div className="mb-4 animate-pulse">
            <div className="h-4 w-32 bg-[#2a2e38] rounded mb-2" />
            <div className="h-3 w-24 bg-[#1e2530] rounded" />
          </div>
          {/* 4 metric card skeletons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <SkeletonCard /><SkeletonCard />
            <SkeletonCard /><SkeletonCard />
          </div>
          {/* Freshness skeleton */}
          <div className="h-2 w-40 bg-[#1e2530] rounded animate-pulse" />
        </div>
        {/* Loading label */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-[#1a2535] flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-[#2a2e38] border-t-[#c8a951] rounded-full animate-spin flex-shrink-0" />
          <span className="text-[#4a5568] text-[10px] tracking-widest uppercase">
            Analyzing territory
          </span>
        </div>
      </div>
    )
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (zone && !zone.found) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-3">
          <div className="text-[#8b1a1a] text-3xl">⚠</div>
          <div className="text-[#e8e0d0] text-sm">
            {zone.error ?? 'Could not load zone data.'}
          </div>
          <div className="text-[#4a5568] text-xs">
            Verify with City of Edmonton via 311
          </div>
        </div>
        <Disclaimer />
      </div>
    )
  }

  if (!zone) return null

  // ── Loaded — Layer 1 panel ───────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">

        {/* DC warning banner — shown BEFORE zone name to be unmissable */}
        {zone.dc_warning && (
          <div className="mb-3 px-3 py-2.5 rounded-md bg-[rgba(139,26,26,0.2)] border border-[#8b1a1a] border-l-4 border-l-[#cf6679]">
            <div className="text-[#cf6679] text-xs font-medium leading-snug">
              ⚠ DIRECT CONTROL ZONE — Site-specific rules override all standard regulations.
              Do not use standard zone rules for this parcel. Verify directly with City of Edmonton.
            </div>
          </div>
        )}

        {/* Amendment banner */}
        {zone.amendment_warning && (
          <div
            className="mb-3 px-3 py-2.5 rounded-md bg-[rgba(184,134,11,0.12)] border border-[#b8860b] border-l-4 border-l-[#c8a951] text-[#c8a951] text-xs leading-snug"
            style={{ animation: 'amberPulse 2.5s ease infinite' }}
          >
            ⚠ {zone.amendment_text}
          </div>
        )}

        {/* Zone name header */}
        <div className="mb-4">
          <h2
            className="text-[#c8a951] text-xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            {zone.zone_name}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[#8a8070] text-xs tracking-widest uppercase">
              {zone.zone_code} Zone
            </span>
            {zone.zone_string !== zone.zone_code && (
              <span className="text-[#4a5568] text-[10px]">· {zone.zone_string}</span>
            )}
          </div>
          {address && (
            <div className="text-[#4a5568] text-[10px] mt-1 truncate">{address}</div>
          )}
        </div>

        {/* 2×2 metric grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <MetricCard
            label="MAX UNITS"
            value={zone.max_units}
            note={zone.max_units_note}
            gold
          />
          <MetricCard
            label="HEIGHT"
            value={zone.height}
            note={zone.height_note}
          />
          <MetricCard
            label="SITE COVERAGE"
            value={zone.coverage}
            note={zone.coverage_note}
          />
          <MetricCard
            label="LOT THRESHOLD"
            value={zone.lot_threshold}
            note={zone.lot_threshold_note}
          />
        </div>

        {/* Freshness indicator */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a2d] flex-shrink-0" />
          <span className="text-[#4a5568] text-[10px]">
            Live from City of Edmonton GIS · {formatFreshness(zone.fetched_at)}
          </span>
        </div>

        {/* MORE DETAIL chevron */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-1.5 py-2 text-[#4a5568] hover:text-[#8a8070] text-[11px] tracking-widest uppercase transition-colors duration-200 rounded border border-[#1a2535] hover:border-[#2a2e38]"
          style={{ fontFamily: 'var(--font-rajdhani)' }}
        >
          MORE DETAIL
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path d="M8 10.94L2.47 5.41l.94-.94L8 9.06l4.59-4.59.94.94z"/>
          </svg>
        </button>

      </div>
      <Disclaimer />
    </div>
  )
}

// ── Disclaimer — required on every result per edmonton-zoning-knowledge.md ──
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

function formatFreshness(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch {
    return 'just now'
  }
}
