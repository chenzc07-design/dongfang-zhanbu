export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-10 bg-[#f9fafb]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center gap-6 mb-4">
            <a href="/blog" className="text-[11px] text-[#9ca3af] hover:text-[#7c3aed] transition-colors">Insights</a>
            <span className="text-[#d1d5db] text-[11px]">·</span>
            <a href="/blog" className="text-[11px] text-[#9ca3af] hover:text-[#7c3aed] transition-colors">Blog</a>
            <span className="text-[#d1d5db] text-[11px]">·</span>
            <a href="mailto:support@dongfangdivination.com" className="text-[11px] text-[#9ca3af] hover:text-[#7c3aed] transition-colors">Contact</a>
          </div>
          <p className="text-[11px] text-[#9ca3af]">
            Dongfang Divination · Authentic BaZi Life Blueprint Analysis
          </p>
          <p className="text-[10px] text-[#9ca3af] max-w-lg mx-auto leading-relaxed mt-3">
            Based on the ancient Chinese Four Pillars of Destiny (BaZi) methodology.
            For personal growth and self-reflection purposes. Not a substitute for professional advice.
          </p>
          <p className="text-[10px] text-[#9ca3af] mt-2">
            © {new Date().getFullYear()} Dongfang Divination. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
