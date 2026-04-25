'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, CheckCheck, Briefcase, Gift, Star, Loader2 } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: string;
  icon: string;
  color: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase, Gift, Star
};

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(data => { setNotifs(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const unreadCount = notifs.filter(n => !n.read).length;

  const filtered = notifs.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Applications') return n.type === 'application';
    if (filter === 'Referrals') return n.type === 'referral';
    return true;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-3)' }}>Loading notifications...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <h3>Please sign in to view notifications</h3>
        <a href="/login" className="btn btn-primary">Sign In</a>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '760px' }}>
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bell size={24} />
              Notifications
              {unreadCount > 0 && <span className="badge badge-primary">{unreadCount} new</span>}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-3)' }}>Stay updated on your JobAdda.in activity</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
              <CheckCheck size={15} /> Mark all read
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['All', 'Applications', 'Referrals'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`tag ${filter === f ? 'active' : ''}`}>{f}</button>
          ))}
        </div>

        {/* Notifications */}
        {filtered.length === 0 ? (
          <div className="card card-p" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Bell size={48} style={{ color: 'var(--text-3)', opacity: 0.3, marginBottom: '1rem' }} />
            <h3>No notifications yet</h3>
            <p style={{ color: 'var(--text-3)' }}>Apply to jobs and refer friends to see activity here.</p>
            <a href="/jobs" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Browse Jobs</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map(n => {
              const IconComp = ICON_MAP[n.icon] || Bell;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem 1.5rem',
                    background: n.read ? 'transparent' : 'rgba(99,102,241,0.05)',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${n.read ? 'var(--border)' : 'rgba(99,102,241,0.2)'}`,
                    cursor: 'pointer', transition: 'var(--transition)', position: 'relative'
                  }}
                >
                  {!n.read && <div style={{ position: 'absolute', top: '1.25rem', left: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
                  <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius)', background: `${n.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.color, flexShrink: 0 }}>
                    <IconComp size={19} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: n.read ? '500' : '700', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{n.title}</div>
                    <div style={{ fontSize: '0.87rem', color: 'var(--text-3)', lineHeight: '1.5' }}>{n.message}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '0.5rem' }}>{n.time}</div>
                  </div>
                  {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '0.4rem', flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
