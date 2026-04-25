'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Globe, Users, MapPin, ArrowRight, CheckCircle } from 'lucide-react'

const INDUSTRIES = ['Information Technology', 'E-Commerce', 'Finance & Banking', 'Healthcare', 'Education', 'Manufacturing', 'Media & Entertainment', 'FMCG', 'Retail', 'Real Estate', 'Other']
const SIZES = ['1-10', '11-50', '51-200', '201-500', '500-1000', '1000+']

export default function CompanyRegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    industry: '', size: '', website: '', hq: '',
    description: '', gstNumber: '',
  })
  const router = useRouter()

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: 'COMPANY' }),
    })
    if (res.ok) { setSuccess(true); setTimeout(() => router.push('/login'), 3000) }
    setLoading(false)
  }

  if (success) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle size={40} style={{ color: 'var(--success)' }} />
      </div>
      <h2>Company Registered!</h2>
      <p>Your JobAdda.in recruiter account is under review. We'll notify you within 24 hours.</p>
      <p style={{ fontSize: '0.85rem' }}>Redirecting to login...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', fontSize: '1.2rem' }}>J</div>
            <span style={{ fontSize: '1.4rem', fontWeight: '800' }}>JobAdda<span style={{ color: 'var(--primary-light)' }}>.in</span></span>
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Register Your Company</h2>
          <p>Start hiring the best talent from across India</p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '3rem' }}>
          {[{ n: 1, label: 'Account' }, { n: 2, label: 'Company Info' }, { n: 3, label: 'Review' }].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: step >= s.n ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--surface)', border: `2px solid ${step >= s.n ? 'transparent' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem', color: step >= s.n ? 'white' : 'var(--text-3)' }}>
                  {step > s.n ? <CheckCircle size={18} /> : s.n}
                </div>
                <span style={{ fontSize: '0.75rem', color: step >= s.n ? 'var(--text)' : 'var(--text-3)', fontWeight: step >= s.n ? '600' : '400' }}>{s.label}</span>
              </div>
              {i < 2 && <div style={{ width: '80px', height: '2px', background: step > s.n ? 'var(--primary)' : 'var(--border)', margin: '0 0.5rem', marginBottom: '1.25rem' }} />}
            </div>
          ))}
        </div>

        <div className="card card-p">
          <form onSubmit={handleSubmit}>
            {/* STEP 1 */}
            {step === 1 && (
              <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Login Credentials</h3>
                <div className="input-group">
                  <label className="label">Company Name *</label>
                  <input required placeholder="e.g. Infosys Limited" value={form.name} onChange={e => update('name', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="label">Official Email Address *</label>
                  <input type="email" required placeholder="hr@yourcompany.com" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="label">Password *</label>
                  <input type="password" required placeholder="Min. 8 characters" value={form.password} onChange={e => update('password', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="label">HR Contact Number *</label>
                  <input type="tel" required placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
                <button type="button" onClick={() => setStep(2)} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Company Details</h3>
                <div className="grid-2">
                  <div className="input-group">
                    <label className="label">Industry *</label>
                    <select required value={form.industry} onChange={e => update('industry', e.target.value)}>
                      <option value="">Select Industry</option>
                      {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="label">Company Size</label>
                    <select value={form.size} onChange={e => update('size', e.target.value)}>
                      <option value="">Select Size</option>
                      {SIZES.map(s => <option key={s}>{s} employees</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="input-group">
                    <label className="label">Website</label>
                    <input type="url" placeholder="https://company.com" value={form.website} onChange={e => update('website', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="label">Headquarters</label>
                    <input placeholder="Bangalore, India" value={form.hq} onChange={e => update('hq', e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label className="label">Company Description</label>
                  <textarea placeholder="Tell candidates about your company, culture, and what makes it a great place to work..." value={form.description} onChange={e => update('description', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="label">GST Number <span style={{ color: 'var(--text-3)', fontWeight: '400' }}>(for invoice purposes)</span></label>
                  <input placeholder="22AAAAA0000A1Z5" value={form.gstNumber} onChange={e => update('gstNumber', e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Back</button>
                  <button type="button" onClick={() => setStep(3)} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Review <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3>Review & Submit</h3>
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius)', padding: '1.5rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { label: 'Company', val: form.name },
                    { label: 'Email', val: form.email },
                    { label: 'Industry', val: form.industry || 'Not set' },
                    { label: 'Size', val: form.size || 'Not set' },
                    { label: 'HQ', val: form.hq || 'Not set' },
                    { label: 'Website', val: form.website || 'Not set' },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-3)' }}>{r.label}</span>
                      <span style={{ fontWeight: '600' }}>{r.val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.06)', borderRadius: 'var(--radius)', border: '1px solid rgba(99,102,241,0.15)', fontSize: '0.85rem', color: 'var(--text-2)' }}>
                  ℹ️ Your account will be reviewed by the JobAdda.in team within 24 hours. You'll be notified via email once approved.
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setStep(2)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Back</button>
                  <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ flex: 2, justifyContent: 'center' }}>
                    {loading ? 'Submitting...' : '🚀 Submit & Register'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-3)' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--primary-light)', fontWeight: '600' }}>Login here</a>
        </p>
      </div>
    </div>
  )
}
