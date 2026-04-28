import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Template1({ p, config, unlocked }: { p: any; config: any; unlocked: boolean }) {
  return (
    <div style={{ background: '#fff', color: '#111', fontFamily: "'Inter', sans-serif", padding: '3rem 3.5rem', minHeight: '1122px', position: 'relative' }}>

      {/* Watermark */}
      {!unlocked && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <div style={{ fontSize: '6rem', fontWeight: 900, color: 'rgba(99,102,241,0.07)', transform: 'rotate(-40deg)', whiteSpace: 'nowrap', userSelect: 'none' }}>
            JobAdda.in JobAdda.in
          </div>
        </div>
      )}

      {/* Name */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>{p.name || 'Your Name'}</h1>
        {/* Contact row */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.85rem', color: '#475569' }}>
          {config.showEmail && p.email && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Mail size={13} />{p.email}</span>}
          {config.showPhone && p.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={13} />{p.phone}</span>}
          {p.city && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} />{p.city}</span>}
          {config.showSocials && p.linkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Globe size={13} />{p.linkedin}</span>}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '2px solid #111', margin: '1.5rem 0' }} />

      {/* Bio */}
      {config.showBio && p.bio && (
        <>
          <section style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#111', margin: '0 0 0.6rem' }}>Summary</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, margin: 0, color: '#334155' }}>{p.bio}</p>
          </section>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.25rem 0' }} />
        </>
      )}

      {/* Skills */}
      {config.showSkills && p.skills?.length > 0 && (
        <>
          <section style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.6rem' }}>Skills</h2>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0 }}>{p.skills.join(' · ')}</p>
          </section>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.25rem 0' }} />
        </>
      )}

      {/* Experience */}
      {config.showExp && p.experience?.filter((e: any) => e.company).length > 0 && (
        <>
          <section style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.75rem' }}>Experience</h2>
            {p.experience.filter((e: any) => e.company).map((exp: any, i: number) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{exp.role}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{exp.duration}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.25rem' }}>{exp.company}</div>
                {exp.description && <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{exp.description}</p>}
              </div>
            ))}
          </section>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.25rem 0' }} />
        </>
      )}

      {/* Education */}
      {config.showEdu && p.education?.filter((e: any) => e.school).length > 0 && (
        <>
          <section style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.75rem' }}>Education</h2>
            {p.education.filter((e: any) => e.school).map((edu: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{edu.degree}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>{edu.school}</div>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{edu.year} {edu.grade && `· ${edu.grade}`}</span>
              </div>
            ))}
          </section>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.25rem 0' }} />
        </>
      )}

      {/* Projects */}
      {config.showProjects && p.projects?.filter((pr: any) => pr.title).length > 0 && (
        <section style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.75rem' }}>Projects</h2>
          {p.projects.filter((pr: any) => pr.title).map((pr: any, i: number) => (
            <div key={i} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem' }}>{pr.title}</strong>
                {pr.link && <a href={pr.link} style={{ fontSize: '0.75rem', color: '#6366f1' }}>View ↗</a>}
              </div>
              {pr.description && <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0', lineHeight: 1.5 }}>{pr.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Footer branding */}
      {!unlocked && (
        <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Generated via JobAdda.in · Purchase to remove this branding
        </div>
      )}
    </div>
  );
}
