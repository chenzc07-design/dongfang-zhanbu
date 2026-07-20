/**
 * 延迟发货检查器
 * 每 6 小时运行一次，发送 24 小时前的订单
 */
import { NextRequest, NextResponse } from 'next/server';
import { calculateBaZi } from '@/lib/bazi';
import { sendBaZiReport, sendOwnerErrorAlert } from '@/lib/email';
import fs from 'fs';

const CRON_SECRET = process.env.CRON_SECRET || '';

/** 读取 pending 订单 */
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

export async function GET(req: NextRequest) {
  // 简单验证
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = getPendingOrders();
  if (orders.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, pending: 0 });
  }

  const now = Date.now();
  let sent = 0;
  let stillPending: any[] = [];

  for (const order of orders) {
    if (order.sent) continue;

    const scheduledTime = new Date(order.scheduledSendAt).getTime();

    if (now >= scheduledTime) {
      // 时间到，发送报告
      try {
        const { birthData, tier, email } = order;
        const result = calculateBaZi(
          birthData.year, birthData.month, birthData.day,
          birthData.hour || 12, birthData.minute || 0,
          birthData.country || 'Unknown',
        );

        await sendBaZiReport(email, result, birthData, tier || 'full');
        order.sent = true;
        sent++;
        console.log(`✅ Report sent to ${email} (order ${order.orderId})`);
      } catch (err: any) {
        console.error(`❌ Failed to send report for ${order.orderId}:`, err.message);
        stillPending.push(order); // 保留失败的重试
      }
    } else {
      stillPending.push(order);
    }
  }

  // 加上还没到时间的
  for (const order of orders) {
    if (!order.sent && !stillPending.find((o: any) => o.orderId === order.orderId)) {
      stillPending.push(order);
    }
  }

  savePendingOrders(stillPending);

  return NextResponse.json({
    ok: true,
    sent,
    stillPending: stillPending.filter((o: any) => !o.sent).length,
    total: orders.length,
  });
}
