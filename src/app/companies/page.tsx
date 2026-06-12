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

  let allCompanies: any[] = [];
  try {
    allCompanies = await prisma.companyUser.findMany({
      where: {
        isActive: true,
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
  } catch (error) {
    console.error("Prisma Error in CompaniesPage:", error);
    allCompanies = [];
  }

  const companies = industry !== 'All'
    ? allCompanies.filter((c: any) => c.industry === industry || c.type === industry)
    : allCompanies;

  const totalJobs = allCompanies.reduce((sum: number, c: any) => sum + (c._count?.jobs || 0), 0);
  const INDUSTRIES = [
    'All', 'Information Technology', 'Software', 'SaaS', 'E-Commerce', 'EdTech', 'Finance', 'Banking', 'FinTech',
    'Healthcare', 'Pharmaceuticals', 'Education', 'Manufacturing', 'Industrial', 'Media', 'Entertainment',
    'FMCG', 'Consumer Goods', 'Retail', 'Apparel', 'Real Estate', 'Construction', 'Telecommunications',
    'Logistics', 'Supply Chain', 'Hospitality', 'Tourism', 'Automobile', 'Agriculture', 'Food Processing',
    'Energy', 'Utilities', 'Consulting', 'Human Resources', 'Legal Services', 'Advertising', 'Marketing',
    'Aerospace', 'Defense', 'Fashion', 'Lifestyle', 'Gems & Jewelry', 'Insurance', 'Mining', 'Oil & Gas',
    'NGO', 'Non-Profit', 'Government', 'Public Sector', 'Other'
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'radial-gradient(circle at 50% -20%, var(--bg-3), var(--bg))', 
        borderBottom: '1px solid var(--border)', 
        padding: '6rem 0 4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', opacity: 0.08, backgroundImage: 'radial-gradient(var(--text-3) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span className="badge" style={{ marginBottom: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-light)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700' }}>
            <Building2 size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Discover Top Employers
          </span>
          <h1 style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
            Work for the <span className="text-gradient">Industry Leaders</span>
          </h1>
          <p style={{ marginBottom: '2.5rem', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2.5rem', color: 'var(--text-2)', lineHeight: '1.6' }}>
            Connecting ambitious professionals with the most respected companies in India. Start your career journey today.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        {/* Smart Filter Bar */}
        <div style={{ 
          background: 'var(--bg-2)', 
          border: '1px solid var(--border)', 
          borderRadius: '24px', 
          padding: '1.25rem', 
          marginBottom: '3rem',
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.3), 0 0 30px rgba(99,102,241,0.06)',
          marginTop: '-4rem',
          position: 'relative',
          zIndex: 10
        }}>
          <form action="/companies" method="GET" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ flex: '2 1 300px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '0 1.25rem', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
              <Search size={18} style={{ color: 'var(--text-3)' }} />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search company name..."
                style={{ height: '54px', border: 'none', background: 'none', width: '100%', outline: 'none', color: 'white', fontSize: '0.95rem' }}
              />
            </div>

            {/* Industry Dropdown */}
            <div style={{ flex: '1 1 200px', position: 'relative' }}>
              <select 
                name="industry"
                defaultValue={industry}
                style={{ 
                  width: '100%', 
                  height: '56px', 
                  background: 'var(--bg)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '16px', 
                  color: 'var(--text)', 
                  padding: '0 1.25rem', 
                  fontSize: '0.95rem',
                  appearance: 'none',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind} style={{ background: 'var(--bg)' }}>{ind === 'All' ? 'All Industries' : ind}</option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-3)' }}>
                <ChevronRight size={18} style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>

            <button type="submit" className="btn" style={{ 
              padding: '0 2.5rem', 
              borderRadius: '16px', 
              height: '56px', 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.25)',
              cursor: 'pointer'
            }}>
              Apply Filters
            </button>

            {(q || industry !== 'All') && (
              <Link href="/companies" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 1rem', 
                color: '#ef4444', 
                textDecoration: 'none', 
                fontSize: '0.85rem', 
                fontWeight: '600' 
              }}>
                Clear All
              </Link>
            )}
          </form>
        </div>

        {/* Dynamic Company Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
          {companies.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '8rem 2rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Building2 size={32} style={{ color: 'var(--text-3)' }} />
              </div>
              <h3>No partners matching your search</h3>
              <p style={{ color: 'var(--text-3)' }}>Try broadening your search or choosing a different sector.</p>
            </div>
          ) : (
            companies.map((c: any) => {
              const openJobs = c._count?.jobs || 0;
              const linkUrl = c.slug ? `/companies/${c.slug}` : `/companies/${c.id}`;
              
              return (
                <Link key={c.id} href={linkUrl} className="card-hover no-underline" style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '24px',
                  padding: '2rem',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s, box-shadow 0.3s',
                  height: '100%'
                }}>
                  {/* Company Brand Header */}
                  <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '16px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary-light)',
                      overflow: 'hidden', flexShrink: 0, padding: c.logo ? '8px' : '0'
                    }}>
                      {c.logo ? <img src={c.logo} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : c.companyName[0]}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {c.companyName}
                        <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: '600', marginTop: '0.2rem' }}>{c.industry || c.type || 'Enterprise'}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-2)', lineHeight: '1.6', marginBottom: '2rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.bio 
                      ? c.bio.replace(/<[^>]*>/g, '') 
                      : "Leading the industry with innovation and a people-first culture. Explore our mission and career opportunities."
                    }
                  </p>

                  {/* Metadata Row */}
                  <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    {c.hq && <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {c.hq}</div>}
                    {c.size && <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={14} /> {c.size}</div>}
                  </div>

                  {/* Hiring Status Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      fontSize: '0.85rem', 
                      fontWeight: '700', 
                      color: openJobs > 0 ? 'var(--success)' : 'var(--text-3)' 
                    }}>
                      <Briefcase size={16} />
                      {openJobs > 0 ? `${openJobs} Active Roles` : 'No Openings'}
                    </div>
                    <div className="chevron-arrow" style={{ color: 'var(--primary-light)', transition: 'transform 0.2s' }}><ChevronRight size={20} /></div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        .card-hover:hover { transform: translateY(-6px); border-color: rgba(99,102,241,0.4) !important; box-shadow: 0 12px 40px rgba(99,102,241,0.1) !important; }
        .card-hover:hover .chevron-arrow { transform: translateX(3px); }
        .no-underline { text-decoration: none !important; }
        input:focus, select:focus { outline: none !important; box-shadow: none !important; }
        @media (max-width: 640px) {
          h1 { font-size: 2.25rem !important; }
          .container { padding: 0 1rem; }
        }
        @media (max-width: 480px) {
          .container > div[style*="grid"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
