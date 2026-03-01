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

  // Fetch permits + momentum in parallel with a hard 6s ceiling.
  // These are optional enrichments — if they fail or timeout, zone data still returns.
  const ENRICHMENT_TIMEOUT = 6_000
  let permitsData: Awaited<ReturnType<typeof getPermitsNearby>> = []
  let momentumData = { recent: 0, prior: 0, trend: 'ACTIVE' as const }
  let assessmentData: Awaited<ReturnType<typeof getNearestAssessment>> = null

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

    // Assessment: use neighbourhood from nearest permit (already fetched above)
    const neighbourhood = permitsData[0]?.neighbourhood ?? ''
    if (neighbourhood) {
      try {
        assessmentData = await getNearestAssessment(lat, lon, neighbourhood)
      } catch (e) {
        console.warn('[zone] assessment lookup failed:', e)
      }
    }
  } catch (e) {
    console.warn('[zone] enrichment skipped:', (e as Error).message)
  }

  return NextResponse.json({ ...display, lat, lng: lon, permits: permitsData, momentum: momentumData, assessment: assessmentData })
}
