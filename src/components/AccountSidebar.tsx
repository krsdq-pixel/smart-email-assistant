import { LogOut, Plus } from 'lucide-react';
import type { Account, AccountState } from '../lib/types';

interface AccountSidebarProps {
  accounts: AccountState[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AccountSidebar({ accounts, selectedId, onSelect }: AccountSidebarProps) {
  return (
    <div className="rounded-3xl border border-cyan-500/10 bg-[#0F172A]/80 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">حسابات</h2>
        <span className="rounded-full border border-cyan-500/30 bg-[#0B0F19] px-2.5 py-1 text-xs font-medium text-cyan-300">
          {accounts.length} / 4+
        </span>
      </div>

      <div className="space-y-2.5">
        {accounts.map((entry) => (
          <button
            key={entry.account.id}
            type="button"
            onClick={() => onSelect(entry.account.id)}
            className={`w-full rounded-2xl border p-3 text-right transition ${
              selectedId === entry.account.id
                ? 'border-cyan-500/60 bg-cyan-500/10 shadow-neon'
                : 'border-slate-700 bg-[#101827] hover:border-slate-600 hover:bg-[#121f31]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl font-bold text-[#081018] shadow-lg"
                style={{ backgroundColor: entry.account.color }}
              >
                {entry.account.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="truncate font-semibold text-white">{entry.account.name}</span>
                  <span className="ml-2 flex-shrink-0 rounded-full bg-cyan-500/20 px-2 py-1 text-xs font-bold text-cyan-300">
                    {entry.account.unread}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-400">{entry.account.email}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#0B0F19] px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add Account
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-orange-500/20 bg-[#151f2d] p-3">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-orange-400 mb-3">Smart Features</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />
            Auto Cleanup
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <div className="h-2 w-2 rounded-full bg-orange-400" />
            Iron Shield
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            Multi-Sync
          </div>
        </div>
      </div>
    </div>
  );
}
