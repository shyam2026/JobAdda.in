import React from 'react';
import { FileCheck, UserCheck, Search, Zap, Ban, LogOut, RefreshCcw, Mail, Phone, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const sections = [
    { 
      icon: <FileCheck size={20} />, 
      title: 'Acceptance of Terms', 
      content: 'By accessing or using JobAdda.in, you agree to be bound by these Terms of Service. If you do not agree to any part of these terms, you must not use our platform or services.' 
    },
    { 
      icon: <UserCheck size={20} />, 
      title: 'User Responsibilities', 
      content: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and truthful information. Accounts found using fake identities or fraudulent data will be permanently banned.' 
    },
    { 
      icon: <Search size={20} />, 
      title: 'Job Listings & Accuracy', 
      content: 'While JobAdda.in verifies employer accounts, we do not guarantee the absolute accuracy of every job listing. Users are advised to exercise due diligence before sharing sensitive information with any employer.' 
    },
    { 
      icon: <Zap size={20} />, 
      title: 'Referral Program Policy', 
      content: 'The referral bonus (Upto ₹50) is credited only when a referred user successfully completes their first job application. We reserve the right to withhold bonuses if we detect bot traffic or fraudulent behavior.' 
    },
    { 
      icon: <Ban size={20} />, 
      title: 'Prohibited Activities', 
      content: 'Users are strictly prohibited from scraping data, sending spam, posting malicious content, or using the platform for any illegal purpose. Such actions will result in immediate termination of the account.' 
    },
    { 
      icon: <RefreshCcw size={20} />, 
      title: 'Changes to Terms', 
      content: 'We may update these terms from time to time to reflect changes in our services or legal requirements. Continued use of JobAdda.in after such updates constitutes your acceptance of the revised terms.' 
    }
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '700px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ padding: '6rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <div className="badge badge-primary" style={{ marginBottom: '1.25rem' }}>Service Guidelines</div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>Terms of <span className="text-gradient">Service</span></h1>
            <p style={{ color: 'var(--text-3)', fontSize: '1.05rem' }}>Last updated: April 27, 2026</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '5rem' }}>
            {sections.map((s, i) => (
              <div key={i} className="card card-p" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99,102,241,0.08)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: '700' }}>{s.title}</h3>
                  <p style={{ lineHeight: '1.8', color: 'var(--text-2)', margin: 0, fontSize: '1rem' }}>{s.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Card */}
          <div className="card card-p-lg" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(236,72,153,0.05))', border: '1px solid rgba(99,102,241,0.15)', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Need clarification on these terms?</h3>
            <p style={{ color: 'var(--text-2)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
              We believe in transparency. If any part of our terms is unclear, please reach out to us directly.
            </p>
            
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={16} />
                </div>
                <a href="mailto:info@jobadda.in" style={{ color: 'var(--text)', fontWeight: '600', textDecoration: 'none' }}>info@jobadda.in</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(236,72,153,0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={16} />
                </div>
                <a href="tel:+917042478224" style={{ color: 'var(--text)', fontWeight: '600', textDecoration: 'none' }}>+91 7042478224</a>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
              <Link href="/contact" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                Contact Support <ChevronRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
