import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

async function sendSMS(to: string, name: string, otp: string) {
  const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Candidate';
  const msgText = `Dear ${cleanName} Your OTP for JobAdda.in Scholarship Registration is ${otp}. Please do not share this OTP with anyone. This OTP is valid for 10 Minutes. Team JobAdda.in`;

  const username = process.env.SMS_USERNAME || 'gapsms01.trans';
  const password = process.env.SMS_PASSWORD || 'f_vRA68q';
  const from = process.env.SMS_FROM || 'JOADIN';
  const dltContentId = process.env.SMS_DLT_CONTENT_ID || '1707178185523758730';
  const dltPrincipalEntityId = process.env.SMS_DLT_PRINCIPAL_ENTITY_ID || '1701178116898320542';

  const url = new URL('https://pgapi.sparc.smartping.io/fe/api/v1/send');
  url.searchParams.set('username', username);
  url.searchParams.set('password', password);
  url.searchParams.set('unicode', 'false');
  url.searchParams.set('from', from);
  url.searchParams.set('text', msgText);
  url.searchParams.set('to', to);
  url.searchParams.set('dltContentId', dltContentId);
  url.searchParams.set('dltPrincipalEntityId', dltPrincipalEntityId);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'accept': 'application/json' }
    });
    const data = await res.text();
    console.log(`[SMS OTP - SENT] to: ${to}, response: ${data}`);
  } catch (error) {
    console.error(`[SMS OTP - ERROR] Failed to send SMS to ${to}:`, error);
  }
}

// POST /api/scholarship/otp  body: { target, type: 'mobile'|'email', action: 'send'|'verify', otp?, name? }
export async function POST(req: Request) {
  try {
    const { target, type, action, otp, name, purpose } = await req.json();
    if (!target || !type || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const db = prisma as any;
    const now = new Date();

    if (action === 'send') {
      if (type === 'mobile' && purpose !== 'recovery') {
        const alreadyRegistered = await db.scholarshipEntry.findFirst({
          where: { mobile: target }
        });
        if (alreadyRegistered) {
          return NextResponse.json({
            error: 'This mobile number is already registered. If you already registered, please click "Already Registered?" to retrieve your details.'
          }, { status: 400 });
        }
      }

      // Check 60s delay and daily limit
      const existing = await db.scholarshipOtp.findFirst({
        where: { target, type },
        orderBy: { createdAt: 'desc' },
      });

      if (existing) {
        const timeDiff = now.getTime() - new Date(existing.lastSentAt).getTime();
        if (timeDiff < 60 * 1000) {
          const waitTime = Math.ceil((60 * 1000 - timeDiff) / 1000);
          return NextResponse.json({ error: `Please wait ${waitTime} seconds before requesting another OTP.` }, { status: 429 });
        }

        if (isSameDay(new Date(existing.lastSentAt), now) && existing.sendCount >= DAILY_LIMIT) {
          return NextResponse.json({ error: `OTP limit reached. Try again tomorrow.`, remaining: 0 }, { status: 429 });
        }
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
      if (type === 'mobile') {
        const displayName = name || 'Candidate';
        await sendSMS(target, displayName, newOtp);
      } else {
        console.log(`[SCHOLARSHIP OTP - UNUSED EMAIL] ${target} OTP: ${newOtp}`);
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
