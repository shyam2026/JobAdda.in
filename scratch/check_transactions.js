const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findUnique({ where: { email: 'shyam.gogaledu@gmail.com' } });
  if (!user) {
    console.log('User not found');
    return;
  }
  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id, type: { contains: 'PREMIUM' } },
    orderBy: { createdAt: 'desc' }
  });
  console.log('Transactions:', JSON.stringify(transactions, null, 2));
  process.exit(0);
}

check();
