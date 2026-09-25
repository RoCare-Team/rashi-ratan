import type { CategorySlug, Product } from './types';
import { SELLER } from './business';

/**
 * GST engine.
 *
 * Every price on the store is GST-inclusive (MRP includes all taxes), so tax is
 * back-calculated from what the customer pays:
 *
 *   taxable value = inclusive amount × 100 / (100 + rate)
 *
 * Supply within the seller's state (Rajasthan) is split CGST + SGST; supply to
 * any other state is charged as IGST. Place of supply is the delivery state.
 *
 * The HSN codes and rates below are sensible defaults for this catalogue —
 * confirm them with your CA before issuing live invoices.
 */

export interface GstRule {
  hsn: string;
  /** Total GST rate in percent (CGST + SGST, or IGST) */
  rate: number;
}

export const GST_RULES: Record<CategorySlug, GstRule> = {
  'rashi-ratna': { hsn: '7103', rate: 3 },
  'precious-gemstones': { hsn: '7103', rate: 3 },
  navratna: { hsn: '7113', rate: 3 },
  'gemstone-jewelry': { hsn: '7113', rate: 3 },
  crystals: { hsn: '7103', rate: 3 },
  rudraksha: { hsn: '1404', rate: 5 },
  yantras: { hsn: '7419', rate: 5 },
  'spiritual-products': { hsn: '7419', rate: 5 },
};

export function gstRuleFor(product: Pick<Product, 'category' | 'gemType'>): GstRule {
  const rule = GST_RULES[product.category] ?? { hsn: '7103', rate: 3 };
  // Loose natural pearls sit under their own heading.
  if (product.gemType === 'Pearl' && product.category !== 'gemstone-jewelry') return { ...rule, hsn: '7101' };
  return rule;
}

export type SupplyType = 'intra' | 'inter';

export interface GstRow {
  description: string;
  hsn: string;
  rate: number;
  quantity: number;
  /** Inclusive amount after discount allocation */
  total: number;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export interface GstBreakdown {
  supplyType: SupplyType;
  placeOfSupply: string;
  rows: GstRow[];
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  total: number;
}

export interface GstInputLine {
  description: string;
  hsn: string;
  rate: number;
  quantity: number;
  /** Inclusive amount the customer pays for this line, after discounts */
  amount: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

export function supplyTypeFor(buyerState: string): SupplyType {
  return buyerState === SELLER.state ? 'intra' : 'inter';
}

export function computeGst(lines: GstInputLine[], buyerState: string): GstBreakdown {
  const supplyType = supplyTypeFor(buyerState);

  const rows: GstRow[] = lines
    .filter((line) => line.amount > 0)
    .map((line) => {
      const total = round2(line.amount);
      const taxable = round2((total * 100) / (100 + line.rate));
      const tax = round2(total - taxable);
      // Split so the two halves always add back up to the exact tax.
      const cgst = supplyType === 'intra' ? round2(tax / 2) : 0;
      const sgst = supplyType === 'intra' ? round2(tax - cgst) : 0;
      const igst = supplyType === 'inter' ? tax : 0;
      return { ...line, total, taxable, cgst, sgst, igst };
    });

  const sum = (key: 'taxable' | 'cgst' | 'sgst' | 'igst' | 'total') => round2(rows.reduce((acc, row) => acc + row[key], 0));
  const cgst = sum('cgst');
  const sgst = sum('sgst');
  const igst = sum('igst');

  return {
    supplyType,
    placeOfSupply: buyerState || SELLER.state,
    rows,
    taxable: sum('taxable'),
    cgst,
    sgst,
    igst,
    totalTax: round2(cgst + sgst + igst),
    total: sum('total'),
  };
}

/** GSTIN format check: 2 digit state code, PAN, entity number, Z, checksum. */
export function isValidGstin(value: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value.trim().toUpperCase());
}

/* ----------------------------- Amount in words ----------------------------- */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function belowHundred(n: number): string {
  if (n < 20) return ONES[n];
  return `${TENS[Math.floor(n / 10)]}${n % 10 ? ' ' + ONES[n % 10] : ''}`;
}

function belowThousand(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  return [hundreds ? `${ONES[hundreds]} Hundred` : '', rest ? belowHundred(rest) : ''].filter(Boolean).join(' ');
}

/** Indian numbering: 125430.5 -> "One Lakh Twenty Five Thousand Four Hundred Thirty Rupees and Fifty Paise Only" */
export function amountInWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  const parts: string[] = [];
  const crore = Math.floor(rupees / 10_000_000);
  const lakh = Math.floor((rupees % 10_000_000) / 100_000);
  const thousand = Math.floor((rupees % 100_000) / 1000);
  const rest = rupees % 1000;
  if (crore) parts.push(`${belowThousand(crore)} Crore`);
  if (lakh) parts.push(`${belowHundred(lakh)} Lakh`);
  if (thousand) parts.push(`${belowHundred(thousand)} Thousand`);
  if (rest) parts.push(belowThousand(rest));

  const words = `${parts.join(' ') || 'Zero'} Rupees`;
  return paise ? `${words} and ${belowHundred(paise)} Paise Only` : `${words} Only`;
}
