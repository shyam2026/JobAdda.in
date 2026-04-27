'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  TrendingUp, 
  User, 
  FileText, 
  Share2, 
  Bell, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { href: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/jobs', icon: Briefcase, label: 'Find Jobs' },
  { href: '/user/applied-jobs', icon: TrendingUp, label: 'My Applications' },
  { href: '/user/profile', icon: User, label: 'My Profile' },
  { href: '/user/resume', icon: FileText, label: 'Resume Builder' },
  { href: '/user/refer', icon: Share2, label: 'Refer & Earn' },
  { href: '/user/notifications', icon: Bell, label: 'Notifications' },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'loading') {
    return (
      <div className="flex-center" style={{ height: '80vh' }}>
        <div className="skeleton" style={{ width: '150px', height: '20px' }} />
      </div>
    );
  }

  if (status === 'unauthenticated' || (session?.user && (session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
    router.push('/login');
    return null;
  }

  const user = session?.user as any;

  return (
    <div className="dashboard-layout">
      {/* Navigation - Sidebar on Desktop, 6-Column Bottom Bar on Mobile */}
      <aside className="sidebar">
        <div className="mobile-grid-nav" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="desktop-sidebar-header hide-mobile" style={{ padding: '0.5rem 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              </div>
            </div>
          </div>

          <nav className="nav-container">
            {[
              { href: '/user/dashboard', icon: LayoutDashboard, label: 'Home' },
              { href: '/user/applied-jobs', icon: TrendingUp, label: 'Applied' },
              { href: '/user/profile', icon: User, label: 'Profile' },
              { href: '/user/resume', icon: FileText, label: 'Resume' },
              { href: '/user/refer', icon: Share2, label: 'Refer' },
              { href: '/user/notifications', icon: Bell, label: 'Alerts' },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <a 
                  key={item.href} 
                  href={item.href} 
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={19} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="hide-mobile" style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="sidebar-item"
              style={{ color: 'var(--danger)', width: '100%' }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {children}
      </main>

      <style jsx global>{`
        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            bottom: 0 !important;
            top: auto !important;
            left: 0 !important;
            right: 0 !important;
            height: 65px !important;
            padding: 0 !important;
            display: block !important;
            background: var(--bg-2) !important;
            box-shadow: 0 -4px 15px rgba(0,0,0,0.2) !important;
          }
          .nav-container {
            display: grid !important;
            grid-template-columns: repeat(6, 1fr) !important;
            height: 100% !important;
            align-items: center !important;
          }
          .sidebar-item {
            padding: 0.5rem 0 !important;
            margin: 0 !important;
            height: 100% !important;
            justify-content: center !important;
            border-radius: 0 !important;
            background: transparent !important;
          }
          .sidebar-item.active {
            color: var(--primary-light) !important;
            background: rgba(99,102,241,0.05) !important;
          }
          .sidebar-item span {
            font-size: 0.55rem !important;
            margin-top: 2px !important;
          }
          .sidebar-item svg {
            width: 20px !important;
            height: 20px !important;
          }
          .desktop-sidebar-header, .mobile-grid-nav > div:last-child {
            display: none !important;
          }
          .dashboard-content {
            padding-bottom: 80px !important;
          }
        }
      `}</style>
    </div>
  );
}
