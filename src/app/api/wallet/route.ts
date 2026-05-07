import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const userSession = session?.user as { id: string } | undefined;
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userSession.id },
      select: { walletBalance: true, referralCode: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const transactions = await prisma.transaction.findMany({
      where: { userId: userSession.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Get referred users and their potential bonuses
    const referredUsersRaw = await prisma.user.findMany({
      where: { referredBy: user.referralCode },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        applications: { select: { id: true }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get all referral bonus transactions for these users
    const referralTransactions = await (prisma.transaction as any).findMany({
      where: {
        userId: userSession.id,
        type: 'REFERRAL_BONUS',
        triggeredById: { in: referredUsersRaw.map((u: any) => u.id) }
      },
      select: { amount: true, triggeredById: true }
    });

    const referredUsers = referredUsersRaw.map((u: any) => {
      const tx = (referralTransactions as any[]).find((t: any) => t.triggeredById === u.id);
      return {
        ...u,
        earnedAmount: tx ? tx.amount : null
      };
    });

    return NextResponse.json({
      balance: user.walletBalance,
      referralCode: user.referralCode,
      transactions,
      referredUsers,
    });
  } catch (error) {
    console.error("WALLET_API_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
