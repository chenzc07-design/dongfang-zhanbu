interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({ label, title, subtitle, className = '' }: SectionHeadingProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-[rgba(184,134,11,0.3)]" />
        <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-medium">{label}</span>
        <div className="w-8 h-px bg-gradient-to-r from-[rgba(184,134,11,0.3)] to-transparent" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#2c2416] font-serif">{title}</h2>
      {subtitle && <p className="text-[#6b5e4a] text-sm mt-2">{subtitle}</p>}
    </div>
  );
}
