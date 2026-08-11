"use client";

import { useEffect, useState } from 'react';
import { ArrowRightLine, CloseLine, ShieldCheckLine } from './icons';

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Centered overlay dialog with fade-in backdrop + slide-up-overlay card.
 * Used to demo the @keyframes fade-in-dialog / slide-up-overlay system.
 */
export default function DemoDialog({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    const t = window.setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-[120] ${open ? '' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-950/70 backdrop-blur-sm ${
          open ? 'animate-fade-in-dialog' : 'opacity-0 transition-opacity duration-300'
        }`}
      ></div>

      {/* Card */}
      <div
        className={`absolute left-1/2 top-1/2 w-[92%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 ${
          open ? 'animate-slide-up-overlay' : 'opacity-0'
        }`}
      >
        <div className="relative rounded-[24px] bg-white border border-blue-100 px-7 md:px-10 py-9 md:py-10">
          {/* close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition cursor-pointer"
          >
            <CloseLine className="w-4 h-4" />
          </button>

          <p className="text-[11px] tracking-[0.3em] uppercase text-blue-700 font-mono mb-5">
            <span className="inline-block w-6 h-px bg-blue-700/70 align-middle mr-3"></span>
            Book a demo
          </p>
          <h5
            className="text-[26px] md:text-[28px] leading-[1.2] font-bold text-slate-950 tracking-tight mb-3"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Let&rsquo;s find 20 calm minutes.
          </h5>
          <p className="text-[14px] leading-[1.75] text-slate-600 mb-7">
            Drop your work email and we&rsquo;ll send three time slots tailored to your timezone. No sales decks &mdash; just a quiet walkthrough.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              placeholder="you@yourcompany.com"
              className="flex-1 px-4 py-3 rounded-md border border-blue-100 bg-white text-[15px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-blue-600 text-white text-[14px] font-medium hover:bg-blue-500 transition cursor-pointer whitespace-nowrap"
            >
              <span>Send slots</span>
              <ArrowRightLine className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-slate-400 font-mono">
            <ShieldCheckLine className="w-3.5 h-3.5" />
            <span>No spam &middot; unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}