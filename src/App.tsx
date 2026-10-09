import { Archive, BellRing, BriefcaseBusiness, Inbox, RefreshCcw, Search, Shield, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { buildInitialization } from './lib/data';
import { authorizeAction, isIronShieldProtected } from './lib/security';
import { readAppState, writeAppState } from './lib/secureStorage';
import type { AppSettings, EmailMessage, PersistedAppState } from './lib/types';

const storageKey = 'smart-email-assistant-state';

const defaultSettings: AppSettings = {
  automaticCleaning: true,
  archiveMode: true,
  notifications: true,
  rtlEnabled: true,
};

function App() {
  const [state, setState] = useState<PersistedAppState>(() => buildInitialization(defaultSettings));
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [status, setStatus] = useState('System ready');
  const [hydrated, setHydrated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await readAppState<PersistedAppState>(storageKey);
        if (saved) {
          setState(saved);
          setSelectedEmailId(saved.selectedAccountId ?? null);
        }
      } catch (error) {
        console.error('State hydration failed', error);
      } finally {
        setHydrated(true);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const persist = async () => {
      try {
        await writeAppState(state);
      } catch (error) {
        console.error('Persist failed', error);
      }
    };

    void persist();
  }, [state, hydrated]);

  useEffect(() => {
    if (!state.settings.automaticCleaning) {
      return;
    }

    const timer = window.setInterval(() => {
      setState((current) => {
        const selectedId = current.selectedAccountId;
        const selectedAccount = current.accounts[selectedId];
        if (!selectedAccount) return current;

        const nextEmails = selectedAccount.emails.filter((email) => {
          if (email.priority === 'low' && !isIronShieldProtected(email)) {
            return false;
          }
          return true;
        });

        return {
          ...current,
          accounts: {
            ...current.accounts,
            [selectedId]: {
              ...selectedAccount,
              emails: nextEmails,
              lastSynced: new Date().toISOString(),
            },
          },
        };
      });
    }, 25000);

    return () => window.clearInterval(timer);
  }, [state.settings.automaticCleaning]);

  const accounts = Object.values(state.accounts);
  const selectedAccount = state.accounts[state.selectedAccountId] ?? accounts[0];
  const selectedEmail = selectedAccount?.emails.find((email) => email.id === selectedEmailId) ?? selectedAccount?.emails[0] ?? null;

  const unifiedInbox = useMemo(
    () =>
      accounts
        .flatMap((entry) => entry.emails)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [accounts],
  );

  const switchAccount = (id: string) => {
    const nextAccount = state.accounts[id];
    setState((current) => ({ ...current, selectedAccountId: id }));
    setSelectedEmailId(nextAccount?.emails[0]?.id ?? null);
  };

  const archiveEmail = (email: EmailMessage) => {
    const result = authorizeAction(email, 'archive');
    if (result === 'blocked') {
      setStatus('Iron Shield blocked archive: critical email protected');
      return;
    }

    setState((current) => {
      const target = current.accounts[current.selectedAccountId];
      if (!target) return current;

      return {
        ...current,
        accounts: {
          ...current.accounts,
          [current.selectedAccountId]: {
            ...target,
            emails: target.emails.map((item) =>
              item.id === email.id ? { ...item, isArchived: true, isUnread: false } : item,
            ),
          },
        },
      };
    });

    setStatus(`Archived: ${email.subject}`);
  };

  const deleteEmail = (email: EmailMessage) => {
    const result = authorizeAction(email, 'delete');
    if (result === 'blocked') {
      setStatus('Iron Shield blocked delete: critical email protected');
      return;
    }

    setState((current) => {
      const target = current.accounts[current.selectedAccountId];
      if (!target) return current;

      return {
        ...current,
        accounts: {
          ...current.accounts,
          [current.selectedAccountId]: {
            ...target,
            emails: target.emails.filter((item) => item.id !== email.id),
          },
        },
      };
    });

    setStatus(`Deleted: ${email.subject}`);
  };

  const runCleanup = () => {
    setIsProcessing(true);
    setStatus('Running automated cleaning...');

    window.setTimeout(() => {
      setState((current) => {
        const target = current.accounts[current.selectedAccountId];
        if (!target) return current;

        const cleaned = target.emails.filter((email) => {
          if (email.priority === 'low' && !isIronShieldProtected(email)) {
            return false;
          }
          return true;
        });

        return {
          ...current,
          accounts: {
            ...current.accounts,
            [current.selectedAccountId]: {
              ...target,
              emails: cleaned,
              lastSynced: new Date().toISOString(),
            },
          },
        };
      });
      setStatus('Smart cleaning completed safely');
      setIsProcessing(false);
    }, 700);
  };

  if (!selectedAccount) {
    return null;
  }

  return (
    <AppErrorBoundary>
      <div className="min-h-screen bg-[#0B0F19] text-white" dir="rtl">
        <div className="mx-auto max-w-[1600px] p-5 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-cyan-500/20 bg-[#111827]/85 p-4 shadow-neon backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-400 to-orange-500 text-lg font-black text-[#081018]">
                S
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">Smart Email Assistant</p>
                <h1 className="mt-1 text-2xl font-black">الرفيق الذكي للبريد</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#0B0F19] px-3 py-2 text-sm text-cyan-300">
                <Shield className="h-4 w-4" />
                Iron Shield Active
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#0B0F19] px-3 py-2 text-sm text-emerald-300">
                <BellRing className="h-4 w-4" />
                {state.settings.notifications ? 'Notifications On' : 'Muted'}
              </div>
              <div className="rounded-full border border-orange-500/30 bg-[#0B0F19] px-3 py-2 text-sm text-orange-300">
                {status}
              </div>
            </div>
          </header>

          <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_420px]">
            <aside className="rounded-3xl border border-cyan-500/10 bg-[#0F172A]/80 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">الحسابات</h2>
                <span className="rounded-full border border-cyan-500/30 bg-[#0B0F19] px-2 py-0.5 text-xs text-cyan-300">
                  {accounts.length} / 4+
                </span>
              </div>

              <div className="space-y-3">
                {accounts.map((entry) => (
                  <button
                    key={entry.account.id}
                    type="button"
                    onClick={() => switchAccount(entry.account.id)}
                    className={`w-full rounded-2xl border p-3 text-right transition ${
                      state.selectedAccountId === entry.account.id
                        ? 'border-cyan-500/60 bg-cyan-500/10 shadow-neon'
                        : 'border-slate-700 bg-[#101827] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-[#081018]"
                        style={{ backgroundColor: entry.account.color }}
                      >
                        {entry.account.name.slice(0, 1)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{entry.account.name}</span>
                          <span className="text-xs text-cyan-300">{entry.account.unread}</span>
                        </div>
                        <p className="text-xs text-slate-400">{entry.account.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-orange-500/20 bg-[#151f2d] p-3">
                <div className="flex items-center gap-2 text-orange-300">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Smart Filters</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {['Invoices', 'Banks', 'Travel', 'Tickets', 'Starred'].map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-700 px-2 py-1 text-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            <main className="rounded-3xl border border-cyan-500/10 bg-[#101827] p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-xl font-bold">الوارد</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-[#0B0F19] px-3 py-2 text-sm text-cyan-300"
                  >
                    <Search className="h-4 w-4" />
                    بحث
                  </button>
                  <button
                    type="button"
                    onClick={runCleanup}
                    disabled={isProcessing}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-orange-500 px-4 py-2 text-sm font-semibold text-[#081018] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <RefreshCcw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                    {isProcessing ? 'جارٍ التنظيف...' : 'تنظيف ذكي'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {selectedAccount.emails.map((email) => (
                  <button
                    key={email.id}
                    type="button"
                    onClick={() => setSelectedEmailId(email.id)}
                    className={`w-full rounded-2xl border p-3 text-right transition ${
                      selectedEmail?.id === email.id
                        ? 'border-orange-500/60 bg-orange-500/10'
                        : 'border-slate-700 bg-[#0B0F19] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{email.sender}</span>
                          {email.isUnread && <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />}
                          {isIronShieldProtected(email) && (
                            <span className="rounded-full border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 text-[10px] text-orange-300">
                              protected
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-base font-semibold text-slate-100">{email.subject}</p>
                        <p className="mt-1 text-sm text-slate-400">{email.preview}</p>
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(email.timestamp).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </main>

            <aside className="rounded-3xl border border-cyan-500/10 bg-[#101827] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">تفاصيل البريد</h2>
                {selectedEmail && isIronShieldProtected(selectedEmail) && (
                  <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-1 text-[10px] text-orange-300">
                    Iron Shield
                  </span>
                )}
              </div>

              {selectedEmail ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-700 bg-[#0B0F19] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">From</p>
                    <p className="mt-2 text-lg font-bold">{selectedEmail.sender}</p>
                    <p className="mt-2 text-sm text-slate-400">{selectedEmail.subject}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-[#0B0F19] p-4 text-sm leading-7 text-slate-300">
                    {selectedEmail.body}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => archiveEmail(selectedEmail)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-3 text-sm font-medium text-cyan-300"
                    >
                      <Archive className="h-4 w-4" />
                      أرشفة
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteEmail(selectedEmail)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-3 text-sm font-medium text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-[#111827] p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">سجل النشاط</span>
                      <span className="text-cyan-300">Healthy</span>
                    </div>
                    <div className="mt-3 space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>حالة المزامنة</span>
                        <span>{selectedAccount.syncStatus}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>الحماية</span>
                        <span>{isIronShieldProtected(selectedEmail) ? 'Active' : 'Standard'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>الأرشفة التلقائية</span>
                        <span>{state.settings.archiveMode ? 'On' : 'Off'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-400">
                  لا توجد رسائل محددة
                </div>
              )}
            </aside>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-cyan-500/20 bg-[#111827] p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Unified Inbox</span>
                <BriefcaseBusiness className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="mt-3 text-3xl font-black text-cyan-400">{unifiedInbox.length}</p>
            </div>
            <div className="rounded-2xl border border-cyan-500/20 bg-[#111827] p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Protected Emails</span>
                <Shield className="h-4 w-4 text-orange-400" />
              </div>
              <p className="mt-3 text-3xl font-black text-orange-400">
                {unifiedInbox.filter((item) => isIronShieldProtected(item)).length}
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-500/20 bg-[#111827] p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Auto Cleanup</span>
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-black text-emerald-400">
                {state.settings.automaticCleaning ? 'On' : 'Off'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppErrorBoundary>
  );
}

export default App;
