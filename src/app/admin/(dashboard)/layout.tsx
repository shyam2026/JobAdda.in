import React from 'react';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import prisma from '@/lib/prisma';
import { LayoutDashboard, Users, Building, Briefcase, IndianRupee, ShieldAlert, LogOut, ShieldCheck, ChevronDown, Plus, Ticket, FileText } from 'lucide-react';
import Link from 'next/link';

const ALL_MODULES = [
  { id: 'dashboard', label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Students', href: '/admin/users', icon: Users },
  { id: 'companies', label: 'Companies', href: '/admin/companies', icon: Building },
  { 
    id: 'jobs', 
    label: 'Jobs', 
    icon: Briefcase,
    submodules: [
      { label: 'All Jobs', href: '/admin/jobs' },
      { label: 'Post Job (Company)', href: '/admin/jobs/create' },
    ]
  },
  { id: 'transactions', label: 'Transactions', href: '/admin/transactions', icon: IndianRupee },
  { id: 'coupons', label: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { id: 'resume-data', label: 'Resume Data', href: '/admin/resume-data', icon: FileText },
  { id: 'team', label: 'Admin Team', href: '/admin/team', icon: ShieldAlert, reqSuper: true },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session || (session.user as any).portalType !== 'admin') {
    redirect('/admin/login');
  }

  const admin = await (prisma as any).adminUser.findUnique({
    where: { email: session?.user?.email as string }
  });

  if (!admin) {
    redirect('/admin/login');
  }

  const isSuper = admin.role === 'SUPERADMIN';
  let allowedModules: string[] = [];
  try {
    allowedModules = admin.modules ? JSON.parse(admin.modules) : [];
  } catch (e) {
    allowedModules = [];
  }

  // Filter modules based on permissions
  const visibleModules = ALL_MODULES.filter(m => {
    if (m.reqSuper && !isSuper) return false;
    if (isSuper || allowedModules.includes('all')) return true;
    return allowedModules.includes(m.id);
  });

  return (
    <div className="dashboard-layout" style={{ '--primary': 'var(--success)', '--primary-light': '#34d399', '--primary-dark': '#059669' } as React.CSSProperties}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ 
        background: 'var(--bg-2)', 
        borderRight: '1px solid var(--border)',
        top: 0,
        height: '100vh'
      }}>
        <div style={{ padding: '0.5rem 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--success)' }} />
            <span style={{ fontWeight: '800', fontSize: '1rem' }}>Command Center</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text)' }}>
              {admin.name}
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ 
                fontSize: '0.65rem', 
                padding: '0.15rem 0.5rem', 
                background: admin.role === 'SUPERADMIN' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                color: admin.role === 'SUPERADMIN' ? 'var(--success)' : '#818cf8',
                borderRadius: '4px',
                fontWeight: '700',
                textTransform: 'uppercase',
                border: `1px solid ${admin.role === 'SUPERADMIN' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`,
                letterSpacing: '0.02em'
              }}>
                {admin.role === 'SUPERADMIN' ? 'Super Admin' : 'Sub Admin'}
              </span>
            </div>
          </div>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {visibleModules.map(item => (
            <div key={item.id}>
              {item.submodules ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div className="sidebar-item" style={{ color: 'var(--text-2)', cursor: 'default' }}>
                    <item.icon size={17} style={{ color: 'var(--success)' }} /> {item.label}
                  </div>
                  <div style={{ paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.2rem' }}>
                    {item.submodules.map(sub => (
                      <Link key={sub.href} href={sub.href} className="sidebar-item" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link href={item.href} className="sidebar-item" style={{ color: 'var(--text-2)' }}>
                  <item.icon size={17} style={{ color: 'var(--success)' }} /> {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Sign Out Button */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/admin/login' });
            }}
          >
            <button
              type="submit"
              className="sidebar-item"
              style={{ color: 'var(--danger)', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <LogOut size={17} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="dashboard-content" style={{ background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </div>
      </main>

      {/* Global overrides for admin portal to enforce the theme inside the layout */}
      <style>{`
        .admin-page .btn-primary { background: var(--success); color: white; border: none; }
        .admin-page .btn-primary:hover { opacity: 0.9; }
        .admin-page .text-primary { color: var(--success); }
        .admin-page .card { background: var(--bg-2); border: 1px solid var(--border); box-shadow: var(--shadow); color: var(--text); }
        .admin-page th { background: var(--bg-3); color: var(--text-3); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
        .admin-page td { border-top: 1px solid var(--border); color: var(--text-2); }
        .admin-page h2 { color: var(--text); }
        .admin-page p { color: var(--text-3); }
      `}</style>
    </div>
  );
}
