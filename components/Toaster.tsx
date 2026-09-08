'use client';

import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
} as const;

const TONES = {
  success: 'text-emerald-300',
  error: 'text-rose-300',
  info: 'text-gold-300',
} as const;

/** Bottom-right toast stack, mounted once in the root layout. */
export default function Toaster() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:bottom-8 sm:right-8">
      {toasts.map((item) => {
        const Icon = ICONS[item.type];
        return (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto flex animate-toast-in items-start gap-3 rounded-2xl border border-white/10 bg-navy-900/95 p-4 text-white shadow-lift backdrop-blur-xl"
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${TONES[item.type]}`} strokeWidth={2} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug">{item.message}</p>
              {item.description && <p className="mt-0.5 text-xs leading-relaxed text-white/60">{item.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(item.id)}
              className="-m-1 rounded-full p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
