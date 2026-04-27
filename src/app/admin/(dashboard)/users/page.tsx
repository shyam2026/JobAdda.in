import React from 'react';
import prisma from '@/lib/prisma';
import { Search } from 'lucide-react';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { applications: true }
      }
    }
  });

  return (
    <div className="admin-page anim-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#1e293b', marginBottom: '0.25rem' }}>Student Management</h2>
          <p style={{ color: '#64748b', margin: 0 }}>View and manage registered student accounts.</p>
        </div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Joined Date</th>
              <th>Applications</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No students registered yet.
                </td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar avatar-sm" style={{ background: '#e2e8f0', color: '#475569' }}>
                        {u.name ? u.name[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{u.name || 'Unnamed Student'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '600', color: '#10b981' }}>{u._count.applications}</td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>View</button>
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
