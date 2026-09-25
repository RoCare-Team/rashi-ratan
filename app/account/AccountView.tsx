'use client';

import Link from 'next/link';
import { ArrowRight, FileText, Heart, MapPin, Package, ShoppingBag, Truck, User } from 'lucide-react';
import GemVisual from '@/components/GemVisual';
import { useStore } from '@/context/StoreContext';
import { getTracking } from '@/lib/tracking';
import { formatDateTime, formatINR } from '@/lib/utils';

/** Demo account dashboard — reads the locally stored order and wishlist. */
export default function AccountView() {
  const { lastOrder, orders, wishlist, itemCount, hydrated } = useStore();
  const tracking = lastOrder ? getTracking(lastOrder) : null;

  const stats = [
    { icon: Package, label: 'Orders placed', value: String(orders.length) },
    { icon: Heart, label: 'Wishlist items', value: String(wishlist.length) },
    { icon: ShoppingBag, label: 'In your cart', value: String(itemCount) },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="relative overflow-hidden bg-royal-deep py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
        <div className="noise pointer-events-none absolute inset-0" />
        <div className="container-x relative flex flex-wrap items-center gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gold-sheen text-navy-950">
            <User className="h-8 w-8" />
          </span>
          <div>
            <h1 className="h-display text-4xl text-white sm:text-5xl">
              {lastOrder ? lastOrder.customer.name || 'Your account' : 'Your account'}
            </h1>
            <p className="mt-1 text-sm text-white/55">
              {lastOrder?.customer.email || 'Sign in is not part of this prototype — data is stored in your browser.'}
            </p>
          </div>
        </div>
      </div>

      <div className="container-x -mt-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-royal-50 text-royal-700">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-4xl font-bold text-navy-900">{hydrated ? value : '—'}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-900/45">{label}</p>
            </div>
          ))}
        </div>

        {/* Order tracking */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-3xl font-semibold text-navy-900">Track your order</h2>

            {!hydrated ? (
              <div className="mt-6 space-y-3">
                <div className="skeleton h-20 rounded-2xl" />
                <div className="skeleton h-20 rounded-2xl" />
              </div>
            ) : lastOrder ? (
              <>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sand-200 bg-sand-50 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-900/45">Order ID</p>
                    <p className="font-display text-2xl font-bold text-navy-900">{lastOrder.orderId}</p>
                  </div>
                  <span className={tracking?.status === 'delivered' ? 'badge badge-green' : 'badge badge-royal'}>
                    <Truck className="h-3 w-3" /> {tracking?.statusLabel}
                  </span>
                </div>

                <ul className="mt-5 divide-y divide-sand-100">
                  {lastOrder.items.map((item) => (
                    <li key={item.key} className="flex items-center gap-4 py-4">
                      <Link
                        href={`/product/${item.slug}`}
                        className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-sand-200"
                        style={{ background: `linear-gradient(140deg, ${item.art.light}22, #ffffff 60%)` }}
                      >
                        <GemVisual art={item.art} seed={`acct-${item.key}`} sparkle={false} />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-lg font-semibold text-navy-900">{item.name}</p>
                        <p className="text-xs text-navy-900/45">
                          {item.weight} · Quantity {item.quantity}
                        </p>
                      </div>
                      <span className="shrink-0 font-bold text-navy-900">{formatINR(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-4">
                  <p className="text-sm text-navy-900/55">
                    {tracking?.status === 'delivered' ? 'Delivered' : 'Expected by'}{' '}
                    <span className="font-semibold text-navy-900">
                      {tracking ? formatDateTime(tracking.expectedDelivery) : ''}
                    </span>
                  </p>
                  <span className="font-display text-2xl font-bold text-navy-900">{formatINR(lastOrder.amount)}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/track-order?id=${encodeURIComponent(lastOrder.orderId)}`} className="btn btn-md btn-primary">
                    <Truck className="h-4 w-4" /> Track delivery
                  </Link>
                  <Link href={`/invoice?id=${encodeURIComponent(lastOrder.orderId)}`} className="btn btn-md btn-outline">
                    <FileText className="h-4 w-4" /> GST invoice
                  </Link>
                </div>

                {orders.length > 1 && (
                  <div className="mt-8 border-t border-sand-200 pt-6">
                    <h3 className="font-display text-xl font-semibold text-navy-900">Order history</h3>
                    <ul className="mt-3 divide-y divide-sand-100">
                      {orders.map((order) => (
                        <li key={order.orderId} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                          <span>
                            <span className="block font-mono font-semibold text-navy-900">{order.orderId}</span>
                            <span className="text-xs text-navy-900/45">
                              {formatDateTime(order.placedAt)} · {order.method}
                            </span>
                          </span>
                          <span className="flex items-center gap-4">
                            <span className="font-semibold text-navy-900">{formatINR(order.amount)}</span>
                            <Link
                              href={`/track-order?id=${encodeURIComponent(order.orderId)}`}
                              className="text-xs font-semibold text-royal-700 hover:text-royal-900"
                            >
                              {getTracking(order).statusLabel} →
                            </Link>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-sand-300 p-10 text-center">
                <Package className="mx-auto h-10 w-10 text-navy-900/20" />
                <p className="mt-4 font-display text-2xl font-semibold text-navy-900">No orders yet</p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-navy-900/55">
                  Place an order and it will appear here with live tracking.
                </p>
                <Link href="/shop" className="btn btn-md btn-primary mt-6">
                  Start shopping <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft">
              <h3 className="font-display text-2xl font-semibold text-navy-900">Saved address</h3>
              {hydrated && lastOrder ? (
                <address className="mt-4 not-italic text-[15px] leading-relaxed text-navy-900/60">
                  <span className="block font-semibold text-navy-900">{lastOrder.customer.name}</span>
                  {lastOrder.customer.address}
                  <br />
                  {lastOrder.customer.city}, {lastOrder.customer.state} {lastOrder.customer.pincode}
                  <br />
                  {lastOrder.customer.phone}
                </address>
              ) : (
                <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-navy-900/55">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy-900/25" />
                  Your delivery address is saved automatically after your first order.
                </p>
              )}
            </div>

            <div className="rounded-3xl bg-royal-deep p-7 text-white">
              <Heart className="h-8 w-8 text-gold-300" />
              <h3 className="h-display mt-4 text-2xl">Your wishlist</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {wishlist.length > 0
                  ? `${wishlist.length} ${wishlist.length === 1 ? 'product is' : 'products are'} waiting for you.`
                  : 'Save gemstones you are considering and compare them later.'}
              </p>
              <Link href="/wishlist" className="btn btn-md btn-gold mt-5 w-full">
                Open wishlist
              </Link>
            </div>
          </aside>
        </div>

        <p className="mt-8 text-center text-xs text-navy-900/40">
          Prototype account area — there is no login or database. Everything shown is stored in this browser only.
        </p>
      </div>
    </div>
  );
}
