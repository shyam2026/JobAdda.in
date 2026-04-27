'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, Mail, Lock, User, Phone, ArrowLeft, Loader2, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function AdminCreateCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    name: '',
    contactNo: '',
    logo: '',
    type: 'Private',
    founded: '',
    size: '',
    hq: '',
    website: '',
    bio: '',
    moreDetails: [] as Array<{ title: string; value: string }>,
  });

  const addDetail = () => {
    setFormData({
      ...formData,
      moreDetails: [...formData.moreDetails, { title: '', value: '' }]
    });
  };

  const removeDetail = (index: number) => {
    const newDetails = [...formData.moreDetails];
    newDetails.splice(index, 1);
    setFormData({ ...formData, moreDetails: newDetails });
  };

  const updateDetail = (index: number, field: 'title' | 'value', val: string) => {
    const newDetails = [...formData.moreDetails];
    newDetails[index][field] = val;
    setFormData({ ...formData, moreDetails: newDetails });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/admin/companies'), 2000);
      } else {
        setError(data.error || 'Failed to create company');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <CheckCircle size={64} style={{ color: 'var(--success)' }} />
        <h3>Company Created Successfully!</h3>
        <p style={{ color: 'var(--text-3)' }}>Redirecting to companies list...</p>
      </div>
    );
  }

  return (
    <div className="admin-page anim-fade-up">
      <header style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'none', border: 'none', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to Companies
        </button>
        <h2 style={{ color: '#1e293b' }}>Create New Company Account</h2>
        <p style={{ color: '#64748b', margin: 0 }}>Register a new employer on the platform.</p>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card padding="lg">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            {/* Basic Credentials */}
            <section>
              <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary)' }}>1. Login Credentials</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label">Company Name</label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                    <input
                      required
                      type="text"
                      className="input"
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="e.g. Acme Corporation"
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="label">Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                      <input
                        required
                        type="email"
                        className="input"
                        style={{ paddingLeft: '2.75rem' }}
                        placeholder="hr@company.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="label">Temporary Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                      <input
                        required
                        type="password"
                        className="input"
                        style={{ paddingLeft: '2.75rem' }}
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Profile Information */}
            <section>
              <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary)' }}>2. Company Profile</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="grid-2">
                  <div className="input-group">
                    <label className="label">Representative Name</label>
                    <input
                      required
                      type="text"
                      className="input"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="label">Contact Number</label>
                    <input
                      type="tel"
                      className="input"
                      placeholder="+91 98765 43210"
                      value={formData.contactNo}
                      onChange={e => setFormData({ ...formData, contactNo: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="label">Company Type</label>
                    <select 
                      className="input"
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option>Private</option>
                      <option>Public</option>
                      <option>NGO</option>
                      <option>Government</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="label">Founded Year</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. 2010"
                      value={formData.founded}
                      onChange={e => setFormData({ ...formData, founded: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="label">Company Size</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. 50-200 Employees"
                      value={formData.size}
                      onChange={e => setFormData({ ...formData, size: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="label">Headquarters</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Mumbai, India"
                      value={formData.hq}
                      onChange={e => setFormData({ ...formData, hq: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="label">Website URL</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://acme.com"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="label">Company Logo URL (Optional)</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://example.com/logo.png"
                    value={formData.logo}
                    onChange={e => setFormData({ ...formData, logo: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="label">About Company (Multiple Paragraphs supported)</label>
                  <textarea
                    className="input"
                    style={{ minHeight: '150px' }}
                    placeholder="Tell candidates about the company culture, history, and mission..."
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Custom Details */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: 0, color: 'var(--primary)' }}>3. More Details (Custom Fields)</h4>
                <button type="button" onClick={addDetail} className="btn btn-outline btn-sm">
                  <Plus size={16} /> Add Custom Field
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formData.moreDetails.map((detail, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '1rem', alignItems: 'end' }}>
                    <div className="input-group" style={{ margin: 0 }}>
                      <label className="label" style={{ fontSize: '0.7rem' }}>Title (e.g. CEO)</label>
                      <input 
                        className="input" 
                        placeholder="Title" 
                        value={detail.title} 
                        onChange={e => updateDetail(idx, 'title', e.target.value)} 
                      />
                    </div>
                    <div className="input-group" style={{ margin: 0 }}>
                      <label className="label" style={{ fontSize: '0.7rem' }}>Value (e.g. Sundar Pichai)</label>
                      <input 
                        className="input" 
                        placeholder="Value" 
                        value={detail.value} 
                        onChange={e => updateDetail(idx, 'value', e.target.value)} 
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeDetail(idx)} 
                      className="btn btn-danger btn-sm" 
                      style={{ padding: '0.65rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {formData.moreDetails.length === 0 && (
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-3)', textAlign: 'center', padding: '1rem', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                    No custom fields added yet.
                  </p>
                )}
              </div>
            </section>

            <button 
              disabled={loading} 
              type="submit" 
              className="btn btn-primary" 
              style={{ marginTop: '1rem', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}
            >
              {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : '🚀 Save & Create Company Account'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
