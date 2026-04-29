import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, templateId } = await req.json();

    if (!amount || !templateId) {
      return NextResponse.json({ error: 'Missing amount or templateId' }, { status: 400 });
    }

    const options: any = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: String(session.user.id),
        templateId: templateId,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error('RAZORPAY_ORDER_ERROR:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
