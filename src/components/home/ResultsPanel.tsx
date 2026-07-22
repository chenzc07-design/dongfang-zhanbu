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
    <section id="reading" className="py-20 md:py-24 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeading label="Your Reading" title="Your BaZi Chart" className="mb-10" />

        <div className="space-y-6 stagger-animate">
          {/* Day Master */}
          <div className="card-warm rounded-2xl p-8 text-center">
            <p className="text-xs text-[#7c3aed] tracking-[0.2em] uppercase mb-2">Your Day Master · 日主</p>
            <h2 className="text-4xl font-bold text-[#1f2937] mb-1">{result.dayMaster}</h2>
            <p className="text-[#6b7280] text-sm">{result.dayMasterElement} · {result.dayMasterYinYang}</p>
          </div>

          {/* Four Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {pillars.map((p, i) => <PillarCard key={i} pillar={p} index={i} />)}
          </div>

          {/* Element Profile */}
          <ElementBarChart elements={result.elements} />

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm justify-center">
            <span className="text-emerald-600">✦ Lucky: {result.luckyElement}</span>
            <span className="text-[#d1d5db]">|</span>
            <span className="text-[#6b7280]">Balance: {result.unfavorableElement}</span>
          </div>

          {/* ★ 邮件收集框 — 放在四柱结果紧下方，用户不会错过 */}
          <div id="email-capture" className="scroll-mt-20">
            {!emailSubmitted && (
              <div className="card-warm rounded-2xl p-6 border-2 border-purple-100 bg-gradient-to-br from-purple-50/50 to-white">
                <div className="flex items-start gap-4">
                  {/* 左侧图标 */}
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-[#7c3aed] flex items-center justify-center text-white text-lg shadow-md shadow-purple-200">
                    📜
                  </div>
                  {/* 右侧内容 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1f2937] mb-1.5">Unlock Your Complete Life Blueprint</h3>
                    <p className="text-sm text-[#6b7280] mb-4">
                      Get your full 20+ page PDF report with career, relationship & wealth guidance — delivered to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="email"
                        value={email}
                        onChange={e => onEmailChange(e.target.value)}
                        placeholder="your@email.com"
                        className="input-mystic flex-1 text-sm"
                        onKeyDown={e => { if (e.key === 'Enter') onEmailSubmit(); }}
                      />
                      <button
                        onClick={onEmailSubmit}
                        disabled={!email || !email.includes('@')}
                        className="btn-gold px-6 py-2.5 text-sm whitespace-nowrap"
                      >
                        Continue to Pricing →
                      </button>
                    </div>
                    <p className="text-xs text-[#9ca3af] mt-3">
                      🔒 One-time purchase · Instant PDF delivery · No subscription
                    </p>
                  </div>
                </div>
              </div>
            )}

            {emailSubmitted && (
              <div className="text-center py-4">
                <span className="inline-flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 px-5 py-2.5 rounded-full font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Email confirmed — scroll down for pricing
                </span>
              </div>
            )}
          </div>

          {/* Personality */}
          <div className="card-warm rounded-2xl p-6">
            <h3 className="font-semibold text-[#1f2937] mb-4">Personality Profile · 性格</h3>
            <ul className="space-y-2.5">
              {result.personalityTraits.map((trait, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#6b7280] leading-relaxed">
                  <span className="text-[#7c3aed] mt-0.5 shrink-0">✦</span>
                  {trait}
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="card-warm rounded-2xl p-6 border-l-4 border-[#7c3aed]">
            <p className="text-sm text-[#6b7280] leading-relaxed">{result.summary}</p>
          </div>

          {/* ★ 底部再次出现邮件入口 — 看完所有内容后的第二次转化机会 */}
          {!emailSubmitted && (
            <div className="text-center pt-2 pb-4">
              <p className="text-sm text-[#9ca3af] mb-3">
                Ready to get your personalized report?
              </p>
              <a
                href="#email-capture"
                className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm"
              >
                📜 Unlock Your Full Report →
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
