import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const userSession = session?.user as { id: string } | undefined;
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userSession.id },
      include: {
        studentProfile: true,
        skills: true,
        educations: true,
        experiences: true,
        certificates: true,
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      bio: user.studentProfile?.bio || '',
      phone: user.studentProfile?.phone || '',
      city: user.studentProfile?.location || '',
      linkedin: user.studentProfile?.linkedin || '',
      github: user.studentProfile?.github || '',
      skills: user.skills.map(s => s.name),
      education: user.educations.map(e => ({
        school: e.school,
        degree: e.degree,
        year: e.description?.replace('Passing Year: ', '') || '',
        grade: e.grade || '',
      })),
      experience: user.experiences.map(e => ({
        company: e.company,
        role: e.role,
        duration: '',
        description: e.description || '',
      })),
      certificates: user.certificates.map(c => ({
        name: c.name,
        issuer: c.issuer,
        date: '',
        url: c.url || '',
      })),
    });
  } catch (error) {
    console.error("PROFILE_GET_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    const userSession = session?.user as { id: string } | undefined;
    if (!userSession?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = userSession.id;
    const data = await req.json();

    await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        bio: data.bio,
        phone: data.phone,
        location: data.city,
        linkedin: data.linkedin,
        github: data.github,
      },
      create: {
        userId,
        bio: data.bio,
        phone: data.phone,
        location: data.city,
        linkedin: data.linkedin,
        github: data.github,
      },
    });

    if (data.skills && Array.isArray(data.skills)) {
      await prisma.skill.deleteMany({ where: { userId } });
      if (data.skills.length > 0) {
        await prisma.skill.createMany({
          data: data.skills.map((name: string) => ({ userId, name })),
        });
      }
    }

    if (data.education && Array.isArray(data.education)) {
      await prisma.education.deleteMany({ where: { userId } });
      const valid = data.education.filter((e: any) => e.school || e.degree);
      if (valid.length > 0) {
        await prisma.education.createMany({
          data: valid.map((edu: any) => ({
            userId,
            school: edu.school,
            degree: edu.degree,
            grade: edu.grade,
            description: `Passing Year: ${edu.year}`,
          })),
        });
      }
    }

    if (data.experience && Array.isArray(data.experience)) {
      await prisma.experience.deleteMany({ where: { userId } });
      const valid = data.experience.filter((e: any) => e.company || e.role);
      if (valid.length > 0) {
        await prisma.experience.createMany({
          data: valid.map((exp: any) => ({
            userId,
            company: exp.company,
            role: exp.role,
            description: `${exp.duration ? `Duration: ${exp.duration}\n` : ''}${exp.description || ''}`,
          })),
        });
      }
    }

    if (data.certificates && Array.isArray(data.certificates)) {
      await prisma.certificate.deleteMany({ where: { userId } });
      const valid = data.certificates.filter((c: any) => c.name || c.issuer);
      if (valid.length > 0) {
        await prisma.certificate.createMany({
          data: valid.map((cert: any) => ({
            userId,
            name: cert.name,
            issuer: cert.issuer,
            url: cert.url,
          })),
        });
      }
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
