'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Zap, Briefcase, Info, Clock, ExternalLink, User, Filter, ShieldCheck, MoreHorizontal, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'REFERRAL' | 'JOB_STATUS' | 'SYSTEM';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'REFERRAL' | 'JOB_STATUS'>('ALL');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    fetchNotifications();
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
    const baseClass = `${isMobile ? 'w-9 h-9' : 'w-11 h-11'} rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500`;
    switch (type) {
      case 'REFERRAL': 
        return <div className={`${baseClass} ${isRead ? 'bg-yellow-500/10 text-yellow-500' : 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'}`}><Zap size={isMobile ? 16 : 20} fill={isRead ? "none" : "currentColor"} /></div>;
      case 'JOB_STATUS': 
        return <div className={`${baseClass} ${isRead ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}><Briefcase size={isMobile ? 16 : 20} /></div>;
      default: 
        return <div className={`${baseClass} ${isRead ? 'bg-primary/10 text-primary' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}><Info size={isMobile ? 16 : 20} /></div>;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container py-6 md:py-12 anim-fade-up" style={{ maxWidth: '900px', paddingLeft: '1rem', paddingRight: '1rem' }}>
      
      {/* Responsive Header */}
      <div style={{ position: 'relative', marginBottom: isMobile ? '2rem' : '3rem' }}>
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '80px', height: '80px', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              
            </div>
            <h1 style={{ fontSize: isMobile ? '2.2rem' : '3rem', fontWeight: '900', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
              Your <span className="text-gradient">Notifications</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', width: isMobile ? '100%' : 'auto' }}>
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
          marginTop: isMobile ? '1.5rem' : '2.5rem', 
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
              className="group"
              style={{ 
                position: 'relative', padding: isMobile ? '1rem' : '1.25rem', borderRadius: '20px', transition: 'all 0.3s', animationDelay: `${idx * 0.05}s`,
                background: n.isRead ? 'var(--surface)' : 'linear-gradient(to right, var(--surface), rgba(99,102,241,0.02))',
                border: n.isRead ? '1px solid var(--border)' : '1px solid rgba(99,102,241,0.15)',
              }}
            >
              <div style={{ display: 'flex', gap: isMobile ? '0.75rem' : '1.25rem' }}>
                {getIcon(n.type, n.isRead)}
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', fontWeight: '800', color: n.isRead ? 'var(--text)' : 'var(--primary-light)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {n.title}
                      {!n.isRead && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)' }} />}
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                      {format(new Date(n.createdAt), isMobile ? 'MMM dd' : 'MMM dd, hh:mm a')}
                    </span>
                  </div>
                  
                  <p style={{ color: 'var(--text-2)', fontSize: isMobile ? '0.85rem' : '0.92rem', lineHeight: '1.5', margin: '0 0 0.85rem 0' }}>
                    {n.message}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {n.link && (
                      <a 
                        href={n.link} 
                        className="btn btn-ghost btn-sm"
                        style={{ padding: 0, height: 'auto', background: 'transparent', color: 'var(--primary-light)', fontWeight: '700', fontSize: '0.8rem', gap: '0.3rem' }}
                      >
                        View <ArrowRight size={12} />
                      </a>
                    )}
                    {!n.isRead && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="text-xs font-bold text-success flex items-center gap-1 hover:underline cursor-pointer"
                        style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.75rem' }}
                      >
                        <ShieldCheck size={12} /> Mark read
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
