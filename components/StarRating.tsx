import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  /** Rendered next to the stars, e.g. "(342)" */
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
}

const SIZES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

/** Five stars with a half-star clip for fractional ratings. */
export default function StarRating({ rating, count, size = 'sm', className, showValue }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((index) => {
          const fill = Math.max(0, Math.min(1, rating - index));
          return (
            <span key={index} className="relative inline-block">
              <Star className={cn(SIZES[size], 'text-gold-300/40')} strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn(SIZES[size], 'fill-gold-400 text-gold-400')} strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </div>
      {showValue && <span className="text-xs font-bold text-navy-900">{rating.toFixed(1)}</span>}
      {typeof count === 'number' && <span className="text-xs font-medium text-navy-900/50">({count})</span>}
    </div>
  );
}
