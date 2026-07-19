import SectionHeading from '../ui/SectionHeading';
import MasterPortrait from './MasterPortrait';

const STATS = [
  { icon: '✦', title: '25 Years of Mastery', desc: '12岁拜师 · 正统传承 · 术数专家' },
  { icon: '◇', title: 'Master\'s Degree', desc: '《周易》· 古代堪舆文化 学术研究' },
  { icon: '☯', title: 'Certified Senior Master', desc: '高级预测风水师 · 大英易学文化研究会' },
  { icon: '★', title: 'Founder: 道易天机国学馆', desc: '实体道场 · 海内外客户众多' },
];

export default function AboutMaster() {
  return (
    <section id="about" className="py-20 md:py-24 bg-[#f7f3ec]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading label="Meet the Master" title="Master Gao Wei · 高伟" className="mb-12" />

        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-2">
            <MasterPortrait />
          </div>

          <div className="md:col-span-3 space-y-5">
            <div>
              <p className="text-[#6b5e4a] leading-relaxed text-sm">
                Born in 1985 in Daying County, Sichuan — a land steeped in mystical traditions —
                Master Gao Wei began his journey into the esoteric arts at the age of twelve,
                when he was accepted as a formal disciple of a renowned Taoist master.
                He went on to earn a{' '}
                <strong className="text-[#2c2416] font-semibold">Master&apos;s degree</strong> with a focus on
                the <strong className="text-[#2c2416] font-semibold">I Ching (《周易》)</strong> and
                <strong className="text-[#2c2416] font-semibold"> Ancient Chinese Geomancy (堪舆文化)</strong>.
              </p>
              <p className="text-[#6b5e4a] leading-relaxed text-sm mt-3">
                For over <strong className="text-[#b8860b]">25 years</strong>, Master Gao has dedicated himself
                to the rigorous study and practice of the Four Pillars of Destiny (八字),
                Feng Shui (风水), divination (占卜), and metaphysical sciences (术数).
                His readings are known for their uncanny precision, blending classical methodology
                with a profound intuitive gift.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {STATS.map(item => (
                <div key={item.title} className="card-warm rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-[#b8860b] text-xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-[#2c2416] text-sm font-semibold">{item.title}</p>
                      <p className="text-[#9b8e7c] text-xs">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-warm rounded-xl p-4 border-l-4 border-[#b8860b]">
              <p className="text-sm text-[#6b5e4a] italic leading-relaxed">
                &ldquo;The Four Pillars do not predict a fixed fate — they reveal the melody
                you were born to dance to. My calling is to help you hear it.&rdquo;
                <span className="block text-[#9b8e7c] text-xs mt-1">— Master Gao Wei · 高伟老师</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
