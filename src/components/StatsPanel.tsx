import { Mail, Users, AlertCircle } from 'lucide-react';
import type { PersistedAppState } from '../lib/types';
import { isIronShieldProtected } from '../lib/advancedSecurity';

interface StatsPanelProps {
  state: PersistedAppState;
}

export function StatsPanel({ state }: StatsPanelProps) {
  const allEmails = Object.values(state.accounts).flatMap((acc) => acc.emails);
  const unreadCount = allEmails.filter((e) => !e.isArchived && e.isUnread).length;
  const protectedCount = allEmails.filter((e) => isIronShieldProtected(e) && !e.isArchived).length;
  const archivedCount = allEmails.filter((e) => e.isArchived).length;

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
      <div className="rounded-2xl border border-cyan-500/20 bg-[#111827] p-4">
        <div className="flex items-center justify-between text-sm text-slate-300 mb-3">
          <span>Inbox Messages</span>
          <Mail className="h-4 w-4 text-cyan-400" />
        </div>
        <p className="text-3xl font-black text-cyan-400">{allEmails.filter(e => !e.isArchived).length}</p>
        <p className="mt-2 text-xs text-slate-500">Unread: <span className="text-cyan-300 font-semibold">{unreadCount}</span></p>
      </div>

      <div className="rounded-2xl border border-orange-500/20 bg-[#111827] p-4">
        <div className="flex items-center justify-between text-sm text-slate-300 mb-3">
          <span>Protected Emails</span>
          <AlertCircle className="h-4 w-4 text-orange-400" />
        </div>
        <p className="text-3xl font-black text-orange-400">{protectedCount}</p>
        <p className="mt-2 text-xs text-slate-500">Archived: <span className="text-orange-300 font-semibold">{archivedCount}</span></p>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-[#111827] p-4">
        <div className="flex items-center justify-between text-sm text-slate-300 mb-3">
          <span>Total Accounts</span>
          <Users className="h-4 w-4 text-emerald-400" />
        </div>
        <p className="text-3xl font-black text-emerald-400">{Object.keys(state.accounts).length}</p>
        <p className="mt-2 text-xs text-slate-500">Status: <span className="text-emerald-300 font-semibold">Connected</span></p>
      </div>
    </div>
  );
}
