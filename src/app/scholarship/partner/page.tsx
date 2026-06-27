'use client';
import React, { useState } from 'react';
import { Award, Gift, Search, Loader2, Calendar, ArrowLeft, MessageSquare, ShieldCheck, TrendingUp, Sparkles, AlertCircle, Info, CheckCircle2, Users, Tag, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const MILESTONES_HI = [
  { count: '1,000 रजिस्ट्रेशन', gift: 'boAt Airdopes ईयरबड्स', color: '#F59E0B', emoji: '🎧' },
  { count: '5,000 रजिस्ट्रेशन', gift: 'ब्लूटूथ पार्टी स्पीकर', color: '#10B981', emoji: '🔊' },
  { count: '10,000 रजिस्ट्रेशन', gift: 'स्मार्ट प्रोजेक्टर', color: '#6366F1', emoji: '📽️' },
  { count: '15,000 रजिस्ट्रेशन', gift: 'प्रीमियम स्मार्टफ़ोन', color: '#EC4899', emoji: '📱' },
  { count: '25,000 रजिस्ट्रेशन', gift: 'लेटेस्ट लैपटॉप', color: '#EF4444', emoji: '💻' },
];
const MILESTONES_EN = [
  { count: '1,000 Registrations', gift: 'boAt Airdopes Earbuds', color: '#F59E0B', emoji: '🎧' },
  { count: '5,000 Registrations', gift: 'Bluetooth Party Speaker', color: '#10B981', emoji: '🔊' },
  { count: '10,000 Registrations', gift: 'Smart Projector', color: '#6366F1', emoji: '📽️' },
  { count: '15,000 Registrations', gift: 'Premium Smartphone', color: '#EC4899', emoji: '📱' },
  { count: '25,000 Registrations', gift: 'Latest Laptop', color: '#EF4444', emoji: '💻' },
];

const T = {
  HI: {
    back: '← स्कॉलरशिप होम',
    heroTag: '★ रजिस्ट्रेशन पार्टनर प्रोग्राम 2026 ★',
    heroTitle: 'कमाएँ भी, छात्रों की मदद भी करें!',
    heroSub: 'अपना यूनिक कूपन कोड शेयर करें — हर सफल रजिस्ट्रेशन पर ₹10 पाएँ।',
    benefitsTitle: 'आपको क्या मिलेगा?',
    b: [
      { icon: '₹10', label: '₹10 प्रति छात्र', desc: 'हर पेड रजिस्ट्रेशन पर ₹10 सीधी कमाई', color: '#F97316' },
      { icon: '🎫', label: 'यूनिक कूपन कोड', desc: 'एक्सक्लूसिव कूपन कोड सिर्फ आपके लिए', color: '#6366F1' },
      { icon: '10%', label: '10% स्टूडेंट छूट', desc: 'आपके छात्रों को मिलेगी 10% की छूट', color: '#10B981' },
      { icon: '📊', label: 'लाइव ट्रैकिंग', desc: 'अपने कूपन से हुए रजिस्ट्रेशन ट्रैक करें', color: '#8B5CF6' },
      { icon: '🎁', label: 'माइलस्टोन गिफ्ट', desc: 'माइलस्टोन पूरा करने पर शानदार उपहार', color: '#EC4899' },
    ],
    milestoneTitle: '🏆 माइलस्टोन पर शानदार उपहार!',
    milestoneBadge: '⚠️ केवल एक इनाम मिलेगा — आपकी अंतिम संख्या के अनुसार।',
    rulesTitle: '📋 महत्वपूर्ण नियम',
    rules: [
      'हर सफल पेड रजिस्ट्रेशन पर ₹10 की कमाई होती रहेगी।',
      'माइलस्टोन उपहार कमाई से अलग (अतिरिक्त) होगा।',
      '15 अगस्त 2026 को अंतिम रजिस्ट्रेशन संख्या देखकर एक उपहार दिया जाएगा।',
      'आपको वही उपहार मिलेगा जिसके आप योग्य होंगे।',
      'एक से अधिक उपहार नहीं दिए जाएंगे।',
    ],
    datesTitle: '📅 महत्वपूर्ण तिथियाँ',
    dates: [
      { label: 'रजिस्ट्रेशन शुरू', val: '21 जून 2026', color: '#10B981' },
      { label: 'अंतिम तिथि', val: '10 अगस्त 2026', color: '#EF4444' },
      { label: 'परीक्षा तिथि', val: '15 अगस्त 2026', color: '#F59E0B' },
    ],
    trackTitle: '🔍 अपने कूपन कोड की रिपोर्ट देखें',
    trackPlaceholder: 'कूपन कोड दर्ज करें (उदा. SHYAM)',
    trackBtn: 'ट्रैक करें',
    statTitle: 'पार्टनर रिपोर्ट',
    statCount: 'कुल सफल रजिस्ट्रेशन',
    statThanks: 'JobAdda.in के साथ पार्टनरशिप के लिए धन्यवाद!',
    ctaTitle: 'आज ही शुरू करें — अपना कूपन कोड पाएँ!',
    ctaSub: 'WhatsApp पर संपर्क करें और पार्टनर बनें:',
    tabHi: 'हिंदी',
    tabEn: 'English',
  },
  EN: {
    back: '← Scholarship Home',
    heroTag: '★ Registration Partner Program 2026 ★',
    heroTitle: 'Earn Money While Helping Students!',
    heroSub: 'Share your unique coupon code — earn ₹10 on every successful paid registration.',
    benefitsTitle: 'What will you get?',
    b: [
      { icon: '₹10', label: '₹10 Per Student', desc: 'Earn ₹10 directly for every paid registration', color: '#F97316' },
      { icon: '🎫', label: 'Unique Coupon Code', desc: 'An exclusive coupon code dedicated to you', color: '#6366F1' },
      { icon: '10%', label: '10% Student Discount', desc: 'Your students get a 10% discount instantly', color: '#10B981' },
      { icon: '📊', label: 'Live Tracking', desc: 'Track registrations made using your code', color: '#8B5CF6' },
      { icon: '🎁', label: 'Milestone Gifts', desc: 'Win high-value rewards at every milestone', color: '#EC4899' },
    ],
    milestoneTitle: '🏆 Amazing Rewards on Milestones!',
    milestoneBadge: '⚠️ Only one reward will be given — based on your final count.',
    rulesTitle: '📋 Important Rules',
    rules: [
      'You earn ₹10 on every successful paid registration continuously.',
      'Milestone rewards are in addition to your direct earnings.',
      'Final count on 15th August 2026 decides your milestone gift.',
      'You receive the gift corresponding to your final milestone.',
      'No more than one gift will be awarded per partner.',
    ],
    datesTitle: '📅 Important Dates',
    dates: [
      { label: 'Registration Starts', val: '21st June 2026', color: '#10B981' },
      { label: 'Last Date', val: '10th August 2026', color: '#EF4444' },
      { label: 'Exam Date', val: '15th August 2026', color: '#F59E0B' },
    ],
    trackTitle: '🔍 Check Your Coupon Code Report',
    trackPlaceholder: 'Enter coupon code (e.g. CODE10)',
    trackBtn: 'Track Now',
    statTitle: 'Partner Report',
    statCount: 'Total Successful Registrations',
    statThanks: 'Thank you for partnering with JobAdda.in!',
    ctaTitle: 'Start Today — Get Your Coupon Code!',
    ctaSub: 'Contact us on WhatsApp to become a partner:',
    tabHi: 'हिंदी',
    tabEn: 'English',
  },
};

export default function ScholarshipPartnerPage() {
  const [lang, setLang] = useState<'HI' | 'EN'>('HI');
  const [lookup, setLookup] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookup.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`/api/scholarship/partner?lookup=${encodeURIComponent(lookup.trim())}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Failed to fetch');
      else setResult(data);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const c = T[lang];
  const milestones = lang === 'HI' ? MILESTONES_HI : MILESTONES_EN;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-1)' }}>
      <style>{`
        .partner-container { max-width: 1100px; margin: 0 auto; padding: 7rem 1.25rem 4rem; }
        .partner-topbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
        .lang-toggle { display: flex; background: var(--bg-3); border: 2px solid var(--border); border-radius: 14px; padding: 0.3rem; gap: 0.25rem; }
        .lang-btn { padding: 0.65rem 1.75rem; border-radius: 10px; border: none; font-size: 1rem; font-weight: 800; cursor: pointer; transition: all 0.25s ease; font-family: inherit; }
        .lang-btn-active { background: var(--primary); color: #fff; box-shadow: 0 4px 14px rgba(99,102,241,0.35); }
        .lang-btn-inactive { background: transparent; color: var(--text-2); }
        .hero-card { background: linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(249,115,22,0.08) 100%); border: 1px solid var(--border); border-radius: 24px; padding: 3rem 2rem; text-align: center; margin-bottom: 2.5rem; }
        .hero-tag { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(249,115,22,0.12); border: 1px solid rgba(249,115,22,0.25); color: #F97316; border-radius: 9999px; padding: 0.4rem 1.2rem; font-size: 0.8rem; font-weight: 800; margin-bottom: 1.5rem; letter-spacing: 0.03em; }
        .hero-h1 { font-size: clamp(1.6rem, 4vw, 2.6rem); font-weight: 900; color: var(--text-1); margin: 0 0 0.75rem; line-height: 1.2; }
        .hero-sub { color: var(--text-3); font-size: clamp(0.9rem, 2vw, 1.05rem); max-width: 560px; margin: 0 auto; line-height: 1.6; }
        .section-title { font-size: clamp(1.2rem, 3vw, 1.5rem); font-weight: 800; color: var(--text-1); margin: 0 0 1.5rem; }
        .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.25rem; margin-bottom: 3rem; }
        .benefit-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 18px; padding: 1.5rem 1.25rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .benefit-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
        .benefit-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 900; }
        .benefit-label { font-size: 0.95rem; font-weight: 800; color: var(--text-1); }
        .benefit-desc { font-size: 0.78rem; color: var(--text-3); line-height: 1.4; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem; }
        @media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }
        .milestone-list { display: flex; flex-direction: column; gap: 0.9rem; }
        .milestone-row { display: flex; align-items: center; gap: 1rem; background: var(--bg-2); border: 1px solid var(--border); border-radius: 16px; padding: 1rem 1.25rem; transition: transform 0.2s ease; }
        .milestone-row:hover { transform: translateX(3px); }
        .milestone-badge { border-radius: 12px; padding: 0.55rem 0.9rem; font-size: 0.82rem; font-weight: 900; color: #fff; white-space: nowrap; text-align: center; box-shadow: 0 3px 8px rgba(0,0,0,0.18); min-width: 130px; }
        .milestone-gift { display: flex; flex-direction: column; }
        .milestone-reward-label { font-size: 0.7rem; font-weight: 700; color: var(--text-3); letter-spacing: 0.06em; text-transform: uppercase; }
        .milestone-gift-name { font-size: 1rem; font-weight: 800; color: var(--text-1); }
        .rules-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; padding: 1.75rem; }
        .milestone-note { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 0.85rem 1rem; font-size: 0.85rem; color: var(--text-2); font-weight: 600; margin-bottom: 1.5rem; line-height: 1.5; }
        .rule-item { display: flex; gap: 0.6rem; align-items: flex-start; padding: 0.6rem 0; border-bottom: 1px solid var(--border); font-size: 0.88rem; color: var(--text-2); line-height: 1.5; }
        .rule-item:last-child { border-bottom: none; }
        .dates-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; padding: 1.75rem; margin-top: 1.25rem; }
        .date-row { display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0; border-bottom: 1px solid var(--border); font-size: 0.88rem; }
        .date-row:last-child { border-bottom: none; }
        .track-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 22px; padding: 2rem; margin-bottom: 2.5rem; }
        .track-form { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .track-input { flex: 1; min-width: 220px; padding: 1rem 1.25rem; border-radius: 14px; background: var(--bg-3); border: 1.5px solid var(--border); color: var(--text-1); font-size: 1rem; outline: none; transition: border-color 0.2s; font-family: inherit; }
        .track-input:focus { border-color: var(--primary); }
        .track-btn { display: flex; align-items: center; gap: 0.5rem; background: var(--primary); color: #fff; border: none; border-radius: 14px; padding: 1rem 1.75rem; font-size: 1rem; font-weight: 800; cursor: pointer; transition: opacity 0.2s, transform 0.2s; font-family: inherit; white-space: nowrap; }
        .track-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .track-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .stat-box { margin-top: 1.5rem; background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.25); border-radius: 16px; padding: 1.5rem; }
        .stat-count-big { font-size: 3rem; font-weight: 900; color: #10B981; line-height: 1; }
        .error-box { margin-top: 1.25rem; background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 1rem 1.25rem; color: #F87171; font-size: 0.88rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
        .cta-card { background: linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(16,185,129,0.05) 100%); border: 1px solid rgba(37,211,102,0.2); border-radius: 22px; padding: 2.5rem 2rem; text-align: center; }
        .wa-btn { display: inline-flex; align-items: center; gap: 0.75rem; background: #25D366; color: #fff; text-decoration: none; padding: 1rem 2rem; border-radius: 14px; font-size: 1.1rem; font-weight: 900; box-shadow: 0 6px 20px rgba(37,211,102,0.3); transition: transform 0.2s, box-shadow 0.2s; }
        .wa-btn:hover { transform: scale(1.03); box-shadow: 0 10px 28px rgba(37,211,102,0.4); }
        .footer-links { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; margin-top: 1.25rem; }
        @media (max-width: 480px) {
          .partner-container { padding: 6rem 1rem 3rem; }
          .hero-card { padding: 2rem 1.25rem; }
          .lang-btn { padding: 0.6rem 1.25rem; font-size: 0.9rem; }
          .track-btn { width: 100%; justify-content: center; }
          .track-input { min-width: 100%; }
          .benefits-grid { grid-template-columns: repeat(2, 1fr); }
          .milestone-badge { min-width: 100px; font-size: 0.75rem; }
        }
      `}</style>

      <div className="partner-container">

        {/* Top Bar */}
        <div className="partner-topbar">
          <Link href="/scholarship" style={{ color: 'var(--text-3)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            {c.back}
          </Link>
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === 'HI' ? 'lang-btn-active' : 'lang-btn-inactive'}`} onClick={() => setLang('HI')}>{c.tabHi}</button>
            <button className={`lang-btn ${lang === 'EN' ? 'lang-btn-active' : 'lang-btn-inactive'}`} onClick={() => setLang('EN')}>{c.tabEn}</button>
          </div>
        </div>

        {/* Hero */}
        <div className="hero-card">
          <div className="hero-tag"><Sparkles size={14} /> {c.heroTag}</div>
          <h1 className="hero-h1">{c.heroTitle}</h1>
          <p className="hero-sub">{c.heroSub}</p>
        </div>

        {/* Live Tracking Search */}
        <div className="track-card">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart3 size={22} color="var(--primary-light)" /> {c.trackTitle}
          </h2>
          <form onSubmit={handleSearch} className="track-form">
            <input className="track-input" type="text" value={lookup} onChange={e => setLookup(e.target.value)} placeholder={c.trackPlaceholder} required />
            <button type="submit" disabled={loading} className="track-btn">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} />{c.trackBtn}</>}
            </button>
          </form>
          {error && <div className="error-box"><AlertCircle size={16} />{error}</div>}
          {result && (
            <div className="stat-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={22} color="#10B981" />
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-1)' }}>{c.statTitle}</span>
              </div>
              <div className="stat-count-big">{result.count}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-2)', marginTop: '0.5rem', fontWeight: 600 }}>{c.statCount}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.4rem' }}>{c.statThanks}</div>
            </div>
          )}
        </div>

        {/* Benefits */}
        <h2 className="section-title" style={{ textAlign: 'center' }}>{c.benefitsTitle}</h2>
        <div className="benefits-grid">
          {c.b.map((b, i) => (
            <div key={i} className="benefit-card">
              <div className="benefit-icon" style={{ background: b.color + '18', color: b.color, fontSize: typeof b.icon === 'string' && b.icon.length > 2 ? '0.95rem' : '1.3rem' }}>{b.icon}</div>
              <div className="benefit-label">{b.label}</div>
              <div className="benefit-desc">{b.desc}</div>
            </div>
          ))}
        </div>

        {/* Milestones + Rules Two Column */}
        <div className="two-col">
          {/* Left: Milestones */}
          <div>
            <h2 className="section-title">{c.milestoneTitle}</h2>
            <div className="milestone-list">
              {milestones.map((m, i) => (
                <div key={i} className="milestone-row">
                  <div className="milestone-badge" style={{ background: m.color }}>{m.emoji} {m.count}</div>
                  <div className="milestone-gift">
                    <span className="milestone-reward-label">REWARD</span>
                    <span className="milestone-gift-name">{m.gift}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Rules + Dates */}
          <div>
            <h2 className="section-title">{c.rulesTitle}</h2>
            <div className="rules-card">
              <div className="milestone-note">{c.milestoneBadge}</div>
              {c.rules.map((r, i) => (
                <div key={i} className="rule-item">
                  <CheckCircle2 size={16} color="#22C55E" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span>{r}</span>
                </div>
              ))}
            </div>
            <div className="dates-card">
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-1)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={17} color="var(--primary-light)" />{c.datesTitle}
              </h3>
              {c.dates.map((d, i) => (
                <div key={i} className="date-row">
                  <span style={{ color: 'var(--text-3)', fontWeight: 600 }}>{d.label}</span>
                  <strong style={{ color: d.color }}>{d.val}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="cta-card">
          <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 900, color: 'var(--text-1)', margin: '0 0 0.5rem' }}>{c.ctaTitle}</h3>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>{c.ctaSub}</p>
          <a href="https://wa.me/917042478224" target="_blank" rel="noopener noreferrer" className="wa-btn">
            <MessageSquare size={22} fill="white" /> WhatsApp: 7042478224
          </a>
          <div className="footer-links">
            <Link href="/scholarship" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: '#fff', fontWeight: 800, fontSize: '0.95rem', padding: '0.75rem 1.5rem', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(99,102,241,0.3)', transition: 'transform 0.2s' }}>
              🎓 Scholarship Registration
            </Link>
            <Link href="/scholarship-terms" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-3)', border: '2px solid var(--border)', color: 'var(--text-1)', fontWeight: 800, fontSize: '0.95rem', padding: '0.75rem 1.5rem', borderRadius: '12px', textDecoration: 'none', transition: 'transform 0.2s' }}>
              📋 Terms & Conditions
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
