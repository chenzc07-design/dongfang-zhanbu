import SectionHeading from '../ui/SectionHeading';

const STEPS = [
  {
    num: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Enter Your Details',
    desc: 'Your birth date, time, and place — the ancient keys that unlock your unique cosmic signature.',
  },
  {
    num: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
      </svg>
    ),
    title: 'AI Analyzes Your Chart',
    desc: 'Advanced algorithms compute your Four Pillars, Five Elements balance, and Day Master — instantly.',
  },
  {
    num: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8m8 4H8m2-8H8" />
      </svg>
    ),
    title: 'Receive Your Blueprint',
    desc: 'Get a comprehensive 20+ page personalized Life Blueprint PDF with actionable guidance.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-24 bg-[#f7f3ec]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="The Process"
          title="How It Works"
          subtitle="Ancient wisdom decoded through modern technology"
          className="mb-14"
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {STEPS.map(s => (
            <div key={s.num} className="card-warm rounded-2xl p-8 text-center group">
              <span className="text-5xl font-bold text-[rgba(184,134,11,0.06)]">{s.num}</span>
              <div className="my-4 text-[#b8860b] flex justify-center group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </div>
              <h3 className="font-semibold text-[#2c2416] text-lg mb-3">{s.title}</h3>
              <p className="text-sm text-[#6b5e4a] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
