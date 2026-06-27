'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Power, PowerOff, X, AlertCircle, CheckCircle2, Loader2, Edit } from 'lucide-react';

type Coupon = {
  id: string;
  code: string;
  type: string;
  discount: number | null;
  usageLimit: number;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  target: string;
  createdAt: string;
};

type CodeStatus = 'idle' | 'checking' | 'available' | 'taken';

export default function CouponClient() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENT',
    discount: '',
    usageLimit: '100',
    expiresAt: '',
    target: 'ALL'
  });
  const [error, setError] = useState('');
  const [codeStatus, setCodeStatus] = useState<CodeStatus>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [editFormData, setEditFormData] = useState({ usageLimit: '', expiresAt: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

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

  // Real-time duplicate check against already-loaded coupons list
  const checkCodeLocally = useCallback((code: string) => {
    if (!code.trim()) { setCodeStatus('idle'); return; }
    const normalized = code.trim().toUpperCase();
    const duplicate = coupons.some(c => c.code === normalized);
    setCodeStatus(duplicate ? 'taken' : 'available');
  }, [coupons]);

  const handleCodeChange = (value: string) => {
    const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setFormData(prev => ({ ...prev, code: upper }));
    setError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!upper.trim()) { setCodeStatus('idle'); return; }

    setCodeStatus('checking');
    debounceRef.current = setTimeout(() => {
      checkCodeLocally(upper);
    }, 350);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Block submit if code is already taken
    if (codeStatus === 'taken') {
      setError(`Coupon code "${formData.code}" already exists. Please choose a different code.`);
      return;
    }

    // Validate discount for PERCENT type
    if (formData.type === 'PERCENT') {
      const d = parseInt(formData.discount);
      if (!formData.discount || isNaN(d) || d < 1 || d > 100) {
        setError('Discount must be between 1 and 100 for Percentage coupons.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        discount: formData.type === 'PERCENT' ? parseInt(formData.discount) : null,
        usageLimit: parseInt(formData.usageLimit),
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        target: formData.target
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
      setFormData({ code: '', type: 'PERCENT', discount: '', usageLimit: '100', expiresAt: '', target: 'ALL' });
      setCodeStatus('idle');
      fetchCoupons();
    } catch (e) {
      setError('Server error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
    setCodeStatus('idle');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setFormData({ code: '', type: 'PERCENT', discount: '', usageLimit: '100', expiresAt: '', target: 'ALL' });
  };

  const openEditModal = (coupon: Coupon) => {
    setEditCoupon(coupon);
    setEditFormData({
      usageLimit: coupon.usageLimit.toString(),
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : ''
    });
    setEditError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCoupon) return;
    setEditError('');
    setEditSubmitting(true);
    try {
      const res = await fetch(`/api/admin/coupons/${editCoupon.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usageLimit: parseInt(editFormData.usageLimit),
          expiresAt: editFormData.expiresAt ? new Date(editFormData.expiresAt).toISOString() : null
        })
      });
      if (!res.ok) throw new Error('Failed to update coupon');
      setShowEditModal(false);
      fetchCoupons();
    } catch (e: any) {
      setEditError(e.message || 'Server error');
    } finally {
      setEditSubmitting(false);
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

  const codeInputBorderColor =
    codeStatus === 'taken' ? '#ef4444' :
    codeStatus === 'available' ? '#10b981' :
    '#cbd5e1';

  return (
    <div className="admin-page anim-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#1e293b', marginBottom: '0.25rem' }}>Discount Coupons</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Manage promo codes for resume and premium.</p>
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
              <th>Target</th>
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
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '20px', 
                      background: c.target === 'ALL' 
                        ? '#f1f5f9' 
                        : c.target === 'RESUME' 
                        ? 'rgba(99,102,241,0.1)' 
                        : c.target === 'SCHOLARSHIP'
                        ? 'rgba(16,185,129,0.1)'
                        : 'rgba(251,191,36,0.1)', 
                      color: c.target === 'ALL' 
                        ? '#64748b' 
                        : c.target === 'RESUME' 
                        ? 'var(--primary)' 
                        : c.target === 'SCHOLARSHIP'
                        ? '#10b981'
                        : '#fbbf24', 
                      border: '1px solid currentColor' 
                    }}>
                      {c.target}
                    </span>
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
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <button onClick={() => openEditModal(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1' }} title="Edit">
                        <Edit size={18} />
                      </button>
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
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>Create New Coupon</h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            {error && (
              <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.05rem' }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Coupon Code — with live duplicate detection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Coupon Code
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    required
                    type="text"
                    value={formData.code}
                    onChange={e => handleCodeChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                      borderRadius: '8px',
                      border: `1.5px solid ${codeInputBorderColor}`,
                      textTransform: 'uppercase',
                      fontFamily: 'monospace',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    placeholder="e.g. GET20"
                    maxLength={30}
                  />
                  {/* Status icon */}
                  <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                    {codeStatus === 'checking' && <Loader2 size={16} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />}
                    {codeStatus === 'available' && <CheckCircle2 size={16} color="#10b981" />}
                    {codeStatus === 'taken' && <AlertCircle size={16} color="#ef4444" />}
                  </span>
                </div>
                {/* Inline status message */}
                {codeStatus === 'taken' && (
                  <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: '#ef4444', fontWeight: 600 }}>
                    ✗ This code already exists. Choose a different one.
                  </p>
                )}
                {codeStatus === 'available' && formData.code && (
                  <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                    ✓ Code is available.
                  </p>
                )}
                {codeStatus === 'idle' && (
                  <p style={{ margin: '0.35rem 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
                    Only letters and numbers. Automatically uppercased.
                  </p>
                )}
              </div>

              {/* Coupon Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Coupon Type</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="PERCENT">Percentage Discount</option>
                  <option value="FREE">Completely Free</option>
                </select>
              </div>

              {/* Discount % — only for PERCENT */}
              {formData.type === 'PERCENT' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Discount Percentage (1–100)</label>
                  <input required type="number" min="1" max="100" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="20" />
                </div>
              )}

              {/* Target */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Coupon Target</label>
                <select value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="ALL">All Services</option>
                  <option value="RESUME">Resume Templates</option>
                  <option value="PREMIUM">Premium Subscription</option>
                  <option value="SCHOLARSHIP">Scholarship Test</option>
                </select>
              </div>

              {/* Usage Limit + Expiry */}
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

              <button
                type="submit"
                disabled={submitting || codeStatus === 'taken' || codeStatus === 'checking' || !formData.code.trim()}
                className="btn btn-primary"
                style={{ marginTop: '0.5rem', padding: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: (submitting || codeStatus === 'taken' || codeStatus === 'checking' || !formData.code.trim()) ? 0.6 : 1, cursor: (submitting || codeStatus === 'taken' || codeStatus === 'checking' || !formData.code.trim()) ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating...</> : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editCoupon && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15rem 1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>Edit Coupon: {editCoupon.code}</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            {editError && (
              <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.05rem' }} />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Usage Limit</label>
                  <input required type="number" min={editCoupon.usedCount} value={editFormData.usageLimit} onChange={e => setEditFormData({ ...editFormData, usageLimit: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  <p style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>Current usage: {editCoupon.usedCount}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>Expiry Date (Optional)</label>
                  <input type="date" value={editFormData.expiresAt} onChange={e => setEditFormData({ ...editFormData, expiresAt: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <button type="submit" disabled={editSubmitting} className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.9rem', display: 'flex', justifyContent: 'center' }}>
                {editSubmitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }} /> Updating...</> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
