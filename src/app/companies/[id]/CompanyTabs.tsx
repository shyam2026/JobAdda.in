'use client';

import React, { useState } from 'react';
import { Briefcase, Info, ExternalLink } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  location: string;
  salary: string | null;
  createdAt: string | Date;
}

interface CompanyTabsProps {
  bio: string | null;
  moreDetails: Array<{ title: string; value: string }> | null;
  jobs: Job[];
}

export function CompanyTabs({ bio, moreDetails, jobs }: CompanyTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs'>('overview');

  return (
    <div className="tabs-container">
      {/* Tab Headers */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('overview')}
          style={{ 
            padding: '1rem 0', 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-3)', 
            fontWeight: '700', 
            cursor: 'pointer',
            borderBottom: activeTab === 'overview' ? '2px solid var(--primary)' : '2px solid transparent',
            marginBottom: '-1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Info size={18} /> Overview
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          style={{ 
            padding: '1rem 0', 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'jobs' ? 'var(--primary)' : 'var(--text-3)', 
            fontWeight: '700', 
            cursor: 'pointer',
            borderBottom: activeTab === 'jobs' ? '2px solid var(--primary)' : '2px solid transparent',
            marginBottom: '-1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Briefcase size={18} /> Jobs ({jobs.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="anim-fade">
        {activeTab === 'overview' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* About Section */}
            <section>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text)' }}>About Company</h3>
              <div style={{ color: 'var(--text-2)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {bio || "No description provided."}
              </div>
            </section>

            {/* More Details Section */}
            {moreDetails && moreDetails.length > 0 && (
              <section>
                <h3 style={{ marginBottom: '1.25rem', color: 'var(--text)' }}>More Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {moreDetails.map((detail, idx) => (
                    <div key={idx} className="card" style={{ padding: '1.25rem', background: 'var(--surface-light)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginBottom: '0.25rem', fontWeight: '600', textTransform: 'uppercase' }}>
                        {detail.title}
                      </div>
                      <div style={{ fontWeight: '500', color: 'var(--text)' }}>
                        {detail.value}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {jobs.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-3)' }}>
                No active job openings at this time.
              </div>
            ) : (
              jobs.map(job => (
                <a 
                  href={`/jobs/${job.id}`} 
                  key={job.id} 
                  className="card card-p card-hover no-underline" 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', color: 'var(--text)' }}>{job.title}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>{job.location}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: 'var(--primary-light)' }}>{job.salary || 'Competitive'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
