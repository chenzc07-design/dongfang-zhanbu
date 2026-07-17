'use client';

import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get('session_id'));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="starry-bg" />
      <div className="relative z-10 max-w-md w-full text-center">
        {/* 装饰 */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-px bg-gradient-r from-transparent to-[rgba(212,168,83,0.4)]" />
          <span className="text-[#d4a853] text-xs tracking-[0.3em] uppercase">✦ Complete ✦</span>
          <div className="w-12 h-px bg-gradient-r from-[rgba(212,168,83,0.4)] to-transparent" />
        </div>

        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-[#e8e0d0] mb-3">Payment Successful!</h1>
        <p className="text-[#8a7a6a] mb-8">
          Your 东方古老占卜 report is being generated and will be sent to your email shortly.
        </p>

        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-3">
            <span className="w-3 h-3 border-2 border-[#d4a853] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#d4a853]">Generating your personalized report...</span>
          </div>
        </div>

        <p className="text-xs text-[#5a4a3a]">
          Didn&apos;t receive the email within 5 minutes? Check your spam folder or{' '}
          <a href="mailto:support@dongfang.com" className="text-[#d4a853] underline">contact support</a>.
        </p>

        {sessionId && (
          <p className="text-xs text-[#3a2a1a] mt-4">
            Session: {sessionId.slice(0, 12)}...
          </p>
        )}
      </div>
    </div>
  );
}
