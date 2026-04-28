'use client';

import React from 'react';
import { Check, Zap, Shield, Clock, ArrowRight, Star, Award, Download, Eye } from 'lucide-react';
import Template1 from '../user/resume/Template1';
import Template2 from '../user/resume/Template2';
import Template3 from '../user/resume/Template3';

const MOCK_PROFILE = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  city: 'New Delhi, India',
  bio: 'Results-driven Senior Software Engineer with over 6 years of experience in full-stack development. Expert in building high-performance web applications using React, Next.js, and Node.js. Proven track record of leading teams and delivering scalable solutions for enterprise clients.',
  skills: ['JavaScript (ES6+)', 'React.js', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  experience: [
    {
      role: 'Lead Full Stack Developer',
      company: 'Global Tech Solutions',
      duration: 'Jan 2021 - Present',
      description: 'Architected and implemented a microservices-based architecture for a fintech platform, reducing server costs by 30% and improving load times by 50%.'
    },
    {
      role: 'Software Engineer',
      company: 'Innovate Systems',
      duration: 'June 2018 - Dec 2020',
      description: 'Developed key features for a customer-facing dashboard used by 50k+ daily users. Optimized database queries which improved system performance by 25%.'
    }
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      school: 'Delhi Technological University',
      year: '2018',
      grade: '8.8 CGPA'
    }
  ],
  projects: [
    {
      title: 'E-commerce Platform',
      description: 'Built a scalable e-commerce site with integrated payment gateway and inventory management.',
      link: '#'
    }
  ],
  linkedin: 'linkedin.com/in/rahulsharma',
  github: 'github.com/rahulsharma'
};

const MOCK_CONFIG = {
  showBio: true,
  showEmail: true,
  showPhone: true,
  showSocials: true,
  showSkills: true,
  showExp: true,
  showEdu: true,
  showProjects: true
};

const FEATURES = [
  { icon: Zap, title: 'Instant Generation', desc: 'Create your professional resume in less than 60 seconds.' },
  { icon: Shield, title: 'ATS Friendly', desc: 'Our templates are designed to pass through Applicant Tracking Systems.' },
  { icon: Award, title: 'Premium Designs', desc: 'Stand out from the crowd with our hand-crafted, modern layouts.' },
  { icon: Clock, title: '5-Min Access', desc: 'Pay once and get a 5-minute window to download your perfect PDF.' }
];

const PRICING = [
  { id: 'TPL_1', name: 'Basic', price: 0, oldPrice: 15, tag: '100% OFF', color: '#10b981', popular: false },
  { id: 'TPL_2', name: 'Professional', price: 15, oldPrice: 30, tag: '50% OFF', color: '#6366f1', popular: true },
  { id: 'TPL_3', name: 'Premium', price: 25, oldPrice: 50, tag: '50% OFF', color: '#f59e0b', popular: false }
];

export default function PublicResumePage() {
  return (
    <div className="anim-fade-up">
      {/* Hero Section */}
      <section style={{ padding: '6rem 0 4rem', textAlign: 'center', background: 'radial-gradient(circle at top, rgba(99,102,241,0.08) 0%, transparent 70%)' }}>
        <div className="container">
          <div className="badge badge-primary mb-4">New: Premium Resume Builder</div>
          <h1 style={{ marginBottom: '1.5rem' }}>Get Hired with a <span className="text-gradient">Standout Resume</span></h1>
          <p className="hero-subtitle" style={{ maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            Choose from our professionally designed, ATS-friendly templates. 
            Join 10,000+ students who secured their dream jobs using JobAdda resumes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register" className="btn btn-primary btn-lg">Build Your Resume Now <ArrowRight size={20} /></a>
            <a href="#templates" className="btn btn-outline btn-lg">View Templates</a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-surface/30">
        <div className="container">
          <div className="grid-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="card p-6 text-center">
                <div style={{ width: '50px', height: '50px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary-light)' }}>
                  <f.icon size={24} />
                </div>
                <h3 className="mb-2">{f.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="section">
        <div className="container">
          <div className="section-title">
            <h2>Pick Your <span className="text-gradient">Style</span></h2>
            <p>Select the template that fits your career goals.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            
            {/* Template 1 Preview */}
            <div className="card overflow-hidden" style={{ position: 'relative', border: '1px solid var(--border)' }}>
              <div className="p-5 bg-surface/50 border-bottom" style={{ backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                  <div className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.25rem 0.6rem', fontWeight: '800' }}>FREE OFFER</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text)', lineHeight: 1 }}>₹0</div>
                </div>
                <div className="flex-between" style={{ alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Basic</div>
                  <div className="text-muted" style={{ fontSize: '0.85rem', textDecoration: 'line-through', fontWeight: '600' }}>₹15</div>
                </div>
              </div>
              <div style={{ height: '520px', overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
                <div style={{ transform: 'scale(0.45)', transformOrigin: 'top left', width: '222%' }}>
                  <Template1 p={MOCK_PROFILE} config={MOCK_CONFIG} unlocked={true} />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 80%, var(--bg) 100%)' }} />
              </div>
            </div>

            {/* Template 2 Preview */}
            <div className="card overflow-hidden" style={{ position: 'relative', border: '2px solid var(--primary)', boxShadow: '0 0 40px rgba(99,102,241,0.2)' }}>
              <div className="p-5 bg-surface/50 border-bottom" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), transparent)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                  <div className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.25rem 0.6rem', fontWeight: '800' }}>MOST POPULAR</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)', lineHeight: 1 }}>₹15</div>
                </div>
                <div className="flex-between" style={{ alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Professional</div>
                  <div className="text-muted" style={{ fontSize: '0.85rem', textDecoration: 'line-through', fontWeight: '600' }}>₹30</div>
                </div>
              </div>
              <div style={{ height: '520px', overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
                <div style={{ transform: 'scale(0.45)', transformOrigin: 'top left', width: '222%' }}>
                  <Template2 p={MOCK_PROFILE} config={MOCK_CONFIG} unlocked={true} accentColor="#6366f1" />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 80%, var(--bg) 100%)' }} />
              </div>
            </div>

            {/* Template 3 Preview */}
            <div className="card overflow-hidden" style={{ position: 'relative', border: '1px solid var(--border)' }}>
              <div className="p-5 bg-surface/50 border-bottom" style={{ backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                  <div className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.25rem 0.6rem', fontWeight: '800' }}>PREMIUM CHOICE</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text)', lineHeight: 1 }}>₹25</div>
                </div>
                <div className="flex-between" style={{ alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Executive Gold</div>
                  <div className="text-muted" style={{ fontSize: '0.85rem', textDecoration: 'line-through', fontWeight: '600' }}>₹50</div>
                </div>
              </div>
              <div style={{ height: '520px', overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
                <div style={{ transform: 'scale(0.45)', transformOrigin: 'top left', width: '222%' }}>
                  <Template3 p={MOCK_PROFILE} config={MOCK_CONFIG} unlocked={true} />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 80%, var(--bg) 100%)' }} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="section bg-surface/30" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '4rem' }}>
            <div className="badge badge-primary mb-3">Flexible Plans</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Invest in Your <span className="text-gradient">Career</span></h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-3)' }}>Choose the plan that matches your professional ambitions.</p>
          </div>
          
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            {PRICING.map(p => (
              <div key={p.id} className="card p-10 text-center" style={{ 
                border: 'none',
                background: p.popular 
                  ? 'linear-gradient(145deg, var(--primary), var(--accent))' 
                  : 'var(--bg-2)',
                color: p.popular ? '#fff' : 'inherit',
                transform: p.popular ? 'scale(1.08)' : 'none',
                boxShadow: p.popular ? '0 30px 60px rgba(99,102,241,0.3)' : '0 15px 35px rgba(0,0,0,0.1)',
                position: 'relative',
                zIndex: p.popular ? 2 : 1,
                borderRadius: '24px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                {p.popular && (
                  <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#fff', color: 'var(--primary)', padding: '0.5rem 1.25rem', borderRadius: '30px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '0.1em', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                    BEST VALUE
                  </div>
                )}
                
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.02em' }}>{p.name}</h3>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: p.popular ? 'rgba(255,255,255,0.8)' : p.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
                  {p.tag}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '-0.05em' }}>₹{p.price}</span>
                  <span style={{ fontSize: '1.25rem', color: p.popular ? 'rgba(255,255,255,0.5)' : 'var(--text-3)', textDecoration: 'line-through' }}>₹{p.oldPrice}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: p.popular ? 'rgba(255,255,255,0.7)' : 'var(--text-3)', marginBottom: '2.5rem', fontWeight: '600' }}>One-time payment</div>
                
                <div style={{ height: '1px', background: p.popular ? 'rgba(255,255,255,0.15)' : 'var(--border)', margin: '0 0 2rem' }} />

                <ul style={{ textAlign: 'left', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { label: 'ATS Friendly Layout', icon: Shield },
                    { label: '5-Min Download Window', icon: Clock },
                    { label: 'No JobAdda Branding', icon: Star },
                    { label: 'No Watermark', icon: Eye },
                    { label: 'High-Res PDF Export', icon: Download }
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem', fontWeight: '600', color: p.popular ? '#fff' : 'var(--text-2)' }}>
                      <div style={{ 
                        background: p.popular ? 'rgba(255,255,255,0.15)' : 'rgba(16,185,129,0.1)', 
                        color: p.popular ? '#fff' : '#10b981', 
                        padding: '6px', 
                        borderRadius: '10px', 
                        display: 'flex' 
                      }}>
                        <item.icon size={16} strokeWidth={2.5} />
                      </div>
                      {item.label}
                    </li>
                  ))}
                </ul>

                <a href="/login" className={`btn btn-lg w-full`} style={{ 
                  borderRadius: '16px', 
                  fontWeight: '900',
                  padding: '1.25rem',
                  fontSize: '1rem',
                  background: p.popular ? '#fff' : 'var(--primary)',
                  color: p.popular ? 'var(--primary)' : '#fff',
                  border: 'none',
                  boxShadow: p.popular ? '0 10px 20px rgba(0,0,0,0.15)' : '0 10px 20px rgba(99,102,241,0.2)',
                  transition: 'transform 0.2s'
                }}>
                  Start with {p.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container">
          <div className="card card-p-lg text-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.1))' }}>
            <h2 className="mb-4">Ready to Land Your Dream Job?</h2>
            <p className="mb-8 text-muted" style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Create your professional resume today and get noticed by top recruiters. 
              The first template is currently FREE!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a href="/register" className="btn btn-primary btn-lg">Get Started Free</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
