'use client';

import React from 'react';
import { Check, Zap, Shield, Clock, ArrowRight, Star, Download, Eye, Layers, Palette, Crown } from 'lucide-react';
import Template1 from '../user/resume/Template1';
import Template2 from '../user/resume/Template2';
import Template3 from '../user/resume/Template3';

const MOCK_PROFILE = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  city: 'New Delhi, India',
  bio: 'Results-driven Senior Software Engineer with over 6 years of experience in full-stack development. Expert in building high-performance web applications using React, Next.js, and Node.js.',
  skills: ['JavaScript (ES6+)', 'React.js', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  experience: [
    { role: 'Lead Full Stack Developer', company: 'Global Tech Solutions', duration: 'Jan 2021 - Present', description: 'Architected a microservices fintech platform, reducing server costs by 30% and improving load times by 50%.' },
    { role: 'Software Engineer', company: 'Innovate Systems', duration: 'June 2018 - Dec 2020', description: 'Developed key features for a customer-facing dashboard used by 50k+ daily users.' }
  ],
  education: [{ degree: 'B.Tech in Computer Science', school: 'Delhi Technological University', year: '2018', grade: '8.8 CGPA' }],
  projects: [{ title: 'E-commerce Platform', description: 'Scalable e-commerce site with integrated payment gateway and inventory management.', link: '#' }],
  linkedin: 'linkedin.com/in/rahulsharma',
  github: 'github.com/rahulsharma'
};

const MOCK_CONFIG = { showBio: true, showEmail: true, showPhone: true, showSocials: true, showSkills: true, showExp: true, showEdu: true, showProjects: true };

const FEATURES = [
  { icon: Zap, title: 'Instant Generation', desc: 'Create your professional resume in under 60 seconds with our smart builder.' },
  { icon: Shield, title: 'ATS Optimized', desc: 'All templates are engineered to pass Applicant Tracking Systems.' },
  { icon: Palette, title: 'Premium Designs', desc: 'Hand-crafted modern layouts that make you stand out from the crowd.' },
  { icon: Clock, title: '5-Min Access', desc: 'Pay once, get a 5-minute window to download your perfect, watermark-free PDF.' },
];

const TEMPLATES = [
  {
    id: 'TPL_1',
    name: 'Basic',
    subtitle: 'Clean · Minimal · Timeless',
    price: 0,
    oldPrice: 15,
    badge: 'FREE',
    badgeStyle: { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' },
    borderColor: '#10b981',
    accentColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.15)',
    popular: false,
    features: ['Single-column layout', 'Clean black & white', 'ATS optimized', 'No watermark', 'Instant download'],
    featureIcons: [Layers, Eye, Shield, Star, Download],
    highlight: 'Perfect for freshers & entry-level roles',
    Component: Template1,
    componentProps: {},
  },
  {
    id: 'TPL_2',
    name: 'Professional',
    subtitle: 'Two-Column · Color Accent · Modern',
    price: 15,
    oldPrice: 30,
    badge: 'MOST POPULAR',
    badgeStyle: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' },
    borderColor: '#6366f1',
    accentColor: '#6366f1',
    glowColor: 'rgba(99,102,241,0.2)',
    popular: true,
    features: ['Two-column layout', 'Custom accent color', 'Modern design', 'No watermark', 'Instant download'],
    featureIcons: [Layers, Palette, Zap, Star, Download],
    highlight: 'Ideal for 1-5 years experience',
    Component: Template2,
    componentProps: { accentColor: '#6366f1' },
  },
  {
    id: 'TPL_3',
    name: 'Premium',
    subtitle: 'Dark Sidebar · Gold Accents · Premium',
    price: 25,
    oldPrice: 50,
    badge: 'PREMIUM',
    badgeStyle: { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' },
    borderColor: '#f59e0b',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.15)',
    popular: false,
    features: ['Dark sidebar design', 'Gold accent system', 'Premium typography', 'No watermark', 'Instant download'],
    featureIcons: [Crown, Star, Zap, Eye, Download],
    highlight: 'Designed for senior & leadership roles',
    Component: Template3,
    componentProps: {},
  },
];

export default function PublicResumePage() {
  return (
    <div className="anim-fade-up">

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ padding: '5rem 0 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '30px', padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-light)', marginBottom: '2rem', letterSpacing: '0.05em' }}>
            ✦ Premium Resume Builder
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Get Hired with a<br /><span className="text-gradient">Standout Resume</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-3)', maxWidth: '620px', margin: '0 auto 3rem', lineHeight: 1.7, fontWeight: '500' }}>
            Choose from professionally designed, ATS-friendly templates.
            Join <strong style={{ color: 'var(--text-2)' }}>10,000+ students</strong> who landed their dream jobs using JobAdda resumes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register" className="btn btn-primary btn-lg" style={{ borderRadius: '14px', fontWeight: '800', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Build Your Resume Now <ArrowRight size={20} />
            </a>
            <a href="#templates" className="btn btn-outline btn-lg" style={{ borderRadius: '14px', fontWeight: '700', padding: '1rem 2rem' }}>
              See Templates
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="grid-4" style={{ gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2.5rem 2rem', textAlign: 'center', transition: 'transform 0.25s, box-shadow 0.25s' }}>
                <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#fff', boxShadow: '0 10px 25px rgba(99,102,241,0.25)' }}>
                  <f.icon size={26} strokeWidth={2.5} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-3)', lineHeight: 1.6, fontWeight: '500', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES SHOWCASE ───────────────────── */}
      <section id="templates" className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)', borderRadius: '30px', padding: '0.35rem 1rem', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              3 UNIQUE TEMPLATES
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
              Pick Your <span className="text-gradient">Style</span>
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
              Every template is crafted by designers and tested by recruiters.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {TEMPLATES.map((t) => (
              <div key={t.id} style={{ borderRadius: '24px', overflow: 'hidden', border: `2px solid ${t.popular ? t.borderColor : 'var(--border)'}`, boxShadow: t.popular ? `0 0 50px ${t.glowColor}` : '0 4px 20px rgba(0,0,0,0.08)', position: 'relative', background: 'var(--bg-2)', transition: 'transform 0.3s' }}>
                
                {/* Card Header */}
                <div style={{ padding: '1rem 2rem', background: 'var(--bg-2)', borderBottom: `1px solid ${t.popular ? t.borderColor + '40' : 'var(--border)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ ...t.badgeStyle, padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '0.08em' }}>
                      {t.badge}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '2rem', fontWeight: '900', color: t.accentColor, lineHeight: 1 }}>
                        {t.price === 0 ? 'FREE' : `₹${t.price}`}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', textDecoration: 'line-through', fontWeight: '600', marginTop: '0.15rem' }}>₹{t.oldPrice}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: '600', letterSpacing: '0.03em' }}>{t.subtitle}</div>
                  </div>
                </div>

                {/* Template Preview */}
                <div style={{ height: '480px', overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                  <div style={{ transform: 'scale(0.45)', transformOrigin: 'top left', width: '222%' }}>
                    <t.Component p={MOCK_PROFILE} config={MOCK_CONFIG} unlocked={true} accentColor={t.accentColor} {...t.componentProps} />
                  </div>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 65%, var(--bg-2) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                    <a href="/user/resume" style={{ background: t.accentColor, color: '#fff', padding: '0.6rem 1.75rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '800', textDecoration: 'none', boxShadow: `0 8px 20px ${t.accentColor}40`, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      Use This Template <ArrowRight size={15} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────── */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(99,102,241,0.05) 0%, transparent 70%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)', borderRadius: '30px', padding: '0.35rem 1rem', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              SIMPLE PRICING
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
              Invest in Your <span className="text-gradient">Career</span>
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
              One-time payment unlocks a 5-minute download window — no subscription, no hidden fees.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto', alignItems: 'center' }}>
            {TEMPLATES.map((t) => (
              <div key={t.id} style={{
                borderRadius: '28px',
                padding: '2.75rem 2.5rem',
                position: 'relative',
                border: t.popular ? `2px solid ${t.borderColor}` : '1px solid var(--border)',
                background: t.popular ? `linear-gradient(160deg, var(--primary) 0%, var(--accent) 100%)` : 'var(--bg-2)',
                color: t.popular ? '#fff' : 'inherit',
                transform: t.popular ? 'scale(1.06)' : 'scale(1)',
                boxShadow: t.popular ? `0 30px 70px ${t.glowColor}` : '0 10px 30px rgba(0,0,0,0.06)',
                zIndex: t.popular ? 2 : 1,
                transition: 'transform 0.3s'
              }}>
                {t.popular && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#fff', color: 'var(--primary)', padding: '0.4rem 1.25rem', borderRadius: '30px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '0.08em', boxShadow: '0 5px 20px rgba(0,0,0,0.12)', whiteSpace: 'nowrap' }}>
                    ⭐ BEST VALUE
                  </div>
                )}

                {/* Plan Icon */}
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', background: t.popular ? 'rgba(255,255,255,0.15)' : `${t.accentColor}18`, color: t.popular ? '#fff' : t.accentColor }}>
                  {t.id === 'TPL_1' && <Layers size={24} strokeWidth={2.5} />}
                  {t.id === 'TPL_2' && <Palette size={24} strokeWidth={2.5} />}
                  {t.id === 'TPL_3' && <Crown size={24} strokeWidth={2.5} />}
                </div>

                <div style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.2rem' }}>{t.name}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: t.popular ? 'rgba(255,255,255,0.7)' : 'var(--text-3)', marginBottom: '1.75rem', letterSpacing: '0.03em' }}>{t.subtitle}</div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.05em', lineHeight: 1 }}>
                    {t.price === 0 ? 'FREE' : `₹${t.price}`}
                  </span>
                  <span style={{ fontSize: '1.1rem', color: t.popular ? 'rgba(255,255,255,0.45)' : 'var(--text-3)', textDecoration: 'line-through', fontWeight: '600' }}>₹{t.oldPrice}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: t.popular ? 'rgba(255,255,255,0.65)' : 'var(--text-3)', fontWeight: '600', marginBottom: '2rem' }}>One-time payment</div>

                <div style={{ height: '1px', background: t.popular ? 'rgba(255,255,255,0.15)' : 'var(--border)', marginBottom: '2rem' }} />

                {/* <div style={{ fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.1em', color: t.popular ? 'rgba(255,255,255,0.8)' : t.accentColor, marginBottom: '1rem', textTransform: 'uppercase' }}>
                  {t.highlight}
                </div> */}

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {t.features.map((feat, fi) => {
                    const Icon = t.featureIcons[fi];
                    return (
                      <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '0.95rem', fontWeight: '600', color: t.popular ? '#fff' : 'var(--text-2)' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: t.popular ? 'rgba(255,255,255,0.15)' : `${t.accentColor}18`, color: t.popular ? '#fff' : t.accentColor }}>
                          <Icon size={15} strokeWidth={2.5} />
                        </div>
                        {feat}
                      </li>
                    );
                  })}
                </ul>

                <a href="/login" style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '1rem 1.5rem',
                  borderRadius: '16px',
                  fontWeight: '900',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  background: t.popular ? '#fff' : t.accentColor,
                  color: t.popular ? 'var(--primary)' : '#fff',
                  boxShadow: t.popular ? '0 10px 25px rgba(0,0,0,0.15)' : `0 10px 25px ${t.accentColor}40`,
                  letterSpacing: '-0.01em',
                  transition: 'opacity 0.2s, transform 0.2s'
                }}>
                  {t.price === 0 ? 'Get it Free' : `Start with ${t.name}`}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ borderRadius: '32px', padding: '5rem 3rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(236,72,153,0.05))', border: '1px solid rgba(99,102,241,0.15)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.1), transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                Ready to Land Your <span className="text-gradient">Dream Job?</span>
              </h2>
              <p style={{ color: 'var(--text-3)', fontSize: '1.1rem', maxWidth: '550px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                Your next opportunity starts with a great resume. The Basic template is <strong style={{ color: 'var(--text-2)' }}>completely free</strong> — no card required.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/register" className="btn btn-primary btn-lg" style={{ borderRadius: '14px', fontWeight: '800', padding: '1rem 2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Get Started Free <ArrowRight size={20} />
                </a>
                <a href="#templates" className="btn btn-outline btn-lg" style={{ borderRadius: '14px', fontWeight: '700', padding: '1rem 2rem' }}>
                  Browse Templates
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
