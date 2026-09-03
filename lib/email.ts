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

  // Resolve base app URL for unsubscribe
  let appUrl = 'https://lajuq.my'
  try {
    const parsed = new URL(claimUrl)
    appUrl = parsed.origin
  } catch {}

  const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(to)}&store=${encodeURIComponent(storeName)}`
  const subject = `${storeName}: +${stampCount} Cop Digital Telah Diterima`
  const currentYear = new Date().getFullYear()

  const plainText = `
${storeName} - Kad Cop Digital Anda

Hai! Terima kasih kerana mengunjungi ${storeName}.
Staf telah menghantar +${stampCount} cop stamp ke emel anda.

Tebus cop anda sekarang melalui pautan selamat di bawah:
${claimUrl}

Peringatan: Pautan ini sah selama ${expiryMinutes} minit sahaja.

--------------------------------------------------
Mengapa anda menerima emel ini?
Emel ini dihantar secara automatik berikutan transaksi anda di ${storeName} melalui platform LajuS.

Jika anda tidak meminta emel ini atau ingin berhenti menerima cop via emel:
Nyahlanggan di sini: ${unsubscribeUrl}

© ${currentYear} LajuS • Sistem Kad Cop Kesetiaan Digital
`.trim()

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ms">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0A1716; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      
      <!-- Hidden Preheader Text for Inbox Snippet -->
      <div style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
        Tebus +${stampCount} cop digital anda dari ${storeName}. Sah selama ${expiryMinutes} minit sahaja.
      </div>

      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0A1716; padding: 32px 16px;">
        <tr>
          <td align="center">
            
            <!-- Main Card Container -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #FFFFFF; border-radius: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); overflow: hidden; text-align: left;">
              
              <!-- Header Brand Bar -->
              <tr>
                <td style="padding: 24px 28px 12px 28px; border-bottom: 1px solid #F1F5F9;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td>
                        <span style="font-size: 14px; font-weight: 800; color: #1E5E53; letter-spacing: -0.02em;">
                          ⚡ LajuS
                        </span>
                      </td>
                      <td align="right">
                        <span style="display: inline-block; padding: 4px 10px; background-color: #FEF3C7; border: 1px solid #FDE68A; color: #92400E; font-size: 11px; font-weight: 700; border-radius: 9999px;">
                          ${storeName}
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 28px 28px 20px 28px;">
                  <h1 style="font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0; line-height: 1.3;">
                    +${stampCount} Cop Stamp Ditambah!
                  </h1>
                  
                  <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                    Terima kasih kerana mengunjungi <strong>${storeName}</strong>. Tekan butang di bawah untuk memasukkan cop ini terus ke dalam kad digital anda:
                  </p>

                  <!-- Big CTA Button -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <a href="${claimUrl}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background-color: #1E5E53; color: #FFFFFF; font-size: 15px; font-weight: 700; text-align: center; text-decoration: none; padding: 15px 24px; border-radius: 14px; box-shadow: 0 4px 14px rgba(30, 94, 83, 0.3);">
                          Tebus Cop Anda Sekarang →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Expiry & Security Notice -->
                  <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 14px; margin-bottom: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 12px; color: #B91C1C; font-weight: 700;">
                          ⏳ Pautan sah selama ${expiryMinutes} minit
                        </td>
                        <td align="right" style="font-size: 11px; color: #64748B;">
                          🔒 Tanpa Kata Laluan
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Fallback Link -->
                  <p style="font-size: 11.5px; line-height: 1.5; color: #94A3B8; margin: 0;">
                    Jika butang di atas tidak berfungsi, salin pautan ini ke pelayar web anda:<br>
                    <a href="${claimUrl}" target="_blank" style="color: #1E5E53; word-break: break-all; text-decoration: underline;">
                      ${claimUrl}
                    </a>
                  </p>
                </td>
              </tr>

              <!-- Anti-Spam Compliant Footer -->
              <tr>
                <td style="background-color: #F8FAFC; border-top: 1px solid #F1F5F9; padding: 22px 28px; text-align: center; font-size: 11.5px; color: #64748B; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;">
                    Anda menerima emel ini kerana anda meminta cop digital semasa transaksi di <strong>${storeName}</strong>.
                  </p>
                  <p style="margin: 0 0 12px 0;">
                    Jika anda tidak lagi ingin menerima emel cop daripada kedai ini, anda boleh 
                    <a href="${unsubscribeUrl}" target="_blank" style="color: #0F172A; font-weight: 600; text-decoration: underline;">
                      Nyahlanggan di sini (Unsubscribe)
                    </a>.
                  </p>
                  <p style="margin: 0; font-size: 10.5px; color: #94A3B8;">
                    © ${currentYear} LajuS • Platform Kad Cop Kesetiaan Digital. Hak cipta terpelihara.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'LajuS Kad Cop <noreply@lajuq.my>',
    replyTo: process.env.EMAIL_REPLY_TO || 'noreply@lajuq.my',
    to,
    subject,
    text: plainText,
    html: htmlContent,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      'X-Entity-Ref-ID': `lajus-claim-${Date.now()}`,
    },
  })

  if (error) {
    console.error('Error sending email via Resend:', error)
    throw new Error(error.message)
  }

  return { success: true, data }
}