import { NextRequest, NextResponse } from 'next/server';
import { calculateBaZi } from '@/lib/bazi';
import { sendBaZiReport, sendOwnerErrorAlert } from '@/lib/email';
import crypto from 'crypto';

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || '';

/**
 * Paddle webhook 处理
 * POST /api/paddle/webhook
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('paddle-signature') || '';

    // 验证签名（如果设置了 secret）
    if (PADDLE_WEBHOOK_SECRET) {
      const tsMatch = signature.match(/ts=([^;]+)/);
      const h1Match = signature.match(/h1=([^;]+)/);

      if (!tsMatch || !h1Match) {
        return NextResponse.json({ error: 'Missing signature parts' }, { status: 400 });
      }

      const ts = tsMatch[1];
      const h1 = h1Match[1];

      const signedPayload = `${ts}:${body}`;
      const expectedH1 = crypto
        .createHmac('sha256', PADDLE_WEBHOOK_SECRET)
        .update(signedPayload)
        .digest('hex');

      if (h1 !== expectedH1) {
        console.error('Paddle webhook signature mismatch');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const data = JSON.parse(body);
    const eventType = data.event_type;
    const eventData = data.data;

    console.log(`Paddle webhook: ${eventType}`);

    // 只处理 transaction.completed
    if (eventType !== 'transaction.completed') {
      return NextResponse.json({ received: true, ignored: eventType });
    }

    // 提取 custom_data
    const customData = eventData.custom_data || {};
    const { tier, birthData, customerEmail } = customData;

    if (!birthData) {
      await sendOwnerErrorAlert(
        'Paddle订单数据缺失',
        `Paddle transaction ${eventData.id} 缺少 birthData`,
        { transactionId: eventData.id },
      );
      return NextResponse.json({ received: true, warning: 'Missing birthData' });
    }

    const { year, month, day, hour, minute, country, city } = birthData;
    const finalEmail = customerEmail || eventData.customer?.email;

    // 算八字 + 生成 PDF + 发邮件
    try {
      const result = calculateBaZi(
        Number(year), Number(month), Number(day),
        Number(hour || 12), Number(minute || 0),
        country || 'Unknown',
      );

      await sendBaZiReport(
        finalEmail,
        result,
        {
          year: Number(year), month: Number(month), day: Number(day),
          hour: Number(hour || 12), minute: Number(minute || 0),
          country: country || '', city: city || '',
          email: finalEmail,
        },
        tier || 'full',
      );

      console.log(`✅ Report sent to ${finalEmail} (Paddle ${eventData.id})`);
    } catch (err: any) {
      console.error('Failed to generate/send report:', err);
      await sendOwnerErrorAlert(
        '报告生成/发送失败 (Paddle)',
        err.message,
        { transactionId: eventData.id, email: finalEmail, tier },
      );
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Paddle webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
