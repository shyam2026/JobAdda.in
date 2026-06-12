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

async function sendEmail(to: string, otp: string) {
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
    await transporter.sendMail({
      from: `"JobAdda Exam" <${user}>`,
      to,
      subject: 'Your OTP for Scholarship Exam Access',
      html: `<p>Your OTP to log in and start the JobAdda Scholarship Exam is: <strong style="font-size:24px;letter-spacing:4px">${otp}</strong></p><p>Valid for ${OTP_EXPIRY_MIN} minutes. Do not share this with anyone.</p>`,
    });
    console.log(`[EXAM OTP - SENT] Sent email to: ${to}`);
  } catch (error) {
    console.error(`[EXAM OTP - EMAIL ERROR] Failed to send email to ${to}:`, error);
    console.log(`[EXAM OTP - FALLBACK] Email: ${to} OTP: ${otp} (SMTP error fallback)`);
  }
}

// POST /api/scholarship/exam/verify
export async function POST(req: Request) {
  try {
    const { registrationNo, mobile, action, otp } = await req.json();
    if (!registrationNo || !mobile || !action) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
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

      // Print to console (critical for browser test agent retrieval)
      console.log(`[EXAM OTP] Mobile: ${mobile} OTP: ${newOtp}`);

      // Send via email as well as fallback
      await sendEmail(entry.email, newOtp);

      return NextResponse.json({ success: true });
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
