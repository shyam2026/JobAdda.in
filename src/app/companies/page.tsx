import React from 'react';
import prisma from '@/lib/prisma';
import { Search, Globe, Users, Briefcase, ChevronRight, CheckCircle, MapPin, Building2 } from 'lucide-react';
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
        select: { jobs: { where: { status: 'OPEN' } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const companies = industry !== 'All'
    ? allCompanies.filter((c: any) => c.type === industry)
    : allCompanies;

  const totalJobs = allCompanies.reduce((sum: number, c: any) => sum + (c._count?.jobs || 0), 0);
  const INDUSTRIES = ['All', 'Private', 'Public', 'NGO', 'Government'];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.1), transparent)', borderBottom: '1px solid var(--border)', padding: '4rem 0 3rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
            <Building2 size={12} /> Explore Companies
          </span>
          <h1 style={{ marginBottom: '0.75rem' }}>
            Top <span className="text-gradient">Hiring Companies</span> in India
          </h1>
          <p style={{ marginBottom: '2rem', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 2rem', color: 'var(--text-2)' }}>
            Explore company profiles, open jobs, and find your perfect employer on JobAdda.in
          </p>

          <form action="/companies" method="GET" style={{ display: 'flex', gap: '0.75rem', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '0.8rem 1.25rem' }}>
              <Search size={17} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search company name..."
                className="search-input"
                style={{ padding: 0, border: 'none', background: 'none', width: '100%', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { val: allCompanies.length, label: 'Companies' },
              { val: totalJobs, label: 'Open Jobs' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-light)' }}>{s.val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{s.label}</div>
              </div>
            ))}
          </div>
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

        <p style={{ marginBottom: '1.75rem', color: 'var(--text-3)', fontSize: '0.88rem' }}>
          Showing <strong style={{ color: 'var(--text)' }}>{companies.length}</strong> companies
          {industry !== 'All' && <> in <strong style={{ color: 'var(--primary-light)' }}>{industry}</strong></>}
          {q && <> matching <strong style={{ color: 'var(--primary-light)' }}>&ldquo;{q}&rdquo;</strong></>}
        </p>

        {/* Company Grid */}
        <div className="grid-3">
          {companies.length === 0 ? (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-3)' }}>
              <Building2 size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3>No companies found</h3>
              <p>Try a different search term or filter.</p>
            </div>
          ) : (
            companies.map((c: any) => {
              const openJobs = c._count?.jobs || 0;
              const initial = c.companyName?.[0]?.toUpperCase() || 'C';
              return (
                <Link key={c.id} href={`/companies/${c.id}`} className="card card-p card-hover no-underline" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '14px',
                      background: c.logo ? 'transparent' : 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '900', fontSize: '1.5rem', color: 'var(--primary)',
                      flexShrink: 0, overflow: 'hidden',
                    }}>
                      {c.logo
                        ? <img src={c.logo} alt={c.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : initial
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '800', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>{c.companyName}</span>
                        <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: '500' }}>{c.type || 'Private'}</div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    {c.size && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Users size={12} />{c.size}
                      </div>
                    )}
                    {c.hq && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={12} />{c.hq}
                      </div>
                    )}
                    {c.website && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Globe size={12} />{c.website.replace(/^https?:\/\//, '').split('/')[0]}
                      </div>
                    )}
                  </div>

                  {c.bio && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: '1.6', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.bio}
                    </p>
                  )}

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: '700', color: openJobs > 0 ? 'var(--primary-light)' : 'var(--text-3)' }}>
                      <Briefcase size={14} />
                      {openJobs > 0 ? `${openJobs} Open Roles` : 'No openings'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.82rem', color: 'var(--text-3)' }}>
                      View Profile <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
