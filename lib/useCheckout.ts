import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useCheckout() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCheckout = async (tier: 'pro' | 'investor') => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })

      const data = await response.json()

      if (!response.ok || !data.url) {
        setError(data.error || 'Failed to create checkout session')
        setLoading(false)
        return
      }

      // Redirect to Stripe hosted checkout
      router.push(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }

  return { startCheckout, loading, error }
}
