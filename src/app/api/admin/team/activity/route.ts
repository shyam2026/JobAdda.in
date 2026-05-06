import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as any;
    if (user?.portalType !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = req.nextUrl.searchParams.get("adminId");
    if (!adminId) {
      return NextResponse.json({ error: "adminId is required" }, { status: 400 });
    }

    const [jobs, companies] = await Promise.all([
      (prisma.job as any).findMany({
        where: { createdByAdminId: adminId },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          company: { select: { companyName: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      (prisma.companyUser as any).findMany({
        where: { createdByAdminId: adminId },
        select: {
          id: true,
          slug: true,
          companyName: true,
          industry: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({ jobs, companies });
  } catch (error: any) {
    console.error("TEAM_ACTIVITY_ERROR", error);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}
