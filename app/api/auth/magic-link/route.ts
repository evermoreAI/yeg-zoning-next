import { verifyMagicLinkToken, generateSessionToken } from '@/lib/auth'
import { getUserByEmail } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Missing token or email' },
        { status: 400 }
      )
    }

    // Verify token
    const payload = verifyMagicLinkToken(token)
    if (!payload || payload.email !== email) {
      return NextResponse.json(
        { error: 'Invalid or expired magic link' },
        { status: 401 }
      )
    }

    // Get user tier from database
    const user = await getUserByEmail(email)
    const tier = user?.tier || 'free'

    // Generate session token
    const sessionToken = generateSessionToken(email, tier)

    // Set secure cookie (30 days)
    const response = NextResponse.redirect(new URL('/map', req.url))
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: '/',
    })

    console.log('[magic-link] Session set for:', email, 'tier:', tier)
    return response
  } catch (error) {
    console.error('[magic-link] Error:', error)
    return NextResponse.json(
      { error: 'Magic link verification failed' },
      { status: 500 }
    )
  }
}
