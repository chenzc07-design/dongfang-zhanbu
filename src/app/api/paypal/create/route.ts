import { NextRequest, NextResponse } from 'next/server';

interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{ rel: string; href: string }>;
}

const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

/**
 * 获取 PayPal Access Token
 */
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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal auth failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * 创建 PayPal 订单
 * POST /api/paypal/create
 * Body: { tier: 'full' | 'premium', customerEmail: string, birthData: {...} }
 */
export async function POST(req: NextRequest) {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.json({ error: 'PayPal not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { tier, customerEmail, birthData } = body;

    const pricing: Record<string, { name: string; price: number; description: string }> = {
      full: {
        name: 'Complete BaZi Reading',
        price: 1.00,
        description: 'TEST MODE — Complete BaZi Reading (normally $14.99)',
      },
      premium: {
        name: 'Premium BaZi Bundle',
        price: 1.00,
        description: 'TEST MODE — Premium BaZi Bundle (normally $34.99)',
      },
    };

    const product = pricing[tier] || pricing.full;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const accessToken = await getAccessToken();

    // 创建 PayPal Order
    const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `bazi_${tier}_${Date.now()}`,
            description: product.description,
            custom_id: JSON.stringify({
              tier,
              birthData,
              customerEmail,
            }),
            amount: {
              currency_code: 'USD',
              value: product.price.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: product.price.toFixed(2),
                },
              },
            },
            items: [
              {
                name: product.name,
                description: product.description,
                unit_amount: {
                  currency_code: 'USD',
                  value: product.price.toFixed(2),
                },
                quantity: '1',
                category: 'DIGITAL_GOODS',
              },
            ],
          },
        ],
        application_context: {
          brand_name: '东方古老占卜 · Ancient Eastern Divination',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: `${baseUrl}/success?provider=paypal`,
          cancel_url: `${baseUrl}/?canceled=true`,
        },
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.text();
      console.error('PayPal order create failed:', err);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const order: PayPalOrder = await orderRes.json();

    // 找到 approve 链接
    const approveLink = order.links.find((l) => l.rel === 'approve')?.href;

    return NextResponse.json({
      orderId: order.id,
      approveUrl: approveLink,
    });
  } catch (err: any) {
    console.error('PayPal create error:', err);
    return NextResponse.json({ error: err.message || 'PayPal error' }, { status: 500 });
  }
}
