import { getStripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { tier } = await req.json()

    if (!tier || !['pro', 'investor'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      )
    }

    const priceId = tier === 'pro'
      ? process.env.STRIPE_PRO_PRICE_ID
      : process.env.STRIPE_INVESTOR_PRICE_ID

    if (!priceId) {
      return NextResponse.json(
        { error: 'Subscription unavailable' },
        { status: 500 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    const stripe = getStripe()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/stripe/cancel`,
      billing_address_collection: 'required',
    })

    return NextResponse.json(
      { url: session.url },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('STRIPE FULL ERROR:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      {
        error: error.message,
        type: error?.type,
        code: error?.code,
        param: error?.param,
        decline_code: error?.decline_code,
      },
      { status: 500 }
    )
  }
}
