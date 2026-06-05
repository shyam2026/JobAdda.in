import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const userSession = session?.user as { id: string; role: string; portalType: string } | undefined;

    if (!userSession || userSession.portalType !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      include: { 
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            referralCode: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const userIds = Array.from(new Set(transactions.map((t: any) => t.userId)));
    
    // Fetch total referral bonus earned for each user
    const referralEarnings = await prisma.transaction.groupBy({
      by: ['userId'],
      where: {
        userId: { in: userIds },
        type: 'REFERRAL_BONUS',
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    const userReferralCodes = transactions.map((t: any) => t.user?.referralCode).filter(Boolean) as string[];
    const referralSignups = await prisma.user.groupBy({
      by: ['referredBy'],
      where: {
        referredBy: { in: userReferralCodes }
      },
      _count: {
        id: true
      }
    });

    const enrichedTransactions = transactions.map((t: any) => {
      const earnings = referralEarnings.find((e: any) => e.userId === t.userId);
      const signups = referralSignups.find((s: any) => s.referredBy === t.user?.referralCode);
      return {
        ...t,
        referralStats: {
          totalEarned: earnings?._sum?.amount || 0,
          successfulCount: earnings?._count?.id || 0,
          signupCount: signups?._count?.id || 0
        }
      };
    });

    return NextResponse.json(enrichedTransactions);
  } catch (error) {
    console.error("ADMIN_TRANSACTIONS_LIST_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
