'use client'

/**
 * lib/tierContext.tsx
 * Global tier state — defaults to 'free'.
 * Replace TierProvider with real auth (Clerk) later; consumers stay unchanged.
 */

import { createContext, useContext, useState } from 'react'

export type Tier = 'free' | 'pro' | 'investor'

interface TierContextValue {
  tier: Tier
  setTier: (t: Tier) => void
}

const TierContext = createContext<TierContextValue>({ tier: 'free', setTier: () => {} })

export function TierProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<Tier>('free')
  return <TierContext.Provider value={{ tier, setTier }}>{children}</TierContext.Provider>
}

export function useTier() {
  return useContext(TierContext)
}

/** Returns true if the current tier meets or exceeds the required tier */
export function tierAtLeast(current: Tier, required: Tier): boolean {
  const rank: Record<Tier, number> = { free: 0, pro: 1, investor: 2 }
  return rank[current] >= rank[required]
}
