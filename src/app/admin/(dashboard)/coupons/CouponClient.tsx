'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Power, PowerOff, X } from 'lucide-react';

type Coupon = {
  id: string;
  code: string;
  type: string;
  discount: number | null;
  usageLimit: number;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
};

export default function CouponClient() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENT',
    discount: '',
    usageLimit: '100',
    expiresAt: ''
  });
  const [error, setError] = useState('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(fetchCoupons, 0);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...formData,
        discount: formData.type === 'PERCENT' ? parseInt(formData.discount) : null,
        usageLimit: parseInt(formData.usageLimit),
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
      };

      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create coupon');
        return;
      }

      setShowModal(false);
      setFormData({ code: '', type: 'PERCENT', discount: '', usageLimit: '100', expiresAt: '' });
      fetchCoupons();
    } catch (e) {
      setError('Server error');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="admin-page anim-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#1e293b', marginBottom: '0.25rem' }}>Discount Coupons</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Manage promo codes for resume templates.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type / Discount</th>
              <th>Usage Stats</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading...</td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No coupons created yet.</td>
              </tr>
            ) : (
              coupons.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', fontSize: '1rem', background: '#f1f5f9', display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {c.code}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: c.type === 'FREE' ? '#10b981' : '#6366f1' }}>{c.type}</div>
                    {c.type === 'PERCENT' && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.discount}% OFF</div>}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                      <strong>{c.usedCount}</strong> / {c.usageLimit} uses
                    </div>
                    {c.expiresAt && (
                      <div style={{ fontSize: '0.75rem', color: new Date(c.expiresAt) < new Date() ? '#ef4444' : '#64748b' }}>
                        Exp: {new Date(c.expiresAt).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${c.isActive ? 'badge-success' : 'badge-danger'}`} style={{ cursor: 'pointer' }} onClick={() => handleToggleActive(c.id, c.isActive)}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '2.5rem' }}>
                      <button onClick={() => handleToggleActive(c.id, c.isActive)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.isActive ? '#ef4444' : '#10b981' }} title={c.isActive ? 'Deactivate' : 'Activate'}>
                        {c.isActive ? <PowerOff size={18} /> : <Power size={18} />}
                      </button>
                      <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15rem 1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>Create New Coupon</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            {error && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Coupon Code</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', textTransform: 'uppercase' }} placeholder="e.g. GET20" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Coupon Type</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="PERCENT">Percentage Discount</option>
                  <option value="FREE">Completely Free</option>
                </select>
              </div>

              {formData.type === 'PERCENT' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Discount Percentage (1-100)</label>
                  <input required type="number" min="1" max="100" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="20" />
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Usage Limit</label>
                  <input required type="number" min="1" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Expiry Date (Optional)</label>
                  <input type="date" value={formData.expiresAt} onChange={e => setFormData({ ...formData, expiresAt: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.9rem', display: 'flex', justifyContent: 'center' }}>Create Coupon</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
