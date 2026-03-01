'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const EDMONTON_CENTER: [number, number] = [-113.4938, 53.5461]
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface MapViewProps {
  /** Called when GPS locates user — passes [lng, lat] */
  onLocate?: (coords: [number, number]) => void
  /** Fly to this position when it changes */
  flyTo?: { lng: number; lat: number; zoom?: number } | null
  /** Expose flyTo method to parent via ref pattern */
  mapRef?: React.MutableRefObject<mapboxgl.Map | null>
}

export default function MapView({ onLocate, flyTo, mapRef }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)

  // ── Init map ────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapInstance.current) return
    if (!MAPBOX_TOKEN) {
      console.error('[YEG] NEXT_PUBLIC_MAPBOX_TOKEN is not set')
      return
    }

    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: EDMONTON_CENTER,
      zoom: 11,
      pitch: 20,
      antialias: true,
    })

    // Navigation controls (zoom in/out) — top left
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left')

    mapInstance.current = map
    if (mapRef) mapRef.current = map

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [mapRef])

  // ── Fly to position when prop changes ───────────────────
  useEffect(() => {
    if (!flyTo || !mapInstance.current) return
    const map = mapInstance.current

    // Drop/move gold marker
    if (markerRef.current) {
      markerRef.current.setLngLat([flyTo.lng, flyTo.lat])
    } else {
      const el = document.createElement('div')
      el.style.cssText = [
        'width:16px', 'height:16px', 'background:#c8a951',
        'border:2px solid #fff', 'border-radius:50% 50% 50% 0',
        'transform:rotate(-45deg)',
        'box-shadow:0 0 10px rgba(200,169,81,0.6)',
      ].join(';')
      markerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([flyTo.lng, flyTo.lat])
        .addTo(map)
    }

    map.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: flyTo.zoom ?? 17,
      pitch: 45,
      duration: 1400,
      essential: true,
    })
  }, [flyTo])

  // ── GPS locate ──────────────────────────────────────────
  const handleGps = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude]
        onLocate?.(coords)
      },
      (err) => console.warn('[YEG] GPS error:', err.message),
      { timeout: 10_000, enableHighAccuracy: true }
    )
  }, [onLocate])

  // Expose GPS handler via a custom DOM event so TopBar can trigger it
  useEffect(() => {
    const handler = () => handleGps()
    window.addEventListener('yeg:gps', handler)
    return () => window.removeEventListener('yeg:gps', handler)
  }, [handleGps])

  return (
    <div className="relative w-full h-full">
      {/* Mapbox container — fills entire pane */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Corner accent brackets */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#c8a951] opacity-30 pointer-events-none z-10" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#c8a951] opacity-30 pointer-events-none z-10" />
    </div>
  )
}
