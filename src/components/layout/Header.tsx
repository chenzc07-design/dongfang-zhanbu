'use client';

import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: '#reading', label: 'Reading' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: 'Master' },
    { href: '#insights', label: 'Insights' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <span className="text-2xl">☯</span>
          <div>
            <span className="font-semibold text-[#1f2937] tracking-wide">Dongfang Divination</span>
            <span className="hidden sm:inline text-sm text-[#9ca3af] ml-2">· Authentic BaZi Reading</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm text-[#6b7280]">
          {navItems.map(item => (
            <a key={item.href} href={item.href} className="hover:text-[#7c3aed] transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#6b7280] hover:text-[#7c3aed] p-2"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl">
          <nav className="flex flex-col py-3 px-4 gap-1">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-[#6b7280] hover:text-[#7c3aed] py-3 px-3 rounded-lg hover:bg-purple-50 transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
