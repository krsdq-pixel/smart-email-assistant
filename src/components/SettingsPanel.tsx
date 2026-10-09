import { BellRing, Shield, Lock, Zap } from 'lucide-react';
import type { AppSettings } from '../lib/types';

interface SettingsPanelProps {
  settings: AppSettings;
  onToggle: (key: 'automaticCleaning' | 'archiveMode' | 'notifications') => void;
}

export function SettingsPanel({ settings, onToggle }: SettingsPanelProps) {
  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-[#111827] p-4">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">System Settings</h3>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-700 bg-[#0B0F19] p-3 transition hover:bg-slate-800">
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-cyan-400" />
            <div>
              <p className="text-sm font-medium text-white">Auto Cleanup</p>
              <p className="text-xs text-slate-400">Remove low-priority emails</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.automaticCleaning}
            onChange={() => onToggle('automaticCleaning')}
            className="h-4 w-4"
          />
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-700 bg-[#0B0F19] p-3 transition hover:bg-slate-800">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-cyan-400" />
            <div>
              <p className="text-sm font-medium text-white">Archive Mode</p>
              <p className="text-xs text-slate-400">Auto-archive instead of delete</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.archiveMode}
            onChange={() => onToggle('archiveMode')}
            className="h-4 w-4"
          />
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-700 bg-[#0B0F19] p-3 transition hover:bg-slate-800">
          <div className="flex items-center gap-3">
            <BellRing className="h-4 w-4 text-cyan-400" />
            <div>
              <p className="text-sm font-medium text-white">Notifications</p>
              <p className="text-xs text-slate-400">Receive alerts on new mail</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={() => onToggle('notifications')}
            className="h-4 w-4"
          />
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/10 p-3">
        <div className="flex items-start gap-2">
          <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400" />
          <div className="text-xs text-orange-200">
            <p className="font-medium">Iron Shield is always active</p>
            <p className="mt-1 text-orange-100/70">Critical emails are protected from accidental deletion.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
