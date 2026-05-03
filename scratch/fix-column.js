const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Modify column to remove the CHECK constraint and binary collation
    await prisma.$executeRawUnsafe('ALTER TABLE CompanyUser MODIFY COLUMN moreDetails LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL');
    console.log('Successfully modified moreDetails column to remove JSON check!');
  } catch (err) {
    console.error('Failed to modify column:', err.message);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
