'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      setSuccess(true);
      setFormData({ name: '', email: '', contact: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ padding: '6rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div className="section-title" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>Get in Touch</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>Contact <span className="text-gradient">Our Team</span></h1>
          <p style={{ color: 'var(--text-2)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Have a question, feedback, or need support? We&apos;re here to help. Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        <div className="grid-3" style={{ maxWidth: '1000px', margin: '0 auto 4rem', gap: '1.5rem' }}>
          {/* Contact Details - One Row */}
          <div className="card card-p" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), transparent)', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Mail size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Email Us</h3>
            <a href="mailto:info@jobadda.in" style={{ color: 'var(--primary-light)', fontWeight: '600', fontSize: '1.05rem' }}>info@jobadda.in</a>
          </div>

          <div className="card card-p" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.05), transparent)', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236,72,153,0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Phone size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Call Us</h3>
            <a href="tel:+917042478224" style={{ color: 'var(--text)', fontWeight: '600', fontSize: '1.05rem' }}>+91 7042478224</a>
          </div>

          <div className="card card-p" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.05), transparent)', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Office Address</h3>
            <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', margin: 0 }}>Noida, UP, India</p>
          </div>
        </div>

        {/* Contact Form - Full width below */}
        <div className="card card-p-lg" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem', textAlign: 'center' }}>Send a Message</h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="grid-2" style={{ gap: '1.5rem' }}>
              <div className="input-group">
                <label className="label">Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="John Doe" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="label">Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="john@example.com" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1.5rem' }}>
              <div className="input-group">
                <label className="label">Contact Number *</label>
                <input 
                  type="tel" 
                  name="contact" 
                  placeholder="+91 XXXXX XXXXX" 
                  required 
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="label">Subject *</label>
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="How can we help?" 
                  required 
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="label">Message *</label>
              <textarea 
                name="message" 
                placeholder="Tell us more about your inquiry..." 
                required 
                value={formData.message}
                onChange={handleChange}
                style={{ minHeight: '180px' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              disabled={loading}
              style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
            >
              {loading ? (
                <><Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
              ) : (
                <><Send size={18} /> Send Message</>
              )}
            </button>

            {success && (
              <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeUp 0.3s ease' }}>
                <CheckCircle2 size={20} />
                <span style={{ fontWeight: '500' }}>Your message has been sent successfully! We&apos;ll be in touch soon.</span>
              </div>
            )}

            {error && (
              <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', color: 'var(--danger)', animation: 'fadeUp 0.3s ease' }}>
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
