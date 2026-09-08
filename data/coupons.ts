import type { Coupon } from '@/lib/types';

/** Demo coupon codes. In production these would be validated server side. */
export const coupons: Coupon[] = [
  {
    code: 'RASHI10',
    label: '10% off your first order',
    percent: 10,
    maxDiscount: 2000,
    minSubtotal: 1500,
  },
  {
    code: 'GEMSTONE20',
    label: '20% off orders above 8000',
    percent: 20,
    maxDiscount: 4000,
    minSubtotal: 8000,
  },
  {
    code: 'NAVRATRI15',
    label: 'Festive 15% off',
    percent: 15,
    maxDiscount: 3000,
    minSubtotal: 3000,
  },
];

export function findCoupon(code: string): Coupon | undefined {
  return coupons.find((coupon) => coupon.code.toLowerCase() === code.trim().toLowerCase());
}

export function couponDiscount(coupon: Coupon | null, subtotal: number): number {
  if (!coupon || subtotal < coupon.minSubtotal) return 0;
  return Math.min(Math.round((subtotal * coupon.percent) / 100), coupon.maxDiscount);
}

/** Free delivery threshold used across cart and checkout. */
export const FREE_DELIVERY_ABOVE = 2000;
export const DELIVERY_CHARGE = 149;

export function deliveryCharge(subtotalAfterDiscount: number): number {
  if (subtotalAfterDiscount <= 0) return 0;
  return subtotalAfterDiscount >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;
}
