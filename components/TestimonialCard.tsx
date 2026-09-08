import { BadgeCheck, Quote } from 'lucide-react';
import type { Review } from '@/lib/types';
import { cn, initials } from '@/lib/utils';
import StarRating from './StarRating';

interface TestimonialCardProps {
  review: Review;
  className?: string;
}

export default function TestimonialCard({ review, className }: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        'group relative flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-xl',
        'transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-400/40 hover:bg-white/[0.1]',
        className,
      )}
    >
      <Quote className="absolute right-6 top-6 h-9 w-9 text-gold-400/20 transition-colors group-hover:text-gold-400/40" />

      <StarRating rating={review.rating} size="md" />

      <figcaption className="mt-4 font-display text-xl font-semibold leading-snug text-white">
        {review.title}
      </figcaption>

      <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-white/65">{review.text}</blockquote>

      <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white shadow-soft"
          style={{ background: `linear-gradient(135deg, ${review.avatar.from}, ${review.avatar.to})` }}
          aria-hidden="true"
        >
          {initials(review.name)}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
            {review.name}
            {review.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-gold-400" />}
          </p>
          <p className="truncate text-xs text-white/45">
            {review.location} · {review.date}
          </p>
        </div>
      </div>
    </figure>
  );
}
