'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, Globe, Users, MapPin, Loader2, CheckCircle, 
  AlertCircle, Mail, Lock, User, Phone, Calendar, 
  Info, Upload, Plus, Trash2, Award, Briefcase, Compass
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

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

  // Initialize moreDetails as parsed array
  const getInitialMoreDetails = (): Array<{ title: string; value: string }> => {
    try {
      const raw = initialData.moreDetails;
      if (raw && typeof raw === 'string' && raw.trim().startsWith('[') && raw.trim().endsWith(']')) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  };

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
    type: initialData.type || 'Private',
    industry: initialData.industry || '',
    bio: initialData.bio || '',
    logo: initialData.logo || '',
  });

  const [moreDetails, setMoreDetails] = useState<Array<{ title: string; value: string }>>(getInitialMoreDetails());

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }));
    setSuccess('');
    setError('');
  };

  const addDetail = () => {
    setMoreDetails(prev => [...prev, { title: '', value: '' }]);
  };

  const removeDetail = (index: number) => {
    setMoreDetails(prev => prev.filter((_, i) => i !== index));
  };

  const updateDetail = (index: number, field: 'title' | 'value', val: string) => {
    setMoreDetails(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
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
        setSelectedFile(null);
        setSuccess('Logo uploaded successfully! Make sure to Save Changes to apply it.');
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

    // Filter out incomplete custom fields
    const filteredDetails = moreDetails.filter(d => d.title.trim() && d.value.trim());

    const payload = { 
      ...form,
      moreDetails: JSON.stringify(filteredDetails)
    };

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
        setForm(prev => ({ ...prev, password: '' }));
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

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1000px', width: '100%' }}>
      
      {/* SECTION 1: CREDENTIALS & BRANDING */}
      <Card padding="lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
            <Building2 size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>1. Login & Identity</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-3)' }}>Your official account credentials and platform identity.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Company Name */}
            <div className="input-group">
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                Company Name *
              </label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input required value={form.companyName} onChange={set('companyName')} placeholder="e.g. Acme Corp" style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>

            {/* Representative Name */}
            <div className="input-group">
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                Contact Person Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input value={form.name} onChange={set('name')} placeholder="John Doe" style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Official Email */}
            <div className="input-group">
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                Official Email (Read-Only)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input type="email" value={form.email} onChange={set('email')} placeholder="hr@company.com" disabled style={{ paddingLeft: '2.75rem', opacity: 0.65, cursor: 'not-allowed' }} />
              </div>
            </div>

            {/* Password Update */}
            <div className="input-group">
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                Change Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input type="password" value={form.password} onChange={set('password')} placeholder="Leave blank to keep current" style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>

          </div>
        </div>
      </Card>

      {/* SECTION 2: SPECIFICATIONS & METRIC */}
      <Card padding="lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
            <Compass size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>2. Organization Details</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-3)' }}>Localization, industry metrics, and external handles.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Contact No */}
            <div className="input-group">
              <label className="label">Contact No</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input type="tel" value={form.contactNo} onChange={set('contactNo')} placeholder="+91 ..." style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>

            {/* Website URL */}
            <div className="input-group">
              <label className="label">Website Link</label>
              <div style={{ position: 'relative' }}>
                <Globe size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input type="url" value={form.website} onChange={set('website')} placeholder="https://company.com" style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Headquarters */}
            <div className="input-group">
              <label className="label">Headquarters</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input type="text" value={form.hq} onChange={set('hq')} placeholder="e.g. Mumbai, India" style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>

            {/* Founded Year */}
            <div className="input-group">
              <label className="label">Founded Year</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input type="text" value={form.founded} onChange={set('founded')} placeholder="e.g. 2012" style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Company Size */}
            <div className="input-group">
              <label className="label">Company Size</label>
              <div style={{ position: 'relative' }}>
                <Users size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', zIndex: 10 }} />
                <select value={form.size} onChange={set('size')} style={{ paddingLeft: '2.75rem', appearance: 'none', cursor: 'pointer' }}>
                  <option value="" style={{ background: 'var(--bg-2)' }}>Select Size</option>
                  {SIZES.map(s => <option key={s} value={s} style={{ background: 'var(--bg-2)' }}>{s} Employees</option>)}
                </select>
              </div>
            </div>

            {/* Company Type */}
            <div className="input-group">
              <label className="label">Company Type</label>
              <select value={form.type} onChange={set('type')} style={{ cursor: 'pointer' }}>
                <option value="Private" style={{ background: 'var(--bg-2)' }}>Private</option>
                <option value="Public" style={{ background: 'var(--bg-2)' }}>Public</option>
                <option value="NGO" style={{ background: 'var(--bg-2)' }}>NGO</option>
                <option value="Government" style={{ background: 'var(--bg-2)' }}>Government</option>
              </select>
            </div>

          </div>

          {/* Industry Sector */}
          <div className="input-group">
            <label className="label">Industry Sector</label>
            <select value={form.industry} onChange={set('industry')} style={{ cursor: 'pointer', maxWidth: 'calc(50% - 0.75rem)' }}>
              <option value="" style={{ background: 'var(--bg-2)' }}>Select Sector</option>
              {INDUSTRIES.map(i => <option key={i} value={i} style={{ background: 'var(--bg-2)' }}>{i}</option>)}
            </select>
          </div>

          {/* Short Bio */}
          <div className="input-group">
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} style={{ color: 'var(--text-3)' }} /> About Company (Tiptap / Rich HTML supported)
            </label>
            <textarea 
              rows={4} 
              value={form.bio} 
              onChange={set('bio')} 
              placeholder="Tell candidates about your company culture, mission, and achievements..." 
              style={{ resize: 'vertical', minHeight: '140px' }} 
            />
          </div>

        </div>
      </Card>

      {/* SECTION 3: LOGO UPLOADER */}
      <Card padding="lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
            <Upload size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>3. Company Branding Logo</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-3)' }}>Upload a transparent PNG or high quality JPG logo.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Logo preview circle/square */}
          <div
            style={{ 
              position: 'relative', 
              width: '140px', 
              height: '140px', 
              flexShrink: 0, 
              borderRadius: '20px', 
              border: '2px dashed var(--border-active)', 
              background: 'rgba(255,255,255,0.02)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              overflow: 'hidden', 
              cursor: 'pointer', 
              transition: 'var(--transition)' 
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-light)'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-active)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
          >
            <input type="file" accept="image/png, image/jpeg" onChange={handleFileSelect} onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 10 }} />
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : form.logo ? (
              <img src={form.logo} alt="Company logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
            ) : (
              <>
                <Upload size={28} style={{ color: 'var(--text-3)', marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: '700', textAlign: 'center', padding: '0 0.5rem' }}>Click to Upload</span>
              </>
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '240px' }}>
            {selectedFile ? (
              <>
                <div>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text)' }}>{selectedFile.name}</span>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-3)' }}>{(selectedFile.size / 1024).toFixed(1)} KB · Ready to transmit</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={uploadingLogo}
                    className="btn btn-primary btn-sm"
                  >
                    {uploadingLogo ? (
                      <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Uploading...</>
                    ) : (
                      'Save Brand Logo'
                    )}
                  </button>
                  <button type="button" onClick={() => setSelectedFile(null)} className="btn btn-outline btn-sm">Cancel</button>
                </div>
              </>
            ) : form.logo ? (
              <>
                <div>
                  <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={16} /> Logo Fully Synchronized
                  </span>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-3)', wordBreak: 'break-all' }}>{form.logo}</p>
                </div>
                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', width: 'fit-content' }}>
                  <input type="file" accept="image/png, image/jpeg" onChange={handleFileSelect} style={{ display: 'none' }} />
                  Change Logo
                </label>
              </>
            ) : (
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text)' }}>No branding logo selected</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-3)' }}>Images help build trust with applicants.</p>
              </div>
            )}
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.4 }}>
              Accepted formats: PNG, JPG, JPEG &nbsp;·&nbsp; Size limit: 500 KB &nbsp;·&nbsp; Ratio: Square (200×200px) is ideal.
            </p>
          </div>

        </div>
      </Card>

      {/* SECTION 4: CUSTOM FIELDS (MORE DETAILS) */}
      <Card padding="lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <Award size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>4. Custom Profiles</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-3)' }}>Add fully customized metric fields to your profile.</p>
            </div>
          </div>
          <button type="button" onClick={addDetail} className="btn btn-outline btn-sm">
            <Plus size={16} /> Add Custom Field
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {moreDetails.map((detail, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 48px', gap: '1rem', alignItems: 'end' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="label" style={{ fontSize: '0.75rem' }}>Field Title (e.g. CEO)</label>
                <input 
                  className="input" 
                  placeholder="e.g. CEO" 
                  value={detail.title} 
                  onChange={e => updateDetail(idx, 'title', e.target.value)} 
                />
              </div>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="label" style={{ fontSize: '0.75rem' }}>Field Value (e.g. Elon Musk)</label>
                <input 
                  className="input" 
                  placeholder="e.g. Elon Musk" 
                  value={detail.value} 
                  onChange={e => updateDetail(idx, 'value', e.target.value)} 
                />
              </div>
              <button 
                type="button" 
                onClick={() => removeDetail(idx)} 
                className="btn btn-danger btn-sm" 
                style={{ padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {moreDetails.length === 0 && (
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-3)', textAlign: 'center', padding: '2rem 1rem', border: '1px dashed var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
              No custom metadata fields added yet. Feel free to define your own fields!
            </p>
          )}
        </div>
      </Card>

      {/* FEEDBACK STATUS & SUMBIT TRIGGER */}
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

        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary btn-lg"
            style={{ minWidth: '220px', justifyContent: 'center' }}
          >
            {loading ? (
              <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Saving changes...</>
            ) : (
              'Save Profile Changes'
            )}
          </button>
        </div>
      </div>

    </form>
  );
}
