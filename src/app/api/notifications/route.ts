import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const userSession = session?.user as { id: string } | undefined;
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Generate notifications from actual DB events
    const [applications, transactions] = await Promise.all([
      prisma.application.findMany({
        where: { studentId: userSession.id },
        include: {
          job: {
            select: { title: true, company: { select: { name: true } } }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.transaction.findMany({
        where: { userId: userSession.id, type: 'REFERRAL_BONUS' },
        orderBy: { createdAt: 'desc' },
        take: 5,
      })
    ]);

    const notifications = [
      ...applications.map((app) => ({
        id: `app-${app.id}`,
        type: 'application',
        title: statusTitle(app.status),
        message: `${app.job.company.name} — ${app.job.title}`,
        time: timeAgo(app.createdAt),
        read: app.status !== 'REVIEWING',
        color: statusColor(app.status),
        icon: 'Briefcase',
      })),
      ...transactions.map((tx) => ({
        id: `tx-${tx.id}`,
        type: 'referral',
        title: 'Referral Bonus Credited',
        message: `₹${tx.amount} added to your wallet!`,
        time: timeAgo(tx.createdAt),
        read: true,
        color: '#10b981',
        icon: 'Gift',
      }))
    ].sort((a, b) => 0); // already ordered from DB

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("NOTIFICATIONS_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function statusTitle(status: string) {
  const map: Record<string, string> = {
    PENDING: 'Application Submitted',
    REVIEWING: 'Application Shortlisted!',
    HIRED: 'Offer Extended! 🎉',
    REJECTED: 'Application Closed',
  };
  return map[status] || 'Application Update';
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    PENDING: '#6366f1',
    REVIEWING: '#10b981',
    HIRED: '#10b981',
    REJECTED: '#ef4444',
  };
  return map[status] || '#6366f1';
}

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
