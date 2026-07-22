'use client';

import type { ProductTier } from '@/lib/types';

interface PricingCardProps {
  product: ProductTier;
  onCheckout: (product: ProductTier) => void;
  loading: boolean;
}

export default function PricingCard({ product, onCheckout, loading }: PricingCardProps) {
  return (
    <div className={`relative rounded-2xl p-6 transition-all duration-500 ${
      product.popular
        ? 'card-warm card-warm-glow border-purple-200'
        : 'card-warm'
    }`}>
      {product.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white text-[11px] font-semibold px-5 py-1.5 rounded-full tracking-wide shadow-lg shadow-[rgba(124,58,237,0.2)]">
          Most Popular
        </span>
      )}
      <div className="text-center mb-6">
        <h3 className="font-semibold text-lg text-[#1f2937]">{product.name}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold text-[#7c3aed] font-serif">${product.priceUSD}</span>
          <span className="text-[#9ca3af] text-sm ml-1">one-time</span>
        </div>
        <p className="text-sm text-[#6b7280] mt-2">{product.description}</p>
      </div>
      <ul className="space-y-3 mb-6">
        {product.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[#6b7280]">
            <span className="text-emerald-600 mt-0.5 shrink-0 text-xs">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button onClick={() => onCheckout(product)} disabled={loading}
        className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm ${
          product.popular ? 'btn-gold' : 'btn-ghost'
        } disabled:opacity-50`}>
        {loading ? 'Processing...' : `Purchase — $${product.priceUSD}`}
      </button>
      <p className="text-center text-[10px] text-[#9ca3af] mt-3">Instant PDF delivery via email</p>
    </div>
  );
}
