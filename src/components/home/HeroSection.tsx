'use client';

import BirthForm from './BirthForm';

interface BirthFormData {
  year: string; month: string; day: string; hour: string; minute: string; country: string; city: string;
}

interface HeroSectionProps {
  form: BirthFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function HeroSection({ form, onChange, onSubmit, loading }: HeroSectionProps) {
  return (
    <section className="bg-white relative overflow-hidden">
      {/* 背景图 — 降低不透明度 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/master/studio-front.jpg"
          alt="Daoist Studio — Dongfang Divination"
          className="w-full h-full object-cover opacity-[0.12]"
        />
      </div>

      {/* 装饰性中国风水印 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#a78bfa] opacity-[0.04] pointer-events-none select-none"
        style={{ fontSize: 'min(50vw, 400px)' }}>
        ☯
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-32">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-200" />
            <span className="text-[#7c3aed] text-[11px] tracking-[0.3em] uppercase font-medium">✦ Ancient Wisdom ✦</span>
            <div className="w-10 h-px bg-gradient-to-r from-purple-200 to-transparent" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-3">
            <span className="text-[#1f2937]">Discover Your</span>
            <br />
            <span className="text-[#7c3aed]">Life Blueprint</span>
          </h1>
          <p className="text-lg md:text-xl font-light tracking-wide text-[#7c3aed]">
            Authentic BaZi Reading by Senior Metaphysics Consultant
          </p>

          <p className="text-[#6b7280] max-w-lg mx-auto text-sm leading-relaxed mt-4">
            The ancient art of{' '}
            <span className="text-[#7c3aed] font-medium">BaZi (八字)</span> — the Four Pillars of Destiny —{' '}
            decodes your unique energy blueprint and reveals optimal timing for career, relationships, and personal growth.
          </p>
        </div>

        {/* 表单卡片 */}
        <div className="card-warm rounded-2xl p-6 sm:p-8">
          <BirthForm form={form} onChange={onChange} onSubmit={onSubmit} loading={loading} />
        </div>

        {/* 底部资质 */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#9ca3af] mt-8">
          <span className="text-[#7c3aed]">✦</span>
          <span>25+ Years of Mastery</span>
          <span className="text-[#d1d5db]">·</span>
          <span>I Ching Scholar · 《周易》</span>
          <span className="text-[#d1d5db]">·</span>
          <span>Cert. Senior Metaphysics Consultant</span>
        </div>
      </div>
    </section>
  );
}
