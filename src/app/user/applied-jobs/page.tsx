'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, TrendingUp, CheckCircle, XCircle, AlertCircle, ChevronRight, MessageCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

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
    company: { name: string; email?: string };
  };
}

const STATUS_CONFIG = {
  PENDING: { label: 'Applied', cls: 'badge-muted', icon: Clock, color: '#6b7280' },
  REVIEWING: { label: 'Shortlisted', cls: 'badge-warning', icon: AlertCircle, color: '#f59e0b' },
  HIRED: { label: 'Hired!', cls: 'badge-success', icon: CheckCircle, color: '#10b981' },
  REJECTED: { label: 'Rejected', cls: 'badge-danger', icon: XCircle, color: '#ef4444' },
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function UserApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const FILTERS = ['All', 'PENDING', 'REVIEWING', 'HIRED', 'REJECTED'];

  useEffect(() => {
    fetch('/api/applications')
      .then(r => r.json())
      .then(data => { setApplications(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleChatWithHR = (app: Application) => {
    const message = `Hello, I'm reaching out regarding my application for the ${app.job.title} position at ${app.job.company.name} on JobAdda.in. I'd like to check on the status of my application.`;
    const whatsappUrl = `https://wa.me/917004652932?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredApps = applications.filter(app => {
    if (filter === 'All') return true;
    return app.status === filter;
  });

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-3)' }}>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="anim-fade-up">
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
         My Applications
        </h2>
        <p style={{ margin: 0, color: 'var(--text-3)' }}>Track your progress with {applications.length} applications</p>
      </header>

      {/* Informational Note */}
      <div className="card" style={{ 
        padding: '1rem 1rem', 
        marginBottom: '1rem', 
        background: 'rgba(59, 130, 246, 0.05)', 
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '12px',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
        <AlertCircle size={20} style={{ color: '#60a5fa', marginTop: '2px', flexShrink: 0 }} />
        <div style={{ fontSize: '0.700rem', color: '#93c5fd', lineHeight: '1.5' }}>
          <strong>Note:</strong> Real-time status updates are only available for applications processed directly through <strong>JobAdda.in</strong>. For jobs where you applied on an external company page, you will receive updates directly from the company via their portal, email, or WhatsApp/SMS.
        </div>
      </div> 

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`tag ${filter === f ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            {f === 'All' ? 'All Applications' : STATUS_CONFIG[f as keyof typeof STATUS_CONFIG]?.label}
          </button>
        ))}
      </div>

      {/* Application List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredApps.length === 0 ? (
          <div className="card card-p" style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border)' }}>
            <Briefcase size={56} style={{ color: 'var(--text-3)', opacity: 0.2, marginBottom: '1.5rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No matching applications</h3>
            <p style={{ color: 'var(--text-3)', marginBottom: '2rem' }}>You haven&apos;t applied to any jobs in this category yet.</p>
            <Link href="/jobs" className="btn btn-primary">Browse Open Jobs</Link>
          </div>
        ) : (
          filteredApps.map(app => {
            const sc = STATUS_CONFIG[app.status];
            return (
              <div key={app.id} className="card card-p-sm application-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
                {/* Status Indicator Bar */}
                <div style={{ position: 'absolute', left: 0, top: '15%', bottom: '15%', width: '4px', borderRadius: '0 4px 4px 0', background: sc.color }} />
                
                <div className="company-logo" style={{ width: '60px', height: '60px', borderRadius: '16px', flexShrink: 0, fontSize: '1.5rem', fontWeight: '800' }}>
                  {app.job?.company?.name?.[0]}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <h4 style={{ fontSize: '1.1rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.job?.title}</h4>
                    <span className={`badge ${sc.cls}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>{sc.label}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', color: 'var(--text-3)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Briefcase size={13}/>{app.job?.company?.name}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13}/>{app.job?.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13}/>Applied {timeAgo(app.createdAt)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => handleChatWithHR(app)}
                    className="btn btn-outline btn-sm" 
                    style={{ gap: '0.5rem', borderColor: '#25D366', color: '#25D366' }}
                  >
                    <MessageCircle size={16} /> <span className="hide-mobile">Chat with HR</span>
                  </button>
                  
                  <Link href={`/jobs/${app.job?.id}`} className="btn btn-primary btn-sm" style={{ gap: '0.5rem' }}>
                    View Job <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
        .application-card {
          transition: transform 0.2s, background 0.2s;
        }
        .application-card:hover {
          background: rgba(255,255,255,0.03);
          transform: translateX(4px);
        }
        @media (max-width: 600px) {
          .application-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding: 1.25rem;
          }
          .application-card > div:last-child {
            width: 100%;
            justify-content: space-between;
          }
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
