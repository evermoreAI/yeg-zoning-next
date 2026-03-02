import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json()

    if (!customerId) {
      return NextResponse.json(
        { error: 'Missing customerId' },
        { status: 400 }
      )
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/map`,
    })

    return NextResponse.json(
      { url: portalSession.url },
      { status: 200 }
    )
  } catch (error) {
    console.error('[stripe/portal]', error)
    return NextResponse.json(
      { error: 'Portal creation failed' },
      { status: 500 }
    )
  }
}
