import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, contact, subject, message } = body;

    if (!name || !email || !contact || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 1. Save to Database
    const contactMessage = await (prisma as any).contactMessage.create({
      data: {
        name,
        email,
        contact,
        subject,
        message,
      },
    });

    // 2. Send Email (Configure this via ENV variables later if needed)
    try {
      // If SMTP details are provided in ENV, use them. Otherwise, we still successfully saved to DB.
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"JobAdda Contact Form" <${process.env.SMTP_USER}>`,
          to: "info@jobadda.in",
          subject: `New Contact Request: ${subject}`,
          html: `
            <h2>New Contact Message from JobAdda.in</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Contact No:</strong> ${contact}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <br/>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });
      } else {
        console.log("Email not sent: SMTP credentials missing in environment variables. Message saved to DB.");
      }
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // We don't fail the whole request if email fails, as DB save was successful
    }

    return NextResponse.json({ success: true, message: contactMessage }, { status: 201 });
  } catch (error) {
    console.error("CONTACT_POST_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
