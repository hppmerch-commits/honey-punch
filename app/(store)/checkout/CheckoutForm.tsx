"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { won, isSoldOut, type Product } from "@/lib/product-types";
import { shipping } from "@/lib/site";
import { useStore, itemKey } from "@/components/StoreProvider";
import { placeOrderAction, type CheckoutState } from "./actions";

const inputCls =
  "h-12 w-full border border-neutral-300 px-4 text-[14px] outline-none transition-colors focus:border-black";

export default function CheckoutForm({ products }: { products: Product[] }) {
  const { cart, clearCart, ready } = useStore();
  const router = useRouter();
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(
    placeOrderAction,
    undefined
  );

  const bySlug = useMemo(
    () => new Map(products.map((p) => [p.slug, p])),
    [products]
  );

  // 판매중인 상품만, 가격·이름은 DB 값 기준으로
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

  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const fee = items.length === 0 || subtotal >= shipping.freeFrom ? 0 : shipping.fee;

  // 주문 성공 → 장바구니 비우고 완료 페이지로
  const completed = useRef(false);
  useEffect(() => {
    if (state?.ok && !completed.current) {
      completed.current = true;
      clearCart();
      router.replace(`/order/${state.orderNumber}`);
    }
  }, [state, clearCart, router]);

  if (!ready) {
    return (
      <main className="px-6 py-16 lg:px-12">
        <h1 className="text-[26px]">주문/결제</h1>
        <p className="mt-10 text-[13px] text-neutral-400">불러오는 중…</p>
      </main>
    );
  }

  if (items.length === 0 && !state?.ok) {
    return (
      <main className="px-6 py-16 lg:px-12">
        <h1 className="text-[26px] leading-none lg:text-[30px]">주문/결제</h1>
        <div className="mt-16 border border-dashed border-neutral-200 py-24 text-center">
          <p className="text-[13px] text-neutral-400">주문할 상품이 없습니다.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-11 items-center bg-black px-8 text-[12px] tracking-[0.1em] text-white transition-opacity hover:opacity-85"
          >
            쇼핑하러 가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-14 lg:px-12">
      <h1 className="text-[26px] leading-none lg:text-[30px]">주문/결제</h1>

      <form
        action={formAction}
        className="mt-10 gap-12 lg:grid lg:grid-cols-[1fr_360px]"
      >
        <input
          type="hidden"
          name="items"
          value={JSON.stringify(
            items.map((i) => ({
              slug: i.slug,
              size: i.size,
              color: i.color,
              qty: i.qty,
            }))
          )}
        />

        <div>
          {/* 주문 상품 */}
          <section>
            <h2 className="text-[13px] tracking-[0.12em]">주문 상품</h2>
            <ul className="mt-4 border-t border-neutral-200">
              {items.map((item) => (
                <li
                  key={itemKey(item)}
                  className="flex gap-4 border-b border-neutral-100 py-5"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#f2f1ef]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug">{item.name}</p>
                    <p className="mt-1 text-[12px] text-neutral-400">
                      {[item.color, item.size].filter(Boolean).join(" / ")} ·{" "}
                      {item.qty}개
                    </p>
                  </div>
                  <span className="shrink-0 text-[13px] font-medium">
                    {won(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* 배송 정보 */}
          <section className="mt-12">
            <h2 className="text-[13px] tracking-[0.12em]">배송 정보</h2>
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] text-neutral-500">
                    받는 분 *
                  </span>
                  <input
                    name="customerName"
                    required
                    maxLength={50}
                    autoComplete="name"
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] text-neutral-500">
                    연락처 *
                  </span>
                  <input
                    name="phone"
                    required
                    inputMode="tel"
                    placeholder="010-0000-0000"
                    autoComplete="tel"
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[12px] text-neutral-500">
                  이메일 (선택)
                </span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={inputCls}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] text-neutral-500">
                    우편번호
                  </span>
                  <input
                    name="postcode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] text-neutral-500">
                    주소 *
                  </span>
                  <input
                    name="address1"
                    required
                    autoComplete="street-address"
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[12px] text-neutral-500">
                  상세 주소
                </span>
                <input name="address2" className={inputCls} />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[12px] text-neutral-500">
                  배송 요청사항
                </span>
                <input
                  name="memo"
                  placeholder="예: 부재 시 문 앞에 놓아주세요"
                  className={inputCls}
                />
              </label>
            </div>
          </section>

          {/* 결제 수단 */}
          <section className="mt-12">
            <h2 className="text-[13px] tracking-[0.12em]">결제 수단</h2>
            <div className="mt-4 border border-black px-5 py-4">
              <p className="text-[14px]">무통장입금</p>
              <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">
                주문 후 입금 계좌를 안내드립니다. 입금 확인 후 배송이
                시작됩니다.
              </p>
            </div>
          </section>
        </div>

        {/* 결제 요약 */}
        <aside className="mt-12 h-fit border border-neutral-200 p-6 sm:p-7 lg:sticky lg:top-24 lg:mt-0">
          <h2 className="text-[13px] tracking-[0.12em]">ORDER SUMMARY</h2>
          <dl className="mt-6 space-y-3 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-neutral-500">상품 금액</dt>
              <dd>{won(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">배송비</dt>
              <dd>{fee === 0 ? "무료" : won(fee)}</dd>
            </div>
          </dl>
          <div className="mt-6 flex items-baseline justify-between border-t border-neutral-200 pt-5">
            <span className="text-[13px]">결제 금액</span>
            <span className="text-[22px] font-bold">{won(subtotal + fee)}</span>
          </div>

          <label className="mt-6 flex min-h-11 cursor-pointer items-start gap-2.5 text-[12px] leading-relaxed text-neutral-600">
            <input
              type="checkbox"
              name="agree"
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-black"
            />
            주문 내용과 결제 금액을 확인했으며, 결제 진행에 동의합니다.
          </label>

          {state && !state.ok && (
            <p role="alert" className="mt-4 text-[12px] leading-relaxed text-red-600">
              {state.error}
            </p>
          )}

          <button
            disabled={pending}
            className="mt-5 h-13 w-full bg-black py-4 text-[12px] tracking-[0.1em] text-white transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-50"
          >
            {pending ? "주문 처리 중…" : `${won(subtotal + fee)} 주문하기`}
          </button>
          <Link
            href="/cart"
            className="mt-3 flex h-12 w-full items-center justify-center border border-neutral-300 text-[12px] tracking-[0.1em] transition-colors hover:border-black"
          >
            장바구니로 돌아가기
          </Link>
        </aside>
      </form>
    </main>
  );
}
