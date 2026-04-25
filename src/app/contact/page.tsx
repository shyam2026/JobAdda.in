'use client';
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '5rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="section-title">
          <h1>Contact <span className="text-gradient">Us</span></h1>
          <p>Have a question or feedback? We'd love to hear from you.</p>
        </div>
        <div className="grid-2" style={{ gap: '3rem' }}>
          <div>
            {[
              { icon: Mail, label: 'Email', val: 'support@jobadda.in' },
              { icon: Phone, label: 'Phone', val: '+91 9800000000' },
              { icon: MapPin, label: 'Address', val: 'Bengaluru, Karnataka, India' },
            ].map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', flexShrink: 0 }}>
                  <c.icon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>{c.label}</div>
                  <div style={{ fontWeight: '600' }}>{c.val}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card card-p">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3>Message Sent!</h3>
                <p style={{ color: 'var(--text-3)' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="label">Name</label>
                  <input className="input" placeholder="Your name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="label">Email</label>
                  <input className="input" type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="label">Subject</label>
                  <input className="input" placeholder="How can we help?" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="label">Message</label>
                  <textarea className="input" placeholder="Your message..." required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ minHeight: '120px', resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', gap: '0.5rem' }}>
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
