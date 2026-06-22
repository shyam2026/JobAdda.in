import { NextResponse } from 'next/server';
import crypto from 'crypto';

// POST /api/scholarship/payment/verify
export async function POST(req: Request) {
  try {
    const { registrationNo, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, couponCode, free } = await req.json();

    const db = (await import('@/lib/prisma')).default as any;
    const entry = await db.scholarshipEntry.findUnique({ where: { registrationNo } });
    if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (free) {
      if (!couponCode) {
        return NextResponse.json({ error: 'Coupon code is required for free registrations' }, { status: 400 });
      }
      const coupon = await db.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } });
      const now = new Date();
      if (!coupon || !coupon.isActive || coupon.usedCount >= coupon.usageLimit || (coupon.expiresAt && new Date(coupon.expiresAt) < now)) {
        return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 });
      }
      const isFreeType = coupon.type === 'FREE';
      const is100PercentDiscount = coupon.type === 'PERCENT' && coupon.discount === 100;
      if (!isFreeType && !is100PercentDiscount) {
        return NextResponse.json({ error: 'Coupon does not grant free registration' }, { status: 400 });
      }
    } else {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(body).digest('hex');
      if (expected !== razorpay_signature) return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });
    }

    // Consume coupon
    if (couponCode) {
      await db.coupon.updateMany({ where: { code: couponCode.trim().toUpperCase() }, data: { usedCount: { increment: 1 } } });
    }

    const updatedEntry = await db.scholarshipEntry.update({
      where: { registrationNo },
      data: { paymentStatus: 'PAID', paymentId: razorpay_payment_id || 'FREE', orderId: razorpay_order_id || 'FREE', amount: amount || 0, couponCode: couponCode || null },
    });

    // Send confirmation email in the background
    const { sendScholarshipConfirmationEmail } = await import('@/lib/scholarship-mail');
    sendScholarshipConfirmationEmail(updatedEntry.email, updatedEntry.name, updatedEntry.mobile, updatedEntry.registrationNo).catch(err => {
      console.error('Failed to send scholarship confirmation email:', err);
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('SCHOLARSHIP_VERIFY_ERROR', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
