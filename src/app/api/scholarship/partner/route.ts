import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lookup = searchParams.get('lookup');
    if (!lookup) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const db = prisma as any;
    const cleanLookup = lookup.trim().toUpperCase();

    // Find the coupon in the database
    const coupon = await db.coupon.findFirst({
      where: {
        code: cleanLookup,
        target: 'SCHOLARSHIP'
      }
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Partner coupon code not found. Please verify the code.' }, { status: 404 });
    }

    // Count how many PAID registrations used this coupon code
    const count = await db.scholarshipEntry.count({
      where: {
        couponCode: coupon.code,
        paymentStatus: 'PAID'
      }
    });

    return NextResponse.json({
      success: true,
      couponCode: coupon.code,
      count: count
    });
  } catch (e: any) {
    console.error('PARTNER_LOOKUP_ERROR', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
