import React from 'react';
import prisma from '@/lib/prisma';
import { Building, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminCompaniesPage() {
  const companies = await (prisma as any).companyUser.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { jobs: true }
      }
    }
  });

  return (
    <div className="admin-page anim-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#1e293b', marginBottom: '0.25rem' }}>Registered Companies</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Manage employer accounts and verifications.</p>
        </div>
        <Link href="/admin/companies/create" className="btn btn-primary">
          <Plus size={18} /> Create Company
        </Link>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact Info</th>
              <th>Joined Date</th>
              <th>Jobs Posted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No companies registered yet.
                </td>
              </tr>
            ) : (
              companies.map((c: any) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar avatar-sm" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                        {c.companyName ? c.companyName[0].toUpperCase() : <Building size={14} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{c.companyName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Rep: {c.name || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>{c.email}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.contactNo || 'No phone'}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '600', color: '#10b981' }}>{c._count.jobs}</td>
                  <td>
                    <span className="badge badge-success">Verified</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link href={`/companies/${c.id}`} target="_blank" className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>View</Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
