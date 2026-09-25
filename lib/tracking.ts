import type { DemoOrder } from './types';
import { seededRandom } from './utils';

/**
 * Delivery tracking.
 *
 * The prototype has no courier account, so progress is derived from how long
 * ago the order was placed. When a courier aggregator (Shiprocket, Delhivery,
 * Blue Dart…) is connected, replace `getTracking()` with a call to its tracking
 * API keyed on the AWB number — the tracking page only consumes `TrackingInfo`.
 */

export type TrackingStage = 'confirmed' | 'packed' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered';

export interface TrackingStep {
  stage: TrackingStage;
  label: string;
  detail: string;
  /** ISO time the step happened (or is expected) */
  at: string;
  done: boolean;
}

export interface TrackingInfo {
  status: TrackingStage;
  statusLabel: string;
  courier: string;
  awb: string;
  expectedDelivery: string;
  steps: TrackingStep[];
}

const HOUR = 3_600_000;
const COURIERS = ['Blue Dart', 'Delhivery', 'DTDC', 'Ecom Express'];

/** Hours after placing the order at which each stage is reached. */
const STAGES: Array<{ stage: TrackingStage; label: string; after: number; detail: (order: DemoOrder, courier: string) => string }> = [
  {
    stage: 'confirmed',
    label: 'Order confirmed',
    after: 0,
    detail: (order) => (order.paymentMethod === 'cod' ? 'Cash on Delivery order accepted' : 'Payment received'),
  },
  { stage: 'packed', label: 'Quality checked & packed', after: 6, detail: () => 'Certificate sealed with your stone, Jaipur' },
  { stage: 'shipped', label: 'Shipped', after: 20, detail: (_, courier) => `Handed to ${courier}, insured parcel` },
  { stage: 'in_transit', label: 'In transit', after: 44, detail: (order) => `Moving to your city hub, ${order.customer.city}` },
  {
    stage: 'out_for_delivery',
    label: 'Out for delivery',
    after: 92,
    detail: (order) =>
      order.paymentMethod === 'cod'
        ? `Keep ₹${Math.round(order.amount).toLocaleString('en-IN')} ready in cash or UPI`
        : 'Signature and OTP required at delivery',
  },
  { stage: 'delivered', label: 'Delivered', after: 110, detail: (order) => `Delivered to ${order.customer.name.split(' ')[0]}` },
];

export function getTracking(order: DemoOrder, now: Date = new Date()): TrackingInfo {
  const placed = new Date(order.placedAt).getTime();
  const elapsed = (now.getTime() - placed) / HOUR;
  const courier = COURIERS[Math.floor(seededRandom(order.orderId) * COURIERS.length)];
  const awb = String(Math.floor(seededRandom(`awb-${order.orderId}`) * 9e11) + 1e11);

  const steps = STAGES.map((entry) => ({
    stage: entry.stage,
    label: entry.label,
    detail: entry.detail(order, courier),
    at: new Date(placed + entry.after * HOUR).toISOString(),
    done: elapsed >= entry.after,
  }));

  const current = [...steps].reverse().find((step) => step.done) ?? steps[0];
  const delivered = steps[steps.length - 1];

  return {
    status: current.stage,
    statusLabel: current.label,
    courier,
    awb,
    expectedDelivery: delivered.at,
    steps,
  };
}
