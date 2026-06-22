'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, GraduationCap, CheckCircle2, XCircle, Loader2, Mail, Phone, MapPin, User, Award, Compass, BarChart2, Copy, Check, ChevronDown, ChevronUp, Camera, Banknote } from 'lucide-react';

export default function AdminScholarshipPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid' | 'cash'>('all');
  const [examFilter, setExamFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<string>('date_desc');
  const [stats, setStats] = useState({ total: 0, paid: 0, unpaid: 0, cashPaid: 0 });
  const [examStats, setExamStats] = useState({ attempted: 0, avgScore: 0, maxScore: 0 });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [selectedProctorSnapshots, setSelectedProctorSnapshots] = useState<{
    studentName: string;
    snapshots: Array<{ timestamp: string; image: string }>;
  } | null>(null);

  // Mark Paid States
  const [markPaidEntry, setMarkPaidEntry] = useState<any | null>(null);
  const [markPaidPaymentId, setMarkPaidPaymentId] = useState('');
  const [markPaidOrderId, setMarkPaidOrderId] = useState('');
  const [markPaidAmount, setMarkPaidAmount] = useState('49');
  const [markPaidCouponCode, setMarkPaidCouponCode] = useState('');
  const [submittingMarkPaid, setSubmittingMarkPaid] = useState(false);
  const [markPaidError, setMarkPaidError] = useState('');

  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  const handleSendEmail = async (regNo: string) => {
    setSendingEmailId(regNo);
    try {
      const res = await fetch('/api/admin/scholarship/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNo: regNo })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send email');
      alert('Confirmation email sent successfully!');
      fetchEntries();
    } catch (err: any) {
      alert(err.message || 'Failed to send email');
    } finally {
      setSendingEmailId(null);
    }
  };

  const handleMarkPaidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!markPaidEntry) return;
    if (!markPaidPaymentId.trim()) {
      setMarkPaidError('Payment ID is required.');
      return;
    }
    setSubmittingMarkPaid(true);
    setMarkPaidError('');
    try {
      const res = await fetch('/api/admin/scholarship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationNo: markPaidEntry.registrationNo,
          paymentId: markPaidPaymentId,
          orderId: markPaidOrderId || undefined,
          amount: Number(markPaidAmount) || 49,
          couponCode: markPaidCouponCode || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update payment status');
      
      // Success! Reset states, close modal, and refresh list
      setMarkPaidEntry(null);
      setMarkPaidPaymentId('');
      setMarkPaidOrderId('');
      setMarkPaidAmount('49');
      setMarkPaidCouponCode('');
      fetchEntries();
    } catch (err: any) {
      setMarkPaidError(err.message || 'Error occurred while updating');
    } finally {
      setSubmittingMarkPaid(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = (id: string) => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(id);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = id;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.warn('Clipboard copy failed fallback used:', err);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [selectedCollector, setSelectedCollector] = useState<string>('');
  const [collectorsList, setCollectorsList] = useState<string[]>([]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/scholarship?filter=${filter}&examFilter=${examFilter}&sortBy=${sortBy}&search=${encodeURIComponent(search)}&collector=${selectedCollector}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEntries(data.entries || []);
      setStats({
        total: data.total || 0,
        paid: data.paid || 0,
        unpaid: data.unpaid || 0,
        cashPaid: data.cashPaid || 0
      });
      setExamStats({
        attempted: data.examAttemptedCount || 0,
        avgScore: data.averageScore || 0,
        maxScore: data.highestScore || 0
      });
      setCollectorsList(data.collectors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [filter, examFilter, sortBy, selectedCollector]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEntries();
  };

  const handleExport = () => {
    window.open(`/api/admin/scholarship?filter=${filter}&examFilter=${examFilter}&sortBy=${sortBy}&search=${encodeURIComponent(search)}&collector=${selectedCollector}&export=xlsx`, '_blank');
  };

  return (
    <div className="anim-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap color="var(--primary)" size={28} /> Scholarship Test Command Center
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Manage registrations, monitor live exam responses, and review results</p>
        </div>
        <button onClick={handleExport} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={16} /> Export Registrations (Excel)
        </button>
      </div>

      {/* Stats Summary Card Grid */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="card card-p">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Total Registered</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-1)', marginTop: '0.25rem' }}>{stats.total}</div>
        </div>
        <div className="card card-p" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Paid Fee</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--success)', marginTop: '0.25rem' }}>{stats.paid}</div>
        </div>
        <div className="card card-p" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Pending Payment</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--warning)', marginTop: '0.25rem' }}>{stats.unpaid}</div>
        </div>
        <div className="card card-p" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Exams Taken</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)', marginTop: '0.25rem' }}>{examStats.attempted}</div>
        </div>
        <div className="card card-p" style={{ borderLeft: '4px solid #a855f7' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Avg / Max Score</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#a855f7', marginTop: '0.25rem', display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
            <span>{examStats.avgScore.toFixed(1)}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontWeight: 'normal' }}>/</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{examStats.maxScore.toFixed(1)}</span>
          </div>
        </div>
        <div className="card card-p" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 700 }}>💵 Cash Paid</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981', marginTop: '0.25rem' }}>{stats.cashPaid}</div>
        </div>
      </div>

      {/* Advanced Search & Filter Controls */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          
          {/* Filter Group */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
            
            {/* Payment Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fee:</span>
              <div style={{ display: 'flex', background: 'var(--bg-3)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                {(['all', 'paid', 'unpaid', 'cash'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilter(option);
                      if (option !== 'cash') {
                        setSelectedCollector('');
                      }
                    }}
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.72rem',
                      height: 'auto',
                      borderRadius: '6px',
                      background: filter === option ? (option === 'cash' ? 'rgba(16,185,129,0.15)' : 'var(--bg-2)') : 'transparent',
                      color: filter === option ? (option === 'cash' ? '#10b981' : 'var(--text-1)') : 'var(--text-3)',
                      boxShadow: filter === option ? 'var(--shadow)' : 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {option === 'cash' ? '💵 CASH' : option.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Collected By Filter (Only visible when filter === 'cash') */}
            {filter === 'cash' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', animation: 'slideDown 0.2s ease forwards' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Collected By:</span>
                <select
                  value={selectedCollector}
                  onChange={e => setSelectedCollector(e.target.value)}
                  style={{
                    height: '34px',
                    padding: '0 1.75rem 0 0.75rem',
                    fontSize: '0.75rem',
                    borderRadius: '8px',
                    background: 'var(--bg-3)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    color: '#10b981',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <option value="" style={{ color: 'var(--text-2)' }}>All Admins</option>
                  {collectorsList.map(name => (
                    <option key={name} value={name} style={{ color: 'var(--text-2)' }}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Exam Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exam:</span>
              <div style={{ display: 'flex', background: 'var(--bg-3)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                {(['all', 'completed', 'pending'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => setExamFilter(option)}
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.72rem',
                      height: 'auto',
                      borderRadius: '6px',
                      background: examFilter === option ? 'var(--bg-2)' : 'transparent',
                      color: examFilter === option ? 'var(--text-1)' : 'var(--text-3)',
                      boxShadow: examFilter === option ? 'var(--shadow)' : 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {option === 'all' ? 'ALL' : option === 'completed' ? 'TAKEN' : 'PENDING'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort:</span>
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                style={{ height: '34px', padding: '0 1.75rem 0 0.75rem', fontSize: '0.75rem', borderRadius: '8px', background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="score_desc">Merit Rank (Highest Score First)</option>
                <option value="score_asc">Lowest Score First</option>
                <option value="name_asc">Name (A-Z)</option>
              </select>
            </div>

          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '320px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
              <input 
                type="text" 
                placeholder="Search candidate, mobile, email..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.3rem', width: '100%', height: '36px', fontSize: '0.78rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text-1)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '36px', padding: '0 1rem', fontSize: '0.78rem', borderRadius: '8px' }}>Search</button>
          </form>

        </div>
      </div>

      {/* Entries List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Loader2 className="animate-spin" size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Loading registrations...</p>
        </div>
      ) : entries.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {entries.map((entry) => {
            const getRankBadgeStyle = (rank: number) => {
              if (rank === 1) return { background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: '#000', shadow: 'rgba(217, 119, 6, 0.25)' };
              if (rank === 2) return { background: 'linear-gradient(135deg, #cbd5e1 0%, #64748b 100%)', color: '#000', shadow: 'rgba(100, 116, 139, 0.25)' };
              if (rank === 3) return { background: 'linear-gradient(135deg, #fed7aa 0%, #ea580c 100%)', color: '#fff', shadow: 'rgba(234, 88, 12, 0.25)' };
              return { background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)', shadow: 'none' };
            };
            const rankStyle = entry.rank ? getRankBadgeStyle(entry.rank) : null;

            return (
              <div key={entry.id} className="candidate-card" style={{ padding: 0 }}>
                {/* Status Indicator Bar */}
                <div className="candidate-card-glow" style={{
                  background: entry.paymentStatus === 'PAID' ? 'var(--success)' : 'var(--warning)',
                  boxShadow: entry.paymentStatus === 'PAID' ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(245, 158, 11, 0.5)',
                  zIndex: 10
                }} />

                {/* Collapsed Header */}
                <div 
                  className="candidate-header"
                  onClick={() => toggleExpand(entry.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.5rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    position: 'relative'
                  }}
                >
                  {/* Left Side: Avatar, Name, Reg ID */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '220px' }}>
                    {entry.passportImage ? (
                      <img 
                        src={entry.passportImage} 
                        alt="Passport" 
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          objectFit: 'cover', 
                          borderRadius: '8px', 
                          border: '1px solid rgba(255, 255, 255, 0.1)' 
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const w = window.open();
                          if (w) {
                            w.document.write(`<div style="display:flex; justify-content:center; align-items:center; height:100vh; background:#0f172a;"><img src="${entry.passportImage}" style="max-width:90%; max-height:90vh; border-radius:12px; box-shadow:0 20px 50px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1);" /></div>`);
                            w.document.title = `${entry.name} - Passport Photo`;
                            w.document.body.style.margin = '0';
                          }
                        }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="var(--text-3)" />
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-1)' }}>{entry.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--primary-light)', fontFamily: 'monospace', background: 'rgba(99, 102, 241, 0.08)', padding: '0.05rem 0.3rem', borderRadius: '3px' }}>
                          {entry.registrationNo}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(entry.registrationNo);
                          }}
                          className="copy-btn btn-ghost"
                          style={{ padding: '0.1rem', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          {copiedId === entry.registrationNo ? (
                            <Check size={10} color="var(--success)" />
                          ) : (
                            <Copy size={10} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Middle Left: Location & Qual brief */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={12} style={{ color: 'var(--primary-light)' }} /> {entry.district}, {entry.state}
                    </span>
                    <span>
                      Qual: <strong style={{ color: 'var(--text-1)' }}>{entry.lastQualification}</strong> ({entry.marksPercent}%)
                    </span>
                  </div>

                  {/* Middle Right: Exam brief */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {entry.examSubmitted ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                          Score: <strong style={{ color: 'var(--success)' }}>{entry.examScore}</strong>
                        </span>
                        {entry.rank && rankStyle && (
                          <span style={{ 
                            fontSize: '0.68rem', 
                            fontWeight: 800, 
                            background: rankStyle.background, 
                            color: rankStyle.color, 
                            padding: '0.15rem 0.45rem', 
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.1rem'
                          }}>
                            {entry.rank === 1 ? '👑 Rank #1' : entry.rank === 2 ? '🥈 Rank #2' : entry.rank === 3 ? '🥉 Rank #3' : `Rank #${entry.rank}`}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontStyle: 'italic' }}>
                        Exam Pending
                      </span>
                    )}

                    {entry.proctorSnapshots && (() => {
                      try {
                        const snaps = JSON.parse(entry.proctorSnapshots);
                        if (snaps && snaps.length > 0) {
                          return (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProctorSnapshots({
                                  studentName: entry.name,
                                  snapshots: snaps
                                });
                              }}
                              style={{
                                background: 'rgba(99,102,241,0.12)',
                                border: '1px solid rgba(99,102,241,0.25)',
                                borderRadius: '6px',
                                color: 'var(--primary-light)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'var(--transition)'
                              }}
                              title="View exam proctoring snapshots"
                            >
                              <Camera size={12} />
                              <span>{snaps.length}</span>
                            </button>
                          );
                        }
                      } catch (err) {
                        return null;
                      }
                      return null;
                    })()}
                  </div>

                  {/* Right Side: Payment status & Chevron */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {entry.paymentStatus === 'PAID' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          color: '#34d399', 
                          background: 'rgba(16, 185, 129, 0.08)', 
                          padding: '0.15rem 0.4rem', 
                          borderRadius: '4px', 
                          fontWeight: 800,
                          fontSize: '0.68rem',
                          border: '1px solid rgba(16, 185, 129, 0.15)'
                        }}>
                          PAID
                        </span>
                        {entry.emailSent ? (
                          <span style={{ 
                            color: '#34d399', 
                            background: 'rgba(16, 185, 129, 0.08)', 
                            padding: '0.15rem 0.4rem', 
                            borderRadius: '4px', 
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            border: '1px solid rgba(16, 185, 129, 0.15)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }} title="Confirmation email sent successfully">
                            <span>Email Sent</span>
                            <span>✓</span>
                          </span>
                        ) : (
                          <span style={{ 
                            color: '#fb923c', 
                            background: 'rgba(249, 115, 22, 0.08)', 
                            padding: '0.15rem 0.4rem', 
                            borderRadius: '4px', 
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            border: '1px solid rgba(249, 115, 22, 0.15)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }} title="Confirmation email not sent yet">
                            <span>Email Pending</span>
                            <span>✉</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ 
                        color: '#fbbf24', 
                        background: 'rgba(245, 158, 11, 0.08)', 
                        padding: '0.15rem 0.45rem', 
                        borderRadius: '4px', 
                        fontWeight: 800,
                        fontSize: '0.68rem',
                        border: '1px solid rgba(245, 158, 11, 0.15)'
                      }}>
                        UNPAID
                      </span>
                    )}

                    <div style={{ color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}>
                      {expandedCards[entry.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {expandedCards[entry.id] && (
                  <div style={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                    background: 'rgba(0, 0, 0, 0.1)',
                    animation: 'slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
                      
                      {/* Column 1: Contact details */}
                      <div className="candidate-card-col">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                          <User size={13} color="var(--primary-light)" /> Contact Details
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={entry.email}>
                            <Mail size={13} style={{ color: 'var(--primary-light)', flexShrink: 0 }} /> 
                            <span>{entry.email}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Phone size={13} style={{ color: 'var(--primary-light)', flexShrink: 0 }} /> 
                            <span>{entry.mobile}</span>
                          </div>
                          {entry.fatherName && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <span style={{ fontSize: '0.75rem', flexShrink: 0 }}>👨</span> 
                              <span style={{ color: 'var(--text-3)' }}>Father:</span> <strong style={{ fontWeight: 600 }}>{entry.fatherName}</strong>
                            </div>
                          )}
                          {entry.aadharNo && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', flexShrink: 0 }}>💳</span> 
                              <span style={{ color: 'var(--text-3)' }}>Aadhar:</span> <strong style={{ fontWeight: 600 }}>{entry.aadharNo}</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Column 2: Career Goal */}
                      <div className="candidate-card-col">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                          <Compass size={13} color="var(--primary-light)" /> Career Goal
                        </div>
                        <div className="goal-quote" style={{ flex: 1 }}>
                          {entry.careerGoal && entry.careerGoal !== 'na' ? `"${entry.careerGoal}"` : 'No career goal specified.'}
                        </div>
                      </div>

                      {/* Column 3: Exam Analysis */}
                      <div className="candidate-card-col">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                          <BarChart2 size={13} color="var(--primary-light)" /> Exam Performance
                        </div>
                        {entry.examSubmitted ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.04)',
                              borderRadius: '8px',
                              padding: '0.5rem',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(3, 1fr)',
                              gap: '0.4rem',
                              textAlign: 'center',
                              fontSize: '0.72rem'
                            }}>
                              <div>
                                <div style={{ color: 'var(--text-3)', fontSize: '0.62rem' }}>Attempted</div>
                                <strong style={{ color: 'var(--text-2)' }}>{entry.examAttempted}</strong>
                              </div>
                              <div>
                                <div style={{ color: 'var(--success)', fontSize: '0.62rem' }}>Correct</div>
                                <strong style={{ color: 'var(--success)' }}>{entry.examCorrect}</strong>
                              </div>
                              <div>
                                <div style={{ color: 'var(--danger)', fontSize: '0.62rem' }}>Wrong</div>
                                <strong style={{ color: 'var(--danger)' }}>{entry.examWrong}</strong>
                              </div>
                            </div>

                            <div className="exam-pill-row" style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '0.65rem',
                              color: 'var(--text-3)',
                              borderTop: '1px dashed rgba(255, 255, 255, 0.06)',
                              paddingTop: '0.4rem',
                              gap: '0.25rem'
                            }}>
                              <div>Reason: <strong style={{ color: 'var(--text-2)' }}>{entry.examReasoningScore}</strong></div>
                              <div>Math: <strong style={{ color: 'var(--text-2)' }}>{entry.examMathScore}</strong></div>
                              <div>CA: <strong style={{ color: 'var(--text-2)' }}>{entry.examCaScore}</strong></div>
                            </div>
                          </div>
                        ) : (
                          <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255, 255, 255, 0.01)',
                            border: '1px dashed rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '0.75rem',
                            textAlign: 'center',
                            color: 'var(--text-3)',
                            gap: '0.2rem',
                            minHeight: '80px'
                          }}>
                            <div style={{ fontSize: '1.1rem' }}>⏳</div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Exam Pending</span>
                          </div>
                        )}
                      </div>

                      {/* Column 4: Registration & Transaction Info */}
                      <div className="candidate-card-col">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                          <CheckCircle2 size={13} color="var(--primary-light)" /> Registration & Fee
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-2)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-3)' }}>Status:</span>
                            {entry.paymentStatus === 'PAID' ? (
                              <span style={{ 
                                color: '#34d399', 
                                background: 'rgba(16, 185, 129, 0.1)', 
                                padding: '0.15rem 0.45rem', 
                                borderRadius: '4px', 
                                fontWeight: 800,
                                border: '1px solid rgba(16, 185, 129, 0.2)'
                              }}>
                                PAID
                              </span>
                            ) : (
                              <span style={{ 
                                color: '#fbbf24', 
                                background: 'rgba(245, 158, 11, 0.1)', 
                                padding: '0.15rem 0.45rem', 
                                borderRadius: '4px', 
                                fontWeight: 800,
                                border: '1px solid rgba(245, 158, 11, 0.2)'
                              }}>
                                UNPAID
                              </span>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-3)' }}>Reg. Date:</span>
                            <strong>{new Date(entry.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                          </div>

                          {entry.paymentStatus !== 'PAID' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMarkPaidEntry(entry);
                                setMarkPaidError('');
                              }}
                              className="btn btn-primary"
                              style={{
                                marginTop: '0.65rem',
                                width: '100%',
                                padding: '0.4rem 0.6rem',
                                fontSize: '0.72rem',
                                height: 'auto',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.3rem',
                                cursor: 'pointer'
                              }}
                            >
                              <CheckCircle2 size={12} />
                              Mark Online Paid
                            </button>
                          )}

                          {entry.paymentStatus === 'PAID' && (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-3)' }}>Fee Paid:</span>
                                <strong>₹{entry.amount}</strong>
                              </div>
                              {entry.paymentId?.startsWith('CASH_') && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ color: 'var(--text-3)' }}>Mode:</span>
                                  <span style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '0.3rem',
                                    color: '#10b981', 
                                    background: 'rgba(16, 185, 129, 0.1)', 
                                    padding: '0.1rem 0.45rem', 
                                    borderRadius: '4px', 
                                    fontWeight: 700,
                                    fontSize: '0.72rem',
                                    border: '1px solid rgba(16, 185, 129, 0.2)'
                                  }}>
                                    <Banknote size={12} /> Cash
                                  </span>
                                </div>
                              )}
                              {entry.cashCollectedBy && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ color: 'var(--text-3)' }}>Collected By:</span>
                                  <span style={{ 
                                    color: '#a78bfa', 
                                    fontWeight: 700, 
                                    fontSize: '0.75rem',
                                    background: 'rgba(167, 139, 250, 0.08)',
                                    padding: '0.1rem 0.4rem',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(167, 139, 250, 0.15)'
                                  }}>
                                    {entry.cashCollectedBy}
                                  </span>
                                </div>
                              )}
                              {entry.couponCode && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ color: 'var(--text-3)' }}>Coupon:</span>
                                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>{entry.couponCode}</span>
                                </div>
                              )}
                              
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  await handleSendEmail(entry.registrationNo);
                                }}
                                disabled={sendingEmailId === entry.registrationNo}
                                className="btn btn-outline"
                                style={{
                                  marginTop: '0.65rem',
                                  width: '100%',
                                  padding: '0.4rem 0.6rem',
                                  fontSize: '0.72rem',
                                  height: 'auto',
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.3rem',
                                  cursor: 'pointer'
                                }}
                              >
                                {sendingEmailId === entry.registrationNo ? (
                                  <>
                                    <Loader2 className="animate-spin" size={12} />
                                    <span>Sending...</span>
                                  </>
                                ) : (
                                  <>
                                    <Mail size={12} />
                                    <span>{entry.emailSent ? 'Resend Confirmation Email' : 'Send Confirmation Email'}</span>
                                  </>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text-3)', margin: 0, fontSize: '0.88rem' }}>No registrations found.</p>
        </div>
      )}

      {/* PROCTOR SNAPSHOTS MODAL */}
      {selectedProctorSnapshots && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 11000,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div className="card" style={{
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            overflowY: 'auto',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            backgroundColor: '#0f172a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Proctoring Snapshots</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>Candidate: <strong>{selectedProctorSnapshots.studentName}</strong></p>
              </div>
              <button
                onClick={() => setSelectedProctorSnapshots(null)}
                className="btn btn-ghost"
                style={{ minWidth: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.75rem', height: 'auto' }}
              >
                Close
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: '1rem',
              overflowY: 'auto',
              maxHeight: '60vh',
              padding: '0.25rem'
            }}>
              {selectedProctorSnapshots.snapshots.map((snap, idx) => (
                <div key={idx} style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ position: 'relative', width: '100%', paddingTop: '75%', backgroundColor: '#000' }}>
                    <img
                      src={snap.image}
                      alt={`Snapshot ${idx + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        const w = window.open();
                        if (w) {
                          w.document.write(`<div style="display:flex; justify-content:center; align-items:center; height:100vh; background:#0f172a;"><img src="${snap.image}" style="max-width:90%; max-height:90vh; border-radius:12px; box-shadow:0 20px 50px rgba(0,0,0,0.6);" /></div>`);
                          w.document.title = `${selectedProctorSnapshots.studentName} - Snapshot #${idx + 1}`;
                          w.document.body.style.margin = '0';
                        }
                      }}
                    />
                  </div>
                  <div style={{ padding: '0.55rem', fontSize: '0.7rem', color: 'var(--text-3)', textAlign: 'center', borderTop: '1px solid var(--border)', fontWeight: 600 }}>
                    {new Date(snap.timestamp).toLocaleString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MARK ONLINE PAID MODAL */}
      {markPaidEntry && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 11000,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div className="card" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            backgroundColor: '#0f172a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-1)' }}>Mark Online Paid (Razorpay)</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>
                  Candidate: <strong>{markPaidEntry.name}</strong> ({markPaidEntry.registrationNo})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMarkPaidEntry(null)}
                className="btn btn-ghost"
                style={{ minWidth: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.75rem', height: 'auto' }}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleMarkPaidSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-2)' }}>Razorpay Payment ID *</label>
                <input 
                  type="text" 
                  value={markPaidPaymentId} 
                  onChange={e => setMarkPaidPaymentId(e.target.value)} 
                  placeholder="e.g. pay_P1rW3d8z7x3y2a" 
                  required 
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    background: 'var(--bg-3)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-1)',
                    marginTop: '0.25rem'
                  }}
                />
              </div>

              <div className="input-group">
                <label className="label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-2)' }}>Razorpay Order ID (Optional)</label>
                <input 
                  type="text" 
                  value={markPaidOrderId} 
                  onChange={e => setMarkPaidOrderId(e.target.value)} 
                  placeholder="e.g. order_P1rV9a4b2c1d3e" 
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    background: 'var(--bg-3)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-1)',
                    marginTop: '0.25rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-2)' }}>Amount Paid (₹) *</label>
                  <input 
                    type="number" 
                    value={markPaidAmount} 
                    onChange={e => setMarkPaidAmount(e.target.value)} 
                    placeholder="49" 
                    required 
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      background: 'var(--bg-3)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-1)',
                      marginTop: '0.25rem'
                    }}
                  />
                </div>
                <div className="input-group">
                  <label className="label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-2)' }}>Coupon Used (Optional)</label>
                  <input 
                    type="text" 
                    value={markPaidCouponCode} 
                    onChange={e => setMarkPaidCouponCode(e.target.value.toUpperCase())} 
                    placeholder="e.g. IND50" 
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      background: 'var(--bg-3)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-1)',
                      marginTop: '0.25rem',
                      textTransform: 'uppercase'
                    }}
                  />
                </div>
              </div>

              {markPaidError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                  ⚠️ {markPaidError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={submittingMarkPaid || !markPaidPaymentId.trim()}
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  justifyContent: 'center', 
                  marginTop: '0.75rem', 
                  padding: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {submittingMarkPaid ? <Loader2 className="animate-spin" size={16} /> : 'Confirm Payment & Mark Paid'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .candidate-card {
          display: flex;
          flex-direction: column;
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 16px !important;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative;
          overflow: hidden;
        }
        .candidate-card:hover {
          border-color: rgba(99, 102, 241, 0.3) !important;
          box-shadow: 0 12px 40px -12px rgba(99, 102, 241, 0.15) !important;
        }
        .candidate-card-glow {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          transition: all 0.3s ease;
        }
        .candidate-card:hover .candidate-card-glow {
          width: 6px;
        }
        .candidate-header:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .candidate-card-col {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .candidate-card-col + .candidate-card-col {
          border-left: 1px solid rgba(255, 255, 255, 0.04);
          padding-left: 1.5rem;
        }
        @media (max-width: 1024px) {
          .candidate-header {
            flex-wrap: wrap !important;
          }
          .candidate-card-col + .candidate-card-col {
            border-left: none;
            padding-left: 0;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 800px;
          }
        }
        .avatar-hover {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .avatar-hover:hover {
          transform: scale(1.05);
        }
        .copy-btn {
          opacity: 0.5;
          transition: all 0.2s;
        }
        .copy-btn:hover {
          opacity: 1;
          color: var(--primary-light);
        }
        .goal-quote {
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
          font-size: 0.78rem;
          color: var(--text-2);
          line-height: 1.45;
          max-height: 110px;
          overflow-y: auto;
          scrollbar-width: thin;
        }
         .exam-pill-row > div {
          background: rgba(255, 255, 255, 0.02);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
