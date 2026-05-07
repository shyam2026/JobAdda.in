import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const userSession = session?.user as { id: string } | undefined;
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = userSession.id;

    // 1. Fetch User with all relations needed for calculations and matching
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        skills: true,
        educations: true,
        experiences: true,
        projects: true,
        certificates: true,
        applications: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            job: {
              select: {
                id: true,
                title: true,
                location: true,
                company: { select: { name: true } }
              }
            }
          }
        }
      } as any
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const u = user as any;
    const studentSkills = (u.skills || []).map((s: any) => s.name.toLowerCase());

    // 2. Calculate Profile Score (20% each)
    const hasBasic = u.studentProfile?.bio && u.studentProfile?.phone ? 20 : 0;
    const hasEdu = (u.educations || []).some((e: any) => e.school) ? 20 : 0;
    const hasExp = (u.experiences || []).some((e: any) => e.company) ? 20 : 0;
    const hasProj = (u.projects || []).some((p: any) => p.title) ? 20 : 0;
    const hasCert = (u.certificates || []).some((c: any) => c.name) ? 20 : 0;
    const profileScore = hasBasic + hasEdu + hasExp + hasProj + hasCert;

    // 3. Skill-Based Job Recommendations (Top 6)
    const allJobs = await prisma.job.findMany({
      where: { status: 'OPEN' },
      include: {
        company: { select: { name: true } }
      }
    });

    // Score jobs based on skill matches
    const recommendedJobs = allJobs
      .map((job: any) => {
        const jobRequirements = (job.requirements || '').toLowerCase();
        const jobTitle = job.title.toLowerCase();
        
        let matchCount = 0;
        studentSkills.forEach((skill: string) => {
          if (jobRequirements.includes(skill) || jobTitle.includes(skill)) {
            matchCount++;
          }
        });
        
        return { ...job, matchCount };
      })
      .sort((a: any, b: any) => b.matchCount - a.matchCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);

    // 4. Other Stats
    const totalApplications = await prisma.application.count({ where: { studentId: userId } });
    
    const successfulReferrals = await (prisma as any).transaction.findMany({
      where: { userId, type: 'REFERRAL_BONUS', status: 'COMPLETED' }
    });

    const totalReferralsCount = successfulReferrals.length;
    const totalEarnedAmount = successfulReferrals.reduce((sum: number, tx: any) => sum + tx.amount, 0);

    const totalJoined = await prisma.user.count({
      where: { referredBy: user.referralCode }
    });

    return NextResponse.json({
      walletBalance: user.walletBalance || 0,
      totalApplications,
      profileScore,
      totalReferrals: totalReferralsCount,
      referralCode: user.referralCode,
      recommendedJobs: recommendedJobs.map((j: any) => ({
        id: j.id,
        title: j.title,
        company: j.company.name,
        location: j.location,
        salary: j.salary,
        type: j.type,
        matchCount: j.matchCount
      })),
      recentApplications: u.applications.map((app: any) => ({
        id: app.id,
        jobId: app.job.id,
        title: app.job.title,
        company: app.job.company.name,
        location: app.job.location,
        status: app.status,
        createdAt: app.createdAt
      })),
      referralStats: {
        joined: totalJoined,
        earned: totalEarnedAmount,
        link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${user.referralCode}`
      }
    });

  } catch (error) {
    console.error("DASHBOARD_API_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
