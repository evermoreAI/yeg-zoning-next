/**
 * lib/dcZoneExtractor.ts
 *
 * Fetches and parses DC zone rules from zoningbylaw.edmonton.ca.
 * Works for ANY DC zone — uses the DOCUMENT_URL returned by Edmonton GIS per parcel.
 *
 * Architecture:
 * - On first request for a URL, fetches and parses the page server-side
 * - Caches result in-memory (module-level Map) with 7-day TTL
 * - Persists cache to lib/dcZoneCache.json for cold-start survival
 * - Falls back gracefully — never throws; returns null on any failure
 */

import * as fs   from 'fs'
import * as path from 'path'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DCZoneRules {
  url:             string
  zone_code:       string
  purpose:         string
  permitted_uses:  string[]
  discretionary_uses: string[]
  max_height:      string
  setback_front:   string
  setback_rear:    string
  setback_side:    string
  special_conditions: string[]
  bylaw_ref:       string
  fetched_at:      string
}

// ── Cache config ──────────────────────────────────────────────────────────────

const CACHE_TTL  = 7 * 24 * 60 * 60 * 1_000   // 7 days
const TIMEOUT_MS = 12_000
const CACHE_PATH = path.join(process.cwd(), 'lib', 'dcZoneCache.json')

const _memory = new Map<string, { data: DCZoneRules; ts: number }>()

// ── Main export ───────────────────────────────────────────────────────────────

export async function getDCZoneRules(
  documentUrl: string,
  zoneCode: string,
): Promise<DCZoneRules | null> {
  if (!documentUrl || !documentUrl.includes('zoningbylaw.edmonton.ca')) return null

  const key = documentUrl
  const now  = Date.now()

  // 1. Memory cache
  const hit = _memory.get(key)
  if (hit && now - hit.ts < CACHE_TTL) return hit.data

  // 2. Disk cache
  const diskHit = readDiskCache(key)
  if (diskHit && now - diskHit.ts < CACHE_TTL) {
    _memory.set(key, diskHit)
    return diskHit.data
  }

  // 3. Fetch and parse
  try {
    const rules = await fetchAndParse(documentUrl, zoneCode)
    if (!rules) return null
    const entry = { data: rules, ts: now }
    _memory.set(key, entry)
    writeDiskCache(key, entry)
    return rules
  } catch (e) {
    console.warn('[dcZoneExtractor] fetch failed:', (e as Error).message)
    return null
  }
}

// ── Fetcher + parser ──────────────────────────────────────────────────────────

async function fetchAndParse(url: string, zoneCode: string): Promise<DCZoneRules | null> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YEGZoning/1.0)' },
    signal:  AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) return null

  const html = await res.text()
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&[a-zA-Z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Find the start of actual DC zone content
  let content = ''
  const purposeIdx = text.search(/Purpose To (establish|regulate|create|permit|recognize|allow)/i)
  if (purposeIdx > 0) {
    content = text.slice(purposeIdx, purposeIdx + 7000)
  } else {
    // Fallback: find "1. Purpose" section marker
    const idx = text.indexOf('1. Purpose')
    content = idx > 0 ? text.slice(idx, idx + 7000) : text.slice(5000, 12000)
  }

  if (!content || content.length < 100) return null

  // ── Purpose ──────────────────────────────────────────────────────────────
  const purposeMatch = content.match(
    /Purpose (To [^.]{20,400}\.)/i
  ) || content.match(/Purpose\s+(.{20,400}?)\s+\d+\.\s+[A-Z]/i)
  const purpose = purposeMatch ? purposeMatch[1].trim() : ''

  // ── Bylaw ref ────────────────────────────────────────────────────────────
  const bylawMatch = text.match(/Bylaw\s+No?\s*\.?\s*(\d+[A-Z]?\s*(?:,\s*amended\s+by[^)]+)?)/i)
  const bylaw_ref  = bylawMatch ? bylawMatch[0].trim() : extractFromUrl(url)

  // ── Uses — letter-list extraction (a. b. c.) ─────────────────────────────
  // Find the Uses section
  const usesStart = content.search(/\d+\.\s+Uses\b|\bUses\b\s*\n|\bPermitted Uses\b/i)
  const critStart = content.search(/Development Criteria|Development Standards|Site Criteria|Conditions/i)

  let allUses: string[] = []
  if (usesStart >= 0) {
    const usesEnd   = critStart > usesStart ? critStart : usesStart + 2000
    const usesBlock = content.slice(usesStart, usesEnd)
    // Match "a. Use Name" patterns
    const items = [...usesBlock.matchAll(/[a-z]\.\s+([A-Z][a-zA-Z ,\/()-]{4,80}?)(?=\s+[a-z]\s*\.|$)/g)]
    allUses = items.map(m => m[1].trim())
  }

  // Discretionary uses usually listed after "Discretionary" keyword
  const discStart = content.search(/Discretionary|At the discretion/i)
  let discretionary_uses: string[] = []
  if (discStart > 0) {
    const discBlock = content.slice(discStart, discStart + 1000)
    const items = [...discBlock.matchAll(/[a-z]\.\s+([A-Z][a-zA-Z ,\/()-]{4,80}?)(?=\s+[a-z]\s*\.|$)/g)]
    discretionary_uses = items.map(m => m[1].trim())
    // Remove from permitted if overlap
    allUses = allUses.filter(u => !discretionary_uses.includes(u))
  }
  const permitted_uses = allUses.slice(0, 15)

  // ── Height ───────────────────────────────────────────────────────────────
  const heightPatterns = [
    /[Mm]aximum [Hh]eight[^.]*?(\d+(?:\.\d+)?\s*m(?:etres)?)/i,
    /[Hh]eight[^.]*?shall not exceed[^.]*?(\d+(?:\.\d+)?\s*m(?:etres)?)/i,
    /[Hh]eight[^.]*?(\d+)\s+(?:metres?|storeys?|stories)/i,
    /(\d+(?:\.\d+)?)\s*m(?:etres?)?\s+(?:in\s+)?height/i,
    /(\d+)\s+(?:storey|story|storeys|stories)/i,
  ]
  let max_height = ''
  for (const pat of heightPatterns) {
    const m = content.match(pat)
    if (m) { max_height = m[0].trim().slice(0, 80); break }
  }

  // ── Setbacks ─────────────────────────────────────────────────────────────
  const setbackPatterns = {
    front: [/[Ff]ront\s+[Yy]ard[^.]*?(\d+(?:\.\d+)?\s*m(?:etres?)?)/i, /[Ff]ront\s+[Ss]etback[^.]*?(\d+(?:\.\d+)?\s*m)/i],
    rear:  [/[Rr]ear\s+[Yy]ard[^.]*?(\d+(?:\.\d+)?\s*m(?:etres?)?)/i,  /[Rr]ear\s+[Ss]etback[^.]*?(\d+(?:\.\d+)?\s*m)/i],
    side:  [/[Ss]ide\s+[Yy]ard[^.]*?(\d+(?:\.\d+)?\s*m(?:etres?)?)/i,  /[Ss]ide\s+[Ss]etback[^.]*?(\d+(?:\.\d+)?\s*m)/i],
  }

  const extractSetback = (pats: RegExp[]) => {
    for (const pat of pats) {
      const m = content.match(pat)
      if (m) return m[0].trim().slice(0, 100)
    }
    return ''
  }

  // ── Special conditions ───────────────────────────────────────────────────
  const condMatch = content.match(/(?:Conditions?|Heritage|shall|must|required)[^.]{20,200}\./gi)
  const special_conditions = (condMatch ?? [])
    .slice(0, 4)
    .map(s => s.trim())
    .filter(s => s.length > 20)

  return {
    url,
    zone_code:      zoneCode,
    purpose:        purpose.slice(0, 400),
    permitted_uses,
    discretionary_uses: discretionary_uses.slice(0, 10),
    max_height,
    setback_front:  extractSetback(setbackPatterns.front),
    setback_rear:   extractSetback(setbackPatterns.rear),
    setback_side:   extractSetback(setbackPatterns.side),
    special_conditions,
    bylaw_ref,
    fetched_at:     new Date().toISOString(),
  }
}

// ── Disk cache helpers ────────────────────────────────────────────────────────

function readDiskCache(key: string): { data: DCZoneRules; ts: number } | null {
  try {
    if (!fs.existsSync(CACHE_PATH)) return null
    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'))
    return cache[key] ?? null
  } catch { return null }
}

function writeDiskCache(key: string, entry: { data: DCZoneRules; ts: number }): void {
  try {
    let cache: Record<string, unknown> = {}
    if (fs.existsSync(CACHE_PATH)) {
      try { cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')) } catch {}
    }
    cache[key] = entry
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
  } catch {}
}

function extractFromUrl(url: string): string {
  const m = url.match(/dc[12]-(\d+)/i)
  return m ? `Bylaw ${m[1]}` : 'See bylaw document'
}
