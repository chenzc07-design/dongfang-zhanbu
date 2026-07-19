'use client';

import { useState, useRef } from 'react';
import type { BaZiResult, ProductTier } from '@/lib/types';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
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
    if (!form.year || !form.month || !form.day) return;
    setLoading(true);
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: Number(form.year), month: Number(form.month), day: Number(form.day),
          hour: Number(form.hour || 12), minute: Number(form.minute || 0),
          country: form.country || 'Unknown', city: form.city || 'Unknown',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setStep('result');
      }
    } catch (err) {
      console.error(err);
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
      const priceId = product.id === 'premium'
        ? (process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM || 'pri_01kxw4xdp2qregv0yfchtzhna4')
        : (process.env.NEXT_PUBLIC_PADDLE_PRICE_FULL || 'pri_01kxw47jdxsbb9z2w6stsnxg3q');

      const birthData = {
        year: Number(form.year), month: Number(form.month), day: Number(form.day),
        hour: Number(form.hour || 12), minute: Number(form.minute || 0),
        country: form.country, city: form.city,
      };

      const res = await fetch('/api/paddle/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email, tier: product.id, birthData }),
      });

      const data = await res.json();
      if (data.error) {
        alert('支付创建失败: ' + data.error);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert('支付错误: ' + (err?.message || '请重试'));
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#06080d] text-[#ede4d8] overflow-hidden">
      {/* 星空背景 */}
      <div className="starry-bg" />

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

          {/* 3. Results (conditional) */}
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
