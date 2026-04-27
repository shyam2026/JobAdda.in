import React from 'react';
import prisma from '@/lib/prisma';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { AdminJobActions } from './AdminJobActions';

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      company: true,
      _count: {
        select: { applications: true }
      }
    }
  }) as any[];

  return (
    <div className="admin-page anim-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#1e293b', marginBottom: '0.25rem' }}>Global Job Listings</h2>
          <p style={{ color: '#64748b', margin: 0 }}>View all active jobs posted on the platform.</p>
        </div>
        <Link href="/admin/jobs/create" className="btn btn-primary">
          <Plus size={18} /> Post Job for Company
        </Link>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type / Salary</th>
              <th>Applications</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No jobs posted yet.
                </td>
              </tr>
            ) : (
              jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{job.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Posted: {new Date(job.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#334155' }}>
                      {job.company ? job.company.companyName : 'Unknown Company'}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#475569' }}>{job.location}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>{job.type}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{job.salary || 'Not specified'}</div>
                  </td>
                  <td style={{ fontWeight: '600', color: '#10b981' }}>{job._count.applications}</td>
                  <td>
                    <span className={`badge ${job.status === 'OPEN' ? 'badge-success' : 'badge-warning'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <AdminJobActions jobId={job.id} status={job.status} />
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
