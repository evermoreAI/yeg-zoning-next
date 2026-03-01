import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'
import Link              from 'next/link'
import SearchBarRedirect from '@/components/SearchBarRedirect'

// ── Neighbourhood data ────────────────────────────────────────────────────────

interface NeighbourhoodData {
  slug:          string
  name:          string
  title:         string
  metaDesc:      string
  canonicalUrl:  string
  headline:      string
  subheadline:   string
  intro:         string
  dominantZone:  string
  units2025:     string
  character:     string
  landValueLow:  string
  landValueHigh: string
  keyFacts:      string[]
  rentalPremium: string
  feasibility:   { label: string; low: string; high: string }[]
  faqs:          { q: string; a: string }[]
}

const NEIGHBOURHOODS: Record<string, NeighbourhoodData> = {
  mckernan: {
    slug: 'mckernan', name: 'McKernan',
    title:    'McKernan Infill Intelligence — Zoning, Land Values, and Feasibility 2026',
    metaDesc: 'McKernan Edmonton infill guide 2026. RS zone, ~376 new units in 2025, land values $400K–$700K. Live zoning data for any McKernan address.',
    canonicalUrl: 'https://yeg-zoning-next.vercel.app/neighbourhoods/mckernan',
    headline: 'McKernan Infill Intelligence', subheadline: 'Zoning, Land Values, and Feasibility 2026',
    intro: "McKernan is one of Edmonton's most active RS zone infill markets. Bounded by the University of Alberta and mature tree-lined streets, it combines inner-city location with strong rental demand from students and professionals. This guide covers zoning rules, current land values, April 2026 amendment implications, and feasibility numbers for McKernan specifically.",
    dominantZone: 'RS — Small Scale Residential', units2025: '~376',
    character: 'High-velocity infill, strong university rental demand, mature inner city location',
    landValueLow: '$400,000', landValueHigh: '$700,000',
    keyFacts: [
      "One of Edmonton's most active RS infill markets in 2025 with ~376 new units added",
      'Strong central location near the University of Alberta drives consistent rental demand',
      'Walkable neighbourhood with transit access, close to Whyte Ave and Mill Creek Ravine',
      'Typical RS lot sizes 450–650 m² — many qualify for 8-unit development',
      'Rental premiums for UofA proximity: expect 5–8% above Edmonton average 2BR rents',
    ],
    rentalPremium: "McKernan properties benefit from consistent University of Alberta rental demand. Expect 5–8% above Edmonton average rental rates for 2-bedroom units, with very low vacancy.",
    feasibility: [
      { label: 'Estimated land value (600 m² lot)',     low: '$400,000', high: '$700,000'  },
      { label: 'Construction cost estimate (8 units)',  low: '$1.44M',   high: '$2.00M'   },
      { label: 'Monthly gross revenue',                 low: '$13,600',  high: '$16,400'  },
      { label: 'Annual gross revenue',                  low: '$163,200', high: '$196,800' },
      { label: 'Gross yield on construction cost',      low: '8.2%',     high: '13.7%'   },
    ],
    faqs: [
      { q: "Is McKernan Edmonton zoned RS?", a: "The majority of McKernan's residential lots are RS (Small Scale Residential) under Bylaw 20001, introduced via Edmonton's 2024 blanket rezoning. Some lots may retain different zoning — always verify your specific address." },
      { q: "How many units can I build in McKernan?", a: "Up to 8 units on a qualifying lot of 600 m² or larger. Smaller lots may qualify for 3–6 units depending on frontage and configuration. Use the free zone lookup tool above to check your exact address." },
      { q: "What are typical land values in McKernan Edmonton in 2026?", a: "McKernan RS lots are currently trading in the $400,000 to $700,000 range for a standard 600 m² lot, depending on condition, orientation, and proximity to transit." },
      { q: "Does the April 7 2026 public hearing affect McKernan development?", a: "Yes — if height limits or building length restrictions are amended at the April 7 2026 public hearing, McKernan RS projects will be affected. Verify current rules with the City before finalizing designs." },
      { q: "Is McKernan a good neighbourhood for Edmonton infill investment?", a: "McKernan is consistently regarded as one of Edmonton's top RS zone investment areas due to university proximity, walkability, and strong rental demand from students and professionals." },
    ],
  },

  glenora: {
    slug: 'glenora', name: 'Glenora',
    title:    'Glenora Infill Intelligence — Zoning, Land Values, and Feasibility 2026',
    metaDesc: "Glenora Edmonton's premium infill market. RS zone, large historic lots, land values $600K–$1.2M+. Live zoning data for any Glenora address.",
    canonicalUrl: 'https://yeg-zoning-next.vercel.app/neighbourhoods/glenora',
    headline: 'Glenora Infill Intelligence', subheadline: 'Zoning, Land Values, and Feasibility 2026',
    intro: "Glenora is Edmonton's premier luxury infill neighbourhood. Large historic lots, mature elm canopy, and direct river valley access command the highest land values in the mature residential market. For developers and investors targeting the upper end of Edmonton's infill spectrum, Glenora offers premium positioning with strong resale and rental demand.",
    dominantZone: 'RS — Small Scale Residential', units2025: 'Premium market',
    character: 'Premium luxury infill, large historic lots, mature trees, prestige river valley location',
    landValueLow: '$600,000', landValueHigh: '$1,200,000+',
    keyFacts: [
      "Edmonton's most prestigious inner-city neighbourhood for luxury infill development",
      'Large historic lots — many well above the 600 m² RS threshold — command premium prices',
      'River valley proximity and mature elm canopy drive significant price premiums',
      'High-end rowhouses and semi-detached replacing older stock at top market prices',
      "Prestige address supports premium rents: 15–25% above Edmonton's inner-city average",
    ],
    rentalPremium: "Glenora's prestige address and river valley proximity support rental rates 15–25% above Edmonton's inner-city average. Premium finishes are expected by tenants at this price point.",
    feasibility: [
      { label: 'Estimated land value (600 m² lot)',     low: '$600,000', high: '$1,200,000+' },
      { label: 'Construction cost estimate (8 units)',  low: '$1.60M',   high: '$2.40M'     },
      { label: 'Monthly gross revenue',                 low: '$15,200',  high: '$20,000'    },
      { label: 'Annual gross revenue',                  low: '$182,400', high: '$240,000'   },
      { label: 'Gross yield on construction cost',      low: '7.6%',     high: '15.0%'     },
    ],
    faqs: [
      { q: "Is Glenora Edmonton zoned RS?", a: "The majority of Glenora's residential lots are RS (Small Scale Residential) following the 2024 blanket rezoning. Some properties retain heritage or special zone designations — verify your specific address." },
      { q: "What are land values in Glenora Edmonton in 2026?", a: "Glenora RS lots trade in the $600,000 to $1,200,000+ range, significantly above the Edmonton RS average, driven by lot size, river valley access, and prestige location." },
      { q: "Is Glenora good for RS zone infill development?", a: "Glenora suits experienced developers targeting the luxury segment. Land costs are high, but achievable rents and sale prices at the top of the Edmonton market can support strong returns on premium builds." },
      { q: "Can I build 8 units in Glenora?", a: "Many Glenora lots exceed 600 m² and qualify for 8-unit RS development. Larger lots may allow even greater density depending on configuration. Verify your address using the tool above." },
      { q: "Does the April 7 2026 amendment affect Glenora development?", a: "Yes — any change to RS zone height or building length from the April 7 2026 public hearing applies to Glenora RS lots. Always verify current rules before starting design." },
    ],
  },

  strathcona: {
    slug: 'strathcona', name: 'Strathcona',
    title:    'Strathcona Infill Intelligence — Zoning, Land Values, and Feasibility 2026',
    metaDesc: 'Strathcona Edmonton infill guide 2026. RS zone, ~194 new units in 2025, land values $450K–$750K. Live zoning data for any Strathcona address.',
    canonicalUrl: 'https://yeg-zoning-next.vercel.app/neighbourhoods/strathcona',
    headline: 'Strathcona Infill Intelligence', subheadline: 'Zoning, Land Values, and Feasibility 2026',
    intro: "Strathcona is Edmonton's most walkable inner-city neighbourhood. The Whyte Avenue commercial strip, strong arts culture, and high transit scores create exceptional demand from young professionals and students. With ~194 new units added in 2025, the RS zone infill market here is consistent, well-established, and increasingly competitive.",
    dominantZone: 'RS — Small Scale Residential', units2025: '~194',
    character: 'Vibrant walkable arts district, Whyte Ave strip, consistent infill activity',
    landValueLow: '$450,000', landValueHigh: '$750,000',
    keyFacts: [
      '~194 new residential units added in Strathcona in 2025 under the RS zone',
      'Whyte Ave commercial corridor drives exceptional walkability and neighbourhood demand',
      'Strong rental demand from young professionals, creatives, and UofA students',
      "One of Edmonton's highest Walk Score and Transit Score neighbourhoods",
      'Rental premium: 8–12% above Edmonton inner-city average for 2BR units',
    ],
    rentalPremium: "Strathcona commands an 8–12% rental premium over Edmonton's inner-city average due to walkability, the Whyte Ave strip, and strong demand from young professionals. Vacancy is consistently low.",
    feasibility: [
      { label: 'Estimated land value (600 m² lot)',     low: '$450,000', high: '$750,000'  },
      { label: 'Construction cost estimate (8 units)',  low: '$1.44M',   high: '$2.00M'   },
      { label: 'Monthly gross revenue',                 low: '$14,000',  high: '$17,200'  },
      { label: 'Annual gross revenue',                  low: '$168,000', high: '$206,400' },
      { label: 'Gross yield on construction cost',      low: '8.4%',     high: '14.3%'   },
    ],
    faqs: [
      { q: "Is Strathcona Edmonton zoned RS?", a: "Residential lots in Strathcona are predominantly RS (Small Scale Residential) following the 2024 blanket rezoning. Some lots fronting Whyte Ave or major streets may have commercial or mixed-use zoning — verify your specific address." },
      { q: "What are land values in Strathcona Edmonton in 2026?", a: "Strathcona RS lots are trading in the $450,000 to $750,000 range, with premiums for lots with rear lane access, corner positions, or proximity to Whyte Ave." },
      { q: "Is Strathcona a good neighbourhood for infill investment in Edmonton?", a: "Strathcona is one of Edmonton's most desirable infill neighbourhoods. Strong walkability, consistent rental demand, and a vibrant commercial strip support both rental income and long-term capital growth." },
      { q: "How many units can I build in Strathcona?", a: "Up to 8 units on a qualifying 600 m² RS lot. Strathcona lot sizes vary — use the zone lookup above to check your specific address for exact development potential." },
      { q: "Does the April 7 2026 public hearing affect Strathcona?", a: "Any RS zone rule change from the April 7 2026 hearing applies to Strathcona lots. Verify current rules with the City of Edmonton before finalizing development plans." },
    ],
  },

  'windsor-park': {
    slug: 'windsor-park', name: 'Windsor Park',
    title:    'Windsor Park Infill Intelligence — Zoning, Land Values, and Feasibility 2026',
    metaDesc: 'Windsor Park Edmonton infill guide 2026. RS zone, ~242 new units in 2025, land values $450K–$700K. Live zoning data for any Windsor Park address.',
    canonicalUrl: 'https://yeg-zoning-next.vercel.app/neighbourhoods/windsor-park',
    headline: 'Windsor Park Infill Intelligence', subheadline: 'Zoning, Land Values, and Feasibility 2026',
    intro: "Windsor Park is one of Edmonton's fastest-moving RS zone infill markets. Adjacent to the University of Alberta and close to Whyte Ave, it combines academic rental demand with a fast-paced resale market. With ~242 new units added in 2025, Windsor Park is consistently among Edmonton's top five RS infill neighbourhoods.",
    dominantZone: 'RS — Small Scale Residential', units2025: '~242',
    character: 'Fast redevelopment pace, strong University of Alberta proximity, professional renters',
    landValueLow: '$450,000', landValueHigh: '$700,000',
    keyFacts: [
      "~242 new residential units added in Windsor Park in 2025 — one of Edmonton's highest volumes",
      'Adjacent to the University of Alberta, driving exceptional student and staff rental demand',
      'Fast-moving market: properties averaging 18–20 days to sale in 2025',
      'Strong demand from young professionals and UofA staff for premium infill product',
      'Rental premium: 6–10% above Edmonton inner-city average for 2BR units',
    ],
    rentalPremium: "Windsor Park benefits from direct University of Alberta adjacency. Expect 6–10% rental premium over Edmonton's inner-city average, with particularly strong demand for 1 and 2-bedroom units from graduate students and university staff.",
    feasibility: [
      { label: 'Estimated land value (600 m² lot)',     low: '$450,000', high: '$700,000'  },
      { label: 'Construction cost estimate (8 units)',  low: '$1.44M',   high: '$2.00M'   },
      { label: 'Monthly gross revenue',                 low: '$13,800',  high: '$16,800'  },
      { label: 'Annual gross revenue',                  low: '$165,600', high: '$201,600' },
      { label: 'Gross yield on construction cost',      low: '8.3%',     high: '14.0%'   },
    ],
    faqs: [
      { q: "Is Windsor Park Edmonton zoned RS?", a: "Windsor Park residential lots are predominantly RS (Small Scale Residential) under the 2024 blanket rezoning. Always verify your specific address — some lots may retain different zoning." },
      { q: "What are land values in Windsor Park Edmonton in 2026?", a: "Windsor Park RS lots are trading in the $450,000 to $700,000 range, with the best lots — rear lane access, larger size, proximity to transit — at the top of that range." },
      { q: "How fast does the Windsor Park infill market move?", a: "Windsor Park has been one of Edmonton's fastest-moving infill markets, with qualified properties averaging 18–20 days to sale in 2025. High buyer competition reflects strong investor confidence." },
      { q: "How many units can I build in Windsor Park?", a: "Up to 8 units on a qualifying RS lot of 600 m² or more. Use the zone lookup above to check your exact address — lot sizes in Windsor Park vary and will affect your development potential." },
      { q: "Does the April 7 2026 amendment affect Windsor Park?", a: "Yes. Any change to RS zone height limits or building length from the April 7 2026 public hearing applies to Windsor Park. Verify current rules before finalizing design or permits." },
    ],
  },

  'jasper-park': {
    slug: 'jasper-park', name: 'Jasper Park',
    title:    'Jasper Park Infill Intelligence — Zoning, Land Values, and Feasibility 2026',
    metaDesc: 'Jasper Park Edmonton infill guide 2026. RS zone, ~197 new units in 2025, land values $400K–$650K. Live zoning data for any Jasper Park address.',
    canonicalUrl: 'https://yeg-zoning-next.vercel.app/neighbourhoods/jasper-park',
    headline: 'Jasper Park Infill Intelligence', subheadline: 'Zoning, Land Values, and Feasibility 2026',
    intro: "Jasper Park is an established inner-city Edmonton neighbourhood with consistent RS zone redevelopment activity. With ~197 new units added in 2025, it sits among Edmonton's top performing infill markets. Older housing stock is steadily being replaced with modern multi-unit infill, supported by solid inner-city demand and accessible land values.",
    dominantZone: 'RS — Small Scale Residential', units2025: '~197',
    character: 'Inner city appeal, consistent redevelopment, accessible land values, solid rental demand',
    landValueLow: '$400,000', landValueHigh: '$650,000',
    keyFacts: [
      '~197 new residential units added in Jasper Park in 2025 under the RS zone',
      'Consistent permit activity replacing older housing stock with modern infill product',
      'Strong inner-city location with good transit access and proximity to downtown',
      'Accessible land values relative to McKernan and Strathcona make entry more feasible',
      'Solid rental demand from professionals and families seeking inner-city living',
    ],
    rentalPremium: "Jasper Park's inner-city location supports rental rates 4–7% above Edmonton's suburban average. More accessible price points than Strathcona or McKernan can mean better yield on total development cost.",
    feasibility: [
      { label: 'Estimated land value (600 m² lot)',     low: '$400,000', high: '$650,000'  },
      { label: 'Construction cost estimate (8 units)',  low: '$1.44M',   high: '$2.00M'   },
      { label: 'Monthly gross revenue',                 low: '$12,800',  high: '$15,600'  },
      { label: 'Annual gross revenue',                  low: '$153,600', high: '$187,200' },
      { label: 'Gross yield on construction cost',      low: '7.7%',     high: '13.0%'   },
    ],
    faqs: [
      { q: "Is Jasper Park Edmonton zoned RS?", a: "Jasper Park residential lots are predominantly RS (Small Scale Residential) following the 2024 blanket rezoning. Verify your specific address — some lots may retain older zoning designations." },
      { q: "What are land values in Jasper Park Edmonton in 2026?", a: "Jasper Park RS lots are currently in the $400,000 to $650,000 range — more accessible than some inner-city neighbours while still offering strong fundamentals for 8-unit RS development." },
      { q: "Is Jasper Park a good neighbourhood for Edmonton infill investment?", a: "Jasper Park offers a compelling combination of inner-city location, consistent permit activity, and more accessible land values than Strathcona or Glenora. It suits value-focused investors who still want inner-city exposure." },
      { q: "How many units can I build in Jasper Park?", a: "Up to 8 units on a qualifying RS lot of 600 m². Lot sizes vary — use the zone lookup above to check your specific address for exact development potential." },
      { q: "Does the April 7 2026 amendment affect Jasper Park?", a: "Yes. Any RS zone changes from the April 7 2026 public hearing apply to all RS-zoned lots including Jasper Park. Always verify rules with the City of Edmonton before making development decisions." },
    ],
  },
}

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(NEIGHBOURHOODS).map(slug => ({ neighbourhood: slug }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: { neighbourhood: string } }
): Promise<Metadata> {
  const data = NEIGHBOURHOODS[params.neighbourhood]
  if (!data) return { title: 'Not Found' }
  return {
    title: data.title,
    description: data.metaDesc,
    openGraph: {
      title: data.title, description: data.metaDesc,
      url: data.canonicalUrl, siteName: 'YEG Zoning Command Center',
    },
    alternates: { canonical: data.canonicalUrl },
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function NeighbourhoodPage({ params }: { params: { neighbourhood: string } }) {
  const data = NEIGHBOURHOODS[params.neighbourhood]
  if (!data) notFound()

  const { name, headline, subheadline, intro, dominantZone, units2025, character,
          landValueLow, landValueHigh, keyFacts, rentalPremium, feasibility, faqs } = data

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
               style={{ fontFamily: 'var(--font-rajdhani)' }}>Edmonton Neighbourhood Guide · 2026</div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-[#e8e0d0]"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
            {headline} —{' '}
            <span className="text-[#c8a951]">{subheadline}</span>
          </h1>
          <p className="text-[#a09080] text-base leading-relaxed mb-8 mt-4 max-w-2xl">{intro}</p>
          <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
            <p className="text-[11px] text-[#8a8070] mb-2 uppercase tracking-wider"
               style={{ fontFamily: 'var(--font-rajdhani)' }}>Check any {name} address instantly</p>
            <SearchBarRedirect />
          </div>
        </header>

        {/* Section 1 — Stats */}
        <section className="mb-12">
          <SectionLabel n="1">{name} at a Glance — 2026</SectionLabel>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Dominant Zone',    value: dominantZone,   mono: false },
              { label: 'New Units (2025)', value: units2025,      mono: true  },
              { label: 'Land Value Low',   value: landValueLow,   mono: true  },
              { label: 'Land Value High',  value: landValueHigh,  mono: true  },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-lg"
                   style={{ background: '#141820', border: '1px solid #2a2e38' }}>
                <div className="text-[9px] text-[#8a8070] tracking-[2px] uppercase mb-1"
                     style={{ fontFamily: 'var(--font-rajdhani)' }}>{item.label}</div>
                <div className={`font-semibold text-[#c8a951] leading-tight ${item.mono ? 'text-lg' : 'text-sm'}`}
                     style={{ fontFamily: item.mono ? 'var(--font-mono)' : 'var(--font-rajdhani)' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
            <div className="text-[9px] text-[#8a8070] tracking-[2px] uppercase mb-2"
                 style={{ fontFamily: 'var(--font-rajdhani)' }}>Neighbourhood Character</div>
            <p className="text-[#a09080] text-sm">{character}</p>
          </div>
        </section>

        {/* Section 2 — Land Values */}
        <section className="mb-12">
          <SectionLabel n="2">{name} Land Values — What Are Lots Worth in 2026?</SectionLabel>
          <p className="text-[#a09080] leading-relaxed mb-4">
            {name} RS zone lots are currently trading in the{' '}
            <strong className="text-[#c8a951]">{landValueLow} to {landValueHigh}</strong> range for a
            standard 600 m² lot. Premium lots with rear lane access, corner positions, or larger footprints
            trade at the top of — or above — this range.
          </p>
          <div className="p-4 rounded-lg mb-4"
               style={{ background: 'rgba(200,169,81,0.06)', border: '1px solid #2a2e38' }}>
            <p className="text-[11px] text-[#8a8070] uppercase tracking-wider mb-2"
               style={{ fontFamily: 'var(--font-rajdhani)' }}>What drives value in {name}</p>
            <ul className="space-y-1.5">
              {['Rear lane access (premium for vehicle-accessible builds)',
                'Lot size above 600 m² (enables full 8-unit RS development)',
                'Corner lots (additional setback flexibility)',
                'Proximity to transit routes and walkable amenities'].map(f => (
                <li key={f} className="flex items-start gap-2 text-[12px] text-[#a09080]">
                  <span className="text-[#c8a951] flex-shrink-0 mt-0.5">›</span>{f}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[#4a5568] text-[11px]">
            Land values are estimates. Always obtain a professional appraisal before transacting. Check
            any {name} address above for current live zoning data.
          </p>
        </section>

        {/* Section 3 — RS Rules + Amendment */}
        <section className="mb-12">
          <SectionLabel n="3">RS Zone Rules in {name} — and the April 7 2026 Amendment</SectionLabel>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: 'Maximum Units',  value: '8',      note: 'Mid-block, lot ≥ 600 m²' },
              { label: 'Maximum Height', value: '3',      note: 'Storeys — under review'   },
              { label: 'Site Coverage',  value: '45%',    note: 'Maximum'                  },
              { label: 'Minimum Lot',    value: '600 m²', note: 'For 8-unit eligibility'   },
            ].map(m => (
              <div key={m.label} className="p-4 rounded-lg"
                   style={{ background: '#141820', border: '1px solid #2a2e38' }}>
                <div className="text-[9px] text-[#8a8070] tracking-[2px] uppercase mb-1"
                     style={{ fontFamily: 'var(--font-rajdhani)' }}>{m.label}</div>
                <div className="text-2xl font-semibold text-[#c8a951]"
                     style={{ fontFamily: 'var(--font-mono)' }}>{m.value}</div>
                <div className="text-[10px] text-[#4a5568] mt-0.5">{m.note}</div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-lg mb-4"
               style={{ background: 'rgba(184,134,11,0.10)', border: '1px solid #b8860b', borderLeft: '4px solid #c8a951' }}>
            <p className="text-[#c8a951] text-sm font-semibold mb-1">⚠️ April 7 2026 Public Hearing — Active Amendment</p>
            <p className="text-[#a09080] text-[12px] leading-relaxed">
              The City of Edmonton has a public hearing on <strong className="text-[#e8e0d0]">April 7 2026</strong> that
              may change RS zone height limits and building length restrictions for {name} lots. Verify current rules
              before finalizing designs or permit applications.
            </p>
          </div>
          <ul className="space-y-1.5 mb-4">
            {['Height limits are under review — current 3-storey limit may be amended',
              'Building length restrictions for row housing may change',
              'Side entrance requirements may be updated'].map(item => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-[#a09080]">
                <span className="text-[#c8a951] mt-0.5 flex-shrink-0">›</span>{item}
              </li>
            ))}
          </ul>
          <p className="text-[#4a5568] text-[11px]">
            Verify at{' '}
            <a href="https://zoningbylaw.edmonton.ca" target="_blank" rel="noopener noreferrer"
               className="text-[#c8a951] underline">zoningbylaw.edmonton.ca</a>{' '}
            or call 311.
          </p>
        </section>

        {/* Section 4 — Key Facts */}
        <section className="mb-12">
          <SectionLabel n="4">Why Investors Choose {name}</SectionLabel>
          <div className="space-y-2">
            {keyFacts.map((fact, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg"
                   style={{ background: '#141820', border: '1px solid #2a2e38' }}>
                <span className="text-[#c8a951] font-bold text-sm flex-shrink-0 mt-0.5"
                      style={{ fontFamily: 'var(--font-mono)' }}>0{i + 1}</span>
                <p className="text-[#a09080] text-[12px] leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 — Feasibility */}
        <section className="mb-12">
          <SectionLabel n="5">{name} RS Zone Feasibility — What Does an 8-Unit Build Earn?</SectionLabel>
          <p className="text-[#a09080] text-sm mb-3">
            Based on Edmonton market data as of February 2026. 8-unit RS development on a qualifying {name} lot.
          </p>
          <div className="p-4 rounded-lg mb-4"
               style={{ background: 'rgba(45,106,45,0.10)', border: '1px solid #2d6a2d' }}>
            <p className="text-[11px] text-[#6ab86a] uppercase tracking-wider mb-1 font-semibold"
               style={{ fontFamily: 'var(--font-rajdhani)' }}>Rental premium note</p>
            <p className="text-[#a09080] text-[12px] leading-relaxed">{rentalPremium}</p>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #2a2e38' }}>
            {feasibility.map((row, i) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3 border-b border-[#1e2530] last:border-b-0"
                   style={{ background: i % 2 === 0 ? '#141820' : '#0f1318' }}>
                <span className="text-[#8a8070] text-[12px]">{row.label}</span>
                <span className="text-[#c8a951] font-semibold text-sm"
                      style={{ fontFamily: 'var(--font-mono)' }}>{row.low} – {row.high}</span>
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
          <SectionLabel n="6">Frequently Asked Questions — {name} Infill 2026</SectionLabel>
          <div className="space-y-4">
            {faqs.map(faq => (
              <div key={faq.q} className="p-4 rounded-lg"
                   style={{ background: '#141820', border: '1px solid #2a2e38' }}>
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
              style={{ fontFamily: 'var(--font-rajdhani)' }}>Check Any {name} Address Instantly</h2>
          <p className="text-[#8a8070] text-sm mb-4">
            Search any {name} address for live zone data, development rules, feasibility numbers, and
            amendment warnings — direct from City of Edmonton GIS. Free, no account required.
          </p>
          <SearchBarRedirect />
        </section>

        {/* Footer */}
        <footer className="border-t border-[#1e2530] pt-6">
          <p className="text-[10px] text-[#2a3040] leading-relaxed mb-4">
            Zoning data is for reference only. Always verify with the City of Edmonton before making
            development decisions. Contact Urban Planning via 311 for official interpretations.
            Not legally binding. Last verified February 2026.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[10px] text-[#4a5568] hover:text-[#c8a951] transition-colors no-underline">← Back to Map</Link>
            <a href="https://zoningbylaw.edmonton.ca/bylaw/rs" target="_blank" rel="noopener noreferrer"
               className="text-[10px] text-[#4a5568] hover:text-[#c8a951] transition-colors no-underline">Official RS Bylaw ↗</a>
            <Link href="/zones/rs" className="text-[10px] text-[#4a5568] hover:text-[#c8a951] transition-colors no-underline">RS Zone Guide ↗</Link>
          </div>
        </footer>

      </main>
    </div>
  )
}
