'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { SearchResult } from '@/lib/types'

// Edmonton bounding box — reject results outside this
const EDMONTON_BBOX = { n: 53.7163, s: 53.3963, e: -113.2695, w: -113.7142 }

function inEdmonton(lat: number, lng: number): boolean {
  return (
    lat >= EDMONTON_BBOX.s && lat <= EDMONTON_BBOX.n &&
    lng >= EDMONTON_BBOX.w && lng <= EDMONTON_BBOX.e
  )
}

interface SearchBarProps {
  onSelect: (result: SearchResult) => void
  token: string
}

export default function SearchBar({ onSelect, token }: SearchBarProps) {
  const [value, setValue]           = useState('')
  const [results, setResults]       = useState<SearchResult[]>([])
  const [loading, setLoading]       = useState(false)
  const [open, setOpen]             = useState(false)
  const [focusedIdx, setFocusedIdx] = useState(-1)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef    = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ── Fetch suggestions ────────────────────────────────────
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!token) return
    setLoading(true)
    try {
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json` +
        `?access_token=${token}&country=CA&proximity=-113.4938,53.5461&types=address&limit=5`
      const res  = await fetch(url)
      const data = await res.json()

      const features: SearchResult[] = (data.features ?? [])
        .filter((f: any) => {
          const [lng, lat] = f.center
          return inEdmonton(lat, lng)
        })
        .map((f: any) => {
          const parts = (f.place_name ?? '').split(', ')
          const address = parts.slice(0, 2).join(', ')
          return { address, lat: f.center[1], lng: f.center[0] }
        })

      setResults(features)
      setOpen(features.length > 0)
      setFocusedIdx(-1)
    } catch (err) {
      console.error('[YEG] Geocoding error:', err)
      setResults([])
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }, [token])

  // ── Debounced input handler ──────────────────────────────
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setValue(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (v.trim().length < 3) { setOpen(false); setResults([]); return }
    setLoading(true)
    debounceRef.current = setTimeout(() => fetchSuggestions(v.trim()), 200)
  }

  // ── Keyboard navigation ──────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && focusedIdx >= 0) {
      e.preventDefault()
      selectResult(results[focusedIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function selectResult(result: SearchResult) {
    setValue(result.address)
    setOpen(false)
    setResults([])
    setFocusedIdx(-1)
    onSelect(result)
  }

  function handleClear() {
    setValue('')
    setOpen(false)
    setResults([])
    inputRef.current?.focus()
  }

  // Close dropdown on outside click
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current   && !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [])

  const showClear   = value.length > 0
  const showSpinner = loading && value.trim().length >= 3

  return (
    <div className="flex-1 relative">
      {/* Search icon */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3d5470] text-sm pointer-events-none select-none z-10">
        {showSpinner
          ? <span className="inline-block w-3.5 h-3.5 border-2 border-[#2a2e38] border-t-[#c8a951] rounded-full animate-spin" />
          : '🔍'}
      </span>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Search any Edmonton address..."
        autoComplete="off"
        spellCheck={false}
        className="
          w-full bg-[#141820] border border-[#2a2e38] rounded-full
          pl-10 pr-10 py-2.5
          text-sm text-[#e8e0d0] placeholder:text-[#3d5470]
          outline-none
          transition-all duration-200
          focus:border-[#c8a951] focus:shadow-[0_0_0_2px_rgba(200,169,81,0.12)]
        "
      />

      {/* Clear button */}
      {showClear && (
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleClear() }}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5568] text-xs w-6 h-6 flex items-center justify-center rounded-full hover:text-[#e8e0d0] transition-colors duration-150"
        >
          ✕
        </button>
      )}

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-[#141820] border border-[#c8a951] rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
          style={{ animation: 'fadeSlideDown 0.15s ease' }}
        >
          {results.map((r, i) => {
            const [street, ...rest] = r.address.split(', ')
            const city = rest.join(', ')
            return (
              <div
                key={i}
                onMouseDown={(e) => { e.preventDefault(); selectResult(r) }}
                onMouseEnter={() => setFocusedIdx(i)}
                className={`
                  flex items-center gap-3 px-4 py-3 cursor-pointer min-h-[50px]
                  border-b border-[#1e2530] last:border-b-0
                  transition-colors duration-100
                  ${focusedIdx === i ? 'bg-[rgba(200,169,81,0.07)]' : 'hover:bg-[rgba(200,169,81,0.05)]'}
                `}
              >
                <span className={`text-sm flex-shrink-0 transition-colors duration-100 ${focusedIdx === i ? 'text-[#c8a951]' : 'text-[#8a8070]'}`}>
                  📍
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#e8e0d0] truncate leading-tight">{street}</div>
                  {city && <div className="text-[11px] text-[#8a8070] mt-0.5 truncate">{city}</div>}
                </div>
              </div>
            )
          })}
          {/* Keyboard hint */}
          <div className="flex gap-3 px-4 py-1.5 bg-[#0d1117] border-t border-[#1e2530]">
            <span className="text-[10px] text-[#2a3545]">↑↓ navigate</span>
            <span className="text-[10px] text-[#2a3545]">↵ select</span>
            <span className="text-[10px] text-[#2a3545]">esc close</span>
          </div>
        </div>
      )}
    </div>
  )
}
