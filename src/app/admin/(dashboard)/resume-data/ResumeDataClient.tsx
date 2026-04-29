'use client';

import React, { useState, useEffect } from 'react';
import { Download, Search, FileText, Calendar, User, Phone, Mail, Hash } from 'lucide-react';
import * as XLSX from 'xlsx';

type Purchase = {
  id: string;
  templateId: string;
  amount: number;
  status: string;
  couponCode: string | null;
  orderId: string | null;
  paymentId: string | null;
  refId: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
    studentProfile?: {
      phone: string | null;
    }
  };
  template: {
    name: string;
  };
};

export default function ResumeDataClient() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '365D' | 'ALL' | 'CUSTOM'>('30D');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/resume-purchases';
      const params = new URLSearchParams();

      if (timeRange !== 'ALL') {
        const now = new Date();
        let fromDate = new Date();

        if (timeRange === '7D') fromDate.setDate(now.getDate() - 7);
        else if (timeRange === '30D') fromDate.setDate(now.getDate() - 30);
        else if (timeRange === '365D') fromDate.setDate(now.getDate() - 365);
        else if (timeRange === 'CUSTOM' && customFrom) fromDate = new Date(customFrom);

        if (timeRange !== 'CUSTOM' || customFrom) {
          params.append('from', fromDate.toISOString());
        }
        
        if (timeRange === 'CUSTOM' && customTo) {
          params.append('to', new Date(customTo).toISOString());
        }
      }

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPurchases(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(fetchPurchases, 0);
  }, [timeRange, customFrom, customTo]);

  const exportToExcel = () => {
    const dataToExport = filteredPurchases.map(p => ({
      'Date & Time': new Date(p.createdAt).toLocaleString(),
      'Student Name': p.user.name || 'N/A',
      'Email': p.user.email,
      'Contact No': p.user.studentProfile?.phone || 'N/A',
      'Template': p.template?.name || p.templateId,
      'Price': `₹${p.amount}`,
      'Coupon Used': p.couponCode || 'None',
      'Payment Status': p.status,
      'Razorpay Order ID': p.orderId || 'N/A',
      'Razorpay Payment ID': p.paymentId || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resume Purchases');
    
    // Generate filename based on active filters
    const dateStr = new Date().toISOString().split('T')[0];
    const rangeStr = timeRange === 'CUSTOM' ? `Custom_${customFrom}_to_${customTo}` : timeRange;
    const filename = `Resume_Purchases_${rangeStr}_${dateStr}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  const filteredPurchases = purchases.filter(p => 
    p.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.couponCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.refId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page anim-fade-up" style={{ color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#fff', marginBottom: '0.25rem' }}>Resume Purchase Records</h2>
          <p style={{ color: '#94a3b8', margin: 0 }}>Detailed log of all template transactions and downloads.</p>
        </div>
        <button 
          onClick={exportToExcel} 
          disabled={loading || purchases.length === 0}
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#10b981', borderColor: '#10b981', color: '#fff', fontWeight: 700 }}
        >
          <Download size={18} /> Export to XLSX
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', background: '#1e293b', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: '7D', label: '7 Days' },
              { id: '30D', label: '30 Days' },
              { id: '365D', label: '1 Year' },
              { id: 'ALL', label: 'Lifetime' },
              { id: 'CUSTOM', label: 'Custom' },
            ].map((t: any) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  background: timeRange === t.id ? '#6366f1' : '#0f172a',
                  color: timeRange === t.id ? '#fff' : '#94a3b8',
                  border: `1px solid ${timeRange === t.id ? '#6366f1' : '#334155'}`,
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(16,185,129,0.1)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Total Records:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>{filteredPurchases.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(99,102,241,0.1)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Total Revenue:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#818cf8' }}>₹{filteredPurchases.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {timeRange === 'CUSTOM' && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', padding: '1rem', background: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: 700, textTransform: 'uppercase' }}>From Date</label>
              <input 
                type="date" 
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', outline: 'none' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: 700, textTransform: 'uppercase' }}>To Date</label>
              <input 
                type="date" 
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', outline: 'none' }}
              />
            </div>
          </div>
        )}

        <div style={{ position: 'relative', marginTop: '1.25rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search within these results..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: '#fff', outline: 'none' }}
          />
        </div>
      </div>

      <div className="card table-wrap" style={{ background: '#1e293b', border: '1px solid #334155', overflowX: 'auto', maxHeight: '70vh', overflowY: 'auto' }}>
        <table style={{ minWidth: '1200px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Student</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Contact Info</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Template</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Price</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Coupon</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Transaction IDs</th>
              <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                  Loading records...
                </td>
              </tr>
            ) : filteredPurchases.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>No purchase records found.</td>
              </tr>
            ) : (
              filteredPurchases.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{p.user.name || 'Anonymous'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }} title="Reference ID for this transaction">REF: {p.refId || p.id.slice(-6).toUpperCase()}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f8fafc', fontSize: '0.85rem' }}>
                      <Mail size={14} color="#10b981" /> {p.user.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: 600 }}>
                      <Phone size={14} /> {p.user.studentProfile?.phone || 'No Contact'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#818cf8' }}>
                      <FileText size={16} /> {p.template?.name || p.templateId}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 900, color: '#fff', fontSize: '1.1rem' }}>₹{p.amount}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {p.couponCode ? (
                      <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(16,185,129,0.2)' }}>
                        {p.couponCode}
                      </span>
                    ) : (
                      <span style={{ color: '#475569', fontSize: '0.75rem' }}>None</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div>Order: <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{p.orderId || 'FREE'}</span></div>
                      <div>Paid: <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{p.paymentId || 'N/A'}</span></div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
