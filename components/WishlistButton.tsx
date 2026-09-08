'use client';

import { Heart } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  product: Product;
  className?: string;
  variant?: 'floating' | 'inline';
}

/** Heart toggle used on product cards and the product detail page. */
export default function WishlistButton({ product, className, variant = 'floating' }: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useStore();
  const active = isWishlisted(product.slug);

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={() => toggleWishlist(product)}
        aria-pressed={active}
        className={cn(
          'btn btn-md border transition-all',
          active
            ? 'border-rose-200 bg-rose-50 text-rose-600'
            : 'border-sand-300 bg-white text-navy-900 hover:border-royal-300 hover:text-royal-700',
          className,
        )}
      >
        <Heart className={cn('h-4 w-4', active && 'fill-rose-500 text-rose-500')} />
        {active ? 'Saved' : 'Wishlist'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(product);
      }}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      aria-pressed={active}
      className={cn(
        'grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-all duration-300',
        'hover:scale-110 active:scale-95',
        active
          ? 'border-rose-200 bg-rose-50 text-rose-500 shadow-soft'
          : 'border-white/70 bg-white/80 text-navy-900/60 shadow-soft hover:text-rose-500',
        className,
      )}
    >
      <Heart className={cn('h-[18px] w-[18px] transition-transform', active && 'fill-rose-500 text-rose-500')} />
    </button>
  );
}
