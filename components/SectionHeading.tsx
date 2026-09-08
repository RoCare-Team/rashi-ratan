import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  /** Rendered in gold italic display type after the title */
  accent?: string;
  description?: string;
  align?: 'left' | 'center';
  link?: { href: string; label: string };
  tone?: 'light' | 'dark';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = 'center',
  link,
  tone = 'light',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';
  const dark = tone === 'dark';

  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-4 md:mb-14',
        centered ? 'items-center text-center' : 'items-start md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'flex flex-col items-center')}>
        {eyebrow && (
          <span className={cn('eyebrow mb-3', dark ? 'text-gold-300' : 'text-royal-600')}>
            <span className={cn('h-px w-6', dark ? 'bg-gold-300/60' : 'bg-royal-400/60')} />
            {eyebrow}
          </span>
        )}
        <h2 className={cn('h-display text-4xl sm:text-5xl', dark ? 'text-white' : 'text-navy-900')}>
          {title}
          {accent && <span className="text-gold-gradient italic"> {accent}</span>}
        </h2>
        {description && (
          <p className={cn('mt-4 text-base leading-relaxed', dark ? 'text-white/65' : 'text-navy-900/55')}>
            {description}
          </p>
        )}
      </div>

      {link && (
        <Link
          href={link.href}
          className={cn(
            'group inline-flex shrink-0 items-center gap-2 text-sm font-semibold transition-colors',
            dark ? 'text-gold-300 hover:text-gold-200' : 'text-royal-700 hover:text-royal-900',
          )}
        >
          {link.label}
          <span
            className={cn(
              'grid h-8 w-8 place-items-center rounded-full border transition-all duration-300 group-hover:translate-x-1',
              dark ? 'border-white/20 bg-white/5' : 'border-sand-300 bg-white',
            )}
          >
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      )}
    </div>
  );
}
