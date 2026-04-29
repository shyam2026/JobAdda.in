'use client';

import React from 'react';
import { Gift, Wallet, Users, ArrowRight, Zap, CheckCircle, Share2, TrendingUp, DollarSign } from 'lucide-react';

const HOW_STEPS = [
  { 
    n: '1', 
    title: 'Get Your Unique Link', 
    desc: 'Create a free account on JobAdda.in and get your personalized referral link instantly.',
    icon: <Share2 size={24} />
  },
  { 
    n: '2', 
    title: 'Share with Friends', 
    desc: 'Share your link on WhatsApp, LinkedIn, or Twitter. There is no limit on how many friends you can invite.',
    icon: <Users size={24} />
  },
  { 
    n: '3', 
    title: 'Friend Joins & Applies', 
    desc: 'When your friend signs up and applies for their first verified job, your referral is confirmed.',
    icon: <TrendingUp size={24} />
  },
  { 
    n: '4', 
    title: 'Earn Real Cash', 
    desc: 'Upto ₹50 is credited to your JobAdda wallet for every successful referral. Withdraw to your bank.',
    icon: <DollarSign size={24} />
  },
];

const BENEFITS = [
  'Real cash rewards, not just points',
  'Weekly payouts to your bank account',
  'No limit on earnings',
  'Help your friends find their dream jobs'
];

export default function ReferLandingPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ padding: '6rem 0 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', zIndex: 0 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="anim-fade-up">
            <span className="badge badge-primary" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
              <Gift size={14} /> Official Referral Program
            </span>
          </div>
          <h1 className="anim-fade-up anim-delay-1" style={{ marginBottom: '1.5rem' }}>
            Don&apos;t Just Find Jobs.<br />
            <span className="text-gradient">Get Paid to Help Others.</span>
          </h1>
          <p className="anim-fade-up anim-delay-2" style={{ fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto 3rem', color: 'var(--text-2)' }}>
            Join the JobAdda.in community and earn <strong style={{ color: 'var(--success)', fontSize: '1.4rem' }}>Upto ₹50</strong> for every friend you refer who applies for a job.
          </p>
          
          <div className="anim-fade-up anim-delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register" className="btn btn-primary btn-lg">
              Start Earning Now <ArrowRight size={18} />
            </a>
            <a href="/login" className="btn btn-outline btn-lg">Login to My Wallet</a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-sm" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid-3" style={{ textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-light)' }}>₹5 Lakhs+</div>
              <div style={{ color: 'var(--text-3)', fontWeight: '500' }}>Already Paid Out</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-light)' }}>10k+</div>
              <div style={{ color: 'var(--text-3)', fontWeight: '500' }}>Active Referrers</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-light)' }}>∞</div>
              <div style={{ color: 'var(--text-3)', fontWeight: '500' }}>Unlimited Earnings</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>How It <span className="text-gradient">Works</span></h2>
            <p>Simple steps to start earning with JobAdda.in</p>
          </div>
          
          <div className="grid-4">
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="card card-p" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  background: 'rgba(99,102,241,0.1)', 
                  color: 'var(--primary-light)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.1)'
                }}>
                  {step.icon}
                </div>
                <h4 style={{ marginBottom: '0.75rem' }}>{step.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-3)', margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Benefits */}
      <section className="section" style={{ background: 'var(--bg-2)', position: 'relative' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <h2 style={{ marginBottom: '1.5rem' }}>Why Join the <span className="text-gradient">Referral Program?</span></h2>
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>We value our community. Our program is designed to reward you for helping your network succeed.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {BENEFITS.map((benefit, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ color: 'var(--success)', display: 'flex' }}>
                      <CheckCircle size={20} />
                    </div>
                    <span style={{ fontWeight: '500', fontSize: '1.05rem' }}>{benefit}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '3rem' }}>
                <a href="/register" className="btn btn-primary">Join 50,000+ Earners</a>
              </div>
            </div>
            
            <div className="show-desktop" style={{ position: 'relative' }}>
              <div className="card card-p-lg" style={{ background: 'linear-gradient(135deg, var(--bg-3), var(--bg-2))', border: '1px solid var(--border-active)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '1rem', letterSpacing: '0.1em' }}>Earnings Preview</div>
                  <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--success)', marginBottom: '0.5rem' }}>₹15,453</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-2)' }}>Total wallet balance</div>
                  
                  <div className="divider" style={{ margin: '2rem 0' }} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { name: 'Rahul S.', amt: '+₹42', status: 'Confirmed' },
                      { name: 'Priya K.', amt: '+₹50', status: 'Confirmed' },
                      { name: 'Amit M.', amt: '+₹35', status: 'Confirmed' },
                    ].map((tx, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius)' }}>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{tx.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Referral Reward</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: 'var(--success)', fontWeight: '700' }}>{tx.amt}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--success)', opacity: 0.8 }}>{tx.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="card card-p-lg" style={{ background: 'radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, transparent 100%)', border: '1px solid var(--border)' }}>
            <Zap size={48} style={{ color: 'var(--warning)', marginBottom: '1.5rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>Ready to Start Earning?</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>
              It only takes 30 seconds to join. Create your account, share your link, and watch your wallet grow.
            </p>
            <a href="/register" className="btn btn-primary btn-lg" style={{ padding: '1rem 3rem' }}>
              Create My Free Account
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          .show-desktop { display: none !important; }
        }
      `}</style>
    </div>
  );
}
