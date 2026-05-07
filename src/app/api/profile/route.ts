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

    if (!user) {
      const company = await (prisma as any).companyUser.findUnique({
        where: { id: userSession.id }
      });
      if (company) {
        return NextResponse.json({
          name: company.name || company.companyName || '',
          email: company.email || '',
          bio: company.bio || '',
          phone: company.contactNo || '',
          city: company.hq || '',
          profileImage: company.logo || '',
          skills: [],
          education: [],
          experience: [],
          certificates: [],
          projects: [],
          completion: 100
        });
      }
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const u = user as any;

    return NextResponse.json({
      name: u.name || '',
      email: u.email || '',
      bio: u.studentProfile?.bio || '',
      phone: u.studentProfile?.phone || '',
      city: u.studentProfile?.location || '',
      linkedin: u.studentProfile?.linkedin || '',
      github: u.studentProfile?.github || '',
      website: u.studentProfile?.website || '',
      profileImage: u.studentProfile?.profileImage || '',
      skills: u.skills?.map((s: any) => ({ name: s.name, level: s.level || '8' })) || [],
      education: u.educations?.map((e: any) => ({
        school: e.school || '',
        degree: e.degree || '',
        year: e.endDate ? new Date(e.endDate).getFullYear().toString() : '',
        grade: e.grade || '',
        description: e.description || '',
      })) || [],
      experience: u.experiences?.map((e: any) => ({
        company: e.company || '',
        role: e.role || '',
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        isCurrent: e.current || false,
        description: e.description || '',
      })) || [],
      certificates: u.certificates?.map((c: any) => ({
        name: c.name || '',
        issuer: c.issuer || '',
        date: c.issueDate ? (() => {
          const d = new Date(c.issueDate);
          return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        })() : '',
        url: c.url || '',
      })) || [],
      projects: u.projects?.map((p: any) => ({
        title: p.title || '',
        description: p.description || '',
        link: p.link || '',
        startDate: p.startDate ? new Date(p.startDate).toISOString().slice(0, 7) : '',
        endDate: p.endDate ? new Date(p.endDate).toISOString().slice(0, 7) : '',
        isCurrent: p.current || false,
      })) || [],
      completion: Math.min(100, Math.round(
        (u.studentProfile?.bio ? 20 : 0) + 
        ((u.skills?.length > 0) ? 20 : 0) +
        (u.educations?.some((e: any) => e.school) ? 20 : 0) +
        (u.experiences?.some((e: any) => e.company) ? 20 : 0) +
        (u.projects?.some((p: any) => p.title) ? 20 : 0)
      ))
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

    await (prisma.studentProfile as any).upsert({
      where: { userId },
      update: {
        bio: data.bio || '',
        phone: data.phone || '',
        location: data.city || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        website: data.website || '',
      },
      create: {
        userId,
        bio: data.bio || '',
        phone: data.phone || '',
        location: data.city || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        website: data.website || '',
      },
    });

    if (data.skills && Array.isArray(data.skills)) {
      await prisma.skill.deleteMany({ where: { userId } });
      if (data.skills.length > 0) {
        await prisma.skill.createMany({
          data: data.skills.map((s: any) => ({ 
            userId, 
            name: typeof s === 'string' ? s : s.name,
            level: typeof s === 'string' ? '8' : String(s.level || '8')
          })),
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
            endDate: edu.year ? new Date(`${edu.year}-01-01`) : null,
            description: edu.description || '',
          })),
        });
      }
    }

    if (data.experience && Array.isArray(data.experience)) {
      await prisma.experience.deleteMany({ where: { userId } });
      const valid = data.experience.filter((e: any) => e.company || e.role);
      if (valid.length > 0) {
        await prisma.experience.createMany({
          data: valid.map((exp: any) => {
            const startDate = exp.startDate && !isNaN(new Date(exp.startDate).getTime()) 
              ? new Date(exp.startDate) 
              : null;
            const endDate = !exp.isCurrent && exp.endDate && !isNaN(new Date(exp.endDate).getTime())
              ? new Date(exp.endDate)
              : null;
              
            return {
              userId,
              company: exp.company,
              role: exp.role,
              startDate,
              endDate,
              current: exp.isCurrent || false,
              description: exp.description || '',
            };
          }),
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
            startDate: proj.startDate && !isNaN(new Date(proj.startDate).getTime()) ? new Date(proj.startDate) : null,
            endDate: !proj.isCurrent && proj.endDate && !isNaN(new Date(proj.endDate).getTime()) ? new Date(proj.endDate) : null,
            current: proj.isCurrent || false,
          })),
        });
      }
    }

    if (data.certificates && Array.isArray(data.certificates)) {
      await prisma.certificate.deleteMany({ where: { userId } });
      const valid = data.certificates.filter((c: any) => c.name || c.issuer);
      if (valid.length > 0) {
        await prisma.certificate.createMany({
          data: valid.map((cert: any) => {
            // Handle MM/YYYY format
            let issueDate = null;
            if (cert.date && cert.date.includes('/')) {
              const [m, y] = cert.date.split('/');
              issueDate = new Date(`${y}-${m}-01`);
            }
            
            return {
              userId,
              name: cert.name,
              issuer: cert.issuer,
              issueDate,
              url: cert.url,
            };
          }),
        });
      }
    }

    // Referral Progress Notification
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { studentProfile: true, educations: true } as any
      });
      
      if (user?.referredBy) {
        const u = user as any;
        const hasBasic = u.studentProfile?.bio && u.studentProfile?.phone && u.studentProfile?.location && u.studentProfile?.linkedin && u.studentProfile?.github;
        const hasEdu = u.educations?.some((e: any) => e.school && e.degree && e.grade && e.description);
        
        if (hasBasic && hasEdu) {
          const referrer = await prisma.user.findFirst({ where: { referralCode: user.referredBy } });
          if (referrer) {
            // Check if we already notified about this "Ready" stage
            const existingNote = await (prisma as any).notification.findFirst({
              where: {
                userId: referrer.id,
                type: "REFERRAL",
                message: { contains: `${user.name || 'Your friend'} has completed their profile` }
              }
            });

            if (!existingNote) {
              await (prisma as any).notification.create({
                data: {
                  userId: referrer.id,
                  title: "🚀 Referral Milestone!",
                  message: `${user.name || 'Your friend'} has completed their profile! Your bonus will be credited once they apply for their first job.`,
                  type: "REFERRAL",
                  link: "/user/refer"
                }
              });
            }
          }
        }
      }
    } catch (e) {
      console.error("REFERRAL_PROGRESS_NOTIFICATION_ERROR", e);
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
