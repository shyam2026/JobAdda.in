'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User as UserIcon, Book, Briefcase, Award, Plus, Save, Trash2, CheckCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const SKILLS_SUGGESTIONS = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Figma', 'AWS', 'Docker', 'TypeScript', 'MongoDB', 'Excel', 'Marketing', 'Leadership', 'Java', 'Flutter'];

type ProfileState = {
  bio: string;
  phone: string;
  city: string;
  linkedin: string;
  github: string;
  skills: string[];
  education: { school: string; degree: string; year: string; grade: string }[];
  experience: { company: string; role: string; duration: string; description: string }[];
  certificates: { name: string; issuer: string; date: string; url: string }[];
};

const EMPTY_PROFILE: ProfileState = {
  bio: '', phone: '', city: '', linkedin: '', github: '',
  skills: [],
  education: [{ school: '', degree: '', year: '', grade: '' }],
  experience: [{ company: '', role: '', duration: '', description: '' }],
  certificates: [{ name: '', issuer: '', date: '', url: '' }],
};

export function ProfileForm() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('basic');
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [skillInput, setSkillInput] = useState('');
  const [profile, setProfile] = useState<ProfileState>(EMPTY_PROFILE);

  // Pre-fill from DB
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile')
        .then(r => r.json())
        .then(data => {
          if (data && !data.error) {
            setProfile({
              bio: data.bio || '',
              phone: data.phone || '',
              city: data.city || '',
              linkedin: data.linkedin || '',
              github: data.github || '',
              skills: Array.isArray(data.skills) ? data.skills : [],
              education: Array.isArray(data.education) && data.education.length > 0
                ? data.education
                : [{ school: '', degree: '', year: '', grade: '' }],
              experience: Array.isArray(data.experience) && data.experience.length > 0
                ? data.experience
                : [{ company: '', role: '', duration: '', description: '' }],
              certificates: Array.isArray(data.certificates) && data.certificates.length > 0
                ? data.certificates
                : [{ name: '', issuer: '', date: '', url: '' }],
            });
          }
          setFetching(false);
        })
        .catch(() => setFetching(false));
    } else if (status !== 'loading') {
      setFetching(false);
    }
  }, [status]);

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !profile.skills.includes(s)) setProfile(p => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput('');
  };

  const removeSkill = (s: string) => setProfile(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  const addItem = (key: 'education' | 'experience' | 'certificates') => setProfile(p => ({
    ...p,
    [key]: [...p[key],
      key === 'education' ? { school: '', degree: '', year: '', grade: '' }
      : key === 'experience' ? { company: '', role: '', duration: '', description: '' }
      : { name: '', issuer: '', date: '', url: '' }
    ]
  }));

  const removeItem = (key: 'education' | 'experience' | 'certificates', idx: number) =>
    setProfile(p => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  const updateItem = (key: 'education' | 'experience' | 'certificates', idx: number, field: string, val: string) =>
    setProfile(p => ({ ...p, [key]: p[key].map((item, i) => i === idx ? { ...item, [field]: val } : item) }));

  const handleSave = async () => {
    setLoading(true);
    setSaveError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        const err = await res.json();
        setSaveError(err.error || 'Failed to save. Please try again.');
      }
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: 'basic', label: 'Basic Info', icon: UserIcon },
    { id: 'education', label: 'Education', icon: Book },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ];

  const completion = Math.min(100, Math.round(
    (profile.bio ? 20 : 0) + (profile.skills.length ? 20 : 0) +
    (profile.education[0]?.school ? 20 : 0) + (profile.experience[0]?.company ? 20 : 0) +
    (profile.certificates[0]?.name ? 20 : 0)
  ));

  if (status === 'loading' || fetching) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-3)' }}>Loading your profile...</p>
      </div>
    );
  }

  if (!session) return (
    <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1.5rem' }}>
      <h3>Please login to edit your profile</h3>
      <a href="/login" className="btn btn-primary">Login to JobAdda.in</a>
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Card variant="glass" padding="md" className="hide-mobile" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div className="avatar avatar-lg" style={{ margin: '0 auto 1rem' }}>
            {session.user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{session.user?.name}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginBottom: '1.5rem', wordBreak: 'break-all' }}>{session.user?.email}</div>

          <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-3)' }}>Profile Strength</span>
            <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>{completion}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completion}%` }} />
          </div>
        </Card>

        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`sidebar-item ${activeTab === t.id ? 'active' : ''}`}
          >
            <t.icon size={17} />{t.label}
          </button>
        ))}

        <div className="hide-mobile" style={{ marginTop: '2rem' }}>
          {saveError && <p style={{ fontSize: '0.82rem', color: 'var(--danger)', marginBottom: '0.75rem', textAlign: 'center' }}>{saveError}</p>}
          <Button
            onClick={handleSave}
            isLoading={loading}
            variant="primary"
            fullWidth
            leftIcon={saved ? <CheckCircle size={16} /> : <Save size={16} />}
          >
            {saved ? 'Saved!' : 'Save Profile'}
          </Button>
        </div>
      </aside>

      {/* Content */}
      <div className="dashboard-content">
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <p style={{ color: 'var(--text-3)', margin: 0, fontSize: '0.9rem' }}>
              {activeTab === 'basic' && "This information appears on your public profile and resumes."}
              {activeTab === 'education' && "Add your academic background to strengthen your profile."}
              {activeTab === 'experience' && "Add internships and jobs to showcase your professional journey."}
              {activeTab === 'certificates' && "Highlight your certifications and achievements."}
            </p>
          </div>
          {/* Mobile Save Button */}
          <div className="show-mobile" style={{ width: '100%' }}>
            {saveError && <p style={{ fontSize: '0.82rem', color: 'var(--danger)', marginBottom: '0.5rem' }}>{saveError}</p>}
            <Button
              onClick={handleSave}
              isLoading={loading}
              variant="primary"
              fullWidth
              size="sm"
              leftIcon={saved ? <CheckCircle size={14} /> : <Save size={14} />}
            >
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </header>

        {/* Basic Info */}
        {activeTab === 'basic' && (
          <div className="anim-fade">
            <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div className="input-group">
                <label className="label">Professional Bio</label>
                <textarea
                  placeholder="Write a short professional summary about yourself..."
                  className="input"
                  value={profile.bio}
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  style={{ minHeight: '120px', resize: 'vertical' }}
                />
              </div>

              <div className="grid-2">
                <Input label="Phone Number" type="tel" placeholder="+91 98765 43210" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                <Input label="City" placeholder="Bangalore, Mumbai..." value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} />
              </div>

              <div className="grid-2">
                <Input label="LinkedIn URL" type="url" placeholder="linkedin.com/in/yourname" value={profile.linkedin} onChange={e => setProfile(p => ({ ...p, linkedin: e.target.value }))} />
                <Input label="GitHub URL" type="url" placeholder="github.com/yourname" value={profile.github} onChange={e => setProfile(p => ({ ...p, github: e.target.value }))} />
              </div>

              {/* Skills */}
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.75rem' }}>Skills & Expertise</label>
                {profile.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1rem' }}>
                    {profile.skills.map(s => (
                      <Badge key={s} variant="primary" style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {s}
                        <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: 'inherit', opacity: 0.7 }}>
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <Input
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && addSkill(skillInput)}
                      placeholder="Type a skill and press Enter"
                    />
                  </div>
                  <Button onClick={() => addSkill(skillInput)} variant="secondary">Add</Button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', width: '100%', marginBottom: '0.25rem' }}>Suggestions:</span>
                  {SKILLS_SUGGESTIONS.filter(s => !profile.skills.includes(s)).map(s => (
                    <Badge
                      key={s}
                      variant="muted"
                      style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                      onClick={() => addSkill(s)}
                    >
                      + {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Education */}
        {activeTab === 'education' && (
          <div className="anim-fade">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {profile.education.map((edu, i) => (
                <Card key={i} padding="lg" style={{ position: 'relative' }}>
                  {i > 0 && (
                    <button
                      onClick={() => removeItem('education', i)}
                      className="btn btn-ghost btn-icon"
                      style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--danger)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
                    <Input label="School / University" placeholder="e.g. IIT Delhi" value={edu.school} onChange={e => updateItem('education', i, 'school', e.target.value)} />
                    <Input label="Degree" placeholder="e.g. B.Tech Computer Science" value={edu.degree} onChange={e => updateItem('education', i, 'degree', e.target.value)} />
                  </div>
                  <div className="grid-2">
                    <Input label="Year of Passing" placeholder="2024" value={edu.year} onChange={e => updateItem('education', i, 'year', e.target.value)} />
                    <Input label="Grade / CGPA" placeholder="8.5 / 10" value={edu.grade} onChange={e => updateItem('education', i, 'grade', e.target.value)} />
                  </div>
                </Card>
              ))}
              <Button onClick={() => addItem('education')} variant="outline" fullWidth leftIcon={<Plus size={16} />}>
                Add Another Education
              </Button>
            </div>
          </div>
        )}

        {/* Experience */}
        {activeTab === 'experience' && (
          <div className="anim-fade">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {profile.experience.map((exp, i) => (
                <Card key={i} padding="lg" style={{ position: 'relative' }}>
                  {i > 0 && (
                    <button
                      onClick={() => removeItem('experience', i)}
                      className="btn btn-ghost btn-icon"
                      style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--danger)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
                    <Input label="Company Name" placeholder="e.g. Infosys" value={exp.company} onChange={e => updateItem('experience', i, 'company', e.target.value)} />
                    <Input label="Job Title / Role" placeholder="e.g. Software Engineer" value={exp.role} onChange={e => updateItem('experience', i, 'role', e.target.value)} />
                  </div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <Input label="Duration" placeholder="e.g. Jan 2022 – Dec 2023" value={exp.duration} onChange={e => updateItem('experience', i, 'duration', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="label">Description (Key Achievements)</label>
                    <textarea
                      placeholder="Describe what you built, achieved, or improved..."
                      className="input"
                      value={exp.description}
                      onChange={e => updateItem('experience', i, 'description', e.target.value)}
                      style={{ minHeight: '100px', resize: 'vertical' }}
                    />
                  </div>
                </Card>
              ))}
              <Button onClick={() => addItem('experience')} variant="outline" fullWidth leftIcon={<Plus size={16} />}>
                Add Another Experience
              </Button>
            </div>
          </div>
        )}

        {/* Certificates */}
        {activeTab === 'certificates' && (
          <div className="anim-fade">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {profile.certificates.map((cert, i) => (
                <Card key={i} padding="lg" style={{ position: 'relative' }}>
                  {i > 0 && (
                    <button
                      onClick={() => removeItem('certificates', i)}
                      className="btn btn-ghost btn-icon"
                      style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--danger)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
                    <Input label="Certificate Name" placeholder="e.g. AWS Certified Developer" value={cert.name} onChange={e => updateItem('certificates', i, 'name', e.target.value)} />
                    <Input label="Issuing Organization" placeholder="e.g. Amazon Web Services" value={cert.issuer} onChange={e => updateItem('certificates', i, 'issuer', e.target.value)} />
                  </div>
                  <div className="grid-2">
                    <Input label="Date Issued" placeholder="MM/YYYY" value={cert.date} onChange={e => updateItem('certificates', i, 'date', e.target.value)} />
                    <Input label="Credential URL" type="url" placeholder="https://..." value={cert.url} onChange={e => updateItem('certificates', i, 'url', e.target.value)} />
                  </div>
                </Card>
              ))}
              <Button onClick={() => addItem('certificates')} variant="outline" fullWidth leftIcon={<Plus size={16} />}>
                Add Another Certificate
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
