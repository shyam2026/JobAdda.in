import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "JobAdda.in | Find Your Dream Job in India",
  description: "India's fastest growing job portal. Search 50,000+ jobs, build a professional resume, and refer friends to earn money. Connect with top companies on JobAdda.in.",
  keywords: ["jobs in india", "job search", "job portal", "naukri", "hiring", "recruitment", "JobAdda"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 70px)' }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

