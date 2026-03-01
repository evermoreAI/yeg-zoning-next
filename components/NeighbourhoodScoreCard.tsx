'use client'

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

export default function NeighbourhoodScoreCard({ score }: Props) {
  const st = OVERALL_STYLE[score.overall] ?? OVERALL_STYLE.LOW

  return (
    <div className="mt-3 p-3 rounded-lg" style={{ background: st.bg, border: `1px solid ${st.border}` }}>
      {/* Overall score row */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span style={{ color: st.color, fontSize: 14 }}>{OVERALL_ICON[score.overall]}</span>
          <span className="text-[11px] font-bold tracking-widest uppercase"
                style={{ color: st.color, fontFamily: 'var(--font-rajdhani)' }}>
            {score.overall} NEIGHBOURHOOD
          </span>
        </div>
        <span className="text-sm font-semibold"
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

      <p className="text-[9px] text-[#3a4050] mt-2 leading-relaxed">{score.data_source}</p>
    </div>
  )
}
