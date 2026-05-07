import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userSession = session?.user as { id: string; role: string; portalType: string } | undefined;

    if (!userSession || userSession.portalType !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!['COMPLETED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (transaction.status !== 'PENDING') {
      return NextResponse.json({ error: "Transaction is already processed" }, { status: 400 });
    }

    const updatedTransaction = await prisma.$transaction(async (tx: any) => {
      // If rejected, refund the balance to the user
      if (status === 'REJECTED' && transaction.type === 'WITHDRAWAL') {
        await tx.user.update({
          where: { id: transaction.userId },
          data: { walletBalance: { increment: transaction.amount } }
        });
      }

      return await tx.transaction.update({
        where: { id },
        data: { status }
      });
    });

    return NextResponse.json(updatedTransaction);
  } catch (error: any) {
    console.error("ADMIN_TRANSACTION_PATCH_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
