'use client'

/**
 * components/GateBlur.tsx
 * Frosted-glass gate overlay. Wraps content and blurs it when locked.
 * Children render fully when unlocked — no DOM removal, so blur is instant.
 */

interface GateBlurProps {
  locked: boolean
  tier: 'pro' | 'investor'
  children: React.ReactNode
}

const COPY: Record<'pro' | 'investor', { headline: string; price: string; sub: string }> = {
  pro: {
    headline: 'Unlock Full Zone Details',
    price: 'Pro — $29/month CAD',
    sub: 'Permitted uses, setbacks, official links, and more.',
  },
  investor: {
    headline: 'Unlock Investment Intelligence',
    price: 'Investor — $79/month CAD',
    sub: 'Construction costs, rental yield, and strategic flags.',
  },
}

export default function GateBlur({ locked, tier, children }: GateBlurProps) {
  const copy = COPY[tier]

  return (
    <div className="relative">
      {/* Content — always rendered, blurred when locked */}
      <div
        className="transition-all duration-300"
        style={locked ? { filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.5 } : {}}
        aria-hidden={locked}
      >
        {children}
      </div>

      {/* Overlay — shown only when locked */}
      {locked && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ background: 'rgba(10,12,16,0.55)', backdropFilter: 'blur(2px)' }}
        >
          <div
            className="mx-4 p-5 rounded-lg text-center"
            style={{
              background: '#141820',
              border: '1px solid #c8a951',
              boxShadow: '0 0 24px rgba(200,169,81,0.18)',
              maxWidth: 280,
            }}
          >
            <div className="text-[#c8a951] text-xl mb-1">🔒</div>
            <h3
              className="text-[#e8e0d0] font-bold text-sm mb-1 tracking-wide"
              style={{ fontFamily: 'var(--font-rajdhani)' }}
            >
              {copy.headline}
            </h3>
            <p className="text-[#c8a951] text-xs font-semibold mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
              {copy.price}
            </p>
            <p className="text-[#8a8070] text-[10px] mb-4">{copy.sub}</p>
            <a
              href="#pricing"
              className="block w-full py-2 rounded text-center text-sm font-bold uppercase tracking-widest transition-all duration-200"
              style={{
                background: '#c8a951',
                color: '#0a0c10',
                fontFamily: 'var(--font-rajdhani)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e0bb5a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#c8a951')}
            >
              Upgrade
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
