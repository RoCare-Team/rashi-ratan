import type { Metadata } from 'next';
import CartView from './CartView';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review the certified gemstones and spiritual products in your Rashi Ratan cart.',
};

export default function CartPage() {
  return <CartView />;
}
