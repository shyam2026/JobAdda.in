'use client';

import React, { useState } from 'react';
import { Search, TrendingUp, IndianRupee, BarChart2 } from 'lucide-react';

interface SalaryRecord {
  role: string;
  min: string;
  avg: string;
  max: string;
  demand: 'Very High' | 'High' | 'Medium' | 'Low';
}

const SALARY_DATA: SalaryRecord[] = [
  { role: 'Software Engineer', min: '₹4L', avg: '₹12L', max: '₹35L', demand: 'Very High' },
  { role: 'Product Manager', min: '₹10L', avg: '₹22L', max: '₹60L', demand: 'High' },
  { role: 'Data Scientist', min: '₹6L', avg: '₹18L', max: '₹50L', demand: 'Very High' },
  { role: 'UI/UX Designer', min: '₹4L', avg: '₹14L', max: '₹30L', demand: 'High' },
  { role: 'DevOps Engineer', min: '₹8L', avg: '₹20L', max: '₹45L', demand: 'Very High' },
  { role: 'Marketing Manager', min: '₹5L', avg: '₹14L', max: '₹28L', demand: 'Medium' },
  { role: 'Business Analyst', min: '₹5L', avg: '₹12L', max: '₹25L', demand: 'High' },
  { role: 'HR Manager', min: '₹4L', avg: '₹10L', max: '₹22L', demand: 'Medium' },
];

const DEMAND_COLOR: Record<string, string> = { 
  'Very High': '#10b981', 
  'High': '#6366f1', 
  'Medium': '#f59e0b', 
  'Low': '#ef4444' 
};

export default function SalaryGuidePage() {
  const [search, setSearch] = useState('');

  const filtered = SALARY_DATA.filter(r => !search || r.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.12), transparent)', padding: '5rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <span className="badge badge-primary" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}><TrendingUp size={13} /> Salary Intelligence</span>
          <h1 style={{ marginBottom: '1rem' }}>India Job <span className="text-gradient">Salary Guide</span></h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            Discover competitive salaries for your role. Make informed decisions with real market data on JobAdda.in.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '0.85rem 1.25rem' }}>
              <Search size={18} style={{ color: 'var(--text-3)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search any job title..." className="search-input" style={{ padding: 0 }} />
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {/* Highlights */}
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          {[
            { icon: IndianRupee, color: '#10b981', title: '₹12L', sub: 'Average Tech Salary in India' },
            { icon: TrendingUp, color: '#6366f1', title: '+22%', sub: 'Avg salary growth in 2026' },
            { icon: BarChart2, color: '#f59e0b', title: '85%', sub: 'Companies are hiring actively' },
          ].map((h, i) => (
            <div key={i} className="card card-p" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius)', background: `${h.color}15`, color: h.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><h.icon size={24} /></div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: h.color, lineHeight: 1 }}>{h.title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>{h.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Salary Table */}
        <div className="card table-wrap">
          <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4>Salary by Job Role</h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-3)' }}>Data updated April 2026</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Min Package</th>
                <th>Average Package</th>
                <th>Max Package</th>
                <th>Market Demand</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i}>
                  <td data-label="Job Title" style={{ fontWeight: '600' }}>{r.role}</td>
                  <td data-label="Min Package" style={{ color: 'var(--text-3)', fontWeight: '500' }}>{r.min}</td>
                  <td data-label="Average Package">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end' }}>
                      <span style={{ fontWeight: '800', color: 'var(--success)', fontSize: '1rem' }}>{r.avg}</span>
                      <div className="hide-mobile" style={{ flex: 1, maxWidth: '100px' }}>
                        <div className="progress-bar" style={{ height: '6px' }}>
                          <div className="progress-fill" style={{ width: '65%' }} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Max Package" style={{ color: 'var(--primary-light)', fontWeight: '700' }}>{r.max}</td>
                  <td data-label="Market Demand">
                    <span className="badge" style={{ background: `${DEMAND_COLOR[r.demand]}15`, color: DEMAND_COLOR[r.demand], border: `1px solid ${DEMAND_COLOR[r.demand]}30`, fontSize: '0.76rem' }}>
                      {r.demand}
                    </span>
                  </td>
                  <td>
                    <a href={`/jobs?q=${r.role}`} className="btn btn-outline btn-sm w-full" style={{ justifyContent: 'center' }}>View Jobs</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

