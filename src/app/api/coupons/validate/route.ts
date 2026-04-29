import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await (prisma as any).coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      type: coupon.type,        // "PERCENT" | "FREE"
      discount: coupon.discount, // e.g. 20 for 20%
      code: coupon.code,
    });
  } catch (error) {
    console.error('COUPON_VALIDATE_ERROR:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
