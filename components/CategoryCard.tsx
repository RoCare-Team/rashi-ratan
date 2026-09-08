import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import GemVisual from './GemVisual';

interface CategoryCardProps {
  category: Category & { count: number };
  className?: string;
}

export default function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl border border-sand-200/90 bg-white p-6',
        'shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-lift',
        className,
      )}
    >
      {/* Colour wash that blooms on hover */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 90% at 80% 0%, ${category.accent}1f 0%, transparent 60%)`,
        }}
      />
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, ${category.accent}, #d4a933)` }}
      />

      <div className="relative mb-5 h-28 w-28 self-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110">
        <GemVisual art={category.art} seed={`cat-${category.slug}`} sparkle={false} />
      </div>

      <div className="relative mt-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold leading-tight text-navy-900">{category.name}</h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-royal-600">{category.tagline}</p>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sand-200 bg-sand-50 text-navy-900/50 transition-all duration-300 group-hover:border-royal-300 group-hover:bg-royal-700 group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-navy-900/55">{category.description}</p>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-navy-900/40">
          {category.count} {category.count === 1 ? 'product' : 'products'}
        </p>
      </div>
    </Link>
  );
}
