import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink, Award } from 'lucide-react';

export default function Template3({ p, config, unlocked }: { p: any; config: any; unlocked: boolean }) {
  const dark = '#0f172a';
  const gold = '#f59e0b';

  return (
    <div style={{ background: '#fff', color: dark, fontFamily: "'Inter', sans-serif", minHeight: '1122px', position: 'relative', display: 'grid', gridTemplateColumns: '260px 1fr' }}>

      {/* Watermark */}
      {!unlocked && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '7rem', fontWeight: 900, color: 'rgba(15,23,42,0.05)', transform: 'rotate(-40deg)', whiteSpace: 'nowrap', userSelect: 'none' }}>
            JobAdda.in
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR — dark */}
      <div style={{ background: dark, color: '#fff', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Avatar / Initial */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: `linear-gradient(135deg, ${gold}, #ef4444)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, margin: '0 auto 1rem', color: '#fff' }}>
            {(p.name || 'U')[0].toUpperCase()}
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.25rem', color: '#fff', lineHeight: 1.2 }}>{p.name || 'Your Name'}</h1>
          <div style={{ width: '40px', height: '3px', background: gold, margin: '0.75rem auto 0', borderRadius: '2px' }} />
        </div>

        {/* Contact */}
        <div>
          <h3 style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: gold, marginBottom: '0.75rem' }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {config.showEmail && p.email && <span style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem', wordBreak: 'break-all' }}><Mail size={12} style={{ flexShrink: 0 }} />{p.email}</span>}
            {config.showPhone && p.phone && <span style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={12} />{p.phone}</span>}
            {p.city && <span style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={12} />{p.city}</span>}
            {config.showSocials && p.linkedin && <span style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={12} />LinkedIn</span>}
            {config.showSocials && p.github && <span style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={12} />GitHub</span>}
          </div>
        </div>

        {/* Skills */}
        {config.showSkills && p.skills?.length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: gold, marginBottom: '0.75rem' }}>Skills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {p.skills.map((s: string, i: number) => (
                <div key={i}>
                  <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginBottom: '0.2rem' }}>{s}</div>
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: '80%', background: gold, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education in sidebar */}
        {config.showEdu && p.education?.filter((e: any) => e.school).length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: gold, marginBottom: '0.75rem' }}>Education</h3>
            {p.education.filter((e: any) => e.school).map((edu: any, i: number) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>{edu.degree}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>{edu.school}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{edu.year}{edu.grade && ` · ${edu.grade}`}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div style={{ padding: '3rem 3.5rem', position: 'relative' }}>

        {/* Summary */}
        {config.showBio && p.bio && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '4px', height: '24px', background: gold, borderRadius: '2px' }} />
              <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Professional Summary</h2>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: '#475569', margin: 0 }}>{p.bio}</p>
          </section>
        )}

        {/* Experience */}
        {config.showExp && p.experience?.filter((e: any) => e.company).length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '4px', height: '24px', background: gold, borderRadius: '2px' }} />
              <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Work Experience</h2>
            </div>
            {p.experience.filter((e: any) => e.company).map((exp: any, i: number) => (
              <div key={i} style={{ marginBottom: '2rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: `2px solid ${dark}15` }}>
                <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: gold }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                  <strong style={{ fontSize: '1rem', fontWeight: 800 }}>{exp.role}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', background: '#f1f5f9', padding: '0.15rem 0.6rem', borderRadius: '20px' }}>{exp.duration}</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: gold, fontWeight: 700, marginBottom: '0.5rem' }}>{exp.company}</div>
                {exp.description && <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: 1.65 }}>{exp.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {config.showProjects && p.projects?.filter((pr: any) => pr.title).length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '4px', height: '24px', background: gold, borderRadius: '2px' }} />
              <h2 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Projects</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {p.projects.filter((pr: any) => pr.title).map((pr: any, i: number) => (
                <div key={i} style={{ padding: '1.25rem', border: `1px solid ${dark}15`, borderRadius: '12px', position: 'relative', background: '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.9rem', fontWeight: 800 }}>{pr.title}</strong>
                    {pr.link && <a href={pr.link} style={{ color: gold }}><ExternalLink size={14} /></a>}
                  </div>
                  {pr.description && <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{pr.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer branding */}
        {!unlocked && (
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '3.5rem', right: '3.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <span>JobAdda.in Verified</span>
            <span>Purchase to unlock full resume</span>
          </div>
        )}
      </div>
    </div>
  );
}
