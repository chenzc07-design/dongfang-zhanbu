import { NextRequest, NextResponse } from 'next/server';
import { calculateBaZi } from '@/lib/bazi';
import { sendBaZiReport, sendOwnerErrorAlert } from '@/lib/email';

const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const captureRes = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      },
    );

    const captureData = await captureRes.json();

    if (captureData.status !== 'COMPLETED') {
      console.error('PayPal capture not completed:', captureData);
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const purchaseUnit = captureData.purchase_units?.[0];
    const customId = purchaseUnit?.custom_id;

    if (!customId) {
      await sendOwnerErrorAlert(
        'PayPal订单数据缺失',
        `PayPal order ${orderId} 缺少 custom_id`,
        { orderId },
      );
      return NextResponse.json({ received: true, warning: 'Missing custom_id' });
    }

    const meta = JSON.parse(customId);
    const { tier, birthData, customerEmail } = meta;
    const { year, month, day, hour, minute, country, city } = birthData;

    try {
      const result = calculateBaZi(
        Number(year), Number(month), Number(day),
        Number(hour || 12), Number(minute || 0),
        country || 'Unknown',
      );

      await sendBaZiReport(
        customerEmail || captureData.payer?.email_address,
        result,
        {
          year: Number(year), month: Number(month), day: Number(day),
          hour: Number(hour || 12), minute: Number(minute || 0),
          country: country || '', city: city || '',
          email: customerEmail || captureData.payer?.email_address,
        },
        tier || 'full',
      );

      return NextResponse.json({
        success: true,
        orderId,
        amount: purchaseUnit?.payments?.captures?.[0]?.amount?.value,
        email: customerEmail,
      });
    } catch (err: any) {
      console.error('Failed to generate/send report:', err);
      await sendOwnerErrorAlert(
        '报告生成/发送失败 (PayPal)',
        err.message,
        { orderId, email: customerEmail, tier },
      );
      return NextResponse.json({ received: true, error: err.message });
    }
  } catch (err: any) {
    console.error('PayPal capture error:', err);
    return NextResponse.json({ error: err.message || 'Capture failed' }, { status: 500 });
  }
}
