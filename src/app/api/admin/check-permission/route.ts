import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/check-permission?module=cash-collection
export async function GET(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;

    if (!user || user.portalType !== 'admin') {
      return NextResponse.json({ allowed: false });
    }

    if (!['ADMIN', 'SUBADMIN', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json({ allowed: false });
    }

    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get('module');

    if (!moduleId) {
      return NextResponse.json({ allowed: false });
    }

    const db = prisma as any;
    const adminRecord = await db.adminUser.findUnique({
      where: { email: user.email }
    });

    if (!adminRecord) {
      return NextResponse.json({ allowed: false });
    }

    if (adminRecord.role === 'SUPERADMIN') {
      return NextResponse.json({ allowed: true, role: 'SUPERADMIN', name: adminRecord.name || 'Admin' });
    }

    let allowedModules: string[] = [];
    try {
      allowedModules = adminRecord.modules ? JSON.parse(adminRecord.modules) : [];
    } catch { allowedModules = []; }

    const hasPermission = allowedModules.includes('all') || allowedModules.includes(moduleId);

    return NextResponse.json({
      allowed: hasPermission,
      role: adminRecord.role,
      name: adminRecord.name || adminRecord.email
    });
  } catch (e: any) {
    console.error('CHECK_PERMISSION_ERROR', e);
    return NextResponse.json({ allowed: false });
  }
}
