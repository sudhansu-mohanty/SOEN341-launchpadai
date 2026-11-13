"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Check, X, AlertCircle } from "lucide-react";

type ToastKind = "success" | "error";

type Toast = {
  id: number;
  kind: ToastKind;
  message: string;
  action?: { label: string; onClick: () => void };
};

type ShowToast = (toast: Omit<Toast, "id">, durationMs?: number) => void;

const ToastContext = createContext<{ showToast: ShowToast } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback<ShowToast>(
    (toast, durationMs = 6000) => {
      const id = nextId++;
      setToasts((list) => [...list, { ...toast, id }]);
      window.setTimeout(() => dismiss(id), durationMs);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-5 bottom-5 z-[100] grid max-w-[calc(100vw-2.5rem)] gap-3"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.kind === "error" ? "alert" : "status"}
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0a0a0a] py-3 pr-3 pl-4 shadow-lg shadow-black/50 motion-safe:animate-[fade-up_0.35s_var(--ease-out)]"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                t.kind === "success"
                  ? "border-green-500/20 bg-green-500/10 text-green-400"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              {t.kind === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            </span>
            <p className="text-sm tracking-tight text-zinc-200">{t.message}</p>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
                className="rounded-md px-2 py-1 text-sm font-semibold tracking-tight whitespace-nowrap text-white underline-offset-4 transition-colors hover:text-zinc-300 hover:underline"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
              className="rounded-md p-1 text-zinc-600 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}