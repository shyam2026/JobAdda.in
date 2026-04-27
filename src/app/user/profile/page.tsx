'use client';

import React from 'react';
import { ProfileForm } from '@/features/profile/components/ProfileForm';

export default function UserProfilePage() {
  return (
    <div className="anim-fade-up">
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.25rem' }}>My Profile</h2>
        <p style={{ color: 'var(--text-3)', margin: 0 }}>Manage your personal information and academic background.</p>
      </header>
      
      <ProfileForm standalone={false} />
    </div>
  );
}
