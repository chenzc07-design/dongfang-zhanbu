import type { ElementProfile } from '@/lib/types';

const ELEMENT_COLORS: Record<string, { bar: string; emoji: string; name: string; cn: string }> = {
  Wood: { bar: 'bg-emerald-500/80', emoji: '🌳', name: 'Wood', cn: '木' },
  Fire: { bar: 'bg-red-500/80', emoji: '🔥', name: 'Fire', cn: '火' },
  Earth: { bar: 'bg-amber-500/80', emoji: '⛰️', name: 'Earth', cn: '土' },
  Metal: { bar: 'bg-zinc-300/80', emoji: '⚔️', name: 'Metal', cn: '金' },
  Water: { bar: 'bg-blue-500/80', emoji: '🌊', name: 'Water', cn: '水' },
};

interface ElementBarChartProps {
  elements: ElementProfile;
}

export default function ElementBarChart({ elements }: ElementBarChartProps) {
  const elementArray = [
    { name: 'Wood', score: elements.wood },
    { name: 'Fire', score: elements.fire },
    { name: 'Earth', score: elements.earth },
    { name: 'Metal', score: elements.metal },
    { name: 'Water', score: elements.water },
  ];

  const maxScore = Math.max(...elementArray.map(e => e.score), 1);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[#c9a84c] text-lg">☯</span>
        <h3 className="font-semibold text-[#ede4d8]">Element Profile · 五行</h3>
      </div>
      <div className="space-y-3">
        {elementArray.map(el => {
          const s = ELEMENT_COLORS[el.name];
          const pct = (el.score / maxScore) * 100;
          return (
            <div key={el.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#9b8e7c]">{s.emoji} {s.name} {s.cn}</span>
                <span className="text-xs text-[#7e7264]">{el.score.toFixed(1)}</span>
              </div>
              <div className="h-2 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${s.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
