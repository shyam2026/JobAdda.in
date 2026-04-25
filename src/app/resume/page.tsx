'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Download, FileText, User, Book, Briefcase, Award, Loader2, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ProfileData {
  bio: string;
  phone: string;
  city: string;
  linkedin: string;
  github: string;
  skills: string[];
  education: { school: string; degree: string; year: string; grade: string }[];
  experience: { company: string; role: string; duration: string; description: string }[];
  certificates: { name: string; issuer: string; date: string; url: string }[];
}

const TEMPLATES = [
  { id: 'modern', label: 'Modern', color: '#6366f1' },
  { id: 'classic', label: 'Classic', color: '#1e293b' },
  { id: 'elegant', label: 'Elegant', color: '#10b981' },
];

export default function ResumeBuilderPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [template, setTemplate] = useState('modern');
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile')
        .then(r => r.json())
        .then(data => { setProfile(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  const handlePrint = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 300);
  };

  const user = session?.user as { name?: string | null; email?: string | null } | undefined;
  const tColor = TEMPLATES.find(t => t.id === template)?.color || '#6366f1';

  if (status === 'loading' || loading) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-3)' }}>Loading your resume data...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1.5rem' }}>
        <FileText size={48} style={{ color: 'var(--text-3)', opacity: 0.4 }} />
        <h3>Sign in to use the Resume Builder</h3>
        <a href="/login" className="btn btn-primary">Sign In</a>
      </div>
    );
  }

  const incomplete = !profile?.bio && !profile?.skills?.length && !profile?.education?.[0]?.school;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0 4rem' }}>
      <div className="container">
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={24} /> Resume Builder
            </h2>
            <p style={{ margin: 0, color: 'var(--text-3)' }}>Your profile data is automatically loaded</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="/profile" className="btn btn-outline btn-sm">Edit Profile Data</a>
            <button
              onClick={handlePrint}
              disabled={downloading}
              className="btn btn-primary"
              style={{ gap: '0.5rem' }}
            >
              {downloading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={16} />}
              Download PDF
            </button>
          </div>
        </div>

        {/* Template Selector */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>Template:</span>
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              style={{
                padding: '0.4rem 1rem', borderRadius: 'var(--radius)',
                border: `2px solid ${template === t.id ? t.color : 'var(--border)'}`,
                background: template === t.id ? `${t.color}15` : 'var(--surface)',
                color: template === t.id ? t.color : 'var(--text-3)',
                fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {incomplete && (
          <div style={{ padding: '1.25rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <strong>Your profile is incomplete.</strong>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-3)' }}>Fill in your bio, skills, and education for a complete resume.</p>
            </div>
            <a href="/profile" className="btn btn-primary btn-sm">Complete Profile</a>
          </div>
        )}

        {/* Resume Preview — printable */}
        <div
          ref={resumeRef}
          id="resume-preview"
          style={{
            background: 'white',
            color: '#1a1a2e',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {/* Header */}
          <div style={{ background: tColor, color: 'white', padding: '2.5rem 2.5rem 2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>
              {user?.name || 'Your Name'}
            </h1>
            {profile?.bio && (
              <p style={{ margin: '0 0 1.25rem', opacity: 0.9, lineHeight: '1.6', fontSize: '0.95rem' }}>{profile.bio}</p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', opacity: 0.9 }}>
              {user?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={13} />{user.email}</span>}
              {profile?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={13} />{profile.phone}</span>}
              {profile?.city && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={13} />{profile.city}</span>}
              {profile?.linkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Globe size={13} />{profile.linkedin}</span>}
              {profile?.github && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Globe size={13} />{profile.github}</span>}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem' }}>
            {/* Left column */}
            <div>
              {/* Experience */}
              {profile?.experience?.some(e => e.company) && (
                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: '800', color: tColor, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${tColor}20`, paddingBottom: '0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={15} /> Experience
                  </h2>
                  {profile.experience.filter(e => e.company).map((exp, i) => (
                    <div key={i} style={{ marginBottom: '1.25rem', paddingLeft: '1rem', borderLeft: `3px solid ${tColor}40` }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{exp.role}</div>
                      <div style={{ color: tColor, fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.25rem' }}>{exp.company}</div>
                      {exp.duration && <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>{exp.duration}</div>}
                      {exp.description && <p style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.6', margin: 0 }}>{exp.description}</p>}
                    </div>
                  ))}
                </section>
              )}

              {/* Education */}
              {profile?.education?.some(e => e.school) && (
                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: '800', color: tColor, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${tColor}20`, paddingBottom: '0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Book size={15} /> Education
                  </h2>
                  {profile.education.filter(e => e.school).map((edu, i) => (
                    <div key={i} style={{ marginBottom: '1rem', paddingLeft: '1rem', borderLeft: `3px solid ${tColor}40` }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{edu.degree}</div>
                      <div style={{ color: tColor, fontSize: '0.88rem', fontWeight: '600' }}>{edu.school}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>{edu.year}{edu.grade && ` · ${edu.grade}`}</div>
                    </div>
                  ))}
                </section>
              )}
            </div>

            {/* Right column */}
            <div>
              {/* Skills */}
              {profile?.skills && profile.skills.length > 0 && (
                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '0.9rem', fontWeight: '800', color: tColor, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${tColor}20`, paddingBottom: '0.4rem', marginBottom: '1rem' }}>
                    Skills
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {profile.skills.map(s => (
                      <span key={s} style={{ background: `${tColor}12`, color: tColor, border: `1px solid ${tColor}30`, borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontWeight: '600' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Certificates */}
              {profile?.certificates?.some(c => c.name) && (
                <section>
                  <h2 style={{ fontSize: '0.9rem', fontWeight: '800', color: tColor, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${tColor}20`, paddingBottom: '0.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={13} /> Certificates
                  </h2>
                  {profile.certificates.filter(c => c.name).map((cert, i) => (
                    <div key={i} style={{ marginBottom: '0.85rem' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{cert.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#666' }}>{cert.issuer}{cert.date && ` · ${cert.date}`}</div>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '1rem 2.5rem', background: `${tColor}08`, borderTop: `1px solid ${tColor}20`, textAlign: 'center', fontSize: '0.75rem', color: '#888' }}>
            Generated by JobAdda.in · jobadda.in
          </div>
        </div>

        {/* Print styles */}
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            #resume-preview, #resume-preview * { visibility: visible !important; }
            #resume-preview { 
              position: fixed; left: 0; top: 0; width: 100%; 
              box-shadow: none !important;
              border-radius: 0 !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
