import type { Metadata } from 'next';
import OrderSuccessView from './OrderSuccessView';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Thank you for shopping with Agarwal Gemstone.',
};

export default function OrderSuccessPage() {
  return <OrderSuccessView />;
}
