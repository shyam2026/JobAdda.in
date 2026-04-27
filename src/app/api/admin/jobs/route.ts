import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    // Verify it's an admin
    if (!session || (session.user as any).portalType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await (prisma as any).adminUser.findUnique({
      where: { email: session?.user?.email as string }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admins need access to 'jobs' or 'all' to post
    let allowedModules: string[] = [];
    try { allowedModules = admin.modules ? JSON.parse(admin.modules) : []; } catch (e) {}
    
    if (admin.role !== 'SUPERADMIN' && !allowedModules.includes('all') && !allowedModules.includes('jobs')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();
    
    if (!data.companyId || !data.title || !data.location || !data.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create job assigned to the selected company
    const job = await prisma.job.create({
      data: {
        companyId: data.companyId,
        title: data.title,
        location: data.location,
        salary: data.salary || null,
        type: data.type === 'Internal' ? 'INTERNAL' : 'EXTERNAL', 
        description: data.description,
        requirements: data.requirements || null,
        status: 'OPEN',
        category: data.category || 'Other'
      } as any
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Failed to create job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
