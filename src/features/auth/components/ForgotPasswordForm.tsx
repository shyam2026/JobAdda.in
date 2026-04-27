'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }} className="anim-fade-up">
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid rgba(16,185,129,0.3)' }}>
          <CheckCircle size={36} style={{ color: 'var(--success)' }} />
        </div>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--success)' }}>Check your email</h2>
        <p style={{ color: 'var(--text-3)', marginBottom: '2rem' }}>
          We've sent password reset instructions to <strong>{email}</strong>.
        </p>
        <Button variant="outline" fullWidth onClick={() => window.location.href = '/login'}>
          Return to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }} className="anim-fade-up">
      <h2 style={{ marginBottom: '0.5rem' }}>Reset Password</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-3)', lineHeight: '1.6' }}>
        Enter the email address associated with your account and we'll send you a link to reset your password.
      </p>

      {error && (
        <div style={{ padding: '0.85rem', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          label="Email Address"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={{ marginTop: '0.5rem' }}>
          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading} rightIcon={<ArrowRight size={18} />}>
            Send Reset Link
          </Button>
        </div>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a href="/login" style={{ color: 'var(--primary-light)', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          ← Back to Login
        </a>
      </div>
    </div>
  );
}
