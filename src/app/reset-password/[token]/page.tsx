'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lock, ArrowRight, CheckCircle, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }} className="anim-fade-up">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Set New <span className="text-gradient">Password</span></h1>
          <p style={{ color: 'var(--text-3)' }}>Please enter your new password below.</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid rgba(16,185,129,0.3)' }}>
              <CheckCircle size={36} style={{ color: 'var(--success)' }} />
            </div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--success)' }}>Password Reset!</h2>
            <p style={{ color: 'var(--text-3)', marginBottom: '2rem' }}>
              Your password has been updated successfully. Redirecting you to login...
            </p>
            <Loader2 size={24} className="spin" style={{ margin: '0 auto', color: 'var(--primary-light)' }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ padding: '0.85rem', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              rightIcon={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-3)', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              rightIcon={
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-3)', cursor: 'pointer', display: 'flex' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div style={{ marginTop: '0.5rem' }}>
              <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading} rightIcon={<ArrowRight size={18} />}>
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
