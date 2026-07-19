export default function Footer() {
  return (
    <footer className="border-t border-[rgba(184,134,11,0.06)] py-8 bg-[#f5f0e8]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center gap-6 mb-3">
            <a href="/blog" className="text-[11px] text-[#9b8e7c] hover:text-[#b8860b] transition-colors">Blog</a>
            <span className="text-[#9b8e7c] text-[11px]">·</span>
            <a href="mailto:support@dongfang.com" className="text-[11px] text-[#9b8e7c] hover:text-[#b8860b] transition-colors">Contact</a>
          </div>
          <p className="text-[11px] text-[#9b8e7c]">
            © {new Date().getFullYear()} 东方古老占卜 · Ancient Eastern Divination
          </p>
          <p className="text-[10px] text-[#9b8e7c] max-w-lg mx-auto leading-relaxed mt-3">
            Based on ancient Chinese Four Pillars of Destiny (Ba Zi) methodology.
            For entertainment and self-reflection purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
