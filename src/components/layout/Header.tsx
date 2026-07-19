'use client';

import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Master', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reading', href: '#reading' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 transition-all duration-500 ${
        scrolled
          ? 'border-b border-[rgba(201,168,76,0.08)] bg-[rgba(6,8,13,0.92)] backdrop-blur-xl shadow-[0_1px_20px_rgba(124,92,191,0.05)]'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl opacity-80">☯</span>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-[#ede4d8] tracking-wide text-base">东方古老占卜</span>
            <span className="hidden sm:inline text-[11px] text-[#7e7264] font-light tracking-wider">Ancient Eastern Divination</span>
          </div>
        </div>
        <nav className="flex gap-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-3 py-1.5 text-xs text-[#9b8e7c] hover:text-[#c9a84c] transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#c9a84c] transition-all duration-300 group-hover:w-2/3" />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
