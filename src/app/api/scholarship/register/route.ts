import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function genRegNo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'JA-';
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

async function sendRegistrationSMS(to: string, name: string, regNo: string) {
  const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Candidate';
  const username = process.env.SMS_USERNAME || 'gapsms01.trans';
  const password = process.env.SMS_PASSWORD || 'f_vRA68q';
  const from = process.env.SMS_FROM || 'JOADIN';

  const template = process.env.SMS_REG_TEMPLATE || 'Dear {Name} Your registration for JobAdda.in Scholarship Test is successful. Your Registration ID is {RegNo}. Team JobAdda.in';
  const dltContentId = process.env.SMS_REG_DLT_CONTENT_ID || '';
  const dltPrincipalEntityId = process.env.SMS_REG_DLT_PRINCIPAL_ENTITY_ID || '1701178116898320542';

  if (!dltContentId) {
    console.log('[SMS REGISTRATION - SKIPPED] SMS_REG_DLT_CONTENT_ID not configured.');
    return;
  }

  const msgText = template
    .replace('{Name}', cleanName)
    .replace('{RegNo}', regNo);

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
    console.log(`[SMS REGISTRATION - SENT] to: ${to}, response: ${data}`);
  } catch (error) {
    console.error(`[SMS REGISTRATION - ERROR] Failed to send registration SMS to ${to}:`, error);
  }
}

// POST → register new applicant
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, fatherName, aadharNo, mobile, email, district, state, lastQualification, marksPercent, careerGoal, passportImage } = body;

    if (!name || !fatherName || !mobile || !email || !district || !state || !lastQualification || !marksPercent || !careerGoal || !passportImage) {
      return NextResponse.json({ error: 'All fields required, including passport photo' }, { status: 400 });
    }

    const cleanAadhar = aadharNo ? String(aadharNo).trim() : '';

    const db = prisma as any;

    // Mobile OTP check has been made optional and bypassed as requested

    // Check if already registered
    const existing = await db.scholarshipEntry.findFirst({ where: { mobile } });
    if (existing) {
      return NextResponse.json({ error: 'Mobile already registered', registrationNo: existing.registrationNo, paid: existing.paymentStatus === 'PAID' }, { status: 409 });
    }

    let registrationNo = genRegNo();
    // Ensure uniqueness
    while (await db.scholarshipEntry.findUnique({ where: { registrationNo } })) {
      registrationNo = genRegNo();
    }

    const entry = await (db.scholarshipEntry as any).create({
      data: { name, fatherName, aadharNo: cleanAadhar, mobile, email, district, state, lastQualification, marksPercent, careerGoal, registrationNo, mobileVerified: true, emailVerified: true, passportImage },
    });

    // Send success SMS in the background
    sendRegistrationSMS(mobile, name, entry.registrationNo).catch(err => {
      console.error('Failed to send registration success SMS:', err);
    });

    return NextResponse.json({ success: true, registrationNo: entry.registrationNo });
  } catch (e: any) {
    console.error('SCHOLARSHIP_REGISTER_ERROR', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET /api/scholarship/register?lookup=REG_NO_OR_MOBILE
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lookup = searchParams.get('lookup');
  if (!lookup) return NextResponse.json({ error: 'Lookup required' }, { status: 400 });

  const db = prisma as any;
  const entry = await db.scholarshipEntry.findFirst({
    where: { OR: [{ registrationNo: lookup }, { mobile: lookup }] },
    select: { id: true, registrationNo: true, name: true, mobile: true, email: true, paymentStatus: true },
  });

  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(entry);
}
