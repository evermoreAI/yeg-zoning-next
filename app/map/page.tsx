import { Suspense }          from 'react'
import MapTerminalLoader     from '@/components/MapTerminalLoader'
import MapTerminal           from '@/components/MapTerminal'

export default function Home() {
  return (
    <Suspense fallback={<MapTerminal />}>
      <MapTerminalLoader />
    </Suspense>
  )
}
