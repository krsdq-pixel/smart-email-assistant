import type { EmailMessage } from './types';
import { isIronShieldProtected } from './advancedSecurity';

export interface CleanupPlan {
  totalEmails: number;
  protectedCount: number;
  candidatesForArchive: EmailMessage[];
  candidatesForDelete: EmailMessage[];
  estimatedRecoveryMB: number;
}

export function buildCleanupPlan(emails: EmailMessage[]): CleanupPlan {
  const protected_emails = emails.filter((email) => isIronShieldProtected(email));
  const archiveableEmails = emails.filter(
    (email) =>
      !isIronShieldProtected(email) &&
      !email.isStarred &&
      email.priority === 'low' &&
      !email.isArchived,
  );
  const deleteableEmails = emails.filter(
    (email) =>
      !isIronShieldProtected(email) &&
      !email.isStarred &&
      email.priority === 'low' &&
      email.isArchived &&
      new Date(email.timestamp).getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000,
  );

  return {
    totalEmails: emails.length,
    protectedCount: protected_emails.length,
    candidatesForArchive: archiveableEmails.slice(0, 20),
    candidatesForDelete: deleteableEmails.slice(0, 10),
    estimatedRecoveryMB: (archiveableEmails.length + deleteableEmails.length) * 0.05,
  };
}

export function executeSafeCleanup(
  emails: EmailMessage[],
  aggressive = false,
): { cleaned: EmailMessage[]; removed: number } {
  const plan = buildCleanupPlan(emails);

  let removed = 0;
  const cleaned = emails.filter((email) => {
    const isArchiveCandidate = plan.candidatesForArchive.some((e) => e.id === email.id);
    const isDeleteCandidate = aggressive ? plan.candidatesForDelete.some((e) => e.id === email.id) : false;

    if (isDeleteCandidate) {
      removed += 1;
      return false;
    }

    if (isArchiveCandidate && !email.isArchived) {
      return true;
    }

    return true;
  });

  return { cleaned, removed };
}
