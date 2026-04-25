import React from 'react';
import { ProfileForm } from '@/features/profile/components/ProfileForm';

export default function ProfilePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Student <span className="text-gradient">Profile</span></h1>
        <ProfileForm />
      </div>
    </div>
  );
}

