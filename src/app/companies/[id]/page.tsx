import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Building, MapPin, Globe, Users, Calendar, Info, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { CompanyTabs } from './CompanyTabs';

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const company = await (prisma as any).companyUser.findUnique({
    where: { id },
    include: {
      jobs: {
        where: { status: 'OPEN' },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!company) {
    return notFound();
  }

  return (
    <div className="container py-12 anim-fade-up">
      {/* Header Section */}
      <div className="card card-p" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', borderLeft: '6px solid var(--primary)' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '20px', background: 'var(--surface-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', overflow: 'hidden' }}>
          {company.logo ? <img src={company.logo} alt={company.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : company.companyName[0]}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)' }}>{company.companyName}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginTop: '0.25rem', fontWeight: '600' }}>
            <ShieldCheck size={18} /> Verified Employer
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2.5rem' }}>
        {/* Main Content (Tabs) */}
        <div>
          <CompanyTabs 
            bio={company.bio} 
            moreDetails={company.moreDetails as any} 
            jobs={company.jobs} 
          />
        </div>

        {/* Sidebar (More Information) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card padding="lg">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={18} style={{ color: 'var(--primary)' }} /> More Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { icon: <Building size={16} />, label: 'Type', val: company.type || 'Private' },
                { icon: <Calendar size={16} />, label: 'Founded', val: company.founded || 'Not set' },
                { icon: <Users size={16} />, label: 'Company Size', val: company.size || 'Not set' },
                { icon: <MapPin size={16} />, label: 'Headquarters', val: company.hq || 'Not set' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{ color: 'var(--text-3)', marginTop: '0.15rem' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: '600', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>{item.val}</div>
                  </div>
                </div>
              ))}

              {company.website && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '0.25rem' }}>
                  <a 
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-outline" 
                    style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Globe size={16} /> Visit Website
                  </a>
                </div>
              )}
            </div>
          </Card>

          <div className="card" style={{ padding: '1.5rem', background: 'var(--surface-light)', border: '1px dashed var(--border)', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-3)' }}>
              Member since {new Date(company.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
