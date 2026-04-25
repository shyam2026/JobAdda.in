import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const applicationSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as { id: string; role: string } | undefined;

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: "Unauthorized. Only students can apply." }, { status: 401 });
    }

    const body = await req.json();
    const result = applicationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
    }

    const { jobId, coverLetter } = result.data;

    const existing = await prisma.application.findFirst({
      where: { jobId, studentId: user.id }
    });
    if (existing) return NextResponse.json({ error: "Already applied" }, { status: 409 });

    const application = await prisma.application.create({
      data: {
        jobId,
        studentId: user.id,
        status: 'PENDING',
        resumeUrl: coverLetter || null,
      }
    });

    // Credit referral bonus to referrer on first application
    const student = await prisma.user.findUnique({
      where: { id: user.id },
      select: { referredBy: true }
    });

    if (student?.referredBy) {
      const referrer = await prisma.user.findFirst({
        where: { referralCode: student.referredBy }
      });
      if (referrer) {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: referrer.id },
            data: { walletBalance: { increment: 50 } }
          }),
          prisma.transaction.create({
            data: {
              userId: referrer.id,
              amount: 50,
              type: 'REFERRAL_BONUS',
              status: 'COMPLETED'
            }
          })
        ]);
      }
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("APPLICATION_POST_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user as { id: string; role: string } | undefined;

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const where = user.role === 'STUDENT'
      ? { studentId: user.id }
      : { job: { companyId: user.id } };

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            salary: true,
            type: true,
            company: { select: { name: true } }
          }
        },
        student: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("APPLICATION_GET_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
