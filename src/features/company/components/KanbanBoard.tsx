import React from 'react';
import { Application, User, Job } from '@prisma/client';

type ApplicationWithRelations = any; // Using any for simplicity as Prisma types might vary

interface KanbanBoardProps {
  applications: ApplicationWithRelations[];
}

const STAGE_COLORS: Record<string, string> = {
  Applied: '#64748b',
  Reviewing: '#6366f1',
  Hired: '#22c55e',
};

const STATUS_MAP: Record<string, string> = {
  PENDING: 'Applied',
  REVIEWING: 'Reviewing',
  HIRED: 'Hired',
};

export function KanbanBoard({ applications = [] }: KanbanBoardProps) {
  // Group applications by stage
  const columns = ['Applied', 'Reviewing', 'Hired'].map(label => {
    const appsInStage = applications.filter(app => STATUS_MAP[app.status] === label);
    return { label, count: appsInStage.length, items: appsInStage };
  });

  return (
    <div className="card card-p" style={{ background: '#1e293b', border: '1px solid #334155' }}>
      <h4 style={{ marginBottom: '1.5rem', color: '#f8fafc' }}>Application Pipeline (ATS)</h4>
      <div className="kanban-board" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {columns.map(col => {
          const color = STAGE_COLORS[col.label];
          return (
            <div key={col.label} className="kanban-col" style={{ minWidth: '280px', flex: 1, background: '#0f172a', borderRadius: '16px', padding: '1rem', border: '1px solid #334155' }}>
              <div className="kanban-col-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#cbd5e1' }}>{col.label}</span>
                <span className="badge" style={{ background: `${color}20`, color: color, border: `1px solid ${color}40`, padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                  {col.count}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {col.items.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>
                    No candidates in this stage
                  </div>
                ) : (
                  col.items.map((app: any) => (
                    <div key={app.id} className="kanban-card" style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155', cursor: 'grab', transition: 'all 0.2s' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.35rem', color: '#f1f5f9' }}>{app.student?.name || 'Unnamed Candidate'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#818cf8', marginBottom: '1rem', fontWeight: '600' }}>{app.job?.title || 'Unknown Role'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div className="avatar avatar-sm" style={{ width: '28px', height: '28px', fontSize: '0.75rem', background: '#334155', color: '#f1f5f9' }}>
                          {app.student?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
