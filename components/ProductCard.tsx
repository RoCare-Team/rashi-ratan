'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, ShoppingBag, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/types';
import { cn, discountPercent, formatINR } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { ProductImage } from './GemVisual';
import StarRating from './StarRating';
import WishlistButton from './WishlistButton';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Compact cards drop the description — used inside the cart drawer rails */
  compact?: boolean;
}

export default function ProductCard({ product, className, compact }: ProductCardProps) {
  const { addToCart } = useStore();
  const [quickView, setQuickView] = useState(false);
  const discount = discountPercent(product.originalPrice, product.price);

  return (
    <>
      <article
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-3xl border border-sand-200/90 bg-white',
          'shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-royal-200 hover:shadow-lift',
          className,
        )}
      >
        {/* ------------------------------- Media ------------------------------- */}
        <Link
          href={`/product/${product.slug}`}
          className="relative block aspect-square overflow-hidden"
          style={{
            background: `radial-gradient(120% 100% at 50% 15%, ${product.art.light}22 0%, #ffffff 55%, ${product.art.base}12 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-70 transition-transform duration-700 ease-out group-hover:scale-[1.08]">
            <ProductImage
              art={product.art}
              seed={product.id}
              image={product.images?.[0]}
              alt={product.name}
              className="p-6"
            />
          </div>

          {/* Sheen sweep on hover */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-full" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            {discount > 0 && <span className="badge bg-rose-500 text-white shadow-soft">{discount}% off</span>}
            {product.bestseller && (
              <span className="badge badge-gold">
                <Sparkles className="h-3 w-3" /> Bestseller
              </span>
            )}
            {product.isNew && !product.bestseller && <span className="badge badge-royal">New</span>}
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-[2px]">
              <span className="badge bg-navy-900 text-white">Out of stock</span>
            </div>
          )}
        </Link>

        {/* Floating actions */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <WishlistButton product={product} />
          <button
            type="button"
            onClick={() => setQuickView(true)}
            aria-label={`Quick view ${product.name}`}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/80 text-navy-900/60 shadow-soft backdrop-blur-md transition-all duration-300 hover:scale-110 hover:text-royal-700 active:scale-95"
          >
            <Eye className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* ------------------------------ Content ------------------------------ */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-royal-600">
              {product.gemType}
            </span>
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>

          <h3 className="font-display text-xl font-semibold leading-tight text-navy-900">
            <Link href={`/product/${product.slug}`} className="transition-colors hover:text-royal-700">
              {product.name}
              {product.hindiName && <span className="text-navy-900/45"> · {product.hindiName}</span>}
            </Link>
          </h3>

          {!compact && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-navy-900/55">{product.shortDescription}</p>
          )}

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-navy-900">{formatINR(product.price)}</span>
                <span className="text-sm text-navy-900/40 line-through">{formatINR(product.originalPrice)}</span>
              </div>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                Save {formatINR(product.originalPrice - product.price)}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => addToCart(product)}
            className="btn btn-md btn-primary mt-4 w-full"
          >
            <ShoppingBag className="h-4 w-4" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </article>

      {quickView && <QuickViewModal product={product} onClose={() => setQuickView(false)} />}
    </>
  );
}
