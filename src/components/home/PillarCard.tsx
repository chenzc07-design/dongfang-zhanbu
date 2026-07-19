import type { Pillar } from '@/lib/types';

const ELEMENT_BADGES: Record<string, string> = {
  Wood: 'badge-wood',
  Fire: 'badge-fire',
  Earth: 'badge-earth',
  Metal: 'badge-metal',
  Water: 'badge-water',
};

const PILLAR_NAMES = ['年 Year', '月 Month', '日 Day', '时 Hour'];

interface PillarCardProps {
  pillar: Pillar;
  index: number;
}

export default function PillarCard({ pillar, index }: PillarCardProps) {
  const badgeClass = ELEMENT_BADGES[pillar.stemElement] || 'badge-wood';

  return (
    <div className="glass-card rounded-xl p-4 text-center">
      <p className="text-[10px] text-[#7e7264] tracking-wider uppercase mb-3">{PILLAR_NAMES[index]}</p>
      <p className="text-lg font-bold text-[#c9a84c]">{pillar.stem.split(' (')[0]}</p>
      <p className="text-xs text-[#9b8e7c] mb-3">{pillar.branch}</p>
      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-medium ${badgeClass}`}>
        {pillar.stemElement}
      </span>
    </div>
  );
}
