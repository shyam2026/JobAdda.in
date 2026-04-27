import React from 'react';
import { Shield, Lock, Eye, FileText, Mail, Phone, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const sections = [
    { 
      icon: <FileText size={20} />, 
      title: 'Information We Collect', 
      content: 'We collect information you provide during registration (name, email, password), profile data (bio, skills, education, experience), and usage data (jobs viewed, applications submitted, referrals made).' 
    },
    { 
      icon: <Eye size={20} />, 
      title: 'How We Use Your Information', 
      content: 'Your data is used to match you with relevant job opportunities, power the referral system, improve our platform, and send important notifications about your applications.' 
    },
    { 
      icon: <Shield size={20} />, 
      title: 'Data Security', 
      content: 'All passwords are hashed using industry-standard encryption (bcrypt). We use HTTPS for all data transmission and strictly enforce access controls. We never sell your personal data to third parties.' 
    },
    { 
      icon: <Lock size={20} />, 
      title: 'Referral Data & Privacy', 
      content: 'When you use a referral link, we record the relationship to credit bonuses. To protect your privacy, we do not disclose the full identity of referrers to new signups unless necessary.' 
    },
    { 
      icon: <Shield size={20} />, 
      title: 'Your Data Rights', 
      content: 'You have the right to access, update, or delete your data at any time. You can request full account deletion through your dashboard or by contacting our support team.' 
    }
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ padding: '6rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <div className="badge badge-primary" style={{ marginBottom: '1.25rem' }}>Legal Transparency</div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>Privacy <span className="text-gradient">Policy</span></h1>
            <p style={{ color: 'var(--text-3)', fontSize: '1.05rem' }}>Last updated: April 27, 2026</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '5rem' }}>
            {sections.map((s, i) => (
              <div key={i} className="card card-p" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Questions about your privacy?</h3>
            <p style={{ color: 'var(--text-2)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
              Our data protection team is here to help you understand how your information is kept safe.
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
                Go to Contact Page <ChevronRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
