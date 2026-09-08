'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { FaqItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FAQProps {
  items: FaqItem[];
  className?: string;
  /** Index open on first render, -1 for all closed */
  defaultOpen?: number;
}

/** Accordion with a single open panel at a time. */
export default function FAQ({ items, className, defaultOpen = 0 }: FAQProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('divide-y divide-sand-200 overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-soft', className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question} className={cn('transition-colors', isOpen && 'bg-sand-50/60')}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left transition-colors hover:bg-sand-50 sm:px-8 sm:py-6"
            >
              <span className="flex items-start gap-4">
                <span
                  className={cn(
                    'mt-0.5 font-display text-lg font-bold transition-colors',
                    isOpen ? 'text-gold-600' : 'text-navy-900/25',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'font-display text-lg font-semibold leading-snug transition-colors sm:text-xl',
                    isOpen ? 'text-royal-800' : 'text-navy-900',
                  )}
                >
                  {item.question}
                </span>
              </span>
              <span
                className={cn(
                  'grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300',
                  isOpen
                    ? 'rotate-180 border-royal-600 bg-royal-700 text-white'
                    : 'border-sand-300 bg-white text-navy-900/50',
                )}
              >
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>

            <div
              className={cn(
                'grid overflow-hidden transition-all duration-400 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 pl-[3.75rem] text-[15px] leading-relaxed text-navy-900/60 sm:px-8 sm:pb-7 sm:pl-[4.25rem]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
