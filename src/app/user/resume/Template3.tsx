import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink, Award, Linkedin, Github } from 'lucide-react';

export default function Template3({ p, config, unlocked }: { p: any; config: any; unlocked: boolean }) {
  const dark = '#0f172a';
  const gold = '#f59e0b';

  return (
    <div style={{ background: '#fff', color: dark, fontFamily: "'Inter', sans-serif", width: '210mm', minHeight: '297mm', margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '260px 1fr', boxSizing: 'border-box' }}>

      {/* Watermark */}
      {!unlocked && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '10rem', fontWeight: 900, color: 'rgba(15,23,42,0.09)', transform: 'rotate(-40deg)', whiteSpace: 'nowrap', userSelect: 'none' }}>
            JobAdda.in
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR — dark */}
      <div style={{ background: dark, color: '#fff', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Avatar / Initial */}
        <div style={{ textAlign: 'center' }}>
          {p.profileImage ? (
            <img
              src={p.profileImage}
              alt={p.name || 'Profile'}
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${gold}`, margin: '0 auto 1.25rem', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: `linear-gradient(135deg, ${gold}, #ef4444)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, margin: '0 auto 1.25rem', color: '#fff' }}>
              {(p.name || 'U')[0].toUpperCase()}
            </div>
          )}
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 0.25rem', color: '#fff', lineHeight: 1.2 }}>{p.name || 'Your Name'}</h1>
          <div style={{ width: '40px', height: '3px', background: gold, margin: '0.75rem auto 0', borderRadius: '2px' }} />
        </div>

        {/* Contact */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: gold, marginBottom: '0.75rem' }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {config.showEmail && p.email && <a href={`mailto:${p.email}`} style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem', wordBreak: 'break-all', textDecoration: 'none' }}><Mail size={13} style={{ flexShrink: 0 }} />{p.email}</a>}
            {config.showPhone && p.phone && <a href={`tel:${p.phone}`} style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}><Phone size={13} />{p.phone}</a>}
            {p.city && <span style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={13} />{p.city}</span>}
            {config.showSocials && p.linkedin && (
              <a href={p.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <Linkedin size={13} />LinkedIn
              </a>
            )}
            {config.showSocials && p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <Github size={13} />GitHub
              </a>
            )}
            {config.showSocials && p.website && (
              <a href={p.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <Globe size={13} />Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Skills */}
        {config.showSkills && p.skills?.length > 0 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: gold, marginBottom: '0.75rem' }}>Skills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {p.skills.map((s: any, i: number) => (
                <div key={i}>
                  <div style={{ fontSize: '12px', color: '#e2e8f0', marginBottom: '0.2rem' }}>{typeof s === 'string' ? s : s.name}</div>
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${(typeof s === 'string' ? 8 : (parseInt(s.level) || 8)) * 10}%`, background: gold, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education in sidebar (Only if Exp is present) */}
        {(() => {
          const isExpVisible = config.showExp && p.experience?.filter((e: any) => e.company).length > 0;
          if (isExpVisible && config.showEdu && p.education?.filter((e: any) => e.school).length > 0) {
            return (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: gold, marginBottom: '0.75rem' }}>Education</h3>
                {p.education.filter((e: any) => e.school).map((edu: any, i: number) => (
                  <div key={i} style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{edu.degree}</div>
                    <div style={{ fontSize: '12px', color: gold, marginTop: '0.1rem', fontWeight: 600 }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '0.1rem' }}>{edu.year}{edu.grade && ` · ${edu.grade}`}</div>
                    {edu.description && <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0.3rem 0 0', lineHeight: 1.5 }}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div style={{ padding: '3rem 3.5rem', position: 'relative' }}>

        {/* Summary */}
        {config.showBio && p.bio && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '4px', height: '24px', background: gold, borderRadius: '2px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Professional Summary</h2>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.7, color: '#475569', margin: 0 }}>{p.bio}</p>
          </section>
        )}

        {/* Experience OR Education (if Exp is hidden) */}
        {(() => {
          const isExpVisible = config.showExp && p.experience?.filter((e: any) => e.company).length > 0;
          
          if (isExpVisible) {
            return (
              <section style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '4px', height: '24px', background: gold, borderRadius: '2px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Work Experience</h2>
                </div>
                {p.experience.filter((e: any) => e.company).map((exp: any, i: number) => (
                  <div key={i} style={{ marginBottom: '2rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: `2px solid ${dark}15` }}>
                    <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: gold }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <strong style={{ fontSize: '16px', fontWeight: 700 }}>{exp.role}</strong>
                      <span style={{ fontSize: '12px', color: '#94a3b8', background: '#f1f5f9', padding: '0.2rem 0.75rem', borderRadius: '20px' }}>
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
                    <div style={{ fontSize: '12px', color: gold, fontWeight: 700, marginBottom: '0.5rem' }}>{exp.company}</div>
                    {exp.description && <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{exp.description}</p>}
                  </div>
                ))}
              </section>
            );
          } else if (config.showEdu && p.education?.filter((e: any) => e.school).length > 0) {
            return (
              <section style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '4px', height: '24px', background: gold, borderRadius: '2px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Education</h2>
                </div>
                {p.education.filter((e: any) => e.school).map((edu: any, i: number) => (
                  <div key={i} style={{ marginBottom: '2rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: `2px solid ${dark}15` }}>
                    <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: gold }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <strong style={{ fontSize: '16px', fontWeight: 700 }}>{edu.degree}</strong>
                      <span style={{ fontSize: '12px', color: '#94a3b8', background: '#f1f5f9', padding: '0.2rem 0.75rem', borderRadius: '20px' }}>{edu.year}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: gold, fontWeight: 700, marginBottom: '0.5rem' }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '0.3rem' }}>Grade: {edu.grade}</div>
                    {edu.description && <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{edu.description}</p>}
                  </div>
                ))}
              </section>
            );
          }
          return null;
        })()}

        {/* Projects */}
        {config.showProjects && p.projects?.filter((pr: any) => pr.title).length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '4px', height: '24px', background: gold, borderRadius: '2px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Projects</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              {p.projects.filter((pr: any) => pr.title).map((pr: any, i: number) => (
                <div key={i} style={{ padding: '0.85rem', border: `1px solid ${dark}15`, borderRadius: '10px', position: 'relative', background: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '16px', fontWeight: 700 }}>{pr.title}</strong>
                      <div style={{ fontSize: '12px', color: gold, fontWeight: 700 }}>
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
                    {pr.description && <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 0.5rem', lineHeight: 1.6 }}>{pr.description}</p>}
                    {pr.link && <a href={pr.link} target="_blank" rel="noopener noreferrer" style={{ color: gold, fontSize: '12px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>View Project <ExternalLink size={11} /></a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {config.showCert && p.certificates?.filter((c: any) => c.name).length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '4px', height: '24px', background: gold, borderRadius: '2px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Certifications</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              {p.certificates.filter((c: any) => c.name).map((cert: any, i: number) => (
                <div key={i} style={{ padding: '0.85rem', border: `1px solid ${dark}15`, borderRadius: '10px', background: '#fafafa', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: `${gold}15`, color: gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Award size={18} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cert.name}</div>
                      {cert.url && <a href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ color: gold, marginLeft: '0.5rem' }}><ExternalLink size={13} /></a>}
                    </div>
                    <div style={{ fontSize: '12px', color: gold, fontWeight: 700, marginTop: '0.05rem' }}>{cert.issuer}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '0.1rem' }}>{cert.date}</div>
                  </div>
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
