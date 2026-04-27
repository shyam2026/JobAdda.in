'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Download, FileText, Briefcase, Book, Award, Loader2, Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

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

export default function UserResumePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [template, setTemplate] = useState('modern');
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 300);
  };

  const user = session?.user as any;
  const tColor = TEMPLATES.find(t => t.id === template)?.color || '#6366f1';

  if (loading) {
    return <div className="skeleton" style={{ height: '600px' }} />;
  }

  const incomplete = !profile?.bio && !profile?.skills?.length && !profile?.education?.[0]?.school;

  return (
    <div className="anim-fade-up">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={24} /> Resume Builder
          </h2>
          <p style={{ margin: 0, color: 'var(--text-3)' }}>Automatically generated from your profile.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a href="/user/profile" className="btn btn-outline btn-sm">Edit Data</a>
          <button onClick={handlePrint} className="btn btn-primary btn-sm" disabled={downloading}>
            {downloading ? <Loader2 size={16} className="spin" /> : <Download size={16} />} Download PDF
          </button>
        </div>
      </header>

      {incomplete && (
        <div className="card card-p-sm" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.25rem' }}>💡</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', margin: 0, flex: 1 }}>Your resume looks a bit empty. <a href="/user/profile" style={{ color: 'var(--primary-light)', fontWeight: '700' }}>Complete your profile</a> to generate a professional resume.</p>
        </div>
      )}

      {/* Template Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={`tag ${template === t.id ? 'active' : ''}`}
            style={{ 
              whiteSpace: 'nowrap', 
              borderColor: template === t.id ? t.color : 'var(--border)',
              color: template === t.id ? t.color : 'var(--text-3)',
              background: template === t.id ? `${t.color}10` : 'transparent'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Resume Preview */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', maxWidth: '800px', margin: '0 auto', background: 'white', color: '#1a1a2e' }} id="resume-preview">
        {/* Header */}
        <div style={{ background: tColor, color: 'white', padding: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem' }}>{user?.name || 'Your Name'}</h1>
          <p style={{ margin: '0 0 1.5rem', opacity: 0.9, lineHeight: '1.6', fontSize: '0.95rem' }}>{profile?.bio}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', opacity: 0.9 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={12} />{user?.email}</span>
            {profile?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={12} />{profile.phone}</span>}
            {profile?.city && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={12} />{profile.city}</span>}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div className="grid-2" style={{ gap: '2.5rem' }}>
            <section>
              <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: tColor, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${tColor}20`, paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>Experience</h2>
              {profile?.experience?.filter(e => e.company).map((exp, i) => (
                <div key={i} style={{ marginBottom: '1.25rem', borderLeft: `2px solid ${tColor}40`, paddingLeft: '1rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{exp.role}</div>
                  <div style={{ color: tColor, fontSize: '0.8rem', fontWeight: '600' }}>{exp.company}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666', margin: '0.2rem 0 0.5rem' }}>{exp.duration}</div>
                  <p style={{ fontSize: '0.8rem', color: '#444', lineHeight: '1.5', margin: 0 }}>{exp.description}</p>
                </div>
              ))}
            </section>

            <section>
              <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: tColor, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${tColor}20`, paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>Education</h2>
              {profile?.education?.filter(e => e.school).map((edu, i) => (
                <div key={i} style={{ marginBottom: '1rem', borderLeft: `2px solid ${tColor}40`, paddingLeft: '1rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{edu.degree}</div>
                  <div style={{ color: tColor, fontSize: '0.8rem', fontWeight: '600' }}>{edu.school}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{edu.year} · {edu.grade}</div>
                </div>
              ))}
            </section>
          </div>

          <div className="grid-2" style={{ gap: '2.5rem' }}>
            <section>
              <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: tColor, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${tColor}20`, paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {profile?.skills?.map(s => (
                  <span key={s} style={{ background: `${tColor}10`, color: tColor, borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: '600', border: `1px solid ${tColor}20` }}>{s}</span>
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: tColor, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${tColor}20`, paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>Certifications</h2>
              {profile?.certificates?.filter(c => c.name).map((cert, i) => (
                <div key={i} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{cert.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{cert.issuer} · {cert.date}</div>
                </div>
              ))}
            </section>
          </div>
        </div>

        <div style={{ padding: '1rem', background: '#f8fafc', textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0' }}>
          Generated via JobAdda.in
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden !important; }
          #resume-preview, #resume-preview * { visibility: visible !important; }
          #resume-preview { position: fixed; left: 0; top: 0; width: 100%; box-shadow: none !important; border-radius: 0 !important; }
          .dashboard-layout, .sidebar, .navbar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
