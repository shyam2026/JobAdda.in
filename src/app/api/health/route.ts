import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  
  if (key !== 'jobadda-diag') {
    return NextResponse.json({ status: 'ok' });
  }

  let dbHost = 'none';
  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      dbHost = `${parsed.hostname}:${parsed.port}`;
    } catch {
      dbHost = 'invalid-url-format';
    }
  }

  let dbStatus = 'untested';
  let dbError = null;

  try {
    const rawResult = await (prisma as any).$queryRawUnsafe('SELECT 1 as test');
    dbStatus = 'connected';
  } catch (err: any) {
    dbStatus = 'error';
    dbError = {
      name: err?.name || 'Error',
      message: err?.message || String(err),
      code: err?.code,
    };
  }

  return NextResponse.json({
    nodeVersion: process.version,
    platform: process.platform,
    env: {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      dbHost,
      hasAuthSecret: Boolean(process.env.AUTH_SECRET),
      hasNextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
      hasNextAuthUrl: Boolean(process.env.NEXTAUTH_URL),
      hasSiteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    },
    dbStatus,
    dbError,
  });
}
