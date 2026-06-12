import React, { useState } from 'react';
import { MapPin, Clock, Users, IndianRupee, Briefcase, GraduationCap, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Job {
  id: string;
  title: string;
  company: string | { id: string; slug?: string | null; name?: string; companyName?: string; logo?: string | null };
  location: string;
  salary?: string | null;
  type: string;
  employmentType?: string;
  category?: string;
  education?: string;
  experience?: string;
  skills?: string;
  posted?: string;
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
  _count?: { applications?: number };
  openings?: number;
}

interface JobCardProps {
  job: Job;
  index?: number;
}

function getCompanyName(company: Job['company']): string {
  if (!company) return 'Company';
  if (typeof company === 'string') return company;
  return (company as any).companyName || company.name || 'Company';
}

function getCompanySlugOrId(company: Job['company']): string | null {
  if (!company || typeof company === 'string') return null;
  return (company as any).slug || (company as any).id || null;
}

function getCompanyLogo(company: Job['company']): string | null {
  if (!company || typeof company === 'string') return null;
  return (company as any).logo || null;
}

function formatDate(createdAt?: string): string {
  if (!createdAt) return 'Recently';
  const date = new Date(createdAt);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  
  if (days === 0) return 'Today';
  
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = String(date.getFullYear()).slice(-2);
  
  return `${day} ${month} ${year}`;
}

const EMP_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  'Full-time':        { bg: 'rgba(16,185,129,0.09)',  text: '#10b981', border: 'rgba(16,185,129,0.22)' },
  'Part-time':        { bg: 'rgba(139,92,246,0.09)',  text: '#8b5cf6', border: 'rgba(139,92,246,0.22)' },
  'Internship':       { bg: 'rgba(236,72,153,0.09)',  text: '#ec4899', border: 'rgba(236,72,153,0.22)' },
  'Contract':         { bg: 'rgba(245,158,11,0.09)',  text: '#f59e0b', border: 'rgba(245,158,11,0.22)' },
  'Remote':           { bg: 'rgba(99,102,241,0.09)',  text: '#6366f1', border: 'rgba(99,102,241,0.22)' },
  'Hybrid':           { bg: 'rgba(20,184,166,0.09)',  text: '#14b8a6', border: 'rgba(20,184,166,0.22)' },
  'Full-time (WFH)':  { bg: 'rgba(99,102,241,0.09)',  text: '#6366f1', border: 'rgba(99,102,241,0.22)' },
  'Part-time (WFH)':  { bg: 'rgba(139,92,246,0.09)', text: '#8b5cf6', border: 'rgba(139,92,246,0.22)' },
  'Contract (WFH)':   { bg: 'rgba(245,158,11,0.09)',  text: '#f59e0b', border: 'rgba(245,158,11,0.22)' },
  'Other':            { bg: 'rgba(100,116,139,0.09)', text: '#94a3b8', border: 'rgba(100,116,139,0.22)' },
};

function getEmpStyle(type?: string) {
  if (!type) return EMP_COLOR['Other'];
  return EMP_COLOR[type] || EMP_COLOR['Other'];
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const router = useRouter();
  const companyName = getCompanyName(job.company);
  const companySlugOrId = getCompanySlugOrId(job.company);
  const logo = getCompanyLogo(job.company);
  const dateStr = job.createdAt ? formatDate(job.createdAt) : (job.posted || 'Recently');
  const applicants = job._count?.applications ?? 0;
  const empStyle = getEmpStyle(job.employmentType);
  const initial = companyName[0]?.toUpperCase() || 'C';
  const skills = job.skills ? job.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const [imageError, setImageError] = useState(false);

  return (
    <>
      <div
        onClick={() => router.push(`/jobs/${job.id}`)}
        className="job-card-new"
        style={{ animationDelay: `${index * 0.04}s` }}
      >
        {/* Top row: logo + title + company + badge */}
        <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Logo */}
          <div className="job-card-logo" style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '1.15rem',
            flexShrink: 0,
            overflow: 'hidden',
            background: (logo && !imageError) ? 'transparent' : `${empStyle.text}18`,
            border: `1.5px solid ${empStyle.border}`,
            color: empStyle.text,
          }}>
            {logo && !imageError
              ? <img 
                  src={logo} 
                  alt={companyName} 
                  onError={() => setImageError(true)} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} 
                />
              : initial
            }
          </div>

          {/* Title + company */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text)', lineHeight: 1.25, marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {job.title}
            </div>
            <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {companySlugOrId
                ? <span
                    onClick={e => { e.stopPropagation(); router.push(`/companies/${companySlugOrId}`); }}
                    style={{ color: 'var(--primary-light)', fontWeight: '600', cursor: 'pointer' }}
                  >{companyName}</span>
                : <span style={{ color: 'var(--text-2)', fontWeight: '600' }}>{companyName}</span>
              }
            </div>
          </div>

          {/* Employment type pill */}
          {job.employmentType && (
            <span style={{
              background: empStyle.bg, color: empStyle.text,
              border: `1px solid ${empStyle.border}`,
              borderRadius: '2rem', fontSize: '0.72rem', fontWeight: '700',
              padding: '0.22rem 0.65rem', whiteSpace: 'nowrap', flexShrink: 0
            }}>
              {job.employmentType}
            </span>
          )}
        </div>

        {/* Specifications row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem 1rem', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-3)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={11} strokeWidth={2} /> {job.location}
          </span>
          {job.experience && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Briefcase size={11} strokeWidth={2} /> {job.experience}
            </span>
          )}
          {job.education && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <GraduationCap size={11} strokeWidth={2} /> {job.education}
            </span>
          )}
        </div>

        {/* Hiring & Timeline Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.55rem', fontSize: '0.74rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(99, 102, 241, 0.07)', color: 'var(--primary-light)', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
            <Clock size={10} strokeWidth={2.5} /> {dateStr}
          </span>
          {job.openings !== undefined && job.openings !== null && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(16, 185, 129, 0.07)', color: 'var(--success)', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <Users size={10} strokeWidth={2.5} /> {job.openings} Position{job.openings > 1 ? 's' : ''}
            </span>
          )}
          {applicants > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(139, 92, 246, 0.07)', color: '#a78bfa', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
              <Users size={10} strokeWidth={2.5} /> {applicants} applied
            </span>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.65rem' }}>
            {skills.slice(0, 5).map((s, i) => (
              <span key={i} style={{
                background: 'rgba(56,189,248,0.07)', color: '#38bdf8',
                border: '1px solid rgba(56,189,248,0.18)',
                borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: '600',
                padding: '0.18rem 0.55rem',
              }}>{s}</span>
            ))}
            {skills.length > 5 && (
              <span style={{
                background: 'var(--surface)', color: 'var(--text-3)',
                border: '1px solid var(--border)',
                borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: '600',
                padding: '0.18rem 0.55rem',
              }}>+{skills.length - 5} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem', 
            fontWeight: '800', 
            color: '#10b981', 
            fontSize: '0.9rem',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            padding: '0.25rem 0.65rem',
            borderRadius: '6px'
          }}>
            <IndianRupee size={13} strokeWidth={2.5} />
            {job.salary ? job.salary.replace('₹', '') : 'Competitive'}
          </span>
          <span className="job-card-apply-btn">
            Apply Now <Zap size={13} strokeWidth={2.5} />
          </span>
        </div>
      </div>

      <style>{`
        .job-card-new {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 16px !important;
          padding: 1.25rem 1.4rem !important;
          cursor: pointer !important;
          transition: border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          display: block !important;
          text-decoration: none !important;
        }
        .job-card-new:hover {
          border-color: rgba(99,102,241,0.35) !important;
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.05) !important;
          transform: translateY(-3px) !important;
        }
        .job-card-logo {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 1.15rem;
          flex-shrink: 0; overflow: hidden;
        }
        .job-card-apply-btn {
          display: inline-flex !important; align-items: center !important; gap: 0.35rem !important;
          background: linear-gradient(135deg, #6366f1, #8b5cf6) !important; color: white !important;
          border-radius: 10px !important; font-size: 0.8rem !important; font-weight: 700 !important;
          padding: 0.45rem 1rem !important;
          transition: transform 0.2s, opacity 0.15s !important;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15) !important;
        }
        .job-card-new:hover .job-card-apply-btn { transform: translateX(2px) !important; }
      `}</style>
    </>
  );
}
