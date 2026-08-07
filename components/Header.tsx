"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/product-types";
import { useStore } from "./StoreProvider";

const MENU = [
  { label: "New In", href: "/shop" },
  ...CATEGORIES.map((c) => ({ label: c.label, href: `/shop?category=${c.key}` })),
  { label: "Campaign", href: "/campaign" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const { cartCount, wishlist, ready } = useStore();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setSearchOpen(false);
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-white">
        <div className="relative flex h-16 items-center px-6 lg:px-12">
          {/* 좌측: 메뉴 트리거 — 모바일은 아이콘, 데스크톱은 텍스트 */}
          <button
            onClick={() => setOpen(true)}
            aria-label="메뉴 열기"
            className="hover:opacity-60"
          >
            <span className="hidden text-[15px] tracking-wide lg:inline">
              Honey Punch
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              className="h-5 w-5 stroke-current lg:hidden"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          {/* 중앙: 로고 */}
          <Link
            href="/"
            className="font-logo absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[19px] tracking-[0.08em] sm:text-2xl lg:text-[27px]"
          >
            Honey Punch
          </Link>

          {/* 우측: 유틸 */}
          <nav className="ml-auto hidden items-center gap-6 text-[11px] tracking-[0.12em] lg:flex">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="flex items-center gap-1.5 hover:opacity-60"
            >
              <IconSearch />
              SEARCH
            </button>
            <span className="flex items-center gap-1.5 text-neutral-400">
              <IconGlobe />
              한국어 | KRW
            </span>
            <Link href="/admin" className="flex items-center gap-1.5 hover:opacity-60">
              <IconUser />
              ACCOUNT
            </Link>
            <Link href="/wishlist" className="flex items-center gap-1.5 hover:opacity-60">
              <IconHeart />
              WISH{ready && wishlist.length > 0 ? ` ${wishlist.length}` : ""}
            </Link>
            <Link href="/cart" className="flex items-center gap-1.5 hover:opacity-60">
              <IconBag />
              {ready ? cartCount : 0}
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-4 lg:hidden">
            <button onClick={() => setSearchOpen((v) => !v)} aria-label="검색">
              <IconSearch />
            </button>
            <Link href="/cart" className="flex items-center gap-1.5 text-[11px]">
              <IconBag />
              {ready ? cartCount : 0}
            </Link>
          </div>
        </div>

        {/* 검색 바 */}
        {searchOpen && (
          <form
            onSubmit={submitSearch}
            className="border-t border-neutral-200 px-6 py-4 lg:px-12"
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="상품명 또는 품번을 입력하세요"
              className="w-full border-b border-neutral-300 pb-2 text-[14px] outline-none focus:border-black"
            />
          </form>
        )}
      </header>

      {/* 드로어 메뉴 */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
        <aside
          className={`absolute inset-y-0 left-0 w-[320px] max-w-[85vw] bg-white px-9 py-8 transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setOpen(false)}
            className="mb-12 text-sm tracking-wide hover:opacity-60"
          >
            Close
          </button>
          <nav className="flex flex-col gap-5">
            {MENU.map((m) => (
              <Link
                key={m.label}
                href={m.href}
                onClick={() => setOpen(false)}
                className="text-[22px] leading-snug hover:opacity-60"
              >
                {m.label}
              </Link>
            ))}
          </nav>
          <div className="mt-14 flex flex-col gap-3 text-[12px] tracking-[0.08em] text-neutral-500">
            <Link href="/wishlist" onClick={() => setOpen(false)} className="hover:text-black">
              Wishlist
            </Link>
            <Link href="/cart" onClick={() => setOpen(false)} className="hover:text-black">
              Cart
            </Link>
            <Link href="/admin" onClick={() => setOpen(false)} className="hover:text-black">
              Admin
            </Link>
            <span>한국어 (KRW)</span>
          </div>
        </aside>
      </div>
    </>
  );
}

const icon = "h-[15px] w-[15px] stroke-current";

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={icon}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={icon}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={icon}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c1.5-3.2 4.2-5 7.5-5s6 1.8 7.5 5" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={icon}>
      <path d="M12 20.5C7 16.5 3.5 13.3 3.5 9.6 3.5 7 5.5 5 8 5c1.6 0 3.1.8 4 2.1C12.9 5.8 14.4 5 16 5c2.5 0 4.5 2 4.5 4.6 0 3.7-3.5 6.9-8.5 10.9Z" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={icon}>
      <path d="M5 8h14l-1 13H6L5 8Z" />
      <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
    </svg>
  );
}
