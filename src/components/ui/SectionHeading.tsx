import type { ReactNode } from 'react';

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
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.3)]" />
        <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">{label}</span>
        <div className="w-8 h-px bg-gradient-to-r from-[rgba(201,168,76,0.3)] to-transparent" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#ede4d8] font-serif">{title}</h2>
      {subtitle && <p className="text-[#9b8e7c] text-sm mt-2">{subtitle}</p>}
    </div>
  );
}
