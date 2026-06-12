import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const ORIGINAL = 499;
const DISCOUNTED = 49;

// POST /api/scholarship/payment/order  body: { registrationNo, couponCode? }
export async function POST(req: Request) {
  try {
    const { registrationNo, couponCode } = await req.json();
    if (!registrationNo) return NextResponse.json({ error: 'Registration number required' }, { status: 400 });

    const db = (await import('@/lib/prisma')).default as any;
    const entry = await db.scholarshipEntry.findUnique({ where: { registrationNo } });
    if (!entry) return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    if (entry.paymentStatus === 'PAID') return NextResponse.json({ error: 'Already paid' }, { status: 409 });

    let amount = DISCOUNTED;

    // Apply coupon
    if (couponCode) {
      const coupon = await db.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } });
      const now = new Date();
      if (!coupon || !coupon.isActive || coupon.usedCount >= coupon.usageLimit || (coupon.expiresAt && new Date(coupon.expiresAt) < now)) {
        return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 });
      }
      if (coupon.type === 'FREE') amount = 0;
      else if (coupon.type === 'PERCENT' && coupon.discount) {
        amount = Math.max(0, DISCOUNTED - Math.floor((DISCOUNTED * coupon.discount) / 100));
      }
    }

    if (amount === 0) {
      return NextResponse.json({ free: true, registrationNo, amount: 0 });
    }

    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
    const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: registrationNo });
    return NextResponse.json({ orderId: order.id, amount, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (e: any) {
    console.error('SCHOLARSHIP_ORDER_ERROR', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
