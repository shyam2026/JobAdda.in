const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        title: {
          contains: 'Team Leader'
        }
      },
      include: {
        company: true
      }
    });
    console.log('Jobs matching Team Leader:', jobs.map(j => ({
      id: j.id,
      title: j.title,
      companyId: j.companyId,
      company: j.company
    })));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
