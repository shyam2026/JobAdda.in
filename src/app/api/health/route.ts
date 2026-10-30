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

  const testTcp = (host: string, port: number, timeout = 3000): Promise<{ reachable: boolean; error?: string; timeMs?: number }> => {
    return new Promise((resolve) => {
      const net = require('net');
      const start = Date.now();
      const socket = new net.Socket();
      socket.setTimeout(timeout);

      socket.on('connect', () => {
        const timeMs = Date.now() - start;
        socket.destroy();
        resolve({ reachable: true, timeMs });
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve({ reachable: false, error: 'Connection timed out', timeMs: Date.now() - start });
      });

      socket.on('error', (err: any) => {
        socket.destroy();
        resolve({ reachable: false, error: err?.message || String(err), timeMs: Date.now() - start });
      });

      try {
        socket.connect(port, host);
      } catch (e: any) {
        resolve({ reachable: false, error: e?.message || String(e) });
      }
    });
  };

  const [tcpLocalhost, tcpRemoteDb] = await Promise.all([
    testTcp('127.0.0.1', 3306),
    testTcp('193.203.184.191', 3306),
  ]);

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
    tcpConnectivity: {
      localhost3306: tcpLocalhost,
      remoteMysql193_203_184_191: tcpRemoteDb,
    },
    dbStatus,
    dbError,
  });
}
