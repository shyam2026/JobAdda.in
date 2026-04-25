'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Copy, Gift, Wallet, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

const HOW_STEPS = [
  { n: '1', title: 'Get Your Link', desc: 'Every JobAdda.in account gets a unique referral link. Share it anywhere.' },
  { n: '2', title: 'Friend Joins', desc: 'Your friend signs up using your referral link on JobAdda.in.' },
  { n: '3', title: 'They Apply', desc: 'Once they apply to their first job, your bonus is confirmed.' },
  { n: '4', title: 'You Earn ₹50', desc: 'Money is credited to your JobAdda.in wallet instantly.' },
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
  }>;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ReferPage() {
  const { data: session, status } = useSession();
  const [copied, setCopied] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobadda.in';
  const referralLink = walletData?.referralCode
    ? `${siteUrl}/register?ref=${walletData.referralCode}`
    : '';

  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(true);
      fetch('/api/wallet')
        .then(r => r.json())
        .then(data => { setWalletData(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = (platform: string) => {
    const text = `Join me on JobAdda.in – India's best job portal! Sign up using my referral link and find your dream job. 🚀`;
    const url = referralLink;
    const platforms: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    if (platforms[platform]) window.open(platforms[platform], '_blank');
  };

  const totalEarned = (walletData?.transactions || [])
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '5rem 0 4rem', textAlign: 'center', background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.12), transparent)' }}>
        <div className="container">
          <div className="badge badge-primary" style={{ marginBottom: '1.5rem', fontSize: '0.88rem' }}>
            <Gift size={14} /> Referral Program
          </div>
          <h1 style={{ marginBottom: '1rem' }}>Refer Friends.<br /><span className="text-gradient">Earn Real Money.</span></h1>
          <p style={{ fontSize: '1.15rem', maxWidth: '560px', margin: '0 auto 3rem' }}>
            Share your unique JobAdda.in link. Earn <strong style={{ color: 'var(--success)', fontSize: '1.2rem' }}>₹50</strong> for every friend who joins and applies for their first job.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {[{ val: '₹50', lbl: 'Per referral' }, { val: '∞', lbl: 'No limit on friends' }, { val: '100%', lbl: 'Verified program' }].map(s => (
              <div key={s.lbl} className="stat-item">
                <div className="stat-val">{s.val}</div>
                <div className="stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Referral Link Box */}
          <div style={{ maxWidth: '560px', margin: '0 auto', background: 'var(--surface-2)', border: '1.5px solid var(--border-active)', borderRadius: 'var(--radius-xl)', padding: '1.75rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-2)', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Unique Referral Link
            </p>
            {status === 'loading' || loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
              </div>
            ) : !session ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-3)', marginBottom: '1rem', fontSize: '0.9rem' }}>Sign in to get your referral link</p>
                <a href="/login" className="btn btn-primary">Sign In to Get Link</a>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <input
                    readOnly
                    value={referralLink}
                    style={{ flex: 1, color: 'var(--primary-light)', fontWeight: '600', fontSize: '0.82rem', background: 'rgba(99,102,241,0.08)', borderColor: 'var(--border-active)', minWidth: '0' }}
                  />
                  <button onClick={handleCopy} className={`btn ${copied ? 'btn-success' : 'btn-primary'}`} style={{ flexShrink: 0, gap: '0.4rem' }}>
                    {copied ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={() => handleShare('whatsapp')} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', minWidth: '80px' }}>📱 WhatsApp</button>
                  <button onClick={() => handleShare('twitter')} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', minWidth: '80px' }}>🐦 Twitter</button>
                  <button onClick={() => handleShare('linkedin')} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', minWidth: '80px' }}>💼 LinkedIn</button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="section-title">
            <h2>How It <span className="text-gradient">Works</span></h2>
          </div>
          <div className="grid-4">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="card card-p" style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem', color: 'white', margin: '0 auto 1.25rem', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>{s.n}</div>
                <h4 style={{ marginBottom: '0.6rem' }}>{s.title}</h4>
                <p style={{ fontSize: '0.88rem' }}>{s.desc}</p>
                {i < HOW_STEPS.length - 1 && (
                  <ArrowRight size={20} style={{ position: 'absolute', right: '-0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', display: 'none' }} className="hide-mobile" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wallet & History — only for logged-in users */}
      {session && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="grid-2" style={{ gap: '2rem' }}>
              {/* Wallet Card */}
              <div className="card card-p" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius)', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                    <Wallet size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>₹{(walletData?.balance || 0).toFixed(0)}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>Wallet Balance</div>
                  </div>
                </div>
                <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Total Earned', val: `₹${totalEarned}` },
                    { label: 'Total Referrals', val: String(walletData?.referredUsers?.length || 0) },
                  ].map(r => (
                    <div key={r.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>{r.val}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{r.label}</div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-success" style={{ width: '100%', justifyContent: 'center' }} disabled>
                  Withdraw (Coming Soon)
                </button>
              </div>

              {/* Referral History */}
              <div className="card">
                <h4 style={{ padding: '1.5rem 1.5rem 0' }}>Referral History</h4>
                {walletData?.referredUsers && walletData.referredUsers.length > 0 ? (
                  <div className="table-wrap" style={{ marginTop: '1rem', border: 'none', borderTop: '1px solid var(--border)', borderRadius: 0 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Friend</th>
                          <th>Joined</th>
                          <th>Status</th>
                          <th>Earned</th>
                        </tr>
                      </thead>
                      <tbody>
                        {walletData.referredUsers.map(user => {
                          const hasApplied = user.applications.length > 0;
                          return (
                            <tr key={user.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                  <div className="avatar avatar-sm">{(user.name || user.email)[0]?.toUpperCase()}</div>
                                  <span style={{ fontWeight: '600', fontSize: '0.88rem' }}>{user.name || user.email.split('@')[0]}</span>
                                </div>
                              </td>
                              <td style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>{timeAgo(user.createdAt)}</td>
                              <td>
                                <span className={`badge ${hasApplied ? 'badge-success' : 'badge-warning'}`}>
                                  {hasApplied ? 'Completed' : 'Pending'}
                                </span>
                              </td>
                              <td style={{ fontWeight: '700', color: hasApplied ? 'var(--success)' : 'var(--text-3)' }}>
                                {hasApplied ? '₹50' : '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-3)' }}>
                    <Gift size={32} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                    <p style={{ margin: 0 }}>No referrals yet. Start sharing your link!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
