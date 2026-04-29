import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

async function isAdmin(session: any) {
  if (!session || (session.user as any)?.portalType !== 'admin') return false;
  const admin = await (prisma as any).adminUser.findUnique({
    where: { email: session?.user?.email as string }
  });
  return !!admin;
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let where: any = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const purchases = await (prisma as any).purchase.findMany({
      where,
      include: {
        user: {
          include: {
            studentProfile: {
              select: {
                phone: true
              }
            }
          }
        },
        template: {
          select: {
            name: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 500, // Increased limit for larger searches
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error('ADMIN_PURCHASES_GET_ERROR:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
