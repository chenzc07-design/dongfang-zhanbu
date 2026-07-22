import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, question } = await req.json();

    if (!email || !question) {
      return NextResponse.json({ success: false, error: 'Email and question are required.' }, { status: 400 });
    }

    // Send email notification to owner
    const ownerEmail = process.env.OWNER_EMAIL;
    if (ownerEmail && process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'reports@dongfangdivination.com',
          to: ownerEmail,
          replyTo: email,
          subject: `💬 New Question from ${name || 'Visitor'}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#d4a843;">New Contact Form Message</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#666;width:80px;">Name:</td><td style="padding:8px 0;"><strong>${name || 'Not provided'}</strong></td></tr>
                <tr><td style="padding:8px 0;color:#666;">Email:</td><td style="padding:8px 0;"><strong>${email}</strong></td></tr>
                <tr><td style="padding:8px 0;color:#666;">Time:</td><td style="padding:8px 0;">${new Date().toISOString()}</td></tr>
              </table>
              <div style="margin-top:16px;padding:16px;background:#f5f0e8;border-radius:8px;border-left:3px solid #d4a843;">
                <p style="margin:0;line-height:1.6;">${question}</p>
              </div>
              <p style="margin-top:16px;color:#999;font-size:12px;">
                Reply directly to this email to respond to the customer.
              </p>
            </div>
          `,
        }),
      });
    }

    console.log(`[Contact] ${name || 'Anonymous'} (${email}): ${question}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to send message.' }, { status: 500 });
  }
}
