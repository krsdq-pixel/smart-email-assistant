import type { EmailMessage } from './types';

export function isIronShieldProtected(email: EmailMessage): boolean {
  const criticalCategories = ['invoices', 'banks', 'bookings', 'tickets', 'starred'];
  const keywords = ['invoice', 'bank', 'booking', 'ticket', 'reservation', 'receipt', 'payment'];
  const haystack = `${email.subject} ${email.preview} ${email.sender}`.toLowerCase();

  return criticalCategories.includes(email.category) || keywords.some((keyword) => haystack.includes(keyword)) || email.isProtected;
}

export function authorizeCriticalAction(email: EmailMessage, action: 'delete' | 'archive'): 'allowed' | 'blocked' {
  if (isIronShieldProtected(email) && (action === 'delete' || action === 'archive')) {
    return 'blocked';
  }

  return 'allowed';
}
