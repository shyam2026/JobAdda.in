'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Shield, Star, Wallet, Lock, Tag, X, CheckCircle, AlertTriangle, Loader2, Sun, BookOpen, Clock, Trophy } from 'lucide-react';
import Link from 'next/link';
import { INDIA_STATES } from '@/lib/india-states';
import WavingIndianFlag from '@/components/WavingIndianFlag';

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

  useEffect(() => {
    const hTimer = setTimeout(() => setShowHeader(true), 3000);
    const fTimer = setTimeout(() => setShowForm(true), 4000);
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

  // OTP Fields
  const [mobileOtp, setMobileOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Remaining OTP counts
  const [mobileOtpRemaining, setMobileOtpRemaining] = useState<number | null>(null);
  const [emailOtpRemaining, setEmailOtpRemaining] = useState<number | null>(null);

  // Status
  const [sendingMobileOtp, setSendingMobileOtp] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingMobileOtp, setVerifyingMobileOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
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

  // Load remaining OTP counts on query target change
  useEffect(() => {
    if (mobile.length === 10) {
      fetch(`/api/scholarship/otp?target=${mobile}&type=mobile`)
        .then(r => r.json())
        .then(data => setMobileOtpRemaining(data.remaining))
        .catch(() => {});
    }
  }, [mobile]);

  useEffect(() => {
    if (email.includes('@')) {
      fetch(`/api/scholarship/otp?target=${email}&type=email`)
        .then(r => r.json())
        .then(data => setEmailOtpRemaining(data.remaining))
        .catch(() => {});
    }
  }, [email]);

  const sendOtp = async (target: string, type: 'mobile' | 'email') => {
    if (!target) {
      showToast(`Please enter your ${type}`, 'error');
      return;
    }
    const setter = type === 'mobile' ? setSendingMobileOtp : setSendingEmailOtp;
    setter(true);
    try {
      const res = await fetch('/api/scholarship/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, type, action: 'send' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      showToast(`OTP sent successfully to your ${type}!`, 'success');
      if (type === 'mobile') {
        setMobileOtpRemaining(data.remaining);
      } else {
        setEmailOtpRemaining(data.remaining);
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to send OTP', 'error');
    } finally {
      setter(false);
    }
  };

  const verifyOtp = async (target: string, type: 'mobile' | 'email', code: string) => {
    if (!code) {
      showToast('Please enter OTP', 'error');
      return;
    }
    const setter = type === 'mobile' ? setVerifyingMobileOtp : setVerifyingEmailOtp;
    setter(true);
    try {
      const res = await fetch('/api/scholarship/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, type, action: 'verify', otp: code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(`${type === 'mobile' ? 'Mobile number' : 'Email address'} verified successfully!`, 'success');
      if (type === 'mobile') setIsMobileVerified(true);
      else setIsEmailVerified(true);
    } catch (e: any) {
      showToast(e.message || 'Invalid OTP code', 'error');
    } finally {
      setter(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPassportImageError('');
    if (!file) return;

    // Check size (500KB = 500 * 1024 bytes)
    if (file.size > 500 * 1024) {
      setPassportImageError('Image size must be less than 500KB');
      setPassportImage('');
      setPassportImageName('');
      return;
    }

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

    // Read file as Base64
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPassportImage(reader.result);
        setPassportImageName(file.name);
      }
    };
    reader.onerror = () => {
      setPassportImageError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMobileVerified || !isEmailVerified) {
      showToast('Please verify both mobile and email OTPs first!', 'error');
      return;
    }

    const cleanAadhar = aadharNo.replace(/\s/g, '');
    if (cleanAadhar.length !== 12 || !/^\d+$/.test(cleanAadhar)) {
      showToast("Aadhar Number must be exactly 12 numeric digits.", "error");
      return;
    }

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
      document.body.appendChild(script);
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
      if (!isLoaded) throw new Error('Razorpay SDK failed to load');

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
      // Send OTP to their mobile for verification
      await sendOtp(data.mobile, 'mobile');
      setStep('retrieve-otp');
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
    <div className="patriotic-bg-container" style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <style>{`
        .patriotic-bg-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/patriotic_bg.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          opacity: 0.75; /* More visible background */
          z-index: 0;
          pointer-events: none;
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
          background: var(--bg-2) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
        }
      `}</style>
      <div style={{ position: 'relative', maxWidth: '720px', margin: '7rem auto 4rem', padding: '0 1.5rem', zIndex: 1 }} className="anim-fade-up">
      
      {/* Header Banner Card */}
      <div className={`card card-header-animated card-header-custom ${showHeader ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '2rem', padding: '2.25rem 1.5rem', borderRadius: '20px' }}>
        
        {/* Independence Day Special Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 1rem', borderRadius: '9999px', backgroundColor: '#FFFFFF', border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', marginBottom: '1.25rem' }}>
          <Sun size={16} color="#F97316" fill="#F97316" />
          <span style={{ color: '#F97316', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em' }}>INDEPENDENCE DAY SPECIAL</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.65rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          <span style={{ color: '#F97316' }}>Scholarship </span>
          <span style={{ color: '#FFFFFF' }}>Test </span>
          <span style={{ color: '#22C55E' }}>2026</span>
        </h1>

        {/* Subtitle / Test Date with Saffron and Green Dashes */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', marginBottom: '1.75rem', fontSize: '1rem', fontWeight: 700 }}>
          <span style={{ display: 'inline-flex', gap: '4px' }}>
            <span style={{ width: '12px', height: '3px', borderRadius: '2px', backgroundColor: '#F97316' }}></span>
            <span style={{ width: '12px', height: '3px', borderRadius: '2px', backgroundColor: '#22C55E' }}></span>
          </span>
          <span style={{ color: '#818CF8' }}>Test Date: 15th August 2026</span>
          <span style={{ display: 'inline-flex', gap: '4px' }}>
            <span style={{ width: '12px', height: '3px', borderRadius: '2px', backgroundColor: '#22C55E' }}></span>
            <span style={{ width: '12px', height: '3px', borderRadius: '2px', backgroundColor: '#F97316' }}></span>
          </span>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#22C55E', color: '#FFFFFF', marginRight: '0.65rem', boxShadow: '0 4px 12px rgba(34,197,94,0.2)' }}>
              <BookOpen size={16} />
            </div>
            <span style={{ color: 'var(--text-2)', fontSize: '0.92rem', fontWeight: 700 }}>150 MCQs</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#F97316', color: '#FFFFFF', marginRight: '0.65rem', boxShadow: '0 4px 12px rgba(249,115,22,0.2)' }}>
              <Clock size={16} />
            </div>
            <span style={{ color: 'var(--text-2)', fontSize: '0.92rem', fontWeight: 700 }}>150 Minutes</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#6366F1', color: '#FFFFFF', marginRight: '0.65rem', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
              <Trophy size={16} />
            </div>
            <span style={{ color: 'var(--text-2)', fontSize: '0.92rem', fontWeight: 700 }}>Win ₹15,000</span>
          </div>
        </div>
      </div>

      <div className={`card-form-animated ${showForm ? 'visible' : ''}`}>
      {step === 'form' && (
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
                <label className="label">Aadhar Number</label>
                <input 
                  type="text" 
                  value={aadharNo} 
                  onChange={e => setAadharNo(e.target.value.replace(/\D/g, '').slice(0, 12))} 
                  placeholder="12-digit Aadhar number" 
                  required 
                />
              </div>
            </div>

            {/* Mobile with OTP */}
            <div className="input-group">
              <label className="label">Mobile Number</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input 
                  type="tel" 
                  value={mobile} 
                  onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                  placeholder="10-digit mobile number" 
                  disabled={isMobileVerified}
                  required 
                />
                {!isMobileVerified ? (
                  <button 
                    type="button" 
                    onClick={() => sendOtp(mobile, 'mobile')} 
                    disabled={sendingMobileOtp || mobile.length !== 10} 
                    className="btn btn-primary btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {sendingMobileOtp ? 'Sending...' : 'Send OTP'}
                  </button>
                ) : (
                  <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={12} /> Verified</span>
                )}
              </div>
              {!isMobileVerified && mobileOtpRemaining !== null && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>
                  Remaining attempts today: <strong style={{ color: 'var(--primary)' }}>{mobileOtpRemaining}</strong>
                </div>
              )}
            </div>

            {/* Mobile OTP Input */}
            {!isMobileVerified && mobile.length === 10 && (
              <div className="input-group anim-fade-up" style={{ background: 'var(--bg-3)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <label className="label">Enter Mobile OTP</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input type="text" value={mobileOtp} onChange={e => setMobileOtp(e.target.value.slice(0, 6))} placeholder="Enter 6-digit OTP" />
                  <button 
                    type="button" 
                    onClick={() => verifyOtp(mobile, 'mobile', mobileOtp)} 
                    disabled={verifyingMobileOtp || mobileOtp.length !== 6}
                    className="btn btn-success btn-sm"
                  >
                    {verifyingMobileOtp ? '...' : 'Verify'}
                  </button>
                </div>
              </div>
            )}

            {/* Email with OTP */}
            <div className="input-group">
              <label className="label">Email Address</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Enter email address" 
                  disabled={isEmailVerified}
                  required 
                />
                {!isEmailVerified ? (
                  <button 
                    type="button" 
                    onClick={() => sendOtp(email, 'email')} 
                    disabled={sendingEmailOtp || !email.includes('@')} 
                    className="btn btn-primary btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {sendingEmailOtp ? 'Sending...' : 'Send OTP'}
                  </button>
                ) : (
                  <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={12} /> Verified</span>
                )}
              </div>
              {!isEmailVerified && emailOtpRemaining !== null && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>
                  Remaining attempts today: <strong style={{ color: 'var(--primary)' }}>{emailOtpRemaining}</strong>
                </div>
              )}
            </div>

            {/* Email OTP Input */}
            {!isEmailVerified && email.includes('@') && (
              <div className="input-group anim-fade-up" style={{ background: 'var(--bg-3)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <label className="label">Enter Email OTP</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input type="text" value={emailOtp} onChange={e => setEmailOtp(e.target.value.slice(0, 6))} placeholder="Enter 6-digit OTP" />
                  <button 
                    type="button" 
                    onClick={() => verifyOtp(email, 'email', emailOtp)} 
                    disabled={verifyingEmailOtp || emailOtp.length !== 6}
                    className="btn btn-success btn-sm"
                  >
                    {verifyingEmailOtp ? '...' : 'Verify'}
                  </button>
                </div>
              </div>
            )}

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
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 400 }}>JPG, JPEG, PNG (Max 500KB)</span>
              </label>
              
              <input 
                type="file" 
                id="passport-upload" 
                accept=".jpg,.jpeg,.png" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
              
              {!passportImage ? (
                <label 
                  htmlFor="passport-upload"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed var(--border)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    background: 'var(--bg-3)',
                    transition: 'border-color 0.2s, background-color 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📷</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-2)', fontWeight: 600 }}>Click to Upload Passport Photo</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>Only JPG, JPEG, or PNG formats</span>
                </label>
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
              disabled={registering || !isMobileVerified || !isEmailVerified}
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
