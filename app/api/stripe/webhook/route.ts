import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createOrUpdateUser } from '@/lib/db'
import { generateMagicLinkToken } from '@/lib/auth'
import { sendMagicLinkEmail } from '@/lib/emails'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  console.log('WEBHOOK HIT - signature present:', !!signature)
  console.log('WEBHOOK SECRET present:', !!process.env.STRIPE_WEBHOOK_SECRET)

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log('WEBHOOK EVENT:', event.type)
  } catch (err: any) {
    console.error('SIGNATURE FAILED:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const email = session.metadata?.email || session.customer_details?.email
    const tier = session.metadata?.tier || 'pro'
    const customerId = session.customer
    const subscriptionId = session.subscription

    console.log('CHECKOUT COMPLETE - email:', email, 'tier:', tier)

    try {
      let expiry = new Date()
      expiry.setDate(expiry.getDate() + 30)

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        expiry = new Date((subscription as any).current_period_end * 1000)
      }

      await createOrUpdateUser(email, tier, customerId, expiry)
      console.log('DB: User saved')

      const token = generateMagicLinkToken(email, tier)
      const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/magic-link?token=${token}&email=${encodeURIComponent(email)}`

      await sendMagicLinkEmail(email, magicLink, tier)
      console.log('EMAIL: Magic link sent to', email)
    } catch (err: any) {
      console.error('WEBHOOK PROCESSING ERROR:', err.message)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any
    const customerId = subscription.customer

    console.log('SUBSCRIPTION CANCELLED - customer:', customerId)
  }

  return NextResponse.json({ received: true })
}
