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

type Params = { params: Promise<{ id: string }> };

// PATCH /api/admin/coupons/[id] — toggle active
export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { isActive } = await req.json();

    const coupon = await (prisma as any).coupon.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('ADMIN_COUPON_PATCH_ERROR:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/admin/coupons/[id] — delete a coupon
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await (prisma as any).coupon.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ADMIN_COUPON_DELETE_ERROR:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
