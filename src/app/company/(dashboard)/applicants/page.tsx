import React from 'react';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ExternalLink, User } from 'lucide-react';
import { StatusUpdate } from './StatusUpdate';

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
          <h2 style={{ color: '#f8fafc', marginBottom: '0.4rem', fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Applicant Review</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.05rem' }}>Review and manage candidates who have applied to your jobs.</p>
        </div>
      </div>

      <div className="card table-wrap" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f172a', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applied For</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
                  No applications received yet.
                </td>
              </tr>
            ) : (
              applications.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="avatar avatar-sm" style={{ background: '#334155', color: '#f1f5f9', width: '36px', height: '36px', borderRadius: '10px' }}>
                        {app.student.name ? app.student.name[0].toUpperCase() : <User size={16} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#f8fafc' }}>{app.student.name || 'Unnamed'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>{app.student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '600' }}>{app.job.title}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge`} style={{
                      background: app.status === 'PENDING' ? 'rgba(251, 191, 36, 0.15)' : app.status === 'HIRED' ? 'rgba(52, 211, 153, 0.15)' : app.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      color: app.status === 'PENDING' ? '#fbbf24' : app.status === 'HIRED' ? '#34d399' : app.status === 'REJECTED' ? '#f87171' : '#818cf8',
                      border: `1px solid ${app.status === 'PENDING' ? 'rgba(251, 191, 36, 0.3)' : app.status === 'HIRED' ? 'rgba(52, 211, 153, 0.3)' : app.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.5rem', color: '#818cf8', borderColor: '#334155' }}>
                          Resume <ExternalLink size={12} style={{ marginLeft: '0.2rem' }} />
                        </a>
                      )}
                      <StatusUpdate applicationId={app.id} currentStatus={app.status} />
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
