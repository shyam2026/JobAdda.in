import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// Forced Refresh to clear dev server cache
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
        projects: true,
      } as any
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const u = user as any;

    return NextResponse.json({
      name: u.name || '',
      email: u.email || '',
      bio: u.studentProfile?.bio || '',
      phone: u.studentProfile?.phone || '',
      city: u.studentProfile?.location || '',
      linkedin: u.studentProfile?.linkedin || '',
      github: u.studentProfile?.github || '',
      skills: u.skills?.map((s: any) => s.name) || [],
      education: u.educations?.map((e: any) => ({
        school: e.school || '',
        degree: e.degree || '',
        year: e.description?.replace('Passing Year: ', '') || '',
        grade: e.grade || '',
      })) || [],
      experience: u.experiences?.map((e: any) => ({
        company: e.company || '',
        role: e.role || '',
        duration: '',
        description: e.description || '',
      })) || [],
      certificates: u.certificates?.map((c: any) => ({
        name: c.name || '',
        issuer: c.issuer || '',
        date: '',
        url: c.url || '',
      })) || [],
      projects: u.projects?.map((p: any) => ({
        title: p.title || '',
        description: p.description || '',
        link: p.link || '',
      })) || [],
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

    // Update User basic info
    if (data.name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: data.name }
      });
    }

    await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        bio: data.bio || '',
        phone: data.phone || '',
        location: data.city || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
      },
      create: {
        userId,
        bio: data.bio || '',
        phone: data.phone || '',
        location: data.city || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
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

    if (data.projects && Array.isArray(data.projects)) {
      await (prisma as any).project.deleteMany({ where: { userId } });
      const valid = data.projects.filter((p: any) => p.title);
      if (valid.length > 0) {
        await (prisma as any).project.createMany({
          data: valid.map((proj: any) => ({
            userId,
            title: proj.title,
            description: proj.description,
            link: proj.link,
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
