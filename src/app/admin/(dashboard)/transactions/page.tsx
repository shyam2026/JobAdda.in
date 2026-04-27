import React from 'react';
import prisma from '@/lib/prisma';
import { IndianRupee } from 'lucide-react';

export default async function AdminTransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="admin-page anim-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#1e293b', marginBottom: '0.25rem' }}>Financial Transactions</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Monitor referral payouts and wallet balances.</p>
        </div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No transactions recorded yet.
                </td>
              </tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx.id}>
                  <td style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{tx.id.slice(-8)}</td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{tx.user.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.user.email}</div>
                  </td>
                  <td style={{ fontWeight: '700', color: tx.amount > 0 ? '#10b981' : '#ef4444' }}>
                    {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
                  </td>
                  <td>
                    <span className="badge badge-primary">{tx.type}</span>
                  </td>
                  <td>
                    <span className={`badge ${tx.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
