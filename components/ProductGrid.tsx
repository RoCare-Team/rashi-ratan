import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  /** Desktop column count. Mobile is always 2, tablet 3. */
  columns?: 3 | 4;
  className?: string;
  /** Renders shimmering placeholders instead of cards */
  loading?: boolean;
  loadingCount?: number;
}

export default function ProductGrid({
  products,
  columns = 4,
  className,
  loading,
  loadingCount = 8,
}: ProductGridProps) {
  const gridClass = cn(
    'grid gap-4 sm:gap-6',
    'grid-cols-2 md:grid-cols-3',
    columns === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3',
    className,
  );

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: loadingCount }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-soft">
            <div className="skeleton aspect-square" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-3 w-1/3 rounded-full" />
              <div className="skeleton h-5 w-3/4 rounded-full" />
              <div className="skeleton h-3 w-full rounded-full" />
              <div className="skeleton h-8 w-1/2 rounded-full" />
              <div className="skeleton h-12 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(gridClass, 'stagger')}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
