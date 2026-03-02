'use client'

import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">←</div>
          <h1 className="text-4xl font-bold text-[#e8e0d0] mb-2">No Problem</h1>
          <p className="text-xl text-[#8a8070] mb-4">
            You can upgrade anytime when you're ready.
          </p>
          <p className="text-[13px] text-[#4a5568] mb-8">
            The free tier gives you access to zone data, rezoning alerts, and nearby development permits.
          </p>
        </div>

        <Link href="/"
              className="inline-block px-8 py-3 rounded-lg bg-[#c8a951] text-[#0a0c10] font-bold hover:bg-[#d4b86a] transition-colors mb-4">
          Back to Home
        </Link>

        <Link href="/map"
              className="block text-[13px] text-[#8a8070] hover:text-[#c8a951] transition-colors">
          Or go directly to the map
        </Link>
      </div>
    </div>
  )
}
