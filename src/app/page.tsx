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
  const readingRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 统一滚动方法：优先用 ref，fallback 到 id
  const scrollTo = (target: HTMLElement | string, delay = 0) => {
    setTimeout(() => {
      const el = typeof target === 'string' ? document.getElementById(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, delay);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.year || !form.month || !form.day) return;
    setLoading(true);
    try {
      const payload = {
        year: Number(form.year), month: Number(form.month), day: Number(form.day),
        hour: Number(form.hour || 12), minute: Number(form.minute || 0),
        country: form.country || 'Unknown', city: form.city || 'Unknown',
      };
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setStep('result');
        // 等渲染完成后滚动到结果区
        scrollTo('reading', 300);
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
    // 短暂延迟后滚动到定价区
    scrollTo(pricingRef.current!, 500);
  };

  const handleCheckout = async (product: ProductTier) => {
    setCheckoutLoading(true);
    try {
      const birthData = {
        year: Number(form.year), month: Number(form.month), day: Number(form.day),
        hour: Number(form.hour || 12), minute: Number(form.minute || 0),
        country: form.country, city: form.city,
      };
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
      if (data.approveUrl) {
        window.location.href = data.approveUrl;
      }
    } catch (err: any) {
      alert('Payment error: ' + (err?.message || 'Please try again'));
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
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

          {/* 4. Pricing */}
          <div ref={pricingRef}>
            <PricingSection
              onCheckout={handleCheckout}
              checkoutLoading={checkoutLoading}
            />
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
  );
}
