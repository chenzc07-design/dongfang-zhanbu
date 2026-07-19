import { NextRequest, NextResponse } from 'next/server';

const PADDLE_API_KEY = process.env.PADDLE_API_KEY || '';
const PADDLE_ENV = process.env.PADDLE_ENV || 'sandbox';

const API_BASE = PADDLE_ENV === 'live'
  ? 'https://api.paddle.com'
  : 'https://sandbox-api.paddle.com';

/**
 * 创建 Paddle 结账链接（服务端 → 返回 URL → 前端跳转）
 * POST /api/paddle/checkout
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, email, tier, birthData } = body;

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }

    console.log('[Paddle Checkout] Creating transaction:', { priceId, email, tier });

    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        customer: { email: email || 'customer@example.com' },
        custom_data: {
          tier: tier || 'full',
          birthData: birthData || {},
          customerEmail: email || '',
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Paddle Checkout] API error:', JSON.stringify(data));
      return NextResponse.json({
        error: 'Paddle transaction creation failed',
        detail: data,
      }, { status: 502 });
    }

    const checkoutUrl = data?.data?.checkout?.url;
    if (!checkoutUrl) {
      console.error('[Paddle Checkout] No checkout URL in response:', JSON.stringify(data));
      return NextResponse.json({
        error: 'No checkout URL returned',
        detail: data,
      }, { status: 502 });
    }

    console.log('[Paddle Checkout] Success, URL:', checkoutUrl);
    return NextResponse.json({ url: checkoutUrl });

  } catch (err: any) {
    console.error('[Paddle Checkout] Exception:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
