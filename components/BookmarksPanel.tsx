'use client'

import { useState, useEffect, useCallback } from 'react'
import { getBookmarks, removeBookmark, formatSavedDate, type Bookmark } from '@/lib/bookmarks'

const ZONE_COLORS: Record<string, string> = {
  RS: '#4a7c59', RSM: '#6b8f71', RM: '#5b7fa6', RH: '#3a5f8a',
  MU: '#8b6914', DC: '#8b1a1a',
}
function zoneColor(code: string) {
  return ZONE_COLORS[code] ?? '#2a2e38'
}

interface BookmarksPanelProps {
  open:     boolean
  onClose:  () => void
  onView:   (b: Bookmark) => void
  refreshKey: number  // increment to force re-load from localStorage
}

export default function BookmarksPanel({ open, onClose, onView, refreshKey }: BookmarksPanelProps) {
  const [items, setItems] = useState<Bookmark[]>([])

  const reload = useCallback(() => setItems(getBookmarks()), [])

  useEffect(() => { reload() }, [reload, refreshKey])

  function handleRemove(id: string) {
    removeBookmark(id)
    reload()
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Slide-in drawer from right */}
      <div
        className="fixed top-0 right-0 h-full z-40 flex flex-col"
        style={{
          width: 340,
          background: '#0d1117',
          borderLeft: '1px solid #2a2e38',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1)',
          boxShadow: open ? '-8px 0 32px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2530] flex-shrink-0"
             style={{ height: 56 }}>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#c8a951"
                 stroke="#c8a951" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-[#e8e0d0] font-bold text-sm tracking-[0.15em] uppercase"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}>
              SAVED PARCELS
            </span>
            {items.length > 0 && (
              <span className="text-[10px] text-[#0a0c10] bg-[#c8a951] rounded-full px-1.5 py-0 font-bold leading-4"
                    style={{ fontFamily: 'var(--font-mono)' }}>
                {items.length}
              </span>
            )}
          </div>
          <button onClick={onClose} aria-label="Close bookmarks"
                  className="w-8 h-8 flex items-center justify-center rounded text-[#8a8070] hover:text-[#e8e0d0] transition-colors">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none"
                   stroke="#2a2e38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-[#4a5568] text-sm">No saved parcels yet.</p>
              <p className="text-[#3a4050] text-xs">Search an address and tap the bookmark icon to save it.</p>
            </div>
          ) : (
            items.map(b => (
              <div key={b.id}
                   className="mx-2 mb-2 rounded-lg overflow-hidden"
                   style={{ background: '#141820', border: '1px solid #1e2530' }}>
                {/* Zone color bar */}
                <div style={{ height: 3, background: zoneColor(b.zone_code) }} />
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[#e8e0d0] text-[12px] font-semibold leading-tight truncate">
                        {b.address}
                      </p>
                      <p className="text-[#8a8070] text-[10px] mt-0.5">{formatSavedDate(b.saved_at)}</p>
                    </div>
                    <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            background: zoneColor(b.zone_code) + '33',
                            color: zoneColor(b.zone_code),
                            border: `1px solid ${zoneColor(b.zone_code)}55`,
                          }}>
                      {b.zone_code}
                    </span>
                  </div>
                  <p className="text-[#4a5568] text-[10px] mb-3 truncate">{b.zone_name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onView(b); onClose() }}
                      className="flex-1 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all duration-150"
                      style={{
                        fontFamily: 'var(--font-rajdhani)',
                        background: '#c8a951',
                        color: '#0a0c10',
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleRemove(b.id)}
                      aria-label="Remove bookmark"
                      className="w-8 flex items-center justify-center rounded transition-colors"
                      style={{ border: '1px solid #2a2e38' }}
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" stroke="#8b1a1a" fill="none"
                           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#1e2530] flex-shrink-0">
          <p className="text-[9px] text-[#2a3040] text-center">
            Saved locally on this device · Max 50 parcels
          </p>
        </div>
      </div>
    </>
  )
}
