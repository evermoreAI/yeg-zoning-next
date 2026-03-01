/**
 * app/api/update-amendments/route.ts
 *
 * Called daily by Vercel cron (see vercel.json).
 * Fetches Edmonton council meetings page, parses zone hearing notices,
 * and writes updated amendments.json (via Vercel edge config or logs —
 * filesystem is read-only on Vercel, so we log findings for manual sync).
 *
 * NOTE: On Vercel the filesystem is read-only at runtime. This route:
 * 1. Scrapes the Edmonton page in TypeScript (same logic as crawl_hearings.py)
 * 2. Logs all findings to Vercel Function logs for visibility
 * 3. Can be extended to write to Vercel KV or a DB when auth is added
 *
 * For immediate filesystem writes: run crawl_hearings.py locally and
 * commit the updated amendments.json → triggers a Vercel redeploy.
 */

import { NextRequest, NextResponse } from 'next/server'

const COUNCIL_URLS = [
  'https://www.edmonton.ca/city_government/council-committee-meetings',
  'https://pub-edmonton.escribemeetings.com/',
]

const ZONE_RE    = /\b(RSF|RSM|RSL|RS|RH|RM|MUN|MU|DC)\b/g
const DATE_RE    = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+20\d{2}\b/gi
const HEARING_KW = ['public hearing', 'bylaw amendment', 'rezoning', 'zone amendment', 'height limit']

// Protect with a shared secret so random callers can't trigger it
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const found: Record<string, { zone: string; date: string; desc: string; url: string }> = {}

  for (const url of COUNCIL_URLS) {
    try {
      const res  = await fetch(url, { signal: AbortSignal.timeout(10_000) })
      const html = await res.text()
      // Strip tags for simple text scan
      const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

      const lines = text.split(/[.!?\n]/)
      for (const line of lines) {
        const lower = line.toLowerCase()
        if (!HEARING_KW.some(kw => lower.includes(kw))) continue

        const zones = [...line.matchAll(ZONE_RE)].map(m => m[1])
        const dates = [...line.matchAll(DATE_RE)].map(m => m[0])
        if (!zones.length) continue

        for (const zone of new Set(zones)) {
          found[zone] = {
            zone,
            date: dates[0] ?? 'date TBC',
            desc: line.trim().slice(0, 200),
            url,
          }
        }
      }
    } catch (e) {
      console.error(`[update-amendments] fetch failed ${url}:`, e)
    }
  }

  // Log all findings — visible in Vercel dashboard → Functions → update-amendments
  console.log('[update-amendments] run at', new Date().toISOString())
  console.log('[update-amendments] found:', JSON.stringify(found, null, 2))

  if (Object.keys(found).length === 0) {
    console.log('[update-amendments] No new hearings found.')
  } else {
    console.log('[update-amendments] ACTION REQUIRED: commit updated scraper/amendments.json with findings above.')
  }

  return NextResponse.json({
    ok:         true,
    ran_at:     new Date().toISOString(),
    zones_found: Object.keys(found),
    findings:   found,
  })
}
