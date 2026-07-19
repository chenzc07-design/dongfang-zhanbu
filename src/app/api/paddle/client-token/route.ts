import { NextResponse } from 'next/server';
import { getPaddleClientToken, PADDLE_ENV } from '@/lib/paddle';

/**
 * 返回 Paddle 客户端配置（前端用）
 * GET /api/paddle/client-token
 */
export async function GET() {
  try {
    let clientToken = '';
    try {
      clientToken = await getPaddleClientToken();
    } catch (err: any) {
      // 如果 client-token API 还没开通，返回一个 placeholder
      console.warn('Paddle client token fetch failed:', err.message);
    }

    return NextResponse.json({
      clientToken,
      env: PADDLE_ENV,
      vendorId: process.env.PADDLE_VENDOR_ID || '',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
