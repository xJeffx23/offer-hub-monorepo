import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Analytics from "@/components/Analytics";
import { ClientBackground } from "@/components/layout/ClientBackground";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import CookieConsentBanner from "@/components/CookieConsentBanner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0e9898" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "OFFER-HUB | The Future of On-Chain Bounties",
    template: "%s | OFFER-HUB",
  },
  description:
    "OFFER-HUB empowers marketplaces to provide secure, non-custodial escrow payments without building complex payment infrastructure.",
  metadataBase: new URL("https://offer-hub.tech"),

  // ── Favicon & icon variants ──────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico",       sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  // ── PWA manifest ──────────────────────────────────────────────────────────
  manifest: "/site.webmanifest",

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    title: "OFFER-HUB | The Future of On-Chain Bounties",
    description:
      "OFFER-HUB empowers marketplaces to provide secure, non-custodial escrow payments without building complex payment infrastructure.",
    url: "https://offer-hub.tech",
    siteName: "OFFER-HUB",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OFFER-HUB - Secure, non-custodial escrow for your marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // ── Twitter / X card ─────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "OFFER-HUB | The Future of On-Chain Bounties",
    description:
      "OFFER-HUB empowers marketplaces to provide secure, non-custodial escrow payments without building complex payment infrastructure.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} antialiased relative min-h-screen`}>
        <ThemeProvider>
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <Analytics />
          <ClientBackground />
          {children}
          <FloatingCTA />
          <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}