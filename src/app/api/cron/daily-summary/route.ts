import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendDailySummary, sendOwnerErrorAlert, type OrderSummary } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil' as any,
});

const CRON_SECRET = process.env.CRON_SECRET || '';

/**
 * 每日销售汇总 API
 * 用 Vercel Cron Jobs 或外部 cron 服务每天定时调用
 * 调用方式: GET /api/cron/daily-summary?secret=CRON_SECRET
 */
export async function GET(req: NextRequest) {
  // 安全检查：防止外人调用
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');
  if (!secret || secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 查询今天（北京时间）的所有支付成功的订单
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    // 北京时间比 UTC 早 8 小时，所以 UTC 的 start 要减 8 小时
    startOfDay.setHours(startOfDay.getHours() - 8);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: {
        gte: Math.floor(startOfDay.getTime() / 1000),
        lt: Math.floor(endOfDay.getTime() / 1000),
      },
    });

    const orders: OrderSummary[] = [];
    for (const session of sessions.data) {
      if (session.payment_status === 'paid' && session.customer_details?.email) {
        const amount = (session.amount_total || 0) / 100;
        const birthDataRaw = session.metadata?.birthData;
        let birthInfo = { year: 0, month: 0, day: 0, hour: 0, minute: 0, country: '', city: '', email: '' };
        if (birthDataRaw) {
          try {
            birthInfo = JSON.parse(birthDataRaw);
          } catch {}
        }

        orders.push({
          customerEmail: session.customer_details.email,
          productName: session.metadata?.tier === 'premium' ? 'Premium BaZi Bundle' : 'Complete BaZi Reading',
          amount,
          time: new Date(session.created * 1000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
          birthInfo: {
            year: birthInfo.year || 0,
            month: birthInfo.month || 0,
            day: birthInfo.day || 0,
            hour: birthInfo.hour || 0,
            minute: birthInfo.minute || 0,
            country: birthInfo.country || '',
            city: birthInfo.city || '',
            email: session.customer_details.email,
          },
        });
      }
    }

    await sendDailySummary(orders);

    const todayStr = now.toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' });
    return NextResponse.json({
      success: true,
      date: todayStr,
      orderCount: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0),
    });
  } catch (err: any) {
    console.error('Daily summary failed:', err);
    await sendOwnerErrorAlert(
      '日报汇总失败',
      err.message,
      { time: new Date().toISOString() },
    );
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
