'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Shield, Star, Wallet, Tag, X, CheckCircle, AlertTriangle, Loader2, BookOpen, Clock, Trophy, Banknote, Eye, EyeOff, Mail, Sparkles, Award, Laptop, Flame, Users } from 'lucide-react';
import Link from 'next/link';
import { INDIA_STATES } from '@/lib/india-states';
import { useSession } from 'next-auth/react';
import { REGISTRATION_CUTOFF } from '@/lib/scholarship-schedule';

declare const Razorpay: any;

const ORIGINAL_PRICE = 499;
const DISCOUNTED_PRICE = 49;

// Helper Inline Notification component
const InlineNotification = ({ toast, onClose }: { toast: any; onClose: () => void }) => {
  if (!toast) return null;
  return (
    <div
      className="anim-fade-up"
      style={{
        marginTop: '1.25rem',
        background: toast.type === 'success' ? 'rgba(16,185,129,0.1)' : toast.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
        border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.3)' : toast.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)'}`,
        color: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#6366f1',
        padding: '0.85rem 1rem',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        fontWeight: 600,
        fontSize: '0.88rem',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
        <span>{toast.message}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default function ScholarshipPage() {
  // Entrance animation states
  const [showHeader, setShowHeader] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Time gating states
  const [isRegClosed, setIsRegClosed] = useState(false);

  useEffect(() => {
    const checkSchedule = () => {
      let isLocal = false;
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') isLocal = true;
      }
      const now = Date.now();
      if (now >= REGISTRATION_CUTOFF && !isLocal) {
        setIsRegClosed(true);
      }
    };
    checkSchedule();
    const timer = setInterval(checkSchedule, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hTimer = setTimeout(() => setShowHeader(true), 1000);
    const fTimer = setTimeout(() => setShowForm(true), 2000);
    return () => {
      clearTimeout(hTimer);
      clearTimeout(fTimer);
    };
  }, []);

  // Navigation states
  const [step, setStep] = useState<'form' | 'payment' | 'success' | 'retrieve' | 'retrieve-otp'>('form');

  // Form Fields
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [aadharNo, setAadharNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [lastQualification, setLastQualification] = useState('');
  const [marksPercent, setMarksPercent] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [passportImage, setPassportImage] = useState('');
  const [passportImageName, setPassportImageName] = useState('');
  const [passportImageError, setPassportImageError] = useState('');
  const [mobileError, setMobileError] = useState('');

  // OTP Fields
  const [mobileOtp, setMobileOtp] = useState('');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Remaining OTP counts
  const [mobileOtpRemaining, setMobileOtpRemaining] = useState<number | null>(null);
  const [mobileOtpCooldown, setMobileOtpCooldown] = useState(0);

  // Status
  const [sendingMobileOtp, setSendingMobileOtp] = useState(false);
  const [verifyingMobileOtp, setVerifyingMobileOtp] = useState(false);
  const [registering, setRegistering] = useState(false);

  // Registration No
  const [registrationNo, setRegistrationNo] = useState('');

  // Payment states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState(DISCOUNTED_PRICE);

  // Retrieve existing registration state
  const [retrieveQuery, setRetrieveQuery] = useState('');
  const [retrievedEntry, setRetrievedEntry] = useState<any>(null);
  const [retrieveOtpCode, setRetrieveOtpCode] = useState('');
  const [sendingRetrieveOtp, setSendingRetrieveOtp] = useState(false);
  const [verifyingRetrieveOtp, setVerifyingRetrieveOtp] = useState(false);

  // Admin Cash Payment States
  const { data: session } = useSession();
  const [canCollectCash, setCanCollectCash] = useState(false);
  const [showCashForm, setShowCashForm] = useState(false);
  const [cashPasscode, setCashPasscode] = useState('');
  const [cashPaymentLoading, setCashPaymentLoading] = useState(false);
  const [showCashPasscode, setShowCashPasscode] = useState(false);

  // Check admin permission for cash collection on mount
  useEffect(() => {
    const checkCashPermission = async () => {
      try {
        const res = await fetch('/api/admin/check-permission?module=cash-collection');
        const data = await res.json();
        setCanCollectCash(data.allowed === true);
      } catch {
        setCanCollectCash(false);
      }
    };
    if (session?.user && (session.user as any).portalType === 'admin') {
      checkCashPermission();
    }
  }, [session]);

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000); // Set to 5 seconds
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Mobile OTP Cooldown timer
  useEffect(() => {
    if (mobileOtpCooldown <= 0) return;
    const timer = setInterval(() => {
      setMobileOtpCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [mobileOtpCooldown]);

  // Load remaining OTP counts on query target change
  useEffect(() => {
    if (mobile.length === 10) {
      fetch(`/api/scholarship/otp?target=${mobile}&type=mobile`)
        .then(r => r.json())
        .then(data => setMobileOtpRemaining(data.remaining))
        .catch(() => { });
    }
  }, [mobile]);

  const sendOtp = async (target: string, customName?: string, purpose?: string) => {
    if (!target) {
      showToast('Please enter your mobile number', 'error');
      return;
    }
    if (!customName && !name.trim()) {
      showToast('Please enter your Full Name first.', 'error');
      return;
    }
    setSendingMobileOtp(true);
    setMobileError('');
    try {
      const res = await fetch('/api/scholarship/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, type: 'mobile', action: 'send', name: customName || name, purpose })
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.error || '';
        if (errorMsg.toLowerCase().includes('already registered')) {
          setMobileError(errorMsg);
          return;
        }
        throw new Error(errorMsg);
      }

      showToast('OTP sent successfully to your mobile number!', 'success');
      setMobileOtpRemaining(data.remaining);
      setMobileOtpCooldown(60);
      setOtpSent(true);
    } catch (e: any) {
      const msg = e.message || '';
      if (msg.toLowerCase().includes('already registered')) {
        setMobileError(msg);
      } else {
        showToast(msg || 'Failed to send OTP', 'error');
      }
    } finally {
      setSendingMobileOtp(false);
    }
  };

  const verifyOtp = async (target: string, code: string) => {
    if (!code) {
      showToast('Please enter OTP', 'error');
      return;
    }
    setVerifyingMobileOtp(true);
    try {
      const res = await fetch('/api/scholarship/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, type: 'mobile', action: 'verify', otp: code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast('Mobile number verified successfully!', 'success');
      setIsMobileVerified(true);
    } catch (e: any) {
      showToast(e.message || 'Invalid OTP code', 'error');
    } finally {
      setVerifyingMobileOtp(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const MAX_SIZE = 800;

          if (width > height && width > MAX_SIZE) {
            height = Math.round(height * (MAX_SIZE / width));
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = Math.round(width * (MAX_SIZE / height));
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('No canvas context');
          
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.9;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          
          // roughly check if size > 500kb (dataUrl length * 0.75 gives approx bytes)
          while (dataUrl.length * 0.75 > 500 * 1024 && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
        img.onerror = () => reject('Failed to load image');
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject('Failed to read file');
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPassportImageError('');
    if (!file) return;

    // Check extension / format (allowed formats: jpg, png, jpeg)
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const isValidExt = ['jpg', 'jpeg', 'png'].includes(fileExt);

    if (!validExtensions.includes(file.type) && !isValidExt) {
      setPassportImageError('Only JPG, JPEG, and PNG formats are allowed');
      setPassportImage('');
      setPassportImageName('');
      return;
    }

    try {
      if (file.size > 500 * 1024 || file.type.startsWith('image/')) {
        // Compress image
        const compressedDataUrl = await compressImage(file);
        setPassportImage(compressedDataUrl);
        setPassportImageName('compressed_' + file.name);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setPassportImage(reader.result);
            setPassportImageName(file.name);
          }
        };
        reader.onerror = () => setPassportImageError('Failed to read file');
        reader.readAsDataURL(file);
      }
    } catch (err) {
      setPassportImageError('Error processing image');
      setPassportImage('');
      setPassportImageName('');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanAadhar = aadharNo ? aadharNo.trim() : '';

    if (!passportImage) {
      showToast("Please upload your passport size image.", "error");
      return;
    }

    setRegistering(true);
    try {
      const res = await fetch('/api/scholarship/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, fatherName, aadharNo: cleanAadhar, mobile, email, district, state,
          lastQualification, marksPercent, careerGoal, passportImage
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          if (data.paid) {
            showToast('This mobile is already registered and fee is paid!', 'error');
            return;
          }
          showToast('This mobile is already registered but payment is pending. Opening checkout.', 'info');
          setRegistrationNo(data.registrationNo);
          setStep('payment');
          return;
        }
        throw new Error(data.error);
      }

      setRegistrationNo(data.registrationNo);
      setStep('payment');
    } catch (e: any) {
      showToast(e.message || 'Registration failed', 'error');
    } finally {
      setRegistering(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, target: 'SCHOLARSHIP' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Invalid coupon');
        setAppliedCoupon(null);
        setFinalPrice(DISCOUNTED_PRICE);
      } else {
        setAppliedCoupon(data);
        if (data.type === 'FREE') setFinalPrice(0);
        else if (data.type === 'PERCENT' && data.discount) {
          setFinalPrice(Math.max(0, DISCOUNTED_PRICE - Math.floor((DISCOUNTED_PRICE * data.discount) / 100)));
        }
      }
    } catch {
      setCouponError('Failed to validate coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      // Order Creation
      const orderRes = await fetch('/api/scholarship/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNo, couponCode: appliedCoupon?.code })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      if (orderData.free) {
        // Free claim
        const verifyRes = await fetch('/api/scholarship/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registrationNo, free: true, amount: 0, couponCode: appliedCoupon?.code })
        });
        if (!verifyRes.ok) throw new Error('Verification failed');
        localStorage.setItem('scholarship_applied', 'true');
        setStep('success');
        return;
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) throw new Error('Payment gateway failed to load. Please disable ad-blockers or check your connection.');

      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: 'INR',
        name: 'JobAdda Scholarship Test',
        description: `Registration Fee - ${registrationNo}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/scholarship/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                registrationNo,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: orderData.amount,
                couponCode: appliedCoupon?.code
              })
            });
            if (!verifyRes.ok) throw new Error('Payment verification failed');
            localStorage.setItem('scholarship_applied', 'true');
            setStep('success');
          } catch (err: any) {
            showToast(err.message || 'Verification failed', 'error');
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: mobile,
        },
        theme: { color: '#6366f1' },
      };

      const rz = new Razorpay(options);
      rz.open();
    } catch (e: any) {
      showToast(e.message || 'Payment initiation failed', 'error');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCashPayment = async () => {
    if (!cashPasscode.trim()) {
      showToast('Please enter the admin passcode', 'error');
      return;
    }
    setCashPaymentLoading(true);
    try {
      const res = await fetch('/api/scholarship/payment/cash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationNo,
          passcode: cashPasscode,
          couponCode: appliedCoupon?.code || null,
          amount: finalPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cash payment failed');
      localStorage.setItem('scholarship_applied', 'true');
      setStep('success');
    } catch (e: any) {
      showToast(e.message || 'Cash payment failed', 'error');
    } finally {
      setCashPaymentLoading(false);
    }
  };

  const handleRetrieveLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!retrieveQuery.trim()) {
      showToast('Enter Reg No or Contact No', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/scholarship/register?lookup=${encodeURIComponent(retrieveQuery)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.paymentStatus === 'PAID') {
        localStorage.setItem('scholarship_applied', 'true');
        showToast('This registration is already paid! Registration No: ' + data.registrationNo, 'info');
        return;
      }

      setRetrievedEntry(data);
      
      // Bypass OTP as requested
      setRegistrationNo(data.registrationNo);
      setName(data.name);
      setEmail(data.email);
      setMobile(data.mobile);
      setStep('payment');
    } catch (e: any) {
      showToast(e.message || 'Registration details not found', 'error');
    }
  };

  const handleVerifyRetrieve = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/scholarship/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: retrievedEntry.mobile, type: 'mobile', action: 'verify', otp: retrieveOtpCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRegistrationNo(retrievedEntry.registrationNo);
      setName(retrievedEntry.name);
      setEmail(retrievedEntry.email);
      setMobile(retrievedEntry.mobile);
      setStep('payment');
    } catch (e: any) {
      showToast(e.message || 'Invalid OTP code', 'error');
    }
  };

  return (
    <div className="diwali-bg-container" style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <style>{`
        .diwali-bg-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #080c1b;
        }
        .diwali-bg-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/diwali_bg.jpg');
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          background-attachment: fixed;
          opacity: 0.65;
          z-index: 0;
          pointer-events: none;
        }
        /* Floating sky lanterns effect */
        @keyframes floatLantern {
          0% { transform: translateY(105vh) translateX(0) scale(0.7); opacity: 0; }
          12% { opacity: 0.85; }
          85% { opacity: 0.85; }
          100% { transform: translateY(-25vh) translateX(35px) scale(1.1); opacity: 0; }
        }
        .floating-lantern {
          position: fixed;
          bottom: -60px;
          pointer-events: none;
          z-index: 0;
          animation: floatLantern linear infinite;
        }
        .lantern-1 { left: 6%; animation-duration: 24s; animation-delay: 1s; }
        .lantern-2 { left: 22%; animation-duration: 29s; animation-delay: 7s; }
        .lantern-3 { left: 76%; animation-duration: 26s; animation-delay: 3s; }
        .lantern-4 { left: 92%; animation-duration: 33s; animation-delay: 13s; }
        
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.45; transform: scale(0.92); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        .twinkle-star {
          animation: starTwinkle 3s ease-in-out infinite;
        }

        .card {
          background: var(--bg-2) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        .card.card-p:hover, .card.card-p-lg:hover {
          transform: none !important;
          box-shadow: none !important;
        }
        @media (max-width: 560px) {
          .scholarship-2col {
            grid-template-columns: 1fr !important;
          }
          .exam-details-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .medallions-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }
        }
        .card-header-animated {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          visibility: hidden;
        }
        .card-header-animated.visible {
          opacity: 1;
          transform: translateY(0);
          visibility: visible;
        }
        .card-form-animated {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          visibility: hidden;
        }
        .card-form-animated.visible {
          opacity: 1;
          transform: translateY(0);
          visibility: visible;
        }
        .card-header-custom {
          background: rgba(15, 23, 42, 0.85) !important;
          border: 1.5px solid rgba(245, 158, 11, 0.25) !important;
          box-shadow: 0 15px 40px -10px rgba(0, 0, 0, 0.5), 0 0 35px rgba(245, 158, 11, 0.08) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }
      `}</style>

      {/* Floating Diwali Sky Lanterns */}
      <div className="floating-lantern lantern-1">
        <svg width="42" height="52" viewBox="0 0 42 52" fill="none">
          <path d="M7 10C7 6 12 3 21 3C30 3 35 6 35 10L32 42C32 46 27 49 21 49C15 49 10 46 10 42L7 10Z" fill="url(#lantG1)" />
          <ellipse cx="21" cy="45" rx="5" ry="3" fill="#FEF08A" />
          <defs>
            <radialGradient id="lantG1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#DC2626" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="floating-lantern lantern-2">
        <svg width="34" height="44" viewBox="0 0 42 52" fill="none">
          <path d="M7 10C7 6 12 3 21 3C30 3 35 6 35 10L32 42C32 46 27 49 21 49C15 49 10 46 10 42L7 10Z" fill="url(#lantG2)" />
          <ellipse cx="21" cy="45" rx="5" ry="3" fill="#FEF08A" />
          <defs>
            <radialGradient id="lantG2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="floating-lantern lantern-3">
        <svg width="48" height="60" viewBox="0 0 42 52" fill="none">
          <path d="M7 10C7 6 12 3 21 3C30 3 35 6 35 10L32 42C32 46 27 49 21 49C15 49 10 46 10 42L7 10Z" fill="url(#lantG3)" />
          <ellipse cx="21" cy="45" rx="6" ry="3.5" fill="#FEF08A" />
          <defs>
            <radialGradient id="lantG3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#EA580C" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="floating-lantern lantern-4">
        <svg width="30" height="38" viewBox="0 0 42 52" fill="none">
          <path d="M7 10C7 6 12 3 21 3C30 3 35 6 35 10L32 42C32 46 27 49 21 49C15 49 10 46 10 42L7 10Z" fill="url(#lantG4)" />
          <ellipse cx="21" cy="45" rx="4" ry="2.5" fill="#FEF08A" />
          <defs>
            <radialGradient id="lantG4" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div style={{ position: 'relative', maxWidth: '740px', margin: '7rem auto 4rem', padding: '0 1.5rem', zIndex: 1 }} className="anim-fade-up">

        {/* ═══ DIWALI HEADER BANNER CARD ═══ */}
        <div className={`card card-header-animated card-header-custom ${showHeader ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '2rem', padding: '2.5rem 1.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>

          {/* Decorative Top Accent Glow */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '3px', background: 'linear-gradient(90deg, transparent, #F59E0B, #EF4444, transparent)', borderRadius: '0 0 4px 4px' }} />

          {/* Diwali Special Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 1.3rem', borderRadius: '9999px', backgroundColor: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', boxShadow: '0 2px 12px rgba(245,158,11,0.15)', marginBottom: '1.25rem' }}>
            <Sparkles size={16} color="#FBBF24" />
            <span style={{ color: '#FBBF24', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Dewali Special</span>
            <span style={{ fontSize: '0.9rem' }}>🪔</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(2.1rem, 5.5vw, 2.9rem)', fontWeight: 900, marginBottom: '0.35rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            <span style={{ color: '#FFFFFF' }}>JobAdda</span>
            <span style={{ color: '#FBBF24' }}>.in</span><br />
            <span style={{ color: '#FACC15', textShadow: '0 0 25px rgba(250,204,21,0.4)' }}>SCHOLARSHIP</span><br />
            <span style={{ color: '#FFFFFF', fontSize: '0.85em', letterSpacing: '0.04em' }}>PROGRAM 2026</span>
          </h1>

          {/* Subtitle */}
          <p style={{ color: '#FDE047', fontStyle: 'italic', fontSize: '1.15rem', fontWeight: 700, margin: '0.35rem 0 1.75rem', fontFamily: 'Georgia, serif', letterSpacing: '0.02em' }}>
            Shape your future with JobAdda.in
          </p>

          {/* ═══ EXAM DETAILS BAR (From Poster) ═══ */}
          <div style={{ 
            background: 'rgba(15, 23, 42, 0.75)', 
            border: '1.5px solid rgba(245, 158, 11, 0.35)', 
            borderRadius: '18px', 
            padding: '1.25rem 1rem', 
            marginBottom: '1.75rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 1rem', borderRadius: '6px', background: 'linear-gradient(90deg, #F59E0B, #DC2626)', color: '#FFFFFF', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '1rem', textTransform: 'uppercase' }}>
              EXAM DETAILS
            </div>
            <div className="exam-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', textAlign: 'center' }}>
              <div style={{ padding: '0.55rem 0.4rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>📅 APPLY START</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#10B981', marginTop: '0.2rem' }}>01-SEP-2026</div>
              </div>
              <div style={{ padding: '0.55rem 0.4rem', background: 'rgba(239,68,68,0.12)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.35)' }}>
                <div style={{ fontSize: '0.68rem', color: '#FCA5A5', fontWeight: 800, textTransform: 'uppercase' }}>⏳ APPLY END</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#EF4444', marginTop: '0.2rem' }}>04-NOV-2026</div>
              </div>
              <div style={{ padding: '0.55rem 0.4rem', background: 'rgba(245,158,11,0.12)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.35)' }}>
                <div style={{ fontSize: '0.68rem', color: '#FDE68A', fontWeight: 800, textTransform: 'uppercase' }}>📝 EXAM DATE</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#F59E0B', marginTop: '0.2rem' }}>06-NOV-2026</div>
              </div>
              <div style={{ padding: '0.55rem 0.4rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>⏱️ DURATION</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>150 MINUTES</div>
              </div>
              <div style={{ padding: '0.55rem 0.4rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>📋 FORMAT</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>150 MCQs</div>
              </div>
              <div style={{ padding: '0.55rem 0.4rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>🌐 MODE</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#38BDF8', marginTop: '0.2rem' }}>ONLINE TEST</div>
              </div>
            </div>
          </div>

          {/* ═══ ROYAL ARCHWAY & HANGING PRIZE MEDALLIONS (Recreated from Poster) ═══ */}
          <div style={{
            background: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)',
            borderRadius: '24px',
            border: '2px solid #D97706',
            boxShadow: '0 12px 35px rgba(0,0,0,0.35), inset 0 2px 6px rgba(255,255,255,0.8)',
            padding: '2rem 1.25rem 1.75rem',
            position: 'relative',
            marginBottom: '1.75rem',
            overflow: 'hidden',
          }}>
            {/* Hanging Decorative Strings from Top */}
            <div style={{ position: 'absolute', top: 0, left: '15%', width: '2px', height: '24px', background: '#92400E' }} />
            <div style={{ position: 'absolute', top: 0, left: '38%', width: '2px', height: '24px', background: '#92400E' }} />
            <div style={{ position: 'absolute', top: 0, left: '62%', width: '2px', height: '24px', background: '#92400E' }} />
            <div style={{ position: 'absolute', top: 0, left: '85%', width: '2px', height: '24px', background: '#92400E' }} />

            <div className="medallions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', alignItems: 'center' }}>
              
              {/* 1st Prize Medallion */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: '92px',
                  height: '92px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  boxShadow: '0 8px 20px rgba(220,38,38,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  padding: '6px',
                  border: '3px solid #FEF08A'
                }}>
                  <span style={{ fontSize: '1.15rem' }}>🎗️</span>
                  <div style={{ fontSize: '0.78rem', fontWeight: 900, lineHeight: 1.1, marginTop: '2px' }}>1st Prize</div>
                </div>
                <div style={{ marginTop: '0.5rem', background: '#FEF08A', border: '1.5px solid #CA8A04', color: '#854D0E', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 900, whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  ₹1,00,000
                </div>
              </div>

              {/* 2nd Prize Medallion */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0F172A',
                  padding: '6px',
                  border: '3px solid #CBD5E1'
                }}>
                  <span style={{ fontSize: '1.15rem' }}>🥈</span>
                  <div style={{ fontSize: '0.78rem', fontWeight: 900, lineHeight: 1.1, marginTop: '2px' }}>2nd Prize</div>
                </div>
                <div style={{ marginTop: '0.5rem', background: '#0F172A', border: '1.5px solid #475569', color: '#F8FAFC', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 900, whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  ₹75,000
                </div>
              </div>

              {/* 3rd Prize Medallion */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  boxShadow: '0 8px 20px rgba(217,119,6,0.35), inset 0 2px 4px rgba(255,255,255,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  padding: '6px',
                  border: '3px solid #FEF08A'
                }}>
                  <span style={{ fontSize: '1.15rem' }}>🥉</span>
                  <div style={{ fontSize: '0.78rem', fontWeight: 900, lineHeight: 1.1, marginTop: '2px' }}>3rd Prize</div>
                </div>
                <div style={{ marginTop: '0.5rem', background: '#D97706', border: '1.5px solid #92400E', color: '#FFFFFF', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 900, whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  ₹50,000
                </div>
              </div>

              {/* Champion (7 students) Medallion */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
                  boxShadow: '0 8px 20px rgba(30,27,75,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  padding: '6px',
                  border: '3px solid #6366F1'
                }}>
                  <span style={{ fontSize: '1.15rem' }}>🏆</span>
                  <div style={{ fontSize: '0.72rem', fontWeight: 900, lineHeight: 1.1, marginTop: '2px' }}>Champion</div>
                  <div style={{ fontSize: '0.62rem', color: '#C7D2FE', fontWeight: 700 }}>(7 students)</div>
                </div>
                <div style={{ marginTop: '0.5rem', background: '#EA580C', border: '1.5px solid #9A3412', color: '#FFFFFF', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 900, whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  ₹10,000
                </div>
              </div>

            </div>
          </div>

          {/* ═══ SPECIAL COURSE OFFER BANNER (Bottom of Poster) ═══ */}
          <div style={{
            background: 'linear-gradient(135deg, #FEF08A 0%, #FDE047 100%)',
            border: '2px solid #EAB308',
            borderRadius: '20px',
            padding: '1.25rem 1.5rem',
            textAlign: 'left',
            color: '#1E293B',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 0,
            boxShadow: '0 8px 25px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#EAB308', color: '#713F12', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.76rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  <Users size={14} /> For next 300 Participants
                </div>
                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.25 }}>
                  Get Data Analyst <span style={{ background: '#DC2626', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>Course</span> at just
                </h3>
                <div style={{ display: 'inline-block', background: '#DC2626', color: '#FFFFFF', fontSize: '1.45rem', fontWeight: 900, padding: '0.3rem 1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}>
                  ₹15,000/-
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '0.35rem', fontWeight: 600 }}>T & C Applied • Offered by Microsoft Education Partner</div>
              </div>

              {/* Laptop Graphic Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '20px', background: '#0F172A', color: '#38BDF8', border: '3px solid #DC2626', boxShadow: '0 8px 20px rgba(0,0,0,0.3)', flexShrink: 0 }}>
                <Laptop size={44} />
              </div>
            </div>
          </div>
        </div>

        <div className={`card-form-animated ${showForm ? 'visible' : ''}`}>
          {step === 'form' && (
            <>
              {isRegClosed ? (
              <div className="card card-p" style={{ textAlign: 'center', padding: '3rem 2rem', borderRadius: '20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <Clock size={32} color="#EF4444" />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem' }}>Scholarship Registration Closed</h3>
                <p style={{ color: 'var(--text-3)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.75rem', maxWidth: '480px', margin: '0 auto 1.75rem' }}>
                  Registration for the Scholarship Test 2026 closed on <strong>04th November 2026 at 11:59 PM IST</strong>. New applications are no longer accepted.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'center', maxWidth: '400px', margin: '0 auto' }}>
                  <button onClick={() => setStep('retrieve')} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}>
                    Already Registered? Pay Pending Fee / Retrieve ID
                  </button>
                </div>
              </div>
            ) : (
              <div className="card card-p">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontWeight: 800 }}>Registration Form</h3>
                  <button onClick={() => setStep('retrieve')} className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>
                    Already Registered?
                  </button>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Name */}
                  <div className="input-group">
                    <label className="label">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter full name" required />
                  </div>

                  {/* Father's Name & Aadhar No */}
                  <div className="scholarship-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                      <label className="label">Father&apos;s Name</label>
                      <input
                        type="text"
                        value={fatherName}
                        onChange={e => setFatherName(e.target.value)}
                        placeholder="Enter father's name"
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label className="label">Aadhar / PAN / Voter ID <span style={{fontSize: '0.75rem', color: 'var(--text-3)'}}>(Optional)</span></label>
                      <input
                        type="text"
                        value={aadharNo}
                        onChange={e => setAadharNo(e.target.value.toUpperCase())}
                        placeholder="Enter ID number (Optional)"
                      />
                    </div>
                  </div>

                  {/* Mobile with OTP */}
                  <div className="input-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <label className="label" style={{ margin: 0 }}>Mobile Number</label>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>OTP verification is optional</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={e => {
                          setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                          setMobileError('');
                          setOtpSent(false);
                          setIsMobileVerified(false);
                          setMobileOtp('');
                        }}
                        placeholder="10-digit mobile number"
                        disabled={isMobileVerified}
                        required
                      />
                      {!isMobileVerified ? (
                        <button
                          type="button"
                          onClick={() => sendOtp(mobile)}
                          disabled={sendingMobileOtp || mobile.length !== 10 || mobileOtpCooldown > 0}
                          className="btn btn-outline btn-sm"
                          style={{ whiteSpace: 'nowrap', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#F59E0B' }}
                        >
                          {sendingMobileOtp ? 'Sending...' : mobileOtpCooldown > 0 ? `Resend in ${mobileOtpCooldown}s` : 'Send OTP'}
                        </button>
                      ) : (
                        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}><CheckCircle size={12} /> Verified</span>
                      )}
                    </div>

                    {mobileError && (
                      <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem', lineHeight: '1.4' }}>
                        <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                        <span>{mobileError}</span>
                      </div>
                    )}

                    {!isMobileVerified && otpSent && mobileOtpRemaining !== null && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>
                        Remaining attempts today: <strong style={{ color: 'var(--primary)' }}>{mobileOtpRemaining}</strong>
                      </div>
                    )}
                  </div>

                  {/* Mobile OTP Input - Only visible after student explicitly clicks Send OTP */}
                  {!isMobileVerified && otpSent && (
                    <div className="input-group anim-fade-up" style={{ background: 'rgba(30, 41, 59, 0.85)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.35)', boxShadow: '0 8px 24px -6px rgba(0,0,0,0.4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <label className="label" style={{ margin: 0 }}>Enter Mobile OTP</label>
                        <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>OTP sent to +91 {mobile}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                          type="text"
                          value={mobileOtp}
                          onChange={e => setMobileOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit OTP"
                          style={{ letterSpacing: '0.1em' }}
                        />
                        <button
                          type="button"
                          onClick={() => verifyOtp(mobile, mobileOtp)}
                          disabled={verifyingMobileOtp || mobileOtp.length !== 6}
                          className="btn btn-success btn-sm"
                        >
                          {verifyingMobileOtp ? '...' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Email Address */}
                  <div className="input-group">
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '0.25rem', display: 'block', lineHeight: 1.4 }}>
                      Make sure the email is correct as you will receive your registration ID and confirmation message on it.
                    </span>
                  </div>

                  {/* State & District */}
                  <div className="scholarship-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                      <label className="label">State</label>
                      <select
                        value={state}
                        onChange={e => { setState(e.target.value); setDistrict(''); }}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text-1)' }}
                      >
                        <option value="">Select State</option>
                        {Object.keys(INDIA_STATES).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="label">District</label>
                      <select
                        value={district}
                        onChange={e => setDistrict(e.target.value)}
                        required
                        disabled={!state}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text-1)' }}
                      >
                        <option value="">Select District</option>
                        {state && INDIA_STATES[state]?.map((d: string) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Qualification & Marks */}
                  <div className="scholarship-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                      <label className="label">Last Qualification</label>
                      <select
                        value={lastQualification}
                        onChange={e => setLastQualification(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text-1)' }}
                      >
                        <option value="">Select Qualification</option>
                        <option value="10th">10th</option>
                        <option value="12th">12th</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Post-Graduate">Post-Graduate</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="label">Marks %</label>
                      <input type="text" value={marksPercent} onChange={e => setMarksPercent(e.target.value)} placeholder="e.g. 78% or 8.2 CGPA" required />
                    </div>
                  </div>

                  {/* Career Goal */}
                  <div className="input-group">
                    <label className="label">Career Goal</label>
                    <textarea value={careerGoal} onChange={e => setCareerGoal(e.target.value)} placeholder="Describe your career goals..." rows={3} required />
                  </div>

                  {/* Passport Size Image */}
                  <div className="input-group">
                    <label className="label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Passport Size Image <span style={{ color: '#ef4444' }}>*</span></span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 400 }}>JPG, PNG (Auto-compressed)</span>
                    </label>

                    <input
                      type="file"
                      id="gallery-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <input
                      type="file"
                      id="camera-upload"
                      accept="image/*"
                      capture="user"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />

                    {!passportImage ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <label
                          htmlFor="gallery-upload"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed var(--border)',
                            borderRadius: '8px',
                            padding: '1.25rem 0.5rem',
                            cursor: 'pointer',
                            background: 'var(--bg-3)',
                            transition: 'border-color 0.2s, background-color 0.2s',
                            textAlign: 'center'
                          }}
                        >
                          <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📁</span>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 600 }}>Gallery</span>
                        </label>
                        
                        <label
                          htmlFor="camera-upload"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed var(--border)',
                            borderRadius: '8px',
                            padding: '1.25rem 0.5rem',
                            cursor: 'pointer',
                            background: 'var(--bg-3)',
                            transition: 'border-color 0.2s, background-color 0.2s',
                            textAlign: 'center'
                          }}
                        >
                          <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📷</span>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 600 }}>Take Selfie</span>
                        </label>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-3)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <img
                          src={passportImage}
                          alt="Passport Preview"
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-1)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{passportImageName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Uploaded successfully</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setPassportImage(''); setPassportImageName(''); }}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#ef4444', padding: '0.25rem', minWidth: 'auto', display: 'flex', alignItems: 'center' }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}

                    {passportImageError && (
                      <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <AlertTriangle size={14} /> {passportImageError}
                      </div>
                    )}
                  </div>

                  {/* Terms checkbox */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input type="checkbox" id="terms" required style={{ marginTop: '0.2rem' }} />
                    <label htmlFor="terms" style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                      I agree to the <Link href="/scholarship-terms" target="_blank" style={{ color: 'var(--primary)', fontWeight: '600' }}>Scholarship Test Terms & Conditions</Link>.
                    </label>
                  </div>

                  {/* Register button */}
                  <button
                    type="submit"
                    disabled={registering}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', justifyContent: 'center' }}
                    suppressHydrationWarning
                  >
                    {registering ? <Loader2 className="animate-spin" /> : 'Submit Your Application'}
                  </button>

                  {/* Inline Notification Banner below Register Button */}
                  <InlineNotification toast={toast} onClose={() => setToast(null)} />
                </form>
              </div>
            )}

              {/* Support and Already Registered cards below the main form */}
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Check Results Card */}
                {/* <div 
              className="card card-p" 
              style={{ 
                padding: '1.5rem', 
                background: 'rgba(34, 197, 94, 0.05)', 
                border: '1px solid rgba(34, 197, 94, 0.15)',
                borderRadius: '16px',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-1)' }}>Check Exam Results</h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-3)' }}>
                  View your scholarship test scores, correct/wrong answers, merit rank, and prize status.
                </p>
              </div>
              <Link 
                href="/scholarship/result" 
                style={{ 
                  padding: '0.6rem 1.25rem', 
                  fontSize: '0.82rem', 
                  height: 'auto', 
                  backgroundColor: '#22c55e', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
              >
                Check Test Result
              </Link>
            </div> */}

                {/* Already Registered / Check Status Card */}
                <div
                  className="card card-p"
                  style={{
                    padding: '1.5rem',
                    background: 'rgba(99, 102, 241, 0.03)',
                    border: '1px solid rgba(99, 102, 241, 0.12)',
                    borderRadius: '16px',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-1)' }}>Already Registered?</h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-3)' }}>
                      Check status, resume pending payment, or retrieve your registration ID.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('retrieve')}
                    className="btn btn-primary"
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.82rem', height: 'auto' }}
                  >
                    Check Status / Resume Payment
                  </button>
                </div>

                {/* Support / Help Card for payment issues */}
                <div
                  className="card card-p"
                  style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '16px',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Mail size={16} />
                    </div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-1)' }}>Payment Help & Support</h4>
                  </div>

                  <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                    Kindly email us at <a href="mailto:payment@jobadda.in" style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'underline' }}>payment@jobadda.in</a> with a <strong>screenshot</strong> of your transaction:
                  </p>

                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-3)', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 1.4 }}>
                    <li>If you are facing any payment-related issues</li>
                    <li>If you paid the amount but did not receive a confirmation</li>
                    <li>If you are experiencing any issue in making the payment</li>
                    <li>If you have any other payment related queries or concerns</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {step === 'payment' && (
            <div className="card card-p anim-fade-up">
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Successfully Registered</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem' }}>Registration ID: {registrationNo}</h2>
                <p style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>Please complete the registration fee payment to activate your slot.</p>
              </div>

              {/* Coupon Input */}
              <div style={{ marginBottom: '1.5rem', background: 'var(--bg-3)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
                <label className="label" style={{ fontWeight: 700 }}>Apply Coupon Code</label>
                {appliedCoupon ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <Tag size={16} color="#10b981" />
                    <span style={{ flex: 1, fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>
                      {appliedCoupon.code} — {appliedCoupon.type === 'FREE' ? '100% OFF' : `${appliedCoupon.discount}% OFF`}
                    </span>
                    <button onClick={() => { setAppliedCoupon(null); setFinalPrice(DISCOUNTED_PRICE); setCouponCode(''); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                      style={{ textTransform: 'uppercase' }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                      className="btn btn-primary btn-sm"
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <AlertTriangle size={13} color="#ef4444" />
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: 0 }}>{couponError}</p>
                  </div>
                )}
              </div>

              {/* Pricing Box */}
              <div style={{ background: 'var(--bg-3)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Online Exam Platform Fee</span>
                  <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>₹{DISCOUNTED_PRICE}</span>
                </div>
                {appliedCoupon && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Coupon Discount ({appliedCoupon.code})</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>
                      {appliedCoupon.type === 'FREE' ? `-₹${DISCOUNTED_PRICE}` : `-${appliedCoupon.discount}%`}
                    </span>
                  </div>
                )}
                <div style={{ height: '1px', background: 'var(--border)', margin: '0.75rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800 }}>Amount Pay</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>₹{finalPrice}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', justifyContent: 'center' }}
              >
                {paymentLoading ? <Loader2 className="animate-spin" /> : `Final Submission`}
              </button>

              {/* Admin Cash Payment Section — ONLY visible to authorized admin/subadmin */}
              {canCollectCash && (
                <div style={{ marginTop: '1.5rem' }}>
                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.5rem 0 1.25rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Only</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  </div>

                  {!showCashForm ? (
                    <button
                      type="button"
                      onClick={() => setShowCashForm(true)}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px dashed rgba(16, 185, 129, 0.35)',
                        borderRadius: '12px',
                        color: '#10b981',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Banknote size={18} />
                      Admin: Pay via Cash
                    </button>
                  ) : (
                    <div
                      className="anim-fade-up"
                      style={{
                        background: 'rgba(16, 185, 129, 0.04)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '14px',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Shield size={16} color="#10b981" />
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#10b981' }}>Cash Payment Verification</span>
                        <button
                          type="button"
                          onClick={() => { setShowCashForm(false); setCashPasscode(''); setShowCashPasscode(false); }}
                          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Secret Admin Passcode</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <input
                            type={showCashPasscode ? "text" : "password"}
                            value={cashPasscode}
                            onChange={e => setCashPasscode(e.target.value)}
                            placeholder="Enter admin passcode"
                            style={{ fontSize: '0.9rem', width: '100%', paddingRight: '2.5rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCashPasscode(!showCashPasscode)}
                            style={{
                              position: 'absolute',
                              right: '0.75rem',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--text-3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0.25rem',
                            }}
                          >
                            {showCashPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCashPayment}
                        disabled={cashPaymentLoading || !cashPasscode.trim()}
                        className="btn"
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          justifyContent: 'center',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: cashPaymentLoading || !cashPasscode.trim() ? 'not-allowed' : 'pointer',
                          opacity: cashPaymentLoading || !cashPasscode.trim() ? 0.6 : 1,
                        }}
                      >
                        {cashPaymentLoading ? <Loader2 className="animate-spin" size={18} /> : <><Banknote size={18} /> Confirm Cash Payment — ₹{finalPrice}</>}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Inline Notification Banner below Payment Button */}
              <InlineNotification toast={toast} onClose={() => setToast(null)} />
            </div>
          )}

          {step === 'success' && (
            <div className="card card-p anim-fade-up" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', marginBottom: '1.5rem' }}>
                <CheckCircle size={32} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Registration Successful!</h2>
              <p style={{ color: 'var(--text-3)', marginBottom: '1.5rem' }}>
                Your registration fee has been received. Save your Registration ID below:
              </p>
              <div style={{ background: 'var(--bg-3)', padding: '1rem 2rem', borderRadius: '12px', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.05em', color: 'var(--text-1)', display: 'inline-block', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                {registrationNo}
              </div>
              <div>
                <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex', alignSelf: 'center' }}>
                  Go to Homepage
                </Link>
              </div>

              {/* Inline Notification Banner below Success link */}
              <InlineNotification toast={toast} onClose={() => setToast(null)} />
            </div>
          )}

          {step === 'retrieve' && (
            <>
              <div className="card card-p anim-fade-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontWeight: 800 }}>Resume Payment</h3>
                  <button onClick={() => setStep('form')} className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>
                    Back to Form
                  </button>
                </div>

                <form onSubmit={handleRetrieveLookup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="input-group">
                    <label className="label">Registration ID or Mobile Number</label>
                    <input
                      type="text"
                      value={retrieveQuery}
                      onChange={e => setRetrieveQuery(e.target.value)}
                      placeholder="Enter JA-XXXXXXXX or 10-digit mobile"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Lookup Registration & Send OTP
                  </button>

                  {/* Inline Notification Banner below Retrieve Button */}
                  <InlineNotification toast={toast} onClose={() => setToast(null)} />
                </form>
              </div>

              {/* Support / Help Card for payment issues */}
              <div
                className="card card-p anim-fade-up"
                style={{
                  marginTop: '1.5rem',
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '16px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Mail size={16} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-1)' }}>Payment Help & Support</h4>
                </div>

                <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                  Kindly email us at <a href="mailto:payment@jobadda.in" style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'underline' }}>payment@jobadda.in</a> with a <strong>screenshot</strong> of your transaction:
                </p>

                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-3)', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 1.4 }}>
                  <li>If you are facing any payment-related issues</li>
                  <li>If you paid the amount but did not receive a confirmation</li>
                  <li>If you are experiencing any issue in making the payment</li>
                  <li>If you have any other payment related queries or concerns</li>
                </ul>
              </div>
            </>
          )}

          {step === 'retrieve-otp' && (
            <div className="card card-p anim-fade-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontWeight: 800 }}>Verify Ownership</h3>
              </div>

              <form onSubmit={handleVerifyRetrieve} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                  An OTP has been sent to candidate <strong style={{ color: 'var(--text-1)' }}>{retrievedEntry?.name}</strong>'s mobile number: <strong>******{retrievedEntry?.mobile.slice(-4)}</strong>
                </div>

                <div className="input-group">
                  <label className="label">Enter Mobile OTP</label>
                  <input
                    type="text"
                    value={retrieveOtpCode}
                    onChange={e => setRetrieveOtpCode(e.target.value.slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success" style={{ width: '100%', justifyContent: 'center' }}>
                  Verify OTP & Proceed to Payment
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                    {mobileOtpCooldown > 0 ? `Resend in ${mobileOtpCooldown}s` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => sendOtp(retrievedEntry.mobile, retrievedEntry.name, 'recovery')}
                    disabled={sendingMobileOtp || mobileOtpCooldown > 0}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--primary)', fontWeight: 'bold' }}
                  >
                    {sendingMobileOtp ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>

                {/* Inline Notification Banner below Verify Button */}
                <InlineNotification toast={toast} onClose={() => setToast(null)} />
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
