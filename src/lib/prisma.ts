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

function createSelfHealingProxy(target: any, path: string[] = []): any {
  return new Proxy(target, {
    get(targetObj, prop, receiver) {
      // Don't intercept special properties like then, length, etc.
      if (typeof prop === 'symbol' || ['then', 'catch', 'finally', 'toJSON'].includes(prop as string)) {
        const client = getPrismaClient();
        const currentTarget = path.reduce((obj, key) => obj?.[key], client) || targetObj;
        return Reflect.get(currentTarget, prop);
      }

      const client = getPrismaClient();
      const currentTarget = path.reduce((obj, key) => obj?.[key], client) || targetObj;
      const value = Reflect.get(currentTarget, prop);

      if (typeof value === 'function') {
        return function (this: any, ...args: any[]) {
          // Resolve target and method dynamically on invocation to ensure we use the current singleton instance
          const activeClient = getPrismaClient();
          const activeTarget = path.reduce((obj, key) => obj?.[key], activeClient) || activeClient;
          const activeMethod = Reflect.get(activeTarget, prop);

          try {
            const result = activeMethod.apply(activeTarget, args);
            // If it returns a promise (or thenable), intercept rejection
            if (result && typeof result.then === 'function') {
              return result.catch((err: any) => {
                const errMsg = String(err);
                if (
                  errMsg.includes('RustPanic') ||
                  errMsg.includes('PANIC') ||
                  errMsg.includes('Query engine') ||
                  errMsg.includes('timer has gone away')
                ) {
                  console.warn(`Prisma engine panic caught in async execution (${path.join('.')}.${String(prop)}). Reinitializing client and retrying once...`, err);
                  resetPrismaClient();
                  const freshClient = getPrismaClient();
                  const freshTarget = path.reduce((obj, key) => obj?.[key], freshClient) || freshClient;
                  const freshMethod = Reflect.get(freshTarget, prop);
                  return freshMethod.apply(freshTarget, args);
                }
                throw err;
              });
            }
            return result;
          } catch (err: any) {
            const errMsg = String(err);
            if (
              errMsg.includes('RustPanic') ||
              errMsg.includes('PANIC') ||
              errMsg.includes('Query engine') ||
              errMsg.includes('timer has gone away')
            ) {
              console.warn(`Prisma engine panic caught in sync execution (${path.join('.')}.${String(prop)}). Reinitializing client and retrying once...`, err);
              resetPrismaClient();
              const freshClient = getPrismaClient();
              const freshTarget = path.reduce((obj, key) => obj?.[key], freshClient) || freshClient;
              const freshMethod = Reflect.get(freshTarget, prop);
              return freshMethod.apply(freshTarget, args);
            }
            throw err;
          }
        };
      }

      if (value && typeof value === 'object') {
        // Return a proxy for this nested object (like a model delegate)
        return createSelfHealingProxy(value, [...path, prop as string]);
      }

      return value;
    }
  });
}

const prisma = createSelfHealingProxy({});

export default prisma;
