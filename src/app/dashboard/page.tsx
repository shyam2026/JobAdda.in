'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Wallet, Briefcase, FileText, Share2, TrendingUp, Bell, User, Star, LogOut, LayoutDashboard, Copy, CheckCircle, ExternalLink } from 'lucide-react';

const SIDEBAR_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/jobs', icon: Briefcase, label: 'Browse Jobs' },
  { href: '/jobs/applied', icon: TrendingUp, label: 'My Applications' },
  { href: '/profile', icon: User, label: 'My Profile' },
  { href: '/resume', icon: FileText, label: 'Resume Builder' },
  { href: '/refer', icon: Share2, label: 'Refer & Earn' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
];

interface DashboardData {
  stats: { walletBalance: number; applications: number; shortlisted: number; referrals: number };
  referralCode: string;
  profileCompletion: number;
  recentApplications: Array<{
    id: string;
    status: string;
    createdAt: string;
    job: { title: string; location: string; company: { name: string } };
  }>;
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'authenticated') {
      Promise.all([
        fetch('/api/dashboard').then(r => r.json()),
        fetch('/api/jobs?limit=3').then(r => r.json()),
      ]).then(([dash, jobsData]) => {
        setData(dash);
        setRecommendedJobs(jobsData.jobs || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const handleCopy = () => {
    if (!data?.referralCode) return;
    const link = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jobadda.in'}/register?ref=${data.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="skeleton" style={{ width: '200px', height: '24px', borderRadius: '8px' }} />
        <p style={{ color: 'var(--text-3)' }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <h3>Please sign in to access your dashboard</h3>
        <a href="/login" className="btn btn-primary">Login to JobAdda.in</a>
      </div>
    );
  }

  const user = session.user as { name?: string | null; email?: string | null; role?: string };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobadda.in';
  const referralLink = data?.referralCode ? `${siteUrl}/register?ref=${data.referralCode}` : '';

  const stats = [
    { label: 'Wallet Balance', value: `₹${(data?.stats.walletBalance || 0).toFixed(0)}`, icon: Wallet, color: '#10b981', sub: data?.stats.referrals ? `+₹${(data.stats.referrals * 50)} from referrals` : 'Refer to earn' },
    { label: 'Applications', value: String(data?.stats.applications || 0), icon: Briefcase, color: '#6366f1', sub: data?.stats.shortlisted ? `${data.stats.shortlisted} shortlisted` : 'Apply to jobs' },
    { label: 'Profile Score', value: `${data?.profileCompletion || 0}%`, icon: Star, color: '#f59e0b', sub: data?.profileCompletion === 100 ? 'Profile complete!' : 'Complete your profile' },
    { label: 'Referrals', value: String(data?.stats.referrals || 0), icon: Share2, color: '#ec4899', sub: `₹${((data?.stats.referrals || 0) * 50)} earned` },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{user.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{user.role || 'Student'}</div>
          </div>
        </div>

        <div className="hide-mobile" style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.08)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-2)', fontWeight: '500' }}>Profile Strength</span>
            <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>{data?.profileCompletion || 0}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${data?.profileCompletion || 0}%` }} />
          </div>
        </div>

        {SIDEBAR_ITEMS.map(item => (
          <a key={item.href} href={item.href} className="sidebar-item">
            <item.icon size={18} />
            {item.label}
          </a>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="sidebar-item"
            style={{ color: 'var(--danger)', width: '100%' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-content">
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.25rem' }}>Welcome back, {user.name?.split(' ')[0]} 👋</h2>
          <p style={{ margin: 0 }}>Here's your career overview on <strong>JobAdda.in</strong></p>
        </div>

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          {stats.map((s, i) => (
            <div key={i} className="card card-p-sm" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius)', background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.72rem', color: s.color, marginTop: '0.1rem' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {/* Recent Applications */}
          <div className="card card-p">
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h4>Recent Applications</h4>
              <a href="/jobs/applied" className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>View All</a>
            </div>
            {data?.recentApplications && data.recentApplications.length > 0 ? (
              data.recentApplications.map((app, i) => {
                const s = STATUS_MAP[app.status] || { label: app.status, cls: 'badge-muted' };
                return (
                  <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 0', borderBottom: i < data.recentApplications.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="avatar avatar-sm">{app.job?.company?.name?.[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.job?.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{app.job?.company?.name} · {timeAgo(app.createdAt)}</div>
                    </div>
                    <span className={`badge ${s.cls}`} style={{ flexShrink: 0 }}>{s.label}</span>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-3)' }}>
                <Briefcase size={32} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                <p style={{ margin: 0 }}>No applications yet</p>
                <a href="/jobs" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Browse Jobs</a>
              </div>
            )}
          </div>

          {/* Referral Widget */}
          <div className="card card-p" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.2)' }}>
            <h4 style={{ marginBottom: '1rem' }}>💸 Your Referral Link</h4>
            <p style={{ fontSize: '0.88rem', marginBottom: '1.25rem' }}>Share and earn ₹50 for every successful signup</p>
            {referralLink ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  value={referralLink}
                  readOnly
                  style={{ fontSize: '0.76rem', color: 'var(--primary-light)', flex: 1 }}
                />
                <button onClick={handleCopy} className={`btn btn-sm ${copied ? 'btn-success' : 'btn-primary'}`} style={{ flexShrink: 0, gap: '0.3rem' }}>
                  {copied ? <><CheckCircle size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
            ) : (
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-3)' }}>
                Loading your referral code...
              </div>
            )}
            <div className="grid-2" style={{ gap: '0.75rem' }}>
              {[
                { label: 'Total Referrals', val: String(data?.stats.referrals || 0) },
                { label: 'Total Earned', val: `₹${((data?.stats.referrals || 0) * 50)}` }
              ].map(r => (
                <div key={r.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{r.val}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="card card-p" style={{ marginTop: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h4>Latest Job Openings</h4>
            <a href="/jobs" className="btn btn-outline btn-sm">Browse All</a>
          </div>
          {recommendedJobs.length > 0 ? (
            <div className="grid-3">
              {recommendedJobs.map((job: any) => (
                <div key={job.id} className="card card-p-sm" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div className="company-logo" style={{ width: '38px', height: '38px', fontSize: '1rem' }}>
                      {job.company?.name?.[0] || 'C'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{job.company?.name}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--success)', fontWeight: '700', fontSize: '0.88rem' }}>{job.salary || 'Competitive'}</span>
                    <a href={`/jobs/${job.id}`} className="btn btn-primary btn-sm" style={{ padding: '0.3rem 0.8rem', fontSize: '0.78rem' }}>
                      Apply <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-3)' }}>
              <p style={{ margin: 0 }}>No jobs found. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
