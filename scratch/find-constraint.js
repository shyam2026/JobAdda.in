const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT CONSTRAINT_NAME 
    FROM information_schema.CHECK_CONSTRAINTS 
    WHERE TABLE_NAME = 'CompanyUser'
  `);
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
