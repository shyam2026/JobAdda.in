'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import Link from 'next/link';

export default function CompanyLoginPage() {
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
      const res = await signIn('credentials', { 
        email, 
        password, 
        portalType: 'company', 
        redirect: false 
      });
      
      if (res?.error) {
        setError('Invalid credentials. Please check your employer email and password.');
      } else {
        router.push('/company/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout" style={{ background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      {/* Left — Brand (Employer Aesthetics) */}
      <div className="hide-mobile" style={{ position: 'relative', background: '#0f172a', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '460px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#f8fafc' }}>JobAdda<span style={{ color: '#818cf8' }}>.in</span></span>
          </div>
          
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2', color: '#f8fafc', fontWeight: '900', letterSpacing: '-0.02em' }}>Hire the <br/><span style={{ color: '#818cf8' }}>Best Talent Faster</span></h2>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '3rem' }}>
            Access our database of over 500,000 verified professionals and streamline your hiring process.
          </p>

          <div style={{ background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid #334155', borderRadius: '16px', padding: '2rem', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(129,140,248,0.15)', padding: '0.85rem', borderRadius: '14px', color: '#818cf8' }}>
              <Briefcase size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: '#f8fafc', fontWeight: '800' }}>Powerful ATS Integration</h4>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0, lineHeight: '1.6' }}>Manage job postings, track applicants, and schedule interviews all in one place.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="auth-form-wrap" style={{ background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: '#1e293b', padding: '2.5rem', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }} className="anim-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#818cf8' }}>
            <Briefcase size={20} />
            <span style={{ fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Employer Portal</span>
          </div>
          <h2 style={{ marginBottom: '0.5rem', color: '#f8fafc', fontWeight: '900', letterSpacing: '-0.02em' }}>Recruiter Login</h2>
          <p style={{ marginBottom: '2.5rem', color: '#94a3b8' }}>
            Want to post jobs?{' '}
            <Link href="/company/register" style={{ color: '#818cf8', fontWeight: '700' }}>
              Create an employer account
            </Link>
          </p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>Work Email</label>
              <Input
                type="email"
                required
                placeholder="hr@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1' }}>Password</label>
              </div>
              <Input
                type={showPwd ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
                rightIcon={
                  <button 
                    type="button" 
                    onClick={() => setShowPwd(!showPwd)} 
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
                  >
                    {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
              />
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading} rightIcon={<ArrowRight size={18} />} style={{ background: '#6366f1', color: '#fff', border: 'none', fontWeight: '800', marginTop: '0.5rem', borderRadius: '12px' }}>
              Access Dashboard
            </Button>
          </form>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <Link href="/" style={{ color: '#64748b', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
              ← Back to main site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
