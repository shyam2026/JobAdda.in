import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const user = session?.user as { id: string; role: string; portalType: string } | undefined;

    // Check if the requester is an ADMIN portal user
    if (!user || user.portalType !== 'admin') {
      return NextResponse.json({ error: "Unauthorized. Admin only." }, { status: 401 });
    }

    const { id } = await params;

    await (prisma as any).contactMessage.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("CONTACT_DELETE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
