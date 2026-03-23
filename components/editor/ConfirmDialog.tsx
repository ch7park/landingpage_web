"use client";

import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

export function ConfirmDialog({
  open,
  title = "확인",
  description,
  confirmLabel = "삭제",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_25px_80px_rgba(0,0,0,0.22)]"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Trash2 className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

