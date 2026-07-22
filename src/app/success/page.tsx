'use client';

import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get('provider') as string | null;

    if (provider === 'paypal') {
      const paypalOrderId = params.get('token');
      if (paypalOrderId) {
        setOrderId(paypalOrderId);
        fetch('/api/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: paypalOrderId }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.success) {
              setStatus('success');
            } else {
              setStatus('error');
              setErrorMsg(data.error || 'Unknown error');
            }
          })
          .catch((err) => {
            setStatus('error');
            setErrorMsg(err.message);
          });
      } else {
        setStatus('error');
        setErrorMsg('No PayPal order token found in URL');
      }
    } else {
      setOrderId(params.get('session_id'));
      setStatus('success');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center px-4 relative">
      <div className="relative z-10 max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-200" />
          <span className="text-[#7c3aed] text-xs tracking-[0.3em] uppercase font-medium">
            {status === 'success' ? '✦ Complete ✦' : '✦ Processing ✦'}
          </span>
          <div className="w-12 h-px bg-gradient-to-r from-purple-200 to-transparent" />
        </div>

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-[#1f2937] mb-3">Payment Successful!</h1>
            <p className="text-[#6b7280] mb-8 leading-relaxed">
              Thank you for your purchase. Master Gao Wei will personally analyze your chart and your Life Blueprint report will be delivered to your email within <strong className="text-[#7c3aed]">24 hours</strong>.
            </p>
            <div className="card-warm rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#388e3c" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                <span className="text-sm text-[#1f2937]">Report scheduled for delivery</span>
              </div>
            </div>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="text-6xl mb-6">
              <span className="inline-block animate-spin" style={{ animationDuration: '3s' }}>☯</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1f2937] mb-3">Processing Payment...</h1>
            <p className="text-[#6b7280] mb-8">
              Just a moment while we confirm your order.
            </p>
            <div className="card-warm rounded-xl p-6 mb-6 flex justify-center">
              <span className="w-5 h-5 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin inline-block" />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold text-[#1f2937] mb-3">Something went wrong</h1>
            <p className="text-[#f43f5e] mb-8">{errorMsg}</p>
            <p className="text-[#6b7280] text-sm">
              If you were charged, your report will arrive within 24 hours. If not, please contact support.
            </p>
          </>
        )}

        <p className="text-xs text-[#9ca3af] mt-8">
          Haven&apos;t received the email within 24 hours? Check your spam folder or{' '}
          <a href="mailto:support@dongfangdivination.com" className="text-[#7c3aed] underline">contact support</a>.
        </p>

        {orderId && (
          <p className="text-xs text-[#d1d5db] mt-4">
            Order: {orderId.slice(0, 14)}...
          </p>
        )}

        <a href="/" className="inline-block mt-8 text-sm text-[#7c3aed] hover:underline">
          ← Back to Dongfang Divination
        </a>
      </div>
    </div>
  );
}
