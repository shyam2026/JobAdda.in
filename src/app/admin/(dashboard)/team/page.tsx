import { AdminTeamManager } from '@/features/admin/components/AdminTeamManager';
import prisma from '@/lib/prisma';

export default async function AdminTeamPage() {
  const admins = await (prisma as any).adminUser.findMany({
    orderBy: { role: 'asc' }
  });

  return <AdminTeamManager initialAdmins={admins} />;
}
