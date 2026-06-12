import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink, Linkedin, Github } from 'lucide-react';

export default function Template2({ p, config, unlocked, accentColor }: { p: any; config: any; unlocked: boolean; accentColor: string }) {
  return (
    <div style={{ background: '#fff', color: '#111', fontFamily: "'Inter', sans-serif", width: '210mm', minHeight: '297mm', margin: '0 auto', position: 'relative', boxSizing: 'border-box' }}>

      {/* Watermark */}
      {!unlocked && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '10rem', fontWeight: 900, color: `${accentColor}18`, transform: 'rotate(-40deg)', whiteSpace: 'nowrap', userSelect: 'none' }}>
            JobAdda.in
          </div>
        </div>
      )}

      {/* Colored Header */}
      <div style={{ background: accentColor, color: '#fff', padding: '2.5rem 3.5rem 2rem' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>{p.name || 'Your Name'}</h1>
        {config.showBio && p.bio && (
          <p style={{ margin: '0 0 1.25rem', opacity: 0.9, lineHeight: 1.6, fontSize: '14px', fontWeight: 700, maxWidth: '100%' }}>{p.bio}</p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '12px', opacity: 0.88 }}>
          {config.showEmail && p.email && <a href={`mailto:${p.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'inherit', textDecoration: 'none' }}><Mail size={13} />{p.email}</a>}
          {config.showPhone && p.phone && <a href={`tel:${p.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'inherit', textDecoration: 'none' }}><Phone size={13} />{p.phone}</a>}
          {p.city && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={13} />{p.city}</span>}
          {config.showSocials && p.linkedin && (
            <a href={p.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'inherit', textDecoration: 'none' }}>
              <Linkedin size={13} />
              {p.linkedin.includes('linkedin.com/in/') ? `/in/${p.linkedin.split('/in/')[1].split('/')[0]}` : 'LinkedIn'}
            </a>
          )}
        </div>
      </div>

      {/* Body: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0 }}>

        {/* Left column */}
        <div style={{ padding: '2.5rem 3rem 2.5rem 3.5rem', borderRight: '1px solid #f1f5f9' }}>
          {(() => {
            const isExpVisible = config.showExp && p.experience?.filter((e: any) => e.company).length > 0;
            
            if (isExpVisible) {
              return (
                <section style={{ marginBottom: '2.5rem' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>Experience</h2>
                  {p.experience.filter((e: any) => e.company).map((exp: any, i: number) => (
                    <div key={i} style={{ marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: `3px solid ${accentColor}30` }}>
                      <div style={{ fontWeight: 700, fontSize: '16px' }}>{exp.role}</div>
                      <div style={{ color: accentColor, fontWeight: 700, fontSize: '12px', margin: '0.1rem 0' }}>{exp.company}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '0.4rem' }}>
                        {(() => {
                          const fmt = (d: string) => {
                            if (!d) return '';
                            const date = new Date(d);
                            return isNaN(date.getTime()) ? d : `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                          };
                          return `${fmt(exp.startDate)}${exp.isCurrent ? ' - Present' : (exp.endDate ? ` - ${fmt(exp.endDate)}` : '')}`;
                        })()}
                      </div>
                      {exp.description && <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>{exp.description}</p>}
                    </div>
                  ))}
                </section>
              );
            } else if (config.showEdu && p.education?.filter((e: any) => e.school).length > 0) {
              return (
                <section style={{ marginBottom: '2.5rem' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>Education</h2>
                  {p.education.filter((e: any) => e.school).map((edu: any, i: number) => (
                    <div key={i} style={{ marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: `3px solid ${accentColor}30` }}>
                      <div style={{ fontWeight: 700, fontSize: '16px' }}>{edu.degree}</div>
                      <div style={{ color: accentColor, fontWeight: 700, fontSize: '12px', margin: '0.1rem 0' }}>{edu.school}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '0.4rem' }}>{edu.year} {edu.grade && `· ${edu.grade}`}</div>
                      {edu.description && <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>{edu.description}</p>}
                    </div>
                  ))}
                </section>
              );
            }
            return null;
          })()}

          {config.showProjects && p.projects?.filter((pr: any) => pr.title).length > 0 && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>Projects</h2>
              {p.projects.filter((pr: any) => pr.title).map((pr: any, i: number) => (
                <div key={i} style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: `${accentColor}08`, borderRadius: '8px', border: `1px solid ${accentColor}15` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '16px', fontWeight: 700 }}>{pr.title}</strong>
                    <div style={{ fontSize: '12px', color: accentColor, fontWeight: 700 }}>
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
                  {pr.link && <div style={{ marginBottom: '0.25rem' }}><a href={pr.link} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '12px', textDecoration: 'none', opacity: 0.8 }}>View Project <ExternalLink size={11} /></a></div>}
                  {pr.description && <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{pr.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right column */}
        <div style={{ padding: '2.5rem 2.5rem 2.5rem 2rem', background: '#f8fafc' }}>

          {config.showSkills && p.skills?.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1rem' }}>Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {p.skills.map((s: any, i: number) => (
                  <span key={i} style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30`, borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '12px', fontWeight: 600 }}>{typeof s === 'string' ? s : s.name}</span>
                ))}
              </div>
            </section>
          )}

          {/* Only show Education in right sidebar if Experience is visible on the left */}
          {(() => {
            const isExpVisible = config.showExp && p.experience?.filter((e: any) => e.company).length > 0;
            if (isExpVisible && config.showEdu && p.education?.filter((e: any) => e.school).length > 0) {
              return (
                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1rem' }}>Education</h2>
                  {p.education.filter((e: any) => e.school).map((edu: any, i: number) => (
                    <div key={i} style={{ marginBottom: '1.2rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '16px' }}>{edu.degree}</div>
                      <div style={{ fontSize: '12px', color: accentColor, fontWeight: 700 }}>{edu.school}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{edu.year} {edu.grade && `· ${edu.grade}`}</div>
                      {edu.description && <p style={{ fontSize: '12px', color: '#64748b', margin: '0.3rem 0 0', lineHeight: 1.5 }}>{edu.description}</p>}
                    </div>
                  ))}
                </section>
              );
            }
            return null;
          })()}

          {config.showCert && p.certificates?.filter((c: any) => c.name).length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1rem' }}>Certifications</h2>
              {p.certificates.filter((c: any) => c.name).map((cert: any, i: number) => (
                <div key={i} style={{ marginBottom: '1.2rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>{cert.name}</div>
                  <div style={{ fontSize: '12px', color: accentColor, fontWeight: 700 }}>{cert.issuer}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{cert.date}</span>
                    {cert.url && <a href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>Verify <ExternalLink size={11} /></a>}
                  </div>
                </div>
              ))}
            </section>
          )}

          {config.showSocials && (p.github || p.linkedin || p.website) && (
            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.4rem', marginBottom: '1rem' }}>Links</h2>
              {p.linkedin && <a href={p.linkedin} style={{ display: 'block', fontSize: '12px', color: accentColor, marginBottom: '0.4rem', wordBreak: 'break-all', textDecoration: 'none' }}>LinkedIn ↗</a>}
              {p.github && <a href={p.github} style={{ display: 'block', fontSize: '12px', color: accentColor, marginBottom: '0.4rem', wordBreak: 'break-all', textDecoration: 'none' }}>GitHub ↗</a>}
              {p.website && <a href={p.website} style={{ display: 'block', fontSize: '12px', color: accentColor, marginBottom: '0.4rem', wordBreak: 'break-all', textDecoration: 'none' }}>Portfolio ↗</a>}
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
