import React from 'react';

const STAGE_COLORS: Record<string, string> = {
  Applied: '#64748b',
  Screening: '#f59e0b',
  Interview: '#6366f1',
  Offer: '#10b981',
  Hired: '#22c55e',
};

const KANBAN_STAGES = [
  { label: 'Applied', count: 38 },
  { label: 'Screening', count: 12 },
  { label: 'Interview', count: 8 },
  { label: 'Offer', count: 3 },
  { label: 'Hired', count: 3 },
];

export function KanbanBoard() {
  return (
    <div className="card card-p">
      <h4 style={{ marginBottom: '1.5rem' }}>Application Pipeline (ATS)</h4>
      <div className="kanban-board" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {KANBAN_STAGES.map(col => {
          const color = STAGE_COLORS[col.label];
          return (
            <div key={col.label} className="kanban-col" style={{ minWidth: '260px', flex: 1, background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '1rem', border: '1px solid var(--border)' }}>
              <div className="kanban-col-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.88rem' }}>{col.label}</span>
                <span className="badge" style={{ background: `${color}20`, color: color, border: `1px solid ${color}40`, padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                  {col.count}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Mock Cards */}
                {[1, 2].map(n => (
                  <div key={n} className="kanban-card" style={{ background: 'var(--bg)', padding: '1rem', borderRadius: 'calc(var(--radius) - 2px)', border: '1px solid var(--border)', cursor: 'grab', transition: 'var(--transition)' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.35rem' }}>Applicant #{n}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '0.75rem' }}>Senior React Dev</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="avatar avatar-sm" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>A</div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>Applied 2d ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
