'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, Coupon, DemoOrder, Product } from '@/lib/types';
import { cartSavings, cartSubtotal, originalPriceForWeight, priceForWeight } from '@/lib/utils';
import { couponDiscount, deliveryCharge, findCoupon } from '@/data/coupons';

/**
 * Client side store for cart, wishlist, coupon and toasts.
 *
 * Everything lives in React state and is mirrored to localStorage, which is all
 * a prototype needs. Replacing this with a real backend later means swapping
 * the localStorage effects for API calls — the component API stays the same.
 */

const CART_KEY = 'rashi-ratan.cart';
const WISHLIST_KEY = 'rashi-ratan.wishlist';
const ORDER_KEY = 'rashi-ratan.last-order';
const COUPON_KEY = 'rashi-ratan.coupon';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  description?: string;
  type: ToastType;
}

interface StoreValue {
  /* cart */
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  savings: number;
  discount: number;
  delivery: number;
  total: number;
  addToCart: (product: Product, weightIndex?: number, quantity?: number) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;

  /* cart drawer */
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  /* wishlist */
  wishlist: string[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (slug: string) => boolean;
  removeFromWishlist: (slug: string) => void;

  /* coupon */
  coupon: Coupon | null;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  clearCoupon: () => void;

  /* order */
  lastOrder: DemoOrder | null;
  setLastOrder: (order: DemoOrder) => void;

  /* toasts */
  toasts: Toast[];
  toast: (message: string, options?: { description?: string; type?: ToastType }) => void;
  dismissToast: (id: number) => void;

  /** false during the first paint, before localStorage has been read */
  hydrated: boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [lastOrder, setLastOrderState] = useState<DemoOrder | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const toastId = useRef(0);

  /* ------------------------------- hydration ------------------------------- */
  useEffect(() => {
    setItems(readJSON<CartItem[]>(CART_KEY, []));
    setWishlist(readJSON<string[]>(WISHLIST_KEY, []));
    setLastOrderState(readJSON<DemoOrder | null>(ORDER_KEY, null));

    // Store only the code and re-resolve it, so coupon rules stay server-authoritative.
    const savedCode = readJSON<string | null>(COUPON_KEY, null);
    if (savedCode) setCoupon(findCoupon(savedCode) ?? null);

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(COUPON_KEY, JSON.stringify(coupon?.code ?? null));
  }, [coupon, hydrated]);

  /* --------------------------------- toasts -------------------------------- */
  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback<StoreValue['toast']>(
    (message, options) => {
      const id = ++toastId.current;
      setToasts((current) => [
        ...current,
        { id, message, description: options?.description, type: options?.type ?? 'success' },
      ]);
      window.setTimeout(() => dismissToast(id), 3600);
    },
    [dismissToast],
  );

  /* ---------------------------------- cart --------------------------------- */
  const addToCart = useCallback<StoreValue['addToCart']>(
    (product, weightIndex = product.defaultWeightIndex, quantity = 1) => {
      const weight = product.weightOptions[weightIndex] ?? product.weightOptions[0];
      const key = `${product.slug}__${weight.label}`;

      setItems((current) => {
        const existing = current.find((item) => item.key === key);
        if (existing) {
          return current.map((item) =>
            item.key === key ? { ...item, quantity: Math.min(item.quantity + quantity, 10) } : item,
          );
        }
        const next: CartItem = {
          key,
          slug: product.slug,
          name: product.name,
          weight: weight.label,
          price: priceForWeight(product, weightIndex),
          originalPrice: originalPriceForWeight(product, weightIndex),
          quantity,
          art: product.art,
          image: product.images?.[0],
        };
        return [...current, next];
      });

      toast(`${product.name} added to cart`, { description: `${weight.label} · Quantity ${quantity}` });
      setIsCartOpen(true);
    },
    [toast],
  );

  const removeFromCart = useCallback<StoreValue['removeFromCart']>(
    (key) => {
      setItems((current) => {
        const target = current.find((item) => item.key === key);
        if (target) toast(`${target.name} removed`, { type: 'info' });
        return current.filter((item) => item.key !== key);
      });
    },
    [toast],
  );

  const updateQuantity = useCallback<StoreValue['updateQuantity']>((key, quantity) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((item) => item.key !== key)
        : current.map((item) => (item.key === key ? { ...item, quantity: Math.min(quantity, 10) } : item)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  /* -------------------------------- wishlist ------------------------------- */
  const toggleWishlist = useCallback<StoreValue['toggleWishlist']>(
    (product) => {
      setWishlist((current) => {
        if (current.includes(product.slug)) {
          toast(`${product.name} removed from wishlist`, { type: 'info' });
          return current.filter((slug) => slug !== product.slug);
        }
        toast(`${product.name} saved to wishlist`, { description: 'View it any time from the heart icon' });
        return [...current, product.slug];
      });
    },
    [toast],
  );

  const removeFromWishlist = useCallback((slug: string) => {
    setWishlist((current) => current.filter((item) => item !== slug));
  }, []);

  const isWishlisted = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  /* --------------------------------- totals -------------------------------- */
  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const savings = useMemo(() => cartSavings(items), [items]);
  const discount = useMemo(() => couponDiscount(coupon, subtotal), [coupon, subtotal]);
  const delivery = useMemo(() => deliveryCharge(subtotal - discount), [subtotal, discount]);
  const total = Math.max(0, subtotal - discount + delivery);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  /* --------------------------------- coupon -------------------------------- */
  const applyCoupon = useCallback<StoreValue['applyCoupon']>(
    (code) => {
      const found = findCoupon(code);
      if (!found) {
        toast('Invalid coupon code', { description: 'Try RASHI10, GEMSTONE20 or NAVRATRI15', type: 'error' });
        return { ok: false, message: 'That code is not valid.' };
      }
      if (subtotal < found.minSubtotal) {
        const message = `Add items worth ₹${(found.minSubtotal - subtotal).toLocaleString('en-IN')} more to use ${found.code}.`;
        toast('Coupon not applicable yet', { description: message, type: 'error' });
        return { ok: false, message };
      }
      setCoupon(found);
      toast(`${found.code} applied`, { description: found.label });
      return { ok: true, message: found.label };
    },
    [subtotal, toast],
  );

  const clearCoupon = useCallback(() => setCoupon(null), []);

  /* ---------------------------------- order -------------------------------- */
  const setLastOrder = useCallback((order: DemoOrder) => {
    setLastOrderState(order);
    try {
      window.localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
      /* storage unavailable — the in-memory order still drives the success page */
    }
  }, []);

  /* ------------------------------- cart drawer ------------------------------ */
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const value: StoreValue = {
    items,
    itemCount,
    subtotal,
    savings,
    discount,
    delivery,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    wishlist,
    toggleWishlist,
    isWishlisted,
    removeFromWishlist,
    coupon,
    applyCoupon,
    clearCoupon,
    lastOrder,
    setLastOrder,
    toasts,
    toast,
    dismissToast,
    hydrated,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside <StoreProvider>');
  return context;
}
