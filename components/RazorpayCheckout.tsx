'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Banknote, CreditCard, Loader2, Lock, ShieldCheck, Smartphone, Wallet } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import type { DemoOrder, OrderCustomer } from '@/lib/types';
import type { PaymentMethod } from '@/lib/business';
import type { Quote } from '@/lib/pricing';
import { formatINR, invoiceNumberFor } from '@/lib/utils';
import { loadRazorpayScript, type CreateOrderResponse, type RazorpaySuccess } from '@/lib/razorpay';

export type CheckoutCustomer = OrderCustomer;

interface RazorpayCheckoutProps {
  quote: Quote;
  customer: CheckoutCustomer;
  paymentMethod: PaymentMethod;
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
 * Places the order with whichever payment method the shopper picked.
 *
 * Online (Razorpay):
 *   1. POST /api/razorpay/order  — server re-prices the cart and creates the order
 *   2. Razorpay Checkout opens   — or a simulated success in mock mode
 *   3. POST /api/razorpay/verify — server checks the payment signature
 *
 * Cash on Delivery:
 *   POST /api/orders/cod — server re-prices, enforces the COD limit, confirms
 *
 * Success → /order-success, failure → error toast with the cart left intact.
 */
export default function RazorpayCheckout({ quote, customer, paymentMethod, disabled, onValidate }: RazorpayCheckoutProps) {
  const router = useRouter();
  const { items, coupon, clearCart, setLastOrder, toast } = useStore();
  const [status, setStatus] = useState<'idle' | 'creating' | 'paying' | 'verifying' | 'placing'>('idle');

  const busy = status !== 'idle';
  const lines = items.map((item) => ({ slug: item.slug, weight: item.weight, quantity: item.quantity }));

  /** Snapshot of the cart at the prices the server charged. */
  const orderItems = (priced: Quote) =>
    items.map((item) => {
      const line = priced.lines.find((entry) => entry.slug === item.slug && entry.weight === item.weight);
      return line ? { ...item, price: line.unitPrice, originalPrice: line.unitOriginalPrice, quantity: line.quantity } : item;
    });

  const completeOrder = (order: DemoOrder) => {
    setLastOrder(order);
    clearCart();
    setStatus('idle');
    router.push('/order-success');
  };

  const buildOrder = (
    orderId: string,
    priced: Quote,
    payment: { paymentId: string; method: string; paymentMethod: PaymentMethod; paymentStatus: 'paid' | 'pending' },
    placedAt = new Date(),
    buyer: OrderCustomer = customer,
  ): DemoOrder => ({
    orderId,
    ...payment,
    amount: priced.total,
    placedAt: placedAt.toISOString(),
    invoiceNumber: invoiceNumberFor(orderId, placedAt),
    items: orderItems(priced),
    customer: buyer,
    charges: {
      subtotal: priced.subtotal,
      discount: priced.discount,
      couponCode: priced.couponCode,
      delivery: priced.delivery,
      codFee: priced.codFee,
      total: priced.total,
    },
    gst: priced.gst,
  });

  /* ------------------------------ Cash on Delivery ------------------------------ */
  const placeCodOrder = async () => {
    setStatus('placing');
    try {
      const response = await fetch('/api/orders/cod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines, couponCode: coupon?.code ?? null, buyerState: customer.state, paymentMethod: 'cod', customer }),
      });
      const result = (await response.json()) as {
        error?: string;
        orderId: string;
        placedAt: string;
        customer: OrderCustomer;
        quote: Quote;
      };
      if (!response.ok) throw new Error(result.error ?? 'Could not place the order');

      completeOrder(
        buildOrder(
          result.orderId,
          result.quote,
          { paymentId: 'COD', method: 'Cash on Delivery', paymentMethod: 'cod', paymentStatus: 'pending' },
          new Date(result.placedAt),
          result.customer,
        ),
      );
    } catch (error) {
      setStatus('idle');
      toast('Order not placed', {
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    }
  };

  /* ---------------------------------- Online ---------------------------------- */
  const payOnline = async () => {
    try {
      /* 1 — create the order server side; the server decides the amount */
      setStatus('creating');
      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines,
          couponCode: coupon?.code ?? null,
          buyerState: customer.state,
          notes: { customer: customer.name, city: customer.city },
        }),
      });

      const order = (await orderResponse.json()) as CreateOrderResponse & { error?: string };
      if (!orderResponse.ok) throw new Error(order.error ?? 'Order creation failed');

      /* 2a — mock mode: simulate the gateway so the demo flow completes */
      if (order.mock || !order.keyId) {
        setStatus('paying');
        toast('Demo payment in progress', {
          description: 'No Razorpay keys configured, simulating a successful payment.',
          type: 'info',
        });
        window.setTimeout(() => {
          setStatus('verifying');
          window.setTimeout(
            () =>
              completeOrder(
                buildOrder(order.storeOrderId, quote, {
                  paymentId: `pay_demo_${Date.now().toString(36)}`,
                  method: 'UPI (demo)',
                  paymentMethod: 'online',
                  paymentStatus: 'paid',
                }),
              ),
            700,
          );
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
        description: `Order ${order.storeOrderId} · ${items.length} item${items.length === 1 ? '' : 's'}`,
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
            completeOrder(
              buildOrder(order.storeOrderId, quote, {
                paymentId: response.razorpay_payment_id,
                method: 'Razorpay',
                paymentMethod: 'online',
                paymentStatus: 'paid',
              }),
            );
          } catch {
            setStatus('idle');
            toast('Payment could not be verified', {
              description: 'If money was debited it will be refunded automatically. Please contact support.',
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
        description: error instanceof Error ? error.message : 'We could not start the payment. Please try again.',
        type: 'error',
      });
    }
  };

  const submit = () => {
    if (onValidate && !onValidate()) return;
    if (items.length === 0) {
      toast('Your cart is empty', { type: 'error' });
      return;
    }
    if (paymentMethod === 'cod') void placeCodOrder();
    else void payOnline();
  };

  const label =
    status === 'creating'
      ? 'Creating secure order…'
      : status === 'paying'
        ? 'Waiting for payment…'
        : status === 'verifying'
          ? 'Verifying payment…'
          : status === 'placing'
            ? 'Placing your order…'
            : paymentMethod === 'cod'
              ? `Place Order · Pay ${formatINR(quote.total)} on Delivery`
              : `Pay ${formatINR(quote.total)} Securely`;

  const blocked = disabled || busy || (paymentMethod === 'cod' && !quote.codAllowed);

  return (
    <div>
      <button type="button" onClick={submit} disabled={blocked} className="btn btn-lg btn-primary w-full">
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : paymentMethod === 'cod' ? (
          <Banknote className="h-4 w-4" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
        {label}
      </button>

      {paymentMethod === 'online' ? (
        <>
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
            PCI DSS Level 1 secured by Razorpay. Card details never touch our servers.
          </p>
        </>
      ) : (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-navy-900/45">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
          Pay the courier in cash or by UPI when your parcel arrives. Please keep the exact amount ready.
        </p>
      )}
    </div>
  );
}
