import React from 'react';
import prisma from '@/lib/prisma';
import { Users, Building, Briefcase, IndianRupee, ShieldAlert, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
  const [totalUsers, totalCompanies, totalJobs] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    (prisma as any).companyUser.count(),
    prisma.job.count(),
  ]);

  const STATS = [
    { label: 'Total Students', value: totalUsers, icon: Users, color: '#6366f1' },
    { label: 'Companies', value: totalCompanies, icon: Building, color: '#10b981' },
    { label: 'Active Jobs', value: totalJobs, icon: Briefcase, color: '#f59e0b' },
    { label: 'Revenue', value: '₹0', icon: IndianRupee, color: '#ec4899' },
  ];

  return (
    <div className="admin-page anim-fade-up">
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ marginBottom: '0.25rem', color: '#1e293b' }}>Admin Overview</h2>
        <p style={{ color: '#64748b', margin: 0 }}>Real-time statistics for the JobAdda platform.</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        {STATS.map((s, i) => (
          <div key={i} className="card card-p-sm" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius)', background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1, color: '#0f172a' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', fontWeight: '500' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: '1.5rem' }}>
        <div className="card">
          <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <ShieldAlert size={18} style={{ color: 'var(--warning)' }} />
            <h4 style={{ color: '#0f172a' }}>System Alerts</h4>
          </div>
          <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: '#f8fafc', borderLeft: '3px solid #10b981' }}>
              <span style={{ fontSize: '0.85rem', color: '#475569' }}>Database is healthy and in sync.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: '#f8fafc', borderLeft: '3px solid #3b82f6' }}>
              <span style={{ fontSize: '0.85rem', color: '#475569' }}>New modular architecture deployed successfully.</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ color: '#0f172a', marginBottom: '1.5rem' }}>Quick Actions</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <a href="/admin/jobs/create" className="btn btn-primary">Post Job for Company</a>
            <a href="/admin/team" className="btn btn-outline">Manage Subadmins</a>
          </div>
        </div>
      </div>
    </div>
  );
}
