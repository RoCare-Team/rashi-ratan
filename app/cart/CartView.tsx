'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import GemVisual from '@/components/GemVisual';
import ProductGrid from '@/components/ProductGrid';
import SectionHeading from '@/components/SectionHeading';
import { useStore } from '@/context/StoreContext';
import { coupons, FREE_DELIVERY_ABOVE } from '@/data/coupons';
import { getBestsellers } from '@/data/products';
import { formatINR } from '@/lib/utils';

export default function CartView() {
  const {
    items,
    itemCount,
    subtotal,
    savings,
    discount,
    delivery,
    total,
    updateQuantity,
    removeFromCart,
    coupon,
    applyCoupon,
    clearCoupon,
    hydrated,
  } = useStore();

  const [code, setCode] = useState('');

  const submitCoupon = (event: React.FormEvent) => {
    event.preventDefault();
    const result = applyCoupon(code);
    if (result.ok) setCode('');
  };

  /* ------------------------------ Loading state ----------------------------- */
  if (!hydrated) {
    return (
      <div className="container-x py-20">
        <div className="skeleton h-10 w-48 rounded-full" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton h-36 rounded-3xl" />
            ))}
          </div>
          <div className="skeleton h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  /* ------------------------------- Empty state ------------------------------ */
  if (items.length === 0) {
    return (
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-royal-50 text-royal-500">
            <ShoppingBag className="h-11 w-11" />
          </span>
          <h1 className="h-display mt-8 text-4xl text-navy-900 sm:text-5xl">Your cart is empty</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-navy-900/55">
            Nothing here yet. Explore certified gemstones matched to your rashi, or let our finder suggest one for you.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="btn btn-lg btn-primary">
              Browse the collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/astrology#finder" className="btn btn-lg btn-outline">
              Find my lucky stone
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading align="left" eyebrow="Popular right now" title="Customer" accent="favourites" />
          <ProductGrid products={getBestsellers(4)} columns={4} />
        </div>
      </div>
    );
  }

  const toFreeShipping = Math.max(0, FREE_DELIVERY_ABOVE - (subtotal - discount));

  return (
    <div className="container-x py-12 md:py-16">
      <div className="mb-8">
        <h1 className="h-display text-4xl text-navy-900 sm:text-5xl">Shopping Cart</h1>
        <p className="mt-2 text-[15px] text-navy-900/55">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for checkout
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
        {/* ---------------------------------- Items --------------------------------- */}
        <div>
          {toFreeShipping > 0 && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gold-300/60 bg-gold-100/60 p-4">
              <Truck className="h-5 w-5 shrink-0 text-gold-700" />
              <p className="text-sm text-navy-900/70">
                You are <span className="font-bold text-navy-900">{formatINR(toFreeShipping)}</span> away from free
                insured shipping.
              </p>
            </div>
          )}

          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.key}
                className="group flex flex-col gap-5 rounded-3xl border border-sand-200 bg-white p-5 shadow-soft transition-shadow hover:shadow-lift sm:flex-row"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="grid h-32 w-full shrink-0 place-items-center rounded-2xl border border-sand-200 sm:h-32 sm:w-32"
                  style={{ background: `linear-gradient(140deg, ${item.art.light}22, #ffffff 60%, ${item.art.base}18)` }}
                >
                  <GemVisual art={item.art} seed={`cartpage-${item.key}`} sparkle={false} />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-display text-2xl font-semibold leading-tight text-navy-900 transition-colors hover:text-royal-700"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-navy-900/50">{item.weight}</p>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <BadgeCheck className="h-3.5 w-3.5" /> Certificate included
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.key)}
                      aria-label={`Remove ${item.name}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-navy-900/35 transition-colors hover:bg-rose-50 hover:text-rose-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                    <div className="flex h-11 items-center rounded-full border border-sand-300 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="grid h-11 w-11 place-items-center rounded-l-full text-navy-900/60 transition-colors hover:text-royal-700"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="grid h-11 w-11 place-items-center rounded-r-full text-navy-900/60 transition-colors hover:text-royal-700"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-2xl font-bold text-navy-900">
                        {formatINR(item.price * item.quantity)}
                      </p>
                      {item.originalPrice > item.price && (
                        <p className="text-sm text-navy-900/35 line-through">
                          {formatINR(item.originalPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-royal-700 transition-colors hover:text-royal-900"
          >
            <ArrowRight className="h-4 w-4 rotate-180" /> Continue shopping
          </Link>
        </div>

        {/* ------------------------------ Order summary ----------------------------- */}
        <aside className="lg:sticky lg:top-36 lg:h-fit">
          <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-soft">
            <div className="border-b border-sand-200 px-6 py-5">
              <h2 className="font-display text-2xl font-semibold text-navy-900">Order Summary</h2>
            </div>

            <div className="space-y-3.5 px-6 py-5 text-[15px]">
              <div className="flex justify-between">
                <span className="text-navy-900/55">Subtotal ({itemCount} items)</span>
                <span className="font-semibold text-navy-900">{formatINR(subtotal)}</span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Product savings</span>
                  <span className="font-semibold">− {formatINR(savings)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-navy-900/55">Coupon discount</span>
                <span className={discount > 0 ? 'font-semibold text-emerald-600' : 'text-navy-900/40'}>
                  {discount > 0 ? `− ${formatINR(discount)}` : '—'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-navy-900/55">Delivery charges</span>
                <span className={delivery === 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-navy-900'}>
                  {delivery === 0 ? 'FREE' : formatINR(delivery)}
                </span>
              </div>
            </div>

            {/* Coupon */}
            <div className="border-t border-sand-200 px-6 py-5">
              {coupon ? (
                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Tag className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-sm font-bold text-emerald-800">{coupon.code} applied</p>
                      <p className="text-xs text-emerald-700/80">{coupon.label}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearCoupon}
                    aria-label="Remove coupon"
                    className="rounded-full p-1 text-emerald-700/60 transition-colors hover:text-emerald-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={submitCoupon}>
                  <label htmlFor="coupon" className="field-label">
                    Enter Coupon Code
                  </label>
                  <div className="flex gap-2.5">
                    <input
                      id="coupon"
                      value={code}
                      onChange={(event) => setCode(event.target.value.toUpperCase())}
                      placeholder="RASHI10"
                      className="field flex-1 uppercase"
                    />
                    <button type="submit" disabled={!code.trim()} className="btn btn-md btn-dark">
                      Apply
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {coupons.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setCode(item.code)}
                        className="rounded-full border border-dashed border-royal-300 bg-royal-50 px-3 py-1 text-[11px] font-bold text-royal-700 transition-colors hover:bg-royal-100"
                      >
                        {item.code}
                      </button>
                    ))}
                  </div>
                </form>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-sand-200 bg-sand-50 px-6 py-5">
              <div className="flex items-end justify-between">
                <span className="font-semibold text-navy-900">Total Amount</span>
                <div className="text-right">
                  <p className="font-display text-4xl font-bold text-navy-900">{formatINR(total)}</p>
                  <p className="text-xs text-navy-900/45">Inclusive of GST · tax invoice provided</p>
                </div>
              </div>

              <Link href="/checkout" className="btn btn-lg btn-primary mt-5 w-full">
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-navy-900/45">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Razorpay secured · UPI, Cards, Net Banking · Cash on Delivery
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
