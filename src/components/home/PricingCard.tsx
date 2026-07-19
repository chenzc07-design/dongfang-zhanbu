'use client';

import type { ProductTier } from '@/lib/types';

interface PricingCardProps {
  product: ProductTier;
  onCheckout: (product: ProductTier) => void;
  loading: boolean;
}

export default function PricingCard({ product, onCheckout, loading }: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-6 transition-all duration-500 ${
        product.popular
          ? 'glass-card border-[rgba(201,168,76,0.2)] glass-card-glow'
          : 'glass-card border-[rgba(201,168,76,0.06)]'
      }`}
    >
      {product.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#c9a84c] to-[#a67c35] text-[#06080d] text-[11px] font-semibold px-5 py-1.5 rounded-full tracking-wide shadow-lg shadow-[rgba(201,168,76,0.2)]">
          Most Popular
        </span>
      )}

      <div className="text-center mb-6">
        <h3 className="font-semibold text-lg text-[#ede4d8]">{product.name}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold text-[#c9a84c] font-serif">${product.priceUSD}</span>
          <span className="text-[#7e7264] text-sm ml-1">one-time</span>
        </div>
        <p className="text-sm text-[#9b8e7c] mt-2">{product.description}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {product.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[#9b8e7c]">
            <span className="text-emerald-500 mt-0.5 shrink-0 text-xs">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onCheckout(product)}
        disabled={loading}
        className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm ${
          product.popular ? 'btn-gold' : 'btn-ghost'
        } disabled:opacity-50`}
      >
        {loading ? 'Processing...' : `Purchase — $${product.priceUSD}`}
      </button>

      <p className="text-center text-[10px] text-[#5e5044] mt-3">
        Instant PDF delivery via email
      </p>
    </div>
  );
}
