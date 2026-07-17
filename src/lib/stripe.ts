import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set — Stripe will not work in production mode.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-03-31.basil' as any,
});

export const PRODUCTS = {
  fullReport: {
    id: process.env.STRIPE_PRICE_FULL_REPORT || 'price_full_report',
    name: 'Complete BaZi Reading',
    description: 'Your full destiny report — 20+ pages of personalized analysis',
    price: 1499, // $14.99 in cents
    priceUSD: 14.99,
  },
  premiumBundle: {
    id: process.env.STRIPE_PRICE_PREMIUM || 'price_premium_bundle',
    name: 'Premium BaZi Bundle',
    description: 'Full report + 2026 yearly forecast + crystal recommendations',
    price: 3499, // $34.99
    priceUSD: 34.99,
  },
};

export function toStripeAmount(usd: number): number {
  return Math.round(usd * 100);
}
