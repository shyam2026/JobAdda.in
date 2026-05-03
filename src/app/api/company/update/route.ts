import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  try {
    const session = await auth();
    
    // Ensure the user is authenticated and is a company user
    if (!session?.user?.email || (session.user as any).portalType !== 'company') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Remove immutable or sensitive fields that should never be updated directly
    delete data.id;
    delete data.email;
    delete data.role;
    delete data.createdAt;
    delete data.updatedAt;

    // Handle password update: hash if provided, skip if blank
    if (data.password) {
      if (data.password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters.' },
          { status: 400 }
        );
      }
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }

    // Update the company user based on their authenticated email
    const updatedCompany = await (prisma as any).companyUser.update({
      where: { email: session.user.email },
      data: { ...data },
    });

    // Strip password from response
    const { password: _pw, ...safeCompany } = updatedCompany;
    return NextResponse.json({ success: true, company: safeCompany });
  } catch (error: any) {
    console.error('Error updating company profile:', error);
    
    // Handle Prisma unique constraint errors (e.g. slug already taken)
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return NextResponse.json(
        { error: 'This company URL slug is already in use. Please choose a different one.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update company profile.' },
      { status: 500 }
    );
  }
}
