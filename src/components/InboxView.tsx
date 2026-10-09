import { Inbox, Search, RefreshCcw, Filter, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { EmailMessage } from '../lib/types';
import { filterEmails, sortEmails } from '../lib/emailUtils';
import { EmailListItem } from './EmailListItem';

interface InboxViewProps {
  emails: EmailMessage[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onArchive: (email: EmailMessage) => void;
  onDelete: (email: EmailMessage) => void;
  onToggleStar: (email: EmailMessage) => void;
  onToggleRead: (email: EmailMessage) => void;
  isProcessing: boolean;
  onCleanup: () => void;
}

type FilterType = 'all' | 'unread' | 'starred' | 'protected' | 'archived';
type SortType = 'recent' | 'unread' | 'starred';

export function InboxView({
  emails,
  selectedId,
  onSelect,
  onArchive,
  onDelete,
  onToggleStar,
  onToggleRead,
  isProcessing,
  onCleanup,
}: InboxViewProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('recent');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    let result = filterEmails(emails, filter, () => false);
    if (searchTerm) {
      result = result.filter(
        (email) =>
          email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.preview.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return sortEmails(result, sort);
  }, [emails, filter, sort, searchTerm]);

  return (
    <div className="rounded-3xl border border-cyan-500/10 bg-[#101827]">
      <div className="border-b border-slate-700 p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-cyan-400" />
            <h2 className="text-xl font-bold">الوارد</h2>
            <span className="ml-2 rounded-full bg-slate-700/50 px-2.5 py-1 text-xs font-medium text-slate-300">
              {filtered.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onCleanup}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-[#081018] transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'تنظيف...' : 'تنظيف ذكي'}
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-[#0B0F19] px-4 py-2">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="بحث عن بريد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="rounded-full border border-slate-700 bg-[#0B0F19] px-3 py-2 text-sm text-slate-300 outline-none hover:border-slate-600"
            >
              <option value="all">الكل</option>
              <option value="unread">غير مقروء</option>
              <option value="starred">مميز</option>
              <option value="protected">محمي</option>
              <option value="archived">أرشيف</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="rounded-full border border-slate-700 bg-[#0B0F19] px-3 py-2 text-sm text-slate-300 outline-none hover:border-slate-600"
            >
              <option value="recent">الأحدث</option>
              <option value="unread">غير مقروء أولاً</option>
              <option value="starred">مميز أولاً</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
            <AlertCircle className="mb-3 h-8 w-8 text-slate-500" />
            <p>لا توجد رسائل</p>
            <p className="mt-1 text-xs text-slate-500">حاول تغيير عامل التصفية أو البحث</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                isSelected={selectedId === email.id}
                onSelect={() => onSelect(email.id)}
                onArchive={() => onArchive(email)}
                onDelete={() => onDelete(email)}
                onToggleStar={() => onToggleStar(email)}
                onToggleRead={() => onToggleRead(email)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
