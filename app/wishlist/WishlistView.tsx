'use client';

import Link from 'next/link';
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import GemVisual from '@/components/GemVisual';
import ProductGrid from '@/components/ProductGrid';
import SectionHeading from '@/components/SectionHeading';
import StarRating from '@/components/StarRating';
import { useStore } from '@/context/StoreContext';
import { getBestsellers, getProductBySlug } from '@/data/products';
import { formatINR } from '@/lib/utils';

export default function WishlistView() {
  const { wishlist, removeFromWishlist, addToCart, hydrated } = useStore();

  const saved = wishlist.map((slug) => getProductBySlug(slug)).filter((product) => product !== undefined);

  if (!hydrated) {
    return (
      <div className="container-x py-20">
        <div className="skeleton h-10 w-48 rounded-full" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton h-40 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="relative overflow-hidden bg-royal-deep py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
        <div className="noise pointer-events-none absolute inset-0" />
        <div className="container-x relative">
          <span className="eyebrow rounded-full border border-gold-400/30 bg-white/5 px-4 py-2 text-gold-300 backdrop-blur">
            <Heart className="h-3.5 w-3.5" /> Saved for later
          </span>
          <h1 className="h-display mt-5 text-4xl text-white sm:text-5xl lg:text-6xl">My Wishlist</h1>
          <p className="mt-3 text-[15px] text-white/60">
            {saved.length === 0
              ? 'Nothing saved yet — tap the heart on any product to keep it here.'
              : `${saved.length} ${saved.length === 1 ? 'product' : 'products'} saved to your list.`}
          </p>
        </div>
      </div>

      <div className="container-x -mt-8">
        {saved.length === 0 ? (
          <div className="rounded-[2rem] border border-sand-200 bg-white p-12 text-center shadow-soft">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rose-50 text-rose-400">
              <Heart className="h-9 w-9" />
            </span>
            <h2 className="h-display mt-6 text-3xl text-navy-900">Your wishlist is waiting</h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-navy-900/55">
              Save gemstones you are considering and compare them side by side before you commit.
            </p>
            <Link href="/shop" className="btn btn-lg btn-primary mt-7">
              Explore products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {saved.map((product) => (
              <li
                key={product.id}
                className="flex flex-col gap-5 rounded-3xl border border-sand-200 bg-white p-5 shadow-soft transition-shadow hover:shadow-lift sm:flex-row sm:items-center"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="grid h-36 w-full shrink-0 place-items-center rounded-2xl border border-sand-200 sm:h-32 sm:w-32"
                  style={{
                    background: `linear-gradient(140deg, ${product.art.light}22, #ffffff 60%, ${product.art.base}18)`,
                  }}
                >
                  <GemVisual art={product.art} seed={`wish-${product.id}`} sparkle={false} />
                </Link>

                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-royal-600">
                    {product.gemType}
                  </span>
                  <Link
                    href={`/product/${product.slug}`}
                    className="mt-1 block font-display text-2xl font-semibold leading-tight text-navy-900 transition-colors hover:text-royal-700"
                  >
                    {product.name}
                    {product.hindiName && <span className="text-navy-900/40"> · {product.hindiName}</span>}
                  </Link>
                  <p className="mt-1.5 line-clamp-1 text-sm text-navy-900/55">{product.shortDescription}</p>
                  <div className="mt-2">
                    <StarRating rating={product.rating} count={product.reviewCount} />
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
                  <div className="text-right">
                    <span className="font-display text-2xl font-bold text-navy-900">{formatINR(product.price)}</span>
                    <span className="ml-2 text-sm text-navy-900/40 line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                  </div>

                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      disabled={!product.inStock}
                      onClick={() => addToCart(product)}
                      className="btn btn-md btn-primary"
                    >
                      <ShoppingBag className="h-4 w-4" /> Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.slug)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-sand-300 text-navy-900/40 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-20">
          <SectionHeading align="left" eyebrow="You may also like" title="Trending" accent="this week" />
          <ProductGrid products={getBestsellers(4)} columns={4} />
        </div>
      </div>
    </div>
  );
}
