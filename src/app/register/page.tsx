import React from 'react';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="auth-layout">
      {/* Left Panel — Brand */}
      <div className="hide-mobile" style={{ position: 'relative', background: 'var(--bg-2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', overflow: 'hidden' }}>
        {/* Background Effects */}
        <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)', pointerEvents: 'none' }}></div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '440px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>JobAdda<span style={{ color: 'var(--primary-light)' }}>.in</span></span>
          </div>
          
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>Start Your Journey with <br/><span className="text-gradient">India's Top Portal</span></h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', lineHeight: '1.6', marginBottom: '3rem' }}>
            Join 5 lakh+ professionals who found their dream jobs. Build a smart resume, apply instantly, and grow your career.
          </p>

          <div style={{ display: 'grid', gap: '1rem', textAlign: 'left' }}>
            {[
              { icon: '⚡', title: 'One-Click Apply', desc: 'Apply to jobs instantly without re-entering details.' },
              { icon: '📄', title: 'Smart Resume', desc: 'Auto-generate a beautiful PDF resume from your profile.' },
              { icon: '💸', title: 'Refer & Earn', desc: 'Get Upto ₹50 directly in your wallet for every successful referral.' }
            ].map((f, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ fontSize: '1.5rem', background: 'rgba(255,255,255,0.05)', minWidth: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>{f.icon}</div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.15rem', color: 'white' }}>{f.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="auth-form-wrap">
        <RegisterForm />
      </div>
    </div>
  );
}

