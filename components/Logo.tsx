import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  tone?: 'light' | 'dark';
  compact?: boolean;
}

/** Brand mark: a faceted gem in gold with the Agarwal Gemstone wordmark. */
export default function Logo({ className, tone = 'light', compact }: LogoProps) {
  const dark = tone === 'dark';

  return (
    <Link href="/" className={cn('group flex min-w-0 shrink-0 items-center gap-2 sm:gap-3', className)} aria-label="Agarwal Gemstone home">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center sm:h-11 sm:w-11 rounded-2xl bg-royal-deep shadow-[0_10px_24px_-10px_rgba(61,24,119,.9)] transition-transform duration-500 group-hover:scale-105">
        <svg viewBox="0 0 40 40" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true">
          <defs>
            <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8e9b6" />
              <stop offset="45%" stopColor="#d4a933" />
              <stop offset="100%" stopColor="#946818" />
            </linearGradient>
          </defs>
          <path d="M20 3 L33 14 L20 37 L7 14 Z" fill="url(#logo-gold)" />
          <path d="M20 3 L33 14 L20 37 L7 14 Z" fill="none" stroke="#fdf6e0" strokeOpacity="0.5" strokeWidth="0.8" />
          <path d="M7 14 H33 M20 3 L14 14 L20 37 M20 3 L26 14 L20 37" stroke="#3d1877" strokeOpacity="0.45" strokeWidth="0.9" fill="none" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-twinkle rounded-full bg-gold-300" />
      </span>

      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn('whitespace-nowrap font-display text-[1.2rem] font-bold tracking-tight sm:text-2xl', dark ? 'text-white' : 'text-navy-900')}>
            Agarwal <span className="text-gold-gradient">Gemstone</span>
          </span>
          <span
            className={cn(
              'mt-1 text-[8px] font-semibold uppercase tracking-[0.24em] sm:text-[9px] sm:tracking-[0.32em]',
              dark ? 'text-white/45' : 'text-navy-900/45',
            )}
          >
            Gems &amp; Astrology
          </span>
        </span>
      )}
    </Link>
  );
}
