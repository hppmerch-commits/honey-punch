"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cancelMyOrderAction, type CancelState } from "@/app/(store)/order/[no]/actions";
import { BANKS } from "@/lib/banks";
import { fieldInput, fieldLabel, fieldHint, btnOutline, btnPrimary } from "@/lib/ui";

/**
 * 고객 본인 주문 취소. 연락처를 한 번 더 받아 본인 확인 후 취소한다.
 * 결제가 끝난 주문은 환불까지 자동으로 이어진다 — 가상계좌·계좌이체처럼
 * 현금이 들어온 거래는 돌려보낼 계좌를 함께 받아야 한다.
 */
export default function CancelOrderForm({
  orderNumber,
  isPaid,
  needsRefundAccount,
}: {
  orderNumber: string;
  /** 결제가 끝난 주문이면 "환불"이라는 말을 분명히 쓴다 */
  isPaid: boolean;
  /** 현금성 결제(가상계좌·계좌이체) 입금 완료 — 환불계좌가 있어야 처리된다 */
  needsRefundAccount: boolean;
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
        {isPaid ? "주문 취소 · 환불 요청" : "주문 취소"}
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-3 border border-neutral-200 p-5">
      <input type="hidden" name="orderNumber" value={orderNumber} />
      <p className="text-[13px] tracking-[0.08em]">
        {isPaid ? "주문 취소 · 환불" : "주문 취소"}
      </p>
      <p className="mt-2 break-keep text-[13px] leading-relaxed text-neutral-600">
        {needsRefundAccount
          ? "입금하신 금액을 돌려드릴 계좌가 필요합니다. 아래 계좌로 영업일 기준 1~3일 안에 환불됩니다."
          : isPaid
            ? "취소하면 결제하신 수단으로 전액 환불됩니다. 카드사·통신사에 따라 영업일 기준 1~5일 뒤 취소 내역이 표시됩니다."
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

      {needsRefundAccount && (
        <div className="mt-6 space-y-5 border-t border-neutral-200 pt-5">
          <p className={fieldLabel}>환불받으실 계좌</p>
          <label className="block">
            <span className={fieldLabel}>은행 *</span>
            <select name="refundBankCode" required defaultValue="" className={fieldInput}>
              <option value="" disabled>
                은행을 선택해 주세요
              </option>
              {BANKS.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={fieldLabel}>계좌번호 *</span>
            <input
              name="refundAccount"
              required
              inputMode="numeric"
              placeholder="'-' 없이 숫자만"
              className={fieldInput}
            />
          </label>
          <label className="block">
            <span className={fieldLabel}>예금주 *</span>
            <input name="refundHolder" required maxLength={20} className={fieldInput} />
            <span className={fieldHint}>
              예금주가 다르면 은행에서 입금이 거절될 수 있습니다.
            </span>
          </label>
        </div>
      )}

      <p role="alert" aria-live="polite" className="min-h-[1px]">
        {state && !state.ok && (
          <span className="mt-3 block text-[12px] leading-relaxed text-red-600">
            {state.error}
          </span>
        )}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "처리 중…" : isPaid ? "취소하고 환불받기" : "주문 취소하기"}
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
