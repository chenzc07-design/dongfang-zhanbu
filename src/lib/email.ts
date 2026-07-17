import { Resend } from 'resend';
import type { BaZiResult, BirthInfo } from './types';
import { generateBaZiReport } from './pdf';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

const FROM_EMAIL = process.env.EMAIL_FROM || '东方古老占卜 <reports@dongfang.com>';
const SUPPORT_EMAIL = process.env.EMAIL_SUPPORT || 'support@dongfang.com';

export async function sendBaZiReport(
  toEmail: string,
  result: BaZiResult,
  birthInfo: BirthInfo,
  productTier: string,
) {
  // 生成 PDF
  console.log(`Generating PDF report for ${toEmail}...`);
  const pdfBytes = await generateBaZiReport(result, birthInfo);

  const productNames: Record<string, string> = {
    full: 'Complete BaZi Reading',
    premium: 'Premium BaZi Bundle',
  };

  const productName = productNames[productTier] || 'BaZi Reading';

  console.log(`Sending email to ${toEmail}...`);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [toEmail],
    subject: `✨ Your ${productName} from 东方古老占卜 is ready!`,
    html: getEmailHtml(result, productName, birthInfo),
    attachments: [
      {
        filename: `dongfang-bazi-report-${birthInfo.year}.pdf`,
        content: Buffer.from(pdfBytes).toString('base64'),
      },
    ],
  });

  if (error) {
    console.error('Email send failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log('Email sent successfully, id:', data?.id);
  return data;
}

function getEmailHtml(result: BaZiResult, productName: string, birthInfo: BirthInfo): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a237e,#283593);padding:40px 30px;text-align:center;">
              <h1 style="color:#ffd54f;font-size:28px;margin:0;">东方古老占卜</h1>
              <p style="color:#ffffff;font-size:14px;margin:8px 0 0;opacity:0.8;">Ancient Eastern Divination</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:30px;">
              <h2 style="color:#1a237e;font-size:20px;margin:0 0 16px;">✨ Your report is ready!</h2>
              
              <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 20px;">
                Thank you for your purchase. Your personalized <strong>${productName}</strong> is attached to this email.
              </p>

              <!-- Result Preview -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9ff;border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding:0 8px 12px 0;">
                          <p style="color:#888;font-size:11px;margin:0 0 4px;text-transform:uppercase;">Day Master</p>
                          <p style="color:#1a237e;font-size:18px;font-weight:bold;margin:0;">${result.dayMaster}</p>
                        </td>
                        <td width="50%" style="padding:0 0 12px 8px;">
                          <p style="color:#888;font-size:11px;margin:0 0 4px;text-transform:uppercase;">Lucky Element</p>
                          <p style="color:#e65100;font-size:18px;font-weight:bold;margin:0;">${result.luckyElement}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 8px 0 0;">
                          <p style="color:#888;font-size:11px;margin:0 0 4px;text-transform:uppercase;">Birth Date</p>
                          <p style="color:#333;font-size:14px;margin:0;">${birthInfo.year}-${String(birthInfo.month).padStart(2,'0')}-${String(birthInfo.day).padStart(2,'0')}</p>
                        </td>
                        <td style="padding:0 0 0 8px;">
                          <p style="color:#888;font-size:11px;margin:0 0 4px;text-transform:uppercase;">Location</p>
                          <p style="color:#333;font-size:14px;margin:0;">${birthInfo.city}, ${birthInfo.country}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 16px;">
                The PDF attached includes your complete BaZi chart, element analysis, 
                personality profile, career and relationship insights, and lucky element recommendations.
              </p>

              <p style="color:#888;font-size:13px;line-height:1.5;margin:0 0 24px;">
                <strong>💡 Tip:</strong> Print it out or keep it on your phone — your element profile 
                changes yearly, and this report serves as your personal reference guide.
              </p>

              <div style="text-align:center;padding:20px 0;border-top:1px solid #eee;">
                <p style="color:#888;font-size:12px;margin:0;">
                  Questions? Reply to this email or contact us at 
                  <a href="mailto:${SUPPORT_EMAIL}" style="color:#283593;">${SUPPORT_EMAIL}</a>
                </p>
                <p style="color:#bbb;font-size:11px;margin:8px 0 0;">
                  东方古老占卜 · Ancient Eastern Divination
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
