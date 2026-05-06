import React from 'react';
import prisma from '@/lib/prisma';
import AdminUsersClient from './UsersClient';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      walletBalance: true,
      createdAt: true,
      studentProfile: {
        select: {
          profileImage: true,
          phone: true,
          location: true,
          linkedin: true,
        }
      },
      resumeConfig: {
        select: { selectedTemplate: true }
      },
      _count: {
        select: {
          applications: true,
          purchases: true,
        }
      },
      purchases: {
        where: { status: 'COMPLETED' },
        select: { amount: true }
      }
    }
  });

  // Compute totalSpent per user from purchases
  const enriched = users.map(u => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    totalSpent: u.purchases.reduce((sum, p) => sum + p.amount, 0),
    purchases: undefined, // strip raw purchases from client payload
  }));

  return <AdminUsersClient users={enriched as any} />;
}
