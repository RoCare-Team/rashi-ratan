import type { Metadata } from 'next';
import WishlistView from './WishlistView';

export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'Gemstones and spiritual products you have saved on Agarwal Gemstone.',
};

export default function WishlistPage() {
  return <WishlistView />;
}
