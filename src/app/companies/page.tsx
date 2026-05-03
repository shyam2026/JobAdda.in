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
    ? allCompanies.filter((c: any) => c.industry === industry || c.type === industry)
    : allCompanies;

  const totalJobs = allCompanies.reduce((sum: number, c: any) => sum + (c._count?.jobs || 0), 0);
  const INDUSTRIES = ['All', 'Information Technology', 'E-Commerce', 'Finance & Banking', 'Healthcare', 'Education', 'Manufacturing', 'MNC', 'Startup'];

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'radial-gradient(circle at 50% -20%, #1e293b, #0f172a)', 
        borderBottom: '1px solid #1e293b', 
        padding: '6rem 0 4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', opacity: 0.1, backgroundImage: 'radial-gradient(#334155 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span className="badge" style={{ marginBottom: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700' }}>
            <Building2 size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Discover Top Employers
          </span>
          <h1 style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
            Work for the <span style={{ background: 'linear-gradient(to right, #818cf8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Industry Leaders</span>
          </h1>
          <p style={{ marginBottom: '2.5rem', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2.5rem', color: '#94a3b8', lineHeight: '1.6' }}>
            Connecting ambitious professionals with the most respected companies in India. Start your career journey today.
          </p>

          <form action="/companies" method="GET" style={{ display: 'flex', gap: '1rem', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '0.5rem 1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <Search size={20} style={{ color: '#64748b' }} />
              <input
                name="q"
                defaultValue={q}
                placeholder="Find a specific company..."
                style={{ height: '54px', border: 'none', background: 'none', width: '100%', outline: 'none', color: 'white', fontSize: '1rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '64px', padding: '0 2rem', borderRadius: '16px' }}>Search</button>
          </form>

          {/* Real-time Stats */}
          <div style={{ display: 'flex', gap: '4rem', justifyContent: 'center' }}>
            {[
              { val: allCompanies.length, label: 'Verified Partners' },
              { val: totalJobs, label: 'Live Openings' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#f1f5f9', letterSpacing: '-0.02em' }}>{s.val}</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        {/* Industry Filter Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h4 style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Filter by Sector</h4>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {INDUSTRIES.map(ind => (
              <Link
                key={ind}
                href={`/companies?industry=${ind}${q ? `&q=${q}` : ''}`}
                style={{ 
                  textDecoration: 'none',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  background: industry === ind ? 'rgba(99, 102, 241, 0.1)' : '#1e293b',
                  color: industry === ind ? '#818cf8' : '#94a3b8',
                  border: `1px solid ${industry === ind ? '#4f46e5' : '#334155'}`
                }}
              >
                {ind}
              </Link>
            ))}
          </div>
        </div>

        {/* Dynamic Company Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
          {companies.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '8rem 2rem' }}>
              <div style={{ width: '80px', height: '80px', background: '#1e293b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Building2 size={32} style={{ color: '#334155' }} />
              </div>
              <h3 style={{ color: '#f1f5f9' }}>No partners matching your search</h3>
              <p style={{ color: '#64748b' }}>Try broadening your search or choosing a different sector.</p>
            </div>
          ) : (
            companies.map((c: any) => {
              const openJobs = c._count?.jobs || 0;
              const linkUrl = c.slug ? `/companies/${c.slug}` : `/companies/${c.id}`;
              
              return (
                <Link key={c.id} href={linkUrl} className="card-hover no-underline" style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '24px',
                  padding: '2rem',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s',
                  height: '100%'
                }}>
                  {/* Company Brand Header */}
                  <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '16px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '800', fontSize: '1.5rem', color: '#818cf8',
                      overflow: 'hidden', flexShrink: 0
                    }}>
                      {c.logo ? <img src={c.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : c.companyName[0]}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {c.companyName}
                        <CheckCircle size={16} style={{ color: '#10b981' }} />
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: '600', marginTop: '0.2rem' }}>{c.industry || c.type || 'Enterprise'}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '2rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.bio || "Leading the industry with innovation and a people-first culture. Explore our mission and career opportunities."}
                  </p>

                  {/* Metadata Row */}
                  <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #334155' }}>
                    {c.hq && <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {c.hq}</div>}
                    {c.size && <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={14} /> {c.size}</div>}
                  </div>

                  {/* Hiring Status Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      fontSize: '0.85rem', 
                      fontWeight: '700', 
                      color: openJobs > 0 ? '#34d399' : '#64748b' 
                    }}>
                      <Briefcase size={16} />
                      {openJobs > 0 ? `${openJobs} Active Roles` : 'No Openings'}
                    </div>
                    <div style={{ color: '#818cf8' }}><ChevronRight size={20} /></div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        .card-hover:hover { transform: translateY(-8px); border-color: #4f46e5 !important; background: #1e293b !important; }
        @media (max-width: 640px) {
          h1 { font-size: 2.25rem !important; }
          .container { padding: 0 1rem; }
        }
      `}</style>
    </div>
  );
}
