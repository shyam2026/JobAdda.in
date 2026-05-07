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

// Self-healing proxy to automatically catch and heal Prisma Rust/Engine panics
const prisma = new Proxy({} as any, {
  get(target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop);

    if (typeof value === 'function') {
      return function (this: any, ...args: any[]) {
        try {
          const result = value.apply(this === receiver ? client : this, args);
          if (result && typeof result.then === 'function') {
            return result.catch((err: any) => {
              const errMsg = String(err);
              if (
                errMsg.includes('RustPanic') || 
                errMsg.includes('PANIC') || 
                errMsg.includes('Query engine') ||
                errMsg.includes('timer has gone away') ||
                errMsg.includes('connection')
              ) {
                console.warn('Prisma engine panic caught on root call. Reinitializing client...', err);
                resetPrismaClient();
                const freshClient = getPrismaClient();
                const freshValue = Reflect.get(freshClient, prop);
                if (typeof freshValue === 'function') {
                  return freshValue.apply(freshClient, args);
                }
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
            errMsg.includes('timer has gone away') ||
            errMsg.includes('connection')
          ) {
            console.warn('Prisma engine panic caught on root sync call. Reinitializing client...', err);
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

    // For database models (prisma.user, prisma.job, prisma.companyUser, etc.)
    if (value && typeof value === 'object') {
      return new Proxy(value, {
        get(modelTarget, modelProp, modelReceiver) {
          const modelValue = Reflect.get(modelTarget, modelProp);
          if (typeof modelValue === 'function') {
            return function (this: any, ...args: any[]) {
              try {
                const result = modelValue.apply(this === modelReceiver ? modelTarget : this, args);
                if (result && typeof result.then === 'function') {
                  return result.catch((err: any) => {
                    const errMsg = String(err);
                    if (
                      errMsg.includes('RustPanic') || 
                      errMsg.includes('PANIC') || 
                      errMsg.includes('Query engine') ||
                      errMsg.includes('timer has gone away') ||
                      errMsg.includes('connection')
                    ) {
                      console.warn(`Prisma panic caught on model query (${String(prop)}.${String(modelProp)}). Healing client...`, err);
                      resetPrismaClient();
                      const freshClient = getPrismaClient();
                      const freshModel = Reflect.get(freshClient, prop);
                      const freshValue = Reflect.get(freshModel, modelProp);
                      if (typeof freshValue === 'function') {
                        return freshValue.apply(freshModel, args);
                      }
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
                  errMsg.includes('timer has gone away') ||
                  errMsg.includes('connection')
                ) {
                  console.warn(`Prisma panic caught on sync model query (${String(prop)}.${String(modelProp)}). Healing client...`, err);
                  resetPrismaClient();
                  const freshClient = getPrismaClient();
                  const freshModel = Reflect.get(freshClient, prop);
                  const freshValue = Reflect.get(freshModel, modelProp);
                  if (typeof freshValue === 'function') {
                    return freshValue.apply(freshModel, args);
                  }
                }
                throw err;
              }
            };
          }
          return modelValue;
        }
      });
    }

    return value;
  }
});

export default prisma;
