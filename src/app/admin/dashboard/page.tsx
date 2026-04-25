'use client'

import { useState } from 'react'
import { Users, Briefcase, Building, IndianRupee, ShieldAlert, TrendingUp, LayoutDashboard, Settings, Tag, FileCheck, LogOut, CheckCircle, XCircle, Search } from 'lucide-react'

const SIDEBAR = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Users, label: 'All Users', id: 'users' },
  { icon: Building, label: 'Companies', id: 'companies' },
  { icon: Briefcase, label: 'Job Listings', id: 'jobs' },
  { icon: IndianRupee, label: 'Transactions', id: 'transactions' },
  { icon: Users, label: 'Sub-Admins', id: 'subadmins' },
  { icon: Settings, label: 'Settings', id: 'settings' },
]

const PENDING_COMPANIES = [
  { name: 'Future Tech Inc.', email: 'hr@futuretech.in', industry: 'IT', applied: '2 hours ago', jobs: 3 },
  { name: 'GreenBuild Corp', email: 'talent@greenbuild.com', industry: 'Construction', applied: '5 hours ago', jobs: 1 },
  { name: 'MedCare Solutions', email: 'recruit@medcare.in', industry: 'Healthcare', applied: 'Yesterday', jobs: 5 },
]

const RECENT_USERS = [
  { name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'STUDENT', joined: 'Today', status: 'Active' },
  { name: 'Priya Tech LLC', email: 'hr@priyatech.com', role: 'COMPANY', joined: 'Today', status: 'Pending' },
  { name: 'Amit Kumar', email: 'amit@yahoo.com', role: 'STUDENT', joined: 'Yesterday', status: 'Active' },
]

const STATS = [
  { label: 'Total Students', value: '12,450', icon: Users, color: '#6366f1', change: '+124 today' },
  { label: 'Companies', value: '842', icon: Building, color: '#10b981', change: '+8 today' },
  { label: 'Active Jobs', value: '3,124', icon: Briefcase, color: '#f59e0b', change: '+56 today' },
  { label: 'Revenue', value: '₹84,200', icon: IndianRupee, color: '#ec4899', change: '+₹2,400 today' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchUser, setSearchUser] = useState('')

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '0.5rem 0.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text)' }}>🛡 Admin Panel</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: '600', marginTop: '0.2rem' }}>JobAdda.in</div>
        </div>
        {SIDEBAR.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}>
            <item.icon size={17} />{item.label}
          </button>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <button className="sidebar-item" style={{ color: 'var(--danger)', width: '100%' }}><LogOut size={17} />Sign Out</button>
        </div>
      </aside>

      {/* Content */}
      <div className="dashboard-content">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="anim-fade">
            <h2 style={{ marginBottom: '0.25rem' }}>Admin Command Center</h2>
            <p style={{ marginBottom: '2.5rem' }}>Platform overview for <strong>JobAdda.in</strong></p>

            <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
              {STATS.map((s, i) => (
                <div key={i} className="card card-p-sm" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius)', background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><s.icon size={20} /></div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{s.label}</div>
                    <div style={{ fontSize: '0.72rem', color: s.color, marginTop: '0.1rem' }}>{s.change}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* Pending Companies */}
              <div className="card">
                <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <ShieldAlert size={18} style={{ color: 'var(--warning)' }} />
                  <h4>Pending Approvals <span className="badge badge-warning" style={{ marginLeft: '0.4rem' }}>{PENDING_COMPANIES.length}</span></h4>
                </div>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {PENDING_COMPANIES.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                      <div className="avatar avatar-sm" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)', fontWeight: '800' }}>{c.name[0]}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{c.industry} · {c.applied}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        <button className="btn btn-success btn-sm" style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}><CheckCircle size={13} /></button>
                        <button className="btn btn-danger btn-sm" style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}><XCircle size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Alerts */}
              <div className="card card-p">
                <h4 style={{ marginBottom: '1.25rem' }}>System Alerts</h4>
                {[
                  { level: 'danger', msg: '5 job listings flagged as suspicious' },
                  { level: 'warning', msg: 'Razorpay webhook failed for 2 payments' },
                  { level: 'success', msg: 'Database backup completed at 3:00 AM' },
                  { level: 'primary', msg: '14 new companies registered today' },
                ].map((alert, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.6rem', background: 'rgba(255,255,255,0.02)', borderLeft: `3px solid var(--${alert.level === 'primary' ? 'primary' : alert.level === 'success' ? 'success' : alert.level === 'warning' ? 'warning' : 'danger'})` }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{alert.msg}</span>
                  </div>
                ))}

                {/* Quick Revenue */}
                <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.15)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>This Month Revenue</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--success)', fontWeight: '600' }}>+18% ↑</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ec4899' }}>₹84,200</div>
                  <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
                    <div className="progress-fill" style={{ width: '68%', background: 'linear-gradient(90deg, #ec4899, #be185d)' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.4rem' }}>68% of ₹1.2L monthly goal</div>
                </div>
              </div>
            </div>

            {/* Recent Users Table */}
            <div className="card">
              <div style={{ padding: '1.5rem 1.5rem 0' }}><h4>Recent Registrations</h4></div>
              <div className="table-wrap" style={{ marginTop: '1rem', border: 'none', borderTop: '1px solid var(--border)', borderRadius: 0 }}>
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {RECENT_USERS.map((u, i) => (
                      <tr key={i}>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}><div className="avatar avatar-sm">{u.name[0]}</div><span style={{ fontWeight: '600', fontSize: '0.88rem' }}>{u.name}</span></div></td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>{u.email}</td>
                        <td><span className={`badge ${u.role === 'STUDENT' ? 'badge-primary' : 'badge-warning'}`}>{u.role}</span></td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>{u.joined}</td>
                        <td><span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{u.status}</span></td>
                        <td><div style={{ display: 'flex', gap: '0.4rem' }}><button className="btn btn-outline btn-sm">View</button><button className="btn btn-danger btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>Ban</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="anim-fade">
            <h2 style={{ marginBottom: '2rem' }}>User Management</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.65rem 1rem' }}>
                <Search size={16} style={{ color: 'var(--text-3)' }} />
                <input value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="Search by name or email..." className="search-input" style={{ padding: 0 }} />
              </div>
              <select style={{ width: 'auto', minWidth: '140px' }}><option>All Roles</option><option>STUDENT</option><option>COMPANY</option><option>ADMIN</option></select>
            </div>
            <div className="card table-wrap">
              <table>
                <thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Applications</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {[...RECENT_USERS, ...RECENT_USERS].map((u, i) => (
                    <tr key={i}>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}><div className="avatar avatar-sm">{u.name[0]}</div><div><div style={{ fontWeight: '600', fontSize: '0.88rem' }}>{u.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{u.email}</div></div></div></td>
                      <td><span className={`badge ${u.role === 'STUDENT' ? 'badge-primary' : 'badge-warning'}`}>{u.role}</span></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>{u.joined}</td>
                      <td style={{ fontWeight: '600' }}>{Math.floor(Math.random() * 15)}</td>
                      <td><span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{u.status}</span></td>
                      <td><div style={{ display: 'flex', gap: '0.4rem' }}><button className="btn btn-outline btn-sm">Edit</button><button className="btn btn-danger btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>Ban</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {!['overview', 'users'].includes(activeTab) && (
          <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>🚧</div>
            <h3 style={{ textTransform: 'capitalize' }}>{activeTab} Management</h3>
            <p>This section is being connected to your live database.</p>
            <span className="badge badge-primary">Coming in Phase 2</span>
          </div>
        )}
      </div>
    </div>
  )
}
