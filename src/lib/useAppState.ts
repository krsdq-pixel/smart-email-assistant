import { useEffect, useReducer } from 'react';
import type { AccountState, PersistedAppState } from './types';

type StateAction =
  | { type: 'ARCHIVE_EMAIL'; payload: { accountId: string; emailId: string } }
  | { type: 'DELETE_EMAIL'; payload: { accountId: string; emailId: string } }
  | { type: 'MARK_READ'; payload: { accountId: string; emailId: string } }
  | { type: 'TOGGLE_STAR'; payload: { accountId: string; emailId: string } }
  | { type: 'SELECT_ACCOUNT'; payload: string }
  | { type: 'TOGGLE_SETTING'; payload: 'automaticCleaning' | 'archiveMode' | 'notifications' }
  | { type: 'SYNC_ACCOUNT'; payload: { accountId: string; emails: any[] } }
  | { type: 'HYDRATE'; payload: PersistedAppState };

export function useAppState(initialState: PersistedAppState) {
  const [state, dispatch] = useReducer((current: PersistedAppState, action: StateAction) => {
    switch (action.type) {
      case 'ARCHIVE_EMAIL': {
        const { accountId, emailId } = action.payload;
        const account = current.accounts[accountId];
        if (!account) return current;

        return {
          ...current,
          accounts: {
            ...current.accounts,
            [accountId]: {
              ...account,
              emails: account.emails.map((email) =>
                email.id === emailId ? { ...email, isArchived: true, isUnread: false } : email,
              ),
              lastSynced: new Date().toISOString(),
            },
          },
        };
      }

      case 'DELETE_EMAIL': {
        const { accountId, emailId } = action.payload;
        const account = current.accounts[accountId];
        if (!account) return current;

        return {
          ...current,
          accounts: {
            ...current.accounts,
            [accountId]: {
              ...account,
              emails: account.emails.filter((email) => email.id !== emailId),
              lastSynced: new Date().toISOString(),
            },
          },
        };
      }

      case 'MARK_READ': {
        const { accountId, emailId } = action.payload;
        const account = current.accounts[accountId];
        if (!account) return current;

        return {
          ...current,
          accounts: {
            ...current.accounts,
            [accountId]: {
              ...account,
              emails: account.emails.map((email) =>
                email.id === emailId ? { ...email, isUnread: false } : email,
              ),
            },
          },
        };
      }

      case 'TOGGLE_STAR': {
        const { accountId, emailId } = action.payload;
        const account = current.accounts[accountId];
        if (!account) return current;

        return {
          ...current,
          accounts: {
            ...current.accounts,
            [accountId]: {
              ...account,
              emails: account.emails.map((email) =>
                email.id === emailId ? { ...email, isStarred: !email.isStarred } : email,
              ),
            },
          },
        };
      }

      case 'SELECT_ACCOUNT':
        return { ...current, selectedAccountId: action.payload };

      case 'TOGGLE_SETTING':
        return {
          ...current,
          settings: {
            ...current.settings,
            [action.payload]: !current.settings[action.payload],
          },
        };

      case 'SYNC_ACCOUNT': {
        const { accountId, emails } = action.payload;
        const account = current.accounts[accountId];
        if (!account) return current;

        return {
          ...current,
          accounts: {
            ...current.accounts,
            [accountId]: {
              ...account,
              emails,
              lastSynced: new Date().toISOString(),
              syncStatus: 'healthy',
            },
          },
        };
      }

      case 'HYDRATE':
        return action.payload;

      default:
        return current;
    }
  }, initialState);

  return [state, dispatch] as const;
}
