'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Gift, Wallet, CheckCircle, Share2, MessageCircle, MessageSquare, Lock } from 'lucide-react';

const HOW_STEPS = [
  { n: '1', title: 'Share Link', desc: 'Send your link to friends.' },
  { n: '2', title: 'Friend Joins', desc: 'They sign up on JobAdda.' },
  { n: '3', title: 'Earn ₹50', desc: 'Bonus when they apply.' },
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

  useEffect(() => {
    fetch('/api/wallet')
      .then(r => r.json())
      .then(data => { setWalletData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    if (!walletData?.referralCode) return;
    const link = `${window.location.origin}/register?ref=${walletData.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
            {HOW_STEPS.map((s, i) => (
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
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success)' }}>₹{(walletData?.balance || 0).toFixed(0)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Current Wallet Balance</div>
              </div>
            </div>
            <button 
              className="btn btn-success btn-sm" 
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (walletData?.balance || 0) < 500 ? 0.6 : 1, cursor: (walletData?.balance || 0) < 500 ? 'not-allowed' : 'pointer' }} 
              disabled={ (walletData?.balance || 0) < 500 }
            >
              {(walletData?.balance || 0) < 500 ? <Lock size={14} /> : null}
              {(walletData?.balance || 0) > 0 && (walletData?.balance || 0) < 500 
                ? `Min ₹500 to Withdraw` 
                : 'Withdraw Funds'}
            </button>
          </div>

          <div className="card">
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ margin: 0 }}>Recent Referrals</h4>
            </div>
            {walletData?.referredUsers && walletData.referredUsers.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {walletData.referredUsers.map((user, i) => {
                  const hasApplied = user.applications.length > 0;
                  return (
                    <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: i < walletData.referredUsers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div className="avatar avatar-sm">{user.name?.[0] || 'U'}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || user.email.split('@')[0]}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>Joined {timeAgo(user.createdAt)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className={`badge ${hasApplied ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.6rem', marginBottom: '2px' }}>
                          {hasApplied ? `Credited +₹${user.earnedAmount || '...'}` : 'Reward Pending'}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>Joined</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-3)' }}>
                <Share2 size={32} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '0.85rem', margin: 0 }}>No referrals yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
