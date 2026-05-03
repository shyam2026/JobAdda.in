'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Building2, Plus, Search, Globe, MapPin, Mail, Loader2, X, CheckCircle, ExternalLink, LayoutGrid, List, Edit2, Trash2, Phone, User, Calendar, Users, Info, Upload, Eye, EyeOff } from 'lucide-react';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [submitting, setSubmitting] = useState(false);
  const [editCompany, setEditCompany] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [formData, setFormData] = useState<any>({
    companyName: '', email: '', password: '', name: '', contactNo: '',
    website: '', hq: '', bio: '', size: '', type: '', industry: '', founded: '', moreDetails: '',
    logo: null
  });

  const [editFormData, setEditFormData] = useState<any>({
    companyName: '', email: '', name: '', contactNo: '',
    website: '', hq: '', bio: '', size: '', type: '', industry: '', founded: '', moreDetails: '',
    password: '', logo: null
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/admin/companies');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCompanies(data);
      } else {
        setCompanies([]);
      }
    } catch (err) {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, mode: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert("File size must be less than 500KB");
        e.target.value = '';
        return;
      }
      if (mode === 'add') setFormData({ ...formData, logo: file });
      else setEditFormData({ ...editFormData, logo: file });
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      const res = await fetch('/api/admin/companies', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      setShowAddModal(false);
      setFormData({
        companyName: '', email: '', password: '', name: '', contactNo: '',
        website: '', hq: '', bio: '', size: '', type: '', industry: '', founded: '', moreDetails: '',
        logo: null
      });
      fetchCompanies();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (company: any) => {
    setEditCompany(company);
    setEditFormData({
      companyName: company.companyName || '',
      email: company.email || '',
      name: company.name || '',
      contactNo: company.contactNo || '',
      website: company.website || '',
      hq: company.hq || '',
      bio: company.bio || '',
      size: company.size || '',
      type: company.type || '',
      industry: company.industry || '',
      founded: company.founded || '',
      moreDetails: company.moreDetails || '',
      password: '',
      logo: null
    });
    setShowEditModal(true);
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(editFormData).forEach(key => {
        if (editFormData[key] !== null) {
          if (key === 'password' && !editFormData[key]) return;
          data.append(key, editFormData[key]);
        }
      });

      const res = await fetch(`/api/admin/companies/${editCompany.id}`, {
        method: 'PATCH',
        body: data
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      setShowEditModal(false);
      fetchCompanies();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company? All associated jobs will also be affected.')) return;
    try {
      const res = await fetch(`/api/admin/companies/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCompanies();
    } catch (err) {
      alert('Failed to delete company');
    }
  };

  const filtered = (Array.isArray(companies) ? companies : []).filter(c => 
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex-center" style={{ height: '60vh' }}>
      <Loader2 className="spin" size={32} />
    </div>
  );

  return (
    <div className="admin-page anim-fade-up">
      <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.02em' }}>
            Company <span className="text-gradient">Partners</span>
          </h1>
          <p style={{ color: 'var(--text-3)' }}>Manage employer profiles and hiring organizations.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="view-toggle" style={{ display: 'flex', background: 'var(--bg-2)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ padding: '8px', borderRadius: '8px', border: 'none', background: viewMode === 'grid' ? 'var(--bg-3)' : 'transparent', color: viewMode === 'grid' ? 'var(--primary-light)' : 'var(--text-3)', cursor: 'pointer' }}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              style={{ padding: '8px', borderRadius: '8px', border: 'none', background: viewMode === 'list' ? 'var(--bg-3)' : 'transparent', color: viewMode === 'list' ? 'var(--primary-light)' : 'var(--text-3)', cursor: 'pointer' }}
            >
              <List size={18} />
            </button>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Plus size={20} /> Add New Company
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
        <input 
          placeholder="Search by company name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '3.25rem', height: '52px', borderRadius: '14px' }}
        />
      </div>

      {viewMode === 'grid' ? (
        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {filtered.map(c => (
            <div key={c.id} className="card card-p" style={{ border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-light)' }}>
                  {c.logo ? <img src={c.logo} alt="" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} /> : c.companyName?.[0]}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.companyName}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={12} /> {c.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} className="text-muted" /> {c.hq || 'Location Not Set'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-3)', padding: '4px 8px', borderRadius: '6px', width: 'fit-content' }}>
                   {c.industry || 'No Sector'} • {c.type || 'Private'}
                </div>
                {c.website && (
                  <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <Globe size={14} /> {c.website.replace('https://', '').replace('http://', '')}
                  </a>
                )}
              </div>
              
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: '700' }}>ID: {c.id}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--primary-light)', fontWeight: '600' }}>Slug: {c.slug}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenEdit(c)} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem' }} title="Edit"><Edit2 size={14} /></button>
                  <button onClick={() => handleDeleteCompany(c.id)} className="btn btn-ghost btn-sm text-danger" style={{ padding: '0.4rem' }} title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-2)' }}>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem' }}>Company</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem' }}>Industry</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem' }}>HQ Location</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem' }}>Email</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '800' }}>
                        {c.logo ? <img src={c.logo} alt="" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} /> : c.companyName?.[0]}
                      </div>
                      <span style={{ fontWeight: '600', color: 'var(--text)' }}>{c.companyName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-light)' }}>{c.industry || '---'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{c.type}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-3)', fontSize: '0.9rem' }}>{c.hq || '---'}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-3)', fontSize: '0.9rem' }}>{c.email}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenEdit(c)} className="btn btn-ghost btn-sm"><Edit2 size={14} /> Edit</button>
                      <button onClick={() => handleDeleteCompany(c.id)} className="btn btn-ghost btn-sm text-danger"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="modal-overlay anim-fade-up" style={{ marginTop: '3rem' }}>
          <div className="modal" style={{ maxWidth: '700px', background: '#0f172a', border: '1px solid #1e293b', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>Register Company</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>Fill the details to start.</p>
            
            <form onSubmit={handleAddCompany} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}><Building2 size={14} /> Company Name *</label>
                  <input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="e.g. Google" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}><User size={14} /> Contact Person Name</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full name" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}><Mail size={14} /> Official Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="hr@company.com" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Create Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})} 
                      placeholder="Min 6 characters" 
                      style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', paddingRight: '2.5rem' }} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}><Phone size={14} /> Contact No</label>
                  <input value={formData.contactNo} onChange={e => setFormData({...formData, contactNo: e.target.value})} placeholder="+91 ..." style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}><Globe size={14} /> Website</label>
                  <input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://..." style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}><MapPin size={14} /> Headquarters</label>
                  <input value={formData.hq} onChange={e => setFormData({...formData, hq: e.target.value})} placeholder="City, Country" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}><Calendar size={14} /> Founded Year</label>
                  <input value={formData.founded} onChange={e => setFormData({...formData, founded: e.target.value})} placeholder="e.g. 1998" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}><Users size={14} /> Company Size</label>
                  <select value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', padding: '0.65rem', borderRadius: '8px' }}>
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Industry Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', padding: '0.65rem', borderRadius: '8px' }}>
                    <option value="">Select Type</option>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                    <option value="Government">Government</option>
                    <option value="Private (OPC)">Private (OPC)</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Proprietorship">Proprietorship</option>
                    <option value="MNC">MNC / Multinational</option>
                    <option value="Startup">Startup</option>
                    <option value="NGO">NGO / Non-Profit</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Industry Sector</label>
                  <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', padding: '0.65rem', borderRadius: '8px' }}>
                    <option value="">Select Sector</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Finance & Banking">Finance & Banking</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Media & Entertainment">Media & Entertainment</option>
                    <option value="FMCG">FMCG</option>
                    <option value="Retail">Retail</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="input-group" style={{ opacity: 0, pointerEvents: 'none' }}>
                  <label className="label">Placeholder</label>
                  <input readOnly />
                </div>
              </div>

              <div className="input-group">
                <label className="label" style={{ color: '#cbd5e1' }}><Info size={14} /> Short Bio</label>
                <textarea rows={2} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="A brief overview of the company..." style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '8px' }} />
              </div>

              <div className="input-group">
                <label className="label" style={{ color: '#cbd5e1' }}>More Details (HTML or Plain Text)</label>
                <textarea rows={3} value={formData.moreDetails} onChange={e => setFormData({...formData, moreDetails: e.target.value})} placeholder="Detailed company information, culture, benefits, etc." style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '8px' }} />
              </div>

              <div className="input-group">
                <label className="label" style={{ color: '#cbd5e1' }}><Upload size={14} /> Company Logo (JPG/PNG, max 500kb)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #334155', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: '#1e293b', color: '#94a3b8' }}
                >
                  {formData.logo ? (
                    <div style={{ color: 'var(--primary-light)', fontWeight: '600' }}>{formData.logo.name} selected</div>
                  ) : (
                    <>Click to upload or drag & drop</>
                  )}
                  <input type="file" ref={fileInputRef} hidden accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleFileChange(e, 'add')} />
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1, borderColor: '#334155' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2 }}>{submitting ? 'Registering...' : 'Complete Registration'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '700px', background: '#0f172a', border: '1px solid #1e293b', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>Edit Company Profile</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>Update information for {editCompany?.companyName}.</p>
            
            <form onSubmit={handleUpdateCompany} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Company Name *</label>
                  <input required value={editFormData.companyName} onChange={e => setEditFormData({...editFormData, companyName: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Contact Person</label>
                  <input value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Official Email</label>
                  <input type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>New Password (Leave blank)</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showEditPassword ? "text" : "password"} 
                      value={editFormData.password} 
                      onChange={e => setEditFormData({...editFormData, password: e.target.value})} 
                      style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', paddingRight: '2.5rem' }} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {showEditPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Contact No</label>
                  <input value={editFormData.contactNo} onChange={e => setEditFormData({...editFormData, contactNo: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Website</label>
                  <input value={editFormData.website} onChange={e => setEditFormData({...editFormData, website: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Headquarters</label>
                  <input value={editFormData.hq} onChange={e => setEditFormData({...editFormData, hq: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Founded Year</label>
                  <input value={editFormData.founded} onChange={e => setEditFormData({...editFormData, founded: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Company Size</label>
                  <select value={editFormData.size} onChange={e => setEditFormData({...editFormData, size: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', padding: '0.65rem', borderRadius: '8px' }}>
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Industry Type</label>
                  <select value={editFormData.type} onChange={e => setEditFormData({...editFormData, type: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', padding: '0.65rem', borderRadius: '8px' }}>
                    <option value="">Select Type</option>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                    <option value="Government">Government</option>
                    <option value="Private (OPC)">Private (OPC)</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Proprietorship">Proprietorship</option>
                    <option value="MNC">MNC / Multinational</option>
                    <option value="Startup">Startup</option>
                    <option value="NGO">NGO / Non-Profit</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1' }}>Industry Sector</label>
                  <select value={editFormData.industry} onChange={e => setEditFormData({...editFormData, industry: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', padding: '0.65rem', borderRadius: '8px' }}>
                    <option value="">Select Sector</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Finance & Banking">Finance & Banking</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Media & Entertainment">Media & Entertainment</option>
                    <option value="FMCG">FMCG</option>
                    <option value="Retail">Retail</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="input-group" style={{ opacity: 0, pointerEvents: 'none' }}>
                  <label className="label">Placeholder</label>
                  <input readOnly />
                </div>
              </div>

              <div className="input-group">
                <label className="label" style={{ color: '#cbd5e1' }}>Short Bio</label>
                <textarea rows={2} value={editFormData.bio} onChange={e => setEditFormData({...editFormData, bio: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '8px' }} />
              </div>

              <div className="input-group">
                <label className="label" style={{ color: '#cbd5e1' }}>More Details</label>
                <textarea rows={3} value={editFormData.moreDetails} onChange={e => setEditFormData({...editFormData, moreDetails: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '8px' }} />
              </div>

              <div className="input-group">
                <label className="label" style={{ color: '#cbd5e1' }}>Update Logo (JPG/PNG, max 500kb)</label>
                <div 
                  onClick={() => editFileInputRef.current?.click()}
                  style={{ border: '2px dashed #334155', borderRadius: '10px', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: '#1e293b', color: '#94a3b8' }}
                >
                  {editFormData.logo ? (
                    <div style={{ color: 'var(--primary-light)', fontWeight: '600' }}>{editFormData.logo.name} selected</div>
                  ) : (
                    <>Click to change logo</>
                  )}
                  <input type="file" ref={editFileInputRef} hidden accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleFileChange(e, 'edit')} />
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline" style={{ flex: 1, borderColor: '#334155' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2 }}>{submitting ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .text-gradient { background: linear-gradient(135deg, var(--primary-light), #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .text-danger { color: #ef4444 !important; }
        table th { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; border-bottom: 1px solid var(--border); }
        .label { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem; font-weight: 600; font-size: 0.88rem; }
      `}</style>
    </div>
  );
}


