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

export default function ResultsPanel({
  result,
  email,
  emailSubmitted,
  onEmailChange,
  onEmailSubmit,
}: ResultsPanelProps) {
  const pillars = [result.yearPillar, result.monthPillar, result.dayPillar, result.hourPillar];

  return (
    <section id="reading" className="py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Your Reading"
          title="Your BaZi Chart"
          className="mb-10"
        />

        <div className="space-y-6 stagger-animate">
          {/* Day Master */}
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-xs text-[#c9a84c] tracking-[0.2em] uppercase mb-2">Your Day Master · 日主</p>
            <h2 className="text-4xl font-bold text-[#ede4d8] mb-1 font-serif">{result.dayMaster}</h2>
            <p className="text-[#9b8e7c] text-sm">{result.dayMasterElement} · {result.dayMasterYinYang}</p>
          </div>

          {/* Four Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {pillars.map((p, i) => (
              <PillarCard key={i} pillar={p} index={i} />
            ))}
          </div>

          {/* Element Profile */}
          <ElementBarChart elements={result.elements} />

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm justify-center">
            <span className="text-emerald-400">✦ Lucky: {result.luckyElement}</span>
            <span className="text-[#3e3224]">|</span>
            <span className="text-[#9b8e7c]">Balance: {result.unfavorableElement}</span>
          </div>

          {/* Personality */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-[#ede4d8] mb-4">Personality Profile · 性格</h3>
            <ul className="space-y-2.5">
              {result.personalityTraits.map((trait, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#9b8e7c] leading-relaxed">
                  <span className="text-[#c9a84c] mt-0.5 shrink-0">✦</span>
                  {trait}
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="glass-card rounded-2xl p-6 border-l-2 border-[#c9a84c]">
            <p className="text-sm text-[#9b8e7c] leading-relaxed">{result.summary}</p>
          </div>

          {/* Email capture */}
          {!emailSubmitted && (
            <div className="glass-card rounded-2xl p-6 border border-[rgba(201,168,76,0.15)]">
              <h3 className="font-semibold text-[#ede4d8] mb-2">📜 Unlock Your Full Report</h3>
              <p className="text-sm text-[#9b8e7c] mb-4">
                Enter your email to see pricing and get your complete 20+ page PDF destiny report.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => onEmailChange(e.target.value)}
                  placeholder="your@email.com"
                  className="input-mystic flex-1 text-sm"
                />
                <button
                  onClick={onEmailSubmit}
                  disabled={!email || !email.includes('@')}
                  className="btn-gold px-5 py-2.5 text-sm whitespace-nowrap"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {emailSubmitted && (
            <div className="text-center py-2">
              <span className="inline-flex items-center gap-2 text-emerald-400 text-sm bg-[rgba(76,175,80,0.08)] px-4 py-2 rounded-full">
                <span>✓</span> Email saved — scroll down for pricing
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
