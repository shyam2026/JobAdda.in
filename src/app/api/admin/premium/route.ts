import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUBADMIN' && user.role !== 'SUPERADMIN')) return null;
  return user;
}

export async function GET(req: Request) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all';
    const skip = (page - 1) * limit;
    const now = new Date();

    // Build where clause for premium users
    const whereClause: any = { isPremium: true };
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }
    if (filter === 'active') whereClause.premiumUntil = { gt: now };
    else if (filter === 'expired') {
      whereClause.premiumUntil = { lte: now };
    }

    const [users, totalUsers, allPremiumUsers] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true, name: true, email: true, phone: true,
          isPremium: true, premiumUntil: true,
          premiumResumeDownloads: true, createdAt: true,
        },
        orderBy: { premiumUntil: 'desc' },
        skip, take: limit,
      }),
      prisma.user.count({ where: whereClause }),
      prisma.user.findMany({
        where: { isPremium: true },
        select: { id: true, premiumUntil: true },
      }),
    ]);

    // Premium payment records — from Purchase table with refId containing PREMIUM
    // or from Transaction table with type containing PREMIUM
    const [premiumPayments, premiumTransactions] = await Promise.all([
      prisma.purchase.findMany({
        where: {
          status: 'COMPLETED',
          refId: { contains: 'PREMIUM' },
        },
        select: {
          id: true, userId: true, amount: true,
          createdAt: true, orderId: true, paymentId: true,
          couponCode: true, refId: true,
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }).catch(() => [] as any[]),

      prisma.transaction.findMany({
        where: { type: { contains: 'PREMIUM' }, status: 'COMPLETED' },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }).catch(() => [] as any[]),
    ]);

    // Merge and deduplicate by userId+date, prefer purchase records (have coupon info)
    const allTxMap = new Map<string, any>();
    premiumTransactions.forEach((t: any) => {
      allTxMap.set(t.id, {
        id: t.id, userId: t.userId, amount: t.amount,
        type: t.type, status: t.status, createdAt: t.createdAt,
        orderId: t.orderId || null, 
        paymentId: t.paymentId || null, 
        couponCode: t.couponCode || null, 
        refId: null,
        user: t.user,
      });
    });
    premiumPayments.forEach((p: any) => {
      allTxMap.set(`purch_${p.id}`, {
        id: p.id, userId: p.userId, amount: p.amount,
        type: 'PREMIUM_PURCHASE', status: 'COMPLETED', createdAt: p.createdAt,
        orderId: p.orderId, paymentId: p.paymentId,
        couponCode: p.couponCode, refId: p.refId,
        user: p.user,
      });
    });

    const allTransactions = Array.from(allTxMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 100);

    const couponUsedCount = allTransactions.filter(t => t.couponCode).length;
    const activeCount = allPremiumUsers.filter((u: any) => u.premiumUntil && new Date(u.premiumUntil) > now).length;
    const expiredCount = allPremiumUsers.length - activeCount;
    const totalRevenue = allTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);

    return NextResponse.json({
      users, totalUsers, activeCount, expiredCount,
      totalRevenue, couponUsedCount,
      transactions: allTransactions,
      page, totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error: any) {
    console.error("ADMIN_PREMIUM_GET_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId, action, premiumUntil } = await req.json();
    if (!userId || !action) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    let updateData: any = {};
    if (action === 'grant') {
      const expiryDate = premiumUntil ? new Date(premiumUntil) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      updateData = { isPremium: true, premiumUntil: expiryDate, premiumResumeDownloads: 0 };
    } else if (action === 'revoke') {
      updateData = { isPremium: false, premiumUntil: null };
    } else if (action === 'extend') {
      const u = await prisma.user.findUnique({ where: { id: userId }, select: { premiumUntil: true } });
      const base = u?.premiumUntil && new Date(u.premiumUntil) > new Date() ? new Date(u.premiumUntil) : new Date();
      const newExpiry = premiumUntil ? new Date(premiumUntil) : new Date(base.getTime() + 365 * 24 * 60 * 60 * 1000);
      updateData = { isPremium: true, premiumUntil: newExpiry };
    } else if (action === 'reset_downloads') {
      updateData = { premiumResumeDownloads: 0 };
    }

    const updated = await prisma.user.update({
      where: { id: userId }, data: updateData,
      select: { id: true, name: true, email: true, isPremium: true, premiumUntil: true, premiumResumeDownloads: true },
    });

    if (action !== 'reset_downloads') {
      await (prisma as any).notification.create({
        data: {
          userId,
          title: action === 'revoke' ? '⚠️ Premium Access Revoked' : '🌟 Premium Access Updated',
          message: action === 'revoke'
            ? 'Your premium membership has been revoked by the admin.'
            : `Your premium access has been ${action === 'grant' ? 'activated' : 'extended'} until ${new Date(updateData.premiumUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.`,
          type: 'SYSTEM',
        }
      });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error("ADMIN_PREMIUM_PATCH_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
