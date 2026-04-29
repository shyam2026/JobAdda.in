import React from 'react';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { JobActions } from './JobActions';

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
      _count: {
        select: { applications: true }
      }
    }
  });

  return (
    <div className="company-page anim-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>My Jobs</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Manage the listings you have posted on JobAdda.in</p>
        </div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Applicants</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  You haven&apos;t posted any jobs yet.
                </td>
              </tr>
            ) : (
              jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{job.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Posted on {new Date(job.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#475569' }}>{job.location}</td>
                  <td>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{job.type}</span>
                  </td>
                  <td style={{ fontWeight: '600', color: '#0284c7' }}>{job._count.applications}</td>
                  <td>
                    <span className={`badge ${job.status === 'OPEN' ? 'badge-success' : 'badge-warning'}`}>
                      {job.status}
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
