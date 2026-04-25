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

    // Get referred users
    const referredUsers = await prisma.user.findMany({
      where: { referredBy: user.referralCode },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        applications: { select: { id: true } }
      },
      orderBy: { createdAt: 'desc' }
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
