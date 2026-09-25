'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Check, Copy, Loader2, Send } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { whatsappLink } from '@/lib/business';
import { SUPPORT_TOPICS, validateTicket, type SupportErrors, type SupportTicketInput, type SupportTopic } from '@/lib/support';
import { cn } from '@/lib/utils';

export default function SupportTicketForm() {
  const params = useSearchParams();
  const { lastOrder, toast } = useStore();

  const topicParam = params.get('topic');
  const gem = params.get('gem');
  const initialTopic: SupportTopic = SUPPORT_TOPICS.some((topic) => topic.id === topicParam)
    ? (topicParam as SupportTopic)
    : 'order';

  const [form, setForm] = useState<SupportTicketInput>({
    name: '',
    email: '',
    phone: '',
    orderId: '',
    topic: initialTopic,
    message: gem ? `I would like to buy a certified ${gem}. Please share available sizes and prices.` : '',
  });
  const [errors, setErrors] = useState<SupportErrors>({});
  const [sending, setSending] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const update =
    (field: keyof SupportTicketInput) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      let value = event.target.value;
      if (field === 'phone') value = value.replace(/\D/g, '').slice(0, 10);
      if (field === 'orderId') value = value.toUpperCase();
      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };

  const fillFromLastOrder = () => {
    if (!lastOrder) return;
    setForm((current) => ({
      ...current,
      name: current.name || lastOrder.customer.name,
      email: current.email || lastOrder.customer.email,
      phone: current.phone || lastOrder.customer.phone,
      orderId: lastOrder.orderId,
    }));
    setErrors({});
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validateTicket(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSending(true);
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { ticketId?: string; error?: string; fieldErrors?: SupportErrors };
      if (!response.ok || !result.ticketId) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        throw new Error(result.error ?? 'Could not create the ticket');
      }
      setTicketId(result.ticketId);
      toast('Ticket raised', { description: `Reference ${result.ticketId} — we reply within one working day.` });
    } catch (error) {
      toast('Could not send', { description: error instanceof Error ? error.message : 'Please try again.', type: 'error' });
    } finally {
      setSending(false);
    }
  };

  if (ticketId) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50/60 p-10 text-center">
        <span className="grid h-16 w-16 animate-pop place-items-center rounded-full bg-emerald-500 text-white">
          <Check className="h-8 w-8" strokeWidth={3} />
        </span>
        <h2 className="h-display mt-6 text-3xl text-navy-900">We are on it</h2>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-navy-900/60">
          Your ticket reference is below. Our team replies to {form.email} within one working day.
        </p>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(ticketId).then(() => toast('Reference copied', { type: 'info' }))}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-emerald-300 bg-white px-5 py-3 font-mono text-xl font-bold text-navy-900"
        >
          {ticketId} <Copy className="h-4 w-4 text-navy-900/40" />
        </button>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink(`Hi, my support ticket is ${ticketId}${form.orderId ? ` for order ${form.orderId}` : ''}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-md btn-primary"
          >
            Follow up on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setTicketId(null);
              setForm((current) => ({ ...current, message: '', orderId: '' }));
            }}
            className="btn btn-md btn-outline"
          >
            Raise another ticket
          </button>
        </div>
      </div>
    );
  }

  const fieldClass = (field: keyof SupportTicketInput) =>
    cn('field', errors[field] && 'border-rose-400 focus:border-rose-400 focus:ring-rose-500/10');
  const errorText = (field: keyof SupportTicketInput) =>
    errors[field] && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors[field]}</p>;

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl font-semibold text-navy-900">Raise a support ticket</h2>
          <p className="mt-1.5 text-sm text-navy-900/55">A real person reads every ticket. Average reply time: 4 working hours.</p>
        </div>
        {lastOrder && (
          <button type="button" onClick={fillFromLastOrder} className="btn btn-sm btn-outline">
            Use my last order
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="s-name" className="field-label">Name</label>
          <input id="s-name" value={form.name} onChange={update('name')} autoComplete="name" className={fieldClass('name')} />
          {errorText('name')}
        </div>
        <div>
          <label htmlFor="s-email" className="field-label">Email</label>
          <input id="s-email" type="email" value={form.email} onChange={update('email')} autoComplete="email" className={fieldClass('email')} />
          {errorText('email')}
        </div>
        <div>
          <label htmlFor="s-phone" className="field-label">Mobile (optional)</label>
          <input id="s-phone" inputMode="numeric" value={form.phone} onChange={update('phone')} autoComplete="tel" placeholder="9876543210" className={fieldClass('phone')} />
          {errorText('phone')}
        </div>
        <div>
          <label htmlFor="s-order" className="field-label">Order ID (if any)</label>
          <input id="s-order" value={form.orderId} onChange={update('orderId')} placeholder="RR-8F3K2Q7M" className={cn(fieldClass('orderId'), 'font-mono uppercase')} />
          {errorText('orderId')}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="s-topic" className="field-label">What do you need help with?</label>
          <select id="s-topic" value={form.topic} onChange={update('topic')} className={cn(fieldClass('topic'), 'cursor-pointer')}>
            {SUPPORT_TOPICS.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.label}
              </option>
            ))}
          </select>
          {errorText('topic')}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="s-message" className="field-label">Message</label>
          <textarea
            id="s-message"
            rows={5}
            value={form.message}
            onChange={update('message')}
            placeholder="Tell us what happened, and anything that would help us resolve it quickly."
            className={cn(fieldClass('message'), 'h-auto resize-y py-3')}
          />
          {errorText('message')}
        </div>
      </div>

      <button type="submit" disabled={sending} className="btn btn-lg btn-primary mt-6 w-full">
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit ticket
      </button>
    </form>
  );
}
