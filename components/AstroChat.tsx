'use client';

import Link from 'next/link';
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Headphones, Loader2, MessageCircle, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { OPEN_CHAT_EVENT } from '@/lib/chatEvents';
import { SELLER, whatsappLink } from '@/lib/business';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'rashi-ratan.chat';
const QUICK_QUESTIONS = [
  'Which gemstone suits my rashi?',
  'Is Blue Sapphire safe for me?',
  'Do you offer Cash on Delivery?',
  'How do I track my order?',
];
const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    'Namaste! 🙏 I am your **Agarwal Gemstone astrology assistant**. Ask me which gemstone suits your rashi, share your date of birth, or ask about orders, Cash on Delivery and GST invoices.',
};

/* ------------------------------ Tiny markdown ------------------------------ */
// Renders only what the assistant is told to use: **bold**, [links](/path) and "- " bullets.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${index++}`;
    if (match[1]) {
      parts.push(<strong key={key} className="font-semibold text-navy-900">{match[1]}</strong>);
    } else if (match[3].startsWith('/')) {
      parts.push(
        <Link key={key} href={match[3]} className="font-semibold text-royal-700 underline decoration-royal-300 underline-offset-2 hover:text-royal-900">
          {match[2]}
        </Link>,
      );
    } else {
      // Outside links are never rendered as links.
      parts.push(match[2]);
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function MessageBody({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <span key={index} className="block h-2" />;
        if (/^[-•*]\s+/.test(trimmed)) {
          return (
            <span key={index} className="flex gap-2 pl-1">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
              <span>{renderInline(trimmed.replace(/^[-•*]\s+/, ''), `l${index}`)}</span>
            </span>
          );
        }
        return (
          <Fragment key={index}>
            <span className="block">{renderInline(trimmed.replace(/^#+\s*/, ''), `l${index}`)}</span>
          </Fragment>
        );
      })}
    </>
  );
}

/* --------------------------------- Widget --------------------------------- */
export default function AstroChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'ai' | 'offline' | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  /* Restore this visit's conversation */
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      /* storage unavailable — start fresh */
    }
  }, []);

  useEffect(() => {
    if (busy) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* storage unavailable */
    }
  }, [messages, busy]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const send = useCallback(async (text: string) => {
    const question = text.trim();
    if (!question || abortRef.current) return;

    const history: ChatMessage[] = [...messagesRef.current, { role: 'user', content: question }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const appendToReply = (chunk: string) =>
      setMessages((current) => {
        const next = [...current];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + chunk };
        return next;
      });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The API drops the UI greeting itself, since a conversation must open with the shopper.
        body: JSON.stringify({ messages: history.filter((message) => message.content) }),
        signal: controller.signal,
      });
      setMode(response.headers.get('X-Chat-Mode') === 'ai' ? 'ai' : 'offline');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        appendToReply(decoder.decode(value, { stream: true }));
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        appendToReply(`Sorry, I could not connect just now. Please try again, or WhatsApp us on ${SELLER.phone}.`);
      }
    } finally {
      abortRef.current = null;
      setBusy(false);
    }
  }, []);

  /* Other components can open the chat with a question (gem guide "Ask" buttons) */
  useEffect(() => {
    const onOpen = (event: Event) => {
      const question = (event as CustomEvent<{ question?: string }>).detail?.question;
      setOpen(true);
      if (question) void send(question);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [send]);

  const reset = () => {
    abortRef.current?.abort();
    setMessages([GREETING]);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  };

  const showSuggestions = messages.length === 1 && !busy;

  return (
    <div className="print:hidden">
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close astrology assistant' : 'Open astrology assistant'}
        aria-expanded={open}
        className={cn(
          'fixed bottom-4 right-4 z-[60] flex h-14 items-center gap-2 rounded-full bg-royal-deep pl-4 pr-5 text-sm font-semibold text-white shadow-lift transition-all duration-300 hover:-translate-y-0.5 sm:bottom-6 sm:right-6',
          open && 'pr-4',
        )}
      >
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gold-sheen text-navy-950">
          {open ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          {!open && <span className="absolute inset-0 animate-ring-pulse rounded-full border-2 border-gold-300" />}
        </span>
        {!open && <span className="hidden sm:inline">Ask Astrologer</span>}
      </button>

      {/* Panel */}
      <section
        role="dialog"
        aria-label="Astrology assistant"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          'fixed inset-x-3 bottom-20 z-[60] flex h-[min(34rem,calc(100dvh-7rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-lift transition-all duration-300 sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[24rem]',
          open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
        )}
      >
        {/* Header */}
        <header className="relative flex items-center gap-3 overflow-hidden bg-royal-deep px-4 py-3.5 text-white">
          <div className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gold-sheen text-navy-950">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="relative min-w-0 flex-1">
            <p className="font-display text-lg font-semibold leading-tight">Astro Assistant</p>
            <p className="flex items-center gap-1.5 text-[11px] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {mode === 'offline' ? 'Instant answers' : 'Online · replies in seconds'}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            aria-label="Start a new conversation"
            className="relative grid h-9 w-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="relative grid h-9 w-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-sand-50 px-4 py-4" aria-live="polite">
          {messages.map((message, index) => (
            <div key={index} className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[85%] space-y-0.5 rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed',
                  message.role === 'user'
                    ? 'rounded-br-md bg-royal-700 text-white'
                    : 'rounded-bl-md border border-sand-200 bg-white text-navy-900/80',
                )}
              >
                {message.content ? (
                  message.role === 'user' ? (
                    <span className="whitespace-pre-wrap">{message.content}</span>
                  ) : (
                    <MessageBody content={message.content} />
                  )
                ) : (
                  <span className="flex items-center gap-2 text-navy-900/45">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading the stars…
                  </span>
                )}
              </div>
            </div>
          ))}

          {showSuggestions && (
            <div className="flex flex-wrap gap-2 pt-1">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void send(question)}
                  className="rounded-full border border-royal-200 bg-white px-3 py-1.5 text-xs font-medium text-royal-700 transition-colors hover:bg-royal-50"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Human hand-off */}
        <div className="flex items-center justify-between gap-2 border-t border-sand-200 bg-white px-4 py-2 text-[11px] text-navy-900/50">
          <span className="flex items-center gap-1.5">
            <Headphones className="h-3.5 w-3.5" /> Prefer a person?
          </span>
          <span className="flex gap-3 font-semibold">
            <a href={whatsappLink('Hi, I need help with a gemstone / my order')} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
              WhatsApp
            </a>
            <Link href="/support" onClick={() => setOpen(false)} className="text-royal-700 hover:text-royal-900">
              Support
            </Link>
          </span>
        </div>

        {/* Composer */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2 border-t border-sand-200 bg-white p-3"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value.slice(0, 1500))}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask about your rashi, a gemstone or an order…"
            aria-label="Your question"
            className="max-h-28 min-h-[44px] flex-1 resize-none rounded-2xl border border-sand-200 bg-sand-50 px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-900/35 focus:border-royal-400 focus:outline-none focus:ring-4 focus:ring-royal-500/10"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-royal-700 text-white transition-colors hover:bg-royal-800 disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
        <p className="bg-white px-4 pb-2 text-center text-[10px] text-navy-900/35">
          Guidance follows traditional Vedic belief. <MessageCircle className="inline h-2.5 w-2.5" /> AI can make mistakes.
        </p>
      </section>
    </div>
  );
}
