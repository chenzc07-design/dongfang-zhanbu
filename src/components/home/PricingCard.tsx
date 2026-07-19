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
        ? 'card-warm card-warm-glow border-[rgba(184,134,11,0.2)]'
        : 'card-warm'
    }`}>
      {product.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#d4a843] to-[#b8860b] text-white text-[11px] font-semibold px-5 py-1.5 rounded-full tracking-wide shadow-lg shadow-[rgba(184,134,11,0.2)]">
          Most Popular
        </span>
      )}
      <div className="text-center mb-6">
        <h3 className="font-semibold text-lg text-[#2c2416]">{product.name}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold text-[#b8860b] font-serif">${product.priceUSD}</span>
          <span className="text-[#9b8e7c] text-sm ml-1">one-time</span>
        </div>
        <p className="text-sm text-[#6b5e4a] mt-2">{product.description}</p>
      </div>
      <ul className="space-y-3 mb-6">
        {product.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[#6b5e4a]">
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
      <p className="text-center text-[10px] text-[#9b8e7c] mt-3">Instant PDF delivery via email</p>
    </div>
  );
}
