'use client'

import { useState, useEffect } from 'react'
import { isBookmarked, addBookmark, removeBookmark } from '@/lib/bookmarks'

interface BookmarkButtonProps {
  lat:       number
  lng:       number
  address:   string
  zone_code: string
  zone_name: string
  onChanged?: () => void  // notify parent to refresh count
}

export default function BookmarkButton({
  lat, lng, address, zone_code, zone_name, onChanged,
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isBookmarked(lat, lng))
  }, [lat, lng])

  function toggle() {
    const id = `${lat.toFixed(5)},${lng.toFixed(5)}`
    if (saved) {
      removeBookmark(id)
      setSaved(false)
    } else {
      addBookmark({ lat, lng, address, zone_code, zone_name })
      setSaved(true)
    }
    onChanged?.()
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? 'Remove bookmark' : 'Bookmark this parcel'}
      title={saved ? 'Remove bookmark' : 'Save parcel'}
      className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
      style={{
        background: saved ? 'rgba(200,169,81,0.15)' : 'transparent',
        border: saved ? '1px solid #c8a951' : '1px solid #2a2e38',
      }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill={saved ? '#c8a951' : 'none'}
           stroke={saved ? '#c8a951' : '#8a8070'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
}
