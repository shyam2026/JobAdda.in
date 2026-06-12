import React from 'react';
import prisma from '@/lib/prisma';
import {
  Users, Building2, Briefcase, FileText, IndianRupee,
  Activity, ArrowUpRight, TrendingUp, GraduationCap
} from 'lucide-react';
import Link from 'next/link';

function StatCard({ label, value, sub, icon: Icon, color, href }: {
  label: string; value: string | number; sub?: string;
  icon: any; color: string; href?: string;
}) {
  const inner = (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.4rem',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.18s',
      cursor: href ? 'pointer' : 'default',
      minHeight: '148px', height: '148px',
    }}>
      {/* glow blob */}
      <div style={{
        position: 'absolute', top: '-40%', right: '-10%',
        width: '110px', height: '110px', borderRadius: '50%',
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      {/* top row: icon + arrow */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: `${color}18`, color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={17} />
        </div>
        {href && <ArrowUpRight size={13} style={{ color: 'var(--text-3)', opacity: 0.7 }} />}
      </div>
      {/* bottom: value + label + sub (always 3 lines reserved) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <div style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {value}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: '500' }}>{label}</div>
        {/* always reserve 1 line for sub so all cards are same height */}
        <div style={{ fontSize: '0.7rem', color, fontWeight: '600', minHeight: '1em' }}>
          {sub || ''}
        </div>
      </div>
    </div>
  );
  return href
    ? <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>
    : inner;
}

export default async function AdminDashboardPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalStudents,
    totalCompanies,
    totalJobs,
    openJobs,
    totalResumePurchases,
    totalApplications,
    applicationsByStatus,
    revenueData,
    topCompanies,
    totalScholarships,
    paidScholarships,
    takenScholarships,
    scholarshipScoreAggregate,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    (prisma.companyUser as any).count(),
    prisma.job.count(),
    prisma.job.count({ where: { status: 'OPEN' } }),
    prisma.purchase.count({ where: { status: 'COMPLETED' } }),
    prisma.application.count(),
    prisma.application.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.transaction.aggregate({
      where: { status: 'COMPLETED', type: 'CREDIT' },
      _sum: { amount: true },
    }),
    // Top 3 companies by job count (active posting companies)
    (prisma.companyUser as any).findMany({
      select: {
        id: true,
        companyName: true,
        slug: true,
        logo: true,
        industry: true,
        _count: { select: { jobs: true } },
      },
      orderBy: { jobs: { _count: 'desc' } },
      take: 3,
    }),
    prisma.scholarshipEntry.count(),
    prisma.scholarshipEntry.count({ where: { paymentStatus: 'PAID' } }),
    prisma.scholarshipEntry.count({ where: { examSubmitted: true } }),
    prisma.scholarshipEntry.aggregate({
      where: { examSubmitted: true },
      _avg: { examScore: true }
    })
  ]);

  const totalRevenue = revenueData._sum.amount || 0;
  const avgScholarshipScore = scholarshipScoreAggregate._avg.examScore || 0;

  const statusCount = (status: string) => {
    const found = (applicationsByStatus as any[]).find(a => a.status === status);
    return found ? found._count.id : 0;
  };

  return (
    <div className="admin-page anim-fade-up">

      {/* ── Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.2rem' }}>Platform Overview</h2>
        <p style={{ margin: 0, fontSize: '0.85rem' }}>Live stats for JobAdda.in</p>
      </div>

      {/* ── 5 KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard
          label="Total Students"
          value={totalStudents.toLocaleString()}
          icon={Users} color="#6366f1" href="/admin/users"
        />
        <StatCard
          label="Total Companies"
          value={totalCompanies.toLocaleString()}
          icon={Building2} color="#10b981" href="/admin/companies"
        />
        <StatCard
          label="Total Jobs"
          value={totalJobs.toLocaleString()}
          sub={`${openJobs} currently open`}
          icon={Briefcase} color="#f59e0b" href="/admin/jobs"
        />
        <StatCard
          label="Resume Downloads"
          value={totalResumePurchases.toLocaleString()}
          icon={FileText} color="#ec4899"
        />
        <StatCard
          label="Total Revenue"
          value={totalRevenue > 0 ? `₹${(totalRevenue).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '₹0'}
          icon={IndianRupee} color="#f59e0b" href="/admin/transactions"
        />
      </div>

      {/* ── Bottom multi-col grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

        {/* Application Pipeline */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
            <Activity size={16} style={{ color: 'var(--primary-light)' }} />
            <h4 style={{ margin: 0 }}>Application Pipeline</h4>
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: '600' }}>
              {totalApplications.toLocaleString()} total
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              { label: 'Pending',   count: statusCount('PENDING'),   color: '#f59e0b' },
              { label: 'Reviewing', count: statusCount('REVIEWING'), color: '#818cf8' },
              { label: 'Interview', count: statusCount('INTERVIEW'), color: '#14b8a6' },
              { label: 'Hired',     count: statusCount('HIRED'),     color: '#10b981' },
              { label: 'Rejected',  count: statusCount('REJECTED'),  color: '#ef4444' },
            ].map(s => {
              const pct = totalApplications > 0 ? Math.round((s.count / totalApplications) * 100) : 0;
              return (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontWeight: '600' }}>{s.label}</span>
                    <span style={{ fontSize: '0.78rem', color: s.color, fontWeight: '800' }}>{s.count} <span style={{ color: 'var(--text-3)', fontWeight: '500' }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '99px',
                      background: s.color, width: `${pct}%`,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scholarship Test Activity Card */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
              <GraduationCap size={16} style={{ color: 'var(--success)' }} />
              <h4 style={{ margin: 0 }}>Scholarship Test</h4>
              <Link href="/admin/scholarship" style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--success)', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                Manage <ArrowUpRight size={13} />
              </Link>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div style={{ background: 'var(--bg-3)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 'bold', textTransform: 'uppercase' }}>Registrations</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '0.2rem', color: 'var(--text-1)' }}>{totalScholarships}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--success)', marginTop: '0.1rem', fontWeight: 600 }}>{paidScholarships} Paid Fee</div>
              </div>
              
              <div style={{ background: 'var(--bg-3)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 'bold', textTransform: 'uppercase' }}>Exams Taken</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '0.2rem', color: 'var(--success)' }}>{takenScholarships}</div>
                <div style={{ fontSize: '0.68rem', color: '#a855f7', marginTop: '0.1rem', fontWeight: 600 }}>Avg Score: {avgScholarshipScore.toFixed(1)}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-3)', marginBottom: '0.3rem', fontWeight: 600 }}>
              <span>Fee Payment Ratio</span>
              <span>{Math.round((paidScholarships / (totalScholarships || 1)) * 100)}% Complete</span>
            </div>
            <div style={{ height: '8px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ height: '100%', background: 'var(--success)', width: `${(paidScholarships / (totalScholarships || 1)) * 100}%` }} />
              <div style={{ height: '100%', background: 'var(--warning)', width: `${((totalScholarships - paidScholarships) / (totalScholarships || 1)) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Top 3 Actively Posting Companies */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp size={16} style={{ color: '#10b981' }} />
            <h4 style={{ margin: 0 }}>Top Active Companies</h4>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {topCompanies.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.85rem' }}>
                No companies yet
              </div>
            ) : topCompanies.map((c: any, i: number) => {
              const initial = c.companyName[0].toUpperCase();
              const rankColors = ['#f59e0b', '#94a3b8', '#cd7c2f'];
              return (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.8rem 1.5rem',
                  borderBottom: i < topCompanies.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  {/* Rank */}
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                    background: `${rankColors[i]}22`, color: rankColors[i],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '800', fontSize: '0.75rem',
                  }}>
                    #{i + 1}
                  </div>

                  {/* Logo or initial */}
                  {c.logo ? (
                    <img src={c.logo} alt={c.companyName} style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'contain', background: 'var(--bg-3)', border: '1px solid var(--border)', flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
                      background: 'rgba(16,185,129,0.1)', color: '#10b981',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '800', fontSize: '0.9rem',
                      border: '1px solid rgba(16,185,129,0.15)',
                    }}>
                      {initial}
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.companyName}
                    </div>
                    {c.industry && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: '0.1rem' }}>{c.industry}</div>
                    )}
                  </div>

                  {/* Job count + link */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <span style={{
                      background: 'rgba(16,185,129,0.08)', color: '#10b981',
                      border: '1px solid rgba(16,185,129,0.18)',
                      borderRadius: '2rem', fontSize: '0.7rem', fontWeight: '800',
                      padding: '0.15rem 0.55rem',
                    }}>
                      {c._count.jobs} jobs
                    </span>
                    {c.slug && (
                      <Link href={`/companies/${c.slug}`} target="_blank" style={{ color: 'var(--text-3)', display: 'flex' }}>
                        <ArrowUpRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
