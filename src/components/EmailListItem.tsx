import { Archive, Check, Eye, EyeOff, Shield, Star, Trash2 } from 'lucide-react';
import type { EmailMessage } from '../lib/types';
import { isIronShieldProtected } from '../lib/advancedSecurity';

interface EmailListItemProps {
  email: EmailMessage;
  isSelected: boolean;
  onSelect: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onToggleStar: () => void;
  onToggleRead: () => void;
}

export function EmailListItem({
  email,
  isSelected,
  onSelect,
  onArchive,
  onDelete,
  onToggleStar,
  onToggleRead,
}: EmailListItemProps) {
  const isProtected = isIronShieldProtected(email);
  const hasUnread = email.isUnread && !email.isArchived;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full rounded-2xl border p-4 text-right transition ${
        isSelected ? 'border-orange-500/60 bg-orange-500/10 shadow-lg' : 'border-slate-700 bg-[#0B0F19] hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-bold ${
              hasUnread ? 'text-white' : 'text-slate-400'
            }`}>
              {email.sender}
            </span>
            {hasUnread && <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />}
            {isProtected && (
              <span className="rounded-full border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-300">
                <Shield className="inline h-3 w-3 mr-1" />
                Protected
              </span>
            )}
            {email.isStarred && (
              <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium text-yellow-300">
                <Star className="inline h-3 w-3 mr-1" />
                Starred
              </span>
            )}
          </div>
          <p className={`mt-2 text-base ${
            hasUnread ? 'font-bold text-slate-100' : 'font-semibold text-slate-300'
          }`}>
            {email.subject}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-400">{email.preview}</p>
          <div className="mt-2 flex flex-wrap gap-1 text-xs text-slate-500">
            <span className="rounded-full border border-slate-700 px-2 py-0.5">{email.category}</span>
            <span className="rounded-full border border-slate-700 px-2 py-0.5">{email.priority}</span>
          </div>
        </div>

        <div className="flex flex-shrink-0 flex-col gap-2 text-right text-xs text-slate-500">
          <div>{new Date(email.timestamp).toLocaleDateString('ar-SA')}</div>
          <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleRead();
              }}
              className="rounded-lg border border-slate-700 bg-[#0B0F19] p-1.5 text-slate-400 hover:text-cyan-300"
              title={hasUnread ? 'Mark as read' : 'Mark as unread'}
            >
              {hasUnread ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar();
              }}
              className="rounded-lg border border-slate-700 bg-[#0B0F19] p-1.5 text-slate-400 hover:text-yellow-300"
              title="Toggle star"
            >
              <Star className={`h-4 w-4 ${email.isStarred ? 'fill-current text-yellow-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onArchive();
              }}
              className="rounded-lg border border-slate-700 bg-[#0B0F19] p-1.5 text-slate-400 hover:text-cyan-300"
              title="Archive"
            >
              <Archive className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="rounded-lg border border-slate-700 bg-[#0B0F19] p-1.5 text-slate-400 hover:text-red-400"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </button>
  );
}
