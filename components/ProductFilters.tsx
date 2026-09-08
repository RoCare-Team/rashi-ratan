'use client';

import { useState } from 'react';
import { ChevronDown, RotateCcw, Star } from 'lucide-react';
import { categories } from '@/data/categories';
import { zodiacSigns } from '@/data/zodiac';
import { cn, formatINR } from '@/lib/utils';

export interface FilterState {
  categories: string[];
  gemTypes: string[];
  rashi: string[];
  maxPrice: number;
  rating: number;
  inStockOnly: boolean;
}

export const PRICE_CEILING = 16000;

export const EMPTY_FILTERS: FilterState = {
  categories: [],
  gemTypes: [],
  rashi: [],
  maxPrice: PRICE_CEILING,
  rating: 0,
  inStockOnly: false,
};

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  gemTypes: string[];
  /** Live result count shown on the reset row */
  resultCount: number;
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

/* ------------------------------ Small helpers ------------------------------ */

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-sand-200 py-5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-navy-900">{title}</span>
        <ChevronDown className={cn('h-4 w-4 text-navy-900/40 transition-transform', open && 'rotate-180')} />
      </button>
      <div
        className={cn(
          'grid overflow-hidden transition-all duration-300',
          open ? 'grid-rows-[1fr] pt-4 opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5">
      <span
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all duration-200',
          checked ? 'border-royal-700 bg-royal-700' : 'border-sand-300 bg-white group-hover:border-royal-400',
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none" aria-hidden="true">
            <path d="M2 6.5 L4.8 9 L10 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={cn('flex-1 text-sm transition-colors', checked ? 'font-semibold text-navy-900' : 'text-navy-900/65')}>
        {label}
      </span>
      {typeof count === 'number' && <span className="text-xs text-navy-900/35">{count}</span>}
    </label>
  );
}

/* --------------------------------- Sidebar -------------------------------- */

export default function ProductFilters({ filters, onChange, gemTypes, resultCount }: ProductFiltersProps) {
  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });

  const activeCount =
    filters.categories.length +
    filters.gemTypes.length +
    filters.rashi.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < PRICE_CEILING ? 1 : 0);

  return (
    <div className="rounded-3xl border border-sand-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy-900">Filters</h2>
          <p className="text-xs text-navy-900/45">{resultCount} products match</p>
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 px-3 py-1.5 text-xs font-semibold text-navy-900/60 transition-colors hover:border-royal-300 hover:text-royal-700"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset ({activeCount})
          </button>
        )}
      </div>

      <Section title="Category">
        <div className="space-y-0.5">
          {categories.map((category) => (
            <CheckRow
              key={category.slug}
              label={category.name}
              checked={filters.categories.includes(category.slug)}
              onChange={() => set({ categories: toggle(filters.categories, category.slug) })}
            />
          ))}
        </div>
      </Section>

      <Section title="Price range">
        <div className="px-1">
          <input
            type="range"
            min={1000}
            max={PRICE_CEILING}
            step={500}
            value={filters.maxPrice}
            onChange={(event) => set({ maxPrice: Number(event.target.value) })}
            aria-label="Maximum price"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-sand-200 accent-royal-700"
          />
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-navy-900/60">
            <span>{formatINR(1000)}</span>
            <span className="rounded-full bg-royal-50 px-3 py-1 text-royal-700">Up to {formatINR(filters.maxPrice)}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[3000, 6000, 10000, PRICE_CEILING].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => set({ maxPrice: value })}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                  filters.maxPrice === value
                    ? 'border-royal-600 bg-royal-700 text-white'
                    : 'border-sand-300 bg-white text-navy-900/60 hover:border-royal-300',
                )}
              >
                {value === PRICE_CEILING ? 'All' : `Under ${formatINR(value)}`}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Gemstone type" defaultOpen={false}>
        <div className="max-h-56 space-y-0.5 overflow-y-auto pr-1">
          {gemTypes.map((type) => (
            <CheckRow
              key={type}
              label={type}
              checked={filters.gemTypes.includes(type)}
              onChange={() => set({ gemTypes: toggle(filters.gemTypes, type) })}
            />
          ))}
        </div>
      </Section>

      <Section title="Rashi" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {zodiacSigns.map((sign) => {
            const active = filters.rashi.includes(sign.slug);
            return (
              <button
                key={sign.slug}
                type="button"
                onClick={() => set({ rashi: toggle(filters.rashi, sign.slug) })}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                  active
                    ? 'border-royal-600 bg-royal-700 text-white'
                    : 'border-sand-300 bg-white text-navy-900/60 hover:border-royal-300 hover:text-royal-700',
                )}
              >
                {sign.symbol} {sign.name}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Rating">
        <div className="space-y-1">
          {[4.5, 4, 0].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => set({ rating: value })}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-sm transition-colors',
                filters.rating === value ? 'bg-royal-50 font-semibold text-royal-800' : 'text-navy-900/65 hover:bg-sand-50',
              )}
            >
              {value === 0 ? (
                <span>All ratings</span>
              ) : (
                <>
                  <span className="flex items-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <Star
                        key={index}
                        className={cn(
                          'h-3.5 w-3.5',
                          index < Math.floor(value) ? 'fill-gold-400 text-gold-400' : 'text-gold-300/40',
                        )}
                      />
                    ))}
                  </span>
                  <span>{value} &amp; above</span>
                </>
              )}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Availability">
        <CheckRow
          label="In stock only"
          checked={filters.inStockOnly}
          onChange={() => set({ inStockOnly: !filters.inStockOnly })}
        />
      </Section>
    </div>
  );
}
