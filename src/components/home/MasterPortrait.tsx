export default function MasterPortrait() {
  return (
    <div className="relative">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden ornate-frame">
        <img src="/master/portrait.png" alt="Master Gao Wei"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
      </div>
      <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-[rgba(124,58,237,0.2)]">
        高伟老师
      </div>
    </div>
  );
}
