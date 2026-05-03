import React from 'react';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Briefcase, MapPin, Users, Clock } from 'lucide-react';
import { JobActions } from './JobActions';
import { CreateJobModal } from './CreateJobModal';

export default async function CompanyJobsPage() {
  const session = await auth();

  const companyUser = await (prisma as any).companyUser.findUnique({
    where: { email: session?.user?.email as string }
  });

  if (!companyUser) return null;

  const jobs = await prisma.job.findMany({
    where: { companyId: companyUser.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { applications: true } }
    }
  });

  const openCount = jobs.filter(j => j.status === 'OPEN').length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j._count?.applications || 0), 0);

  return (
    <div className="company-page anim-fade-up">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.4rem', color: '#f8fafc', fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em' }}>My Jobs</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.05rem' }}>
            Manage listings you have posted on JobAdda.in
          </p>
        </div>
        <CreateJobModal />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { icon: Briefcase, label: 'Total Jobs', val: jobs.length, color: '#818cf8' },
          { icon: Users, label: 'Open Listings', val: openCount, color: '#34d399' },
          { icon: Users, label: 'Total Applicants', val: totalApplicants, color: '#fbbf24' },
        ].map((s, i) => (
          <div key={i} className="card card-p" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: s.color, lineHeight: 1.1 }}>{s.val}</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.3rem', fontWeight: '600' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="card table-wrap" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f172a', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Title</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applicants</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Posted</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
                  <Briefcase size={36} style={{ opacity: 0.3, marginBottom: '0.75rem', display: 'block', margin: '0 auto 0.75rem' }} />
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#f1f5f9' }}>No jobs posted yet</div>
                  <div style={{ fontSize: '0.85rem' }}>Click &quot;Post a Job&quot; above to create your first listing.</div>
                </td>
              </tr>
            ) : (
              jobs.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '700', color: '#f8fafc' }}>{job.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                      ID: {job.id.substring(0, 8)}...
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                      <MapPin size={12} style={{ color: '#64748b' }} />{job.location}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: '0.75rem', border: '1px solid #334155' }}>{job.type}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#cbd5e1', padding: '1rem' }}>
                    {(job as any).category || 'Other'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', color: '#818cf8', fontSize: '0.95rem' }}>
                      <Users size={14} />{job._count.applications}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge`} style={{ 
                      background: job.status === 'OPEN' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)', 
                      color: job.status === 'OPEN' ? '#34d399' : '#fbbf24',
                      border: `1px solid ${job.status === 'OPEN' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`
                    }}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                      <Clock size={12} />{new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <JobActions jobId={job.id} status={job.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
