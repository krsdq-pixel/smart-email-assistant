export const appPalette = {
  charcoal: '#0B0F19',
  cyan: '#00E5FF',
  orange: '#FF9100',
  panel: '#111827',
  panelSoft: '#182131',
};

export function formatRelativeTime(value: string): string {
  const now = Date.now();
  const stamp = new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.round((now - stamp) / 60000));

  if (diffMinutes < 60) return `${diffMinutes} دقيقة`; 
  if (diffMinutes < 1440) return `${Math.round(diffMinutes / 60)} ساعة`; 
  return `${Math.round(diffMinutes / 1440)} يوم`; 
}
