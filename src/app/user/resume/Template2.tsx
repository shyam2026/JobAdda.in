import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

export default function Template2({ p, config, unlocked, accentColor }: { p: any; config: any; unlocked: boolean; accentColor: string }) {
  return (
    <div style={{ background: '#fff', color: '#111', fontFamily: "'Inter', sans-serif", minHeight: '1122px', position: 'relative' }}>

      {/* Watermark */}
      {!unlocked && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '8rem', fontWeight: 900, color: `${accentColor}12`, transform: 'rotate(-40deg)', whiteSpace: 'nowrap', userSelect: 'none' }}>
            JobAdda.in
          </div>
        </div>
      )}

      {/* Colored Header */}
      <div style={{ background: accentColor, color: '#fff', padding: '3rem 3.5rem 2.5rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>{p.name || 'Your Name'}</h1>
        {config.showBio && p.bio && (
          <p style={{ margin: '0 0 1.5rem', opacity: 0.9, lineHeight: 1.65, fontSize: '1rem', maxWidth: '75%' }}>{p.bio}</p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', opacity: 0.88 }}>
          {config.showEmail && p.email && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={14} />{p.email}</span>}
          {config.showPhone && p.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} />{p.phone}</span>}
          {p.city && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} />{p.city}</span>}
          {config.showSocials && p.linkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Globe size={14} />{p.linkedin}</span>}
        </div>
      </div>

      {/* Body: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0 }}>

        {/* Left column */}
        <div style={{ padding: '2.5rem 3rem 2.5rem 3.5rem', borderRight: '1px solid #f1f5f9' }}>

          {config.showExp && p.experience?.filter((e: any) => e.company).length > 0 && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>Experience</h2>
              {p.experience.filter((e: any) => e.company).map((exp: any, i: number) => (
                <div key={i} style={{ marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: `3px solid ${accentColor}30` }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>{exp.role}</div>
                  <div style={{ color: accentColor, fontWeight: 700, fontSize: '0.88rem', margin: '0.2rem 0' }}>{exp.company}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{exp.duration}</div>
                  {exp.description && <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.65 }}>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {config.showProjects && p.projects?.filter((pr: any) => pr.title).length > 0 && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>Projects</h2>
              {p.projects.filter((pr: any) => pr.title).map((pr: any, i: number) => (
                <div key={i} style={{ marginBottom: '1.25rem', padding: '1rem', background: `${accentColor}08`, borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{pr.title}</strong>
                    {pr.link && <a href={pr.link} style={{ color: accentColor, display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}>View <ExternalLink size={11} /></a>}
                  </div>
                  {pr.description && <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.55 }}>{pr.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right column */}
        <div style={{ padding: '2.5rem 2.5rem 2.5rem 2rem', background: '#f8fafc' }}>

          {config.showSkills && p.skills?.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1rem' }}>Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {p.skills.map((s: string, i: number) => (
                  <span key={i} style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30`, borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.78rem', fontWeight: 700 }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {config.showEdu && p.education?.filter((e: any) => e.school).length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1rem' }}>Education</h2>
              {p.education.filter((e: any) => e.school).map((edu: any, i: number) => (
                <div key={i} style={{ marginBottom: '1.2rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{edu.degree}</div>
                  <div style={{ fontSize: '0.83rem', color: accentColor, fontWeight: 700 }}>{edu.school}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{edu.year} {edu.grade && `· ${edu.grade}`}</div>
                </div>
              ))}
            </section>
          )}

          {config.showSocials && (p.github || p.linkedin) && (
            <section>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1rem' }}>Links</h2>
              {p.linkedin && <a href={p.linkedin} style={{ display: 'block', fontSize: '0.83rem', color: accentColor, marginBottom: '0.4rem', wordBreak: 'break-all' }}>LinkedIn ↗</a>}
              {p.github && <a href={p.github} style={{ display: 'block', fontSize: '0.83rem', color: accentColor, wordBreak: 'break-all' }}>GitHub ↗</a>}
            </section>
          )}
        </div>
      </div>

      {/* Footer branding */}
      {!unlocked && (
        <div style={{ textAlign: 'center', padding: '1rem', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', borderTop: '1px solid #e2e8f0' }}>
          Generated via JobAdda.in · Purchase to remove branding
        </div>
      )}
    </div>
  );
}
