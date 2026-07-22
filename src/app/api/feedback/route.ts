import { NextResponse } from 'next/server';

// Store feedback in a simple JSON file on Vercel's /tmp
// Note: /tmp is ephemeral — for persistence, connect a DB later
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, email } = body;

    // Log to console (visible in Vercel Runtime Logs on Pro plan)
    console.log(`[Feedback] ${rating} | ${email || 'anonymous'} | ${new Date().toISOString()}`);

    // Also try to email the feedback to owner
    const ownerEmail = process.env.OWNER_EMAIL;
    if (ownerEmail && process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'reports@dongfangdivination.com',
            to: ownerEmail,
            subject: `📊 BaZi Feedback: ${rating}`,
            html: `<p><strong>Rating:</strong> ${rating}</p><p><strong>Email:</strong> ${email || 'anonymous'}</p><p><strong>Time:</strong> ${new Date().toISOString()}</p>`,
          }),
        });
      } catch (emailErr) {
        console.error('[Feedback] Email notification failed:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Feedback] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save feedback' }, { status: 500 });
  }
}
