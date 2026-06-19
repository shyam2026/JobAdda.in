'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Loader2, MessageSquare, Check, CheckCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function ChatContent() {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultConversationId = searchParams.get('c');

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isPremium, setIsPremium] = useState(user?.isPremium || false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mobileViewList = !activeConv;

  // Real-time premium check
  useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }
    if (status !== 'authenticated') return;
    fetch('/api/profile').then(r => r.json()).then(data => {
      if (data && !data.error) {
        setIsPremium(data.isPremium);
        if (!data.isPremium) {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });
  }, [user?.id, status]);

  // Poll Conversations
  useEffect(() => {
    if (!isPremium) return;
    
    const fetchConvs = async () => {
      try {
        const res = await fetch('/api/chat/conversations');
        const data = await res.json();
        if (Array.isArray(data)) {
          setConversations(data);
          
          if (defaultConversationId && !activeConv) {
            const found = data.find(c => c.id === defaultConversationId);
            if (found) setActiveConv(found);
          }
        }
      } catch (e) {
        console.error('Failed to fetch conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConvs();
    const interval = setInterval(fetchConvs, 5000);
    return () => clearInterval(interval);
  }, [isPremium, defaultConversationId, activeConv]);

  // Poll Messages
  useEffect(() => {
    if (!activeConv) return;
    
    const scrollToBottom = () => {
      const container = document.getElementById('chat-scroll-container');
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    };

    const fetchMsgs = async () => {
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${activeConv.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(prev => {
            if (prev.length !== data.length) {
              setTimeout(scrollToBottom, 100);
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

    const scrollToBottom = () => {
      const container = document.getElementById('chat-scroll-container');
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    };

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConv.id, content })
      });
      const data = await res.json();
      if (data.id) {
        setMessages(prev => [...prev, data]);
        setTimeout(scrollToBottom, 100);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTimeList = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear();
    if (isYesterday) return 'Yesterday';
    
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  if (status === 'loading' || loading) {
    return <div className="flex-center" style={{ height: '60vh' }}><Loader2 size={32} className="spin" color="var(--primary)" /></div>;
  }

  if (!isPremium) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', textAlign: 'center' }}>
        <MessageSquare size={48} color="var(--text-3)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h2>Premium Feature</h2>
        <p style={{ color: 'var(--text-3)', marginBottom: '1.5rem', maxWidth: '400px' }}>Direct messaging with HR is reserved for Premium users.</p>
        <button className="btn btn-primary" onClick={() => router.push('/user/premium')}>Upgrade to Premium</button>
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 120px)', minHeight: '500px', display: 'flex', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
      
      {/* LEFT PANE - CONVERSATIONS */}
      <div className={`chat-sidebar ${mobileViewList ? 'active' : ''}`} style={{ width: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Messages</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(99,102,241,0.05)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
                <MessageSquare size={32} />
              </div>
              <h4 style={{ margin: 0 }}>No Conversations</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', lineHeight: 1.5 }}>
                Apply to jobs and click the <strong>&quot;Chat with HR&quot;</strong> button to start a direct message!
              </p>
              <button className="btn btn-sm btn-outline" onClick={() => router.push('/user/applied-jobs')}>View Applied Jobs</button>
            </div>
          ) : (
            conversations.map(conv => {
              const isActive = activeConv?.id === conv.id;
              const lastMsg = conv.messages?.[0];
              const isUnread = lastMsg && !lastMsg.isRead && lastMsg.senderId !== user.id;

              const timestamp = lastMsg ? lastMsg.createdAt : conv.updatedAt;

              return (
                <div 
                  key={conv.id} 
                  onClick={() => setActiveConv(conv)}
                  style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent', transition: 'background 0.2s' }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {conv.company.logo ? <img src={conv.company.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : conv.company.companyName[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.company.companyName}</h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', flexShrink: 0, marginLeft: '0.5rem' }}>
                          {formatDateTimeList(timestamp)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: isUnread ? 'var(--text)' : 'var(--text-3)', fontWeight: isUnread ? 700 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.2rem' }}>
                        {lastMsg ? lastMsg.content : `Regarding: ${conv.job?.title || 'Application'}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANE - MESSAGES */}
      <div className={`chat-main ${!mobileViewList ? 'active' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0b141a', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        {activeConv ? (
          <>
            {/* Header */}
            <div style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#202c33', color: '#e9edef', zIndex: 10 }}>
              <button className="back-btn" onClick={() => setActiveConv(null)} style={{ background: 'none', border: 'none', color: '#aebac1', cursor: 'pointer', padding: '0.5rem', display: 'none' }}>
                <ArrowLeft size={20} />
              </button>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#111b21', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {activeConv.company.logo ? <img src={activeConv.company.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : activeConv.company.companyName[0].toUpperCase()}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeConv.company.companyName}</h3>
                {activeConv.job && <div style={{ fontSize: '0.8rem', color: '#8696a0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Regarding: {activeConv.job.title}</div>}
              </div>
            </div>

            {/* Message List */}
            <div id="chat-scroll-container" style={{ flex: 1, overflowY: 'auto', padding: '2rem 5%', display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundImage: 'linear-gradient(rgba(11, 20, 26, 0.8), rgba(11, 20, 26, 0.9)), url("/ai_chat_bg.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              {messages.length === 0 ? (
                <div className="flex-center" style={{ height: '100%', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ background: '#182229', padding: '0.5rem 1rem', borderRadius: '8px', color: '#ffd166', fontSize: '0.8rem', textAlign: 'center', maxWidth: '80%', boxShadow: '0 1px 0.5px rgba(11,20,26,0.2)' }}>
                    Messages are end-to-end encrypted. No one outside of this chat, not even JobAdda, can read or listen to them.
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderType === 'STUDENT';
                  return (
                    <div key={`${msg.id}-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{ 
                        maxWidth: '85%', 
                        padding: '0.4rem 0.6rem 0.4rem 0.8rem', 
                        borderRadius: isMe ? '8px 0px 8px 8px' : '0px 8px 8px 8px',
                        background: isMe ? '#005c4b' : '#202c33',
                        color: '#e9edef',
                        lineHeight: 1.4,
                        fontSize: '0.95rem',
                        boxShadow: '0 1px 0.5px rgba(11,20,26,0.2)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                        gap: '0.5rem',
                        position: 'relative'
                      }}>
                        <div style={{ paddingBottom: '0.2rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', marginTop: 'auto', marginLeft: 'auto', paddingBottom: '0.1rem', float: 'right' }}>
                          {formatTime(msg.createdAt)}
                          {isMe && (
                            msg.isRead ? <CheckCheck size={14} color="#38bdf8" /> : <Check size={14} color="rgba(255,255,255,0.6)" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} style={{ padding: '0.75rem 1rem', background: '#202c33', display: 'flex', gap: '0.75rem', alignItems: 'center', zIndex: 10 }}>
              <input
                type="text"
                placeholder="Type a message"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                style={{ flex: 1, padding: '0.8rem 1.25rem', borderRadius: '24px', border: 'none', background: '#2a3942', color: '#d1d7db', outline: 'none', fontSize: '0.95rem' }}
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim() || sending}
                style={{ width: '48px', height: '48px', borderRadius: '50%', background: newMessage.trim() ? '#00a884' : '#2a3942', color: newMessage.trim() ? '#111b21' : '#8696a0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() && !sending ? 'pointer' : 'default', transition: 'background 0.2s', flexShrink: 0 }}
              >
                {sending ? <Loader2 size={20} className="spin" /> : <Send size={20} style={{ marginLeft: newMessage.trim() ? '2px' : '0' }} />}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-center" style={{ height: '100%', color: '#8696a0', flexDirection: 'column', gap: '1.5rem', background: '#202c33', borderBottom: '6px solid #00a884' }}>
            <MessageSquare size={64} opacity={0.2} />
            <h2 style={{ color: '#e9edef', margin: 0, fontWeight: 300, fontSize: '2rem' }}>JobAdda Web</h2>
            <p style={{ maxWidth: '400px', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>Select an active application to start direct end-to-end messaging with HR. Messages are encrypted and stored securely.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .chat-sidebar, .chat-main { display: none !important; width: 100% !important; }
          .chat-sidebar.active, .chat-main.active { display: flex !important; }
          .back-btn { display: flex !important; }
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function UserChatPage() {
  return (
    <React.Suspense fallback={<div className="flex-center" style={{ height: '60vh' }}><Loader2 size={32} className="spin" color="var(--primary)" /></div>}>
      <ChatContent />
    </React.Suspense>
  );
}
