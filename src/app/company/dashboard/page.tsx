'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, LayoutDashboard, Briefcase, Users, MessageSquare, Settings, TrendingUp, ChevronRight, CheckCircle, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { KanbanBoard } from '@/features/company/components/KanbanBoard';

const SIDEBAR = [
  { href: '/company/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/company/jobs', icon: Briefcase, label: 'My Jobs' },
  { href: '/company/applicants', icon: Users, label: 'Applicants' },
  { href: '/company/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/company/analytics', icon: TrendingUp, label: 'Analytics' },
  { href: '/company/settings', icon: Settings, label: 'Settings' },
];

const MOCK_APPLICANTS = [
  { name: 'Rahul Sharma', role: 'Senior React Developer', stage: 'Shortlisted', time: '2h ago', avatar: 'R' },
  { name: 'Priya Patel', role: 'Senior React Developer', stage: 'Applied', time: '5h ago', avatar: 'P' },
  { name: 'Amit Kumar', role: 'Product Manager', stage: 'Interview', time: '1d ago', avatar: 'A' },
  { name: 'Sneha Reddy', role: 'Product Manager', stage: 'Hired', time: '2d ago', avatar: 'S' },
];

const STAGE_COLORS: Record<string, string> = { Applied: 'muted', Shortlisted: 'warning', Interview: 'primary', Hired: 'success', Rejected: 'danger' };

export default function CompanyDashboard() {
  const { data: session } = useSession();
  const [showPostJob, setShowPostJob] = useState(false);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [form, setForm] = useState({ title: '', location: '', salary: '', type: 'Full-time', description: '', requirements: '', skills: '' });

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    await new Promise(r => setTimeout(r, 1200));
    setPosted(true); 
    setPosting(false);
    setTimeout(() => { 
      setPosted(false); 
      setShowPostJob(false); 
      setForm({ title: '', location: '', salary: '', type: 'Full-time', description: '', requirements: '', skills: '' });
    }, 2000);
  };

  if (!session) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}><h3>Please login as a recruiter</h3><a href="/login" className="btn btn-primary">Login to JobAdda.in</a></div>;

  const stats = [
    { label: 'Active Jobs', value: '4', icon: Briefcase, color: '#6366f1' },
    { label: 'Total Applicants', value: '142', icon: Users, color: '#10b981' },
    { label: 'Interviews Scheduled', value: '12', icon: Clock, color: '#f59e0b' },
    { label: 'Hired This Month', value: '3', icon: CheckCircle, color: '#ec4899' },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ padding: '0.5rem 0.5rem 1.75rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text)' }}>{session.user?.name || 'Company Portal'}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: '600' }}>✓ Verified Recruiter</div>
        </div>
        {SIDEBAR.map(item => (
          <a key={item.href} href={item.href} className="sidebar-item">{<item.icon size={17} />}{item.label}</a>
        ))}
      </aside>

      <div className="dashboard-content">
        <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>Recruiter Dashboard</h2>
            <p style={{ margin: 0 }}>Manage your hiring on <strong>JobAdda.in</strong></p>
          </div>
          <Button onClick={() => setShowPostJob(true)} variant="primary" size="lg" leftIcon={<Plus size={18} />}>
            Post a Job
          </Button>
        </div>

        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          {stats.map((s, i) => (
            <div key={i} className="card card-p-sm" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius)', background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><s.icon size={20} /></div>
              <div><div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1 }}>{s.value}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Applicants Table */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="flex-between" style={{ padding: '1.5rem 1.5rem 0' }}>
            <h4>Recent Applicants</h4>
            <a href="/company/applicants" className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>View All <ChevronRight size={14} /></a>
          </div>
          <div className="table-wrap" style={{ marginTop: '1rem', border: 'none', borderRadius: 0, borderTop: '1px solid var(--border)' }}>
            <table>
              <thead><tr><th>Candidate</th><th>Applied For</th><th>Stage</th><th>Time</th><th>Actions</th></tr></thead>
              <tbody>
                {MOCK_APPLICANTS.map((a, i) => (
                  <tr key={i}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><div className="avatar avatar-sm">{a.avatar}</div><span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{a.name}</span></div></td>
                    <td style={{ color: 'var(--text-3)', fontSize: '0.88rem' }}>{a.role}</td>
                    <td><span className={`badge badge-${STAGE_COLORS[a.stage]}`}>{a.stage}</span></td>
                    <td style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{a.time}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="primary" size="sm">Shortlist</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Extracted ATS Kanban */}
        <KanbanBoard />
        
      </div>

      {/* Post Job Modal */}
      {showPostJob && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowPostJob(false)}>
          <div className="modal" style={{ maxWidth: '680px' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
              <h3>Post a New Job on JobAdda.in</h3>
              <button onClick={() => setShowPostJob(false)} className="btn btn-ghost btn-icon"><X size={20} /></button>
            </div>
            {posted ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <CheckCircle size={56} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                <h3 style={{ color: 'var(--success)' }}>Job Posted Successfully!</h3>
                <p>Your listing is now live on JobAdda.in</p>
              </div>
            ) : (
              <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <Input label="Job Title *" required placeholder="e.g. Senior Frontend Developer" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                <div className="grid-2">
                  <Input label="Location *" required placeholder="e.g. Bangalore / Remote" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                  <Input label="Salary Range" placeholder="e.g. ₹12L - ₹18L" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="label">Job Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    {['Full-time', 'Part-time', 'Remote', 'Hybrid', 'Internship', 'Contract'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="label">Job Description *</label>
                  <textarea required placeholder="Describe the role, day-to-day responsibilities..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ minHeight: '100px', width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
                <Input label="Required Skills (comma-separated)" placeholder="React, Node.js, AWS, TypeScript" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Button type="button" onClick={() => setShowPostJob(false)} variant="outline">Cancel</Button>
                  <Button type="submit" isLoading={posting} variant="primary">
                    🚀 Publish Job
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

