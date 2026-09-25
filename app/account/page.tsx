import type { Metadata } from 'next';
import AccountView from './AccountView';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Track your Agarwal Gemstone order, review saved addresses and open your wishlist.',
};

export default function AccountPage() {
  return <AccountView />;
}
