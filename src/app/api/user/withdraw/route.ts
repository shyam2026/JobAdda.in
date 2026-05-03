import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userSession = session?.user as { id: string } | undefined;

    if (!userSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, note } = await req.json();

    if (!amount || amount < 500) {
      return NextResponse.json({ error: "Minimum withdrawal amount is ₹500" }, { status: 400 });
    }

    if (!note || note.length < 5) {
      return NextResponse.json({ error: "Please provide valid payment details (UPI ID or Bank Details)" }, { status: 400 });
    }

    // Use transaction to ensure balance is deducted and record created safely
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userSession.id },
        select: { walletBalance: true }
      });

      if (!user || user.walletBalance < amount) {
        throw new Error("Insufficient wallet balance");
      }

      // Deduct balance immediately
      await tx.user.update({
        where: { id: userSession.id },
        data: { walletBalance: { decrement: amount } }
      });

      // Create PENDING withdrawal transaction
      const transaction = await tx.transaction.create({
        data: {
          userId: userSession.id,
          amount,
          type: 'WITHDRAWAL',
          status: 'PENDING',
          note: note
        }
      });

      return transaction;
    });

    return NextResponse.json({ success: true, transaction: result });
  } catch (error: any) {
    console.error("WITHDRAW_API_ERROR", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
