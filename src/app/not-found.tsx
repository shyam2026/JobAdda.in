'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Search, Briefcase, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 70px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    }}>
      {/* Background Orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, width: '100%', maxWidth: '500px' }}>
        <div style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)' }}>
          <Search size={40} strokeWidth={1.5} />
        </div>
        
        <h1 style={{ fontSize: 'clamp(5rem, 15vw, 8.5rem)', margin: 0, lineHeight: 1, fontWeight: '900', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.8 }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', marginTop: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
          Oops! The page you are looking for doesn't exist or has been moved to a new location.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline btn-lg"
            style={{ gap: '0.75rem' }}
          >
            <ArrowLeft size={18} /> Go Back
          </button>
          <Link href="/" className="btn btn-primary btn-lg" style={{ gap: '0.75rem' }}>
            <Home size={18} /> Back to Home
          </Link>
        </div>

        <Link href="/jobs" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ 
            marginTop: '4rem', 
            padding: '1.25rem 1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.03), transparent)',
            textAlign: 'left',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', flexShrink: 0 }}>
                <Briefcase size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Browse All Jobs</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-3)' }}>Find your next dream opportunity</p>
              </div>
            </div>
            <ArrowRight size={20} style={{ color: 'var(--primary-light)', opacity: 0.6 }} />
          </div>
        </Link>
      </div>
    </div>
  );
}
