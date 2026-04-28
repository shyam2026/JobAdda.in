'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Lock, Eye, EyeOff, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Template1 from './Template1';
import Template2 from './Template2';
import Template3 from './Template3';

const PLANS = [
  { id: 'TPL_1', label: 'Basic',        origPrice: 15, price: 0,  discount: 100, badgeColor: '#10b981' },
  { id: 'TPL_2', label: 'Professional', origPrice: 30, price: 15, discount: 50,  badgeColor: '#6366f1' },
  { id: 'TPL_3', label: 'Premium',      origPrice: 50, price: 25, discount: 50,  badgeColor: '#f59e0b' },
];

const COLOR_PRESETS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#0f172a'];

const SECTIONS = [
  { key: 'showBio',      label: 'Profile Summary' },
  { key: 'showEmail',    label: 'Email Address'   },
  { key: 'showPhone',    label: 'Phone Number'    },
  { key: 'showSocials',  label: 'Social Links'    },
  { key: 'showSkills',   label: 'Skills'          },
  { key: 'showExp',      label: 'Experience'      },
  { key: 'showEdu',      label: 'Education'       },
  { key: 'showProjects', label: 'Projects'        },
];

type WindowMap = Record<string, string>;

export default function ResumeBuilderPage() {
  const [profile, setProfile]       = useState<any>(null);
  const [selected, setSelected]     = useState('TPL_1');
  const [windows, setWindows]       = useState<WindowMap>({});
  const [accentColor, setAccent]    = useState('#6366f1');
  const [config, setConfig]         = useState({ showBio: true, showEmail: true, showPhone: true, showSocials: true, showSkills: true, showExp: true, showEdu: true, showProjects: true });
  const [checkout, setCheckout]     = useState<string | null>(null);
  const [offerTimer, setOffer]      = useState(599);
  const [remaining, setRemaining]   = useState(0);
  const [downloading, setDl]        = useState(false);
  const [showControls, setShowControls] = useState(false); // mobile accordion
  const [isMobile, setIsMobile]     = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const loadPurchases = useCallback(async () => {
    const res = await fetch('/api/user/resume-purchases');
    const data = await res.json();
    if (Array.isArray(data)) {
      const map: WindowMap = {};
      data.forEach((d: any) => { map[d.templateId] = d.expiresAt; });
      setWindows(map);
    }
  }, []);

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(setProfile);
    loadPurchases();
  }, [loadPurchases]);

  useEffect(() => {
    if (checkout !== 'TPL_1') return;
    const iv = setInterval(() => setOffer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, [checkout]);

  useEffect(() => {
    const exp = windows[selected];
    if (!exp) { setRemaining(0); return; }
    const tick = () => {
      const secs = Math.max(0, Math.floor((new Date(exp).getTime() - Date.now()) / 1000));
      setRemaining(secs);
      if (secs <= 0) setWindows(prev => { const n = { ...prev }; delete n[selected]; return n; });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [windows, selected]);

  const isUnlocked = (id: string) => !!windows[id] && new Date(windows[id]).getTime() > Date.now();
  const unlocked = isUnlocked(selected);
  const plan = PLANS.find(p => p.id === selected)!;
  const expired = !unlocked && windows[selected] !== undefined;

  const handleDownload = async () => {
    if (!resumeRef.current || !unlocked) return;
    setDl(true);
    try {
      const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true, logging: false });
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h);
      pdf.save(`JobAdda_Resume_${profile?.name?.replace(/\s+/g, '_') || 'Resume'}.pdf`);
    } catch (e) { console.error(e); }
    finally { setDl(false); }
  };

  const handlePurchase = async () => {
    try {
      const res = await fetch('/api/user/resume-purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: plan.id, amount: plan.price }),
      });
      const data = await res.json();
      if (data.expiresAt) {
        setWindows(prev => ({ ...prev, [data.templateId]: data.expiresAt }));
        setCheckout(null);
      }
    } catch (e) { console.error(e); }
  };

  const fmtSecs = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (!profile) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-3)', fontWeight: 700 }}>
      Loading profile...
    </div>
  );

  /* ─── CONTROLS PANEL (shared between mobile/desktop) ─── */
  const ControlsPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Section Toggles */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', margin: '0 0 0.75rem' }}>Show / Hide Sections</h3>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr', gap: '0.2rem' }}>
          {SECTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setConfig(c => ({ ...c, [s.key]: !(c as any)[s.key] }))}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.7rem', borderRadius: '9px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)' }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.label}</span>
              {(config as any)[s.key] ? <Eye size={13} color="var(--primary)" /> : <EyeOff size={13} color="var(--text-3)" />}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker — T2 only */}
      {selected === 'TPL_2' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', margin: '0 0 0.75rem' }}>Accent Color</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
            {COLOR_PRESETS.map(c => (
              <button key={c} onClick={() => setAccent(c)}
                style={{ width: '26px', height: '26px', borderRadius: '50%', background: c, border: accentColor === c ? '3px solid white' : '2px solid transparent', outline: accentColor === c ? `2px solid ${c}` : 'none', cursor: 'pointer', flexShrink: 0 }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="color" value={accentColor} onChange={e => setAccent(e.target.value)}
              style={{ width: '32px', height: '32px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
            <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-3)' }}>{accentColor}</span>
          </div>
        </div>
      )}

      {/* Download CTA */}
      {unlocked ? (
        <div>
          <div style={{ padding: '0.7rem 1rem', borderRadius: '12px', background: remaining > 60 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${remaining > 60 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: remaining > 60 ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={13} /> Window closes
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.15rem', color: remaining > 60 ? '#10b981' : '#ef4444' }}>{fmtSecs(remaining)}</span>
          </div>
          <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '0.7rem' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (remaining / 300) * 100)}%`, background: remaining > 60 ? '#10b981' : '#ef4444', borderRadius: '2px', transition: 'width 1s linear, background 0.3s' }} />
          </div>
          <button onClick={handleDownload} disabled={downloading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.9rem', borderRadius: '12px', background: '#10b981', color: '#fff', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(16,185,129,0.35)' }}
          >
            {downloading ? 'Generating...' : <><Download size={18} /> Download PDF</>}
          </button>
        </div>
      ) : (
        <div>
          {expired && (
            <div style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={13} color="#ef4444" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ef4444' }}>Window expired. Pay again to download.</span>
            </div>
          )}
          <button onClick={() => setCheckout(selected)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.9rem', borderRadius: '12px', background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
          >
            <Lock size={16} /> {plan.price === 0 ? 'Claim Free Access' : `Pay ₹${plan.price} to Unlock`}
          </button>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', textAlign: 'center', margin: '0.6rem 0 0' }}>
            🕐 5-min download window after payment
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: isMobile ? '1rem' : '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: isMobile ? '1.25rem' : '2rem' }}>
        <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 900, margin: '0 0 0.3rem', letterSpacing: '-0.03em' }}>
          Resume <span className="text-gradient">Builder</span>
        </h1>
        <p style={{ color: 'var(--text-3)', margin: 0, fontSize: '0.9rem' }}>Pick a template · pay once · download within 5 minutes.</p>
      </div>

      {/* Plan Cards — horizontal scroll on mobile */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: isMobile ? '1.25rem' : '2rem', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        {PLANS.map(pl => {
          const act = isUnlocked(pl.id);
          const expStr = windows[pl.id];
          const sl = expStr ? Math.max(0, Math.floor((new Date(expStr).getTime() - Date.now()) / 1000)) : 0;
          return (
            <div
              key={pl.id}
              onClick={() => setSelected(pl.id)}
              style={{ padding: '1rem 1.25rem', borderRadius: '14px', cursor: 'pointer', flexShrink: 0, minWidth: isMobile ? '160px' : '210px', border: selected === pl.id ? '2px solid var(--primary)' : '2px solid var(--border)', background: selected === pl.id ? 'rgba(99,102,241,0.07)' : 'var(--surface)', transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: pl.badgeColor }}>{pl.discount === 100 ? 'FREE' : `${pl.discount}% OFF`}</span>
                {act && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={10} />{fmtSecs(pl.id === selected ? remaining : sl)}</span>}
              </div>
              <div style={{ fontWeight: 800, fontSize: isMobile ? '0.9rem' : '1rem', marginBottom: '0.3rem' }}>{pl.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                <span style={{ fontSize: isMobile ? '1.4rem' : '1.7rem', fontWeight: 900 }}>₹{pl.price}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', textDecoration: 'line-through' }}>₹{pl.origPrice}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE LAYOUT */}
      {isMobile ? (
        <div>
          {/* Mobile: Resume preview — properly clipped */}
          <div style={{
            position: 'relative',
            marginBottom: '1.25rem',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            // height = minHeight of resume × scale factor
            // resume minHeight ≈ 1122px, scale = 0.45 → 505px
            // Add a bit extra for content that overflows minHeight
            height: '520px',
            background: '#f8fafc',
          }}>
            {/* Scale wrapper — transform doesn't affect flow so we position it absolutely */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'scale(0.45)',
              transformOrigin: 'top left',
              width: '222.2%',   // 100 / 0.45
              pointerEvents: 'none',
            }}>
              <div ref={resumeRef}>
                {selected === 'TPL_1' && <Template1 p={profile} config={config} unlocked={unlocked} />}
                {selected === 'TPL_2' && <Template2 p={profile} config={config} unlocked={unlocked} accentColor={accentColor} />}
                {selected === 'TPL_3' && <Template3 p={profile} config={config} unlocked={unlocked} />}
              </div>
            </div>
            {/* "Preview" badge */}
            <div style={{ position: 'absolute', bottom: '0.6rem', right: '0.6rem', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
              Preview
            </div>
          </div>

          {/* Mobile: Collapsible controls */}
          <button
            onClick={() => setShowControls(v => !v)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.9rem 1.1rem', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', marginBottom: '0.75rem' }}
          >
            <span>⚙️ Customise Sections</span>
            {showControls ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {showControls && ControlsPanel}

          {/* Mobile: CTA always visible at bottom */}
          {!showControls && (
            unlocked ? (
              <div>
                <div style={{ padding: '0.65rem 1rem', borderRadius: '10px', background: remaining > 60 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${remaining > 60 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, marginBottom: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: remaining > 60 ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} />Window closes</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.1rem', color: remaining > 60 ? '#10b981' : '#ef4444' }}>{fmtSecs(remaining)}</span>
                </div>
                <button onClick={handleDownload} disabled={downloading}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '1rem', borderRadius: '14px', background: '#10b981', color: '#fff', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(16,185,129,0.35)' }}
                >
                  {downloading ? 'Generating...' : <><Download size={20} />Download PDF</>}
                </button>
              </div>
            ) : (
              <button onClick={() => setCheckout(selected)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '1rem', borderRadius: '14px', background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}
              >
                <Lock size={18} />{plan.price === 0 ? 'Claim Free Access' : `Pay ₹${plan.price} to Unlock`}
              </button>
            )
          )}
        </div>
      ) : (
        /* DESKTOP LAYOUT */
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
          <div>{ControlsPanel}</div>
          <div style={{ position: 'relative' }}>
            {!unlocked && <style>{`@media print{#resume-preview{display:none!important}}`}</style>}
            <div id="resume-preview" ref={resumeRef} style={{ borderRadius: '4px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.45)', userSelect: unlocked ? 'auto' : 'none' } as React.CSSProperties}>
              {selected === 'TPL_1' && <Template1 p={profile} config={config} unlocked={unlocked} />}
              {selected === 'TPL_2' && <Template2 p={profile} config={config} unlocked={unlocked} accentColor={accentColor} />}
              {selected === 'TPL_3' && <Template3 p={profile} config={config} unlocked={unlocked} />}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkout && (() => {
        const cp = PLANS.find(p => p.id === checkout)!;
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', padding: isMobile ? '0' : '1rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: isMobile ? '100%' : '400px', padding: '2rem', borderRadius: isMobile ? '20px 20px 0 0' : '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>Unlock Template</h2>
              <p style={{ color: 'var(--text-3)', margin: '0 0 1.5rem', fontSize: '0.85rem' }}>
                You'll have <strong style={{ color: 'var(--text)' }}>5 minutes</strong> to download after payment.
              </p>

              {checkout === 'TPL_1' && offerTimer > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', marginBottom: '1.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#10b981', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} />Free offer expires</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.2rem', color: '#10b981' }}>{fmtSecs(offerTimer)}</span>
                </div>
              )}

              <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1.1rem', marginBottom: '1.25rem' }}>
                {[['Template', cp.label], ['Original', `₹${cp.origPrice}`], ['Discount', `-${cp.discount}%`]].map(([k, v], i) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < 2 ? '0.5rem' : '0' }}>
                    <span style={{ color: 'var(--text-3)', fontWeight: 600, fontSize: '0.88rem' }}>{k}</span>
                    <span style={{ fontWeight: 700, textDecoration: k === 'Original' ? 'line-through' : 'none', color: k === 'Discount' ? '#10b981' : 'inherit' }}>{v}</span>
                  </div>
                ))}
                <div style={{ height: '1px', background: 'var(--border)', margin: '0.75rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800 }}>Total</span>
                  <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--primary)' }}>₹{cp.price}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 0.9rem', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px', marginBottom: '1.25rem' }}>
                <Clock size={14} color="var(--primary)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)' }}>5-minute window starts immediately after payment.</span>
              </div>

              <button onClick={handlePurchase}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '1rem', borderRadius: '14px', background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontWeight: 900, fontSize: '1rem', border: 'none', cursor: 'pointer', marginBottom: '0.65rem', boxShadow: '0 6px 24px rgba(99,102,241,0.4)' }}
              >
                {cp.price === 0 ? '🎉 Claim Free · Start 5-min Timer' : `Pay ₹${cp.price} · Start 5-min Timer`}
              </button>
              <button onClick={() => setCheckout(null)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-3)', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
