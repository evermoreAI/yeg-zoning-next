'use client'

/**
 * SearchBarRedirect — identical autocomplete to SearchBar, but on selection
 * redirects to /?lat=X&lon=Y&address=... so the map opens pre-loaded.
 * Used on SEO/landing pages. Reuses SearchBar logic directly.
 */

import SearchBar from './SearchBar'
import type { SearchResult } from '@/lib/types'

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

export default function SearchBarRedirect() {
  function handleSelect(result: SearchResult) {
    const params = new URLSearchParams({
      lat:     result.lat.toString(),
      lon:     result.lng.toString(),
      address: result.address,
    })
    window.location.href = `/?${params.toString()}`
  }

  return <SearchBar token={TOKEN} onSelect={handleSelect} />
}
