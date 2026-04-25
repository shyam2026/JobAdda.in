'use client';

import React from 'react';
import Link from 'next/link';

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  'For Job Seekers': [
    { label: 'Browse Jobs', href: '/jobs' },
    { label: 'Build Resume', href: '/resume' },
    { label: 'Salary Guide', href: '/salary' },
    { label: 'Refer & Earn', href: '/refer' },
  ],
  'For Employers': [
    { label: 'Post a Job', href: '/company/register' },
    { label: 'Recruiter Login', href: '/login' },
    { label: 'Company Dashboard', href: '/company/dashboard' },
    { label: 'View Pricing', href: '/company/pricing' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const SOCIAL_LINKS = [
  { icon: '𝕏', href: 'https://twitter.com', label: 'Twitter' },
  { icon: 'in', href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: 'f', href: 'https://facebook.com', label: 'Facebook' },
  { icon: '▶', href: 'https://youtube.com', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', fontSize: '1.1rem' }}>J</div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>JobAdda<span style={{ color: '#818cf8' }}>.in</span></span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.8', maxWidth: '240px', color: 'var(--text-3)' }}>
              India's fastest growing job portal connecting talent with opportunity.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{ width: '34px', height: '34px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-3)', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#818cf8'; (e.currentTarget as HTMLElement).style.borderColor = '#818cf8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{ marginBottom: '1.25rem', color: 'var(--text)', fontSize: '0.95rem', fontWeight: '700' }}>{heading}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map(l => (
                  <Link
                    key={l.label}
                    href={l.href}
                    style={{ fontSize: '0.88rem', color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#818cf8'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', margin: 0 }}>© 2026 JobAdda.in — All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy" style={{ fontSize: '0.85rem', color: 'var(--text-3)', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: '0.85rem', color: 'var(--text-3)', textDecoration: 'none' }}>Terms</Link>
            <Link href="/contact" style={{ fontSize: '0.85rem', color: 'var(--text-3)', textDecoration: 'none' }}>Contact</Link>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', margin: 0 }}>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
