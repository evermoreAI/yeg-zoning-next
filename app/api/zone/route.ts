/**
 * app/api/zone/route.ts
 *
 * GET /api/zone?lat=X&lon=Y
 *
 * Server-side zone lookup. Calls Edmonton GIS (CORS-blocked for browsers),
 * interprets the raw zone code, returns shaped ZoneDisplay JSON.
 *
 * Never called from the browser directly — always via MapTerminal fetch().
 */

import { NextRequest, NextResponse } from 'next/server'
import { getZoneForLocation }        from '@/lib/edmontonGis'
import { interpretZone }             from '@/lib/zoneInterpreter'
import { getAmendment }               from '@/lib/amendments'
import { getPermitsNearby, getNeighbourhoodMomentum } from '@/lib/developmentPermits'
import { getNearestAssessment }                           from '@/lib/propertyAssessment'
import { getNeighbourhoodScore }                           from '@/lib/neighbourhoodScore'
import { checkRezoningNearby }                             from '@/lib/rezonings'
import { getPermitStats }                                  from '@/lib/permitStats'
import { getNeighbourhoodRents }                           from '@/lib/rentalData'
import { getDCZoneRules }                                  from '@/lib/dcZoneExtractor'
import { getNeighbourhoodProfile }                        from '@/lib/neighbourhoodProfiles'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const latStr = searchParams.get('lat')
  const lonStr = searchParams.get('lon')

  // ── Validate params ────────────────────────────────────────────────────
  if (!latStr || !lonStr) {
    return NextResponse.json(
      { found: false, error: 'Missing lat or lon parameter' },
      { status: 400 }
    )
  }

  const lat = parseFloat(latStr)
  const lon = parseFloat(lonStr)

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { found: false, error: 'Invalid lat or lon — must be numbers' },
      { status: 400 }
    )
  }

  // Edmonton bounding box — reject out-of-range coordinates
  if (lat < 53.3963 || lat > 53.7163 || lon < -113.7142 || lon > -113.2695) {
    return NextResponse.json(
      { found: false, error: 'Location is outside Edmonton. This tool covers Edmonton only.' },
      { status: 422 }
    )
  }

  // ── Fetch + interpret ──────────────────────────────────────────────────
  const raw       = await getZoneForLocation(lat, lon)
  const display   = interpretZone(raw)

  // Merge live amendment from amendments.json (overrides config hardcoded values)
  const amendment = getAmendment(display.zone_code)
  if (amendment?.warning) {
    display.amendment_warning = true
    display.amendment_text    = amendment.description
  }

  let dcRules: Awaited<ReturnType<typeof getDCZoneRules>> = null

  // DC zone rules — fetch from zoningbylaw.edmonton.ca when DC zone detected
  if (display.dc_warning && display.bylaw_url) {
    try {
      dcRules = await getDCZoneRules(display.bylaw_url, display.zone_code)
    } catch (e) {
      console.warn('[zone] DC rules fetch failed:', (e as Error).message)
    }
  }

    // Neighbourhood score: fires in parallel with enrichment, has its own 20s ceiling
  const scorePromise = (async () => {
    try {
      return await Promise.race([
        getNeighbourhoodScore(lat, lon, 0),  // permit count updated after enrichment resolves
        new Promise<null>(r => setTimeout(() => r(null), 20_000)),
      ])
    } catch (e) {
      console.warn('[zone] neighbourhood score failed:', e)
      return null
    }
  })()

  // Fetch permits + momentum in parallel with a hard 6s ceiling.
  // These are optional enrichments — if they fail or timeout, zone data still returns.
  const ENRICHMENT_TIMEOUT = 6_000
  let permitsData: Awaited<ReturnType<typeof getPermitsNearby>> = []
  let momentumData = { recent: 0, prior: 0, trend: 'ACTIVE' as const }
  let assessmentData: Awaited<ReturnType<typeof getNearestAssessment>> = null
  let neighbourhoodScoreData: Awaited<ReturnType<typeof getNeighbourhoodScore>> = null
  let rezoningAlert: Awaited<ReturnType<typeof checkRezoningNearby>> = null
  let permitStatsData: Awaited<ReturnType<typeof getPermitStats>> = null
  let rentalData: Awaited<ReturnType<typeof getNeighbourhoodRents>> | null = null
let neighbourhoodProfile: Awaited<ReturnType<typeof getNeighbourhoodProfile>> = null

  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('enrichment timeout')), ENRICHMENT_TIMEOUT)
    )
    const [permits, momentum] = await Promise.race([
      Promise.allSettled([
        getPermitsNearby(lat, lon),
        getNeighbourhoodMomentum(display.zone_code ?? ''),
      ]),
      timeout,
    ]) as PromiseSettledResult<unknown>[]

    if (permits  && (permits  as PromiseSettledResult<typeof permitsData>).status  === 'fulfilled')
      permitsData  = (permits  as PromiseFulfilledResult<typeof permitsData>).value
    if (momentum && (momentum as PromiseSettledResult<typeof momentumData>).status === 'fulfilled')
      momentumData = (momentum as PromiseFulfilledResult<typeof momentumData>).value

    // Rezoning alert: cached 1h, fast
    try {
      rezoningAlert = await checkRezoningNearby(lat, lon)
      if (rezoningAlert) console.log(`[zone] rezoning alert: ${rezoningAlert.file_number} ${rezoningAlert.distance_m}m`)
    } catch (e) {
      console.warn('[zone] rezoning check failed:', e)
    }

    // Assessment + permit stats — use neighbourhood from first permit
    const enrichHood = permitsData[0]?.neighbourhood ?? ''
    try {
      assessmentData = await getNearestAssessment(lat, lon, enrichHood || undefined)
    } catch (e) {
      console.warn('[zone] assessment lookup failed:', e)
    }
    try {
      if (enrichHood) permitStatsData = await getPermitStats(enrichHood)
    } catch (e) {
      console.warn('[zone] permit stats failed:', e)
    }
    try {
      rentalData = await getNeighbourhoodRents(lat, lon, enrichHood)
    } catch (e) {
      console.warn('[zone] rental data failed:', e)
    }

    try {
      if (enrichHood) neighbourhoodProfile = await getNeighbourhoodProfile(enrichHood)
    } catch (e) {
      console.warn('[zone] neighbourhood profile failed:', e)
    }

  } catch (e) {
    console.warn('[zone] enrichment skipped:', (e as Error).message)
  }

  // Await score (may already be done, or wait up to remaining time)
  try {
    const raw = await scorePromise
    if (raw) {
      // Patch in the actual permit count now that we have it
      neighbourhoodScoreData = {
        ...raw,
        development: {
          ...raw.development,
          count: permitsData.length,
          score: permitsData.length >= 10 ? 100
               : permitsData.length >= 6  ? 75
               : permitsData.length >= 3  ? 55
               : permitsData.length >= 1  ? 35 : 10,
        },
      }
    }
  } catch (e) {
    console.warn('[zone] score await failed:', e)
  }

  return NextResponse.json({ ...display, lat, lng: lon, permits: permitsData, momentum: momentumData, assessment: assessmentData, neighbourhoodScore: neighbourhoodScoreData, rezoning_alert: rezoningAlert, permit_stats: permitStatsData, rental_data: rentalData, neighbourhood_profile: neighbourhoodProfile, dc_rules: dcRules })
}
