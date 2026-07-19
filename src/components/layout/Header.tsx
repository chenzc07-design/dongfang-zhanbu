export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(184,134,11,0.08)] bg-[rgba(250,248,244,0.92)] backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">☯</span>
          <div>
            <span className="font-semibold text-[#2c2416] tracking-wide">东方古老占卜</span>
            <span className="hidden sm:inline text-sm text-[#9b8e7c] ml-2">· Ancient Eastern Divination</span>
          </div>
        </div>
        <nav className="flex gap-6 text-sm text-[#6b5e4a]">
          <a href="#about" className="hover:text-[#b8860b] transition-colors">Master</a>
          <a href="#gallery" className="hover:text-[#b8860b] transition-colors">Gallery</a>
          <a href="#reading" className="hover:text-[#b8860b] transition-colors">Reading</a>
          <a href="#pricing" className="hover:text-[#b8860b] transition-colors">Pricing</a>
        </nav>
      </div>
    </header>
  );
}
