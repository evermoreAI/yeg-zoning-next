'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Verify session on mount if needed
    // For now, just show success page
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-bold text-[#c8a951] mb-2">Success!</h1>
          <p className="text-xl text-[#e8e0d0] mb-4">
            Your subscription is now active
          </p>
          <p className="text-[#8a8070] mb-8">
            Start analyzing Edmonton properties now.
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
