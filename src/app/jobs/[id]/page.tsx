'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MapPin, Briefcase, Clock, Share2, BookmarkPlus, Building, Users, Globe, CheckCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface JobDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  salary?: string | null;
  type: string;
  requirements?: string | null;
  externalLink?: string | null;
  status: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
    email: string;
  };
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
      if (res.status === 201) {
        setApplied(true);
      } else if (res.status === 409) {
        setApplied(true); // Already applied
      } else {
        setApplyError(data.error || 'Failed to apply. Please try again.');
      }
    } catch {
      setApplyError('Network error. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: job?.title, url });
    } else {
      navigator.clipboard.writeText(url);
    }
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
          <a href="/jobs" className="btn btn-primary">Browse All Jobs</a>
        </div>
      </div>
    );
  }

  const requirements = parseListItems(job.requirements);
  const isExternal = job.type === 'EXTERNAL' && job.externalLink;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Back */}
        <a href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-3)', fontSize: '0.9rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Jobs
        </a>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: '2rem' }} className="job-detail-grid">
          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header Card */}
            <div className="card card-p">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div className="company-logo" style={{ width: '64px', height: '64px', fontSize: '1.6rem', borderRadius: '1rem', flexShrink: 0 }}>
                  {job.company?.name?.[0]?.toUpperCase() || 'C'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ marginBottom: '0.35rem' }}>{job.title}</h2>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary-light)', margin: 0 }}>
                    {job.company?.name}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.88rem', color: 'var(--text-3)' }}>
                      <MapPin size={14} />{job.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.88rem', color: 'var(--text-3)' }}>
                      <Briefcase size={14} />{job.type}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.88rem', color: 'var(--text-3)' }}>
                      <Clock size={14} />Posted {timeAgo(job.createdAt)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.88rem', color: 'var(--text-3)' }}>
                      <Users size={14} />{job.applications?.length || 0} Applicants
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={handleShare} className="btn btn-ghost btn-icon" title="Share this job">
                    <Share2 size={18} />
                  </button>
                </div>
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

            {/* Company Info */}
            <div className="card card-p">
              <h3 style={{ marginBottom: '1.25rem' }}>About {job.company?.name}</h3>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {job.company?.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Globe size={16} style={{ color: 'var(--primary-light)' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Contact</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{job.company.email}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card card-p" style={{ position: 'sticky', top: 'calc(var(--nav-height) + 1rem)' }}>
              {job.salary && (
                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success)' }}>{job.salary}</div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-3)' }}>Estimated annual package</p>
                </div>
              )}

              {job.status === 'ARCHIVED' ? (
                <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(245,158,11,0.1)', borderRadius: 'var(--radius)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <AlertCircle size={32} style={{ color: 'var(--warning)', marginBottom: '0.5rem', margin: '0 auto' }} />
                  <p style={{ margin: '0.5rem 0 0', fontWeight: '700', color: 'var(--warning)' }}>Job Archived</p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: 'var(--text-3)' }}>This job is no longer accepting new applications.</p>
                </div>
              ) : applied ? (
                <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <CheckCircle size={32} style={{ color: 'var(--success)', marginBottom: '0.5rem', margin: '0 auto' }} />
                  <p style={{ margin: 0, fontWeight: '700', color: 'var(--success)' }}>Applied Successfully!</p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: 'var(--text-3)' }}>We'll notify you of any updates</p>
                  <a href="/user/applied-jobs" className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>View My Applications</a>
                </div>
              ) : isExternal ? (
                <a
                  href={job.externalLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', justifyContent: 'center' }}
                >
                  Apply on Company Site →
                </a>
              ) : (
                <>
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', justifyContent: 'center' }}
                  >
                    {applying ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : '⚡ One-Click Apply'}
                  </button>
                  {applyError && (
                    <div style={{ marginTop: '0.75rem', padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.85rem', color: 'var(--danger)', textAlign: 'center' }}>
                      <AlertCircle size={20} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                      <p style={{ fontWeight: '700', marginBottom: '0.5rem', margin: 0 }}>{applyError}</p>
                      {applyError.includes('Profile Incomplete') && (
                        <a href="/user/profile" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}>
                          Complete Profile (40%)
                        </a>
                      )}
                    </div>
                  )}
                  {!session && (
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.75rem' }}>
                      <a href="/login" style={{ color: 'var(--primary-light)' }}>Sign in</a> to apply with your profile
                    </p>
                  )}
                </>
              )}

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
                {[
                  { label: 'Job Type', val: job.type },
                  { label: 'Location', val: job.location },
                  { label: 'Posted', val: timeAgo(job.createdAt) },
                ].map(d => (
                  <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-3)' }}>{d.label}</span>
                    <span style={{ fontWeight: '600' }}>{d.val}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '0.25rem' }}>
                <p style={{ fontSize: '0.82rem', textAlign: 'center', marginBottom: '0.75rem', color: 'var(--text-3)' }}>Know someone who'd be a fit?</p>
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
