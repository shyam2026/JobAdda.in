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
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Detect mobile device on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.matchMedia("(max-width: 768px)").matches;
      setIsMobileDevice(isMobile);
    }
  }, []);
  
  // Custom warning modal state
  const [activeWarning, setActiveWarning] = useState<{
    message: string;
    cause: string;
    count: number;
  } | null>(null);

  // AI object detection state
  const [cocoModel, setCocoModel] = useState<any>(null);
  const [modelLoading, setModelLoading] = useState(true);

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
        setActiveWarning(null); // Clear active warnings
        setTimeout(() => onAutoSubmit(), 2000);
      } else if (newCount < maxViolations) {
        let causeDescription = '';
        let causeName = '';
        
        switch (type) {
          case 'TAB_SWITCH':
            causeName = 'Window Focus / Tab Switch';
            causeDescription = 'Navigating away from the active exam screen, switching tabs, or minimizing the browser window is strictly prohibited.';
            break;
          case 'FULLSCREEN_EXIT':
            causeName = 'Mandatory Fullscreen Exited';
            causeDescription = 'You have exited the mandatory fullscreen mode. The exam must be taken in fullscreen to prevent access to other applications.';
            break;
          case 'COPY_ATTEMPT':
            causeName = 'Prohibited Copy/Print/Device Attempt';
            causeDescription = details || 'Attempting to copy text, use prohibited devices (like a cell phone), or trigger page printing is disabled and flagged.';
            break;
          case 'PASTE_ATTEMPT':
            causeName = 'Prohibited Paste Attempt';
            causeDescription = 'Attempting to paste content (Ctrl+V) into the examination portal is strictly prohibited.';
            break;
          case 'DEVTOOLS_ATTEMPT':
            causeName = 'Developer Tools Access Attempt';
            causeDescription = 'Attempting to open browser inspector, Developer Tools (F12, Ctrl+Shift+I/J/C), or viewing source code is flagged as a direct violation.';
            break;
          case 'RIGHT_CLICK':
            causeName = 'Right-Click Context Menu Attempt';
            causeDescription = 'Right-clicking to open the browser context menu is blocked and monitored during the exam.';
            break;
          case 'CAMERA_DENIED':
            causeName = 'Webcam / Visibility Infraction';
            causeDescription = details || 'Your webcam feed must remain clear, active, and unblocked at all times. Ensure you are in a well-lit area and directly in front of the camera.';
            break;
          default:
            causeName = 'Suspicious Behavior Detected';
            causeDescription = details || 'Unspecified prohibited action has occurred.';
        }

        setActiveWarning({
          cause: causeName,
          message: causeDescription,
          count: newCount
        });
      }
      
      return newCount;
    });
  }, [maxViolations, onAutoSubmit, logEvent]);

  // Show a temporary warning banner (used only for non-violation items like page zoom block)
  const flashWarning = useCallback((msg: string, durationMs = 4000) => {
    setWarningMessage(msg);
    setShowWarningOverlay(true);
    setTimeout(() => setShowWarningOverlay(false), durationMs);
  }, []);

  // ──────────────── 1. Block Copy/Paste/Right-Click/DevTools/Print/Zoom/Drag ────────────────
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
      // Block Ctrl+P (Print)
      if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        addViolation('COPY_ATTEMPT', 'Attempted to print page (Ctrl+P)');
        flashWarning('⚠️ Printing or saving as PDF is strictly prohibited!');
        return;
      }
      // Block Page Zoom shortcuts (Ctrl + / Ctrl - / Ctrl 0)
      if (e.ctrlKey && ['=', '-', '0'].includes(e.key)) {
        e.preventDefault();
        flashWarning('⚠️ Zoom adjustments are disabled during the exam!');
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

    // Block Mouse Wheel Zoom (Ctrl + Scroll)
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Block text selection
    const handleSelectStart = (e: Event) => e.preventDefault();

    // Block drag and drop
    const handleDragStart = (e: DragEvent) => e.preventDefault();
    const handleDrop = (e: DragEvent) => e.preventDefault();

    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drop', handleDrop);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drop', handleDrop);
      window.removeEventListener('wheel', handleWheel);
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
    if (isMobileDevice) {
      setIsFullscreen(true);
      setShowFullscreenPrompt(false);
      return;
    }

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
  }, [addViolation, isMobileDevice]);

  const requestFullscreen = () => {
    if (isMobileDevice) return;
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

  // ──────────────── 6. AI Proctoring Model Loader ────────────────
  useEffect(() => {
    let active = true;

    async function initAIProctoring() {
      try {
        console.log('[AI Proctor] Initializing script loading...');
        
        // Load TensorFlow (pinned to stable v4.17.0)
        if (!(window as any).tf) {
          const tfScript = document.createElement('script');
          tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js';
          tfScript.async = true;
          document.head.appendChild(tfScript);
          await new Promise((resolve, reject) => {
            tfScript.onload = () => {
              console.log('[AI Proctor] TensorFlow.js loaded successfully from CDN');
              resolve(null);
            };
            tfScript.onerror = (e) => reject(new Error('TensorFlow.js CDN load failed: ' + e));
          });
        } else {
          console.log('[AI Proctor] TensorFlow.js is already available in window namespace');
        }

        // Load Coco-SSD (pinned to stable v2.2.3)
        if (!(window as any).cocoSsd) {
          const cocoScript = document.createElement('script');
          cocoScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js';
          cocoScript.async = true;
          document.head.appendChild(cocoScript);
          await new Promise((resolve, reject) => {
            cocoScript.onload = () => {
              console.log('[AI Proctor] COCO-SSD loaded successfully from CDN');
              resolve(null);
            };
            cocoScript.onerror = (e) => reject(new Error('COCO-SSD CDN load failed: ' + e));
          });
        } else {
          console.log('[AI Proctor] COCO-SSD is already available in window namespace');
        }

        if (active && (window as any).cocoSsd) {
          console.log('[AI Proctor] Loading COCO-SSD model with lite_mobilenet_v2 base...');
          const loadedModel = await (window as any).cocoSsd.load({
            base: 'lite_mobilenet_v2'
          });
          if (active) {
            setCocoModel(loadedModel);
            setModelLoading(false);
            console.log('[AI Proctor] COCO-SSD Model loaded and ready.');
            logEvent({
              type: 'SNAPSHOT_CAPTURED',
              timestamp: new Date().toISOString(),
              details: 'AI Proctoring Model loaded successfully'
            });
          }
        }
      } catch (err) {
        console.error('[AI Proctor] Failed to initialize AI object detection:', err);
      }
    }

    initAIProctoring();

    return () => {
      active = false;
    };
  }, [logEvent]);

  // ──────────────── 7. AI Proctoring Loop ────────────────
  const consecutiveNoPersonRef = useRef(0);
  const consecutivePhoneRef = useRef(0);
  const consecutiveMultiPersonRef = useRef(0);

  useEffect(() => {
    if (!cameraActive || !cocoModel || !videoRef.current) {
      console.log('[AI Proctor] Loop skipped. cameraActive:', cameraActive, 'hasModel:', !!cocoModel, 'hasVideoRef:', !!videoRef.current);
      return;
    }

    console.log('[AI Proctor] Starting detection interval loop (2.5s)...');

    const interval = setInterval(async () => {
      // Don't run detection if warnings or auto-submits are active
      if (activeWarning || autoSubmitCalledRef.current) return;
      
      if (!videoRef.current) return;
      
      // Relaxed check: readyState >= 2 means HAVE_CURRENT_DATA (video is playing/streaming)
      if (videoRef.current.readyState < 2) {
        console.log('[AI Proctor] Video element readyState is insufficient:', videoRef.current.readyState);
        return;
      }

      try {
        const predictions = await cocoModel.detect(videoRef.current);
        console.log('[AI Proctor] Predictions:', predictions);
        
        // Find people and cell phones in predictions
        const people = predictions.filter((p: any) => p.class === 'person' && p.score > 0.50);
        const phones = predictions.filter((p: any) => p.class === 'cell phone' && p.score > 0.40);

        // 1. Phone Detection check
        if (phones.length > 0) {
          consecutivePhoneRef.current += 1;
          console.warn('[AI Proctor] Phone detected! Consecutive count:', consecutivePhoneRef.current);
          if (consecutivePhoneRef.current >= 2) {
            addViolation('COPY_ATTEMPT', 'Mobile phone / prohibited device detected in webcam view. Keep all electronic devices away.');
            consecutivePhoneRef.current = 0;
          }
        } else {
          consecutivePhoneRef.current = 0;
        }

        // 2. Face/Person presence check (camera covered or walked away)
        if (people.length === 0) {
          consecutiveNoPersonRef.current += 1;
          console.warn('[AI Proctor] No person detected! Consecutive count:', consecutiveNoPersonRef.current);
          if (consecutiveNoPersonRef.current >= 2) {
            addViolation('CAMERA_DENIED', 'No person detected in the camera frame. Make sure your webcam is unblocked and you remain fully visible.');
            consecutiveNoPersonRef.current = 0;
          }
        } else {
          consecutiveNoPersonRef.current = 0;
        }

        // 3. Multiple People check
        if (people.length > 1) {
          consecutiveMultiPersonRef.current += 1;
          console.warn('[AI Proctor] Multiple people detected! Consecutive count:', consecutiveMultiPersonRef.current);
          if (consecutiveMultiPersonRef.current >= 2) {
            addViolation('CAMERA_DENIED', 'Multiple faces/people detected in your webcam feed. Only the candidate must be visible.');
            consecutiveMultiPersonRef.current = 0;
          }
        } else {
          consecutiveMultiPersonRef.current = 0;
        }

      } catch (err) {
        console.error('[AI Proctor] Detection run error:', err);
      }
    }, 2500);

    return () => {
      console.log('[AI Proctor] Cleaning up detection interval loop.');
      clearInterval(interval);
    };
  }, [cameraActive, cocoModel, addViolation, activeWarning]);

  // ──────────────── RENDER ────────────────
  return (
    <>
      {/* ── Mobile Responsive Styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .proctor-cam-pip {
            bottom: 4.5rem !important;
            right: 0.75rem !important;
          }
          .proctor-cam-preview {
            width: 100px !important;
            height: 75px !important;
            border-radius: 10px !important;
          }
          .proctor-status-bar {
            padding: 0.35rem 0.6rem !important;
            font-size: 0.6rem !important;
          }
          .proctor-warning-modal-inner {
            padding: 1.5rem !important;
            border-radius: 18px !important;
            max-width: 340px !important;
          }
          .proctor-warning-modal-inner h3 {
            font-size: 1.1rem !important;
          }
          .proctor-warning-modal-inner p {
            font-size: 0.75rem !important;
          }
          .proctor-warning-banner {
            padding: 0.65rem 1rem !important;
            font-size: 0.75rem !important;
            gap: 0.4rem !important;
          }
          .proctor-fullscreen-modal-inner {
            padding: 1.5rem !important;
            border-radius: 16px !important;
            max-width: 340px !important;
          }
        }
      `}</style>
      {/* ── Active Warning Modal Overlay ── */}
      {activeWarning && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 11000,
          backgroundColor: 'rgba(10, 15, 30, 0.96)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div className="proctor-warning-modal-inner" style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '24px',
            padding: '2.5rem',
            textAlign: 'center',
            maxWidth: '460px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 10px 40px rgba(239, 68, 68, 0.25)',
            animation: 'slideDown 0.3s ease-out',
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}>
              <AlertTriangle size={26} color="#ef4444" />
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
                Proctor Violation Logged
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {activeWarning.cause}
              </p>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'rgba(248, 250, 252, 0.8)', lineHeight: 1.5, margin: '0 0.5rem' }}>
              {activeWarning.message}
            </p>

            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              borderRadius: '12px',
              padding: '0.75rem',
              fontSize: '0.8rem',
              color: '#fca5a5',
              fontWeight: 700
            }}>
              Warning {activeWarning.count} of {maxViolations}
            </div>

            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
              This event, along with your webcam snapshot and active tab focus logs, has been sent to the server for administrative review. Reaching {maxViolations} warnings will trigger auto-submission.
            </p>

            <button
              onClick={() => {
                setActiveWarning(null);
                requestFullscreen();
              }}
              style={{
                padding: '0.9rem 2rem',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
              }}
            >
              I Understand & Resume Exam
            </button>
          </div>
        </div>
      )}

      {/* ── Temporary Non-Violation Warning Banner ── */}
      {showWarningOverlay && warningMessage && (
        <div className="proctor-warning-banner" style={{
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
          padding: '1rem',
        }}>
          <div className="proctor-fullscreen-modal-inner" style={{
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
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'rgba(239,68,68,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <Maximize size={26} color="#ef4444" />
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
                width: '100%',
              }}
            >
              <Maximize size={16} />
              Return to Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Camera PIP + Proctor Status ── */}
      <div className="proctor-cam-pip" style={{
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
          <div className="proctor-cam-preview" style={{
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
              width={320}
              height={240}
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
            </div>

            {/* AI Active indicator */}
            <div style={{
              position: 'absolute',
              bottom: '0.4rem',
              left: '0.4rem',
              backgroundColor: modelLoading ? 'rgba(245, 158, 11, 0.8)' : 'rgba(16, 185, 129, 0.8)',
              padding: '0.15rem 0.45rem',
              borderRadius: '5px',
              fontSize: '0.55rem',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              zIndex: 5
            }}>
              <span style={{
                width: '5px',
                height: '5px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                display: 'inline-block',
                animation: modelLoading ? 'proctorPulse 1s infinite' : 'none',
              }} />
              {modelLoading ? 'AI Booting' : 'AI Active'}
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
        <div className="proctor-status-bar" style={{
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
