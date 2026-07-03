'use client';
import React, { useState, useEffect } from 'react';
import { Star, Shield, Zap, MessageCircle, CheckCircle, Loader2, Tag, X, AlertTriangle, ChevronRight, Mail, Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BASE_PRICE = 99;
const ORIGINAL_PRICE = 499;

export default function PremiumUpgradePage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  // Don't initialize profile from session — always wait for fresh DB data
  const [profile, setProfile] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Checkout modal state
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ type: string; discount: number | null; code: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Notification state
  const [notif, setNotif] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    // Always fetch fresh premium status from DB — never rely on stale session
    fetch('/api/profile').then(r => r.json()).then(data => {
      if (data && !data.error) setProfile(data);
      setPageLoading(false);
    }).catch(() => setPageLoading(false));
    
    setMounted(true);
    const checkMob = () => setIsMobile(window.innerWidth < 768);
    checkMob();
    window.addEventListener('resize', checkMob);
    return () => window.removeEventListener('resize', checkMob);
  }, [status]);

  useEffect(() => {
    if (notif) {
      const timer = setTimeout(() => setNotif(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  const mobile = mounted ? isMobile : false;

  const getFinalPrice = () => {
    if (!appliedCoupon) return BASE_PRICE;
    if (appliedCoupon.type === 'FREE') return 0;
    if (appliedCoupon.type === 'PERCENT' && appliedCoupon.discount) {
      return Math.max(0, BASE_PRICE - Math.floor((BASE_PRICE * appliedCoupon.discount) / 100));
    }
    return BASE_PRICE;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, target: 'PREMIUM' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Invalid coupon');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data);
        setCouponError('');
      }
    } catch {
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });

  const handlePurchase = async () => {
    const finalPrice = getFinalPrice();
    setLoading(true);

    // FREE via coupon — skip Razorpay
    if (finalPrice === 0) {
      try {
        const res = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: 'FREE_COUPON',
            razorpay_payment_id: 'FREE_COUPON',
            razorpay_signature: 'FREE_COUPON',
            type: 'PREMIUM',
            amount: 0,
            couponCode: appliedCoupon?.code,
          }),
        });
        const data = await res.json();
        if (data.success) {
          await update();
          setShowCheckout(false);
          setNotif({ type: 'success', msg: 'Premium Activated for Free! Welcome! ⭐' });
          setTimeout(() => window.location.href = '/user/dashboard', 1500);
        } else {
          setNotif({ type: 'error', msg: data.error || 'Activation failed' });
        }
      } catch {
        setNotif({ type: 'error', msg: 'Something went wrong' });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Paid flow
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setNotif({ type: 'error', msg: 'Payment gateway failed to load. Please disable ad-blockers or check your connection.' });
        setLoading(false);
        return;
      }

      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalPrice, type: 'PREMIUM' }),
      });
      const orderData = await orderRes.json();

      if (orderData.error) {
        setNotif({ type: 'error', msg: orderData.error });
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'JobAdda Premium',
        description: '1-Year Premium Access',
        image: '/logo.png',
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                type: 'PREMIUM',
                amount: finalPrice,
                couponCode: appliedCoupon?.code,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              await update();
              setShowCheckout(false);
              setNotif({ type: 'success', msg: 'Premium Activated Successfully! ⭐' });
              setTimeout(() => window.location.href = '/user/dashboard', 1500);
            } else {
              setNotif({ type: 'error', msg: verifyData.error || 'Payment verification failed. Contact support if money was deducted.' });
            }
          } catch (err) {
            console.error('PREMIUM_VERIFY_ERROR:', err);
            setNotif({ type: 'error', msg: 'Payment verification failed. Please contact support if money was deducted.' });
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: profile?.name || session?.user?.name || '',
          email: profile?.email || session?.user?.email || '',
          contact: profile?.phone || '',
        },
        theme: { color: '#fbbf24' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      setNotif({ type: 'error', msg: 'Failed to initialize payment' });
      setLoading(false);
    }
  };

  const finalPrice = getFinalPrice();
  const savings = BASE_PRICE - finalPrice;

  if (pageLoading) {
    return (
      <div className="flex-center" style={{ height: '70vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <p style={{ color: 'var(--text-3)', fontWeight: 600 }}>Checking membership status...</p>
      </div>
    );
  }

  // Show 'Already Premium' state if DB confirms isPremium
  if (profile?.isPremium) {
    return (
      <div className="anim-fade-up" style={{ maxWidth: '900px', margin: mobile ? '1rem auto' : '2rem auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(251,191,36,0.12)', marginBottom: '1.5rem', boxShadow: '0 0 0 16px rgba(251,191,36,0.06)' }}>
            <Star size={36} fill="#fbbf24" color="#fbbf24" />
          </div>
          <h1 style={{ fontSize: mobile ? '1.8rem' : '2.5rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            You&apos;re a <span style={{ color: '#fbbf24' }}>Premium</span> Member
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '1.1rem' }}>Enjoy all the exclusive tools to accelerate your career.</p>
        </div>

        {/* Premium Resume Templates Banner */}
        <div style={{ 
          background: 'rgba(99,102,241,0.06)', 
          border: '1px solid rgba(99,102,241,0.15)', 
          borderRadius: '16px', 
          padding: '1.25rem', 
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          flexWrap: 'wrap'
        }}>
          <div style={{ background: 'var(--primary)', padding: '0.75rem', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
            <Bell size={22} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h4 style={{ margin: '0 0 0.15rem', fontSize: '1rem', fontWeight: 800 }}>Premium Resume Templates Released! 🎨</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-3)', lineHeight: 1.5 }}>
              Unlock high-conversion resume templates designed to get you hired 2x faster.
            </p>
          </div>
          <Link href="/user/resume" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
            Explore Now <ChevronRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Main Status Card */}
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
            border: '1px solid rgba(251,191,36,0.4)', 
            padding: mobile ? '1.5rem' : '2.5rem',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.08 }}>
              <Star size={200} fill="#fbbf24" color="#fbbf24" />
            </div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(251,191,36,0.15)', padding: '0.85rem', borderRadius: '16px', boxShadow: '0 8px 20px rgba(251,191,36,0.1)' }}>
                  <Zap size={28} color="#fbbf24" fill="#fbbf24" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '1.3rem', fontWeight: 900 }}>Membership Active</h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>Priority recruiter status enabled</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <label style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Valid Until</label>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc' }}>
                    {profile.premiumUntil ? new Date(profile.premiumUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '20px', background: 'rgba(16,185,129,0.12)', color: '#10b981', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(16,185,129,0.2)', marginTop: '0.8rem' }}>
                    <CheckCircle size={14} /> {Math.max(0, Math.ceil((new Date(profile.premiumUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>RESUME DOWNLOADS</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc' }}>{profile.premiumResumeDownloads || 0} <span style={{ color: '#475569', fontSize: '0.9rem' }}>/ 5</span></div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>HR CHAT</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>UNLIMITED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem', borderRadius: '20px' }}>
              <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', fontWeight: 800 }}>
                <Shield size={20} color="var(--primary)" /> Premium Support
              </h4>
              <p style={{ color: 'var(--text-3)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Need help with your membership or priority applications? Our dedicated premium team is here for you.
              </p>
              <a href="mailto:support@jobadda.in" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', background: 'var(--bg-3)', color: 'var(--text-2)', border: '1px solid var(--border)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
                <Mail size={16} /> Contact Support
              </a>
            </div>

            <Link href="/user/dashboard" style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', background: '#fbbf24', color: '#000', fontWeight: 900, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: '1rem', textDecoration: 'none', boxShadow: '0 10px 25px rgba(251,191,36,0.25)' }}>
              Back to Dashboard <ChevronRight size={20} />
            </Link>
          </div>
        </div>

        {/* Features Showcase */}
        <div style={{ marginTop: '5rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '2.5rem', fontWeight: 900, fontSize: '1.6rem' }}>Your Active Superpowers</h3>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { icon: <MessageCircle size={24} />, title: 'Direct HR Chat', desc: 'Message hiring managers directly from any job listing without the middleman.' },
              { icon: <Zap size={24} />, title: 'Recruiter Priority', desc: 'Your applications are flagged as priority and appear at the top of the pile.' },
              { icon: <Tag size={24} />, title: 'Premium Resumes', desc: 'Access and download high-conversion resume templates for free.' },
            ].map((f, i) => (
              <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center', borderRadius: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                  {f.icon}
                </div>
                <h4 style={{ margin: '0 0 0.75rem', fontWeight: 800, fontSize: '1.1rem' }}>{f.title}</h4>
                <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="anim-fade-up" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(251,191,36,0.12)', marginBottom: '1.5rem', boxShadow: '0 0 0 12px rgba(251,191,36,0.06)' }}>
            <Star size={34} fill="#fbbf24" color="#fbbf24" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Upgrade to <span style={{ color: '#fbbf24' }}>Premium</span>
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            Supercharge your job search and connect directly with hiring managers.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

          {/* Features Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
            {[
              { icon: <MessageCircle size={22} color="var(--primary)" />, bg: 'rgba(99,102,241,0.1)', title: 'Direct HR Chat', desc: "Bypass the queue and message HR directly for jobs you've applied to." },
              { icon: <Star size={22} color="#fbbf24" />, bg: 'rgba(251,191,36,0.1)', title: 'Premium Badge ⭐', desc: 'Stand out with a verified star next to your name on every listing.' },
              { icon: <Tag size={22} color="#f59e0b" />, bg: 'rgba(245,158,11,0.1)', title: '5 Free Resume Downloads 📄', desc: 'Get 5 free downloads of high-conversion premium resume templates.' },
              { icon: <Zap size={22} color="#10b981" />, bg: 'rgba(16,185,129,0.1)', title: 'Priority Support', desc: 'Dedicated premium support channel with faster response times.' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: f.bg, padding: '0.75rem', borderRadius: '12px', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Card */}
          <div className="card" style={{ padding: '2rem', border: '2px solid #fbbf24', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: '#fbbf24', color: '#000', fontWeight: 800, padding: '0.5rem 2.5rem', transform: 'rotate(45deg) translate(28%, -50%)', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
              BEST DEAL
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>1-Year Premium Access</h2>
            <p style={{ color: 'var(--text-3)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Everything you need to land your dream job.</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>₹{BASE_PRICE}</span>
              <span style={{ fontSize: '1.4rem', color: 'var(--text-3)', textDecoration: 'line-through', fontWeight: 600 }}>₹{ORIGINAL_PRICE}</span>
              <span style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(16,185,129,0.2)' }}>80% OFF</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {['Direct Messaging with HR', 'Premium Profile Badge ⭐', '5 Free Resume Template Downloads 📄', 'Priority Application Review', 'Valid for 365 Days'].map((ft, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.93rem' }}>
                  <CheckCircle size={17} color="#10b981" style={{ flexShrink: 0 }} /> {ft}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowCheckout(true)}
              style={{ width: '100%', padding: '1.1rem', borderRadius: '12px', background: '#fbbf24', color: '#000', border: 'none', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', boxShadow: '0 8px 25px rgba(251,191,36,0.35)', transition: 'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(251,191,36,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 25px rgba(251,191,36,0.35)'; }}
            >
              <Star size={18} fill="#000" color="#000" /> Upgrade Now — ₹{BASE_PRICE}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-3)', fontSize: '0.8rem' }}>
              <Shield size={13} /> Secure · Powered by Razorpay · Coupon accepted
            </div>
          </div>
        </div>
      </div>

      {/* ─── DETACHED CHECKOUT MODAL ─── */}
      {showCheckout && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: mobile ? 'flex-end' : 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', padding: mobile ? '0' : '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: mobile ? '100%' : '420px', padding: '2rem', borderRadius: mobile ? '24px 24px 0 0' : '20px', background: '#1e293b', border: '1px solid #334155', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', color: '#f8fafc', animation: mobile ? 'slideUp 0.3s ease-out' : 'scaleIn 0.3s ease-out' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, color: '#f8fafc' }}>Complete Purchase</h2>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0 0', fontSize: '0.82rem' }}>1-Year Premium Membership</p>
              </div>
              <button onClick={() => { setShowCheckout(false); removeCoupon(); }} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '8px', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* Coupon Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Have a coupon?
              </label>
              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <Tag size={16} color="#10b981" />
                  <span style={{ flex: 1, fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>
                    {appliedCoupon.code} — {appliedCoupon.type === 'FREE' ? '100% OFF' : `${appliedCoupon.discount}% OFF`}
                  </span>
                  <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: '0.1rem' }}>
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    readOnly={!!appliedCoupon}
                    onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${couponError ? '#ef4444' : '#334155'}`, background: '#0f172a', color: '#f8fafc', outline: 'none', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em', opacity: appliedCoupon ? 0.6 : 1 }}
                  />
                  {appliedCoupon ? (
                    <button
                      onClick={removeCoupon}
                      style={{ padding: '0 1.1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 700, border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                      style={{ padding: '0 1.1rem', borderRadius: '10px', background: 'var(--primary)', color: '#fff', fontWeight: 700, border: 'none', cursor: applyingCoupon || !couponCode.trim() ? 'not-allowed' : 'pointer', opacity: applyingCoupon || !couponCode.trim() ? 0.6 : 1, fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  )}
                </div>
              )}
              {couponError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                  <AlertTriangle size={13} color="#ef4444" />
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: 0 }}>{couponError}</p>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Original price</span>
                <span style={{ textDecoration: 'line-through', color: '#64748b' }}>₹{ORIGINAL_PRICE}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: appliedCoupon ? '0.6rem' : '0' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Launch discount (80%)</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>−₹{ORIGINAL_PRICE - BASE_PRICE}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Coupon ({appliedCoupon.code})</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>
                    {appliedCoupon.type === 'FREE' ? `−₹${BASE_PRICE}` : `−${appliedCoupon.discount}%`}
                  </span>
                </div>
              )}
              <div style={{ height: '1px', background: '#334155', margin: '0.85rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>Total</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.6rem', color: '#fbbf24' }}>
                    {finalPrice === 0 ? 'FREE' : `₹${finalPrice}`}
                  </span>
                  {savings > 0 && (
                    <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '0.1rem' }}>
                      You save ₹{ORIGINAL_PRICE - finalPrice} total
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handlePurchase}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', width: '100%', padding: '1.1rem', borderRadius: '14px', background: finalPrice === 0 ? '#10b981' : '#fbbf24', color: finalPrice === 0 ? '#fff' : '#000', fontWeight: 900, fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: finalPrice === 0 ? '0 6px 20px rgba(16,185,129,0.3)' : '0 6px 20px rgba(251,191,36,0.3)', marginBottom: '0.75rem', opacity: loading ? 0.8 : 1 }}
            >
              {loading
                ? <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
                : finalPrice === 0
                  ? '🎉 Claim Free Premium!'
                  : `Pay ₹${finalPrice} · Activate Premium`}
            </button>

            <button
              onClick={() => { setShowCheckout(false); removeCoupon(); }}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'transparent', border: '1px solid #334155', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
            >
              Cancel
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', color: '#475569', fontSize: '0.75rem' }}>
              <Shield size={12} /> Secure · 256-bit encrypted · Razorpay
            </div>
          </div>
        </div>
      )}

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
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slideDown { from { transform: translate(-50%, -100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
      `}</style>
    </>
  );
}
