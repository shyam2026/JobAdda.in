'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, LogOut, User, LayoutDashboard, Briefcase, Menu, X, DollarSign, Gift, Building2, Search, FileText, Share2, Star, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const DiwaliDiyaIcon = ({ width = 22, height = 18 }: { width?: number; height?: number }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ 
      display: 'inline-block', 
      verticalAlign: 'middle',
      animation: 'diya-glow 2s ease-in-out infinite'
    }}
  >
    {/* Diya Base */}
    <path 
      d="M2 11C2 16 6.477 18 12 18C17.523 18 22 16 22 11C22 10.5 21.5 10 20 10C17 10 15 11 12 11C9 11 7 10 4 10C2.5 10 2 10.5 2 11Z" 
      fill="url(#diyaNavGrad)" 
      stroke="#D97706" 
      strokeWidth="1"
    />
    {/* Diya Rim */}
    <ellipse cx="12" cy="10.5" rx="9" ry="2" fill="#F59E0B" />
    {/* Flame */}
    <path 
      d="M12 1C12 1 15 5 15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5 12 1 12 1Z" 
      fill="url(#flameNavGrad)"
    >
      <animate attributeName="opacity" values="0.85;1;0.9;1" dur="1.5s" repeatCount="indefinite" />
    </path>
    {/* Inner Flame */}
    <path 
      d="M12 4C12 4 13.5 6.5 13.5 7.5C13.5 8.32843 12.8284 9 12 9C11.1716 9 10.5 8.32843 10.5 7.5C10.5 6.5 12 4 12 4Z" 
      fill="#FEF08A"
    />
    <defs>
      <linearGradient id="diyaNavGrad" x1="2" y1="10" x2="22" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D97706" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="flameNavGrad" x1="12" y1="1" x2="12" y2="10" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="0.6" stopColor="#EF4444" />
        <stop offset="1" stopColor="#DC2626" />
      </linearGradient>
    </defs>
  </svg>
);

import { getScholarshipPhase } from '@/lib/scholarship-schedule';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [navProfileImage, setNavProfileImage] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [scholarshipPhase, setScholarshipPhase] = useState<'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'EXAM_LIVE' | 'RESULT_WAITING' | 'RESULT_LIVE'>('REGISTRATION_OPEN');

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

  // Close mobile menu and profile dropdown on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Check scholarship schedule phase
  useEffect(() => {
    setScholarshipPhase(getScholarshipPhase());
  }, []);

  // Fetch unread notifications count & profile data
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user/notifications')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setUnreadCount(data.filter((n: any) => !n.isRead).length);
          }
        })
        .catch(() => { });

      fetch('/api/profile')
        .then(res => res.json())
        .then(data => { 
          if (data?.profileImage) setNavProfileImage(data.profileImage); 
          if (data?.isPremium) setIsPremium(true);
        })
        .catch(() => { });
    }
  }, [status]);

  const isPostExam = scholarshipPhase === 'RESULT_WAITING' || scholarshipPhase === 'RESULT_LIVE';

  const navLinks = [
    { href: '/jobs', label: 'Find Jobs', icon: Search },
    { href: '/companies', label: 'Companies', icon: Building2 },
    { 
      href: isPostExam ? '/scholarship/result' : '/scholarship', 
      label: isPostExam ? 'Scholarship Result' : 'Scholarship 2026', 
      icon: GraduationCap, 
      highlight: true
    }, 
    { href: session ? '/user/resume' : '/resume', label: 'Resume', icon: FileText },
    { href: session ? '/user/refer' : '/refer', label: 'Refer & Earn', icon: Gift },
  ];

  const user = session?.user as { name?: string | null; email?: string | null; role?: string } | undefined;

  return (
    <>
      <nav className="navbar" style={{ 
        zIndex: mobileOpen ? 2100 : 1100,
        background: mobileOpen ? 'transparent' : undefined,
        borderBottom: mobileOpen ? 'none' : undefined,
        boxShadow: mobileOpen ? 'none' : undefined
      }}>
        <div className="container nav-inner">
          {/* Logo */}
          {mobileOpen ? (
            <div />
          ) : (
            <Link href="/" className="nav-logo">
              <span>JobAdda<span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>.in</span></span>
            </Link>
          )}

          {/* Desktop Links */}
          <div className="nav-links hide-mobile">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="nav-link" style={l.highlight ? { position: 'relative', color: 'var(--primary-light)', fontWeight: 600, paddingRight: '24px' } : {}}>
                {l.label}
                {l.highlight && (
                  <span 
                    style={{ 
                      position: 'absolute',
                      top: '-6px',
                      right: '0px',
                      display: 'inline-block',
                      pointerEvents: 'none'
                    }}
                  >
                    <DiwaliDiyaIcon width={22} height={18} />
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="nav-actions">
            {status === 'loading' ? (
              <div className="hide-mobile" style={{ width: '120px', height: '36px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            ) : session ? (
              <>
                <Link href="/user/notifications" className="btn btn-ghost btn-icon hide-mobile" style={{ position: 'relative' }} aria-label="Notifications">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid var(--bg-2)' }} />
                  )}
                </Link>
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
                    {isPremium && <Star size={14} fill="#fbbf24" color="#fbbf24" style={{ flexShrink: 0 }} />}
                    <ChevronDown size={14} style={{ color: 'var(--text-3)', transition: 'transform 0.2s', transform: profileOpen ? 'rotate(180deg)' : 'none' }} />
                  </button>
                  {profileOpen && (
                    <div
                      style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '0.5rem', minWidth: '210px', zIndex: 1200, boxShadow: 'var(--shadow)' }}
                      role="menu"
                    >
                      {/* User Info */}
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.4rem' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', wordBreak: 'break-all' }}>{user?.email}</div>
                      </div>
                      <Link href="/user/dashboard" className="sidebar-item" style={{ width: '100%' }}><LayoutDashboard size={16} />Dashboard</Link>
                      <Link href="/user/profile" className="sidebar-item" style={{ width: '100%' }}><User size={16} />My Profile</Link>
                      <Link href="/user/applied-jobs" className="sidebar-item" style={{ width: '100%' }}><Briefcase size={16} />Applied Jobs</Link>
                      <Link href="/user/resume" className="sidebar-item" style={{ width: '100%' }}><FileText size={16} />Resume Builder</Link>
                      <Link href="/user/refer" className="sidebar-item" style={{ width: '100%' }}><Share2 size={16} />Refer & Earn</Link>
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
                <Link href="/login" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Login</Link>
                <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn btn-ghost btn-icon show-mobile"
              aria-label="Toggle menu"
              style={{ position: 'relative', zIndex: 2100 }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div
          className="show-mobile"
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(10, 15, 30, 0.96)', 
            backdropFilter: 'blur(12px)',
            zIndex: 2000, 
            padding: '1.5rem', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <div>
            {/* Header: Logo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <Link href="/" className="nav-logo" onClick={() => setMobileOpen(false)}>
                <span>JobAdda<span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>.in</span></span>
              </Link>
            </div>

            {/* Navigation links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navLinks.map(l => {
                const IconComponent = l.icon;
                return (
                  <Link 
                    key={l.href} 
                    href={l.href} 
                    onClick={() => setMobileOpen(false)}
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'row',
                      alignItems: 'center', 
                      gap: '1rem', 
                      fontSize: '1.1rem', 
                      fontWeight: 500,
                      padding: '0.9rem 1.2rem', 
                      color: l.highlight ? 'var(--primary-light)' : 'var(--text)',
                      background: l.highlight ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.02)',
                      border: l.highlight ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <IconComponent size={20} style={{ color: l.highlight ? 'var(--primary-light)' : 'var(--text-3)', flexShrink: 0 }} /> 
                    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                      {l.label}
                      {l.highlight && (
                        <span 
                          style={{ 
                            position: 'absolute',
                            top: '-8px',
                            right: '-30px',
                            display: 'inline-block',
                            pointerEvents: 'none'
                          }}
                        >
                          <DiwaliDiyaIcon width={22} height={18} />
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Account actions at bottom */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {session ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Link
                    href="/user/profile"
                    onClick={() => setMobileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit', flex: 1, minWidth: 0 }}
                  >
                    {navProfileImage ? (
                      <img src={navProfileImage} alt="profile" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', display: 'block', flexShrink: 0 }} />
                    ) : (
                      <div className="avatar avatar-md" style={{ flexShrink: 0 }}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff' }}>
                        {user?.name}
                        {isPremium && <Star size={14} fill="#fbbf24" color="#fbbf24" style={{ flexShrink: 0 }} />}
                      </div>
                      <div style={{ color: 'var(--text-3)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                    </div>
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}
                    style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: 'var(--danger)', padding: '0.6rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
                
                <Link href="/user/dashboard" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-lg" style={{ justifyContent: 'center', borderRadius: '12px', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LayoutDashboard size={18} /> Go to Dashboard
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="btn btn-outline btn-lg" style={{ justifyContent: 'center', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>Login to Account</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-lg" style={{ justifyContent: 'center', borderRadius: '12px' }}>Create Free Account</Link>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes diya-glow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.4)); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.85)); }
        }
      `}</style>
    </>
  );
}
