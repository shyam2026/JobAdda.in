'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Bell, ChevronDown, LogOut, User, LayoutDashboard, Briefcase, Menu, X, DollarSign, Gift, Building2, Search, FileText, Share2 } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const navLinks = [
    { href: '/jobs', label: 'Find Jobs', icon: Search },
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/salary', label: 'Salary Guide', icon: DollarSign },
    { href: '/refer', label: 'Refer & Earn', icon: Gift },
  ];

  const user = session?.user as { name?: string | null; email?: string | null; role?: string } | undefined;

  const dashboardLink = user?.role === 'COMPANY'
    ? '/company/dashboard'
    : user?.role === 'ADMIN'
    ? '/admin/dashboard'
    : '/dashboard';

  return (
    <>
      <nav className="navbar">
        <div className="container nav-inner">
          {/* Logo */}
          <a href="/" className="nav-logo">
            <div className="logo-mark">J</div>
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
                <a href="/notifications" className="btn btn-ghost btn-icon hide-mobile" aria-label="Notifications">
                  <Bell size={20} />
                </a>
                {/* Profile Dropdown */}
                <div style={{ position: 'relative' }} className="hide-mobile" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.4rem 0.9rem 0.4rem 0.5rem', cursor: 'pointer', color: 'var(--text)', transition: 'var(--transition)' }}
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    <div className="avatar avatar-sm">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
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
                        {user?.role && <div style={{ fontSize: '0.72rem', color: 'var(--primary-light)', marginTop: '0.2rem', textTransform: 'capitalize' }}>{user.role.toLowerCase()}</div>}
                      </div>
                      <a href={dashboardLink} className="sidebar-item" style={{ width: '100%' }} onClick={() => setProfileOpen(false)}><LayoutDashboard size={16} />Dashboard</a>
                      <a href="/profile" className="sidebar-item" style={{ width: '100%' }} onClick={() => setProfileOpen(false)}><User size={16} />My Profile</a>
                      <a href="/jobs/applied" className="sidebar-item" style={{ width: '100%' }} onClick={() => setProfileOpen(false)}><Briefcase size={16} />Applied Jobs</a>
                      <a href="/resume" className="sidebar-item" style={{ width: '100%' }} onClick={() => setProfileOpen(false)}><FileText size={16} />Resume Builder</a>
                      <a href="/refer" className="sidebar-item" style={{ width: '100%' }} onClick={() => setProfileOpen(false)}><Share2 size={16} />Refer & Earn</a>
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
            <div style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Navigation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className="sidebar-item" style={{ fontSize: '1rem', padding: '0.9rem 1rem' }} onClick={() => setMobileOpen(false)}>
                  <l.icon size={20} /> {l.label}
                </a>
              ))}
            </div>

            <div style={{ height: '1px', background: 'var(--border)' }} />

            {session ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 1rem 1.25rem' }}>
                  <div className="avatar avatar-lg">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{user?.name}</div>
                    <div style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>{user?.email}</div>
                  </div>
                </div>
                <a href={dashboardLink} className="sidebar-item" style={{ fontSize: '1rem', padding: '0.9rem 1rem' }} onClick={() => setMobileOpen(false)}><LayoutDashboard size={20} /> Dashboard</a>
                <a href="/profile" className="sidebar-item" style={{ fontSize: '1rem', padding: '0.9rem 1rem' }} onClick={() => setMobileOpen(false)}><User size={20} /> My Profile</a>
                <a href="/notifications" className="sidebar-item" style={{ fontSize: '1rem', padding: '0.9rem 1rem' }} onClick={() => setMobileOpen(false)}><Bell size={20} /> Notifications</a>
                <a href="/resume" className="sidebar-item" style={{ fontSize: '1rem', padding: '0.9rem 1rem' }} onClick={() => setMobileOpen(false)}><FileText size={20} /> Resume Builder</a>
                <a href="/refer" className="sidebar-item" style={{ fontSize: '1rem', padding: '0.9rem 1rem' }} onClick={() => setMobileOpen(false)}><Share2 size={20} /> Refer & Earn</a>
                <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}
                  className="sidebar-item"
                  style={{ color: 'var(--danger)', fontSize: '1rem', padding: '0.9rem 1rem', width: '100%' }}
                >
                  <LogOut size={20} /> Sign Out
                </button>
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
