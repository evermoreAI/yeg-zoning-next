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

  const key     = process.env.RESEND_API_KEY
  // NOTIFY_EMAIL: owner address verified with Resend (set in Vercel env vars)
  // Until a custom domain is verified, Resend free tier only sends to this address.
  const notifyTo = process.env.NOTIFY_EMAIL ?? 'connordochuk99@gmail.com'

  console.log('[subscribe] Resend key present:', !!key, '| signup email:', email)

  // Always log signup — this is the source of truth regardless of email path
  console.log(`[YEG_SIGNUP] ${new Date().toISOString()} | ${email}`)

  if (key) {
    // Send notification to owner — contains the signup email in subject
    // When a domain is verified: change `to` to [email] to send to the user directly
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from:    'YEG Zoning <onboarding@resend.dev>',
        to:      [notifyTo],
        subject: `[YEG Signup] ${email}`,
        html:    `<p>New early-access signup: <strong>${email}</strong></p>
                  <p>Time: ${new Date().toISOString()}</p>`,
      }),
    })
    if (!r.ok) {
      const errBody = await r.text()
      console.error('[subscribe] Resend error:', errBody)
      // Still return ok:true — signup is logged even if notification fails
    }
  }
  return NextResponse.json({ ok: true })
}
