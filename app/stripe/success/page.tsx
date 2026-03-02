'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [tier, setTier] = useState<'pro' | 'investor' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      return
    }

    // TODO: Query session to determine tier
    // For now, assume tier from sessionId lookup
    setTier('pro')
    setLoading(false)
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] text-[#e8e0d0]">
        <div className="text-center">
          <div className="animate-pulse text-2xl font-bold text-[#c8a951]">
            Setting up your subscription...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-bold text-[#c8a951] mb-2">Success!</h1>
          <p className="text-xl text-[#e8e0d0] mb-4">
            You're now on {tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'InfillIQ'}
          </p>
          <p className="text-[#8a8070] mb-8">
            Your subscription is active. Start analyzing Edmonton properties now.
          </p>
        </div>

        <Link href="/map"
              className="inline-block px-8 py-3 rounded-lg bg-[#c8a951] text-[#0a0c10] font-bold hover:bg-[#d4b86a] transition-colors mb-4">
          Start Searching
        </Link>

        <div className="text-[12px] text-[#4a5568]">
          Manage your subscription in your account settings anytime.
        </div>
      </div>
    </div>
  )
}
