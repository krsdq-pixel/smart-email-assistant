export type Account = {
  id: string;
  name: string;
  email: string;
  provider: 'Google';
  color: string;
  unread: number;
  priority: 'High' | 'Medium' | 'Low';
};

export type EmailCategory =
  | 'invoices'
  | 'banks'
  | 'bookings'
  | 'tickets'
  | 'starred'
  | 'social'
  | 'marketing'
  | 'documents'
  | 'other';

export type EmailMessage = {
  id: string;
  accountId: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isUnread: boolean;
  category: EmailCategory;
  isStarred: boolean;
  isProtected: boolean;
  isArchived: boolean;
  priority: 'high' | 'normal' | 'low';
  body: string;
};

export type AccountState = {
  account: Account;
  emails: EmailMessage[];
  lastSynced: string;
  syncStatus: 'healthy' | 'degraded' | 'offline';
};

export type AppSettings = {
  automaticCleaning: boolean;
  archiveMode: boolean;
  notifications: boolean;
  rtlEnabled: boolean;
};

export type PersistedAppState = {
  accounts: Record<string, AccountState>;
  selectedAccountId: string;
  settings: AppSettings;
};
