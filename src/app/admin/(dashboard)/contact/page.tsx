'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, MessageSquare, Trash2, Loader2, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { format } from "date-fns";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/contact-messages');
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setFeedback({ type: 'error', msg: "Failed to load messages." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;

    setDeletingId(idToDelete);
    setShowConfirmModal(false);
    
    try {
      const res = await fetch(`/api/admin/contact/${idToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      
      setMessages(prev => prev.filter(m => m.id !== idToDelete));
      setFeedback({ type: 'success', msg: "Message deleted successfully." });
      setTimeout(() => setFeedback({ type: '', msg: '' }), 3000);
    } catch (err) {
      alert("Error deleting message. Please try again.");
    } finally {
      setDeletingId(null);
      setIdToDelete(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-3)' }}>
        <Loader2 size={32} className="spin" style={{ animation: 'spin 1.5s linear infinite' }} />
        <span style={{ marginLeft: '1rem', fontSize: '1.1rem' }}>Loading Messages...</span>
      </div>
    );
  }

  return (
    <div className="admin-page" style={{ padding: '1rem 0' }}>
      
      <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Contact <span className="text-gradient">Inquiries</span></h1>
          <p style={{ color: 'var(--text-2)' }}>View and manage feedback submitted by users.</p>
        </div>
        <div className="badge badge-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          {messages.length} Submissions
        </div>
      </div>

      {feedback.msg && (
        <div style={{ 
          marginBottom: '1.5rem', 
          padding: '1rem', 
          borderRadius: 'var(--radius)', 
          background: feedback.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${feedback.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
          color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
          {feedback.msg}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="card card-p-lg" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <MessageSquare size={48} style={{ color: 'var(--text-3)', margin: '0 auto 1.5rem', opacity: 0.3 }} />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-2)' }}>No Messages Found</h3>
          <p style={{ color: 'var(--text-3)' }}>There are currently no inquiries in the database.</p>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {messages.map((msg) => (
            <div key={msg.id} className="card card-p" style={{ position: 'relative', border: '1px solid var(--border)', transition: 'var(--transition)' }}>
              
              {/* Delete Action */}
              <button 
                onClick={() => handleDeleteClick(msg.id)}
                disabled={deletingId === msg.id}
                style={{ 
                  position: 'absolute', 
                  top: '1rem', 
                  right: '1rem', 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--danger)', 
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="btn-icon-hover"
                title="Delete Message"
              >
                {deletingId === msg.id ? (
                  <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>

              <div style={{ marginBottom: '1.25rem', paddingRight: '2.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text)' }}>{msg.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={14} /> {msg.email}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={14} /> {msg.contact}</span>
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '3px', height: '14px', background: 'var(--success)', borderRadius: '2px' }} />
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-2)' }}>{msg.subject}</span>
                </div>
                <p style={{ 
                  fontSize: '0.92rem', 
                  color: 'var(--text-3)', 
                  lineHeight: '1.6', 
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.message}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} /> Received {format(new Date(msg.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '90%', padding: '2rem', textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: 'rgba(239,68,68,0.1)', 
              color: 'var(--danger)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1.5rem' 
            }}>
              <Trash2 size={32} />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Are you sure?</h3>
            <p style={{ color: 'var(--text-3)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Do you really want to delete this message? This process cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, justifyContent: 'center', background: 'var(--danger)' }}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .btn-icon-hover:hover { background: rgba(239, 68, 68, 0.1) !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
