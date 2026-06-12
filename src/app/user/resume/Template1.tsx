import React from 'react';
import { Mail, Phone, MapPin, Linkedin, ExternalLink } from 'lucide-react';

export default function Template1({ p, config, unlocked }: { p: any; config: any; unlocked: boolean }) {
  return (
    <div style={{ background: '#fff', color: '#111', fontFamily: "'Inter', sans-serif", padding: '3rem 3.5rem', width: '210mm', minHeight: '297mm', margin: '0 auto', position: 'relative', boxSizing: 'border-box' }}>

      {/* Watermark */}
      {!unlocked && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <div style={{ fontSize: '10rem', fontWeight: 900, color: 'rgba(99,102,241,0.12)', transform: 'rotate(-40deg)', whiteSpace: 'nowrap', userSelect: 'none' }}>
            JobAdda.in
          </div>
        </div>
      )}

      {/* Name */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{p.name || 'Your Name'}</h1>
        {/* Contact row */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.25rem', marginTop: '0.5rem', fontSize: '12px', color: '#475569' }}>
          {config.showEmail && p.email && <a href={`mailto:${p.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'inherit', textDecoration: 'none' }}><Mail size={13} />{p.email}</a>}
          {config.showPhone && p.phone && <a href={`tel:${p.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'inherit', textDecoration: 'none' }}><Phone size={13} />{p.phone}</a>}
          {p.city && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} />{p.city}</span>}
          {config.showSocials && p.linkedin && (
            <a href={p.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'inherit', textDecoration: 'none' }}>
              <Linkedin size={13} />
              {p.linkedin.includes('linkedin.com/in/') ? `/in/${p.linkedin.split('/in/')[1].split('/')[0]}` : 'LinkedIn'}
            </a>
          )}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '2px solid #111', margin: '1.5rem 0' }} />

      {/* Bio */}
      {config.showBio && p.bio && (
        <>
          <section style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', margin: '0 0 0.6rem' }}>Summary</h2>
            <p style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.6, margin: 0, color: '#334155' }}>{p.bio}</p>
          </section>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.25rem 0' }} />
        </>
      )}

      {/* Skills */}
      {config.showSkills && p.skills?.length > 0 && (
        <>
          <section style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.6rem' }}>Skills</h2>
            <p style={{ fontSize: '12px', color: '#334155', margin: 0 }}>{p.skills.map((s: any) => typeof s === 'string' ? s : s.name).join(' · ')}</p>
          </section>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.25rem 0' }} />
        </>
      )}

      {/* Experience */}
      {config.showExp && p.experience?.filter((e: any) => e.company).length > 0 && (
        <>
          <section style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem' }}>Experience</h2>
            {p.experience.filter((e: any) => e.company).map((exp: any, i: number) => (
              <div key={i} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '16px', fontWeight: 700 }}>{exp.role}</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {(() => {
                      const fmt = (d: string) => {
                        if (!d) return '';
                        const date = new Date(d);
                        return isNaN(date.getTime()) ? d : `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                      };
                      return `${fmt(exp.startDate)}${exp.isCurrent ? ' - Present' : (exp.endDate ? ` - ${fmt(exp.endDate)}` : '')}`;
                    })()}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '0.2rem', fontWeight: 600 }}>{exp.company}</div>
                {exp.description && <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{exp.description}</p>}
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
            <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem' }}>Education</h2>
            {p.education.filter((e: any) => e.school).map((edu: any, i: number) => (
              <div key={i} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '16px', fontWeight: 700 }}>{edu.degree}</strong>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{edu.year}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 600 }}>{edu.school}</span>
                  {edu.grade && <span style={{ fontSize: '12px', color: '#64748b' }}>Grade: {edu.grade}</span>}
                </div>
                {edu.description && <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{edu.description}</p>}
              </div>
            ))}
          </section>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.25rem 0' }} />
        </>
      )}

      {/* Certifications */}
      {config.showCert && p.certificates?.filter((c: any) => c.name).length > 0 && (
        <>
          <section style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem' }}>Certifications</h2>
            {p.certificates.filter((c: any) => c.name).map((cert: any, i: number) => (
              <div key={i} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <strong style={{ fontSize: '16px', fontWeight: 700 }}>{cert.name}</strong>
                    {cert.url && (
                      <a href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{cert.date}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>{cert.issuer}</div>
              </div>
            ))}
          </section>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.25rem 0' }} />
        </>
      )}

      {/* Projects */}
      {config.showProjects && p.projects?.filter((pr: any) => pr.title).length > 0 && (
        <section style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem' }}>Projects</h2>
          {p.projects.filter((pr: any) => pr.title).map((pr: any, i: number) => (
            <div key={i} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{pr.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {(() => {
                    const fmt = (d: string) => {
                      if (!d) return '';
                      const date = new Date(d);
                      return isNaN(date.getTime()) ? d : `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                    };
                    return pr.startDate ? `${fmt(pr.startDate)}${pr.isCurrent ? ' - Present' : (pr.endDate ? ` - ${fmt(pr.endDate)}` : '')}` : '';
                  })()}
                </div>
              </div>
              {pr.description && <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>{pr.description}</p>}
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
