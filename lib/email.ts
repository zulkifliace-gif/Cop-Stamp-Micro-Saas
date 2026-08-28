import { Resend } from 'resend'

export async function sendStampEmail(
  to: string,
  claimUrl: string,
  storeName: string,
  stampCount: number
) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log(
      `[DEV EMAIL SIMULATION] To: ${to} | Store: ${storeName} | Stamp count: ${stampCount} | Link: ${claimUrl}`
    )
    return { success: true, simulated: true }
  }

  const resend = new Resend(apiKey)

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Cop Stamp <onboarding@resend.dev>',
    to,
    subject: `Cop stamp baharu dari ${storeName}! (+${stampCount} cop)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #F7EEDA; color: #1C2624; border-radius: 16px;">
        <h2 style="color: #0F2B2A; margin-top: 0;">Hai! Cop Stamp Baharu Untuk Anda</h2>
        <p style="font-size: 15px; line-height: 1.5;">
          Anda menerima <strong>${stampCount} cop</strong> dari <strong>${storeName}</strong>.
        </p>
        <div style="margin: 28px 0; text-align: center;">
          <a href="${claimUrl}" style="background: linear-gradient(180deg, #E7A33E, #C97F1F); color: #1C2624; text-decoration: none; padding: 14px 28px; font-weight: bold; border-radius: 12px; display: inline-block; font-size: 15px;">
            Terima Cop Sekarang
          </a>
        </div>
        <p style="font-size: 13px; color: #5B6B64;">
          Atau salin dan buka pautan ini di pelayar anda:<br>
          <a href="${claimUrl}" style="color: #1F5C52; word-break: break-all;">${claimUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px dashed #E2CE9E; margin: 20px 0;" />
        <p style="font-size: 12px; color: #B23A2E; margin-bottom: 0;">
          ⚠️ Pautan ini sah selama <strong>15 minit sahaja</strong>.
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending email via Resend:', error)
    throw new Error(error.message)
  }

  return { success: true, data }
}
