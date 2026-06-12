'use client';

import React, { useState } from 'react';
import { Briefcase, Info, MapPin, IndianRupee, Clock, ExternalLink, Tag, Zap } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  location: string;
  salary: string | null;
  type: string;
  category?: string;
  createdAt: string | Date;
  externalLink?: string | null;
}

interface CompanyTabsProps {
  bio: string | null;
  moreDetails: string | null;
  jobs: Job[];
}

const TYPE_COLOR: Record<string, string> = {
  'Full-time': '#10b981', 'INTERNAL': '#10b981',
  'Remote': '#6366f1', 'Hybrid': '#f59e0b',
  'Part-time': '#8b5cf6', 'Internship': '#ec4899',
  'EXTERNAL': '#f59e0b',
};

function timeAgo(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '1rem 0',
  background: 'none',
  border: 'none',
  color: active ? 'var(--primary)' : 'var(--text-3)',
  fontWeight: '700',
  cursor: 'pointer',
  borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
  marginBottom: '-1px',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.95rem',
  transition: 'color 0.2s',
});

export function CompanyTabs({ bio, moreDetails, jobs }: CompanyTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs'>('overview');

  return (
    <div>
      {/* Tab Headers */}
      <div className="tab-headers" style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('overview')} style={tabStyle(activeTab === 'overview')}>
          <Info size={17} /> Overview
        </button>
        <button onClick={() => setActiveTab('jobs')} style={tabStyle(activeTab === 'jobs')}>
          <Briefcase size={17} />
          Open Roles
          {jobs.length > 0 && (
            <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '2rem', fontSize: '0.72rem', fontWeight: '800', padding: '0.1rem 0.55rem', marginLeft: '0.25rem' }}>
              {jobs.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* About */}
            <section>
              <h3 style={{ marginBottom: '1rem' }}>About the Company</h3>
              <div 
                style={{ color: 'var(--text-2)', lineHeight: '1.8', fontSize: '0.95rem' }}
                dangerouslySetInnerHTML={{ __html: bio || 'No description provided yet.' }}
              />
            </section>

            {/* More Details */}
            {moreDetails && (() => {
              let parsedDetails = null;
              try {
                const trimmed = moreDetails.trim();
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                  parsedDetails = JSON.parse(trimmed);
                  if (!Array.isArray(parsedDetails)) parsedDetails = null;
                }
              } catch (e) {
                parsedDetails = null;
              }

              return (
                <section style={{ marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1.25rem' }}>Additional Information</h3>
                  {parsedDetails ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                      {parsedDetails.map((detail: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="card" 
                          style={{ 
                            padding: '1rem 1.25rem', 
                            background: 'var(--surface)', 
                            border: '1px solid var(--border)', 
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem'
                          }}
                        >
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {detail.title}
                          </span>
                          <span style={{ fontSize: '0.95rem', color: 'var(--text-2)', fontWeight: '600' }}>
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      style={{ color: 'var(--text-2)', lineHeight: '1.8', fontSize: '0.95rem' }}
                      dangerouslySetInnerHTML={{ __html: moreDetails }}
                    />
                  )}
                </section>
              );
            })()}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.length === 0 ? (
              <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-3)' }}>
                <Briefcase size={40} style={{ opacity: 0.3, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
                <h4>No active openings right now</h4>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>Check back soon for new opportunities.</p>
              </div>
            ) : (
              jobs.map(job => {
                const typeColor = TYPE_COLOR[job.type] || 'var(--primary)';
                return (
                  <a
                    href={`/jobs/${job.id}`}
                    key={job.id}
                    className="no-underline"
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      flexWrap: 'wrap', 
                      gap: '1.25rem',
                      padding: '1.25rem 1.5rem',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '16px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = 'var(--primary-light)';
                      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text)', fontWeight: '700', fontSize: '1.1rem', transition: 'color 0.2s' }}>{job.title}</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={14} style={{ color: 'var(--primary-light)' }} />{job.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={14} style={{ color: 'var(--text-3)' }} />{timeAgo(job.createdAt)}
                        </span>
                        {job.category && job.category !== 'Other' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Tag size={14} style={{ color: 'var(--primary-light)' }} />{job.category}
                          </span>
                        )}
                      </div>
                      {job.type !== 'EXTERNAL' && (
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ background: `${typeColor}12`, color: typeColor, border: `1px solid ${typeColor}25`, borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.65rem' }}>
                            {job.type}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.35rem', 
                        fontWeight: '800', 
                        color: '#10b981', 
                        fontSize: '1.05rem', 
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.15)',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '8px'
                      }}>
                        <IndianRupee size={14} />
                        {job.salary ? job.salary.replace('₹', '') : 'Competitive'}
                      </div>
                      <span 
                        className="btn" 
                        style={{ 
                          fontSize: '0.9rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '12px',
                          padding: '0.65rem 1.35rem',
                          fontWeight: '600',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                        }}
                      >
                        Apply Now <Zap size={16} />
                      </span>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
