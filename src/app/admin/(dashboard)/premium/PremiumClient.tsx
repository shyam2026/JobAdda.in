'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Star, Users, IndianRupee, CheckCircle, Search, RefreshCw, Clock, Download, RotateCcw, ChevronLeft, ChevronRight, AlertTriangle, X, Tag, Shield } from 'lucide-react';

const fmt = (d: any) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const isActive = (until: any) => !!until && new Date(until) > new Date();

export default function AdminPremiumClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<'users' | 'transactions'>('users');
  const [modal, setModal] = useState<{ user: any; action: string } | null>(null);
  const [extendDate, setExtendDate] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const notify = (ok: boolean, msg: string) => { setToast({ ok, msg }); setTimeout(() => setToast(null), 4000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/premium?page=${page}&search=${search}&filter=${filter}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setData(j);
    } catch (e: any) { notify(false, e.message || 'Failed to load'); }
    finally { setLoading(false); }
  }, [page, search, filter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, filter]);

  const doAction = async () => {
    if (!modal) return;
    setProcessing(true);
    try {
      const body: any = { userId: modal.user.id, action: modal.action };
      if ((modal.action === 'grant' || modal.action === 'extend') && extendDate) body.premiumUntil = extendDate;
      const r = await fetch('/api/admin/premium', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      notify(true, `Done: ${modal.action} applied to ${modal.user.name || modal.user.email}`);
      setModal(null); load();
    } catch (e: any) { notify(false, e.message || 'Action failed'); }
    finally { setProcessing(false); }
  };

  const openModal = (user: any, action: string) => {
    setModal({ user, action });
    if (action === 'grant' || action === 'extend') {
      setExtendDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    }
  };

  const stats = [
    { label: 'Total Premium', value: data?.totalUsers ?? '—', icon: Star, color: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
    { label: 'Active', value: data?.activeCount ?? '—', icon: CheckCircle, color: '#10b981', glow: 'rgba(16,185,129,0.15)' },
    { label: 'Total Revenue', value: data ? `₹${(data.totalRevenue || 0).toLocaleString('en-IN')}` : '—', icon: IndianRupee, color: '#6366f1', glow: 'rgba(99,102,241,0.15)' },
    { label: 'Coupon Used', value: data?.couponUsedCount ?? '—', icon: Tag, color: '#ec4899', glow: 'rgba(236,72,153,0.15)' },
  ];

  return (
    <div style={{ padding: '2rem 2rem', maxWidth: '1300px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <div style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', borderRadius: '12px', padding: '0.6rem', display: 'flex' }}>
              <Star size={22} color="#000" fill="#000" />
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>Premium Management</h1>
          </div>
          <p style={{ color: 'var(--text-3)', margin: 0, fontSize: '0.875rem' }}>Grant, revoke and track premium memberships</p>
        </div>
        <button onClick={load} disabled={loading} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '40px' }}>
          <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '90px', height: '90px', borderRadius: '50%', background: s.glow }} />
            <div style={{ background: s.glow, border: `1px solid ${s.color}30`, borderRadius: '10px', padding: '0.55rem', width: 'fit-content', marginBottom: '1rem' }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.35rem', color: 'var(--text)' }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-3)', borderRadius: '12px', padding: '0.3rem', marginBottom: '1.5rem', width: 'fit-content' }}>
        {[{ id: 'users', label: '⭐ Premium Users' }, { id: 'transactions', label: '💳 Payments' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)} style={{ padding: '0.5rem 1.2rem', borderRadius: '9px', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: tab === t.id ? 'var(--surface)' : 'transparent', color: tab === t.id ? 'var(--text)' : 'var(--text-3)', boxShadow: tab === t.id ? '0 2px 8px rgba(0,0,0,0.15)' : 'none' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <>
          {/* Search + Filter Row */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone…" style={{ paddingLeft: '2.6rem', width: '100%' }} />
            </div>
            <div style={{ display: 'flex', background: 'var(--bg-3)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
              {['all', 'active', 'expired'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: 'pointer', background: filter === f ? (f === 'active' ? '#10b981' : f === 'expired' ? '#ef4444' : 'var(--primary)') : 'transparent', color: filter === f ? '#fff' : 'var(--text-3)', transition: 'all 0.2s' }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-3)' }}>
                    {[
                      { h: 'User', w: '260px' },
                      { h: 'Contact', w: '280px' },
                      { h: 'Premium Until', w: '180px' },
                      { h: 'Downloads', w: '140px' },
                      { h: 'Status', w: '140px' },
                      { h: 'Actions', w: '200px' }
                    ].map(col => (
                      <th key={col.h} style={{ 
                        textAlign: 'left', 
                        padding: '1.1rem 1.5rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.08em', 
                        color: 'var(--text-3)', 
                        whiteSpace: 'nowrap',
                        width: col.w
                      }}>{col.h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-3)' }}>
                      <RefreshCw size={24} className="spin" style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.5 }} />
                      Loading premium users…
                    </td></tr>
                  ) : !data?.users?.length ? (
                    <tr><td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-3)' }}>No premium users found.</td></tr>
                  ) : data.users.map((u: any) => (
                    <tr key={u.id} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000', fontSize: '1rem', flexShrink: 0, boxShadow: '0 4px 10px rgba(245,158,11,0.2)' }}>
                            {(u.name || u.email || 'U')[0].toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {u.name || 'Unknown'} <Star size={12} fill="#fbbf24" color="#fbbf24" />
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '0.1rem' }}>Joined {fmt(u.createdAt)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 600 }}>{u.email}</div>
                        {u.phone && <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>{u.phone}</div>}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: isActive(u.premiumUntil) ? 'var(--text-2)' : '#94a3b8' }}>
                          <Clock size={14} color={isActive(u.premiumUntil) ? '#10b981' : '#ef4444'} />
                          {fmt(u.premiumUntil)}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Download size={14} color="var(--text-3)" />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{u.premiumResumeDownloads}</span>
                            <span style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 600 }}>/ 5</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.4rem 0.9rem', 
                          borderRadius: '100px', 
                          fontSize: '0.75rem', 
                          fontWeight: 800, 
                          background: isActive(u.premiumUntil) ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                          color: isActive(u.premiumUntil) ? '#10b981' : '#ef4444', 
                          border: `1px solid ${isActive(u.premiumUntil) ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` 
                        }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                          {isActive(u.premiumUntil) ? 'Active' : 'Expired'}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => openModal(u, 'extend')} className="btn-action-extend" style={{ padding: '0.45rem 0.9rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}>Extend</button>
                          <button onClick={() => openModal(u, 'revoke')} className="btn-action-revoke" style={{ padding: '0.45rem 0.9rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}>Revoke</button>
                          {u.premiumResumeDownloads > 0 && (
                            <button onClick={() => openModal(u, 'reset_downloads')} title="Reset downloads" style={{ padding: '0.45rem', borderRadius: '10px', background: 'var(--bg-3)', color: 'var(--text-3)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}>
                              <RotateCcw size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {data && data.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-sm btn-outline"><ChevronLeft size={16} /></button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>Page {page} of {data.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="btn btn-sm btn-outline"><ChevronRight size={16} /></button>
            </div>
          )}
        </>
      )}

      {tab === 'transactions' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-3)' }}>
                  {[
                    { h: 'User', w: '260px' },
                    { h: 'Amount', w: '140px' },
                    { h: 'Coupon', w: '160px' },
                    { h: 'Payment ID', w: '200px' },
                    { h: 'Date', w: '160px' },
                    { h: 'Status', w: '140px' }
                  ].map(col => (
                    <th key={col.h} style={{ 
                      textAlign: 'left', 
                      padding: '1.1rem 1.5rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em', 
                      color: 'var(--text-3)', 
                      whiteSpace: 'nowrap',
                      width: col.w
                    }}>{col.h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-3)' }}>
                    <RefreshCw size={24} className="spin" style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.5 }} />
                    Loading transactions…
                  </td></tr>
                ) : !data?.transactions?.length ? (
                  <tr><td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-3)' }}>No transactions yet.</td></tr>
                ) : data.transactions.map((t: any) => (
                  <tr key={t.id} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>{t.user?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{t.user?.email}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ fontWeight: 900, fontSize: '1rem', color: '#10b981' }}>₹{t.amount}</span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {t.couponCode ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '8px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 800 }}>
                          <Tag size={11} />{t.couponCode}
                        </span>
                      ) : <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>—</span>}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {t.paymentId ? (
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-3)' }}>{t.paymentId.slice(0, 14)}…</span>
                      ) : t.refId ? (
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-3)' }}>{t.refId}</span>
                      ) : <span style={{ color: 'var(--text-3)' }}>—</span>}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>{fmt(t.createdAt)}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem' }}>
                {modal.action === 'grant' ? '🌟 Grant Premium' : modal.action === 'extend' ? '📅 Extend Premium' : modal.action === 'revoke' ? '⚠️ Revoke Premium' : '🔄 Reset Downloads'}
              </h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}><X size={20} /></button>
            </div>

            <div style={{ background: 'var(--bg-3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700 }}>{modal.user.name || 'Unknown'}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>{modal.user.email}</div>
              {modal.user.premiumUntil && (
                <div style={{ fontSize: '0.78rem', marginTop: '0.25rem', color: isActive(modal.user.premiumUntil) ? '#10b981' : '#ef4444' }}>
                  Expires: {fmt(modal.user.premiumUntil)}
                </div>
              )}
            </div>

            {(modal.action === 'grant' || modal.action === 'extend') && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '0.5rem' }}>New Expiry Date</label>
                <input type="date" value={extendDate} onChange={e => setExtendDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} style={{ width: '100%' }} />
              </div>
            )}

            {modal.action === 'revoke' && (
              <div style={{ display: 'flex', gap: '0.65rem', padding: '0.85rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', marginBottom: '1.25rem' }}>
                <AlertTriangle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#f87171' }}>This immediately removes premium access and notifies the user.</p>
              </div>
            )}

            {modal.action === 'reset_downloads' && (
              <div style={{ display: 'flex', gap: '0.65rem', padding: '0.85rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', marginBottom: '1.25rem' }}>
                <Shield size={15} color="var(--primary-light)" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary-light)' }}>Resets the user&apos;s free template download count back to 0/5.</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setModal(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
              <button onClick={doAction} disabled={processing} style={{ flex: 2, padding: '0.75rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer', background: modal.action === 'revoke' ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', opacity: processing ? 0.7 : 1 }}>
                {processing ? 'Processing…' : modal.action === 'grant' ? 'Grant Access' : modal.action === 'extend' ? 'Extend Access' : modal.action === 'revoke' ? 'Revoke Access' : 'Reset Downloads'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10001 }}>
          <div style={{ background: toast.ok ? '#10b981' : '#ef4444', color: '#fff', padding: '0.85rem 1.25rem', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem', fontWeight: 600, minWidth: '260px' }}>
            {toast.ok ? <CheckCircle size={17} /> : <AlertTriangle size={17} />}
            {toast.msg}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .table-row-hover:hover { background: rgba(255,255,255,0.02) !important; }
        .btn-action-extend:hover { background: rgba(99,102,241,0.2) !important; transform: translateY(-1px); }
        .btn-action-revoke:hover { background: rgba(239,68,68,0.2) !important; transform: translateY(-1px); }
      `}</style>
    </div>
  );
}
