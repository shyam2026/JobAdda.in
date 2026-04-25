'use client'

import { Search, Globe, Users, Briefcase, ChevronRight, CheckCircle, Star } from 'lucide-react'
import { useState } from 'react'

const COMPANIES = [
  { id: 'tcs', name: 'Tata Consultancy Services', logo: 'T', industry: 'Information Technology', employees: '600,000+', jobs: 95, rating: 4.2, verified: true, color: '#C00', hq: 'Mumbai, India' },
  { id: 'infosys', name: 'Infosys Limited', logo: 'I', industry: 'IT Services', employees: '350,000+', jobs: 120, rating: 4.0, verified: true, color: '#007CC3', hq: 'Bangalore, India' },
  { id: 'wipro', name: 'Wipro Limited', logo: 'W', industry: 'Technology', employees: '260,000+', jobs: 78, rating: 3.9, verified: true, color: '#341C75', hq: 'Bangalore, India' },
  { id: 'flipkart', name: 'Flipkart', logo: 'F', industry: 'E-Commerce', employees: '80,000+', jobs: 64, rating: 4.1, verified: true, color: '#F7A600', hq: 'Bangalore, India' },
  { id: 'swiggy', name: 'Swiggy', logo: 'S', industry: 'Food Tech', employees: '40,000+', jobs: 42, rating: 4.3, verified: true, color: '#FC8019', hq: 'Bangalore, India' },
  { id: 'zomato', name: 'Zomato', logo: 'Z', industry: 'Food Tech', employees: '22,000+', jobs: 37, rating: 4.2, verified: true, color: '#E23744', hq: 'Gurugram, India' },
  { id: 'phonepe', name: 'PhonePe', logo: 'P', industry: 'Fintech', employees: '10,000+', jobs: 58, rating: 4.4, verified: true, color: '#5F259F', hq: 'Bangalore, India' },
  { id: 'cred', name: 'CRED', logo: 'C', industry: 'Fintech', employees: '5,000+', jobs: 28, rating: 4.5, verified: true, color: '#1C1C1E', hq: 'Bangalore, India' },
  { id: 'nykaa', name: 'Nykaa', logo: 'N', industry: 'Beauty & Retail', employees: '18,000+', jobs: 31, rating: 3.8, verified: true, color: '#E63D76', hq: 'Mumbai, India' },
]

const INDUSTRIES = ['All', 'Information Technology', 'E-Commerce', 'Food Tech', 'Fintech', 'Healthcare', 'Manufacturing']

export default function CompaniesPage() {
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('All')

  const filtered = COMPANIES.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase())
    const matchIndustry = industry === 'All' || c.industry === industry
    return matchSearch && matchIndustry
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '3rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '0.75rem' }}>Top <span className="text-gradient">Hiring Companies</span> in India</h2>
          <p style={{ marginBottom: '2rem' }}>Explore company profiles and find your perfect employer on JobAdda.in</p>
          <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
              <Search size={18} style={{ color: 'var(--text-3)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company name..." className="search-input" style={{ padding: 0 }} />
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {/* Industry Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {INDUSTRIES.map(ind => (
            <button key={ind} onClick={() => setIndustry(ind)} className={`tag ${industry === ind ? 'active' : ''}`}>{ind}</button>
          ))}
        </div>

        <p style={{ marginBottom: '1.5rem', color: 'var(--text-3)', fontSize: '0.88rem' }}>
          Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> companies
        </p>

        <div className="grid-3">
          {filtered.map(c => (
            <a key={c.id} href={`/companies/${c.id}`} className="card card-p" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius)', background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.5rem', color: c.color, flexShrink: 0, border: `1px solid ${c.color}30` }}>{c.logo}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                    {c.verified && <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{c.industry}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.3rem' }}>
                    <Star size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fbbf24' }}>{c.rating}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={12} />{c.employees}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Globe size={12} />{c.hq}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-light)' }}><Briefcase size={14} />{c.jobs} Open Roles</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.82rem', color: 'var(--text-3)' }}>View Jobs <ChevronRight size={14} /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
