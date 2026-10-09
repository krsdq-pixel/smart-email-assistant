import type { EmailMessage } from './types';

export function isIronShieldProtected(email: EmailMessage): boolean {
  const protectedCategories = ['invoices', 'banks', 'bookings', 'tickets', 'starred'];
  const keywords = ['invoice', 'bank', 'booking', 'ticket', 'reservation', 'receipt', 'payment'];
  const haystack = `${email.subject} ${email.preview} ${email.sender}`.toLowerCase();

  return (
    protectedCategories.includes(email.category) ||
    keywords.some((keyword) => haystack.includes(keyword)) ||
    email.isProtected
  );
}

export function authorizeAction(email: EmailMessage, action: 'delete' | 'archive'): 'allowed' | 'blocked' {
  if ((action === 'delete' || action === 'archive') && isIronShieldProtected(email)) {
    return 'blocked';
  }

  return 'allowed';
}
