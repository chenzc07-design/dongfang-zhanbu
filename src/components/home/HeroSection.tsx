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
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* 背景图 + 渐变遮罩 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/master/studio-front.jpg"
          alt="道易天机国学馆"
          className="w-full h-full object-cover"
        />
        {/* 多层遮罩：暗化 + 暖色叠加 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(20,16,8,0.75)] via-[rgba(20,16,8,0.65)] to-[rgba(20,16,8,0.8)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(20,16,8,0.3)] via-transparent to-[rgba(20,16,8,0.3)]" />
        {/* 底部渐变过渡到白色 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf8f4] to-transparent" />
      </div>

      {/* 装饰粒子光点 */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[10%] w-1 h-1 bg-[#d4a843] rounded-full opacity-30 animate-pulse" />
        <div className="absolute top-[25%] right-[15%] w-1.5 h-1.5 bg-[#d4a843] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[20%] w-1 h-1 bg-[#d4a843] rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[30%] right-[25%] w-1 h-1 bg-[#d4a843] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-20">
        {/* 标题区 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-[rgba(212,168,67,0.4)]" />
            <span className="text-[#d4a843] text-[11px] tracking-[0.3em] uppercase font-medium">✦ Ancient Wisdom ✦</span>
            <div className="w-10 h-px bg-gradient-to-r from-[rgba(212,168,67,0.4)] to-transparent" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-3">
            <span className="text-white font-serif drop-shadow-lg">Enter Your Birth Details</span>
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide text-[#d4a843] font-serif drop-shadow">
            to Reveal Your Destiny
          </p>

          <p className="text-[#c4b898] max-w-lg mx-auto text-sm leading-relaxed mt-4 drop-shadow">
            The ancient art of{' '}
            <span className="text-[#d4a843] font-medium">BaZi (八字)</span> — the Four Pillars of Destiny —{' '}
            decodes your life blueprint from the moment you were born.
          </p>
        </div>

        {/* 表单卡片 — 半透明白底 */}
        <div className="bg-[rgba(255,255,255,0.92)] backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[rgba(0,0,0,0.3)] border border-[rgba(212,168,67,0.15)]">
          <BirthForm form={form} onChange={onChange} onSubmit={onSubmit} loading={loading} />
        </div>

        {/* 资质 */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#c4b898] mt-8 drop-shadow">
          <span className="text-[#d4a843]">✦</span>
          <span>25 Years of Mastery</span>
          <span className="text-[#8a7a5a]">·</span>
          <span>Master&apos;s Degree 《周易》</span>
          <span className="text-[#8a7a5a]">·</span>
          <span>Cert. 高级预测风水师</span>
          <span className="text-[#8a7a5a]">·</span>
          <span>道易天机国学馆</span>
        </div>
      </div>
    </section>
  );
}
