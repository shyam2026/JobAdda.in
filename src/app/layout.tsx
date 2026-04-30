import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper";

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
        url: "/logoo.png",
        width: 1200,
        height: 630,
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
    <html lang="en">
      <body>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}

