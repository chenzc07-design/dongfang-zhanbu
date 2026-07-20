'use client';

import { useState, useRef } from 'react';
import type { BaZiResult, ProductTier } from '@/lib/types';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import VideoSection from '@/components/home/VideoSection';
import ResultsPanel from '@/components/home/ResultsPanel';
import PricingSection from '@/components/home/PricingSection';
import AboutMaster from '@/components/home/AboutMaster';
import StudioGallery from '@/components/home/StudioGallery';
import Testimonials from '@/components/home/Testimonials';

export default function Home() {
  const [step, setStep] = useState<'form' | 'result' | 'pricing'>('form');
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [result, setResult] = useState<BaZiResult | null>(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const [form, setForm] = useState({
    year: '', month: '', day: '', hour: '', minute: '', country: '', city: '',
  });

  const pricingRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Submit] clicked', { form });
    if (!form.year || !form.month || !form.day) {
      console.log('[Submit] missing date fields');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        year: Number(form.year), month: Number(form.month), day: Number(form.day),
        hour: Number(form.hour || 12), minute: Number(form.minute || 0),
        country: form.country || 'Unknown', city: form.city || 'Unknown',
      };
      console.log('[Submit] sending payload', payload);
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[Submit] response status', res.status);
      const data = await res.json();
      console.log('[Submit] response data', data);
      if (data.success) {
        setResult(data.data);
        setStep('result');
        // 滚动到结果区域
        setTimeout(() => {
          const resultsEl = document.getElementById('reading');
          if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    } catch (err) {
      console.error('[Submit] error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) return;
    setEmailSubmitted(true);
    setTimeout(() => {
      setStep('pricing');
      setTimeout(() => pricingRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 600);
  };

  const handleCheckout = async (product: ProductTier) => {
    setCheckoutLoading(true);
    try {
      const birthData = {
        year: Number(form.year), month: Number(form.month), day: Number(form.day),
        hour: Number(form.hour || 12), minute: Number(form.minute || 0),
        country: form.country, city: form.city,
      };

      // 创建 PayPal 订单
      const res = await fetch('/api/paypal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: product.id,
          customerEmail: email,
          birthData,
        }),
      });

      const data = await res.json();
      if (data.error) {
        alert('Payment creation failed: ' + data.error);
        setCheckoutLoading(false);
        return;
      }

      // 跳转到 PayPal 支付页面
      if (data.approveUrl) {
        window.location.href = data.approveUrl;
      }
    } catch (err: any) {
      alert('Payment error: ' + (err?.message || 'Please try again'));
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#faf8f4] text-[#2c2416] overflow-hidden">
      {/* 宣纸质感背景 */}
      <div className="subtle-bg" />

      <div className="relative z-10">
        <Header />

        <main>
          {/* 1. Hero + Form */}
          <HeroSection
            form={form}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            loading={loading}
          />

          {/* 2. How It Works */}
          <HowItWorks />

          {/* 3. Video Section */}
          <VideoSection />

          {/* 4. Results (conditional) */}
          {(step === 'result' || step === 'pricing') && result && (
            <ResultsPanel
              result={result}
              email={email}
              emailSubmitted={emailSubmitted}
              onEmailChange={setEmail}
              onEmailSubmit={handleEmailSubmit}
            />
          )}

          {/* 4. Pricing (conditional) */}
          <div ref={pricingRef}>
            {(step === 'pricing' || (step === 'form' && !result)) && (
              <PricingSection
                onCheckout={handleCheckout}
                checkoutLoading={checkoutLoading}
              />
            )}
          </div>

          {/* 5. About Master */}
          <AboutMaster />

          {/* 6. Gallery */}
          <StudioGallery />

          {/* 7. Testimonials */}
          <Testimonials />
        </main>

        <Footer />
      </div>
    </div>
  );
}
