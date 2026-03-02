'use client'

import { useState } from 'react'

interface EmailModalProps {
  tier: 'pro' | 'investor'
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => Promise<void>
}

export default function EmailModal({ tier, isOpen, onClose, onSubmit }: EmailModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await onSubmit(email)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to proceed')
      setLoading(false)
    }
  }

  const tierName = tier.charAt(0).toUpperCase() + tier.slice(1)
  const tierPrice = tier === 'pro' ? '$29' : '$79'

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-[#141820] border border-[#2a2e38] rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-rajdhani)' }}>
          Get InfillIQ {tierName}
        </h2>
        <p className="text-[#c8a951] text-lg font-bold mb-4">{tierPrice}/month CAD</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#8a8070] mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-[#0a0c10] border border-[#2a2e38] rounded px-4 py-2 text-[#e8e0d0] placeholder:text-[#3d5470] focus:border-[#c8a951] outline-none"
            />
          </div>

          {error && (
            <div className="text-[13px] text-[#8b1a1a] bg-[#1a0a0a] border border-[#8b1a1a] rounded px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-[#c8a951] text-[#0a0c10] font-bold py-2 rounded hover:bg-[#d4b86a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Continue to Checkout'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-[#8a8070] hover:text-[#c8a951] transition-colors py-2"
          >
            Cancel
          </button>
        </form>

        <p className="text-[11px] text-[#4a5568] mt-4 text-center">
          We'll send you a magic link to activate your account.
        </p>
      </div>
    </div>
  )
}
