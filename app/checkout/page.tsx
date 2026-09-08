import type { Metadata } from 'next';
import CheckoutView from './CheckoutView';

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description: 'Complete your Rashi Ratan order with Razorpay secured payments.',
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
