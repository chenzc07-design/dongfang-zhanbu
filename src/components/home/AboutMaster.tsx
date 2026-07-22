import SectionHeading from '../ui/SectionHeading';

const STATS = [
  { icon: '✦', title: '25+ Years of Mastery', desc: 'Formal disciple at age 12 · Orthodox lineage · Esoteric arts specialist' },
  { icon: '◇', title: 'I Ching Scholar', desc: 'Master\'s degree in 《周易》· Ancient Chinese Geomancy research' },
  { icon: '☯', title: 'Certified Senior Consultant', desc: '高级预测风水师 · Chinese Metaphysics Research Association' },
  { icon: '★', title: 'Founder: 道易天机国学馆', desc: 'Physical Daoist studio · Clients worldwide' },
];

export default function AboutMaster() {
  return (
    <section id="about" className="py-20 md:py-24 bg-[#f7f3ec]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Meet the Consultant"
          title="Master Gao Wei · 高伟"
          subtitle="Senior Metaphysics Consultant & I Ching Scholar"
          className="mb-14"
        />

        <div className="grid md:grid-cols-5 gap-10 items-start">
          {/* Portrait */}
          <div className="md:col-span-2">
            <div className="card-warm rounded-2xl overflow-hidden">
              <div className="aspect-[3/4] bg-[#f7f3ec] flex items-center justify-center">
                <div className="text-center">
                  <span className="text-7xl">☯</span>
                  <p className="text-[#9b8e7c] text-xs mt-4">Master Gao Wei</p>
                  <p className="text-[#ccc0a8] text-[10px] mt-1">高伟老师</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-3 space-y-6">
            <div className="space-y-4">
              <p className="text-[#6b5e4a] leading-relaxed text-sm">
                Born in 1985 in Daying County, Sichuan — a region renowned for its deep mystical heritage —{' '}
                <span className="text-[#b8860b] font-medium">Master Gao Wei</span> embarked on his path into the
                esoteric arts at the age of twelve, accepted as a formal disciple by an eminent Daoist master.
              </p>
              <p className="text-[#6b5e4a] leading-relaxed text-sm">
                He earned a <strong className="text-[#2c2416] font-medium">Master&apos;s degree</strong> specializing
                in the <strong className="text-[#2c2416] font-medium">I Ching (《周易》)</strong> and{' '}
                <strong className="text-[#2c2416] font-medium">Ancient Chinese Geomancy (堪舆文化)</strong>,
                bridging classical scholarship with practical metaphysical application.
              </p>
              <p className="text-[#6b5e4a] leading-relaxed text-sm">
                For over <strong className="text-[#b8860b]">25 years</strong>, Master Gao has devoted himself to the
                rigorous study and practice of the{' '}
                <span className="text-[#2c2416]">Four Pillars of Destiny (八字)</span>,{' '}
                <span className="text-[#2c2416]">Feng Shui (风水)</span>,{' '}
                <span className="text-[#2c2416]">divination (占卜)</span>, and{' '}
                <span className="text-[#2c2416]">metaphysical sciences (术数)</span>.
                His consultations are distinguished by their remarkable accuracy — a synthesis of orthodox
                methodology and profound intuitive perception.
              </p>
            </div>

            {/* Credential Cards */}
            <div className="grid sm:grid-cols-2 gap-3">
              {STATS.map(item => (
                <div key={item.title} className="card-warm rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-[#b8860b] text-xl shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-[#2c2416] text-sm font-semibold">{item.title}</p>
                      <p className="text-[#9b8e7c] text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="card-warm rounded-xl p-5 border-l-2 border-[#b8860b] bg-gradient-to-r from-[rgba(184,134,11,0.04)] to-transparent">
              <p className="text-sm text-[#6b5e4a] italic leading-relaxed">
                &ldquo;The Four Pillars do not predict a fixed fate — they reveal the energy currents
                you were born into. My purpose is to help you navigate them with clarity and confidence.&rdquo;
                <span className="block text-[#9b8e7c] text-xs mt-2">— Master Gao Wei · 高伟老师</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
