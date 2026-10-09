import { Archive, Trash2, AlertCircle, Shield } from 'lucide-react';
import type { EmailMessage } from '../lib/types';
import { isIronShieldProtected, authorizeDeleteAction, authorizeArchiveAction } from '../lib/advancedSecurity';

interface EmailDetailPanelProps {
  email: EmailMessage | null;
  onArchive: (email: EmailMessage) => void;
  onDelete: (email: EmailMessage) => void;
}

export function EmailDetailPanel({ email, onArchive, onDelete }: EmailDetailPanelProps) {
  if (!email) {
    return (
      <div className="rounded-3xl border border-cyan-500/10 bg-[#101827] p-6">
        <div className="flex h-full items-center justify-center text-center text-slate-400">
          <div>
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-slate-500" />
            <p>No email selected</p>
            <p className="mt-1 text-xs text-slate-500">Choose an email from the inbox to view details</p>
          </div>
        </div>
      </div>
    );
  }

  const isProtected = isIronShieldProtected(email);
  const deleteAuth = authorizeDeleteAction(email);
  const archiveAuth = authorizeArchiveAction(email);

  return (
    <div className="rounded-3xl border border-cyan-500/10 bg-[#101827] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold">Email Details</h2>
        {isProtected && (
          <span className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-300">
            <Shield className="h-3 w-3" />
            Iron Shield Active
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-700 bg-[#0B0F19] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">From</p>
          <p className="mt-2 text-lg font-bold">{email.sender}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Subject</p>
          <p className="mt-2 font-semibold text-slate-100">{email.subject}</p>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-[#0B0F19] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Message</p>
          <p className="mt-3 leading-relaxed text-slate-300">{email.body}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onArchive(email)}
            disabled={!archiveAuth.authorized}
            className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            title={archiveAuth.reason}
          >
            <Archive className="h-4 w-4" />
            Archive
          </button>
          <button
            type="button"
            onClick={() => onDelete(email)}
            disabled={!deleteAuth.authorized}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            title={deleteAuth.reason}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>

        {(!archiveAuth.authorized || !deleteAuth.authorized) && (
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400" />
              <div className="text-sm text-orange-200">
                <p className="font-medium">Iron Shield Protection Active</p>
                <p className="mt-1 text-xs text-orange-100/70">
                  {!archiveAuth.authorized ? archiveAuth.reason : deleteAuth.reason}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-700 bg-[#111827] p-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Category</span>
              <span className="font-medium text-slate-200">{email.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Priority</span>
              <span className={`font-medium ${
                email.priority === 'high' ? 'text-red-400' : email.priority === 'normal' ? 'text-yellow-400' : 'text-slate-400'
              }`}>
                {email.priority}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status</span>
              <span className="font-medium text-slate-200">
                {email.isUnread ? 'Unread' : 'Read'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Archived</span>
              <span className="font-medium text-slate-200">
                {email.isArchived ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
