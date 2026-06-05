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
  ChevronRight,
  Star,
  MessageCircle
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
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  const user = session?.user as any;
  const [isPremium, setIsPremium] = React.useState(user?.isPremium || false);

  React.useEffect(() => {
    if (status !== 'authenticated') return;
    // Keep premium status in sync with DB
    fetch('/api/profile').then(r => r.json()).then(data => {
      if (data && !data.error) {
        setIsPremium(data.isPremium);
      }
    }).catch(() => {});
  }, [user?.id, status]);

  React.useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user && (session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex-center" style={{ height: '80vh' }}>
        <div className="skeleton" style={{ width: '150px', height: '20px' }} />
      </div>
    );
  }

  if (status === 'unauthenticated' || (session?.user && (session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
    return null;
  }

  const navItems = [
    { href: '/user/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/user/applied-jobs', icon: TrendingUp, label: 'Applied' },
    { href: '/user/premium', icon: Star, label: 'Premium', hideMobile: true },
    { href: '/user/chat', icon: MessageCircle, label: 'Chat' },
    { href: '/user/profile', icon: User, label: 'Profile' },
    { href: '/user/resume', icon: FileText, label: 'Resume' },
    { href: '/user/refer', icon: Share2, label: 'Refer' },
    { href: '/user/notifications', icon: Bell, label: 'Alerts', hideMobile: true },
  ];

  return (
    <div className={`dashboard-layout ${isCollapsed ? 'collapsed' : ''}`} style={{ transition: 'grid-template-columns 0.3s ease' }}>
      {/* Navigation - Sidebar on Desktop, 6-Column Bottom Bar on Mobile */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ transition: 'padding 0.3s ease' }}>
        <div className="mobile-grid-nav" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="desktop-sidebar-header hide-mobile" style={{ padding: isCollapsed ? '0.5rem 0 1.5rem' : '0.5rem 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem', display: 'flex', justifyContent: isCollapsed ? 'center' : 'space-between', alignItems: 'center', flexDirection: isCollapsed ? 'column' : 'row', gap: isCollapsed ? '1rem' : '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className={`avatar ${isCollapsed ? 'avatar-sm' : ''}`} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '50%' }}>
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={isCollapsed ? 16 : 20} color="var(--text-3)" />
                  )}
                </div>
                {isPremium && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '-4px', 
                    right: '-4px', 
                    background: '#fbbf24', 
                    borderRadius: '50%', 
                    width: isCollapsed ? '12px' : '16px', 
                    height: isCollapsed ? '12px' : '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1.5px solid #0f172a',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    zIndex: 2
                  }}>
                    <Star size={isCollapsed ? 6 : 8} fill="#000" color="#000" strokeWidth={3} />
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                </div>
              )}
            </div>
          </div>

          <nav className="nav-container">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <a 
                  key={item.href} 
                  href={item.href} 
                  className={`sidebar-item ${isActive ? 'active' : ''} ${(item as any).hideMobile ? 'hide-on-mobile' : ''}`}
                  style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '0.7rem' : '0.7rem 1rem' }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon size={19} style={{ minWidth: '19px' }} />
                  {!isCollapsed && <span>{item.label}</span>}
                </a>
              );
            })}
          </nav>

          <div className="hide-mobile" style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="sidebar-item"
              style={{ width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '0.7rem' : '0.7rem 1rem', marginBottom: '0.5rem' }}
              title={isCollapsed ? 'Expand Sidebar' : undefined}
            >
              <ChevronRight size={18} style={{ minWidth: '18px', transform: isCollapsed ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
              {!isCollapsed && <span>Collapse Sidebar</span>}
            </button>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="sidebar-item"
              style={{ color: 'var(--danger)', width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '0.7rem' : '0.7rem 1rem' }}
              title={isCollapsed ? 'Sign Out' : undefined}
            >
              <LogOut size={18} style={{ minWidth: '18px' }} />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header (Visible only on mobile) */}
      <div className="mobile-top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.profileImage ? (
              <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={18} color="var(--text-3)" />
            )}
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Welcome back</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, lineHeight: 1, marginTop: '0.15rem' }}>{user?.name?.split(' ')[0]}</div>
          </div>
        </div>
        <a href="/user/notifications" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899', position: 'relative', textDecoration: 'none' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '10px', right: '11px', width: '8px', height: '8px', background: '#ec4899', borderRadius: '50%', border: '2px solid var(--bg-2)' }}></span>
        </a>
      </div>

      {/* Main Content */}
      <main className="dashboard-content">
        {children}
      </main>

      <style jsx global>{`
        .mobile-top-header {
          display: none;
        }
        @media (min-width: 769px) {
          .dashboard-layout.collapsed {
            grid-template-columns: 80px 1fr !important;
          }
          .sidebar.collapsed {
            padding: 2rem 0.5rem !important;
          }
        }
        @media (max-width: 768px) {
          .mobile-top-header {
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 1.25rem;
            background: var(--bg-2);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 50;
          }
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
          .hide-on-mobile {
            display: none !important;
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
