'use client'

/**
 * components/GateBlur.tsx
 *
 * Clean teaser + gate card pattern — no absolute overlay, no blurred overlap.
 * When locked:
 *   - Shows a clipped fade-out teaser of the content (max 80px, gradient fade)
 *   - Immediately below: a compact gate card with upgrade CTA
 * When unlocked:
 *   - Renders children fully, no gate
 *
 * Both Pro and Investor gates use identical sizing and padding — consistent visual pair.
 */

interface GateBlurProps {
  locked:    boolean
  tier:      'pro' | 'investor'
  children:  React.ReactNode
  headline?: string   // override default headline
}

const COPY: Record<'pro' | 'investor', { headline: string; price: string; sub: string; accent: string }> = {
  pro: {
    headline: 'Unlock Full Zone Details',
    price:    'Pro — $29/month CAD',
    sub:      'Permitted uses, setbacks, official links, and more.',
    accent:   '#c8a951',
  },
  investor: {
    headline: 'Unlock Investment Intelligence',
    price:    'Investor — $79/month CAD',
    sub:      'Construction costs, rental yield, and strategic flags.',
    accent:   '#c8a951',
  },
}

export default function GateBlur({ locked, tier, children, headline }: GateBlurProps) {
  if (!locked) return <>{children}</>

  const copy = COPY[tier]

  return (
    <div className="mt-2">
      {/* Teaser — clipped content with smooth gradient fade, no overlap */}
      <div
        className="relative overflow-hidden"
        style={{ maxHeight: 76, pointerEvents: 'none', userSelect: 'none' }}
        aria-hidden
      >
        <div style={{ opacity: 0.30, filter: 'blur(3px)' }}>
          {children}
        </div>
        {/* 40px gradient fade: transparent → gate card background colour */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ height: 40, background: 'linear-gradient(to bottom, transparent, #141820)' }}
        />
      </div>

      {/* Gate card — butts directly against gradient, no gap */}
      <div
        className="px-4 py-3 rounded-b-lg flex items-center justify-between gap-3"
        style={{
          background:   '#141820',
          border:       `1px solid ${copy.accent}`,
          borderTop:    'none',
          boxShadow:    `0 4px 20px rgba(200,169,81,0.10)`,
        }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm leading-none" style={{ color: copy.accent }}>🔒</span>
            <span className="text-[#e8e0d0] text-[11px] font-bold tracking-wide"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}>
              {headline ?? copy.headline}
            </span>
          </div>
          <p className="text-[10px] font-semibold" style={{ color: copy.accent, fontFamily: 'var(--font-mono)' }}>
            {copy.price}
          </p>
          <p className="text-[9px] text-[#8a8070] mt-0.5 leading-snug">{copy.sub}</p>
        </div>
        <a
          href="#pricing"
          className="flex-shrink-0 px-4 py-2 rounded text-center text-[10px] font-bold uppercase tracking-widest transition-all duration-150 whitespace-nowrap"
          style={{
            background:     copy.accent,
            color:          '#0a0c10',
            fontFamily:     'var(--font-rajdhani)',
            textDecoration: 'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e0bb5a')}
          onMouseLeave={e => (e.currentTarget.style.background = copy.accent)}
        >
          Upgrade
        </a>
      </div>
    </div>
  )
}
