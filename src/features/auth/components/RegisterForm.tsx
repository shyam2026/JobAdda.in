'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Building2, ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

export function RegisterForm() {
  const [role, setRole] = useState<'STUDENT' | 'COMPANY'>('STUDENT');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', contact: '', password: '', confirmPassword: '', referredBy: '' });
  const router = useRouter();

  // Auto-fill referral code from URL ?ref=CODE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) setForm(f => ({ ...f, referredBy: ref }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login?registered=true'), 1500);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ width: '100%', maxWidth: '460px', textAlign: 'center' }} className="anim-fade-up">
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid rgba(16,185,129,0.3)' }}>
          <CheckCircle size={36} style={{ color: 'var(--success)' }} />
        </div>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--success)' }}>Account Created!</h2>
        <p style={{ color: 'var(--text-3)' }}>Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '460px' }} className="anim-fade-up">
      <h2 style={{ marginBottom: '0.5rem' }}>Create your account</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-3)' }}>
        Already have an account?{' '}
        <a href="/login" style={{ color: 'var(--primary-light)', fontWeight: '600' }}>Sign in</a>
      </p>



      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '0.85rem 1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#f87171' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <Input
          label="Full Name"
          required
          placeholder="e.g. Rahul Sharma"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <Input
          label="Email Address"
          type="email"
          required
          placeholder="you@gmail.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <Input
          label="Contact Number"
          type="tel"
          required
          placeholder="e.g. +91 9876543210"
          value={form.contact}
          onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
          leftIcon={<Phone size={18} />}
        />
        <Input
          label="Password"
          type={showPwd ? 'text' : 'password'}
          required
          placeholder="Min. 6 characters"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          rightIcon={
            <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}>
              {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />
        <Input
          label="Confirm Password"
          type={showConfirmPwd ? 'text' : 'password'}
          required
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
          rightIcon={
            <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}>
              {showConfirmPwd ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />
        <Input
          label={form.referredBy ? '🎉 Referral Code Applied!' : 'Referral Code (Optional — Earn bonus!)'}
          placeholder="e.g. ABC123XY"
          value={form.referredBy}
          onChange={e => setForm(f => ({ ...f, referredBy: e.target.value.toUpperCase() }))}
        />

        <div style={{ marginTop: '0.5rem' }}>
          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading} rightIcon={<ArrowRight size={18} />}>
            Create Account
          </Button>
        </div>
      </form>

      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '1.5rem' }}>
        By registering, you agree to JobAdda.in's{' '}
        <a href="/terms" style={{ color: 'var(--primary-light)' }}>Terms of Service</a>{' '}
        and <a href="/privacy" style={{ color: 'var(--primary-light)' }}>Privacy Policy</a>
      </p>
    </div>
  );
}
