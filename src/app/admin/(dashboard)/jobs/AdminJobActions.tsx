'use client';

import React, { useState } from 'react';
import { ExternalLink, Archive, Loader2 } from 'lucide-react';

interface AdminJobActionsProps {
  jobId: string;
  status: string;
}

export function AdminJobActions({ jobId, status }: AdminJobActionsProps) {
  const [archiving, setArchiving] = useState(false);

  const handleArchive = async () => {
    if (!confirm('Are you sure you want to archive this job? It will no longer be visible to applicants.')) return;
    
    setArchiving(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' })
      });
      
      if (res.ok) {
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to archive job');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.4rem' }}>
      <a href={`/jobs/${jobId}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.5rem' }} title="View Job">
        <ExternalLink size={14} />
      </a>
      {status !== 'ARCHIVED' && (
        <button 
          onClick={handleArchive}
          disabled={archiving}
          className="btn btn-outline btn-sm" 
          style={{ padding: '0.35rem 0.5rem', color: '#f59e0b', borderColor: '#fcd34d' }} 
          title="Archive Job"
        >
          {archiving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Archive size={14} />}
        </button>
      )}
    </div>
  );
}
