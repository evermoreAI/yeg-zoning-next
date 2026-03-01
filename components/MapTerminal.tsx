'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useTier, type Tier } from '@/lib/tierContext'
import mapboxgl from 'mapbox-gl'
import MapView       from './MapView'
import SearchBar     from './SearchBar'
import ZonePanel     from './ZonePanel'
import BookmarksPanel from './BookmarksPanel'
import type { Bookmark } from '@/lib/bookmarks'
import type { FlyToTarget, SearchResult, ZoneDisplay } from '@/lib/types'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface MapTerminalProps {
  initialLoad?: { lat: number; lon: number; address: string } | null
}

export default function MapTerminal({ initialLoad }: MapTerminalProps = {}) {
  const mapRef   = useRef<mapboxgl.Map | null>(null)
  const [flyTo,         setFlyTo]         = useState<FlyToTarget | null>(null)
  const [zoneData,      setZoneData]      = useState<ZoneDisplay | null>(null)
  const [loadingZone,   setLoadingZone]   = useState(false)
  const [lastAddress,   setLastAddress]   = useState('')
  const [panelOpen,     setPanelOpen]     = useState(false)  // mobile panel toggle

  // ── Fetch zone ────────────────────────────────────────────────────────────
  const fetchZone = useCallback(async (lat: number, lng: number) => {
    setLoadingZone(true)
    setPanelOpen(true)   // always open panel on search (mobile)
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
  }, [])

  const { tier, setTier } = useTier()
  const [bookmarksOpen,   setBookmarksOpen]   = useState(false)
  const [bookmarkRefresh, setBookmarkRefresh] = useState(0)

  // Deep-link auto-load from /zones/* SEO pages
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
    setBookmarksOpen(false)
  }

  function handleLocate(lat: number, lng: number) {
    setLastAddress('Current location')
    fetchZone(lat, lng)
  }

  const TIERS: Tier[] = ['free', 'pro', 'investor']

  return (
    <div className="flex flex-col h-screen bg-[#0a0c10] overflow-hidden">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 h-14 flex items-center gap-3 px-4 border-b border-[#1a2535] z-20"
              style={{ background: '#0d1117' }}>
        {/* Logo */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[#c8a951] text-lg leading-none">⚡</span>
          <span className="text-[#e8e0d0] font-bold text-[11px] tracking-[0.18em] uppercase leading-none hidden sm:block"
                style={{ fontFamily: 'var(--font-rajdhani)' }}>
            YEG ZONING<br />
            <span className="text-[#4a5568] text-[9px] tracking-[0.15em]">COMMAND CENTER</span>
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-0">
          <SearchBar onSelect={handleSelect} token={MAPBOX_TOKEN} />
        </div>

        {/* Bookmarks */}
        <button onClick={() => setBookmarksOpen(o => !o)}
                className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg border border-[#2a2e38] hover:border-[#c8a951] transition-colors"
                aria-label="Bookmarks">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="#c8a951" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        {/* Tier switcher */}
        <div className="flex-shrink-0 flex rounded overflow-hidden border border-[#2a2e38]">
          {TIERS.map(t => (
            <button key={t} onClick={() => setTier(t)}
                    className="text-[9px] uppercase tracking-widest px-2.5 py-1.5 transition-colors"
                    style={{ fontFamily: 'var(--font-rajdhani)', background: tier === t ? '#c8a951' : 'transparent', color: tier === t ? '#0a0c10' : '#4a5568' }}>
              {t}
            </button>
          ))}
        </div>

        {/* GPS */}
        <button onClick={handleGpsClick}
                className="flex-shrink-0 w-11 h-11 items-center justify-center rounded-lg border border-[#2a2e38] hover:border-[#c8a951] transition-colors hidden sm:flex"
                aria-label="Use my location">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="#c8a951" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2"  x2="12" y2="6"  />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2"  y1="12" x2="6"  y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </button>
      </header>

      {/* ── Content — Desktop: side-by-side | Mobile: stacked ─────────────── */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">

        {/* Map pane — full width on mobile, 60% on desktop */}
        <div className={`relative overflow-hidden transition-all duration-300
          ${panelOpen ? 'h-[35vh] md:h-auto' : 'flex-1'}
          md:flex-[0_0_60%]`}>
          <MapView mapRef={mapRef} flyTo={flyTo} onLocate={([lat, lng]: [number, number]) => handleLocate(lat, lng)} />

          {/* Mobile: tap to show/hide panel hint when panel closed */}
          {!panelOpen && (zoneData || loadingZone) && (
            <button onClick={() => setPanelOpen(true)}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden px-4 py-2 rounded-full text-[10px] uppercase tracking-widest text-[#c8a951] border border-[#c8a951]"
                    style={{ background: 'rgba(10,12,16,0.9)' }}>
              Show zone details ↑
            </button>
          )}
        </div>

        {/* Zone panel — full width on mobile, 40% on desktop */}
        <div className={`bg-[#0a0c10] flex flex-col min-h-0 border-t md:border-t-0 md:border-l border-[#1a2535] transition-all duration-300
          ${panelOpen ? 'flex-1' : 'h-0 overflow-hidden'}
          md:flex-[0_0_40%] md:flex md:h-auto`}>
          <div className="h-[2px] bg-gradient-to-r from-[#c8a951] via-[#c8a951] to-transparent flex-shrink-0" />

          {/* Mobile close button */}
          {panelOpen && (zoneData || loadingZone) && (
            <button onClick={() => setPanelOpen(false)}
                    className="md:hidden flex-shrink-0 py-1.5 text-center text-[9px] uppercase tracking-widest text-[#4a5568] border-b border-[#1a2535]">
              ▲ Show map
            </button>
          )}

          <ZonePanel
            zone={zoneData}
            loading={loadingZone}
            address={lastAddress}
            tier={tier}
            onBookmarkChanged={handleBookmarkChange}
          />
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
