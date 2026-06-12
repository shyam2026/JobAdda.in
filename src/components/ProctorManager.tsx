'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, AlertTriangle, Shield, Eye, EyeOff, Maximize } from 'lucide-react';

interface ProctorEvent {
  type: 'TAB_SWITCH' | 'FULLSCREEN_EXIT' | 'COPY_ATTEMPT' | 'PASTE_ATTEMPT' | 'DEVTOOLS_ATTEMPT' | 'RIGHT_CLICK' | 'SNAPSHOT_CAPTURED' | 'CAMERA_DENIED' | 'MULTI_FACE' | 'NO_FACE';
  timestamp: string;
  details?: string;
}

interface ProctorManagerProps {
  registrationNo: string;
  onAutoSubmit: () => void;           // Called when violation threshold is reached
  maxViolations?: number;             // Default 5
  snapshotIntervalMs?: number;        // Default 3 minutes
}

export default function ProctorManager({
  registrationNo,
  onAutoSubmit,
  maxViolations = 5,
  snapshotIntervalMs = 3 * 60 * 1000,
}: ProctorManagerProps) {
  const [violations, setViolations] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarningOverlay, setShowWarningOverlay] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMinimized, setCameraMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const eventsRef = useRef<ProctorEvent[]>([]);
  const violationsRef = useRef(0);
  const autoSubmitCalledRef = useRef(false);

  // Sync violations ref
  useEffect(() => {
    violationsRef.current = violations;
  }, [violations]);

  // Log a proctor event
  const logEvent = useCallback((event: ProctorEvent) => {
    eventsRef.current.push(event);
    // Fire and forget — send event to server
    fetch('/api/scholarship/exam/proctor-snapshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registrationNo,
        type: 'event',
        event,
      }),
    }).catch(() => {});
  }, [registrationNo]);

  // Increment violation and check threshold
  const addViolation = useCallback((type: ProctorEvent['type'], details?: string) => {
    const event: ProctorEvent = {
      type,
      timestamp: new Date().toISOString(),
      details,
    };
    logEvent(event);

    setViolations(prev => {
      const newCount = prev + 1;
      if (newCount >= maxViolations && !autoSubmitCalledRef.current) {
        autoSubmitCalledRef.current = true;
        setWarningMessage(`Maximum violations (${maxViolations}) reached. Your exam is being auto-submitted.`);
        setShowWarningOverlay(true);
        setTimeout(() => onAutoSubmit(), 2000);
      }
      return newCount;
    });
  }, [maxViolations, onAutoSubmit, logEvent]);

  // Show a temporary warning banner
  const flashWarning = useCallback((msg: string, durationMs = 4000) => {
    setWarningMessage(msg);
    setShowWarningOverlay(true);
    setTimeout(() => setShowWarningOverlay(false), durationMs);
  }, []);

  // ──────────────── 1. Block Copy/Paste/Right-Click/DevTools ────────────────
  useEffect(() => {
    const blockDefault = (e: Event) => e.preventDefault();

    const handleCopy = (e: Event) => {
      e.preventDefault();
      addViolation('COPY_ATTEMPT', 'Attempted to copy content');
      flashWarning('⚠️ Copying is disabled during the exam!');
    };

    const handlePaste = (e: Event) => {
      e.preventDefault();
      addViolation('PASTE_ATTEMPT', 'Attempted to paste content');
      flashWarning('⚠️ Pasting is disabled during the exam!');
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      addViolation('RIGHT_CLICK', 'Right-click context menu blocked');
      flashWarning('⚠️ Right-click is disabled during the exam!');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
        addViolation('DEVTOOLS_ATTEMPT', 'Pressed F12');
        flashWarning('⚠️ Developer tools are blocked during the exam!');
        return;
      }
      // Block Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        addViolation('DEVTOOLS_ATTEMPT', `Pressed Ctrl+Shift+${e.key.toUpperCase()}`);
        flashWarning('⚠️ Developer tools are blocked during the exam!');
        return;
      }
      // Block Ctrl+U (view source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return;
      }
      // Block Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return;
      }
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        addViolation('COPY_ATTEMPT', 'PrintScreen key pressed');
        flashWarning('⚠️ Screenshot attempts are logged!');
        return;
      }
    };

    // Block text selection
    const handleSelectStart = (e: Event) => e.preventDefault();

    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [addViolation, flashWarning]);

  // ──────────────── 2. Tab Switch / Focus Loss Detection ────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation('TAB_SWITCH', 'Switched to another tab or minimized the browser');
        flashWarning(`⚠️ Tab switch detected! Violation ${violationsRef.current}/${maxViolations}. Stay on this page.`, 5000);
      }
    };

    const handleBlur = () => {
      // Additional check for window losing focus (some browsers)
      if (!document.hidden) {
        addViolation('TAB_SWITCH', 'Browser window lost focus');
        flashWarning(`⚠️ Window focus lost! Violation ${violationsRef.current}/${maxViolations}.`, 4000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [addViolation, flashWarning, maxViolations]);

  // ──────────────── 3. Fullscreen Enforcement ────────────────
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) {
        setShowFullscreenPrompt(true);
        addViolation('FULLSCREEN_EXIT', 'Exited fullscreen mode');
      } else {
        setShowFullscreenPrompt(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Auto-request fullscreen on mount
    requestFullscreen();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [addViolation]);

  const requestFullscreen = () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().then(() => {
          setIsFullscreen(true);
          setShowFullscreenPrompt(false);
        }).catch(() => {
          setShowFullscreenPrompt(true);
        });
      }
    } catch {
      setShowFullscreenPrompt(true);
    }
  };

  // ──────────────── 4. Webcam: Start Camera ────────────────
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err) {
        setCameraActive(false);
        logEvent({
          type: 'CAMERA_DENIED',
          timestamp: new Date().toISOString(),
          details: 'Camera permission denied or unavailable',
        });
      }
    }
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [logEvent]);

  // ──────────────── 5. Periodic Webcam Snapshots ────────────────
  useEffect(() => {
    if (!cameraActive) return;

    // Capture first snapshot after 30 seconds, then every interval
    const firstTimeout = setTimeout(() => captureSnapshot(), 30000);

    const interval = setInterval(() => {
      captureSnapshot();
    }, snapshotIntervalMs);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [cameraActive, snapshotIntervalMs, registrationNo]);

  const captureSnapshot = useCallback(async () => {
    if (!videoRef.current || !streamRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.5);

      await fetch('/api/scholarship/exam/proctor-snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationNo,
          type: 'snapshot',
          image: imageBase64,
        }),
      });

      logEvent({
        type: 'SNAPSHOT_CAPTURED',
        timestamp: new Date().toISOString(),
        details: 'Periodic webcam snapshot captured and uploaded',
      });
    } catch {
      // Silently fail — non-blocking
    }
  }, [registrationNo, logEvent]);

  // ──────────────── RENDER ────────────────
  return (
    <>
      {/* ── Warning Overlay Banner ── */}
      {showWarningOverlay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          padding: '1rem 2rem',
          backgroundColor: 'rgba(239, 68, 68, 0.95)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          fontWeight: 700,
          fontSize: '0.9rem',
          backdropFilter: 'blur(4px)',
          animation: 'slideDown 0.3s ease-out',
          boxShadow: '0 4px 30px rgba(239, 68, 68, 0.4)',
        }}>
          <AlertTriangle size={20} />
          <span>{warningMessage}</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8, marginLeft: '0.5rem' }}>
            [{violations}/{maxViolations}]
          </span>
        </div>
      )}

      {/* ── Fullscreen Re-enter Prompt ── */}
      {showFullscreenPrompt && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-2, #1a1a2e)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '20px',
            padding: '2.5rem',
            textAlign: 'center',
            maxWidth: '420px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'rgba(239,68,68,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <Maximize size={30} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Fullscreen Required
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
              You have exited fullscreen mode. This is a proctored examination. 
              Please return to fullscreen to continue your exam.
            </p>
            <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>
              Violation {violations}/{maxViolations} recorded.
            </p>
            <button
              onClick={requestFullscreen}
              style={{
                padding: '0.9rem 2rem',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <Maximize size={16} />
              Return to Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Camera PIP + Proctor Status ── */}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 5000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'flex-end',
      }}>
        {/* Camera Toggle Button (when minimized) */}
        {cameraMinimized && (
          <button
            onClick={() => setCameraMinimized(false)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(99,102,241,0.9)',
              border: '1px solid rgba(99,102,241,0.5)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
            title="Show camera preview"
          >
            <Eye size={18} />
          </button>
        )}

        {/* Camera Preview */}
        {!cameraMinimized && (
          <div style={{
            position: 'relative',
            width: '180px',
            height: '135px',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '2px solid rgba(99,102,241,0.6)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            backgroundColor: '#000',
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />

            {/* LIVE indicator */}
            <div style={{
              position: 'absolute',
              top: '0.4rem',
              left: '0.4rem',
              backgroundColor: 'rgba(239, 68, 68, 0.9)',
              padding: '0.15rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.6rem',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'proctorPulse 1.5s infinite',
              }} />
              REC
            </div>

            {/* Minimize button */}
            <button
              onClick={() => setCameraMinimized(true)}
              style={{
                position: 'absolute',
                top: '0.35rem',
                right: '0.35rem',
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '0.65rem',
              }}
              title="Minimize camera"
            >
              <EyeOff size={12} />
            </button>

            {/* No Camera Fallback */}
            {!cameraActive && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}>
                <Camera size={24} color="#ef4444" />
                <span style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700 }}>
                  Camera Off
                </span>
              </div>
            )}
          </div>
        )}

        {/* Proctor Status Bar */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(6px)',
          padding: '0.5rem 0.85rem',
          borderRadius: '10px',
          border: `1px solid ${violations > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.2)'}`,
          fontSize: '0.7rem',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          <Shield size={13} color={violations > 2 ? '#ef4444' : '#6366f1'} />
          <span style={{ color: violations > 2 ? '#fca5a5' : 'rgba(255,255,255,0.8)' }}>
            Proctored
          </span>
          <span style={{
            backgroundColor: violations > 2 ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.15)',
            padding: '0.15rem 0.4rem',
            borderRadius: '4px',
            fontSize: '0.65rem',
            color: violations > 2 ? '#fca5a5' : '#a5b4fc',
          }}>
            {violations}/{maxViolations}
          </span>
        </div>
      </div>

      {/* ── Proctor Animations ── */}
      <style>{`
        @keyframes proctorPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
