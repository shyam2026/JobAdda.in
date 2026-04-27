'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Edit2, ToggleLeft, ToggleRight, X, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

const AVAILABLE_MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Students' },
  { id: 'companies', label: 'Companies' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'transactions', label: 'Transactions' },
];

export function AdminTeamManager({ initialAdmins }: { initialAdmins: any[] }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
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
      password: '', // Don't show password
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
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: a.isActive ? 'var(--success)' : 'var(--danger)',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}
                    >
                      {a.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      {a.isActive ? 'Active' : 'Inactive'}
                    </div>
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
