"use client";

import { useActionState } from "react";
import { lookupOrderAction, type LookupState } from "./actions";

const inputCls =
  "h-12 w-full border border-neutral-300 px-4 text-[14px] outline-none transition-colors focus:border-black";

export default function LookupForm() {
  const [state, formAction, pending] = useActionState<LookupState, FormData>(
    lookupOrderAction,
    undefined
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-[12px] text-neutral-500">
          주문번호 *
        </span>
        <input
          name="orderNumber"
          required
          autoFocus
          placeholder="HP-20260916-XXXX"
          autoComplete="off"
          spellCheck={false}
          className={`${inputCls} uppercase placeholder:normal-case placeholder:text-neutral-300`}
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
          className={`${inputCls} placeholder:text-neutral-300`}
        />
        <span className="mt-1.5 block text-[12px] text-neutral-500">
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

      <button
        disabled={pending}
        className="h-13 w-full bg-black py-4 text-[12px] tracking-[0.1em] text-white transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-50"
      >
        {pending ? "조회 중…" : "주문 조회하기"}
      </button>
    </form>
  );
}
