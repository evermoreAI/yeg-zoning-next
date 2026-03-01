'use client'

import type { PermitStats } from '@/lib/permitStats'

interface Props {
  stats: PermitStats
}

export default function ApprovalIntelligence({ stats }: Props) {
  const {
    neighbourhood, approval_rate, approval_color, approval_label,
    total_reviewed, total_approved, total_refused,
    permits_90d, volume_trend, volume_pct,
    most_common_type, recent_approval,
  } = stats

  const trendIcon  = volume_trend === 'UP' ? '↑' : volume_trend === 'DOWN' ? '↓' : '→'
  const trendColor = volume_trend === 'UP' ? '#6ab86a' : volume_trend === 'DOWN' ? '#cf6679' : '#8a8070'

  return (
    <div className="mt-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] text-[#8a8070] tracking-[2px] uppercase"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
          Approval Intelligence — {neighbourhood}
        </span>
        <span className="text-[9px] text-[#3a4050]">Edmonton Open Data 2023–2025</span>
      </div>

      {/* Large approval rate */}
      <div className="p-3 rounded-lg mb-2"
           style={{ background: '#0d1117', border: `1px solid ${approval_color}33` }}>
        <div className="flex items-end justify-between mb-1">
          <div>
            <div className="text-[9px] text-[#8a8070] uppercase tracking-[1.5px] mb-0.5">
              Approval Rate
            </div>
            <div className="text-3xl font-bold leading-none"
                 style={{ color: approval_color, fontFamily: 'var(--font-mono)' }}>
              {approval_rate}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                 style={{ background: `${approval_color}22`, color: approval_color }}>
              {approval_label}
            </div>
            <div className="text-[9px] text-[#4a5568] mt-1">
              {total_approved} approved · {total_refused} refused
            </div>
            <div className="text-[9px] text-[#3a4050]">
              of {total_reviewed} reviewed
            </div>
          </div>
        </div>

        {/* Approval rate bar */}
        <div className="h-1.5 rounded-full bg-[#1e2530] overflow-hidden mt-2">
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${approval_rate}%`, background: approval_color }} />
        </div>
      </div>

      {/* Two-column stats */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* Left — volume */}
        <div className="p-2.5 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
          <div className="text-[9px] text-[#8a8070] uppercase tracking-[1.5px] mb-1">Last 90 Days</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold text-[#e8e0d0]"
                  style={{ fontFamily: 'var(--font-mono)' }}>{permits_90d}</span>
            <span className="text-sm font-semibold" style={{ color: trendColor, fontFamily: 'var(--font-mono)' }}>
              {trendIcon} {Math.abs(volume_pct)}%
            </span>
          </div>
          <div className="text-[9px] text-[#4a5568] mt-0.5">
            {volume_trend === 'UP' ? 'vs prior period ↑' : volume_trend === 'DOWN' ? 'vs prior period ↓' : 'vs prior period'}
          </div>
        </div>

        {/* Right — common type */}
        <div className="p-2.5 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
          <div className="text-[9px] text-[#8a8070] uppercase tracking-[1.5px] mb-1">Most Common</div>
          <div className="text-[11px] font-semibold text-[#e8e0d0] leading-snug">
            {most_common_type}
          </div>
          <div className="text-[9px] text-[#4a5568] mt-0.5">by permit type</div>
        </div>
      </div>

      {/* Most recent approval */}
      {recent_approval && (
        <div className="px-3 py-2 rounded-lg flex items-start gap-2"
             style={{ background: '#141820', border: '1px solid #2a2e38' }}>
          <span className="text-[#2d6a2d] text-[10px] flex-shrink-0 mt-0.5">✓</span>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold truncate"
                 style={{ color: '#c8a951', fontFamily: 'var(--font-mono)' }}>
              {recent_approval.address}
            </div>
            <div className="text-[9px] text-[#4a5568] mt-0.5 leading-snug line-clamp-2">
              {recent_approval.description}
            </div>
            <div className="text-[9px] text-[#3a4050] mt-0.5">{recent_approval.date}</div>
          </div>
        </div>
      )}
    </div>
  )
}
