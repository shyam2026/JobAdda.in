import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function genRegNo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'JA-';
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

// POST → register new applicant
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, fatherName, aadharNo, mobile, email, district, state, lastQualification, marksPercent, careerGoal, passportImage } = body;

    if (!name || !fatherName || !aadharNo || !mobile || !email || !district || !state || !lastQualification || !marksPercent || !careerGoal || !passportImage) {
      return NextResponse.json({ error: 'All fields required, including passport photo' }, { status: 400 });
    }

    const cleanAadhar = aadharNo.replace(/\s/g, '');
    if (cleanAadhar.length !== 12 || !/^\d+$/.test(cleanAadhar)) {
      return NextResponse.json({ error: 'Aadhar Number must be exactly 12 numeric digits' }, { status: 400 });
    }

    const db = prisma as any;

    // Verify both OTPs were verified
    const mobileOtp = await db.scholarshipOtp.findFirst({ where: { target: mobile, type: 'mobile' }, orderBy: { createdAt: 'desc' } });
    const emailOtp = await db.scholarshipOtp.findFirst({ where: { target: email, type: 'email' }, orderBy: { createdAt: 'desc' } });

    if (!mobileOtp?.verified) return NextResponse.json({ error: 'Mobile OTP not verified' }, { status: 400 });
    if (!emailOtp?.verified) return NextResponse.json({ error: 'Email OTP not verified' }, { status: 400 });

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
