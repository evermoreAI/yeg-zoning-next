/**
 * lib/bookmarks.ts
 * localStorage bookmark CRUD — no auth required.
 * Replace storage layer with API calls when Clerk auth is added.
 */

const KEY     = 'yeg_bookmarks'
const MAX     = 50

export interface Bookmark {
  id:        string   // `${lat},${lng}` — stable parcel key
  address:   string
  zone_code: string
  zone_name: string
  lat:       number
  lng:       number
  saved_at:  string  // ISO timestamp
}

function load(): Bookmark[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch { return [] }
}

function save(items: Bookmark[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function getBookmarks(): Bookmark[] {
  return load()
}

export function isBookmarked(lat: number, lng: number): boolean {
  const id = `${lat.toFixed(5)},${lng.toFixed(5)}`
  return load().some(b => b.id === id)
}

export function addBookmark(b: Omit<Bookmark, 'id' | 'saved_at'>): Bookmark {
  const items = load().filter(x => x.id !== `${b.lat.toFixed(5)},${b.lng.toFixed(5)}`)
  const entry: Bookmark = {
    ...b,
    id:       `${b.lat.toFixed(5)},${b.lng.toFixed(5)}`,
    saved_at: new Date().toISOString(),
  }
  const updated = [entry, ...items].slice(0, MAX)  // newest first, cap at 50
  save(updated)
  return entry
}

export function removeBookmark(id: string) {
  save(load().filter(b => b.id !== id))
}

export function formatSavedDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}
