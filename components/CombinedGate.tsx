'use client'

/**
 * components/CombinedGate.tsx
 *
 * Single combined gate card shown once on Free tier.
 * Lists Pro + Investor tiers with their value props side by side.
 * Replaces all individual GateBlur cards — no duplicates.
 */

export default function CombinedGate() {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: '1px solid #c8a951', boxShadow: '0 0 24px rgba(200,169,81,0.10)' }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2"
           style={{ background: 'rgba(200,169,81,0.08)', borderBottom: '1px solid #2a2e38' }}>
        <span className="text-sm">🔒</span>
        <span className="text-[#c8a951] text-[11px] font-bold tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
          Unlock Full Access
        </span>
      </div>

      {/* Tier rows */}
      <div style={{ background: '#141820' }}>

        {/* Pro row */}
        <div className="flex items-start justify-between gap-3 px-4 py-3"
             style={{ borderBottom: '1px solid #1e2530' }}>
          <div className="min-w-0">
            <p className="text-[#c8a951] text-[11px] font-semibold mb-0.5"
               style={{ fontFamily: 'var(--font-mono)' }}>
              Pro — $29/month CAD
            </p>
            <p className="text-[#8a8070] text-[10px] leading-snug">
              Zone details, neighbourhood score, approval intelligence
            </p>
          </div>
          <a href="#pricing"
             className="flex-shrink-0 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all duration-150 whitespace-nowrap"
             style={{ background: '#c8a951', color: '#0a0c10', fontFamily: 'var(--font-rajdhani)', textDecoration: 'none' }}
             onMouseEnter={e => (e.currentTarget.style.background = '#e0bb5a')}
             onMouseLeave={e => (e.currentTarget.style.background = '#c8a951')}>
            Upgrade
          </a>
        </div>

        {/* Investor row */}
        <div className="flex items-start justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[#c8a951] text-[11px] font-semibold mb-0.5"
               style={{ fontFamily: 'var(--font-mono)' }}>
              Investor — $79/month CAD
            </p>
            <p className="text-[#8a8070] text-[10px] leading-snug">
              Everything in Pro plus feasibility and investment analysis
            </p>
          </div>
          <a href="#pricing"
             className="flex-shrink-0 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all duration-150 whitespace-nowrap"
             style={{ background: 'transparent', color: '#c8a951', fontFamily: 'var(--font-rajdhani)', textDecoration: 'none', border: '1px solid #c8a951' }}
             onMouseEnter={e => { e.currentTarget.style.background = '#c8a951'; e.currentTarget.style.color = '#0a0c10' }}
             onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c8a951' }}>
            Upgrade
          </a>
        </div>
      </div>
    </div>
  )
}
