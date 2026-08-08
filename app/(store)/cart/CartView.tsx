"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { won, isSoldOut, type Product } from "@/lib/product-types";
import { useStore, itemKey } from "@/components/StoreProvider";

const FREE_SHIPPING_FROM = 70000;
const SHIPPING_FEE = 3000;

export default function CartView({ products }: { products: Product[] }) {
  const { cart, updateQty, removeFromCart, clearCart, ready } = useStore();

  const bySlug = useMemo(
    () => new Map(products.map((p) => [p.slug, p])),
    [products]
  );

  // 판매중인 상품만 남기고, 이름·가격·이미지는 DB 값을 기준으로 표시한다.
  const items = useMemo(
    () =>
      cart
        .map((item) => {
          const p = bySlug.get(item.slug);
          if (!p || isSoldOut(p)) return null;
          return { ...item, name: p.name, price: p.price, image: p.image };
        })
        .filter((v): v is NonNullable<typeof v> => v !== null),
    [cart, bySlug]
  );

  // 더 이상 살 수 없는 상품은 장바구니에서 자동으로 뺀다.
  useEffect(() => {
    if (!ready) return;
    for (const item of cart) {
      const p = bySlug.get(item.slug);
      if (!p || isSoldOut(p)) removeFromCart(itemKey(item));
    }
  }, [ready, cart, bySlug, removeFromCart]);

  const cartTotal = items.reduce((n, i) => n + i.price * i.qty, 0);

  if (!ready) {
    return (
      <main className="px-6 py-16 lg:px-12">
        <h1 className="text-[26px]">장바구니</h1>
        <p className="mt-10 text-[13px] text-neutral-400">불러오는 중…</p>
      </main>
    );
  }

  const shipping =
    items.length === 0 || cartTotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;

  return (
    <main className="px-6 py-14 lg:px-12">
      <div className="flex items-end justify-between">
        <h1 className="text-[26px] leading-none lg:text-[30px]">장바구니</h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="-mr-2 flex h-11 items-center px-2 text-[13px] text-neutral-400 active:opacity-50 lg:hover:text-black"
          >
            전체 비우기
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-16 border border-dashed border-neutral-200 py-24 text-center">
          <p className="text-[13px] text-neutral-400">장바구니가 비어 있습니다.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-11 items-center bg-black px-8 text-[12px] tracking-[0.1em] text-white transition-opacity hover:opacity-85"
          >
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="mt-10 gap-12 lg:grid lg:grid-cols-[1fr_320px]">
          {/* 상품 목록 */}
          <ul className="border-t border-neutral-200">
            {items.map((item) => {
              const key = itemKey(item);
              return (
                <li
                  key={key}
                  className="flex gap-4 border-b border-neutral-100 py-6 sm:gap-5"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative h-28 w-20 shrink-0 overflow-hidden bg-[#f2f1ef] sm:h-32 sm:w-24"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 80px, 96px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex min-h-11 items-center text-[14px] leading-snug active:opacity-50 lg:min-h-0 lg:text-[13px] lg:hover:underline"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(key)}
                        aria-label="상품 삭제"
                        className="-mr-3 flex h-11 min-w-11 shrink-0 items-center justify-center text-[13px] text-neutral-400 active:opacity-50 lg:hover:text-black"
                      >
                        삭제
                      </button>
                    </div>
                    <p className="mt-1.5 text-[12px] text-neutral-400">
                      {[item.color, item.size].filter(Boolean).join(" / ")}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-4">
                      <div className="flex items-center border border-neutral-300">
                        <button
                          aria-label="수량 감소"
                          onClick={() => updateQty(key, item.qty - 1)}
                          className="h-11 w-11 text-[16px] active:bg-neutral-100 lg:hover:bg-neutral-50"
                        >
                          −
                        </button>
                        <span className="w-9 text-center text-[14px]">
                          {item.qty}
                        </span>
                        <button
                          aria-label="수량 증가"
                          onClick={() => updateQty(key, item.qty + 1)}
                          className="h-11 w-11 text-[16px] active:bg-neutral-100 lg:hover:bg-neutral-50"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-[14px] font-medium">
                        {won(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* 결제 요약 */}
          <aside className="mt-10 h-fit border border-neutral-200 p-6 sm:p-7 lg:sticky lg:top-24 lg:mt-0">
            <h2 className="text-[13px] tracking-[0.12em]">ORDER SUMMARY</h2>
            <dl className="mt-6 space-y-3 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-neutral-500">상품 금액</dt>
                <dd>{won(cartTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">배송비</dt>
                <dd>{shipping === 0 ? "무료" : won(shipping)}</dd>
              </div>
            </dl>
            {shipping > 0 && (
              <p className="mt-3 text-[11px] text-neutral-400">
                {won(FREE_SHIPPING_FROM - cartTotal)}원 더 담으면 무료배송입니다.
              </p>
            )}
            <div className="mt-6 flex items-baseline justify-between border-t border-neutral-200 pt-5">
              <span className="text-[13px]">결제 예정 금액</span>
              <span className="text-[22px] font-bold">
                {won(cartTotal + shipping)}
              </span>
            </div>

            <button
              disabled
              title="결제 연동 준비 중입니다"
              className="mt-7 h-13 w-full cursor-not-allowed bg-neutral-200 py-4 text-[12px] tracking-[0.1em] text-neutral-500"
            >
              주문하기 (결제 연동 예정)
            </button>
            <Link
              href="/shop"
              className="mt-3 flex h-12 w-full items-center justify-center border border-neutral-300 text-[12px] tracking-[0.1em] transition-colors hover:border-black"
            >
              계속 쇼핑하기
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
