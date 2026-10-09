import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] p-6 text-white">
      <div className="max-w-lg rounded-2xl border border-red-500/40 bg-[#101826] p-8 text-center shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Application Alert</p>
        <h1 className="mt-4 text-3xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-sm text-slate-300">
          تم اكتشاف خطأ غير متوقع في التطبيق. تم إيقاف التشغيل المؤقت للواجهة لتجنب تعطل النظام.
        </p>
        <pre className="mt-5 overflow-auto rounded-xl bg-slate-950/70 p-4 text-left text-xs text-red-300">
          {error.message}
        </pre>
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="mt-6 rounded-full bg-cyan-500 px-5 py-2.5 font-semibold text-[#081018] transition hover:bg-cyan-400"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
