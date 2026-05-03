
const { PrismaClient } = require('@prisma/client');
const { nanoid } = require('nanoid');
const prisma = new PrismaClient();

async function migrate() {
  const companies = await prisma.companyUser.findMany({
    where: { slug: null }
  });

  console.log(`Migrating ${companies.length} companies...`);

  for (const company of companies) {
    let slug = company.companyName.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const existingSlug = await prisma.companyUser.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${nanoid(3).toLowerCase()}`;
    }

    await prisma.companyUser.update({
      where: { id: company.id },
      data: { slug }
    });
    console.log(`Updated ${company.companyName} -> ${slug}`);
  }

  console.log('Done!');
}

migrate()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
