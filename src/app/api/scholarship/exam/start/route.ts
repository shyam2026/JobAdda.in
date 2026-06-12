import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SCHOLARSHIP_QUESTIONS } from '@/lib/scholarship-questions';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// POST /api/scholarship/exam/start
export async function POST(req: Request) {
  try {
    const { registrationNo, mobile } = await req.json();
    if (!registrationNo || !mobile) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const db = prisma as any;

    // Check if registration exists and matches mobile
    const entry = await db.scholarshipEntry.findUnique({
      where: { registrationNo }
    });

    if (!entry) {
      return NextResponse.json({ error: 'Registration ID not found' }, { status: 404 });
    }

    if (entry.mobile !== mobile) {
      return NextResponse.json({ error: 'Mobile number does not match registration' }, { status: 400 });
    }

    if (entry.paymentStatus !== 'PAID') {
      return NextResponse.json({ error: 'Fee payment is pending' }, { status: 400 });
    }

    if (entry.examSubmitted) {
      return NextResponse.json({ error: 'You have already submitted the exam' }, { status: 400 });
    }

    // Verify they have a verified OTP record
    const otpRecord = await db.scholarshipOtp.findFirst({
      where: { target: mobile, type: 'exam', verified: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Access unauthorized. Please verify OTP first.' }, { status: 401 });
    }

    // Strip answers from questions
    const clientQuestions = SCHOLARSHIP_QUESTIONS.map(q => ({
      id: q.id,
      subject: q.subject,
      question: q.question,
      options: q.options
    }));

    // Shuffle questions
    const shuffled = shuffleArray(clientQuestions);

    return NextResponse.json({
      success: true,
      questions: shuffled
    });
  } catch (error: any) {
    console.error('EXAM_START_ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
