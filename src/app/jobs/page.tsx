'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, SlidersHorizontal, X, Briefcase, Loader2 } from 'lucide-react';
import { JobCard, Job } from '@/features/jobs/components/JobCard';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Hybrid', 'Internship', 'INTERNAL', 'EXTERNAL'];
const DISPLAY_TYPES = ['Full-time', 'Remote', 'Hybrid', 'Part-time', 'Internship'];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (location) params.set('location', location);
      if (categoryFilter) params.set('category', categoryFilter);
      if (typeFilter.length === 1) params.set('type', typeFilter[0]);
      params.set('page', String(page));
      params.set('limit', '10');

      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [query, location, typeFilter, page]);

  useEffect(() => {
    const timer = setTimeout(fetchJobs, 300);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  // Read URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('q')) setQuery(params.get('q')!);
      if (params.get('location')) setLocation(params.get('location')!);
      if (params.get('category')) setCategoryFilter(params.get('category')!);
    }
  }, []);

  const toggleType = (t: string) =>
    setTypeFilter(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Search Bar */}
      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.65rem 1rem', minWidth: '180px' }}>
              <Search size={16} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1); }}
                placeholder="Job title, keyword or company"
                style={{ padding: 0, fontSize: '0.9rem', width: '100%', background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none' }}
              />
              {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}><X size={14} /></button>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.65rem 1rem', minWidth: '140px' }}>
              <MapPin size={16} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
              <input
                value={location}
                onChange={e => { setLocation(e.target.value); setPage(1); }}
                placeholder="City or Remote"
                style={{ padding: 0, fontSize: '0.9rem', width: '100%', background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none' }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
              style={{ gap: '0.5rem' }}
            >
              <SlidersHorizontal size={16} />
              Filters
              {typeFilter.length > 0 && <span className="badge badge-primary" style={{ padding: '0 0.4rem', marginLeft: '0.2rem' }}>{typeFilter.length}</span>}
            </button>
          </div>
          {showFilters && (
            <div style={{ paddingTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>Job Type:</span>
              {DISPLAY_TYPES.map(t => (
                <button key={t} onClick={() => { toggleType(t); setPage(1); }} className={`tag ${typeFilter.includes(t) ? 'active' : ''}`}>{t}</button>
              ))}
              {typeFilter.length > 0 && (
                <button onClick={() => setTypeFilter([])} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', gap: '0.3rem' }}>
                  <X size={13} /> Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="container jobs-grid" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Sidebar */}
        <aside className="jobs-sidebar hide-mobile">
          <div className="card card-p" style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Browse by Type</h4>
            {DISPLAY_TYPES.map(t => (
              <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={typeFilter.includes(t)}
                  onChange={() => { toggleType(t); setPage(1); }}
                  style={{ width: 'auto', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.9rem' }}>{t}</span>
              </label>
            ))}
          </div>
          <div className="card card-p" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💸</div>
            <h4 style={{ marginBottom: '0.5rem' }}>Refer & Earn</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-2)' }}>Invite friends. Earn Upto ₹50 per referral.</p>
            <a href="/refer" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Get My Link</a>
          </div>
        </aside>

        {/* Jobs List */}
        <div>
          <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '0.9rem' }}>
              {loading ? 'Searching...' : (
                <>
                  <strong style={{ color: 'var(--text)' }}>{total}</strong> jobs found
                  {categoryFilter && <> in <strong style={{ color: 'var(--primary-light)' }}>{categoryFilter}</strong></>}
                </>
              )}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {loading && <Loader2 size={16} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="card" style={{ padding: '1.5rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--border)', borderRadius: 'var(--radius)' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ height: '18px', background: 'var(--border)', borderRadius: '4px', width: '60%' }} />
                      <div style={{ height: '14px', background: 'var(--border)', borderRadius: '4px', width: '40%' }} />
                    </div>
                  </div>
                  <div style={{ height: '14px', background: 'var(--border)', borderRadius: '4px', width: '80%' }} />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="card card-p" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Briefcase size={48} style={{ color: 'var(--text-3)', marginBottom: '1rem', opacity: 0.4 }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No jobs found</h3>
              <p style={{ color: 'var(--text-3)' }}>
                {query || location ? 'Try adjusting your search filters' : 'No jobs posted yet. Check back soon!'}
              </p>
              {(query || location) && (
                <button onClick={() => { setQuery(''); setLocation(''); setTypeFilter([]); }} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {jobs.map((job: any, i) => (
                  <JobCard key={job.id} job={job} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-outline btn-sm"
                  >← Prev</button>
                  {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-outline'}`}
                      >{p}</button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="btn btn-outline btn-sm"
                  >Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
