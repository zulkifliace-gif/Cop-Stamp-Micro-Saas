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

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Cop Stamp <noreply@lajuq.my>',
    to,
    subject: `+${stampCount} cop baharu dari ${storeName}`,
    text: `Anda menerima ${stampCount} cop dari ${storeName}.\n\nTuntut cop anda di sini: ${claimUrl}\n\nPautan ini sah selama ${expiryMinutes} minit sahaja.`,
    html: `
      <div style="font-family: -apple-system, 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 36px; background: #F7EEDA; color: #1C2624; border-radius: 20px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(180deg, #E7A33E, #C97F1F); display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
        </div>
        <p style="font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; color: #8A7A55; margin: 0 0 8px;">
          ${storeName}
        </p>
        <h1 style="font-size: 22px; color: #0F2B2A; margin: 0 0 16px; line-height: 1.3;">
          Anda menerima ${stampCount} cop baharu
        </h1>
        <p style="font-size: 15px; line-height: 1.6; color: #445048; margin: 0 0 32px;">
          Tekan butang di bawah untuk terus menuntut cop anda. Tiada log masuk atau kod diperlukan.
        </p>
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${claimUrl}" style="background: linear-gradient(180deg, #E7A33E, #C97F1F); color: #1C2624; text-decoration: none; padding: 15px 36px; font-weight: 700; border-radius: 12px; display: inline-block; font-size: 15px; box-shadow: 0 4px 14px rgba(201, 127, 31, 0.35);">
            Terima Cop Sekarang
          </a>
        </div>
        <p style="font-size: 12px; color: #8A7A55; text-align: center; margin: 0;">
          Pautan ini sah selama ${expiryMinutes} minit sahaja
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
