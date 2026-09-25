import type { Metadata } from 'next';
import CheckoutView from './CheckoutView';

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description: 'Complete your Agarwal Gemstone order with Razorpay secured payments.',
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
