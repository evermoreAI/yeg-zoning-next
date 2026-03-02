import { verifySessionToken } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get('session')?.value

  if (sessionCookie) {
    const payload = verifySessionToken(sessionCookie)
    
    // Attach session to request headers for use in API routes
    const requestHeaders = new Headers(req.headers)
    if (payload) {
      requestHeaders.set('x-user-email', payload.email)
      requestHeaders.set('x-user-tier', payload.tier)
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
