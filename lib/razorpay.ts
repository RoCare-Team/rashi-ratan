/**
 * Razorpay helpers (TEST MODE structure).
 *
 * Security rules this file follows, and that any backend work must keep:
 *   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` is the only value the browser ever sees.
 *   - `RAZORPAY_KEY_SECRET` is read exclusively inside route handlers
 *     (/app/api/razorpay/*), never imported into a client component.
 *   - Payment signatures are verified on the server before an order is treated
 *     as paid — never trust the browser callback alone.
 *
 * When no keys are configured the app runs in MOCK mode so the prototype flow
 * still works end to end without an account.
 */

export const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

export interface CreateOrderResponse {
  orderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string | null;
  /** true when the server had no credentials and returned a simulated order */
  mock: boolean;
  /** Our own order id (RR-XXXXXXXX), also sent to Razorpay as the receipt */
  storeOrderId: string;
}

export interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayPrefill {
  name: string;
  email: string;
  contact: string;
}

/** Minimal shape of the global injected by checkout.js. */
export interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: RazorpayPrefill;
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

/** Injects checkout.js once and resolves when it is ready. */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/** Rupees -> paise, the unit Razorpay expects. */
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}
