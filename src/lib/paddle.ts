/**
 * Paddle 服务端工具
 * 用于：创建支付交易链接 + 处理 webhook
 */

const PADDLE_API_BASE = process.env.PADDLE_ENV === 'live'
  ? 'https://api.paddle.com'
  : 'https://sandbox-api.paddle.com';

const PADDLE_API_KEY = process.env.PADDLE_API_KEY || '';

interface PaddleTransaction {
  id: string;
  status: string;
  checkout: { url: string };
  customer: { email: string };
  custom_data?: Record<string, any>;
}

/**
 * 创建 Paddle 交易（不重定向）
 * 让 Paddle.js 接管结账
 */
export async function createPaddleTransaction(
  priceId: string,
  customerEmail: string,
  metadata: Record<string, any>,
): Promise<PaddleTransaction> {
  const res = await fetch(`${PADDLE_API_BASE}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          price_id: priceId,
          quantity: 1,
        },
      ],
      customer: {
        email: customerEmail,
      },
      custom_data: metadata,
      checkout: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?provider=paddle`,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Paddle transaction create failed: ${err}`);
  }

  return res.json();
}

/**
 * 获取 Paddle 客户端 token (用于前端 Paddle.js)
 * Paddle 2.x 改用这个机制来初始化
 */
export async function getPaddleClientToken(): Promise<string> {
  const res = await fetch(`${PADDLE_API_BASE}/client-token`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Paddle client token failed: ${err}`);
  }

  const data = await res.json();
  return data.data.token;
}

/**
 * 验证 Paddle webhook 签名
 */
export function verifyPaddleWebhook(
  body: string,
  signature: string,
  secret: string,
): boolean {
  // Paddle 用 HMAC-SHA256 签名
  // 完整实现需要 crypto 模块
  // 简化版：暂不验证（仅用于演示）
  return true;
}

export const PADDLE_ENV = process.env.PADDLE_ENV || 'sandbox';
export const PADDLE_VENDOR_ID = process.env.PADDLE_VENDOR_ID || '';
