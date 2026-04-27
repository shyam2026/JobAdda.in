import React from 'react';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ExternalLink, User } from 'lucide-react';

export default async function CompanyApplicantsPage() {
  const session = await auth();
  
  const companyUser = await (prisma as any).companyUser.findUnique({
    where: { email: session?.user?.email as string }
  });

  if (!companyUser) return null;

  const applications = await prisma.application.findMany({
    where: { job: { companyId: companyUser.id } },
    orderBy: { createdAt: 'desc' },
    include: {
      student: true,
      job: { select: { title: true } }
    }
  });

  return (
    <div className="company-page anim-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Applicant Review</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Review and manage candidates who have applied to your jobs.</p>
        </div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Applied For</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No applications received yet.
                </td>
              </tr>
            ) : (
              applications.map(app => (
                <tr key={app.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar avatar-sm" style={{ background: '#f1f5f9', color: '#475569' }}>
                        {app.student.name ? app.student.name[0].toUpperCase() : <User size={14} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{app.student.name || 'Unnamed'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '500' }}>{app.job.title}</td>
                  <td>
                    <span className={`badge ${app.status === 'PENDING' ? 'badge-warning' : app.status === 'HIRED' ? 'badge-success' : app.status === 'REJECTED' ? 'badge-danger' : 'badge-primary'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.5rem', color: '#0284c7' }}>
                          Resume <ExternalLink size={12} style={{ marginLeft: '0.2rem' }} />
                        </a>
                      )}
                      <button className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>Update Status</button>
                    </div>
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
