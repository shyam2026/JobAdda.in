'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Gift, Wallet, CheckCircle, Share2, MessageCircle, MessageSquare, Lock } from 'lucide-react';

const HOW_STEPS = [
  { n: '1', title: 'Share Link', desc: 'Send your link to friends.' },
  { n: '2', title: 'Friend Joins', desc: 'They sign up on JobAdda.' },
  { n: '3', title: 'Earn up to ₹50', desc: 'Bonus when they apply.' },
];

interface WalletData {
  balance: number;
  referralCode: string;
  transactions: Array<{
    id: string;
    amount: number;
    type: string;
    status: string;
    createdAt: string;
  }>;
  referredUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    createdAt: string;
    applications: { id: string }[];
    earnedAmount: number | null;
  }>;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function UserReferPage() {
  const [copied, setCopied] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('0');
  const [bankName, setBankName] = useState('');
  const [accNo, setAccNo] = useState('');
  const [confirmAccNo, setConfirmAccNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [confirmIfsc, setConfirmIfsc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [showAllReferrals, setShowAllReferrals] = useState(false);
  const [showAllWithdrawals, setShowAllWithdrawals] = useState(false);
  const [historyTab, setHistoryTab] = useState<'withdrawals' | 'earnings'>('withdrawals');

  useEffect(() => {
    fetch('/api/wallet')
      .then(r => r.json())
      .then(data => { 
         setWalletData(data); 
         setLoading(false); 
         if (data.balance) setWithdrawAmount(data.balance.toString());
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    if (!walletData?.referralCode) return;
    const link = `${window.location.origin}/register?ref=${walletData.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showConfirmStep) {
      if (accNo !== confirmAccNo) {
        alert("Account numbers do not match!");
        return;
      }
      if (ifsc.toUpperCase() !== confirmIfsc.toUpperCase()) {
        alert("IFSC codes do not match!");
        return;
      }
      setShowConfirmStep(true);
      return;
    }

    setSubmitting(true);
    try {
      const payoutDetails = `BANK: ${bankName} | ACC: ${accNo} | IFSC: ${ifsc.toUpperCase()}`;
      const res = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(withdrawAmount), note: payoutDetails })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Refresh wallet data
      const refreshRes = await fetch('/api/wallet');
      const refreshed = await refreshRes.json();
      setWalletData(refreshed);
      
      setIsSuccess(true);
      setBankName('');
      setAccNo('');
      setConfirmAccNo('');
      setIfsc('');
      setConfirmIfsc('');
      setShowConfirmStep(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
    setIsSuccess(false);
    setShowConfirmStep(false);
    setConfirmAccNo('');
    setConfirmIfsc('');
  };

  const handleShare = (platform: string) => {
    const text = `Your dream career is just one click away! 🌟 Join JobAdda.in, India's fastest-growing job platform. Sign up with my link, build your professional profile, and let's unlock your future together! 🚀✨\n\nLink: `;
    const url = `${window.location.origin}/register?ref=${walletData?.referralCode}`;
    const platforms: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + url)}`,
      message: `sms:?body=${encodeURIComponent(text + url)}`,
    };
    if (platforms[platform]) window.open(platforms[platform], '_blank');
  };

  if (loading) {
    return <div className="skeleton" style={{ height: '400px' }} />;
  }

  const balance = walletData?.balance || 0;
  const withdrawalTransactions = walletData?.transactions.filter((t: any) => t.type === 'WITHDRAWAL') || [];
  const earningsTransactions = walletData?.transactions.filter((t: any) => t.type === 'REFERRAL_BONUS') || [];
  const totalEarned = walletData?.referredUsers.reduce((sum, u) => sum + (u.earnedAmount || 0), 0) || 0;

  return (
    <div className="anim-fade-up">
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.25rem' }}>Refer & Earn</h2>
        <p style={{ color: 'var(--text-3)', margin: 0 }}>Invite your friends and earn real money in your wallet.</p>
      </header>

      <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        {/* Main Referral Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card card-p" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Gift size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>Upto ₹50</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>Per successful referral</div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-2)' }}>Share your link with friends. When they sign up and apply for a job, you get paid!</p>

            <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg)', padding: '0.5rem', borderRadius: '15px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
              <input
                readOnly
                value={`${window.location.origin}/register?ref=${walletData?.referralCode}`}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--primary-light)', fontSize: '0.8rem', fontWeight: '600' }}
              />
              <button onClick={handleCopy} className={`btn btn-sm ${copied ? 'btn-success' : 'btn-primary'}`}>
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleShare('whatsapp')} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center', borderColor: '#25D366', color: '#25D366', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle size={16} /> WhatsApp
              </button>
              <button onClick={() => handleShare('message')} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={16} /> Message
              </button>
            </div>
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            {HOW_STEPS.map((s: any, i: number) => (
              <div key={i} className="card card-p-sm" style={{ textAlign: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 0.75rem' }}>{s.n}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>{s.title}</div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card card-p" style={{ border: '1px solid var(--success)', background: 'rgba(16,185,129,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success)' }}>₹{balance.toFixed(0)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Current Wallet Balance</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem 0', borderTop: '1px solid rgba(16,185,129,0.1)', borderBottom: '1px solid rgba(16,185,129,0.1)', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '0.15rem' }}>Total Referrals</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>{walletData?.referredUsers?.length || 0}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '0.15rem' }}>Total Referral Earned</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--success)' }}>₹{totalEarned}</div>
              </div>
            </div>
            
            {balance === 0 ? (
              <button 
                className="btn btn-muted btn-sm" 
                style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, cursor: 'not-allowed' }} 
                disabled
              >
                <Lock size={14} /> Withdraw Funds
              </button>
            ) : balance < 500 ? (
              <button 
                className="btn btn-warning btn-sm" 
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', opacity: 0.8, cursor: 'not-allowed' }} 
                disabled
              >
                Reach ₹500 to withdraw
              </button>
            ) : (
              <button 
                onClick={() => setShowWithdrawModal(true)}
                className="btn btn-success btn-sm" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Withdraw Funds
              </button>
            )}
          </div>

          <div className="card">
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ margin: 0 }}>Recent Referrals</h4>
            </div>
            {walletData?.referredUsers && walletData.referredUsers.length > 0 ? (
              <div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {(showAllReferrals ? walletData.referredUsers : walletData.referredUsers.slice(0, 3)).map((user: any, i: number, arr: any[]) => {
                    const hasApplied = user.applications.length > 0;
                    return (
                      <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div className="avatar avatar-sm">{user.name?.[0] || 'U'}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: '600', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || user.email.split('@')[0]}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>Joined {timeAgo(user.createdAt)}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div className={`badge ${hasApplied ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.6rem', marginBottom: '2px' }}>
                            {hasApplied ? `Credited +₹${user.earnedAmount || '...'}` : 'Reward Pending'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {walletData.referredUsers.length > 3 && (
                  <button 
                    onClick={() => setShowAllReferrals(!showAllReferrals)}
                    className="btn btn-ghost btn-sm" 
                    style={{ width: '100%', borderTop: '1px solid var(--border)', borderRadius: 0, padding: '0.75rem' }}
                  >
                    {showAllReferrals ? 'See Less' : `See More (${walletData.referredUsers.length - 3} more)`}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-3)' }}>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>No referrals yet</p>
              </div>
            )}
          </div>

          {/* History Section */}
          <div className="card">
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button 
                  onClick={() => setHistoryTab('withdrawals')} 
                  className={`btn btn-sm ${historyTab === 'withdrawals' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', minHeight: 'auto', height: '32px' }}
                >
                  Withdrawals
                </button>
                <button 
                  onClick={() => setHistoryTab('earnings')} 
                  className={`btn btn-sm ${historyTab === 'earnings' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', minHeight: 'auto', height: '32px' }}
                >
                  Earnings
                </button>
              </div>
              <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>
                {historyTab === 'withdrawals' ? withdrawalTransactions.length : earningsTransactions.length} Total
              </span>
            </div>

            {historyTab === 'withdrawals' ? (
              withdrawalTransactions.length > 0 ? (
                <div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {(showAllWithdrawals ? withdrawalTransactions : withdrawalTransactions.slice(0, 3)).map((tx: any, i: number, arr: any[]) => (
                      <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.05)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Wallet size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>₹{tx.amount}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{timeAgo(tx.createdAt)}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div className={`badge ${tx.status === 'COMPLETED' ? 'badge-success' : tx.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                            {tx.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {withdrawalTransactions.length > 3 && (
                    <button 
                      onClick={() => setShowAllWithdrawals(!showAllWithdrawals)}
                      className="btn btn-ghost btn-sm" 
                      style={{ width: '100%', borderTop: '1px solid var(--border)', borderRadius: 0, padding: '0.75rem' }}
                    >
                      {showAllWithdrawals ? 'See Less' : `See More (${withdrawalTransactions.length - 3} more)`}
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-3)' }}>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>No withdrawal history</p>
                </div>
              )
            ) : (
              earningsTransactions.length > 0 ? (
                <div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {earningsTransactions.map((tx: any, i: number, arr: any[]) => (
                      <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.05)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Gift size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--success)' }}>+₹{tx.amount}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{timeAgo(tx.createdAt)}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Credited</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-3)' }}>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>No referral earnings yet</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '420px', width: '100%', position: 'relative', background: '#1e293b', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
            
            {isSuccess ? (
              <div className="card-p-lg anim-fade-up" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle size={40} />
                </div>
                <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>Request Submitted!</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                  Your withdrawal request has been received. It will be processed within 7 working days.
                </p>
                <button onClick={closeWithdrawModal} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Great, thanks!
                </button>
              </div>
            ) : showConfirmStep ? (
              <div className="card-p-lg anim-fade-up">
                <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Review Details</h3>
                
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '15px', border: '1px solid #334155', marginBottom: '2rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Withdrawal Amount</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--success)' }}>₹{withdrawAmount}</div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Bank Name</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: 'white' }}>{bankName}</div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Account Number</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', fontFamily: 'monospace', letterSpacing: '0.1em' }}>{accNo}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>IFSC Code</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: 'white' }}>{ifsc.toUpperCase()}</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>
                  <p style={{ color: '#fca5a5', fontSize: '0.8rem', margin: 0, lineHeight: '1.5' }}>
                    <strong>⚠️ WARNING:</strong> Please double-check these details. If the account details are wrong and the money is successfully credited, <strong>JobAdda is not liable</strong> for any loss.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setShowConfirmStep(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', borderColor: '#334155', color: '#94a3b8' }}>Back</button>
                  <button onClick={handleWithdraw} disabled={submitting} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                    {submitting ? 'Processing...' : 'Confirm & Submit'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-p-lg">
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: 'white', marginBottom: '0.25rem' }}>Withdraw Funds</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Verify your bank details carefully.</p>
                </div>

                <form onSubmit={handleWithdraw}>
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label className="label" style={{ color: '#cbd5e1' }}>Withdrawal Amount (₹)</label>
                    <input 
                      type="number" 
                      readOnly
                      value={withdrawAmount} 
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', color: '#10b981', fontWeight: '800', cursor: 'not-allowed' }}
                    />
                    <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.4rem' }}>Locked to your full wallet balance.</div>
                  </div>

                  <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="label" style={{ color: '#cbd5e1' }}>Bank Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. HDFC Bank, SBI, etc." 
                      required 
                      value={bankName} 
                      onChange={(e) => setBankName(e.target.value)}
                      style={{ background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div className="input-group">
                      <label className="label" style={{ color: '#cbd5e1' }}>Account Number</label>
                      <input 
                        type="password"
                        placeholder="••••••••••••" 
                        required 
                        value={accNo} 
                        onChange={(e) => setAccNo(e.target.value)}
                        style={{ background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                      />
                    </div>
                    <div className="input-group">
                      <label className="label" style={{ color: '#cbd5e1' }}>Confirm Account</label>
                      <input 
                        type="text"
                        placeholder="Re-enter number" 
                        required 
                        value={confirmAccNo} 
                        onChange={(e) => setConfirmAccNo(e.target.value)}
                        style={{ background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="input-group">
                      <label className="label" style={{ color: '#cbd5e1' }}>IFSC Code</label>
                      <input 
                        type="text"
                        placeholder="HDFC0001234" 
                        required 
                        value={ifsc} 
                        onChange={(e) => setIfsc(e.target.value)}
                        style={{ background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                      />
                    </div>
                    <div className="input-group">
                      <label className="label" style={{ color: '#cbd5e1' }}>Confirm IFSC</label>
                      <input 
                        type="text"
                        placeholder="Re-enter IFSC" 
                        required 
                        value={confirmIfsc} 
                        onChange={(e) => setConfirmIfsc(e.target.value)}
                        style={{ background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={closeWithdrawModal} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', borderColor: '#334155', color: '#94a3b8' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                      Next Step
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
