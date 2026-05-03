import React from 'react';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { SettingsForm } from './SettingsForm';
import { redirect } from 'next/navigation';

export default async function CompanySettingsPage() {
  const session = await auth();

  if (!session || (session.user as any).portalType !== 'company') {
    redirect('/company/login');
  }

  const companyUser = await (prisma as any).companyUser.findUnique({
    where: { email: session?.user?.email as string }
  });

  if (!companyUser) {
    redirect('/company/login');
  }

  return (
    <div className="company-page anim-fade-up">
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ marginBottom: '0.4rem', color: '#f8fafc', fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Company Profile</h2>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.05rem' }}>
          Manage your public company profile and settings. Changes made here will be visible on your public careers page.
        </p>
      </div>

      <SettingsForm initialData={companyUser} />
    </div>
  );
}
