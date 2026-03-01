'use client'

import { useState } from 'react'

/**
 * EmailCapture — early-access signup banner.
 * Sits below the disclaimer in ZonePanel. Pure display + one API call.
 * Business logic (storage/send) lives in /api/subscribe.
 */
export default function EmailCapture() {
  const [email,     setEmail]     = useState('')
  const [status,    setStatus]    = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg,    setErrMsg]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')
    try {
      const res  = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('done')
      } else {
        setErrMsg(data.error ?? 'Something went wrong.')
        setStatus('error')
      }
    } catch {
      setErrMsg('Network error — try again.')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="mt-3 p-3 rounded-lg text-center"
           style={{ background: 'rgba(45,106,45,0.15)', border: '1px solid #2d6a2d' }}>
        <p className="text-[#6ab86a] text-xs font-semibold">✓ You're on the list.</p>
        <p className="text-[#4a5568] text-[10px] mt-0.5">We'll notify you when Pro launches.</p>
      </div>
    )
  }

  return (
    <div className="mt-3 p-3 rounded-lg" style={{ background: '#0d1117', border: '1px solid #c8a951' }}>
      <p className="text-[#e8e0d0] text-[11px] font-semibold mb-2 leading-snug">
        Get early access to Pro — enter your email to be notified at launch.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading'}
          className="flex-1 min-w-0 px-2.5 py-2 rounded text-[11px] outline-none transition-all"
          style={{
            background: '#141820',
            border: '1px solid #2a2e38',
            color: '#e8e0d0',
            fontFamily: 'var(--font-inter)',
          }}
          onFocus={e  => (e.target.style.borderColor = '#c8a951')}
          onBlur={e   => (e.target.style.borderColor = '#2a2e38')}
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="flex-shrink-0 px-3 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50"
          style={{
            fontFamily: 'var(--font-rajdhani)',
            background: '#c8a951',
            color: '#0a0c10',
            minWidth: 64,
          }}
        >
          {status === 'loading' ? '…' : 'Notify me'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-[#8b1a1a] text-[10px] mt-1.5">{errMsg}</p>
      )}
    </div>
  )
}
