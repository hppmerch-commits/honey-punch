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

// 모바일 터치 타깃 최소 44px 확보용
const tapTarget =
  "flex h-11 min-w-11 items-center justify-center gap-1.5 active:opacity-50";

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
      <header className="fixed inset-x-0 top-0 z-40 bg-white pt-[env(safe-area-inset-top)]">
        <div className="relative flex h-14 items-center px-3 sm:h-16 sm:px-6 lg:px-12">
          {/* 좌측: 메뉴 트리거 — 모바일은 아이콘, 데스크톱은 텍스트 */}
          <button
            onClick={() => setOpen(true)}
            aria-label="메뉴 열기"
            className={`${tapTarget} -ml-1 shrink-0 px-2 lg:ml-0 lg:px-0 lg:hover:opacity-60`}
          >
            <span className="hidden text-[15px] tracking-wide lg:inline">
              Honey Punch
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.6"
              className="h-6 w-6 stroke-current lg:hidden"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          {/*
           * 로고. 모바일에서는 flex 흐름 안에서 가운데 정렬하므로 좌우 아이콘과
           * 구조적으로 겹칠 수 없다. lg부터는 마뗑킴처럼 화면 정중앙에 고정한다.
           */}
          <Link
            href="/"
            className="font-logo flex h-11 min-w-0 flex-1 items-center justify-center whitespace-nowrap text-[17px] tracking-[0.06em] active:opacity-50 min-[380px]:text-[19px] min-[380px]:tracking-[0.08em] sm:text-2xl lg:absolute lg:left-1/2 lg:flex-none lg:-translate-x-1/2 lg:text-[27px]"
          >
            Honey Punch
          </Link>

          {/* 우측: 유틸 (데스크톱) */}
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

          {/* 우측: 유틸 (모바일) — 각 44px 터치 영역 */}
          <div className="flex shrink-0 items-center lg:ml-auto lg:hidden">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="검색"
              className={`${tapTarget} px-2`}
            >
              <IconSearch big />
            </button>
            {/* 아주 좁은 화면(<380px)에서는 로고와 겹치므로 숨긴다. 드로어 메뉴에서 접근 가능. */}
            <Link
              href="/wishlist"
              aria-label={`위시리스트${ready && wishlist.length ? ` ${wishlist.length}개` : ""}`}
              className={`${tapTarget} hidden px-2 min-[380px]:flex`}
            >
              <IconHeart big />
              {ready && wishlist.length > 0 && (
                <span className="text-[12px]">{wishlist.length}</span>
              )}
            </Link>
            <Link
              href="/cart"
              aria-label={`장바구니 ${ready ? cartCount : 0}개`}
              className={`${tapTarget} -mr-1 px-2`}
            >
              <IconBag big />
              <span className="text-[12px]">{ready ? cartCount : 0}</span>
            </Link>
          </div>
        </div>

        {/* 검색 바 */}
        {searchOpen && (
          <form
            onSubmit={submitSearch}
            className="flex items-center gap-3 border-t border-neutral-200 px-4 py-3 sm:px-6 lg:px-12"
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="상품명 또는 품번을 입력하세요"
              className="h-11 min-w-0 flex-1 border-b border-neutral-300 text-[16px] outline-none focus:border-black lg:text-[14px]"
            />
            <button
              type="submit"
              className="h-11 shrink-0 px-3 text-[13px] text-neutral-500 active:opacity-50"
            >
              검색
            </button>
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
          className={`absolute inset-y-0 left-0 flex w-[320px] max-w-[85vw] flex-col overflow-y-auto bg-white px-7 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+1.5rem)] transition-transform duration-300 sm:px-9 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setOpen(false)}
            className="-ml-2 mb-8 flex h-11 min-w-11 w-fit items-center px-2 text-sm tracking-wide active:opacity-50"
          >
            Close
          </button>
          <nav className="flex flex-col">
            {MENU.map((m) => (
              <Link
                key={m.label}
                href={m.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center py-2 text-[21px] leading-snug active:opacity-50"
              >
                {m.label}
              </Link>
            ))}
          </nav>
          <div className="mt-10 flex flex-col border-t border-neutral-200 pt-6 text-[14px] text-neutral-500">
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center active:opacity-50"
            >
              Wishlist
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center active:opacity-50"
            >
              Cart
            </Link>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center active:opacity-50"
            >
              Admin
            </Link>
            <span className="flex min-h-11 items-center text-neutral-400">
              한국어 (KRW)
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}

const icon = "stroke-current";

function IconSearch({ big }: { big?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      className={`${icon} ${big ? "h-[21px] w-[21px]" : "h-[15px] w-[15px]"}`}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={`${icon} h-[15px] w-[15px]`}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={`${icon} h-[15px] w-[15px]`}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c1.5-3.2 4.2-5 7.5-5s6 1.8 7.5 5" />
    </svg>
  );
}
function IconHeart({ big }: { big?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      className={`${icon} ${big ? "h-[21px] w-[21px]" : "h-[15px] w-[15px]"}`}
    >
      <path d="M12 20.5C7 16.5 3.5 13.3 3.5 9.6 3.5 7 5.5 5 8 5c1.6 0 3.1.8 4 2.1C12.9 5.8 14.4 5 16 5c2.5 0 4.5 2 4.5 4.6 0 3.7-3.5 6.9-8.5 10.9Z" />
    </svg>
  );
}
function IconBag({ big }: { big?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      className={`${icon} ${big ? "h-[21px] w-[21px]" : "h-[15px] w-[15px]"}`}
    >
      <path d="M5 8h14l-1 13H6L5 8Z" />
      <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
    </svg>
  );
}
