'use client';

import React, { useState } from 'react';
import { Plus, X, Loader2, CheckCircle, AlertCircle, Briefcase, MapPin, IndianRupee, Link as LinkIcon, AlignLeft, Tag } from 'lucide-react';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Hybrid', 'Internship', 'EXTERNAL'];
const CATEGORIES = ['Technology', 'Finance', 'Healthcare', 'Marketing', 'Sales', 'HR', 'Operations', 'Education', 'Legal', 'Design', 'Data & Analytics', 'Other'];

interface CreateJobModalProps {
  onCreated: () => void;
}

export function CreateJobModal({ onCreated }: CreateJobModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '', location: '', type: 'Full-time', category: 'Technology',
    salary: '', description: '', requirements: '', externalLink: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: form.type === 'EXTERNAL' ? 'EXTERNAL' : 'INTERNAL',
          externalLink: form.type === 'EXTERNAL' ? form.externalLink : '',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => { setOpen(false); setSuccess(false); setForm({ title: '', location: '', type: 'Full-time', category: 'Technology', salary: '', description: '', requirements: '', externalLink: '' }); onCreated(); }, 1500);
      } else {
        setError(data.error || 'Failed to post job. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', background: 'var(--surface)',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
    color: 'var(--text)', fontSize: '0.9rem', outline: 'none',
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
        <Plus size={16} /> Post a Job
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: '1.25rem', width: '100%', maxWidth: '640px',
            maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            border: '1px solid var(--border)',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1, borderRadius: '1.25rem 1.25rem 0 0' }}>
              <div>
                <h3 style={{ margin: 0 }}>Post a New Job</h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-3)' }}>Fill in the details below and publish to JobAdda</p>
              </div>
              <button onClick={() => setOpen(false)} className="btn btn-ghost btn-icon"><X size={20} /></button>
            </div>

            {success ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <CheckCircle size={52} style={{ color: 'var(--success)', margin: '0 auto 1rem', display: 'block' }} />
                <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Job Posted!</h3>
                <p style={{ color: 'var(--text-3)' }}>Your job listing is now live on JobAdda.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Title */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-3)', marginBottom: '0.4rem' }}>
                    <Briefcase size={13} /> Job Title *
                  </label>
                  <input required value={form.title} onChange={set('title')} placeholder="e.g. Senior React Developer" style={inputStyle} />
                </div>

                {/* Location */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-3)', marginBottom: '0.4rem' }}>
                    <MapPin size={13} /> Location *
                  </label>
                  <input required value={form.location} onChange={set('location')} placeholder="e.g. Bengaluru, Remote, Hybrid" style={inputStyle} />
                </div>

                {/* Type + Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-3)', marginBottom: '0.4rem', display: 'block' }}>Job Type *</label>
                    <select value={form.type} onChange={set('type')} style={inputStyle}>
                      {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-3)', marginBottom: '0.4rem' }}>
                      <Tag size={13} /> Category *
                    </label>
                    <select value={form.category} onChange={set('category')} style={inputStyle}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Salary */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-3)', marginBottom: '0.4rem' }}>
                    <IndianRupee size={13} /> Salary / Package
                  </label>
                  <input value={form.salary} onChange={set('salary')} placeholder="e.g. ₹8L – ₹14L per annum" style={inputStyle} />
                </div>

                {/* External Link (conditional) */}
                {form.type === 'EXTERNAL' && (
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-3)', marginBottom: '0.4rem' }}>
                      <LinkIcon size={13} /> External Apply URL *
                    </label>
                    <input required type="url" value={form.externalLink} onChange={set('externalLink')} placeholder="https://yourcompany.com/careers/..." style={inputStyle} />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-3)', marginBottom: '0.4rem' }}>
                    <AlignLeft size={13} /> Job Description *
                  </label>
                  <textarea
                    required rows={5} value={form.description} onChange={set('description')}
                    placeholder="Describe the role, responsibilities, team culture..."
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '120px', fontFamily: 'inherit' }}
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-3)', marginBottom: '0.4rem', display: 'block' }}>
                    Requirements <span style={{ fontWeight: '400', opacity: 0.7 }}>(one per line)</span>
                  </label>
                  <textarea
                    rows={4} value={form.requirements} onChange={set('requirements')}
                    placeholder={"- 3+ years of React experience\n- Strong TypeScript skills\n- Experience with REST APIs"}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px', fontFamily: 'monospace', fontSize: '0.85rem' }}
                  />
                </div>

                {error && (
                  <div style={{ padding: '0.85rem 1rem', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', gap: '0.6rem', alignItems: 'center', color: 'var(--danger)', fontSize: '0.88rem' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                  <button type="button" onClick={() => setOpen(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '140px', justifyContent: 'center' }}>
                    {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Posting...</> : '🚀 Post Job'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
