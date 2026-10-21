import React from 'react';
import { CheckCircle2, Bookmark, Heart, Zap, Copy, Sparkles, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'bookmark' | 'success' | 'action' | 'info';
  message: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none space-y-2">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="
              pointer-events-auto
              flex items-center justify-between gap-3
              px-4 py-2.5 rounded-2xl
              bg-[#111813]/95 dark:bg-[#F8F7F2]/95
              text-[#F8F7F2] dark:text-[#111813]
              backdrop-blur-md
              border border-white/20 dark:border-black/10
              shadow-[0_8px_24px_rgba(0,0,0,0.35)]
              animate-fade-in
              transition-all
            "
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'bookmark' ? (
                <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/25 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Bookmark size={14} className="fill-[#D4AF37]" />
                </div>
              ) : toast.type === 'action' ? (
                <div className="w-6 h-6 rounded-lg bg-[#0B5D3B]/40 dark:bg-[#0B5D3B]/20 flex items-center justify-center shrink-0 text-[#34D399] dark:text-[#0B5D3B]">
                  <Sparkles size={14} />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-lg bg-[#0B5D3B]/30 flex items-center justify-center shrink-0 text-[#34D399]">
                  <CheckCircle2 size={14} />
                </div>
              )}
              <span className="text-xs font-bold truncate">{toast.message}</span>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-full hover:bg-white/10 dark:hover:bg-black/10 text-white/60 dark:text-black/60 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
