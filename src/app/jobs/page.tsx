'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, MapPin, X, Briefcase, Loader2, SlidersHorizontal,
  ChevronDown, ChevronUp, GraduationCap, Clock, RotateCcw,
  Building2, Wifi, Layers
} from 'lucide-react';
import { JobCard, Job } from '@/features/jobs/components/JobCard';

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Other'];
const WORK_MODES      = ['On-site', 'Remote', 'Hybrid'];
const CATEGORIES      = [
  'Technology', 'Finance', 'Healthcare', 'Marketing', 'Sales',
  'HR', 'Operations', 'Education', 'Legal', 'Design', 'Data & Analytics', 'Other'
];
const EDUCATION_OPTIONS = ['10th', '12th', 'Graduation', 'B.Tech', 'Masters', 'MBA', 'PhD'];
const POSTED_DATE_OPTIONS = [
  { label: 'Today',       value: 'today' },
  { label: 'Last 3 days', value: '3days' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 14 days',value: '14days' },
  { label: 'Last 30 days',value: '30days' },
  { label: 'Custom Range',value: 'custom' },
];

interface Filters {
  employmentType: string[];
  workMode: string[];
  category: string[];
  education: string[];
  postedDate: string;
  customFrom: string;
  customTo: string;
}

const EMPTY_FILTERS: Filters = {
  employmentType: [],
  workMode: [],
  category: [],
  education: [],
  postedDate: '',
  customFrom: '',
  customTo: '',
};

function countActiveFilters(f: Filters) {
  return (
    f.employmentType.length +
    f.workMode.length +
    f.category.length +
    f.education.length +
    (f.postedDate ? 1 : 0)
  );
}

function SidebarSection({ title, icon, children, defaultOpen = true }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: open ? '1rem' : '0' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0.9rem 0',
          color: 'var(--text)', fontWeight: '700', fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {icon} {title}
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div style={{ paddingBottom: '0.25rem' }}>{children}</div>}
    </div>
  );
}

function CheckGroup({ options, selected, onChange }: {
  options: string[];
  selected: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <label key={opt} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.4rem 0.5rem', borderRadius: '0.5rem', cursor: 'pointer',
            background: active ? 'rgba(99,102,241,0.08)' : 'transparent',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!active) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          }}
          onMouseLeave={(e) => {
            if (!active) e.currentTarget.style.background = 'transparent';
          }}
          >
            <div style={{
              width: '15px', height: '15px', borderRadius: '4px', flexShrink: 0,
              border: `1.5px solid ${active ? '#6366f1' : 'var(--border)'}`,
              background: active ? '#6366f1' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}>
              {active && <svg width="9" height="7" viewBox="0 0 9 7"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
            </div>
            <input type="checkbox" checked={active} onChange={() => onChange(opt)} style={{ display: 'none' }} />
            <span style={{ fontSize: '0.83rem', color: active ? 'var(--text)' : 'var(--text-2)', fontWeight: active ? '600' : '400' }}>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const toggleArr = (key: keyof Pick<Filters, 'employmentType'|'workMode'|'category'|'education'>, val: string) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? (f[key] as string[]).filter(x => x !== val) : [...(f[key] as string[]), val]
    }));
    setPage(1);
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (location) params.set('location', location);
      if (filters.category.length === 1) params.set('category', filters.category[0]);
      if (filters.employmentType.length === 1) params.set('type', filters.employmentType[0]);
      if (filters.workMode.length === 1) params.set('workMode', filters.workMode[0]);
      if (filters.education.length === 1) params.set('education', filters.education[0]);
      if (filters.postedDate && filters.postedDate !== 'custom') params.set('postedDate', filters.postedDate);
      if (filters.postedDate === 'custom' && filters.customFrom && filters.customTo) {
        params.set('postedDate', `${filters.customFrom}|${filters.customTo}`);
      }
      params.set('page', String(page));
      params.set('limit', '12');

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
  }, [query, location, filters, page]);

  useEffect(() => {
    const timer = setTimeout(fetchJobs, 300);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('q')) setQuery(params.get('q')!);
      if (params.get('location')) setLocation(params.get('location')!);
      if (params.get('category')) setFilters(f => ({ ...f, category: [params.get('category')!] }));
    }
  }, []);

  // Auto-close mobile filters when resizing to desktop view
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      if (window.innerWidth > 860) {
        setMobileSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeCount = countActiveFilters(filters);
  const hasAnyFilter = !!(query || location || activeCount);

  const Sidebar = (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span className="desktop-filters-header" style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text)' }}>Filters</span>
        {activeCount > 0 && (
          <button
            onClick={() => { setFilters(EMPTY_FILTERS); setPage(1); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <RotateCcw size={11} /> Reset ({activeCount})
          </button>
        )}
      </div>

      <SidebarSection title="Employment Type" icon={<Briefcase size={13} />}>
        <CheckGroup
          options={EMPLOYMENT_TYPES}
          selected={filters.employmentType}
          onChange={v => toggleArr('employmentType', v)}
        />
      </SidebarSection>

      <SidebarSection title="Work Mode" icon={<Wifi size={13} />}>
        <CheckGroup
          options={WORK_MODES}
          selected={filters.workMode}
          onChange={v => toggleArr('workMode', v)}
        />
      </SidebarSection>

      <SidebarSection title="Category" icon={<Layers size={13} />} defaultOpen={false}>
        <CheckGroup
          options={CATEGORIES}
          selected={filters.category}
          onChange={v => toggleArr('category', v)}
        />
      </SidebarSection>

      <SidebarSection title="Education" icon={<GraduationCap size={13} />} defaultOpen={false}>
        <CheckGroup
          options={EDUCATION_OPTIONS}
          selected={filters.education}
          onChange={v => toggleArr('education', v)}
        />
      </SidebarSection>

      <SidebarSection title="Date Posted" icon={<Clock size={13} />} defaultOpen={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          {POSTED_DATE_OPTIONS.map(opt => {
            const active = filters.postedDate === opt.value;
            return (
              <label key={opt.value} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.4rem 0.5rem', borderRadius: '0.5rem', cursor: 'pointer',
                background: active ? 'rgba(99,102,241,0.08)' : 'transparent',
              }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${active ? '#6366f1' : 'var(--border)'}`,
                  background: active ? '#6366f1' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {active && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'white' }} />}
                </div>
                <input type="radio" name="postedDate" checked={active} onChange={() => { setFilters(f => ({ ...f, postedDate: opt.value, customFrom: '', customTo: '' })); setPage(1); }} style={{ display: 'none' }} />
                <span style={{ fontSize: '0.83rem', color: active ? 'var(--text)' : 'var(--text-2)', fontWeight: active ? '600' : '400' }}>{opt.label}</span>
              </label>
            );
          })}
        </div>
        {filters.postedDate === 'custom' && (
          <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingLeft: '0.5rem' }}>
            <input
              type="date"
              value={filters.customFrom}
              onChange={e => { setFilters(f => ({ ...f, customFrom: e.target.value })); setPage(1); }}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.4rem 0.6rem', fontSize: '0.78rem', color: 'var(--text)', width: '100%', colorScheme: 'dark' }}
            />
            <input
              type="date"
              value={filters.customTo}
              onChange={e => { setFilters(f => ({ ...f, customTo: e.target.value })); setPage(1); }}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.4rem 0.6rem', fontSize: '0.78rem', color: 'var(--text)', width: '100%', colorScheme: 'dark' }}
            />
          </div>
        )}
        {filters.postedDate && (
          <button onClick={() => { setFilters(f => ({ ...f, postedDate: '', customFrom: '', customTo: '' })); setPage(1); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '0.73rem', marginTop: '0.4rem', paddingLeft: '0.5rem' }}>
            Clear date filter
          </button>
        )}
      </SidebarSection>
    </aside>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ── HERO SEARCH BAR ── */}
      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0 1.25rem' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Keyword search */}
            <div className="jobs-search-item" style={{
              flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: '0.6rem',
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: '16px', padding: '0.7rem 1rem',
            }}>
              <Search size={15} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1); }}
                placeholder="Job title, skill or keyword"
                className="search-clean-input"
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Location */}
            <div className="jobs-search-item" style={{
              flex: '0 1 200px', display: 'flex', alignItems: 'center', gap: '0.6rem',
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: '16px', padding: '0.7rem 1rem',
            }}>
              <MapPin size={15} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
              <input
                value={location}
                onChange={e => { setLocation(e.target.value); setPage(1); }}
                placeholder="City or Remote"
                className="search-clean-input"
              />
              {location && (
                <button onClick={() => setLocation('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileSidebar(v => !v)}
              className="btn btn-outline jobs-filter-toggle jobs-search-item"
              style={{ gap: '0.5rem', position: 'relative', borderRadius: '16px' }}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: 'var(--primary)', color: 'white',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '0.65rem', fontWeight: '800',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{activeCount}</span>
              )}
            </button>
          </div>

          {/* Active filter chips */}
          {hasAnyFilter && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
              {[
                ...filters.employmentType,
                ...filters.workMode,
                ...filters.category,
                ...filters.education,
                ...(filters.postedDate ? [POSTED_DATE_OPTIONS.find(o => o.value === filters.postedDate)?.label || filters.postedDate] : []),
              ].map((chip, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  background: 'rgba(99,102,241,0.1)', color: '#818cf8',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '2rem', fontSize: '0.72rem', fontWeight: '700',
                  padding: '0.2rem 0.6rem',
                }}>{chip}</span>
              ))}
              {hasAnyFilter && (
                <button
                  onClick={() => { setFilters(EMPTY_FILTERS); setQuery(''); setLocation(''); setPage(1); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.72rem', fontWeight: '700' }}
                >
                  <X size={11} /> Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="container" style={{ padding: '2rem 1rem', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* ── LEFT SIDEBAR (desktop) ── */}
        <div className="jobs-sidebar-panel">
          <div className="card" style={{ padding: '1.25rem 1.5rem', borderRadius: '20px' }}>
            {Sidebar}
          </div>
        </div>

        {/* ── JOBS COLUMN ── */}
        <div>
          {/* Results header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              {loading ? (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>Searching...</span>
              ) : (
                <span style={{ fontSize: '0.88rem', color: 'var(--text-3)' }}>
                  <strong style={{ color: 'var(--text)', fontSize: '0.8rem' }}>{total.toLocaleString()}</strong>  jobs found
                  {filters.category.length === 1 && <span> in <strong style={{ color: 'var(--primary-light)' }}>{filters.category[0]}</strong></span>}
                </span>
              )}
            </div>
            {loading && <Loader2 size={16} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />}
          </div>

          {/* Jobs grid */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="card" style={{ padding: '1.25rem', opacity: 1 - i * 0.15 }}>
                  <div style={{ display: 'flex', gap: '0.9rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '44px', height: '44px', background: 'var(--border)', borderRadius: '10px', flexShrink: 0 }} className="skeleton" />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <div style={{ height: '14px', background: 'var(--border)', borderRadius: '4px', width: '55%' }} className="skeleton" />
                      <div style={{ height: '11px', background: 'var(--border)', borderRadius: '4px', width: '35%' }} className="skeleton" />
                    </div>
                  </div>
                  <div style={{ height: '11px', background: 'var(--border)', borderRadius: '4px', width: '75%', marginBottom: '0.5rem' }} className="skeleton" />
                  <div style={{ height: '11px', background: 'var(--border)', borderRadius: '4px', width: '45%' }} className="skeleton" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="card card-p" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Briefcase size={44} style={{ color: 'var(--text-3)', marginBottom: '1rem', opacity: 0.3 }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No jobs found</h3>
              <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
                {hasAnyFilter ? 'Try adjusting your search or filters.' : 'No jobs posted yet. Check back soon!'}
              </p>
              {hasAnyFilter && (
                <button
                  onClick={() => { setFilters(EMPTY_FILTERS); setQuery(''); setLocation(''); setPage(1); }}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '1rem' }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {jobs.map((job: any, i) => <JobCard key={job.id} job={job} index={i} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-outline btn-sm">← Prev</button>
                  {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button key={p} onClick={() => setPage(p)} className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-outline'}`}>{p}</button>
                    );
                  })}
                  <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn btn-outline btn-sm">Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {mobileSidebar && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1500, display: 'flex' }}>
          <div onClick={() => setMobileSidebar(false)} style={{ flex: 1, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div style={{
            width: 'min(320px, 90vw)', background: 'var(--bg-2)',
            borderLeft: '1px solid var(--border)',
            overflowY: 'auto', padding: '1.5rem 1.25rem',
            display: 'flex', flexDirection: 'column', gap: '0.25rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: '800', fontSize: '1rem' }}>Filters</span>
              <button onClick={() => setMobileSidebar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)' }}>
                <X size={20} />
              </button>
            </div>
            {Sidebar}
            <button
              onClick={() => setMobileSidebar(false)}
              className="btn btn-primary"
              style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
            >
              Show {total} Results
            </button>
          </div>
        </div>
      )}

      <style>{`
        .search-clean-input {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          color: var(--text) !important;
          outline: none !important;
          width: 100% !important;
          font-size: 0.88rem !important;
          height: auto !important;
        }
        .search-clean-input:focus {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }
        .jobs-search-item:focus-within {
          border-color: rgba(99,102,241,0.5) !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important;
        }

        .jobs-sidebar-panel { display: block; }
        .jobs-filter-toggle { display: none; }

        .job-card-new {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.1rem 1.25rem;
          cursor: pointer;
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
        }
        .job-card-new:hover {
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 4px 24px rgba(99,102,241,0.1);
          transform: translateY(-1px);
        }
        .job-card-logo {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 1.15rem;
          flex-shrink: 0; overflow: hidden;
        }
        .job-card-apply-btn {
          display: inline-flex; align-items: center; gap: 0.3rem;
          background: var(--primary); color: white;
          border-radius: 0.5rem; font-size: 0.78rem; font-weight: '700';
          padding: 0.38rem 0.9rem;
          transition: opacity 0.15s;
        }
        .job-card-new:hover .job-card-apply-btn { opacity: 0.88; }

        .skeleton { animation: skeleton-pulse 1.4s ease-in-out infinite; }
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 860px) {
          .container { grid-template-columns: 1fr !important; }
          .jobs-sidebar-panel { display: none; }
          .jobs-filter-toggle { display: flex !important; }
          .desktop-filters-header { display: none !important; }
        }

        @media (max-width: 560px) {
          .job-card-new { padding: 0.9rem 1rem; }
          .jobs-search-item { flex: 1 1 100% !important; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
