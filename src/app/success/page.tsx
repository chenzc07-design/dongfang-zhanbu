'use client';

import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [provider, setProvider] = useState<'paypal' | 'stripe'>('paypal');
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const providerParam = params.get('provider') as 'paypal' | 'stripe' | null;
    const detectedProvider: 'paypal' | 'stripe' = providerParam === 'stripe' ? 'stripe' : 'paypal';
    setProvider(detectedProvider);

    if (detectedProvider === 'paypal') {
      // PayPal: 捕获订单 token
      const paypalOrderId = params.get('token');
      if (paypalOrderId) {
        setOrderId(paypalOrderId);
        // 自动捕获订单
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
      // Stripe: 旧路径
      setOrderId(params.get('session_id'));
      setStatus('success');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="starry-bg" />
      <div className="relative z-10 max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-px bg-gradient-r from-transparent to-[rgba(212,168,83,0.4)]" />
          <span className="text-[#d4a853] text-xs tracking-[0.3em] uppercase">
            {status === 'success' ? '✦ Complete ✦' : '✦ Processing ✦'}
          </span>
          <div className="w-12 h-px bg-gradient-r from-[rgba(212,168,83,0.4)] to-transparent" />
        </div>

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-[#e8e0d0] mb-3">Payment Successful!</h1>
            <p className="text-[#8a7a6a] mb-8">
              Your 东方古老占卜 report is being generated and will be sent to your email shortly.
            </p>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="text-6xl mb-6">⏳</div>
            <h1 className="text-3xl font-bold text-[#e8e0d0] mb-3">Processing Payment...</h1>
            <p className="text-[#8a7a6a] mb-8">
              Just a moment while we confirm your order and generate your report.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold text-[#e8e0d0] mb-3">Something went wrong</h1>
            <p className="text-[#c0392b] mb-8">
              {errorMsg}
            </p>
            <p className="text-[#8a7a6a] text-sm">
              If you were charged, your report will arrive within a few minutes. If not, please try again.
            </p>
          </>
        )}

        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-3">
            {status === 'pending' ? (
              <>
                <span className="w-3 h-3 border-2 border-[#d4a853] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-[#d4a853]">Generating your personalized report...</span>
              </>
            ) : status === 'success' ? (
              <>
                <span className="text-emerald-500 text-xl">✓</span>
                <span className="text-sm text-emerald-400">Report generation in progress</span>
              </>
            ) : (
              <>
                <span className="text-[#c0392b] text-xl">!</span>
                <span className="text-sm text-[#c0392b]">Please contact support</span>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-[#5a4a3a]">
          Didn&apos;t receive the email within 5 minutes? Check your spam folder or{' '}
          <a href="mailto:support@dongfang.com" className="text-[#d4a853] underline">contact support</a>.
        </p>

        {orderId && (
          <p className="text-xs text-[#3a2a1a] mt-4">
            {provider === 'paypal' ? 'PayPal Order' : 'Session'}: {orderId.slice(0, 14)}...
          </p>
        )}
      </div>
    </div>
  );
}
