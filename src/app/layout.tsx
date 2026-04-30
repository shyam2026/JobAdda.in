import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "JobAdda.in | Find Your Dream Job in India",
  description: "India's fastest growing job portal. Search 50,000+ jobs, build a professional ats optimized resume, and refer friends to earn money. Connect with top companies on JobAdda.in.",
  keywords: ["jobs in india", "job search", "job portal", "naukri", "hiring", "recruitment", "JobAdda", "resume",
    "Referral code", "jobs for fresher", "build resume",
    "jobs in delhi", "jobs in gurugram", "jobs in noida",
    "jobs in mumbai", "jobs in pune", "jobs in bangalore",
    "jobs in hyderabad", "jobs in chennai",
    "jobs in lucknow", "jobs in kanpur", "jobs in varanasi",
    "jobs in meerut", "jobs in agra",
    "jobs in lucknow", "jobs in kanpur", "jobs in varanasi",
    "jobs in meerut", "jobs in agra"],

    openGraph: {
    title: "JobAdda.in | Find Your Dream Job in India",
    description: "India's fastest growing job portal. Search 50,000+ jobs, build a professional ats optimized resume, and refer friends to earn money. Connect with top companies on JobAdda.in.",
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

  icons: { 
    icon: "/logosq.png",
    apple: "/logosq.png",
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

