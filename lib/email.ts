import { Resend } from 'resend'

export async function sendStampEmail(
  to: string,
  claimUrl: string,
  storeName: string,
  stampCount: number,
  expiryMinutes: number = 30
) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log(
      `[DEV EMAIL SIMULATION] To: ${to} | Store: ${storeName} | Stamp count: ${stampCount} | Link: ${claimUrl}`
    )
    return { success: true, simulated: true }
  }

  const resend = new Resend(apiKey)

  const stampText = stampCount > 1 ? `${stampCount} new stamps` : '1 new stamp'

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Cop Stamp <noreply@lajuq.my>',
    to,
    subject: `+${stampCount} stamp from ${storeName}`,
    text: `You received ${stampText} from ${storeName}.\n\nClaim your stamp here: ${claimUrl}\n\nExpires in: ${expiryMinutes}m`,
    html: `
      <div style="background-color: #4F46E5; background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0), linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #8B5CF6 100%); background-size: 24px 24px, 100% 100%; padding: 48px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 440px; background-color: #FFFFFF; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.25); padding: 38px 28px; text-align: center;">
          <tr>
            <td>
              <p style="font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #6366F1; margin: 0 0 10px 0;">
                ${storeName}
              </p>
              
              <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0; letter-spacing: -0.02em;">
                You've received ${stampText}
              </h1>
              
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 28px 0;">
                Click below to add it directly to your card. No password or code required.
              </p>
              
              <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #4F46E5, #7C3AED); box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">
                    <a href="${claimUrl}" target="_blank" style="font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; padding: 14px 32px; display: inline-block; border-radius: 12px;">
                      Claim Stamp Now
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="font-size: 12px; font-weight: 700; color: #DC2626; margin: 0; letter-spacing: 0.02em;">
                Expires in: ${expiryMinutes}m
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending email via Resend:', error)
    throw new Error(error.message)
  }

  return { success: true, data }
}