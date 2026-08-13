'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Search, Loader2, Mail, ExternalLink, Sparkles, HelpCircle, ArrowLeft, CheckCircle2, AlertCircle, Star, BookOpen, Target, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { getScholarshipPhase, ScholarshipPhase } from '@/lib/scholarship-schedule';

function maskMobile(mobile: string) {
  if (!mobile) return '';
  const clean = mobile.replace(/\s/g, '');
  if (clean.length < 4) return '******';
  return '******' + clean.slice(-4);
}

function maskEmail(email: string) {
  if (!email || !email.includes('@')) return '';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return local.charAt(0) + '***@' + domain;
  return local.charAt(0) + '***' + local.charAt(local.length - 1) + '@' + domain;
}

export default function ScholarshipResultPage() {
  const [lookup, setLookup] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<ScholarshipPhase>('REGISTRATION_OPEN');

  useEffect(() => {
    setPhase(getScholarshipPhase());
  }, []);

  const isResultLive = phase === 'RESULT_LIVE';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookup.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`/api/scholarship/result?lookup=${encodeURIComponent(lookup.trim())}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Failed to fetch result');
      else setResult(data);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const getPrizeDetails = (rank: number) => {
    if (rank >= 101 && rank <= 300) {
      return {
        title: `Rank #${rank} Qualifier!`,
        prize: 'Flat ₹15,000 Course Discount',
        description: 'Get Flat ₹15,000 Discount on Data Analyst & Business Analyst Courses, offered by Microsoft Education Partner.',
        color: '#10B981',
        bg: 'rgba(16,185,129,0.08)',
        border: 'rgba(16,185,129,0.25)',
        emoji: '🎓',
      };
    }
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-1)' }}>
      <style>{`
        .result-container { max-width: 700px; margin: 0 auto; padding: 7rem 1.25rem 4rem; }
        .result-hero { background: linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(34,197,94,0.07) 100%); border: 1px solid var(--border); border-radius: 24px; padding: 2.5rem 2rem; text-align: center; margin-bottom: 2rem; }
        .result-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(249,115,22,0.12); border: 1px solid rgba(249,115,22,0.25); color: #F97316; border-radius: 9999px; padding: 0.35rem 1rem; font-size: 0.75rem; font-weight: 800; margin-bottom: 1.25rem; letter-spacing: 0.04em; }
        .result-h1 { font-size: clamp(1.7rem, 5vw, 2.4rem); font-weight: 900; line-height: 1.2; margin: 0 0 0.5rem; }
        .result-sub { color: var(--text-3); font-size: 0.9rem; }
        .search-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; padding: 2rem; margin-bottom: 2rem; }
        .search-form { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .search-input { flex: 1; min-width: 220px; padding: 1rem 1.25rem; border-radius: 14px; background: var(--bg-3); border: 1.5px solid var(--border); color: var(--text-1); font-size: 0.95rem; font-family: inherit; outline: none; transition: border-color 0.2s; }
        .search-input:focus { border-color: var(--primary); }
        .search-btn { display: flex; align-items: center; gap: 0.5rem; background: var(--primary); color: #fff; border: none; border-radius: 14px; padding: 1rem 1.75rem; font-size: 1rem; font-weight: 800; cursor: pointer; font-family: inherit; white-space: nowrap; transition: opacity 0.2s; }
        .search-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .error-box { margin-top: 1.25rem; background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 1rem 1.25rem; color: #F87171; font-size: 0.88rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
        .result-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; padding: 2rem; margin-bottom: 1.5rem; }
        .score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin: 1.5rem 0; }
        .score-box { background: var(--bg-3); border: 1px solid var(--border); border-radius: 14px; padding: 1.25rem; }
        .score-label { font-size: 0.75rem; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
        .score-val { font-size: 2.2rem; font-weight: 900; line-height: 1; }
        .prize-box { border-radius: 16px; padding: 1.5rem; position: relative; overflow: hidden; }
        .prize-trophy { position: absolute; right: -12px; bottom: -12px; opacity: 0.08; }
        .not-submitted { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2); border-radius: 20px; padding: 2.5rem 2rem; text-align: center; }
        .support-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; padding: 1.75rem; margin-top: 1.5rem; }
        .announcement-card { background: linear-gradient(145deg, var(--bg-2) 0%, #0f172a 100%); border: 1px solid rgba(249,115,22,0.3); border-radius: 24px; padding: 2.5rem 2rem; text-align: center; margin-bottom: 2rem; boxShadow: 0 20px 40px rgba(0,0,0,0.3); }
        @media (max-width: 480px) {
          .result-container { padding: 6rem 1rem 3rem; }
          .score-grid { grid-template-columns: 1fr; }
          .search-btn { width: 100%; justify-content: center; }
          .search-input { min-width: 100%; }
        }
      `}</style>

      <div className="result-container">
        {/* Back */}
        <Link href="/scholarship" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', marginBottom: '1.75rem' }}>
          <ArrowLeft size={16} /> Back to Scholarship
        </Link>

        {/* Hero */}
        <div className="result-hero">
          <div className="result-badge">🏆 INDEPENDENCE DAY SPECIAL 2026</div>
          <h1 className="result-h1">
            <span style={{ color: '#F97316' }}>Scholarship </span>
            <span style={{ color: 'var(--text-1)' }}>Test </span>
            <span style={{ color: '#22C55E' }}>Result</span>
          </h1>
          <p className="result-sub">
            {isResultLive 
              ? 'Enter your Registration ID or Mobile Number to check your score & rank' 
              : 'Official Results for Scholarship Exam 2026'}
          </p>
        </div>

        {/* Before Aug 20 Announcement Banner */}
        {!isResultLive ? (
          <div className="announcement-card">
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(249,115,22,0.12)', color: '#F97316', marginBottom: '1.25rem', border: '1px solid rgba(249,115,22,0.3)' }}>
              <Calendar size={32} />
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-1)', margin: '0 0 0.75rem' }}>
              📢 Result Announcement Notice
            </h2>

            <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F97316', margin: '0 0 0.4rem' }}>
                Scholarship Test 2026 Result will be published on 20th August 2026.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', margin: 0, lineHeight: 1.6 }}>
                Evaluation & Merit Rank processing for all exam submissions (15th August 2026) is currently under progress. Top rank holders will be awarded scholarships as per official merit terms.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Exam Status</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#22C55E', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} /> Completed (15th Aug)
                </div>
              </div>

              <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Result Publication</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F97316', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={16} /> 20th August 2026
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', margin: 0 }}>
              Return to this page on <strong style={{ color: 'var(--text-1)' }}>20th August 2026</strong> to enter your Registration ID or Mobile Number and check your score card live.
            </p>
          </div>
        ) : (
          /* Live Result Search Form */
          <div className="search-card">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-1)', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} color="var(--primary-light)" /> Check Your Result
            </h2>
            <form onSubmit={handleSearch} className="search-form">
              <input className="search-input" type="text" value={lookup} onChange={e => setLookup(e.target.value)} placeholder="e.g. JA-XYZ12345 or 9876543210" required />
              <button type="submit" disabled={loading} className="search-btn">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Search</>}
              </button>
            </form>
            {error && <div className="error-box"><AlertCircle size={16} />{error}</div>}
          </div>
        )}

        {/* Results Card */}
        {isResultLive && result && (
          <>
            {!result.examSubmitted ? (
              <div className="not-submitted">
                <HelpCircle size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', margin: '0 0 0.5rem' }}>Result Not Available</h3>
                <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
                  Candidate <strong style={{ color: 'var(--text-1)' }}>{result.candidate.name}</strong> ({maskMobile(result.candidate.mobile)}) is registered but has not submitted the scholarship exam.
                </p>
                <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-2)' }}>
                  If you already appeared and believe this is an error, please email us with details.
                </div>
              </div>
            ) : (
              <div className="result-card">
                {/* Header */}
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary-light)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Scholarship Test 2026 — Official Result</div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-1)', margin: '0 0 0.4rem' }}>{result.candidate.name}</h2>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-3)' }}>
                    <span>📋 <strong>Reg ID:</strong> {result.candidate.registrationNo}</span>
                    <span>📱 {maskMobile(result.candidate.mobile)}</span>
                    <span>✉️ {maskEmail(result.candidate.email)}</span>
                  </div>
                </div>

                {/* Score & Rank */}
                <div className="score-grid">
                  <div className="score-box">
                    <div className="score-label">Your Score</div>
                    <div className="score-val" style={{ color: 'var(--text-1)' }}>{result.examScore}<span style={{ fontSize: '1.2rem', color: 'var(--text-3)', fontWeight: 600 }}>/150</span></div>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      <span style={{ color: '#22C55E', fontWeight: 700 }}>✓ {result.examCorrect} Correct</span>
                      <span style={{ color: '#EF4444', fontWeight: 700 }}>✗ {result.examWrong} Wrong</span>
                    </div>
                  </div>
                  <div className="score-box">
                    <div className="score-label">All India Rank</div>
                    <div className="score-val" style={{ color: 'var(--primary-light)' }}>#{result.rank}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '0.5rem' }}>Based on official tie-breaker rules</div>
                  </div>
                </div>

                {/* Prize */}
                {(() => {
                  const prize = getPrizeDetails(result.rank);
                  if (prize) return (
                    <div className="prize-box" style={{ background: prize.bg, border: `1px solid ${prize.border}` }}>
                      <div className="prize-trophy"><Trophy size={90} color={prize.color} /></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: prize.color, fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        <Sparkles size={18} /> {prize.emoji} {prize.title}
                      </div>
                      <p style={{ margin: '0 0 0.4rem', fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-1)' }}>🎉 Congratulations! You qualified for: {prize.prize}</p>
                      {prize.description && <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{prize.description}</p>}
                      <Link href="/scholarship-terms" target="_blank" style={{ color: prize.color, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem', textDecoration: 'underline' }}>
                        View prize disbursement terms <ExternalLink size={12} />
                      </Link>
                    </div>
                  );
                  return (
                    <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
                      <p style={{ margin: '0 0 0.5rem', fontWeight: 700, color: 'var(--text-1)' }}>Thank you for participating! 🙏</p>
                      <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.5 }}>Your rank is outside the scholarship prize bracket. Keep learning and growing!</p>
                      <Link href="/scholarship-terms" target="_blank" style={{ color: 'var(--primary-light)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem', textDecoration: 'underline' }}>
                        View prize bracket guidelines <ExternalLink size={12} />
                      </Link>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}

        {/* Support */}
        <div className="support-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={18} />
            </div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-1)' }}>Result Queries & Support</h4>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>For any result-related queries or concerns, please contact us at:</p>
          <a href="mailto:result@jobadda.in" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.08)', color: 'var(--primary-light)', fontWeight: 800, fontSize: '0.95rem', padding: '0.65rem 1.25rem', borderRadius: '10px', textDecoration: 'none', border: '1px solid rgba(99,102,241,0.2)' }}>
            ✉️ result@jobadda.in
          </a>
        </div>
        
      </div>
    </div>
  );
}
