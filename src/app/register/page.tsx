import React from 'react';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg)' }}>
      {/* Left Panel — Brand */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', fontSize: '1.4rem', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>J</div>
          <span style={{ fontSize: '1.75rem', fontWeight: '800' }}>JobAdda<span style={{ color: 'var(--primary-light)' }}>.in</span></span>
        </div>
        <h2 style={{ marginBottom: '1.5rem' }}>India's <span className="text-gradient">Top Job Portal</span></h2>
        <p style={{ fontSize: '1.05rem', maxWidth: '380px', lineHeight: '1.8', marginBottom: '3rem' }}>Join 5 lakh+ professionals who found their dream jobs through JobAdda.in. Post resumes, apply instantly, and grow your career.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '320px' }}>
          {[
            { icon: '⚡', text: 'One-click apply to any job' },
            { icon: '📄', text: 'AI-powered resume builder' },
            { icon: '💸', text: 'Earn ₹50 per referral' },
            { icon: '✅', text: '100% verified job listings' },
          ].map(f => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'rgba(255,255,255,0.04)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
        <RegisterForm />
      </div>
    </div>
  );
}

