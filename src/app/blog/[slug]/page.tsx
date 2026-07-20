import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} — 东方古老占卜 Blog`,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: [
        {
          url: 'https://dongfangdivination.com/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['https://dongfangdivination.com/og-image.png'],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Master Gao Wei',
      jobTitle: 'Senior BaZi Practitioner',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ancient Eastern Divination',
      url: 'https://dongfangdivination.com',
    },
    image: 'https://dongfangdivination.com/og-image.png',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://dongfangdivination.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#2c2416]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="subtle-bg" />

      <article className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#6b5e4a] hover:text-[#b8860b] text-sm mb-8 transition-colors">
          ← Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(184,134,11,0.1)] text-[#b8860b] border border-[rgba(184,134,11,0.2)]">
              {post.category}
            </span>
            <time className="text-xs text-[#9b8e7c]" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </time>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-[#2c2416] mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-[#6b5e4a] text-lg leading-relaxed">
            {post.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[rgba(184,134,11,0.06)] text-[#9b8e7c]">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-[#2c2416] prose-headings:font-serif
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-[#6b5e4a] prose-p:leading-relaxed prose-p:mb-5
            prose-strong:text-[#2c2416]
            prose-a:text-[#b8860b] prose-a:no-underline hover:prose-a:underline
            prose-li:text-[#6b5e4a]
            prose-blockquote:border-l-[#b8860b] prose-blockquote:text-[#6b5e4a] prose-blockquote:italic
            prose-code:text-[#b8860b] prose-code:bg-[rgba(184,134,11,0.06)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-hr:border-[rgba(184,134,11,0.1)]
            [&_table]:border-collapse [&_table]:w-full [&_table]:my-6
            [&_th]:border [&_th]:border-[rgba(184,134,11,0.2)] [&_th]:px-4 [&_th]:py-2 [&_th]:text-[#b8860b] [&_th]:text-sm [&_th]:bg-[#f7f3ec]
            [&_td]:border [&_td]:border-[rgba(184,134,11,0.15)] [&_td]:px-4 [&_td]:py-2 [&_td]:text-[#6b5e4a] [&_td]:text-sm
          "
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* CTA */}
        <div className="mt-16 card-warm p-8 rounded-2xl text-center">
          <h3 className="text-xl font-serif text-[#2c2416] mb-3">
            Curious About Your Own Destiny?
          </h3>
          <p className="text-[#6b5e4a] text-sm mb-6">
            Get your personalized BaZi chart and discover what the Four Pillars reveal about you.
          </p>
          <Link href="/" className="btn-gold inline-block px-8 py-3 text-sm">
            Get Your Free BaZi Reading →
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[rgba(184,134,11,0.1)] text-center">
          <Link href="/" className="text-[#6b5e4a] hover:text-[#b8860b] text-sm transition-colors">
            东方古老占卜 · Ancient Eastern Divination
          </Link>
          <p className="text-[#9b8e7c] text-xs mt-2">
            Written by Master Gao Wei — 25 years of BaZi expertise
          </p>
        </footer>
      </article>
    </div>
  );
}

/**
 * Simple Markdown-to-HTML renderer.
 * Handles: headings, paragraphs, bold, italic, links, lists, blockquotes, code, tables, hr
 */
function renderMarkdown(md: string): string {
  let html = md;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre style="background:#f7f3ec;border:1px solid rgba(184,134,11,0.15);border-radius:8px;padding:16px;overflow-x:auto;margin:16px 0;font-size:13px;color:#2c2416;"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // HR
  html = html.replace(/^---$/gim, '<hr />');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Tables
  html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
    const headers = header.split('|').map((h: string) => h.trim()).filter(Boolean);
    const rows = body.trim().split('\n').map((row: string) =>
      row.split('|').map((c: string) => c.trim()).filter(Boolean)
    );
    let table = '<table><thead><tr>';
    headers.forEach((h: string) => table += `<th>${h}</th>`);
    table += '</tr></thead><tbody>';
    rows.forEach((row: string[]) => {
      table += '<tr>';
      row.forEach((cell: string) => table += `<td>${cell}</td>`);
      table += '</tr>';
    });
    table += '</tbody></table>';
    return table;
  });

  // Unordered lists
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Numbered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

  // Paragraphs
  html = html.split('\n\n').map((para) => {
    if (para.startsWith('<')) return para;
    if (para.trim() === '') return '';
    return `<p>${para}</p>`;
  }).join('\n');

  return html;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
