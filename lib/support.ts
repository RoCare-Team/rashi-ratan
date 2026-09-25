/** Support ticket topics — shared by the form and the /api/support route. */
export const SUPPORT_TOPICS = [
  { id: 'order', label: 'Order status & delivery' },
  { id: 'payment', label: 'Payment or COD issue' },
  { id: 'return', label: 'Return, refund or exchange' },
  { id: 'invoice', label: 'GST invoice' },
  { id: 'enquiry', label: 'Gemstone enquiry / request a stone' },
  { id: 'astrology', label: 'Astrology consultation' },
  { id: 'other', label: 'Something else' },
] as const;

export type SupportTopic = (typeof SUPPORT_TOPICS)[number]['id'];

export interface SupportTicketInput {
  name: string;
  email: string;
  phone: string;
  orderId: string;
  topic: SupportTopic;
  message: string;
}

export type SupportErrors = Partial<Record<keyof SupportTicketInput, string>>;

export function validateTicket(input: SupportTicketInput): SupportErrors {
  const errors: SupportErrors = {};
  if (input.name.trim().length < 2) errors.name = 'Enter your name';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email.trim())) errors.email = 'Enter a valid email address';
  if (input.phone && !/^[6-9]\d{9}$/.test(input.phone)) errors.phone = 'Enter a valid 10 digit mobile number';
  if (input.orderId && !/^RR-[A-Z0-9]{6,10}$/i.test(input.orderId.trim())) errors.orderId = 'Order IDs look like RR-8F3K2Q7M';
  if (!SUPPORT_TOPICS.some((topic) => topic.id === input.topic)) errors.topic = 'Choose a topic';
  if (input.message.trim().length < 10) errors.message = 'Tell us a little more (at least 10 characters)';
  if (input.message.length > 2000) errors.message = 'Please keep it under 2000 characters';
  return errors;
}
