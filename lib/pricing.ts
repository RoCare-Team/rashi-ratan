import { getProductBySlug } from '@/data/products';
import { couponDiscount, deliveryCharge, findCoupon } from '@/data/coupons';
import { COD_FEE, COD_MAX_ORDER, type PaymentMethod } from './business';
import { computeGst, gstRuleFor, type GstBreakdown } from './gst';
import { originalPriceForWeight, priceForWeight } from './utils';
import type { CartItem } from './types';

/**
 * Order quote — the single source of truth for what an order costs.
 *
 * It re-prices every line from the catalogue instead of trusting prices held in
 * the browser, so the same function runs in the checkout UI (for display) and
 * in the API routes (to decide what to actually charge).
 */

export interface QuoteLineInput {
  slug: string;
  weight: string;
  quantity: number;
}

export interface QuoteInput {
  lines: QuoteLineInput[];
  couponCode?: string | null;
  buyerState: string;
  paymentMethod: PaymentMethod;
}

export interface QuoteLine {
  slug: string;
  name: string;
  weight: string;
  quantity: number;
  unitPrice: number;
  unitOriginalPrice: number;
  lineTotal: number;
  hsn: string;
  gstRate: number;
}

export interface Quote {
  lines: QuoteLine[];
  subtotal: number;
  couponCode: string | null;
  discount: number;
  delivery: number;
  codFee: number;
  total: number;
  gst: GstBreakdown;
  codAllowed: boolean;
  /** Problems that make the quote unusable, e.g. an unknown product */
  errors: string[];
}

const MAX_QUANTITY = 10;

export function quoteOrder({ lines, couponCode, buyerState, paymentMethod }: QuoteInput): Quote {
  const errors: string[] = [];
  const priced: QuoteLine[] = [];

  for (const line of lines) {
    const product = getProductBySlug(line.slug);
    if (!product) {
      errors.push(`Unknown product: ${line.slug}`);
      continue;
    }
    if (!product.inStock) errors.push(`${product.name} is out of stock`);

    const weightIndex = product.weightOptions.findIndex((option) => option.label === line.weight);
    if (weightIndex === -1) {
      errors.push(`${product.name} is not available in ${line.weight}`);
      continue;
    }

    const quantity = Math.max(1, Math.min(MAX_QUANTITY, Math.floor(Number(line.quantity) || 1)));
    const unitPrice = priceForWeight(product, weightIndex);
    const rule = gstRuleFor(product);
    priced.push({
      slug: product.slug,
      name: product.name,
      weight: line.weight,
      quantity,
      unitPrice,
      unitOriginalPrice: originalPriceForWeight(product, weightIndex),
      lineTotal: unitPrice * quantity,
      hsn: rule.hsn,
      gstRate: rule.rate,
    });
  }

  if (priced.length === 0 && errors.length === 0) errors.push('Your cart is empty');

  const subtotal = priced.reduce((sum, line) => sum + line.lineTotal, 0);
  const coupon = couponCode ? findCoupon(couponCode) ?? null : null;
  const discount = couponDiscount(coupon, subtotal);
  const delivery = deliveryCharge(subtotal - discount);
  const beforeCod = Math.max(0, subtotal - discount + delivery);
  const codAllowed = beforeCod > 0 && beforeCod + COD_FEE <= COD_MAX_ORDER;
  const codFee = paymentMethod === 'cod' ? COD_FEE : 0;
  if (paymentMethod === 'cod' && !codAllowed) {
    errors.push(`Cash on Delivery is available on orders up to ₹${COD_MAX_ORDER.toLocaleString('en-IN')}`);
  }
  const total = beforeCod + codFee;

  /* Spread the coupon across lines in proportion to value; the last line takes the rounding remainder. */
  let remaining = discount;
  const gstLines = priced.map((line, index) => {
    const share =
      index === priced.length - 1 ? remaining : Math.round((discount * line.lineTotal) / Math.max(subtotal, 1));
    remaining -= share;
    return {
      description: `${line.name} (${line.weight})`,
      hsn: line.hsn,
      rate: line.gstRate,
      quantity: line.quantity,
      amount: line.lineTotal - share,
    };
  });

  /* Shipping and COD handling are part of a composite supply, taxed at the principal item's rate. */
  const principal = priced.reduce<QuoteLine | null>(
    (best, line) => (!best || line.lineTotal > best.lineTotal ? line : best),
    null,
  );
  if (principal) {
    if (delivery > 0)
      gstLines.push({ description: 'Shipping charges', hsn: principal.hsn, rate: principal.gstRate, quantity: 1, amount: delivery });
    if (codFee > 0)
      gstLines.push({ description: 'COD handling', hsn: principal.hsn, rate: principal.gstRate, quantity: 1, amount: codFee });
  }

  return {
    lines: priced,
    subtotal,
    couponCode: coupon?.code ?? null,
    discount,
    delivery,
    codFee,
    total,
    gst: computeGst(gstLines, buyerState),
    codAllowed,
    errors,
  };
}

/** Convenience for client components holding CartItem[] from the store. */
export function quoteCart(
  items: CartItem[],
  options: Omit<QuoteInput, 'lines'>,
): Quote {
  return quoteOrder({
    ...options,
    lines: items.map((item) => ({ slug: item.slug, weight: item.weight, quantity: item.quantity })),
  });
}

/** Parse and sanity-check an untrusted request body into a QuoteInput. */
export function parseQuoteInput(body: unknown): QuoteInput | null {
  if (!body || typeof body !== 'object') return null;
  const raw = body as Record<string, unknown>;
  if (!Array.isArray(raw.lines) || raw.lines.length === 0 || raw.lines.length > 50) return null;

  const lines: QuoteLineInput[] = [];
  for (const entry of raw.lines) {
    if (!entry || typeof entry !== 'object') return null;
    const { slug, weight, quantity } = entry as Record<string, unknown>;
    if (typeof slug !== 'string' || typeof weight !== 'string') return null;
    lines.push({ slug, weight, quantity: Number(quantity) });
  }

  return {
    lines,
    couponCode: typeof raw.couponCode === 'string' ? raw.couponCode : null,
    buyerState: typeof raw.buyerState === 'string' ? raw.buyerState : '',
    paymentMethod: raw.paymentMethod === 'cod' ? 'cod' : 'online',
  };
}
