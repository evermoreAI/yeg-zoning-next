import { verifySessionToken, SessionPayload } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value

    if (!sessionCookie) {
      return null
    }

    return verifySessionToken(sessionCookie)
  } catch (error) {
    console.error('[session] Error reading session:', error)
    return null
  }
}
