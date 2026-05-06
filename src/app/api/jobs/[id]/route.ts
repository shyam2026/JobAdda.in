import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    const include: any = {
      company: {
        select: {
          id: true,
          slug: true,
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
      _count: {
        select: { applications: true }
      }
    };

    if (userId) {
      include.applications = {
        where: { studentId: userId },
        select: { id: true }
      };
    }

    const job = await (prisma.job as any).findUnique({
      where: { id },
      include
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Map to result object
    const result = {
      ...job,
      isApplied: !!(job.applications && job.applications.length > 0),
      // We provide a dummy array with the correct length to satisfy the frontend .length check
      applications: Array(job._count?.applications || 0).fill({ id: 'dummy' }),
      _count: undefined
    };

    return NextResponse.json(result);
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
    const user = session?.user as { id: string; role: string; portalType?: string } | undefined;

    const allowedRoles = ['COMPANY', 'ADMIN', 'SUBADMIN', 'SUPERADMIN'];
    if (!user || !allowedRoles.includes(String(user.role).toUpperCase())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Sanitize update payload to ensure strict prisma type safety
    const updateData: any = {};
    if (body.companyId !== undefined) updateData.companyId = body.companyId;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.salary !== undefined) updateData.salary = body.salary;
    if (body.requirements !== undefined) updateData.requirements = body.requirements;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.externalLink !== undefined) updateData.externalLink = body.externalLink;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.employmentType !== undefined) updateData.employmentType = body.employmentType;
    if (body.education !== undefined) updateData.education = body.education;
    if (body.experience !== undefined) updateData.experience = body.experience;
    if (body.skills !== undefined) updateData.skills = body.skills;

    if (body.openings !== undefined && body.openings !== null && body.openings !== "") {
      const parsed = parseInt(body.openings, 10);
      updateData.openings = isNaN(parsed) ? 1 : parsed;
    } else if (body.openings === "" || body.openings === null) {
      updateData.openings = 1;
    }
    
    // Only enforce companyId ownership if user is a COMPANY
    const where: any = { id };
    if (user.role === 'COMPANY') {
      where.companyId = user.id;
    }

    const job = await (prisma.job as any).update({
      where,
      data: updateData
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("JOB_PATCH_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const user = session?.user as { id: string; role: string } | undefined;

    const allowedRoles = ['ADMIN', 'SUBADMIN', 'SUPERADMIN'];
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = { id };
    
    // If not admin, must be the owner COMPANY
    if (!allowedRoles.includes(String(user.role).toUpperCase())) {
      if (user.role === 'COMPANY') {
        where.companyId = user.id;
      } else {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    await prisma.job.delete({ where });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("JOB_DELETE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
