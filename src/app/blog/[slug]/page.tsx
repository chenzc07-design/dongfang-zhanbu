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
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

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
          radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.3), transparent)
        `
      }} />

      <article className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#8a7a6a] hover:text-[#d4a853] text-sm mb-8 transition-colors">
          ← Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(212,168,83,0.15)', color: '#f0d080' }}>
              {post.category}
            </span>
            <time className="text-xs text-[#5a4a3a]" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </time>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-[#d4a853] mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-[#8a7a6a] text-lg leading-relaxed">
            {post.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded"
                style={{ background: 'rgba(212,168,83,0.08)', color: '#8a7a6a' }}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-[#d4a853]
            prose-headings:font-serif
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-[#c8c0b0] prose-p:leading-relaxed prose-p:mb-5
            prose-strong:text-[#e8e0d0]
            prose-a:text-[#d4a853] prose-a:no-underline hover:prose-a:underline
            prose-li:text-[#c8c0b0]
            prose-blockquote:border-l-[#d4a853] prose-blockquote:text-[#8a7a6a] prose-blockquote:italic
            prose-code:text-[#f0d080] prose-code:bg-[rgba(212,168,83,0.1)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            [&_table]:border-collapse [&_table]:w-full [&_table]:my-6
            [&_th]:border [&_th]:border-[rgba(212,168,83,0.2)] [&_th]:px-4 [&_th]:py-2 [&_th]:text-[#d4a853] [&_th]:text-sm
            [&_td]:border [&_td]:border-[rgba(212,168,83,0.15)] [&_td]:px-4 [&_td]:py-2 [&_td]:text-[#c8c0b0] [&_td]:text-sm
          "
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* CTA */}
        <div className="mt-16 p-8 rounded-xl text-center"
          style={{
            background: 'rgba(20,18,40,0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212,168,83,0.2)',
          }}>
          <h3 className="text-xl font-serif text-[#d4a853] mb-3">
            Curious About Your Own Destiny?
          </h3>
          <p className="text-[#8a7a6a] text-sm mb-6">
            Get your personalized BaZi chart and discover what the Four Pillars reveal about you.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-lg font-medium text-sm transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #d4a853, #b8893a)',
              color: '#0a0e1a',
            }}
          >
            Get Your Free BaZi Reading →
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[rgba(212,168,83,0.1)] text-center">
          <Link href="/" className="text-[#8a7a6a] hover:text-[#d4a853] text-sm transition-colors">
            东方古老占卜 · Ancient Eastern Divination
          </Link>
          <p className="text-[#5a4a3a] text-xs mt-2">
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

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre style="background:rgba(0,0,0,0.3);border:1px solid rgba(212,168,83,0.15);border-radius:8px;padding:16px;overflow-x:auto;margin:16px 0;font-size:13px;color:#c8c0b0;"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headings
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid rgba(212,168,83,0.15);margin:32px 0;" />');

  // Bold + Italic combined
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:16px 0;" />');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> in <ol>
  html = html.replace(/(<li>[\s\S]*?<\/li>)\n(?!<li>)/g, '<ol>$1</ol>\n');

  // Unordered lists
  html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');

  // Tables
  // Simple table: header row | separator row | data rows
  html = html.replace(/^\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)*)/gm, (_, header, body) => {
    const headers = header.split('|').map((h: string) => h.trim()).filter(Boolean);
    const rows = body.trim().split('\n').map((row: string) =>
      row.split('|').map((c: string) => c.trim()).filter(Boolean)
    );

    const headerHtml = `<tr>${headers.map((h: string) => `<th>${h}</th>`).join('')}</tr>`;
    const bodyHtml = rows.map((r: string[]) =>
      `<tr>${r.map((c: string) => `<td>${c}</td>`).join('')}</tr>`
    ).join('');

    return `<table>${headerHtml}${bodyHtml}</table>`;
  });

  // Paragraphs: wrap remaining text blocks
  html = html.replace(/\n\n+/g, '</p><p>');
  html = `<p>${html}</p>`;

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>(<h[1-4])/g, '$1');
  html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<table)/g, '$1');
  html = html.replace(/(<\/table>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ol)/g, '$1');
  html = html.replace(/(<\/ol>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr)/g, '$1');
  html = html.replace(/(\/>)<\/p>/g, '$1');
  html = html.replace(/<p>(<img)/g, '$1');
  html = html.replace(/(\/>)<\/p>/g, '$1');

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
