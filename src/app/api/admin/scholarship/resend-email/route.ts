import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sendScholarshipConfirmationEmail } from '@/lib/scholarship-mail';

async function checkAdmin() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUBADMIN' && user.role !== 'SUPERADMIN')) return null;
  return user;
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { registrationNo } = await req.json();
    if (!registrationNo) {
      return NextResponse.json({ error: 'Registration number is required' }, { status: 400 });
    }

    const db = (await import('@/lib/prisma')).default as any;
    const entry = await db.scholarshipEntry.findUnique({
      where: { registrationNo }
    });

    if (!entry) {
      return NextResponse.json({ error: 'Candidate registration not found' }, { status: 404 });
    }

    if (entry.paymentStatus !== 'PAID') {
      return NextResponse.json({ error: 'Cannot send email for unpaid registrations' }, { status: 400 });
    }

    // Trigger the email sending utility
    await sendScholarshipConfirmationEmail(
      entry.email,
      entry.name,
      entry.mobile,
      entry.registrationNo
    );

    return NextResponse.json({ success: true, message: 'Confirmation email sent successfully' });
  } catch (error: any) {
    console.error('[ADMIN RESEND EMAIL ERROR]', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
