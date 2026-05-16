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

    // Profile Completion Check (100% Requirement)
    const fullProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        studentProfile: true,
        skills: true,
        educations: true,
        experiences: true,
        projects: true,
      } as any
    });

    if (!fullProfile) return NextResponse.json({ error: "User profile not found" }, { status: 404 });

    // Use any casting for properties to bypass temporary Prisma type lag
    const p = fullProfile as any;
    // Check if eligible (40% required: EVERY field in Basic Info + Education must be filled)
    const hasBasic = p.studentProfile?.bio && 
                     p.studentProfile?.phone && 
                     p.studentProfile?.location && 
                     p.studentProfile?.linkedin && 
                     p.studentProfile?.github;
                     
    const hasEdu = p.educations?.some((e: any) => 
                     e.school && 
                     e.degree && 
                     e.grade && 
                     e.description
                   );
                   
    const isEligible = hasBasic && hasEdu;

    if (!isEligible) {
      return NextResponse.json({ 
        error: "Profile Incomplete", 
        details: "You must complete at least 40% of your profile (Basic Info and Education) before applying." 
      }, { status: 403 });
    }

    // Check if job is still accepting applications
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { status: true }
    });
    if (!job || job.status !== 'OPEN') {
      return NextResponse.json({ error: "Job is no longer accepting applications." }, { status: 400 });
    }

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
      // Check if this is the student's FIRST EVER application on the platform
      const previousAppsCount = await prisma.application.count({
        where: { studentId: user.id }
      });

      // If count is 1, it means the application we just created is their first one
      if (previousAppsCount === 1) {
        const referrer = await prisma.user.findFirst({
          where: { referralCode: student.referredBy }
        });

        if (referrer) {
          // Determine global referral rank to check for 100th/1000th bonus tiers
          const globalReferralCount = await prisma.transaction.count({
            where: { type: 'REFERRAL_BONUS', status: 'COMPLETED' }
          }) + 1;

          let bonusAmount = 0;
          if (globalReferralCount % 1000 === 0) {
            // Every 1000th referral: ₹20 to ₹25
            bonusAmount = Math.floor(Math.random() * (25 - 20 + 1)) + 20;
          } else if (globalReferralCount % 100 === 0) {
            // Every 100th referral: ₹10 to ₹20
            bonusAmount = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
          } else {
            // Standard referral: ₹5 to ₹10
            bonusAmount = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
          }

          await prisma.$transaction([
            prisma.user.update({
              where: { id: referrer.id },
              data: { walletBalance: { increment: bonusAmount } }
            }),
            (prisma.transaction as any).create({
              data: {
                userId: referrer.id,
                triggeredById: user.id,
                amount: bonusAmount,
                type: 'REFERRAL_BONUS',
                status: 'COMPLETED'
              }
            }),
            (prisma as any).notification.create({
              data: {
                userId: referrer.id,
                title: "💸 Referral Bonus Credited!",
                message: `You earned ₹${bonusAmount} because ${fullProfile.name || 'a friend'} applied for their first job!`,
                type: "REFERRAL",
                link: "/user/wallet"
              }
            })
          ]);
        }
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
            company: { select: { name: true, companyName: true, logo: true } }
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
