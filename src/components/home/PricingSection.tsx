import type { ProductTier } from '@/lib/types';
import PricingCard from './PricingCard';

interface PricingSectionProps {
  onCheckout: (product: ProductTier) => void;
  checkoutLoading: boolean;
}

export default function PricingSection({ onCheckout, checkoutLoading }: PricingSectionProps) {
  const PRODUCTS: ProductTier[] = [
    {
      id: 'full',
      name: 'Complete BaZi Reading',
      price: 1499,
      priceUSD: 14.99,
      description: 'Your full personalized destiny report',
      features: [
        'Complete Four Pillars analysis',
        'Five Elements profile with scores',
        'Personality & character insights',
        'Career, relationship & wealth guidance',
        'Professional 20+ page PDF report',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium BaZi Bundle',
      price: 3499,
      priceUSD: 34.99,
      description: 'Full report + 2026 forecast + crystal guide',
      features: [
        'Everything in Complete Reading',
        '2026 Year of Fire Horse forecast',
        'Monthly luck pillars for 2026',
        'Crystal & element recommendations',
        'Feng Shui adjustment guide',
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-24 border-t border-[rgba(201,168,76,0.05)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.3)]" />
            <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">Choose Your Path</span>
            <div className="w-8 h-px bg-gradient-to-r from-[rgba(201,168,76,0.3)] to-transparent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#ede4d8] font-serif">Select Your Report</h2>
          <p className="text-[#9b8e7c] text-sm mt-2">One-time purchase · PDF delivered via email</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PRODUCTS.map(product => (
            <PricingCard
              key={product.id}
              product={product}
              onCheckout={onCheckout}
              loading={checkoutLoading}
            />
          ))}
        </div>

        {/* Feature comparison */}
        <div className="max-w-2xl mx-auto mt-10 glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#ede4d8] mb-4 text-center">What&apos;s Included</h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="text-[#7e7264] font-medium pt-2">Feature</div>
            <div className="text-center text-[#c9a84c] font-semibold">Complete ($14.99)</div>
            <div className="text-center text-[#7c5cbf] font-semibold">Premium ($34.99)</div>

            {[
              ['Four Pillars Analysis', '✓', '✓'],
              ['Five Elements Profile', '✓', '✓'],
              ['Personality Traits', '✓', '✓'],
              ['Career & Wealth Guide', '✓', '✓'],
              ['20+ Page PDF Report', '✓', '✓'],
              ['2026 Fire Horse Forecast', '—', '✓'],
              ['Monthly Luck Pillars', '—', '✓'],
              ['Crystal Recommendations', '—', '✓'],
              ['Feng Shui Guide', '—', '✓'],
            ].map(([feature, full, premium]) => (
              <div key={feature} className="col-span-3 grid grid-cols-3 gap-4 border-t border-[rgba(201,168,76,0.06)] py-2.5">
                <span className="text-[#9b8e7c]">{feature}</span>
                <span className="text-center text-emerald-400">{full}</span>
                <span className="text-center text-emerald-400">{premium}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
