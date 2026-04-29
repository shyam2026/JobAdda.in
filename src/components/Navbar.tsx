'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Bell, ChevronDown, LogOut, User, LayoutDashboard, Briefcase, Menu, X, DollarSign, Gift, Building2, Search, FileText, Share2 } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [navProfileImage, setNavProfileImage] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  // Fetch unread notifications count
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user/notifications')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setUnreadCount(data.filter((n: any) => !n.isRead).length);
          }
        })
        .catch(() => {});

      // Fetch profile image for navbar avatar
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => { if (data?.profileImage) setNavProfileImage(data.profileImage); })
        .catch(() => {});
    }
  }, [status]);

  const navLinks = [
    { href: '/jobs', label: 'Find Jobs', icon: Search },
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/salary', label: 'Salary Guide', icon: DollarSign },
    { href: session ? '/user/resume' : '/resume', label: 'Resume', icon: FileText },
    { href: session ? '/user/refer' : '/refer', label: 'Refer & Earn', icon: Gift },
  ];

  const user = session?.user as { name?: string | null; email?: string | null; role?: string } | undefined;

  const dashboardLink = user?.role === 'COMPANY'
    ? '/company/dashboard'
    : user?.role === 'ADMIN'
    ? '/admin/dashboard'
    : '/user/dashboard';

  return (
    <>
      <nav className="navbar">
        <div className="container nav-inner">
          {/* Logo */}
          <a href="/" className="nav-logo">
            <span>JobAdda<span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>.in</span></span>
          </a>

          {/* Desktop Links */}
          <div className="nav-links hide-mobile">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </div>

          {/* Actions */}
          <div className="nav-actions">
            {status === 'loading' ? (
              <div className="hide-mobile" style={{ width: '120px', height: '36px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            ) : session ? (
              <>
                <a href="/user/notifications" className="btn btn-ghost btn-icon hide-mobile" style={{ position: 'relative' }} aria-label="Notifications">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid var(--bg-2)' }} />
                  )}
                </a>
                {/* Profile Dropdown */}
                <div style={{ position: 'relative' }} className="hide-mobile" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.4rem 0.9rem 0.4rem 0.5rem', cursor: 'pointer', color: 'var(--text)', transition: 'var(--transition)' }}
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    {navProfileImage ? (
                      <img src={navProfileImage} alt="profile" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div className="avatar avatar-sm">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                    )}
                    <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} style={{ color: 'var(--text-3)', transition: 'transform 0.2s', transform: profileOpen ? 'rotate(180deg)' : 'none' }} />
                  </button>
                  {profileOpen && (
                    <div
                      style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '0.5rem', minWidth: '210px', zIndex: 1100, boxShadow: 'var(--shadow)' }}
                      role="menu"
                    >
                      {/* User Info */}
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.4rem' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', wordBreak: 'break-all' }}>{user?.email}</div>
                      </div>
                      <a href="/user/dashboard" className="sidebar-item" style={{ width: '100%' }} onClick={() => setProfileOpen(false)}><LayoutDashboard size={16} />Dashboard</a>
                      <a href="/user/profile" className="sidebar-item" style={{ width: '100%' }} onClick={() => setProfileOpen(false)}><User size={16} />My Profile</a>
                      <a href="/user/applied-jobs" className="sidebar-item" style={{ width: '100%' }} onClick={() => setProfileOpen(false)}><Briefcase size={16} />Applied Jobs</a>
                      <a href="/user/resume" className="sidebar-item" style={{ width: '100%' }} onClick={() => setProfileOpen(false)}><FileText size={16} />Resume Builder</a>
                      <a href="/user/refer" className="sidebar-item" style={{ width: '100%' }} onClick={() => setProfileOpen(false)}><Share2 size={16} />Refer & Earn</a>
                      <div style={{ height: '1px', background: 'var(--border)', margin: '0.4rem 0.5rem' }} />
                      <button
                        onClick={() => { setProfileOpen(false); signOut({ callbackUrl: '/' }); }}
                        className="sidebar-item"
                        style={{ color: 'var(--danger)', width: '100%' }}
                      >
                        <LogOut size={16} />Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hide-mobile" style={{ display: 'flex', gap: '0.75rem' }}>
                <a href="/login" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Login</a>
                <a href="/register" className="btn btn-primary btn-sm">Get Started</a>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn btn-ghost btn-icon show-mobile"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div
          className="show-mobile"
          style={{ position: 'fixed', inset: 0, top: 'var(--nav-height)', background: 'var(--bg)', zIndex: 1000, padding: '1.5rem', overflowY: 'auto' }}
          onClick={e => { if (e.target === e.currentTarget) setMobileOpen(false); }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className="sidebar-item" style={{ fontSize: '1rem', padding: '0.9rem 1rem' }} onClick={() => setMobileOpen(false)}>
                  <l.icon size={20} /> {l.label}
                </a>
              ))}
            </div>

            <div style={{ height: '1px', background: 'var(--border)' }} />

            {session ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <a 
                    href="/user/profile" 
                    onClick={() => setMobileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit', flex: 1 }}
                  >
                    {navProfileImage ? (
                      <img src={navProfileImage} alt="profile" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', display: 'block', flexShrink: 0 }} />
                    ) : (
                      <div className="avatar avatar-md">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                      <div style={{ color: 'var(--text-3)', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                    </div>
                  </a>
                  <button
                    onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}
                    style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: 'var(--danger)', padding: '0.6rem', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
                    title="Sign Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="/login" className="btn btn-outline btn-lg" style={{ justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Login to Account</a>
                <a href="/register" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Create Free Account</a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
