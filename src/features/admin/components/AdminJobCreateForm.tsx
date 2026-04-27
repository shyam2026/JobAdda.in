'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

export function AdminJobCreateForm({ companies }: { companies: { id: string; companyName: string; email: string }[] }) {
  const [form, setForm] = useState({
    companyId: companies[0]?.id || '',
    title: '',
    location: '',
    salary: '',
    type: 'Full-time',
    description: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Quick mock submission, replace with real API call
    try {
      await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      router.push('/admin/jobs');
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="input-group">
        <label className="label" style={{ fontWeight: 600 }}>Assign to Company *</label>
        <select 
          required
          value={form.companyId}
          onChange={e => setForm(f => ({ ...f, companyId: e.target.value }))}
          style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.95rem' }}
        >
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.companyName} ({c.email})</option>
          ))}
        </select>
      </div>

      <Input label="Job Title *" required placeholder="e.g. Senior Frontend Developer" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
      
      <div className="grid-2">
        <Input label="Location *" required placeholder="e.g. Bangalore / Remote" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        <Input label="Salary Range" placeholder="e.g. ₹12L - ₹18L" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
      </div>

      <div className="input-group">
        <label className="label" style={{ fontWeight: 600 }}>Job Type</label>
        <select 
          value={form.type} 
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))} 
          style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.95rem' }}
        >
          {['Full-time', 'Part-time', 'Remote', 'Hybrid', 'Internship', 'Contract'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="input-group">
        <label className="label" style={{ fontWeight: 600 }}>Job Description *</label>
        <textarea 
          required 
          placeholder="Describe the role, day-to-day responsibilities..." 
          value={form.description} 
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
          style={{ minHeight: '120px', width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.95rem', resize: 'vertical' }} 
        />
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={loading} style={{ background: '#10b981', color: '#fff', border: 'none' }}>
          Publish Job
        </Button>
      </div>
    </form>
  );
}
