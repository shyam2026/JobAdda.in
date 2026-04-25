'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Briefcase, MapPin, Clock, TrendingUp, CheckCircle, XCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

interface Application {
  id: string;
  status: 'PENDING' | 'REVIEWING' | 'HIRED' | 'REJECTED';
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    salary?: string | null;
    type: string;
    company: { name: string };
  };
}

const STATUS_CONFIG = {
  PENDING: { label: 'Applied', cls: 'badge-muted', icon: Clock, color: '#6b7280' },
  REVIEWING: { label: 'Under Review', cls: 'badge-warning', icon: AlertCircle, color: '#f59e0b' },
  HIRED: { label: 'Hired! 🎉', cls: 'badge-success', icon: CheckCircle, color: '#10b981' },
  REJECTED: { label: 'Not Selected', cls: 'badge-danger', icon: XCircle, color: '#ef4444' },
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AppliedJobsPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const FILTERS = ['All', 'Pending', 'Under Review', 'Hired', 'Not Selected'];

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/applications')
        .then(r => r.json())
        .then(data => { setApplications(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-3)' }}>Loading your applications...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <h3>Please sign in to view your applications</h3>
        <a href="/login" className="btn btn-primary">Sign In</a>
      </div>
    );
  }

  const filteredApps = applications.filter(app => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return app.status === 'PENDING';
    if (filter === 'Under Review') return app.status === 'REVIEWING';
    if (filter === 'Hired') return app.status === 'HIRED';
    if (filter === 'Not Selected') return app.status === 'REJECTED';
    return true;
  });

  const stats = {
    total: applications.length,
    reviewing: applications.filter(a => a.status === 'REVIEWING').length,
    hired: applications.filter(a => a.status === 'HIRED').length,
    pending: applications.filter(a => a.status === 'PENDING').length,
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <a href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-3)', fontSize: '0.9rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </a>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp size={24} /> My Applications
          </h2>
          <p style={{ margin: 0, color: 'var(--text-3)' }}>Track all your job applications in one place</p>
        </div>

        {/* Stats Row */}
        <div className="grid-4" style={{ marginBottom: '2rem', gap: '1rem' }}>
          {[
            { label: 'Total Applied', val: stats.total, color: '#6366f1' },
            { label: 'Under Review', val: stats.reviewing, color: '#f59e0b' },
            { label: 'Hired', val: stats.hired, color: '#10b981' },
            { label: 'Pending', val: stats.pending, color: '#6b7280' },
          ].map(s => (
            <div key={s.label} className="card card-p-sm" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`tag ${filter === f ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
            >{f}</button>
          ))}
        </div>

        {/* Application List */}
        {filteredApps.length === 0 ? (
          <div className="card card-p" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Briefcase size={48} style={{ color: 'var(--text-3)', opacity: 0.3, marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Applications Found</h3>
            <p style={{ color: 'var(--text-3)', marginBottom: '1.5rem' }}>
              {filter === 'All' ? "You haven't applied to any jobs yet." : `No ${filter.toLowerCase()} applications.`}
            </p>
            <a href="/jobs" className="btn btn-primary">Browse Jobs</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredApps.map(app => {
              const sc = STATUS_CONFIG[app.status];
              const StatusIcon = sc.icon;
              return (
                <div key={app.id} className="card card-p" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <div className="company-logo" style={{ width: '52px', height: '52px', flexShrink: 0 }}>
                    {app.job?.company?.name?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.25rem' }}>{app.job?.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {app.job?.company?.name}
                      </span>
                      {app.job?.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={12} />{app.job.location}
                        </span>
                      )}
                      {app.job?.type && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Briefcase size={12} />{app.job.type}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={11} /> Applied {timeAgo(app.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
                    <span className={`badge ${sc.cls}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <StatusIcon size={12} />{sc.label}
                    </span>
                    {app.job?.salary && (
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--success)' }}>{app.job.salary}</span>
                    )}
                    <a href={`/jobs/${app.job?.id}`} className="btn btn-ghost btn-sm">View Job</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
