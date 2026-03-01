/**
 * POST { email: string } — early-access email capture.
 * Sends via Resend if RESEND_API_KEY is set, otherwise logs to Vercel dashboard.
 */
import { NextRequest, NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: { email?: string }
  try { body = await req.json() } catch { body = {} }
  const email = (body.email ?? '').trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email))
    return NextResponse.json({ ok: false, error: 'Valid email required.' }, { status: 400 })

  const key = process.env.RESEND_API_KEY
  console.log('[subscribe] Resend key present:', !!key)
  if (key) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'YEG Zoning <onboarding@resend.dev>',
        to: [email],
        subject: "You're on the list — YEG Zoning Pro",
        html: '<p>Thanks for signing up — we\'ll notify you when Pro launches.</p><p>— YEG Zoning Command Center</p>',
      }),
    })
    if (!r.ok) {
      console.error('[subscribe] Resend error:', await r.text())
      return NextResponse.json({ ok: false, error: 'Email send failed.' }, { status: 500 })
    }
  } else {
    // No key: log email to Vercel dashboard logs (visible under Functions > subscribe)
    console.log(`[YEG_SIGNUP] ${new Date().toISOString()} | ${email}`)
  }
  return NextResponse.json({ ok: true })
}
