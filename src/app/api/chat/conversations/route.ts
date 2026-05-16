import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;

    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify latest premium status from DB
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser?.isPremium) {
      return NextResponse.json({ error: 'Premium required for chat' }, { status: 403 });
    }

    const { companyId, jobId } = await req.json();

    if (!companyId) {
      return NextResponse.json({ error: 'Missing companyId' }, { status: 400 });
    }

    // MANDATORY: Verify that the student has applied for this job
    if (jobId) {
      const application = await prisma.application.findFirst({
        where: { studentId: user.id, jobId: jobId }
      });
      if (!application) {
        return NextResponse.json({ error: 'You must apply for this job before chatting with HR' }, { status: 403 });
      }
    }

    // Check if conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        studentId: user.id,
        companyId: companyId,
        jobId: jobId || undefined,
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          studentId: user.id,
          companyId: companyId,
          jobId: jobId || null,
        }
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('CHAT_CONVERSATION_POST_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // A student fetches their conversations, a company fetches theirs
    const whereClause = user.role === 'STUDENT' ? { studentId: user.id } : { companyId: user.id };

    // Auto-sync conversations for Premium students
    let isDbPremium = user.isPremium;
    if (user.role === 'STUDENT') {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      isDbPremium = dbUser?.isPremium;
    }

    if (user.role === 'STUDENT' && isDbPremium) {
      const applications = await prisma.application.findMany({
        where: { studentId: user.id, job: { type: 'INTERNAL' } },
        select: { jobId: true, job: { select: { companyId: true } } }
      });

      const existingConvs = await prisma.conversation.findMany({
        where: { studentId: user.id },
        select: { jobId: true }
      });
      const existingJobIds = new Set(existingConvs.map((c: any) => c.jobId));

      const appsToCreate = applications.filter((app: any) => !existingJobIds.has(app.jobId));
      if (appsToCreate.length > 0) {
        await prisma.conversation.createMany({
          data: appsToCreate.map((app: any) => ({
            studentId: user.id,
            companyId: app.job.companyId,
            jobId: app.jobId
          }))
        });
      }
    }

    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        student: { select: { id: true, name: true, studentProfile: true } },
        company: { select: { id: true, companyName: true, logo: true } },
        job: { select: { id: true, title: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get latest message for preview
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('CHAT_CONVERSATION_GET_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
