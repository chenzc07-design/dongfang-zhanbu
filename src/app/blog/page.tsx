import { getAllPosts, type BlogPost } from '@/lib/blog';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — 东方古老占卜 · Ancient Eastern Divination',
  description: 'Discover the ancient wisdom of Chinese BaZi astrology. Articles on destiny, Five Elements, Four Pillars, and life guidance.',
  openGraph: {
    title: 'Blog — Ancient Eastern Divination',
    description: 'Discover the ancient wisdom of Chinese BaZi astrology',
    type: 'website',
    images: [
      {
        url: 'https://dongfangdivination.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

const categoryColors: Record<string, string> = {
  'BaZi Basics': 'bg-[rgba(184,134,11,0.1)] text-[#b8860b] border-[rgba(184,134,11,0.2)]',
  'Five Elements': 'bg-[rgba(100,180,120,0.1)] text-[#5a8060] border-[rgba(100,180,120,0.2)]',
  'Fortune & Destiny': 'bg-[rgba(155,45,48,0.08)] text-[#9b2d30] border-[rgba(155,45,48,0.2)]',
  'Career & Wealth': 'bg-[rgba(184,134,11,0.1)] text-[#b8860b] border-[rgba(184,134,11,0.2)]',
  'Relationships': 'bg-[rgba(180,120,160,0.08)] text-[#a0688a] border-[rgba(180,120,160,0.2)]',
  'General': 'bg-[rgba(120,140,180,0.08)] text-[#6878a0] border-[rgba(120,140,180,0.2)]',
  'BaZi Astrology': 'bg-[rgba(184,134,11,0.1)] text-[#b8860b] border-[rgba(184,134,11,0.2)]',
  'Annual Forecast': 'bg-[rgba(155,45,48,0.08)] text-[#9b2d30] border-[rgba(155,45,48,0.2)]',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#2c2416]">
      <div className="subtle-bg" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block text-[#6b5e4a] hover:text-[#b8860b] text-sm mb-6 transition-colors">
            ← Back to 东方古老占卜
          </Link>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[rgba(184,134,11,0.3)]" />
            <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase">Wisdom & Insights</span>
            <div className="w-8 h-px bg-gradient-to-r from-[rgba(184,134,11,0.3)] to-transparent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#2c2416] mb-4">
            Ancient Wisdom Blog
          </h1>
          <p className="text-[#6b5e4a] text-base max-w-xl mx-auto">
            Explore the depths of Chinese BaZi astrology — Four Pillars, Five Elements,
            destiny patterns, and practical life guidance from Master Gao Wei.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6b5e4a] text-lg">No posts yet. Ancient wisdom is being transcribed...</p>
            <p className="text-[#9b8e7c] text-sm mt-2">Check back soon for new articles.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post, idx) => (
              <BlogCard key={post.slug} post={post} index={idx} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[rgba(184,134,11,0.1)] text-center">
          <Link href="/" className="text-[#6b5e4a] hover:text-[#b8860b] text-sm transition-colors">
            东方古老占卜 · Ancient Eastern Divination
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
        className="card-warm p-6 md:p-8"
        style={{
          animationDelay: `${index * 0.1}s`,
          animation: 'fadeInUp 0.5s ease-out both',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            {/* Category Badge */}
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 border ${catClass}`}>
              {post.category}
            </span>

            <h2 className="text-xl md:text-2xl font-serif text-[#2c2416] group-hover:text-[#b8860b] transition-colors mb-3">
              {post.title}
            </h2>

            <p className="text-[#6b5e4a] text-sm leading-relaxed mb-4 line-clamp-2">
              {post.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[rgba(184,134,11,0.06)] text-[#9b8e7c]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="md:text-right shrink-0">
            <time className="text-xs text-[#9b8e7c]" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>

        {/* Read more arrow */}
        <div className="mt-4 flex items-center gap-2 text-[#b8860b] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Read article
          <span>→</span>
        </div>
      </article>
    </Link>
  );
}
