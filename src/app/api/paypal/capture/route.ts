import { NextRequest, NextResponse } from 'next/server';
import { calculateBaZi } from '@/lib/bazi';
import { sendBaZiReport, sendOwnerErrorAlert } from '@/lib/email';
import fs from 'fs';
import path from 'path';

const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const DELAY_HOURS = 24;

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

/** 读取 pending 订单列表 */
function getPendingOrders(): any[] {
  try {
    const filePath = '/tmp/pending-reports.json';
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch {}
  return [];
}

/** 写入 pending 订单 */
function savePendingOrders(orders: any[]) {
  fs.writeFileSync('/tmp/pending-reports.json', JSON.stringify(orders, null, 2));
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
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
      await sendOwnerErrorAlert('PayPal订单数据缺失', `PayPal order ${orderId} 缺少 custom_id`, { orderId });
      return NextResponse.json({ received: true, warning: 'Missing custom_id' });
    }

    const meta = JSON.parse(customId);
    const { tier, birthData, customerEmail } = meta;
    const { year, month, day, hour, minute, country, city } = birthData;

    // ✅ 24小时延迟发货：把订单存到队列，不立即发送
    const pendingOrder = {
      orderId,
      tier,
      email: customerEmail || captureData.payer?.email_address,
      birthData: {
        year: Number(year), month: Number(month), day: Number(day),
        hour: Number(hour || 12), minute: Number(minute || 0),
        country: country || '', city: city || '',
      },
      capturedAt: new Date().toISOString(),
      scheduledSendAt: new Date(Date.now() + DELAY_HOURS * 60 * 60 * 1000).toISOString(),
      sent: false,
    };

    const orders = getPendingOrders();
    orders.push(pendingOrder);
    savePendingOrders(orders);

    console.log(`⏳ Order ${orderId} captured. Report scheduled for ${pendingOrder.scheduledSendAt}`);

    return NextResponse.json({
      success: true,
      orderId,
      note: `Report will be sent within ${DELAY_HOURS} hours. Delivered to: ${customerEmail}`,
    });

  } catch (err: any) {
    console.error('PayPal capture error:', err);
    return NextResponse.json({ error: err.message || 'Capture failed' }, { status: 500 });
  }
}
