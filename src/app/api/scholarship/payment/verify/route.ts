import { NextResponse } from 'next/server';
import crypto from 'crypto';

// POST /api/scholarship/payment/verify
export async function POST(req: Request) {
  try {
    const { registrationNo, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, couponCode, free } = await req.json();

    const db = (await import('@/lib/prisma')).default as any;
    const entry = await db.scholarshipEntry.findUnique({ where: { registrationNo } });
    if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (!free) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(body).digest('hex');
      if (expected !== razorpay_signature) return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });
    }

    // Consume coupon
    if (couponCode) {
      await db.coupon.updateMany({ where: { code: couponCode.trim().toUpperCase() }, data: { usedCount: { increment: 1 } } });
    }

    await db.scholarshipEntry.update({
      where: { registrationNo },
      data: { paymentStatus: 'PAID', paymentId: razorpay_payment_id || 'FREE', orderId: razorpay_order_id || 'FREE', amount: amount || 0, couponCode: couponCode || null },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('SCHOLARSHIP_VERIFY_ERROR', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
