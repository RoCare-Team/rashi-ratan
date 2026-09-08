'use client';

import type { Zodiac } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ZodiacCardProps {
  sign: Zodiac;
  active?: boolean;
  onSelect?: (slug: string) => void;
  tone?: 'light' | 'dark';
}

/** Circular zodiac chip used in the Shop by Rashi section. */
export default function ZodiacCard({ sign, active, onSelect, tone = 'dark' }: ZodiacCardProps) {
  const dark = tone === 'dark';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(sign.slug)}
      aria-pressed={active}
      className="group flex flex-col items-center gap-2.5 focus:outline-none"
    >
      <span
        className={cn(
          'relative grid h-20 w-20 place-items-center rounded-full border text-3xl transition-all duration-400 sm:h-24 sm:w-24 sm:text-4xl',
          'group-hover:-translate-y-1.5 group-focus-visible:ring-2 group-focus-visible:ring-gold-400',
          active
            ? 'border-gold-400/70 bg-gold-sheen text-navy-950 shadow-[0_16px_40px_-14px_rgba(212,169,51,.85)]'
            : dark
              ? 'border-white/15 bg-white/[0.06] text-gold-200 backdrop-blur-md group-hover:border-gold-400/50 group-hover:bg-white/[0.12]'
              : 'border-sand-300 bg-white text-royal-700 shadow-soft group-hover:border-royal-300',
        )}
      >
        {sign.symbol}
        {active && <span className="absolute -inset-1.5 -z-10 animate-spin-slow rounded-full border border-dashed border-gold-400/50" />}
      </span>

      <span className="text-center leading-tight">
        <span
          className={cn(
            'block text-sm font-bold transition-colors',
            active ? 'text-gold-300' : dark ? 'text-white' : 'text-navy-900',
          )}
        >
          {sign.name}
        </span>
        <span className={cn('block text-[11px]', dark ? 'text-white/45' : 'text-navy-900/45')}>{sign.english}</span>
      </span>
    </button>
  );
}
