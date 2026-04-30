import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;

    // Passive cleanup: delete expired notifications
    try {
      await (prisma as any).notification.deleteMany({
        where: {
          userId,
          expiresAt: { lt: new Date() }
        }
      });
    } catch (e) {
      console.error("NOTIFICATION_CLEANUP_ERROR", e);
    }

    const notifications = await (prisma as any).notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("NOTIFICATIONS_GET_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();

    if (id === "all") {
      await (prisma as any).notification.updateMany({
        where: { userId: (session.user as any).id },
        data: { isRead: true },
      });
    } else {
      await (prisma as any).notification.update({
        where: { id, userId: (session.user as any).id },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("NOTIFICATIONS_PATCH_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id === "all") {
      await (prisma as any).notification.deleteMany({ where: { userId } });
    } else if (id) {
      await (prisma as any).notification.deleteMany({ where: { id, userId } });
    } else {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("NOTIFICATIONS_DELETE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
