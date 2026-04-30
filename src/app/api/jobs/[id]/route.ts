import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            logo: true,
            companyName: true,
            hq: true,
            size: true,
            type: true,
            website: true,
            bio: true,
          }
        },
        applications: { select: { id: true } }
      }
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("JOB_GET_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const user = session?.user as { id: string; role: string } | undefined;

    if (!user || (user.role !== 'COMPANY' && user.role !== 'ADMIN' && user.role !== 'SUBADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Only enforce companyId ownership if user is a COMPANY
    const where: any = { id };
    if (user.role === 'COMPANY') {
      where.companyId = user.id;
    }

    const job = await prisma.job.update({
      where,
      data: body
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("JOB_PATCH_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
