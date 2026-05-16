import React from "react";
import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jobadda.in'),
  title: "JobAdda.in | Find Your Dream Job in India",
  description: "India's fastest growing job portal. Search 50,000+ jobs, build a professional ats optimized resume, and refer friends to earn money. Connect with top companies on JobAdda.in.",
  keywords: ["jobs in india", "job search", "job portal", "naukri", "hiring", "recruitment", "JobAdda", "resume",
    "Referral code", "jobs for fresher", "build resume",
    "jobs in delhi", "jobs in gurugram", "jobs in noida",
    "jobs in mumbai", "jobs in pune", "jobs in bangalore",
    "jobs in hyderabad", "jobs in chennai",
    "jobs in lucknow", "jobs in kanpur", "jobs in varanasi",
    "jobs in meerut", "jobs in agra"],

  openGraph: {
    type: "website",
    url: "https://jobadda.in",
    title: "JobAdda.in | Find Your Dream Job in India",
    description: "India's fastest growing job portal. Search 50,000+ jobs, build a professional ats optimized resume, and refer friends to earn money.",
    siteName: "JobAdda.in",
    images: [
      {
        url: "/logosq.png",
        width: 1080,
        height: 1080,
        alt: "JobAdda.in - Find Your Dream Job",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "JobAdda.in | Find Your Dream Job in India",
    description: "India's fastest growing job portal. Search 50,000+ jobs and refer friends to earn money.",
    images: ["/logosq.png"],
  },

  icons: {
    icon: [
      { url: "/logosq.png" },
      { url: "/logosq.png", sizes: "32x32", type: "image/png" },
      { url: "/logosq.png", sizes: "192x192", type: "image/png" },
      { url: "/logosq.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/logosq.png",
    apple: [
      { url: "/logosq.png" },
      { url: "/logosq.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#6366f1",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled content */}
        <meta name="color-scheme" content="dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var el = document.documentElement;
                  el.style.backgroundColor = '#0a0f1e';
                  el.style.color = '#f8fafc';
                  // Hide body until CSS is ready to prevent FOUC
                  var style = document.createElement('style');
                  style.id = '__fouc_prevent';
                  style.textContent = 'body { opacity: 0 !important; }';
                  document.head.appendChild(style);
                  // Remove the hiding style once the page is interactive
                  function removeFOUC() {
                    var s = document.getElementById('__fouc_prevent');
                    if (s) {
                      s.textContent = 'body { opacity: 0; transition: opacity 0.15s ease; }';
                      requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                          if (s) s.remove();
                        });
                      });
                    }
                  }
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', removeFOUC);
                  } else {
                    removeFOUC();
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body style={{ fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif' }} suppressHydrationWarning>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}

