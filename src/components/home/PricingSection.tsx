import type { ProductTier } from '@/lib/types';
import PricingCard from './PricingCard';

interface PricingSectionProps {
  onCheckout: (product: ProductTier) => void;
  checkoutLoading: boolean;
}

const PRODUCTS: ProductTier[] = [
  {
    id: 'full', name: 'Complete BaZi Reading', price: 1499, priceUSD: 14.99,
    description: 'Your personalized destiny analysis — delivered as a professional PDF report.',
    features: [
      'Complete Four Pillars of Destiny analysis',
      'Five Elements balance profile with scores',
      'In-depth personality & character insights',
      'Career, relationship & wealth guidance',
      'Strategic timing for major life decisions',
      'Professional 20+ page PDF report',
    ],
    popular: true,
  },
  {
    id: 'premium', name: 'Premium BaZi Bundle', price: 3499, priceUSD: 34.99,
    description: 'Full report + 2026 Energy Forecast + Crystal Guide.',
    features: [
      'Everything in Complete BaZi Reading',
      '2026 Year of the Fire Horse forecast',
      'Monthly energy navigation for all 12 months',
      'Crystal & element balancing recommendations',
      'Personalized Feng Shui adjustment guide',
      'Bonus: 3-month email follow-up guidance',
    ],
    popular: false,
  },
];

export default function PricingSection({ onCheckout, checkoutLoading }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-purple-200" />
            <span className="text-[#7c3aed] text-xs tracking-[0.3em] uppercase font-medium">Choose Your Path</span>
            <div className="w-8 h-px bg-gradient-to-r from-purple-200 to-transparent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1f2937]">Your Life Blueprint Report</h2>
          <p className="text-[#6b7280] text-sm mt-2">
            One-time purchase · Professionally crafted PDF delivered to your email · 24-hour processing for authenticity
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PRODUCTS.map(p => <PricingCard key={p.id} product={p} onCheckout={onCheckout} loading={checkoutLoading} />)}
        </div>

        {/* Feature comparison table */}
        <div className="max-w-2xl mx-auto mt-10 card-warm rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#1f2937] mb-4 text-center">What&apos;s Included</h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="text-[#9ca3af] font-medium pt-2">Feature</div>
            <div className="text-center text-[#7c3aed] font-semibold">Complete ($14.99)</div>
            <div className="text-center text-[#ec4899] font-semibold">Premium ($34.99)</div>
            {[
              ['Four Pillars Analysis', '✓', '✓'],
              ['Five Elements Profile', '✓', '✓'],
              ['Personality Insights', '✓', '✓'],
              ['Career & Wealth Guidance', '✓', '✓'],
              ['20+ Page PDF Report', '✓', '✓'],
              ['2026 Fire Horse Forecast', '—', '✓'],
              ['Monthly Energy Navigation', '—', '✓'],
              ['Crystal Recommendations', '—', '✓'],
              ['Feng Shui Guide', '—', '✓'],
              ['3-Month Email Guidance', '—', '✓'],
            ].map(([feature, full, premium]) => (
              <div key={feature} className="col-span-3 grid grid-cols-3 gap-4 border-t border-gray-100 py-2.5">
                <span className="text-[#6b7280]">{feature}</span>
                <span className="text-center text-emerald-600">{full}</span>
                <span className="text-center text-emerald-600">{premium}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
