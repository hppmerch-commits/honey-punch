"use client";

import { useActionState } from "react";
import { lookupOrderAction, type LookupState } from "./actions";
import {
  fieldInput,
  fieldLabel,
  fieldHint,
  btnPrimary,
} from "@/lib/ui";

export default function LookupForm() {
  const [state, formAction, pending] = useActionState<LookupState, FormData>(
    lookupOrderAction,
    undefined
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <label className="block">
        <span className={fieldLabel}>주문번호 *</span>
        <input
          name="orderNumber"
          required
          autoFocus
          placeholder="HP-20260916-XXXX"
          autoComplete="off"
          spellCheck={false}
          className={`${fieldInput} uppercase placeholder:normal-case`}
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
        <span className={fieldHint}>
          주문하실 때 입력하신 연락처를 그대로 넣어주세요.
        </span>
      </label>

      {/* 실패 사유는 스크린리더에도 즉시 전달한다 */}
      <p role="alert" aria-live="polite" className="min-h-[1px]">
        {state?.error && (
          <span className="block text-[13px] leading-relaxed text-red-600">
            {state.error}
          </span>
        )}
      </p>

      <button disabled={pending} className={btnPrimary}>
        {pending ? "조회 중…" : "주문 조회하기"}
      </button>
    </form>
  );
}
