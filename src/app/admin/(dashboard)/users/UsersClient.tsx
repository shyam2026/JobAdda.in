'use client';

import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Search, Users, Phone, Mail, Calendar, FileText, Briefcase, IndianRupee, ExternalLink, X, Download, ChevronUp, ChevronDown, Check, Filter } from 'lucide-react';
import Link from 'next/link';

interface Student {
  id: string; name: string | null; email: string; phone: string | null;
  walletBalance: number; createdAt: string;
  studentProfile: { profileImage: string | null; phone: string | null; location: string | null; linkedin: string | null; } | null;
  resumeConfig: { selectedTemplate: string } | null;
  _count: { applications: number; purchases: number; };
  totalSpent: number;
}

const ALL_EXPORT_COLS = [
  { id: 'name', label: 'Name' }, { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' }, { id: 'location', label: 'Location' },
  { id: 'joined', label: 'Joined Date' }, { id: 'applications', label: 'Applications' },
  { id: 'resume', label: 'Resume Template' }, { id: 'purchases', label: 'Purchases' },
  { id: 'spent', label: 'Amount Spent' }, { id: 'wallet', label: 'Wallet Balance' },
];

function fd(d: string) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }); }

function Avatar({ src, name, size = 36 }: { src?: string | null; name: string | null; size?: number }) {
  const initial = (name || '?')[0].toUpperCase();
  const colors = ['#6366f1','#10b981','#f59e0b','#ec4899','#14b8a6','#8b5cf6'];
  const color = colors[initial.charCodeAt(0) % colors.length];
  if (src) return <img src={src} alt={name||''} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }} />;
  return <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: `${color}22`, color, border: `2px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: size * 0.38 + 'px' }}>{initial}</div>;
}

function exportXLSX(data: Student[], cols: string[]) {
  const getVal = (u: Student, col: string): string | number => {
    const phone = u.studentProfile?.phone || u.phone || '';
    switch(col) {
      case 'name': return u.name || 'Unnamed';
      case 'email': return u.email;
      case 'phone': return phone;
      case 'location': return u.studentProfile?.location || '';
      case 'joined': return new Date(u.createdAt).toLocaleDateString('en-IN');
      case 'applications': return u._count.applications;
      case 'resume': return u.resumeConfig?.selectedTemplate || 'None';
      case 'purchases': return u._count.purchases;
      case 'spent': return u.totalSpent;
      case 'wallet': return u.walletBalance;
      default: return '';
    }
  };
  const header = cols.map(c => ALL_EXPORT_COLS.find(x => x.id === c)?.label || c);
  const rows = data.map(u => cols.map(c => getVal(u, c)));
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  // Auto column widths
  ws['!cols'] = header.map(() => ({ wch: 20 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Students');
  XLSX.writeFile(wb, `students_${new Date().toISOString().slice(0,10)}.xlsx`);
}

export default function AdminUsersClient({ users }: { users: Student[] }) {
  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name'|'joined'|'apps'|'spent'>('joined');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [viewUser, setViewUser] = useState<Student | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportCols, setExportCols] = useState<string[]>(['name','email','phone','joined','applications','spent']);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const from = dateFrom ? new Date(dateFrom).getTime() : null;
    const to = dateTo ? new Date(dateTo + 'T23:59:59').getTime() : null;
    let list = users.filter(u => {
      const matchQ = !q || (u.name||'').toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone||'').includes(q) || (u.studentProfile?.phone||'').includes(q);
      const t = new Date(u.createdAt).getTime();
      const matchDate = (!from || t >= from) && (!to || t <= to);
      return matchQ && matchDate;
    });
    list = [...list].sort((a,b) => {
      let va: any, vb: any;
      if (sortBy==='name') { va=(a.name||'').toLowerCase(); vb=(b.name||'').toLowerCase(); }
      else if (sortBy==='joined') { va=new Date(a.createdAt).getTime(); vb=new Date(b.createdAt).getTime(); }
      else if (sortBy==='apps') { va=a._count.applications; vb=b._count.applications; }
      else { va=a.totalSpent; vb=b.totalSpent; }
      return (va<vb?-1:va>vb?1:0)*(sortDir==='asc'?1:-1);
    });
    return list;
  }, [users, query, dateFrom, dateTo, sortBy, sortDir]);

  const toggleSort = (col: typeof sortBy) => { if(sortBy===col) setSortDir(d=>d==='asc'?'desc':'asc'); else { setSortBy(col); setSortDir('desc'); } };
  const SI = ({ col }: { col: typeof sortBy }) => <span style={{ marginLeft: '4px', opacity: sortBy===col?1:0.35 }}>{sortDir==='asc'&&sortBy===col?<ChevronUp size={12}/>:<ChevronDown size={12}/>}</span>;
  const hasFilter = !!(query || dateFrom || dateTo);

  return (
    <div className="admin-page anim-fade-up">
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h2 style={{ marginBottom:'0.2rem' }}>Student Management</h2>
          <p style={{ margin:0, fontSize:'0.85rem' }}>{filtered.length.toLocaleString()} of {users.length.toLocaleString()} students {hasFilter && '(filtered)'}</p>
        </div>
        <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap', alignItems:'center' }}>
          {/* Search */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'0.5rem 0.9rem', minWidth:'240px' }}>
            <Search size={13} style={{ color:'var(--text-3)', flexShrink:0 }} />
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Name, email, phone..." style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'0.84rem', width:'100%', padding:0, height:'auto', boxShadow:'none' }} />
            {query && <button onClick={()=>setQuery('')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', display:'flex', padding:0 }}><X size={12}/></button>}
          </div>
          {/* Filter toggle */}
          <button onClick={()=>setShowFilters(v=>!v)} className={`btn btn-sm ${showFilters||dateFrom||dateTo?'btn-primary':'btn-outline'}`} style={{ gap:'0.4rem', fontSize:'0.8rem', position:'relative' }}>
            <Filter size={13}/> Filter
            {(dateFrom||dateTo) && <span style={{ position:'absolute', top:'-5px', right:'-5px', width:'8px', height:'8px', background:'var(--warning)', borderRadius:'50%' }}/>}
          </button>
          {/* Export */}
          <button onClick={()=>setShowExportModal(true)} className="btn btn-outline btn-sm" style={{ gap:'0.4rem', fontSize:'0.8rem' }}>
            <Download size={13}/> Export
          </button>
        </div>
      </div>

      {/* Date Filter Panel */}
      {showFilters && (
        <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1rem 1.25rem', marginBottom:'1.25rem', display:'flex', alignItems:'flex-end', gap:'1rem', flexWrap:'wrap' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
            <label style={{ fontSize:'0.72rem', fontWeight:'700', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.05em' }}>From Date</label>
            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:'0.5rem', padding:'0.4rem 0.75rem', fontSize:'0.83rem', color:'var(--text)', width:'160px', height:'auto', boxShadow:'none' }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
            <label style={{ fontSize:'0.72rem', fontWeight:'700', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.05em' }}>To Date</label>
            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{ background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:'0.5rem', padding:'0.4rem 0.75rem', fontSize:'0.83rem', color:'var(--text)', width:'160px', height:'auto', boxShadow:'none' }} />
          </div>
          {(dateFrom||dateTo) && (
            <button onClick={()=>{setDateFrom('');setDateTo('');}} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--danger)', fontSize:'0.8rem', fontWeight:'700', display:'flex', alignItems:'center', gap:'0.3rem', paddingBottom:'0.45rem' }}>
              <X size={12}/> Clear dates
            </button>
          )}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'0.75rem', marginBottom:'1.5rem' }}>
        {[
          { label:'Showing', value:filtered.length, color:'#6366f1', icon:Users },
          { label:'With Application', value:filtered.filter(u=>u._count.applications>0).length, color:'#10b981', icon:Briefcase },
          { label:'With Resume', value:filtered.filter(u=>u.resumeConfig).length, color:'#f59e0b', icon:FileText },
          { label:'Revenue', value:`₹${filtered.reduce((s,u)=>s+u.totalSpent,0).toLocaleString()}`, color:'#ec4899', icon:IndianRupee },
        ].map(s=>(
          <div key={s.label} style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'0.9rem 1rem', display:'flex', alignItems:'center', gap:'0.65rem' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:`${s.color}18`, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><s.icon size={15}/></div>
            <div>
              <div style={{ fontSize:'1.15rem', fontWeight:'800', color:'var(--text)', lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:'0.68rem', color:'var(--text-3)', marginTop:'0.15rem', fontWeight:'500' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card table-wrap" style={{ background:'var(--bg-2)' }}>
        <table style={{ minWidth:'880px' }}>
          <thead>
            <tr>
              <th style={{ width:'240px' }}><button onClick={()=>toggleSort('name')} style={{ background:'none', border:'none', cursor:'pointer', color:'inherit', font:'inherit', display:'flex', alignItems:'center', fontWeight:'600', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Student <SI col="name"/></button></th>
              <th>Contact</th>
              <th><button onClick={()=>toggleSort('joined')} style={{ background:'none', border:'none', cursor:'pointer', color:'inherit', font:'inherit', display:'flex', alignItems:'center', fontWeight:'600', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Joined <SI col="joined"/></button></th>
              <th><button onClick={()=>toggleSort('apps')} style={{ background:'none', border:'none', cursor:'pointer', color:'inherit', font:'inherit', display:'flex', alignItems:'center', fontWeight:'600', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Apps <SI col="apps"/></button></th>
              <th>Resume</th>
              <th><button onClick={()=>toggleSort('spent')} style={{ background:'none', border:'none', cursor:'pointer', color:'inherit', font:'inherit', display:'flex', alignItems:'center', fontWeight:'600', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Spent <SI col="spent"/></button></th>
              <th>Wallet</th>
              <th style={{ textAlign:'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 ? (
              <tr><td colSpan={8} style={{ textAlign:'center', padding:'3rem', color:'var(--text-3)' }}>{hasFilter?'No students match your filters.':'No students registered yet.'}</td></tr>
            ) : filtered.map(u => {
              const phone = u.studentProfile?.phone || u.phone;
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.7rem' }}>
                      <Avatar src={u.studentProfile?.profileImage} name={u.name} size={34}/>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontWeight:'700', color:'var(--text)', fontSize:'0.86rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name||'Unnamed'}</div>
                        <div style={{ fontSize:'0.71rem', color:'var(--text-3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{phone?<div style={{ display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.79rem', color:'var(--text-2)' }}><Phone size={10} style={{ color:'var(--text-3)' }}/>{phone}</div>:<span style={{ fontSize:'0.75rem', color:'var(--text-3)' }}>—</span>}</td>
                  <td style={{ fontSize:'0.79rem', color:'var(--text-2)' }}>{fd(u.createdAt)}</td>
                  <td><span style={{ fontWeight:'700', fontSize:'0.82rem', color:u._count.applications>0?'var(--success)':'var(--text-3)' }}>{u._count.applications}</span></td>
                  <td>{u.resumeConfig?<span style={{ background:'rgba(99,102,241,0.1)', color:'var(--primary-light)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'2rem', fontSize:'0.65rem', fontWeight:'700', padding:'0.12rem 0.5rem' }}>{u.resumeConfig.selectedTemplate}</span>:<span style={{ fontSize:'0.75rem', color:'var(--text-3)' }}>None</span>}</td>
                  <td><span style={{ fontWeight:'700', fontSize:'0.82rem', color:u.totalSpent>0?'#f59e0b':'var(--text-3)' }}>{u.totalSpent>0?`₹${u.totalSpent.toLocaleString()}`:'₹0'}</span></td>
                  <td><span style={{ fontSize:'0.82rem', color:u.walletBalance>0?'var(--success)':'var(--text-3)', fontWeight:'600' }}>₹{u.walletBalance.toFixed(0)}</span></td>
                  <td style={{ textAlign:'right' }}>
                    <button onClick={()=>setViewUser(u)} className="btn btn-outline btn-sm" style={{ padding:'0.28rem 0.7rem', fontSize:'0.74rem', display:'inline-flex', alignItems:'center', gap:'0.3rem' }}>
                      <ExternalLink size={11}/> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Export Column Picker Modal */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth:'420px', padding:'1.75rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
              <div>
                <h3 style={{ margin:0, fontSize:'1.1rem' }}>Export Students</h3>
                <p style={{ margin:'0.25rem 0 0', fontSize:'0.8rem', color:'var(--text-3)' }}>Exporting {filtered.length} {hasFilter?'filtered':'total'} students</p>
              </div>
              <button onClick={()=>setShowExportModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)' }}><X size={18}/></button>
            </div>
            <p style={{ fontSize:'0.82rem', color:'var(--text-3)', marginBottom:'0.75rem', margin:'0 0 0.75rem' }}>Select columns to include in CSV:</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem', marginBottom:'1.5rem' }}>
              {ALL_EXPORT_COLS.map(col => {
                const active = exportCols.includes(col.id);
                return (
                  <label key={col.id} style={{ display:'flex', alignItems:'center', gap:'0.65rem', padding:'0.45rem 0.6rem', borderRadius:'0.5rem', cursor:'pointer', background:active?'rgba(99,102,241,0.07)':'transparent' }}>
                    <div style={{ width:'16px', height:'16px', borderRadius:'4px', flexShrink:0, border:`1.5px solid ${active?'#6366f1':'var(--border)'}`, background:active?'#6366f1':'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {active && <Check size={10} color="white" strokeWidth={3}/>}
                    </div>
                    <input type="checkbox" checked={active} onChange={()=>setExportCols(prev=>active?prev.filter(c=>c!==col.id):[...prev,col.id])} style={{ display:'none' }}/>
                    <span style={{ fontSize:'0.84rem', color:active?'var(--text)':'var(--text-2)', fontWeight:active?'600':'400' }}>{col.label}</span>
                  </label>
                );
              })}
            </div>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={()=>setShowExportModal(false)} className="btn btn-outline btn-sm" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              <button
                disabled={exportCols.length===0}
                onClick={()=>{ exportXLSX(filtered, exportCols); setShowExportModal(false); }}
                className="btn btn-primary btn-sm"
                style={{ flex:1, justifyContent:'center', opacity:exportCols.length===0?0.5:1 }}
              >
                <Download size={13}/> Download XLSX
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Drawer */}
      {viewUser && (
        <div style={{ position:'fixed', inset:0, zIndex:600, display:'flex' }}>
          <div onClick={()=>setViewUser(null)} style={{ flex:1, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}/>
          <div style={{ width:'min(460px,95vw)', background:'var(--bg-2)', borderLeft:'1px solid var(--border)', overflowY:'auto', display:'flex', flexDirection:'column', animation:'slideInRight 0.22s ease' }}>
            <div style={{ padding:'1.5rem', borderBottom:'1px solid var(--border)', background:'var(--bg-3)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.9rem' }}>
                <Avatar src={viewUser.studentProfile?.profileImage} name={viewUser.name} size={48}/>
                <div>
                  <div style={{ fontWeight:'800', fontSize:'1rem', color:'var(--text)' }}>{viewUser.name||'Unnamed Student'}</div>
                  <div style={{ fontSize:'0.78rem', color:'var(--text-3)', marginTop:'0.1rem' }}>{viewUser.email}</div>
                </div>
              </div>
              <button onClick={()=>setViewUser(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)' }}><X size={20}/></button>
            </div>
            <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1rem' }}>
                <div style={{ fontSize:'0.72rem', color:'var(--text-3)', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.75rem' }}>Contact Information</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.84rem' }}><Mail size={12} style={{ color:'var(--text-3)' }}/><span style={{ color:'var(--text-2)' }}>{viewUser.email}</span></div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.84rem' }}><Phone size={12} style={{ color:'var(--text-3)' }}/><span style={{ color:'var(--text-2)' }}>{viewUser.studentProfile?.phone||viewUser.phone||<span style={{ color:'var(--text-3)' }}>Not provided</span>}</span></div>
                  {viewUser.studentProfile?.location && <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.84rem' }}><span>📍</span><span style={{ color:'var(--text-2)' }}>{viewUser.studentProfile.location}</span></div>}
                  {viewUser.studentProfile?.linkedin && <a href={viewUser.studentProfile.linkedin} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.84rem', color:'#0a66c2', textDecoration:'none' }}>🔗 LinkedIn Profile</a>}
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                {[
                  { label:'Joined', value:fd(viewUser.createdAt), color:'#6366f1', icon:Calendar },
                  { label:'Applications', value:viewUser._count.applications, color:'#10b981', icon:Briefcase },
                  { label:'Resume', value:viewUser.resumeConfig?.selectedTemplate||'None', color:'#f59e0b', icon:FileText },
                  { label:'Purchases', value:viewUser._count.purchases, color:'#ec4899', icon:IndianRupee },
                ].map(s=>(
                  <div key={s.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'0.85rem 1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.3rem' }}><s.icon size={11} style={{ color:s.color }}/><span style={{ fontSize:'0.68rem', color:'var(--text-3)', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.04em' }}>{s.label}</span></div>
                    <div style={{ fontSize:'1rem', fontWeight:'800', color:'var(--text)' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1rem' }}>
                <div style={{ fontSize:'0.72rem', color:'var(--text-3)', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.75rem' }}>Finance</div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}><span style={{ fontSize:'0.83rem', color:'var(--text-2)' }}>Spent on Resumes</span><span style={{ fontWeight:'800', color:'#f59e0b' }}>₹{viewUser.totalSpent.toLocaleString()}</span></div>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontSize:'0.83rem', color:'var(--text-2)' }}>Wallet Balance</span><span style={{ fontWeight:'800', color:viewUser.walletBalance>0?'var(--success)':'var(--text-3)' }}>₹{viewUser.walletBalance.toFixed(0)}</span></div>
              </div>
              <div style={{ display:'flex', gap:'0.75rem' }}>
                <Link href={`/profile/${viewUser.id}`} target="_blank" className="btn btn-outline btn-sm" style={{ flex:1, justifyContent:'center', fontSize:'0.8rem' }}><ExternalLink size={12}/> Public Profile</Link>
                <Link href={`/resume/${viewUser.id}`} target="_blank" className="btn btn-outline btn-sm" style={{ flex:1, justifyContent:'center', fontSize:'0.8rem' }}><FileText size={12}/> View Resume</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        tbody tr:hover { background: rgba(255,255,255,0.02) !important; }
      `}</style>
    </div>
  );
}
