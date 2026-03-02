import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMagicLinkEmail(
  email: string,
  magicLink: string
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Activate Your InfillIQ Account',
      html: `
        <h2>Welcome to InfillIQ</h2>
        <p>Click the link below to activate your account and start analyzing Edmonton properties.</p>
        <p><a href="${magicLink}" style="background: #c8a951; color: #0a0c10; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Activate Account</a></p>
        <p style="color: #666; font-size: 12px;">This link expires in 24 hours.</p>
      `,
    })
    console.log('[emails] Magic link sent to', email)
    return true
  } catch (error) {
    console.error('[emails] Magic link send failed:', error)
    return false
  }
}

export async function sendSubscriptionCancelledEmail(email: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your InfillIQ Subscription Has Ended',
      html: `
        <h2>InfillIQ Subscription Ended</h2>
        <p>Your InfillIQ Pro subscription has been cancelled.</p>
        <p>Your data is still saved. You can resubscribe anytime to restore full access.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background: #c8a951; color: #0a0c10; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Resubscribe Now</a></p>
      `,
    })
    console.log('[emails] Cancellation email sent to', email)
    return true
  } catch (error) {
    console.error('[emails] Cancellation email send failed:', error)
    return false
  }
}
