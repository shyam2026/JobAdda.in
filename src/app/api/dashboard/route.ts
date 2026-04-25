import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const userSession = session?.user as { id: string } | undefined;
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = userSession.id;

    // Aggregate all stats
    const [user, appCount, appShortlisted, referralCount, profileData] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { walletBalance: true, referralCode: true, name: true }
      }),
      prisma.application.count({ where: { studentId: userId } }),
      prisma.application.count({ where: { studentId: userId, status: 'REVIEWING' } }),
      prisma.user.count({ where: { referredBy: { not: null } } }),
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          studentProfile: true,
          skills: true,
          educations: true,
          experiences: true,
          certificates: true,
        }
      })
    ]);

    if (!user || !profileData) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Get referrals by this user's code
    const myReferrals = await prisma.user.count({
      where: { referredBy: user.referralCode }
    });

    // Calculate profile completion
    let completion = 0;
    if (profileData.studentProfile?.bio) completion += 20;
    if (profileData.skills.length > 0) completion += 20;
    if (profileData.educations.length > 0) completion += 20;
    if (profileData.experiences.length > 0) completion += 20;
    if (profileData.certificates.length > 0) completion += 20;

    const recentApplications = await prisma.application.findMany({
      where: { studentId: userId },
      include: {
        job: {
          select: {
            title: true,
            location: true,
            company: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return NextResponse.json({
      stats: {
        walletBalance: user.walletBalance,
        applications: appCount,
        shortlisted: appShortlisted,
        referrals: myReferrals,
      },
      referralCode: user.referralCode,
      profileCompletion: completion,
      recentApplications,
    });
  } catch (error) {
    console.error("DASHBOARD_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
