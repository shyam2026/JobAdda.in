'use client';

import React, { useState, useEffect } from 'react';
import { IndianRupee, Clock, Phone, CheckCircle, XCircle, Loader2, Search, Hash, Mail, Landmark, CreditCard, Building2, Copy, Check, ArrowRightCircle, Download } from 'lucide-react';
import { format } from "date-fns";
import * as XLSX from 'xlsx';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/admin/transactions-list');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (pendingRequests.length === 0) return;

    const dataToExport = pendingRequests.map(tx => {
      let bankInfo = { name: '', acc: '', ifsc: '' };
      if (tx.note && tx.note.includes('|')) {
        const parts = tx.note.split('|');
        bankInfo.name = parts[0]?.replace('BANK:', '').trim() || '';
        bankInfo.acc = parts[1]?.replace('ACC:', '').trim() || '';
        bankInfo.ifsc = parts[2]?.replace('IFSC:', '').trim() || '';
      }

      return {
        "Student Name": tx.user.name || 'Anonymous',
        "Email": tx.user.email,
        "Phone": tx.user.phone || 'N/A',
        "Referral Code": tx.user.referralCode,
        "Amount (INR)": Math.abs(tx.amount),
        "Bank Name": bankInfo.name,
        "Account Number": bankInfo.acc || tx.note,
        "IFSC Code": bankInfo.ifsc,
        "Request Date": format(new Date(tx.createdAt), 'yyyy-MM-dd HH:mm'),
        "Status": tx.status
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Withdrawals");
    XLSX.writeFile(workbook, `Withdraw_Requests_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateStatus = async (id: string, status: 'COMPLETED' | 'REJECTED') => {
    const action = status === 'COMPLETED' ? 'approve and mark as paid' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this withdrawal?`)) return;

    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status } : tx));
    } catch (err) {
      alert("Error processing transaction. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = transactions.filter(tx => 
    tx.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.user.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = filtered.filter(tx => tx.status === 'PENDING' && tx.type === 'WITHDRAWAL');
  const settledData = filtered.filter(tx => tx.status !== 'PENDING' || tx.type !== 'WITHDRAWAL');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-3)' }}>
        <Loader2 className="spin" size={32} />
        <span style={{ marginLeft: '1rem' }}>Loading Transactions...</span>
      </div>
    );
  }

  return (
    <div className="admin-page anim-fade-up">
      <div className="flex-between" style={{ marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
            Payout <span className="text-gradient">Manager</span>
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '1.1rem' }}>Efficiently handle withdrawals and track financial history.</p>
        </div>
        
        <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
          <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input 
            placeholder="Search student or transaction..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ 
              paddingLeft: '3.5rem', 
              borderRadius: '16px', 
              background: '#0f172a', 
              border: '1px solid #334155',
              height: '56px',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      {/* Section 1: New Withdraw Requests */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRightCircle size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>New Withdraw Requests</h2>
            <span className="badge badge-warning" style={{ borderRadius: '20px', padding: '0.25rem 0.75rem' }}>{pendingRequests.length}</span>
          </div>
          {pendingRequests.length > 0 && (
            <button 
              onClick={exportToExcel}
              className="btn btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', borderColor: 'rgba(16,185,129,0.2)' }}
            >
              <Download size={16} /> Download Excel
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {pendingRequests.length === 0 ? (
            <div className="card" style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed #334155' }}>
              <CheckCircle size={40} style={{ color: 'var(--success)', marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{ color: '#94a3b8' }}>All Caught Up!</h3>
              <p style={{ color: '#64748b' }}>No pending withdrawal requests at the moment.</p>
            </div>
          ) : (
            pendingRequests.map(tx => <TransactionCard key={tx.id} tx={tx} onUpdate={handleUpdateStatus} onCopy={handleCopy} copiedId={copiedId} processingId={processingId} />)
          )}
        </div>
      </div>

      {/* Section 2: Settled Data */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={20} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>Settled Data</h2>
          <span className="badge badge-muted" style={{ borderRadius: '20px', padding: '0.25rem 0.75rem' }}>{settledData.length}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {settledData.length === 0 ? (
            <div className="card" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
              No settled transactions found.
            </div>
          ) : (
            settledData.map(tx => <TransactionCard key={tx.id} tx={tx} onUpdate={handleUpdateStatus} onCopy={handleCopy} copiedId={copiedId} processingId={processingId} isSettled />)
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .text-gradient { background: linear-gradient(135deg, #6366f1, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

function TransactionCard({ tx, onUpdate, onCopy, copiedId, processingId, isSettled }: any) {
  const isPending = tx.status === 'PENDING';
  const isWithdrawal = tx.type === 'WITHDRAWAL';
  
  // Parse bank info
  let bankInfo = { name: '', acc: '', ifsc: '' };
  if (tx.note && tx.note.includes('|')) {
    const parts = tx.note.split('|');
    bankInfo.name = parts[0]?.replace('BANK:', '').trim() || '';
    bankInfo.acc = parts[1]?.replace('ACC:', '').trim() || '';
    bankInfo.ifsc = parts[2]?.replace('IFSC:', '').trim() || '';
  }

  return (
    <div className="card anim-fade-up" style={{ 
      padding: '0', 
      background: isSettled ? 'rgba(15,23,42,0.6)' : '#0f172a',
      border: isPending ? '1px solid #f59e0b' : '1px solid #1e293b',
      boxShadow: isPending ? '0 10px 30px -10px rgba(245,158,11,0.1)' : 'none',
      overflow: 'hidden',
      borderRadius: '16px',
      opacity: isSettled ? 0.85 : 1
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isSettled ? '1fr 180px 1fr 180px' : '300px 200px 1fr 240px', 
        minHeight: isSettled ? '80px' : '120px'
      }}>
        
        {/* User Info (No image placeholder) */}
        <div style={{ padding: '1.25rem 1.5rem', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontWeight: '800', fontSize: '1rem', color: 'white', marginBottom: '0.35rem' }}>
            {tx.user.name || 'Anonymous'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={10} /> {tx.user.email}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={10} /> {tx.user.phone || 'N/A'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: '700', marginTop: '0.2rem' }}>
              #{tx.user.referralCode}
            </div>
          </div>
        </div>

        {/* Amount & Date */}
        <div style={{ padding: '1.25rem 1.5rem', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: isWithdrawal ? '#ef4444' : '#10b981', lineHeight: 1 }}>
            ₹{Math.abs(tx.amount)}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={10} /> {format(new Date(tx.createdAt), 'MMM dd, HH:mm')}
          </div>
        </div>

        {/* Beneficiary Details */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center' }}>
          {isWithdrawal && tx.note ? (
            <div style={{ width: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>
                  <Building2 size={12} style={{ display: 'inline', marginRight: '4px' }} /> {bankInfo.name || 'N/A'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>
                  <Landmark size={12} style={{ display: 'inline', marginRight: '4px' }} /> {bankInfo.ifsc || 'N/A'}
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <CreditCard size={12} style={{ color: '#475569' }} />
                  <span style={{ fontSize: '0.95rem', color: 'white', fontWeight: '800', letterSpacing: '0.05em', fontFamily: 'monospace', flex: 1 }}>
                    {bankInfo.acc || tx.note}
                  </span>
                  {!isSettled && (
                    <button 
                      onClick={() => onCopy(bankInfo.acc || tx.note, tx.id)}
                      style={{ background: 'transparent', border: 'none', color: copiedId === tx.id ? '#10b981' : '#475569', cursor: 'pointer' }}
                    >
                      {copiedId === tx.id ? <CheckCircle size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: '#475569', fontSize: '0.8rem', fontStyle: 'italic' }}>
              {tx.type} Bonus
            </div>
          )}
        </div>

        {/* Actions or Status */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: '0.5rem' }}>
          {isSettled ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge ${tx.status === 'COMPLETED' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.4rem 1rem', fontSize: '0.7rem' }}>
                {tx.status}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <button 
                onClick={() => onUpdate(tx.id, 'REJECTED')}
                disabled={processingId === tx.id}
                className="btn btn-outline" 
                style={{ flex: 1, padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)', fontSize: '0.8rem' }}
              >
                Reject
              </button>
              <button 
                onClick={() => onUpdate(tx.id, 'COMPLETED')}
                disabled={processingId === tx.id}
                className="btn btn-primary" 
                style={{ flex: 2, padding: '0.5rem', background: '#10b981', border: 'none', fontSize: '0.8rem', fontWeight: '700' }}
              >
                Approve
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
