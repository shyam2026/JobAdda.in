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

  let remotePrismaStatus = 'untested';
  let remotePrismaError: any = null;
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost')) {
    try {
      const remoteUrl = process.env.DATABASE_URL.replace('localhost', '193.203.184.191');
      const { PrismaClient } = await import('@prisma/client');
      const directClient = new PrismaClient({
        datasources: { db: { url: remoteUrl } },
        log: ['error'],
      });
      await directClient.$queryRawUnsafe('SELECT 1 as test');
      remotePrismaStatus = 'connected';
      await directClient.$disconnect().catch(() => {});
    } catch (e: any) {
      remotePrismaStatus = 'error';
      remotePrismaError = {
        name: e?.name || 'Error',
        message: e?.message || String(e),
        code: e?.code,
      };
    }
  }

  const fs = require('fs');
  const path = require('path');
  const { execSync } = require('child_process');

  const engineDiagnostics: any = {
    enginesFound: [],
    execTests: [],
    osRelease: '',
    libc: '',
  };

  try {
    if (fs.existsSync('/etc/os-release')) {
      engineDiagnostics.osRelease = fs.readFileSync('/etc/os-release', 'utf8').split('\n').slice(0, 4).join('; ');
    }
  } catch (e: any) {
    engineDiagnostics.osRelease = 'Error: ' + e.message;
  }

  try {
    const lddOutput = execSync('ldd --version 2>&1 || true').toString().split('\n')[0];
    engineDiagnostics.libc = lddOutput;
  } catch (e: any) {
    engineDiagnostics.libc = 'Error: ' + e.message;
  }

  const searchDirs = [
    path.join(process.cwd(), 'node_modules', '.prisma', 'client'),
    path.join(process.cwd(), 'node_modules', '@prisma', 'engines'),
    path.join(process.cwd(), 'node_modules', '@prisma', 'client', 'runtime'),
  ];

  for (const dir of searchDirs) {
    try {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.includes('engine')) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            engineDiagnostics.enginesFound.push({
              file,
              size: stat.size,
              mode: '0' + (stat.mode & 0o777).toString(8),
            });

            if (!file.endsWith('.node') && !file.endsWith('.js') && !file.endsWith('.wasm') && !file.endsWith('.d.ts')) {
              try {
                const out = execSync(`"${fullPath}" --version 2>&1`, { timeout: 3000 }).toString().trim();
                engineDiagnostics.execTests.push({ file, success: true, output: out });
              } catch (execErr: any) {
                engineDiagnostics.execTests.push({
                  file,
                  success: false,
                  error: execErr.message,
                  status: execErr.status,
                  stderr: execErr.stderr?.toString(),
                });
              }
            }
          }
        }
      }
    } catch (err: any) {
      engineDiagnostics.enginesFound.push({ dir, error: err.message });
    }
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
    remotePrismaStatus,
    remotePrismaError,
    engineDiagnostics,
  });
}
