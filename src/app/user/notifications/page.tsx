'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Briefcase, Gift, Star, CheckCircle } from 'lucide-react';

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

export default function UserNotificationsPage() {
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => { setNotifs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const unreadCount = notifs.filter(n => !n.read).length;

  const filtered = notifs.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Applications') return n.type === 'application';
    if (filter === 'Referrals') return n.type === 'referral';
    return true;
  });

  if (loading) {
    return <div className="skeleton" style={{ height: '400px' }} />;
  }

  return (
    <div className="anim-fade-up">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bell size={24} /> Notifications
          </h2>
          <p style={{ margin: 0, color: 'var(--text-3)' }}>{unreadCount} unread messages</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </header>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {['All', 'Applications', 'Referrals'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`tag ${filter === f ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>{f}</button>
        ))}
      </div>

      {/* Notifications */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.length === 0 ? (
          <div className="card card-p" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Bell size={48} style={{ color: 'var(--text-3)', opacity: 0.3, marginBottom: '1rem' }} />
            <h3>All caught up!</h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>No notifications found for this category.</p>
          </div>
        ) : (
          filtered.map(n => {
            const IconComp = ICON_MAP[n.icon] || Bell;
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '1rem', 
                  padding: '1rem',
                  background: n.read ? 'rgba(255,255,255,0.01)' : 'rgba(99,102,241,0.04)',
                  borderRadius: 'var(--radius)',
                  border: `1px solid ${n.read ? 'var(--border)' : 'rgba(99,102,241,0.2)'}`,
                  cursor: 'pointer', 
                  transition: 'var(--transition)', 
                  position: 'relative'
                }}
              >
                {!n.read && <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: `${n.color}15`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: n.color, 
                  flexShrink: 0 
                }}>
                  <IconComp size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.read ? '500' : '700', fontSize: '0.9rem', marginBottom: '0.2rem', color: 'var(--text)' }}>{n.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', lineHeight: '1.4' }}>{n.message}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle size={10} style={{ opacity: 0.5 }} /> {n.time}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
