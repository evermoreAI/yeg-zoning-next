import { getStripe } from '@/lib/stripe'
import { createOrUpdateUser, downgradeUserToFree, getUserByStripeCustomerId } from '@/lib/db'
import { generateMagicLinkToken } from '@/lib/auth'
import { sendMagicLinkEmail, sendSubscriptionCancelledEmail } from '@/lib/emails'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error('[webhook] Signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('WEBHOOK: Event received:', event.type)
        
        const session = event.data.object as Stripe.Checkout.Session
        const email = session.customer_email
        const tier = (session.metadata?.tier || 'pro') as string
        const customerId = session.customer as string

        console.log('WEBHOOK: Session email:', email)
        console.log('WEBHOOK: Metadata:', session.metadata)
        console.log('WEBHOOK: Customer ID:', customerId)

        if (!email || !customerId) {
          console.error('[webhook] Missing email or customer ID')
          break
        }

        // Get subscription details for expiry
        const stripe = getStripe()
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          limit: 1,
        })

        let subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default to 30 days
        if (subscriptions.data[0]) {
          const sub = subscriptions.data[0] as any
          if (sub.current_period_end) {
            subscriptionExpiry = new Date(sub.current_period_end * 1000)
          }
        }

        // Save user to database
        try {
          await createOrUpdateUser(email, tier, customerId, subscriptionExpiry)
          console.log('DB: User saved successfully:', email, tier)
        } catch (dbError: any) {
          console.error('DB ERROR:', dbError.message)
          console.error('DB ERROR STACK:', dbError.stack)
          throw dbError
        }

        // Send magic link email
        try {
          const magicToken = generateMagicLinkToken(email)
          console.log('MAGIC LINK: Generated successfully for:', email)
          
          const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/magic-link?token=${magicToken}&email=${encodeURIComponent(email)}`
          console.log('MAGIC LINK: Full URL:', magicLink)
          
          await sendMagicLinkEmail(email, magicLink)
          console.log('RESEND: Email sent successfully to:', email)
        } catch (emailError: any) {
          console.error('EMAIL ERROR:', emailError.message)
          console.error('EMAIL ERROR STACK:', emailError.stack)
          throw emailError
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        if (!customerId) {
          console.error('[webhook] Missing customer ID in subscription deletion')
          break
        }

        // Find user with this customer ID and downgrade to free
        const user = await getUserByStripeCustomerId(customerId)
        if (user) {
          await downgradeUserToFree(user.email)
          await sendSubscriptionCancelledEmail(user.email)
          console.log('[webhook] User downgraded to free and email sent:', user.email)
        }

        break
      }

      default:
        console.log('[webhook] Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[webhook] Error processing event:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
