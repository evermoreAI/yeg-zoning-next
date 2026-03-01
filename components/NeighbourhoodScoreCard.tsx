'use client'

import { useState } from 'react'
import type { NeighbourhoodScore, SubScore } from '@/lib/neighbourhoodScore'

interface Props {
  score: NeighbourhoodScore
}

const OVERALL_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  LOW:      { color: '#8a8070', bg: 'rgba(42,46,56,0.5)',      border: '#2a2e38' },
  MODERATE: { color: '#c8a951', bg: 'rgba(184,134,11,0.12)',   border: '#b8860b' },
  HIGH:     { color: '#6ab86a', bg: 'rgba(45,106,45,0.15)',    border: '#2d6a2d' },
  PREMIUM:  { color: '#c8a951', bg: 'rgba(200,169,81,0.15)',   border: '#c8a951' },
}

const OVERALL_ICON: Record<string, string> = {
  LOW: '○', MODERATE: '◑', HIGH: '●', PREMIUM: '★',
}

const TOOLTIP_TEXT =
  'Score calculated by YEG Zoning using Google Maps business density via Outscraper and ' +
  'Edmonton Open Data permit activity. Transit, Amenities, Commercial, and Development ' +
  'sub-scores weighted at 30/30/20/20. Not an official City of Edmonton score.'

function SubBar({ sub }: { sub: SubScore }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-[#8a8070] w-20 flex-shrink-0">{sub.label}</span>
      <div className="flex-1 h-1 rounded-full bg-[#1e2530] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width:      `${sub.score}%`,
            background: sub.score >= 76 ? '#c8a951'
                      : sub.score >= 56 ? '#6ab86a'
                      : sub.score >= 36 ? '#b8860b'
                      : '#4a5568',
          }}
        />
      </div>
      <span className="text-[9px] w-5 text-right flex-shrink-0"
            style={{ fontFamily: 'var(--font-mono)', color: '#8a8070' }}>
        {sub.count}
      </span>
    </div>
  )
}

function InfoTooltip() {
  const [visible, setVisible] = useState(false)

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold leading-none flex-shrink-0 focus:outline-none"
        style={{ background: '#1e2530', color: '#4a5568', border: '1px solid #2a2e38' }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-label="Methodology info"
        type="button"
      >
        i
      </button>
      {visible && (
        <span
          className="absolute z-50 rounded-lg p-3 text-[10px] leading-relaxed"
          style={{
            background:  '#141820',
            border:      '1px solid #2a2e38',
            color:       '#8a8070',
            width:       240,
            bottom:      '120%',
            left:        '50%',
            transform:   'translateX(-50%)',
            boxShadow:   '0 8px 24px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >
          {TOOLTIP_TEXT}
          <span
            className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 rotate-45"
            style={{ background: '#141820', border: '1px solid #2a2e38', borderTop: 'none', borderLeft: 'none' }}
          />
        </span>
      )}
    </span>
  )
}

export default function NeighbourhoodScoreCard({ score }: Props) {
  const st = OVERALL_STYLE[score.overall] ?? OVERALL_STYLE.LOW

  return (
    <div className="mt-3 p-3 rounded-lg" style={{ background: st.bg, border: `1px solid ${st.border}` }}>
      {/* Overall score row */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span style={{ color: st.color, fontSize: 13 }}>{OVERALL_ICON[score.overall]}</span>
          <span className="text-[11px] font-bold tracking-widest uppercase"
                style={{ color: st.color, fontFamily: 'var(--font-rajdhani)' }}>
            {score.overall} NEIGHBOURHOOD
          </span>
          <InfoTooltip />
        </div>
        <span className="text-sm font-semibold ml-2 flex-shrink-0"
              style={{ color: st.color, fontFamily: 'var(--font-mono)' }}>
          {score.overall_score}
        </span>
      </div>

      {/* Sub-score bars */}
      <div className="space-y-1.5">
        <SubBar sub={score.transit}     />
        <SubBar sub={score.amenities}   />
        <SubBar sub={score.commercial}  />
        <SubBar sub={score.development} />
      </div>
    </div>
  )
}
