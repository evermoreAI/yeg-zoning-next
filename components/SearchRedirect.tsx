'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchRedirectProps {
  placeholder?: string
}

export default function SearchRedirect({ placeholder = 'Enter your Edmonton address…' }: SearchRedirectProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/?address=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
        style={{
          background:  '#0a0c10',
          border:      '1px solid #2a2e38',
          color:       '#e8e0d0',
          fontFamily:  'var(--font-inter)',
        }}
        onFocus={e => (e.target.style.borderColor = '#c8a951')}
        onBlur={e  => (e.target.style.borderColor = '#2a2e38')}
      />
      <button
        type="submit"
        disabled={!query.trim()}
        className="flex-shrink-0 px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-40"
        style={{ fontFamily: 'var(--font-rajdhani)', background: '#c8a951', color: '#0a0c10' }}
      >
        Search
      </button>
    </form>
  )
}
