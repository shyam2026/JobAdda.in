import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

async function isAdmin(session: any) {
  if (!session || (session.user as any)?.portalType !== 'admin') return false;
  const admin = await (prisma as any).adminUser.findUnique({
    where: { email: session?.user?.email as string }
  });
  if (!admin) return false;
  return true;
}

// GET /api/admin/coupons — list all coupons
export async function GET() {
  try {
    const session = await auth();
    if (!(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const coupons = await (prisma as any).coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error('ADMIN_COUPONS_GET_ERROR:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/coupons — create a coupon
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code, type, discount, usageLimit, expiresAt, target } = await req.json();

    if (!code || !type) {
      return NextResponse.json({ error: 'Code and type are required' }, { status: 400 });
    }

    if (type === 'PERCENT' && (!discount || discount <= 0 || discount > 100)) {
      return NextResponse.json({ error: 'Discount must be between 1 and 100 for PERCENT coupons' }, { status: 400 });
    }

    const coupon = await (prisma as any).coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        type,
        discount: type === 'PERCENT' ? parseInt(discount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : 100,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        target: target || 'ALL',
      },
    });

    return NextResponse.json(coupon);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });
    }
    console.error('ADMIN_COUPONS_POST_ERROR:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
