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

  const applications = await prisma.application.findMany({
    where: { job: { companyId: companyUser.id } },
    include: {
      student: { select: { name: true } },
      job: { select: { title: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalApplicants = applications.length;
  const interviewingCount = applications.filter(a => a.status === 'REVIEWING' || a.status === 'INTERVIEW').length;
  const hiredCount = applications.filter(a => a.status === 'HIRED').length;

  const stats = [
    { label: 'Active Jobs', value: companyUser._count.jobs, icon: Briefcase, color: '#38bdf8' },
    { label: 'Total Applicants', value: totalApplicants, icon: Users, color: '#34d399' },
    { label: 'In Review / Interviewing', value: interviewingCount, icon: Clock, color: '#fbbf24' },
    { label: 'Hired Candidates', value: hiredCount, icon: CheckCircle, color: '#818cf8' },
  ];

  return (
    <div className="company-page anim-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.4rem', color: '#f8fafc', fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Recruiter Dashboard</h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '1.05rem' }}>Manage your hiring pipeline on JobAdda.in</p>
        </div>
        <Link href="/company/jobs/create" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}>
          <Plus size={18} /> Post a Job
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="card card-p" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderTop: `4px solid ${s.color}`, padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1.1, color: '#f8fafc' }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.3rem', fontWeight: '600' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <KanbanBoard applications={applications} />
      </div>
    </div>
  );
}
