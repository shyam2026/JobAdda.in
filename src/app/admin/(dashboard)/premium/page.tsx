import { Metadata } from 'next';
import PremiumClient from './PremiumClient';

export const metadata: Metadata = {
  title: 'Premium Management | Admin — JobAdda',
};

export default function AdminPremiumPage() {
  return <PremiumClient />;
}
