'use client'

import { useRef, useState, useEffect } from 'react'
import { useTier, type Tier } from '@/lib/tierContext'
import mapboxgl from 'mapbox-gl'
import MapView   from './MapView'
import SearchBar from './SearchBar'
import ZonePanel from './ZonePanel'
import BookmarksPanel from './BookmarksPanel'
import type { Bookmark } from '@/lib/bookmarks'
import type { FlyToTarget, SearchResult, ZoneDisplay } from '@/lib/types'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface MapTerminalProps {
  initialLoad?: { lat: number; lon: number; address: string } | null
}

export default function MapTerminal({ initialLoad }: MapTerminalProps = {}) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [flyTo,        setFlyTo]        = useState<FlyToTarget | null>(null)
  const [zoneData,     setZoneData]     = useState<ZoneDisplay | null>(null)
  const [loadingZone,  setLoadingZone]  = useState(false)
  const [lastAddress,  setLastAddress]  = useState('')

  // ── Fetch zone from Next.js API route (server-side Edmonton GIS call) ────
  async function fetchZone(lat: number, lng: number) {
    setLoadingZone(true)
    try {
      const res  = await fetch(`/api/zone?lat=${lat}&lon=${lng}`)
      const data: ZoneDisplay = await res.json()
      setZoneData(data)
    } catch (err) {
      console.error('[YEG] Zone fetch failed:', err)
      setZoneData({
        found: false, zone_code: '', zone_string: '', zone_name: '',
        zone_desc: '', max_units: '—', max_units_note: '', height: '—',
        height_note: '', coverage: '—', coverage_note: '',
        lot_threshold: '—', lot_threshold_note: '',
        amendment_warning: false, amendment_text: '', dc_warning: false,
        layer2: null, bylaw_12800_equiv: null,
        bylaw_url: null, fetched_at: new Date().toISOString(),
        error: 'Unable to load zone data. Verify with City of Edmonton via 311.',
      })
    } finally {
      setLoadingZone(false)
    }
  }

  const { tier, setTier } = useTier()
  const [bookmarksOpen,  setBookmarksOpen]  = useState(false)
  const [bookmarkRefresh, setBookmarkRefresh] = useState(0)

  // Auto-load zone from URL params (deep-link from /zones/* SEO pages)
  useEffect(() => {
    if (!initialLoad) return
    setLastAddress(initialLoad.address)
    setFlyTo({ lat: initialLoad.lat, lng: initialLoad.lon, zoom: 17 })
    fetchZone(initialLoad.lat, initialLoad.lon)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoad?.lat, initialLoad?.lon])

  function handleSelect(result: SearchResult) {
    setLastAddress(result.address)
    setFlyTo({ lat: result.lat, lng: result.lng, zoom: 17 })
    fetchZone(result.lat, result.lng)
  }

  function handleGpsClick() {
    window.dispatchEvent(new Event('yeg:gps'))
  }

  function handleBookmarkChange() {
    setBookmarkRefresh(n => n + 1)
  }

  function handleViewBookmark(b: Bookmark) {
    setLastAddress(b.address)
    setFlyTo({ lat: b.lat, lng: b.lng, zoom: 17 })
    fetchZone(b.lat, b.lng)
  }

  function handleLocate(coords: [number, number]) {
    setFlyTo({ lng: coords[0], lat: coords[1], zoom: 16 })
    fetchZone(coords[1], coords[0])
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0c10]">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center gap-4 px-4 py-2 bg-[#0a0c10] border-b border-[#1a2535] h-[56px] z-20">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[#c8a951] text-xl leading-none">⚡</span>
          <div className="flex flex-col leading-none">
            <span className="text-[#e8e0d0] text-base font-bold tracking-[0.15em] uppercase" style={{ fontFamily: 'var(--font-rajdhani)' }}>
              YEG ZONING
            </span>
            <span className="text-[#8a8070] text-[9px] tracking-[0.25em] uppercase" style={{ fontFamily: 'var(--font-rajdhani)' }}>
              COMMAND CENTER
            </span>
          </div>
          <div className="ml-1 w-px h-6 bg-gradient-to-b from-transparent via-[#c8a951] to-transparent opacity-50" />
        </div>

        <SearchBar token={MAPBOX_TOKEN} onSelect={handleSelect} />

        {/* Bookmarks button */}
        <button
          onClick={() => setBookmarksOpen(o => !o)}
          aria-label="Saved parcels"
          className="flex-shrink-0 relative w-11 h-11 flex items-center justify-center bg-[#141820] border border-[#2a2e38] rounded-lg hover:border-[#c8a951] hover:bg-[#1e2630] transition-all duration-200"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
               stroke="#8a8070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        {/* Demo tier switcher — replace with Clerk auth later */}
        <div className="flex-shrink-0 flex items-center gap-1.5">
          {(['free', 'pro', 'investor'] as Tier[]).map(t => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className="h-7 px-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-150"
              style={{
                fontFamily: 'var(--font-rajdhani)',
                background: tier === t ? '#c8a951' : 'transparent',
                color:      tier === t ? '#0a0c10'  : '#8a8070',
                border:     tier === t ? '1px solid #c8a951' : '1px solid #2a2e38',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* GPS button */}
        <button
          type="button" aria-label="Use my location" onClick={handleGpsClick}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-[#141820] border border-[#c8a951] rounded-lg hover:bg-[#1e2630] hover:shadow-[0_0_12px_rgba(200,169,81,0.3)] transition-all duration-200"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="#c8a951" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2"  x2="12" y2="6"  />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2"  y1="12" x2="6"  y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </button>
      </header>

      {/* ── Content row ─────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Map pane — 60% */}
        <div className="relative flex-[0_0_60%] overflow-hidden">
          <MapView mapRef={mapRef} flyTo={flyTo} onLocate={handleLocate} />
        </div>

        {/* Zone panel — 40% */}
        <div className="flex-[0_0_40%] bg-[#0a0c10] flex flex-col overflow-hidden border-l border-[#1a2535]">
          <div className="h-[2px] bg-gradient-to-r from-[#c8a951] via-[#c8a951] to-transparent flex-shrink-0" />
          <ZonePanel zone={zoneData} loading={loadingZone} address={lastAddress} tier={tier} onBookmarkChanged={handleBookmarkChange} />
          <BookmarksPanel
            open={bookmarksOpen}
            onClose={() => setBookmarksOpen(false)}
            onView={handleViewBookmark}
            refreshKey={bookmarkRefresh}
          />
        </div>
      </div>
    </div>
  )
}
