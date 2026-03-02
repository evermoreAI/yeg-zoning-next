'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SearchBar from '@/components/SearchBar'

export default function LandingPage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleSearch = (result: any) => {
    if (result.address) {
      router.push(`/map?address=${encodeURIComponent(result.address)}&lat=${result.lat}&lng=${result.lng}`)
    }
  }

  // SVG checkmark component
  const CheckmarkIcon = () => (
    <svg className="w-4 h-4 text-[#c8a951] inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )

  // SVG dash component (for excluded)
  const DashIcon = () => (
    <span className="text-[#4a5568] mr-2">−</span>
  )

  return (
    <div className="relative min-h-screen bg-[#0a0c10] text-[#e8e0d0] overflow-x-hidden">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.05)_1px,rgba(255,255,255,0.05)_2px)] z-50" />

      {/* Grid background — parcel lot lines */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035]"
           style={{
             backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(200,169,81,0.05) 25%, rgba(200,169,81,0.05) 26%, transparent 27%, transparent 74%, rgba(200,169,81,0.05) 75%, rgba(200,169,81,0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(200,169,81,0.05) 25%, rgba(200,169,81,0.05) 26%, transparent 27%, transparent 74%, rgba(200,169,81,0.05) 75%, rgba(200,169,81,0.05) 76%, transparent 77%, transparent)',
             backgroundSize: '50px 50px',
           }} />

      {/* Animated border keyframes */}
      <style>{`
        @keyframes gradientRotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .investor-card-border {
          background: linear-gradient(90deg, #c8a951, #d4b86a, #c8a951, #b8860b);
          background-size: 300% 300%;
          animation: gradientRotate 4s ease infinite;
          padding: 2px;
          border-radius: 0.5rem;
        }
        .investor-card-border > div {
          background: #0a0c10;
          border-radius: calc(0.5rem - 2px);
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-16">
          {/* Gold badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#c8a951] bg-[rgba(200,169,81,0.1)]">
            <span className="text-lg">⚡</span>
            <span className="text-[11px] font-semibold text-[#c8a951] tracking-wider uppercase">Official City of Edmonton data — updated daily</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-center mb-4 leading-tight max-w-4xl"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
            Edmonton infill intelligence
          </h1>

          <p className="text-lg md:text-2xl text-[#c8a951] text-center mb-12 max-w-2xl leading-relaxed">
            Find the lot. Know the rules. Model the deal.
          </p>

          <div className="w-full max-w-2xl mb-6">
            <SearchBar onSelect={handleSearch} token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''} />
          </div>

          <p className="text-[12px] text-[#4a5568] text-center">
            Search any Edmonton address — free, no account required
          </p>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-[#8a8070] text-center mb-8">
              Due diligence in seconds. Not days.
            </p>
            <h2 className="text-4xl font-bold text-center mb-12"
                style={{ fontFamily: 'var(--font-rajdhani)' }}>
              Edmonton Infill Intelligence
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-lg border border-[#2a2e38]" style={{ background: '#141820' }}>
                <svg className="w-8 h-8 mb-4 text-[#c8a951]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="8" height="8" />
                  <rect x="13" y="3" width="8" height="8" />
                  <rect x="3" y="13" width="8" height="8" />
                  <rect x="13" y="13" width="8" height="8" />
                </svg>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-rajdhani)' }}>Zone Intelligence</h3>
                <p className="text-[13px] text-[#8a8070]">Real-time zoning rules, unit capacity, and bylaw interpretation for every Edmonton address.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-lg border border-[#2a2e38]" style={{ background: '#141820' }}>
                <svg className="w-8 h-8 mb-4" viewBox="0 0 24 24" fill="none" stroke="#c8a951" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-rajdhani)' }}>Amendment Tracking</h3>
                <p className="text-[13px] text-[#8a8070]">Know about zoning changes before they affect your strategy. Track rezonings in progress.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-lg border border-[#2a2e38]" style={{ background: '#141820' }}>
                <svg className="w-8 h-8 mb-4 text-[#c8a951]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="12" width="4" height="8" />
                  <rect x="10" y="5" width="4" height="15" />
                  <rect x="17" y="3" width="4" height="17" />
                </svg>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-rajdhani)' }}>Feasibility Analysis</h3>
                <p className="text-[13px] text-[#8a8070]">Estimate construction costs, rental revenue, and gross yield for infill projects.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-bold text-center mb-12 tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-rajdhani)' }}>
              Pricing
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free tier */}
              <div className="p-8 rounded-lg border border-[#2a2e38] transition-all duration-300" style={{ background: '#141820' }}>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-rajdhani)' }}>Free</h3>
                <div className="text-3xl font-bold text-[#c8a951] mb-6">$0<span className="text-sm text-[#4a5568]">/mo</span></div>
                <ul className="space-y-3 text-[13px] text-[#8a8070]">
                  <li><CheckmarkIcon /> Zone data & amendments</li>
                  <li><CheckmarkIcon /> Rezoning alerts</li>
                  <li><DashIcon /> Pro features gated</li>
                </ul>
              </div>

              {/* Pro tier */}
              <div className="p-8 rounded-lg border-2 border-[#c8a951] relative transition-all duration-300" style={{ background: '#141820' }}>
                <div className="absolute -top-3 left-6 bg-[#0a0c10] px-2">
                  <span className="text-[10px] font-bold text-[#c8a951] tracking-wider uppercase">Most Popular</span>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-rajdhani)' }}>Pro</h3>
                <div className="text-3xl font-bold text-[#c8a951] mb-6">$29<span className="text-sm text-[#4a5568]">/mo CAD</span></div>
                <ul className="space-y-3 text-[13px] text-[#8a8070]">
                  <li><CheckmarkIcon /> Everything in Free</li>
                  <li><CheckmarkIcon /> Unlimited searches</li>
                  <li><CheckmarkIcon /> Permit approval rates</li>
                  <li><CheckmarkIcon /> Neighbourhood profiles</li>
                  <li><DashIcon /> Feasibility locked</li>
                </ul>
              </div>

              {/* Investor tier (PREMIUM) */}
              <div className="investor-card-border"
                   onMouseEnter={() => setHoveredCard('investor')}
                   onMouseLeave={() => setHoveredCard(null)}>
                <div className="p-8"
                     style={{
                       background: 'linear-gradient(135deg, #1a1810 0%, #141820 50%, #1a1810 100%)',
                       boxShadow: hoveredCard === 'investor'
                         ? '0 0 60px rgba(200,169,81,0.35), 0 0 120px rgba(200,169,81,0.15)'
                         : '0 0 40px rgba(200,169,81,0.15), 0 0 80px rgba(200,169,81,0.05)',
                       transition: 'box-shadow 300ms ease',
                     }}>
                  
                  {/* MOST COMPLETE rule and label */}
                  <div className="flex items-center gap-3 mb-6 -mx-8 px-8 pb-6 border-b border-[#c8a951]">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c8a951]" />
                    <span className="text-[9px] font-bold text-[#c8a951] tracking-widest uppercase whitespace-nowrap">Most Complete</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c8a951]" />
                  </div>

                  <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-rajdhani)' }}>Investor</h3>
                  
                  <div className="mb-8">
                    <div className="text-5xl font-bold mb-1"
                         style={{
                           background: 'linear-gradient(135deg, #c8a951 0%, #d4b86a 100%)',
                           WebkitBackgroundClip: 'text',
                           WebkitTextFillColor: 'transparent',
                           backgroundClip: 'text',
                         }}>
                      $79
                    </div>
                    <div className="text-xs text-[#c8a951]">per month CAD</div>
                  </div>

                  <ul className="space-y-3 text-[13px] text-[#8a8070]">
                    <li><CheckmarkIcon /> Everything in Pro</li>
                    <li><CheckmarkIcon /> Feasibility analysis</li>
                    <li><CheckmarkIcon /> Construction cost models</li>
                    <li><CheckmarkIcon /> Rental market intel</li>
                    <li className="text-[#c8a951] font-bold"><CheckmarkIcon /> All features unlocked</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4 text-center border-t border-[#1e2530]">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>Ready to analyze your lot?</h2>
          <Link href="/map"
                className="inline-block px-8 py-3 rounded-lg bg-[#c8a951] text-[#0a0c10] font-bold hover:bg-[#d4b86a] transition-colors">
            Search Now
          </Link>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-[#1e2530] text-center text-[11px] text-[#4a5568]">
          <div className="max-w-6xl mx-auto space-y-4">
            <p>Built in Edmonton for Edmonton investors</p>
            <div className="flex justify-center gap-6">
              <Link href="/map" className="hover:text-[#c8a951] transition-colors">/map</Link>
              <Link href="/zones/rs" className="hover:text-[#c8a951] transition-colors">RS Zone Guide</Link>
            </div>
            <p>© 2026 InfillIQ. Real data. Real opportunities.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
