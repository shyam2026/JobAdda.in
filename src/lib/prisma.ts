import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error'],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

// Fetch or initialize the Prisma Client
export function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prismaClientSingleton();
  }
  return globalForPrisma.prisma;
}

// Safely disconnect and re-instantiate the client on engine failure
export function resetPrismaClient() {
  try {
    if (globalForPrisma.prisma) {
      globalForPrisma.prisma.$disconnect().catch(() => {});
    }
  } catch (e) {}
  globalForPrisma.prisma = prismaClientSingleton();
  console.log('Prisma Client re-instantiated successfully.');
}

// Simple forwarding proxy that lazily resolves the singleton client.
// Returns raw PrismaPromise objects untouched so $transaction([...]) works.
// Only heals synchronous engine-crash errors (RustPanic etc.).
const prisma = new Proxy({} as any, {
  get(_target, prop, _receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop);

    // For $transaction / $connect / $disconnect and similar root methods,
    // wrap only synchronous errors for self-healing. The returned promise
    // is NOT wrapped with .catch() so PrismaPromise identity is preserved.
    if (typeof value === 'function') {
      return function (this: any, ...args: any[]) {
        try {
          return value.apply(client, args);
        } catch (err: any) {
          const errMsg = String(err);
          if (
            errMsg.includes('RustPanic') ||
            errMsg.includes('PANIC') ||
            errMsg.includes('Query engine') ||
            errMsg.includes('timer has gone away')
          ) {
            console.warn('Prisma engine panic caught (sync). Reinitializing client...', err);
            resetPrismaClient();
            const freshClient = getPrismaClient();
            const freshValue = Reflect.get(freshClient, prop);
            if (typeof freshValue === 'function') {
              return freshValue.apply(freshClient, args);
            }
          }
          throw err;
        }
      };
    }

    // For model delegates (prisma.user, prisma.job, etc.), return
    // the real model object directly. No wrapping needed — PrismaPromise
    // objects flow through untouched.
    return value;
  }
});

export default prisma;
