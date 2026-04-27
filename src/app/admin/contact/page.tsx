import React from 'react';
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { Mail, Phone, Clock, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminContactMessages() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2.5rem 1.5rem' }}>
      <div className="container">
        
        <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Contact <span className="text-gradient">Messages</span></h1>
            <p style={{ color: 'var(--text-2)' }}>Manage and view inquiries submitted through the contact form.</p>
          </div>
          <div className="badge badge-primary">
            {messages.length} Total Messages
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="card card-p-lg" style={{ textAlign: 'center', opacity: 0.8 }}>
            <MessageSquare size={48} style={{ color: 'var(--text-3)', margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Messages Yet</h3>
            <p style={{ color: 'var(--text-3)' }}>You haven't received any contact form submissions.</p>
          </div>
        ) : (
          <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'stretch' }}>
            {messages.map((msg: any) => (
              <div key={msg.id} className="card card-p" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{msg.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={14} /> {msg.email}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={14} /> {msg.contact}</span>
                    </div>
                  </div>
                  <div className="badge badge-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={12} /> {format(new Date(msg.createdAt), 'MMM dd, yyyy')}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '4px', height: '16px', background: 'var(--primary)', borderRadius: '4px' }}></span>
                    {msg.subject}
                  </h4>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    padding: '1rem', 
                    borderRadius: 'var(--radius)', 
                    color: 'var(--text-2)',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.message}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                  <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`} className="btn btn-outline btn-sm" style={{ gap: '0.5rem' }}>
                    <Mail size={14} /> Reply via Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}
