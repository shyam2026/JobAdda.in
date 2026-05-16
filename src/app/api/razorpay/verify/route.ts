import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const refId = 'REF-' + Math.random().toString(36).toUpperCase().slice(2, 8);
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      templateId,
      amount,
      couponCode,
      type
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || amount === undefined) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    if (!templateId && type !== 'PREMIUM') {
      return NextResponse.json({ error: 'Missing template ID or purchase type' }, { status: 400 });
    }

    // Skip signature verification for free (coupon-100%) purchases
    const isFreeOrder = razorpay_order_id === 'FREE_COUPON';

    if (!isFreeOrder) {
      // Verify Razorpay signature
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Grant access (5-minute window)
    const userId = (session.user as any).id;
    const WINDOW_MS = 5 * 60 * 1000;

    // Consume coupon if provided
    if (couponCode) {
      const c = await (prisma as any).coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() }
      });
      if (!c || !c.isActive || (c.expiresAt && new Date(c.expiresAt) < new Date()) || c.usedCount >= c.usageLimit) {
        return NextResponse.json({ error: "Coupon no longer valid" }, { status: 400 });
      }
      await (prisma as any).coupon.update({
        where: { id: c.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Handle Premium Upgrade
    if (type === 'PREMIUM') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          premiumUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 Year premium
        }
      });

      await (prisma as any).transaction.create({
        data: {
          userId,
          amount: parseFloat(amount),
          type: `PREMIUM_UPGRADE`,
          status: 'COMPLETED',
          couponCode: couponCode || null,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        }
      });

      await (prisma as any).notification.create({
        data: {
          userId,
          title: 'Premium Activated! ⭐',
          message: `Your account has been upgraded to Premium! You can now chat directly with HR. Reference ID: ${refId}.`,
          type: 'SUCCESS',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Premium activated successfully',
        refId: refId
      });
    }

    // Handle Resume Template Purchase
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        templateId,
        amount: parseFloat(amount),
        status: 'COMPLETED',
        couponCode: couponCode || null,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        refId: refId,
      } as any,
    });

    const templateLabel = templateId === 'TPL_1' ? 'Basic' : templateId === 'TPL_2' ? 'Professional' : 'Premium';

    // Create Success Notification (Digital Receipt)
    await (prisma as any).notification.create({
      data: {
        userId,
        title: 'Payment Successful',
        message: `Template "${templateLabel}" unlocked! Reference ID: ${refId}. You have 5 minutes to download.`,
        type: 'SUCCESS',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days
      }
    });

    return NextResponse.json({
      templateId: purchase.templateId,
      expiresAt: new Date(purchase.createdAt.getTime() + WINDOW_MS).toISOString(),
      message: 'Payment verified and access granted',
      refId: refId
    });
  } catch (error: any) {
    console.error('RAZORPAY_VERIFY_ERROR:', error);
    
    // Create Failure Notification for Student
    try {
      const session = await auth();
      if (session?.user) {
        await (prisma as any).notification.create({
          data: {
            userId: (session.user as any).id,
            title: 'Payment Issue Detected',
            message: `Verification failed. If money was deducted, please contact support with Reference ID: ${refId}. Error: ${error.message || 'Verification Error'}`,
            type: 'DANGER',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days
          }
        });
      }
    } catch (nError) {
      console.error('FAILED_TO_CREATE_FAILURE_NOTIFICATION', nError);
    }

    return NextResponse.json({ 
      error: 'Failed to verify payment: ' + (error.message || 'Unknown error'),
      refId: refId 
    }, { status: 500 });
  }
}
