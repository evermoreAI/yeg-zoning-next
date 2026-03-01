import type { Metadata } from 'next'
import Link from 'next/link'
import SearchRedirect from '@/components/SearchRedirect'

export const metadata: Metadata = {
  title: 'Edmonton RS Zone Guide 2026 — What Can You Build?',
  description:
    'Everything Edmonton property owners and developers need to know about the RS zone in 2026. Units, height, coverage, setbacks, and the April 7 2026 amendment explained.',
  openGraph: {
    title: 'Edmonton RS Zone Guide 2026 — What Can You Build?',
    description:
      'Everything Edmonton property owners and developers need to know about the RS zone in 2026. Units, height, coverage, setbacks, and the April 7 2026 amendment explained.',
    url: 'https://yeg-zoning-next.vercel.app/zones/rs',
    siteName: 'YEG Zoning Command Center',
  },
}

const PERMITTED = [
  'Single detached house',
  'Secondary suite',
  'Garden suite',
  'Semi-detached house',
  'Row housing',
  'Home-based business',
  'Child care facility (small)',
  'Urban agriculture',
]

const DISCRETIONARY = [
  'Neighbourhood café or bistro',
  'Neighbourhood retail',
  'Medical or dental office',
  'Personal service shop',
  'Bed and breakfast',
]

const METRICS = [
  { label: 'Maximum Units',      value: '8',     note: 'Mid-block, lot ≥ 600 m²' },
  { label: 'Maximum Height',     value: '3',     note: 'Storeys — under review Apr 7' },
  { label: 'Site Coverage',      value: '45%',   note: 'Maximum' },
  { label: 'Minimum Lot',        value: '600 m²', note: 'For 8-unit eligibility' },
]

export default function RSZonePage() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e0d0]" style={{ fontFamily: 'var(--font-inter)' }}>

      {/* ── Top nav ───────────────────────────────────────────────────────── */}
      <nav className="border-b border-[#1a2535] px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-[#c8a951] text-lg">⚡</span>
          <span className="text-[#e8e0d0] font-bold text-sm tracking-[0.15em] uppercase"
                style={{ fontFamily: 'var(--font-rajdhani)' }}>
            YEG ZONING
          </span>
        </Link>
        <Link href="/"
              className="text-[10px] uppercase tracking-widest text-[#c8a951] border border-[#c8a951] px-3 py-1.5 rounded hover:bg-[#c8a951] hover:text-[#0a0c10] transition-all duration-150 no-underline"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
          Open Map →
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <header className="mb-14">
          <div className="text-[10px] text-[#c8a951] tracking-[3px] uppercase mb-3"
               style={{ fontFamily: 'var(--font-rajdhani)' }}>
            Edmonton Zoning Guide · 2026
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6 text-[#e8e0d0]"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
            Edmonton RS Zone —{' '}
            <span className="text-[#c8a951]">What Can You Build in 2026?</span>
          </h1>
          <p className="text-[#a09080] text-base leading-relaxed mb-8 max-w-2xl">
            The 2024 blanket rezoning transformed thousands of Edmonton lots overnight. If your property is
            zoned RS — Small Scale Residential — you may be sitting on significantly more development
            potential than you realize. This guide explains exactly what the RS zone permits, what the
            numbers mean, and what the upcoming April 7 2026 public hearing could change.
          </p>

          {/* Hero search */}
          <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
            <p className="text-[11px] text-[#8a8070] mb-2 uppercase tracking-wider"
               style={{ fontFamily: 'var(--font-rajdhani)' }}>
              Check your property instantly
            </p>
            <SearchRedirect placeholder="Enter your Edmonton address…" />
          </div>
        </header>

        {/* ── Section 1: Basics ─────────────────────────────────────────────── */}
        <section className="mb-12">
          <p className="text-[10px] text-[#c8a951] tracking-[2px] uppercase mb-1"
             style={{ fontFamily: 'var(--font-rajdhani)' }}>Section 1</p>
          <h2 className="text-2xl font-bold mb-4 text-[#e8e0d0]"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
            What is the RS Zone in Edmonton?
          </h2>
          <p className="text-[#a09080] leading-relaxed">
            RS stands for <strong className="text-[#e8e0d0]">Small Scale Residential</strong>. It is
            Edmonton's most common residential zone, introduced under{' '}
            <strong className="text-[#e8e0d0]">Bylaw 20001</strong> as part of the 2024 blanket
            rezoning that replaced the older RF1 and RF3 zones across mature neighbourhoods.
          </p>
          <p className="text-[#a09080] leading-relaxed mt-3">
            The RS zone was designed to enable gentle density — more housing units on existing lots
            without dramatically changing neighbourhood character.
          </p>
        </section>

        {/* ── Section 2: Rules ──────────────────────────────────────────────── */}
        <section className="mb-12">
          <p className="text-[10px] text-[#c8a951] tracking-[2px] uppercase mb-1"
             style={{ fontFamily: 'var(--font-rajdhani)' }}>Section 2</p>
          <h2 className="text-2xl font-bold mb-2 text-[#e8e0d0]"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
            RS Zone Development Rules at a Glance
          </h2>
          <p className="text-[#a09080] text-sm mb-6">
            These rules apply to a standard mid-block RS lot of 600 m² or larger under Bylaw 20001.
          </p>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {METRICS.map(m => (
              <div key={m.label} className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
                <div className="text-[9px] text-[#8a8070] tracking-[2px] uppercase mb-1"
                     style={{ fontFamily: 'var(--font-rajdhani)' }}>{m.label}</div>
                <div className="text-2xl font-semibold text-[#c8a951]"
                     style={{ fontFamily: 'var(--font-mono)' }}>{m.value}</div>
                <div className="text-[10px] text-[#4a5568] mt-0.5">{m.note}</div>
              </div>
            ))}
          </div>

          {/* Uses */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
              <div className="text-[9px] text-[#2d6a2d] tracking-[2px] uppercase mb-3 font-semibold"
                   style={{ fontFamily: 'var(--font-rajdhani)' }}>
                ✓ Permitted Uses — no City approval required
              </div>
              <ul className="space-y-1.5">
                {PERMITTED.map(u => (
                  <li key={u} className="flex items-center gap-2 text-[12px] text-[#a09080]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a2d] flex-shrink-0" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
              <div className="text-[9px] text-[#b8860b] tracking-[2px] uppercase mb-3 font-semibold"
                   style={{ fontFamily: 'var(--font-rajdhani)' }}>
                ⚠ Discretionary Uses — City approval required
              </div>
              <ul className="space-y-1.5">
                {DISCRETIONARY.map(u => (
                  <li key={u} className="flex items-center gap-2 text-[12px] text-[#a09080]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] flex-shrink-0" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Section 3: Amendment ──────────────────────────────────────────── */}
        <section className="mb-12">
          <p className="text-[10px] text-[#c8a951] tracking-[2px] uppercase mb-1"
             style={{ fontFamily: 'var(--font-rajdhani)' }}>Section 3</p>
          <h2 className="text-2xl font-bold mb-4 text-[#e8e0d0]"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
            ⚠️ April 7 2026 Public Hearing — What You Need to Know
          </h2>
          <div className="p-4 rounded-lg mb-4"
               style={{ background: 'rgba(184,134,11,0.10)', border: '1px solid #b8860b', borderLeft: '4px solid #c8a951' }}>
            <p className="text-[#c8a951] text-sm font-semibold mb-1">
              Active amendment — verify with City of Edmonton before making development decisions.
            </p>
          </div>
          <p className="text-[#a09080] leading-relaxed mb-3">
            The City of Edmonton has scheduled a public hearing for{' '}
            <strong className="text-[#e8e0d0]">April 7 2026</strong> that may affect RS zone height
            limits and building length restrictions.
          </p>
          <p className="text-[#8a8070] text-sm mb-2">Key details:</p>
          <ul className="space-y-2 mb-4">
            {[
              'The hearing may reduce maximum building length for row housing',
              'Side entrance requirements may be amended',
              'Height limits are under review',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-[#a09080]">
                <span className="text-[#c8a951] mt-0.5 flex-shrink-0">›</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[#4a5568] text-[11px]">
            Source: City of Edmonton. Always verify current rules at{' '}
            <a href="https://zoningbylaw.edmonton.ca" target="_blank" rel="noopener noreferrer"
               className="text-[#c8a951] underline">
              zoningbylaw.edmonton.ca
            </a>{' '}
            or by calling 311.
          </p>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="p-6 rounded-xl mb-12"
                 style={{ background: '#141820', border: '1px solid #c8a951', boxShadow: '0 0 32px rgba(200,169,81,0.08)' }}>
          <h2 className="text-xl font-bold mb-1 text-[#c8a951]"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
            Check Your Property Now
          </h2>
          <p className="text-[#8a8070] text-sm mb-4">
            Search any Edmonton address to see live zoning data, development potential, and feasibility
            estimates — straight from City of Edmonton GIS data.
          </p>
          <SearchRedirect placeholder="Enter your Edmonton address…" />
        </section>

        {/* ── Disclaimer ────────────────────────────────────────────────────── */}
        <footer className="border-t border-[#1e2530] pt-6">
          <p className="text-[10px] text-[#2a3040] leading-relaxed mb-3">
            The City of Edmonton states that the online zoning bylaw is a reproduction for convenience
            only and is not legally binding. Always verify zoning information directly with the City of
            Edmonton by calling 311 or visiting edmonton.ca before making any development or investment
            decisions. Zoning rules may change — last verified February 2026.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[10px] text-[#4a5568] hover:text-[#c8a951] transition-colors no-underline">
              ← Back to Map
            </Link>
            <a href="https://zoningbylaw.edmonton.ca/bylaw/rs" target="_blank" rel="noopener noreferrer"
               className="text-[10px] text-[#4a5568] hover:text-[#c8a951] transition-colors no-underline">
              Official RS Bylaw ↗
            </a>
          </div>
        </footer>

      </main>
    </div>
  )
}
