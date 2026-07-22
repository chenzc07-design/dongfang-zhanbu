import SectionHeading from '../ui/SectionHeading';
import Link from 'next/link';

const FEATURED_ARTICLES = [
  {
    slug: 'bazi-vs-chinese-zodiac',
    title: 'Why BaZi is More Than Just Astrology: The Science of Timing',
    excerpt: 'Unlike Western astrology which maps planetary positions, BaZi decodes the elemental energies present at your birth — offering a precise framework for strategic life timing and personal energy management.',
    category: 'BaZi Fundamentals',
    readTime: '8 min',
  },
  {
    slug: 'ten-bazi-day-masters-archetypes',
    title: 'Understanding Your Day Master: The Key to Career Success',
    excerpt: 'Your Day Master reveals your core personality archetype. Discover how each of the ten Day Masters shapes your natural strengths, leadership style, and optimal career path.',
    category: 'Self-Discovery',
    readTime: '10 min',
  },
  {
    slug: 'chinese-horoscope-2026-fire-horse',
    title: '2026 Fire Horse Year: How to Navigate the Upcoming Energy Shift',
    excerpt: 'The Year of the Fire Horse brings dynamic, transformative energy. Learn what this means for each element type and how to position yourself for success during this powerful period.',
    category: 'Annual Forecast',
    readTime: '7 min',
  },
];

export default function KnowledgeHub() {
  return (
    <section id="insights" className="section-padding">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Knowledge Hub"
          title="Latest Insights"
          subtitle="Explore the ancient wisdom behind modern Life Blueprint Analysis"
          className="mb-14"
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURED_ARTICLES.map(article => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="card-warm rounded-2xl p-6 group flex flex-col transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] text-[#b8860b] tracking-wider uppercase font-medium bg-[rgba(184,134,11,0.06)] px-2.5 py-1 rounded-full">
                  {article.category}
                </span>
                <span className="text-[10px] text-[#9b8e7c]">{article.readTime} read</span>
              </div>
              <h3 className="text-[#2c2416] font-semibold text-base leading-snug mb-3 group-hover:text-[#b8860b] transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-[#6b5e4a] leading-relaxed flex-1">
                {article.excerpt}
              </p>
              <div className="mt-4 pt-4 border-t border-[rgba(184,134,11,0.06)]">
                <span className="text-xs text-[#b8860b] font-medium tracking-wide group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Read Article
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="btn-ghost inline-flex items-center gap-2 text-sm"
          >
            View All Insights
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
