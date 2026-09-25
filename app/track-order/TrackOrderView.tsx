'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Banknote,
  Check,
  CircleDot,
  Copy,
  FileText,
  Headphones,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  Search,
  Truck,
} from 'lucide-react';
import GemVisual from '@/components/GemVisual';
import { useStore } from '@/context/StoreContext';
import { getTracking } from '@/lib/tracking';
import type { DemoOrder } from '@/lib/types';
import { cn, formatDateTime, formatINR } from '@/lib/utils';

const STEP_ICONS = [Check, PackageCheck, Package, Truck, MapPin, Check];

export default function TrackOrderView() {
  const params = useSearchParams();
  const { orders, findOrder, hydrated, toast } = useStore();
  const [orderId, setOrderId] = useState(params.get('id') ?? '');
  const [phone, setPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<DemoOrder | null>(null);

  // Links from the order confirmation / account page open the order directly.
  useEffect(() => {
    if (!hydrated) return;
    const fromLink = params.get('id');
    if (fromLink) {
      const match = findOrder(fromLink);
      if (match) setOrder(match);
    }
  }, [hydrated, params, findOrder]);

  const tracking = useMemo(() => (order ? getTracking(order) : null), [order]);

  const search = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!orderId.trim()) return setError('Enter the order ID from your confirmation email.');
    if (phone.length !== 10) return setError('Enter the 10 digit mobile number used at checkout.');

    setSearching(true);
    window.setTimeout(() => {
      setSearching(false);
      const match = findOrder(orderId);
      if (!match || match.customer.phone !== phone) {
        setOrder(null);
        setError('We could not find an order with those details. Check the order ID and mobile number.');
        return;
      }
      setOrder(match);
    }, 500);
  };

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value).then(() => toast('Copied', { description: value, type: 'info' }));
  };

  return (
    <div className="pb-20">
      {/* --------------------------------- Hero --------------------------------- */}
      <section className="relative overflow-hidden bg-royal-deep py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-75" />
        <div className="noise pointer-events-none absolute inset-0" />
        <div className="container-x relative">
          <span className="eyebrow rounded-full border border-gold-400/30 bg-white/5 px-4 py-2 text-gold-300 backdrop-blur">
            <Truck className="h-3.5 w-3.5" /> Insured delivery across India
          </span>
          <h1 className="h-display mt-6 text-4xl leading-[1.05] text-white sm:text-6xl">
            Track your <span className="text-gold-gradient italic">order</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/60">
            Enter your order ID and mobile number to see live delivery status, courier details and your tax invoice.
          </p>
        </div>
      </section>

      <div className="container-x relative -mt-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          {/* -------------------------------- Search -------------------------------- */}
          <div className="space-y-6">
            <form onSubmit={search} className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-navy-900">Find your order</h2>

              <label htmlFor="track-id" className="field-label mt-5">
                Order ID
              </label>
              <div className="relative">
                <Package className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/30" />
                <input
                  id="track-id"
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value.toUpperCase())}
                  placeholder="RR-8F3K2Q7M"
                  className="field pl-11 font-mono uppercase tracking-wider"
                />
              </div>

              <label htmlFor="track-phone" className="field-label mt-4">
                Mobile number
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/30" />
                <input
                  id="track-phone"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="field pl-11"
                />
              </div>

              {error && <p className="mt-3 text-xs font-medium text-rose-600">{error}</p>}

              <button type="submit" disabled={searching} className="btn btn-md btn-primary mt-6 w-full">
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Track order
              </button>
            </form>

            {hydrated && orders.length > 0 && (
              <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft">
                <h3 className="font-display text-xl font-semibold text-navy-900">Orders from this device</h3>
                <ul className="mt-4 space-y-2">
                  {orders.map((entry) => {
                    const info = getTracking(entry);
                    const active = order?.orderId === entry.orderId;
                    return (
                      <li key={entry.orderId}>
                        <button
                          type="button"
                          onClick={() => {
                            setOrder(entry);
                            setOrderId(entry.orderId);
                            setError('');
                          }}
                          className={cn(
                            'flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors',
                            active ? 'border-royal-400 bg-royal-50/60' : 'border-sand-200 hover:bg-sand-50',
                          )}
                        >
                          <span>
                            <span className="block font-mono text-sm font-bold text-navy-900">{entry.orderId}</span>
                            <span className="block text-xs text-navy-900/45">
                              {formatDateTime(entry.placedAt)} · {formatINR(entry.amount)}
                            </span>
                          </span>
                          <span className={cn('badge', info.status === 'delivered' ? 'badge-green' : 'badge-royal')}>
                            {info.statusLabel}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="rounded-3xl bg-royal-deep p-7 text-white">
              <Headphones className="h-8 w-8 text-gold-300" />
              <h3 className="h-display mt-4 text-2xl">Delivery problem?</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                If tracking has not moved for 48 hours, our support team will chase the courier for you.
              </p>
              <Link href="/support" className="btn btn-md btn-gold mt-5 w-full">
                Contact support
              </Link>
            </div>
          </div>

          {/* -------------------------------- Result -------------------------------- */}
          <section className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
            {!order || !tracking ? (
              <div className="flex h-full min-h-[22rem] flex-col items-center justify-center text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-royal-50 text-royal-500">
                  <Truck className="h-9 w-9" />
                </span>
                <p className="mt-6 font-display text-2xl font-semibold text-navy-900">Your delivery timeline appears here</p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-navy-900/55">
                  Your order ID starts with RR- and is in your confirmation email and SMS.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-900/45">Order</p>
                    <p className="font-mono text-2xl font-bold text-navy-900">{order.orderId}</p>
                    <p className="mt-1 text-xs text-navy-900/45">Placed {formatDateTime(order.placedAt)}</p>
                  </div>
                  <span className={cn('badge', tracking.status === 'delivered' ? 'badge-green' : 'badge-royal')}>
                    <CircleDot className="h-3 w-3" /> {tracking.statusLabel}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-sand-50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-900/45">Courier</p>
                    <p className="mt-1 font-semibold text-navy-900">{tracking.courier}</p>
                  </div>
                  <div className="rounded-2xl bg-sand-50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-900/45">AWB number</p>
                    <button
                      type="button"
                      onClick={() => copy(tracking.awb)}
                      className="mt-1 inline-flex items-center gap-1.5 font-mono font-semibold text-navy-900 hover:text-royal-700"
                    >
                      {tracking.awb} <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="rounded-2xl bg-sand-50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-900/45">
                      {tracking.status === 'delivered' ? 'Delivered on' : 'Expected by'}
                    </p>
                    <p className="mt-1 font-semibold text-navy-900">
                      {new Date(tracking.expectedDelivery).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <ol className="mt-8">
                  {tracking.steps.map((step, index) => {
                    const Icon = STEP_ICONS[index] ?? Check;
                    const isCurrent = step.stage === tracking.status;
                    return (
                      <li key={step.stage} className="relative flex gap-4 pb-7 last:pb-0">
                        {index < tracking.steps.length - 1 && (
                          <span
                            className={cn(
                              'absolute left-[17px] top-9 h-[calc(100%-2.25rem)] w-0.5',
                              tracking.steps[index + 1].done ? 'bg-emerald-400' : 'bg-sand-200',
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            'relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full',
                            step.done ? 'bg-emerald-500 text-white' : 'border border-sand-300 bg-white text-navy-900/30',
                            isCurrent && 'ring-4 ring-emerald-500/20',
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="pt-1">
                          <span className={cn('block text-sm font-bold', step.done ? 'text-navy-900' : 'text-navy-900/40')}>
                            {step.label}
                          </span>
                          <span className="block text-xs text-navy-900/50">{step.detail}</span>
                          <span className="mt-0.5 block text-[11px] text-navy-900/35">
                            {step.done ? formatDateTime(step.at) : `Expected ${formatDateTime(step.at)}`}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ol>

                {order.paymentMethod === 'cod' && tracking.status !== 'delivered' && (
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-gold-300/60 bg-gold-100/60 p-4 text-sm text-navy-900/70">
                    <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                    <span>
                      Cash on Delivery: please keep <strong className="text-navy-900">{formatINR(order.amount)}</strong>{' '}
                      ready. The courier accepts cash or UPI.
                    </span>
                  </div>
                )}

                {/* Items */}
                <ul className="mt-8 divide-y divide-sand-100 border-t border-sand-200">
                  {order.items.map((item) => (
                    <li key={item.key} className="flex items-center gap-4 py-4">
                      <span
                        className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-sand-200"
                        style={{ background: `linear-gradient(140deg, ${item.art.light}22, #ffffff 60%)` }}
                      >
                        <GemVisual art={item.art} seed={`track-${item.key}`} sparkle={false} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-navy-900">{item.name}</span>
                        <span className="block text-xs text-navy-900/45">
                          {item.weight} · Qty {item.quantity}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-navy-900">{formatINR(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-5">
                  <address className="not-italic text-xs leading-relaxed text-navy-900/55">
                    <span className="font-semibold text-navy-900">{order.customer.name}</span>
                    <br />
                    {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.pincode}
                  </address>
                  <Link href={`/invoice?id=${encodeURIComponent(order.orderId)}`} className="btn btn-sm btn-outline">
                    <FileText className="h-4 w-4" /> GST invoice
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-navy-900/40">
          Prototype tracking — status is simulated from the order time until a courier API is connected.{' '}
          <Link href="/shop" className="font-semibold text-royal-700">
            Continue shopping <ArrowRight className="inline h-3 w-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
