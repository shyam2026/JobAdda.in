'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Wallet, Briefcase, FileText, Share2, TrendingUp, Star, Copy, CheckCircle, ExternalLink, ChevronRight, Loader2, Target } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  walletBalance: number;
  totalApplications: number;
  profileScore: number;
  totalReferrals: number;
  referralCode: string;
  recommendedJobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    matchCount: number;
  }>;
  recentApplications: Array<{
    id: string;
    jobId: string;
    status: string;
    createdAt: string;
    title: string;
    company: string;
    location: string;
  }>;
  referralStats: {
    joined: number;
    earned: number;
    link: string;
  };
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'Applied', cls: 'badge-muted' },
  REVIEWING: { label: 'Shortlisted', cls: 'badge-success' },
  HIRED: { label: 'Hired 🎉', cls: 'badge-success' },
  REJECTED: { label: 'Not Selected', cls: 'badge-danger' },
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [isPremium, setIsPremium] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/dashboard')
      .then(r => r.json())
      .then(dash => {
        if (!dash.error) setData(dash);
        setLoading(false);
      }).catch(() => setLoading(false));
    // Fetch real-time premium status from DB (not stale session)
    fetch('/api/profile').then(r => r.json()).then(p => {
      if (p && !p.error) {
        setIsPremium(p.isPremium || false);
        setProfile(p);
      }
    }).catch(() => {});
  }, []);

  const handleCopy = () => {
    if (!data?.referralCode) return;
    const link = `${window.location.origin}/register?ref=${data.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-3)' }}>Personalizing your dashboard...</p>
      </div>
    );
  }

  const user = session?.user as any;
  const stats = [
    { label: 'Wallet Balance', value: `₹${(data?.walletBalance || 0).toFixed(0)}`, icon: Wallet, color: '#10b981', sub: 'Refer to earn more' },
    { label: 'Job Applications', value: String(data?.totalApplications || 0), icon: Briefcase, color: '#6366f1', sub: 'Active jobs track' },
    { label: 'Profile Completion Score', value: `${data?.profileScore || 0}%`, icon: Star, color: '#f59e0b', sub: 'Target 100% to apply' },
    { label: 'Successful Referrals', value: String(data?.totalReferrals || 0), icon: Share2, color: '#ec4899', sub: `Successful credits` },
  ];

  return (
    <div className="anim-fade-up">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h2>
          <p style={{ color: 'var(--text-3)', margin: 0 }}>Track your career progress and opportunities here.</p>
        </div>
        {isPremium && (
          <div style={{ 
            background: 'rgba(251,191,36,0.12)', 
            color: '#fbbf24', 
            fontSize: '0.75rem', 
            padding: '0.5rem 1rem', 
            borderRadius: '12px', 
            border: '1px solid rgba(251,191,36,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 900,
            letterSpacing: '0.05em',
            boxShadow: '0 4px 15px rgba(251,191,36,0.1)',
            height: 'fit-content'
          }}>
            <Star size={14} fill="#fbbf24" /> PREMIUM MEMBER
          </div>
        )}
      </header>





      {/* Stats Grid */}
      <div className="grid-4 stats-grid-mobile" style={{ marginBottom: '2.5rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="card card-p-sm stats-card-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stats-icon-mobile" style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={20} />
            </div>
            <div>
              <div className="stats-val-mobile" style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: '500' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Section */}
      {isPremium ? (
        /* Permanent Premium Member Card */
        <div className="card anim-fade-up" style={{ 
          background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.03))', 
          border: '1px solid rgba(251,191,36,0.3)', 
          padding: '1.75rem 2rem', 
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
            <Star size={140} fill="#fbbf24" color="#fbbf24" />
          </div>
          <div style={{ background: 'rgba(251,191,36,0.15)', padding: '1.25rem', borderRadius: '20px', color: '#fbbf24', boxShadow: '0 8px 25px rgba(251,191,36,0.15)' }}>
            <Star size={36} fill="#fbbf24" />
          </div>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#fbbf24' }}>Premium Benefits Active</h3>
              <span style={{ padding: '0.25rem 0.6rem', background: '#10b981', color: '#fff', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>PRO</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
              Your membership is valid until <strong>{profile?.premiumUntil ? new Date(profile.premiumUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</strong>.
              Enjoy unlimited HR chat, premium resume templates, and priority application status.
            </p>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
             <Link href="/user/premium" className="btn btn-sm" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)', padding: '0.75rem 1.5rem', fontWeight: 800 }}>
               View Benefits
             </Link>
          </div>
        </div>
      ) : (
        /* Premium Upgrade CTA */
        <div className="card anim-fade-up premium-card-mobile" style={{ 
          background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
          border: '1px solid #fbbf24', 
          padding: '1.5rem 2rem', 
          marginBottom: '2.5rem', 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
            <Star size={120} fill="#fbbf24" color="#fbbf24" />
          </div>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative', zIndex: 1 }}>
            <h3 style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', fontSize: '1.25rem' }}>
              <Star size={20} fill="#fbbf24" /> Unlock Premium Access
            </h3>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
              Direct HR Chat · Premium Badge ⭐ · Priority Support · 1-Year Access
            </p>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
             <Link href="/user/premium" className="btn premium-btn-mobile" style={{ background: '#fbbf24', color: '#000', fontWeight: 800, padding: '0.8rem 2rem', border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 8px 20px rgba(251,191,36,0.2)' }}>
               Upgrade Now — ₹99 <ChevronRight size={18} />
             </Link>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        {/* Recent Applications */}
        <div className="card card-p">
          <div className="flex-between header-mobile-flex" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={18} /> Recent Applications</h4>
            <Link href="/user/applied-jobs" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data?.recentApplications && data.recentApplications.length > 0 ? (
              data.recentApplications.map((app) => {
                const s = STATUS_MAP[app.status] || { label: app.status, cls: 'badge-muted' };
                return (
                  <div key={app.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '1rem', 
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)'
                  }}>
                    <div className="avatar avatar-sm" style={{ background: 'var(--bg-3)' }}>{app.company?.[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{app.company} · {timeAgo(app.createdAt)}</div>
                    </div>
                    <span className={`badge ${s.cls}`}>{s.label}</span>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
                <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>No applications yet. Start applying!</p>
                <Link href="/jobs" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Browse Jobs</Link>
              </div>
            )}
          </div>
        </div>

        {/* Refer & Earn Mini Widget */}
        <div className="card card-p" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))', border: '1px solid rgba(99,102,241,0.15)' }}>
          <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Share2 size={18} /> Invite & Earn</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '1.5rem' }}>Earn Upto ₹50 for every friend who joins JobAdda.in using your link.</p>
          
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-2)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--primary-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', alignSelf: 'center' }}>
              {data ? `${window.location.origin}/register?ref=${data.referralCode}` : 'Loading...'}
            </div> 
            <button 
              onClick={handleCopy} 
              className={`btn btn-sm ${copied ? 'btn-success' : 'btn-primary'}`}
              style={{ padding: '0.5rem 1rem' }}
            >
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            </button>
          </div>

          <div className="grid-2 grid-2-mobile" style={{ gap: '0.75rem', marginTop: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>{data?.referralStats.joined || 0}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>Joined</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>₹{data?.referralStats.earned || 0}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Jobs - 2x3 Grid */}
      <div style={{ marginTop: '2.5rem' }}>
        <div className="flex-between header-mobile-flex" style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target size={18} style={{ color: 'var(--primary-light)' }} /> Recommended for you</h4>
          <Link href="/jobs" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Explore <ChevronRight size={14} /></Link>
        </div>
        <div className="grid-3 job-grid-mobile">
          {data?.recommendedJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="card card-p-sm job-hover-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
              {job.matchCount > 0 && (
                <div style={{ position: 'absolute', top: '0', right: '0', background: 'var(--primary-light)', color: 'white', fontSize: '0.6rem', fontWeight: '800', padding: '2px 8px', borderRadius: '0 0 0 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={8} fill="white" /> {job.matchCount} MATCH
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="company-logo" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>{job.company?.[0]}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{job.company}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ color: 'var(--success)', fontWeight: '700', fontSize: '0.85rem' }}>{job.salary || 'Best in Market'}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{job.location}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .job-hover-card {
          transition: transform 0.2s, border-color 0.2s, background 0.2s;
        }
        .job-hover-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-active);
          background: rgba(255,255,255,0.04);
        }

        @media (max-width: 768px) {
          .stats-grid-mobile {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.6rem !important;
          }
          .stats-card-mobile {
            padding: 0.75rem !important;
            gap: 0.6rem !important;
          }
          .grid-2-mobile {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stats-icon-mobile {
            width: 36px !important;
            height: 36px !important;
          }
          .stats-val-mobile {
            font-size: 1.1rem !important;
          }
          
          .header-mobile-flex {
            flex-direction: row !important;
            text-align: left !important;
            justify-content: space-between !important;
            margin-bottom: 1rem !important;
          }
          .header-mobile-flex h4 {
            font-size: 1rem !important;
          }
          
          .premium-card-mobile {
            padding: 1.25rem !important;
            text-align: center;
            justify-content: center !important;
          }
          .premium-card-mobile > div {
            min-width: 100% !important;
          }
          .premium-card-mobile h3 {
            justify-content: center !important;
            font-size: 1.15rem !important;
          }
          .premium-btn-mobile {
            width: 100% !important;
            justify-content: center !important;
          }

          .job-grid-mobile {
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
