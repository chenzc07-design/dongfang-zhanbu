import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dongfang Divination — Authentic BaZi Reading & Life Blueprint Analysis",
  description: "Discover your Life Blueprint with authentic Chinese BaZi (八字) analysis. Free Four Pillars calculation, Day Master insight, and professional Destiny Mapping from Senior Metaphysics Consultant Master Gao Wei.",
  keywords: [
    "BaZi reading", "Chinese astrology report", "Four Pillars of Destiny", 
    "life blueprint analysis", "destiny mapping", "authentic Bazi reading",
    "ancient eastern wisdom", "Master Gao Wei", "I Ching scholar",
    "energy navigation", "five elements", "Wuxing", "Day Master analysis",
  ],
  authors: [{ name: "Master Gao Wei — Senior Metaphysics Consultant" }],
  openGraph: {
    title: "Dongfang Divination — Authentic BaZi Reading",
    description: "Discover your Life Blueprint with authentic Chinese BaZi analysis. Free Four Pillars calculation from Senior Metaphysics Consultant Master Gao Wei.",
    type: "website",
    locale: "en_US",
    url: "https://dongfangdivination.com",
    siteName: "Dongfang Divination",
    images: [{ url: "https://dongfangdivination.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dongfang Divination — Authentic BaZi Reading",
    description: "Discover your Life Blueprint with authentic Chinese BaZi analysis. Free Four Pillars calculation.",
    images: ["https://dongfangdivination.com/og-image.png"],
  },
  alternates: { canonical: "https://dongfangdivination.com" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Dongfang Divination",
              "description": "Authentic BaZi Life Blueprint Analysis by Senior Metaphysics Consultant Master Gao Wei.",
              "url": "https://dongfangdivination.com",
              "provider": {
                "@type": "Person",
                "name": "Master Gao Wei",
                "jobTitle": "Senior Metaphysics Consultant & I Ching Scholar",
                "description": "25+ years of mastery in Four Pillars of Destiny and Chinese metaphysical sciences."
              },
              "offers": {
                "@type": "Offer",
                "price": "14.99",
                "priceCurrency": "USD",
                "description": "Complete BaZi Reading — 20+ page personalized Life Blueprint analysis"
              }
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
