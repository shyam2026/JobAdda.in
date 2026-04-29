import React from 'react';
import ResumeDataClient from './ResumeDataClient';

export const metadata = {
  title: 'Resume Purchase Data | Admin Dashboard',
  description: 'Manage and export all resume template purchase records.',
};

export default function ResumeDataPage() {
  return <ResumeDataClient />;
}
