import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const TEMPLATE_SEEDS = [
  { id: 'TPL_1', name: 'Basic', price: 15 },
  { id: 'TPL_2', name: 'Professional', price: 30 },
  { id: 'TPL_3', name: 'Premium', price: 50 },
];

async function ensureTemplates() {
  for (const t of TEMPLATE_SEEDS) {
    await (prisma as any).resumeTemplate.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    });
  }
}

// Download window = 5 minutes
const WINDOW_MS = 5 * 60 * 1000;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cutoff = new Date(Date.now() - WINDOW_MS);

    // Only return purchases made within the last 5 minutes
    const purchases = await prisma.purchase.findMany({
      where: {
        userId: (session.user as any).id,
        status: "COMPLETED",
        createdAt: { gte: cutoff },
      },
      select: { templateId: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    // Return with expiresAt so the client can show countdown
    return NextResponse.json(
      purchases.map(p => ({
        templateId: p.templateId,
        expiresAt: new Date(p.createdAt.getTime() + WINDOW_MS).toISOString(),
      }))
    );
  } catch (error) {
    console.error("RESUME_PURCHASES_GET_ERROR", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { templateId, amount } = await req.json();
    const userId = (session.user as any).id;

    await ensureTemplates();

    // Check if still within active window
    const cutoff = new Date(Date.now() - WINDOW_MS);
    const existing = await prisma.purchase.findFirst({
      where: { userId, templateId, status: "COMPLETED", createdAt: { gte: cutoff } },
    });
    if (existing) {
      return NextResponse.json({
        message: "Already purchased",
        expiresAt: new Date(existing.createdAt.getTime() + WINDOW_MS).toISOString(),
        templateId,
      });
    }

    // Create a new purchase (each payment = new 5-min window)
    const purchase = await prisma.purchase.create({
      data: { userId, templateId, amount, status: "COMPLETED" },
    });

    return NextResponse.json({
      templateId: purchase.templateId,
      expiresAt: new Date(purchase.createdAt.getTime() + WINDOW_MS).toISOString(),
    });
  } catch (error) {
    console.error("RESUME_PURCHASE_POST_ERROR", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
