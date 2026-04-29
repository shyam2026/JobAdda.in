import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const MAX_SIZE = 500 * 1024; // 500KB

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userSession = session?.user as { id: string } | undefined;
    if (!userSession?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = userSession.id;

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    // Validate type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image must be 500KB or less" }, { status: 400 });
    }

    // Get extension
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `profile_${userId}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    // Delete old profile image if different extension
    const exts = ["jpg", "jpeg", "png", "webp", "gif"];
    for (const e of exts) {
      const old = path.join(uploadDir, `profile_${userId}.${e}`);
      if (e !== ext && existsSync(old)) {
        await unlink(old).catch(() => {});
      }
    }

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;

    // Update DB
    await (prisma.studentProfile as any).upsert({
      where: { userId },
      update: { profileImage: imageUrl },
      create: { userId, profileImage: imageUrl },
    });

    return NextResponse.json({ profileImage: imageUrl });
  } catch (error) {
    console.error("PROFILE_IMAGE_UPLOAD_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
