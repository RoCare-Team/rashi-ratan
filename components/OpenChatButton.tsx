'use client';

import type { ReactNode } from 'react';
import { openAstroChat } from '@/lib/chatEvents';

/** Opens the astrology chatbot from server-rendered pages. */
export default function OpenChatButton({
  children,
  className,
  question,
}: {
  children: ReactNode;
  className?: string;
  question?: string;
}) {
  return (
    <button type="button" onClick={() => openAstroChat(question)} className={className}>
      {children}
    </button>
  );
}
