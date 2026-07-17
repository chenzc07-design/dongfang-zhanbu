import { NextRequest, NextResponse } from 'next/server';
import { calculateBaZi } from '@/lib/bazi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, day, hour, minute, country, city } = body;

    if (!year || !month || !day) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = calculateBaZi(
      Number(year),
      Number(month),
      Number(day),
      Number(hour || 12),
      Number(minute || 0),
      country || 'Unknown',
    );

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error('BaZi calculation error:', err);
    return NextResponse.json({ error: err.message || 'Calculation failed' }, { status: 500 });
  }
}
