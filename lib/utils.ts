import type { CartItem, Product } from './types';

/** Indian rupee formatting: 9999 -> "₹9,999" */
export function formatINR(value: number): string {
  return '\u20B9' + Math.round(value).toLocaleString('en-IN');
}

export function discountPercent(original: number, price: number): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export function priceForWeight(product: Product, weightIndex: number): number {
  const option = product.weightOptions[weightIndex] ?? product.weightOptions[0];
  return Math.round(product.price * option.multiplier);
}

export function originalPriceForWeight(product: Product, weightIndex: number): number {
  const option = product.weightOptions[weightIndex] ?? product.weightOptions[0];
  return Math.round(product.originalPrice * option.multiplier);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartSavings(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/** Deterministic pseudo-random in [0,1) from a string — keeps SSR and client in sync. */
export function seededRandom(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 100000) / 100000;
}

/** "RR-8F3K2Q" style demo order id. */
export function makeOrderId(prefix = 'RR'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return prefix + '-' + out;
}

/**
 * Invoice numbers run per Indian financial year (April – March):
 * "AG2627/8F3K2Q7M" for FY 2026-27. GST rules cap the serial at 16 characters.
 */
export function invoiceNumberFor(orderId: string, placedAt: Date = new Date()): string {
  const year = placedAt.getMonth() >= 3 ? placedAt.getFullYear() : placedAt.getFullYear() - 1;
  const fy = `${year % 100}${String((year + 1) % 100).padStart(2, '0')}`;
  return `AG${fy}/${orderId.replace(/^[A-Z]+-/, '')}`.slice(0, 16);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Two decimal rupee formatting for tax documents: 1234.5 -> "₹1,234.50" */
export function formatINRExact(value: number): string {
  return '₹' + value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function estimatedDelivery(days = 5, from: Date = new Date()): string {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
