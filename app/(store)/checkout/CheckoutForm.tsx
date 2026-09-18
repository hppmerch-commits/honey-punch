"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { won, isSoldOut, type Product } from "@/lib/product-types";
import { isPgMethod, type PaymentMethod } from "@/lib/order-types";
import { shipping } from "@/lib/site";
import { useStore, itemKey } from "@/components/StoreProvider";
import { placeOrderAction, type CheckoutState } from "./actions";
import { openNicepay } from "@/components/nicepay/launch";
import {
  fieldInput,
  fieldLabel,
  btnPrimary,
  btnOutline,
  sectionLabel,
} from "@/lib/ui";

/** pg=true인 수단은 나이스페이먼츠 키가 있을 때만 보여준다. */
const METHOD_OPTIONS: {
  value: PaymentMethod;
  label: string;
  hint: string;
  pg: boolean;
}[] = [
  {
    value: "CARD",
    label: "신용카드",
    hint: "나이스페이먼츠 결제창에서 안전하게 결제됩니다. 결제 즉시 주문이 확정됩니다.",
    pg: true,
  },
  {
    value: "BANK",
    label: "계좌이체",
    hint: "인터넷뱅킹으로 바로 이체합니다. 이체 즉시 주문이 확정됩니다.",
    pg: true,
  },
  {
    value: "VBANK",
    label: "가상계좌",
    hint: "주문 전용 계좌번호를 발급해 드립니다. 3일 안에 입금하시면 자동으로 확인됩니다.",
    pg: true,
  },
  {
    value: "CELLPHONE",
    label: "휴대폰 결제",
    hint: "휴대폰 소액결제로 통신요금과 함께 청구됩니다.",
    pg: true,
  },
  {
    value: "BANK_TRANSFER",
    label: "무통장입금",
    hint: "주문 후 안내드리는 계좌로 입금해 주세요. 입금 확인 후 배송이 시작됩니다.",
    pg: false,
  },
];

export default function CheckoutForm({
  products,
  cardEnabled,
}: {
  products: Product[];
  /** 나이스페이먼츠 키가 설정된 경우에만 PG 결제 수단을 보여준다 */
  cardEnabled: boolean;
}) {
  const { cart, clearCart, ready } = useStore();
  const [method, setMethod] = useState<PaymentMethod>(
    cardEnabled ? "CARD" : "BANK_TRANSFER"
  );
  const [payError, setPayError] = useState<string | null>(null);
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

  // 주문 생성 성공 → 무통장은 완료 페이지로, 카드는 결제창을 띄운다.
  // 카드는 결제가 끝나야 장바구니를 비운다(결제창을 닫아도 다시 시도할 수 있게).
  const completed = useRef(false);
  useEffect(() => {
    if (!state?.ok || completed.current) return;
    completed.current = true;
    if (state.pay) {
      openNicepay(state.pay, (msg) => {
        completed.current = false;
        setPayError(
          `${msg} 주문(${state.orderNumber})은 접수되어 있으니 주문조회에서 다시 결제하실 수 있습니다.`
        );
      }).catch((e: Error) => {
        completed.current = false;
        setPayError(e.message);
      });
      return;
    }
    clearCart();
    router.replace(`/order/${state.orderNumber}`);
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
            className={`mt-6 mx-auto max-w-[240px] ${btnPrimary}`}
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
            <h2 className={sectionLabel}>주문 상품</h2>
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
            <h2 className={sectionLabel}>배송 정보</h2>
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={fieldLabel}>받는 분 *</span>
                  <input
                    name="customerName"
                    required
                    maxLength={50}
                    autoComplete="name"
                    className={fieldInput}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>연락처 *</span>
                  <input
                    name="phone"
                    required
                    inputMode="tel"
                    placeholder="010-0000-0000"
                    autoComplete="tel"
                    className={fieldInput}
                  />
                </label>
              </div>

              <label className="block">
                <span className={fieldLabel}>이메일 (선택)</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={fieldInput}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                <label className="block">
                  <span className={fieldLabel}>우편번호</span>
                  <input
                    name="postcode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    className={fieldInput}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>주소 *</span>
                  <input
                    name="address1"
                    required
                    autoComplete="street-address"
                    className={fieldInput}
                  />
                </label>
              </div>

              <label className="block">
                <span className={fieldLabel}>상세 주소</span>
                <input name="address2" className={fieldInput} />
              </label>

              <label className="block">
                <span className={fieldLabel}>배송 요청사항</span>
                <input
                  name="memo"
                  placeholder="예: 부재 시 문 앞에 놓아주세요"
                  className={fieldInput}
                />
              </label>
            </div>
          </section>

          {/* 결제 수단 */}
          <section className="mt-12">
            <h2 className={sectionLabel}>결제 수단</h2>
            <div className="mt-4 space-y-2">
              {METHOD_OPTIONS.filter((o) => cardEnabled || !o.pg).map((o) => (
                <label
                  key={o.value}
                  className={`flex cursor-pointer items-start gap-3 border px-5 py-4 transition-colors ${
                    method === o.value ? "border-[#1e1e1e]" : "border-neutral-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={o.value}
                    checked={method === o.value}
                    onChange={() => setMethod(o.value)}
                    className="mt-1 h-4 w-4 accent-black"
                  />
                  <span>
                    <span className="block text-[14px]">{o.label}</span>
                    <span className="mt-1 block break-keep text-[12px] leading-relaxed text-neutral-500">
                      {o.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* 결제 요약 */}
        <aside className="mt-12 h-fit border border-neutral-200 p-6 sm:p-7 lg:sticky lg:top-24 lg:mt-0">
          <h2 className={sectionLabel}>ORDER SUMMARY</h2>
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

          {((state && !state.ok) || payError) && (
            <p role="alert" className="mt-4 text-[12px] leading-relaxed text-red-600">
              {payError ?? (state && !state.ok ? state.error : "")}
            </p>
          )}

          <button
            disabled={pending}
            className={`mt-5 ${btnPrimary}`}
          >
            {pending
              ? "주문 처리 중…"
              : isPgMethod(method)
                ? `${won(subtotal + fee)} 결제하기`
                : `${won(subtotal + fee)} 주문하기`}
          </button>
          <Link
            href="/cart"
            className={`mt-3 ${btnOutline}`}
          >
            장바구니로 돌아가기
          </Link>
        </aside>
      </form>
    </main>
  );
}
