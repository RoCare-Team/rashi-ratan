import { INDIAN_STATES } from './business';
import { isValidGstin } from './gst';
import type { OrderCustomer } from './types';

export type CustomerErrors = Partial<Record<keyof OrderCustomer, string>>;

/** Shared by the checkout form and the order API routes. */
export function validateCustomer(customer: Partial<OrderCustomer>): CustomerErrors {
  const errors: CustomerErrors = {};
  const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

  if (text(customer.name).length < 3) errors.name = 'Enter your full name';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text(customer.email))) errors.email = 'Enter a valid email address';
  if (!/^[6-9]\d{9}$/.test(text(customer.phone))) errors.phone = 'Enter a valid 10 digit mobile number';
  if (text(customer.address).length < 8) errors.address = 'Enter your full delivery address';
  if (!text(customer.city)) errors.city = 'Enter your city';
  if (!INDIAN_STATES.some((state) => state.name === customer.state)) errors.state = 'Select your state';
  if (!/^[1-9]\d{5}$/.test(text(customer.pincode))) errors.pincode = 'Enter a valid 6 digit pincode';

  const gstin = text(customer.gstin).toUpperCase();
  if (gstin) {
    if (!isValidGstin(gstin)) errors.gstin = 'Enter a valid 15 character GSTIN';
    else if (!text(customer.businessName)) errors.businessName = 'Enter the registered business name';
  }

  return errors;
}

/** Trim and normalise an untrusted customer object. */
export function cleanCustomer(raw: unknown): OrderCustomer {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const text = (key: string, max = 200) => (typeof source[key] === 'string' ? (source[key] as string).trim().slice(0, max) : '');
  const gstin = text('gstin', 15).toUpperCase();
  return {
    name: text('name', 80),
    email: text('email', 120),
    phone: text('phone', 10),
    address: text('address', 250),
    city: text('city', 80),
    state: text('state', 60),
    pincode: text('pincode', 6),
    ...(gstin ? { gstin, businessName: text('businessName', 120) } : {}),
  };
}
