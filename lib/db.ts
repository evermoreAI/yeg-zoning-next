import { sql } from '@vercel/postgres'

export interface User {
  email: string
  tier: 'free' | 'pro' | 'investor'
  stripe_customer_id?: string | null
  subscription_expiry?: Date | null
  created_at: Date
}

export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'investor')),
        stripe_customer_id TEXT,
        subscription_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `
    console.log('[db] Schema initialized')
  } catch (error) {
    console.error('[db] Schema init error:', error)
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT email, tier, stripe_customer_id, subscription_expiry, created_at
      FROM users
      WHERE email = ${email}
    `
    if (!result.rows[0]) return null
    const row = result.rows[0] as any
    return {
      email: row.email,
      tier: row.tier as 'free' | 'pro' | 'investor',
      stripe_customer_id: row.stripe_customer_id,
      subscription_expiry: row.subscription_expiry ? new Date(row.subscription_expiry) : null,
      created_at: new Date(row.created_at),
    }
  } catch (error) {
    console.error('[db] getUserByEmail error:', error)
    return null
  }
}

export async function createOrUpdateUser(
  email: string,
  tier: string,
  stripe_customer_id: string,
  subscription_expiry: Date
): Promise<User | null> {
  try {
    const result = await sql`
      INSERT INTO users (email, tier, stripe_customer_id, subscription_expiry, created_at)
      VALUES (${email}, ${tier}, ${stripe_customer_id}, ${subscription_expiry.toISOString()}, NOW())
      ON CONFLICT (email) DO UPDATE
      SET tier = ${tier},
          stripe_customer_id = ${stripe_customer_id},
          subscription_expiry = ${subscription_expiry.toISOString()}
      RETURNING email, tier, stripe_customer_id, subscription_expiry, created_at
    `
    if (!result.rows[0]) return null
    const row = result.rows[0] as any
    return {
      email: row.email,
      tier: row.tier as 'free' | 'pro' | 'investor',
      stripe_customer_id: row.stripe_customer_id,
      subscription_expiry: row.subscription_expiry ? new Date(row.subscription_expiry) : null,
      created_at: new Date(row.created_at),
    }
  } catch (error) {
    console.error('[db] createOrUpdateUser error:', error)
    return null
  }
}

export async function downgradeUserToFree(email: string): Promise<User | null> {
  try {
    const result = await sql`
      UPDATE users
      SET tier = 'free', stripe_customer_id = NULL, subscription_expiry = NULL
      WHERE email = ${email}
      RETURNING email, tier, stripe_customer_id, subscription_expiry, created_at
    `
    if (!result.rows[0]) return null
    const row = result.rows[0] as any
    return {
      email: row.email,
      tier: row.tier as 'free' | 'pro' | 'investor',
      stripe_customer_id: row.stripe_customer_id,
      subscription_expiry: row.subscription_expiry ? new Date(row.subscription_expiry) : null,
      created_at: new Date(row.created_at),
    }
  } catch (error) {
    console.error('[db] downgradeUserToFree error:', error)
    return null
  }
}

export async function getUserByStripeCustomerId(customerId: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT email, tier, stripe_customer_id, subscription_expiry, created_at
      FROM users
      WHERE stripe_customer_id = ${customerId}
    `
    if (!result.rows[0]) return null
    const row = result.rows[0] as any
    return {
      email: row.email,
      tier: row.tier as 'free' | 'pro' | 'investor',
      stripe_customer_id: row.stripe_customer_id,
      subscription_expiry: row.subscription_expiry ? new Date(row.subscription_expiry) : null,
      created_at: new Date(row.created_at),
    }
  } catch (error) {
    console.error('[db] getUserByStripeCustomerId error:', error)
    return null
  }
}
