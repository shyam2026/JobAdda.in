import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SCHOLARSHIP_QUESTIONS } from '@/lib/scholarship-questions';

// POST /api/scholarship/exam/submit
export async function POST(req: Request) {
  try {
    const { registrationNo, mobile, answers } = await req.json();
    if (!registrationNo || !mobile || !answers) {
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

    if (entry.examSubmitted) {
      return NextResponse.json({ error: 'Exam has already been submitted for this registration' }, { status: 400 });
    }

    // Load questions
    const questions = SCHOLARSHIP_QUESTIONS;

    let examAttempted = 0;
    let examCorrect = 0;
    let examWrong = 0;

    let mathCorrect = 0;
    let mathWrong = 0;

    let reasoningCorrect = 0;
    let reasoningWrong = 0;

    let caCorrect = 0;
    let caWrong = 0;

    // Evaluate answers
    questions.forEach((q) => {
      const selectedIndex = answers[q.id.toString()];
      if (selectedIndex !== undefined && selectedIndex !== null && selectedIndex !== '') {
        const selected = Number(selectedIndex);
        examAttempted++;
        const isCorrect = selected === q.answerIndex;

        if (isCorrect) {
          examCorrect++;
          if (q.subject === 'Mathematics') mathCorrect++;
          else if (q.subject === 'Reasoning & Aptitude') reasoningCorrect++;
          else if (q.subject === 'Current Affairs') caCorrect++;
        } else {
          examWrong++;
          if (q.subject === 'Mathematics') mathWrong++;
          else if (q.subject === 'Reasoning & Aptitude') reasoningWrong++;
          else if (q.subject === 'Current Affairs') caWrong++;
        }
      }
    });

    // Score calculations
    const examNegativeMarks = examWrong * 0.25;
    const examScore = examCorrect - examNegativeMarks;

    const examMathScore = mathCorrect - (mathWrong * 0.25);
    const examReasoningScore = reasoningCorrect - (reasoningWrong * 0.25);
    const examCaScore = caCorrect - (caWrong * 0.25);

    // Save exam result to DB
    await db.scholarshipEntry.update({
      where: { registrationNo },
      data: {
        examScore,
        examSubmitted: true,
        examAttempted,
        examCorrect,
        examWrong,
        examNegativeMarks,
        examMathScore,
        examReasoningScore,
        examCaScore,
        examAnswers: JSON.stringify(answers)
      }
    });

    // Invalidate/consume the OTP record
    const otpRecord = await db.scholarshipOtp.findFirst({
      where: { target: mobile, type: 'exam', verified: true },
      orderBy: { createdAt: 'desc' }
    });

    if (otpRecord) {
      await db.scholarshipOtp.update({
        where: { id: otpRecord.id },
        data: { verified: false }
      });
    }

    return NextResponse.json({
      success: true,
      score: examScore,
      correct: examCorrect,
      wrong: examWrong,
      attempted: examAttempted
    });
  } catch (error: any) {
    console.error('EXAM_SUBMIT_ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
