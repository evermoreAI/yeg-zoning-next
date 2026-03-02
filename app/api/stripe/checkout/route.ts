import { stripe } from '@/lib/stripe'
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
      console.error(`Missing price ID for tier: ${tier}`)
      return NextResponse.json(
        { error: 'Subscription unavailable' },
        { status: 500 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/cancel`,
      billing_address_collection: 'required',
      customer_creation: 'always',
    })

    return NextResponse.json(
      { url: session.url },
      { status: 200 }
    )
  } catch (error) {
    console.error('[stripe/checkout]', error)
    return NextResponse.json(
      { error: 'Checkout failed. Please try again.' },
      { status: 500 }
    )
  }
}
