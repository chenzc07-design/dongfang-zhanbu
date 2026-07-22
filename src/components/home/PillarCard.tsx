const PILLAR_NAMES = ['Year 年', 'Month 月', 'Day 日', 'Hour 时'];

interface PillarCardProps {
  pillar: {
    stem: string;
    branch: string;
    stemElement: string;
  };
  index: number;
}

export default function PillarCard({ pillar, index }: PillarCardProps) {
  return (
    <div className="card-warm rounded-xl p-4 text-center">
      <p className="text-[10px] text-[#9b8e7c] tracking-wider uppercase mb-3">{PILLAR_NAMES[index]}</p>
      <p className="text-lg font-bold text-[#b8860b]">{pillar.stem.split(' (')[0]}</p>
      <p className="text-xs text-[#6b5e4a] mb-3">{pillar.branch}</p>
      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-medium
        ${pillar.stemElement === 'Wood' ? 'badge-wood' : ''}
        ${pillar.stemElement === 'Fire' ? 'badge-fire' : ''}
        ${pillar.stemElement === 'Earth' ? 'badge-earth' : ''}
        ${pillar.stemElement === 'Metal' ? 'badge-metal' : ''}
        ${pillar.stemElement === 'Water' ? 'badge-water' : ''}
      `}>
        {pillar.stemElement}
      </span>
    </div>
  );
}
