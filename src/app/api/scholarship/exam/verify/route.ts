import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

const DAILY_LIMIT = 5;
const OTP_EXPIRY_MIN = 10;

function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

async function sendSMS(to: string, name: string, otp: string): Promise<boolean> {
  const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Candidate';
  const msgText = `Dear ${cleanName} Your OTP for JobAdda.in Scholarship Registration is ${otp}. Please do not share this OTP with anyone. This OTP is valid for 10 Minutes. Team JobAdda.in`;

  const username = process.env.SMS_USERNAME || 'gapsms01.trans';
  const password = process.env.SMS_PASSWORD || 'f_vRA68q';
  const from = process.env.SMS_FROM || 'JOADIN';
  const dltContentId = process.env.SMS_DLT_CONTENT_ID || '1707178185523758730';
  const dltPrincipalEntityId = process.env.SMS_DLT_PRINCIPAL_ENTITY_ID || '1701178116898320542';

  // Ensure 91 country code prefix for Indian numbers (SmartPing requires it)
  let formattedTo = to.replace(/\D/g, '');
  if (formattedTo.length === 10) {
    formattedTo = '91' + formattedTo;
  }

  const url = new URL('https://pgapi.sparc.smartping.io/fe/api/v1/send');
  url.searchParams.set('username', username);
  url.searchParams.set('password', password);
  url.searchParams.set('unicode', 'false');
  url.searchParams.set('from', from);
  url.searchParams.set('text', msgText);
  url.searchParams.set('to', formattedTo);
  url.searchParams.set('dltContentId', dltContentId);
  url.searchParams.set('dltPrincipalEntityId', dltPrincipalEntityId);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'accept': 'application/json' }
    });
    const data = await res.text();
    console.log(`[EXAM SMS OTP] to: ${formattedTo}, HTTP ${res.status}, response: ${data}`);

    // Check for failure indicators in the response
    if (!res.ok) {
      console.error(`[EXAM SMS OTP - FAILED] HTTP ${res.status} for ${formattedTo}: ${data}`);
      return false;
    }

    // SmartPing API may return 200 but with error in body
    const lowerData = data.toLowerCase();
    if (lowerData.includes('error') || lowerData.includes('fail') || lowerData.includes('invalid') || lowerData.includes('rejected') || lowerData.includes('blacklist') || lowerData.includes('insufficient')) {
      console.error(`[EXAM SMS OTP - GATEWAY ERROR] ${formattedTo}: ${data}`);
      return false;
    }

    console.log(`[EXAM SMS OTP - SUCCESS] Delivered to ${formattedTo}`);
    return true;
  } catch (error) {
    console.error(`[EXAM SMS OTP - ERROR] Failed to send SMS to ${formattedTo}:`, error);
    return false;
  }
}

async function sendEmail(to: string, name: string, otp: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log(`[EXAM OTP - FALLBACK] Email: ${to} OTP: ${otp} (SMTP credentials missing)`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user, pass },
    });
    const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Candidate';
    await transporter.sendMail({
      from: `"JobAdda Exam" <${user}>`,
      to,
      subject: 'Your OTP for Scholarship Exam Access - JobAdda.in',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #6366f1; text-align: center;">JobAdda.in Scholarship Exam</h2>
          <p>Dear <strong>${cleanName}</strong>,</p>
          <p>Your 6-digit OTP code to log in and start your Scholarship Exam is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #6366f1; background: #f0f0ff; padding: 12px 24px; border-radius: 8px; border: 1px solid #c7d2fe;">${otp}</span>
          </div>
          <p style="color: #555;">This OTP is valid for <strong>${OTP_EXPIRY_MIN} minutes</strong>. You can use this code received via Email or SMS to verify and access your exam.</p>
          <p style="color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">If you did not request this OTP, please ignore this email.</p>
        </div>
      `,
    });
    console.log(`[EXAM OTP - SENT] Sent email to: ${to}`);
  } catch (error) {
    console.error(`[EXAM OTP - EMAIL ERROR] Failed to send email to ${to}:`, error);
  }
}

import { EXAM_START_TIME, EXAM_END_TIME } from '@/lib/scholarship-schedule';

// POST /api/scholarship/exam/verify
export async function POST(req: Request) {
  try {
    const { registrationNo, mobile, action, otp } = await req.json();
    if (!registrationNo || !mobile || !action) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const isLocal = process.env.NODE_ENV === 'development';
    const nowTime = Date.now();
    if (nowTime < EXAM_START_TIME && !(isLocal && registrationNo === 'JA-DEBUG')) {
      return NextResponse.json({ error: 'Scholarship Exam re-exam window opens on 16th August 2026 at 10:00 AM IST.' }, { status: 403 });
    }
    if (nowTime > EXAM_END_TIME && !(isLocal && registrationNo === 'JA-DEBUG')) {
      return NextResponse.json({ error: 'Scholarship Exam re-exam portal closed on 16th August 2026 at 10:00 PM IST.' }, { status: 403 });
    }

    const db = prisma as any;
    const now = new Date();

    // Check if registration exists
    const entry = await db.scholarshipEntry.findUnique({
      where: { registrationNo }
    });

    if (!entry) {
      return NextResponse.json({ error: 'Registration ID not found' }, { status: 404 });
    }

    // Verify mobile number matches
    if (entry.mobile !== mobile) {
      return NextResponse.json({ error: 'Mobile number does not match registration' }, { status: 400 });
    }

    // Verify payment status
    if (entry.paymentStatus !== 'PAID') {
      return NextResponse.json({ error: 'This registration has not paid the fee. Please pay first.' }, { status: 400 });
    }

    // Verify if already submitted
    if (entry.examSubmitted) {
      return NextResponse.json({ error: 'You have already attempted the exam. Each registration can only take the exam once.' }, { status: 400 });
    }

    if (action === 'send') {
      // Check daily limit for target
      const existing = await db.scholarshipOtp.findFirst({
        where: { target: mobile, type: 'exam' },
        orderBy: { createdAt: 'desc' }
      });

      if (existing && isSameDay(new Date(existing.lastSentAt), now) && existing.sendCount >= DAILY_LIMIT) {
        return NextResponse.json({ error: 'OTP limit reached for today. Try again tomorrow.' }, { status: 429 });
      }

      const newOtp = genOtp();
      const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MIN * 60 * 1000);

      if (existing && isSameDay(new Date(existing.lastSentAt), now)) {
        await db.scholarshipOtp.update({
          where: { id: existing.id },
          data: { otp: newOtp, expiresAt, sendCount: existing.sendCount + 1, lastSentAt: now, verified: false }
        });
      } else {
        await db.scholarshipOtp.create({
          data: { target: mobile, type: 'exam', otp: newOtp, expiresAt, sendCount: 1, lastSentAt: now }
        });
      }

      // Print to console (critical for server debugging)
      console.log(`[EXAM OTP] Mobile: ${mobile} Email: ${entry.email} OTP: ${newOtp}`);

      // Send via SMS and Email simultaneously
      const [smsResult, emailResult] = await Promise.allSettled([
        sendSMS(mobile, entry.name, newOtp),
        sendEmail(entry.email, entry.name, newOtp)
      ]);

      const smsSent = smsResult.status === 'fulfilled' && smsResult.value === true;
      const emailSent = emailResult.status === 'fulfilled';

      console.log(`[EXAM OTP DELIVERY] Mobile: ${mobile} SMS: ${smsSent ? 'OK' : 'FAILED'}, Email: ${emailSent ? 'OK' : 'FAILED'}`);

      // Email is the primary reliable channel; SMS may be delayed due to gateway issues
      const message = emailSent
        ? 'OTP has been sent to your registered email address. Please check your inbox (and spam folder). The same OTP will also work if received via SMS.'
        : 'OTP generated. Please check your registered email and mobile for the verification code.';

      return NextResponse.json({ success: true, message, smsSent, emailSent });
    }

    if (action === 'verify') {
      if (!otp) {
        return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
      }

      const record = await db.scholarshipOtp.findFirst({
        where: { target: mobile, type: 'exam' },
        orderBy: { createdAt: 'desc' }
      });

      if (!record) {
        return NextResponse.json({ error: 'No OTP sent for this number' }, { status: 400 });
      }

      if (new Date(record.expiresAt) < now) {
        return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
      }

      if (record.otp !== otp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
      }

      // Mark verified
      await db.scholarshipOtp.update({
        where: { id: record.id },
        data: { verified: true }
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('EXAM_VERIFY_ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
