"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cancelMyOrderAction, type CancelState } from "@/app/(store)/order/[no]/actions";
import { fieldInput, fieldLabel, fieldHint, btnOutline, btnPrimary } from "@/lib/ui";

/**
 * 고객 본인 주문 취소. 연락처를 한 번 더 받아 본인 확인 후 취소한다.
 * 카드 결제 완료 건은 환불까지 자동으로 이어진다.
 */
export default function CancelOrderForm({
  orderNumber,
  isCardPaid,
}: {
  orderNumber: string;
  /** 카드 결제 완료 상태면 "환불"이라는 말을 분명히 쓴다 */
  isCardPaid: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<CancelState, FormData>(
    cancelMyOrderAction,
    undefined
  );
  const router = useRouter();

  // 취소 성공 → 서버 상태를 다시 읽어 "취소된 주문입니다" 화면으로
  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  if (state?.ok) return null;

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={`mt-3 ${btnOutline}`}>
        {isCardPaid ? "주문 취소 · 환불 요청" : "주문 취소"}
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-3 border border-neutral-200 p-5">
      <input type="hidden" name="orderNumber" value={orderNumber} />
      <p className="text-[13px] tracking-[0.08em]">
        {isCardPaid ? "주문 취소 · 환불" : "주문 취소"}
      </p>
      <p className="mt-2 break-keep text-[13px] leading-relaxed text-neutral-600">
        {isCardPaid
          ? "취소하면 결제하신 카드로 전액 환불됩니다. 카드사에 따라 영업일 기준 1~5일 뒤 취소 내역이 표시됩니다."
          : "취소하면 주문이 바로 종료되고 되돌릴 수 없습니다."}
      </p>

      <label className="mt-5 block">
        <span className={fieldLabel}>본인 확인 — 주문 시 연락처 *</span>
        <input
          name="phone"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="010-0000-0000"
          className={fieldInput}
        />
        <span className={fieldHint}>주문하실 때 입력한 연락처와 같아야 취소됩니다.</span>
      </label>

      <p role="alert" aria-live="polite" className="min-h-[1px]">
        {state && !state.ok && (
          <span className="mt-3 block text-[12px] leading-relaxed text-red-600">
            {state.error}
          </span>
        )}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "처리 중…" : isCardPaid ? "취소하고 환불받기" : "주문 취소하기"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={pending}
          className={btnOutline}
        >
          돌아가기
        </button>
      </div>
    </form>
  );
}
