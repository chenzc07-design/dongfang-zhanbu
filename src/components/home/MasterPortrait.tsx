export default function MasterPortrait() {
  return (
    <div className="relative">
      {/* 光晕 */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.15), rgba(124,92,191,0.1), transparent)',
        }}
      />

      {/* 照片 */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden ornate-frame">
        <img
          src="/master/portrait.png"
          alt="Master Gao Wei"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* 角标 */}
      <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-[#c9a84c] to-[#a67c35] text-[#06080d] px-5 py-2.5 rounded-xl font-semibold text-sm shadow-xl shadow-[rgba(201,168,76,0.2)]">
        高伟老师
      </div>
    </div>
  );
}
