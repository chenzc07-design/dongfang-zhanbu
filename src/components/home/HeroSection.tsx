'use client';

import BirthForm from './BirthForm';

interface BirthFormData {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  country: string;
  city: string;
}

interface HeroSectionProps {
  form: BirthFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function HeroSection({ form, onChange, onSubmit, loading }: HeroSectionProps) {
  return (
    <section className="hero-gradient relative overflow-hidden">
      {/* 神秘符号水印 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#c9a84c] opacity-[0.03] pointer-events-none select-none"
        style={{ fontSize: 'min(60vw, 500px)' }}
      >
        ☯
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-32">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.3)]" />
            <span className="text-[#c9a84c] text-[11px] tracking-[0.3em] uppercase">✦ Ancient Wisdom ✦</span>
            <div className="w-10 h-px bg-gradient-to-r from-[rgba(201,168,76,0.3)] to-transparent" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-3">
            <span className="text-[#ede4d8] font-serif">Enter Your Birth Details</span>
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide text-[#c9a84c] font-serif">
            to Reveal Your Destiny
          </p>

          <p className="text-[#9b8e7c] max-w-lg mx-auto text-sm leading-relaxed mt-4">
            The ancient art of{' '}
            <span className="text-[#c9a84c] font-medium">BaZi (八字)</span> — the Four Pillars of Destiny —{' '}
            decodes your life blueprint from the moment you were born.
          </p>
        </div>

        {/* 表单卡片 */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border-[rgba(201,168,76,0.12)] shadow-[0_0_60px_rgba(124,92,191,0.06)]">
          <BirthForm
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            loading={loading}
          />
        </div>

        {/* 底部资质 */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#7e7264] mt-8">
          <span className="text-[#c9a84c]">✦</span>
          <span>25 Years of Mastery</span>
          <span className="text-[#3e3224]">·</span>
          <span>Master&apos;s Degree 《周易》</span>
          <span className="text-[#3e3224]">·</span>
          <span>Cert. 高级预测风水师</span>
          <span className="text-[#3e3224]">·</span>
          <span>道易天机国学馆</span>
        </div>
      </div>
    </section>
  );
}
