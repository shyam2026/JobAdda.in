'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes where the global Navbar and Footer should be hidden
  const hideGlobalUI = 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/company');

  return (
    <>
      {!hideGlobalUI && <Navbar />}
      <main style={{ minHeight: hideGlobalUI ? '100vh' : 'calc(100vh - 70px)' }}>
        {children}
      </main>
      {!hideGlobalUI && <Footer />}
    </>
  );
}
