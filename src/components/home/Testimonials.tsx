import SectionHeading from '../ui/SectionHeading';

const TESTIMONIALS = [
  {
    quote: 'The BaZi reading was incredibly accurate. It described my personality and career path in ways that truly resonated. I was skeptical at first, but now I\'m a believer.',
    name: 'Sarah M.',
    location: 'New York, USA',
  },
  {
    quote: 'Master Gao\'s report gave me clarity during a difficult career transition. The timing advice was spot-on — I waited for the right moment and landed my dream job.',
    name: 'James L.',
    location: 'London, UK',
  },
  {
    quote: 'I ordered the Premium Bundle and was blown away by the depth. The crystal recommendations and monthly forecasts have become part of my daily routine.',
    name: 'Emily R.',
    location: 'Sydney, Australia',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-24 border-t border-[rgba(201,168,76,0.05)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Testimonials"
          title="What Our Clients Say"
          subtitle="Real experiences from people who discovered their destiny"
          className="mb-12"
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="text-[#c9a84c] text-3xl font-serif mb-4 opacity-50">&ldquo;</div>
              <p className="text-sm text-[#9b8e7c] leading-relaxed mb-5 italic">
                {t.quote}
              </p>
              <div className="border-t border-[rgba(201,168,76,0.08)] pt-4">
                <p className="text-[#ede4d8] text-sm font-semibold">{t.name}</p>
                <p className="text-[#7e7264] text-xs">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
