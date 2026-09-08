'use client';

import Link from 'next/link';
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { FREE_DELIVERY_ABOVE } from '@/data/coupons';
import { cn, formatINR } from '@/lib/utils';
import GemVisual from './GemVisual';

/** Slide-out cart, mounted once in the root layout. */
export default function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQuantity, removeFromCart, subtotal, savings, itemCount } = useStore();

  const toFreeShipping = Math.max(0, FREE_DELIVERY_ABOVE - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_ABOVE) * 100);

  return (
    <div
      className={cn('fixed inset-0 z-[80]', isCartOpen ? 'pointer-events-auto' : 'pointer-events-none')}
      aria-hidden={!isCartOpen}
    >
      <div
        className={cn(
          'absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300',
          isCartOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={closeCart}
      />

      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-sand-50 shadow-lift transition-transform duration-400 ease-out',
          isCartOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand-200 bg-white px-5 py-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy-900">Your Cart</h2>
            <p className="text-xs text-navy-900/50">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-full text-navy-900/60 transition-colors hover:bg-sand-100 hover:text-navy-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-royal-50 text-royal-400">
              <ShoppingBag className="h-9 w-9" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-navy-900">Your cart is empty</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-900/55">
              Explore certified gemstones, rudraksha and yantras chosen for your chart.
            </p>
            <Link href="/shop" onClick={closeCart} className="btn btn-md btn-primary mt-6">
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping meter */}
            <div className="border-b border-sand-200 bg-white px-5 py-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-navy-900/70">
                <Truck className="h-4 w-4 text-royal-600" />
                {toFreeShipping > 0 ? (
                  <span>
                    Add <span className="text-royal-700">{formatINR(toFreeShipping)}</span> more for free shipping
                  </span>
                ) : (
                  <span className="text-emerald-600">You have unlocked free insured shipping</span>
                )}
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand-200">
                <div
                  className="h-full rounded-full bg-gold-sheen transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <ul className="flex-1 divide-y divide-sand-200 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={closeCart}
                    className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border border-sand-200 bg-white"
                    style={{ background: `linear-gradient(140deg, ${item.art.light}22, #ffffff 60%, ${item.art.base}18)` }}
                  >
                    <GemVisual art={item.art} seed={`cart-${item.key}`} sparkle={false} />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="font-display text-lg font-semibold leading-tight text-navy-900 transition-colors hover:text-royal-700"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        aria-label={`Remove ${item.name}`}
                        className="-m-1 shrink-0 rounded-full p-1 text-navy-900/35 transition-colors hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-0.5 text-xs text-navy-900/50">{item.weight}</p>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      <div className="flex h-9 items-center rounded-full border border-sand-300 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="grid h-9 w-9 place-items-center rounded-l-full text-navy-900/60 transition-colors hover:text-royal-700"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="grid h-9 w-9 place-items-center rounded-r-full text-navy-900/60 transition-colors hover:text-royal-700"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-navy-900">
                          {formatINR(item.price * item.quantity)}
                        </p>
                        {item.originalPrice > item.price && (
                          <p className="text-xs text-navy-900/35 line-through">
                            {formatINR(item.originalPrice * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-sand-200 bg-white p-5">
              {savings > 0 && (
                <div className="mb-3 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                  <span>You are saving</span>
                  <span>{formatINR(savings)}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-navy-900/60">Subtotal</span>
                <span className="font-display text-3xl font-bold text-navy-900">{formatINR(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-navy-900/45">Taxes included. Delivery calculated at checkout.</p>

              <div className="mt-4 grid gap-2.5">
                <Link href="/checkout" onClick={closeCart} className="btn btn-md btn-primary w-full">
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/cart" onClick={closeCart} className="btn btn-md btn-outline w-full">
                  View full cart
                </Link>
              </div>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-navy-900/45">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Secure payments by Razorpay · UPI, Cards, Net Banking
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
