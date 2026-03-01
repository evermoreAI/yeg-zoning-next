'use client'

import { useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import MapView from './MapView'

export default function MapTerminal() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [flyTo, setFlyTo] = useState<{ lng: number; lat: number; zoom?: number } | null>(null)

  function handleGpsClick() {
    window.dispatchEvent(new Event('yeg:gps'))
  }

  function handleLocate(coords: [number, number]) {
    setFlyTo({ lng: coords[0], lat: coords[1], zoom: 16 })
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0c10]">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center gap-4 px-4 py-2 bg-[#0a0c10] border-b border-[#1a2535] h-[56px]">

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[#c8a951] text-xl leading-none">⚡</span>
          <div className="flex flex-col leading-none">
            <span
              className="text-[#e8e0d0] text-base font-bold tracking-[0.15em] uppercase"
              style={{ fontFamily: 'var(--font-rajdhani)' }}
            >
              YEG ZONING
            </span>
            <span
              className="text-[#8a8070] text-[9px] tracking-[0.25em] uppercase"
              style={{ fontFamily: 'var(--font-rajdhani)' }}
            >
              COMMAND CENTER
            </span>
          </div>
          <div className="ml-1 w-px h-6 bg-gradient-to-b from-transparent via-[#c8a951] to-transparent opacity-50" />
        </div>

        {/* Search input */}
        <div className="flex-1 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d5470] text-sm pointer-events-none select-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search any Edmonton address..."
            className="
              w-full bg-[#141820] border border-[#2a2e38] rounded-full
              pl-10 pr-10 py-2.5
              text-sm text-[#e8e0d0] placeholder:text-[#3d5470]
              outline-none
              transition-all duration-200
              focus:border-[#c8a951] focus:shadow-[0_0_0_2px_rgba(200,169,81,0.12)]
            "
          />
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5568] text-sm w-6 h-6 flex items-center justify-center rounded-full hover:text-[#e8e0d0] transition-colors duration-150 opacity-0"
          >
            ✕
          </button>
        </div>

        {/* GPS button */}
        <button
          type="button"
          aria-label="Use my location"
          onClick={handleGpsClick}
          className="
            flex-shrink-0 w-11 h-11 flex items-center justify-center
            bg-[#141820] border border-[#c8a951] rounded-lg
            text-[#c8a951] hover:bg-[#1e2630]
            hover:shadow-[0_0_12px_rgba(200,169,81,0.3)]
            transition-all duration-200
          "
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
          <MapView
            mapRef={mapRef}
            flyTo={flyTo}
            onLocate={handleLocate}
          />
        </div>

        {/* Zone panel — 40% */}
        <div className="flex-[0_0_40%] bg-[#0a0c10] flex flex-col overflow-hidden border-l border-[#1a2535]">
          <div className="h-[2px] bg-gradient-to-r from-[#c8a951] via-[#c8a951] to-transparent flex-shrink-0" />

          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div
                className="text-[#2a3545] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: 'var(--font-rajdhani)' }}
              >
                ZONE PANEL LOADS HERE
              </div>
              <div className="w-8 h-px bg-[#c8a951] opacity-20" />
              <div className="grid grid-cols-2 gap-2 mt-2 opacity-20">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-24 h-16 rounded-lg bg-[#141820] border border-[#2a2e38]" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 px-4 py-2 border-t border-[#1a2535]">
            <p className="text-[#2a3545] text-[9px] leading-relaxed">
              Zoning data for reference only. Always verify with City of Edmonton via 311.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
