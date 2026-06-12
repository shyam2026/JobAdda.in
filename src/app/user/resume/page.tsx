'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Download, Lock, Eye, EyeOff, Clock, AlertTriangle, ChevronDown, ChevronUp, CheckCircle, X, Star, Zap } from 'lucide-react';
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
  { key: 'showCert',     label: 'Certifications'  },
];

type WindowMap = Record<string, string>;

export default function ResumeBuilderPage() {
  const { data: session } = useSession();
  const [profile, setProfile]       = useState<any>(null);
  const [selected, setSelected]     = useState('TPL_1');
  const [windows, setWindows]       = useState<WindowMap>({});
  const [accentColor, setAccent]    = useState('#6366f1');
  const [config, setConfig]         = useState({ showBio: true, showEmail: true, showPhone: true, showSocials: true, showSkills: true, showExp: true, showEdu: true, showProjects: true, showCert: true });
  const [checkout, setCheckout]     = useState<string | null>(null);
  const [offerTimer, setOffer]      = useState(599);
  const [remaining, setRemaining]   = useState(0);
  const [downloading, setDl]        = useState(false);
  const [showControls, setShowControls] = useState(false); // mobile accordion
  const [isMobile, setIsMobile]     = useState(false);
  const [scale, setScale]           = useState(1);
  const [mounted, setMounted]       = useState(false);
  const [now, setNow]               = useState(0);
  const [notif, setNotif]           = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ type: string, discount: number | null, code: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notif) {
      const timer = setTimeout(() => setNotif(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const check = () => {
      const isMob = window.innerWidth < 900;
      setIsMobile(isMob);
      if (!isMob) {
        // Calculate available width for the right column
        // window - padding(1.5rem*2) - sidebar(270px) - gap(2rem) - extra padding(2rem)
        // Roughly: window.innerWidth - 48 - 270 - 32 - 32 = window.innerWidth - 382
        const available = window.innerWidth - 382;
        const targetWidth = 794; // ~210mm
        if (available < targetWidth) {
          setScale(available / targetWidth);
        } else {
          setScale(1);
        }
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setTimeout(() => setNow(Date.now()), 0);
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const mobile = mounted ? isMobile : false;

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
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          // Merge session values as fallback for empty DB fields
          const s = session?.user as any;
          setProfile({
            ...data,
            name: data.name || s?.name || '',
            email: data.email || s?.email || '',
          });
        } else {
          // Fallback: build minimal profile from session
          const s = session?.user as any;
          setProfile({
            name: s?.name || '',
            email: s?.email || '',
            bio: '', phone: '', city: '',
            linkedin: '', github: '', website: '', profileImage: '',
            skills: [], education: [], experience: [], certificates: [], projects: [],
            completion: 0,
            isPremium: s?.isPremium || false,
            premiumResumeDownloads: 0,
          });
        }
      })
      .catch(() => {
        const s = session?.user as any;
        setProfile({
          name: s?.name || '',
          email: s?.email || '',
          bio: '', phone: '', city: '',
          linkedin: '', github: '', website: '', profileImage: '',
          skills: [], education: [], experience: [], certificates: [], projects: [],
          completion: 0,
          isPremium: s?.isPremium || false,
          premiumResumeDownloads: 0,
        });
      });
    setTimeout(loadPurchases, 0);
  }, [loadPurchases, session]);

  useEffect(() => {
    if (checkout !== 'TPL_1') return;
    const iv = setInterval(() => setOffer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, [checkout]);

  useEffect(() => {
    const exp = windows[selected];
    if (!exp) { setTimeout(() => setRemaining(0), 0); return; }
    const tick = () => {
      const secs = Math.max(0, Math.floor((new Date(exp).getTime() - Date.now()) / 1000));
      setRemaining(secs);
      if (secs <= 0) setWindows(prev => { const n = { ...prev }; delete n[selected]; return n; });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [windows, selected]);

  const isUnlocked = (id: string) => !!windows[id] && new Date(windows[id]).getTime() > now;
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
      
      // Inject clickable link overlays into the PDF
      const links = resumeRef.current.querySelectorAll('a');
      const containerRect = resumeRef.current.getBoundingClientRect();
      links.forEach((linkEl) => {
        const href = linkEl.getAttribute('href');
        if (!href) return;
        
        const rect = linkEl.getBoundingClientRect();
        const relativeLeft = rect.left - containerRect.left;
        const relativeTop = rect.top - containerRect.top;
        const relativeWidth = rect.width;
        const relativeHeight = rect.height;
        
        // Convert to PDF coordinates (mm)
        const pdfX = (relativeLeft / containerRect.width) * w;
        const pdfY = (relativeTop / containerRect.height) * h;
        const pdfW = (relativeWidth / containerRect.width) * w;
        const pdfH = (relativeHeight / containerRect.height) * h;
        
        pdf.link(pdfX, pdfY, pdfW, pdfH, { url: href });
      });

      pdf.save(`JobAdda_Resume_${profile?.name?.replace(/\s+/g, '_') || 'Resume'}.pdf`);
    } catch (e) { console.error(e); }
    finally { setDl(false); }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, target: 'RESUME' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Invalid coupon');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data);
        setCouponError('');
      }
    } catch (e) {
      setCouponError('Failed to validate coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const getFinalPrice = () => {
    if (plan.price === 0) return 0;
    if (!appliedCoupon) return plan.price;
    if (appliedCoupon.type === 'FREE') return 0;
    if (appliedCoupon.type === 'PERCENT' && appliedCoupon.discount) {
      const discountAmount = (plan.price * appliedCoupon.discount) / 100;
      return Math.max(0, plan.price - discountAmount);
    }
    return plan.price;
  };

  const handlePurchase = async () => {
    const finalPrice = getFinalPrice();

    if (finalPrice === 0) {
      // Handle free template or fully discounted template directly
      try {
        const res = await fetch('/api/user/resume-purchases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId: plan.id, amount: finalPrice, couponCode: appliedCoupon?.code }),
        });
        const data = await res.json();
        if (data.expiresAt) {
          setWindows(prev => ({ ...prev, [data.templateId]: data.expiresAt }));
          setCheckout(null);
          setNotif({ type: 'success', msg: 'Free template unlocked successfully! You can now download your resume.' });
        }
      } catch (e) { console.error(e); }
      return;
    }

    // Handle paid template via Razorpay
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // 1. Create Order
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalPrice, templateId: plan.id }),
      });
      const orderData = await orderRes.json();

      if (orderData.error) {
        setNotif({ type: 'error', msg: orderData.error });
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'JobAdda.in',
        description: `Unlock ${plan.label} Template`,
        image: '/logo.png',
        order_id: orderData.id,
        handler: async (response: any) => {
          // 3. Verify Payment
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              templateId: plan.id,
              amount: finalPrice,
              couponCode: appliedCoupon?.code,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.expiresAt) {
            setWindows(prev => ({ ...prev, [verifyData.templateId]: verifyData.expiresAt }));
            setCheckout(null);
            setNotif({ type: 'success', msg: 'Template unlocked successfully! You can now download your resume.' });
          } else {
            setNotif({ type: 'error', msg: verifyData.error || 'Payment verification failed' });
          }
        },
        prefill: {
          name: profile?.name || '',
          email: profile?.email || '',
          contact: profile?.phone || '',
        },
        theme: {
          color: '#6366f1',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error('PAYMENT_INIT_ERROR:', e);
      setNotif({ type: 'error', msg: 'Failed to initialize payment' });
    }
  };
  
  const handlePremiumClaim = async () => {
    if (!profile?.isPremium || profile.premiumResumeDownloads >= 5) return;
    setClaiming(true);
    try {
      const res = await fetch('/api/user/premium-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: selected }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotif({ type: 'success', msg: data.message });
        setProfile((prev: any) => ({ ...prev, premiumResumeDownloads: (prev.premiumResumeDownloads || 0) + 1 }));
        await loadPurchases();
        setCheckout(null);
      } else {
        setNotif({ type: 'error', msg: data.error || 'Claim failed' });
      }
    } catch (e) {
      setNotif({ type: 'error', msg: 'Something went wrong' });
    } finally {
      setClaiming(false);
    }
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
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : '1fr', gap: '0.2rem' }}>
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
    <div style={{ padding: mobile ? '1rem' : '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: mobile ? '1.25rem' : '2rem' }}>
        <h1 style={{ fontSize: mobile ? '1.8rem' : '2.5rem', fontWeight: 900, margin: '0 0 0.3rem', letterSpacing: '-0.03em' }}>
          Resume <span className="text-gradient">Builder</span>
        </h1>
        <p style={{ color: 'var(--text-3)', margin: 0, fontSize: '0.9rem' }}>Pick a template · pay once · download within 5 minutes.</p>
      </div>

      {/* Plan Cards — horizontal scroll on mobile */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: mobile ? '1.25rem' : '2rem', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        {PLANS.map(pl => {
          const act = isUnlocked(pl.id);
          const expStr = windows[pl.id];
          const sl = expStr ? Math.max(0, Math.floor((new Date(expStr).getTime() - now) / 1000)) : 0;
          return (
            <div
              key={pl.id}
              onClick={() => setSelected(pl.id)}
              style={{ padding: '1rem 1.25rem', borderRadius: '14px', cursor: 'pointer', flexShrink: 0, minWidth: mobile ? '160px' : '210px', border: selected === pl.id ? '2px solid var(--primary)' : '2px solid var(--border)', background: selected === pl.id ? 'rgba(99,102,241,0.07)' : 'var(--surface)', transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: pl.badgeColor }}>{pl.discount === 100 ? 'FREE' : `${pl.discount}% OFF`}</span>
                {act && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={10} />{fmtSecs(pl.id === selected ? remaining : sl)}</span>}
              </div>
              <div style={{ fontWeight: 800, fontSize: mobile ? '0.9rem' : '1rem', marginBottom: '0.3rem' }}>{pl.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                <span style={{ fontSize: mobile ? '1.4rem' : '1.7rem', fontWeight: 900 }}>₹{pl.price}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', textDecoration: 'line-through' }}>₹{pl.origPrice}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE LAYOUT */}
      {mobile ? (
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
        <div style={{ display: 'grid', gridTemplateColumns: '270px minmax(0, 1fr)', gap: '2rem', alignItems: 'flex-start' }}>
          <div>{ControlsPanel}</div>
          <div style={{ position: 'relative', paddingRight: '2rem', paddingBottom: '2rem' }}>
            {!unlocked && <style>{`@media print{#resume-preview{display:none!important}}`}</style>}
            <div style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'top left',
              height: `${1122 * scale}px`, // ~297mm * scale
              width: `${794 * scale}px`   // ~210mm * scale
            }}>
              <div id="resume-preview" ref={resumeRef} style={{ width: '210mm', minHeight: '297mm', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.45)', userSelect: unlocked ? 'auto' : 'none' } as React.CSSProperties}>
                {selected === 'TPL_1' && <Template1 p={profile} config={config} unlocked={unlocked} />}
                {selected === 'TPL_2' && <Template2 p={profile} config={config} unlocked={unlocked} accentColor={accentColor} />}
                {selected === 'TPL_3' && <Template3 p={profile} config={config} unlocked={unlocked} />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkout && (() => {
        const cp = PLANS.find(p => p.id === checkout)!;
        const finalPrice = getFinalPrice();
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: mobile ? 'flex-end' : 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: mobile ? '0' : '1.5rem' }}>
            <div style={{ 
              width: '100%', 
              maxWidth: mobile ? '100%' : '440px', 
              maxHeight: mobile ? '90vh' : '85vh',
              overflowY: 'auto',
              padding: '2rem', 
              borderRadius: mobile ? '24px 24px 0 0' : '24px', 
              background: '#1e293b', 
              border: '1px solid #334155', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)', 
              color: '#f8fafc',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.35rem', letterSpacing: '-0.02em', color: '#f8fafc' }}>Unlock Template</h2>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>
                    You&apos;ll have <strong style={{ color: '#f8fafc' }}>5 minutes</strong> to download after payment.
                  </p>
                </div>
                <button onClick={() => setCheckout(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              {checkout === 'TPL_1' && offerTimer > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', marginBottom: '1.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#10b981', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} />Free offer expires</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.2rem', color: '#10b981' }}>{fmtSecs(offerTimer)}</span>
                </div>
              )}

              {cp.price > 0 && profile?.isPremium && (checkout === 'TPL_2' || checkout === 'TPL_3') && profile?.premiumResumeDownloads < 5 ? (
                /* Premium View: Focus on Claim */
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.06))', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-15px', right: '-15px', opacity: 0.15 }}>
                      <Star size={80} fill="#fbbf24" color="#fbbf24" />
                    </div>
                    <h4 style={{ color: '#fbbf24', margin: '0 0 0.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900 }}>
                      <Zap size={18} fill="#fbbf24" /> Premium Member Reward
                    </h4>
                    <p style={{ color: '#cbd5e1', fontSize: '0.82rem', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                      Unlock this {cp.label} template for free. You have <strong>{5 - (profile.premiumResumeDownloads || 0)}</strong> claims remaining.
                    </p>
                    <button 
                      onClick={handlePremiumClaim}
                      disabled={claiming}
                      style={{ width: '100%', padding: '1rem', borderRadius: '14px', background: '#fbbf24', color: '#000', fontWeight: 900, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(251,191,36,0.25)', transition: 'transform 0.2s' }}
                      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {claiming ? 'Claiming...' : 'Claim for Free'}
                    </button>
                  </div>
                  
                  {/* Option to Pay instead of using claim */}
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button 
                      onClick={() => {
                        const el = document.getElementById('payment-section');
                        if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
                      }}
                      style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Or use a coupon/pay instead
                    </button>
                  </div>

                  <div id="payment-section" style={{ display: 'none', marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <input
                        type="text"
                        placeholder="COUPON"
                        value={couponCode}
                        readOnly={!!appliedCoupon}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc', outline: 'none', opacity: appliedCoupon ? 0.6 : 1 }}
                      />
                      {appliedCoupon ? (
                        <button onClick={handleRemoveCoupon} style={{ padding: '0 1.25rem', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 700, border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>Remove</button>
                      ) : (
                        <button onClick={handleApplyCoupon} style={{ padding: '0 1.25rem', borderRadius: '12px', background: 'var(--primary)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Apply</button>
                      )}
                    </div>
                    {couponError && <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '-1rem 0 1rem' }}>{couponError}</p>}
                    {appliedCoupon && <p style={{ color: '#10b981', fontSize: '0.75rem', margin: '-1rem 0 1rem' }}>Coupon applied successfully!</p>}
                    
                    <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                        <span>Original Price</span>
                        <span style={{ textDecoration: 'line-through' }}>₹{cp.origPrice}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                        <span style={{ color: '#94a3b8' }}>Discount</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>-{cp.discount}%</span>
                      </div>
                      {appliedCoupon && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                          <span style={{ color: '#94a3b8' }}>Coupon ({appliedCoupon.code})</span>
                          <span style={{ color: '#10b981', fontWeight: 700 }}>{appliedCoupon.type === 'FREE' ? '-₹' + cp.price : `-${appliedCoupon.discount}%`}</span>
                        </div>
                      )}
                      <div style={{ height: '1px', background: '#334155', margin: '0.75rem 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800 }}>Total</span>
                        <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary)' }}>₹{finalPrice}</span>
                      </div>
                      <button onClick={handlePurchase} style={{ width: '100%', marginTop: '1rem', padding: '0.8rem', borderRadius: '12px', background: 'var(--primary)', color: '#fff', fontWeight: 800, border: 'none' }}>
                        Pay ₹{finalPrice}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard / Free View */
                <>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="ENTER COUPON CODE"
                        value={couponCode}
                        readOnly={!!appliedCoupon}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc', outline: 'none', opacity: appliedCoupon ? 0.6 : 1 }}
                      />
                      {appliedCoupon ? (
                        <button onClick={handleRemoveCoupon} style={{ padding: '0 1.25rem', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 700, border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>Remove</button>
                      ) : (
                        <button onClick={handleApplyCoupon} style={{ padding: '0 1.25rem', borderRadius: '12px', background: 'var(--primary)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Apply</button>
                      )}
                    </div>
                  </div>

                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '18px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                      <span>Template Price</span>
                      <span style={{ textDecoration: 'line-through' }}>₹{cp.origPrice}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                      <span style={{ color: '#94a3b8' }}>Special Discount</span>
                      <span style={{ color: '#10b981', fontWeight: 800 }}>-{cp.discount}%</span>
                    </div>
                    {appliedCoupon && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#94a3b8' }}>Coupon ({appliedCoupon.code})</span>
                        <span style={{ color: '#10b981', fontWeight: 800 }}>{appliedCoupon.type === 'FREE' ? '-₹' + cp.price : `-${appliedCoupon.discount}%`}</span>
                      </div>
                    )}
                    <div style={{ height: '1px', background: '#334155', margin: '0.8rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800 }}>Amount to Pay</span>
                      <span style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--primary)' }}>₹{finalPrice}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                    <Clock size={16} color="var(--primary)" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c7d2fe', lineHeight: 1.4 }}>5-minute window starts immediately after payment.</span>
                  </div>

                  <button onClick={handlePurchase}
                    style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontWeight: 900, fontSize: '1.1rem', border: 'none', cursor: 'pointer', marginBottom: '1rem', boxShadow: '0 8px 25px rgba(99,102,241,0.35)' }}
                  >
                    {finalPrice === 0 ? 'Claim Free' : `Pay ₹${finalPrice}`} · Start Timer
                  </button>
                </>
              )}

              {!profile?.isPremium && (
                <button onClick={() => { setCheckout(null); setAppliedCoupon(null); setCouponCode(''); }}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Modern Notification System */}
      {notif && (
        <div style={{ position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10000, animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div style={{ background: notif.type === 'success' ? '#10b981' : '#ef4444', color: '#fff', padding: '1rem 1.5rem', borderRadius: '14px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '320px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {notif.type === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{notif.type === 'success' ? 'Success' : 'Error'}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{notif.msg}</div>
            </div>
            <button onClick={() => setNotif(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.2rem', opacity: 0.7 }}>
              <X size={16} />
            </button>
          </div>
          <style>{`
            @keyframes slideDown {
              from { transform: translate(-50%, -100%); opacity: 0; }
              to { transform: translate(-50%, 0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
