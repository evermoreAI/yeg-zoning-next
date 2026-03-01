/**
 * lib/permitStats.ts
 *
 * Computes neighbourhood permit approval intelligence from Edmonton Open Data.
 * Dataset: q4gd-6q9r (same as developmentPermits.ts — Development Permits)
 *
 * Note: dataset has no application_date — only permit_date (decision date).
 * "Days to approval" cannot be computed; replaced with permits-per-month rate.
 *
 * Architecture rule: all logic here, zero in UI components.
 * Cache: module-level Map keyed by neighbourhood, 24-hour TTL.
 */

const BASE_URL   = 'https://data.edmonton.ca/resource/q4gd-6q9r.json'
const CACHE_TTL  = 24 * 60 * 60 * 1_000
const TIMEOUT_MS = 9_000

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PermitStats {
  neighbourhood:     string
  approval_rate:     number         // 0–100
  approval_label:    'HIGH' | 'MODERATE' | 'LOW'
  approval_color:    string
  total_reviewed:    number
  total_approved:    number
  total_refused:     number
  permits_90d:       number         // count in last 90 days
  permits_prev_90d:  number         // count in prior 90 days
  volume_trend:      'UP' | 'FLAT' | 'DOWN'
  volume_pct:        number         // % change
  most_common_type:  string
  recent_approval:   { address: string; date: string; description: string } | null
  fetched_at:        string
}

// ── Module cache ──────────────────────────────────────────────────────────────

const _cache = new Map<string, { data: PermitStats; ts: number }>()

// ── Main export ───────────────────────────────────────────────────────────────

export async function getPermitStats(neighbourhood: string): Promise<PermitStats | null> {
  if (!neighbourhood) return null

  const key  = neighbourhood.toUpperCase()
  const now  = Date.now()
  const hit  = _cache.get(key)
  if (hit && now - hit.ts < CACHE_TTL) return hit.data

  const data = await fetchStats(key)
  if (data) _cache.set(key, { data, ts: now })
  return data
}

// ── Internal ──────────────────────────────────────────────────────────────────

async function fetchStats(hood: string): Promise<PermitStats | null> {
  const escaped = hood.replace(/'/g, "''")
  const url = `${BASE_URL}?$where=${encodeURIComponent(
    `neighbourhood='${escaped}'`
  )}&$select=permit_type,permit_class,status,permit_date,description_of_development,address&$limit=500&$order=permit_date DESC`

  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`q4gd HTTP ${res.status}`)

  const rows: {
    permit_type?: string
    status?:      string
    permit_date?: string
    description_of_development?: string
    address?:     string
  }[] = await res.json()

  if (!rows.length) return null

  const now     = Date.now()
  const d90     = now - 90 * 86400_000
  const d180    = now - 180 * 86400_000

  let approved  = 0, refused = 0, reviewed = 0
  let permits90 = 0, permitsPrev = 0
  const typeCounts: Record<string, number> = {}
  let recentApproval: PermitStats['recent_approval'] = null

  for (const r of rows) {
    const ts  = r.permit_date ? new Date(r.permit_date).getTime() : 0
    const st  = r.status ?? ''
    const typ = r.permit_type ?? 'Unknown'

    if (st === 'Approved' || st === 'Refused' || st === 'Appealed') reviewed++
    if (st === 'Approved') approved++
    if (st === 'Refused')  refused++

    if (ts >= d90)            permits90++
    if (ts >= d180 && ts < d90) permitsPrev++

    typeCounts[typ] = (typeCounts[typ] ?? 0) + 1

    if (st === 'Approved' && !recentApproval && r.address) {
      recentApproval = {
        address:     r.address,
        date:        r.permit_date?.split('T')[0] ?? '',
        description: (r.description_of_development ?? '').slice(0, 100),
      }
    }
  }

  const approval_rate  = reviewed > 0 ? Math.round((approved / reviewed) * 100) : 0
  const approval_label = approval_rate >= 80 ? 'HIGH' : approval_rate >= 60 ? 'MODERATE' : 'LOW'
  const approval_color = approval_label === 'HIGH' ? '#6ab86a' : approval_label === 'MODERATE' ? '#c8a951' : '#cf6679'

  const volume_pct   = permitsPrev > 0
    ? Math.round(((permits90 - permitsPrev) / permitsPrev) * 100)
    : 0
  const volume_trend: PermitStats['volume_trend'] =
    volume_pct >=  10 ? 'UP'   :
    volume_pct <= -10 ? 'DOWN' : 'FLAT'

  const most_common_type = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  return {
    neighbourhood:    hood,
    approval_rate,
    approval_label,
    approval_color,
    total_reviewed:   reviewed,
    total_approved:   approved,
    total_refused:    refused,
    permits_90d:      permits90,
    permits_prev_90d: permitsPrev,
    volume_trend,
    volume_pct,
    most_common_type,
    recent_approval:  recentApproval,
    fetched_at:       new Date().toISOString(),
  }
}
