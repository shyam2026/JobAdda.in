import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// POST: Create a new job
export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;
    if (user?.portalType !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      companyId, 
      title, 
      description, 
      location, 
      salary, 
      requirements, 
      type, 
      category,
      externalLink,
      openings,
      education,
      experience,
      skills
    } = body;

    if (!companyId || !title || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        companyId,
        title,
        description,
        location,
        salary,
        requirements,
        type: type || 'INTERNAL',
        category: category || 'Other',
        employmentType: body.employmentType || 'Full-time',
        externalLink,
        openings: openings ? parseInt(openings, 10) : 1,
        education,
        experience,
        skills,
        status: 'OPEN'
      } as any
    });

    return NextResponse.json({ message: "Job posted successfully", job });
  } catch (error: any) {
    console.error("CREATE_JOB_ERROR", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// GET: List all jobs (for admin view)
export async function GET() {
  try {
    const session = await auth();
    const user = session?.user as any;
    if (user?.portalType !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await (prisma.job as any).findMany({
      include: {
        company: { select: { companyName: true, slug: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
