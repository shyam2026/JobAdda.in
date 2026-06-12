import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Building, MapPin, Globe, Users, Calendar, Info, ShieldCheck, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { CompanyTabs } from './CompanyTabs';

import { redirect } from 'next/navigation';

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Try finding by slug first
  let company = await (prisma as any).companyUser.findUnique({
    where: { slug },
    include: {
      jobs: {
        where: { status: 'OPEN' },
        select: { id: true, title: true, location: true, salary: true, type: true, category: true, externalLink: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  // Fallback: If not found by slug, try finding by ID (for old links)
  if (!company) {
    company = await (prisma as any).companyUser.findUnique({
      where: { id: slug },
      include: {
        jobs: {
          where: { status: 'OPEN' },
          select: { id: true, title: true, location: true, salary: true, type: true, category: true, externalLink: true, createdAt: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // If found by ID, redirect to the correct slug URL
    if (company && company.slug) {
      redirect(`/companies/${company.slug}`);
    }
  }

  if (!company || company.isActive === false) {
    return notFound();
  }

  return (
    <div className="container py-12 anim-fade-up company-profile-root" style={{ marginTop: '5rem' }}>
      {/* Header Section */}
      {/* Header Section */}
      <div className="card card-p profile-header" style={{ 
        marginBottom: '2.5rem', 
        borderRadius: '24px', 
        border: '1px solid var(--border)', 
        position: 'relative', 
        overflow: 'hidden', 
        zIndex: 10 
      }}>
        {/* Top Accent Line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
        <div className="header-logo" style={{ flexShrink: 0, width: '100px', height: '100px', borderRadius: '20px', background: 'var(--surface-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', overflow: 'hidden' }}>
          {company.logo ? <img src={company.logo} alt={company.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : company.companyName[0]}
        </div>
        <div className="header-content" style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontWeight: '800', color: 'var(--text)', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>{company.companyName}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginTop: '0.25rem', fontWeight: '600' }}>
            <ShieldCheck size={18} /> Verified Employer
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {/* Main Content (Tabs) */}
        <div className="main-content">
          <CompanyTabs 
            bio={company.bio} 
            moreDetails={company.moreDetails as any}  
            jobs={company.jobs} 
          />
        </div> 

        {/* Sidebar (More Information) */}
        <div className="sidebar-container" style={{ marginTop: '5rem', marginBottom: '5rem' }}>
          <div className="sidebar-card card" style={{ 
            padding: '1.5rem', 
            background: 'var(--surface)', 
            border: '1px solid var(--border)', 
            borderRadius: '20px', 
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <Info size={18} style={{ color: 'var(--primary)' }} /> More Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { icon: <Building size={16} />, label: 'Type', val: company.type || 'Private' },
                { icon: <Tag size={16} />, label: 'Industry', val: company.industry || 'Not specified' },
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
          </div>
        </div>
      </div>

      <style>{`
        .profile-header { display: flex; align-items: center; gap: 2rem; }
        .profile-grid { display: grid; grid-template-columns: 1fr 320px; gap: 2.5rem; align-items: start; }
        
        @media (max-width: 1024px) {
          .profile-grid { grid-template-columns: 1fr; gap: 2rem; }
          .sidebar-container { order: 2; margin-top: 1rem; }
          .main-content { order: 1; }
        }

        @media (max-width: 640px) {
          .company-profile-root { margin-top: 4rem !important; }
          .profile-header { flex-direction: column; text-align: center; gap: 1rem; padding: 2rem 1.5rem; }
          .header-logo { width: 80px !important; height: 80px !important; }
        }
      `}</style>
    </div>
  );
}
