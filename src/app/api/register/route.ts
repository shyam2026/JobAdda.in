import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is too short"),
  contact: z.string().min(10, "Invalid contact number"),
  role: z.enum(["STUDENT", "COMPANY", "ADMIN"]).optional().default("STUDENT"),
  referredBy: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
    }

    const { email, password, name, contact, role, referredBy } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate referral code: First 3 letters of name + 4 random alphanumeric chars
    const namePrefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase().padEnd(3, 'J');
    const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";
    for (let i = 0; i < 4; i++) {
      randomPart += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    const referralCode = `${namePrefix}${randomPart}`;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: contact, // Saved from contact field in registration form
        role,
        referralCode,
        referredBy: referredBy || 'ITJO0VIW',
        walletBalance: 0
      }
    });

    // Notify Referrer (if not default)
    if (referredBy) {
      try {
        const referrer = await prisma.user.findUnique({
          where: { referralCode: referredBy }
        });

        if (referrer) {
          await (prisma as any).notification.create({
            data: {
              userId: referrer.id,
              title: "🎉 New Referral Join!",
              message: `${name} just joined JobAdda using your link! You'll earn a bonus once they complete their profile and apply for their first job.`,
              type: "REFERRAL",
              link: "/user/refer"
            }
          });
        }
      } catch (e) {
        console.error("REFERRAL_JOIN_NOTIFICATION_ERROR", e);
      }

    }

    // Notify Joining User (Conditional message)
    try {
      const isReferral = !!referredBy;
      await (prisma as any).notification.create({
        data: {
          userId: user.id,
          title: "👋 Welcome to JobAdda!",
          message: isReferral 
            ? `You joined via a referral link. Complete your profile and apply for your first job to help your friend earn a bonus!`
            : `We're excited to have you here! Complete your profile to get personalized job recommendations and start applying.`,
          type: "SYSTEM",
          link: "/user/profile"
        }
      });
    } catch (e) {
      console.error("WELCOME_NOTIFICATION_ERROR", e);
    }

    return NextResponse.json({ 
      message: "User created successfully", 
      referralCode: user.referralCode 
    }, { status: 201 });
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

