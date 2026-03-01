'use client'

import type { DevelopmentPermit } from '@/lib/developmentPermits'

interface PermitsPanelProps {
  permits: DevelopmentPermit[]
  loading: boolean
}

function statusStyle(status: string): { bg: string; color: string; dot: string } {
  const s = status.toLowerCase()
  if (s.includes('approved') || s.includes('issued')) return { bg: 'rgba(45,106,45,0.20)', color: '#6ab86a', dot: '#6ab86a' }
  if (s.includes('pending') || s.includes('review') || s.includes('in progress')) return { bg: 'rgba(184,134,11,0.18)', color: '#c8a951', dot: '#c8a951' }
  return { bg: 'rgba(42,46,56,0.6)', color: '#8a8070', dot: '#4a5568' }
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function SkeletonCard() {
  return (
    <div className="p-3 rounded-lg mb-2 animate-pulse" style={{ background: '#141820', border: '1px solid #1e2530' }}>
      <div className="h-2.5 w-32 bg-[#2a2e38] rounded mb-2" />
      <div className="h-2 w-48 bg-[#1e2530] rounded mb-1" />
      <div className="h-2 w-24 bg-[#1e2530] rounded" />
    </div>
  )
}

export default function PermitsPanel({ permits, loading }: PermitsPanelProps) {
  return (
    <div className="mt-2">
      {/* Header */}
      <div className="flex items-center justify-between pt-3 pb-2 border-t border-[#1e2530] mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#8a8070] text-xs">📋</span>
          <span className="text-[9px] text-[#8a8070] tracking-[2px] uppercase"
                style={{ fontFamily: 'var(--font-rajdhani)' }}>
            Nearby Development — 500m radius
          </span>
        </div>
        <a
          href="https://www.edmonton.ca/business_economy/development-applications"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] text-[#c8a951] hover:underline"
          style={{ fontFamily: 'var(--font-rajdhani)' }}
        >
          View all ↗
        </a>
      </div>

      {/* Skeletons */}
      {loading && [0,1,2].map(i => <SkeletonCard key={i} />)}

      {/* Empty state */}
      {!loading && permits.length === 0 && (
        <p className="text-[#4a5568] text-[11px] py-3 text-center">
          No recent development permits found nearby.
        </p>
      )}

      {/* Permit cards — max 5 */}
      {!loading && permits.slice(0, 5).map(p => {
        const st = statusStyle(p.status)
        return (
          <div key={p.id} className="p-3 rounded-lg mb-2"
               style={{ background: '#141820', border: '1px solid #1e2530' }}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-[#e8e0d0] text-[11px] font-semibold leading-tight flex-1 min-w-0 truncate">
                {p.address}
              </p>
              <span className="flex-shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: st.bg, color: st.color }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 mb-px" style={{ background: st.dot }} />
                {p.status}
              </span>
            </div>
            <p className="text-[#8a8070] text-[10px] mb-1">{p.permit_type}</p>
            {p.description && (
              <p className="text-[#4a5568] text-[10px] leading-relaxed mb-1">{p.description}</p>
            )}
            <p className="text-[#3a4050] text-[9px]">{formatDate(p.issue_date)}</p>
          </div>
        )
      })}
    </div>
  )
}
