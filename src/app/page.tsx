'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, TrendingUp, ChevronDown, Star, Zap, Shield, ArrowRight, Loader2, Code, Megaphone, Banknote, Palette, Stethoscope, GraduationCap, Settings, BarChart3, HelpCircle, Users, FileText, Wallet, X } from 'lucide-react';
import Link from 'next/link';
import { JobCard } from '@/features/jobs/components/JobCard';
import { FAQSchema } from '@/components/StructuredData';
import { EXAM_START_TIME, EXAM_END_TIME, getScholarshipPhase, ScholarshipPhase } from '@/lib/scholarship-schedule';

const REGISTRATION_CUTOFF = new Date('2026-08-14T22:00:00+05:30').getTime();

const WavingImageFlag = ({ width = 24, height = 16 }: { width?: number; height?: number }) => (
  <img 
    src="/indian-flag.png" 
    alt="Waving Indian Flag" 
    width={width}
    height={height}
    style={{
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: '2px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      display: 'inline-block',
      verticalAlign: 'middle',
      transformOrigin: 'bottom left',
      animation: 'flag-wave 2.5s ease-in-out infinite'
    }}
  />
);

const CATEGORIES = [
  { name: 'Technology', icon: Code, color: '#6366f1', link: '/jobs?category=Technology' },
  { name: 'Finance', icon: Banknote, color: '#10b981', link: '/jobs?category=Finance' },
  { name: 'Healthcare', icon: Stethoscope, color: '#ef4444', link: '/jobs?category=Healthcare' },
  { name: 'Marketing', icon: Megaphone, color: '#ec4899', link: '/jobs?category=Marketing' },
  { name: 'Sales', icon: BarChart3, color: '#3b82f6', link: '/jobs?category=Sales' },
  { name: 'HR', icon: Users, color: '#8b5cf6', link: '/jobs?category=HR' },
  { name: 'Operations', icon: Settings, color: '#64748b', link: '/jobs?category=Operations' },
  { name: 'Education', icon: GraduationCap, color: '#f59e0b', link: '/jobs?category=Education' },
  { name: 'Legal', icon: Shield, color: '#f43f5e', link: '/jobs?category=Legal' },
  { name: 'Design', icon: Palette, color: '#a855f7', link: '/jobs?category=Design' },
  { name: 'Data & Analytics', icon: TrendingUp, color: '#06b6d4', link: '/jobs?category=Data%20%26%20Analytics' },
  { name: 'Other', icon: HelpCircle, color: '#94a3b8', link: '/jobs?category=Other' },
];

const STATS = [
  { val: '50,000+', lbl: 'Active Jobs', icon: Briefcase, color: '#6366f1' },
  { val: '10,000+', lbl: 'Companies', icon: Users, color: '#ec4899' },
  { val: '5L+', lbl: 'Candidates', icon: FileText, color: '#10b981' },
  { val: '₹12L', lbl: 'Avg. Salary', icon: Wallet, color: '#f59e0b' },
];

const FAQS = [
  { question: 'What is JobAdda.in?', answer: 'JobAdda.in is India\'s fastest growing job portal where you can search over 50,000 verified job openings, build a professional ATS-optimized resume, and refer friends to earn real money. We connect job seekers directly with top companies across India.' },
  { question: 'Is JobAdda.in free for job seekers?', answer: 'Yes, JobAdda.in is completely free for job seekers. You can create an account, search and apply to unlimited jobs, and build your resume at no cost. Our optional Premium plan (₹99/year) offers additional features like direct HR chat and priority support.' },
  { question: 'How do I apply for jobs on JobAdda.in?', answer: 'Simply create a free account, complete your profile with your skills and experience, and use our One-Click Apply feature to apply instantly to any job. No need to re-fill forms — your JobAdda profile is your application.' },
  { question: 'What is the Refer & Earn program?', answer: 'Our Refer & Earn program lets you earn up to ₹50 for every friend who joins JobAdda.in using your unique referral link and applies to a job. Earnings are credited directly to your in-app wallet and can be withdrawn anytime.' },
  { question: 'How is JobAdda.in different from Other Job Portals?', answer: 'JobAdda.in focuses on verified jobs only — every listing is manually reviewed, eliminating fake or spam job posts. We offer One-Click Apply, a built-in ATS resume builder, a referral earning system, and an affordable Premium plan with direct HR messaging — features not available together on other platforms.' },
  { question: 'Can companies post jobs for free?', answer: 'Yes, companies can register and post job openings on JobAdda.in for free. Our platform provides tools to manage applications, shortlist candidates, and communicate with applicants directly through our built-in chat system.' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [scholarshipPhase, setScholarshipPhase] = useState<ScholarshipPhase>('REGISTRATION_OPEN');

  useEffect(() => {
    setScholarshipPhase(getScholarshipPhase());
  }, []);

  useEffect(() => {
    // 1. Check local storage
    if (localStorage.getItem('scholarship_applied') === 'true') {
      return;
    }

    // 2. Check server session
    let active = true;
    let timer: NodeJS.Timeout;

    fetch('/api/scholarship/check-applied')
      .then(r => r.json())
      .then(data => {
        if (data.applied) {
          localStorage.setItem('scholarship_applied', 'true');
        } else if (active) {
          timer = setTimeout(() => setShowPopup(true), 2500);
        }
      })
      .catch(() => {
        if (active) {
          timer = setTimeout(() => setShowPopup(true), 2500);
        }
      });

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    fetch('/api/jobs?limit=3')
      .then(r => r.json())
      .then(data => { setFeaturedJobs(data.jobs || []); setLoadingJobs(false); })
      .catch(() => setLoadingJobs(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/jobs?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`;
  };

  return (
    <>
      {/* FAQ Structured Data for AI/Google */}
      <FAQSchema faqs={FAQS} />

      {/* ═══ HERO ═══ */}
      <section className="hero" style={{ textAlign: 'center', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.12), transparent)' }}>
        <div className="container">
          <div className="anim-fade-up" style={{ marginBottom: '1rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
              <Zap size={12} /> India&apos;s Fastest Growing Job Portal
            </span>
          </div>
          <h1 className="hero-title anim-fade-up anim-delay-1">
            Find Jobs That <span className="text-gradient">Define</span><br />Your Career
          </h1>
          <p className="hero-subtitle anim-fade-up anim-delay-2">
            Search from 50,000+ verified job openings across India. Build your resume, apply instantly, and refer friends to earn real money — only on <strong>JobAdda.in</strong>
          </p>

          <form onSubmit={handleSearch} className="anim-fade-up anim-delay-3" style={{ width: '100%', maxWidth: '840px', margin: '0 auto' }}>
            <div className="search-box" style={{
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 50px rgba(99, 102, 241, 0.04)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              margin: '0 auto',
            }}
            onFocusCapture={(e) => {
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.45)';
              e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 50px rgba(99, 102, 241, 0.15)';
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 50px rgba(99, 102, 241, 0.04)';
            }}
            >
              <div className="search-item">
                <Search size={20} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                <input
                  className="search-input"
                  placeholder="Job title, keywords or company"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
              <div className="search-divider" />
              <div className="search-item">
                <MapPin size={18} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                <input
                  className="search-input"
                  placeholder="City or 'Remote'"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-lg" style={{ 
                flexShrink: 0, 
                margin: '0.25rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                fontWeight: '700',
                padding: '0.8rem 1.8rem',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                transition: 'all 0.2s'
              }}>
                Search Jobs
              </button>
            </div>
          </form>

          <p className="anim-fade-up anim-delay-4" style={{ marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span>Trending:</span>
            <Link href="/jobs?q=AI Engineer" style={{ color: 'var(--primary-light)' }}>AI Engineer</Link>
            <span style={{ opacity: 0.3 }}>•</span>
            <Link href="/jobs?q=Prompt Engineer" style={{ color: 'var(--primary-light)' }}>Prompt Engineer</Link>
            <span style={{ opacity: 0.3 }}>•</span>
            <Link href="/jobs?q=Machine Learning" style={{ color: 'var(--primary-light)' }}>Machine Learning</Link>
          </p>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section style={{ padding: '2.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="stats-row">
            {STATS.map(s => (
              <div key={s.lbl} className="stat-card">
                <div className="stat-card-icon" style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}25` }}>
                  <s.icon size={22} />
                </div>
                <div>
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-lbl">{s.lbl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Explore <span className="text-gradient">Top Categories</span></h2>
            <p>Browse jobs across the most in-demand industries in India</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                href={cat.link}
                className="card category-card"
                style={{
                  textDecoration: 'none',
                  animationDelay: `${i * 0.07}s`,
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  ['--hover-color' as any]: cat.color,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  aspectRatio: '1 / 1',
                  padding: '1rem',
                }}
              >
                {/* Decorative background glow on hover */}
                <div className="category-glow" style={{ background: `radial-gradient(circle 100px at 50% 50%, ${cat.color}15, transparent)` }} />
                
                <div className="category-icon" style={{ background: `${cat.color}12`, color: cat.color, border: `1px solid ${cat.color}25` }}>
                  <cat.icon size={22} strokeWidth={1.5} />
                </div>
                
                <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
                  <h4 style={{ margin: '0', fontWeight: '800', fontSize: '0.98rem', color: 'var(--text)', transition: 'color 0.2s', textAlign: 'center' }}>{cat.name}</h4>
                  <span className="category-count" style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-3)', transition: 'all 0.25s ease' }}>
                    Browse Jobs →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED JOBS ═══ */}
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
            <div className="grid-3 home-jobs-grid" style={{ marginBottom: '2.5rem' }}>
              {featuredJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/jobs" className="btn btn-outline" style={{ padding: '0.85rem 2rem' }}>
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ REFER & EARN ═══ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card card-p-lg" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.25)', textAlign: 'center', overflow: 'hidden', position: 'relative', borderRadius: '32px' }}>
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.18), transparent)', pointerEvents: 'none' }} />
            <div className="badge badge-primary" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              💸 Referral Program
            </div>
            <h2 style={{ marginBottom: '1rem' }}>Refer Friends. <span className="text-gradient">Earn Money.</span></h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '550px', margin: '0 auto 2.5rem' }}>
              Share your unique JobAdda.in link. Earn <strong style={{ color: 'var(--success)' }}>Upto ₹50</strong> for every friend who joins and applies — straight to your wallet.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-lg" style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '700',
                padding: '0.8rem 1.8rem',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
              }}>Join & Get Your Link</Link>
              <Link href="/refer" className="btn btn-outline btn-lg" style={{ borderRadius: '14px' }}>Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY JOBADDA ═══ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-title">
            <h2>Why Choose <span className="text-gradient">JobAdda.in</span>?</h2>
          </div>
          <div className="grid-3">
            {[
              { icon: <Shield size={28} />, title: '100% Verified Jobs', desc: 'Every listing is manually reviewed. No fake jobs, no spam — guaranteed quality.', color: '#10b981', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))' },
              { icon: <Zap size={28} />, title: 'One-Click Apply', desc: 'Apply to any job instantly using your JobAdda profile. No re-filling forms.', color: '#6366f1', gradient: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))' },
              { icon: <TrendingUp size={28} />, title: 'Smart Job Matching', desc: 'Our engine surfaces the most relevant roles based on your skills and preferences.', color: '#ec4899', gradient: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05))' },
            ].map((f, i) => (
              <div key={i} className="card card-p anim-fade-up" style={{ textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: f.gradient, border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, margin: '0 auto 1.5rem', boxShadow: `0 8px 24px ${f.color}15` }}>{f.icon}</div>
                <h3 style={{ marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-title">
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '1.5rem' }}>
              <HelpCircle size={28} color="var(--primary-light)" />
            </div>
            <h2>Frequently Asked <span className="text-gradient">Questions</span></h2>
            <p>Everything you need to know about JobAdda.in</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="faq-item"
                style={{
                  background: openFaq === i ? 'rgba(99,102,241,0.06)' : 'var(--surface)',
                  border: `1px solid ${openFaq === i ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', padding: '1.25rem 1.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                    background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: '1rem', fontWeight: 600, textAlign: 'left',
                  }}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={20}
                    style={{
                      flexShrink: 0, color: 'var(--text-3)',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </button>
                <div style={{
                  maxHeight: openFaq === i ? '300px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                }}>
                  <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--text-2)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FOR EMPLOYERS ═══ */}
      <section style={{ background: 'var(--bg-2)', padding: '5rem 0', borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative gradient accent */}
        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent)' }} />
        <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Are You <span className="text-gradient">Hiring?</span></h2>
            <p style={{ maxWidth: '480px', fontSize: '1.05rem' }}>
              Post jobs on JobAdda.in and reach 5 lakh+ qualified candidates. Manage applications and hire faster.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/company/register" className="btn btn-primary btn-lg">
              <Briefcase size={18} /> Post a Job Free
            </Link>
            <Link href="/company" className="btn btn-outline btn-lg">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Scholarship Popup Modal */}
      {showPopup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '1.5rem' }}>
          <div className="card anim-fade-up" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem', position: 'relative', borderRadius: '24px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.1)', background: 'linear-gradient(145deg, var(--bg-2) 0%, #0f172a 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
            {/* Decorative gradient accent on top */}
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '3px', background: 'linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent)', borderRadius: '0 0 4px 4px' }} />
            
            <button 
              onClick={() => { setShowPopup(false); }} 
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-3)', cursor: 'pointer', borderRadius: '50%', padding: '0.4rem', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
            >
              <X size={18} />
            </button>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', color: 'var(--primary)', marginBottom: '1.25rem', boxShadow: '0 8px 24px rgba(99,102,241,0.15)' }}>
              <GraduationCap size={32} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', width: '100%', position: 'relative' }}>
              {scholarshipPhase === 'RESULT_LIVE' ? 'Scholarship Results LIVE 🏆' : scholarshipPhase === 'RESULT_WAITING' ? 'Scholarship Result 2026' : 'Scholarship Test 2026'}
              <span style={{ display: 'inline-block', position: 'relative', top: '-6px' }}>
                <WavingImageFlag width={22} height={15} />
              </span>
            </h3>

            <p style={{ color: 'var(--text-3)', fontSize: '0.88rem', margin: '0 0 1.25rem' }}>
              {scholarshipPhase === 'RESULT_LIVE' ? (
                <>Scholarship Exam results are now published! Check your <strong style={{ color: 'var(--text-1)' }}>All India Rank</strong> and score card.</>
              ) : scholarshipPhase === 'RESULT_WAITING' ? (
                <>Scholarship Test 2026 result will be published on <strong style={{ color: '#F97316' }}>20th August 2026</strong>. Stay tuned!</>
              ) : (
                <>Showcase your talent on <strong style={{ color: 'var(--text-1)' }}>15th August 2026</strong>. Stand out & win career guidance with top scholarships!</>
              )}
            </p>
            
            {/* Feature highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', margin: '0 0 1.5rem', padding: '1rem', borderRadius: '14px', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
              {scholarshipPhase === 'RESULT_LIVE' || scholarshipPhase === 'RESULT_WAITING' ? [
                { icon: '📅', text: 'Official Result Date: 20th August 2026' },
                { icon: '🏆', text: 'Rank #1 to #300 Prize Allocations' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 600 }}>
                  <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              )) : [
                { icon: '📝', text: '150 MCQs • 150 Minutes' },
                { icon: '🏆', text: 'Win scholarships up to ₹15,000' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 600 }}>
                  <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <Link 
                href={
                  scholarshipPhase === 'RESULT_LIVE' || scholarshipPhase === 'RESULT_WAITING'
                    ? '/scholarship/result'
                    : scholarshipPhase === 'EXAM_LIVE' || scholarshipPhase === 'REGISTRATION_CLOSED'
                    ? '/scholarship/exam'
                    : '/scholarship'
                } 
                onClick={() => { setShowPopup(false); }}
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '0.9rem', 
                  justifyContent: 'center', 
                  fontWeight: 800,
                  background: scholarshipPhase === 'RESULT_LIVE' 
                    ? 'linear-gradient(135deg, #3b82f6, #6366f1)' 
                    : scholarshipPhase === 'EXAM_LIVE' 
                    ? 'linear-gradient(135deg, #10b981, #059669)' 
                    : undefined,
                  boxShadow: scholarshipPhase === 'RESULT_LIVE'
                    ? '0 8px 24px rgba(59,130,246,0.35)'
                    : scholarshipPhase === 'EXAM_LIVE'
                    ? '0 8px 24px rgba(16,185,129,0.35)'
                    : undefined
                }}
              >
                {scholarshipPhase === 'RESULT_LIVE'
                  ? '🏆 CHECK RESULT NOW →'
                  : scholarshipPhase === 'RESULT_WAITING'
                  ? 'Check Result Status →'
                  : scholarshipPhase === 'EXAM_LIVE'
                  ? '🔥 TAKE EXAM NOW →'
                  : scholarshipPhase === 'REGISTRATION_CLOSED'
                  ? 'Enter Scholarship Exam Portal →'
                  : 'Register Now →'}
              </Link>
              <button 
                onClick={() => { setShowPopup(false); }} 
                className="btn btn-ghost" 
                style={{ fontSize: '0.85rem', alignSelf: 'center', margin: '0 auto' }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ HOMEPAGE STYLES ═══ */}
      <style jsx>{`
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem 1.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.4);
          background: rgba(255,255,255,0.04);
        }
        .stat-card-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .stat-val {
          font-size: 1.5rem; font-weight: 800; line-height: 1.2;
          background: linear-gradient(135deg, var(--primary-light), var(--secondary));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .stat-lbl { font-size: 0.8rem; color: var(--text-3); margin-top: 0.1rem; }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }
        .category-card {
          aspect-ratio: 1 / 1;
          padding: 1rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 20px !important;
          cursor: pointer;
        }
        .category-card:hover {
          transform: translateY(-6px);
          border-color: var(--hover-color) !important;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 0 24px -2px var(--hover-color)20 !important;
        }
        .category-card:hover .category-count {
          color: var(--hover-color) !important;
        }
        .category-glow {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .category-card:hover .category-glow {
          opacity: 1;
        }
        .category-card:hover .category-icon {
          transform: scale(1.08) rotate(4deg);
          background: var(--hover-color)18 !important;
          border-color: var(--hover-color)35 !important;
          box-shadow: 0 8px 24px -4px var(--hover-color)30;
        }
        .category-icon {
          width: 52px; height: 52px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .faq-item:hover {
          border-color: rgba(99,102,241,0.25) !important;
        }

        @media (max-width: 1024px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .categories-grid { grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        }

        @media (max-width: 768px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .stat-card { padding: 0.85rem 1rem; gap: 0.75rem; }
          .stat-card-icon { width: 40px; height: 40px; border-radius: 12px; }
          .stat-card-icon :global(svg) { width: 18px !important; height: 18px !important; }
          .stat-val { font-size: 1.25rem; }
          .stat-lbl { font-size: 0.72rem; }

          .categories-grid { grid-template-columns: repeat(3, 1fr); gap: 0.8rem; }
          .category-card { aspect-ratio: 1 / 1; padding: 0.85rem !important; border-radius: 16px !important; gap: 0.4rem !important; }
          .category-icon { width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0; }
          .category-icon :global(svg) { width: 20px !important; height: 20px !important; }
          .category-card h4 { font-size: 0.88rem !important; }
        }

        @media (max-width: 560px) {
          .categories-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.5rem !important; }
          .category-card { padding: 0.6rem !important; gap: 0.35rem !important; border-radius: 12px !important; }
          .category-icon { width: 36px !important; height: 36px !important; border-radius: 10px !important; }
          .category-icon :global(svg) { width: 16px !important; height: 16px !important; }
          .category-card h4 { font-size: 0.78rem !important; }
          .category-count { display: none !important; }
        }

        @media (max-width: 380px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
          .categories-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.4rem !important; }
          .category-card { padding: 0.5rem !important; }
          .category-card h4 { font-size: 0.72rem !important; }
        }
        @keyframes flag-wave {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          20% { transform: translateY(-1px) rotate(3deg); }
          40% { transform: translateY(1.5px) rotate(-1deg); }
          60% { transform: translateY(-1px) rotate(2deg); }
          80% { transform: translateY(1px) rotate(-2deg); }
        }
      `}</style>
    </>
  );
}
