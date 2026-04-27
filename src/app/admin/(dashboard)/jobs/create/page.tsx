import React from 'react';
import prisma from '@/lib/prisma';
import { Briefcase, Building } from 'lucide-react';
import { AdminJobCreateForm } from '@/features/admin/components/AdminJobCreateForm';

export default async function AdminJobCreatePage() {
  const companies = await (prisma as any).companyUser.findMany({
    select: { id: true, companyName: true, email: true },
    orderBy: { companyName: 'asc' }
  });

  return (
    <div className="admin-page anim-fade-up">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '0.25rem' }}>Post Job on Behalf of Company</h2>
        <p style={{ color: '#64748b', margin: 0 }}>Create a new job listing and assign it to an existing employer account.</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', borderTopLeftRadius: 'var(--radius)', borderTopRightRadius: 'var(--radius)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: '600' }}>
            <Briefcase size={18} style={{ color: '#10b981' }} />
            New Job Details
          </div>
        </div>
        
        <div style={{ padding: '2rem' }}>
          {companies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#fffbeb', color: '#b45309', borderRadius: 'var(--radius)', border: '1px solid #fde68a' }}>
              <Building size={32} style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
              <h4>No Companies Found</h4>
              <p style={{ marginTop: '0.5rem' }}>You must have at least one registered company before you can post a job.</p>
            </div>
          ) : (
            <AdminJobCreateForm companies={companies} />
          )}
        </div>
      </div>
    </div>
  );
}
