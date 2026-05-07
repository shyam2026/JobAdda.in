import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET: List all companies for the dashboard
export async function GET() {
  try {
    const session = await auth();
    const user = session?.user as any;
    if (user?.portalType !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {};
    if (user?.role === 'SUBADMIN') {
      where.createdByAdminId = user.id;
    }

    const companies = await (prisma.companyUser as any).findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

// POST: Create a new company
export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;
    if (user?.portalType !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const companyName = formData.get("companyName") as string;
    const email = (formData.get("email") as string) || null;
    const password = (formData.get("password") as string) || null;
    const name = (formData.get("name") as string) || null;
    const contactNo = (formData.get("contactNo") as string) || null;
    const website = (formData.get("website") as string) || null;
    const hq = (formData.get("hq") as string) || null;
    const bio = (formData.get("bio") as string) || null;
    const size = (formData.get("size") as string) || null;
    const type = (formData.get("type") as string) || null;
    const industry = (formData.get("industry") as string) || null;
    const founded = (formData.get("founded") as string) || null;
    const moreDetails = (formData.get("moreDetails") as string) || null;
    const logoFile = formData.get("logo") as File | null;

    if (!companyName) {
      return NextResponse.json({ error: "Company Name is required" }, { status: 400 });
    }

    if (email) {
      const existing = await (prisma.companyUser as any).findUnique({ where: { email } });
      if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    let logoPath = "";
    if (logoFile && logoFile.size > 0) {
      if (logoFile.size > 500 * 1024) {
        return NextResponse.json({ error: "Logo size must be less than 500KB" }, { status: 400 });
      }
      const ext = path.extname(logoFile.name).toLowerCase();
      if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
        return NextResponse.json({ error: "Only JPG, JPEG and PNG files are allowed" }, { status: 400 });
      }

      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${nanoid(10)}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "company-logo");
      
      try {
        await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        logoPath = `/company-logo/${fileName}`;
      } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "Failed to save logo" }, { status: 500 });
      }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const id = `CO-${nanoid(8).toUpperCase()}`;

    // Slug generation
    let slug = companyName.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const existingSlug = await (prisma.companyUser as any).findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${nanoid(3).toLowerCase()}`;
    }

    const company = await (prisma.companyUser as any).create({
      data: {
        id,
        slug,
        companyName,
        email,
        password: hashedPassword as any,
        name,
        contactNo,
        website,
        hq,
        bio,
        size,
        type,
        industry,
        founded,
        moreDetails,
        logo: logoPath,
        role: 'COMPANY',
        createdByAdminId: user?.id || null,
      }
    });

    return NextResponse.json({ message: "Company created successfully", company });
  } catch (error: any) {
    console.error("CREATE_COMPANY_ERROR", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
