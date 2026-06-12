import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ applied: false });
    }

    const entry = await (prisma as any).scholarshipEntry.findFirst({
      where: {
        email: session.user.email,
        paymentStatus: 'PAID'
      }
    });

    return NextResponse.json({ applied: !!entry });
  } catch (error) {
    console.error('CHECK_APPLIED_ERROR', error);
    return NextResponse.json({ applied: false });
  }
}
