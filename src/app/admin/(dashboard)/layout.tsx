import React from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth, signOut } from '@/auth';
import prisma from '@/lib/prisma';
import { LayoutDashboard, Users, Building, Briefcase, IndianRupee, ShieldAlert, LogOut, ShieldCheck, ChevronDown, Plus, Ticket, FileText, MessageSquare, Star, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface Module {
  id: string;
  label: string;
  href?: string;
  icon: any;
  reqSuper?: boolean;
  submodules?: { label: string; href: string }[];
}

const ALL_MODULES: Module[] = [
  { id: 'dashboard', label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Students', href: '/admin/users', icon: Users },
  { id: 'companies', label: 'Companies', href: '/admin/companies', icon: Building },
  { id: 'jobs', label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { id: 'transactions', label: 'Transactions', href: '/admin/transactions', icon: IndianRupee },
  { id: 'coupons', label: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { id: 'resume-data', label: 'Resume Data', href: '/admin/resume-data', icon: FileText },
  { id: 'scholarship', label: 'Scholarships', href: '/admin/scholarship', icon: GraduationCap },
  { id: 'contact', label: 'Inquiries', href: '/admin/contact', icon: MessageSquare },
  { id: 'premium', label: 'Premium', href: '/admin/premium', icon: Star, reqSuper: true },
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

  const headersList = await headers();
  const pathname = headersList.get('x-url') || '';
  const currentModule = ALL_MODULES.find(m => pathname === m.href || pathname.startsWith(m.href + '/'));
  const hasAccess = !currentModule || (
    isSuper || 
    allowedModules.includes('all') || 
    allowedModules.includes(currentModule.id)
  );

  if (!hasAccess && visibleModules.length > 0) {
    const firstAllowedModule = visibleModules[0];
    if (firstAllowedModule && firstAllowedModule.href) {
      redirect(firstAllowedModule.href);
    }
  }

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
                    {item.submodules.map((sub: { label: string; href: string }) => (
                      <Link key={sub.href} href={sub.href} className="sidebar-item" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link href={item.href || '#'} className="sidebar-item" style={{ color: 'var(--text-2)' }}>
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
          {hasAccess ? children : (
            <div className="admin-page anim-fade-up" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem 2rem', borderRadius: '1rem', textAlign: 'center', border: '1px solid var(--border)', background: 'var(--bg-2)' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', marginBottom: '1.25rem' }}>
                  <ShieldAlert size={36} />
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', color: 'var(--text)' }}>Access Blocked</h3>
                <p style={{ margin: '0 0 2rem 0', fontSize: '0.88rem', color: 'var(--text-3)', lineHeight: '1.5' }}>
                  You do not have administrative access to the <strong style={{ color: 'var(--text-2)' }}>{currentModule?.label || 'requested'}</strong> module. Please contact your system administrator to request access.
                </p>
                <Link
                  href={visibleModules[0]?.href || "/admin/dashboard"}
                  style={{
                    display: 'inline-block',
                    background: 'var(--success)',
                    color: 'white',
                    padding: '0.65rem 1.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    transition: 'var(--transition)',
                  }}
                  className="btn btn-primary"
                >
                  Return to Allowed Module
                </Link>
              </div>
            </div>
          )}
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
