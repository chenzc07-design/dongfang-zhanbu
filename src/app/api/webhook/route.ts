import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { calculateBaZi } from '@/lib/bazi';
import { sendBaZiReport, sendOwnerErrorAlert } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-03-31.basil' as any,
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig || '',
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;
    const birthDataRaw = session.metadata?.birthData;

    if (!email || !birthDataRaw) {
      console.error('Missing email or birthData in session', { email, birthDataRaw });
      await sendOwnerErrorAlert(
        '订单数据缺失',
        `Stripe session ${session.id} 缺少 email 或 birthData`,
        { sessionId: session.id, hasEmail: !!email, hasBirthData: !!birthDataRaw },
      );
      return NextResponse.json({ received: true, warning: 'Missing data for PDF generation' });
    }

    try {
      const birthData = JSON.parse(birthDataRaw);
      const { year, month, day, hour, minute, country, city } = birthData;

      // 计算八字
      const result = calculateBaZi(
        Number(year), Number(month), Number(day),
        Number(hour || 12), Number(minute || 0),
        country || 'Unknown',
      );

      // 生成 PDF 并发送邮件
      const tier = session.metadata?.tier || 'full';
      await sendBaZiReport(email, result, {
        year: Number(year), month: Number(month), day: Number(day),
        hour: Number(hour || 12), minute: Number(minute || 0),
        country: country || '', city: city || '',
        email,
      }, tier);

      console.log(`✅ Report sent to ${email}`);
    } catch (err: any) {
      console.error('Failed to generate/send report:', err);
      // 发送故障告警
      await sendOwnerErrorAlert(
        '报告生成/发送失败',
        err.message,
        { email, tier: session.metadata?.tier, sessionId: session.id },
      );
      // 不返回 500 —— Stripe 会重试 webhook
      return NextResponse.json({ received: true, error: err.message });
    }
  }

  return NextResponse.json({ received: true });
}
