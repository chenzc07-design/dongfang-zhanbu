export default function Footer() {
  return (
    <footer className="border-t border-[rgba(201,168,76,0.05)] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <GoldDivider className="mb-6" />
        <div className="text-center">
          <div className="flex justify-center gap-6 mb-3">
            <a href="/blog" className="text-[11px] text-[#7e7264] hover:text-[#c9a84c] transition-colors">
              Blog
            </a>
            <span className="text-[#3e3224] text-[11px]">·</span>
            <a href="mailto:support@dongfang.com" className="text-[11px] text-[#7e7264] hover:text-[#c9a84c] transition-colors">
              Contact
            </a>
          </div>
          <p className="text-[11px] text-[#4e4234]">
            © {new Date().getFullYear()} 东方古老占卜 · Ancient Eastern Divination
          </p>
          <p className="text-[10px] text-[#3e3224] max-w-lg mx-auto leading-relaxed mt-3">
            东方古老占卜 · Based on ancient Chinese Four Pillars of Destiny (Ba Zi) methodology.
            For entertainment and self-reflection purposes only. Your data is never shared.
          </p>
        </div>
      </div>
    </footer>
  );
}

function GoldDivider({ className = '' }: { className?: string }) {
  return <div className={`gold-divider ${className}`} />;
}
