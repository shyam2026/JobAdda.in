'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, TrendingUp, ChevronRight, Star, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { JobCard } from '@/features/jobs/components/JobCard';

const CATEGORIES = [
  { name: 'Technology', icon: '💻', link: '/jobs?q=technology' },
  { name: 'Marketing', icon: '📣', link: '/jobs?q=marketing' },
  { name: 'Finance', icon: '💰', link: '/jobs?q=finance' },
  { name: 'Design', icon: '🎨', link: '/jobs?q=design' },
  { name: 'Healthcare', icon: '🏥', link: '/jobs?q=healthcare' },
  { name: 'Education', icon: '📚', link: '/jobs?q=education' },
  { name: 'Sales', icon: '📈', link: '/jobs?q=sales' },
  { name: 'Engineering', icon: '⚙️', link: '/jobs?q=engineering' },
];

const STATS = [
  { val: '50,000+', lbl: 'Active Jobs' },
  { val: '10,000+', lbl: 'Companies' },
  { val: '5L+', lbl: 'Candidates' },
  { val: '₹12L', lbl: 'Avg. Salary' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    fetch('/api/jobs?limit=6')
      .then(r => r.json())
      .then(data => {
        setFeaturedJobs(data.jobs || []);
        setLoadingJobs(false);
      })
      .catch(() => setLoadingJobs(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/jobs?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`;
  };

  return (
    <>
      {/* HERO */}
      <section className="hero" style={{ textAlign: 'center', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.12), transparent)' }}>
        <div className="container">
          <div className="anim-fade-up" style={{ marginBottom: '1rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
              <Zap size={12} /> India's Fastest Growing Job Portal
            </span>
          </div>
          <h1 className="hero-title anim-fade-up anim-delay-1">
            Find Jobs That <span className="text-gradient">Define</span><br />Your Career
          </h1>
          <p className="hero-subtitle anim-fade-up anim-delay-2">
            Search from 50,000+ verified job openings across India. Build your resume, apply instantly, and refer friends to earn real money — only on <strong>JobAdda.in</strong>
          </p>

          <form onSubmit={handleSearch} className="anim-fade-up anim-delay-3">
            <div className="search-box">
              <Search size={20} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
              <input
                className="search-input"
                placeholder="Job title, keywords or company"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <div className="search-divider" />
              <MapPin size={18} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
              <input
                className="search-input"
                placeholder="City or 'Remote'"
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={{ maxWidth: '200px' }}
              />
              <button type="submit" className="btn btn-primary btn-lg" style={{ flexShrink: 0, margin: '0.15rem' }}>
                Search Jobs
              </button>
            </div>
          </form>

          <p style={{ marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--text-3)' }}>
            Popular:&nbsp;
            <a href="/jobs?q=react" style={{ color: 'var(--primary-light)', marginRight: '0.75rem' }}>React Developer</a>
            <a href="/jobs?q=marketing" style={{ color: 'var(--primary-light)', marginRight: '0.75rem' }}>Marketing</a>
            <a href="/jobs?q=data+analyst" style={{ color: 'var(--primary-light)', marginRight: '0.75rem' }}>Data Analyst</a>
            <a href="/jobs?q=remote" style={{ color: 'var(--primary-light)' }}>Remote</a>
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ padding: '2.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container grid-4">
          {STATS.map(s => (
            <div key={s.lbl} className="stat-item">
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Explore <span className="text-gradient">Top Categories</span></h2>
            <p>Browse jobs across the most in-demand industries in India</p>
          </div>
          <div className="grid-4">
            {CATEGORIES.map((cat, i) => (
              <a key={cat.name} href={cat.link} className="card card-p" style={{ textDecoration: 'none', animationDelay: `${i * 0.07}s`, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{cat.icon}</div>
                <h4 style={{ marginBottom: '0.25rem' }}>{cat.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', margin: 0 }}>Browse Jobs →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS — from DB */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-title">
            <h2><span className="text-gradient">Latest</span> Job Openings</h2>
            <p>Fresh opportunities from verified employers across India</p>
          </div>

          {loadingJobs ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--border)', borderRadius: 'var(--radius)' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ height: '18px', background: 'var(--border)', borderRadius: '4px', width: '65%' }} />
                      <div style={{ height: '14px', background: 'var(--border)', borderRadius: '4px', width: '45%' }} />
                    </div>
                  </div>
                  <div style={{ height: '14px', background: 'var(--border)', borderRadius: '4px', width: '80%', marginBottom: '0.5rem' }} />
                  <div style={{ height: '14px', background: 'var(--border)', borderRadius: '4px', width: '60%' }} />
                </div>
              ))}
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="card card-p" style={{ textAlign: 'center', padding: '3rem', marginBottom: '2.5rem' }}>
              <Briefcase size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-3)' }}>No jobs posted yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
              {featuredJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          )}

          <div className="text-center">
            <a href="/jobs" className="btn btn-outline" style={{ padding: '0.85rem 2rem' }}>
              View All Jobs <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* REFER & EARN */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card card-p-lg" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.2)', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.15), transparent)', pointerEvents: 'none' }} />
            <div className="badge badge-primary" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              💸 Referral Program
            </div>
            <h2 style={{ marginBottom: '1rem' }}>Refer Friends. <span className="text-gradient">Earn Money.</span></h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '550px', margin: '0 auto 2.5rem' }}>
              Share your unique JobAdda.in link. Earn <strong style={{ color: 'var(--success)' }}>₹50</strong> for every friend who joins and applies — straight to your wallet.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/register" className="btn btn-primary btn-lg">Join & Get Your Link</a>
              <a href="/refer" className="btn btn-outline btn-lg">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY JOBADDA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-title">
            <h2>Why Choose <span className="text-gradient">JobAdda.in</span>?</h2>
          </div>
          <div className="grid-3">
            {[
              { icon: <Shield size={28} />, title: '100% Verified Jobs', desc: 'Every listing is manually reviewed. No fake jobs, no spam — guaranteed quality.' },
              { icon: <Zap size={28} />, title: 'One-Click Apply', desc: 'Apply to any job instantly using your JobAdda profile. No re-filling forms.' },
              { icon: <TrendingUp size={28} />, title: 'Smart Job Matching', desc: 'Our engine surfaces the most relevant roles based on your skills and preferences.' },
            ].map((f, i) => (
              <div key={i} className="card card-p" style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '1rem', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', margin: '0 auto 1.5rem' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOR EMPLOYERS */}
      <section style={{ background: 'var(--bg-2)', padding: '5rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Are You <span className="text-gradient">Hiring?</span></h2>
            <p style={{ maxWidth: '480px', fontSize: '1.05rem' }}>
              Post jobs on JobAdda.in and reach 5 lakh+ qualified candidates. Manage applications and hire faster.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/company/register" className="btn btn-primary btn-lg">
              <Briefcase size={18} /> Post a Job Free
            </a>
            <a href="/company" className="btn btn-outline btn-lg">Learn More</a>
          </div>
        </div>
      </section>
    </>
  );
}
