"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    loginAction,
    undefined
  );

  return (
    <form action={action} className="mt-10">
      <label htmlFor="password" className="text-[13px] text-neutral-500">
        관리자 비밀번호
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoFocus
        autoComplete="current-password"
        className="mt-2 h-12 w-full border border-neutral-300 px-4 text-[14px] outline-none focus:border-black"
      />
      {state?.error && (
        <p className="mt-3 text-[12px] text-red-500">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 h-12 w-full bg-black text-[13px] tracking-[0.1em] text-white transition-opacity active:opacity-70 disabled:opacity-50 lg:hover:opacity-85"
      >
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
