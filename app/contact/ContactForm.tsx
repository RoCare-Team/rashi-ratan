'use client';

import { useState } from 'react';
import { Check, Loader2, Send } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const TOPICS = ['Gemstone recommendation', 'Order status', 'Returns & refunds', 'Bulk / wholesale', 'Something else'];

/** Demo enquiry form — no backend, it simply confirms locally. */
export default function ContactForm() {
  const { toast } = useStore();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: TOPICS[0], message: '' });

  const update =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
      toast('Message received', { description: 'Our team replies within one working day.' });
    }, 1100);
  };

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50/60 p-10 text-center">
        <span className="grid h-16 w-16 animate-pop place-items-center rounded-full bg-emerald-500 text-white">
          <Check className="h-8 w-8" strokeWidth={3} />
        </span>
        <h3 className="h-display mt-6 text-3xl text-navy-900">Message sent</h3>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-navy-900/60">
          Thank you {form.name.split(' ')[0] || 'for writing in'}. Our team will reply to {form.email} within one working
          day.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm({ name: '', email: '', phone: '', topic: TOPICS[0], message: '' });
          }}
          className="btn btn-md btn-outline mt-7"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-sand-200 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="font-display text-3xl font-semibold text-navy-900">Send us a message</h2>
      <p className="mt-2 text-sm text-navy-900/55">
        Share your birth details if you would like a gemstone recommendation with your reply.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="field-label">
            Full Name
          </label>
          <input id="c-name" required value={form.name} onChange={update('name')} placeholder="Your name" className="field" />
        </div>

        <div>
          <label htmlFor="c-email" className="field-label">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            className="field"
          />
        </div>

        <div>
          <label htmlFor="c-phone" className="field-label">
            Phone
          </label>
          <input
            id="c-phone"
            inputMode="numeric"
            value={form.phone}
            onChange={update('phone')}
            placeholder="Optional"
            className="field"
          />
        </div>

        <div>
          <label htmlFor="c-topic" className="field-label">
            Topic
          </label>
          <select id="c-topic" value={form.topic} onChange={update('topic')} className="field cursor-pointer">
            {TOPICS.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="c-message" className="field-label">
            Message
          </label>
          <textarea
            id="c-message"
            required
            rows={5}
            value={form.message}
            onChange={update('message')}
            placeholder="Tell us what you are looking for…"
            className="field h-auto resize-none py-3.5"
          />
        </div>
      </div>

      <button type="submit" disabled={sending} className="btn btn-lg btn-primary mt-6 w-full sm:w-auto">
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {sending ? 'Sending…' : 'Send message'}
      </button>

      <p className="mt-4 text-xs text-navy-900/40">
        Prototype form — submissions are confirmed locally and are not sent anywhere.
      </p>
    </form>
  );
}
