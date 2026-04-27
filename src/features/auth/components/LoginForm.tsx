'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push('/user/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px' }} className="anim-fade-up">
      <h2 style={{ marginBottom: '0.5rem' }}>Sign in to your account</h2>
      <p style={{ marginBottom: '2.5rem', color: 'var(--text-3)' }}>
        New to JobAdda.in?{' '}
        <a href="/register" style={{ color: 'var(--primary-light)', fontWeight: '600' }}>
          Create a free account
        </a>
      </p>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '0.85rem 1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#f87171' }}>
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
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)' }}>Password</label>
            <a href="/forgot-password" style={{ fontSize: '0.82rem', color: 'var(--primary-light)' }}>
              Forgot password?
            </a>
          </div>
          <Input
            type={showPwd ? 'text' : 'password'}
            required
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightIcon={
              <button 
                type="button" 
                onClick={() => setShowPwd(!showPwd)} 
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
              >
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
          />
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading} rightIcon={<ArrowRight size={18} />}>
          Sign In
        </Button>
      </form>


    </div>
  );
}
