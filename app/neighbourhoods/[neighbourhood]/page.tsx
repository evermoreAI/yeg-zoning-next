import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'
import Link              from 'next/link'
import SearchBarRedirect from '@/components/SearchBarRedirect'

// ── Data types ────────────────────────────────────────────────────────────────

interface LandValueTier {
  range:   string
  detail:  string
}

interface NeighbourhoodData {
  slug:          string
  name:          string
  title:         string
  metaDesc:      string
  canonicalUrl:  string
  heroTitle:     string
  heroBody:      string
  // Section 1 stats
  units2025:     string
  avgPrice:      string
  avgDaysOnMarket: string
  dominantZone:  string
  vacancyRate:   string
  vacancyNote:   string
  // Section 2 land values
  landValueIntro: string
  landValueTiers: LandValueTier[]
  landValueFooter: string
  // Section 3 zone note
  zoneIntro:     string
  // Section 4 feasibility
  feasibility:   { label: string; low: string; high: string; note?: string }[]
  feasibilityNote: string
  // Section 5 key facts
  keyFactsTitle: string
  keyFacts:      string[]
  // FAQ
  faqs:          { q: string; a: string }[]
}

// ── Neighbourhood data ────────────────────────────────────────────────────────

const NEIGHBOURHOODS: Record<string, NeighbourhoodData> = {

  mckernan: {
    slug: 'mckernan', name: 'McKernan',
    title:       'McKernan Infill Intelligence — Zoning, Land Values, and Feasibility 2026',
    metaDesc:    'McKernan leads Edmonton infill with 376 new units in 2025. RS zone permits up to 8 units on qualifying lots. Land values $415K–$700K+. Live zoning data for any McKernan address.',
    canonicalUrl:'https://infilliq.ca/neighbourhoods/mckernan',
    heroTitle:   'Own property in McKernan? Your lot may qualify for up to 8 units under current Edmonton zoning.',
    heroBody:    'McKernan added more new infill units than any other Edmonton neighbourhood in 2025 — and the market is still accelerating.',
    units2025:   '376',
    avgPrice:    '$691,000',
    avgDaysOnMarket: '18–20 days',
    dominantZone:'RS — Small Scale Residential',
    vacancyRate: '4–4.5%',
    vacancyNote: 'Driven by University of Alberta and Mazankowski Heart Institute',
    landValueIntro: 'McKernan lots are priced on development potential, not condition. Most sales are teardowns or as-is rentals — buyers are paying for the land.',
    landValueTiers: [
      { range: '$415,000 – $475,000', detail: 'Standard mid-block lots, typically 42–44 feet wide. Entry point for RS zone infill. A 42.5 × 130 ft lot on 72nd Ave recently listed at $415,000 as a build-ready opportunity.' },
      { range: '$500,000 – $650,000', detail: 'Larger lots or premium locations close to LRT or University Avenue. Strong rental premium in this range.' },
      { range: '$700,000+',           detail: 'Corner lots or larger parcels 50+ feet wide. These qualify for higher density projects including 8-plex under current RS zoning.' },
      { range: '$1.5M – $5M+',        detail: 'Multi-lot assemblies for commercial scale development. Rare but active.' },
    ],
    landValueFooter: 'Land values sourced from market data as of early 2026. Always verify current values with a licensed Edmonton real estate professional.',
    zoneIntro: 'Most of McKernan is zoned RS — Small Scale Residential under Bylaw 20001. On a qualifying lot of 600 m² or larger:',
    feasibility: [
      { label: 'Construction cost estimate (8 units)', low: '$1.44M',   high: '$2.00M'   },
      { label: 'Monthly gross revenue',                low: '$13,600',  high: '$16,200',  note: 'McKernan commands 6–8% rental premium over city average' },
      { label: 'Annual gross revenue',                 low: '$163,200', high: '$194,400' },
      { label: 'Gross yield',                          low: '8.2%',     high: '13.5%'   },
    ],
    feasibilityNote: 'Wood frame multi-family estimate. Before land, financing, and operating costs. McKernan rental premium based on University of Alberta and Mazankowski proximity. Always obtain professional quotes before making investment decisions.',
    keyFactsTitle: 'Four Things Every McKernan Investor Needs to Know',
    keyFacts: [
      'University Anchor Vacancy — McKernan vacancy hovers at 4–4.5% in 2026. The rental pool — students, medical professionals, University staff — is virtually recession-proof. Investors pay a premium here because demand is structural, not cyclical.',
      'Transit Premium — Properties within a 2-minute walk of McKernan/Belgravia LRT station or major bus routes on 114th Street command 10–15% higher values than identical lots further east toward 109th Street. Transit proximity is the single biggest value driver after lot size.',
      "Tree Canopy Conflict — A University of Alberta study found infilled lots in McKernan often lose 50% of their mature trees. This has created neighbourhood friction and a push for tighter landscaping requirements in 2026 planning reviews. Factor landscaping costs and community relations into your project planning.",
      'Fast Market — 18–20 days average on market. McKernan lots move fast. Investors who have done their zone analysis in advance move faster than those who have not. Check your address before you make an offer.',
    ],
    faqs: [
      { q: 'How many units can I build on a McKernan lot?', a: 'Up to 8 units on a lot of 600 m² or larger zoned RS. Check your specific address — lot size and configuration affect maximum units.' },
      { q: 'What is the minimum lot size for 8 units in McKernan?', a: '600 square metres for a mid-block lot under Bylaw 20001. Corner lots may qualify for additional density.' },
      { q: 'Is McKernan a good investment in 2026?', a: 'McKernan has the highest infill activity in Edmonton, 4–4.5% vacancy, and University of Alberta anchor demand. Land values are rising. Whether it is right for your specific project depends on lot size, purchase price, and financing — check the feasibility numbers for your specific address.' },
      { q: 'What is the April 7 2026 RS zone hearing about?', a: 'The City of Edmonton has scheduled a public hearing that may affect RS zone height limits and building length restrictions. If you are planning a McKernan project, verify current rules with the City before finalizing designs.' },
      { q: 'What is the transit premium in McKernan?', a: 'Lots within a 2-minute walk of McKernan/Belgravia LRT typically command 10–15% higher values than comparable lots further from transit.' },
      { q: 'How fast do McKernan lots sell?', a: 'Average 18–20 days on market as of early 2026. The market moves fast — preparation is key.' },
    ],
  },

  glenora: {
    slug: 'glenora', name: 'Glenora',
    title:       'Glenora Infill Intelligence — Zoning, Land Values, and Feasibility 2026',
    metaDesc:    "Glenora Edmonton's premium infill market. RS zone, large historic lots, land values $600K–$1.2M+. Live zoning data for any Glenora address.",
    canonicalUrl:'https://infilliq.ca/neighbourhoods/glenora',
    heroTitle:   "Own property in Glenora? You may be sitting on Edmonton's most valuable RS zone land.",
    heroBody:    "Glenora is Edmonton's premier luxury infill neighbourhood. Large historic lots, mature elm canopy, and direct river valley access command the highest land values in the mature residential market.",
    units2025:   'Premium market',
    avgPrice:    '$900,000+',
    avgDaysOnMarket: '20–30 days',
    dominantZone:'RS — Small Scale Residential',
    vacancyRate: '3–4%',
    vacancyNote: 'Driven by river valley access and prestige address — professional tenant base',
    landValueIntro: "Glenora lots are priced for luxury. Buyers are acquiring large historic parcels to build premium rowhouses and semi-detached homes targeting Edmonton's high-income renter and buyer market.",
    landValueTiers: [
      { range: '$600,000 – $800,000', detail: 'Standard RS lots on interior blocks. Still well above Edmonton average — reflects neighbourhood prestige and consistent buyer demand.' },
      { range: '$800,000 – $1,000,000', detail: 'Premium mid-block lots with size, condition, or location advantages. Close to river valley access points.' },
      { range: '$1,000,000 – $1,200,000', detail: 'Large lots 55+ feet wide, corner positions, or lots with river valley views. Full 8-unit RS development capacity.' },
      { range: '$1,200,000+', detail: 'Exceptional parcels — oversized lots, multi-lot assemblies, or rare river valley adjacency. Luxury townhome and boutique condo development territory.' },
    ],
    landValueFooter: 'Land values sourced from market data as of early 2026. Always verify current values with a licensed Edmonton real estate professional.',
    zoneIntro: "Most of Glenora's residential lots are zoned RS — Small Scale Residential under Bylaw 20001. On a qualifying lot of 600 m² or larger:",
    feasibility: [
      { label: 'Estimated land value (600 m² lot)',    low: '$600,000', high: '$1,200,000+' },
      { label: 'Construction cost estimate (8 units)', low: '$1.60M',   high: '$2.40M'     },
      { label: 'Monthly gross revenue',                low: '$15,200',  high: '$20,000',    note: 'Glenora commands 15–25% rental premium over Edmonton inner-city average' },
      { label: 'Annual gross revenue',                 low: '$182,400', high: '$240,000'   },
      { label: 'Gross yield on construction cost',     low: '7.6%',     high: '15.0%'     },
    ],
    feasibilityNote: "Wood frame multi-family estimate. Before land, financing, and operating costs. Glenora rental premium reflects prestige address, river valley proximity, and professional tenant base. Always obtain professional quotes before making investment decisions.",
    keyFactsTitle: "Four Things Every Glenora Investor Needs to Know",
    keyFacts: [
      "Edmonton's most prestigious inner-city RS zone neighbourhood — Glenora land commands premium pricing in every market cycle.",
      'Large historic lots, many well above 600 m², enable full 8-unit RS development with room for premium finishes and larger unit configurations.',
      "River valley proximity and mature elm canopy are irreplaceable location advantages — rents and sale prices at the top of Edmonton's infill spectrum.",
      'Tenant profile is executive, medical, and professional — premium finishes and quality construction are required and rewarded with low vacancy and high rents.',
    ],
    faqs: [
      { q: 'How many units can I build on a Glenora lot?', a: 'Up to 8 units on a lot of 600 m² or larger zoned RS. Many Glenora lots exceed this threshold — check your specific address for exact development potential.' },
      { q: 'What is the minimum lot size for 8 units in Glenora?', a: '600 square metres for a mid-block lot under Bylaw 20001. Corner lots may qualify for additional density.' },
      { q: 'Is Glenora a good investment in 2026?', a: 'Glenora offers the highest land values in the Edmonton mature RS market, driven by river valley access, large historic lots, and prestige location. It suits developers targeting the luxury segment — returns depend on purchase price, construction quality, and target tenant profile.' },
      { q: 'What is the April 7 2026 RS zone hearing about?', a: 'The City of Edmonton has scheduled a public hearing that may affect RS zone height limits and building length restrictions. If you are planning a Glenora project, verify current rules with the City before finalizing designs.' },
      { q: 'What drives land value premiums in Glenora?', a: 'River valley proximity, mature elm canopy, large lot sizes, and prestige address are the primary drivers. Lots close to the river valley or with oversized frontage trade significantly above average.' },
      { q: 'How fast do Glenora lots sell?', a: 'Glenora averages 20–30 days on market — slightly slower than McKernan given higher price points, but quality lots at the right price move quickly.' },
    ],
  },

  strathcona: {
    slug: 'strathcona', name: 'Strathcona',
    title:       'Strathcona Infill Intelligence — Zoning, Land Values, and Feasibility 2026',
    metaDesc:    'Strathcona Edmonton infill guide 2026. RS zone, ~194 new units in 2025, land values $450K–$750K. Live zoning data for any Strathcona address.',
    canonicalUrl:'https://infilliq.ca/neighbourhoods/strathcona',
    heroTitle:   'Own property in Strathcona? Your RS zone lot may qualify for up to 8 units.',
    heroBody:    "Strathcona is Edmonton's most walkable neighbourhood. ~194 new infill units added in 2025, Whyte Ave at your doorstep, and one of the city's tightest vacancy rates. The numbers work here.",
    units2025:   '~194',
    avgPrice:    '$575,000',
    avgDaysOnMarket: '15–22 days',
    dominantZone:'RS — Small Scale Residential',
    vacancyRate: '3.5–4%',
    vacancyNote: 'Driven by Whyte Ave walkability and proximity to UofA — strong young professional demand',
    landValueIntro: 'Strathcona RS lots are priced for walkability. Proximity to Whyte Ave and transit drives a consistent premium over comparable lots elsewhere in Edmonton.',
    landValueTiers: [
      { range: '$450,000 – $525,000', detail: 'Standard mid-block lots on interior residential streets. Solid RS infill entry point with strong fundamentals.' },
      { range: '$525,000 – $650,000', detail: 'Larger lots or blocks closer to Whyte Ave. Premium rents achievable, lower vacancy.' },
      { range: '$650,000 – $750,000', detail: 'Best-in-class lots — size, lane access, and proximity to Whyte Ave or LRT. High competition from experienced developers.' },
      { range: '$750,000+', detail: 'Corner lots, double-wide parcels, or Whyte Ave-adjacent commercial potential. Mixed-use development may be viable.' },
    ],
    landValueFooter: 'Land values sourced from market data as of early 2026. Always verify current values with a licensed Edmonton real estate professional.',
    zoneIntro: 'Strathcona residential lots are predominantly RS — Small Scale Residential under Bylaw 20001. Some lots fronting Whyte Ave or major streets may carry commercial or MU zoning. On a qualifying RS lot of 600 m² or larger:',
    feasibility: [
      { label: 'Estimated land value (600 m² lot)',    low: '$450,000', high: '$750,000'  },
      { label: 'Construction cost estimate (8 units)', low: '$1.44M',   high: '$2.00M'   },
      { label: 'Monthly gross revenue',                low: '$14,000',  high: '$17,200',  note: 'Strathcona commands 8–12% rental premium over Edmonton inner-city average' },
      { label: 'Annual gross revenue',                 low: '$168,000', high: '$206,400' },
      { label: 'Gross yield on construction cost',     low: '8.4%',     high: '14.3%'   },
    ],
    feasibilityNote: 'Wood frame multi-family estimate. Before land, financing, and operating costs. Strathcona rental premium driven by walkability, Whyte Ave strip, and strong young professional demand. Always obtain professional quotes.',
    keyFactsTitle: 'Four Things Every Strathcona Investor Needs to Know',
    keyFacts: [
      '~194 new infill units added in 2025 — consistent activity showing developer confidence in the neighbourhood fundamentals.',
      "Whyte Ave is one of Edmonton's premier walkable commercial corridors — tenants pay a premium to be within walking distance, and vacancy stays persistently low.",
      'Strong rental demand from UofA students, young professionals, and creatives creates two rental seasons: September academic surge and spring professional turnover.',
      'Some Strathcona lots front commercial strips or arterials with MU or DC zoning — check your specific address before assuming RS rules apply.',
    ],
    faqs: [
      { q: 'How many units can I build on a Strathcona lot?', a: 'Up to 8 units on a lot of 600 m² or larger zoned RS. Some Strathcona lots fronting Whyte Ave carry MU or commercial zoning — check your specific address.' },
      { q: 'What is the minimum lot size for 8 units in Strathcona?', a: '600 square metres for a mid-block lot under Bylaw 20001. Corner lots may qualify for additional density.' },
      { q: 'Is Strathcona a good investment in 2026?', a: 'Strathcona has strong walkability, consistent rental demand from young professionals and UofA students, and ~194 new infill units added in 2025. Land values are solid. The right project depends on lot size, purchase price, and target market — check the feasibility numbers for your specific address.' },
      { q: 'What is the April 7 2026 RS zone hearing about?', a: 'The City of Edmonton has scheduled a public hearing that may affect RS zone height limits and building length restrictions. If you are planning a Strathcona project, verify current rules with the City before finalizing designs.' },
      { q: 'What drives the Strathcona rental premium?', a: 'Whyte Ave walkability, proximity to the University of Alberta, and a dense concentration of amenities drive 8–12% rental premiums over the Edmonton inner-city average. Vacancy is consistently low.' },
      { q: 'How fast do Strathcona lots sell?', a: 'Strathcona averages 15–22 days on market. Quality RS lots close to Whyte Ave or with lane access move the fastest — preparation and pre-arranged financing are key.' },
    ],
  },

  'windsor-park': {
    slug: 'windsor-park', name: 'Windsor Park',
    title:       'Windsor Park Infill Intelligence — Zoning, Land Values, and Feasibility 2026',
    metaDesc:    'Windsor Park Edmonton infill guide 2026. RS zone, ~242 new units in 2025, land values $450K–$700K. Live zoning data for any Windsor Park address.',
    canonicalUrl:'https://infilliq.ca/neighbourhoods/windsor-park',
    heroTitle:   'Windsor Park lots are moving in 18–20 days. Is yours next?',
    heroBody:    "~242 new infill units added in 2025. Direct University of Alberta adjacency. One of Edmonton's fastest-moving RS zone markets. Check your Windsor Park address instantly.",
    units2025:   '~242',
    avgPrice:    '$540,000',
    avgDaysOnMarket: '18–20 days',
    dominantZone:'RS — Small Scale Residential',
    vacancyRate: '3.5–4.5%',
    vacancyNote: 'University of Alberta adjacency — consistent student and graduate professional demand',
    landValueIntro: "Windsor Park lots are in high demand. University of Alberta adjacency creates consistent absorption and one of Edmonton's fastest lot-to-contract timelines in the RS zone market.",
    landValueTiers: [
      { range: '$450,000 – $510,000', detail: 'Standard mid-block RS lots. Typical entry point for Windsor Park infill. 42–44 ft frontage on interior residential streets.' },
      { range: '$510,000 – $600,000', detail: 'Premium mid-block lots — larger size, rear lane access, or proximity to University Avenue. Strong rental premium.' },
      { range: '$600,000 – $700,000', detail: 'Corner lots and large parcels 50+ ft wide. Full 8-unit RS development capacity. Highest competition from experienced developers.' },
      { range: '$700,000+', detail: 'Exceptional lots or multi-lot assemblies. Rare availability in Windsor Park given the sustained demand from institutional and private buyers.' },
    ],
    landValueFooter: 'Land values sourced from market data as of early 2026. Always verify current values with a licensed Edmonton real estate professional.',
    zoneIntro: 'Windsor Park residential lots are predominantly RS — Small Scale Residential under Bylaw 20001. On a qualifying lot of 600 m² or larger:',
    feasibility: [
      { label: 'Estimated land value (600 m² lot)',    low: '$450,000', high: '$700,000'  },
      { label: 'Construction cost estimate (8 units)', low: '$1.44M',   high: '$2.00M'   },
      { label: 'Monthly gross revenue',                low: '$13,800',  high: '$16,800',  note: 'Windsor Park commands 6–10% premium driven by UofA adjacency' },
      { label: 'Annual gross revenue',                 low: '$165,600', high: '$201,600' },
      { label: 'Gross yield on construction cost',     low: '8.3%',     high: '14.0%'   },
    ],
    feasibilityNote: 'Wood frame multi-family estimate. Before land, financing, and operating costs. Windsor Park rental premium driven by University of Alberta adjacency and graduate/professional demand. Always obtain professional quotes.',
    keyFactsTitle: 'Four Things Every Windsor Park Investor Needs to Know',
    keyFacts: [
      '~242 new infill units added in Windsor Park in 2025 — one of the highest volumes in Edmonton. Developer confidence here is strong and well-established.',
      'University of Alberta adjacency creates two distinct demand pools: undergraduate students (September surge) and graduate students and university professionals (year-round).',
      'Average 18–20 days to sale — Windsor Park is one of the fastest-moving infill lot markets in Edmonton. Quality sites receive multiple offers.',
      'Most Windsor Park lots are standard 42–44 ft frontage. Rear lane access significantly improves development flexibility and commands a price premium.',
    ],
    faqs: [
      { q: 'How many units can I build on a Windsor Park lot?', a: 'Up to 8 units on a lot of 600 m² or larger zoned RS. Check your specific address — lot size and configuration affect maximum units.' },
      { q: 'What is the minimum lot size for 8 units in Windsor Park?', a: '600 square metres for a mid-block lot under Bylaw 20001. Corner lots may qualify for additional density.' },
      { q: 'Is Windsor Park a good investment in 2026?', a: 'Windsor Park is one of Edmonton\'s fastest-moving infill markets with ~242 new units added in 2025 and direct University of Alberta adjacency. Whether it is right for your project depends on lot size, purchase price, and financing — check the feasibility numbers for your specific address.' },
      { q: 'What is the April 7 2026 RS zone hearing about?', a: 'The City of Edmonton has scheduled a public hearing that may affect RS zone height limits and building length restrictions. If you are planning a Windsor Park project, verify current rules with the City before finalizing designs.' },
      { q: 'What drives Windsor Park rental demand?', a: 'Direct University of Alberta adjacency creates two demand pools: undergraduate students and graduate students plus university professionals. This drives vacancy below 4.5% consistently and supports a 6–10% rental premium over the Edmonton inner-city average.' },
      { q: 'How fast do Windsor Park lots sell?', a: 'Average 18–20 days on market as of early 2026. One of Edmonton\'s fastest RS zone markets — have financing in place before approaching sellers.' },
    ],
  },

  'jasper-park': {
    slug: 'jasper-park', name: 'Jasper Park',
    title:       'Jasper Park Infill Intelligence — Zoning, Land Values, and Feasibility 2026',
    metaDesc:    'Jasper Park Edmonton infill guide 2026. RS zone, ~197 new units in 2025, land values $400K–$650K. Live zoning data for any Jasper Park address.',
    canonicalUrl:'https://infilliq.ca/neighbourhoods/jasper-park',
    heroTitle:   'Jasper Park is quietly becoming one of Edmonton\'s most active infill corridors.',
    heroBody:    '~197 new units added in 2025. Accessible land values, solid inner-city fundamentals, and consistent permit activity replacing older housing stock with modern infill product.',
    units2025:   '~197',
    avgPrice:    '$490,000',
    avgDaysOnMarket: '20–28 days',
    dominantZone:'RS — Small Scale Residential',
    vacancyRate: '4–5%',
    vacancyNote: 'Inner-city location with solid professional and family rental demand',
    landValueIntro: 'Jasper Park offers accessible inner-city land values relative to McKernan, Strathcona, and Windsor Park — making it a strong option for investors seeking RS zone exposure at a lower entry point.',
    landValueTiers: [
      { range: '$400,000 – $460,000', detail: 'Standard mid-block RS lots. Most accessible entry point in the Edmonton inner-city RS market. Good fundamentals for 8-unit development.' },
      { range: '$460,000 – $540,000', detail: 'Larger or better-located lots with rear lane access or proximity to transit. Solid rental premium potential.' },
      { range: '$540,000 – $650,000', detail: 'Premium lots — corner positions, 50+ ft frontage, or strong transit access. Best-in-class for Jasper Park infill.' },
      { range: '$650,000+', detail: 'Rare corner or large assembled parcels. Limited supply at this range but active when available.' },
    ],
    landValueFooter: 'Land values sourced from market data as of early 2026. Always verify current values with a licensed Edmonton real estate professional.',
    zoneIntro: 'Jasper Park residential lots are predominantly RS — Small Scale Residential under Bylaw 20001. On a qualifying lot of 600 m² or larger:',
    feasibility: [
      { label: 'Estimated land value (600 m² lot)',    low: '$400,000', high: '$650,000'  },
      { label: 'Construction cost estimate (8 units)', low: '$1.44M',   high: '$2.00M'   },
      { label: 'Monthly gross revenue',                low: '$12,800',  high: '$15,600',  note: 'Jasper Park inner-city location commands 4–7% premium over Edmonton suburban average' },
      { label: 'Annual gross revenue',                 low: '$153,600', high: '$187,200' },
      { label: 'Gross yield on construction cost',     low: '7.7%',     high: '13.0%'   },
    ],
    feasibilityNote: 'Wood frame multi-family estimate. Before land, financing, and operating costs. Lower land cost entry point can support stronger yield ratios for cost-conscious developers. Always obtain professional quotes.',
    keyFactsTitle: 'Four Things Every Jasper Park Investor Needs to Know',
    keyFacts: [
      '~197 new infill units added in 2025 — consistent activity reflecting steady developer demand and reliable approval patterns at the City.',
      'Accessible land values ($400K–$650K) make Jasper Park one of the better yield plays in the Edmonton inner-city RS market — lower entry cost, solid rent fundamentals.',
      'Older housing stock is still being steadily replaced — early-mover advantage remains for investors who can identify undervalued lots before the next wave of redevelopment.',
      'Inner-city location supports solid rental demand from professionals and families — less acute than UofA-adjacent neighbourhoods but more stable and less seasonal.',
    ],
    faqs: [
      { q: 'How many units can I build on a Jasper Park lot?', a: 'Up to 8 units on a lot of 600 m² or larger zoned RS. Check your specific address — lot size and configuration affect maximum units.' },
      { q: 'What is the minimum lot size for 8 units in Jasper Park?', a: '600 square metres for a mid-block lot under Bylaw 20001. Corner lots may qualify for additional density.' },
      { q: 'Is Jasper Park a good investment in 2026?', a: 'Jasper Park offers inner-city RS exposure at more accessible land values than McKernan, Strathcona, or Windsor Park. With ~197 new units added in 2025 and consistent permit activity, it is a solid value play for cost-conscious developers. Returns depend on purchase price, construction cost, and target market.' },
      { q: 'What is the April 7 2026 RS zone hearing about?', a: 'The City of Edmonton has scheduled a public hearing that may affect RS zone height limits and building length restrictions. If you are planning a Jasper Park project, verify current rules with the City before finalizing designs.' },
      { q: 'Why are Jasper Park land values lower than McKernan?', a: 'Jasper Park has comparable inner-city fundamentals but lacks the University of Alberta adjacency and Whyte Ave walkability of its neighbours. This creates an accessible entry point for RS zone investors seeking inner-city exposure without premium land costs.' },
      { q: 'How fast do Jasper Park lots sell?', a: 'Jasper Park averages 20–28 days on market — slightly slower than McKernan or Windsor Park, giving buyers a small window for due diligence without the extreme time pressure of the most competitive markets.' },
    ],
  },
}

const PERMITTED = [
  'Single detached house', 'Secondary suite', 'Garden suite', 'Semi-detached house',
  'Row housing', 'Home-based business', 'Child care facility (small)', 'Urban agriculture',
]
const DISCRETIONARY = [
  'Neighbourhood café or bistro', 'Neighbourhood retail', 'Medical or dental office',
  'Personal service shop', 'Bed and breakfast',
]

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(NEIGHBOURHOODS).map(slug => ({ neighbourhood: slug }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ neighbourhood: string }> }
): Promise<Metadata> {
  const { neighbourhood } = await params
  const data = NEIGHBOURHOODS[neighbourhood]
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

function StatCard({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
      <div className="text-[9px] text-[#8a8070] tracking-[2px] uppercase mb-1"
           style={{ fontFamily: 'var(--font-rajdhani)' }}>{label}</div>
      <div className={`font-semibold text-[#c8a951] leading-tight ${mono ? 'text-lg' : 'text-sm'}`}
           style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-rajdhani)' }}>{value}</div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function NeighbourhoodPage(
  { params }: { params: Promise<{ neighbourhood: string }> }
) {
  const { neighbourhood } = await params
  const data = NEIGHBOURHOODS[neighbourhood]
  if (!data) notFound()

  const { name, heroTitle, heroBody, units2025, avgPrice, avgDaysOnMarket, dominantZone,
          vacancyRate, vacancyNote, landValueIntro, landValueTiers, landValueFooter,
          zoneIntro, feasibility, feasibilityNote, keyFactsTitle, keyFacts, faqs } = data

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
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3 text-[#e8e0d0]"
              style={{ fontFamily: 'var(--font-rajdhani)' }}>
            {name} Infill Intelligence —{' '}
            <span className="text-[#c8a951]">Zoning, Land Values, and Feasibility 2026</span>
          </h1>
          <p className="text-[#c8a951] text-sm font-semibold mb-2 tracking-wide"
             style={{ fontFamily: 'var(--font-rajdhani)' }}>{heroTitle}</p>
          <p className="text-[#a09080] text-base leading-relaxed mb-8 max-w-2xl">{heroBody}</p>
          <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
            <p className="text-[11px] text-[#8a8070] mb-2 uppercase tracking-wider"
               style={{ fontFamily: 'var(--font-rajdhani)' }}>Check any {name} address instantly</p>
            <SearchBarRedirect />
          </div>
        </header>

        {/* Section 1 — Stats */}
        <section className="mb-12">
          <SectionLabel n="1">{name} at a Glance — 2026</SectionLabel>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <StatCard label="New Infill Units (2025)" value={units2025} />
            <StatCard label="Average Listing Price"   value={avgPrice} />
            <StatCard label="Avg Days on Market"      value={avgDaysOnMarket} />
            <StatCard label="Dominant Zone"           value={dominantZone} mono={false} />
          </div>
          <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
            <div className="flex items-baseline gap-3 mb-1">
              <div>
                <div className="text-[9px] text-[#8a8070] tracking-[2px] uppercase"
                     style={{ fontFamily: 'var(--font-rajdhani)' }}>Vacancy Rate</div>
                <div className="text-lg font-semibold text-[#c8a951]"
                     style={{ fontFamily: 'var(--font-mono)' }}>{vacancyRate}</div>
              </div>
            </div>
            <p className="text-[#8a8070] text-[11px]">{vacancyNote}</p>
          </div>
        </section>

        {/* Section 2 — Land Values */}
        <section className="mb-12">
          <SectionLabel n="2">What Does a {name} Lot Cost in 2026?</SectionLabel>
          <p className="text-[#a09080] leading-relaxed mb-5">{landValueIntro}</p>
          <div className="space-y-3 mb-4">
            {landValueTiers.map((tier, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg"
                   style={{ background: i === 0 ? '#141820' : i === 1 ? '#0f1318' : i === 2 ? '#141820' : '#0f1318', border: '1px solid #2a2e38' }}>
                <div className="flex-shrink-0 pt-0.5">
                  <div className="w-2 h-2 rounded-full mt-1.5"
                       style={{ background: i === 3 ? '#c8a951' : i === 2 ? '#6ab86a' : i === 1 ? '#b8860b' : '#4a7c59' }} />
                </div>
                <div>
                  <div className="text-[#c8a951] font-semibold text-sm mb-1"
                       style={{ fontFamily: 'var(--font-mono)' }}>{tier.range}</div>
                  <p className="text-[#8a8070] text-[12px] leading-relaxed">{tier.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[#4a5568] text-[11px] italic">{landValueFooter}</p>
        </section>

        {/* Section 3 — RS Zone Rules */}
        <section className="mb-12">
          <SectionLabel n="3">What Can You Build on a {name} RS Lot?</SectionLabel>
          <p className="text-[#a09080] text-sm mb-5">{zoneIntro}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
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
          <div className="grid md:grid-cols-2 gap-4 mb-6">
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
          {/* Amendment banner */}
          <div className="p-4 rounded-lg mb-4"
               style={{ background: 'rgba(184,134,11,0.10)', border: '1px solid #b8860b', borderLeft: '4px solid #c8a951' }}>
            <p className="text-[#c8a951] text-sm font-semibold mb-1">⚠️ April 7 2026 Public Hearing — Active Amendment</p>
            <p className="text-[#a09080] text-[12px] leading-relaxed">
              RS zone height limits and building length restrictions are under review. Verify current rules
              with the City of Edmonton before finalizing any project designs.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: '#141820', border: '1px solid #2a2e38' }}>
            <p className="text-[11px] text-[#8a8070] mb-2 uppercase tracking-wider"
               style={{ fontFamily: 'var(--font-rajdhani)' }}>Check your specific {name} address</p>
            <SearchBarRedirect />
          </div>
        </section>

        {/* Section 4 — Feasibility */}
        <section className="mb-12">
          <SectionLabel n="4">{name} Development Feasibility — 8 Unit RS Project</SectionLabel>
          <p className="text-[#a09080] text-sm mb-4">
            Based on current Edmonton market data as of February 2026 with {name} rental premium applied.
          </p>
          <div className="rounded-lg overflow-hidden mb-3" style={{ border: '1px solid #2a2e38' }}>
            {feasibility.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2530]"
                     style={{ background: i % 2 === 0 ? '#141820' : '#0f1318' }}>
                  <span className="text-[#8a8070] text-[12px]">{row.label}</span>
                  <span className="text-[#c8a951] font-semibold text-sm"
                        style={{ fontFamily: 'var(--font-mono)' }}>{row.low} – {row.high}</span>
                </div>
                {row.note && (
                  <div className="px-4 py-1.5 border-b border-[#1e2530]"
                       style={{ background: i % 2 === 0 ? '#141820' : '#0f1318' }}>
                    <p className="text-[#4a7c59] text-[10px]">↑ {row.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-[#4a5568] text-[10px] italic">{feasibilityNote}</p>
        </section>

        {/* Section 5 — Key Facts */}
        <section className="mb-12">
          <SectionLabel n="5">{keyFactsTitle}</SectionLabel>
          <div className="space-y-3">
            {keyFacts.map((fact, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg"
                   style={{ background: '#141820', border: '1px solid #2a2e38' }}>
                <span className="text-[#c8a951] font-bold text-sm flex-shrink-0 mt-0.5 w-5 text-right"
                      style={{ fontFamily: 'var(--font-mono)' }}>0{i + 1}</span>
                <p className="text-[#a09080] text-[12px] leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
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
            See the zone, development rules, feasibility numbers, and amendment warnings for any {name}
            address — live from City of Edmonton GIS data. Free, no account required.
          </p>
          <SearchBarRedirect />
        </section>

        {/* Footer */}
        <footer className="border-t border-[#1e2530] pt-6">
          <p className="text-[10px] text-[#2a3040] leading-relaxed mb-4">
            Zoning data is for reference only. The City of Edmonton does not assume responsibility for
            accuracy of online reproductions. Always verify with the City of Edmonton before making
            development decisions. Land values and market data are estimates only — always consult a
            licensed real estate professional. Not legally binding. Last verified February 2026.
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
