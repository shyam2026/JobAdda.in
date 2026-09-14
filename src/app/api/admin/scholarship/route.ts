import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import * as XLSX from 'xlsx';

async function checkAdmin() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUBADMIN' && user.role !== 'SUPERADMIN')) return null;
  return user;
}

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter') || 'all';
  const examFilter = searchParams.get('examFilter') || 'all';
  const sortBy = searchParams.get('sortBy') || 'date_desc';
  const search = searchParams.get('search') || '';
  const collector = searchParams.get('collector') || '';
  const export_ = searchParams.get('export') === 'xlsx';
  const campaign = searchParams.get('campaign') || 'DIWALI';

  const db = (await import('@/lib/prisma')).default as any;

  const where: any = { campaign };
  if (filter === 'paid') where.paymentStatus = 'PAID';
  if (filter === 'unpaid') where.paymentStatus = 'PENDING';
  if (filter === 'cash') {
    where.paymentStatus = 'PAID';
    where.paymentId = { startsWith: 'CASH_' };
    if (collector && collector !== 'all') {
      where.cashCollectedBy = collector;
    }
  }
  if (examFilter === 'completed') where.examSubmitted = true;
  if (examFilter === 'pending') where.examSubmitted = false;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { mobile: { contains: search } },
      { email: { contains: search } },
      { registrationNo: { contains: search } },
    ];
  }

  const entries = await db.scholarshipEntry.findMany({ where, orderBy: { createdAt: 'desc' } });

  // Calculate dynamic rank for exam participants within the campaign
  const allSubmitted = await db.scholarshipEntry.findMany({
    where: { examSubmitted: true, campaign },
    select: { registrationNo: true, examScore: true, examReasoningScore: true, examMathScore: true, examCaScore: true, createdAt: true }
  });

  allSubmitted.sort((a: any, b: any) => {
    if ((b.examScore || 0) !== (a.examScore || 0)) {
      return (b.examScore || 0) - (a.examScore || 0);
    }
    if ((b.examReasoningScore || 0) !== (a.examReasoningScore || 0)) {
      return (b.examReasoningScore || 0) - (a.examReasoningScore || 0);
    }
    if ((b.examMathScore || 0) !== (a.examMathScore || 0)) {
      return (b.examMathScore || 0) - (a.examMathScore || 0);
    }
    if ((b.examCaScore || 0) !== (a.examCaScore || 0)) {
      return (b.examCaScore || 0) - (a.examCaScore || 0);
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const rankMap: Record<string, number> = {};
  allSubmitted.forEach((e: any, idx: number) => {
    rankMap[e.registrationNo] = idx + 101;
  });

  // Attach rank to original entries
  entries.forEach((e: any) => {
    if (e.examSubmitted) {
      e.rank = rankMap[e.registrationNo] || null;
    } else {
      e.rank = null;
    }
  });

  // Sort final entries
  if (sortBy === 'date_desc') {
    entries.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === 'date_asc') {
    entries.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy === 'score_desc') {
    entries.sort((a: any, b: any) => {
      if (a.examSubmitted && b.examSubmitted) {
        return (a.rank || 999999) - (b.rank || 999999);
      }
      if (a.examSubmitted) return -1;
      if (b.examSubmitted) return 1;
      return 0;
    });
  } else if (sortBy === 'score_asc') {
    entries.sort((a: any, b: any) => {
      if (a.examSubmitted && b.examSubmitted) {
        return (b.rank || 999999) - (a.rank || 999999);
      }
      if (a.examSubmitted) return 1;
      if (b.examSubmitted) return -1;
      return 0;
    });
  } else if (sortBy === 'name_asc') {
    entries.sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  if (export_) {
    const rows = entries.map((e: any) => ({
      'Registration No': e.registrationNo,
      Name: e.name,
      "Father's Name": e.fatherName || '',
      'Aadhar/PAN/Voter ID': e.aadharNo || '',
      Mobile: e.mobile,
      Email: e.email,
      District: e.district,
      State: e.state,
      Qualification: e.lastQualification,
      'Marks %': e.marksPercent,
      'Career Goal': e.careerGoal,
      'Payment Status': e.paymentStatus,
      'Payment Mode': e.paymentId?.startsWith('CASH_') ? 'Cash' : (e.paymentStatus === 'PAID' ? 'Online' : '-'),
      'Cash Collected By': e.cashCollectedBy || '',
      Amount: e.amount || '',
      'Coupon Used': e.couponCode || '',
      'Exam Taken': e.examSubmitted ? 'Yes' : 'No',
      'Attempted': e.examSubmitted ? e.examAttempted : '',
      'Correct': e.examSubmitted ? e.examCorrect : '',
      'Wrong': e.examSubmitted ? e.examWrong : '',
      'Negative Marks': e.examSubmitted ? e.examNegativeMarks : '',
      'Total Score': e.examSubmitted ? e.examScore : '',
      'Merit Rank': e.examSubmitted ? e.rank : '',
      'Math Score': e.examSubmitted ? e.examMathScore : '',
      'Reasoning Score': e.examSubmitted ? e.examReasoningScore : '',
      'CA Score': e.examSubmitted ? e.examCaScore : '',
      'Email Sent': e.emailSent ? 'Yes' : 'No',
      'Registered At': new Date(e.createdAt).toLocaleString('en-IN'),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scholarship');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return new Response(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="scholarship_registrations.xlsx"',
      },
    });
  }

  const total = await db.scholarshipEntry.count({ where: { campaign } });
  const paid = await db.scholarshipEntry.count({ where: { paymentStatus: 'PAID', campaign } });
  const cashPaid = await db.scholarshipEntry.count({ where: { paymentStatus: 'PAID', paymentId: { startsWith: 'CASH_' }, campaign } });
  
  const examAttemptedCount = await db.scholarshipEntry.count({ where: { examSubmitted: true, campaign } });
  const scoreAggregate = await db.scholarshipEntry.aggregate({
    where: { examSubmitted: true, campaign },
    _avg: { examScore: true },
    _max: { examScore: true }
  });
  const averageScore = scoreAggregate._avg.examScore || 0;
  const highestScore = scoreAggregate._max.examScore || 0;

  // Fetch unique names of admins who have collected cash
  const collectorsData = await db.scholarshipEntry.findMany({
    where: {
      paymentStatus: 'PAID',
      paymentId: { startsWith: 'CASH_' },
      cashCollectedBy: { not: null },
      campaign
    },
    distinct: ['cashCollectedBy'],
    select: {
      cashCollectedBy: true
    }
  });
  const collectors = collectorsData.map((c: any) => c.cashCollectedBy).filter(Boolean);

  return NextResponse.json({ 
    entries, 
    total, 
    paid, 
    unpaid: total - paid, 
    cashPaid,
    examAttemptedCount, 
    averageScore, 
    highestScore,
    collectors
  });
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { registrationNo, paymentId, orderId, amount, couponCode } = await req.json();

    if (!registrationNo || !paymentId) {
      return NextResponse.json({ error: 'Registration number and Payment ID are required' }, { status: 400 });
    }

    const db = (await import('@/lib/prisma')).default as any;
    const entry = await db.scholarshipEntry.findUnique({ where: { registrationNo } });
    if (!entry) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Update the database entry to match online paid
    const updatedEntry = await db.scholarshipEntry.update({
      where: { registrationNo },
      data: {
        paymentStatus: 'PAID',
        paymentId: paymentId.trim(),
        orderId: orderId?.trim() || 'manual_order',
        amount: amount !== undefined ? Number(amount) : 49,
        couponCode: couponCode?.trim() || null
      }
    });

    // Send confirmation email in the background
    const { sendScholarshipConfirmationEmail } = await import('@/lib/scholarship-mail');
    sendScholarshipConfirmationEmail(updatedEntry.email, updatedEntry.name, updatedEntry.mobile, updatedEntry.registrationNo).catch(err => {
      console.error('Failed to send scholarship confirmation email:', err);
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('ADMIN_SCHOLARSHIP_MARK_PAID_ERROR', e);
    return NextResponse.json({ error: 'Server error: ' + e.message }, { status: 500 });
  }
}
