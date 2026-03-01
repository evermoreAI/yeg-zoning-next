'use client'

/**
 * MapTerminalLoader — reads ?lat, ?lon, ?address from URL on mount
 * and passes them into MapTerminal as initialFlyTo props.
 * This enables deep-links from the /zones/* SEO pages.
 */

import { useEffect, useState } from 'react'
import { useSearchParams }     from 'next/navigation'
import MapTerminal             from './MapTerminal'

export default function MapTerminalLoader() {
  const params = useSearchParams()
  const [initial, setInitial] = useState<{
    lat: number; lon: number; address: string
  } | null>(null)

  useEffect(() => {
    const lat  = parseFloat(params.get('lat')  ?? '')
    const lon  = parseFloat(params.get('lon')  ?? '')
    const addr = params.get('address') ?? ''
    if (!isNaN(lat) && !isNaN(lon)) {
      setInitial({ lat, lon, address: addr })
    }
  }, [params])

  return <MapTerminal initialLoad={initial} />
}
