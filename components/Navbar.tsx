'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ChevronDown,
  Heart,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  X,
} from 'lucide-react';
import { categories } from '@/data/categories';
import { useStore } from '@/context/StoreContext';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import SearchBar from './SearchBar';

const GEM_CATEGORIES = ['rashi-ratna', 'navratna', 'precious-gemstones', 'gemstone-jewelry'];

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Gemstones', href: '/shop', dropdown: true },
  { label: 'Rudraksha', href: '/shop?category=rudraksha' },
  { label: 'Crystals', href: '/shop?category=crystals' },
  { label: 'Yantras', href: '/shop?category=yantras' },
  { label: 'Gem Guide', href: '/gemstones' },
  { label: 'Astrology', href: '/astrology' },
  { label: 'About', href: '/about' },
  { label: 'Support', href: '/support' },
];

const TICKER = [
  { icon: Truck, text: 'Free insured shipping above ₹2,000' },
  { icon: ShieldCheck, text: 'Lab certified, 100% natural gemstones' },
  { icon: Sparkles, text: 'Free astrology consultation with every order' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, wishlist, openCart, hydrated } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [gemsOpen, setGemsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSearch(false);
    setGemsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  /**
   * Category links all point at /shop with a different query string, and the
   * pathname alone cannot tell them apart — so only links without a query are
   * ever marked active.
   */
  const isActive = (href: string) => {
    if (href.includes('?')) return false;
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  };

  return (
    <>
      {/* ------------------------------ Announcement ------------------------------ */}
      <div className="relative z-50 overflow-hidden bg-navy-950 text-white print:hidden">
        <div className="container-x flex h-9 items-center justify-between text-[11px] font-medium">
          <div className="flex items-center gap-6 overflow-hidden">
            {TICKER.map((item, index) => (
              <span
                key={item.text}
                className={cn('flex items-center gap-2 whitespace-nowrap text-white/70', index > 0 && 'hidden lg:flex')}
              >
                <item.icon className="h-3.5 w-3.5 text-gold-400" />
                {item.text}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:+919996992608" className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-gold-300">
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden whitespace-nowrap sm:inline">+91 99969 92608</span>
            </a>
            <Link href="/support" className="hidden whitespace-nowrap text-white/70 transition-colors hover:text-gold-300 md:inline">
              Help &amp; Support
            </Link>
            <Link href="/track-order" className="hidden whitespace-nowrap text-white/70 transition-colors hover:text-gold-300 sm:inline">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* --------------------------------- Header --------------------------------- */}
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-300 print:hidden',
          scrolled
            ? 'border-sand-200 bg-white/85 shadow-soft backdrop-blur-xl'
            : 'border-transparent bg-sand-50/80 backdrop-blur-md',
        )}
      >
        <div className="container-x">
          {/* Row 1 */}
          <div className="flex h-[72px] items-center gap-4 lg:h-20 lg:gap-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-navy-900 transition-colors hover:bg-sand-200/70 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Logo className="lg:mr-2" />

            <div className="ml-auto hidden max-w-xl flex-1 lg:block">
              <SearchBar />
            </div>

            <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:gap-2">
              <button
                type="button"
                onClick={() => setMobileSearch((value) => !value)}
                aria-label="Search"
                className="grid h-11 w-11 place-items-center rounded-full text-navy-900 transition-colors hover:bg-sand-200/70 lg:hidden"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative hidden h-11 w-11 place-items-center rounded-full text-navy-900 transition-colors hover:bg-sand-200/70 sm:grid"
              >
                <Heart className="h-5 w-5" />
                {hydrated && wishlist.length > 0 && (
                  <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-[18px] text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                aria-label={`Shopping cart, ${itemCount} items`}
                className="relative grid h-11 w-11 place-items-center rounded-full text-navy-900 transition-colors hover:bg-sand-200/70"
              >
                <ShoppingBag className="h-5 w-5" />
                {hydrated && itemCount > 0 && (
                  <span className="absolute right-0.5 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-royal-700 px-1 text-[10px] font-bold text-white shadow-soft">
                    {itemCount}
                  </span>
                )}
              </button>

              <Link
                href="/account"
                aria-label="Account"
                className="hidden h-11 w-11 place-items-center rounded-full text-navy-900 transition-colors hover:bg-sand-200/70 sm:grid"
              >
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Row 2 — desktop nav */}
          <nav className="hidden h-12 items-center gap-1 border-t border-sand-200/70 lg:flex">
            {NAV_LINKS.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setGemsOpen(true)}
                  onMouseLeave={() => setGemsOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex h-12 items-center gap-1.5 px-4 text-sm font-semibold transition-colors',
                      isActive(link.href) ? 'text-royal-700' : 'text-navy-900/70 hover:text-royal-700',
                    )}
                  >
                    {link.label}
                    <ChevronDown className={cn('h-4 w-4 transition-transform', gemsOpen && 'rotate-180')} />
                  </Link>

                  {gemsOpen && (
                    <div className="absolute left-0 top-full w-[30rem] animate-scale-in overflow-hidden rounded-3xl border border-sand-200 bg-white p-3 shadow-lift">
                      <div className="grid grid-cols-2 gap-1">
                        {categories
                          .filter((category) => GEM_CATEGORIES.includes(category.slug))
                          .map((category) => (
                            <Link
                              key={category.slug}
                              href={`/shop?category=${category.slug}`}
                              className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-sand-50"
                            >
                              <span
                                className="mt-0.5 h-9 w-9 shrink-0 rounded-xl"
                                style={{
                                  background: `linear-gradient(135deg, ${category.art.light}, ${category.art.base})`,
                                }}
                              />
                              <span>
                                <span className="block text-sm font-semibold text-navy-900 group-hover:text-royal-700">
                                  {category.name}
                                </span>
                                <span className="mt-0.5 block text-xs leading-snug text-navy-900/50">
                                  {category.tagline}
                                </span>
                              </span>
                            </Link>
                          ))}
                      </div>
                      <Link
                        href="/gemstones"
                        className="mt-2 block rounded-2xl border border-sand-200 px-4 py-3 text-center text-sm font-semibold text-navy-900 transition-colors hover:bg-sand-50"
                      >
                        Types of gemstones — the complete guide
                      </Link>
                      <Link
                        href="/shop"
                        className="mt-2 block rounded-2xl bg-royal-deep px-4 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        Browse the full collection
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'relative flex h-12 items-center px-4 text-sm font-semibold transition-colors',
                    isActive(link.href) ? 'text-royal-700' : 'text-navy-900/70 hover:text-royal-700',
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gold-sheen" />
                  )}
                </Link>
              ),
            )}

            <Link href="/astrology#finder" className="btn btn-sm btn-gold ml-auto">
              <Sparkles className="h-4 w-4" /> Find Your Lucky Stone
            </Link>
          </nav>
        </div>

        {/* Mobile search sheet */}
        {mobileSearch && (
          <div className="border-t border-sand-200 bg-white p-4 lg:hidden">
            <SearchBar autoFocus onNavigate={() => setMobileSearch(false)} />
          </div>
        )}
      </header>

      {/* ------------------------------ Mobile drawer ------------------------------ */}
      <div
        className={cn(
          'fixed inset-0 z-[70] lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            'absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={cn(
            'absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-sand-50 shadow-lift transition-transform duration-400 ease-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between border-b border-sand-200 px-5 py-4">
            <Logo />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="grid h-10 w-10 place-items-center rounded-full text-navy-900 transition-colors hover:bg-sand-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-sand-200 p-5">
            <SearchBar onNavigate={() => setMobileOpen(false)} />
          </div>

          <nav className="flex-1 overflow-y-auto p-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold transition-colors',
                  isActive(link.href) ? 'bg-white text-royal-700 shadow-soft' : 'text-navy-900 hover:bg-white',
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-4 border-t border-sand-200 pt-4">
              <p className="eyebrow mb-2 px-4 text-navy-900/40">Shop by category</p>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/shop?category=${category.slug}`}
                  className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-navy-900/70 transition-colors hover:bg-white"
                >
                  <span
                    className="h-6 w-6 rounded-lg"
                    style={{ background: `linear-gradient(135deg, ${category.art.light}, ${category.art.base})` }}
                  />
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="grid grid-cols-2 gap-3 border-t border-sand-200 p-5">
            <Link href="/wishlist" className="btn btn-md btn-outline">
              <Heart className="h-4 w-4" /> Wishlist
            </Link>
            <Link href="/astrology#finder" className="btn btn-md btn-gold">
              <Sparkles className="h-4 w-4" /> Lucky Stone
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
