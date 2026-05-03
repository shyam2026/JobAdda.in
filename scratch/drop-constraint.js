const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Try MariaDB syntax for dropping a constraint
    await prisma.$executeRawUnsafe('ALTER TABLE CompanyUser DROP CONSTRAINT moreDetails');
    console.log('Successfully dropped the moreDetails JSON constraint using MariaDB syntax!');
  } catch (err) {
    console.log('MariaDB syntax failed, trying MySQL 8 syntax...');
    try {
      await prisma.$executeRawUnsafe('ALTER TABLE CompanyUser DROP CHECK moreDetails');
      console.log('Successfully dropped using MySQL 8 syntax!');
    } catch (err2) {
      console.error('All attempts failed:', err2.message);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
