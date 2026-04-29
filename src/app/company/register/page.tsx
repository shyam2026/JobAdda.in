'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, Globe, Users, MapPin, ArrowRight, CheckCircle,
  Mail, Lock, Phone, Briefcase, FileText, Hash, ChevronRight
} from 'lucide-react';

const INDUSTRIES = [
  'Information Technology', 'E-Commerce', 'Finance & Banking', 'Healthcare',
  'Education', 'Manufacturing', 'Media & Entertainment', 'FMCG', 'Retail',
  'Real Estate', 'Other'
];
const SIZES = ['1-10', '11-50', '51-200', '201-500', '500-1000', '1000+'];

const STEPS = [
  { n: 1, label: 'Account', icon: Lock },
  { n: 2, label: 'Company', icon: Building2 },
  { n: 3, label: 'Review', icon: CheckCircle },
];

interface FormState {
  name: string; email: string; password: string; phone: string;
  industry: string; size: string; website: string; hq: string;
  description: string; gstNumber: string;
}

/* ─── shared token ─── */
const ACCENT = '#38bdf8';
const ACCENT_DIM = 'rgba(56,189,248,0.2)';
const LEFT_BG = 'linear-gradient(160deg, #082f49 0%, #0c4a6e 60%, #082f49 100%)';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem 0.75rem 2.75rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.75)',
  marginBottom: '0.45rem',
};

export default function CompanyRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '', email: '', password: '', phone: '',
    industry: '', size: '', website: '', hq: '',
    description: '', gstNumber: '',
  });
  const router = useRouter();

  const update = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: 'COMPANY' }),
    });
    if (res.ok) { setSuccess(true); setTimeout(() => router.push('/company/login'), 3000); }
    setLoading(false);
  };

  /* ── Success screen ── */
  if (success) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#082f49', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
      <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: ACCENT_DIM, border: `2px solid ${ACCENT}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle size={44} style={{ color: ACCENT }} />
      </div>
      <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff' }}>Company Registered!</h2>
      <p style={{ color: '#bae6fd', maxWidth: '400px', lineHeight: 1.6 }}>
        Your JobAdda.in recruiter account is under review. We'll notify you within <strong style={{ color: '#fff' }}>24 hours</strong>.
      </p>
      <p style={{ fontSize: '0.85rem', color: 'rgba(186,230,253,0.6)' }}>Redirecting to login…</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      {/* ══════════ LEFT PANEL ══════════ */}
      <div className="hide-mobile" style={{ position: 'relative', background: '#082f49', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', padding: '6.5rem 4rem 4rem', overflow: 'hidden' }}>
        {/* blobs */}
        <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '700px', height: '700px', background: `radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 60%)`, borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-20%', width: '600px', height: '600px', background: `radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 60%)`, borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '460px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>
              JobAdda<span style={{ color: ACCENT }}>.in</span>
            </span>
          </div>

          {/* Hero */}
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2', color: '#fff', fontWeight: '800' }}>
            Hire the <br /><span style={{ color: ACCENT }}>Best Talent Faster</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#bae6fd', lineHeight: '1.6', marginBottom: '3rem' }}>
            Access our database of over 500,000 verified professionals and streamline your hiring process.
          </p>

          {/* Feature card */}
          <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            <div style={{ background: ACCENT_DIM, padding: '0.85rem', borderRadius: '14px', color: ACCENT, flexShrink: 0 }}>
              <Briefcase size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'white', fontWeight: '700' }}>Powerful ATS Integration</h4>
              <p style={{ fontSize: '0.95rem', color: '#bae6fd', margin: 0, lineHeight: '1.6' }}>Manage job postings, track applicants, and schedule interviews all in one place.</p>
            </div>
          </div>
       
           {/* Back to main site */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <a href="/" style={{ color: 'var(--text-3)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              ← Back to main site
            </a>
          </div>

        </div>
      </div>

      {/* ══════════ RIGHT PANEL ══════════ */}
      <div style={{ background: '#0f172a', padding: '3rem 3.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: '460px', width: '100%', margin: '0 auto' }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const active = step >= s.n;
              const current = step === s.n;
              return (
                <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: active ? ACCENT : 'rgba(255,255,255,0.06)', border: `2px solid ${active ? ACCENT : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? '#082f49' : 'rgba(255,255,255,0.4)', boxShadow: current ? `0 0 0 4px ${ACCENT_DIM}` : 'none', transition: 'all 0.3s', fontWeight: '700' }}>
                      {step > s.n ? <CheckCircle size={18} /> : <Icon size={16} strokeWidth={2.5} />}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: active ? '700' : '500', color: active ? '#fff' : 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{s.label}</span>
                  </div>
                  {i < 2 && (
                    <div style={{ flex: 1, height: '2px', background: step > s.n ? ACCENT : 'rgba(255,255,255,0.08)', margin: '0 0.5rem', marginBottom: '1.4rem', transition: 'background 0.4s' }} />
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: ACCENT }}>
                    <Lock size={16} />
                    <span style={{ fontWeight: '700', fontSize: '0.82rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Login Credentials</span>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>Create Your Account</h2>
                  <p style={{ color: 'rgba(186,230,253,0.6)', fontSize: '0.9rem' }}>Set up your login credentials to get started.</p>
                </div>

                {[
                  { key: 'name', label: 'Company Name', placeholder: 'e.g. Infosys Limited', icon: Building2, type: 'text', req: true },
                  { key: 'email', label: 'Official Email Address', placeholder: 'hr@yourcompany.com', icon: Mail, type: 'email', req: true },
                  { key: 'password', label: 'Password', placeholder: 'Min. 8 characters', icon: Lock, type: 'password', req: true },
                  { key: 'phone', label: 'HR Contact Number', placeholder: '+91 98765 43210', icon: Phone, type: 'tel', req: true },
                ].map((f) => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label} {f.req && <span style={{ color: ACCENT }}>*</span>}</label>
                    <div style={{ position: 'relative' }}>
                      <f.icon size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(56,189,248,0.6)', pointerEvents: 'none' }} />
                      <input type={f.type} required={f.req} placeholder={f.placeholder} value={form[f.key as keyof FormState]} onChange={e => update(f.key as keyof FormState, e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                ))}

                <button type="button" onClick={() => setStep(2)} style={{ width: '100%', padding: '0.9rem', background: ACCENT, color: '#082f49', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: ACCENT }}>
                    <Building2 size={16} />
                    <span style={{ fontWeight: '700', fontSize: '0.82rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Company Details</span>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>Tell Us About You</h2>
                  <p style={{ color: 'rgba(186,230,253,0.6)', fontSize: '0.9rem' }}>Help candidates learn about your company.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {[
                    { key: 'industry', label: 'Industry', icon: Briefcase, type: 'select', req: true },
                    { key: 'size', label: 'Company Size', icon: Users, type: 'select-size', req: false },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={labelStyle}>{f.label} {f.req && <span style={{ color: ACCENT }}>*</span>}</label>
                      <div style={{ position: 'relative' }}>
                        <f.icon size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(56,189,248,0.6)', pointerEvents: 'none', zIndex: 1 }} />
                        <select
                          required={f.req}
                          value={form[f.key as keyof FormState]}
                          onChange={e => update(f.key as keyof FormState, e.target.value)}
                          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                        >
                          <option value="">{f.key === 'industry' ? 'Select Industry' : 'Select Size'}</option>
                          {f.key === 'industry'
                            ? INDUSTRIES.map(i => <option key={i} style={{ background: '#0f172a' }}>{i}</option>)
                            : SIZES.map(s => <option key={s} style={{ background: '#0f172a' }}>{s} employees</option>)
                          }
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {[
                    { key: 'website', label: 'Website', placeholder: 'https://company.com', icon: Globe, type: 'url' },
                    { key: 'hq', label: 'Headquarters', placeholder: 'Bangalore, India', icon: MapPin, type: 'text' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={labelStyle}>{f.label}</label>
                      <div style={{ position: 'relative' }}>
                        <f.icon size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(56,189,248,0.6)', pointerEvents: 'none' }} />
                        <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof FormState]} onChange={e => update(f.key as keyof FormState, e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label style={labelStyle}><FileText size={12} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />Company Description</label>
                  <textarea
                    rows={3}
                    placeholder="Tell candidates about your company culture, mission, and why it's a great place to work…"
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                    style={{ ...inputStyle, paddingLeft: '1rem', resize: 'vertical', height: 'auto', lineHeight: 1.6 }}
                  />
                </div>

                <div>
                  <label style={labelStyle}><Hash size={12} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />GST Number <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>(optional)</span></label>
                  <input placeholder="22AAAAA0000A1Z5" value={form.gstNumber} onChange={e => update('gstNumber', e.target.value)} style={{ ...inputStyle, paddingLeft: '1rem' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                  <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '0.9rem', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} style={{ flex: 2, padding: '0.9rem', background: ACCENT, color: '#082f49', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    Review <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: ACCENT }}>
                    <CheckCircle size={16} />
                    <span style={{ fontWeight: '700', fontSize: '0.82rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Final Step</span>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>Review & Submit</h2>
                  <p style={{ color: 'rgba(186,230,253,0.6)', fontSize: '0.9rem' }}>Double-check your details before submitting.</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                  {[
                    { label: 'Company', val: form.name, icon: Building2 },
                    { label: 'Email', val: form.email, icon: Mail },
                    { label: 'Phone', val: form.phone || '—', icon: Phone },
                    { label: 'Industry', val: form.industry || '—', icon: Briefcase },
                    { label: 'Size', val: form.size ? `${form.size} employees` : '—', icon: Users },
                    { label: 'HQ', val: form.hq || '—', icon: MapPin },
                    { label: 'Website', val: form.website || '—', icon: Globe },
                  ].map((r, i, arr) => (
                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: ACCENT_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, flexShrink: 0 }}>
                        <r.icon size={14} strokeWidth={2.5} />
                      </div>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', width: '80px', flexShrink: 0 }}>{r.label}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '1rem 1.25rem', background: 'rgba(56,189,248,0.06)', borderRadius: '14px', border: '1px solid rgba(56,189,248,0.15)', fontSize: '0.85rem', color: '#bae6fd', lineHeight: 1.6, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ marginTop: '0.05rem' }}>ℹ️</span>
                  <span>Your account will be reviewed by the JobAdda.in team within <strong style={{ color: '#fff' }}>24 hours</strong>. You'll be notified via email once approved.</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '0.9rem', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>
                    Back
                  </button>
                  <button type="submit" disabled={loading} style={{ flex: 2, padding: '0.9rem', background: ACCENT, color: '#082f49', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {loading ? 'Submitting…' : <><span> Submit & Register</span></>}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.88rem', color: 'rgba(186,230,253,0.5)' }}>
            Already have an account?{' '}
            <a href="/company/login" style={{ color: '#7dd3fc', fontWeight: '700', textDecoration: 'none' }}>
              Sign in to Company Portal →
            </a>
          </p>
        </div>
      </div>

      {/* Mobile fallback */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
