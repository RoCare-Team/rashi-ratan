/**
 * Business identity and commercial rules in one place.
 *
 * Rashi Ratan is the storefront brand; Agarwal Gemstone is the registered
 * seller that appears on tax invoices. Update the GSTIN, address and contact
 * numbers here and every page, invoice and the chatbot pick them up.
 */

export const SELLER = {
  brand: 'Rashi Ratan',
  legalName: 'Agarwal Gemstone',
  /** Replace with the real GSTIN before going live — 08 is Rajasthan's state code. */
  gstin: '08ABCDE1234F1Z5',
  addressLines: ['4th Floor, Gem Plaza, Johari Bazaar', 'Jaipur, Rajasthan 302003'],
  state: 'Rajasthan',
  stateCode: '08',
  phone: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  email: 'care@rashiratan.com',
  /** wa.me number: country code + number, digits only */
  whatsapp: '919876543210',
  hours: 'Mon – Sat, 10 AM – 7 PM IST',
} as const;

export function whatsappLink(message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${SELLER.whatsapp}${text}`;
}

/* ------------------------------ Cash on delivery ------------------------------ */

/** Handling fee added to COD orders to cover collection costs. */
export const COD_FEE = 49;

/**
 * Orders above this value must be prepaid. Couriers cap cash collection and
 * high value stones are rarely returned-to-origin safely.
 */
export const COD_MAX_ORDER = 25000;

export type PaymentMethod = 'online' | 'cod';

/* --------------------------------- States --------------------------------- */

/** Indian states and union territories with their GST state codes. */
export const INDIAN_STATES: Array<{ name: string; code: string }> = [
  { name: 'Andaman and Nicobar Islands', code: '35' },
  { name: 'Andhra Pradesh', code: '37' },
  { name: 'Arunachal Pradesh', code: '12' },
  { name: 'Assam', code: '18' },
  { name: 'Bihar', code: '10' },
  { name: 'Chandigarh', code: '04' },
  { name: 'Chhattisgarh', code: '22' },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', code: '26' },
  { name: 'Delhi', code: '07' },
  { name: 'Goa', code: '30' },
  { name: 'Gujarat', code: '24' },
  { name: 'Haryana', code: '06' },
  { name: 'Himachal Pradesh', code: '02' },
  { name: 'Jammu and Kashmir', code: '01' },
  { name: 'Jharkhand', code: '20' },
  { name: 'Karnataka', code: '29' },
  { name: 'Kerala', code: '32' },
  { name: 'Ladakh', code: '38' },
  { name: 'Lakshadweep', code: '31' },
  { name: 'Madhya Pradesh', code: '23' },
  { name: 'Maharashtra', code: '27' },
  { name: 'Manipur', code: '14' },
  { name: 'Meghalaya', code: '17' },
  { name: 'Mizoram', code: '15' },
  { name: 'Nagaland', code: '13' },
  { name: 'Odisha', code: '21' },
  { name: 'Puducherry', code: '34' },
  { name: 'Punjab', code: '03' },
  { name: 'Rajasthan', code: '08' },
  { name: 'Sikkim', code: '11' },
  { name: 'Tamil Nadu', code: '33' },
  { name: 'Telangana', code: '36' },
  { name: 'Tripura', code: '16' },
  { name: 'Uttar Pradesh', code: '09' },
  { name: 'Uttarakhand', code: '05' },
  { name: 'West Bengal', code: '19' },
];

export function stateCode(state: string): string | undefined {
  return INDIAN_STATES.find((entry) => entry.name === state)?.code;
}
