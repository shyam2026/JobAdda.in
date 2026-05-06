import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const user = session?.user as { id: string; role: string } | undefined;

    const allowedRoles = ['COMPANY', 'ADMIN', 'SUBADMIN', 'SUPERADMIN'];
    if (!user || !allowedRoles.includes(String(user.role).toUpperCase())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();
    if (!status) return NextResponse.json({ error: "Status is required" }, { status: 400 });

    // Update application
    const application = await prisma.application.update({
      where: { id },
      data: { status: status as any },
      include: {
        job: { select: { title: true } },
        student: { select: { id: true, name: true } }
      }
    });

    // Create Notification for the student
    const statusMessages: Record<string, { title: string, msg: string }> = {
      REVIEWING: { 
        title: "📄 Application Shortlisted!", 
        msg: `Your application for "${application.job.title}" has been shortlisted for review.` 
      },
      HIRED: { 
        title: "🎉 Congratulations! You're Hired!", 
        msg: `Good news! You have been selected for the "${application.job.title}" position.` 
      },
      REJECTED: { 
        title: "⚠️ Application Update", 
        msg: `The employer has decided not to move forward with your application for "${application.job.title}".` 
      }
    };

    const notificationContent = statusMessages[status] || { 
      title: "💼 Application Update", 
      msg: `The status of your application for "${application.job.title}" has been updated to ${status}.` 
    };

    await (prisma as any).notification.create({
      data: {
        userId: application.studentId,
        title: notificationContent.title,
        message: notificationContent.msg,
        type: "JOB_STATUS",
        link: "/user/applied-jobs"
      }
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("APPLICATION_PATCH_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
