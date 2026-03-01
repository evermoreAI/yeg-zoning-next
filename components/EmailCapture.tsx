'use client'

import { useState } from 'react'

export default function EmailCapture() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

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
      if (data.ok) { setStatus('done') }
      else { setErrMsg(data.error ?? 'Something went wrong.'); setStatus('error') }
    } catch {
      setErrMsg('Network error — try again.')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p className="text-[#6ab86a] text-[11px] font-semibold">
        ✓ You're on the list — we'll notify you at launch.
      </p>
    )
  }

  return (
    <div>
      <p className="text-[#a09080] text-[11px] mb-2 leading-none">
        Get notified when Pro launches
      </p>
      <form onSubmit={handleSubmit} className="flex h-9">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading'}
          className="min-w-0 flex-1 px-3 text-[11px] outline-none"
          style={{
            background:   '#0a0c10',
            border:       '1px solid #c8a951',
            borderRight:  'none',
            borderRadius: '4px 0 0 4px',
            color:        '#e8e0d0',
            fontFamily:   'var(--font-inter)',
          }}
          onFocus={e => (e.target.style.borderColor = '#e0bb5a')}
          onBlur={e  => (e.target.style.borderColor = '#c8a951')}
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="flex-shrink-0 w-[28%] text-[10px] font-bold uppercase tracking-wider transition-all duration-150 disabled:opacity-50"
          style={{
            background:   '#c8a951',
            color:        '#0a0c10',
            border:       '1px solid #c8a951',
            borderRadius: '0 4px 4px 0',
            fontFamily:   'var(--font-rajdhani)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e0bb5a')}
          onMouseLeave={e => (e.currentTarget.style.background = '#c8a951')}
        >
          {status === 'loading' ? '…' : 'Notify me'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-[#8b1a1a] text-[10px] mt-1">{errMsg}</p>
      )}
    </div>
  )
}
