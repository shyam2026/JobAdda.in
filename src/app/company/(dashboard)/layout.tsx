import React from 'react';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import prisma from '@/lib/prisma';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Settings, LogOut, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const SIDEBAR = [
  { id: 'dashboard', label: 'Overview', href: '/company/dashboard', icon: LayoutDashboard },
  { 
    id: 'jobs', 
    label: 'Jobs', 
    icon: Briefcase,
    submodules: [
      { label: 'My Jobs', href: '/company/jobs' },
      { label: 'Post a Job', href: '/company/jobs/create' },
    ]
  },
  { id: 'applicants', label: 'Applicants', href: '/company/applicants', icon: Users },
  { id: 'settings', label: 'Settings', href: '/company/settings', icon: Settings },
];

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session || (session.user as any).portalType !== 'company') {
    redirect('/company/login');
  }

  const companyUser = await (prisma as any).companyUser.findUnique({
    where: { email: session?.user?.email as string }
  });

  if (!companyUser) {
    redirect('/company/login');
  }

  return (
    <div className="dashboard-layout" style={{ '--primary': '#0284c7', '--primary-light': '#38bdf8', '--primary-dark': '#0369a1' } as React.CSSProperties}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ 
        background: '#f8fafc', 
        borderRight: '1px solid #e2e8f0',
        top: 0,
        height: '100vh'
      }}>
        <div style={{ padding: '0.5rem 0.5rem 1.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem' }}>
          <div style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>
            {companyUser.companyName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: '600', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CheckCircle size={12} /> Verified Recruiter
          </div>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {SIDEBAR.map(item => (
            <div key={item.id}>
              {item.submodules ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div className="sidebar-item" style={{ color: '#475569', cursor: 'default' }}>
                    <item.icon size={17} style={{ color: '#0284c7' }} /> {item.label}
                  </div>
                  <div style={{ paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.2rem' }}>
                    {item.submodules.map(sub => (
                      <Link key={sub.href} href={sub.href} className="sidebar-item" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link href={item.href} className="sidebar-item" style={{ color: '#475569' }}>
                  <item.icon size={17} style={{ color: '#0284c7' }} /> {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/company/login' });
            }}
          >
            <button
              type="submit"
              className="sidebar-item"
              style={{ color: '#ef4444', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <LogOut size={17} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="dashboard-content" style={{ background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </div>
      </main>

      <style>{`
        .company-page .btn-primary { background: #0284c7; color: white; border: none; }
        .company-page .btn-primary:hover { background: #0369a1; }
        .company-page .text-primary { color: #0284c7; }
        .company-page .card { background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .company-page th { background: #f8fafc; color: #475569; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
        .company-page td { border-top: 1px solid #e2e8f0; color: #334155; }
      `}</style>
    </div>
  );
}
