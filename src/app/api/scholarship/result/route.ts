import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lookup = searchParams.get('lookup');
    if (!lookup) {
      return NextResponse.json({ error: 'Search value is required' }, { status: 400 });
    }

    const db = prisma as any;
    // Find the candidate from the Independence Day (15 Aug) campaign using mobile or registration number
    const candidate = await db.scholarshipEntry.findFirst({
      where: {
        OR: [
          { registrationNo: lookup },
          { mobile: lookup }
        ],
        campaign: 'INDEPENDENCE'
      }
    });

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found. Please verify the mobile number or Registration ID.' }, { status: 404 });
    }

    // Check if the exam has been submitted
    if (!candidate.examSubmitted || candidate.examScore === null) {
      return NextResponse.json({
        success: true,
        candidate: {
          name: candidate.name,
          mobile: candidate.mobile,
          email: candidate.email,
          registrationNo: candidate.registrationNo
        },
        examSubmitted: false,
        error: 'Exam not submitted / No result available'
      });
    }

    const currentScore = candidate.examScore;
    const currentReasoning = candidate.examReasoningScore ?? 0;
    const currentMath = candidate.examMathScore ?? 0;
    const currentCa = candidate.examCaScore ?? 0;
    const currentCreatedAt = candidate.createdAt;

    // Tie-breaking rank calculation based on Merit & Tie-Breaking Rules:
    // 1. Higher overall examScore
    // 2. Higher score in Reasoning (examReasoningScore)
    // 3. Higher score in Mathematics (examMathScore)
    // 4. Higher score in Current Affairs (examCaScore)
    // 5. Earlier application submission date (createdAt)
    // Only among Independence Day campaign candidates
    const higherScoreCount = await db.scholarshipEntry.count({
      where: {
        paymentStatus: 'PAID',
        examSubmitted: true,
        campaign: 'INDEPENDENCE',
        OR: [
          {
            examScore: {
              gt: currentScore
            }
          },
          {
            examScore: currentScore,
            examReasoningScore: {
              gt: currentReasoning
            }
          },
          {
            examScore: currentScore,
            examReasoningScore: currentReasoning,
            examMathScore: {
              gt: currentMath
            }
          },
          {
            examScore: currentScore,
            examReasoningScore: currentReasoning,
            examMathScore: currentMath,
            examCaScore: {
              gt: currentCa
            }
          },
          {
            examScore: currentScore,
            examReasoningScore: currentReasoning,
            examMathScore: currentMath,
            examCaScore: currentCa,
            createdAt: {
              lt: currentCreatedAt
            }
          }
        ]
      }
    });

    const rank = higherScoreCount + 101;

    // Return only rank — no exam scores, correct/wrong counts
    return NextResponse.json({
      success: true,
      examSubmitted: true,
      candidate: {
        name: candidate.name,
        mobile: candidate.mobile,
        email: candidate.email,
        registrationNo: candidate.registrationNo
      },
      rank
    });
  } catch (e: any) {
    console.error('SCHOLARSHIP_RESULT_ERROR', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
