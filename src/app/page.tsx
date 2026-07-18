'use client';

import { useState, useRef } from 'react';
import type { BaZiResult, BirthInfo, ProductTier } from '@/lib/types';

const PRODUCTS: ProductTier[] = [
  {
    id: 'full',
    name: 'Complete BaZi Reading',
    price: 1499,
    priceUSD: 14.99,
    description: 'Your full personalized destiny report',
    features: [
      'Complete Four Pillars analysis',
      'Five Elements profile with scores',
      'Personality & character insights',
      'Career, relationship & wealth guidance',
      'Professional 20+ page PDF report',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium BaZi Bundle',
    price: 3499,
    priceUSD: 34.99,
    description: 'Full report + 2026 forecast + crystal guide',
    features: [
      'Everything in Complete Reading',
      '2026 Year of Fire Horse forecast',
      'Monthly luck pillars for 2026',
      'Crystal & element recommendations',
      'Feng Shui adjustment guide',
    ],
    popular: false,
  },
];

const ELEMENT_COLORS: Record<string, { bar: string; text: string; emoji: string; name: string; cn: string }> = {
  Wood: { bar: 'bg-emerald-500/80', text: 'text-emerald-400', emoji: '🌳', name: 'Wood', cn: '木' },
  Fire: { bar: 'bg-red-500/80', text: 'text-red-400', emoji: '🔥', name: 'Fire', cn: '火' },
  Earth: { bar: 'bg-amber-500/80', text: 'text-amber-400', emoji: '⛰️', name: 'Earth', cn: '土' },
  Metal: { bar: 'bg-zinc-300/80', text: 'text-zinc-300', emoji: '⚔️', name: 'Metal', cn: '金' },
  Water: { bar: 'bg-blue-500/80', text: 'text-blue-400', emoji: '🌊', name: 'Water', cn: '水' },
};

const PILLAR_NAMES_CN = ['年 Year', '月 Month', '日 Day', '时 Hour'];

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

  const resultRef = useRef<HTMLDivElement>(null);
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
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
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
      const res = await fetch('/api/paypal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: product.id,
          customerEmail: email,
          birthData: {
            year: Number(form.year), month: Number(form.month), day: Number(form.day),
            hour: Number(form.hour || 12), minute: Number(form.minute || 0),
            country: form.country, city: form.city,
          },
        }),
      });
      const data = await res.json();
      if (data.approveUrl) {
        // 跳转到 PayPal 支付页面
        window.location.href = data.approveUrl;
      } else {
        alert('Checkout failed. Please try again later.');
      }
    } catch (err) {
      alert('Checkout unavailable. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const years = Array.from({ length: 100 }, (_, i) => 2026 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const maxScore = result ? Math.max(
    result.elements.wood, result.elements.fire,
    result.elements.earth, result.elements.metal, result.elements.water, 1,
  ) : 1;

  const elementArray = result ? [
    { name: 'Wood', score: result.elements.wood },
    { name: 'Fire', score: result.elements.fire },
    { name: 'Earth', score: result.elements.earth },
    { name: 'Metal', score: result.elements.metal },
    { name: 'Water', score: result.elements.water },
  ] : [];

  const pillars = result ? [
    result.yearPillar, result.monthPillar, result.dayPillar, result.hourPillar,
  ] : [];

  return (
    <div className="relative min-h-screen bg-[#0a0e1a] text-[#e8e0d0] overflow-hidden">
      {/* 星空背景 */}
      <div className="starry-bg" />

      <div className="relative z-10">
        {/* ====== Header ====== */}
        <header className="sticky top-0 z-20 border-b border-[rgba(212,168,83,0.1)] bg-[rgba(10,14,26,0.85)] backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl opacity-80">☯</span>
              <div>
                <span className="font-semibold text-[#e8e0d0] tracking-wide">东方古老占卜</span>
                <span className="hidden sm:inline text-sm text-[#8a7a6a] ml-2">· Ancient Eastern Divination</span>
              </div>
            </div>
            <nav className="flex gap-6 text-sm text-[#8a7a6a]">
              <a href="#about" className="hover:text-[#d4a853] transition-colors">Master</a>
              <a href="#gallery" className="hover:text-[#d4a853] transition-colors">Gallery</a>
              <a href="#reading" className="hover:text-[#d4a853] transition-colors">Reading</a>
              <a href="#pricing" className="hover:text-[#d4a853] transition-colors">Pricing</a>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* ====== HERO ====== */}
          <section className="py-12 md:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="w-12 h-px bg-gradient-r from-transparent to-[rgba(212,168,83,0.4)]" />
                <span className="text-[#d4a853] text-xs tracking-[0.3em] uppercase">✦ Ancient Wisdom ✦</span>
                <div className="w-12 h-px bg-gradient-r from-[rgba(212,168,83,0.4)] to-transparent" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-3">
                <span className="text-[#e8e0d0]">东方古老占卜</span>
              </h1>
              <p className="text-[#d4a853] text-lg sm:text-xl font-light tracking-wider mb-6">
                Ancient Eastern Divination
              </p>

              <p className="text-[#8a7a6a] max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
                Unveil the secrets of your destiny through the ancient art of{' '}
                <span className="text-[#d4a853] font-medium">BaZi (八字)</span>, the Four Pillars of Destiny.
                Expertly interpreted by <span className="text-[#e8e0d0]">Master Gao Wei 高伟</span>.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#6a5a4a]">
                <span>25 Years of Mastery</span>
                <span>·</span>
                <span>Master's Degree 《周易》</span>
                <span>·</span>
                <span>Cert. 高级预测风水师</span>
                <span>·</span>
                <span>道易天机国学馆 · Founder</span>
              </div>
            </div>
          </section>

          {/* ====== ABOUT THE MASTER ====== */}
          <section id="about" className="py-16">
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="relative">
                  {/* 大师照片 */}
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[rgba(212,168,83,0.3)] shadow-[0_0_50px_rgba(212,168,83,0.15)]">
                    <img
                      src="/master/portrait.png"
                      alt="Master Gao Wei"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* 装饰角标 */}
                  <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-[#d4a853] to-[#b8893a] text-[#0a0e1a] px-4 py-2 rounded-lg font-semibold text-sm shadow-xl">
                    高伟老师
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-5">
                <div>
                  <p className="text-[#d4a853] text-xs tracking-[0.2em] uppercase mb-2">Meet the Master</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#e8e0d0] mb-3">
                    Master Gao Wei · 高伟
                  </h2>
                  <p className="text-[#b0a090] leading-relaxed text-sm">
                    Born in 1985 in Daying County, Sichuan — a land steeped in mystical traditions — 
                    Master Gao Wei began his journey into the esoteric arts at the age of twelve, 
                    when he was accepted as a formal disciple of a renowned Taoist master. 
                    He went on to earn a <strong className="text-[#e8e0d0]">Master's degree</strong> with a focus on 
                    the <strong className="text-[#e8e0d0]">I Ching (《周易》)</strong> and 
                    <strong className="text-[#e8e0d0]"> Ancient Chinese Geomancy (堪舆文化)</strong>.
                  </p>
                  <p className="text-[#b0a090] leading-relaxed text-sm mt-3">
                    For over <strong className="text-[#d4a853]">25 years</strong>, Master Gao has dedicated himself 
                    to the rigorous study and practice of the Four Pillars of Destiny (八字), 
                    Feng Shui (风水), divination (占卜), and metaphysical sciences (术数). 
                    He has advised hundreds of clients across China and abroad — from business leaders 
                    seeking strategic timing to families seeking harmony and protection. 
                    His readings are known for their uncanny precision, blending classical methodology 
                    with a profound intuitive gift that has earned him the respect of peers and clients alike.
                  </p>
                  <p className="text-[#b0a090] leading-relaxed text-sm mt-3">
                    As the founding master of <strong className="text-[#e8e0d0]">道易天机国学馆</strong>, 
                    certified by the <strong className="text-[#e8e0d0]">大英易学文化研究会</strong>, 
                    Master Gao now brings his lifelong mastery to an international audience — 
                    combining ancient wisdom with modern technology to deliver destiny readings 
                    that speak directly to the soul.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: '✦', title: '25 Years of Mastery', desc: '12岁拜师 · 正统传承 · 术数专家' },
                    { icon: '◇', title: 'Master\'s Degree', desc: '《周易》· 古代堪舆文化 学术研究' },
                    { icon: '☯', title: 'Certified Senior Master', desc: '高级预测风水师 · 大英易学文化研究会' },
                    { icon: '★', title: 'Founder: 道易天机国学馆', desc: '实体道场 · 海内外客户众多' },
                  ].map(item => (
                    <div key={item.title} className="glass-card rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-[#d4a853] text-xl shrink-0">{item.icon}</span>
                        <div>
                          <p className="text-[#e8e0d0] text-sm font-semibold">{item.title}</p>
                          <p className="text-[#8a7a6a] text-xs">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-card rounded-xl p-4 border-l-2 border-[#d4a853]">
                  <p className="text-sm text-[#b0a090] italic leading-relaxed">
                    "The Four Pillars do not predict a fixed fate — they reveal the melody 
                    you were born to dance to. My calling is to help you hear it."
                    <span className="block text-[#8a7a6a] text-xs mt-1">— Master Gao Wei · 高伟老师</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ====== 工作室 + 工作场景 ====== */}
          <section id="gallery" className="py-16 border-t border-[rgba(212,168,83,0.08)]">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-px bg-gradient-r from-transparent to-[rgba(212,168,83,0.3)]" />
                <span className="text-[#d4a853] text-xs tracking-[0.3em] uppercase">Sacred Spaces</span>
                <div className="w-8 h-px bg-gradient-r from-[rgba(212,168,83,0.3)] to-transparent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#e8e0d0]">Our Studio & Sacred Work</h2>
              <p className="text-[#8a7a6a] text-sm mt-2">道易天机国学馆 · Where Ancient Wisdom Lives</p>
            </div>

            {/* 主图 + 证书 */}
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div className="glass-card rounded-2xl overflow-hidden">
                <img src="/master/studio-front.jpg" alt="道易天机国学馆" className="w-full h-64 object-cover opacity-90" />
                <div className="p-4">
                  <p className="text-[#e8e0d0] text-sm font-semibold mb-1">道易天机国学馆</p>
                  <p className="text-[#8a7a6a] text-xs">Our sacred space where readings, rituals, and consultations are performed.</p>
                </div>
              </div>
              <div className="glass-card rounded-2xl overflow-hidden">
                <img src="/master/certificate.jpg" alt="高级预测风水师证书" className="w-full h-64 object-cover opacity-95" />
                <div className="p-4">
                  <p className="text-[#e8e0d0] text-sm font-semibold mb-1">Official Certification · 高级预测风水师</p>
                  <p className="text-[#8a7a6a] text-xs">Issued by 大英易学文化研究会 · August 2018</p>
                </div>
              </div>
            </div>

            {/* 三张仪式照 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="glass-card rounded-xl overflow-hidden col-span-2 md:col-span-1 md:row-span-2">
                <img src="/master/master-ceremony.jpg" alt="Master performing ceremony"
                  className="w-full h-full object-cover min-h-[200px] opacity-90" />
                <div className="p-3">
                  <p className="text-[#e8e0d0] text-xs font-semibold">Master's Ritual · 道场仪式</p>
                </div>
              </div>
              <div className="glass-card rounded-xl overflow-hidden">
                <img src="/master/altar-ritual.jpg" alt="Altar ceremony"
                  className="w-full h-40 object-cover opacity-90" />
                <div className="p-3">
                  <p className="text-[#e8e0d0] text-xs font-semibold">Sacred Altar · 祭坛</p>
                </div>
              </div>
              <div className="glass-card rounded-xl overflow-hidden">
                <img src="/master/groundbreaking.jpg" alt="Ground breaking ceremony"
                  className="w-full h-40 object-cover opacity-90" />
                <div className="p-3">
                  <p className="text-[#e8e0d0] text-xs font-semibold">Site Blessing · 开工仪式</p>
                </div>
              </div>
              <div className="glass-card rounded-xl overflow-hidden">
                <img src="/master/tools-collection.jpg" alt="Mystical tools"
                  className="w-full h-40 object-cover opacity-90" />
                <div className="p-3">
                  <p className="text-[#e8e0d0] text-xs font-semibold">Sacred Tools · 风水器具</p>
                </div>
              </div>
              <div className="glass-card rounded-xl overflow-hidden">
                <img src="/master/taisui-chart.jpg" alt="Tai Sui Chart"
                  className="w-full h-40 object-cover opacity-90" />
                <div className="p-3">
                  <p className="text-[#e8e0d0] text-xs font-semibold">Tai Sui · 太岁图</p>
                </div>
              </div>
            </div>
          </section>

          {/* ====== 免费排盘 ====== */}
          <section id="reading" className="py-16 border-t border-[rgba(212,168,83,0.08)]">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-px bg-gradient-r from-transparent to-[rgba(212,168,83,0.3)]" />
                <span className="text-[#d4a853] text-xs tracking-[0.3em] uppercase">Begin Your Reading</span>
                <div className="w-8 h-px bg-gradient-r from-[rgba(212,168,83,0.3)] to-transparent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#e8e0d0]">Free BaZi Chart</h2>
              <p className="text-[#8a7a6a] text-sm mt-2">Start with a free reading · No credit card needed</p>
            </div>

            {(step === 'form') && (
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                <div className="glass-card rounded-xl p-5 space-y-4">
                  <p className="text-xs text-[#d4a853] tracking-wider uppercase font-medium">Birth Date & Time</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'year', label: 'Year', options: years.map(y => ({ v: y, l: String(y) })) },
                      { name: 'month', label: 'Month', options: months.map(m => ({ v: m, l: String(m).padStart(2, '0') })) },
                      { name: 'day', label: 'Day', options: days.map(d => ({ v: d, l: String(d).padStart(2, '0') })) },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-[10px] text-[#6a5a4a] mb-1 text-left">{f.label}</label>
                        <select name={f.name} value={form[f.name as keyof typeof form]} onChange={handleInputChange}
                          className="input-mystic text-sm">
                          <option value="">—</option>
                          {f.options.map(o => (
                            <option key={o.v} value={o.v} className="bg-[#0a0e1a]">{o.l}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'hour', label: 'Hour', options: hours.map(h => ({ v: h, l: `${String(h).padStart(2, '0')}:00` })) },
                      { name: 'minute', label: 'Minute', options: minutes.map(m => ({ v: m, l: String(m).padStart(2, '0') })) },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-[10px] text-[#6a5a4a] mb-1 text-left">{f.label}</label>
                        <select name={f.name} value={form[f.name as keyof typeof form]} onChange={handleInputChange}
                          className="input-mystic text-sm">
                          <option value="">—</option>
                          {f.options.map(o => (
                            <option key={o.v} value={o.v} className="bg-[#0a0e1a]">{o.l}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs text-[#d4a853] tracking-wider uppercase font-medium mb-2">Birth Place</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-[#6a5a4a] mb-1 text-left">Country</label>
                        <input name="country" value={form.country} onChange={handleInputChange}
                          placeholder="e.g. United States" className="input-mystic text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#6a5a4a] mb-1 text-left">City</label>
                        <input name="city" value={form.city} onChange={handleInputChange}
                          placeholder="e.g. New York" className="input-mystic text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading || !form.year || !form.month || !form.day}
                  className="btn-gold w-full text-base py-3.5">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#0a0e1a] border-t-transparent rounded-full animate-spin" />
                      Reading the stars...
                    </span>
                  ) : '🔮 Reveal My Destiny — Free'}
                </button>
              </form>
            )}

            {/* ====== 结果 ====== */}
            {(step === 'result' || step === 'pricing') && result && (
              <div ref={resultRef} className="space-y-6 stagger-animate">
                <div className="glass-card rounded-2xl p-8 text-center">
                  <p className="text-xs text-[#d4a853] tracking-[0.2em] uppercase mb-2">Your Day Master · 日主</p>
                  <h2 className="text-4xl font-bold text-[#e8e0d0] mb-1">{result.dayMaster}</h2>
                  <p className="text-[#8a7a6a] text-sm">{result.dayMasterElement} · {result.dayMasterYinYang}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pillars.map((p, i) => (
                    <div key={i} className="glass-card rounded-xl p-4 text-center">
                      <p className="text-[10px] text-[#6a5a4a] tracking-wider uppercase mb-3">{PILLAR_NAMES_CN[i]}</p>
                      <p className="text-lg font-bold text-[#d4a853]">{p.stem.split(' (')[0]}</p>
                      <p className="text-xs text-[#8a7a6a] mb-3">{p.branch}</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-medium
                        ${p.stemElement === 'Wood' ? 'badge-wood' : ''}
                        ${p.stemElement === 'Fire' ? 'badge-fire' : ''}
                        ${p.stemElement === 'Earth' ? 'badge-earth' : ''}
                        ${p.stemElement === 'Metal' ? 'badge-metal' : ''}
                        ${p.stemElement === 'Water' ? 'badge-water' : ''}
                      `}>
                        {p.stemElement}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-[#d4a853] text-lg">☯</span>
                    <h3 className="font-semibold text-[#e8e0d0]">Element Profile · 五行</h3>
                  </div>
                  <div className="space-y-3">
                    {elementArray.map(el => {
                      const s = ELEMENT_COLORS[el.name];
                      const pct = (el.score / maxScore) * 100;
                      return (
                        <div key={el.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-[#b0a090]">{s.emoji} {s.name} {s.cn}</span>
                            <span className="text-xs text-[#6a5a4a]">{el.score.toFixed(1)}</span>
                          </div>
                          <div className="h-2 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ease-out ${s.bar}`}
                              style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[rgba(212,168,83,0.1)] flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <span className="text-emerald-400">✦ Lucky: {result.luckyElement}</span>
                    <span className="text-[#4a3a2a]">|</span>
                    <span className="text-[#8a7a6a]">Balance: {result.unfavorableElement}</span>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-semibold text-[#e8e0d0] mb-4">Personality Profile · 性格</h3>
                  <ul className="space-y-2.5">
                    {result.personalityTraits.map((trait, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#b0a090] leading-relaxed">
                        <span className="text-[#d4a853] mt-0.5 shrink-0">✦</span>
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-card rounded-2xl p-6 border-l-2 border-[#d4a853]">
                  <p className="text-sm text-[#b0a090] leading-relaxed">{result.summary}</p>
                </div>

                {!emailSubmitted && (
                  <div className="glass-card rounded-2xl p-6 border border-[rgba(212,168,83,0.2)]">
                    <h3 className="font-semibold text-[#e8e0d0] mb-2">📜 Unlock Your Full Report</h3>
                    <p className="text-sm text-[#8a7a6a] mb-4">
                      Enter your email to see pricing and get your complete 20+ page PDF destiny report.
                    </p>
                    <div className="flex gap-2">
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="input-mystic flex-1 text-sm" />
                      <button onClick={handleEmailSubmit}
                        disabled={!email || !email.includes('@')}
                        className="btn-gold px-5 py-2.5 text-sm whitespace-nowrap">
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {emailSubmitted && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 text-emerald-400 text-sm bg-[rgba(76,175,80,0.1)] px-4 py-2 rounded-full">
                      <span>✓</span> Email saved — scroll down for pricing
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ====== 定价 ====== */}
          <div ref={pricingRef} id="pricing">
            {(step === 'pricing' || (step === 'form' && !result)) && (
              <div className="py-16">
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-8 h-px bg-gradient-r from-transparent to-[rgba(212,168,83,0.3)]" />
                    <span className="text-[#d4a853] text-xs tracking-[0.3em] uppercase">Choose Your Path</span>
                    <div className="w-8 h-px bg-gradient-r from-[rgba(212,168,83,0.3)] to-transparent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#e8e0d0]">Select Your Report</h2>
                  <p className="text-[#8a7a6a] text-sm mt-2">One-time purchase · PDF delivered via email</p>
                </div>

                {step === 'form' && !result && (
                  <p className="text-center text-[#8a7a6a] text-sm mb-8">
                    Start with a <span className="text-[#d4a853]">free reading above</span>, or purchase directly:
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
                  {PRODUCTS.map(product => (
                    <div key={product.id}
                      className={`relative rounded-2xl p-6 transition-all duration-300 ${
                        product.popular
                          ? 'glass-card border-[rgba(212,168,83,0.3)] glass-card-glow'
                          : 'glass-card border-[rgba(212,168,83,0.08)]'
                      }`}>
                      {product.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-r from-[#d4a853] to-[#b8893a] text-[#0a0e1a] text-[11px] font-semibold px-4 py-1 rounded-full tracking-wide">
                          Most Popular
                        </span>
                      )}
                      <div className="text-center mb-5">
                        <h3 className="font-semibold text-lg text-[#e8e0d0]">{product.name}</h3>
                        <div className="mt-3">
                          <span className="text-4xl font-bold text-[#d4a853]">${product.priceUSD}</span>
                          <span className="text-[#6a5a4a] text-sm ml-1">one-time</span>
                        </div>
                        <p className="text-sm text-[#8a7a6a] mt-2">{product.description}</p>
                      </div>
                      <ul className="space-y-2.5 mb-6">
                        {product.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[#b0a090]">
                            <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => handleCheckout(product)} disabled={checkoutLoading}
                        className={`w-full py-3 rounded-lg font-medium transition-all duration-300 text-sm ${
                          product.popular ? 'btn-gold' : 'btn-ghost'
                        } disabled:opacity-50`}>
                        {checkoutLoading ? 'Processing...' : `Purchase — $${product.priceUSD}`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ====== How It Works ====== */}
          <section className="py-16 border-t border-[rgba(212,168,83,0.08)]">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-px bg-gradient-r from-transparent to-[rgba(212,168,83,0.3)]" />
                <span className="text-[#d4a853] text-xs tracking-[0.3em] uppercase">The Path</span>
                <div className="w-8 h-px bg-gradient-r from-[rgba(212,168,83,0.3)] to-transparent" />
              </div>
              <h2 className="text-2xl font-bold text-[#e8e0d0]">How It Works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { num: '01', title: 'Enter Your Details', desc: 'Your birth date, time, and place — the foundation of the ancient art.' },
                { num: '02', title: 'Free BaZi Chart', desc: 'Our AI computes your Four Pillars and Element balance instantly.' },
                { num: '03', title: 'Receive Your Report', desc: 'Get a complete 20+ page PDF with deep insights and recommendations.' },
              ].map(s => (
                <div key={s.num} className="glass-card rounded-xl p-6 text-center">
                  <span className="text-[#d4a853] text-3xl font-serif font-bold opacity-50">{s.num}</span>
                  <h3 className="font-semibold text-[#e8e0d0] mt-3 mb-2">{s.title}</h3>
                  <p className="text-sm text-[#8a7a6a] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ====== 尾部 ====== */}
          <section className="py-8 text-center">
            <div className="gold-divider" />
            <p className="text-[10px] text-[#4a3a2a] max-w-lg mx-auto leading-relaxed">
              东方古老占卜 · Based on ancient Chinese Four Pillars of Destiny (Ba Zi) methodology.
              For entertainment and self-reflection purposes only. Your data is never shared.
            </p>
          </section>
        </main>

        <footer className="border-t border-[rgba(212,168,83,0.05)] py-6">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex justify-center gap-6 mb-3">
              <a href="/blog" className="text-[11px] text-[#5a4a3a] hover:text-[#d4a853] transition-colors">
                Blog
              </a>
              <span className="text-[#3a2a1a] text-[11px]">·</span>
              <a href="mailto:support@dongfang.com" className="text-[11px] text-[#5a4a3a] hover:text-[#d4a853] transition-colors">
                Contact
              </a>
            </div>
            <p className="text-[11px] text-[#3a2a1a]">
            © {new Date().getFullYear()} 东方古老占卜 · Ancient Eastern Divination
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
