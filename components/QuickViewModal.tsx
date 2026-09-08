'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, BadgeCheck, Minus, Plus, ShieldCheck, ShoppingBag, Truck, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { cn, discountPercent, formatINR, originalPriceForWeight, priceForWeight } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { ProductImage } from './GemVisual';
import StarRating from './StarRating';
import WishlistButton from './WishlistButton';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

/** Lightweight product preview so shoppers never lose their place in the grid. */
export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useStore();
  const [weightIndex, setWeightIndex] = useState(product.defaultWeightIndex);
  const [quantity, setQuantity] = useState(1);

  const price = priceForWeight(product, weightIndex);
  const originalPrice = originalPriceForWeight(product, weightIndex);
  const discount = discountPercent(originalPrice, price);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-navy-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} quick view`}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-4xl animate-scale-in overflow-y-auto rounded-t-3xl bg-white shadow-lift sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-sand-200 bg-white/90 text-navy-900/60 shadow-soft backdrop-blur transition-colors hover:text-navy-900"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-0 md:grid-cols-2">
          {/* Visual */}
          <div
            className="relative flex aspect-square items-center justify-center overflow-hidden sm:rounded-l-3xl"
            style={{
              background: `radial-gradient(110% 90% at 50% 25%, ${product.art.light}30 0%, #ffffff 60%, ${product.art.base}18 100%)`,
            }}
          >
            <div className="h-full w-full p-10">
              <ProductImage art={product.art} seed={`qv-${product.id}`} image={product.images?.[0]} alt={product.name} />
            </div>
            {discount > 0 && (
              <span className="badge absolute left-5 top-5 bg-rose-500 text-white shadow-soft">{discount}% off</span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col p-6 sm:p-8">
            <span className="eyebrow text-royal-600">{product.gemType}</span>
            <h2 className="h-display mt-2 text-3xl text-navy-900">
              {product.name}
              {product.hindiName && <span className="text-navy-900/45"> · {product.hindiName}</span>}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StarRating rating={product.rating} count={product.reviewCount} size="md" showValue />
              {product.planet && <span className="badge badge-royal">{product.planet}</span>}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-navy-900/60">{product.shortDescription}</p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-navy-900">{formatINR(price)}</span>
              <span className="text-base text-navy-900/40 line-through">{formatINR(originalPrice)}</span>
            </div>

            {/* Weight */}
            <div className="mt-6">
              <p className="field-label">Select {product.category === 'rudraksha' ? 'Size' : 'Weight'}</p>
              <div className="flex flex-wrap gap-2">
                {product.weightOptions.map((option, index) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setWeightIndex(index)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                      index === weightIndex
                        ? 'border-royal-600 bg-royal-700 text-white shadow-[0_8px_20px_-8px_rgba(95,31,189,.8)]'
                        : 'border-sand-300 bg-white text-navy-900/70 hover:border-royal-300 hover:text-royal-700',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center rounded-full border border-sand-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="grid h-12 w-12 place-items-center rounded-l-full text-navy-900/60 transition-colors hover:text-royal-700"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                  className="grid h-12 w-12 place-items-center rounded-r-full text-navy-900/60 transition-colors hover:text-royal-700"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => {
                  addToCart(product, weightIndex, quantity);
                  onClose();
                }}
                className="btn btn-md btn-primary flex-1"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>

              <WishlistButton product={product} variant="inline" />
            </div>

            <Link
              href={`/product/${product.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-royal-700 transition-colors hover:text-royal-900"
            >
              View full details <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-sand-200 pt-5 text-center">
              {[
                { icon: BadgeCheck, label: 'Certified' },
                { icon: ShieldCheck, label: 'Secure pay' },
                { icon: Truck, label: 'Free ship' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <Icon className="h-5 w-5 text-royal-600" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-900/50">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
