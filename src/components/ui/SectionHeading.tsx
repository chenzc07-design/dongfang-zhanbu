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
        <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-200" />
        <span className="text-[#7c3aed] text-[11px] tracking-[0.25em] uppercase font-medium">{label}</span>
        <div className="w-10 h-px bg-gradient-to-r from-purple-200 to-transparent" />
      </div>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1f2937]">{title}</h2>
      {subtitle && <p className="text-[#6b7280] text-sm mt-3 max-w-lg mx-auto">{subtitle}</p>}
    </div>
  );
}
