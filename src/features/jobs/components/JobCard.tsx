import React from 'react';
import { Briefcase, Clock, MapPin, Star } from 'lucide-react';

export interface Job {
  id: string;
  title: string;
  company: string | { name: string; id: string };
  location: string;
  salary?: string | null;
  type: string;
  experience?: string;
  logo?: string;
  category?: string;
  posted?: string;
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
}

interface JobCardProps {
  job: Job;
  index?: number;
}

function getCompanyName(company: Job['company']): string {
  if (!company) return 'Company';
  if (typeof company === 'string') return company;
  return company.name || 'Company';
}

function getCompanyInitial(company: Job['company']): string {
  return getCompanyName(company)?.[0]?.toUpperCase() || 'C';
}

function formatDate(createdAt?: string): string {
  if (!createdAt) return 'Recently';
  const diff = Date.now() - new Date(createdAt).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const companyName = getCompanyName(job.company);
  const initial = job.logo || getCompanyInitial(job.company);
  const dateStr = job.createdAt ? formatDate(job.createdAt) : (job.posted || 'Recently');

  return (
    <a
      href={`/jobs/${job.id}`}
      className="card job-card"
      style={{ textDecoration: 'none', animationDelay: `${index * 0.05}s`, display: 'block', position: 'relative' }}
    >
      {job.featured && (
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
          <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Star size={10} fill="currentColor" /> Featured
          </span>
        </div>
      )}
      <div className="job-card-header" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div className="company-logo" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', border: '1px solid var(--border)', flexShrink: 0 }}>
          {initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="job-title" style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
          <div className="company-name" style={{ fontSize: '0.88rem', color: 'var(--text-3)' }}>{companyName}</div>
        </div>
      </div>
      <div className="job-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-2)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} />{job.location}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Briefcase size={12} />{job.type}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} />{dateStr}</span>
      </div>
      {job.tags && job.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {job.tags.slice(0, 4).map(t => (
            <span key={t} className="tag" style={{ fontSize: '0.74rem', padding: '0.2rem 0.65rem' }}>{t}</span>
          ))}
        </div>
      )}
      <div className="job-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontWeight: '700', color: 'var(--success)', fontSize: '0.95rem' }}>{job.salary || 'Competitive Pay'}</span>
        <span className="btn btn-primary btn-sm">Apply Now →</span>
      </div>
    </a>
  );
}
