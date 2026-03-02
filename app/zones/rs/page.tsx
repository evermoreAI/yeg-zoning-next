import type { Metadata } from 'next'
import Link from 'next/link'
import SearchBarRedirect from '@/components/SearchBarRedirect'

export const metadata: Metadata = {
  title: 'Edmonton RS Zone Guide 2026 — What Can You Build?',
  description:
    'Everything Edmonton property owners and developers need to know about the RS zone in 2026. Units, height, coverage, setbacks, and the April 7 2026 amendment explained.',
  openGraph: {
    title: 'Edmonton RS Zone Guide 2026 — What Can You Build?',
    description:
      'Everything Edmonton property owners and developers need to know about the RS zone in 2026. Units, height, coverage, setbacks, and the April 7 2026 amendment explained.',
    url: 'https://infilliq.ca/zones/rs',
    siteName: 'InfillIQ',
  },
}

const PERMITTED = [
  'Single detached house','Secondary suite','Garden suite','Semi-detached house',
  'Row housing','Home-based business','Child care facility (small)','Urban agriculture',
]
const DISCRETIONARY = [
  'Neighbourhood café or bistro','Neighbourhood retail','Medical or dental office',
  'Personal service shop','Bed and breakfast',
]
const METRICS = [
  { label: 'Maximum Units',  value: '8',      note: 'Mid-block, lot ≥ 600 m²' },
  { label: 'Maximum Height', value: '3',      note: 'Storeys — under review Apr 7' },
  { label: 'Site Coverage',  value: '45%',    note: 'Maximum' },
  { label: 'Minimum Lot',    value: '600 m²', note: 'For 8-unit eligibility' },
]
const NEIGHBOURHOODS = [
  { name: 'McKernan',   units: '~376', detail: 'Strong central location near the University of Alberta drives consistent rental demand. One of Edmonton\'s most active infill markets.' },
  { name: 'Windsor Park', units: '~242', detail: 'Popular for proximity to amenities and a fast redevelopment pace. High demand from students and young professionals.' },
  { name: 'Glenora',    units: 'Premium', detail: 'Edmonton\'s premium infill market. Large historic lots command top dollar for luxury rowhouses and semi-detached homes. Mature trees and prestige location attract high-end development.' },
  { name: 'Jasper Park', units: '~197', detail: 'Inner-city appeal with strong ongoing redevelopment replacing older housing stock.' },
  { name: 'Strathcona', units: '~194', detail: 'Vibrant and walkable with consistent infill activity. One of Edmonton\'s most desirable neighbourhoods for small-scale residential development.' },
]
const FEASIBILITY = [
  { label: 'Construction cost estimate', low: '$1.44M', high: '$2.00M', mono: true },
  { label: 'Monthly gross revenue',      low: '$12,800', high: '$15,200', mono: true },
  { label: 'Annual gross revenue',       low: '$153,600', high: '$182,400', mono: true },
  { label: 'Gross yield',                low: '7.7%', high: '12.7%', mono: true },
]
const FAQS = [
  {
    q: 'How many units can I build on an RS lot in Edmonton?',
    a: 'Up to 8 units on a lot of 600 m² or larger. Smaller lots may qualify for fewer units — check your specific address using our free zone lookup tool.',
  },
  {
    q: 'What is the minimum lot size for 8 units in Edmonton RS zone?',
    a: '600 square metres for a mid-block lot under Bylaw 20001.',
  },
  {
    q: 'Can I build a secondary suite in RS zone Edmonton?',
    a: 'Yes. Secondary suites are a permitted use in RS zone — no City approval required beyond standard development and building permits.',
  },
  {
    q: 'What did the 2024 blanket rezoning change for RS zone?',
    a: 'The 2024 blanket rezoning replaced RF1 and RF3 zones across Edmonton\'s mature neighbourhoods with the new RS zone. This increased allowable density from 1–2 units to up to 8 units on qualifying lots.',
  },
  {
    q: 'What is the difference between RS and RSF zone in Edmonton?',
    a: 'RS is Small Scale Residential. RSF is Small Scale Flex Residential. Both permit up to 8 units with similar rules. RSF offers slightly more flexibility for mixed housing types. Both are subject to the April 7 2026 public hearing.',
  },
  {
    q: 'How long does an RS zone development permit take in Edmonton?',
    a: 'Approval timelines vary. Row housing and multi-unit projects typically take longer than single detached or semi-detached permits. Contact the City of Edmonton via 311 for current processing times.',
  },
  {
    q: 'Can I build a café or restaurant in RS zone Edmonton?',
    a: 'Ground floor neighbourhood commercial uses like cafés and bistros are discretionary in RS zone — meaning City approval is required. Approval depends on neighbourhood context and compliance with development guidelines.',
  },
]

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <>
      <p className="text-[10px] text-[#c8a951] tracking-[2px] uppercase mb-1"
         style={{ fontFamily: 'var(--font-rajdhani)' }}>Section {n}</p>
      <h2 className="text-2xl font-bold mb-4 text-[#e8e0d0]"
          style={{ fontFamily: 'var(--font-rajdhani)' }}>{children}</h2>
    </>
  )
}

export default function RSZonePage() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e0d0]" style={{ fontFamily: 'var(--font-inter)' }}>

      {/* Nav */}
      <nav className="border-b border-[#1a2535] px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-[#c8a951] text-lg">⚡</span>
          <span className="text-[#e8e0d0] font-bold text-sm tracking-[0.15em] uppercase"
                style={{ fontFamily: 'var(--font-rajdhani)' }}>YEG ZONING</span>
        </Link>
        <Link href="/"
              className="text-[10px] uppercase tracking-widest text-[#c8a951] border border-[#c8a951] px-3 py-1.5 rounded hover:bg-[#c8a951] hover:text-[#0a0c10] transition-all duration-150 no-underline"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
          Open Map →
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* Hero */}
        <header className="mb-14">
          <div className="text-[10px] text-[#c8a951] tracking-[3px] uppercase mb-3"
               style={{ fontFamily: 'var(--font-rajdhani)' }}>Edmonton Zoning Guide · 2026</div>
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
          <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
            <p className="text-[11px] text-[#8a8070] mb-2 uppercase tracking-wider"
               style={{ fontFamily: 'var(--font-rajdhani)' }}>Check your property instantly</p>
            <SearchBarRedirect />
          </div>
        </header>

        {/* Section 1 */}
        <section className="mb-12">
          <SectionLabel n="1">What is the RS Zone in Edmonton?</SectionLabel>
          <p className="text-[#a09080] leading-relaxed">
            RS stands for <strong className="text-[#e8e0d0]">Small Scale Residential</strong>. It is
            Edmonton's most common residential zone, introduced under{' '}
            <strong className="text-[#e8e0d0]">Bylaw 20001</strong> as part of the 2024 blanket rezoning
            that replaced the older RF1 and RF3 zones across mature neighbourhoods.
          </p>
          <p className="text-[#a09080] leading-relaxed mt-3">
            The RS zone was designed to enable gentle density — more housing units on existing lots without
            dramatically changing neighbourhood character.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-12">
          <SectionLabel n="2">RS Zone Development Rules at a Glance</SectionLabel>
          <p className="text-[#a09080] text-sm mb-6">
            These rules apply to a standard mid-block RS lot of 600 m² or larger under Bylaw 20001.
          </p>
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
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
              <div className="text-[9px] text-[#2d6a2d] tracking-[2px] uppercase mb-3 font-semibold"
                   style={{ fontFamily: 'var(--font-rajdhani)' }}>✓ Permitted Uses — no City approval required</div>
              <ul className="space-y-1.5">
                {PERMITTED.map(u => (
                  <li key={u} className="flex items-center gap-2 text-[12px] text-[#a09080]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a2d] flex-shrink-0" />{u}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
              <div className="text-[9px] text-[#b8860b] tracking-[2px] uppercase mb-3 font-semibold"
                   style={{ fontFamily: 'var(--font-rajdhani)' }}>⚠ Discretionary Uses — City approval required</div>
              <ul className="space-y-1.5">
                {DISCRETIONARY.map(u => (
                  <li key={u} className="flex items-center gap-2 text-[12px] text-[#a09080]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] flex-shrink-0" />{u}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-12">
          <SectionLabel n="3">⚠️ April 7 2026 Public Hearing — What You Need to Know</SectionLabel>
          <div className="p-4 rounded-lg mb-4"
               style={{ background: 'rgba(184,134,11,0.10)', border: '1px solid #b8860b', borderLeft: '4px solid #c8a951' }}>
            <p className="text-[#c8a951] text-sm font-semibold">
              Active amendment — verify with City of Edmonton before making development decisions.
            </p>
          </div>
          <p className="text-[#a09080] leading-relaxed mb-3">
            The City of Edmonton has scheduled a public hearing for{' '}
            <strong className="text-[#e8e0d0]">April 7 2026</strong> that may affect RS zone height
            limits and building length restrictions.
          </p>
          <ul className="space-y-2 mb-5">
            {[
              'The hearing may reduce maximum building length for row housing',
              'Side entrance requirements may be amended',
              'Height limits are under review',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-[#a09080]">
                <span className="text-[#c8a951] mt-0.5 flex-shrink-0">›</span>{item}
              </li>
            ))}
          </ul>
          <div className="p-4 rounded-lg mb-4" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
            <p className="text-[#8a8070] text-[12px] leading-relaxed font-semibold mb-1 text-[#e8e0d0]">
              What this means for developers
            </p>
            <p className="text-[#a09080] text-[12px] leading-relaxed">
              If you are planning an RS zone project, verify current rules with the City before finalizing
              any designs. Rules in effect at time of development permit application govern your project.
              Always verify with the City of Edmonton via 311 or edmonton.ca before making development
              decisions.
            </p>
          </div>
          <p className="text-[#4a5568] text-[11px]">
            Source: City of Edmonton. Always verify current rules at{' '}
            <a href="https://zoningbylaw.edmonton.ca" target="_blank" rel="noopener noreferrer"
               className="text-[#c8a951] underline">zoningbylaw.edmonton.ca</a>{' '}
            or by calling 311.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-12">
          <SectionLabel n="4">Where is RS Zoning Most Active in Edmonton?</SectionLabel>
          <p className="text-[#a09080] text-sm mb-5">
            These Edmonton neighbourhoods saw the highest RS zone infill development activity in 2025.
          </p>
          <div className="space-y-3">
            {NEIGHBOURHOODS.map((n, i) => (
              <div key={n.name} className="flex gap-4 p-4 rounded-lg"
                   style={{ background: '#141820', border: '1px solid #2a2e38' }}>
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-[#0a0c10] bg-[#c8a951]"
                     style={{ fontFamily: 'var(--font-mono)' }}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-[#e8e0d0] font-semibold text-sm"
                          style={{ fontFamily: 'var(--font-rajdhani)' }}>{n.name}</span>
                    <span className="text-[#c8a951] text-[11px] font-semibold"
                          style={{ fontFamily: 'var(--font-mono)' }}>{n.units} new units</span>
                  </div>
                  <p className="text-[#8a8070] text-[11px] leading-relaxed">{n.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-12">
          <SectionLabel n="5">What Does an RS Zone Development Actually Earn?</SectionLabel>
          <p className="text-[#a09080] text-sm mb-5">
            Based on current Edmonton market data as of February 2026. 8-unit RS development on a 600 m² lot.
          </p>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #2a2e38' }}>
            {FEASIBILITY.map((row, i) => (
              <div key={row.label}
                   className="flex items-center justify-between px-4 py-3 border-b border-[#1e2530] last:border-b-0"
                   style={{ background: i % 2 === 0 ? '#141820' : '#0f1318' }}>
                <span className="text-[#8a8070] text-[12px]">{row.label}</span>
                <span className="text-[#c8a951] font-semibold text-sm"
                      style={{ fontFamily: 'var(--font-mono)' }}>
                  {row.low} – {row.high}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[#4a5568] text-[10px] mt-3 italic">
            Wood frame multi-family estimate. Before land, financing, and operating costs.
            Always obtain professional quotes before making investment decisions.
          </p>
        </section>

        {/* Section 6 — FAQ */}
        <section className="mb-14">
          <SectionLabel n="6">Frequently Asked Questions About Edmonton RS Zone</SectionLabel>
          <div className="space-y-4">
            {FAQS.map(faq => (
              <div key={faq.q} className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
                <h3 className="text-[#e8e0d0] text-sm font-semibold mb-2 leading-snug"
                    style={{ fontFamily: 'var(--font-rajdhani)' }}>{faq.q}</h3>
                <p className="text-[#8a8070] text-[12px] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="p-6 rounded-xl mb-10"
                 style={{ background: '#141820', border: '1px solid #c8a951', boxShadow: '0 0 32px rgba(200,169,81,0.08)' }}>
          <h2 className="text-xl font-bold mb-1 text-[#c8a951]"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
            Check Any Edmonton Address Instantly
          </h2>
          <p className="text-[#8a8070] text-sm mb-4">
            Search any Edmonton address to see its zone, development rules, feasibility numbers, and
            amendment warnings — live from City of Edmonton GIS data. Free, no account required.
          </p>
          <SearchBarRedirect />
        </section>

        {/* Disclaimer + footer */}
        <footer className="border-t border-[#1e2530] pt-6">
          <p className="text-[10px] text-[#2a3040] leading-relaxed mb-4">
            Zoning data is for reference only. The City of Edmonton does not assume responsibility for
            accuracy of online reproductions. Always verify with the City of Edmonton before making
            development decisions. Contact Urban Planning via 311 for official interpretations.
            The City of Edmonton states that the online zoning bylaw is a reproduction for convenience
            only and is not legally binding. Last verified February 2026.
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
