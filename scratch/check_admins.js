const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const admins = await prisma.adminUser.findMany();
  console.log('Admins:', JSON.stringify(admins, null, 2));
  process.exit(0);
}

check();
