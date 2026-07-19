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
  description: "东方古老占卜 · Discover your destiny with AI-powered Chinese BaZi (八字) analysis. Free Four Pillars calculation, personalized element profile, and deep life insights.",
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
      <head>
        {/* Paddle.js - for payments */}
        <script src="https://cdn.paddle.com/paddle/v2/paddle.js" async />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
