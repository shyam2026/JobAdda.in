const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRawUnsafe('SHOW CREATE TABLE CompanyUser');
  console.log(result[0]['Create Table']);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
