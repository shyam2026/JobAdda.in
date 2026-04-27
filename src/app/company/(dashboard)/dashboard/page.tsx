import React from 'react';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Briefcase, Users, Clock, CheckCircle, Plus } from 'lucide-react';
import { KanbanBoard } from '@/features/company/components/KanbanBoard';
import Link from 'next/link';

export default async function CompanyDashboardPage() {
  const session = await auth();
  
  const companyUser = await (prisma as any).companyUser.findUnique({
    where: { email: session?.user?.email as string },
    include: {
      _count: {
        select: { jobs: true }
      }
    }
  });

  if (!companyUser) return null;

  const stats = [
    { label: 'Active Jobs', value: companyUser._count.jobs, icon: Briefcase, color: '#0ea5e9' },
    { label: 'Total Applicants', value: '0', icon: Users, color: '#10b981' },
    { label: 'Interviews Scheduled', value: '0', icon: Clock, color: '#f59e0b' },
    { label: 'Hired This Month', value: '0', icon: CheckCircle, color: '#8b5cf6' },
  ];

  return (
    <div className="company-page anim-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem', color: '#0f172a' }}>Recruiter Dashboard</h2>
          <p style={{ margin: 0, color: '#64748b' }}>Manage your hiring pipeline on JobAdda.in</p>
        </div>
        <Link href="/company/jobs/create" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Post a Job
        </Link>
      </div>

      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="card card-p-sm" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: `3px solid ${s.color}` }}>
            <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius)', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1, color: '#0f172a' }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem', fontWeight: '500' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: '#0f172a' }}>Applicant Tracking System</h4>
        <KanbanBoard />
      </div>
    </div>
  );
}
