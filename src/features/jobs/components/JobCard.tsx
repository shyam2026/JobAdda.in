import React from 'react';
import { Briefcase, Clock, MapPin, IndianRupee, Users } from 'lucide-react';

export interface Job {
  id: string;
  title: string;
  company: string | { id: string; slug?: string | null; name: string; logo?: string | null };
  location: string;
  salary?: string | null;
  type: string;
  category?: string;
  posted?: string;
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
  _count?: { applications?: number };
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

function getCompanySlugOrId(company: Job['company']): string | null {
  if (!company || typeof company === 'string') return null;
  return company.slug || company.id || null;
}

function getCompanyLogo(company: Job['company']): string | null {
  if (!company || typeof company === 'string') return null;
  return (company as any).logo || null;
}

function formatDate(createdAt?: string): string {
  if (!createdAt) return 'Recently';
  const diff = Date.now() - new Date(createdAt).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const TYPE_COLOR: Record<string, string> = {
  'Full-time': '#10b981',
  'Remote': '#6366f1',
  'Hybrid': '#f59e0b',
  'Part-time': '#8b5cf6',
  'Internship': '#ec4899',
  'INTERNAL': '#10b981',
  'EXTERNAL': '#f59e0b',
};

export function JobCard({ job, index = 0 }: JobCardProps) {
  const companyName = getCompanyName(job.company);
  const companySlugOrId = getCompanySlugOrId(job.company);
  const logo = getCompanyLogo(job.company);
  const dateStr = job.createdAt ? formatDate(job.createdAt) : (job.posted || 'Recently');
  const applicants = job._count?.applications ?? 0;
  const typeColor = TYPE_COLOR[job.type] || 'var(--primary)';
  const initial = companyName[0]?.toUpperCase() || 'C';

  return (
    <a
      href={`/jobs/${job.id}`}
      className="card job-card"
      style={{
        textDecoration: 'none',
        animationDelay: `${index * 0.04}s`,
        display: 'block',
        position: 'relative',
        padding: '1.5rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      {job.featured && (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <span className="badge badge-warning" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
            ⭐ Featured
          </span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
        {/* Logo */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '12px',
          background: `${typeColor}18`,
          border: `1px solid ${typeColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '900', fontSize: '1.25rem', color: typeColor,
          flexShrink: 0, overflow: 'hidden', padding: logo ? '6px' : '0'
        }}>
          {logo
            ? <img src={logo} alt={companyName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            : initial
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>
            {job.title}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {companySlugOrId
              ? <a href={`/companies/${companySlugOrId}`} onClick={e => e.stopPropagation()} style={{ color: 'var(--primary-light)', fontWeight: '600', textDecoration: 'none' }}>{companyName}</a>
              : companyName
            }
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-3)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <MapPin size={12} /> {job.location}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={12} /> {dateStr}
        </span>
        {applicants > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Users size={12} /> {applicants} applied
          </span>
        )}
      </div>

      {/* Tags row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
        <span style={{
          background: `${typeColor}15`, color: typeColor,
          border: `1px solid ${typeColor}30`,
          borderRadius: '2rem', fontSize: '0.74rem', fontWeight: '700',
          padding: '0.2rem 0.7rem',
        }}>{job.type}</span>
        {job.category && job.category !== 'Other' && (
          <span style={{
            background: 'var(--surface)', color: 'var(--text-3)',
            border: '1px solid var(--border)',
            borderRadius: '2rem', fontSize: '0.74rem', fontWeight: '600',
            padding: '0.2rem 0.7rem',
          }}>{job.category}</span>
        )}
        {job.tags?.slice(0, 2).map(t => (
          <span key={t} style={{
            background: 'var(--surface)', color: 'var(--text-3)',
            border: '1px solid var(--border)',
            borderRadius: '2rem', fontSize: '0.74rem',
            padding: '0.2rem 0.7rem',
          }}>{t}</span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '800', color: 'var(--success)', fontSize: '0.95rem' }}>
          <IndianRupee size={14} />
          {job.salary ? job.salary.replace('₹', '') : 'Competitive'}
        </span>
        <span className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
          Apply Now →
        </span>
      </div>
    </a>
  );
}
