import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    stripeInstance = new Stripe(key, {
      apiVersion: '2024-12-18.acacia' as any,
    })
  }
  return stripeInstance
}

export { getStripe }
