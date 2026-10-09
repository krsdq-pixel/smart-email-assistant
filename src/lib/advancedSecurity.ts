import type { EmailMessage } from './types';

const criticalKeywords = [
  'invoice',
  'payment',
  'receipt',
  'bank',
  'wire',
  'transaction',
  'booking',
  'reservation',
  'ticket',
  'flight',
  'hotel',
  'insurance',
  'contract',
  'agreement',
];

export function analyzeEmailRisk(email: EmailMessage): 'critical' | 'high' | 'normal' | 'low' {
  const haystack = `${email.subject} ${email.sender}`.toLowerCase();
  const isCriticalCategory = ['invoices', 'banks', 'bookings', 'tickets'].includes(email.category);
  const hasKeyword = criticalKeywords.some((kw) => haystack.includes(kw));
  const isStarred = email.isStarred || email.isProtected;

  if (isStarred && isCriticalCategory) return 'critical';
  if (isCriticalCategory || (hasKeyword && email.priority === 'high')) return 'high';
  if (email.isStarred || (hasKeyword && email.priority === 'normal')) return 'normal';
  return 'low';
}

export function isIronShieldProtected(email: EmailMessage): boolean {
  const risk = analyzeEmailRisk(email);
  return risk === 'critical' || risk === 'high' || email.isProtected;
}

export function authorizeDeleteAction(email: EmailMessage): { authorized: boolean; reason?: string } {
  const risk = analyzeEmailRisk(email);
  if (risk === 'critical' || risk === 'high') {
    return {
      authorized: false,
      reason: `Cannot delete ${risk} priority email. Iron Shield protection active.`,
    };
  }
  return { authorized: true };
}

export function authorizeArchiveAction(email: EmailMessage): { authorized: boolean; reason?: string } {
  const risk = analyzeEmailRisk(email);
  if (risk === 'critical') {
    return {
      authorized: false,
      reason: 'Cannot archive critical email. Iron Shield protection active.',
    };
  }
  return { authorized: true };
}
