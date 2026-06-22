'use client';

import React, { useState } from 'react';
import { GraduationCap, Award, Trophy, Search, Loader2, Mail, ExternalLink, Sun, Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function maskMobile(mobile: string) {
  if (!mobile) return '';
  const clean = mobile.replace(/\s/g, '');
  if (clean.length < 4) return '******';
  return '******' + clean.slice(-4);
}

function maskEmail(email: string) {
  if (!email || !email.includes('@')) return '';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return local.charAt(0) + '***@' + domain;
  }
  return local.charAt(0) + '***' + local.charAt(local.length - 1) + '@' + domain;
}

export default function ScholarshipResultPage() {
  const [lookup, setLookup] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookup.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/scholarship/result?lookup=${encodeURIComponent(lookup.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch result');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPrizeDetails = (rank: number) => {
    if (rank === 1) {
      return {
        title: '1st Rank Winner! 🥇',
        prize: '₹15,000 Cash Scholarship',
        color: '#F97316',
        bg: 'rgba(249, 115, 22, 0.08)',
        border: 'rgba(249, 115, 22, 0.25)',
      };
    }
    if (rank === 2) {
      return {
        title: '2nd Rank Winner! 🥈',
        prize: '₹12,000 Cash Scholarship',
        color: '#E2E8F0',
        bg: 'rgba(226, 232, 240, 0.08)',
        border: 'rgba(226, 232, 240, 0.25)',
      };
    }
    if (rank === 3) {
      return {
        title: '3rd Rank Winner! 🥉',
        prize: '₹10,000 Cash Scholarship',
        color: '#CD7F32',
        bg: 'rgba(205, 127, 50, 0.08)',
        border: 'rgba(205, 127, 50, 0.25)',
      };
    }
    if (rank >= 4 && rank <= 10) {
      return {
        title: `${rank}th Rank Winner! 🏅`,
        prize: '₹5,000 Cash Scholarship',
        color: '#6366F1',
        bg: 'rgba(99, 102, 241, 0.08)',
        border: 'rgba(99, 102, 241, 0.25)',
      };
    }
    if (rank >= 11 && rank <= 200) {
      return {
        title: `${rank}th Rank Holder! 🏅`,
        prize: 'Flat ₹15,000 Course Discount',
        description: 'Get Flat ₹15,000 Discount on Data Analyst & Business Analyst Courses, offered by Microsoft Education Partner.',
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.08)',
        border: 'rgba(16, 185, 129, 0.25)',
      };
    }
    return null;
  };

  return (
    <div className="patriotic-bg-container" style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <style>{`
        .patriotic-bg-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/patriotic_bg.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          opacity: 0.75;
          z-index: 0;
          pointer-events: none;
        }
        .card {
          background: var(--bg-2) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        .card:hover {
          transform: none !important;
        }
      `}</style>

      <div style={{ position: 'relative', maxWidth: '700px', margin: '7rem auto 4rem', padding: '0 1.5rem', zIndex: 1 }} className="anim-fade-up">
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/scholarship" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-3)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}>
            <ArrowLeft size={16} />
            Back to Scholarship
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          {/* Independence Day Special Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 1rem', borderRadius: '9999px', backgroundColor: '#FFFFFF', border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', marginBottom: '1.25rem' }}>
            <Sun size={16} color="#F97316" fill="#F97316" />
            <span style={{ color: '#F97316', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em' }}>INDEPENDENCE DAY SPECIAL</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            <span style={{ color: '#F97316' }}>Scholarship </span>
            <span style={{ color: '#FFFFFF' }}>Test </span>
            <span style={{ color: '#22C55E' }}>Result 2026</span>
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', fontSize: '1rem', fontWeight: 700 }}>
            <span style={{ display: 'inline-flex', gap: '4px' }}>
              <span style={{ width: '10px', height: '3px', borderRadius: '2px', backgroundColor: '#F97316' }}></span>
              <span style={{ width: '10px', height: '3px', borderRadius: '2px', backgroundColor: '#22C55E' }}></span>
            </span>
            <span style={{ color: '#818CF8' }}>Check Your Merit & Rank</span>
            <span style={{ display: 'inline-flex', gap: '4px' }}>
              <span style={{ width: '10px', height: '3px', borderRadius: '2px', backgroundColor: '#22C55E' }}></span>
              <span style={{ width: '10px', height: '3px', borderRadius: '2px', backgroundColor: '#F97316' }}></span>
            </span>
          </div>
        </div>

        {/* Search Card */}
        <div className="card card-p" style={{ padding: '2rem', marginBottom: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group">
              <label className="label" style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Registered Mobile Number or Registration ID</label>
              <div style={{ position: 'relative', display: 'flex', gap: '0.75rem' }}>
                <input 
                  type="text" 
                  value={lookup} 
                  onChange={e => setLookup(e.target.value)} 
                  placeholder="e.g. JA-XYZ12345 or 9876543210" 
                  required 
                  style={{ 
                    flex: 1, 
                    padding: '0.85rem 1rem 0.85rem 2.5rem', 
                    borderRadius: '12px', 
                    background: 'var(--bg-3)', 
                    border: '1px solid var(--border)',
                    color: 'var(--text-1)',
                    fontSize: '0.95rem'
                  }}
                />
                <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', height: 'auto', justifyContent: 'center' }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Search'}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#F87171', fontSize: '0.88rem', fontWeight: 600 }}>
              {error}
            </div>
          )}
        </div>

        {/* Result Details Display */}
        {result && (
          <div className="anim-fade-up">
            {!result.examSubmitted ? (
              <div className="card card-p" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.02)', marginBottom: '1.5rem' }}>
                <HelpCircle size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', margin: '0 0 0.5rem 0' }}>Result Not Available</h3>
                <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                  Candidate <strong>{result.candidate.name}</strong> ({maskMobile(result.candidate.mobile)}) is registered, but has not submitted the scholarship exam.
                </p>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', background: 'var(--bg-3)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  If you have already appeared for the test and believe this is an error, please email us with details.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Main Candidate Card */}
                <div className="card card-p" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      Scholarship Test 2026 Result
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-1)', margin: 0 }}>
                      {result.candidate.name}
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                      <span><strong>Reg ID:</strong> {result.candidate.registrationNo}</span>
                      <span>•</span>
                      <span><strong>Mobile:</strong> {maskMobile(result.candidate.mobile)}</span>
                      <span>•</span>
                      <span><strong>Email:</strong> {maskEmail(result.candidate.email)}</span>
                    </div>
                  </div>

                  {/* Score & Rank Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    {/* Score */}
                    <div style={{ padding: '1.25rem', background: 'var(--bg-3)', borderRadius: '14px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase' }}>Your Score</span>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)' }}>
                        {result.examScore} <span style={{ fontSize: '1.2rem', color: 'var(--text-3)', fontWeight: 600 }}>/ 150</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-2)', marginTop: '0.25rem' }}>
                        <span style={{ color: 'var(--success)' }}><strong>Correct:</strong> {result.examCorrect}</span>
                        <span style={{ color: 'var(--error)' }}><strong>Incorrect:</strong> {result.examWrong}</span>
                      </div>
                    </div>

                    {/* Rank */}
                    <div style={{ padding: '1.25rem', background: 'var(--bg-3)', borderRadius: '14px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase' }}>All India Rank</span>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-light)' }}>
                        #{result.rank}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: '0.25rem' }}>
                        Based on official tie-breaker rules
                      </span>
                    </div>
                  </div>

                  {/* Prize / Scholarship Notice */}
                  {(() => {
                    const prize = getPrizeDetails(result.rank);
                    if (prize) {
                      return (
                        <div 
                          style={{ 
                            padding: '1.5rem', 
                            background: prize.bg, 
                            border: `1px solid ${prize.border}`, 
                            borderRadius: '14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1, color: prize.color }}>
                            <Trophy size={80} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: prize.color, fontWeight: 800, fontSize: '1.05rem' }}>
                            <Sparkles size={18} />
                            <span>{prize.title}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-1)' }}>
                            Congratulations! You qualified for: {prize.prize}
                          </p>
                          {prize.description && (
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.4 }}>
                              {prize.description}
                            </p>
                          )}
                          <div style={{ marginTop: '0.5rem', fontSize: '0.82rem' }}>
                            <Link href="/scholarship-terms" target="_blank" style={{ color: prize.color, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'underline' }}>
                              View prize disbursement terms <ExternalLink size={12} />
                            </Link>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '14px', color: 'var(--text-2)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: 'var(--text-1)' }}>Thank you for participating!</p>
                          Your rank is outside the scholarship prize bracket. Don't be discouraged—every attempt is a step closer to success. Keep learning and growing!
                          <div style={{ marginTop: '0.5rem' }}>
                            <Link href="/scholarship-terms" target="_blank" style={{ color: 'var(--primary-light)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'underline' }}>
                              View prize bracket guidelines <ExternalLink size={12} />
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Support and Queries Footer Card */}
        <div 
          className="card card-p" 
          style={{ 
            padding: '1.5rem', 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            textAlign: 'left',
            marginTop: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'rgba(99, 102, 241, 0.1)', 
              color: 'var(--primary-light)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Mail size={16} />
            </div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-1)' }}>Result Queries & Support</h4>
          </div>
          
          <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
            For any queries or concerns regarding your results, please contact us at:
          </p>
          
          <div style={{ background: 'var(--bg-3)', padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'inline-block' }}>
            <a href="mailto:result@jobadda.in" style={{ color: 'var(--primary-light)', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'underline' }}>
              result@jobadda.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
