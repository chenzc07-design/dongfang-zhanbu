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
    <section className="py-20 md:py-24 bg-[#f9fafb]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Testimonials"
          title="What Our Clients Say"
          subtitle="Real experiences from people who discovered their destiny"
          className="mb-12"
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card-warm rounded-2xl p-6">
              <div className="text-[#7c3aed] text-3xl font-serif mb-4 opacity-40">&ldquo;</div>
              <p className="text-sm text-[#6b7280] leading-relaxed mb-5 italic">{t.quote}</p>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-[#1f2937] text-sm font-semibold">{t.name}</p>
                <p className="text-[#9ca3af] text-xs">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
