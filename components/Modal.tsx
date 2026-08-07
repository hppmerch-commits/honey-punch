"use client";

import { useEffect } from "react";

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  // ESC로 닫기 + 열려 있는 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
    >
      <div
        className="absolute inset-0 bg-black/40 animate-[fadeIn_.2s_ease-out]"
        onClick={onClose}
      />
      <div className="relative flex max-h-[85dvh] w-full flex-col bg-white sm:max-h-[80dvh] sm:w-[min(680px,92vw)]">
        <header className="flex items-start justify-between border-b border-neutral-200 px-6 py-5 sm:px-9">
          <div>
            <h2 className="text-[19px] leading-tight">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-[11px] text-neutral-400">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="-mr-1 -mt-1 p-1 text-neutral-400 transition-colors hover:text-black"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.4"
              className="h-5 w-5 stroke-current"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="overflow-y-auto px-6 py-7 sm:px-9">{children}</div>

        <footer className="border-t border-neutral-200 px-6 py-4 sm:px-9">
          <button
            onClick={onClose}
            className="h-11 w-full bg-black text-[12px] tracking-[0.1em] text-white transition-opacity hover:opacity-85"
          >
            확인
          </button>
        </footer>
      </div>
    </div>
  );
}
