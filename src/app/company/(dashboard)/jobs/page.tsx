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
          <h2 style={{ marginBottom: '0.25rem' }}>My Jobs</h2>
          <p style={{ color: 'var(--text-3)', margin: 0, fontSize: '0.88rem' }}>
            Manage listings you have posted on JobAdda.in
          </p>
        </div>
        <CreateJobModal onCreated={() => {}} />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: Briefcase, label: 'Total Jobs', val: jobs.length, color: '#6366f1' },
          { icon: Users, label: 'Open Listings', val: openCount, color: '#10b981' },
          { icon: Users, label: 'Total Applicants', val: totalApplicants, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="card card-p" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius)', background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Category</th>
              <th>Applicants</th>
              <th>Status</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-3)' }}>
                  <Briefcase size={36} style={{ opacity: 0.3, marginBottom: '0.75rem', display: 'block', margin: '0 auto 0.75rem' }} />
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>No jobs posted yet</div>
                  <div style={{ fontSize: '0.85rem' }}>Click &quot;Post a Job&quot; above to create your first listing.</div>
                </td>
              </tr>
            ) : (
              jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{job.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.15rem' }}>
                      ID: {job.id}
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-2)' }}>
                      <MapPin size={12} />{job.location}
                    </span>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'var(--surface)', color: 'var(--text-2)', fontSize: '0.75rem' }}>{job.type}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>
                    {(job as any).category || 'Other'}
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '700', color: '#6366f1', fontSize: '0.95rem' }}>
                      <Users size={14} />{job._count.applications}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${job.status === 'OPEN' ? 'badge-success' : 'badge-warning'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-3)' }}>
                      <Clock size={12} />{new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                  </td>
                  <td>
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
