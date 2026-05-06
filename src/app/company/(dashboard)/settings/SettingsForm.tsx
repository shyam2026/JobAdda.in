'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Globe, Users, MapPin, Loader2, CheckCircle, AlertCircle, Mail, Lock, User, Phone, Calendar, Info, Upload } from 'lucide-react';

const INDUSTRIES = [
  'Information Technology', 'Software', 'SaaS', 'E-Commerce', 'EdTech', 'Finance', 'Banking', 'FinTech',
  'Healthcare', 'Pharmaceuticals', 'Education', 'Manufacturing', 'Industrial', 'Media', 'Entertainment',
  'FMCG', 'Consumer Goods', 'Retail', 'Apparel', 'Real Estate', 'Construction', 'Telecommunications',
  'Logistics', 'Supply Chain', 'Hospitality', 'Tourism', 'Automobile', 'Agriculture', 'Food Processing',
  'Energy', 'Utilities', 'Consulting', 'Human Resources', 'Legal Services', 'Advertising', 'Marketing',
  'Aerospace', 'Defense', 'Fashion', 'Lifestyle', 'Gems & Jewelry', 'Insurance', 'Mining', 'Oil & Gas',
  'NGO', 'Non-Profit', 'Government', 'Public Sector', 'Other'
];
const SIZES = ['1-10', '11-50', '51-200', '201-500', '500-1000', '1000+'];

export function SettingsForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [form, setForm] = useState({
    companyName: initialData.companyName || '',
    name: initialData.name || '',
    email: initialData.email || '',
    password: '',
    contactNo: initialData.contactNo || '',
    website: initialData.website || '',
    hq: initialData.hq || '',
    founded: initialData.founded || '',
    size: initialData.size || '',
    type: initialData.type || '',
    industry: initialData.industry || '',
    bio: initialData.bio || '',
    moreDetails: initialData.moreDetails || '',
    logo: initialData.logo || '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }));
    setSuccess('');
    setError('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        setError('Logo must be under 500KB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUploadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setUploadingLogo(true);
    setError('');
    setSuccess('');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setForm(prev => ({ ...prev, logo: data.url }));
        setSelectedFile(null); // Clear selected so we just show the uploaded logo preview
        setSuccess('Logo uploaded successfully! Make sure to Save Changes to apply it to your profile.');
      } else {
        setError(data.error || 'Failed to upload logo.');
      }
    } catch (err) {
      setError('A network error occurred while uploading.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // If password is empty, don't send it to update
    const payload = { ...form };
    if (!payload.password) {
      delete (payload as any).password;
    }

    try {
      const res = await fetch('/api/company/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Profile updated successfully!');
        setForm(prev => ({ ...prev, password: '' })); // clear password field
        router.refresh();
      } else {
        setError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.85rem 1.25rem', background: '#1e293b',
    border: '1px solid #334155', borderRadius: '12px',
    color: '#f8fafc', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s'
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', 
    fontWeight: '700', color: '#f8fafc', marginBottom: '0.6rem'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Company Name */}
        <div>
          <label style={labelStyle}><Building2 size={16} style={{ color: '#94a3b8' }} /> Company Name *</label>
          <input required value={form.companyName} onChange={set('companyName')} placeholder="e.g. Google" style={inputStyle} />
        </div>

        {/* Contact Person Name */}
        <div>
          <label style={labelStyle}><User size={16} style={{ color: '#94a3b8' }} /> Contact Person Name</label>
          <input value={form.name} onChange={set('name')} placeholder="Full name" style={inputStyle} />
        </div>

        {/* Official Email */}
        <div>
          <label style={labelStyle}><Mail size={16} style={{ color: '#94a3b8' }} /> Official Email</label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="hr@company.com" style={inputStyle} disabled title="Email cannot be changed directly" />
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}><Lock size={16} style={{ color: '#94a3b8' }} /> Update Password</label>
          <input type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters (Leave blank to keep current password)" style={inputStyle} />
        </div>

        {/* Contact No */}
        <div>
          <label style={labelStyle}><Phone size={16} style={{ color: '#94a3b8' }} /> Contact No</label>
          <input type="tel" value={form.contactNo} onChange={set('contactNo')} placeholder="+91 ..." style={inputStyle} />
        </div>

        {/* Website */}
        <div>
          <label style={labelStyle}><Globe size={16} style={{ color: '#94a3b8' }} /> Website</label>
          <input type="url" value={form.website} onChange={set('website')} placeholder="https://..." style={inputStyle} />
        </div>

        {/* Headquarters */}
        <div>
          <label style={labelStyle}><MapPin size={16} style={{ color: '#94a3b8' }} /> Headquarters</label>
          <input type="text" value={form.hq} onChange={set('hq')} placeholder="City, Country" style={inputStyle} />
        </div>

        {/* Founded Year */}
        <div>
          <label style={labelStyle}><Calendar size={16} style={{ color: '#94a3b8' }} /> Founded Year</label>
          <input type="text" value={form.founded} onChange={set('founded')} placeholder="e.g. 1998" style={inputStyle} />
        </div>

        {/* Company Size */}
        <div>
          <label style={labelStyle}><Users size={16} style={{ color: '#94a3b8' }} /> Company Size</label>
          <select value={form.size} onChange={set('size')} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
            <option value="" disabled>Select Size</option>
            {SIZES.map(s => <option key={s} value={s} style={{ background: '#0f172a' }}>{s}</option>)}
          </select>
        </div>

        {/* Industry Type */}
        <div>
          <label style={labelStyle}>Industry Type</label>
          <select value={form.type} onChange={set('type')} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
            <option value="" disabled>Select Type</option>
            <option value="Private" style={{ background: '#0f172a' }}>Private</option>
            <option value="Public" style={{ background: '#0f172a' }}>Public</option>
            <option value="Non-Profit" style={{ background: '#0f172a' }}>Non-Profit</option>
            <option value="Government" style={{ background: '#0f172a' }}>Government</option>
          </select>
        </div>

      </div>

      {/* Industry Sector */}
      <div>
        <label style={labelStyle}>Industry Sector</label>
        <select value={form.industry} onChange={set('industry')} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', maxWidth: 'calc(50% - 0.75rem)' }}>
          <option value="" disabled>Select Sector</option>
          {INDUSTRIES.map(i => <option key={i} value={i} style={{ background: '#0f172a' }}>{i}</option>)}
        </select>
      </div>

      {/* Short Bio */}
      <div>
        <label style={labelStyle}><Info size={16} style={{ color: '#94a3b8' }} /> Short Bio</label>
        <textarea 
          rows={4} 
          value={form.bio} 
          onChange={set('bio')} 
          placeholder="A brief overview of the company..." 
          style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} 
        />
      </div>

      {/* More Details */}
      <div>
        <label style={labelStyle}>More Details (HTML or Plain Text)</label>
        <textarea 
          rows={6} 
          value={form.moreDetails} 
          onChange={set('moreDetails')} 
          placeholder="Detailed company information, culture, benefits, etc." 
          style={{ ...inputStyle, resize: 'vertical', minHeight: '150px' }} 
        />
      </div>

      {/* Company Logo */}
      <div>
        <label style={labelStyle}><Upload size={16} style={{ color: '#94a3b8' }} /> Company Logo (JPG/PNG, max 500kb)</label>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'stretch', background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', flexWrap: 'wrap' }}>

          {/* Left — Square preview / drop zone */}
          <div
            style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, borderRadius: '14px', border: '2px dashed #334155', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.background = 'rgba(129,140,248,0.07)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.background = '#0f172a'; }}
          >
            <input type="file" accept="image/png, image/jpeg" onChange={handleFileSelect} onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : form.logo && form.logo.length > 0 ? (
              <img src={form.logo} alt="Current logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
            ) : (
              <>
                <Upload size={30} style={{ color: '#475569', marginBottom: '0.35rem' }} />
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', textAlign: 'center', padding: '0 0.5rem' }}>Click to choose</span>
              </>
            )}
          </div>

          {/* Right — Info + actions */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', minWidth: '200px' }}>

            {/* State: file chosen, pending upload */}
            {selectedFile ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>{selectedFile.name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{(selectedFile.size / 1024).toFixed(1)} KB &nbsp;·&nbsp; Ready to upload</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={uploadingLogo}
                    style={{
                      background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: '#fff',
                      border: 'none', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: '700',
                      fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      cursor: uploadingLogo ? 'not-allowed' : 'pointer', transition: 'all 0.2s', width: 'fit-content',
                      boxShadow: '0 4px 14px rgba(99,102,241,0.3)', opacity: uploadingLogo ? 0.7 : 1,
                    }}
                  >
                    {uploadingLogo
                      ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Uploading...</>
                      : <><Upload size={15} /> {form.logo ? 'Re-upload Logo' : 'Upload Logo'}</>
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    style={{
                      background: 'transparent', color: '#94a3b8', border: '1px solid #334155',
                      padding: '0.6rem 1rem', borderRadius: '10px', fontWeight: '600',
                      fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : form.logo && form.logo.length > 0 ? (
              /* State: logo already saved, nothing staged */
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={16} /> Logo Saved
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', wordBreak: 'break-all' }}>
                    {form.logo.substring(0, 55)}{form.logo.length > 55 ? '...' : ''}
                  </span>
                </div>
                {/* Re-upload trigger — acts as a label for the hidden input in the left box */}
                <label
                  style={{
                    background: '#1e293b', color: '#818cf8', border: '1px solid #6366f1',
                    padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: '700',
                    fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    cursor: 'pointer', transition: 'all 0.2s', width: 'fit-content',
                    boxShadow: '0 0 0 0 transparent'
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1e293b'; }}
                >
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileSelect}
                    onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                    style={{ display: 'none' }}
                  />
                  <Upload size={15} /> Re-upload Logo
                </label>
              </>
            ) : (
              /* State: no logo at all */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>No logo uploaded</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Click the preview box or drag & drop a file</span>
              </div>
            )}

            <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
              PNG or JPG &nbsp;·&nbsp; Max 500 KB &nbsp;·&nbsp; Recommended 200×200 px
            </p>
          </div>
        </div>
      </div>

      {/* Feedback & Submit */}
      <div style={{ marginTop: '0.5rem' }}>
        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', gap: '0.6rem', alignItems: 'center', color: '#f87171', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '1rem', background: 'rgba(52,211,153,0.1)', borderRadius: '12px', border: '1px solid rgba(52,211,153,0.2)', display: 'flex', gap: '0.6rem', alignItems: 'center', color: '#34d399', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} /> {success}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '1rem' }}>
          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              background: '#818cf8', color: '#0f172a', border: 'none', padding: '0.85rem 2rem', 
              borderRadius: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', 
              gap: '0.5rem', minWidth: '180px', justifyContent: 'center', cursor: loading ? 'not-allowed' : 'pointer', 
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s', fontSize: '1rem' 
            }}
          >
            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
}
