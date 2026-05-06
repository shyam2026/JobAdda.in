'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MapPin, Briefcase, Clock, Share2, Building, Users, Globe, CheckCircle, ArrowLeft, Loader2, AlertCircle, IndianRupee, ExternalLink, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  employmentType?: string;
  requirements?: string | null;
  externalLink?: string | null;
  status: string;
  createdAt: string;
  company: CompanyInfo;
  applications: { id: string }[];
  openings?: number | null;
  experience?: string | null;
  education?: string | null;
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
  // Split by new line, then handle each line
  return text.split('\n')
    .map(l => l.trim())
    .filter(Boolean);
}

const TYPE_COLOR: Record<string, string> = {
  'Full-time': '#10b981', 'INTERNAL': '#10b981',
  'Remote': '#6366f1', 'Hybrid': '#f59e0b',
  'Part-time': '#8b5cf6', 'Internship': '#ec4899',
  'EXTERNAL': '#f59e0b',
};

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const { data: session } = useSession();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [bioExpanded, setBioExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Job not found');
        return r.json();
      })
      .then(data => { 
        setJob(data); 
        if (data.isApplied) setApplied(true);
        setLoading(false); 
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (session) {
      fetch('/api/profile')
        .then(r => r.json())
        .then(data => {
          if (data && typeof data.completion === 'number') {
            setProfileCompletion(data.completion);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  const handleApply = async () => {
    if (!session) {
      window.location.href = `/login?callbackUrl=/jobs/${id}`;
      return;
    }
    
    if (profileCompletion !== null && profileCompletion < 40) {
      setApplyError(`Profile Incomplete (${profileCompletion}%). You need at least 40% completion to apply.`);
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

  const handleExternalApply = async () => {
    if (!session) {
      window.location.href = `/login?callbackUrl=/jobs/${id}`;
      return;
    }
    
    if (profileCompletion !== null && profileCompletion < 40) {
      setApplyError(`Profile Incomplete (${profileCompletion}%). You need at least 40% completion to apply.`);
      return;
    }

    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id }),
      });
      setApplied(true);
      if (job) {
        setJob({
          ...job,
          applications: [...job.applications, { id: 'temp-external' }]
        });
      }
    } catch (e) {
      console.error("EXTERNAL_CLICK_TRACKING_ERROR", e);
    }

    if (job?.externalLink) {
      window.open(job.externalLink, '_blank', 'noopener,noreferrer');
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
      {/* Mobile sticky apply bar — hidden on desktop */}
      <div className="mobile-apply-bar">
        {job.status !== 'ARCHIVED' && job.status !== 'CLOSED' && (
          applied ? (
            <button
              onClick={() => {
                if (isExternal && job.externalLink) window.open(job.externalLink, '_blank', 'noopener,noreferrer');
                else router.push('/user/applied-jobs');
              }}
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--success)', color: 'var(--success)', background: 'rgba(16,185,129,0.05)', padding: '0.8rem' }}
            >
              <CheckCircle size={17} style={{ marginRight: '0.4rem' }} /> Applied
            </button>
          ) : isExternal ? (
            <button onClick={handleExternalApply} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.8rem', gap: '0.4rem' }}>
              Apply Now <ExternalLink size={15} />
            </button>
          ) : (
            <button onClick={handleApply} disabled={applying} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.8rem' }}>
              {applying ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite', marginRight: '0.4rem' }} />Submitting...</> : 'One-Click Apply'}
            </button>
          )
        )}
      </div>
      <div className="container">
        <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-3)', fontSize: '0.88rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ArrowLeft size={15} /> Back to Jobs
        </Link>

        <div className="job-detail-grid" style={{ display: 'grid', gap: '1.5rem', alignItems: 'start' }}>
          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>

            {/* Header Card */}
            <div className="card card-p job-header-card" style={{ position: 'relative' }}>
              {/* Status badge — isolated top-right */}
              <div className="job-status-corner" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ 
                  background: job.status === 'OPEN' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', 
                  color: job.status === 'OPEN' ? '#10b981' : '#ef4444', 
                  border: `1px solid ${job.status === 'OPEN' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, 
                  borderRadius: '2rem', fontSize: '0.75rem', padding: '0.25rem 0.7rem', 
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', letterSpacing: '0.01em',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{ 
                    width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                    background: job.status === 'OPEN' ? '#10b981' : '#ef4444',
                    boxShadow: job.status === 'OPEN' ? '0 0 6px #10b981' : '0 0 6px #ef4444'
                  }} />
                  {job.status === 'OPEN' ? 'Active' : 'Inactive'}
                </span>
                <button onClick={handleShare} className="btn btn-ghost btn-icon" title="Share" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <Share2 size={16} />
                </button>
              </div>

              {/* Logo + Title + Company */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingRight: '8rem' }}>
                <div className="job-logo-box" style={{ flexShrink: 0 }}>
                  {logo
                    ? <img src={logo} alt={companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initial
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ marginBottom: '0.25rem', lineHeight: 1.2, wordBreak: 'break-word' }}>{job.title}</h2>
                  <Link
                    href={`/companies/${job.company?.slug || job.company?.id}`}
                    style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary-light)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    {companyName} →
                  </Link>
                </div>
              </div>

              {/* Meta row — location · posted · applicants */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.25rem', marginTop: '1rem', paddingLeft: '0.1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.83rem', color: 'var(--text-3)' }}>
                  <MapPin size={13} />{job.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.83rem', color: 'var(--text-3)' }}>
                  <Clock size={13} />Posted {timeAgo(job.createdAt)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.83rem', color: 'var(--text-3)' }}>
                  <Users size={13} />{job.applications?.length || 0} Applicants
                </span>
              </div>

              {/* Tags row — employment type + category */}
              {(job.employmentType || (job.category && job.category !== 'Other')) && (
                <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                  {job.employmentType && (
                    <span style={{ background: 'var(--surface)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: '0.4rem', fontSize: '0.78rem', padding: '0.22rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                      <Briefcase size={11} />{job.employmentType}
                    </span>
                  )}
                  {job.category && job.category !== 'Other' && (
                    <span style={{ background: 'rgba(99,102,241,0.08)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.4rem', fontSize: '0.78rem', padding: '0.22rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                      <Tag size={11} />{job.category}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card card-p">
              {job.description && job.description.replace(/<[^>]*>/g, '').trim() !== '' && (
                <>
                  <h3 style={{ marginBottom: '1rem' }}>About the Role</h3>
                  <div 
                    className="rich-text-content"
                    style={{ lineHeight: '1.85', color: 'var(--text-2)', overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'normal', hyphens: 'none' }}
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </>
              )}

              {job.requirements && job.requirements.replace(/<[^>]*>/g, '').trim() !== '' && (
                <>
                  <h3 style={{ margin: '2rem 0 1rem' }}>Requirements</h3>
                  <div 
                    className="rich-text-content"
                    style={{ lineHeight: '1.85', color: 'var(--text-2)', overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'normal', hyphens: 'none' }}
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </>
              )}

              {(job as any).skills && (job as any).skills.split(',').map((s: string) => s.trim()).filter(Boolean).length > 0 && (
                <>
                  <h3 style={{ margin: '2rem 0 1rem' }}>Required Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {(job as any).skills.split(',').map((s: string) => s.trim()).filter(Boolean).map((skill: string, idx: number) => (
                      <span key={idx} style={{ background: 'rgba(56, 189, 248, 0.08)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '0.5rem', fontSize: '0.88rem', padding: '0.35rem 0.8rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="job-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card card-p" style={{ position: 'sticky', top: 'calc(var(--nav-height, 64px) + 1rem)' }}>
              {job.salary && (
                <div style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '1rem', background: 'rgba(16,185,129,0.06)', borderRadius: 'var(--radius)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '1.85rem', fontWeight: '800', color: 'var(--success)' }}>
                    <IndianRupee size={22} />{job.salary.replace('₹', '')}
                  </div>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: 'var(--text-3)' }}>Estimated annual package</p>
                </div>
              )}

              {(job.status === 'ARCHIVED' || job.status === 'CLOSED') ? (
                <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(239, 68, 68, 0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                  <AlertCircle size={32} style={{ color: 'var(--danger)', margin: '0 auto 0.5rem', display: 'block' }} />
                  <p style={{ margin: 0, fontWeight: '700', color: 'var(--danger)' }}>Job Closed</p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: 'var(--text-3)' }}>This job is no longer accepting applications.</p>
                </div>
              ) : applied ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      if (isExternal && job.externalLink) {
                        window.open(job.externalLink, '_blank', 'noopener,noreferrer');
                      } else {
                        router.push('/user/applied-jobs');
                      }
                    }}
                    className="btn btn-outline"
                    style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', justifyContent: 'center', borderColor: 'var(--success)', color: 'var(--success)', background: 'rgba(16,185,129,0.05)' }}
                  >
                    <CheckCircle size={18} style={{ marginRight: '0.5rem' }} /> Applied {isExternal && <ExternalLink size={14} style={{ marginLeft: '0.35rem' }} />}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-3)' }}>
                    {isExternal ? 'Click above to return to the company career page.' : 'You have already applied for this position.'}
                  </p>
                </div>
              ) : isExternal ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={handleExternalApply}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    Apply Now <ExternalLink size={16} />
                  </button>
                  {applyError && (
                    <div style={{ padding: '0.85rem', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.85rem', color: 'var(--danger)', textAlign: 'center' }}>
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
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>
                      <Link href={`/login?callbackUrl=/jobs/${id}`} style={{ color: 'var(--primary-light)' }}>Sign in</Link> to apply
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={handleApply} disabled={applying}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', justifyContent: 'center' }}
                  >
                    {applying ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : 'One-Click Apply'} 
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
                      <Link href={`/login?callbackUrl=/jobs/${id}`} style={{ color: 'var(--primary-light)' }}>Sign in</Link> to apply
                    </p>
                  )}
                </>
              )}

              {/* Job Details */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>

                {/* Group 1 — Position */}
                <p style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--text-3)', textTransform: 'uppercase', margin: '0 0 0.65rem' }}>Position</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem' }}>
                    <MapPin size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-3)', minWidth: '70px' }}>Location</span>
                    <span style={{ fontWeight: '600', marginLeft: 'auto' }}>{job.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem' }}>
                    <Users size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-3)', minWidth: '70px' }}>Openings</span>
                    <span style={{ fontWeight: '600', marginLeft: 'auto' }}>{job.openings ? `${job.openings} Position${job.openings > 1 ? 's' : ''}` : '1 Position'}</span>
                  </div>
                </div>

                {/* Group 2 — Role Requirements */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1.1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--text-3)', textTransform: 'uppercase', margin: '0 0 0.65rem' }}>Role</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem' }}>
                      <Briefcase size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-3)', minWidth: '70px' }}>Experience</span>
                      <span style={{ fontWeight: '600', marginLeft: 'auto', textAlign: 'right' }}>{job.experience || 'Not Specified'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem' }}>
                      <CheckCircle size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-3)', minWidth: '70px' }}>Education</span>
                      <span style={{ fontWeight: '600', marginLeft: 'auto', textAlign: 'right' }}>{job.education || 'Graduation'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem' }}>
                      <Tag size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-3)', minWidth: '70px' }}>Category</span>
                      <span style={{ fontWeight: '600', marginLeft: 'auto', textAlign: 'right' }}>{job.category === 'Other' ? 'General Hiring' : (job.category || 'General Hiring')}</span>
                    </div>
                  </div>
                </div>

                {/* Group 3 — Timeline */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--text-3)', textTransform: 'uppercase', margin: '0 0 0.65rem' }}>Timeline</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem' }}>
                    <Clock size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-3)', minWidth: '70px' }}>Posted</span>
                    <span style={{ fontWeight: '600', marginLeft: 'auto' }}>{timeAgo(job.createdAt)}</span>
                  </div>
                </div>

              </div>

              {/* Share */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.8rem', textAlign: 'center', marginBottom: '0.75rem', color: 'var(--text-3)' }}>Know someone who&apos;d be a fit?</p>
                <button
                  disabled={copied}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 5000);
                  }}
                  className="btn btn-outline"
                  style={{ 
                    width: '100%', justifyContent: 'center', gap: '0.5rem', 
                    borderStyle: 'dashed', 
                    borderColor: copied ? 'var(--success)' : 'var(--primary-light)', 
                    color: copied ? 'var(--success)' : 'var(--primary-light)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {copied ? (
                    <>
                      <CheckCircle size={15} /> Link copied!
                    </>
                  ) : (
                    <>
                      <Share2 size={15} /> Share this job
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Company info card — elegant bottom full-width section */}
        <div className="card card-p" style={{ marginTop: '1.5rem' }}>
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
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ color: 'var(--text-2)', lineHeight: '1.7', fontSize: '0.92rem' }}>
                {bioExpanded ? job.company.bio : job.company.bio.split(' ').slice(0, 30).join(' ') + (job.company.bio.split(' ').length > 30 ? '...' : '')}
              </p>
              {job.company.bio.split(' ').length > 30 && (
                <button 
                  onClick={() => setBioExpanded(!bioExpanded)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', padding: 0, marginTop: '0.4rem' }}
                >
                  {bioExpanded ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
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

          <Link href={`/companies/${job.company?.slug || job.company?.id}`} className="btn btn-outline btn-sm" style={{ gap: '0.4rem', display: 'inline-flex', width: 'auto' }}>
            <Building size={14} /> View Company Profile
          </Link>
        </div>
      </div>
      <style>{`
        .job-detail-grid { 
          grid-template-columns: 1fr 320px; 
          gap: 2rem !important;
        }

        .job-logo-box {
          width: 68px;
          height: 68px;
          border-radius: 14px;
          background: ${logo ? 'transparent' : `${typeColor}15`};
          border: 2px solid ${typeColor}30;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.9rem;
          color: ${typeColor};
          flex-shrink: 0;
          overflow: hidden;
        }

        /* Mobile sticky apply bar */
        .mobile-apply-bar {
          display: none;
        }

        @media (max-width: 992px) {
          .job-detail-grid { 
            grid-template-columns: 1fr !important; 
            gap: 1.25rem !important; 
          }
          /* Un-stick the sidebar card on mobile */
          .job-sidebar .card { position: static !important; }
        }

        @media (max-width: 640px) {
          body { padding-bottom: 72px; }

          .mobile-apply-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding: 0.75rem 1rem;
            background: var(--bg);
            border-top: 1px solid var(--border);
            box-shadow: 0 -4px 20px rgba(0,0,0,0.25);
            gap: 0.75rem;
          }

          /* Reduce page top padding */
          .job-page-wrapper { padding: 1rem 0 1rem !important; }

          .container { padding: 0 0.875rem !important; }
          .card-p { padding: 1rem !important; }

          /* Header adjustments */
          .job-status-corner {
            top: 1rem !important;
            right: 1rem !important;
          }
          .job-logo-box {
            width: 52px !important;
            height: 52px !important;
            font-size: 1.4rem !important;
            border-radius: 10px !important;
          }
          .job-header-card h2 { font-size: 1.25rem !important; }

          /* Header padding-right reduced for small status badge */
          .job-header-card > div:nth-child(2) {
            padding-right: 5.5rem !important;
          }

          /* Sidebar details text */
          .job-sidebar .card { font-size: 0.83rem; }

          /* Salary amount smaller */
          .salary-amount { font-size: 1.5rem !important; }
        }

        @media (max-width: 400px) {
          .job-status-corner span:first-child { display: none; }
        }

        .rich-text-content ul, .rich-text-content ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .rich-text-content ul { list-style-type: disc; }
        .rich-text-content ol { list-style-type: decimal; }
        .rich-text-content li { color: var(--text-2); line-height: 1.7; font-size: 0.95rem; }
        .rich-text-content li::marker { color: var(--primary-light); }
        .rich-text-content p { margin-bottom: 1rem; line-height: 1.7; color: var(--text-2); overflow-wrap: break-word; word-wrap: break-word; word-break: normal; hyphens: none; }
        .rich-text-content b, .rich-text-content strong { color: white; font-weight: 700; margin-top: 0.5rem; display: inline-block; }
        .rich-text-content b:first-child, .rich-text-content strong:first-child { margin-top: 0; }
      `}</style>
    </div>
  );
}
