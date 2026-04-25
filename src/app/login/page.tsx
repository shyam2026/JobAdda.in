import React from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg)' }}>
      {/* Left — Brand */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', fontSize: '1.4rem', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>J</div>
          <span style={{ fontSize: '1.75rem', fontWeight: '800' }}>JobAdda<span style={{ color: 'var(--primary-light)' }}>.in</span></span>
        </div>
        <h2 style={{ marginBottom: '1rem' }}>Welcome <span className="text-gradient">Back!</span></h2>
        <p style={{ fontSize: '1rem', maxWidth: '360px', lineHeight: '1.8', marginBottom: '2.5rem' }}>
          Sign in to access your personalized job feed, track applications, and manage your career on JobAdda.in.
        </p>
        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', maxWidth: '320px', width: '100%' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💼</div>
          <div style={{ fontWeight: '700', marginBottom: '0.5rem' }}>50,000+ Jobs Waiting</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-3)' }}>From top companies across India — all verified and ready for you to apply.</div>
        </div>
      </div>

      {/* Right — Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
        <LoginForm />
      </div>
    </div>
  );
}

