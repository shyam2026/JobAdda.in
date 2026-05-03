import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const data: any = {};
    if (formData.has("companyName")) data.companyName = formData.get("companyName");
    if (formData.has("email")) data.email = (formData.get("email") as string) || null;
    if (formData.has("name")) data.name = (formData.get("name") as string) || null;
    if (formData.has("contactNo")) data.contactNo = (formData.get("contactNo") as string) || null;
    if (formData.has("website")) data.website = (formData.get("website") as string) || null;
    if (formData.has("hq")) data.hq = (formData.get("hq") as string) || null;
    if (formData.has("bio")) data.bio = (formData.get("bio") as string) || null;
    if (formData.has("size")) data.size = (formData.get("size") as string) || null;
    if (formData.has("type")) data.type = (formData.get("type") as string) || null;
    if (formData.has("industry")) data.industry = (formData.get("industry") as string) || null;
    if (formData.has("founded")) data.founded = (formData.get("founded") as string) || null;
    if (formData.has("moreDetails")) data.moreDetails = (formData.get("moreDetails") as string) || null;

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    if (logoFile && logoFile.size > 0) {
      if (logoFile.size > 500 * 1024) {
        return NextResponse.json({ error: "Logo size must be less than 500KB" }, { status: 400 });
      }
      const ext = path.extname(logoFile.name).toLowerCase();
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${nanoid(10)}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "company-logo");
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      data.logo = `/company-logo/${fileName}`;
    }

    const updated = await (prisma.companyUser as any).update({
      where: { id },
      data
    });

    return NextResponse.json({ message: "Company updated successfully", company: updated });
  } catch (error: any) {
    console.error("UPDATE_COMPANY_ERROR", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const user = session?.user as any;

    if (user?.portalType !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.companyUser.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Company deleted successfully" });
  } catch (error: any) {
    console.error("DELETE_COMPANY_ERROR", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
