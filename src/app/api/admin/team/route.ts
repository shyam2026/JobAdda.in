import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).portalType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admins = await (prisma as any).adminUser.findMany({
      orderBy: { role: 'asc' }
    });

    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).portalType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only SUPERADMIN can manage team
    const currentUser = await (prisma as any).adminUser.findUnique({
      where: { email: session.user?.email as string }
    });

    if (currentUser?.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();
    const { action, id, name, email, password, modules, role } = data;

    if (action === 'create') {
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await (prisma as any).adminUser.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'SUBADMIN',
          modules: JSON.stringify(modules || []),
          isActive: true
        }
      });
      return NextResponse.json(newAdmin);
    }

    if (action === 'update') {
      if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
      
      const updateData: any = { name, email, role, modules: JSON.stringify(modules || []) };
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updated = await (prisma as any).adminUser.update({
        where: { id },
        data: updateData
      });
      return NextResponse.json(updated);
    }

    if (action === 'toggle') {
      if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
      const admin = await (prisma as any).adminUser.findUnique({ where: { id } });
      if (admin.role === 'SUPERADMIN') return NextResponse.json({ error: 'Cannot toggle SuperAdmin' }, { status: 400 });

      const updated = await (prisma as any).adminUser.update({
        where: { id },
        data: { isActive: !admin.isActive }
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('TEAM_API_ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
