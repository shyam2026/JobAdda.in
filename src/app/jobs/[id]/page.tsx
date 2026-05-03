'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MapPin, Briefcase, Clock, Share2, Building, Users, Globe, CheckCircle, ArrowLeft, Loader2, AlertCircle, IndianRupee, ExternalLink, Tag } from 'lucide-react';
import Link from 'next/link';

interface CompanyInfo {
  id: string;
  slug?: string | null;
  name: string;
  email: string;
  logo?: string | null;
  companyName?: string;
  hq?: string | null;
  size?: string | null;
  type?: string | null;
  website?: string | null;
  bio?: string | null;
}

interface JobDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  salary?: string | null;
  type: string;
  category?: string;
  requirements?: string | null;
  externalLink?: string | null;
  status: string;
  createdAt: string;
  company: CompanyInfo;
  applications: { id: string }[];
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function parseListItems(text?: string | null): string[] {
  if (!text) return [];
  return text.split('\n').map(l => l.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
}

const TYPE_COLOR: Record<string, string> = {
  'Full-time': '#10b981', 'INTERNAL': '#10b981',
  'Remote': '#6366f1', 'Hybrid': '#f59e0b',
  'Part-time': '#8b5cf6', 'Internship': '#ec4899',
  'EXTERNAL': '#f59e0b',
};

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Job not found');
        return r.json();
      })
      .then(data => { setJob(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  const handleApply = async () => {
    if (!session) {
      window.location.href = `/login?callbackUrl=/jobs/${id}`;
      return;
    }
    setApplying(true);
    setApplyError('');
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id }),
      });
      const data = await res.json();
      if (res.status === 201) setApplied(true);
      else if (res.status === 409) setApplied(true);
      else setApplyError(data.error || 'Failed to apply. Please try again.');
    } catch {
      setApplyError('Network error. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: job?.title, url });
    else navigator.clipboard.writeText(url);
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '3rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: '1rem' }}>
          <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-3)' }}>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '3rem 0' }}>
        <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
          <AlertCircle size={48} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
          <h3>Job Not Found</h3>
          <p style={{ color: 'var(--text-3)', marginBottom: '2rem' }}>This job may have been removed or the link is invalid.</p>
          <Link href="/jobs" className="btn btn-primary">Browse All Jobs</Link>
        </div>
      </div>
    );
  }

  const requirements = parseListItems(job.requirements);
  const isExternal = job.type === 'EXTERNAL' && job.externalLink;
  const typeColor = TYPE_COLOR[job.type] || 'var(--primary)';
  const companyName = job.company?.companyName || job.company?.name || 'Company';
  const logo = job.company?.logo;
  const initial = companyName[0]?.toUpperCase() || 'C';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0 5rem' }}>
      <div className="container">
        <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-3)', fontSize: '0.88rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ArrowLeft size={15} /> Back to Jobs
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: '2rem', alignItems: 'start' }} className="job-detail-grid">
          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Header Card */}
            <div className="card card-p">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '16px',
                  background: logo ? 'transparent' : `${typeColor}15`,
                  border: `2px solid ${typeColor}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '900', fontSize: '2rem', color: typeColor,
                  flexShrink: 0, overflow: 'hidden',
                }}>
                  {logo
                    ? <img src={logo} alt={companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initial
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ marginBottom: '0.3rem', lineHeight: 1.2 }}>{job.title}</h2>
                  <Link
                    href={`/companies/${job.company?.slug || job.company?.id}`}
                    style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary-light)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    {companyName} →
                  </Link>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                      <MapPin size={14} />{job.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                      <Clock size={14} />Posted {timeAgo(job.createdAt)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                      <Users size={14} />{job.applications?.length || 0} Applicants
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ background: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}30`, borderRadius: '2rem', fontSize: '0.78rem', fontWeight: '700', padding: '0.25rem 0.75rem' }}>
                      {job.type}
                    </span>
                    {job.category && job.category !== 'Other' && (
                      <span style={{ background: 'var(--surface)', color: 'var(--text-3)', border: '1px solid var(--border)', borderRadius: '2rem', fontSize: '0.78rem', padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Tag size={11} />{job.category}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={handleShare} className="btn btn-ghost btn-icon" title="Share">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="card card-p">
              <h3 style={{ marginBottom: '1rem' }}>About the Role</h3>
              <div style={{ lineHeight: '1.85', color: 'var(--text-2)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {job.description}
              </div>

              {requirements.length > 0 && (
                <>
                  <h3 style={{ margin: '2rem 0 1rem' }}>Requirements</h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {requirements.map((r, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--text-2)' }}>
                        <CheckCircle size={16} style={{ color: 'var(--success)', marginTop: '0.2rem', flexShrink: 0 }} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Company info card */}
            <div className="card card-p">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '12px',
                  background: logo ? 'transparent' : `${typeColor}15`,
                  border: `1px solid ${typeColor}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '900', fontSize: '1.5rem', color: typeColor,
                  flexShrink: 0, overflow: 'hidden',
                }}>
                  {logo ? <img src={logo} alt={companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>About {companyName}</h3>
                  {job.company?.type && <div style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>{job.company.type} Company</div>}
                </div>
              </div>

              {job.company?.bio && (
                <p style={{ color: 'var(--text-2)', lineHeight: '1.7', marginBottom: '1.25rem' }}>{job.company.bio}</p>
              )}

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {job.company?.hq && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} style={{ color: 'var(--text-3)' }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-2)' }}>{job.company.hq}</span>
                  </div>
                )}
                {job.company?.size && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={14} style={{ color: 'var(--text-3)' }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-2)' }}>{job.company.size} employees</span>
                  </div>
                )}
                {job.company?.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={14} style={{ color: 'var(--text-3)' }} />
                    <a
                      href={job.company.website.startsWith('http') ? job.company.website : `https://${job.company.website}`}
                      target="_blank" rel="noreferrer"
                      style={{ fontSize: '0.88rem', color: 'var(--primary-light)', textDecoration: 'none' }}
                    >
                      {job.company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              <Link href={`/companies/${job.company?.slug || job.company?.id}`} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
                <Building size={14} /> View Company Profile
              </Link>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card card-p" style={{ position: 'sticky', top: 'calc(var(--nav-height, 64px) + 1rem)' }}>
              {job.salary && (
                <div style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '1rem', background: 'rgba(16,185,129,0.06)', borderRadius: 'var(--radius)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '1.85rem', fontWeight: '800', color: 'var(--success)' }}>
                    <IndianRupee size={22} />{job.salary.replace('₹', '')}
                  </div>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: 'var(--text-3)' }}>Estimated annual package</p>
                </div>
              )}

              {job.status === 'ARCHIVED' ? (
                <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(245,158,11,0.1)', borderRadius: 'var(--radius)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <AlertCircle size={32} style={{ color: 'var(--warning)', margin: '0 auto 0.5rem', display: 'block' }} />
                  <p style={{ margin: 0, fontWeight: '700', color: 'var(--warning)' }}>Job Archived</p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: 'var(--text-3)' }}>No longer accepting applications.</p>
                </div>
              ) : applied ? (
                <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <CheckCircle size={36} style={{ color: 'var(--success)', margin: '0 auto 0.5rem', display: 'block' }} />
                  <p style={{ margin: 0, fontWeight: '700', color: 'var(--success)', fontSize: '1.05rem' }}>Applied Successfully!</p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: 'var(--text-3)' }}>We&apos;ll notify you of any updates</p>
                  <Link href="/user/applied-jobs" className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                    View My Applications
                  </Link>
                </div>
              ) : isExternal ? (
                <a
                  href={job.externalLink!} target="_blank" rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <ExternalLink size={16} /> Apply on Company Site
                </a>
              ) : (
                <>
                  <button
                    onClick={handleApply} disabled={applying}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', justifyContent: 'center' }}
                  >
                    {applying ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : '⚡ One-Click Apply'}
                  </button>
                  {applyError && (
                    <div style={{ marginTop: '0.75rem', padding: '0.85rem', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.85rem', color: 'var(--danger)', textAlign: 'center' }}>
                      <AlertCircle size={18} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                      {applyError}
                      {applyError.includes('Profile Incomplete') && (
                        <Link href="/user/profile" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}>
                          Complete Profile
                        </Link>
                      )}
                    </div>
                  )}
                  {!session && (
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.75rem' }}>
                      <Link href="/login" style={{ color: 'var(--primary-light)' }}>Sign in</Link> to apply with your profile
                    </p>
                  )}
                </>
              )}

              {/* Job Details */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { label: 'Job Type', val: job.type },
                  { label: 'Location', val: job.location },
                  { label: 'Category', val: job.category || 'General' },
                  { label: 'Posted', val: timeAgo(job.createdAt) },
                ].map(d => (
                  <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-3)' }}>{d.label}</span>
                    <span style={{ fontWeight: '600' }}>{d.val}</span>
                  </div>
                ))}
              </div>

              {/* Share */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.8rem', textAlign: 'center', marginBottom: '0.75rem', color: 'var(--text-3)' }}>Know someone who&apos;d be a fit?</p>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Share2 size={15} /> Share & Earn Upto ₹50
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
