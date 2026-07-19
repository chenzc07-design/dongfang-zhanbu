interface StepCardProps {
  num: string;
  icon: string;
  title: string;
  desc: string;
}

export default function StepCard({ num, icon, title, desc }: StepCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 text-center group transition-all duration-500">
      <span className="text-5xl font-serif font-bold text-[#c9a84c] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500">
        {num}
      </span>
      <div className="text-3xl mt-2 mb-3">{icon}</div>
      <h3 className="font-semibold text-[#ede4d8] text-base mb-2">{title}</h3>
      <p className="text-sm text-[#9b8e7c] leading-relaxed">{desc}</p>
    </div>
  );
}
