/**
 * lib/amendments.ts
 *
 * Reads scraper/amendments.json and returns live amendment warnings.
 * This is the single source of truth for amendment data — config/zones.ts
 * no longer contains hardcoded pending_amendment strings.
 *
 * On Vercel: amendments.json is bundled at build time (static read).
 * The /api/update-amendments cron keeps it fresh and triggers a redeploy.
 */

import path from 'path'
import fs   from 'fs'

export interface AmendmentEntry {
  warning:      boolean
  hearing_date: string
  description:  string
  source_url:   string
  scraped_at:   string
}

type AmendmentsFile = Record<string, AmendmentEntry | { last_run: string; zones_found: string[] }>

let _cache: AmendmentsFile | null = null

function loadAmendments(): AmendmentsFile {
  if (_cache) return _cache
  try {
    const filePath = path.join(process.cwd(), 'scraper', 'amendments.json')
    const raw      = fs.readFileSync(filePath, 'utf-8')
    _cache = JSON.parse(raw)
    return _cache!
  } catch (e) {
    console.warn('[amendments] Could not read amendments.json:', e)
    return {}
  }
}

/**
 * Returns the amendment entry for a zone code, or null if none.
 *
 * @param zoneCode  e.g. "RS", "RSF"
 * @returns AmendmentEntry or null
 *
 * Example: getAmendment('RS') → { warning: true, hearing_date: 'April 7 2026', ... }
 */
export function getAmendment(zoneCode: string): AmendmentEntry | null {
  const data  = loadAmendments()
  const entry = data[zoneCode.toUpperCase()]
  if (!entry || '_meta' in entry || !('warning' in entry)) return null
  return entry as AmendmentEntry
}

/** Returns the timestamp of the last scraper run */
export function getAmendmentsLastRun(): string {
  const data = loadAmendments()
  const meta = data['_meta'] as { last_run: string } | undefined
  return meta?.last_run ?? 'unknown'
}
