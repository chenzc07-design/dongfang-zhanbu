import { Resend } from 'resend';
import type { BaZiResult, BirthInfo } from './types';
import { generateBaZiReport } from './pdf';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

const FROM_EMAIL = process.env.EMAIL_FROM || '东方古老占卜 <reports@dongfang.com>';
const SUPPORT_EMAIL = process.env.EMAIL_SUPPORT || 'support@dongfang.com';
// 老板邮箱 — 收通知、日报、告警
const OWNER_EMAIL = process.env.OWNER_EMAIL || process.env.EMAIL_SUPPORT || 'support@dongfang.com';

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

  // 🎉 老板通知：每卖出一单，发邮件通知你
  await sendOwnerSaleAlert(toEmail, productName, result, birthInfo);

  return data;
}

// ============================================================
// 📢 老板通知系统
// ============================================================

/**
 * 售出通知 — 每卖出一单立刻通知老板
 */
async function sendOwnerSaleAlert(
  customerEmail: string,
  productName: string,
  result: BaZiResult,
  birthInfo: BirthInfo,
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      subject: `💰 新订单! ${productName} — ${customerEmail}`,
      html: getOwnerSaleHtml(customerEmail, productName, result, birthInfo),
    });
    console.log(`📢 Owner sale alert sent to ${OWNER_EMAIL}`);
  } catch (err: any) {
    console.error('Failed to send owner sale alert:', err.message);
    // 不抛异常，不能影响主流程
  }
}

/**
 * 故障告警 — 系统出错时立刻通知老板
 */
export async function sendOwnerErrorAlert(
  errorType: string,
  errorMessage: string,
  context: Record<string, any> = {},
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      subject: `🚨 系统告警: ${errorType}`,
      html: getOwnerErrorHtml(errorType, errorMessage, context),
    });
    console.log(`🚨 Error alert sent to ${OWNER_EMAIL}`);
  } catch (err: any) {
    console.error('Failed to send error alert:', err.message);
  }
}

/**
 * 每日销售汇总
 */
export async function sendDailySummary(orders: OrderSummary[]) {
  if (orders.length === 0) return; // 没订单就不发

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai',
  });

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      subject: `📊 每日销售汇总 — ${today} | 收入 $${totalRevenue.toFixed(2)}`,
      html: getDailySummaryHtml(orders, totalRevenue, today),
    });
    console.log(`📊 Daily summary sent to ${OWNER_EMAIL}`);
  } catch (err: any) {
    console.error('Failed to send daily summary:', err.message);
  }
}

export interface OrderSummary {
  customerEmail: string;
  productName: string;
  amount: number;
  time: string;
  birthInfo: BirthInfo;
}

// ============================================================
// 通知邮件模板
// ============================================================

function getOwnerSaleHtml(
  customerEmail: string,
  productName: string,
  result: BaZiResult,
  birthInfo: BirthInfo,
): string {
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 20px;">
<table width="500" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
<tr><td style="background:linear-gradient(135deg,#1a237e,#283593);padding:24px 30px;text-align:center;">
<h1 style="color:#ffd54f;font-size:22px;margin:0;">💰 新订单通知</h1>
<p style="color:#fff;font-size:12px;margin:4px 0 0;opacity:0.8;">${now}</p>
</td></tr>
<tr><td style="padding:24px 30px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
<span style="color:#888;font-size:12px;">客户邮箱</span><br>
<span style="color:#333;font-size:15px;font-weight:bold;">${customerEmail}</span>
</td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
<span style="color:#888;font-size:12px;">购买产品</span><br>
<span style="color:#1a237e;font-size:15px;font-weight:bold;">${productName}</span>
</td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
<span style="color:#888;font-size:12px;">客户生日</span><br>
<span style="color:#333;font-size:14px;">${birthInfo.year}-${String(birthInfo.month).padStart(2,'0')}-${String(birthInfo.day).padStart(2,'0')} | ${birthInfo.city}, ${birthInfo.country}</span>
</td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
<span style="color:#888;font-size:12px;">日主 / 幸运元素</span><br>
<span style="color:#e65100;font-size:14px;font-weight:bold;">${result.dayMaster} / ${result.luckyElement}</span>
</td></tr>
<tr><td style="padding:12px 0 0;">
<div style="background:#e8f5e9;padding:12px;border-radius:8px;text-align:center;">
<span style="color:#2e7d32;font-size:13px;">✅ 报告已自动发送给客户</span>
</div>
</td></tr>
</table>
<p style="color:#bbb;font-size:11px;margin:16px 0 0;text-align:center;">东方古老占卜 · 自动化通知</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function getOwnerErrorHtml(
  errorType: string,
  errorMessage: string,
  context: Record<string, any>,
): string {
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const contextJson = JSON.stringify(context, null, 2);
  return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 20px;">
<table width="500" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
<tr><td style="background:linear-gradient(135deg,#b71c1c,#c62828);padding:24px 30px;text-align:center;">
<h1 style="color:#fff;font-size:20px;margin:0;">🚨 系统告警</h1>
<p style="color:#ffcdd2;font-size:12px;margin:4px 0 0;">${now}</p>
</td></tr>
<tr><td style="padding:24px 30px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
<span style="color:#888;font-size:12px;">错误类型</span><br>
<span style="color:#b71c1c;font-size:16px;font-weight:bold;">${errorType}</span>
</td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">
<span style="color:#888;font-size:12px;">错误详情</span><br>
<span style="color:#333;font-size:14px;">${errorMessage}</span>
</td></tr>
<tr><td style="padding:8px 0;">
<span style="color:#888;font-size:12px;">上下文信息</span><br>
<pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:12px;overflow-x:auto;margin:8px 0 0;">${contextJson}</pre>
</td></tr>
</table>
<p style="color:#bbb;font-size:11px;margin:16px 0 0;text-align:center;">东方古老占卜 · 自动监控系统</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function getDailySummaryHtml(orders: OrderSummary[], total: number, today: string): string {
  const rows = orders.map((o, i) => `
<tr>
<td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555;">${i + 1}</td>
<td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;">${o.customerEmail}</td>
<td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#1a237e;">${o.productName}</td>
<td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#2e7d32;text-align:right;">$${o.amount.toFixed(2)}</td>
</tr>`).join('');

  return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 20px;">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
<tr><td style="background:linear-gradient(135deg,#1a237e,#283593);padding:24px 30px;text-align:center;">
<h1 style="color:#ffd54f;font-size:20px;margin:0;">📊 每日销售汇总</h1>
<p style="color:#fff;font-size:12px;margin:4px 0 0;opacity:0.8;">${today}</p>
</td></tr>
<tr><td style="padding:24px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
<tr style="background:#f8f9ff;">
<td style="padding:8px 12px;font-size:12px;color:#888;text-transform:uppercase;">#</td>
<td style="padding:8px 12px;font-size:12px;color:#888;text-transform:uppercase;">客户</td>
<td style="padding:8px 12px;font-size:12px;color:#888;text-transform:uppercase;">产品</td>
<td style="padding:8px 12px;font-size:12px;color:#888;text-transform:uppercase;text-align:right;">金额</td>
</tr>
${rows}
</table>
<div style="background:#e8f5e9;padding:16px;border-radius:8px;text-align:center;">
<span style="color:#888;font-size:12px;">今日总订单 ${orders.length} 笔</span><br>
<span style="color:#2e7d32;font-size:24px;font-weight:bold;">$${total.toFixed(2)}</span>
</div>
<p style="color:#bbb;font-size:11px;margin:16px 0 0;text-align:center;">东方古老占卜 · 自动化日报</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
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
