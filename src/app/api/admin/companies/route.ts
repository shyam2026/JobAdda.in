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

    // Generate a 6-digit numeric unique ID (expanding to 7 if full)
    const digits = '0123456789';
    let idLength = 6;
    let customCompanyId = '';
    let company = null;
    let attempts = 0;

    while (!company) {
      customCompanyId = '';
      for (let i = 0; i < idLength; i++) {
        customCompanyId += digits.charAt(Math.floor(Math.random() * digits.length));
      }

      // Proactively check if ID exists
      const idExists = await (prisma as any).companyUser.findUnique({ where: { id: customCompanyId } });
      if (idExists) {
        attempts++;
        if (attempts >= 5) {
          idLength++; // Increase length if collisions are frequent
          attempts = 0;
        }
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

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
          attempts++;
          if (attempts >= 5) {
            idLength++;
            attempts = 0;
          }
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
