import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { z } from "zod";

const checkoutSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  receipt: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const result = checkoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
    }

    // Razorpay integration (requires env vars RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)
    try {
      const Razorpay = require("razorpay");
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const { amount, currency, receipt } = result.data;
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      });

      return NextResponse.json(order);
    } catch {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 });
    }
  } catch (error) {
    console.error("PAYMENT_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
