import type { ElementProfile } from '@/lib/types';

const ELEMENT_COLORS: Record<string, { bar: string; emoji: string; name: string; cn: string }> = {
  Wood: { bar: 'bg-emerald-500', emoji: '🌳', name: 'Wood', cn: '木' },
  Fire: { bar: 'bg-red-500', emoji: '🔥', name: 'Fire', cn: '火' },
  Earth: { bar: 'bg-amber-500', emoji: '⛰️', name: 'Earth', cn: '土' },
  Metal: { bar: 'bg-gray-400', emoji: '⚔️', name: 'Metal', cn: '金' },
  Water: { bar: 'bg-blue-500', emoji: '🌊', name: 'Water', cn: '水' },
};

export default function ElementBarChart({ elements }: { elements: ElementProfile }) {
  const elementArray = [
    { name: 'Wood', score: elements.wood },
    { name: 'Fire', score: elements.fire },
    { name: 'Earth', score: elements.earth },
    { name: 'Metal', score: elements.metal },
    { name: 'Water', score: elements.water },
  ];
  const maxScore = Math.max(...elementArray.map(e => e.score), 1);

  return (
    <div className="card-warm rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[#7c3aed] text-lg">☯</span>
        <h3 className="font-semibold text-[#1f2937]">Five Elements Profile · 五行能量</h3>
      </div>
      <div className="space-y-3">
        {elementArray.map(el => {
          const s = ELEMENT_COLORS[el.name];
          const pct = (el.score / maxScore) * 100;
          return (
            <div key={el.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#6b7280]">{s.emoji} {s.name} {s.cn}</span>
                <span className="text-xs text-[#9ca3af]">{el.score.toFixed(1)}</span>
              </div>
              <div className="h-2 bg-[#f0ebe0] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ease-out ${s.bar}`}
                  style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
