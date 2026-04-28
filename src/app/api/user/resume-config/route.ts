import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const config = await (prisma as any).resumeConfig.findUnique({
      where: { userId: (session.user as any).id },
    });

    return NextResponse.json(config || {
      showBio: true,
      showPhone: true,
      showEmail: true,
      showSkills: true,
      showEdu: true,
      showExp: true,
      showProjects: true,
      showSocials: true,
      selectedTemplate: "T1"
    });
  } catch (error) {
    console.error("RESUME_CONFIG_GET_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const userId = (session.user as any).id;

    const config = await (prisma as any).resumeConfig.upsert({
      where: { userId },
      update: body,
      create: { ...body, userId },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("RESUME_CONFIG_PATCH_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
