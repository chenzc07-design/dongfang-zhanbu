import { getAllPosts, type BlogPost } from '@/lib/blog';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — 东方古老占卜 · Ancient Eastern Divination',
  description: 'Discover the ancient wisdom of Chinese BaZi astrology. Articles on destiny, Five Elements, Four Pillars, and life guidance.',
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  'BaZi Basics': { bg: 'rgba(212,168,83,0.15)', text: '#f0d080' },
  'Five Elements': { bg: 'rgba(100,180,120,0.15)', text: '#7dd89a' },
  'Fortune & Destiny': { bg: 'rgba(139,26,43,0.2)', text: '#e0707a' },
  'Career & Wealth': { bg: 'rgba(212,168,83,0.15)', text: '#f0d080' },
  'Relationships': { bg: 'rgba(180,120,160,0.15)', text: '#d8a0c8' },
  'General': { bg: 'rgba(120,140,180,0.15)', text: '#a0b8d8' },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Starry background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: `
          radial-gradient(1px 1px at 10% 20%, rgba(212,168,83,0.4), transparent),
          radial-gradient(1px 1px at 25% 55%, rgba(255,255,255,0.3), transparent),
          radial-gradient(1.5px 1.5px at 40% 15%, rgba(212,168,83,0.5), transparent),
          radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.25), transparent),
          radial-gradient(1.5px 1.5px at 75% 35%, rgba(212,168,83,0.35), transparent),
          radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.3), transparent),
          radial-gradient(2px 2px at 15% 85%, rgba(212,168,83,0.25), transparent),
          radial-gradient(1px 1px at 50% 45%, rgba(255,255,255,0.35), transparent),
          radial-gradient(1.5px 1.5px at 85% 10%, rgba(212,168,83,0.4), transparent),
          radial-gradient(1px 1px at 35% 90%, rgba(255,255,255,0.2), transparent)
        `
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-block text-[#8a7a6a] hover:text-[#d4a853] text-sm mb-6 transition-colors">
            ← Back to 东方古老占卜
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-[#d4a853] mb-4">
            Ancient Wisdom Blog
          </h1>
          <p className="text-[#8a7a6a] text-lg max-w-xl mx-auto">
            Explore the depths of Chinese BaZi astrology — Four Pillars, Five Elements, 
            destiny patterns, and practical life guidance from Master Gao Wei.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#8a7a6a] text-lg">No posts yet. Ancient wisdom is being transcribed...</p>
            <p className="text-[#5a4a3a] text-sm mt-2">Check back soon for new articles.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post, idx) => (
              <BlogCard key={post.slug} post={post} index={idx} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-[rgba(212,168,83,0.1)] text-center">
          <Link href="/" className="text-[#8a7a6a] hover:text-[#d4a853] text-sm transition-colors">
            东方古老占卜 · Ancient Eastern Divination
          </Link>
        </footer>
      </div>
    </div>
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const catColor = categoryColors[post.category] || categoryColors.General;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className="glass-card p-6 md:p-8 transition-all duration-300 hover:border-[rgba(212,168,83,0.3)]"
        style={{
          background: 'rgba(20,18,40,0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212,168,83,0.15)',
          borderRadius: '12px',
          animationDelay: `${index * 0.1}s`,
          animation: 'fadeInUp 0.5s ease-out both',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            {/* Category Badge */}
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
              style={{ background: catColor.bg, color: catColor.text }}
            >
              {post.category}
            </span>

            <h2 className="text-xl md:text-2xl font-serif text-[#e8e0d0] group-hover:text-[#d4a853] transition-colors mb-3">
              {post.title}
            </h2>

            <p className="text-[#8a7a6a] text-sm leading-relaxed mb-4 line-clamp-2">
              {post.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: 'rgba(212,168,83,0.08)',
                    color: '#8a7a6a',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="md:text-right shrink-0">
            <time className="text-xs text-[#5a4a3a]" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>

        {/* Read more arrow */}
        <div className="mt-4 flex items-center gap-2 text-[#d4a853] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Read article
          <span className="text-xs">→</span>
        </div>
      </article>
    </Link>
  );
}
