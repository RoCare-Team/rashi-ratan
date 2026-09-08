'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { searchProducts } from '@/data/products';
import { cn, formatINR } from '@/lib/utils';
import GemVisual from './GemVisual';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  /** Focus the input as soon as it mounts (mobile search sheet) */
  autoFocus?: boolean;
  onNavigate?: () => void;
  size?: 'md' | 'lg';
}

const SUGGESTIONS = ['Blue Sapphire', 'Pukhraj', 'Rudraksha', 'Shree Yantra', 'Rose Quartz'];

/** Type-ahead product search over the hardcoded catalogue. */
export default function SearchBar({
  className,
  placeholder = 'Search gemstones, rudraksha, yantras…',
  autoFocus,
  onNavigate,
  size = 'md',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchProducts(query).slice(0, 6), [query]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={submit} role="search">
        <div className="relative">
          <Search
            className={cn(
              'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-900/35',
              size === 'lg' ? 'h-5 w-5' : 'h-[18px] w-[18px]',
            )}
          />
          <input
            type="search"
            value={query}
            autoFocus={autoFocus}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            aria-label="Search products"
            className={cn(
              'w-full rounded-full border border-sand-300 bg-white/90 pl-11 pr-11 text-[15px] text-navy-900 shadow-inset',
              'placeholder:text-navy-900/35 transition-all duration-300',
              'focus:border-royal-400 focus:outline-none focus:ring-4 focus:ring-royal-500/10',
              size === 'lg' ? 'h-14' : 'h-12',
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-900/35 transition-colors hover:text-navy-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-50 animate-scale-in overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-lift">
          {query.trim() === '' ? (
            <div className="p-5">
              <p className="eyebrow mb-3 text-navy-900/40">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="rounded-full border border-sand-300 bg-sand-50 px-3.5 py-1.5 text-xs font-semibold text-navy-900/70 transition-all hover:border-royal-300 hover:bg-white hover:text-royal-700"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-display text-lg font-semibold text-navy-900">No matches for “{query}”</p>
              <p className="mt-1 text-sm text-navy-900/50">Try a gemstone name, a planet or a rashi.</p>
            </div>
          ) : (
            <>
              <ul className="max-h-[26rem] divide-y divide-sand-100 overflow-y-auto">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-sand-50"
                    >
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                        style={{ background: `linear-gradient(135deg, ${product.art.light}33, ${product.art.base}22)` }}
                      >
                        <GemVisual art={product.art} seed={`s-${product.id}`} sparkle={false} glow={false} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-navy-900">{product.name}</span>
                        <span className="block truncate text-xs text-navy-900/45">
                          {product.gemType} · {product.planet}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-royal-700">{formatINR(product.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={submit}
                className="w-full border-t border-sand-200 bg-sand-50 px-5 py-3.5 text-sm font-semibold text-royal-700 transition-colors hover:bg-sand-100"
              >
                See all results for “{query}”
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
