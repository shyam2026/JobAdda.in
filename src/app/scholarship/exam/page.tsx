'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Lock, Phone, Key, Award, AlertCircle, CheckCircle, 
  ChevronLeft, ChevronRight, RefreshCw, Send, BookOpen, 
  CheckCircle2, Clock, AlertTriangle, FileText, User,
  Camera, Shield
} from 'lucide-react';
import ProctorManager from '@/components/ProctorManager';

import { EXAM_START_TIME, EXAM_END_TIME } from '@/lib/scholarship-schedule';
import Link from 'next/link';

interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
}

export default function ScholarshipExamPage() {
  // Step flow: 'verify' | 'rules' | 'exam' | 'submitted'
  const [step, setStep] = useState<'verify' | 'rules' | 'exam' | 'submitted'>('verify');
  
  // Verification states
  const [registrationNo, setRegistrationNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Student Context
  const [studentName, setStudentName] = useState('');
  
  // Exam states
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(150 * 60); // 150 minutes in seconds
  const [rulesChecked, setRulesChecked] = useState(false);
  
  // Submit modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Mobile palette drawer
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  
  // Results summary
  const [attemptedCount, setAttemptedCount] = useState(0);
  const [unattemptedCount, setUnattemptedCount] = useState(0);
  
  // Ref for auto-submit safety
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Local testing & time gating state
  const [isLocalHost, setIsLocalHost] = useState(false);
  const [examStatus, setExamStatus] = useState<'BEFORE' | 'ACTIVE' | 'AFTER'>('ACTIVE');

  // Check localhost & exam window schedule
  useEffect(() => {
    const checkSchedule = () => {
      let isLocal = false;
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          isLocal = true;
          setIsLocalHost(true);
        }
      }
      const now = Date.now();
      if (now < EXAM_START_TIME && !isLocal) {
        setExamStatus('BEFORE');
      } else if (now > EXAM_END_TIME && !isLocal) {
        setExamStatus('AFTER');
      } else {
        setExamStatus('ACTIVE');
      }
    };
    checkSchedule();
    const interval = setInterval(checkSchedule, 15000);
    return () => clearInterval(interval);
  }, []);

  // Restore state from localStorage if starting/active
  useEffect(() => {
    const savedReg = localStorage.getItem('jobadda_exam_reg');
    const savedMobile = localStorage.getItem('jobadda_exam_mobile');
    const savedStep = localStorage.getItem('jobadda_exam_step');
    const savedAnswers = localStorage.getItem('jobadda_exam_answers');
    
    if (savedReg && savedMobile && savedStep === 'exam') {
      setRegistrationNo(savedReg);
      setMobile(savedMobile);
      
      // Load questions
      fetchQuestions(savedReg, savedMobile).then((success) => {
        if (success) {
          setStep('exam');
          
          // Load answers
          if (savedAnswers) {
            try {
              setAnswers(JSON.parse(savedAnswers));
            } catch (e) {
              console.error(e);
            }
          }
          
          // Load timer
          const savedStartTime = localStorage.getItem('jobadda_exam_start_time');
          if (savedStartTime) {
            const elapsed = Math.floor((Date.now() - Number(savedStartTime)) / 1000);
            const remaining = Math.max(0, (150 * 60) - elapsed);
            setTimeLeft(remaining);
            if (remaining <= 0) {
              // Time over while reload, auto submit
              handleAutoSubmit(savedReg, savedMobile, JSON.parse(savedAnswers || '{}'));
            }
          }
        }
      });
    }
  }, []);

  // Timer Countdown logic
  useEffect(() => {
    if (step === 'exam') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            // Trigger auto submit
            handleAutoSubmit(registrationNo, mobile, answers);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, answers, registrationNo, mobile]);

  // Save answers to localStorage on change
  useEffect(() => {
    if (step === 'exam') {
      localStorage.setItem('jobadda_exam_answers', JSON.stringify(answers));
    }
  }, [answers, step]);

  const fetchQuestions = async (reg: string, mob: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/scholarship/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNo: reg, mobile: mob })
      });
      const data = await res.json();
      if (res.ok && data.questions) {
        setQuestions(data.questions);
        return true;
      } else {
        setError(data.error || 'Failed to load questions.');
        return false;
      }
    } catch (e) {
      setError('Connection error. Please try again.');
      return false;
    }
  };

  const triggerDeviceFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    const el = document.documentElement as any;
    if (!el) return;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.webkitRequestIsFullScreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    if (req) {
      try {
        const p = req.call(el);
        if (p && typeof p.then === 'function') {
          p.catch(() => {});
        }
      } catch (e) {}
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/scholarship/exam/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNo, mobile, action: 'send' })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setSuccessMsg(data.message || 'OTP sent successfully. Check your registered mobile and email.');
      } else {
        setError(data.error || 'Verification failed.');
      }
    } catch (err) {
      setError('Server connection failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    // Request fullscreen on user gesture (submitting OTP)
    triggerDeviceFullscreen();

    try {
      const res = await fetch('/api/scholarship/exam/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNo, mobile, action: 'verify', otp })
      });
      const data = await res.json();
      if (res.ok) {
        // Fetch candidate details for rules screen
        const detailRes = await fetch(`/api/scholarship/register?lookup=${registrationNo}`);
        const detailData = await detailRes.json();
        if (detailRes.ok) {
          setStudentName(detailData.name);
        }
        setStep('rules');
        setTimeout(() => triggerDeviceFullscreen(), 100);
      } else {
        setError(data.error || 'Invalid OTP.');
      }
    } catch (err) {
      setError('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async () => {
    if (!rulesChecked) return;
    setError('');
    setLoading(true);

    // Request fullscreen on user gesture (clicking Start Exam)
    triggerDeviceFullscreen();

    const success = await fetchQuestions(registrationNo, mobile);
    if (success) {
      setStep('exam');
      // Set timer markers
      const startTime = Date.now();
      localStorage.setItem('jobadda_exam_start_time', startTime.toString());
      localStorage.setItem('jobadda_exam_reg', registrationNo);
      localStorage.setItem('jobadda_exam_mobile', mobile);
      localStorage.setItem('jobadda_exam_step', 'exam');
      setTimeLeft(150 * 60);
      setTimeout(() => triggerDeviceFullscreen(), 100);
    }
    setLoading(false);
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId.toString()]: optionIndex
    }));
  };

  const handleClearResponse = (questionId: number) => {
    setAnswers(prev => {
      const updated = { ...prev };
      delete updated[questionId.toString()];
      return updated;
    });
  };

  const handleAutoSubmit = async (reg: string, mob: string, currentAnswers: Record<string, number>) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setLoading(true);
    try {
      const res = await fetch('/api/scholarship/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNo: reg, mobile: mob, answers: currentAnswers })
      });
      const data = await res.json();
      if (res.ok) {
        setAttemptedCount(data.attempted);
        setUnattemptedCount(150 - data.attempted);
        setStep('submitted');
        clearLocalStorage();
      } else {
        alert('Auto-submit failed: ' + (data.error || 'Server error. Please contact admin.'));
      }
    } catch (e) {
      alert('Critical Error submitting exam automatically. Please do not close this window.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    setShowSubmitModal(false);
    setLoading(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const res = await fetch('/api/scholarship/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNo, mobile, answers })
      });
      const data = await res.json();
      if (res.ok) {
        setAttemptedCount(data.attempted);
        setUnattemptedCount(150 - data.attempted);
        setStep('submitted');
        clearLocalStorage();
      } else {
        setError(data.error || 'Submission failed.');
      }
    } catch (e) {
      setError('Connection error. Failed to submit.');
    } finally {
      setLoading(false);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('jobadda_exam_start_time');
    localStorage.removeItem('jobadda_exam_reg');
    localStorage.removeItem('jobadda_exam_mobile');
    localStorage.removeItem('jobadda_exam_step');
    localStorage.removeItem('jobadda_exam_answers');
  };

  // Proctor auto-submit callback (violation threshold reached)
  const handleProctorAutoSubmit = useCallback(() => {
    handleAutoSubmit(registrationNo, mobile, answers);
  }, [registrationNo, mobile, answers]);

  // Helper formatting for timer
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };



  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-outfit), sans-serif' }}>
      <style>{`
        /* ── Mobile Responsive Styles for Exam Portal ── */
        @media (max-width: 768px) {
          .exam-grid {
            grid-template-columns: 1fr !important;
          }
          .exam-header-inner {
            padding: 0 0.75rem !important;
            height: 56px !important;
          }
          .exam-header-inner > div:last-child {
            gap: 0.5rem !important;
          }
          .exam-candidate-info {
            display: none !important;
          }
          .exam-logo-subtitle {
            display: none !important;
          }
          .exam-logo-title {
            font-size: 1rem !important;
          }
          .exam-question-card {
            min-height: auto !important;
            padding: 1rem !important;
          }
          .exam-palette-card {
            display: none !important;
          }
          .exam-mobile-fab {
            display: flex !important;
          }
          .exam-nav-bar {
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
          }
          .exam-verify-card {
            padding: 1.5rem !important;
          }
          .exam-rules-card {
            padding: 1.25rem !important;
          }
          .exam-option-btn {
            padding: 0.85rem 1rem !important;
          }
          .exam-option-label {
            font-size: 0.88rem !important;
          }
          .exam-option-char {
            width: 26px !important;
            height: 26px !important;
            font-size: 0.78rem !important;
          }
          .exam-submit-btn-header {
            padding: 0.4rem 0.65rem !important;
            font-size: 0.72rem !important;
          }
          .exam-timer-badge {
            padding: 0.3rem 0.6rem !important;
          }
          .exam-timer-badge span {
            font-size: 0.85rem !important;
          }
        }
        @media (max-width: 480px) {
          .exam-header-inner {
            height: 50px !important;
            padding: 0 0.5rem !important;
          }
          .exam-question-card {
            padding: 0.75rem !important;
          }
          .exam-question-text {
            font-size: 1rem !important;
            margin-bottom: 1rem !important;
          }
          .exam-option-btn {
            padding: 0.75rem 0.85rem !important;
            gap: 0.75rem !important;
            border-radius: 10px !important;
          }
          .exam-nav-bar {
            padding-top: 0.75rem !important;
            margin-top: 1rem !important;
          }
        }

        /* Mobile Palette Drawer */
        .exam-mobile-fab {
          display: none;
        }
        .exam-mobile-palette-overlay {
          position: fixed;
          inset: 0;
          z-index: 8000;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .exam-mobile-palette-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }
        .exam-mobile-palette-drawer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 8001;
          background-color: var(--bg-2, #1e1e2e);
          border-top: 1px solid var(--border, rgba(255,255,255,0.1));
          border-radius: 20px 20px 0 0;
          padding: 1.25rem;
          max-height: 65vh;
          overflow-y: auto;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
        }
        .exam-mobile-palette-drawer.active {
          transform: translateY(0);
        }
      `}</style>
      
      {/* DISTRACTION-FREE HEADER */}
      <header className="exam-header-inner" style={{ height: '70px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Award size={24} color="var(--primary)" />
          <div>
            <span className="exam-logo-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>JobAdda.in</span>
            <span className="exam-logo-subtitle" style={{ fontSize: '0.7rem', color: 'var(--primary-light)', fontWeight: 700, textTransform: 'uppercase', display: 'block', letterSpacing: '1px' }}>Scholarship Exam Portal</span>
          </div>
        </div>

        {step === 'exam' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="exam-candidate-info" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Candidate</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{studentName || 'Scholarship Aspirant'}</div>
            </div>
            
            <div className="exam-timer-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: timeLeft < 600 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)', border: `1px solid ${timeLeft < 600 ? 'var(--danger)' : 'var(--primary)'}`, padding: '0.4rem 1rem', borderRadius: '8px', color: timeLeft < 600 ? 'var(--danger)' : 'var(--primary-light)' }}>
              <Clock size={14} />
              <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '1px' }}>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn btn-primary btn-sm exam-submit-btn-header"
              style={{ padding: '0.5rem 1rem' }}
            >
              Submit
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', zIndex: 1, position: 'relative' }}>
        
        {/* STEP 1: VERIFICATION SCREEN */}
        {step === 'verify' && (
          examStatus === 'BEFORE' && !isLocalHost ? (
            <div className="card exam-verify-card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderRadius: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '1px solid rgba(249,115,22,0.25)' }}>
                <Clock size={32} color="#F97316" />
              </div>
              <div>
                <div style={{ display: 'inline-block', padding: '0.35rem 0.9rem', borderRadius: '9999px', backgroundColor: 'rgba(245,158,11,0.1)', color: '#F59E0B', fontWeight: 800, fontSize: '0.78rem', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  🪔 DIWALI SPECIAL: EXAM ON 06TH NOVEMBER 2026
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem' }}>Scholarship Exam Portal</h2>
                <p style={{ color: 'var(--text-3)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                  The Scholarship Examination portal for Diwali Special 2026 will be active on <strong>06th November 2026 from 10:00 AM IST to 10:00 PM IST</strong>.
                </p>
              </div>

              <div style={{ background: 'var(--bg-3)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-2)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                  <Shield size={16} color="var(--primary-light)" />
                  <span>Important Instructions</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-3)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  <li>Keep your Registration ID (JA-XXXXXXXX) ready.</li>
                  <li>Exam window: 10:00 AM to 10:00 PM IST on 06th November 2026.</li>
                  <li>Total duration: 150 Minutes | 150 MCQs.</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                <Link href="/" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.8rem' }}>
                  Go to Homepage
                </Link>
                <Link href="/scholarship" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '0.8rem' }}>
                  Scholarship Page
                </Link>
              </div>
            </div>
          ) : examStatus === 'AFTER' && !isLocalHost ? (
            <div className="card exam-verify-card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderRadius: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '1px solid rgba(239,68,68,0.25)' }}>
                <AlertTriangle size={32} color="#EF4444" />
              </div>
              <div>
                <div style={{ display: 'inline-block', padding: '0.35rem 0.9rem', borderRadius: '9999px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', fontWeight: 800, fontSize: '0.78rem', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  EXAM CONCLUDED
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem' }}>Exam Portal Closed</h2>
                <p style={{ color: 'var(--text-3)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                  The Scholarship Examination portal for 06th November 2026 is now closed. Official results will be declared on 10th November 2026.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                <Link href="/" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}>
                  Go to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <div className="card exam-verify-card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <Lock size={28} color="var(--primary)" />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Access Verification</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>Verify paid registration to start the exam</p>
              </div>

              {error && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--danger)', fontSize: '0.8rem', borderRadius: '8px', display: 'flex', gap: '0.5rem' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--success)', fontSize: '0.8rem', borderRadius: '8px', display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <span>{successMsg}</span>
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="input-group">
                    <span className="label">Registration ID</span>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontWeight: 800 }}>JA-</span>
                      <input
                        type="text"
                        required
                        placeholder="Enter 8-character Code"
                        value={registrationNo.replace('JA-', '')}
                        onChange={(e) => setRegistrationNo(`JA-${e.target.value.toUpperCase().trim()}`)}
                        style={{ paddingLeft: '2.8rem' }}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <span className="label">Registered Mobile Number</span>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="Enter 10-digit number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                  >
                    {loading ? (
                      <RefreshCw className="animate-spin" size={18} />
                    ) : (
                      <>
                        <span>Send OTP Code</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="input-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="label">Enter OTP Code</span>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Change Details
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Key size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="6-digit verification code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        style={{ paddingLeft: '2.5rem', letterSpacing: '4px', textAlign: 'center', fontWeight: 'bold' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                  >
                    {loading ? (
                      <RefreshCw className="animate-spin" size={18} />
                    ) : (
                      <>
                        <span>Verify & Enter Portal</span>
                        <CheckCircle2 size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {isLocalHost && (
                <div style={{ marginTop: '1rem', borderTop: '1px dashed var(--border)', paddingTop: '1rem', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setRegistrationNo('JA-DEBUG');
                      setMobile('9999999999');
                      setStudentName('Local Test Candidate');
                      setStep('rules');
                    }}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--warning)', color: 'var(--warning)', gap: '0.5rem', fontWeight: 700 }}
                  >
                    <span>🔧 Local Test: Bypass to Rules</span>
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {/* STEP 2: RULES SCREEN */}
        {step === 'rules' && (
          <div className="card exam-rules-card" style={{ width: '100%', maxWidth: '650px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99,102,241,0.2)' }}>
                <BookOpen size={24} color="var(--primary)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Welcome, {studentName}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Please read and accept the rules to unlock the exam</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '320px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-light)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={14} /> Exam Pattern & Timing
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.78rem', color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Duration: 150 minutes (2.5 hours).</li>
                  <li>Total Questions: 150 multiple choice questions.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--warning)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={14} /> Marking Scheme
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.78rem', color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Correct Answer: <strong>+1.0 mark</strong>.</li>
                  <li>Incorrect Answer: <strong>-0.25 mark</strong> (negative marking applies).</li>
                  <li>Unattempted Question: <strong>0.0 marks</strong>.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} /> General Guidelines
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.78rem', color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Do not close or refresh this page during the exam.</li>
                  <li>If disconnected, you can re-verify with OTP and resume. Answers are saved locally.</li>
                  <li>One registration is restricted to only one attempt.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ef4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={14} /> Online Proctoring & Prohibited Actions
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.78rem', color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li><strong>Webcam Required:</strong> Your webcam must remain active throughout the exam. Periodic snapshots will be captured for identity verification.</li>
                  <li><strong>Fullscreen Mode:</strong> The exam must be taken in fullscreen. Exiting fullscreen will count as a violation.</li>
                  <li><strong>Tab Switching:</strong> Navigating to other tabs or applications is strictly prohibited and will be logged as a violation.</li>
                  <li><strong>Copy/Paste Disabled:</strong> All clipboard operations, right-click context menus, screenshots, and developer tools are blocked.</li>
                  <li><strong>Auto-Submit:</strong> Accumulating <strong>5 violations</strong> will result in automatic submission of your exam.</li>
                  <li>All suspicious activities are monitored and logged. Further human review may occur if suspicious behavior is detected.</li>
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', backgroundColor: 'rgba(99,102,241,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
              <input
                type="checkbox"
                id="agree-rules"
                checked={rulesChecked}
                onChange={(e) => setRulesChecked(e.target.checked)}
                style={{ marginTop: '0.2rem', cursor: 'pointer' }}
              />
              <label htmlFor="agree-rules" style={{ fontSize: '0.75rem', color: 'var(--text-2)', lineHeight: 1.4, cursor: 'pointer' }}>
                I have read all the instructions, guidelines, and proctoring policies. I consent to webcam monitoring, activity tracking, and fullscreen enforcement. I agree to start my countdown timer and begin my scholarship exam attempt.
              </label>
            </div>

            <button
              onClick={handleStartExam}
              disabled={!rulesChecked || loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Start Scholarship Exam</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: ACTIVE EXAM PORTAL */}
        {step === 'exam' && questions.length > 0 && currentQuestion && (
          <>
          <ProctorManager
            registrationNo={registrationNo}
            onAutoSubmit={handleProctorAutoSubmit}
            maxViolations={5}
            snapshotIntervalMs={3 * 60 * 1000}
          />
          <div className="exam-grid" style={{ width: '100%', maxWidth: '1200px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Left Column: Active Question box */}
            <div className="card exam-question-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', minHeight: '520px', justifyContent: 'space-between' }}>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.75rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, background: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.25)', padding: '0.25rem 0.75rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {currentQuestion.subject}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                    Question <strong>{currentQuestionIndex + 1}</strong> of {questions.length}
                  </span>
                </div>

                <h3 className="exam-question-text" style={{ fontSize: '1.28rem', fontWeight: 700, lineHeight: 1.5, marginBottom: '1.75rem', color: '#fff' }}>
                  {currentQuestion.question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = answers[currentQuestion.id.toString()] === idx;
                    const optionChar = String.fromCharCode(65 + idx);

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(currentQuestion.id, idx)}
                        className="exam-option-btn"
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '1.15rem 1.4rem',
                          borderRadius: '12px',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                          backgroundColor: isSelected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                          color: isSelected ? 'white' : 'var(--text-2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.1rem',
                          transition: 'var(--transition)'
                        }}
                      >
                        <span className="exam-option-char" style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '7px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          backgroundColor: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                          border: isSelected ? '1px solid var(--primary-light)' : '1px solid var(--border)',
                          color: isSelected ? 'white' : 'var(--text-3)',
                          flexShrink: 0
                        }}>
                          {optionChar}
                        </span>
                        <span className="exam-option-label" style={{ fontSize: '0.98rem', fontWeight: 600 }}>{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="exam-nav-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '2rem' }}>
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '0.25rem' }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => handleClearResponse(currentQuestion.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}
                >
                  Clear Response
                </button>

                <button
                  onClick={() => {
                    if (currentQuestionIndex < questions.length - 1) {
                      setCurrentQuestionIndex(prev => prev + 1);
                    } else {
                      setShowSubmitModal(true);
                    }
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.25rem' }}
                >
                  <span>{currentQuestionIndex === questions.length - 1 ? 'Review & Submit' : 'Next'}</span>
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>

            {/* Right Column: Grid palette */}
            <div className="card exam-palette-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '450px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={14} /> Question Palette
              </div>



              {/* Stats overview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.68rem', textAlign: 'center' }}>
                <div>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--primary)', marginRight: '4px' }} />
                  Attempted: {Object.keys(answers).length}
                </div>
                <div>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.1)', marginRight: '4px' }} />
                  Left: {questions.length - Object.keys(answers).length}
                </div>
              </div>

              {/* Scrollable Numbers Grid */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem', paddingRight: '0.25rem' }}>
                {questions.map((q, idx) => {

                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = answers[q.id.toString()] !== undefined;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      style={{
                        height: '32px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        border: isCurrent ? '1.5px solid white' : isAnswered ? '1px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: isCurrent ? 'white' : isAnswered ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.02)',
                        color: isCurrent ? 'black' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'var(--transition)'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        {/* ── Mobile: Floating Palette Toggle Button ── */}
        <button
          className="exam-mobile-fab"
          onClick={() => setShowMobilePalette(true)}
          style={{
            position: 'fixed',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 7000,
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '40px',
            backgroundColor: 'var(--primary, #6366f1)',
            color: '#fff',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(99,102,241,0.5)',
            letterSpacing: '0.3px',
          }}
        >
          <FileText size={14} />
          <span>Question Palette ({Object.keys(answers).length}/{questions.length})</span>
        </button>

        {/* ── Mobile: Slide-up Palette Drawer ── */}
        <div
          className={`exam-mobile-palette-overlay ${showMobilePalette ? 'active' : ''}`}
          onClick={() => setShowMobilePalette(false)}
        />
        <div className={`exam-mobile-palette-drawer ${showMobilePalette ? 'active' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-3)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={14} /> Question Palette
            </div>
            <button
              onClick={() => setShowMobilePalette(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}
            >
              ✕
            </button>
          </div>

          {/* Stats overview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.7rem', textAlign: 'center', marginBottom: '1rem' }}>
            <div>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--primary)', marginRight: '4px' }} />
              Attempted: {Object.keys(answers).length}
            </div>
            <div>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.1)', marginRight: '4px' }} />
              Left: {questions.length - Object.keys(answers).length}
            </div>
          </div>

          {/* Numbers Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.4rem' }}>
            {questions.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const isAnswered = answers[q.id.toString()] !== undefined;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setShowMobilePalette(false);
                  }}
                  style={{
                    height: '36px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: isCurrent ? '1.5px solid white' : isAnswered ? '1px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isCurrent ? 'white' : isAnswered ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.02)',
                    color: isCurrent ? 'black' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition)'
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
        </>
        )}

        {/* STEP 4: SUBMITTED SUCCESS CARD */}
        {step === 'submitted' && (
          <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '1px solid rgba(16,185,129,0.2)' }}>
              <CheckCircle2 size={32} color="var(--success)" />
            </div>

            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Exam Submitted Successfully</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>Your responses have been saved and scored.</p>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1rem 1.25rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-3)' }}>Candidate</span>
                <strong>{studentName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-3)' }}>Registration ID</span>
                <strong style={{ color: 'var(--primary-light)' }}>{registrationNo}</strong>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0.25rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-3)' }}>Questions Attempted</span>
                <strong>{attemptedCount} / 150</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-3)' }}>Questions Unattempted</span>
                <strong>{unattemptedCount} / 150</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', lineHeight: 1.4 }}>
              Merit Ranks and official results will be declared on the JobAdda.in platform on <strong>10th November 2026</strong>.
            </p>

            <a href="/scholarship" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              Return to Scholarship Portal
            </a>
          </div>
        )}

      </main>

      {/* CONFIRMATION SUBMISSION MODAL */}
      {showSubmitModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertTriangle size={24} color="var(--danger)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Confirm Submission</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                You have answered <strong>{Object.keys(answers).length}</strong> out of 150 questions. Once submitted, you cannot resume or edit your answers.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-ghost"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Go Back
              </button>
              <button
                onClick={handleManualSubmit}
                className="btn btn-danger"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      {step !== 'exam' && (
        <footer style={{ padding: '1.25rem 0', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-2)', textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          © 2026 JobAdda.in. Secure Examination Environment. All Rights Reserved.
        </footer>
      )}
    </div>
  );
}
