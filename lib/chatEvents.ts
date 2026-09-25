/** Lets any component open the astrology chatbot, optionally with a question ready to send. */
export const OPEN_CHAT_EVENT = 'rashi-ratan:open-chat';

export function openAstroChat(question?: string): void {
  window.dispatchEvent(new CustomEvent<{ question?: string }>(OPEN_CHAT_EVENT, { detail: { question } }));
}
