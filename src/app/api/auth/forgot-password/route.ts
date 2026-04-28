import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Verify user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "No account found with this email address." }, { status: 404 });
    }

    // 2. Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Diagnostic: Check if model exists
    console.log("Available Prisma models:", Object.keys(prisma));

    // 3. Store token (Clean up old tokens for this email first)
    await (prisma as any).passwordResetToken.deleteMany({
      where: { email }
    });

    await (prisma as any).passwordResetToken.create({
      data: { email, token, expires }
    });

    // 4. Send Email
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password/${token}`;

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
          user: "no-reply@jobadda.in",
          pass: "No@JobAdda0"
        },
        tls: {
          rejectUnauthorized: false // Helps with some shared hosting SSL issues
        }
      });

      await transporter.sendMail({
        from: '"JobAdda.in" <no-reply@jobadda.in>',
        to: email,
        subject: "Reset Your Password - JobAdda.in",
        html: `
          <div style="background-color: #030712; color: #f8fafc; font-family: 'Outfit', sans-serif; padding: 50px 20px; text-align: center;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #090e1a; border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; padding: 45px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
              
              <div style="margin-bottom: 35px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">JobAdda<span style="color: #6366f1;">.in</span></h1>
              </div>

              <div style="text-align: left; margin-bottom: 10px;">
                <h2 style="font-size: 20px; color: #ffffff; font-weight: 700; margin-bottom: 15px;">Reset your password</h2>
                <p style="color: #94a3b8; line-height: 1.6; font-size: 15px; margin: 0;">Hi ${user.name || 'User'}, we received a request to reset your password. No worries, click the button below to get back into your account securely.</p>
              </div>

              <div style="text-align: left; margin-bottom: 35px;">
                <p style="color: #94a3b8; line-height: 1.6; font-size: 15px; margin: 0;">If you did not request this, please ignore this email.</p>
              </div>

              <div style="margin-bottom: 40px;">
                <a href="${resetUrl}" style="display: block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; padding: 16px; border-radius: 14px; font-weight: 700; font-size: 16px; text-decoration: none; box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);">Reset Password</a>
              </div>

              <div style="height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 30px;"></div>

              <div style="text-align: left;">
                <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">Best regards,</p>
                <p style="margin: 4px 0 0; font-size: 16px; font-weight: 700; color: #6366f1;">Team JobAdda.in</p>
              </div>
            </div>

            <div style="margin-top: 35px; color: #475569; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0;">Noida, UP, India &bull; &copy; 2026 JobAdda.in</p>
              <p style="margin: 5px 0 0; opacity: 0.7;">This is an automated security email, please do not reply.</p>
            </div>
          </div>
        `
      });
    } catch (mailError) {
      console.error("MAIL_SEND_ERROR", mailError);
      return NextResponse.json({ error: "Failed to send reset email. Please contact support." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Reset link sent to your email." });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
