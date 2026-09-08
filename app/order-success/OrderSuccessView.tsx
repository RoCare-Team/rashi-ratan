'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  Check,
  Copy,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import GemVisual from '@/components/GemVisual';
import { useStore } from '@/context/StoreContext';
import { estimatedDelivery, formatINR } from '@/lib/utils';

const CONFETTI_COLORS = ['#d4a933', '#722ee0', '#f8e9b6', '#12a26b', '#e04a2f', '#8ab6ff'];

const TIMELINE = [
  { icon: Check, label: 'Order confirmed', detail: 'Payment received', done: true },
  { icon: Package, label: 'Packed & sealed', detail: 'Within 24 hours', done: false },
  { icon: Truck, label: 'Out for delivery', detail: 'Insured courier', done: false },
  { icon: MapPin, label: 'Delivered', detail: 'Signature required', done: false },
];

export default function OrderSuccessView() {
  const { lastOrder, hydrated } = useStore();
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowConfetti(false), 4200);
    return () => window.clearTimeout(timer);
  }, []);

  const confetti = useMemo(
    () =>
      Array.from({ length: 46 }).map((_, index) => ({
        left: (index * 17.3) % 100,
        delay: (index % 12) * 0.22,
        duration: 2.8 + ((index % 5) * 0.4),
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        size: 6 + (index % 4) * 2,
        round: index % 3 === 0,
      })),
    [],
  );

  const copyOrderId = () => {
    if (!lastOrder) return;
    navigator.clipboard?.writeText(lastOrder.orderId).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!hydrated) {
    return (
      <div className="container-x py-24">
        <div className="mx-auto max-w-2xl">
          <div className="skeleton h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  /* Someone landed here without placing an order in this browser. */
  if (!lastOrder) {
    return (
      <div className="container-x py-24 text-center">
        <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-royal-50 text-royal-500">
          <ShoppingBag className="h-11 w-11" />
        </span>
        <h1 className="h-display mt-8 text-4xl text-navy-900">No recent order found</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-navy-900/55">
          Order confirmations appear here right after payment. Place an order to see this screen in action.
        </p>
        <Link href="/shop" className="btn btn-lg btn-primary mt-8">
          Start shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const delivery = estimatedDelivery(5);

  return (
    <div className="relative overflow-hidden pb-20">
      {/* Celebration */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
          {confetti.map((piece, index) => (
            <span
              key={index}
              className="absolute top-0 animate-confetti"
              style={{
                left: `${piece.left}%`,
                width: `${piece.size}px`,
                height: `${piece.size * (piece.round ? 1 : 1.8)}px`,
                background: piece.color,
                borderRadius: piece.round ? '50%' : '2px',
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* -------------------------------- Hero band -------------------------------- */}
      <div className="relative overflow-hidden bg-royal-deep py-16 text-center md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
        <div className="noise pointer-events-none absolute inset-0" />

        <div className="container-x relative">
          <span className="relative mx-auto grid h-24 w-24 animate-pop place-items-center rounded-full bg-gold-sheen text-navy-950 shadow-glow">
            <Check className="h-11 w-11" strokeWidth={3} />
            <span className="absolute inset-0 animate-ring-pulse rounded-full border-2 border-gold-300" />
          </span>

          <p className="eyebrow mt-8 justify-center text-emerald-300">
            <BadgeCheck className="h-4 w-4" /> Payment Successful
          </p>

          <h1 className="h-display mt-4 text-4xl text-white sm:text-5xl lg:text-6xl">
            Thank you for shopping with <span className="text-gold-gradient italic">Rashi Ratan!</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
            Your order is confirmed and moves into our workshop for a final quality check before it is sealed and
            dispatched. A confirmation has been sent to {lastOrder.customer.email || 'your email'}.
          </p>
        </div>
      </div>

      {/* ------------------------------ Order details ------------------------------ */}
      <div className="container-x -mt-10 relative">
        <div className="mx-auto max-w-4xl">
          {/* Key facts */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Package,
                label: 'Order ID',
                value: lastOrder.orderId,
                action: (
                  <button
                    type="button"
                    onClick={copyOrderId}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-royal-700 transition-colors hover:text-royal-900"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                ),
              },
              { icon: CreditCard, label: 'Order Amount', value: formatINR(lastOrder.amount) },
              { icon: Calendar, label: 'Estimated Delivery', value: delivery },
            ].map((card) => (
              <div key={card.label} className="rounded-3xl border border-sand-200 bg-white p-5 shadow-soft">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-royal-50 text-royal-700">
                  <card.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-navy-900/45">{card.label}</p>
                <p className="mt-1 font-display text-xl font-bold leading-tight text-navy-900">{card.value}</p>
                {card.action}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="mt-6 rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-navy-900">Order status</h2>
            <ol className="mt-6 grid gap-6 sm:grid-cols-4 sm:gap-3">
              {TIMELINE.map((step, index) => (
                <li key={step.label} className="relative flex gap-4 sm:flex-col sm:gap-3">
                  {index < TIMELINE.length - 1 && (
                    <span className="absolute left-[18px] top-11 h-[calc(100%+0.5rem)] w-px bg-sand-200 sm:left-auto sm:right-0 sm:top-[18px] sm:h-px sm:w-full sm:translate-x-1/2" />
                  )}
                  <span
                    className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                      step.done ? 'bg-emerald-500 text-white' : 'border border-sand-300 bg-white text-navy-900/35'
                    }`}
                  >
                    <step.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-navy-900">{step.label}</span>
                    <span className="mt-0.5 block text-xs text-navy-900/45">{step.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Products + address */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-navy-900">Your order</h2>

              <ul className="mt-5 divide-y divide-sand-100">
                {lastOrder.items.map((item) => (
                  <li key={item.key} className="flex items-center gap-4 py-4">
                    <Link
                      href={`/product/${item.slug}`}
                      className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-sand-200"
                      style={{ background: `linear-gradient(140deg, ${item.art.light}22, #ffffff 60%)` }}
                    >
                      <GemVisual art={item.art} seed={`success-${item.key}`} sparkle={false} />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${item.slug}`}
                        className="block truncate font-display text-lg font-semibold text-navy-900 transition-colors hover:text-royal-700"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-navy-900/45">
                        {item.weight} · Quantity {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 font-bold text-navy-900">{formatINR(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-end justify-between border-t border-sand-200 pt-4">
                <div>
                  <span className="text-sm font-semibold text-navy-900/60">Total paid</span>
                  <p className="text-xs text-navy-900/45">
                    via {lastOrder.method} · {lastOrder.paymentId}
                  </p>
                </div>
                <span className="font-display text-3xl font-bold text-navy-900">{formatINR(lastOrder.amount)}</span>
              </div>
            </div>

            <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-navy-900">Delivering to</h2>
              <address className="mt-4 not-italic text-[15px] leading-relaxed text-navy-900/60">
                <span className="block font-semibold text-navy-900">{lastOrder.customer.name}</span>
                {lastOrder.customer.address}
                <br />
                {lastOrder.customer.city}, {lastOrder.customer.state} {lastOrder.customer.pincode}
                <br />
                {lastOrder.customer.phone}
              </address>

              <div className="mt-6 rounded-2xl border border-sand-200 bg-sand-50 p-4">
                <p className="flex items-start gap-2.5 text-sm leading-relaxed text-navy-900/60">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  Your lab certificate travels inside the sealed packet. Verify the report number before wearing the
                  stone.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/account" className="btn btn-lg btn-primary">
              <Truck className="h-4 w-4" /> Track Order
            </Link>
            <Link href="/shop" className="btn btn-lg btn-outline">
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-navy-900/40">
            Prototype demo — this order was generated locally and no payment was captured.
          </p>
        </div>
      </div>
    </div>
  );
}
