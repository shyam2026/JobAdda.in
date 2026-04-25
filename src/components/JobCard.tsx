import React from 'react';

interface JobCardProps {
  job: {
    id: string | number;
    title: string;
    companyName: string;
    location: string;
    description: string;
    salary?: string;
  };
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="glass-card animate-fade" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0 }}>{job.title}</h3>
          <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', marginTop: '0.25rem' }}>{job.companyName}</p>
        </div>
        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}>
          {job.location}
        </span>
      </div>
      
      <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {job.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{job.salary || 'Competitive'}</span>
        <a href={`/jobs/${job.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
          View Details
        </a>
      </div>
    </div>
  );
}

