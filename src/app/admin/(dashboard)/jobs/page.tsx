'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { createPortal } from 'react-dom';
import { Briefcase, Plus, Search, MapPin, IndianRupee, Clock, X, Loader2, Building2, ExternalLink, ChevronDown, Filter, Info, Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, RotateCcw, RotateCw, Trash2, Edit2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { format } from "date-fns";

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Full-time (WFH)', 'Remote', 'Hybrid', 'Part-time (WFH)', 'Contract (WFH)','Other'];
const EDUCATION_OPTIONS = ['10th', '12th', 'Graduation', 'B.tech', 'Masters', 'M.Tech', 'MBA', 'PhD', 'Others'];
const JOB_CATEGORIES = ['Software Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Human Resources', 'Customer Support', 'Operations', 'Others'];

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  return (
    <div className="tiptap-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', padding: '0.5rem', background: '#1e293b', border: '1px solid #334155', borderBottom: 'none', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`btn-tool ${editor.isActive('bold') ? 'active' : ''}`}><Bold size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`btn-tool ${editor.isActive('italic') ? 'active' : ''}`}><Italic size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`btn-tool ${editor.isActive('underline') ? 'active' : ''}`}><UnderlineIcon size={16} /></button>
      <div style={{ width: '1px', background: '#334155', margin: '0 0.25rem' }} />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`btn-tool ${editor.isActive('bulletList') ? 'active' : ''}`}><List size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`btn-tool ${editor.isActive('orderedList') ? 'active' : ''}`}><ListOrdered size={16} /></button>
      <div style={{ width: '1px', background: '#334155', margin: '0 0.25rem' }} />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} className="btn-tool"><RotateCcw size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className="btn-tool"><RotateCw size={16} /></button>
    </div>
  );
};

const Tiptap = ({ value, onChange, placeholder }: { value: string, onChange: (content: string) => void, placeholder: string }) => {
  const extensions = useMemo(() => [
    StarterKit.configure(),
    Underline.configure(),
    Placeholder.configure({ placeholder }),
  ], []);

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="tiptap-container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="tiptap-editor-content" style={{ 
        minHeight: '200px', 
        maxHeight: '400px', 
        overflowY: 'auto',
        background: 'var(--bg-2)', 
        border: '1px solid var(--border)', 
        padding: '1rem', 
        borderBottomLeftRadius: '8px', 
        borderBottomRightRadius: '8px',
        color: 'var(--text-2)',
        outline: 'none'
      }} />
    </div>
  );
};

export default function AdminJobsPage() {
  const { data: session } = useSession();
  const isSuperAdmin = (session?.user as any)?.role === 'SUPERADMIN';

  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    description: '',
    location: '',
    salary: '',
    requirements: '',
    type: 'INTERNAL',
    category: 'Software Engineering',
    employmentType: 'Full-time',
    externalLink: '',
    openings: '1',
    education: 'Graduation',
    experience: '',
    skills: ''
  });

  const [editFormData, setEditFormData] = useState({
    companyId: '',
    title: '',
    description: '',
    location: '',
    salary: '',
    requirements: '',
    type: 'INTERNAL',
    category: 'Software Engineering',
    employmentType: 'Full-time',
    externalLink: '',
    openings: '1',
    education: 'Graduation',
    experience: '',
    skills: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [editSkillInput, setEditSkillInput] = useState('');

  const insertText = (id: string, startTag: string, endTag: string = '', mode: 'add' | 'edit' = 'add') => {
    const el = document.getElementById(id) as HTMLTextAreaElement;
    if (!el) return;
    
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);
    
    const newValue = before + startTag + selected + endTag + after;
    
    if (mode === 'add') {
      if (id === 'description') setFormData({...formData, description: newValue});
      else if (id === 'requirements') setFormData({...formData, requirements: newValue});
    } else {
      if (id === 'edit-description') setEditFormData({...editFormData, description: newValue});
      else if (id === 'edit-requirements') setEditFormData({...editFormData, requirements: newValue});
    }
    
    // Focus back and set cursor
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + startTag.length, end + startTag.length);
    }, 0);
  };

  const toggleEmploymentType = (val: string, mode: 'add' | 'edit' = 'add') => {
    if (mode === 'add') {
      const current = formData.employmentType?.split(',').map(x => x.trim()).filter(x => x) || [];
      const next = current.includes(val) ? current.filter(x => x !== val) : [...current, val];
      setFormData({ ...formData, employmentType: next.join(', ') });
    } else {
      const current = editFormData.employmentType?.split(',').map(x => x.trim()).filter(x => x) || [];
      const next = current.includes(val) ? current.filter(x => x !== val) : [...current, val];
      setEditFormData({ ...editFormData, employmentType: next.join(', ') });
    }
  };

  // Removed TinyMCE config

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
        requirements: '', type: 'INTERNAL', category: 'Software Engineering', employmentType: 'Full-time', externalLink: '',
        openings: '1', education: 'Graduation', experience: '', skills: ''
      });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (job: any) => {
    setEditJobId(job.id);
    setEditFormData({
      companyId: job.companyId,
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary || '',
      requirements: job.requirements || '',
      type: job.type,
      category: job.category || 'Software Engineering',
      employmentType: job.employmentType || 'Full-time',
      externalLink: job.externalLink || '',
      openings: job.openings ? String(job.openings) : '1',
      education: job.education || 'Graduation',
      experience: job.experience || '',
      skills: job.skills || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editJobId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${editJobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      alert("Job updated successfully!");
      setShowEditModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete job");
      alert("Job deleted successfully!");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchData();
    } catch (err: any) {
      alert(err.message);
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

      <div className="grid-1" style={{ display: 'grid', gap: '0.8rem' }}>
        {filtered.map(j => (
          <div key={j.id} className="card card-p-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 180px 180px 150px 60px 100px', gap: '1.5rem', alignItems: 'center', border: '1px solid var(--border)' }}>
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

            <div style={{ display: 'flex', alignItems: 'center' }}>
              {isSuperAdmin ? (
                <div 
                  onClick={() => handleToggleStatus(j.id, j.status)}
                  style={{ 
                    width: '42px', height: '22px', borderRadius: '20px', 
                    background: j.status === 'OPEN' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    border: `1px solid ${j.status === 'OPEN' ? '#10b981' : '#ef4444'}`,
                    position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
                  }}
                  title={j.status === 'OPEN' ? "Click to Close Job" : "Click to Open Job"}
                >
                  <div style={{ 
                    position: 'absolute', top: '2px', left: j.status === 'OPEN' ? '22px' : '2px',
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: j.status === 'OPEN' ? '#10b981' : '#ef4444',
                    transition: 'all 0.3s'
                  }} />
                </div>
              ) : (
                <span style={{ 
                  fontSize: '0.65rem', 
                  padding: '3px 10px', 
                  background: j.status === 'OPEN' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                  color: j.status === 'OPEN' ? '#10b981' : '#ef4444', 
                  borderRadius: '6px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  border: `1px solid ${j.status === 'OPEN' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                }}>
                  {j.status}
                </span>
              )}
            </div>

            <div style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button onClick={() => handleOpenEdit(j)} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem' }} title="Edit"><Edit2 size={15} /></button>
              {isSuperAdmin && (
                <button onClick={() => handleDeleteJob(j.id)} className="btn btn-ghost btn-sm" style={{ color: '#ef4444', padding: '0.4rem' }} title="Delete"><Trash2 size={15} /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Job Modal */}
      {showAddModal && mounted && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 999999, background: 'rgba(5, 8, 20, 0.92)', backdropFilter: 'blur(10px)', padding: '4rem 1rem', overflowY: 'auto' }}>
          <div className="anim-fade-up" style={{ width: '100%', maxWidth: '820px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '28px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '2.5rem', marginBottom: '4rem' }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '0.5rem', color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>Create New Job Listing</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Fill in the details to publish a new job on the platform.</p>

            <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Posting Company *</label>
                  <select required value={formData.companyId} onChange={e => setFormData({...formData, companyId: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}>
                    <option value="">Select a company...</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Job Title *</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Software Engineer" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Location *</label>
                  <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Remote" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Salary Range</label>
                  <input value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="e.g. 5-8 LPA" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Job Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}>
                    <option value="INTERNAL">Internal (Apply on JobAdda)</option>
                    <option value="EXTERNAL">External (Link to Website)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Employment Type</label>
                  <select 
                    value={EMPLOYMENT_TYPES.filter(t => t !== 'Other').includes(formData.employmentType || '') ? (formData.employmentType || 'Full-time') : 'Other'} 
                    onChange={e => setFormData({...formData, employmentType: e.target.value === 'Other' ? '' : e.target.value})}
                    style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}
                  >
                    {EMPLOYMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {!EMPLOYMENT_TYPES.filter(t => t !== 'Other').includes(formData.employmentType || '') && (
                    <input 
                      required 
                      value={formData.employmentType === 'Other' ? '' : formData.employmentType} 
                      onChange={e => setFormData({...formData, employmentType: e.target.value})} 
                      placeholder="Specify custom employment type..." 
                      style={{ marginTop: '0.5rem', background: '#1e293b', border: '1px solid #334155', color: 'white' }} 
                    />
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>No. of Openings *</label>
                  <input type="number" required min="1" value={formData.openings} onChange={e => setFormData({...formData, openings: e.target.value})} placeholder="e.g. 1" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Experience (Years) *</label>
                  <input required value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="e.g. Fresher, 1-2 years" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Required Education *</label>
                  <select 
                    value={EDUCATION_OPTIONS.filter(o => o !== 'Others').includes(formData.education || '') ? (formData.education || 'Graduation') : 'Others'} 
                    onChange={e => setFormData({...formData, education: e.target.value === 'Others' ? '' : e.target.value})}
                    style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}
                  >
                    {EDUCATION_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {!EDUCATION_OPTIONS.filter(o => o !== 'Others').includes(formData.education || '') && (
                    <input 
                      required 
                      value={formData.education === 'Others' ? '' : formData.education} 
                      onChange={e => setFormData({...formData, education: e.target.value})} 
                      placeholder="Specify custom education..." 
                      style={{ marginTop: '0.5rem', background: '#1e293b', border: '1px solid #334155', color: 'white' }} 
                    />
                  )}
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Job Category *</label>
                  <select 
                    value={JOB_CATEGORIES.filter(o => o !== 'Others').includes(formData.category || '') ? (formData.category || 'Software Engineering') : 'Others'} 
                    onChange={e => setFormData({...formData, category: e.target.value === 'Others' ? '' : e.target.value})}
                    style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}
                  >
                    {JOB_CATEGORIES.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {!JOB_CATEGORIES.filter(o => o !== 'Others').includes(formData.category || '') && (
                    <input 
                      required 
                      value={formData.category === 'Others' ? '' : formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      placeholder="Specify custom category..." 
                      style={{ marginTop: '0.5rem', background: '#1e293b', border: '1px solid #334155', color: 'white' }} 
                    />
                  )}
                </div>
              </div>

              {formData.type === 'EXTERNAL' && (
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>External Link *</label>
                  <input required value={formData.externalLink} onChange={e => setFormData({...formData, externalLink: e.target.value})} placeholder="https://careers..." style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              )}


              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1', margin: 0, marginBottom: '0.4rem', display: 'block' }}>
                  <Info size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Job Description *
                </label>
                <Tiptap
                  value={formData.description}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  placeholder="Detailed job description..."
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1', margin: 0, marginBottom: '0.4rem', display: 'block' }}>
                  <Info size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Key Requirements *
                </label>
                <Tiptap
                  value={formData.requirements}
                  onChange={(content) => setFormData({ ...formData, requirements: content })}
                  placeholder="Skills, qualifications..."
                />
              </div>

              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1', margin: 0, marginBottom: '0.4rem', display: 'block' }}>
                  <Briefcase size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Required Skills
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const newSkills = skillInput.split(',').map(s => s.trim()).filter(Boolean);
                        if (newSkills.length > 0) {
                          const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
                          const combined = Array.from(new Set([...currentSkills, ...newSkills]));
                          setFormData({ ...formData, skills: combined.join(', ') });
                          setSkillInput('');
                        }
                      }
                    }}
                    placeholder="Type skill(s) (e.g. React, Node.js) and press Enter or click Add..."
                    style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', flex: 1, height: '46px', borderRadius: '8px', padding: '0 1rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSkills = skillInput.split(',').map(s => s.trim()).filter(Boolean);
                      if (newSkills.length > 0) {
                        const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
                        const combined = Array.from(new Set([...currentSkills, ...newSkills]));
                        setFormData({ ...formData, skills: combined.join(', ') });
                        setSkillInput('');
                      }
                    }}
                    className="btn btn-primary"
                    style={{ height: '46px', padding: '0 1.5rem', borderRadius: '8px' }}
                  >
                    Add
                  </button>
                </div>
                {formData.skills && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                    {formData.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, index) => (
                      <span key={index} style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                        {skill}
                        <button
                          type="button"
                          onClick={() => {
                            const currentSkills = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
                            const updated = currentSkills.filter(s => s !== skill);
                            setFormData({ ...formData, skills: updated.join(', ') });
                          }}
                          style={{ background: 'none', border: 'none', padding: 0, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>


              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', borderColor: '#334155', color: '#94a3b8' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                  {submitting ? 'Posting...' : 'Publish Job Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
      
      <style>{`
        .text-gradient { background: linear-gradient(135deg, var(--primary-light), #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        select { width: 100%; height: 50px; border-radius: 12px; background: var(--bg-2); border: 1px solid var(--border); color: white; padding: 0 1rem; cursor: pointer; }
        textarea { width: 100%; border-radius: 12px; background: var(--bg-2); border: 1px solid var(--border); color: white; padding: 1rem; resize: vertical; }
        .btn-tool { background: #334155; border: none; color: #cbd5e1; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; }
        .btn-tool:hover { background: var(--primary); color: white; }
        .quill-wrapper { background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; }
        .ql-toolbar { border: none !important; border-bottom: 1px solid #334155 !important; background: #0f172a; }
        .ql-container { border: none !important; min-height: 150px; font-family: 'Inter', sans-serif !important; font-size: 0.95rem !important; }
        .ql-editor { color: white !important; }
        .ql-editor.ql-blank::before { color: #64748b !important; font-style: normal !important; }
        .ql-stroke { stroke: #94a3b8 !important; }
        .ql-fill { fill: #94a3b8 !important; }
        .ql-picker { color: #94a3b8 !important; }
        /* Tiptap Styles */
        .tiptap-container { margin-bottom: 1rem; }
        .tiptap-toolbar .btn-tool {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 0.4rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .tiptap-toolbar .btn-tool:hover { background: #334155; color: white; }
        .tiptap-toolbar .btn-tool.active { background: var(--primary); color: white; }
        
        .ProseMirror {
          min-height: 200px;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #64748b;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; }
        .ProseMirror li { margin-bottom: 0.25rem; }
      `}</style>
      {/* Edit Job Modal */}
      {showEditModal && mounted && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 999999, background: 'rgba(5, 8, 20, 0.92)', backdropFilter: 'blur(10px)', padding: '4rem 1rem', overflowY: 'auto' }}>
          <div className="anim-fade-up" style={{ width: '100%', maxWidth: '820px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '28px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '2.5rem', marginBottom: '4rem' }}>
            <button
              onClick={() => setShowEditModal(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '0.5rem', color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>Edit Job Listing</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Modify the details of the existing job listing.</p>

            <form onSubmit={handleUpdateJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Posting Company *</label>
                  <select required value={editFormData.companyId} onChange={e => setEditFormData({...editFormData, companyId: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}>
                    <option value="">Select a company...</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Job Title *</label>
                  <input required value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Location *</label>
                  <input required value={editFormData.location} onChange={e => setEditFormData({...editFormData, location: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Salary Range</label>
                  <input value={editFormData.salary} onChange={e => setEditFormData({...editFormData, salary: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Job Type</label>
                  <select value={editFormData.type} onChange={e => setEditFormData({...editFormData, type: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}>
                    <option value="INTERNAL">Internal</option>
                    <option value="EXTERNAL">External</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Employment Type</label>
                  <select 
                    value={EMPLOYMENT_TYPES.filter(t => t !== 'Other').includes(editFormData.employmentType || '') ? (editFormData.employmentType || 'Full-time') : 'Other'} 
                    onChange={e => setEditFormData({...editFormData, employmentType: e.target.value === 'Other' ? '' : e.target.value})}
                    style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}
                  >
                    {EMPLOYMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {!EMPLOYMENT_TYPES.filter(t => t !== 'Other').includes(editFormData.employmentType || '') && (
                    <input 
                      required 
                      value={editFormData.employmentType === 'Other' ? '' : editFormData.employmentType} 
                      onChange={e => setEditFormData({...editFormData, employmentType: e.target.value})} 
                      placeholder="Specify custom employment type..." 
                      style={{ marginTop: '0.5rem', background: '#1e293b', border: '1px solid #334155', color: 'white' }} 
                    />
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>No. of Openings *</label>
                  <input type="number" required min="1" value={editFormData.openings} onChange={e => setEditFormData({...editFormData, openings: e.target.value})} placeholder="e.g. 1" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Experience (Years) *</label>
                  <input required value={editFormData.experience} onChange={e => setEditFormData({...editFormData, experience: e.target.value})} placeholder="e.g. Fresher, 1-2 years" style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Required Education *</label>
                  <select 
                    value={EDUCATION_OPTIONS.filter(o => o !== 'Others').includes(editFormData.education || '') ? (editFormData.education || 'Graduation') : 'Others'} 
                    onChange={e => setEditFormData({...editFormData, education: e.target.value === 'Others' ? '' : e.target.value})}
                    style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}
                  >
                    {EDUCATION_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {!EDUCATION_OPTIONS.filter(o => o !== 'Others').includes(editFormData.education || '') && (
                    <input 
                      required 
                      value={editFormData.education === 'Others' ? '' : editFormData.education} 
                      onChange={e => setEditFormData({...editFormData, education: e.target.value})} 
                      placeholder="Specify custom education..." 
                      style={{ marginTop: '0.5rem', background: '#1e293b', border: '1px solid #334155', color: 'white' }} 
                    />
                  )}
                </div>
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>Job Category *</label>
                  <select 
                    value={JOB_CATEGORIES.filter(o => o !== 'Others').includes(editFormData.category || '') ? (editFormData.category || 'Software Engineering') : 'Others'} 
                    onChange={e => setEditFormData({...editFormData, category: e.target.value === 'Others' ? '' : e.target.value})}
                    style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', height: '50px', borderRadius: '12px', width: '100%', padding: '0 1rem' }}
                  >
                    {JOB_CATEGORIES.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {!JOB_CATEGORIES.filter(o => o !== 'Others').includes(editFormData.category || '') && (
                    <input 
                      required 
                      value={editFormData.category === 'Others' ? '' : editFormData.category} 
                      onChange={e => setEditFormData({...editFormData, category: e.target.value})} 
                      placeholder="Specify custom category..." 
                      style={{ marginTop: '0.5rem', background: '#1e293b', border: '1px solid #334155', color: 'white' }} 
                    />
                  )}
                </div>
              </div>

              {editFormData.type === 'EXTERNAL' && (
                <div className="input-group">
                  <label className="label" style={{ color: '#cbd5e1', marginBottom: '0.2rem', display: 'block' }}>External Link *</label>
                  <input required value={editFormData.externalLink} onChange={e => setEditFormData({...editFormData, externalLink: e.target.value})} style={{ background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
                </div>
              )}


              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1', margin: 0, marginBottom: '0.4rem', display: 'block' }}>
                  <Info size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Job Description *
                </label>
                <Tiptap
                  value={editFormData.description}
                  onChange={(content) => setEditFormData({ ...editFormData, description: content })}
                  placeholder="Detailed job description..."
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#cbd5e1', margin: 0, marginBottom: '0.4rem', display: 'block' }}>
                  <Info size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Key Requirements *
                </label>
                <Tiptap
                  value={editFormData.requirements}
                  onChange={(content) => setEditFormData({ ...editFormData, requirements: content })}
                  placeholder="Skills, qualifications..."
                />
              </div>

              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1', margin: 0, marginBottom: '0.4rem', display: 'block' }}>
                  <Briefcase size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Required Skills
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={editSkillInput}
                    onChange={e => setEditSkillInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const newSkills = editSkillInput.split(',').map(s => s.trim()).filter(Boolean);
                        if (newSkills.length > 0) {
                          const currentSkills = editFormData.skills ? editFormData.skills.split(',').map(s => s.trim()) : [];
                          const combined = Array.from(new Set([...currentSkills, ...newSkills]));
                          setEditFormData({ ...editFormData, skills: combined.join(', ') });
                          setEditSkillInput('');
                        }
                      }
                    }}
                    placeholder="Type skill(s) (e.g. React, Node.js) and press Enter or click Add..."
                    style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', flex: 1, height: '46px', borderRadius: '8px', padding: '0 1rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSkills = editSkillInput.split(',').map(s => s.trim()).filter(Boolean);
                      if (newSkills.length > 0) {
                        const currentSkills = editFormData.skills ? editFormData.skills.split(',').map(s => s.trim()) : [];
                        const combined = Array.from(new Set([...currentSkills, ...newSkills]));
                        setEditFormData({ ...editFormData, skills: combined.join(', ') });
                        setEditSkillInput('');
                      }
                    }}
                    className="btn btn-primary"
                    style={{ height: '46px', padding: '0 1.5rem', borderRadius: '8px' }}
                  >
                    Add
                  </button>
                </div>
                {editFormData.skills && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                    {editFormData.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, index) => (
                      <span key={index} style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                        {skill}
                        <button
                          type="button"
                          onClick={() => {
                            const currentSkills = editFormData.skills.split(',').map(s => s.trim()).filter(Boolean);
                            const updated = currentSkills.filter(s => s !== skill);
                            setEditFormData({ ...editFormData, skills: updated.join(', ') });
                          }}
                          style={{ background: 'none', border: 'none', padding: 0, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>


              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', borderColor: '#334155', color: '#94a3b8' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                  {submitting ? 'Saving...' : 'Update Job Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
