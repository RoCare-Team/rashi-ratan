'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, LayoutGrid, SlidersHorizontal, X } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import ProductFilters, { EMPTY_FILTERS, PRICE_CEILING, type FilterState } from '@/components/ProductFilters';
import SearchBar from '@/components/SearchBar';
import { getAllProducts, getGemTypes, searchProducts } from '@/data/products';
import { getCategoryBySlug } from '@/data/categories';
import { getZodiacBySlug } from '@/data/zodiac';
import { cn } from '@/lib/utils';

type SortKey = 'popular' | 'price-low' | 'price-high' | 'newest' | 'rating';

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top rated' },
];

export default function ShopView() {
  const params = useSearchParams();
  const queryParam = params.get('q') ?? '';
  const categoryParam = params.get('category') ?? '';
  const rashiParam = params.get('rashi') ?? '';
  const sortParam = (params.get('sort') as SortKey) ?? 'popular';

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>(sortParam);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  /* Seed the sidebar from the URL whenever the query string changes. */
  useEffect(() => {
    setFilters({
      ...EMPTY_FILTERS,
      categories: categoryParam ? [categoryParam] : [],
      rashi: rashiParam ? [rashiParam] : [],
    });
    setSort(sortParam);
  }, [categoryParam, rashiParam, sortParam]);

  /* Brief skeleton pass so filtering feels responsive rather than instantaneous. */
  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 260);
    return () => window.clearTimeout(timer);
  }, [filters, sort, queryParam]);

  useEffect(() => {
    document.body.style.overflow = mobileFilters ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFilters]);

  const gemTypes = useMemo(() => getGemTypes(), []);

  const results = useMemo(() => {
    let list = queryParam ? searchProducts(queryParam) : getAllProducts();

    if (filters.categories.length) list = list.filter((product) => filters.categories.includes(product.category));
    if (filters.gemTypes.length) list = list.filter((product) => filters.gemTypes.includes(product.gemType));
    if (filters.rashi.length)
      list = list.filter((product) => product.rashi.some((sign) => filters.rashi.includes(sign)));
    if (filters.maxPrice < PRICE_CEILING) list = list.filter((product) => product.price <= filters.maxPrice);
    if (filters.rating > 0) list = list.filter((product) => product.rating >= filters.rating);
    if (filters.inStockOnly) list = list.filter((product) => product.inStock);

    const sorted = [...list];
    switch (sort) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => Number(b.bestseller ?? false) - Number(a.bestseller ?? false) || b.reviewCount - a.reviewCount);
    }
    return sorted;
  }, [filters, sort, queryParam]);

  const activeCategory = categoryParam ? getCategoryBySlug(categoryParam) : undefined;
  const activeRashi = rashiParam ? getZodiacBySlug(rashiParam) : undefined;

  const heading = queryParam
    ? `Results for “${queryParam}”`
    : activeCategory
      ? activeCategory.name
      : activeRashi
        ? `Gemstones for ${activeRashi.name} Rashi`
        : 'All Products';

  const subheading = queryParam
    ? `${results.length} ${results.length === 1 ? 'product matches' : 'products match'} your search.`
    : activeCategory
      ? activeCategory.description
      : activeRashi
        ? `Traditionally recommended for ${activeRashi.english}, ruled by ${activeRashi.lord}.`
        : 'Certified gemstones, rudraksha, crystals and yantras, all lab tested and ready to ship.';

  const filterPanel = (
    <ProductFilters filters={filters} onChange={setFilters} gemTypes={gemTypes} resultCount={results.length} />
  );

  return (
    <>
      {/* --------------------------------- Header --------------------------------- */}
      <div className="relative overflow-hidden bg-royal-deep pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
        <div className="noise pointer-events-none absolute inset-0" />

        <div className="container-x relative">
          <nav className="flex items-center gap-2 text-xs font-medium text-white/45" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/shop" className="transition-colors hover:text-white">
              Shop
            </Link>
            {activeCategory && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-gold-300">{activeCategory.name}</span>
              </>
            )}
          </nav>

          <h1 className="h-display mt-4 text-4xl text-white sm:text-5xl lg:text-6xl">{heading}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">{subheading}</p>

          <div className="mt-8 max-w-xl">
            <SearchBar size="lg" placeholder="Search within our collection…" />
          </div>
        </div>
      </div>

      {/* --------------------------------- Content --------------------------------- */}
      <div className="container-x -mt-8 pb-20">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-36">{filterPanel}</div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-sand-200 bg-white p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilters(true)}
                  className="btn btn-sm btn-outline lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </button>
                <p className="hidden items-center gap-2 text-sm text-navy-900/55 sm:flex">
                  <LayoutGrid className="h-4 w-4 text-royal-600" />
                  Showing <span className="font-bold text-navy-900">{results.length}</span> products
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-xs font-semibold uppercase tracking-wider text-navy-900/45">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  className="h-10 cursor-pointer rounded-full border border-sand-300 bg-white px-4 pr-8 text-sm font-semibold text-navy-900 transition-colors focus:border-royal-400 focus:outline-none focus:ring-4 focus:ring-royal-500/10"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {results.length === 0 && !loading ? (
              <div className="rounded-3xl border border-sand-200 bg-white p-12 text-center shadow-soft">
                <h3 className="font-display text-3xl font-semibold text-navy-900">Nothing matches those filters</h3>
                <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-navy-900/55">
                  Try widening the price range or clearing a category. Our catalogue holds {getAllProducts().length}{' '}
                  certified products in total.
                </p>
                <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="btn btn-md btn-primary mt-6">
                  Clear all filters
                </button>
              </div>
            ) : (
              <ProductGrid products={results} columns={4} loading={loading} loadingCount={8} />
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------- Mobile filters ----------------------------- */}
      <div
        className={cn('fixed inset-0 z-[75] lg:hidden', mobileFilters ? 'pointer-events-auto' : 'pointer-events-none')}
        aria-hidden={!mobileFilters}
      >
        <div
          className={cn(
            'absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300',
            mobileFilters ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setMobileFilters(false)}
        />
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-sand-50 p-4 shadow-lift transition-transform duration-400 ease-out',
            mobileFilters ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-2xl font-semibold text-navy-900">Refine</span>
            <button
              type="button"
              onClick={() => setMobileFilters(false)}
              aria-label="Close filters"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-navy-900/60 shadow-soft"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {filterPanel}
          <button type="button" onClick={() => setMobileFilters(false)} className="btn btn-md btn-primary mt-4 w-full">
            Show {results.length} products
          </button>
        </div>
      </div>
    </>
  );
}
