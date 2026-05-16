'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Loader2, MessageSquare, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function CompanyChatPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mobileViewList = !activeConv;

  // Poll Conversations list every 5s
  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const res = await fetch('/api/chat/conversations');
        const data = await res.json();
        if (Array.isArray(data)) setConversations(data);
      } catch (e) {
        console.error('Failed to fetch conversations');
      } finally {
        setLoading(false);
      }
    };
    fetchConvs();
    const interval = setInterval(fetchConvs, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll messages in active conversation every 3s
  useEffect(() => {
    if (!activeConv) return;
    const fetchMsgs = async () => {
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${activeConv.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(prev => {
            if (prev.length !== data.length) {
              setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }
            return data;
          });
        }
      } catch (e) {
        console.error('Failed to fetch messages');
      }
    };
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 3000);
    return () => clearInterval(interval);
  }, [activeConv]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConv.id, content })
      });
      const data = await res.json();
      if (data.id) {
        setMessages(prev => [...prev, data]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (e) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  if (loading) {
    return <div className="flex-center" style={{ height: '60vh' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#818cf8' }} /></div>;
  }

  return (
    <div className="company-page">
      <div style={{ padding: '1.5rem 0 1rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 0.25rem', color: '#f1f5f9' }}>Messages</h1>
        <p style={{ color: '#94a3b8', margin: 0 }}>Direct messages from premium job applicants.</p>
      </div>

      <div style={{ height: 'calc(100vh - 200px)', minHeight: '500px', display: 'flex', background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        
        {/* LEFT PANE - Conversation List */}
        <div className={`chat-sidebar-co ${mobileViewList ? 'active' : ''}`} style={{ width: '320px', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', background: '#172033' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #334155' }}>
            <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '1rem' }}>All Conversations</h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>{conversations.length} active thread{conversations.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
                <MessageSquare size={36} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                <p style={{ margin: 0 }}>No messages yet. When applicants reach out, they'll appear here.</p>
              </div>
            ) : (
              conversations.map(conv => {
                const isActive = activeConv?.id === conv.id;
                const lastMsg = conv.messages?.[0];
                const isUnread = lastMsg && !lastMsg.isRead && lastMsg.senderType === 'STUDENT';
                const studentName = conv.student?.name || 'Applicant';

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConv(conv)}
                    style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e2d40', cursor: 'pointer', background: isActive ? 'rgba(129,140,248,0.1)' : 'transparent', transition: 'background 0.2s' }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '1rem', color: '#818cf8' }}>
                        {studentName[0]?.toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h4 style={{ margin: 0, fontSize: '0.9rem', color: isUnread ? '#f1f5f9' : '#cbd5e1', fontWeight: isUnread ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {studentName}
                          </h4>
                          {lastMsg && <span style={{ fontSize: '0.65rem', color: '#64748b', flexShrink: 0, marginLeft: '0.5rem' }}>{formatDate(lastMsg.createdAt)}</span>}
                        </div>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: isUnread ? '#94a3b8' : '#64748b', fontWeight: isUnread ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {lastMsg ? lastMsg.content : `Re: ${conv.job?.title || 'Application'}`}
                        </p>
                        {conv.job && <p style={{ margin: '0.2rem 0 0', fontSize: '0.7rem', color: '#818cf8', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.job.title}</p>}
                      </div>
                      {isUnread && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8', flexShrink: 0 }} />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANE - Messages */}
        <div className={`chat-main-co ${!mobileViewList ? 'active' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
          {activeConv ? (
            <>
              {/* Header */}
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '1rem', background: '#1e293b' }}>
                <button className="back-btn-co" onClick={() => setActiveConv(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem', display: 'none', borderRadius: '8px' }}>
                  <ArrowLeft size={20} />
                </button>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', color: '#818cf8' }}>
                  {(activeConv.student?.name || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#f1f5f9' }}>{activeConv.student?.name || 'Applicant'}</h3>
                  {activeConv.job && <p style={{ margin: 0, fontSize: '0.78rem', color: '#818cf8' }}>Applied for: {activeConv.job.title}</p>}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 ? (
                  <div className="flex-center" style={{ height: '100%', color: '#64748b', flexDirection: 'column', gap: '0.5rem' }}>
                    <MessageSquare size={36} opacity={0.4} />
                    <span>No messages yet. Reply to start the conversation.</span>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.senderType === 'COMPANY';
                    return (
                      <div key={msg.id || idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                        {!isMe && (
                          <span style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>
                            {activeConv.student?.name || 'Applicant'}
                          </span>
                        )}
                        <div style={{
                          maxWidth: '70%',
                          padding: '0.75rem 1.1rem',
                          borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: isMe ? '#6366f1' : '#1e293b',
                          color: '#f1f5f9',
                          border: isMe ? 'none' : '1px solid #334155',
                          lineHeight: 1.5,
                          fontSize: '0.9rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}>
                          {msg.content}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.25rem' }}>
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.25rem', borderTop: '1px solid #334155', background: '#1e293b', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Reply to applicant..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  style={{ flex: 1, padding: '0.8rem 1.1rem', borderRadius: '24px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', outline: 'none', fontSize: '0.9rem' }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  style={{ width: '46px', height: '46px', borderRadius: '50%', background: newMessage.trim() && !sending ? '#6366f1' : '#334155', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() && !sending ? 'pointer' : 'not-allowed', transition: 'background 0.2s', flexShrink: 0 }}
                >
                  {sending ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={20} style={{ marginLeft: '2px' }} />}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: '#64748b', gap: '1rem' }}>
              <MessageSquare size={56} opacity={0.2} />
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Select a Conversation</h2>
                <p style={{ margin: 0 }}>Choose an applicant from the list to view their messages.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .chat-sidebar-co, .chat-main-co { display: none !important; width: 100% !important; }
          .chat-sidebar-co.active, .chat-main-co.active { display: flex !important; }
          .back-btn-co { display: flex !important; }
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
