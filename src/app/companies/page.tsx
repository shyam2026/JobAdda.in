import React from 'react';
import prisma from '@/lib/prisma';
import { Search, Globe, Users, Briefcase, ChevronRight, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

export default async function CompaniesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; industry?: string }> 
}) {
  const { q = '', industry = 'All' } = await searchParams;

  const allCompanies = await (prisma as any).companyUser.findMany({
    where: {
      AND: [
        q ? { companyName: { contains: q } } : {}
      ]
    },
    include: {
      _count: {
        select: { jobs: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Temporary in-memory filtering to bypass Prisma Client validation error
  // until the dev server is restarted and 'npx prisma generate' can run successfully.
  const companies = industry !== 'All' 
    ? allCompanies.filter((c: any) => c.type === industry) 
    : allCompanies;

  const INDUSTRIES = ['All', 'Private', 'Public', 'NGO', 'Government'];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '3rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '0.75rem' }}>Top <span className="text-gradient">Hiring Companies</span> in India</h2>
          <p style={{ marginBottom: '2rem' }}>Explore company profiles and find your perfect employer on JobAdda.in</p>
          
          <form action="/companies" method="GET" style={{ display: 'flex', gap: '0.75rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}>
              <Search size={18} style={{ color: 'var(--text-3)' }} />
              <input 
                name="q" 
                defaultValue={q} 
                placeholder="Search company name..." 
                className="search-input" 
                style={{ padding: 0, border: 'none', background: 'none', width: '100%', outline: 'none' }} 
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {/* Industry Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {INDUSTRIES.map(ind => (
            <Link 
              key={ind} 
              href={`/companies?industry=${ind}${q ? `&q=${q}` : ''}`} 
              className={`tag ${industry === ind ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              {ind}
            </Link>
          ))}
        </div>

        <p style={{ marginBottom: '1.5rem', color: 'var(--text-3)', fontSize: '0.88rem' }}>
          Showing <strong style={{ color: 'var(--text)' }}>{companies.length}</strong> companies
        </p>

        <div className="grid-3">
          {companies.length === 0 ? (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '4rem', color: 'var(--text-3)' }}>
              No companies found matching your criteria.
            </div>
          ) : (
            companies.map((c: any) => (
              <Link key={c.id} href={`/companies/${c.id}`} className="card card-p card-hover no-underline" style={{ display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius)', background: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.5rem', color: 'var(--primary)', flexShrink: 0, border: '1px solid var(--border)', overflow: 'hidden' }}>
                    {c.logo ? <img src={c.logo} alt={c.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : c.companyName[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>{c.companyName}</span>
                      <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{c.type || 'Private'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.3rem' }}>
                      <Star size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fbbf24' }}>4.5</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Users size={12} />{c.size || '50-200'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Globe size={12} />{c.hq || 'India'}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                    <Briefcase size={14} />{c._count.jobs} Open Roles
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.82rem', color: 'var(--text-3)' }}>
                    View Profile <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
