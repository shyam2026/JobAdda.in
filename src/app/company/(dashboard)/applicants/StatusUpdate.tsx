'use client';

import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle, Search } from 'lucide-react';

interface StatusUpdateProps {
  applicationId: string;
  currentStatus: string;
}

export function StatusUpdate({ applicationId, currentStatus }: StatusUpdateProps) {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to update status');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const statuses = [
    { label: 'Pending', val: 'PENDING', icon: <Loader2 size={14} />, color: '#f59e0b' },
    { label: 'Reviewing', val: 'REVIEWING', icon: <Search size={14} />, color: '#6366f1' },
    { label: 'Hired', val: 'HIRED', icon: <CheckCircle size={14} />, color: '#10b981' },
    { label: 'Rejected', val: 'REJECTED', icon: <XCircle size={14} />, color: '#ef4444' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading}
        className="btn btn-primary btn-sm" 
        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', gap: '0.4rem' }}
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : 'Update Status'}
      </button>

      {showMenu && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
            onClick={() => setShowMenu(false)} 
          />
          <div style={{ 
            position: 'absolute', 
            top: '100%', 
            right: 0, 
            marginTop: '0.5rem', 
            width: '160px', 
            background: 'white', 
            border: '1px solid #e2e8f0', 
            borderRadius: '0.75rem', 
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
            zIndex: 50,
            overflow: 'hidden',
            padding: '0.4rem'
          }}>
            {statuses.map(s => (
              <button
                key={s.val}
                onClick={() => updateStatus(s.val)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors hover:bg-slate-50 ${currentStatus === s.val ? 'bg-slate-50 text-slate-900' : 'text-slate-600'}`}
              >
                <span style={{ color: s.color }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
