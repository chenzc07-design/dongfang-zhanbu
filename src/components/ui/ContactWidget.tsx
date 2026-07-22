'use client';

import { useState } from 'react';

export default function ContactWidget() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', question: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-white border border-[rgba(184,134,11,0.2)] rotate-45'
            : 'bg-gradient-to-br from-[#d4a843] to-[#b8860b] hover:shadow-[0_0_25px_rgba(184,134,11,0.3)]'
        }`}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      {/* 弹出面板 */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-3rem)] card-warm rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-[rgba(184,134,11,0.06)] to-transparent px-5 py-4 border-b border-[rgba(184,134,11,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4a843] to-[#b8860b] flex items-center justify-center text-sm text-white">
                ☯
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2c2416]">Ask Master Gao Wei</p>
                <p className="text-[10px] text-[#9b8e7c]">We typically reply within 24 hours</p>
              </div>
            </div>
          </div>

          {/* 内容 */}
          <div className="p-5">
            {submitted ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🙏</div>
                <p className="text-[#2c2416] font-semibold mb-2">Message Received</p>
                <p className="text-sm text-[#6b5e4a] leading-relaxed">
                  Master Gao Wei will review your question and respond to <strong className="text-[#b8860b]">{form.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => { setOpen(false); setSubmitted(false); setForm({ name: '', email: '', question: '' }); }}
                  className="btn-ghost mt-4 text-xs px-5 py-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] text-[#9b8e7c] mb-1">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. John"
                    className="input-mystic text-sm py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#9b8e7c] mb-1">Your Email <span className="text-[#c0392b]">*</span></label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="input-mystic text-sm py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#9b8e7c] mb-1">Your Question <span className="text-[#c0392b]">*</span></label>
                  <textarea
                    required
                    value={form.question}
                    onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
                    placeholder="Ask anything about BaZi, your reading, or our reports..."
                    rows={3}
                    className="input-mystic text-sm py-2.5 resize-none"
                  />
                </div>
                {error && (
                  <p className="text-xs text-[#c0392b]">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={sending || !form.email || !form.question.trim()}
                  className="btn-gold w-full py-2.5 text-sm disabled:opacity-40"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
                <p className="text-[9px] text-[#9b8e7c] text-center">
                  Your privacy is respected. We never share your information.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
