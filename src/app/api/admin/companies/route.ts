import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const companySchema = z.object({
  companyName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  contactNo: z.string().optional(),
  logo: z.string().optional(),
  type: z.string().optional(),
  founded: z.string().optional(),
  size: z.string().optional(),
  hq: z.string().optional(),
  website: z.string().optional(),
  bio: z.string().optional(),
  moreDetails: z.array(z.object({ title: z.string(), value: z.string() })).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as { id: string; role: string } | undefined;

    // Check if the requester is an ADMIN
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized. Admin only." }, { status: 401 });
    }

    const body = await req.json();
    const result = companySchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
    }

    const { companyName, email, password, name, contactNo, logo, type, founded, size, hq, website, bio, moreDetails } = result.data;

    // Check for existing company user with the same email
    const emailExists = await (prisma as any).companyUser.findUnique({ where: { email } });
    if (emailExists) {
      return NextResponse.json({ error: "A company with this email already exists" }, { status: 400 });
    }

    // Generate a unique Brand Slug from company name
    const slugify = (text: string) => text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const getDomainSlug = (url: string) => {
      try {
        const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        return slugify(domain.replace(/\./g, '-'));
      } catch {
        return '';
      }
    };

    let baseSlug = slugify(companyName) || 'company';
    let customCompanyId = baseSlug;
    let company = null;
    let attempts = 0;

    const hashedPassword = await bcrypt.hash(password, 10);

    while (!company) {
      // Check if ID exists
      const idExists = await (prisma as any).companyUser.findUnique({ where: { id: customCompanyId } });
      
      if (idExists) {
        attempts++;
        
        if (attempts === 1 && website) {
          // Attempt 1: Try using the domain as a differentiator
          const domainSlug = getDomainSlug(website);
          if (domainSlug) {
            customCompanyId = `${baseSlug}-${domainSlug}`;
            continue;
          }
        }

        // Attempt 2+: Use random suffix
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let suffix = '';
        for (let i = 0; i < 3; i++) suffix += chars.charAt(Math.floor(Math.random() * chars.length));
        customCompanyId = `${baseSlug}-${suffix}`;
        
        if (attempts >= 10) {
          // Absolute fallback
          customCompanyId = `${baseSlug}-${Date.now().toString().slice(-4)}`;
        }
        continue;
      }

      try {
        company = await (prisma as any).companyUser.create({
          data: {
            id: customCompanyId,
            companyName,
            email,
            password: hashedPassword,
            name,
            contactNo: contactNo || null,
            logo: logo || null,
            type: type || null,
            founded: founded || null,
            size: size || null,
            hq: hq || null,
            website: website || null,
            bio: bio || null,
            moreDetails: moreDetails || [],
            role: "ADMIN"
          }
        });
      } catch (e: any) {
        if (e.code === 'P2002') {
          // Database level unique constraint fail (should be caught by findUnique, but just in case)
          attempts++;
          continue;
        } else {
          throw e;
        }
      }
    }

    return NextResponse.json({ message: "Company created successfully", company: { id: company.id, name: company.companyName } }, { status: 201 });
  } catch (error) {
    console.error("COMPANY_CREATE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
