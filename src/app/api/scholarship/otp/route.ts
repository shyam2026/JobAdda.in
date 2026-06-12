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
    console.log(`[SCHOLARSHIP OTP - FALLBACK] Email: ${to} OTP: ${otp} (SMTP credentials missing)`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"JobAdda Scholarship" <${user}>`,
      to,
      subject: 'Your OTP for Scholarship Registration',
      html: `<p>Your OTP for JobAdda Scholarship Test registration is: <strong style="font-size:24px;letter-spacing:4px">${otp}</strong></p><p>Valid for ${OTP_EXPIRY_MIN} minutes. Do not share with anyone.</p>`,
    });
    console.log(`[SCHOLARSHIP OTP - SENT] Sent email to: ${to}`);
  } catch (error) {
    console.error(`[SCHOLARSHIP OTP - EMAIL ERROR] Failed to send email to ${to}:`, error);
    console.log(`[SCHOLARSHIP OTP - FALLBACK] Email: ${to} OTP: ${otp} (SMTP error fallback)`);
  }
}

// POST /api/scholarship/otp  body: { target, type: 'mobile'|'email', action: 'send'|'verify', otp? }
export async function POST(req: Request) {
  try {
    const { target, type, action, otp } = await req.json();
    if (!target || !type || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const db = prisma as any;
    const now = new Date();

    if (action === 'send') {
      // Check daily limit
      const existing = await db.scholarshipOtp.findFirst({
        where: { target, type },
        orderBy: { createdAt: 'desc' },
      });

      if (existing && isSameDay(new Date(existing.lastSentAt), now) && existing.sendCount >= DAILY_LIMIT) {
        return NextResponse.json({ error: `OTP limit reached. Try again tomorrow.`, remaining: 0 }, { status: 429 });
      }

      const newOtp = genOtp();
      const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MIN * 60 * 1000);

      if (existing && isSameDay(new Date(existing.lastSentAt), now)) {
        await db.scholarshipOtp.update({
          where: { id: existing.id },
          data: { otp: newOtp, expiresAt, sendCount: existing.sendCount + 1, lastSentAt: now, verified: false },
        });
      } else {
        await db.scholarshipOtp.create({
          data: { target, type, otp: newOtp, expiresAt, sendCount: 1, lastSentAt: now },
        });
      }

      // Send OTP
      if (type === 'email') {
        await sendEmail(target, newOtp);
      } else {
        // SMS: log for now (integrate SMS gateway here)
        console.log(`[SCHOLARSHIP OTP] Mobile: ${target} OTP: ${newOtp}`);
      }

      const record = await db.scholarshipOtp.findFirst({ where: { target, type }, orderBy: { createdAt: 'desc' } });
      const remaining = DAILY_LIMIT - (record?.sendCount || 1);
      return NextResponse.json({ success: true, remaining });
    }

    if (action === 'verify') {
      if (!otp) return NextResponse.json({ error: 'OTP required' }, { status: 400 });
      const record = await db.scholarshipOtp.findFirst({
        where: { target, type },
        orderBy: { createdAt: 'desc' },
      });
      if (!record) return NextResponse.json({ error: 'No OTP sent' }, { status: 400 });
      if (new Date(record.expiresAt) < now) return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
      if (record.otp !== otp) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
      await db.scholarshipOtp.update({ where: { id: record.id }, data: { verified: true } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e: any) {
    console.error('SCHOLARSHIP_OTP_ERROR', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET /api/scholarship/otp?target=&type=  → remaining count for today
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('target');
  const type = searchParams.get('type');
  if (!target || !type) return NextResponse.json({ remaining: DAILY_LIMIT });

  const db = prisma as any;
  const record = await db.scholarshipOtp.findFirst({ where: { target, type }, orderBy: { createdAt: 'desc' } });
  const now = new Date();
  if (!record || !isSameDay(new Date(record.lastSentAt), now)) return NextResponse.json({ remaining: DAILY_LIMIT });
  return NextResponse.json({ remaining: Math.max(0, DAILY_LIMIT - record.sendCount) });
}
