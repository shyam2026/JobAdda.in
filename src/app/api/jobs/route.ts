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
  category: z.string().optional().default('Other'),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const education = searchParams.get('education') || '';
    const workMode = searchParams.get('workMode') || '';
    const postedDate = searchParams.get('postedDate') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const where: any = { status: 'OPEN' };

    if (q) where.OR = [{ title: { contains: q } }, { description: { contains: q } }, { location: { contains: q } }];
    if (location) where.location = { contains: location };
    if (category) where.category = category;
    if (education) where.education = { contains: education };

    if (type) {
      if (type === 'INTERNAL' || type === 'EXTERNAL') {
        where.type = type;
      } else {
        where.employmentType = { contains: type };
      }
    }

    if (workMode) {
      const workModeMap: Record<string, string[]> = {
        'Remote': ['Remote', 'Full-time (WFH)', 'Part-time (WFH)', 'Contract (WFH)'],
        'Hybrid': ['Hybrid'],
        'On-site': ['Full-time', 'Part-time', 'Contract', 'Internship'],
      };
      const modes = workModeMap[workMode];
      if (modes && !type) where.employmentType = { in: modes };
    }

    if (postedDate) {
      const now = new Date();
      let fromDate: Date | null = null;
      if (postedDate === 'today') {
        fromDate = new Date(); fromDate.setHours(0,0,0,0);
      } else if (postedDate === '3days') {
        fromDate = new Date(Date.now() - 3 * 86400000);
      } else if (postedDate === '7days') {
        fromDate = new Date(Date.now() - 7 * 86400000);
      } else if (postedDate === '14days') {
        fromDate = new Date(Date.now() - 14 * 86400000);
      } else if (postedDate === '30days') {
        fromDate = new Date(Date.now() - 30 * 86400000);
      } else if (postedDate.includes('|')) {
        const [from, to] = postedDate.split('|');
        where.createdAt = { gte: new Date(from), lte: new Date(to + 'T23:59:59Z') };
      }
      if (fromDate) where.createdAt = { gte: fromDate };
    }

    const [jobs, total] = await Promise.all([
      (prisma.job as any).findMany({
        where,
        include: {
          company: { select: { id: true, slug: true as any, companyName: true, logo: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      (prisma.job as any).count({ where })
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
    const user = session?.user as { id: string; role: string; portalType?: string } | undefined;

    if (!user || user.portalType !== 'company') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = jobSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
    }

    const { title, description, location, salary, requirements, type, externalLink, category } = result.data;

    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let idLength = 6;
    let customJobId = '';
    let job = null;
    let attempts = 0;

    while (!job) {
      customJobId = '';
      for (let i = 0; i < idLength; i++) {
        customJobId += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // Proactively check if ID exists to handle collisions before creation
      const exists = await (prisma.job as any).findUnique({ where: { id: customJobId } });
      if (exists) {
        attempts++;
        if (attempts >= 5) {
          idLength++; // Increase length if 6-digit space is crowded
          attempts = 0;
        }
        continue;
      }

      try {
        job = await (prisma.job as any).create({
          data: {
            id: customJobId,
            companyId: user.id,
            title, description, location,
            salary: salary || null,
            requirements: requirements || null,
            type: type as JobType || JobType.INTERNAL,
            externalLink: externalLink || null,
            category: category || 'Other',
            status: 'OPEN',
          }
        });
      } catch (e: any) {
        if (e.code === 'P2002') {
          attempts++;
          if (attempts >= 5) {
            idLength++;
            attempts = 0;
          }
        } else {
          throw e;
        }
      }
    }

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("JOB_POST_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
