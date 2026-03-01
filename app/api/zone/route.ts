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

  // Fetch permits + momentum in parallel — non-blocking (failures return empty)
  const [permits, momentum] = await Promise.allSettled([
    getPermitsNearby(lat, lon),
    getNeighbourhoodMomentum(display.zone_code ?? ''),
  ])

  const permitsData  = permits.status  === 'fulfilled' ? permits.value  : []
  const momentumData = momentum.status === 'fulfilled' ? momentum.value : { recent: 0, prior: 0, trend: 'ACTIVE' as const }

  return NextResponse.json({ ...display, lat, lng: lon, permits: permitsData, momentum: momentumData })
}
