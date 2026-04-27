import React from 'react';
import { Briefcase } from 'lucide-react';
import { CompanyJobCreateForm } from '@/features/company/components/CompanyJobCreateForm';

export default function CompanyJobCreatePage() {
  return (
    <div className="company-page anim-fade-up">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Post a New Job</h2>
        <p style={{ color: '#64748b', margin: 0 }}>Create a listing to reach thousands of qualified candidates.</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', borderTopLeftRadius: 'var(--radius)', borderTopRightRadius: 'var(--radius)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: '600' }}>
            <Briefcase size={18} style={{ color: '#0284c7' }} />
            Job Details
          </div>
        </div>
        
        <div style={{ padding: '2rem' }}>
          <CompanyJobCreateForm />
        </div>
      </div>
    </div>
  );
}
