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

  // ── SOFTWARE ENGINEERING ──
  { role: 'Software Engineer', min: '₹4L', avg: '₹12L', max: '₹35L', demand: 'Very High' },
  { role: 'Senior Software Engineer', min: '₹12L', avg: '₹22L', max: '₹55L', demand: 'Very High' },
  { role: 'Staff Engineer', min: '₹25L', avg: '₹42L', max: '₹90L', demand: 'High' },
  { role: 'Principal Engineer', min: '₹35L', avg: '₹60L', max: '₹1.2Cr', demand: 'High' },
  { role: 'Frontend Developer', min: '₹4L', avg: '₹11L', max: '₹30L', demand: 'Very High' },
  { role: 'Backend Developer', min: '₹5L', avg: '₹13L', max: '₹38L', demand: 'Very High' },
  { role: 'Full Stack Developer', min: '₹5L', avg: '₹14L', max: '₹40L', demand: 'Very High' },
  { role: 'React Developer', min: '₹4.5L', avg: '₹12L', max: '₹32L', demand: 'Very High' },
  { role: 'Angular Developer', min: '₹4L', avg: '₹11L', max: '₹28L', demand: 'High' },
  { role: 'Vue.js Developer', min: '₹4L', avg: '₹11L', max: '₹28L', demand: 'High' },
  { role: 'Node.js Developer', min: '₹4L', avg: '₹11L', max: '₹28L', demand: 'High' },
  { role: 'Python Developer', min: '₹4L', avg: '₹12L', max: '₹35L', demand: 'Very High' },
  { role: 'Java Developer', min: '₹4L', avg: '₹11L', max: '₹30L', demand: 'High' },
  { role: '.NET Developer', min: '₹4L', avg: '₹10L', max: '₹26L', demand: 'Medium' },
  { role: 'Go (Golang) Developer', min: '₹7L', avg: '₹16L', max: '₹40L', demand: 'High' },
  { role: 'Rust Developer', min: '₹8L', avg: '₹18L', max: '₹45L', demand: 'Medium' },
  { role: 'PHP Developer', min: '₹3L', avg: '₹7L', max: '₹18L', demand: 'Medium' },
  { role: 'Ruby on Rails Developer', min: '₹4L', avg: '₹10L', max: '₹25L', demand: 'Low' },
  { role: 'iOS Developer (Swift)', min: '₹5L', avg: '₹14L', max: '₹35L', demand: 'High' },
  { role: 'Android Developer (Kotlin)', min: '₹4L', avg: '₹13L', max: '₹32L', demand: 'High' },
  { role: 'Flutter Developer', min: '₹4L', avg: '₹12L', max: '₹28L', demand: 'High' },
  { role: 'React Native Developer', min: '₹4.5L', avg: '₹12L', max: '₹28L', demand: 'High' },
  { role: 'Blockchain Developer', min: '₹8L', avg: '₹20L', max: '₹50L', demand: 'Medium' },
  { role: 'Smart Contract Developer', min: '₹8L', avg: '₹22L', max: '₹55L', demand: 'Medium' },

  // ── DEVOPS, CLOUD & INFRASTRUCTURE ──
  { role: 'DevOps Engineer', min: '₹8L', avg: '₹20L', max: '₹50L', demand: 'Very High' },
  { role: 'Site Reliability Engineer (SRE)', min: '₹12L', avg: '₹25L', max: '₹60L', demand: 'Very High' },
  { role: 'Cloud Engineer (AWS)', min: '₹7L', avg: '₹18L', max: '₹45L', demand: 'Very High' },
  { role: 'Cloud Engineer (Azure)', min: '₹7L', avg: '₹17L', max: '₹42L', demand: 'High' },
  { role: 'Cloud Engineer (GCP)', min: '₹8L', avg: '₹19L', max: '₹48L', demand: 'High' },
  { role: 'Kubernetes Engineer', min: '₹9L', avg: '₹22L', max: '₹52L', demand: 'High' },
  { role: 'Platform Engineer', min: '₹10L', avg: '₹22L', max: '₹52L', demand: 'High' },
  { role: 'Infrastructure Engineer', min: '₹7L', avg: '₹16L', max: '₹38L', demand: 'High' },
  { role: 'Solutions Architect (AWS)', min: '₹14L', avg: '₹28L', max: '₹65L', demand: 'High' },
  { role: 'Network Engineer', min: '₹3.5L', avg: '₹8L', max: '₹20L', demand: 'Medium' },
  { role: 'Systems Administrator', min: '₹3L', avg: '₹7L', max: '₹18L', demand: 'Medium' },
  { role: 'Database Administrator (DBA)', min: '₹4L', avg: '₹10L', max: '₹25L', demand: 'Medium' },
  { role: 'IT Support Engineer', min: '₹2.5L', avg: '₹5L', max: '₹12L', demand: 'Medium' },

  // ── DATA & ANALYTICS ──
  { role: 'Data Analyst', min: '₹4L', avg: '₹9L', max: '₹22L', demand: 'High' },
  { role: 'Senior Data Analyst', min: '₹7L', avg: '₹14L', max: '₹32L', demand: 'High' },
  { role: 'Data Scientist', min: '₹6L', avg: '₹18L', max: '₹50L', demand: 'Very High' },
  { role: 'Senior Data Scientist', min: '₹14L', avg: '₹28L', max: '₹70L', demand: 'Very High' },
  { role: 'Data Engineer', min: '₹6L', avg: '₹16L', max: '₹42L', demand: 'Very High' },
  { role: 'Data Architect', min: '₹15L', avg: '₹30L', max: '₹65L', demand: 'High' },
  { role: 'Business Intelligence Analyst', min: '₹5L', avg: '₹12L', max: '₹26L', demand: 'High' },
  { role: 'Analytics Engineer', min: '₹8L', avg: '₹18L', max: '₹40L', demand: 'High' },
  { role: 'Analytics Manager', min: '₹12L', avg: '₹24L', max: '₹50L', demand: 'High' },
  { role: 'Power BI Developer', min: '₹4.5L', avg: '₹10L', max: '₹22L', demand: 'High' },
  { role: 'Tableau Developer', min: '₹5L', avg: '₹11L', max: '₹24L', demand: 'High' },
  { role: 'Looker Developer', min: '₹6L', avg: '₹13L', max: '₹28L', demand: 'Medium' },
  { role: 'Quantitative Analyst (Quant)', min: '₹14L', avg: '₹28L', max: '₹70L', demand: 'High' },

  // ── AI & MACHINE LEARNING ──
  { role: 'Machine Learning Engineer', min: '₹8L', avg: '₹22L', max: '₹60L', demand: 'Very High' },
  { role: 'AI/ML Researcher', min: '₹12L', avg: '₹30L', max: '₹80L', demand: 'Very High' },
  { role: 'Generative AI Engineer', min: '₹14L', avg: '₹32L', max: '₹90L', demand: 'Very High' },
  { role: 'LLM Engineer', min: '₹15L', avg: '₹35L', max: '₹95L', demand: 'Very High' },
  { role: 'Computer Vision Engineer', min: '₹9L', avg: '₹22L', max: '₹55L', demand: 'High' },
  { role: 'NLP Engineer', min: '₹10L', avg: '₹24L', max: '₹58L', demand: 'High' },
  { role: 'MLOps Engineer', min: '₹10L', avg: '₹24L', max: '₹55L', demand: 'High' },
  { role: 'AI Product Manager', min: '₹16L', avg: '₹32L', max: '₹80L', demand: 'High' },
  { role: 'Prompt Engineer', min: '₹8L', avg: '₹18L', max: '₹45L', demand: 'High' },

  // ── CYBERSECURITY ──
  { role: 'Cybersecurity Analyst', min: '₹5L', avg: '₹14L', max: '₹35L', demand: 'Very High' },
  { role: 'Penetration Tester (Ethical Hacker)', min: '₹5L', avg: '₹15L', max: '₹40L', demand: 'High' },
  { role: 'Security Architect', min: '₹15L', avg: '₹30L', max: '₹65L', demand: 'High' },
  { role: 'SOC Analyst', min: '₹4L', avg: '₹10L', max: '₹24L', demand: 'High' },
  { role: 'Information Security Manager', min: '₹12L', avg: '₹24L', max: '₹55L', demand: 'High' },
  { role: 'CISO (Chief Information Security Officer)', min: '₹30L', avg: '₹60L', max: '₹1.2Cr', demand: 'Medium' },

  // ── EMBEDDED, HARDWARE & SPECIALIZED ──
  { role: 'Embedded Systems Engineer', min: '₹4L', avg: '₹10L', max: '₹24L', demand: 'Medium' },
  { role: 'Firmware Engineer', min: '₹5L', avg: '₹12L', max: '₹28L', demand: 'Medium' },
  { role: 'VLSI Engineer', min: '₹5L', avg: '₹13L', max: '₹30L', demand: 'Medium' },
  { role: 'IoT Engineer', min: '₹4L', avg: '₹11L', max: '₹28L', demand: 'Medium' },
  { role: 'Robotics Engineer', min: '₹5L', avg: '₹12L', max: '₹30L', demand: 'Medium' },

  // ── QUALITY & TESTING ──
  { role: 'QA Engineer (Manual)', min: '₹3L', avg: '₹7L', max: '₹18L', demand: 'Medium' },
  { role: 'QA Automation Engineer', min: '₹4L', avg: '₹11L', max: '₹26L', demand: 'High' },
  { role: 'SDET (Software Dev in Test)', min: '₹6L', avg: '₹14L', max: '₹30L', demand: 'High' },
  { role: 'Performance Test Engineer', min: '₹5L', avg: '₹12L', max: '₹28L', demand: 'Medium' },

  // ── PRODUCT & DESIGN (TECH) ──
  { role: 'Product Manager (Tech)', min: '₹10L', avg: '₹22L', max: '₹60L', demand: 'High' },
  { role: 'Senior Product Manager', min: '₹18L', avg: '₹35L', max: '₹85L', demand: 'High' },
  { role: 'Associate Product Manager', min: '₹7L', avg: '₹14L', max: '₹28L', demand: 'High' },
  { role: 'Product Analyst', min: '₹5L', avg: '₹11L', max: '₹24L', demand: 'High' },
  { role: 'UI/UX Designer', min: '₹4L', avg: '₹14L', max: '₹32L', demand: 'High' },
  { role: 'Senior UX Designer', min: '₹10L', avg: '₹22L', max: '₹48L', demand: 'High' },
  { role: 'Product Designer', min: '₹6L', avg: '₹16L', max: '₹38L', demand: 'High' },
  { role: 'UX Researcher', min: '₹5L', avg: '₹13L', max: '₹28L', demand: 'Medium' },

  // ── TECH MANAGEMENT & LEADERSHIP ──
  { role: 'Engineering Manager', min: '₹20L', avg: '₹40L', max: '₹90L', demand: 'High' },
  { role: 'Director of Engineering', min: '₹35L', avg: '₹70L', max: '₹1.5Cr', demand: 'Medium' },
  { role: 'VP of Engineering', min: '₹40L', avg: '₹80L', max: '₹2Cr', demand: 'Medium' },
  { role: 'CTO (Startup)', min: '₹30L', avg: '₹60L', max: '₹1.5Cr', demand: 'High' },
  { role: 'Technical Project Manager', min: '₹10L', avg: '₹20L', max: '₹45L', demand: 'High' },
  { role: 'Scrum Master', min: '₹8L', avg: '₹16L', max: '₹35L', demand: 'Medium' },
  { role: 'Agile Coach', min: '₹12L', avg: '₹22L', max: '₹45L', demand: 'Medium' },

  // ── ENTERPRISE & PLATFORM TECH ──
  { role: 'ERP Consultant (SAP)', min: '₹6L', avg: '₹15L', max: '₹35L', demand: 'High' },
  { role: 'Salesforce Developer', min: '₹5L', avg: '₹13L', max: '₹30L', demand: 'High' },
  { role: 'Salesforce Admin', min: '₹4L', avg: '₹9L', max: '₹22L', demand: 'High' },
  { role: 'RPA Developer (UiPath)', min: '₹5L', avg: '₹12L', max: '₹28L', demand: 'High' },
  { role: 'ServiceNow Developer', min: '₹5L', avg: '₹13L', max: '₹30L', demand: 'High' },
  { role: 'Technical Writer', min: '₹4L', avg: '₹9L', max: '₹22L', demand: 'High' },
  { role: 'Developer Advocate', min: '₹10L', avg: '₹20L', max: '₹45L', demand: 'Medium' },
];

const DEMAND_COLOR: Record<string, string> = { 
  'Very High': '#10b981', 
  'High': '#6366f1', 
  'Medium': '#f59e0b', 
  'Low': '#ef4444' 
};

export default function SalaryGuidePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const CATEGORIES = ['All', 'Software Eng', 'DevOps & Cloud', 'Data & Analytics', 'AI & ML', 'Cybersecurity', 'Embedded & HW', 'QA & Testing', 'Product & Design', 'Tech Leadership', 'Enterprise Tech'];

  const CATEGORY_MAP: Record<string, string[]> = {
    'Software Eng': ['Software Engineer', 'Frontend', 'Backend', 'Full Stack', 'React', 'Angular', 'Vue', 'Node', 'Python', 'Java', '.NET', 'Go', 'Rust', 'PHP', 'Ruby', 'iOS', 'Android', 'Flutter', 'React Native', 'Blockchain', 'Smart Contract'],
    'DevOps & Cloud': ['DevOps', 'SRE', 'Site Reliability', 'Cloud', 'Kubernetes', 'Platform Engineer', 'Infrastructure', 'Solutions Architect', 'Network', 'Systems Admin', 'Database Admin', 'IT Support'],
    'Data & Analytics': ['Data Analyst', 'Data Scientist', 'Data Engineer', 'Data Architect', 'Business Intelligence', 'Analytics', 'Power BI', 'Tableau', 'Looker', 'Quantitative'],
    'AI & ML': ['Machine Learning', 'AI/ML', 'Generative AI', 'LLM', 'Computer Vision', 'NLP', 'MLOps', 'AI Product', 'Prompt'],
    'Cybersecurity': ['Cybersecurity', 'Penetration', 'Security Architect', 'SOC', 'Information Security', 'CISO'],
    'Embedded & HW': ['Embedded', 'Firmware', 'VLSI', 'IoT', 'Robotics'],
    'QA & Testing': ['QA', 'SDET', 'Performance Test'],
    'Product & Design': ['Product Manager', 'Associate Product', 'Product Analyst', 'UI/UX', 'UX Designer', 'Product Designer', 'UX Researcher'],
    'Tech Leadership': ['Engineering Manager', 'Director of Engineering', 'VP of Engineering', 'CTO', 'Technical Project Manager', 'Scrum Master', 'Agile Coach'],
    'Enterprise Tech': ['ERP', 'Salesforce', 'RPA', 'ServiceNow', 'Technical Writer', 'Developer Advocate'],
  };

  const filtered = SALARY_DATA.filter(r => {
    const matchesSearch = !search || r.role.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || (CATEGORY_MAP[category] || []).some(kw => r.role.includes(kw));
    return matchesSearch && matchesCategory;
  });

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
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2.5rem', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                flexShrink: 0, whiteSpace: 'nowrap', padding: '0.45rem 1rem',
                borderRadius: '2rem', fontSize: '0.82rem', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.2s',
                background: category === cat ? 'var(--primary)' : 'var(--surface)',
                color: category === cat ? '#fff' : 'var(--text-3)',
                border: category === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

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
          <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h4>Salary by Job Role</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--primary-light)', fontWeight: '700', background: 'rgba(99,102,241,0.1)', padding: '0.25rem 0.75rem', borderRadius: '2rem', border: '1px solid rgba(99,102,241,0.2)' }}>
                {filtered.length} roles
              </span>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-3)' }}>Data updated April 2026</p>
            </div>
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

