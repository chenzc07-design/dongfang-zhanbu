import { getAllPosts, type BlogPost } from '@/lib/blog';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights — Dongfang Divination | BaZi Knowledge Hub',
  description: 'Explore the ancient wisdom of BaZi (八字) Life Blueprint Analysis. Articles on Four Pillars, Five Elements, energy navigation, and strategic life guidance.',
  keywords: ['BaZi blog', 'Chinese astrology articles', 'Four Pillars guide', 'Five Elements explained', 'Life Blueprint analysis'],
  openGraph: {
    title: 'BaZi Insights — Dongfang Divination Knowledge Hub',
    description: 'Explore the ancient wisdom of BaZi Life Blueprint Analysis',
    type: 'website',
    images: [{ url: 'https://dongfangdivination.com/og-image.png', width: 1200, height: 630 }],
  },
};

const categoryColors: Record<string, string> = {
  'BaZi Basics': 'text-[#7c3aed] bg-purple-50 border-purple-200',
  'Five Elements': 'text-[#388e3c] bg-[rgba(76,175,80,0.08)] border-[rgba(76,175,80,0.15)]',
  'Fortune & Destiny': 'text-[#d32f2f] bg-[rgba(244,67,54,0.08)] border-[rgba(244,67,54,0.15)]',
  'Career & Wealth': 'text-[#7c3aed] bg-purple-50 border-purple-200',
  'Relationships': 'text-[#7b1fa2] bg-[rgba(206,147,216,0.1)] border-[rgba(206,147,216,0.15)]',
  'General': 'text-[#1976d2] bg-[rgba(144,202,249,0.1)] border-[rgba(144,202,249,0.15)]',
  'BaZi Astrology': 'text-[#7c3aed] bg-purple-50 border-purple-200',
  'Annual Forecast': 'text-[#d32f2f] bg-[rgba(244,67,54,0.08)] border-[rgba(244,67,54,0.15)]',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <Link href="/" className="inline-block text-[#9ca3af] hover:text-[#7c3aed] text-sm mb-6 transition-colors">
            ← Back to Dongfang Divination
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-200" />
            <span className="text-[#7c3aed] text-xs tracking-[0.3em] uppercase font-medium">Knowledge Hub</span>
            <div className="w-10 h-px bg-gradient-to-r from-purple-200 to-transparent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1f2937] mb-4">
            Ancient Wisdom Insights
          </h1>
          <p className="text-[#6b7280] text-base max-w-xl mx-auto leading-relaxed">
            Explore the depths of BaZi Life Blueprint Analysis — Four Pillars of Destiny,
            Five Elements energy dynamics, and practical guidance for strategic life navigation.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6b7280] text-lg">No posts yet. Ancient wisdom is being transcribed...</p>
            <p className="text-[#9ca3af] text-sm mt-2">Check back soon for new articles.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post, idx) => (
              <BlogCard key={post.slug} post={post} index={idx} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-100 text-center">
          <Link href="/" className="text-[#9ca3af] hover:text-[#7c3aed] text-sm transition-colors">
            Dongfang Divination · Authentic BaZi Life Blueprint Analysis
          </Link>
        </footer>
      </div>
    </div>
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const catClass = categoryColors[post.category] || categoryColors.General;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className="card-warm p-6 md:p-7"
        style={{
          animationDelay: `${index * 0.1}s`,
          animation: 'fadeInUp 0.5s ease-out both',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-medium mb-3 border tracking-wide ${catClass}`}>
              {post.category}
            </span>

            <h2 className="text-xl md:text-2xl font-bold text-[#1f2937] group-hover:text-[#7c3aed] transition-colors mb-3">
              {post.title}
            </h2>

            <p className="text-[#6b7280] text-sm leading-relaxed mb-4 line-clamp-2">
              {post.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-[#9ca3af]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="md:text-right shrink-0">
            <time className="text-xs text-[#9ca3af]" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </time>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[#7c3aed] text-xs opacity-0 group-hover:opacity-100 transition-opacity tracking-wide uppercase">
          Read article
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </article>
    </Link>
  );
}
