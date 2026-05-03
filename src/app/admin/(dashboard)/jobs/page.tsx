'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, MapPin, IndianRupee, Clock, X, Loader2, Building2, ExternalLink, ChevronDown, Filter } from 'lucide-react';
import { format } from "date-fns";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    description: '',
    location: '',
    salary: '',
    requirements: '',
    type: 'INTERNAL',
    category: 'Other',
    externalLink: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, companiesRes] = await Promise.all([
        fetch('/api/admin/jobs'),
        fetch('/api/admin/companies')
      ]);
      const [jobsData, companiesData] = await Promise.all([
        jobsRes.json(),
        companiesRes.json()
      ]);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      alert("Job posted successfully!");
      setShowAddModal(false);
      setFormData({
        companyId: '', title: '', description: '', location: '', salary: '', 
        requirements: '', type: 'INTERNAL', category: 'Other', externalLink: ''
      });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = (Array.isArray(jobs) ? jobs : []).filter(j => 
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Job <span className="text-gradient">Board</span>
          </h1>
          <p style={{ color: 'var(--text-3)' }}>Manage internal and external career opportunities.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={20} /> Create New Job
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
        <input 
          placeholder="Search by job title or company..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '3.25rem', height: '52px', borderRadius: '14px' }}
        />
      </div>

      <div className="grid-1" style={{ gap: '1rem' }}>
        {filtered.map(j => (
          <div key={j.id} className="card card-p-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 180px 180px 150px 100px', gap: '1.5rem', alignItems: 'center', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                <Building2 size={20} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{j.company.companyName}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-2)' }}>
              <MapPin size={14} className="text-muted" /> {j.location}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--success)' }}>
              <IndianRupee size={14} /> {j.salary || 'Best in Market'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span className={`badge ${j.type === 'INTERNAL' ? 'badge-primary' : 'badge-warning'}`} style={{ fontSize: '0.6rem', alignSelf: 'flex-start' }}>{j.type}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={10} /> {format(new Date(j.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button className="btn btn-ghost btn-sm">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ top: '15rem' }}>
          <div className="modal" style={{ maxWidth: '820px', background: '#0f172a', border: '1px solid #1e293b' }}>
            
            <h3 style={{ marginBottom: '0.5rem', color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>Create New Job Listing</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Fill in the details to publish a new job on the platform.</p>

            <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Posting Company *</label>
                  <select required value={formData.companyId} onChange={e => setFormData({...formData, companyId: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}>
                    <option value="">Select a company...</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName} ({c.id})</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Job Title *</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Software Engineer" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Location *</label>
                  <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Remote" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Salary Range</label>
                  <input value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="e.g. 5-8 LPA" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Job Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}>
                    <option value="INTERNAL">Internal (Apply on JobAdda)</option>
                    <option value="EXTERNAL">External (Link to Website)</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Job Description *</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detailed job description..." style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', borderRadius: '12px', padding: '1rem', resize: 'vertical' }} />
              </div>

              <div className="input-group">
                <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Key Requirements</label>
                <textarea rows={3} value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} placeholder="Skills, qualifications..." style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', width: '100%', borderRadius: '12px', padding: '1rem', resize: 'vertical' }} />
              </div>

              {formData.type === 'EXTERNAL' && (
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>External Link *</label>
                  <input required value={formData.externalLink} onChange={e => setFormData({...formData, externalLink: e.target.value})} placeholder="https://careers..." style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              )}

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', borderColor: '#334155', color: '#94a3b8' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                  {submitting ? 'Posting...' : 'Publish Job Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .text-gradient { background: linear-gradient(135deg, var(--primary-light), #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        select { width: 100%; height: 50px; border-radius: 12px; background: var(--bg-2); border: 1px solid var(--border); color: white; padding: 0 1rem; cursor: pointer; }
        textarea { width: 100%; border-radius: 12px; background: var(--bg-2); border: 1px solid var(--border); color: white; padding: 1rem; resize: vertical; }
      `}</style>
    </div>
  );
}
