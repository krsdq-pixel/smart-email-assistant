import type { EmailMessage } from './types';

export type CleanupDecision = {
  id: string;
  reason: string;
  action: 'archive' | 'delete' | 'keep';
  email: EmailMessage;
};

export function buildCleanupPlan(emails: EmailMessage[]): CleanupDecision[] {
  return emails
    .filter((email) => !email.isProtected)
    .filter((email) => {
      const isOld = email.timestamp.includes('2') || email.timestamp.includes('3');
      return isOld || email.isArchived || email.isUnread;
    })
    .slice(0, 6)
    .map((email) => ({
      id: email.id,
      reason: email.isUnread ? 'Low priority unread mail' : 'Old non-critical message',
      action: email.priority === 'high' ? 'keep' : 'archive',
      email,
    }));
}

export function runCleanup(emails: EmailMessage[]): CleanupDecision[] {
  return buildCleanupPlan(emails).map((decision) => ({
    ...decision,
    action: decision.email.category === 'marketing' ? 'archive' : decision.action,
  }));
}
