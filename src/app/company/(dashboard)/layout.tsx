import React from 'react';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import prisma from '@/lib/prisma';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Settings, LogOut, CheckCircle, MessageCircle } from 'lucide-react';
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
  { id: 'chat', label: 'Messages', href: '/company/chat', icon: MessageCircle },
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
    <div className="dashboard-layout" style={{ '--primary': '#818cf8', '--primary-light': '#a5b4fc', '--primary-dark': '#6366f1', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' } as React.CSSProperties}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ 
        background: '#1e293b', 
        borderRight: '1px solid #334155',
        top: 0,
        height: '100vh',
        boxShadow: '4px 0 24px rgba(0,0,0,0.2)'
      }}>
        <div style={{ padding: '1.5rem 1rem 1.5rem', borderBottom: '1px solid #334155', marginBottom: '1rem' }}>
          <div style={{ fontWeight: '900', fontSize: '1.1rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            {companyUser.companyName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '700', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle size={14} /> Verified Recruiter
          </div>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0 0.5rem' }}>
          {SIDEBAR.map(item => (
            <div key={item.id}>
              {item.submodules ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div className="sidebar-item" style={{ color: '#94a3b8', cursor: 'default', fontWeight: '600' }}>
                    <item.icon size={18} style={{ color: '#818cf8' }} /> {item.label}
                  </div>
                  <div style={{ paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.4rem' }}>
                    {item.submodules.map(sub => (
                      <Link key={sub.href} href={sub.href} className="sidebar-item sidebar-sublink" style={{ padding: '0.6rem 0.75rem', fontSize: '0.85rem', color: '#f8fafc', transition: 'all 0.2s', borderRadius: '8px' }}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link href={item.href} className="sidebar-item sidebar-link" style={{ color: '#ffffff', fontWeight: '600', transition: 'all 0.2s', borderRadius: '8px' }}>
                  <item.icon size={18} style={{ color: '#818cf8' }} /> {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/company/login' });
            }}
          >
            <button
              type="submit"
              className="sidebar-item sidebar-logout"
              style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '12px', fontWeight: '600', transition: 'all 0.2s' }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="dashboard-content" style={{ background: '#0f172a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </div>
      </main>

      <style>{`
        .company-page .btn-primary { background: #6366f1; color: white; border: none; font-weight: 700; }
        .company-page .btn-primary:hover { background: #4f46e5; }
        .company-page .text-primary { color: #818cf8; }
        .company-page .card { background: #1e293b; border: 1px solid #334155; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); color: #f8fafc; }
        .company-page th { background: #0f172a; color: #94a3b8; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; border-bottom: 1px solid #334155; }
        .company-page td { border-top: 1px solid #334155; color: #cbd5e1; }
        .company-page input, .company-page select, .company-page textarea { background: #0f172a; border: 1px solid #334155; color: white; }
        .company-page input:focus, .company-page select:focus, .company-page textarea:focus { border-color: #818cf8; outline: none; }
        .sidebar-link:hover { color: #f1f5f9 !important; background: rgba(255,255,255,0.05) !important; }
        .sidebar-sublink:hover { color: #f1f5f9 !important; background: rgba(255,255,255,0.05) !important; }
        .sidebar-logout:hover { background: rgba(239, 68, 68, 0.2) !important; }
      `}</style>
    </div>
  );
}
