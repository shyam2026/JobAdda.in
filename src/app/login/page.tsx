import React, { Suspense } from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="auth-layout">
      {/* Left — Brand */}
      <div className="hide-mobile" style={{ position: 'relative', background: 'var(--bg-2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', overflow: 'hidden' }}>
        {/* Background Effects */}
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)', pointerEvents: 'none' }}></div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '440px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>JobAdda<span style={{ color: 'var(--primary-light)' }}>.in</span></span>
          </div>
          
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>Welcome to the <br/><span className="text-gradient">Future of Hiring</span></h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', lineHeight: '1.6', marginBottom: '3rem' }}>
            Sign in to access your personalized job feed, track applications, and accelerate your career journey.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '1.25rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ background: 'rgba(99,102,241,0.15)', padding: '0.85rem', borderRadius: '14px', color: 'var(--primary-light)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'white' }}>50,000+ Active Jobs</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-3)', margin: 0, lineHeight: '1.6' }}>From top verified companies across India, waiting for your application.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="auth-form-wrap">
        <Suspense fallback={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', maxWidth: '420px' }}>
            <div style={{ height: '28px', background: 'var(--border)', borderRadius: '4px', width: '60%' }} className="skeleton" />
            <div style={{ height: '14px', background: 'var(--border)', borderRadius: '4px', width: '40%', marginBottom: '1.5rem' }} className="skeleton" />
            <div style={{ height: '48px', background: 'var(--border)', borderRadius: 'var(--radius)' }} className="skeleton" />
            <div style={{ height: '48px', background: 'var(--border)', borderRadius: 'var(--radius)' }} className="skeleton" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

