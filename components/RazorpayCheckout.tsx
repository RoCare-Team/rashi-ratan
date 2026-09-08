'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CreditCard, Loader2, Lock, ShieldCheck, Smartphone, Wallet } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import type { DemoOrder } from '@/lib/types';
import { estimatedDelivery, makeOrderId } from '@/lib/utils';
import { loadRazorpayScript, type CreateOrderResponse, type RazorpaySuccess } from '@/lib/razorpay';

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface RazorpayCheckoutProps {
  amount: number;
  customer: CheckoutCustomer;
  disabled?: boolean;
  /** Return false to block the payment (used for form validation) */
  onValidate?: () => boolean;
}

const METHODS = [
  { icon: Smartphone, label: 'UPI' },
  { icon: CreditCard, label: 'Cards' },
  { icon: Wallet, label: 'Wallets' },
  { icon: ShieldCheck, label: 'Net Banking' },
];

/**
 * Complete Razorpay checkout flow.
 *
 * 1. POST /api/razorpay/order  — server creates the order with the secret key
 * 2. Razorpay Checkout opens   — or a simulated success in mock mode
 * 3. POST /api/razorpay/verify — server checks the payment signature
 * 4. Success → /order-success, failure → error toast
 */
export default function RazorpayCheckout({ amount, customer, disabled, onValidate }: RazorpayCheckoutProps) {
  const router = useRouter();
  const { items, clearCart, setLastOrder, toast } = useStore();
  const [status, setStatus] = useState<'idle' | 'creating' | 'paying' | 'verifying'>('idle');

  const busy = status !== 'idle';

  const completeOrder = (paymentId: string, method: string) => {
    const order: DemoOrder = {
      orderId: makeOrderId(),
      paymentId,
      amount,
      method,
      placedAt: new Date().toISOString(),
      items,
      customer,
    };
    setLastOrder(order);
    clearCart();
    setStatus('idle');
    router.push('/order-success');
  };

  const pay = async () => {
    if (onValidate && !onValidate()) return;
    if (items.length === 0) {
      toast('Your cart is empty', { type: 'error' });
      return;
    }

    try {
      /* 1 — create the order server side */
      setStatus('creating');
      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          notes: { customer: customer.name, city: customer.city },
        }),
      });

      if (!orderResponse.ok) throw new Error('Order creation failed');
      const order = (await orderResponse.json()) as CreateOrderResponse;

      /* 2a — mock mode: simulate the gateway so the demo flow completes */
      if (order.mock || !order.keyId) {
        setStatus('paying');
        toast('Demo payment in progress', {
          description: 'No Razorpay keys configured, simulating a successful payment.',
          type: 'info',
        });
        window.setTimeout(() => {
          setStatus('verifying');
          window.setTimeout(() => completeOrder(`pay_demo_${Date.now().toString(36)}`, 'UPI (demo)'), 700);
        }, 1400);
        return;
      }

      /* 2b — real Razorpay Checkout */
      const ready = await loadRazorpayScript();
      if (!ready || !window.Razorpay) throw new Error('Could not load Razorpay Checkout');

      setStatus('paying');
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Rashi Ratan',
        description: `${items.length} item${items.length === 1 ? '' : 's'} · Certified gemstones`,
        order_id: order.orderId,
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        notes: { address: `${customer.address}, ${customer.city}` },
        theme: { color: '#5f1fbd' },
        modal: {
          ondismiss: () => {
            setStatus('idle');
            toast('Payment cancelled', { description: 'Your cart is still saved.', type: 'info' });
          },
        },
        handler: async (response: RazorpaySuccess) => {
          /* 3 — verify the signature on the server */
          setStatus('verifying');
          try {
            const verifyResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const result = (await verifyResponse.json()) as { verified: boolean };
            if (!result.verified) throw new Error('Verification failed');
            completeOrder(response.razorpay_payment_id, 'Razorpay');
          } catch {
            setStatus('idle');
            toast('Payment could not be verified', {
              description: 'No amount has been captured. Please try again.',
              type: 'error',
            });
          }
        },
      });

      checkout.on('payment.failed', () => {
        setStatus('idle');
        toast('Payment failed', { description: 'Your bank declined the transaction. Try another method.', type: 'error' });
      });

      checkout.open();
    } catch (error) {
      console.error(error);
      setStatus('idle');
      toast('Something went wrong', {
        description: 'We could not start the payment. Please try again.',
        type: 'error',
      });
    }
  };

  const label =
    status === 'creating'
      ? 'Creating secure order…'
      : status === 'paying'
        ? 'Waiting for payment…'
        : status === 'verifying'
          ? 'Verifying payment…'
          : 'Pay Securely with Razorpay';

  return (
    <div>
      <button type="button" onClick={pay} disabled={disabled || busy} className="btn btn-lg btn-primary w-full">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        {label}
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {METHODS.map(({ icon: Icon, label: method }) => (
          <span
            key={method}
            className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-navy-900/60"
          >
            <Icon className="h-3.5 w-3.5 text-royal-600" />
            {method}
          </span>
        ))}
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-navy-900/45">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
        PCI DSS Level 1 secured. Card details never touch our servers.
      </p>
    </div>
  );
}
