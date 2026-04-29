'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Zap, Briefcase, Info, Clock, ExternalLink, User, Filter, ShieldCheck, MoreHorizontal, ArrowRight, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'REFERRAL' | 'JOB_STATUS' | 'SYSTEM' | 'SUCCESS' | 'DANGER';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'REFERRAL' | 'JOB_STATUS'>('ALL');
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mobile = mounted ? isMobile : false;

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/user/notifications');
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(fetchNotifications, 0);
  }, []);

  const markAsRead = async (id: string | 'all') => {
    try {
      const res = await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        if (id === 'all') {
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } else {
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'REFERRAL') return n.type === 'REFERRAL';
    if (filter === 'JOB_STATUS') return n.type === 'JOB_STATUS';
    return true;
  });

  const getIcon = (type: string, isRead: boolean) => {
    const baseClass = `${mobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500`;
    
    switch (type) {
      case 'SUCCESS':
        return (
          <div className={`${baseClass} ${isRead ? 'bg-emerald-500/10 text-emerald-500/50' : 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] border border-emerald-500/30'}`}>
            <CheckCircle size={mobile ? 18 : 22} strokeWidth={2.5} />
          </div>
        );
      case 'DANGER':
        return (
          <div className={`${baseClass} ${isRead ? 'bg-rose-500/10 text-rose-500/50' : 'bg-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)] border border-rose-500/30'}`}>
            <AlertTriangle size={mobile ? 18 : 22} strokeWidth={2.5} />
          </div>
        );
      case 'REFERRAL': 
        return (
          <div className={`${baseClass} ${isRead ? 'bg-amber-500/10 text-amber-500/50' : 'bg-amber-500/20 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] border border-amber-500/30'}`}>
            <Zap size={mobile ? 18 : 22} fill={isRead ? "none" : "currentColor"} strokeWidth={2.5} />
          </div>
        );
      case 'JOB_STATUS': 
        return (
          <div className={`${baseClass} ${isRead ? 'bg-blue-500/10 text-blue-500/50' : 'bg-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)] border border-blue-500/30'}`}>
            <Briefcase size={mobile ? 18 : 22} strokeWidth={2.5} />
          </div>
        );
      default: 
        return (
          <div className={`${baseClass} ${isRead ? 'bg-indigo-500/10 text-indigo-500/50' : 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)] border border-indigo-500/30'}`}>
            <Info size={mobile ? 18 : 22} strokeWidth={2.5} />
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container py-6 md:py-12 anim-fade-up" style={{ maxWidth: '900px', paddingLeft: '1rem', paddingRight: '1rem' }}>
      
      {/* Responsive Header */}
      <div style={{ position: 'relative', marginBottom: mobile ? '2rem' : '3rem' }}>
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '80px', height: '80px', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              
            </div>
            <h1 style={{ fontSize: mobile ? '2.2rem' : '3rem', fontWeight: '900', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
              Your <span className="text-gradient">Notifications</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', width: mobile ? '100%' : 'auto' }}>
             {unreadCount > 0 && (
               <button 
                 onClick={() => markAsRead('all')}
                 className="btn btn-primary btn-sm" 
                 style={{ flex: 1.5, padding: '0.6rem 1rem', borderRadius: '12px', gap: '0.5rem', whiteSpace: 'nowrap' }}
               >
                 <Check size={16} /> <span style={{ fontSize: '0.85rem' }}>Mark all read</span>
               </button>
             )}
          </div>
        </div>

        {/* Responsive Filter Tabs (Scrollable on mobile) */}
        <div style={{ 
          display: 'flex', 
          gap: '0.4rem', 
          marginTop: mobile ? '1.5rem' : '2.5rem', 
          padding: '0.3rem', 
          background: 'var(--bg-2)', 
          borderRadius: '14px', 
          border: '1px solid var(--border)', 
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          {[
            { id: 'ALL', label: 'All Activity', icon: <Filter size={14} /> },
            { id: 'UNREAD', label: `Unread (${unreadCount})`, icon: <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} /> },
            { id: 'REFERRAL', label: 'Referrals', icon: <Zap size={14} /> },
            { id: 'JOB_STATUS', label: 'Jobs', icon: <Briefcase size={14} /> },
          ].map((t: any) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.3s', whiteSpace: 'nowrap',
                background: filter === t.id ? 'var(--surface)' : 'transparent',
                color: filter === t.id ? 'var(--primary-light)' : 'var(--text-3)',
                border: filter === t.id ? '1px solid var(--border)' : '1px solid transparent'
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="card" style={{ height: '80px', animation: 'pulse 1.5s infinite', border: '1px solid var(--border)' }} />
          ))
        ) : filteredNotifications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--bg-2)', border: '2px dashed var(--border)', borderRadius: '20px' }}>
            <Bell size={32} style={{ margin: '0 auto 1rem', color: 'var(--text-3)', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>All Caught Up!</h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>New updates will appear here as they happen.</p>
          </div>
        ) : (
          filteredNotifications.map((n, idx) => (
            <div 
              key={n.id} 
              className="group anim-fade-up"
              style={{ 
                position: 'relative', 
                padding: mobile ? '1.25rem' : '1.5rem', 
                borderRadius: '24px', 
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
                animationDelay: `${idx * 0.05}s`,
                background: n.isRead ? '#1e293b' : '#0f172a',
                border: n.isRead ? '1px solid #334155' : '1px solid #6366f133',
                boxShadow: n.isRead ? 'none' : '0 10px 30px -10px rgba(99,102,241,0.15)',
              }}
            >
              <div style={{ display: 'flex', gap: mobile ? '1rem' : '1.5rem' }}>
                {getIcon(n.type, n.isRead)}
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <h4 style={{ 
                      fontSize: mobile ? '1rem' : '1.15rem', 
                      fontWeight: '800', 
                      color: n.isRead ? '#94a3b8' : '#fff', 
                      margin: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.6rem',
                      letterSpacing: '-0.01em'
                    }}>
                      {n.title}
                      {!n.isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 10px #6366f1' }} />}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', marginLeft: '1rem', background: '#0f172a80', padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid #33415544' }}>
                      <Clock size={12} />
                      {mounted ? format(new Date(n.createdAt), mobile ? 'hh:mm a' : 'MMM dd, hh:mm a') : ''}
                    </span>
                  </div>
                  
                  <p style={{ 
                    color: n.isRead ? '#64748b' : '#cbd5e1', 
                    fontSize: mobile ? '0.88rem' : '0.95rem', 
                    lineHeight: '1.6', 
                    margin: '0 0 1rem 0',
                    fontWeight: 500
                  }}>
                    {n.message}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      {n.link && (
                        <a 
                          href={n.link} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.4rem', 
                            color: '#818cf8', 
                            fontWeight: '700', 
                            fontSize: '0.85rem', 
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.color = '#a5b4fc'}
                          onMouseOut={e => e.currentTarget.style.color = '#818cf8'}
                        >
                          Action Required <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                    
                    {!n.isRead && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        style={{ 
                          background: '#10b98115', 
                          border: '1px solid #10b98133', 
                          color: '#10b981', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '10px', 
                          fontSize: '0.75rem', 
                          fontWeight: '800', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = '#10b98125';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = '#10b98115';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <Check size={14} /> Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.5 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
          Notifications are automatically cleared after 30 days.
        </p>
      </div>
    </div>
  );
}
