import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userSession = session?.user as { id: string } | undefined;
    if (!userSession?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let templateId: string | undefined;
    try {
      const body = await req.json();
      templateId = body?.templateId;
    } catch (e) {
      return NextResponse.json({ error: "Invalid or empty JSON body" }, { status: 400 });
    }

    if (!templateId) return NextResponse.json({ error: "Template ID is required" }, { status: 400 });

    // 1. Fetch user to check premium and remaining downloads
    const user = await prisma.user.findUnique({
      where: { id: userSession.id }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (!user.isPremium) return NextResponse.json({ error: "Premium membership required" }, { status: 403 });
    if (user.premiumResumeDownloads >= 5) {
      return NextResponse.json({ error: "Premium template download limit (5) reached" }, { status: 403 });
    }

    // 2. Check if there is an active completed purchase (within the 5-minute download window)
    const WINDOW_MS = 5 * 60 * 1000;
    const cutoff = new Date(Date.now() - WINDOW_MS);

    const activeExisting = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        templateId,
        status: "COMPLETED",
        createdAt: { gte: cutoff }
      }
    });

    if (activeExisting) {
      return NextResponse.json({ error: "Template already unlocked and active" }, { status: 400 });
    }

    // 3. Process claim: Update user and create purchase
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { premiumResumeDownloads: { increment: 1 } }
      }),
      prisma.purchase.create({
        data: {
          userId: user.id,
          templateId,
          amount: 0,
          status: "COMPLETED",
          refId: "PREMIUM_CLAIM"
        }
      }),
      (prisma as any).notification.create({
        data: {
          userId: user.id,
          title: "🎉 Template Unlocked!",
          message: `You've used your Premium membership to unlock the ${templateId === 'TPL_2' ? 'Professional' : 'Premium'} template. (${user.premiumResumeDownloads + 1}/5 used)`,
          type: "SYSTEM"
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "Template unlocked successfully",
      remaining: 5 - (user.premiumResumeDownloads + 1)
    });

  } catch (error) {
    console.error("PREMIUM_CLAIM_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
