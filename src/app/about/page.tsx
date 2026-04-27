import React from 'react';
import { Target, Users, Zap, Shield, Briefcase, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      
      {/* HERO SECTION */}
      <section style={{ 
        padding: '8rem 0 5rem', 
        position: 'relative', 
        overflow: 'hidden',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge badge-primary" style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            About JobAdda.in
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto 1.5rem', lineHeight: 1.1 }}>
            Empowering India's <span className="text-gradient">Next-Gen</span> Workforce
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-2)', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: '1.8' }}>
            We're on a mission to democratize job hunting in India. By blending AI-driven job matching, instant resume generation, and a unique peer-to-peer referral economy, we are building more than a portal—we are building a career ecosystem.
          </p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid-4" style={{ textAlign: 'center' }}>
            {[
              { val: '50,000+', lbl: 'Active Verified Jobs' },
              { val: '5 Lakh+', lbl: 'Registered Candidates' },
              { val: '10,000+', lbl: 'Partner Companies' },
              { val: 'Upto ₹50', lbl: 'Reward Per Referral' },
            ].map(s => (
              <div key={s.lbl} className="stat-item" style={{ padding: '1rem' }}>
                <div className="stat-val" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{s.val}</div>
                <div className="stat-lbl" style={{ color: 'var(--text-3)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '3rem', alignItems: 'center' }}>
            <div className="card card-p-lg" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), transparent)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', marginBottom: '1.5rem' }}>
                <Target size={24} />
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Our Mission</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                To bridge the gap between talented professionals and forward-thinking companies. We aim to remove the friction from hiring by providing a transparent, intuitive platform where skills meet opportunity instantly, without the noise of traditional job boards.
              </p>
            </div>

            <div className="card card-p-lg" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.05), transparent)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Our Vision</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                To become the central hub for India's digital workforce. A place where every individual not only finds their dream job but also possesses the tools to build their brand, network seamlessly, and earn through our decentralized referral network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section" style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-title" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem' }}>What Makes Us <span className="text-gradient">Different</span></h2>
            <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'var(--text-2)' }}>JobAdda is not just another job board. It is a comprehensive suite designed to empower your entire career lifecycle.</p>
          </div>

          <div className="grid-3">
            {[
              { icon: Shield, title: '100% Verified Ecosystem', desc: 'No fake jobs. No spam companies. Every single listing and employer on JobAdda goes through a rigorous manual verification process to ensure absolute safety for our candidates.' },
              { icon: Users, title: 'The Referral Economy', desc: 'Why should recruiting agencies take all the cut? We decentralized hiring. Refer your friends to JobAdda and earn real cash (Upto ₹50 per referral) directly to your wallet when they apply.' },
              { icon: Briefcase, title: 'Smart Auto-Resume', desc: 'Stop spending hours formatting Word documents. Build a comprehensive profile once, and our engine will instantly generate a premium, ATS-friendly PDF resume with one click.' }
            ].map((feature, i) => (
              <div key={i} className="card card-p" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.05 }}>
                  <feature.icon size={80} />
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                  <feature.icon size={22} />
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{feature.title}</h4>
                <p style={{ color: 'var(--text-3)', lineHeight: '1.7', fontSize: '0.95rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '6rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="card card-p-lg" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.05))', border: '1px solid rgba(99,102,241,0.2)', maxWidth: '900px', margin: '0 auto' }}>
            <Award size={48} style={{ color: 'var(--primary-light)', margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1.5rem' }}>Ready to Accelerate Your Career?</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
              Join hundreds of thousands of professionals who have already upgraded their job search experience. Registration takes less than 60 seconds.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary btn-lg" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                Join JobAdda Now <ArrowRight size={18} />
              </Link>
              <Link href="/jobs" className="btn btn-outline btn-lg" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
