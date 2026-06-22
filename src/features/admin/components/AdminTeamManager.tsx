'use client';

import React, { useState } from 'react';
import {
  ShieldCheck, Edit2, ToggleLeft, ToggleRight, X, Check, Eye, EyeOff,
  Activity, Building2, Briefcase, ExternalLink, ChevronDown, ChevronUp,
  Loader2, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

const AVAILABLE_MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Students' },
  { id: 'companies', label: 'Companies' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'cash-collection', label: 'Cash Collection' },
];

function formatDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

interface ActivityData {
  jobs: { id: string; title: string; status: string; createdAt: string; company: { companyName: string; slug: string | null } }[];
  companies: { id: string; slug: string | null; companyName: string; industry: string | null; createdAt: string }[];
}

function ActivityDrawer({ adminId, adminName, adminCreatedAt, onClose }: { adminId: string; adminName: string; adminCreatedAt?: string; onClose: () => void }) {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'jobs' | 'companies'>('jobs');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredData = React.useMemo(() => {
    if (!data) return { jobs: [], companies: [] };
    const from = dateFrom ? new Date(dateFrom).getTime() : null;
    const to = dateTo ? new Date(dateTo + 'T23:59:59').getTime() : null;

    const filterItem = (createdAtStr: string) => {
      const t = new Date(createdAtStr).getTime();
      return (!from || t >= from) && (!to || t <= to);
    };

    return {
      jobs: data.jobs.filter(j => filterItem(j.createdAt)),
      companies: data.companies.filter(c => filterItem(c.createdAt)),
    };
  }, [data, dateFrom, dateTo]);

  React.useEffect(() => {
    fetch(`/api/admin/team/activity?adminId=${adminId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [adminId]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', background: 'var(--bg)' }}>
      {/* Full Screen Activity Card */}
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden',
        animation: 'fadeIn 0.18s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.5rem 1rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          background: 'var(--bg-3)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <Activity size={18} style={{ color: 'var(--primary-light)' }} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>Activity Log</h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-3)' }}>
              Created by <strong style={{ color: 'var(--text-2)' }}>{adminName}</strong>
              {adminCreatedAt && (
                <span style={{ marginLeft: '0.4rem', color: 'var(--text-3)', opacity: 0.85 }}>
                  • Joined {formatDate(adminCreatedAt)}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 1.5rem' }}>
          {(['jobs', 'companies'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.85rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: tab === t ? '700' : '500',
                color: tab === t ? 'var(--primary-light)' : 'var(--text-3)',
                borderBottom: tab === t ? '2px solid var(--primary-light)' : '2px solid transparent',
                marginBottom: '-1px',
                display: 'flex', alignItems: 'center', gap: '0.45rem',
              }}
            >
              {t === 'jobs' ? <Briefcase size={14} /> : <Building2 size={14} />}
              {t === 'jobs' ? 'Jobs' : 'Companies'}
              {data && (
                <span style={{
                  background: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)',
                  borderRadius: '2rem', fontSize: '0.68rem', fontWeight: '800',
                  padding: '0.1rem 0.45rem',
                }}>
                  {t === 'jobs' ? filteredData.jobs.length : filteredData.companies.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Date Filter Panel */}
        <div style={{
          background: 'var(--bg-2)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: '600' }}>Filter Date:</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>From</span>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              style={{
                background: 'var(--bg-3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                color: 'var(--text)',
                outline: 'none',
                colorScheme: 'dark',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>To</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              style={{
                background: 'var(--bg-3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                color: 'var(--text)',
                outline: 'none',
                colorScheme: 'dark',
              }}
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--danger)',
                fontSize: '0.78rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <X size={12} /> Clear dates
            </button>
          )}
        </div>

        {/* Content - Dedicated Scrollable List Area */}
        <div style={{ flex: 1, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem', color: 'var(--text-3)' }}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
            </div>
          ) : !data ? (
            <p style={{ color: 'var(--danger)', textAlign: 'center', padding: '2rem' }}>Failed to load activity.</p>
          ) : tab === 'jobs' ? (
            filteredData.jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)' }}>
                <Briefcase size={36} style={{ opacity: 0.25, marginBottom: '0.75rem' }} />
                <p style={{ margin: 0, fontSize: '0.88rem' }}>No matching jobs found</p>
              </div>
            ) : filteredData.jobs.map(job => (
              <div key={job.id} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                padding: '0.9rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Building2 size={10} /> {job.company.companyName}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={10} /> {formatDate(job.createdAt)}
                    </span>
                    <span style={{
                      background: job.status === 'OPEN' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: job.status === 'OPEN' ? 'var(--success)' : 'var(--danger)',
                      border: `1px solid ${job.status === 'OPEN' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                      borderRadius: '2rem', fontSize: '0.65rem', fontWeight: '700',
                      padding: '0.1rem 0.45rem',
                    }}>
                      {job.status}
                    </span>
                  </div>
                </div>
                <a
                  href={`/jobs/${job.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    background: 'rgba(99,102,241,0.08)', color: 'var(--primary-light)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '0.5rem', padding: '0.3rem 0.65rem',
                    fontSize: '0.73rem', fontWeight: '700', whiteSpace: 'nowrap',
                    textDecoration: 'none', flexShrink: 0,
                  }}
                >
                  View <ExternalLink size={11} />
                </a>
              </div>
            ))
          ) : (
            filteredData.companies.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)' }}>
                <Building2 size={36} style={{ opacity: 0.25, marginBottom: '0.75rem' }} />
                <p style={{ margin: 0, fontSize: '0.88rem' }}>No matching companies found</p>
              </div>
            ) : filteredData.companies.map(company => (
              <div key={company.id} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                padding: '0.9rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {company.companyName}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {company.industry && <span>{company.industry}</span>}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={10} /> {formatDate(company.createdAt)}
                    </span>
                  </div>
                </div>
                {company.slug && (
                  <a
                    href={`/companies/${company.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      background: 'rgba(99,102,241,0.08)', color: 'var(--primary-light)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: '0.5rem', padding: '0.3rem 0.65rem',
                      fontSize: '0.73rem', fontWeight: '700', whiteSpace: 'nowrap',
                      textDecoration: 'none', flexShrink: 0,
                    }}
                  >
                    View <ExternalLink size={11} />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export function AdminTeamManager({ initialAdmins }: { initialAdmins: any[] }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activityAdmin, setActivityAdmin] = useState<{ id: string; name: string; createdAt?: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SUBADMIN',
    modules: [] as string[]
  });

  const handleToggle = async (id: string, currentRole: string) => {
    if (currentRole === 'SUPERADMIN') return;
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', id })
      });
      if (res.ok) {
        setAdmins(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (admin: any) => {
    if (admin.role === 'SUPERADMIN') return;
    setEditingId(admin.id);
    setFormData({
      name: admin.name || '',
      email: admin.email,
      password: '',
      role: admin.role,
      modules: JSON.parse(admin.modules || '[]')
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingId ? 'update' : 'create',
          id: editingId,
          ...formData
        })
      });
      if (res.ok) {
        const updated = await res.json();
        if (editingId) {
          setAdmins(prev => prev.map(a => a.id === editingId ? updated : a));
        } else {
          setAdmins(prev => [...prev, updated]);
        }
        setIsModalOpen(false);
        resetForm();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save');
      }
    } catch (err) {
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', role: 'SUBADMIN', modules: [] });
    setEditingId(null);
    setShowPassword(false);
  };

  const toggleModule = (modId: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(modId)
        ? prev.modules.filter(m => m !== modId)
        : [...prev.modules, modId]
    }));
  };

  return (
    <div className="admin-page anim-fade-up" style={{ paddingTop: '0rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Admin Team</h2>
          <p style={{ margin: 0 }}>Manage super administrators and subadmins.</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setIsModalOpen(true); }}>
          + Add Subadmin
        </Button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Admin Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Modules Access</th>
              <th>Status</th>
              <th>Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text)' }}>{a.name || 'Unnamed Admin'}</div>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>{a.email}</td>
                <td>
                  {a.role === 'SUPERADMIN' ? (
                    <span className="badge" style={{ background: 'var(--success)', color: 'white' }}>
                      <ShieldCheck size={12} /> SUPERADMIN
                    </span>
                  ) : (
                    <span className="badge badge-primary">SUBADMIN</span>
                  )}
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                  {a.role === 'SUPERADMIN' ? 'All Modules' : (a.modules ? JSON.parse(a.modules).join(', ') : 'None')}
                </td>
                <td>
                  {a.role === 'SUPERADMIN' ? (
                    <div style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                      Active
                    </div>
                  ) : (
                    <div
                      onClick={() => handleToggle(a.id, a.role)}
                      style={{
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        color: a.isActive ? 'var(--success)' : 'var(--danger)',
                        fontSize: '0.85rem', fontWeight: '600'
                      }}
                    >
                      {a.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      {a.isActive ? 'Active' : 'Inactive'}
                    </div>
                  )}
                </td>
                <td>
                  {a.role !== 'SUPERADMIN' && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setActivityAdmin({ id: a.id, name: a.name || a.email, createdAt: a.createdAt })}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Activity size={12} /> Activity
                    </button>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {a.role !== 'SUPERADMIN' && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleEdit(a)}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Edit2 size={12} style={{ marginRight: '0.25rem' }} /> Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activity Drawer */}
      {activityAdmin && (
        <ActivityDrawer
          adminId={activityAdmin.id}
          adminName={activityAdmin.name}
          adminCreatedAt={activityAdmin.createdAt}
          onClose={() => setActivityAdmin(null)}
        />
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ padding: '2rem 1rem', alignItems: 'flex-start' }}>
          <div className="modal" style={{
            maxWidth: '500px',
            maxHeight: 'calc(100vh - 100px)',
            padding: '1.5rem',
            overflowY: 'auto',
            marginTop: '2rem'
          }}>
            <div className="flex-between mb-4">
              <h3 style={{ color: 'var(--text)', margin: 0, fontSize: '1.25rem' }}>{editingId ? 'Edit Subadmin' : 'Add New Subadmin'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsModalOpen(false)} style={{ padding: '0.5rem' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                label="Full Name"
                required
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
              />
              <Input
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
              />
              <Input
                label={editingId ? "New Password (leave blank to keep)" : "Password"}
                type={showPassword ? "text" : "password"}
                required={!editingId}
                value={formData.password}
                onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div className="input-group">
                <label className="label" style={{ fontWeight: 600 }}>Modules Permission</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {AVAILABLE_MODULES.map(m => (
                    <div
                      key={m.id}
                      onClick={() => toggleModule(m.id)}
                      className={`tag ${formData.modules.includes(m.id) ? 'active' : ''}`}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    >
                      {formData.modules.includes(m.id) ? <Check size={12} /> : null}
                      {m.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="divider" style={{ margin: '0.5rem 0' }}></div>

              <div className="flex gap-2" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1rem' }}>Cancel</Button>
                <Button type="submit" variant="primary" isLoading={loading} style={{ padding: '0.6rem 1.5rem' }}>
                  {editingId ? 'Save' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
