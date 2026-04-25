import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { JobType } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";

const jobSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  location: z.string().min(2),
  salary: z.string().optional(),
  requirements: z.string().optional(),
  type: z.nativeEnum(JobType).optional().default(JobType.INTERNAL),
  externalLink: z.string().url().optional().or(z.literal('')),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const where: any = {
      status: 'OPEN',
      ...(q && { OR: [{ title: { contains: q } }, { description: { contains: q } }] }),
      ...(location && { location: { contains: location } }),
      ...(type && { type }),
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { company: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where })
    ]);

    return NextResponse.json({ jobs, total, pages: Math.ceil(total / limit), page });
  } catch (error) {
    console.error("JOBS_GET_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as { id: string; role: string } | undefined;

    if (!user || user.role !== 'COMPANY') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = jobSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
    }

    const { title, description, location, salary, requirements, type, externalLink } = result.data;

    const job = await prisma.job.create({
      data: {
        companyId: user.id,
        title, description, location,
        salary: salary || null,
        requirements: requirements || null,
        type: type as JobType || JobType.INTERNAL,
        externalLink: externalLink || null,
        status: 'OPEN',
      }
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("JOB_POST_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
