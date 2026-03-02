import jwt from 'jsonwebtoken'

const SECRET = process.env.MAGIC_LINK_SECRET || 'your-secret-key-min-32-chars-long!'

export interface MagicLinkPayload {
  email: string
  iat: number
  exp: number
}

export function generateMagicLinkToken(email: string): string {
  const payload: MagicLinkPayload = {
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  }
  return jwt.sign(payload, SECRET, { algorithm: 'HS256' })
}

export function verifyMagicLinkToken(token: string): MagicLinkPayload | null {
  try {
    const payload = jwt.verify(token, SECRET, { algorithms: ['HS256'] })
    return payload as MagicLinkPayload
  } catch (error) {
    console.error('[auth] Token verification failed:', error)
    return null
  }
}

export interface SessionPayload {
  email: string
  tier: 'free' | 'pro' | 'investor'
  exp: number
}

export function generateSessionToken(email: string, tier: string): string {
  const payload: SessionPayload = {
    email,
    tier: tier as 'free' | 'pro' | 'investor',
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
  }
  return jwt.sign(payload, SECRET, { algorithm: 'HS256' })
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const payload = jwt.verify(token, SECRET, { algorithms: ['HS256'] })
    return payload as SessionPayload
  } catch (error) {
    return null
  }
}
