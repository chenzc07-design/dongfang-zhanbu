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
  title: "东方古老占卜 · Ancient Eastern Divination — Free BaZi Reading",
  description: "东方古老占卜 · Discover your destiny with AI-powered Chinese BaZi (八字) analysis. Free Four Pillars calculation, personalized element profile, and deep life insights from Master Gao Wei.",
  keywords: ["BaZi", "八字", "Four Pillars of Destiny", "Chinese astrology", "free BaZi reading", "Master Gao Wei", "ancient eastern divination", "five elements", "Wuxing"],
  authors: [{ name: "Master Gao Wei 高伟老师" }],
  openGraph: {
    title: "东方古老占卜 · Ancient Eastern Divination",
    description: "Discover your destiny with AI-powered Chinese BaZi (八字) analysis. Free Four Pillars calculation.",
    type: "website",
    locale: "en_US",
    url: "https://dongfangdivination.com",
    siteName: "Ancient Eastern Divination",
    images: [
      {
        url: "https://dongfangdivination.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "东方古老占卜 · Ancient Eastern Divination",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "东方古老占卜 · Ancient Eastern Divination",
    description: "Discover your destiny with AI-powered Chinese BaZi (八字) analysis. Free Four Pillars calculation.",
    images: ["https://dongfangdivination.com/og-image.png"],
  },
  alternates: {
    canonical: "https://dongfangdivination.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
