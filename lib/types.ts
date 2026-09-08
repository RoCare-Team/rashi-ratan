/**
 * Shared domain types.
 *
 * Everything the UI renders flows through these types. Today they are fed by
 * the hardcoded files in /data — swapping in a real API later only means
 * replacing the data source, not the components.
 */

export type CategorySlug =
  | 'rashi-ratna'
  | 'navratna'
  | 'precious-gemstones'
  | 'rudraksha'
  | 'crystals'
  | 'yantras'
  | 'gemstone-jewelry'
  | 'spiritual-products';

export type GemCut = 'oval' | 'round' | 'emerald' | 'pear' | 'cushion' | 'bead' | 'plate' | 'raw';

/**
 * Procedural artwork descriptor. The <GemVisual /> component renders a faceted
 * SVG gemstone from these colours, so the prototype ships with zero image
 * dependencies. Set `images` on a product to use real photography instead.
 */
export interface GemArt {
  cut: GemCut;
  light: string;
  base: string;
  deep: string;
}

export interface WeightOption {
  /** Shown on the selector, e.g. "5 Carat" or "8 mm" */
  label: string;
  /** Price multiplier applied to the product base price */
  multiplier: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Traditional / Hindi name, e.g. "Neelam" */
  hindiName?: string;
  category: CategorySlug;
  /** Free-form material type used by the Gemstone Type filter */
  gemType: string;
  planet?: string;
  /** Zodiac slugs this product is recommended for */
  rashi: string[];
  shortDescription: string;
  description: string;
  benefits: string[];
  howToWear: string[];
  certification: string;
  origin: string;
  /** Selling price for the default weight option (INR) */
  price: number;
  /** Struck-through MRP (INR) */
  originalPrice: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  weightOptions: WeightOption[];
  /** Index of the weight preselected on the product page */
  defaultWeightIndex: number;
  art: GemArt;
  /** Optional real photography — takes priority over the procedural artwork */
  images?: string[];
  /** ISO date, used by the "Newest" sort */
  createdAt: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  art: GemArt;
  accent: string;
}

export interface Zodiac {
  slug: string;
  name: string;
  english: string;
  symbol: string;
  dates: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  lord: string;
  luckyStone: string;
  luckyStoneHindi: string;
  /** Product slug the recommendation links to */
  stoneSlug: string;
  benefits: string[];
  luckyColor: string;
  luckyDay: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  verified: boolean;
  productSlug?: string;
  /** Initials avatar colours */
  avatar: { from: string; to: string };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/* ---------------------------------- Cart ---------------------------------- */

export interface CartItem {
  /** `${slug}__${weightLabel}` — same product in two weights = two lines */
  key: string;
  slug: string;
  name: string;
  weight: string;
  /** Unit price for the chosen weight */
  price: number;
  originalPrice: number;
  quantity: number;
  art: GemArt;
  image?: string;
}

export interface Coupon {
  code: string;
  label: string;
  /** Percentage off the subtotal */
  percent: number;
  maxDiscount: number;
  minSubtotal: number;
}

export interface DemoOrder {
  orderId: string;
  paymentId: string;
  amount: number;
  method: string;
  placedAt: string;
  items: CartItem[];
  customer: { name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string };
}
