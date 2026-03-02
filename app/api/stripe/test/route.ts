import { getStripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sk = process.env.STRIPE_SECRET_KEY
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    const proPriceId = process.env.STRIPE_PRO_PRICE_ID
    const investorPriceId = process.env.STRIPE_INVESTOR_PRICE_ID
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    return NextResponse.json({
      stripe_secret_key: sk ? `${sk.substring(0, 20)}...${sk.substring(sk.length - 10)}` : 'NOT SET',
      stripe_publishable_key: pk ? `${pk.substring(0, 20)}...${pk.substring(pk.length - 10)}` : 'NOT SET',
      stripe_pro_price_id: proPriceId || 'NOT SET',
      stripe_investor_price_id: investorPriceId || 'NOT SET',
      next_public_app_url: appUrl || 'NOT SET',
      stripe_keys_loaded: !!(sk && pk),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
