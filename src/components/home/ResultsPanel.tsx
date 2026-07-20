'use client';

import type { BaZiResult } from '@/lib/types';
import SectionHeading from '../ui/SectionHeading';
import PillarCard from './PillarCard';
import ElementBarChart from './ElementBarChart';

interface ResultsPanelProps {
  result: BaZiResult;
  email: string;
  emailSubmitted: boolean;
  onEmailChange: (email: string) => void;
  onEmailSubmit: () => void;
}

export default function ResultsPanel({ result, email, emailSubmitted, onEmailChange, onEmailSubmit }: ResultsPanelProps) {
  const pillars = [result.yearPillar, result.monthPillar, result.dayPillar, result.hourPillar];

  return (
    <section id="reading" className="py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeading label="Your Reading" title="Your BaZi Chart" className="mb-10" />

        <div className="space-y-6 stagger-animate">
          {/* ===== 1. 日主 — 钩子，让用户觉得准 ===== */}
          <div className="card-warm rounded-2xl p-8 text-center border-[rgba(184,134,11,0.15)] border-2">
            <p className="text-xs text-[#b8860b] tracking-[0.2em] uppercase mb-2">Your Day Master · 日主</p>
            <h2 className="text-4xl font-bold text-[#2c2416] mb-1 font-serif">{result.dayMaster}</h2>
            <p className="text-[#6b5e4a] text-sm">{result.dayMasterElement} · {result.dayMasterYinYang}</p>
            <div className="mt-4 pt-4 border-t border-[rgba(184,134,11,0.1)]">
              <p className="text-sm text-[#6b5e4a] italic">&ldquo;{result.personalityTraits[0]}&rdquo;</p>
            </div>
          </div>

          {/* ===== 2. 四柱（快速展示） ===== */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {pillars.map((p, i) => <PillarCard key={i} pillar={p} index={i} />)}
          </div>

          {/* ===== 3. ✨ 邮箱收集 — 在最关键的位置 ===== */}
          {!emailSubmitted ? (
            <div className="card-warm rounded-2xl p-8 border-2 border-[#b8860b] shadow-lg shadow-[rgba(184,134,11,0.08)] bg-gradient-to-b from-[#faf8f4] to-white text-center">
              <div className="text-4xl mb-3">🔮</div>
              <h3 className="text-xl font-bold text-[#2c2416] mb-2">Your Full Analysis Awaits</h3>
              <p className="text-sm text-[#6b5e4a] mb-6 max-w-sm mx-auto">
                Enter your email to unlock your complete profile — Five Elements balance, personality traits, career & love insights, and pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => onEmailChange(e.target.value)}
                  placeholder="your@email.com"
                  className="input-mystic flex-1 text-sm py-3 text-center sm:text-left"
                  autoFocus
                />
                <button
                  onClick={onEmailSubmit}
                  disabled={!email || !email.includes('@')}
                  className="btn-gold px-6 py-3 text-sm whitespace-nowrap"
                >
                  Unlock Results →
                </button>
              </div>
              <p className="text-[10px] text-[#9b8e7c] mt-4">No spam. Unsubscribe anytime.</p>
            </div>
          ) : (
            <>
              {/* ===== 4. 输完邮箱后显示完整内容 ===== */}
              <div className="text-center">
                <span className="inline-flex items-center gap-2 text-emerald-600 text-sm bg-[rgba(76,175,80,0.06)] px-4 py-2 rounded-full">
                  <span>✓</span> Email saved — here&apos;s your full analysis
                </span>
              </div>

              {/* Element Profile */}
              <ElementBarChart elements={result.elements} />

              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm justify-center">
                <span className="text-emerald-600">✦ Lucky: {result.luckyElement}</span>
                <span className="text-[#ccc0a8]">|</span>
                <span className="text-[#6b5e4a]">Balance: {result.unfavorableElement}</span>
              </div>

              {/* Personality */}
              <div className="card-warm rounded-2xl p-6">
                <h3 className="font-semibold text-[#2c2416] mb-4">Personality Profile · 性格</h3>
                <ul className="space-y-2.5">
                  {result.personalityTraits.map((trait, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#6b5e4a] leading-relaxed">
                      <span className="text-[#b8860b] mt-0.5 shrink-0">✦</span>
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Summary */}
              <div className="card-warm rounded-2xl p-6 border-l-4 border-[#b8860b]">
                <p className="text-sm text-[#6b5e4a] leading-relaxed">{result.summary}</p>
              </div>

              {/* 引导到价格 */}
              <div className="text-center pt-4">
                <p className="text-sm text-[#6b5e4a] animate-pulse-glow">
                  📜 Ready to get your full PDF report? <span className="text-[#b8860b] font-semibold">Scroll down for pricing →</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
