import type { EmailMessage } from './types';

export function getEmailCategories(emails: EmailMessage[]): Record<string, number> {
  const categories = Object.fromEntries(
    (['invoices', 'banks', 'bookings', 'tickets', 'starred', 'social', 'marketing', 'documents', 'other'] as const).map((cat) => [
      cat,
      emails.filter((e) => e.category === cat).length,
    ]),
  );
  return categories;
}

export function getUnreadCount(emails: EmailMessage[]): number {
  return emails.filter((e) => e.isUnread).length;
}

export function getProtectedCount(emails: EmailMessage[], isProtectedFn: (email: EmailMessage) => boolean): number {
  return emails.filter((e) => isProtectedFn(e)).length;
}

export function sortEmails(
  emails: EmailMessage[],
  by: 'recent' | 'unread' | 'starred',
): EmailMessage[] {
  const sorted = [...emails];

  switch (by) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    case 'unread':
      return sorted.sort((a, b) => Number(b.isUnread) - Number(a.isUnread));
    case 'starred':
      return sorted.sort((a, b) => Number(b.isStarred) - Number(a.isStarred));
    default:
      return sorted;
  }
}

export function filterEmails(
  emails: EmailMessage[],
  by: 'all' | 'unread' | 'starred' | 'protected' | 'archived',
  isProtectedFn: (email: EmailMessage) => boolean,
): EmailMessage[] {
  switch (by) {
    case 'unread':
      return emails.filter((e) => e.isUnread && !e.isArchived);
    case 'starred':
      return emails.filter((e) => e.isStarred && !e.isArchived);
    case 'protected':
      return emails.filter((e) => isProtectedFn(e) && !e.isArchived);
    case 'archived':
      return emails.filter((e) => e.isArchived);
    default:
      return emails.filter((e) => !e.isArchived);
  }
}
